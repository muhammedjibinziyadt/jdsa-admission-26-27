import jsPDF from 'jspdf';
import { QuizSubmission } from '@/hooks/useQuiz';
import { tx } from './siteLang';

const NAVY: [number, number, number] = [23, 42, 79];
const ACCENT: [number, number, number] = [22, 163, 74];

function header(doc: jsPDF, sub: string) {
  const W = doc.internal.pageSize.getWidth();
  doc.setFillColor(...NAVY); doc.rect(0, 0, W, 22, 'F');
  doc.setFillColor(...ACCENT); doc.rect(0, 22, W, 2, 'F');
  doc.setTextColor(255,255,255); doc.setFont('helvetica','bold'); doc.setFontSize(14);
  doc.text('JAWHARATHUL ULOOM SUFFA DARS', W/2, 10, { align: 'center' });
  doc.setFont('helvetica','normal'); doc.setFontSize(9);
  doc.text(sub, W/2, 16, { align: 'center' });
}

export function downloadSingleResultPDF(s: QuizSubmission) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  header(doc, tx('സമസ്ത ക്വിസ് മത്സരം — ഫലം', 'Samastha Quiz — Result'));
  let y = 35;
  doc.setTextColor(0,0,0); doc.setFontSize(16); doc.setFont('helvetica','bold');
  doc.text(s.full_name, 15, y); y += 8;
  doc.setFontSize(10); doc.setFont('helvetica','normal');
  const rows: [string, string][] = [
    [tx('യൂസർനെയിം','Username'), s.username],
    [tx('മൊബൈൽ','Mobile'), s.mobile],
    [tx('വിലാസം','Address'), s.address || '-'],
    [tx('സ്കോർ','Score'), `${s.score} / ${s.total}`],
    [tx('ശരി','Correct'), String(s.correct_count)],
    [tx('തെറ്റ്','Wrong'), String(s.wrong_count)],
    [tx('സമർപ്പിച്ച സമയം','Submitted'), new Date(s.submitted_at).toLocaleString()],
  ];
  for (const [k,v] of rows) {
    doc.setFont('helvetica','bold'); doc.text(`${k}:`, 15, y);
    doc.setFont('helvetica','normal'); doc.text(String(v), 60, y);
    y += 7;
  }
  if (s.extra_info) {
    y += 4; doc.setFont('helvetica','bold'); doc.text(tx('കൂടുതൽ','Notes')+':', 15, y); y += 6;
    doc.setFont('helvetica','normal');
    const lines = doc.splitTextToSize(s.extra_info, W - 30);
    doc.text(lines, 15, y);
  }
  doc.save(`quiz-${s.username}.pdf`);
}

export function downloadAllResultsPDF(rows: QuizSubmission[]) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  header(doc, tx('സമസ്ത ക്വിസ് — എല്ലാ ഫലങ്ങളും', 'Samastha Quiz — All Results'));
  let y = 32;
  doc.setTextColor(0,0,0); doc.setFontSize(11); doc.setFont('helvetica','bold');
  const cols = ['#', tx('പേര്','Name'), tx('യൂസർ','User'), tx('മൊബൈൽ','Mobile'), tx('സ്കോർ','Score'), tx('സമയം','Time')];
  const x = [15, 22, 75, 105, 135, 158];
  cols.forEach((c, i) => doc.text(c, x[i], y));
  y += 4; doc.setDrawColor(...ACCENT); doc.line(15, y, W-15, y); y += 5;
  doc.setFont('helvetica','normal'); doc.setFontSize(9);
  rows.forEach((s, i) => {
    if (y > 285) { doc.addPage(); y = 20; }
    doc.text(String(i+1), x[0], y);
    doc.text((s.full_name || '').slice(0,28), x[1], y);
    doc.text(s.username.slice(0,14), x[2], y);
    doc.text(s.mobile || '', x[3], y);
    doc.text(`${s.score}/${s.total}`, x[4], y);
    doc.text(new Date(s.submitted_at).toLocaleDateString(), x[5], y);
    y += 6;
  });
  doc.save('quiz-all-results.pdf');
}

export function downloadResultsCSV(rows: QuizSubmission[]) {
  const headers = ['#','Name','Username','Mobile','Address','Score','Correct','Wrong','Total','SubmittedAt'];
  const lines = [headers.join(',')];
  rows.forEach((s, i) => {
    const cells = [
      i+1, s.full_name, s.username, s.mobile, s.address || '',
      s.score, s.correct_count, s.wrong_count, s.total, s.submitted_at
    ].map(v => {
      const x = String(v ?? '');
      return /[",\n]/.test(x) ? `"${x.replace(/"/g, '""')}"` : x;
    });
    lines.push(cells.join(','));
  });
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `quiz-results-${Date.now()}.csv`; a.click();
  URL.revokeObjectURL(url);
}
