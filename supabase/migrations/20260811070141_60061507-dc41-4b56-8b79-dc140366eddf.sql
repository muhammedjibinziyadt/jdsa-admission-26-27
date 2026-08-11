-- 1. Events table
CREATE TABLE public.quiz_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  sort_order integer NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT false,
  is_open boolean NOT NULL DEFAULT false,
  start_at timestamptz,
  end_at timestamptz,
  timer_mode text NOT NULL DEFAULT 'per_question',
  time_limit_seconds integer NOT NULL DEFAULT 60,
  title_ml text NOT NULL DEFAULT '',
  title_en text NOT NULL DEFAULT '',
  subtitle_ml text NOT NULL DEFAULT '',
  subtitle_en text NOT NULL DEFAULT '',
  intro_ml text DEFAULT '',
  intro_en text DEFAULT '',
  description_ml text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  instructions_ml text NOT NULL DEFAULT '',
  instructions_en text NOT NULL DEFAULT '',
  results_message_ml text NOT NULL DEFAULT '',
  results_message_en text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  organizer text NOT NULL DEFAULT '',
  event_date_label text NOT NULL DEFAULT '',
  banner_url text,
  logo_url text,
  theme text NOT NULL DEFAULT 'custom',
  show_countdown boolean NOT NULL DEFAULT true,
  notification_ml text DEFAULT '',
  notification_en text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.quiz_events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_events TO authenticated;
GRANT ALL ON public.quiz_events TO service_role;
ALTER TABLE public.quiz_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quiz_events all" ON public.quiz_events FOR ALL USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$
LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_quiz_events_updated_at BEFORE UPDATE ON public.quiz_events
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Seed the first event from existing settings
INSERT INTO public.quiz_events (
  slug, name, status, enabled, is_open, start_at, end_at, timer_mode, time_limit_seconds,
  title_ml, title_en, subtitle_ml, subtitle_en, intro_ml, intro_en,
  description_ml, description_en, instructions_ml, instructions_en,
  results_message_ml, results_message_en, category, organizer, event_date_label,
  banner_url, logo_url, theme, show_countdown
)
SELECT
  'independence-day', COALESCE(NULLIF(s.title_en, ''), 'Quiz Event'),
  CASE WHEN s.enabled THEN 'active' ELSE 'draft' END,
  s.enabled, s.is_open, s.start_at, s.end_at, s.timer_mode, s.time_limit_seconds,
  s.title_ml, s.title_en, COALESCE(s.subtitle_ml,''), COALESCE(s.subtitle_en,''),
  COALESCE(s.intro_ml,''), COALESCE(s.intro_en,''),
  COALESCE(s.description_ml,''), COALESCE(s.description_en,''),
  COALESCE(s.instructions_ml,''), COALESCE(s.instructions_en,''),
  COALESCE(s.results_message_ml,''), COALESCE(s.results_message_en,''),
  COALESCE(s.category,''), COALESCE(s.organizer,''), COALESCE(s.event_date_label,''),
  s.banner_url, s.logo_url, COALESCE(s.theme,'custom'), s.show_countdown
FROM public.quiz_settings s WHERE s.id = 'global';

-- 3. Scope child tables to events
ALTER TABLE public.quiz_questions ADD COLUMN event_id uuid REFERENCES public.quiz_events(id) ON DELETE CASCADE;
ALTER TABLE public.quiz_students ADD COLUMN event_id uuid REFERENCES public.quiz_events(id) ON DELETE CASCADE;
ALTER TABLE public.quiz_submissions ADD COLUMN event_id uuid REFERENCES public.quiz_events(id) ON DELETE CASCADE;

UPDATE public.quiz_questions SET event_id = (SELECT id FROM public.quiz_events ORDER BY created_at LIMIT 1) WHERE event_id IS NULL;
UPDATE public.quiz_students SET event_id = (SELECT id FROM public.quiz_events ORDER BY created_at LIMIT 1) WHERE event_id IS NULL;
UPDATE public.quiz_submissions SET event_id = (SELECT id FROM public.quiz_events ORDER BY created_at LIMIT 1) WHERE event_id IS NULL;

DELETE FROM public.quiz_questions WHERE event_id IS NULL;
DELETE FROM public.quiz_students WHERE event_id IS NULL;
DELETE FROM public.quiz_submissions WHERE event_id IS NULL;

