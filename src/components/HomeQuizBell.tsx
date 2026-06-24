import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, X, ArrowRight } from 'lucide-react';
import { useQuizSettings, isQuizLive } from '@/hooks/useQuiz';
import { useLanguage } from '@/hooks/useLanguage';

export default function HomeQuizBell() {
  const { settings } = useQuizSettings();
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(false);

  if (!isQuizLive(settings)) return null;
  const title = lang === 'E' ? settings!.title_en : settings!.title_ml;

  return (
    <div className="fixed top-20 right-4 z-40">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Quiz notification"
          className="relative w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        >
          <Bell className="w-5 h-5"/>
          <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-background"></span>
        </button>
      )}
      {open && (
        <div className="w-72 bg-card border rounded-2xl shadow-xl p-4 space-y-3 animate-in slide-in-from-top-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Bell className="w-4 h-4"/>{t('അറിയിപ്പ്','Notification')}
            </div>
            <button onClick={() => setOpen(false)} aria-label="close"><X className="w-4 h-4 text-muted-foreground"/></button>
          </div>
          <div className="text-base font-semibold leading-snug">👉 {title}</div>
          {settings?.intro_ml && <p className="text-xs text-muted-foreground leading-relaxed">{lang === 'E' ? settings.intro_en : settings.intro_ml}</p>}
          <Link to="/quiz" onClick={() => setOpen(false)} className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
            {t('ക്വിസിലേക്ക് പ്രവേശിക്കുക','Enter Quiz')} <ArrowRight className="w-4 h-4"/>
          </Link>
        </div>
      )}
    </div>
  );
}
