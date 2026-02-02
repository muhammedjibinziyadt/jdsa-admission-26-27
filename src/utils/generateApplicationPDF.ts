import jsPDF from 'jspdf';
import type { Admission } from '@/hooks/useAdmissions';

interface AdditionalData {
  documents?: {
    photo?: string;
    aadhaar?: string;
    birthCertificate?: string;
    tc?: string;
  };
  madarasaLevel?: string;
  madarasaName?: string;
  notes?: string;
}

// Convert image URL to base64
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
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
}

export async function generateApplicationPDF(admission: Admission): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = margin;

  // Parse additional info
  let additionalData: AdditionalData = {};
  try {
    if (admission.additional_info) {
      additionalData = JSON.parse(admission.additional_info);
    }
  } catch { additionalData = {}; }

  // Helper function to add text with word wrap
  const addText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 11, isBold: boolean = false): number => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * fontSize * 0.4);
  };

  // Add header with border
  doc.setDrawColor(34, 139, 34); // Green border
  doc.setLineWidth(2);
  doc.rect(10, 10, pageWidth - 20, 35);

  // Institution name
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 139, 34);
  doc.text('JDSA - Jawharathul Da\'awa Suffa Academy', pageWidth / 2, 25, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('അഡ്മിഷൻ അപേക്ഷ / Admission Application', pageWidth / 2, 35, { align: 'center' });

  yPos = 55;

  // Add student photo if available
  if (admission.image_url) {
    try {
      const base64Image = await imageUrlToBase64(admission.image_url);
      if (base64Image) {
        doc.addImage(base64Image, 'JPEG', pageWidth - margin - 35, yPos, 35, 40);
      }
    } catch (error) {
      console.error('Error adding image to PDF:', error);
    }
  }

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Section: Student Details
  doc.setFillColor(34, 139, 34);
  doc.rect(margin, yPos, pageWidth - 2 * margin - 45, 8, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Student Details / വിദ്യാർത്ഥിയുടെ വിവരങ്ങൾ', margin + 3, yPos + 6);
  doc.setTextColor(0, 0, 0);
  yPos += 15;

  const addRow = (label: string, value: string | null | undefined, y: number): number => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(label + ':', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value || '-', margin + 50, y);
    return y + 7;
  };

  yPos = addRow('Student Name', admission.student_name, yPos);
  yPos = addRow('Age', admission.age?.toString(), yPos);
  yPos = addRow('Date of Birth', admission.date_of_birth ? new Date(admission.date_of_birth).toLocaleDateString('en-IN') : null, yPos);
  yPos = addRow('Gender', admission.gender, yPos);
  
  yPos += 5;

  // Section: Guardian Details
  doc.setFillColor(34, 139, 34);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Guardian Details / രക്ഷിതാവിന്റെ വിവരങ്ങൾ', margin + 3, yPos + 6);
  doc.setTextColor(0, 0, 0);
  yPos += 15;

  yPos = addRow('Guardian Name', admission.guardian_name, yPos);
  yPos = addRow('Relation', admission.guardian_relation, yPos);
  yPos = addRow('Phone Number', admission.guardian_phone, yPos);
  yPos = addRow('Email', admission.guardian_email, yPos);

  yPos += 5;

  // Section: Address
  doc.setFillColor(34, 139, 34);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Address / മേൽവിലാസം', margin + 3, yPos + 6);
  doc.setTextColor(0, 0, 0);
  yPos += 15;

  if (admission.address) {
    yPos = addText(admission.address, margin, yPos, pageWidth - 2 * margin);
  } else {
    doc.text('-', margin, yPos);
    yPos += 7;
  }

  yPos += 5;

  // Section: Educational Details
  doc.setFillColor(34, 139, 34);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Educational Details / വിദ്യാഭ്യാസ വിവരങ്ങൾ', margin + 3, yPos + 6);
  doc.setTextColor(0, 0, 0);
  yPos += 15;

  yPos = addRow('Previous School', admission.previous_school, yPos);
  yPos = addRow('Madrasa Level', additionalData.madarasaLevel, yPos);
  yPos = addRow('Madrasa Name', additionalData.madarasaName, yPos);
  yPos = addRow('Selected Course', admission.selected_course, yPos);

  yPos += 5;

  // Section: Document Details
  doc.setFillColor(34, 139, 34);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Documents / ഡോക്യുമെന്റുകൾ', margin + 3, yPos + 6);
  doc.setTextColor(0, 0, 0);
  yPos += 15;

  const docs = additionalData.documents || {};
  yPos = addRow('Student Photo', docs.photo ? '✓ Uploaded' : '✗ Not uploaded', yPos);
  yPos = addRow('Aadhaar Card', docs.aadhaar ? '✓ Uploaded' : '✗ Not uploaded', yPos);
  yPos = addRow('Birth Certificate', docs.birthCertificate ? '✓ Uploaded' : '✗ Not uploaded', yPos);
  yPos = addRow('TC Copy', docs.tc ? '✓ Uploaded' : '✗ Not uploaded', yPos);

  yPos += 5;

  // Additional Notes
  if (additionalData.notes) {
    doc.setFillColor(34, 139, 34);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('Additional Information / അധിക വിവരങ്ങൾ', margin + 3, yPos + 6);
    doc.setTextColor(0, 0, 0);
    yPos += 15;
    yPos = addText(additionalData.notes, margin, yPos, pageWidth - 2 * margin);
  }

  // Application Status
  yPos += 10;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Application Status:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  if (admission.approved) {
    doc.setTextColor(34, 139, 34);
    doc.text('APPROVED / അംഗീകരിച്ചു', margin + 40, yPos);
  } else {
    doc.setTextColor(200, 150, 0);
    doc.text('PENDING / കാത്തിരിക്കുന്നു', margin + 40, yPos);
  }
  doc.setTextColor(0, 0, 0);

  yPos += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Submission Date:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(admission.created_at).toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short'
  }), margin + 40, yPos);

  yPos += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Application ID:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(admission.id.substring(0, 8).toUpperCase(), margin + 40, yPos);

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('This document was generated automatically from JDSA Admission Portal', pageWidth / 2, footerY, { align: 'center' });
  doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, pageWidth / 2, footerY + 5, { align: 'center' });

  // Save the PDF
  const fileName = `JDSA_Application_${admission.student_name.replace(/\s+/g, '_')}_${admission.id.substring(0, 8)}.pdf`;
  doc.save(fileName);
}
