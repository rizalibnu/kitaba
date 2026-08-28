/**
 * Parser for Nonosoft Khot (.kht) and RTF Arabic document files.
 * Converts legacy ANSI-encoded Nono Arabic font streams and standard Unicode RTF into clean HTML for Tiptap.
 */

// Legacy Nonosoft Nono Arabic font ANSI glyph mapping to standard Unicode Arabic
const NONO_ANSI_TO_ARABIC: Record<number, string> = {
  // ASCII letter mappings
  65: '\u0627', // A -> Alif
  66: '\u0628', // B -> Ba
  67: '\u062C', // C -> Jim
  68: '\u062F', // D -> Dal
  69: '\u0629', // E -> Ta Marbutah
  70: '\u0641', // F -> Fa
  71: '\u063A', // G -> Ghain
  72: '\u0647', // H -> Ha bulat
  73: '\u064A', // I -> Ya
  74: '\u062C', // J -> Jim
  75: '\u0643', // K -> Kaf
  76: '\u0644', // L -> Lam
  77: '\u0645', // M -> Mim
  78: '\u0646', // N -> Nun
  79: '\u0648', // O -> Waw
  80: '\u0628', // P -> Ba
  81: '\u0642', // Q -> Qaf
  82: '\u0631', // R -> Ra
  83: '\u0633', // S -> Sin
  84: '\u062A', // T -> Ta
  85: '\u0648', // U -> Waw
  86: '\u0641', // V -> Fa
  87: '\u0648', // W -> Waw
  88: '\u062E', // X -> Kha
  89: '\u064A', // Y -> Ya
  90: '\u0632', // Z -> Zay

  97: '\u0627', // a -> Alif
  98: '\u0628', // b -> Ba
  99: '\u0635', // c -> Shad
  100: '\u062F', // d -> Dal
  101: '\u0629', // e -> Ta Marbutah
  102: '\u0641', // f -> Fa
  103: '\u063A', // g -> Ghain
  104: '\u062D', // h -> Ha pedas
  105: '\u0650', // i -> Kasrah
  106: '\u062C', // j -> Jim
  107: '\u0643', // k -> Kaf
  108: '\u0644', // l -> Lam
  109: '\u0645', // m -> Mim
  110: '\u0646', // n -> Nun
  111: '\u064F', // o -> Dhammah
  112: '\u0628', // p -> Ba
  113: '\u0642', // q -> Qaf
  114: '\u0631', // r -> Ra
  115: '\u0633', // s -> Sin
  116: '\u062A', // t -> Ta
  117: '\u064F', // u -> Dhammah
  118: '\u062B', // v -> Tsa
  119: '\u0648', // w -> Waw
  120: '\u062E', // x -> Kha
  121: '\u064A', // y -> Ya
  122: '\u0632', // z -> Zay

  // Harakat & Symbols mapped from Nonosoft ANSI numbers & punctuation
  48: '\u0652', // 0 -> Sukun
  49: '\u064E', // 1 -> Fathah
  50: '\u0650', // 2 -> Kasrah
  51: '\u064F', // 3 -> Dhammah
  52: '\u064B', // 4 -> Fathatain
  53: '\u064D', // 5 -> Kasratain
  54: '\u064C', // 6 -> Dhammatain
  55: '\u0651', // 7 -> Tasydid
  56: '\u0653', // 8 -> Maddah
  57: '\u064E', // 9 -> Fathah / Harakat

  // Extended ANSI hex codes
  224: '\u064E', // \'e0 -> Fathah
  225: '\u0650', // \'e1 -> Kasrah
  226: '\u064F', // \'e2 -> Dhammah
  227: '\u064E', // \'e3 -> Fathah
  228: '\u064B', // \'e4 -> Fathatain
  229: '\u064D', // \'e5 -> Kasratain
  230: '\u064C', // \'e6 -> Dhammatain
  231: '\u0651', // \'e7 -> Tasydid
  232: '\u0652', // \'e8 -> Sukun
  233: '\u0653', // \'e9 -> Maddah
};

export interface ParsedKhtResult {
  title: string;
  html: string;
  rawText: string;
}

/**
 * Parses a .kht (or .rtf / .txt) raw string into HTML suitable for Tiptap editor
 */