ALTER TABLE public.quiz_questions ALTER COLUMN event_id SET NOT NULL;
ALTER TABLE public.quiz_students ALTER COLUMN event_id SET NOT NULL;
ALTER TABLE public.quiz_submissions ALTER COLUMN event_id SET NOT NULL;

-- usernames unique per event, not globally
ALTER TABLE public.quiz_students DROP CONSTRAINT IF EXISTS quiz_students_username_key;
CREATE UNIQUE INDEX IF NOT EXISTS quiz_students_event_username_idx ON public.quiz_students (event_id, lower(username));
CREATE INDEX IF NOT EXISTS quiz_questions_event_idx ON public.quiz_questions (event_id, order_index);
CREATE INDEX IF NOT EXISTS quiz_submissions_event_idx ON public.quiz_submissions (event_id, score DESC);

-- 4. Event-scoped RPCs
CREATE OR REPLACE FUNCTION public.validate_quiz_username(p_event_id uuid, p_username text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE st public.quiz_students%ROWTYPE;
BEGIN
  SELECT * INTO st FROM public.quiz_students WHERE event_id = p_event_id AND lower(username) = lower(p_username);
  IF NOT FOUND THEN RETURN jsonb_build_object('valid', false, 'reason', 'not_found'); END IF;
  IF NOT st.enabled THEN RETURN jsonb_build_object('valid', false, 'reason', 'disabled', 'display_name', st.display_name); END IF;
  IF st.used THEN RETURN jsonb_build_object('valid', false, 'reason', 'used', 'display_name', st.display_name); END IF;
  RETURN jsonb_build_object('valid', true, 'display_name', st.display_name);
END;
$$;

CREATE OR REPLACE FUNCTION public.submit_quiz(
  p_event_id uuid, p_username text, p_full_name text, p_mobile text,
  p_address text, p_extra_info text, p_answers jsonb
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  ev public.quiz_events%ROWTYPE;
  st public.quiz_students%ROWTYPE;
  total_q integer := 0;
  correct integer := 0;
  q record;
  ans integer;
  result_id uuid;
BEGIN
  SELECT * INTO ev FROM public.quiz_events WHERE id = p_event_id;
  IF NOT FOUND OR NOT ev.enabled OR NOT ev.is_open OR ev.status = 'archived' THEN
    RAISE EXCEPTION 'Quiz is not open';
  END IF;
  IF ev.start_at IS NOT NULL AND now() < ev.start_at THEN RAISE EXCEPTION 'Quiz has not started'; END IF;
  IF ev.end_at IS NOT NULL AND now() > ev.end_at THEN RAISE EXCEPTION 'Quiz has ended'; END IF;

  SELECT * INTO st FROM public.quiz_students WHERE event_id = p_event_id AND lower(username) = lower(p_username);
  IF NOT FOUND THEN RAISE EXCEPTION 'Invalid username'; END IF;
  IF NOT st.enabled THEN RAISE EXCEPTION 'Username is disabled'; END IF;
  IF st.used THEN RAISE EXCEPTION 'This username has already been used'; END IF;

  FOR q IN SELECT id, correct_index FROM public.quiz_questions WHERE event_id = p_event_id LOOP
    total_q := total_q + 1;
    ans := NULLIF(p_answers->>q.id::text, '')::int;
    IF ans IS NOT NULL AND ans = q.correct_index THEN correct := correct + 1; END IF;
  END LOOP;

  UPDATE public.quiz_students SET used = true, used_at = now() WHERE id = st.id;

  INSERT INTO public.quiz_submissions (event_id, username, full_name, mobile, address, extra_info, answers, score, correct_count, wrong_count, total)
  VALUES (p_event_id, st.username, p_full_name, p_mobile, p_address, p_extra_info, p_answers, correct, correct, total_q - correct, total_q)
  RETURNING id INTO result_id;

  RETURN jsonb_build_object('id', result_id, 'score', correct, 'total', total_q, 'correct', correct, 'wrong', total_q - correct);
END;
$$;

DROP FUNCTION IF EXISTS public.validate_quiz_username(text);
DROP FUNCTION IF EXISTS public.submit_quiz(text, text, text, text, text, jsonb);