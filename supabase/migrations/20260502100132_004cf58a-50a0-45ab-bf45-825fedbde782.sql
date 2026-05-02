ALTER TABLE public.committee_fines
ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid';

ALTER TABLE public.committee_fines
DROP CONSTRAINT IF EXISTS committee_fines_payment_status_check;

ALTER TABLE public.committee_fines
ADD CONSTRAINT committee_fines_payment_status_check
CHECK (payment_status IN ('paid', 'unpaid'));