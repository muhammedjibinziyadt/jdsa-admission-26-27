CREATE TABLE public.committee_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  committee_id text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  priority text NOT NULL DEFAULT 'normal',
  notice_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.committee_notifications TO anon, authenticated;
GRANT ALL ON public.committee_notifications TO service_role;
ALTER TABLE public.committee_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read notifications" ON public.committee_notifications FOR SELECT USING (true);
CREATE POLICY "Public insert notifications" ON public.committee_notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update notifications" ON public.committee_notifications FOR UPDATE USING (true);
CREATE POLICY "Public delete notifications" ON public.committee_notifications FOR DELETE USING (true);
CREATE INDEX idx_committee_notifications_committee ON public.committee_notifications(committee_id, created_at DESC);