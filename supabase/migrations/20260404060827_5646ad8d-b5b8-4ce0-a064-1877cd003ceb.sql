
-- Timetables table
CREATE TABLE public.timetables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('calling', 'typing', 'cleaning')),
  day TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  activity TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read timetables" ON public.timetables FOR SELECT USING (true);
CREATE POLICY "Anyone can insert timetables" ON public.timetables FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update timetables" ON public.timetables FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete timetables" ON public.timetables FOR DELETE USING (true);

-- Books table
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read books" ON public.books FOR SELECT USING (true);
CREATE POLICY "Anyone can insert books" ON public.books FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update books" ON public.books FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete books" ON public.books FOR DELETE USING (true);

-- Book orders table
CREATE TABLE public.book_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
  book_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  payment_screenshot_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.book_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read orders" ON public.book_orders FOR SELECT USING (true);
CREATE POLICY "Anyone can insert orders" ON public.book_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update orders" ON public.book_orders FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete orders" ON public.book_orders FOR DELETE USING (true);

-- Storage bucket for bookstore assets
INSERT INTO storage.buckets (id, name, public) VALUES ('bookstore', 'bookstore', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can read bookstore files" ON storage.objects FOR SELECT USING (bucket_id = 'bookstore');
CREATE POLICY "Anyone can upload bookstore files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'bookstore');
CREATE POLICY "Anyone can delete bookstore files" ON storage.objects FOR DELETE USING (bucket_id = 'bookstore');
