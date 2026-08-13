import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const exportResumeToPDF = async (elementId, filename = 'Resume.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Resume preview container #${elementId} was not found.`);
  }

  try {
    // Standard high resolution canvas capture
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#FFFFFF',
      windowWidth: 1200
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('PDF generation error:', error);
    // Fallback to native print dialog if canvas fails
    window.print();
    return false;
  }
};

export const printResume = () => {
  window.print();
};
