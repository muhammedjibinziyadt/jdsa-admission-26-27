import { useLanguage } from '@/hooks/useLanguage';

interface Props {
  variant?: 'light' | 'dark';
  className?: string;
}

export default function LanguageToggle({ variant = 'dark', className = '' }: Props) {
  const { lang, setLang } = useLanguage();
  const isLight = variant === 'light';
  const base = isLight
    ? 'border-white/30 bg-white/10 text-white'
    : 'border-border bg-background text-foreground';
  const activeM = lang === 'M' ? (isLight ? 'bg-white text-primary' : 'bg-primary text-primary-foreground') : 'opacity-70';
  const activeE = lang === 'E' ? (isLight ? 'bg-white text-primary' : 'bg-primary text-primary-foreground') : 'opacity-70';
  return (
    <div className={`inline-flex items-center rounded-full border ${base} p-0.5 text-xs font-bold ${className}`} role="group" aria-label="Language toggle">
      <button
        type="button"
        onClick={() => setLang('M')}
        aria-pressed={lang === 'M'}
        className={`px-2.5 py-1 rounded-full transition ${activeM}`}
        title="Malayalam"
      >M</button>
      <button
        type="button"
        onClick={() => setLang('E')}
        aria-pressed={lang === 'E'}
        className={`px-2.5 py-1 rounded-full transition ${activeE}`}
        title="English"
      >E</button>
    </div>
  );
}
