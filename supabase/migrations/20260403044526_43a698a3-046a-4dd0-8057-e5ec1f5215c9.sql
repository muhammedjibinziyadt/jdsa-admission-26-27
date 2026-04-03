
-- Create students_portal table
CREATE TABLE public.students_portal (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name text NOT NULL,
  father_name text NOT NULL,
  phone1 text NOT NULL,
  phone2 text,
  year_of_admission text NOT NULL,
  previous_madrasa text,
  address text NOT NULL,
  current_education text,
  photo_url text,
  birth_certificate_url text,
  aadhaar_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT unique_phone1 UNIQUE (phone1)
);

-- Enable RLS
ALTER TABLE public.students_portal ENABLE ROW LEVEL SECURITY;

-- Anyone can submit (insert)
CREATE POLICY "Anyone can submit student registration"
ON public.students_portal FOR INSERT
TO public
WITH CHECK (true);

-- Anyone can read (for admin - will use session-based auth)
CREATE POLICY "Anyone can read students"
ON public.students_portal FOR SELECT
TO public
USING (true);

-- Anyone can delete (admin uses session auth)
CREATE POLICY "Anyone can delete students"
ON public.students_portal FOR DELETE
TO public
USING (true);

-- Create storage bucket for student documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('student-documents', 'student-documents', false);

-- Storage policies: anyone can upload
CREATE POLICY "Anyone can upload student documents"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'student-documents');

-- Anyone can read (for admin viewing)
CREATE POLICY "Anyone can view student documents"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'student-documents');

-- Anyone can delete student documents
CREATE POLICY "Anyone can delete student documents"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'student-documents');
