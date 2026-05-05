-- Individual fines table (separate from committee_fines)
CREATE TABLE public.individual_fines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  person_name text NOT NULL,
  reason text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  fine_date date NOT NULL DEFAULT CURRENT_DATE,
  day_name text,
  payment_status text NOT NULL DEFAULT 'unpaid',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.individual_fines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read individual_fines" ON public.individual_fines FOR SELECT USING (true);
CREATE POLICY "Public insert individual_fines" ON public.individual_fines FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update individual_fines" ON public.individual_fines FOR UPDATE USING (true);
CREATE POLICY "Public delete individual_fines" ON public.individual_fines FOR DELETE USING (true);