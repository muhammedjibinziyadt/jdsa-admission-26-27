
CREATE TABLE public.visitor_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address text,
  city text,
  country text,
  page_visited text NOT NULL DEFAULT '/',
  device_type text,
  browser_name text,
  visited_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert visitor logs"
ON public.visitor_logs FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can read visitor logs"
ON public.visitor_logs FOR SELECT
TO public
USING (true);

CREATE INDEX idx_visitor_logs_visited_at ON public.visitor_logs (visited_at DESC);
