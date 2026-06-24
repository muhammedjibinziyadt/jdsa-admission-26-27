
# Samastha Foundation Day Quiz Competition — Implementation Plan

A complete admin-controlled quiz module for the 15 listed Dars students with one-time access, timer, scoring, and reports.

## 1. Database (new tables in Lovable Cloud)

- `quiz_settings` (singleton row `id='global'`)
  - `enabled` bool, `is_open` bool
  - `start_at`, `end_at` timestamptz (nullable)
  - `timer_mode` text ('per_question' | 'whole_quiz')
  - `time_limit_seconds` int (per Q or whole)
  - `title_ml`, `title_en`, `intro_ml`, `intro_en`

- `quiz_students` (the allow-list of usernames)
  - `username` text unique, `display_name` text
  - `used` bool default false, `used_at` timestamptz

- `quiz_questions`
  - `order_index` int, `type` text ('text'|'image'|'audio'|'mcq')
  - `question_text`, `image_url`, `audio_url`
  - `options` jsonb (array of strings)
  - `correct_index` int

- `quiz_submissions` (one row per username)
  - `username` text unique → quiz_students
  - `full_name`, `mobile`, `address`, `extra_info`
  - `answers` jsonb (`{question_id: chosen_index}`)
  - `score` int, `correct_count` int, `wrong_count` int, `total` int
  - `submitted_at` timestamptz

RLS: public can read `quiz_settings` (enabled/open flags + meta), read questions only when open, validate username via RPC, insert own submission once (unique constraint on username). Admin full access via service_role / admin gate.

A SECURITY DEFINER RPC `submit_quiz(username, profile, answers)` will:
- check `enabled && is_open && now() between start_at,end_at`
- check student exists and `used=false`
- atomically mark `used=true`, compute score, insert submission

Pre-seed the 15 usernames: `navas`, `jibin`, `anshid`, `jareer`, `shimlal`, `sidan`, `sinan`, `shafip`, `ameen`, `shereef`, `jubair`, `afham`, `jinshad`, `shafik`, `salman`.

## 2. Pages & components

```
src/pages/Quiz.tsx                — public quiz route /quiz
src/components/quiz/
  QuizGate.tsx                   — username entry + one-time warning
  QuizProfileForm.tsx            — name/mobile/address/extra
  QuizRunner.tsx                 — renders questions, timer, autosave
  QuizQuestionCard.tsx           — text/image/audio/MCQ renderer
  QuizSubmitSuccess.tsx          — bilingual success message
src/components/HomeQuizBell.tsx  — floating bell on Home when enabled
src/components/admin/QuizAdmin.tsx
  ├─ Control panel (enable/disable, open/close, dates, timer)
  ├─ Student list (CRUD + reset 'used' flag)
  ├─ Question manager (add/edit/delete, upload image/audio to storage)
  ├─ Results table (filter, sort)
  └─ Leaderboard
src/hooks/useQuiz.tsx            — settings + RPCs
src/utils/generateQuizPDF.ts     — per-student + all-results PDF
src/utils/exportQuizCSV.ts       — CSV/Excel export
```

Route added in `App.tsx`: `/quiz`. AI Assistant is rendered globally — wrap it to hide when `location.pathname.startsWith('/quiz')`.

## 3. Home page notification

Add `HomeQuizBell` to `Index.tsx`. Shows only when `quiz_settings.enabled && is_open && within window`. Floating bell (top-right under nav) with pulse animation. Click → tooltip "സമസ്ത ക്വിസ് മത്സരം" → button → navigates to `/quiz`.

## 4. Storage

Reuse `images` bucket for question images. Create `quiz-audio` bucket (public) for audio uploads.

## 5. One-time enforcement

- Client: localStorage `quiz_done_<username>` + UI lock.
- Server (authoritative): unique constraint on `quiz_submissions.username` + RPC checks `quiz_students.used`.

## 6. Timer

- `timer_mode='per_question'`: countdown per card, auto-advance on 0.
- `timer_mode='whole_quiz'`: single countdown, auto-submit at 0.

## 7. Admin reports

Stats card: total participants (used count), submitted, highest, average. Leaderboard sorted desc. Downloads:
- Per-row PDF (jsPDF, bilingual headers via `tx`)
- All results PDF (table)
- CSV via `exportQuizCSV`

## 8. Bilingual

All student-facing strings use `useLanguage().t(M, E)`. Admin remains Malayalam (per existing convention).

## 9. AI exclusion

Move `<AIAssistant />` into a small wrapper that checks `useLocation()` and returns null on `/quiz`.

## 10. Mobile

Tailwind responsive layouts; large tap targets; audio player full-width; sticky timer bar.

## Build order

1. Migration: tables + RLS + RPC + seed 15 students.
2. Create `quiz-audio` storage bucket.
3. Hooks + Quiz page + components.
4. Admin tab "ക്വിസ് മത്സരം" in Admin dashboard.
5. Home bell + AI exclusion wrapper.
6. PDF/CSV exports.
7. Memory note `mem://features/quiz-system`.

Approve to proceed?