export function parseKhtContent(rawContent: string, filename: string = 'Untitled'): ParsedKhtResult {
  const isRtf = rawContent.trimStart().startsWith('{\\rtf');

  if (!isRtf) {
    // If not RTF, treat as Plain Text / HTML
    const cleanLines = rawContent.split(/\r?\n/);
    const html = cleanLines
      .map((line) => `<p dir="rtl">${escapeHtml(line) || '&nbsp;'}</p>`)
      .join('');
    return {
      title: sanitizeDocTitle(filename),
      html: html || '<p dir="rtl"></p>',
      rawText: rawContent,
    };
  }

  // Parse RTF Content
  const cleanTitle = sanitizeDocTitle(filename);
  const paragraphs: string[] = [];
  let currentParagraph = '';
  let inHeader = true;

  // Track active font to know if we should translate Nono Arabic ANSI
  let isNonoArabicFont = true;

  // Regular expression to tokenize RTF control words, groups, escapes, and plain text
  const rtfTokenRegex = /\\([a-zA-Z]+)(-?\d+)? ?|\\\'([0-9a-fA-F]{2})|\\u(-?\d+)(?:\?[0-9a-zA-Z]?)?|(\r\n|\r|\n)|([{}])|([^\\{}\r\n]+)/g;

  let match: RegExpExecArray | null;

  while ((match = rtfTokenRegex.exec(rawContent)) !== null) {
    const [
      ,
      controlWord,
      ,
      hexEscape,
      unicodeChar,
      ,
      brace,
      plainText,
    ] = match;

    if (brace === '{') {
      // Begin group
      continue;
    }

    if (brace === '}') {
      // End group
      continue;
    }

    if (controlWord) {
      const cmd = controlWord.toLowerCase();

      // Check header end
      if (cmd === 'pard' || cmd === 'par' || cmd === 'line') {
        inHeader = false;
      }

      if (cmd === 'fonttbl') {
        // Font table info
        if (rawContent.includes('Nono Arabic') || rawContent.includes('Khot')) {
          isNonoArabicFont = true;
        }
      }

      if (cmd === 'par' || cmd === 'line' || cmd === 'sect') {
        if (currentParagraph.trim().length > 0) {
          paragraphs.push(currentParagraph.trim());
        }
        currentParagraph = '';
        continue;
      }

      // Formatting (bold, italic, etc.)
      if (cmd === 'b') {
        // bold
      }
      continue;
    }

    if (hexEscape) {
      inHeader = false;
      const code = parseInt(hexEscape, 16);
      if (isNonoArabicFont && NONO_ANSI_TO_ARABIC[code]) {
        currentParagraph += NONO_ANSI_TO_ARABIC[code];
      } else {
        // Convert Latin-1 / Windows-1252 code
        currentParagraph += String.fromCharCode(code);
      }
      continue;
    }

    if (unicodeChar) {
      inHeader = false;
      let code = parseInt(unicodeChar, 10);
      if (code < 0) {
        code += 65536; // Handle negative 16-bit integers in RTF
      }
      currentParagraph += String.fromCharCode(code);
      continue;
    }

    if (plainText && !inHeader) {
      let textChunk = plainText;

      // Filter out generator comments or color table tokens if leaked
      if (textChunk.includes('colortbl') || textChunk.includes('generator')) {
        continue;
      }

      // Convert characters if using legacy Nono Arabic font
      if (isNonoArabicFont) {
        let converted = '';
        for (let i = 0; i < textChunk.length; i++) {
          const ch = textChunk[i];
          const charCode = ch.charCodeAt(0);
          if (NONO_ANSI_TO_ARABIC[charCode]) {
            converted += NONO_ANSI_TO_ARABIC[charCode];
          } else {
            converted += ch;
          }
        }
        textChunk = converted;
      }

      currentParagraph += textChunk;
    }
  }

  if (currentParagraph.trim().length > 0) {
    paragraphs.push(currentParagraph.trim());
  }

  // Build HTML paragraphs
  const htmlResult = paragraphs.length > 0
    ? paragraphs.map((p) => `<p dir="rtl">${escapeHtml(p)}</p>`).join('')
    : '<p dir="rtl"></p>';

  const rawTextResult = paragraphs.join('\n');

  return {
    title: cleanTitle,
    html: htmlResult,
    rawText: rawTextResult,
  };
}

/**
 * Strips file extension and special chars for clean document title
 */
function sanitizeDocTitle(filename: string): string {
  const base = filename.replace(/\.(kht|rtf|txt|html?)$/i, '').trim();
  return base || 'Dokumen Import';
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
