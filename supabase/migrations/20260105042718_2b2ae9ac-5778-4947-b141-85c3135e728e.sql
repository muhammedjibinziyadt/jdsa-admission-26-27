-- Create website_content table for all editable content
CREATE TABLE public.website_content (
  id TEXT PRIMARY KEY,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admissions table for storing admission applications
CREATE TABLE public.admissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  age INTEGER,
  date_of_birth DATE,
  gender TEXT,
  guardian_name TEXT NOT NULL,
  guardian_relation TEXT,
  guardian_phone TEXT NOT NULL,
  guardian_email TEXT,
  address TEXT,
  aadhaar_number TEXT,
  birth_certificate_number TEXT,
  previous_school TEXT,
  tc_number TEXT,
  selected_course TEXT,
  additional_info TEXT,
  status TEXT DEFAULT 'pending',
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on website_content (public read, no write from frontend)
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;

-- Allow public read for website content
CREATE POLICY "Anyone can read website content"
ON public.website_content
FOR SELECT
USING (true);

-- Allow public insert/update for website content (admin will be added later)
CREATE POLICY "Anyone can insert website content"
ON public.website_content
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update website content"
ON public.website_content
FOR UPDATE
USING (true);

-- Enable RLS on admissions
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;

-- Allow public to insert admissions
CREATE POLICY "Anyone can submit admission"
ON public.admissions
FOR INSERT
WITH CHECK (true);

-- Allow public read for admissions (for admin panel - will secure later)
CREATE POLICY "Anyone can read admissions"
ON public.admissions
FOR SELECT
USING (true);

-- Allow update admissions
CREATE POLICY "Anyone can update admissions"
ON public.admissions
FOR UPDATE
USING (true);

-- Enable realtime for admissions
ALTER PUBLICATION supabase_realtime ADD TABLE public.admissions;