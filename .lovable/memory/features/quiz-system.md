---
name: Multi Event Quiz Platform
description: Independent quiz events — each with its own settings, questions, usernames, submissions, rankings, theme and public URL
type: feature
---
- Tables: `quiz_events` (one row per competition: slug, name, status draft/active/closed/archived, enabled, is_open, timing, timer, bilingual title/subtitle/description/instructions/results_message/notification, category, organizer, event_date_label, banner_url, logo_url, theme, show_countdown, sort_order). `quiz_questions`, `quiz_students`, `quiz_submissions` all carry `event_id` → fully isolated data per event (no mixing between Samastha Founder's Day, Independence Day, future quizzes).
- Usernames are unique per event; `used` flag enforces one-time access per event.
- RPCs are event-scoped: `validate_quiz_username(p_event_id, p_username)`, `submit_quiz(p_event_id, ...)` (SECURITY DEFINER; public execute is intentional for anonymous participants).
- Routes: `/quiz` lists all enabled non-archived events; `/quiz/:slug` runs one event (landing → gate → warning → profile → quiz one-way → done) themed by `quiz_events.theme` from `src/utils/quizThemes.ts`.
- `HomeQuizBell` renders one bell/flip-countdown per live or upcoming event, linking to `/quiz/:slug`.
- Admin tab "ക്വിസ് ഇവന്റ്": event list (create, status change, duplicate incl. questions + usernames reset, delete) → drill into per-event tabs Control / Students / Questions / Results / Leaderboard.
