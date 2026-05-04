CREATE TABLE IF NOT EXISTS public.portal_settings (
  id text PRIMARY KEY DEFAULT 'students_portal',
  password text NOT NULL DEFAULT 'JDSA9582',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.portal_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read portal_settings" ON public.portal_settings FOR SELECT USING (true);
CREATE POLICY "Public insert portal_settings" ON public.portal_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update portal_settings" ON public.portal_settings FOR UPDATE USING (true) WITH CHECK (true);

INSERT INTO public.portal_settings (id, password) VALUES ('students_portal', 'JDSA9582')
ON CONFLICT (id) DO NOTHING;