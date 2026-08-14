import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const exportResumeToPDF = async (elementId, rawFilename = 'Resume.pdf') => {
  // Ensure the filename strictly ends with .pdf and has valid characters
  let cleanName = (rawFilename || 'Resume.pdf').trim();
  cleanName = cleanName.replace(/\.pdf$/i, ''); // Strip existing .pdf
  cleanName = cleanName.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim(); // Remove invalid filename characters
  if (!cleanName) cleanName = 'Resume';
  const filename = `${cleanName}.pdf`;

  const fallbackElement = document.getElementById('resume-a4-preview') || document.getElementById('resume-builder-preview-box');
  const targetElement = document.getElementById(elementId) || fallbackElement;
  if (!targetElement) {
    throw new Error(`Resume preview container #${elementId} was not found.`);
  }

  const captureTarget = targetElement.querySelector?.('.a4-page') || targetElement;

  try {
    // Render at a fixed high DPI for crisp output (300 dpi A4)
    const A4_MM = { width: 210, height: 297 };
    const TARGET_DPI = 300; // high-quality print DPI
    const cssPxPerInch = 96; // standard CSS reference
    const scale = TARGET_DPI / cssPxPerInch;

    const canvas = await html2canvas(captureTarget, {
      scale,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#FFFFFF',
      onclone: (clonedDoc) => {
        const clonedTarget = clonedDoc.querySelector('.a4-page') || clonedDoc.getElementById(elementId) || clonedDoc.getElementById('resume-builder-preview-box') || clonedDoc.getElementById('resume-a4-preview');
        if (clonedTarget) {
          clonedTarget.style.transform = 'none';
          clonedTarget.style.transformOrigin = 'initial';
          clonedTarget.style.margin = '0';
          // Force the cloned node to A4 CSS dimensions so html2canvas renders consistent physical size
          clonedTarget.style.width = `${A4_MM.width}mm`;
          clonedTarget.style.height = `${A4_MM.height}mm`;
        }

        const parentWrapper = clonedTarget?.parentElement;
        if (parentWrapper) {
          parentWrapper.style.transform = 'none';
          parentWrapper.style.transformOrigin = 'initial';
          parentWrapper.style.margin = '0';
        }
      }
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    const pdfBlob = pdf.output('blob');
    const typedBlob = new Blob([pdfBlob], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(typedBlob);

    let downloaded = false;

    // Check if running in a sandbox/iframe and bypass name stripping using a temporary top-level popup tab
    try {
      const isIframe = window.self !== window.top;
      if (isIframe) {
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          const doc = newWindow.document;
          const a = doc.createElement('a');
          a.href = blobUrl;
          a.setAttribute('download', filename);
          doc.body.appendChild(a);
          a.click();
          setTimeout(() => {
            newWindow.close();
          }, 350);
          downloaded = true;
        }
      }
    } catch (e) {
      console.warn('Sandbox bypass window blocked, using default fallback:', e);
    }

    if (!downloaded) {
      const downloadLink = document.createElement('a');
      downloadLink.style.display = 'none';
      downloadLink.href = blobUrl;
      downloadLink.setAttribute('download', filename);
      document.body.appendChild(downloadLink);
      downloadLink.click();

      setTimeout(() => {
        if (document.body.contains(downloadLink)) {
          document.body.removeChild(downloadLink);
        }
        URL.revokeObjectURL(blobUrl);
      }, 1500);
    }

    return true;
  } catch (error) {
    console.error('PDF generation error:', error);
    window.print();
    return false;
  }
};


export const printResume = () => {
  window.print();
};

export const generateResumePlainText = (resume) => {
  if (!resume) return '';
  const info = resume.personalInfo || {};
  const lines = [];

  // Header
  lines.push((info.fullName || 'FULL NAME').toUpperCase());
  if (info.professionalTitle) lines.push(info.professionalTitle);
  const contacts = [info.email, info.phone, info.location, info.linkedin, info.github, info.portfolio].filter(Boolean);
  if (contacts.length > 0) lines.push(contacts.join(' | '));
  lines.push('');

  // Summary
  if (resume.summary) {
    lines.push('PROFESSIONAL SUMMARY');
    lines.push('---------------------');
    lines.push(resume.summary);
    lines.push('');
  }

  // Work Experience
  if (resume.experience && resume.experience.length > 0) {
    lines.push('WORK EXPERIENCE');
    lines.push('----------------');
    resume.experience.forEach(exp => {
      lines.push(`${exp.jobTitle} - ${exp.company} (${exp.startDate} - ${exp.currentPosition ? 'Present' : exp.endDate})`);
      if (exp.location) lines.push(`Location: ${exp.location}`);
      if (exp.description) lines.push(exp.description);
      if (exp.achievements && exp.achievements.length > 0) {
        exp.achievements.filter(Boolean).forEach(a => lines.push(`* ${a}`));
      }
      lines.push('');
    });
  }

  // Skills
  if (resume.skills) {
    lines.push('SKILLS & COMPETENCIES');
    lines.push('---------------------');
    if (Array.isArray(resume.skills)) {
      lines.push(resume.skills.join(', '));
    } else if (typeof resume.skills === 'object') {
      Object.entries(resume.skills).forEach(([k, v]) => {
        const list = Array.isArray(v) ? v.join(', ') : v;
        if (list) lines.push(`${k.toUpperCase()}: ${list}`);
      });
    }
    lines.push('');
  }

  // Education
  if (resume.education && resume.education.length > 0) {
    lines.push('EDUCATION');
    lines.push('---------');
    resume.education.forEach(edu => {
      lines.push(`${edu.degree} - ${edu.institution} (${edu.startDate} - ${edu.endDate})`);
      if (edu.gpa) lines.push(`GPA: ${edu.gpa}`);
      if (edu.coursework) lines.push(`Coursework: ${edu.coursework}`);
      lines.push('');
    });
  }

  // Projects
  if (resume.projects && resume.projects.length > 0) {
    lines.push('PROJECTS');
    lines.push('--------');
    resume.projects.forEach(p => {
      lines.push(`${p.name} ${p.technologies ? `(${Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies})` : ''}`);
      if (p.description) lines.push(p.description);
      if (p.projectUrl) lines.push(`URL: ${p.projectUrl}`);
      lines.push('');
    });
  }

  // Certifications
  if (resume.certifications && resume.certifications.length > 0) {
    lines.push('CERTIFICATIONS');
    lines.push('--------------');
    resume.certifications.forEach(c => {
      lines.push(`${c.name} - ${c.organization} (${c.date || ''})`);
    });
    lines.push('');
  }

  return lines.join('\n');
};

export const exportResumeToPlainText = (resume, filename = 'Resume.txt') => {
  const text = generateResumePlainText(resume);
  const typedBlob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const blobUrl = URL.createObjectURL(typedBlob);

  let downloaded = false;
  try {
    const isIframe = window.self !== window.top;
    if (isIframe) {
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        const doc = newWindow.document;
        const a = doc.createElement('a');
        a.href = blobUrl;
        a.setAttribute('download', filename);
        doc.body.appendChild(a);
        a.click();
        setTimeout(() => {
          newWindow.close();
        }, 350);
        downloaded = true;
      }
    }
  } catch (e) {
    console.warn('Sandbox bypass window blocked:', e);
  }

  if (!downloaded) {
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = blobUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    }, 1500);
  }
};

export const exportResumeToJSON = (resume, filename = 'Resume.json') => {
  const json = JSON.stringify(resume, null, 2);
  const typedBlob = new Blob([json], { type: 'application/json;charset=utf-8' });
  const blobUrl = URL.createObjectURL(typedBlob);

  let downloaded = false;
  try {
    const isIframe = window.self !== window.top;
    if (isIframe) {
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        const doc = newWindow.document;
        const a = doc.createElement('a');
        a.href = blobUrl;
        a.setAttribute('download', filename);
        doc.body.appendChild(a);
        a.click();
        setTimeout(() => {
          newWindow.close();
        }, 350);
        downloaded = true;
      }
    }
  } catch (e) {
    console.warn('Sandbox bypass window blocked:', e);
  }

  if (!downloaded) {
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = blobUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    }, 1500);
  }
};



