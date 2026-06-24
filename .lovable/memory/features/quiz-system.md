---
name: Quiz System
description: Samastha Foundation Day Quiz — admin-controlled, username-based one-time access, timer, scoring, leaderboard, PDF/CSV exports
type: feature
---
- Tables: `quiz_settings` (singleton 'global'), `quiz_students` (allow-list with `used` flag), `quiz_questions` (text/image/audio/mcq + options jsonb + correct_index), `quiz_submissions` (unique username, answers jsonb, score).
- RPCs: `validate_quiz_username(p_username)` and `submit_quiz(...)` (SECURITY DEFINER, checks enabled+open+window+used flag, scores atomically, marks used).
- 15 Dars students pre-seeded with usernames: navas, jibin, anshid, jareer, shimlal, sidan, sinan, shafip, ameen, shereef, jubair, afham, jinshad, shafik, salman.
- Public route: `/quiz` (src/pages/Quiz.tsx). Stages: gate → warning → profile → quiz → done. Bilingual via `useLanguage`.
- AI Assistant hidden when `location.pathname.startsWith('/quiz')` (early return in AIAssistant.tsx).
- Home page floating bell `HomeQuizBell` shows when `enabled && is_open && within start/end window`.
- Admin tab "ക്വിസ് മത്സരം" in `/admin` with sub-tabs: Control, Students, Questions, Results, Leaderboard. PDF/CSV via `src/utils/quizExports.ts`.
- Question media (image + audio) uploaded into existing `images` storage bucket via `useImageUpload` (folders: `quiz`, `quiz-audio`).
- Timer modes: `per_question` (auto-advance on 0) or `whole_quiz` (auto-submit on 0). Quick presets: 30/60/120/180/300/600 + custom.
- One-time enforcement: server `quiz_students.used` flag + unique constraint on `quiz_submissions.username`. Client also writes `localStorage.quiz_done_<username>`.
