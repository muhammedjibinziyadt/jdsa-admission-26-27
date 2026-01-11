-- Create a table for tracking image likes
CREATE TABLE public.gallery_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_id TEXT NOT NULL,
  device_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(image_id, device_id)
);

-- Enable Row Level Security
ALTER TABLE public.gallery_likes ENABLE ROW LEVEL SECURITY;

-- Anyone can read likes (to show count)
CREATE POLICY "Anyone can read gallery likes"
ON public.gallery_likes
FOR SELECT
USING (true);

-- Anyone can insert likes (without login)
CREATE POLICY "Anyone can insert gallery likes"
ON public.gallery_likes
FOR INSERT
WITH CHECK (true);

-- Anyone can delete their own likes (for unlike feature)
CREATE POLICY "Anyone can delete their own likes"
ON public.gallery_likes
FOR DELETE
USING (true);

-- Create index for faster lookups
CREATE INDEX idx_gallery_likes_image_id ON public.gallery_likes(image_id);
CREATE INDEX idx_gallery_likes_device_id ON public.gallery_likes(device_id);