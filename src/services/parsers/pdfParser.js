import * as pdfjsLib from 'pdfjs-dist';

// Set worker source for pdfjs-dist
if (typeof window !== 'undefined' && 'Worker' in window) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
  } catch (e) {
    console.warn('PDF.js worker initialization warning:', e);
  }
}

export const extractTextFromPDF = async (fileOrArrayBuffer) => {
  try {
    let arrayBuffer;
    if (fileOrArrayBuffer instanceof File) {
      arrayBuffer = await fileOrArrayBuffer.arrayBuffer();
    } else {
      arrayBuffer = fileOrArrayBuffer;
    }

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    const metadata = {
      numPages: pdf.numPages,
      hasImagesOrTables: false
    };

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
      
      // Basic heuristic for complex layout detection
      if (content.items.length > 200) {
        metadata.hasImagesOrTables = true;
      }
    }

    return {
      text: fullText.trim(),
      metadata
    };
  } catch (error) {
    console.error('PDF text extraction error:', error);
    throw new Error('Failed to parse PDF document. Please verify the file is a valid readable PDF.');
  }
};

