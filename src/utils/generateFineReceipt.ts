import jsPDF from 'jspdf';

export interface FineReceiptData {
  fine_date: string;
  day_name?: string | null;
  person_name: string;
  reason: string;
  amount: number;
  committee_name: string;
  receipt_no?: string;
  payment_status?: 'paid' | 'unpaid';
}

// Receipt designed to match the institution's MONEY RECEIPT card
// Landscape A5. Green theme when paid, red theme when unpaid.
export function generateFineReceipt(data: FineReceiptData): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a5', orientation: 'landscape' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  const isPaid = data.payment_status === 'paid';
  // Status-based palette (green = paid, red = unpaid)
  const accent: [number, number, number] = isPaid ? [21, 128, 61] : [185, 28, 28];      // primary band
  const accent2: [number, number, number] = isPaid ? [22, 163, 74] : [220, 38, 38];     // secondary band
  const navy: [number, number, number] = [23, 42, 79];                                   // brand navy
  const ink: [number, number, number] = [30, 30, 30];

  // ===== Top decorative bands =====
  // Navy left chunk
  doc.setFillColor(...navy);
  doc.rect(0, 0, W * 0.42, 10, 'F');
  // Diagonal cut between navy and accent
  doc.triangle(W * 0.42, 0, W * 0.50, 0, W * 0.42, 10, 'F');
  // Accent band on the right
  doc.setFillColor(...accent2);
  doc.rect(W * 0.46, 0, W * 0.54, 10, 'F');

  // ===== Header content =====
  // Title - MONEY RECEIPT centered
  doc.setTextColor(...navy);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('MONEY RECEIPT', W / 2, 22, { align: 'center' });

  // Phone numbers under title
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...accent);
  doc.text('\u260E  8281102606,  9048696090', W / 2, 28, { align: 'center' });

  // Right block: association name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...ink);
  doc.text('JAWHARATHUL ULOOM', W - 10, 18, { align: 'right' });
  doc.text('SUFFA DARS', W - 10, 22, { align: 'right' });
  doc.text('STUDENTS ASSOCIATION', W - 10, 26, { align: 'right' });

  // Left block: simple logo placeholder text (kept minimal — no asset)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...navy);
  doc.text('JAWHARATHUL ULOOM', 12, 22);
  doc.setTextColor(...accent);
  doc.text('SUFFA DARS', 12, 26);
  doc.setTextColor(120, 120, 120);
  doc.text('STUDENTS ASSOCIATION', 12, 30);

  // ===== No / Date row =====
  doc.setTextColor(...ink);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`No  ${data.receipt_no || '............'}`, 12, 42);
  const formattedDate = new Date(data.fine_date).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
  doc.text(`Date  ${formattedDate}`, W - 12, 42, { align: 'right' });

  // Accent divider under No/Date
  doc.setFillColor(...accent2);
  doc.rect(8, 45, W - 16, 1.2, 'F');

  // ===== Body fields =====
  doc.setFontSize(10);
  doc.setTextColor(...ink);
  let y = 56;
  const labelX = 12;
  const valueX = 70;
  const rowGap = 10;

  const drawRow = (label: string, value: string) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, labelX, y);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(value || '-', W - valueX - 12);
    doc.text(lines, valueX, y);
    // dotted line under value
    doc.setDrawColor(180, 180, 180);
    doc.setLineDashPattern([0.6, 0.6], 0);
    doc.line(valueX, y + 2, W - 12, y + 2);
    doc.setLineDashPattern([], 0);
    y += rowGap;
  };

  drawRow('Received from', data.person_name);
  drawRow('Reason', data.reason);
  drawRow('Committee', data.committee_name);
  drawRow('Day', data.day_name || new Date(data.fine_date).toLocaleDateString('en-IN', { weekday: 'long' }));

  // ===== Amount + Status =====
  y += 4;
  // Amount label
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...ink);
  doc.text('Amount =', labelX, y + 6);

  // Amount box
  doc.setDrawColor(...ink);
  doc.setLineWidth(0.4);
  doc.rect(40, y, 50, 10);
  doc.setFontSize(13);
  doc.text(`Rs. ${Number(data.amount).toFixed(2)}`, 65, y + 7, { align: 'center' });

  // Status pill (right side)
  const pillW = 42;
  const pillX = W - 12 - pillW;
  doc.setFillColor(...accent);
  doc.roundedRect(pillX, y, pillW, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text(isPaid ? 'PAID' : 'UNPAID', pillX + pillW / 2, y + 6.8, { align: 'center' });

  // Signature line
  doc.setTextColor(...ink);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setDrawColor(120, 120, 120);
  doc.setLineWidth(0.3);
  doc.line(W - 60, y + 22, W - 12, y + 22);
  doc.text('Secretary', W - 36, y + 27, { align: 'center' });

  // ===== Bottom decorative bands (mirror of top) =====
  doc.setFillColor(...accent2);
  doc.rect(0, H - 10, W * 0.55, 10, 'F');
  doc.triangle(W * 0.55, H - 10, W * 0.55, H, W * 0.62, H, 'F');
  doc.setFillColor(...navy);
  doc.rect(W * 0.58, H - 10, W * 0.42, 10, 'F');

  return doc;
}
