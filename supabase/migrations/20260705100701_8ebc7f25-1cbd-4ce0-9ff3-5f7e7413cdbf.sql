
ALTER TABLE public.quiz_students ADD COLUMN IF NOT EXISTS enabled boolean NOT NULL DEFAULT true;

CREATE OR REPLACE FUNCTION public.validate_quiz_username(p_username text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE st public.quiz_students%ROWTYPE;
BEGIN
  SELECT * INTO st FROM public.quiz_students WHERE username = lower(p_username);
  IF NOT FOUND THEN RETURN jsonb_build_object('valid', false, 'reason', 'not_found'); END IF;
  IF NOT st.enabled THEN RETURN jsonb_build_object('valid', false, 'reason', 'disabled', 'display_name', st.display_name); END IF;
  IF st.used THEN RETURN jsonb_build_object('valid', false, 'reason', 'used', 'display_name', st.display_name); END IF;
  RETURN jsonb_build_object('valid', true, 'display_name', st.display_name);
END;
$function$;

CREATE OR REPLACE FUNCTION public.submit_quiz(p_username text, p_full_name text, p_mobile text, p_address text, p_extra_info text, p_answers jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
  IF NOT st.enabled THEN RAISE EXCEPTION 'Username is disabled'; END IF;
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
$function$;
