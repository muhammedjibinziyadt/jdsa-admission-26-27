-- Master committees table (passwords + scores)
CREATE TABLE public.committees (
  id text PRIMARY KEY,
  name text NOT NULL,
  password text NOT NULL DEFAULT 'committee2025',
  score integer DEFAULT 0,
  max_score integer DEFAULT 100,
  remark text,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.committees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read committees" ON public.committees FOR SELECT USING (true);
CREATE POLICY "Anyone can update committees" ON public.committees FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert committees" ON public.committees FOR INSERT WITH CHECK (true);

-- Seed 4 committees
INSERT INTO public.committees (id, name, password) VALUES
  ('central', 'സെൻട്രൽ കമ്മിറ്റി', 'central2025'),
  ('jawahir', 'അൽ ജവാഹിർ കമ്മിറ്റി', 'jawahir2025'),
  ('samaja', 'സമാജ കമ്മിറ്റി', 'samaja2025'),
  ('library', 'ലൈബ്രറി കമ്മിറ്റി', 'library2025');

-- =========== CENTRAL COMMITTEE ===========
CREATE TABLE public.central_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text,
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.central_item_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_name text NOT NULL,
  used_by text,
  quantity integer DEFAULT 1,
  notes text,
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.central_minutes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_date date NOT NULL DEFAULT CURRENT_DATE,
  notes text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- =========== AL JAWAHIR COMMITTEE ===========
CREATE TABLE public.jawahir_magazines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  pdf_url text NOT NULL,
  cover_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.jawahir_initiatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.jawahir_contributors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name text NOT NULL,
  details text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- =========== SAMAJA COMMITTEE ===========
CREATE TABLE public.samaja_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caption text,
  photo_url text NOT NULL,
  week_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.samaja_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  booked_by text,
  booking_date date NOT NULL DEFAULT CURRENT_DATE,
  details text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.samaja_initiatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.samaja_awards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  winner_name text NOT NULL,
  award_title text NOT NULL,
  award_month text NOT NULL,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- =========== LIBRARY COMMITTEE ===========
CREATE TABLE public.library_books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  author text,
  photo_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.library_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.library_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name text NOT NULL,
  activity_title text NOT NULL,
  details text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS + policies for ALL committee content tables
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN
    SELECT unnest(ARRAY[
      'central_updates','central_item_usage','central_minutes',
      'jawahir_magazines','jawahir_initiatives','jawahir_contributors',
      'samaja_photos','samaja_bookings','samaja_initiatives','samaja_awards',
      'library_books','library_programs','library_activities'
    ])
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('CREATE POLICY "Public read %I" ON public.%I FOR SELECT USING (true);', t, t);
    EXECUTE format('CREATE POLICY "Public insert %I" ON public.%I FOR INSERT WITH CHECK (true);', t, t);
    EXECUTE format('CREATE POLICY "Public update %I" ON public.%I FOR UPDATE USING (true);', t, t);
    EXECUTE format('CREATE POLICY "Public delete %I" ON public.%I FOR DELETE USING (true);', t, t);
  END LOOP;
END $$;

-- Storage buckets for committee media
INSERT INTO storage.buckets (id, name, public) VALUES
  ('jawahir', 'jawahir', true),
  ('samaja', 'samaja', true),
  ('library', 'library', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read jawahir" ON storage.objects FOR SELECT USING (bucket_id = 'jawahir');
CREATE POLICY "Public upload jawahir" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'jawahir');
CREATE POLICY "Public update jawahir" ON storage.objects FOR UPDATE USING (bucket_id = 'jawahir');
CREATE POLICY "Public delete jawahir" ON storage.objects FOR DELETE USING (bucket_id = 'jawahir');

CREATE POLICY "Public read samaja" ON storage.objects FOR SELECT USING (bucket_id = 'samaja');
CREATE POLICY "Public upload samaja" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'samaja');
CREATE POLICY "Public update samaja" ON storage.objects FOR UPDATE USING (bucket_id = 'samaja');
CREATE POLICY "Public delete samaja" ON storage.objects FOR DELETE USING (bucket_id = 'samaja');

CREATE POLICY "Public read library" ON storage.objects FOR SELECT USING (bucket_id = 'library');
CREATE POLICY "Public upload library" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'library');
CREATE POLICY "Public update library" ON storage.objects FOR UPDATE USING (bucket_id = 'library');
CREATE POLICY "Public delete library" ON storage.objects FOR DELETE USING (bucket_id = 'library');