import type { Editor } from '@tiptap/react';

/**
 * Saves a file using the Native File System Access API (window.showSaveFilePicker)
 * allowing the user to select the destination folder and filename in Finder / File Explorer.
 * Gracefully falls back to browser standard download on unsupported platforms.
 */
export async function saveExportedFile(
  blob: Blob,
  defaultFilename: string,
  options?: {
    description?: string;
    accept?: Record<string, string[]>;
  }
): Promise<void> {
  // Check if browser supports File System Access API (Chrome, Edge, Opera, Chromium)
  if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
    try {
      const pickerOptions: {
        suggestedName: string;
        types?: Array<{ description: string; accept: Record<string, string[]> }>;
      } = {
        suggestedName: defaultFilename,
        types: options
          ? [
              {
                description: options.description || 'Exported Document',
                accept: options.accept || { [blob.type]: [`.${defaultFilename.split('.').pop()}`] },
              },
            ]
          : undefined,
      };

      // Open native OS File Picker dialog (Finder/Explorer)
      const handle = await (window as unknown as {
        showSaveFilePicker: (opts: typeof pickerOptions) => Promise<FileSystemFileHandle>;
      }).showSaveFilePicker(pickerOptions);

      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (err: unknown) {
      // User cancelled picker -> exit without triggering fallback download
      if ((err as Error)?.name === 'AbortError') {
        return;
      }
      console.warn('showSaveFilePicker fallback:', err);
    }
  }

  // Fallback for Firefox, Safari, mobile browsers
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = defaultFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Helper: renders editor content inside an isolated DOM sandbox to avoid Tailwind v4 oklch color parsing errors in html2canvas
 */
async function renderContentToCanvas(editor: Editor, scale: number = 2): Promise<HTMLCanvasElement> {
  const { default: html2canvas } = await import('html2canvas');

  const contentHtml = editor.getHTML();
  const attributes = editor.options.editorProps?.attributes as Record<string, string> | undefined;
  const styleAttr = attributes?.style || '';
  const dir = attributes?.dir || 'rtl';

  // Extract font attributes or fallback
  const fontFamily =
    styleAttr.match(/font-family:\s*([^;]+)/)?.[1] || '"Amiri", "Noto Naskh Arabic", serif';
  const fontSize = styleAttr.match(/font-size:\s*([^;]+)/)?.[1] || '26px';
  const lineHeight = styleAttr.match(/line-height:\s*([^;]+)/)?.[1] || '2.0';

  // Create isolated container in DOM
  const container = document.createElement('div');
  container.id = 'kitaba-export-sandbox';
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '820px';
  container.style.minHeight = '600px';
  container.style.backgroundColor = '#FFFFFF';
  container.style.color = '#000000';
  container.style.padding = '40px 50px';
  container.style.boxSizing = 'border-box';
  container.style.direction = dir;
  container.style.fontFamily = fontFamily;
  container.style.fontSize = fontSize;
  container.style.lineHeight = lineHeight;
  container.style.unicodeBidi = 'bidi-override';

  container.innerHTML = `
    <div style="font-family: ${fontFamily}; font-size: ${fontSize}; line-height: ${lineHeight}; direction: ${dir}; color: #000000;">
      ${contentHtml}
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale,
      useCORS: true,
      backgroundColor: '#FFFFFF',
      logging: false,
      onclone: (clonedDoc) => {
        // Strip app stylesheets that contain unsupported oklch color functions in html2canvas
        const styles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
        styles.forEach((s) => s.remove());

        // Re-inject safe stylesheet with standard hex/rgb colors
        const safeStyle = clonedDoc.createElement('style');
        safeStyle.textContent = `
          * { box-sizing: border-box; }
          body { background-color: #ffffff !important; color: #000000 !important; margin: 0; }
          #kitaba-export-sandbox { background-color: #ffffff !important; color: #000000 !important; }
          p { margin: 0 0 0.6em 0; }
          .waqaf-sign {
            display: inline-block;
            color: #A67A25 !important;
            font-size: 0.9em;
            margin: 0 0.15em;
            vertical-align: super;
          }
          .ayah-number {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 1.8em;
            height: 1.8em;
            border: 2px solid #C6922B !important;
            border-radius: 50%;
            font-size: 0.7em;
            margin: 0 0.25em;
            color: #8B6420 !important;
            font-family: sans-serif;
          }
        `;
        clonedDoc.head.appendChild(safeStyle);
      },
    });

    return canvas;
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * Export editor content as a standalone HTML file with embedded fonts and styling
 */
export async function exportHTML(editor: Editor, filename: string = 'document'): Promise<void> {
  const content = editor.getHTML();
  const attributes = editor.options.editorProps?.attributes as Record<string, string> | undefined;
  const styleAttr = attributes?.style || '';
  const dir = attributes?.dir || 'rtl';
  const fontFamily =
    styleAttr.match(/font-family:\s*([^;]+)/)?.[1] || '"Amiri", "Noto Naskh Arabic", serif';
  const fontSize = styleAttr.match(/font-size:\s*([^;]+)/)?.[1] || '26px';
  const lineHeight = styleAttr.match(/line-height:\s*([^;]+)/)?.[1] || '2.0';

  const html = `<!DOCTYPE html>
<html lang="${dir === 'rtl' ? 'ar' : 'id'}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${filename}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Noto+Naskh+Arabic:wght@400;700&family=Scheherazade+New:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: ${fontFamily};
      direction: ${dir};
      unicode-bidi: bidi-override;
      line-height: ${lineHeight};
      font-size: ${fontSize};
      max-width: 820px;
      margin: 2rem auto;
      padding: 2.5rem 3rem;
      color: #111111;
      background-color: #ffffff;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      border-radius: 4px;
    }
    p { margin-bottom: 0.6em; }
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
      width: 1.8em;
      height: 1.8em;
      border: 2px solid #C6922B;
      border-radius: 50%;
      font-size: 0.7em;
      margin: 0 0.25em;
      color: #8B6420;
      font-family: sans-serif;
    }
    @media print {
      body {
        margin: 0;
        padding: 1cm;
        box-shadow: none;
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
${content}
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  await saveExportedFile(blob, `${filename}.html`, {
    description: 'HTML Web Document',
    accept: { 'text/html': ['.html', '.htm'] },
  });
}

/**
 * Export editor content as plain Unicode Arabic/Latin text
 */
export async function exportPlainText(editor: Editor, filename: string = 'document'): Promise<void> {
  const text = editor.getText();
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  await saveExportedFile(blob, `${filename}.txt`, {
    description: 'Plain Text Document',
    accept: { 'text/plain': ['.txt'] },
  });
}

/**
 * Export editor content as PDF using isolated canvas + jsPDF
 */
export async function exportPDF(editor: Editor, filename: string = 'document'): Promise<void> {
  const { default: jsPDF } = await import('jspdf');

  const canvas = await renderContentToCanvas(editor, 2);
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

  const pdfBlob = pdf.output('blob');
  await saveExportedFile(pdfBlob, `${filename}.pdf`, {
    description: 'PDF Document',
    accept: { 'application/pdf': ['.pdf'] },
  });
}

/**
 * Export editor content as PNG or JPG image
 */
export async function exportImage(
  editor: Editor,
  filename: string = 'document',
  format: 'png' | 'jpg' = 'png'
): Promise<void> {
  const canvas = await renderContentToCanvas(editor, 2);
  const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
  const quality = format === 'jpg' ? 0.95 : undefined;

  const blob: Blob = await new Promise((resolve) => {
    canvas.toBlob(
      (b) => {
        resolve(b || new Blob([], { type: mimeType }));
      },
      mimeType,
      quality
    );
  });

  await saveExportedFile(blob, `${filename}.${format}`, {
    description: format === 'jpg' ? 'JPEG Image' : 'PNG Image',
    accept: { [mimeType]: [`.${format}`] },
  });
}

/**
 * Export editor content as RTF
 */
export async function exportRTF(editor: Editor, filename: string = 'document'): Promise<void> {
  const html = editor.getHTML();

  let rtf = '{\\rtf1\\ansi\\deff0';
  rtf += '{\\fonttbl{\\f0\\fnil\\fcharset178 Amiri;}}';
  rtf += '\\viewkind4\\uc1\\pard\\lang1033\\f0\\fs48\\qr ';

  const div = document.createElement('div');
  div.innerHTML = html;
  const text = div.textContent || '';

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
  const blob = new Blob([rtf], { type: 'application/rtf' });
  await saveExportedFile(blob, `${filename}.rtf`, {
    description: 'Rich Text Format (RTF)',
    accept: { 'application/rtf': ['.rtf'] },
  });
}
