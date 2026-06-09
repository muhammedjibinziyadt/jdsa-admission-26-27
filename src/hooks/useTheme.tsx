import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type ThemePreset = {
  id: string;
  label: string;
  primary: string;      // HSL "H S% L%"
  secondary: string;
  accent: string;
  primaryFg?: string;
};

export const THEME_PRESETS: ThemePreset[] = [
  { id: 'emerald', label: 'Emerald + White', primary: '158 64% 22%', secondary: '42 30% 94%', accent: '158 20% 95%' },
  { id: 'dark-gold', label: 'Dark Green + Gold', primary: '155 70% 14%', secondary: '45 85% 55%', accent: '45 70% 92%' },
  { id: 'navy', label: 'Navy + White', primary: '220 70% 22%', secondary: '210 30% 96%', accent: '220 30% 94%' },
  { id: 'maroon', label: 'Maroon + Cream', primary: '352 60% 28%', secondary: '38 50% 94%', accent: '38 40% 92%' },
  { id: 'teal', label: 'Teal + Silver', primary: '184 65% 28%', secondary: '210 10% 92%', accent: '184 30% 94%' },
];

type ThemeState = {
  preset: string;
  primary: string;
  secondary: string;
  accent: string;
};

type Ctx = {
  theme: ThemeState;
  setTheme: (t: ThemeState) => void;
  applyPreview: (t: Partial<ThemeState>) => void;
  resetPreview: () => void;
  save: (t: ThemeState) => Promise<void>;
};

const DEFAULT: ThemeState = { preset: 'emerald', primary: '158 64% 22%', secondary: '42 30% 94%', accent: '158 20% 95%' };

const ThemeCtx = createContext<Ctx | null>(null);

const applyToRoot = (t: Partial<ThemeState>) => {
  const r = document.documentElement;
  if (t.primary) {
    r.style.setProperty('--primary', t.primary);
    r.style.setProperty('--ring', t.primary);
    r.style.setProperty('--sidebar-primary', t.primary);
    r.style.setProperty('--sidebar-ring', t.primary);
  }
  if (t.secondary) r.style.setProperty('--secondary', t.secondary);
  if (t.accent) {
    r.style.setProperty('--accent', t.accent);
    r.style.setProperty('--sidebar-accent', t.accent);
  }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeState>(() => {
    try {
      const cached = localStorage.getItem('siteTheme');
      if (cached) return JSON.parse(cached);
    } catch {}
    return DEFAULT;
  });

  useEffect(() => { applyToRoot(theme); }, [theme]);

  useEffect(() => {
    supabase.from('theme_settings').select('*').eq('id', 'global').maybeSingle().then(({ data }) => {
      if (data) {
        const next: ThemeState = {
          preset: data.preset || 'emerald',
          primary: data.primary_color || DEFAULT.primary,
          secondary: data.secondary_color || DEFAULT.secondary,
          accent: data.accent_color || DEFAULT.accent,
        };
        setThemeState(next);
        try { localStorage.setItem('siteTheme', JSON.stringify(next)); } catch {}
      }
    });
  }, []);

  const setTheme = (t: ThemeState) => {
    setThemeState(t);
    try { localStorage.setItem('siteTheme', JSON.stringify(t)); } catch {}
  };

  const applyPreview = (t: Partial<ThemeState>) => applyToRoot(t);
  const resetPreview = () => applyToRoot(theme);

  const save = async (t: ThemeState) => {
    setTheme(t);
    await supabase.from('theme_settings').upsert({
      id: 'global', preset: t.preset, primary_color: t.primary, secondary_color: t.secondary, accent_color: t.accent, updated_at: new Date().toISOString(),
    });
  };

  return <ThemeCtx.Provider value={{ theme, setTheme, applyPreview, resetPreview, save }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
};

// HEX <-> HSL helpers
export const hexToHsl = (hex: string): string => {
  const m = hex.replace('#', '');
  const r = parseInt(m.substring(0, 2), 16) / 255;
  const g = parseInt(m.substring(2, 4), 16) / 255;
  const b = parseInt(m.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

export const hslToHex = (hsl: string): string => {
  const parts = hsl.match(/(\d+(?:\.\d+)?)/g);
  if (!parts || parts.length < 3) return '#000000';
  const h = parseFloat(parts[0]) / 360;
  const s = parseFloat(parts[1]) / 100;
  const l = parseFloat(parts[2]) / 100;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  let r, g, b;
  if (s === 0) r = g = b = l;
  else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1/3);
  }
  const toHex = (v: number) => Math.round(v * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
