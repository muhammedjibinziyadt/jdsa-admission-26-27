
-- Finances
CREATE TABLE public.committee_finances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  type text NOT NULL CHECK (type IN ('income','expense')),
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.committee_finances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read finances" ON public.committee_finances FOR SELECT USING (true);
CREATE POLICY "Anyone can insert finances" ON public.committee_finances FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update finances" ON public.committee_finances FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete finances" ON public.committee_finances FOR DELETE USING (true);

-- Items
CREATE TABLE public.committee_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  photo_url text,
  quantity integer,
  notes text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.committee_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read items" ON public.committee_items FOR SELECT USING (true);
CREATE POLICY "Anyone can insert items" ON public.committee_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update items" ON public.committee_items FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete items" ON public.committee_items FOR DELETE USING (true);

-- Settings (singleton)
CREATE TABLE public.committee_settings (
  id text PRIMARY KEY DEFAULT 'global',
  group_photo_url text,
  constitution_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.committee_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read committee settings" ON public.committee_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert committee settings" ON public.committee_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update committee settings" ON public.committee_settings FOR UPDATE USING (true);

INSERT INTO public.committee_settings (id) VALUES ('global') ON CONFLICT DO NOTHING;

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('committee', 'committee', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read committee" ON storage.objects FOR SELECT USING (bucket_id = 'committee');
CREATE POLICY "Anyone can upload committee" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'committee');
CREATE POLICY "Anyone can update committee" ON storage.objects FOR UPDATE USING (bucket_id = 'committee');
CREATE POLICY "Anyone can delete committee" ON storage.objects FOR DELETE USING (bucket_id = 'committee');
