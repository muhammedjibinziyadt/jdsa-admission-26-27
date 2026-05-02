-- Central: Fund Book
CREATE TABLE public.central_fund_book (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  person_name text NOT NULL,
  fund_type text NOT NULL DEFAULT 'pending', -- 'paid' | 'pending'
  reason text,
  amount numeric NOT NULL DEFAULT 0,
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.central_fund_book ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read central_fund_book" ON public.central_fund_book FOR SELECT USING (true);
CREATE POLICY "Public insert central_fund_book" ON public.central_fund_book FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update central_fund_book" ON public.central_fund_book FOR UPDATE USING (true);
CREATE POLICY "Public delete central_fund_book" ON public.central_fund_book FOR DELETE USING (true);

-- Central: Report Book
CREATE TABLE public.central_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.central_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read central_reports" ON public.central_reports FOR SELECT USING (true);
CREATE POLICY "Public insert central_reports" ON public.central_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update central_reports" ON public.central_reports FOR UPDATE USING (true);
CREATE POLICY "Public delete central_reports" ON public.central_reports FOR DELETE USING (true);

-- Samaja: Report Book
CREATE TABLE public.samaja_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  attended text,
  absent text,
  speakers text,
  details text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.samaja_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read samaja_reports" ON public.samaja_reports FOR SELECT USING (true);
CREATE POLICY "Public insert samaja_reports" ON public.samaja_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update samaja_reports" ON public.samaja_reports FOR UPDATE USING (true);
CREATE POLICY "Public delete samaja_reports" ON public.samaja_reports FOR DELETE USING (true);

-- Jawahir students (independent list of 15)
CREATE TABLE public.jawahir_students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.jawahir_students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read jawahir_students" ON public.jawahir_students FOR SELECT USING (true);
CREATE POLICY "Public insert jawahir_students" ON public.jawahir_students FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update jawahir_students" ON public.jawahir_students FOR UPDATE USING (true);
CREATE POLICY "Public delete jawahir_students" ON public.jawahir_students FOR DELETE USING (true);

-- Jawahir monthly submissions (one per student per month)
CREATE TABLE public.jawahir_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.jawahir_students(id) ON DELETE CASCADE,
  year_month text NOT NULL, -- e.g. '2026-04'
  submitted boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(student_id, year_month)
);
ALTER TABLE public.jawahir_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read jawahir_submissions" ON public.jawahir_submissions FOR SELECT USING (true);
CREATE POLICY "Public insert jawahir_submissions" ON public.jawahir_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update jawahir_submissions" ON public.jawahir_submissions FOR UPDATE USING (true);
CREATE POLICY "Public delete jawahir_submissions" ON public.jawahir_submissions FOR DELETE USING (true);

-- Library: add status column to existing library_books
ALTER TABLE public.library_books ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'available'; -- 'available' | 'missing'

-- Library: book issue records
CREATE TABLE public.library_book_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name text NOT NULL,
  book_name text NOT NULL,
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  issue_time text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.library_book_issues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read library_book_issues" ON public.library_book_issues FOR SELECT USING (true);
CREATE POLICY "Public insert library_book_issues" ON public.library_book_issues FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update library_book_issues" ON public.library_book_issues FOR UPDATE USING (true);
CREATE POLICY "Public delete library_book_issues" ON public.library_book_issues FOR DELETE USING (true);

-- Seed Jawahir students (15)
INSERT INTO public.jawahir_students (name, sort_order) VALUES
  ('Muhammad Navas', 1),
  ('Muhammad Jibin Ziyad', 2),
  ('Muhammad Anshid', 3),
  ('Muhammad Jareer', 4),
  ('Muhammad Shimlal', 5),
  ('Muhammad Sidan', 6),
  ('Muhammad Sinan', 7),
  ('Muhammad Shafi P', 8),
  ('Muhammad Ameen', 9),
  ('Muhammad Shereef', 10),
  ('Muhammad Jubair', 11),
  ('Muhammad Afham', 12),
  ('Muhammad Ashique', 13),
  ('Muhammad Sahad', 14),
  ('Muhammad Rashid', 15);