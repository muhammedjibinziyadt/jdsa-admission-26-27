-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for images bucket
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

CREATE POLICY "Anyone can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Anyone can update images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'images');

CREATE POLICY "Anyone can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'images');

-- Add image_url column to admissions table for uploaded photos
ALTER TABLE public.admissions 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT FALSE;

-- Create admin credentials table
CREATE TABLE IF NOT EXISTS public.admin_credentials (
  id TEXT PRIMARY KEY DEFAULT 'admin',
  username TEXT NOT NULL DEFAULT 'admin',
  password_hash TEXT NOT NULL DEFAULT 'jawharathululoom2025',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin_credentials
ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;

-- Allow reading admin credentials for login validation
CREATE POLICY "Anyone can read admin credentials"
ON public.admin_credentials FOR SELECT
USING (true);

-- Insert default admin credentials
INSERT INTO public.admin_credentials (id, username, password_hash)
VALUES ('admin', 'admin', 'jawharathululoom2025')
ON CONFLICT (id) DO NOTHING;