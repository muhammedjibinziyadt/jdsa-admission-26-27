import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, X, ArrowRight, Trophy } from 'lucide-react';
import { useQuizSettings, isQuizLive } from '@/hooks/useQuiz';
import { useLanguage } from '@/hooks/useLanguage';

function useCountdown(target: string | null) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!target) return null;
  const diff = new Date(target).getTime() - now;
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, done: true };
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s, done: false };
}

function FlipUnit({ value, label }: { value: number; label: string }) {
  const v = value.toString().padStart(2, '0');
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-11 h-14 md:w-14 md:h-16 rounded-lg overflow-hidden bg-gradient-to-b from-slate-900 to-slate-700 border border-white/10 shadow-inner">
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            key={v}
            className="text-2xl md:text-3xl font-bold text-white font-mono tabular-nums animate-in slide-in-from-top-2 fade-in duration-300"
          >
            {v}
          </span>
        </div>
        <div className="absolute inset-x-0 top-1/2 h-px bg-black/40" />
      </div>
      <span className="mt-1 text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  );
}

export default function HomeQuizBell() {
  const { settings } = useQuizSettings();
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const cd = useCountdown(settings?.start_at || null);

  if (!settings?.enabled) return null;

  const live = isQuizLive(settings);
  const showCountdown = !!settings.start_at && cd && !cd.done;
  // Show nothing if not live AND not counting down (e.g., expired end_at)
  if (!live && !showCountdown) return null;

  const title = lang === 'E' ? settings.title_en : settings.title_ml;

  return (
    <div className="fixed top-20 right-4 z-40 flex flex-col items-end gap-3">
      {/* Countdown pill */}
      {showCountdown && (
        <div className="backdrop-blur-xl bg-background/70 border border-white/20 rounded-2xl shadow-2xl px-3 py-2.5 md:px-4 md:py-3 animate-in slide-in-from-right-4 fade-in duration-500">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground/80">
              {t('ക്വിസ് ആരംഭിക്കും', 'Quiz Starts In')}
            </span>
          </div>
          <div className="flex items-end gap-1.5 md:gap-2">
            <FlipUnit value={cd!.d} label={t('ദിവസം', 'Days')} />
            <span className="text-xl md:text-2xl font-bold text-muted-foreground/60 pb-5">:</span>
            <FlipUnit value={cd!.h} label={t('മണി', 'Hrs')} />
            <span className="text-xl md:text-2xl font-bold text-muted-foreground/60 pb-5">:</span>
            <FlipUnit value={cd!.m} label={t('മിനിറ്റ്', 'Min')} />
            <span className="text-xl md:text-2xl font-bold text-muted-foreground/60 pb-5">:</span>
            <FlipUnit value={cd!.s} label={t('സെക്', 'Sec')} />
          </div>
        </div>
      )}

      {live && !showCountdown && !open && (
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold backdrop-blur">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {t('ക്വിസ് ആരംഭിച്ചു', 'Quiz Started')}
          </div>
          <button
            onClick={() => setOpen(true)}
            aria-label="Quiz notification"
            className="relative w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-background"></span>
          </button>
        </div>
      )}

      {live && open && (
        <div className="w-72 bg-card border rounded-2xl shadow-xl p-4 space-y-3 animate-in slide-in-from-top-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Bell className="w-4 h-4" />
              {t('അറിയിപ്പ്', 'Notification')}
            </div>
            <button onClick={() => setOpen(false)} aria-label="close">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="text-base font-semibold leading-snug">👉 {title}</div>
          {settings?.intro_ml && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {lang === 'E' ? settings.intro_en : settings.intro_ml}
            </p>
          )}
          <Link
            to="/quiz"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
          >
            {t('ക്വിസിലേക്ക് പ്രവേശിക്കുക', 'Enter Quiz')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
