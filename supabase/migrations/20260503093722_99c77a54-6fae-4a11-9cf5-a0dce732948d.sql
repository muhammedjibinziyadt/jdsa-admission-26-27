
-- Photoshop students
CREATE TABLE public.photoshop_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  photo_url TEXT,
  score INTEGER DEFAULT 0,
  remarks TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.photoshop_students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read photoshop_students" ON public.photoshop_students FOR SELECT USING (true);
CREATE POLICY "Public insert photoshop_students" ON public.photoshop_students FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update photoshop_students" ON public.photoshop_students FOR UPDATE USING (true);
CREATE POLICY "Public delete photoshop_students" ON public.photoshop_students FOR DELETE USING (true);

-- Classes (per student)
CREATE TABLE public.photoshop_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.photoshop_students(id) ON DELETE CASCADE,
  class_number INTEGER NOT NULL,
  title TEXT,
  youtube_url TEXT,
  locked BOOLEAN NOT NULL DEFAULT true,
  completed BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, class_number)
);
ALTER TABLE public.photoshop_classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read photoshop_classes" ON public.photoshop_classes FOR SELECT USING (true);
CREATE POLICY "Public insert photoshop_classes" ON public.photoshop_classes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update photoshop_classes" ON public.photoshop_classes FOR UPDATE USING (true);
CREATE POLICY "Public delete photoshop_classes" ON public.photoshop_classes FOR DELETE USING (true);

-- Posters
CREATE TABLE public.photoshop_posters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.photoshop_students(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.photoshop_posters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read photoshop_posters" ON public.photoshop_posters FOR SELECT USING (true);
CREATE POLICY "Public insert photoshop_posters" ON public.photoshop_posters FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update photoshop_posters" ON public.photoshop_posters FOR UPDATE USING (true);
CREATE POLICY "Public delete photoshop_posters" ON public.photoshop_posters FOR DELETE USING (true);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('photoshop', 'photoshop', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read photoshop bucket" ON storage.objects FOR SELECT USING (bucket_id = 'photoshop');
CREATE POLICY "Public upload photoshop bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'photoshop');
CREATE POLICY "Public update photoshop bucket" ON storage.objects FOR UPDATE USING (bucket_id = 'photoshop');
CREATE POLICY "Public delete photoshop bucket" ON storage.objects FOR DELETE USING (bucket_id = 'photoshop');

-- Seed students + 20 classes each
DO $$
DECLARE
  s_id UUID;
  names TEXT[] := ARRAY['Muhammad Jareer','Muhammad Sidan','Muhammad Shereef','Muhammad Jubair','Muhammad Jinshad','Muhammad Shafi K','Salman Faris'];
  i INT;
  n INT;
BEGIN
  FOR i IN 1..array_length(names,1) LOOP
    INSERT INTO public.photoshop_students (name, sort_order) VALUES (names[i], i) RETURNING id INTO s_id;
    FOR n IN 1..20 LOOP
      INSERT INTO public.photoshop_classes (student_id, class_number) VALUES (s_id, n);
    END LOOP;
  END LOOP;
END $$;
