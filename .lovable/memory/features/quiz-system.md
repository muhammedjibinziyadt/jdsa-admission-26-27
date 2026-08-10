---
name: Quiz System (Dynamic Event Based)
description: Fully dynamic admin-controlled quiz event system — themes, banner/logo, bilingual copy, username-based one-time access, timer, scoring, leaderboard, PDF/CSV exports
type: feature
---
- Tables: `quiz_settings` (singleton 'global'), `quiz_students` (allow-list, `used` + `enabled` flags), `quiz_questions` (text/image/audio/mcq + options jsonb + correct_index + explanation), `quiz_submissions`.
- `quiz_settings` is fully event-dynamic: title/subtitle/description/instructions/results_message (ML+EN), category, organizer, event_date_label, banner_url, logo_url, theme, show_countdown, timer settings, start/end window.
- Themes live in `src/utils/quizThemes.ts` (`QUIZ_THEMES`): independence (Saffron/White/Green + rotating Ashoka Chakra), samastha, milad, ramadan, islamic_history, arabic, general, custom. Admin picks the theme; `/quiz` styles background, accent band, badge and particles from it.
- Current event: **Independence Day Quiz Competition** (15 August program), theme `independence`.
- RPCs: `validate_quiz_username(p_username)` and `submit_quiz(...)` (SECURITY DEFINER, checks enabled+open+window+used, scores atomically, marks used). Public execute is intentional — anonymous participants.
- Public route `/quiz` (src/pages/Quiz.tsx). Stages: landing (event hero + description + instructions + countdown) → gate → warning → profile (name+mobile only) → quiz (one-way, no Previous button) → done.
- AI Assistant hidden on `/quiz`. Home floating `HomeQuizBell` shows flip countdown when quiz enabled+open within window.
- Admin tab "ക്വിസ് ഇവന്റ്" in `/admin`: Control (status, timing, timer, theme, banner/logo upload, bilingual copy), Students, Questions, Results, Leaderboard. Media uploads to `images` bucket (folders: `quiz`, `quiz-audio`, `quiz-event`).
