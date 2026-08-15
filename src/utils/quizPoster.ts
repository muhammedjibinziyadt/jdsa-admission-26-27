import jsPDF from 'jspdf';
import logoUrl from '@/assets/jdsa-logo.png';

export interface PosterData {
  full_name: string;
  username: string;
  quiz_name: string;
  event_label?: string;
  score: number;
  total: number;
  rank: number;
  photo_url?: string | null;
  logo_url?: string | null;
  headline?: string;
}

const W = 1080;
const H = 1350;

function loadImg(src: string): Promise<HTMLImageElement | null> {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function rankLabel(rank: number) {
  const suffix = rank === 1 ? 'st' : rank === 2 ? 'nd' : rank === 3 ? 'rd' : 'th';
  return `${rank}${suffix} Place`;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, start: number, weight = '700') {
  let size = start;
  do {
    ctx.font = `${weight} ${size}px "Poppins", "Noto Sans Malayalam", system-ui, sans-serif`;
    size -= 2;
  } while (ctx.measureText(text).width > maxWidth && size > 20);
  return size;
}

export async function renderPosterCanvas(d: PosterData): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // background
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#04231a');
  g.addColorStop(0.5, '#065f46');
  g.addColorStop(1, '#02160f');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  // soft glows
  const glow = ctx.createRadialGradient(W / 2, 340, 20, W / 2, 340, 520);
  glow.addColorStop(0, 'rgba(250,204,21,0.28)');
  glow.addColorStop(1, 'rgba(250,204,21,0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

  // gold frame
  ctx.strokeStyle = 'rgba(250,204,21,0.65)';
  ctx.lineWidth = 6;
  roundRect(ctx, 34, 34, W - 68, H - 68, 40); ctx.stroke();

  ctx.textAlign = 'center';

  // logo
  const logo = await loadImg(d.logo_url || logoUrl);
  if (logo) {
    const lw = 130; const lh = (logo.height / logo.width) * lw;
    ctx.drawImage(logo, W / 2 - lw / 2, 70, lw, lh);
  }

  // headline
  ctx.fillStyle = '#facc15';
  const headline = d.headline || '🎉 അഭിനന്ദനങ്ങൾ';
  ctx.font = `700 ${fitText(ctx, headline, W - 200, 62)}px "Poppins", "Noto Sans Malayalam", system-ui, sans-serif`;
  ctx.fillText(headline, W / 2, 265);

  // photo circle
  const cx = W / 2, cy = 470, r = 145;
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, r + 10, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(250,204,21,0.9)'; ctx.fill();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = '#0f3b2e'; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  const photo = d.photo_url ? await loadImg(d.photo_url) : null;
  if (photo) {
    const s = Math.max((r * 2) / photo.width, (r * 2) / photo.height);
    const pw = photo.width * s, ph = photo.height * s;
    ctx.drawImage(photo, cx - pw / 2, cy - ph / 2, pw, ph);
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    ctx.font = '700 120px system-ui, sans-serif';
    ctx.fillText((d.full_name || '?').charAt(0).toUpperCase(), cx, cy + 44);
  }
  ctx.restore();

  // name
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 ${fitText(ctx, d.full_name, W - 180, 66)}px "Poppins", "Noto Sans Malayalam", system-ui, sans-serif`;
  ctx.fillText(d.full_name, W / 2, 700);

  // quiz name
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = `500 ${fitText(ctx, d.quiz_name, W - 200, 40, '500')}px "Poppins", "Noto Sans Malayalam", system-ui, sans-serif`;
  ctx.fillText(d.quiz_name, W / 2, 760);

  if (d.event_label) {
    ctx.fillStyle = 'rgba(250,204,21,0.9)';
    ctx.font = '500 32px "Poppins", "Noto Sans Malayalam", system-ui, sans-serif';
    ctx.fillText(d.event_label, W / 2, 810);
  }

  // score + rank cards
  const cardY = 880, cardH = 220, cardW = 420;
  const cards: [string, string][] = [
    ['Score', `${d.score} / ${d.total}`],
    ['Rank', rankLabel(d.rank)],
  ];
  cards.forEach(([label, value], i) => {
    const x = i === 0 ? 70 : W - 70 - cardW;
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    roundRect(ctx, x, cardY, cardW, cardH, 32); ctx.fill();
    ctx.strokeStyle = 'rgba(250,204,21,0.35)'; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '600 30px "Poppins", system-ui, sans-serif';
    ctx.fillText(label, x + cardW / 2, cardY + 62);
    ctx.fillStyle = '#facc15';
    ctx.font = `800 ${fitText(ctx, value, cardW - 60, 76, '800')}px "Poppins", system-ui, sans-serif`;
    ctx.fillText(value, x + cardW / 2, cardY + 150);
  });

  // footer
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = '600 34px "Poppins", "Noto Sans Malayalam", system-ui, sans-serif';
  ctx.fillText('ജൗഹറത്തുൽ ഉലൂം സുഫ്ഫ ദർസ്', W / 2, H - 150);
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = '400 26px "Poppins", system-ui, sans-serif';
  ctx.fillText('Students Association', W / 2, H - 108);
  ctx.fillText(`@${d.username}`, W / 2, H - 66);

  return canvas;
}

function download(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
}

const safe = (s: string) => s.replace(/[^\w\u0d00-\u0d7f-]+/g, '_').slice(0, 40);

export async function downloadPoster(d: PosterData, format: 'png' | 'jpg' | 'pdf' = 'png') {
  const canvas = await renderPosterCanvas(d);
  const base = `poster-${safe(d.username || d.full_name)}`;
  if (format === 'pdf') {
    const doc = new jsPDF({ unit: 'px', format: [W, H] });
    doc.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, W, H);
    doc.save(`${base}.pdf`);
    return;
  }
  const mime = format === 'jpg' ? 'image/jpeg' : 'image/png';
  download(canvas.toDataURL(mime, 0.95), `${base}.${format}`);
}

export async function downloadPostersBulk(list: PosterData[], format: 'png' | 'jpg' | 'pdf' = 'png') {
  if (!list.length) return;
  if (format === 'pdf') {
    const doc = new jsPDF({ unit: 'px', format: [W, H] });
    for (let i = 0; i < list.length; i++) {
      const canvas = await renderPosterCanvas(list[i]);
      if (i > 0) doc.addPage([W, H]);
      doc.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, W, H);
    }
    doc.save(`quiz-posters-${Date.now()}.pdf`);
    return;
  }
  for (const d of list) {
    await downloadPoster(d, format);
    await new Promise(r => setTimeout(r, 350));
  }
}
