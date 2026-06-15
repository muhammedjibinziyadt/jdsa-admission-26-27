import { Languages } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface Props {
  variant?: 'light' | 'dark';
  className?: string;
}

export default function LanguageToggle({ variant = 'dark', className = '' }: Props) {
  const { lang, setLang } = useLanguage();
  const isLight = variant === 'light';
  const wrap = isLight
    ? 'border-white/30 bg-white/10 text-white'
    : 'border-border bg-background text-foreground';
  const active = isLight ? 'bg-white text-primary shadow-sm' : 'bg-primary text-primary-foreground shadow-sm';
  const inactive = 'opacity-70 hover:opacity-100';
  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-full border ${wrap} pl-2 pr-0.5 py-0.5 text-[11px] font-bold ${className}`}
      role="group"
      aria-label="Language"
      title="Switch language"
    >
      <Languages className="w-3.5 h-3.5 mr-0.5 opacity-80" aria-hidden />
      <button
        type="button"
        onClick={() => setLang('M')}
        aria-pressed={lang === 'M'}
        className={`px-2.5 py-1 rounded-full transition ${lang === 'M' ? active : inactive}`}
      >മല</button>
      <button
        type="button"
        onClick={() => setLang('E')}
        aria-pressed={lang === 'E'}
        className={`px-2.5 py-1 rounded-full transition ${lang === 'E' ? active : inactive}`}
      >EN</button>
    </div>
  );
}
