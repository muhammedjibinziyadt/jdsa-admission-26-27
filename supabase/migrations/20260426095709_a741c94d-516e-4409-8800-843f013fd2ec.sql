
-- Students master table
CREATE TABLE public.attendance_students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  photo_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.attendance_students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read attendance_students" ON public.attendance_students FOR SELECT USING (true);
CREATE POLICY "Public insert attendance_students" ON public.attendance_students FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update attendance_students" ON public.attendance_students FOR UPDATE USING (true);
CREATE POLICY "Public delete attendance_students" ON public.attendance_students FOR DELETE USING (true);

-- Attendance records
CREATE TABLE public.attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.attendance_students(id) ON DELETE CASCADE,
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'present',
  time_in text,
  time_out text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(student_id, entry_date)
);

ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read attendance_records" ON public.attendance_records FOR SELECT USING (true);
CREATE POLICY "Public insert attendance_records" ON public.attendance_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update attendance_records" ON public.attendance_records FOR UPDATE USING (true);
CREATE POLICY "Public delete attendance_records" ON public.attendance_records FOR DELETE USING (true);

CREATE INDEX idx_attendance_records_student ON public.attendance_records(student_id, entry_date DESC);

-- Leave records
CREATE TABLE public.attendance_leaves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.attendance_students(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  total_days integer NOT NULL DEFAULT 1,
  reason text,
  return_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.attendance_leaves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read attendance_leaves" ON public.attendance_leaves FOR SELECT USING (true);
CREATE POLICY "Public insert attendance_leaves" ON public.attendance_leaves FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update attendance_leaves" ON public.attendance_leaves FOR UPDATE USING (true);
CREATE POLICY "Public delete attendance_leaves" ON public.attendance_leaves FOR DELETE USING (true);

CREATE INDEX idx_attendance_leaves_student ON public.attendance_leaves(student_id, start_date DESC);

-- Storage bucket for student photos
INSERT INTO storage.buckets (id, name, public) VALUES ('attendance', 'attendance', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read attendance bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'attendance');

CREATE POLICY "Public upload attendance bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'attendance');

CREATE POLICY "Public update attendance bucket"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'attendance');

CREATE POLICY "Public delete attendance bucket"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'attendance');

-- Seed 15 initial students
INSERT INTO public.attendance_students (name, sort_order) VALUES
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
  ('Muhammad Jinshad', 13),
  ('Muhammad Shafi K', 14),
  ('Salman Faris', 15);
