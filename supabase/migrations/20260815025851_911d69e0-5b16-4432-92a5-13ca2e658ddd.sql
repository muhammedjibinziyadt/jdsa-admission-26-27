-- 1. Questions: answer type, option count, accepted answers, per-question timer
ALTER TABLE public.quiz_questions
  ADD COLUMN IF NOT EXISTS answer_type text NOT NULL DEFAULT 'mcq',
  ADD COLUMN IF NOT EXISTS option_count integer NOT NULL DEFAULT 4,
  ADD COLUMN IF NOT EXISTS accepted_answers text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS time_limit_seconds integer;

-- 2. Submissions: photo, text answers, duration, result state
ALTER TABLE public.quiz_submissions
  ADD COLUMN IF NOT EXISTS photo_url text,
  ADD COLUMN IF NOT EXISTS text_answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS duration_seconds integer,
  ADD COLUMN IF NOT EXISTS result_state text NOT NULL DEFAULT 'visible';

ALTER TABLE public.quiz_submissions ALTER COLUMN mobile DROP NOT NULL;

CREATE INDEX IF NOT EXISTS quiz_submissions_event_state_idx
  ON public.quiz_submissions (event_id, result_state);

-- 3. Text answer normalizer
CREATE OR REPLACE FUNCTION public.quiz_normalize_answer(p text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT btrim(regexp_replace(lower(coalesce(p, '')), '[^a-z0-9\u0d00-\u0d7f\u0600-\u06ff]+', ' ', 'g'));
$$;

-- 4. New scoring RPC (supports MCQ + text answers, photo, duration)
DROP FUNCTION IF EXISTS public.submit_quiz(uuid, text, text, text, text, text, jsonb);

CREATE OR REPLACE FUNCTION public.submit_quiz(
  p_event_id uuid,
  p_username text,
  p_full_name text,
  p_answers jsonb,
  p_mobile text DEFAULT NULL,
  p_address text DEFAULT NULL,
  p_extra_info text DEFAULT NULL,
  p_photo_url text DEFAULT NULL,
  p_duration_seconds integer DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  ev public.quiz_events%ROWTYPE;
  st public.quiz_students%ROWTYPE;
  total_q integer := 0;
  correct integer := 0;
  q record;
  raw text;
  ans integer;
  txt_answers jsonb := '{}'::jsonb;
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

  FOR q IN SELECT id, correct_index, answer_type, accepted_answers FROM public.quiz_questions WHERE event_id = p_event_id LOOP
    total_q := total_q + 1;
    raw := NULLIF(btrim(coalesce(p_answers->>q.id::text, '')), '');
    IF q.answer_type = 'text' THEN
      IF raw IS NOT NULL THEN
        txt_answers := txt_answers || jsonb_build_object(q.id::text, raw);
        IF EXISTS (
          SELECT 1 FROM unnest(coalesce(q.accepted_answers, '{}'::text[])) a
          WHERE public.quiz_normalize_answer(a) = public.quiz_normalize_answer(raw)
            AND public.quiz_normalize_answer(a) <> ''
        ) THEN
          correct := correct + 1;
        END IF;
      END IF;
    ELSE
      BEGIN
        ans := raw::int;
      EXCEPTION WHEN others THEN ans := NULL;
      END;
      IF ans IS NOT NULL AND ans = q.correct_index THEN correct := correct + 1; END IF;
    END IF;
  END LOOP;

  UPDATE public.quiz_students SET used = true, used_at = now() WHERE id = st.id;

  INSERT INTO public.quiz_submissions (
    event_id, username, full_name, mobile, address, extra_info, answers, text_answers,
    score, correct_count, wrong_count, total, photo_url, duration_seconds
  ) VALUES (
    p_event_id, st.username, p_full_name, p_mobile, p_address, p_extra_info, p_answers, txt_answers,
    correct, correct, total_q - correct, total_q, p_photo_url, p_duration_seconds
  )
  RETURNING id INTO result_id;

  RETURN jsonb_build_object('id', result_id, 'score', correct, 'total', total_q, 'correct', correct, 'wrong', total_q - correct);
END;
$function$;