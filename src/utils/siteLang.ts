export function getSiteLang(): 'M' | 'E' {
  try {
    const v = typeof window !== 'undefined' ? localStorage.getItem('site_lang') : null;
    return v === 'E' ? 'E' : 'M';
  } catch { return 'M'; }
}
export function tx(m: string, e: string): string {
  return getSiteLang() === 'E' ? e : m;
}
