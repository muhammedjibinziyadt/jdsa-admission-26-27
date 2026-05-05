import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

export type Lang = 'M' | 'E';

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (m: string, e: string) => string;
}

const LanguageContext = createContext<Ctx | null>(null);
const KEY = 'site_lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'M';
    return (localStorage.getItem(KEY) as Lang) || 'M';
  });

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(KEY, l); } catch {}
  }, []);

  const t = useCallback((m: string, e: string) => (lang === 'E' ? e : m), [lang]);

  useEffect(() => {
    document.documentElement.setAttribute('data-lang', lang);
  }, [lang]);

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Safe fallback if used outside the provider
    return { lang: 'M' as Lang, setLang: () => {}, t: (m: string, _e: string) => m };
  }
  return ctx;
}

/** Shorthand helper for places that can't use the hook */
export function tx(lang: Lang, m: string, e: string) { return lang === 'E' ? e : m; }
