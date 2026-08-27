import type { Editor } from '@tiptap/react';

/**
 * Export editor content as a standalone HTML file with embedded fonts and styling
 */
export async function exportHTML(editor: Editor, filename: string = 'document'): Promise<void> {
  const content = editor.getHTML();
  const fontFamily = editor.options.editorProps?.attributes
    ? (editor.options.editorProps.attributes as Record<string, string>).style?.match(/font-family:\s*([^;]+)/)?.[1] || 'Amiri, serif'
    : 'Amiri, serif';

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${filename}</title>
  <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: ${fontFamily};
      direction: rtl;
      unicode-bidi: bidi-override;
      line-height: 2;
      font-size: 24px;
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 2rem;
      color: #1a1a1a;
    }
    p { margin-bottom: 0.5em; }
    .waqaf-sign {
      display: inline-block;
      color: #A67A25;
      font-size: 0.9em;
      margin: 0 0.15em;
      vertical-align: super;
    }
    .ayah-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2em;
      height: 2em;
      border: 2px solid #C6922B;
      border-radius: 50%;
      font-size: 0.7em;
      margin: 0 0.25em;
      color: #8B6420;
      font-family: sans-serif;
    }
    @media print {
      body { margin: 0; padding: 1cm; font-size: 14pt; }
    }
  </style>
</head>
<body>
${content}
</body>
</html>`;

  downloadFile(html, `${filename}.html`, 'text/html');
}

/**
 * Export editor content as plain Unicode Arabic text
 */
export function exportPlainText(editor: Editor, filename: string = 'document'): void {
  const text = editor.getText();
  downloadFile(text, `${filename}.txt`, 'text/plain;charset=utf-8');
}

/**
 * Export editor content as PDF using html2canvas + jsPDF
 */
export async function exportPDF(editor: Editor, filename: string = 'document'): Promise<void> {
  const { default: jsPDF } = await import('jspdf');
  const { default: html2canvas } = await import('html2canvas');

  const editorElement = (editor?.view?.dom as HTMLElement) || (document.querySelector('.tiptap') as HTMLElement);
  if (!editorElement) return;

  const canvas = await html2canvas(editorElement, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const imgX = (pdfWidth - imgWidth * ratio) / 2;

  // Handle multi-page
  const pageHeight = pdfHeight / ratio;
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', imgX, 0, imgWidth * ratio, imgHeight * ratio);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position -= pdfHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
    heightLeft -= pageHeight;
  }

  pdf.save(`${filename}.pdf`);
}

/**
 * Export editor content as PNG image
 */
export async function exportImage(
  editor: Editor,
  filename: string = 'document',
  format: 'png' | 'jpg' = 'png'
): Promise<void> {
  const { default: html2canvas } = await import('html2canvas');

  const editorElement = (editor?.view?.dom as HTMLElement) || (document.querySelector('.tiptap') as HTMLElement);
  if (!editorElement) return;

  const canvas = await html2canvas(editorElement, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
  });

  const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
  const dataUrl = canvas.toDataURL(mimeType, 0.95);

  const link = document.createElement('a');
  link.download = `${filename}.${format}`;
  link.href = dataUrl;
  link.click();
}

/**
 * Export editor content as RTF
 */
export function exportRTF(editor: Editor, filename: string = 'document'): void {
  const html = editor.getHTML();

  // Basic HTML to RTF conversion
  let rtf = '{\\rtf1\\ansi\\deff0';
  rtf += '{\\fonttbl{\\f0\\fnil\\fcharset178 Amiri;}}';
  rtf += '\\viewkind4\\uc1\\pard\\lang1033\\f0\\fs48\\qr '; // RTL, right-aligned

  // Strip HTML tags and convert to RTF-safe text
  const div = document.createElement('div');
  div.innerHTML = html;
  const text = div.textContent || '';

  // Encode Arabic characters as Unicode RTF
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code > 127) {
      rtf += `\\u${code}?`;
    } else if (char === '\\') {
      rtf += '\\\\';
    } else if (char === '{') {
      rtf += '\\{';
    } else if (char === '}') {
      rtf += '\\}';
    } else if (char === '\n') {
      rtf += '\\par ';
    } else {
      rtf += char;
    }
  }

  rtf += '}';
  downloadFile(rtf, `${filename}.rtf`, 'application/rtf');
}

/**
 * Helper: trigger file download
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
