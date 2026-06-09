
CREATE TABLE IF NOT EXISTS public.theme_settings (
  id text PRIMARY KEY,
  preset text NOT NULL DEFAULT 'emerald',
  primary_color text NOT NULL DEFAULT '158 64% 22%',
  secondary_color text NOT NULL DEFAULT '42 30% 94%',
  accent_color text NOT NULL DEFAULT '158 20% 95%',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.theme_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.theme_settings TO authenticated;
GRANT ALL ON public.theme_settings TO service_role;
ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "theme read all" ON public.theme_settings FOR SELECT USING (true);
CREATE POLICY "theme write all" ON public.theme_settings FOR ALL USING (true) WITH CHECK (true);
INSERT INTO public.theme_settings (id) VALUES ('global') ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.ai_usage_stats (
  id text PRIMARY KEY,
  total_messages integer NOT NULL DEFAULT 0,
  total_conversations integer NOT NULL DEFAULT 0,
  last_used timestamptz
);
GRANT SELECT ON public.ai_usage_stats TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_usage_stats TO authenticated;
GRANT ALL ON public.ai_usage_stats TO service_role;
ALTER TABLE public.ai_usage_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stats read all" ON public.ai_usage_stats FOR SELECT USING (true);
CREATE POLICY "stats write all" ON public.ai_usage_stats FOR ALL USING (true) WITH CHECK (true);
INSERT INTO public.ai_usage_stats (id) VALUES ('global') ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.increment_ai_usage()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.ai_usage_stats SET total_messages = total_messages + 1, last_used = now() WHERE id = 'global';
$$;
GRANT EXECUTE ON FUNCTION public.increment_ai_usage() TO anon, authenticated;
