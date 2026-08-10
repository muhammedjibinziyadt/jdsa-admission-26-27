export type QuizThemeId =
  | 'independence'
  | 'samastha'
  | 'milad'
  | 'ramadan'
  | 'islamic_history'
  | 'arabic'
  | 'general'
  | 'custom';

export interface QuizTheme {
  id: QuizThemeId;
  label: string;
  /** tailwind gradient classes for the page background */
  bg: string;
  /** gradient for the accent band / title text */
  accent: string;
  /** ring / border tint */
  ring: string;
  /** small badge classes */
  badge: string;
  /** emoji shown next to the title */
  emoji: string;
  /** particle colours (raw css colours are fine — decorative only) */
  particles: string[];
  /** show the rotating Ashoka Chakra ornament */
  chakra?: boolean;
}

export const QUIZ_THEMES: Record<QuizThemeId, QuizTheme> = {
  independence: {
    id: 'independence',
    label: 'Independence Day',
    bg: 'from-[#fff7ed] via-background to-[#ecfdf5] dark:from-[#1a1206] dark:via-background dark:to-[#04180f]',
    accent: 'from-[#ff9933] via-[#f8fafc] to-[#138808]',
    ring: 'ring-[#ff9933]/30',
    badge: 'bg-[#ff9933]/15 text-[#b45309] dark:text-[#fdba74]',
    emoji: '🇮🇳',
    particles: ['#ff9933', '#138808', '#1e3a8a'],
    chakra: true,
  },
  samastha: {
    id: 'samastha',
    label: "Samastha Founder's Day",
    bg: 'from-emerald-50 via-background to-teal-50 dark:from-emerald-950/40 dark:via-background dark:to-teal-950/30',
    accent: 'from-emerald-500 via-teal-400 to-emerald-600',
    ring: 'ring-emerald-500/30',
    badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
    emoji: '🕌',
    particles: ['#10b981', '#14b8a6', '#065f46'],
  },
  milad: {
    id: 'milad',
    label: 'Milad Conference',
    bg: 'from-lime-50 via-background to-emerald-50 dark:from-lime-950/30 dark:via-background dark:to-emerald-950/30',
    accent: 'from-lime-500 via-emerald-400 to-green-600',
    ring: 'ring-lime-500/30',
    badge: 'bg-lime-500/15 text-lime-700 dark:text-lime-300',
    emoji: '🌙',
    particles: ['#84cc16', '#22c55e', '#facc15'],
  },
  ramadan: {
    id: 'ramadan',
    label: 'Ramadan',
    bg: 'from-indigo-50 via-background to-violet-50 dark:from-indigo-950/50 dark:via-background dark:to-violet-950/40',
    accent: 'from-indigo-500 via-violet-400 to-purple-600',
    ring: 'ring-indigo-500/30',
    badge: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300',
    emoji: '🌛',
    particles: ['#6366f1', '#a78bfa', '#fbbf24'],
  },
  islamic_history: {
    id: 'islamic_history',
    label: 'Islamic History',
    bg: 'from-amber-50 via-background to-stone-100 dark:from-amber-950/30 dark:via-background dark:to-stone-900',
    accent: 'from-amber-600 via-yellow-500 to-amber-700',
    ring: 'ring-amber-500/30',
    badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
    emoji: '📜',
    particles: ['#d97706', '#f59e0b', '#78716c'],
  },
  arabic: {
    id: 'arabic',
    label: 'Arabic Language',
    bg: 'from-cyan-50 via-background to-sky-50 dark:from-cyan-950/40 dark:via-background dark:to-sky-950/30',
    accent: 'from-cyan-500 via-sky-400 to-blue-600',
    ring: 'ring-cyan-500/30',
    badge: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300',
    emoji: 'ﻉ',
    particles: ['#06b6d4', '#0ea5e9', '#3b82f6'],
  },
  general: {
    id: 'general',
    label: 'General Knowledge',
    bg: 'from-slate-50 via-background to-blue-50 dark:from-slate-900 dark:via-background dark:to-blue-950/30',
    accent: 'from-blue-500 via-indigo-400 to-blue-700',
    ring: 'ring-blue-500/30',
    badge: 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
    emoji: '🧠',
    particles: ['#3b82f6', '#6366f1', '#0ea5e9'],
  },
  custom: {
    id: 'custom',
    label: 'Custom Theme',
    bg: 'from-background via-background to-muted/40',
    accent: 'from-primary via-primary/70 to-primary',
    ring: 'ring-primary/30',
    badge: 'bg-primary/10 text-primary',
    emoji: '✨',
    particles: ['hsl(var(--primary))'],
  },
};

export function getQuizTheme(id?: string | null): QuizTheme {
  return QUIZ_THEMES[(id as QuizThemeId) || 'custom'] || QUIZ_THEMES.custom;
}
