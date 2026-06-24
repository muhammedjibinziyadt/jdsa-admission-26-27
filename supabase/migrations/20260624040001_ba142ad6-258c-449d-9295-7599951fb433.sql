
-- Settings (singleton)
CREATE TABLE public.quiz_settings (
  id text PRIMARY KEY DEFAULT 'global',
  enabled boolean NOT NULL DEFAULT false,
  is_open boolean NOT NULL DEFAULT false,
  start_at timestamptz,
  end_at timestamptz,
  timer_mode text NOT NULL DEFAULT 'per_question',
  time_limit_seconds integer NOT NULL DEFAULT 30,
  title_ml text NOT NULL DEFAULT 'സമസ്ത സ്ഥാപകദിന ക്വിസ് മത്സരം',
  title_en text NOT NULL DEFAULT 'Samastha Foundation Day Quiz Competition',
  intro_ml text DEFAULT '',
  intro_en text DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.quiz_settings TO anon, authenticated;
GRANT ALL ON public.quiz_settings TO service_role;
ALTER TABLE public.quiz_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quiz_settings public read" ON public.quiz_settings FOR SELECT USING (true);
CREATE POLICY "quiz_settings service write" ON public.quiz_settings FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
-- Allow anon writes (admin gate is app-level, matching existing admin tables pattern)
CREATE POLICY "quiz_settings anon write" ON public.quiz_settings FOR ALL USING (true) WITH CHECK (true);
INSERT INTO public.quiz_settings (id) VALUES ('global') ON CONFLICT DO NOTHING;

-- Students allow-list
CREATE TABLE public.quiz_students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  display_name text NOT NULL,
  used boolean NOT NULL DEFAULT false,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_students TO anon, authenticated;
GRANT ALL ON public.quiz_students TO service_role;
ALTER TABLE public.quiz_students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quiz_students all" ON public.quiz_students FOR ALL USING (true) WITH CHECK (true);

INSERT INTO public.quiz_students (username, display_name) VALUES
 ('navas','Muhammad Navas'),
 ('jibin','Muhammad Jibin Ziyad'),
 ('anshid','Muhammad Anshid'),
 ('jareer','Muhammad Jareer'),
 ('shimlal','Muhammad Shimlal'),
 ('sidan','Muhammad Sidan'),
 ('sinan','Muhammad Sinan'),
 ('shafip','Muhammad Shafi P'),
 ('ameen','Muhammad Ameen'),
 ('shereef','Muhammad Shereef'),
 ('jubair','Muhammad Jubair'),
 ('afham','Muhammad Afham'),
 ('jinshad','Muhammad Jinshad'),
 ('shafik','Muhammad Shafi K'),
 ('salman','Salman Faris')
ON CONFLICT (username) DO NOTHING;

-- Questions
CREATE TABLE public.quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_index integer NOT NULL DEFAULT 0,
  type text NOT NULL DEFAULT 'mcq',
  question_text text NOT NULL DEFAULT '',
  image_url text,
  audio_url text,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_questions TO anon, authenticated;
GRANT ALL ON public.quiz_questions TO service_role;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quiz_questions all" ON public.quiz_questions FOR ALL USING (true) WITH CHECK (true);

-- Submissions
CREATE TABLE public.quiz_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  full_name text NOT NULL,
  mobile text NOT NULL,
  address text,
  extra_info text,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  score integer NOT NULL DEFAULT 0,
  correct_count integer NOT NULL DEFAULT 0,
  wrong_count integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  submitted_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_submissions TO anon, authenticated;
GRANT ALL ON public.quiz_submissions TO service_role;
ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quiz_submissions all" ON public.quiz_submissions FOR ALL USING (true) WITH CHECK (true);

-- Submit RPC: validates window + username, computes score atomically
CREATE OR REPLACE FUNCTION public.submit_quiz(
  p_username text,
  p_full_name text,
  p_mobile text,
  p_address text,
  p_extra_info text,
  p_answers jsonb
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  s public.quiz_settings%ROWTYPE;
  st public.quiz_students%ROWTYPE;
  total_q integer := 0;
  correct integer := 0;
  q record;
  ans integer;
  result_id uuid;
BEGIN
  SELECT * INTO s FROM public.quiz_settings WHERE id='global';
  IF NOT FOUND OR NOT s.enabled OR NOT s.is_open THEN
    RAISE EXCEPTION 'Quiz is not open';
  END IF;
  IF s.start_at IS NOT NULL AND now() < s.start_at THEN
    RAISE EXCEPTION 'Quiz has not started';
  END IF;
  IF s.end_at IS NOT NULL AND now() > s.end_at THEN
    RAISE EXCEPTION 'Quiz has ended';
  END IF;

  SELECT * INTO st FROM public.quiz_students WHERE username = lower(p_username);
  IF NOT FOUND THEN RAISE EXCEPTION 'Invalid username'; END IF;
  IF st.used THEN RAISE EXCEPTION 'This username has already been used'; END IF;

  FOR q IN SELECT id, correct_index FROM public.quiz_questions LOOP
    total_q := total_q + 1;
    ans := NULLIF(p_answers->>q.id::text, '')::int;
    IF ans IS NOT NULL AND ans = q.correct_index THEN
      correct := correct + 1;
    END IF;
  END LOOP;

  UPDATE public.quiz_students SET used = true, used_at = now() WHERE username = st.username;

  INSERT INTO public.quiz_submissions (username, full_name, mobile, address, extra_info, answers, score, correct_count, wrong_count, total)
  VALUES (st.username, p_full_name, p_mobile, p_address, p_extra_info, p_answers, correct, correct, total_q - correct, total_q)
  RETURNING id INTO result_id;

  RETURN jsonb_build_object('id', result_id, 'score', correct, 'total', total_q, 'correct', correct, 'wrong', total_q - correct);
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_quiz(text, text, text, text, text, jsonb) TO anon, authenticated;

-- Username validation RPC (does not consume the slot)
CREATE OR REPLACE FUNCTION public.validate_quiz_username(p_username text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE st public.quiz_students%ROWTYPE;
BEGIN
  SELECT * INTO st FROM public.quiz_students WHERE username = lower(p_username);
  IF NOT FOUND THEN RETURN jsonb_build_object('valid', false, 'reason', 'not_found'); END IF;
  IF st.used THEN RETURN jsonb_build_object('valid', false, 'reason', 'used', 'display_name', st.display_name); END IF;
  RETURN jsonb_build_object('valid', true, 'display_name', st.display_name);
END;
$$;
GRANT EXECUTE ON FUNCTION public.validate_quiz_username(text) TO anon, authenticated;
