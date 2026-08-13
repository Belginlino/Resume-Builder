import mammoth from 'mammoth';

export const extractTextFromDOCX = async (fileOrArrayBuffer) => {
  try {
    let arrayBuffer;
    if (fileOrArrayBuffer instanceof File) {
      arrayBuffer = await fileOrArrayBuffer.arrayBuffer();
    } else {
      arrayBuffer = fileOrArrayBuffer;
    }

    const result = await mammoth.extractRawText({ arrayBuffer });
    return {
      text: result.value.trim(),
      metadata: {
        warnings: result.warnings
      }
    };
  } catch (error) {
    console.error('DOCX text extraction error:', error);
    throw new Error('Failed to parse DOCX file. Please verify the document format.');
  }
};
