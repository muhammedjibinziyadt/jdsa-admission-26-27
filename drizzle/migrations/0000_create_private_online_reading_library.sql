CREATE TABLE public.online_library_books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  cover_path text,
  pdf_path text NOT NULL,
  total_pages integer NOT NULL DEFAULT 1 CHECK (total_pages BETWEEN 1 AND 500),
  publication_date date,
  book_language text NOT NULL DEFAULT 'ml',
  reading_direction text NOT NULL DEFAULT 'ltr' CHECK (reading_direction IN ('ltr', 'rtl')),
  visibility text NOT NULL DEFAULT 'unpublished' CHECK (visibility IN ('published', 'unpublished')),
  page_format text NOT NULL DEFAULT 'original' CHECK (page_format IN ('a4-portrait', 'a4-landscape', 'a5-portrait', 'a5-landscape', 'custom', 'original')),
  custom_page_width numeric,
  custom_page_height numeric,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
REVOKE ALL ON TABLE public.online_library_books FROM anon, authenticated;
GRANT ALL ON TABLE public.online_library_books TO service_role;
ALTER TABLE public.online_library_books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Server functions manage online library books" ON public.online_library_books FOR ALL TO service_role USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

CREATE INDEX online_library_books_published_order_idx ON public.online_library_books (visibility, display_order, created_at DESC);
CREATE INDEX online_library_books_category_idx ON public.online_library_books (category);

CREATE TABLE public.online_library_settings (
  id text PRIMARY KEY DEFAULT 'access',
  password_salt text,
  password_hash text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
REVOKE ALL ON TABLE public.online_library_settings FROM anon, authenticated;
GRANT ALL ON TABLE public.online_library_settings TO service_role;
ALTER TABLE public.online_library_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Server functions manage online library settings" ON public.online_library_settings FOR ALL TO service_role USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Server functions manage private online library files" ON storage.objects FOR ALL TO service_role USING (bucket_id = 'online-library' AND auth.role() = 'service_role') WITH CHECK (bucket_id = 'online-library' AND auth.role() = 'service_role');