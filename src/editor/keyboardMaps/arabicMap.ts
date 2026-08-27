/**
 * Arabic keyboard layout (ISO / Arabic Standard layout).
 * Follows the official Arabic keyboard layout widely used across Arabic-speaking countries,
 * including Arabic-Indic numerals and standard Arabic punctuation.
 */

export const ARABIC_MAP: Record<string, string> = {
  // Number row (Arabic-Indic digits)
  '0': '\u0660', // ٠
  '1': '\u0661', // ١
  '2': '\u0662', // ٢
  '3': '\u0663', // ٣
  '4': '\u0664', // ٤
  '5': '\u0665', // ٥
  '6': '\u0666', // ٦
  '7': '\u0667', // ٧
  '8': '\u0668', // ٨
  '9': '\u0669', // ٩
  '-': '-',
  '=': '=',

  // Top letter row
  '`': '\u0630', // ذ (thal)
  q: '\u0636', // ض (dhad)
  w: '\u0635', // ص (saad)
  e: '\u062B', // ث (theh)
  r: '\u0642', // ق (qaf)
  t: '\u0641', // ف (feh)
  y: '\u063A', // غ (ghain)
  u: '\u0639', // ع (ain)
  i: '\u0647', // ه (heh)
  o: '\u062E', // خ (khah)
  p: '\u062D', // ح (hah)
  '[': '\u062C', // ج (jeem)
  ']': '\u062F', // د (dal)
  '\\': '\\',

  // Home letter row
  a: '\u0634', // ش (sheen)
  s: '\u0633', // س (seen)
  d: '\u064A', // ي (yeh)
  f: '\u0628', // ب (beh)
  g: '\u0644', // ل (lam)
  h: '\u0627', // ا (alef)
  j: '\u062A', // ت (teh)
  k: '\u0646', // ن (noon)
  l: '\u0645', // م (meem)
  ';': '\u0643', // ك (kaf)
  "'": '\u0637', // ط (tah)

  // Bottom letter row
  z: '\u0626', // ئ (yeh with hamza above)
  x: '\u0621', // ء (hamza)
  c: '\u0624', // ؤ (waw with hamza above)
  v: '\u0631', // ر (reh)
  b: '\u0644\u0627', // لا (lam alef)
  n: '\u0649', // ى (alef maksura)
  m: '\u0629', // ة (teh marbuta)
  ',': '\u0648', // و (waw)
  '.': '\u0632', // ز (zain)
  '/': '\u0638', // ظ (zah)
};

export const ARABIC_SHIFT_MAP: Record<string, string> = {
  // Number row with Shift
  '~': '\u0651', // ّ (shaddah / tasydid)
  '!': '!',
  '@': '@',
  '#': '#',
  $: '$',
  '%': '\u066A', // ٪ (Arabic percent sign)
  '^': '^',
  '&': '&',
  '*': '*',
  '(': ')', // Mirrored RTL parenthesis
  ')': '(', // Mirrored RTL parenthesis
  _: '\u0640', // ـ (tatweel)
  '+': '+',

  // Top row with Shift
  Q: '\u064E', // َ (fathah)
  q: '\u064E',
  W: '\u064B', // ً (tanwin fathah)
  w: '\u064B',
  E: '\u064F', // ُ (dhammah)
  e: '\u064F',
  R: '\u064C', // ٌ (tanwin dhammah)
  r: '\u064C',
  T: '\u0644\u0625', // لإ (lam with alef below hamza)
  t: '\u0644\u0625',
  Y: '\u0625', // إ (alef below hamza)
  y: '\u0625',
  U: '\u2018', // ‘
  u: '\u2018',
  I: '\u00F7', // ÷
  i: '\u00F7',
  O: '\u00D7', // ×
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
  S: '\u064D', // ٍ (tanwin kasrah)
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
  B: '\u0644\u0622', // لآ (lam with alef madda)
  b: '\u0644\u0622',
  N: '\u0622', // آ (alef with madda above)
  n: '\u0622',
  M: '\u2019', // ’
  m: '\u2019',
  '<': ',',
  ',': ',',
  '>': '.',
  '.': '.',
  '?': '\u061F', // ؟ (Arabic question mark)
  '/': '\u061F',
};
