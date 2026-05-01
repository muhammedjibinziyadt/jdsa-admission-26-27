-- Fines per committee
CREATE TABLE public.committee_fines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  committee_id TEXT NOT NULL,
  fine_date DATE NOT NULL DEFAULT CURRENT_DATE,
  day_name TEXT,
  person_name TEXT NOT NULL,
  reason TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.committee_fines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read fines" ON public.committee_fines FOR SELECT USING (true);
CREATE POLICY "Public insert fines" ON public.committee_fines FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update fines" ON public.committee_fines FOR UPDATE USING (true);
CREATE POLICY "Public delete fines" ON public.committee_fines FOR DELETE USING (true);

-- Custom dynamic sections per committee
CREATE TABLE public.committee_custom_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  committee_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.committee_custom_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read custom sections" ON public.committee_custom_sections FOR SELECT USING (true);
CREATE POLICY "Public insert custom sections" ON public.committee_custom_sections FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update custom sections" ON public.committee_custom_sections FOR UPDATE USING (true);
CREATE POLICY "Public delete custom sections" ON public.committee_custom_sections FOR DELETE USING (true);

-- Entries inside a custom section (text + optional image + optional pdf)
CREATE TABLE public.committee_custom_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID NOT NULL REFERENCES public.committee_custom_sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  image_url TEXT,
  file_url TEXT,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.committee_custom_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read custom entries" ON public.committee_custom_entries FOR SELECT USING (true);
CREATE POLICY "Public insert custom entries" ON public.committee_custom_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update custom entries" ON public.committee_custom_entries FOR UPDATE USING (true);
CREATE POLICY "Public delete custom entries" ON public.committee_custom_entries FOR DELETE USING (true);

CREATE INDEX idx_committee_fines_committee ON public.committee_fines(committee_id);
CREATE INDEX idx_committee_custom_sections_committee ON public.committee_custom_sections(committee_id);
CREATE INDEX idx_committee_custom_entries_section ON public.committee_custom_entries(section_id);