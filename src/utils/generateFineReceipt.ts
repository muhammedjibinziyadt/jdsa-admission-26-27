import jsPDF from 'jspdf';

export interface FineReceiptData {
  fine_date: string;
  day_name?: string | null;
  person_name: string;
  reason: string;
  amount: number;
  committee_name: string;
  receipt_no?: string;
}

export function generateFineReceipt(data: FineReceiptData): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a5' });
  const W = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(15, 76, 58);
  doc.rect(0, 0, W, 22, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('JAWHARATHUL ULOOM SUFFA DARS', W / 2, 10, { align: 'center' });
  doc.setFontSize(10);
  doc.text('STUDENTS ASSOCIATION', W / 2, 16, { align: 'center' });

  // Title
  doc.setTextColor(15, 76, 58);
  doc.setFontSize(14);
  doc.text('FINE / PENALTY RECEIPT', W / 2, 32, { align: 'center' });
  doc.setDrawColor(15, 76, 58);
  doc.setLineWidth(0.4);
  doc.line(15, 35, W - 15, 35);

  // Receipt no & date strip
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  if (data.receipt_no) doc.text(`Receipt No: ${data.receipt_no}`, 15, 42);
  doc.text(`Issued: ${new Date().toLocaleDateString('en-IN')}`, W - 15, 42, { align: 'right' });

  // Body rows
  const fieldDate = new Date(data.fine_date);
  const day = data.day_name || fieldDate.toLocaleDateString('en-IN', { weekday: 'long' });
  const formattedDate = fieldDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const rows: [string, string][] = [
    ['Date', formattedDate],
    ['Day', day],
    ['Committee', data.committee_name],
    ['Name', data.person_name],
    ['Reason', data.reason],
  ];

  let y = 52;
  doc.setTextColor(40, 40, 40);
  rows.forEach(([k, v]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`${k}:`, 18, y);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(v, W - 60);
    doc.text(lines, 50, y);
    y += Math.max(7, lines.length * 5);
  });

  // Amount box
  y += 4;
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(15, y, W - 30, 16, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(120, 0, 0);
  doc.text('AMOUNT', 20, y + 10);
  doc.setFontSize(14);
  doc.text(`₹ ${Number(data.amount).toFixed(2)}`, W - 20, y + 10, { align: 'right' });

  // Footer signature
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Authorised Signatory', W - 20, y + 38, { align: 'right' });
  doc.line(W - 65, y + 35, W - 18, y + 35);

  doc.text('Thank you. This is a system-generated receipt.', W / 2, doc.internal.pageSize.getHeight() - 8, { align: 'center' });

  return doc;
}
