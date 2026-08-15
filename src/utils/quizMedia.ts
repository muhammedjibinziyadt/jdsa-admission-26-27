/** Media preloading helpers so the quiz timer never starts before media is visible. */

const imgCache = new Map<string, Promise<void>>();
const audioCache = new Map<string, Promise<void>>();

export function preloadImage(url: string): Promise<void> {
  if (!url) return Promise.resolve();
  const hit = imgCache.get(url);
  if (hit) return hit;
  const p = new Promise<void>(resolve => {
    const img = new Image();
    img.decoding = 'sync';
    (img as any).fetchPriority = 'high';
    img.onload = async () => {
      try { await (img as any).decode?.(); } catch { /* ignore */ }
      resolve();
    };
    img.onerror = () => resolve();
    img.src = url;
  });
  imgCache.set(url, p);
  return p;
}

export function preloadAudio(url: string): Promise<void> {
  if (!url) return Promise.resolve();
  const hit = audioCache.get(url);
  if (hit) return hit;
  const p = new Promise<void>(resolve => {
    const a = document.createElement('audio');
    a.preload = 'auto';
    const done = () => resolve();
    a.oncanplaythrough = done;
    a.onloadeddata = done;
    a.onerror = done;
    a.src = url;
    // safety timeout so a broken CDN never blocks the quiz forever
    setTimeout(done, 8000);
  });
  audioCache.set(url, p);
  return p;
}

/** Warm the browser cache for every media asset of a quiz, in the background. */
export function prefetchQuizMedia(items: { image_url?: string | null; audio_url?: string | null }[]) {
  items.forEach(q => {
    if (q.image_url) preloadImage(q.image_url);
    if (q.audio_url) preloadAudio(q.audio_url);
  });
}

export function preloadQuestionMedia(q: { image_url?: string | null; audio_url?: string | null }): Promise<void> {
  return Promise.all([
    q.image_url ? preloadImage(q.image_url) : Promise.resolve(),
    q.audio_url ? preloadAudio(q.audio_url) : Promise.resolve(),
  ]).then(() => undefined);
}
