-- Add category to books
ALTER TABLE public.library_books ADD COLUMN IF NOT EXISTS category text DEFAULT 'Other';

-- Categories table (admin-managed)
CREATE TABLE IF NOT EXISTS public.library_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.library_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.library_categories TO authenticated;
GRANT ALL ON public.library_categories TO service_role;
ALTER TABLE public.library_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read library_categories" ON public.library_categories FOR SELECT USING (true);
CREATE POLICY "Public insert library_categories" ON public.library_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update library_categories" ON public.library_categories FOR UPDATE USING (true);
CREATE POLICY "Public delete library_categories" ON public.library_categories FOR DELETE USING (true);

-- Seed defaults
INSERT INTO public.library_categories (name, sort_order) VALUES
  ('Islamic Books', 1),
  ('Arabic Books', 2),
  ('Malayalam Books', 3),
  ('English Books', 4),
  ('History', 5),
  ('Literature', 6),
  ('Reference Books', 7),
  ('Other', 99)
ON CONFLICT (name) DO NOTHING;

-- AI Assistant settings
CREATE TABLE IF NOT EXISTS public.ai_assistant_settings (
  id text PRIMARY KEY DEFAULT 'global',
  enabled boolean NOT NULL DEFAULT true,
  welcome_message text NOT NULL DEFAULT 'അസ്സലാമു അലൈക്കും! എങ്ങനെ സഹായിക്കാം?',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ai_assistant_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_assistant_settings TO authenticated;
GRANT ALL ON public.ai_assistant_settings TO service_role;
ALTER TABLE public.ai_assistant_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read ai_assistant_settings" ON public.ai_assistant_settings FOR SELECT USING (true);
CREATE POLICY "Public insert ai_assistant_settings" ON public.ai_assistant_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update ai_assistant_settings" ON public.ai_assistant_settings FOR UPDATE USING (true);
INSERT INTO public.ai_assistant_settings (id) VALUES ('global') ON CONFLICT (id) DO NOTHING;