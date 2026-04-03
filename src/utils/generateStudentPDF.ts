import jsPDF from 'jspdf';
import type { StudentRecord } from '@/hooks/useStudentsPortal';

async function imageUrlToBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function generateStudentPDF(
  student: StudentRecord,
  photoSignedUrl?: string | null
): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = margin;

  // Header border
  doc.setDrawColor(34, 139, 34);
  doc.setLineWidth(2);
  doc.rect(10, 10, pageWidth - 20, 30);

  // Institution name
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 139, 34);
  doc.text('JAWHARATHUL ULOOM SUFFA DARS', pageWidth / 2, 24, { align: 'center' });
  doc.setFontSize(12);
  doc.text('STUDENTS ASSOCIATION', pageWidth / 2, 32, { align: 'center' });

  yPos = 50;

  // Student photo
  let photoWidth = 0;
  if (photoSignedUrl) {
    try {
      const base64 = await imageUrlToBase64(photoSignedUrl);
      if (base64) {
        const imgW = 35;
        const imgH = 42;
        doc.addImage(base64, 'JPEG', pageWidth - margin - imgW, yPos, imgW, imgH);
        photoWidth = imgW + 5;
      }
    } catch {
      // skip photo
    }
  }

  doc.setTextColor(0, 0, 0);

  // Section helper
  const addSection = (title: string, y: number): number => {
    doc.setFillColor(34, 139, 34);
    doc.rect(margin, y, pageWidth - 2 * margin - photoWidth, 8, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(title, margin + 3, y + 6);
    doc.setTextColor(0, 0, 0);
    return y + 14;
  };

  const addRow = (label: string, value: string | null | undefined, y: number): number => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(label + ':', margin, y);
    doc.setFont('helvetica', 'normal');
    const val = value || '-';
    const lines = doc.splitTextToSize(val, pageWidth - 2 * margin - 55 - photoWidth);
    doc.text(lines, margin + 55, y);
    return y + Math.max(7, lines.length * 5);
  };

  // Personal Details
  yPos = addSection('Student Details', yPos);
  yPos = addRow('Student Name', student.student_name, yPos);
  yPos = addRow("Father's Name", student.father_name, yPos);
  yPos = addRow('Phone 1', student.phone1, yPos);
  yPos = addRow('Phone 2', student.phone2, yPos);
  yPos += 5;

  // Reset photo offset after first section
  photoWidth = 0;

  // Education Details
  yPos = addSection('Education Details', yPos);
  yPos = addRow('Year of Admission', student.year_of_admission, yPos);
  yPos = addRow('Previous Madrasa', student.previous_madrasa, yPos);
  yPos = addRow('Current Education', student.current_education, yPos);
  yPos += 5;

  // Address
  yPos = addSection('Address', yPos);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const addrLines = doc.splitTextToSize(student.address || '-', pageWidth - 2 * margin);
  doc.text(addrLines, margin, yPos);
  yPos += addrLines.length * 5 + 5;

  // Registration Info
  yPos += 5;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Registration ID:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(student.id.substring(0, 8).toUpperCase(), margin + 35, yPos);
  yPos += 6;

  doc.setFont('helvetica', 'bold');
  doc.text('Registration Date:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(student.created_at).toLocaleDateString('en-IN', { dateStyle: 'full' }), margin + 35, yPos);

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('JAWHARATHUL ULOOM SUFFA DARS STUDENTS ASSOCIATION', pageWidth / 2, footerY, { align: 'center' });
  doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, pageWidth / 2, footerY + 5, { align: 'center' });

  const fileName = `Student_${student.student_name.replace(/\s+/g, '_')}_${student.id.substring(0, 8)}.pdf`;
  doc.save(fileName);
}
