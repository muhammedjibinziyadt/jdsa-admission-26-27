ALTER TABLE public.quiz_settings
  ADD COLUMN IF NOT EXISTS subtitle_ml text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS subtitle_en text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS description_ml text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS description_en text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS organizer text NOT NULL DEFAULT 'Jawharathul Uloom Suffa Dars Students Association',
  ADD COLUMN IF NOT EXISTS event_date_label text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS banner_url text,
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS theme text NOT NULL DEFAULT 'independence',
  ADD COLUMN IF NOT EXISTS instructions_ml text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS instructions_en text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS results_message_ml text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS results_message_en text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS show_countdown boolean NOT NULL DEFAULT true;

ALTER TABLE public.quiz_questions
  ADD COLUMN IF NOT EXISTS explanation text;