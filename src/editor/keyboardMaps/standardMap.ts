/**
 * Standard QWERTY to Arabic keyboard mapping (Windows Arabic 101 layout).
 * Maps standard QWERTY physical keys to Arabic characters and harakat with Shift.
 */

export const STANDARD_MAP: Record<string, string> = {
  // Top row
  '`': '\u0630', // ذ (thal)
  q: '\u0636', // ض (dhad / daad)
  w: '\u0635', // ص (shad / saad)
  e: '\u062B', // ث (theh / tsa)
  r: '\u0642', // ق (qaf)
  t: '\u0641', // ف (feh / fa)
  y: '\u063A', // غ (ghain)
  u: '\u0639', // ع (ain)
  i: '\u0647', // ه (heh / ha)
  o: '\u062E', // خ (khah / kha)
  p: '\u062D', // ح (hah / hha)
  '[': '\u062C', // ج (jeem / jim)
  ']': '\u062F', // د (dal)
  '\\': '\\',

  // Home row
  a: '\u0634', // ش (sheen / syin)
  s: '\u0633', // س (seen / sin)
  d: '\u064A', // ي (yeh / ya)
  f: '\u0628', // ب (beh / ba)
  g: '\u0644', // ل (lam)
  h: '\u0627', // ا (alef / alif)
  j: '\u062A', // ت (teh / ta)
  k: '\u0646', // ن (noon / nun)
  l: '\u0645', // م (meem / mim)
  ';': '\u0643', // ك (kaf)
  "'": '\u0637', // ط (tah / tho)

  // Bottom row
  z: '\u0626', // ئ (yeh with hamza above)
  x: '\u0621', // ء (hamza)
  c: '\u0624', // ؤ (waw with hamza above)
  v: '\u0631', // ر (reh / ra)
  b: '\u0644\u0627', // لا (lam alef ligature)
  n: '\u0649', // ى (alef maksura)
  m: '\u0629', // ة (teh marbuta)
  ',': '\u0648', // و (waw)
  '.': '\u0632', // ز (zain / zay)
  '/': '\u0638', // ظ (zah / zho)

  // Numbers (Standard layout keeps standard numbers or default numerals)
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
};

export const STANDARD_SHIFT_MAP: Record<string, string> = {
  // Top row with Shift
  '~': '\u0651', // ّ (shaddah / tasydid)
  Q: '\u064E', // َ (fathah)
  q: '\u064E',
  W: '\u064B', // ً (tanwin fathah / fathatan)
  w: '\u064B',
  E: '\u064F', // ُ (dhammah)
  e: '\u064F',
  R: '\u064C', // ٌ (tanwin dhammah / dhammatan)
  r: '\u064C',
  T: '\u0644\u0625', // لإ (lam with alef below hamza)
  t: '\u0644\u0625',
  Y: '\u0625', // إ (alef with hamza below)
  y: '\u0625',
  U: '\u2018', // ‘ (left single quotation mark)
  u: '\u2018',
  I: '\u00F7', // ÷ (division sign)
  i: '\u00F7',
  O: '\u00D7', // × (multiplication sign)
  o: '\u00D7',
  P: '\u061B', // ؛ (Arabic semicolon)
  p: '\u061B',
  '{': '<',
  '[': '<',
  '}': '>',
  ']': '>',
  '|': '|',

  // Home row with Shift
  A: '\u0650', // ِ (kasrah)
  a: '\u0650',
  S: '\u064D', // ٍ (tanwin kasrah / kasratan)
  s: '\u064D',
  D: ']',
  d: ']',
  F: '[',
  f: '[',
  G: '\u0644\u0623', // لأ (lam with alef above hamza)
  g: '\u0644\u0623',
  H: '\u0623', // أ (alef with hamza above)
  h: '\u0623',
  J: '\u0640', // ـ (tatweel / kashida)
  j: '\u0640',
  K: '\u060C', // ، (Arabic comma)
  k: '\u060C',
  L: '/',
  l: '/',
  ':': ':',
  ';': ':',
  '"': '"',
  "'": '"',

  // Bottom row with Shift
  Z: '~',
  z: '~',
  X: '\u0652', // ْ (sukun)
  x: '\u0652',
  C: '}',
  c: '}',
  V: '{',
  v: '{',
  B: '\u0644\u0622', // لآ (lam with alef with madda above)
  b: '\u0644\u0622',
  N: '\u0622', // آ (alef with madda above)
  n: '\u0622',
  M: '\u2019', // ’ (right single quotation mark)
  m: '\u2019',
  '<': ',',
  ',': ',',
  '>': '.',
  '.': '.',
  '?': '\u061F', // ؟ (Arabic question mark)
  '/': '\u061F',

  // Number row with Shift
  '!': '!',
  '@': '@',
  '#': '#',
  $: '$',
  '%': '\u066A', // ٪ (Arabic percent sign)
  '^': '^',
  '&': '&',
  '*': '*',
  '(': ')', // RTL mirrored bracket
  ')': '(', // RTL mirrored bracket
  _: '\u0640', // ـ (tatweel)
  '+': '+',
};
