ALTER TABLE public.library_book_issues
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'taken',
  ADD COLUMN IF NOT EXISTS return_date date,
  ADD COLUMN IF NOT EXISTS return_time text,
  ADD COLUMN IF NOT EXISTS day_name text;