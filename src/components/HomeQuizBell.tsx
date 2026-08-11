import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, X, ArrowRight, Trophy } from 'lucide-react';
import { usePublicQuizEvents, isQuizLive, QuizEvent } from '@/hooks/useQuiz';
import { useLanguage } from '@/hooks/useLanguage';

function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function countdown(target: string | null, now: number) {
  if (!target) return null;
  const diff = new Date(target).getTime() - now;
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, done: true };
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff / 3600000) % 24),
    m: Math.floor((diff / 60000) % 60),
    s: Math.floor((diff / 1000) % 60),
    done: false,
  };
}

function FlipUnit({ value, label }: { value: number; label: string }) {
  const v = value.toString().padStart(2, '0');
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-9 h-12 md:w-12 md:h-14 rounded-lg overflow-hidden bg-gradient-to-b from-slate-900 to-slate-700 border border-white/10 shadow-inner">
        <div className="absolute inset-0 flex items-center justify-center">
          <span key={v} className="text-xl md:text-2xl font-bold text-white font-mono tabular-nums animate-in slide-in-from-top-2 fade-in duration-300">{v}</span>
        </div>
        <div className="absolute inset-x-0 top-1/2 h-px bg-black/40" />
      </div>
      <span className="mt-1 text-[9px] md:text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  );
}

export default function HomeQuizBell() {
  const { events } = usePublicQuizEvents();
  const { t, lang } = useLanguage();
  const [openId, setOpenId] = useState<string | null>(null);
  const now = useNow();

  const visible = events.filter(ev => {
    const cd = countdown(ev.start_at, now);
    const counting = !!cd && !cd.done && ev.show_countdown !== false;
    return isQuizLive(ev) || counting;
  });

  if (!visible.length) return null;

  return (
    <div className="fixed top-20 right-4 z-40 flex flex-col items-end gap-3 max-w-[calc(100vw-2rem)]">
      {visible.map(ev => (
        <EventBell
          key={ev.id}
          event={ev}
          now={now}
          lang={lang}
          t={t}
          open={openId === ev.id}
          setOpen={(o) => setOpenId(o ? ev.id : null)}
        />
      ))}
    </div>
  );
}

function EventBell({ event, now, lang, t, open, setOpen }: {
  event: QuizEvent;
  now: number;
  lang: string;
  t: (m: string, e: string) => string;
  open: boolean;
  setOpen: (o: boolean) => void;
}) {
  const cd = countdown(event.start_at, now);
  const showCountdown = !!cd && !cd.done && event.show_countdown !== false;
  const live = isQuizLive(event);
  const title = (lang === 'E' ? event.title_en : event.title_ml) || event.name;
  const note = (lang === 'E' ? (event.notification_en || event.intro_en) : (event.notification_ml || event.intro_ml)) || '';

  if (showCountdown) {
    return (
      <Link to={`/quiz/${event.slug}`}
        className="backdrop-blur-xl bg-background/70 border border-white/20 rounded-2xl shadow-2xl px-3 py-2.5 animate-in slide-in-from-right-4 fade-in duration-500 block">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground/80 truncate max-w-[160px]">{title}</span>
        </div>
        <div className="flex items-end gap-1.5">
          <FlipUnit value={cd!.d} label={t('ദിവസം', 'Days')} />
          <span className="text-lg font-bold text-muted-foreground/60 pb-4">:</span>
          <FlipUnit value={cd!.h} label={t('മണി', 'Hrs')} />
          <span className="text-lg font-bold text-muted-foreground/60 pb-4">:</span>
          <FlipUnit value={cd!.m} label={t('മിനിറ്റ്', 'Min')} />
          <span className="text-lg font-bold text-muted-foreground/60 pb-4">:</span>
          <FlipUnit value={cd!.s} label={t('സെക്', 'Sec')} />
        </div>
      </Link>
    );
  }

  if (!live) return null;

  if (!open) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold backdrop-blur max-w-[200px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <span className="truncate">{title}</span>
        </div>
        <button onClick={() => setOpen(true)} aria-label="Quiz notification"
          className="relative w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform">
          <Bell className="w-5 h-5" />
          <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-background"></span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-72 bg-card border rounded-2xl shadow-xl p-4 space-y-3 animate-in slide-in-from-top-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 text-primary font-semibold">
          <Bell className="w-4 h-4" />{t('അറിയിപ്പ്', 'Notification')}
        </div>
        <button onClick={() => setOpen(false)} aria-label="close"><X className="w-4 h-4 text-muted-foreground" /></button>
      </div>
      <div className="text-base font-semibold leading-snug">👉 {title}</div>
      {note && <p className="text-xs text-muted-foreground leading-relaxed">{note}</p>}
      <Link to={`/quiz/${event.slug}`} onClick={() => setOpen(false)}
        className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
        {t('ക്വിസിലേക്ക് പ്രവേശിക്കുക', 'Enter Quiz')} <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
