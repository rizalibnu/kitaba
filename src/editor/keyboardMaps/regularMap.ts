/**
 * Regular Mode Keyboard Mapping (Phonetic Latin -> Arabic).
 * Includes authentic Nonosoft Khot Jawi/Pegon Shift letters, Lam Alif ligatures, and phonetic transliterations.
 */

export const REGULAR_MAP: Record<string, string> = {
  // Lowercase letters (Standard phonetic mapping)
  a: '\u0627', // ا (alif)
  b: '\u0628', // ب (ba)
  t: '\u062A', // ت (ta)
  j: '\u062C', // ج (jim)
  h: '\u062D', // ح (ha / hha)
  d: '\u062F', // د (dal)
  r: '\u0631', // ر (ra)
  z: '\u0632', // ز (zay)
  s: '\u0633', // س (sin)
  f: '\u0641', // ف (fa)
  q: '\u0642', // ق (qaf)
  k: '\u0643', // ك (kaf)
  l: '\u0644', // ل (lam)
  m: '\u0645', // م (mim)
  n: '\u0646', // ن (nun)
  w: '\u0648', // و (waw)
  y: '\u064A', // ي (ya)
  e: '\u0629', // ة (ta marbuta)
  i: '\u064A', // ي (ya / vowel i)
  u: '\u0648', // و (waw / vowel u)
  o: '\u0648', // و (waw / vowel o)
  c: '\u062C', // ج (jim)
  v: '\u0641', // ف (fa)
  p: '\u0628', // ب (ba)
  x: '\u062E', // خ (kha)

  // Uppercase letters / Shift Mappings (Authentic Nonosoft Jawi & Pegon Specification):
  E: '\u06A0', // ڠ (Nga / Ain titik 3 - Shift+E)
  D: '\u068E', // ڎ (Dza / Dal titik 3 - Shift+D)
  C: '\u0686', // چ (Cha / Jim titik 3 - Shift+C)
  N: '\u062B', // ث (Tsa - Shift+N)
  R: '\u067E', // پ (Pa / Ba titik 3 - Shift+R)
  F: '\u06A4', // ڤ (Fa titik 3 / Pa Jawi - Shift+F)
  V: '\u06A2', // ڢ (Fa titik 1 bawah Maghribi - Shift+V)
  T: '\u06A9', // ک (Kaf Jawi - Shift+T)
  G: '\u06AF', // ݢ / گ (Ga Jawi - Shift+G)
  B: '\u069F', // ڟ (Tho titik 3 - Shift+B)
  S: '\u0644\u0625', // لإ (Lam Alif with Hamzah below - Shift+S)
  L: '\u0644\u0627', // لا (Lam Alif - Shift+L)
  H: '\u0647', // ه (Ha bulat - Shift+H)
  A: '\u0649', // ى (Alif Maqsura - Shift+A)
  I: '\u0625', // إ (Alif Hamzah bawah - Shift+I)
  O: '\u0623', // أ (Alif Hamzah atas - Shift+O)
  U: '\u0621', // ء (Hamzah - Shift+U)
  Z: '\u0638', // ظ (Zha - Shift+Z)
  K: '\u0643', // ك (Kaf - Shift+K)
  J: '\u062C', // ج (Jim - Shift+J)
  M: '\u0645', // م (Mim - Shift+M)
  W: '\u0648', // و (Waw - Shift+W)
  Y: '\u064A', // ي (Ya - Shift+Y)
  Q: '\u0642', // ق (Qaf - Shift+Q)
  P: '\u067E', // پ (Pa - Shift+P)
  X: '\u062E', // خ (Kha - Shift+X)

  // Hamza & symbols
  "'": '\u0639', // ع (ain)
  '`': '\u0621', // ء (hamza)
  '~': '\u0653', // ۤ (maddah)
  '-': '\u0640', // ـ (tatweel / kashida)
  '_': '\u0640', // ـ (tatweel / kashida)
  ',': '\u060C', // ، (Arabic comma)
  ';': '\u061B', // ؛ (Arabic semicolon)
  '?': '\u061F', // ؟ (Arabic question mark)

  // Arabic-Indic Digits
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
};

/**
 * Multi-character phonetic combos for Regular mode.
 */
export const REGULAR_COMBOS: Record<string, string> = {
  ts: '\u062B', // ث (tsa)
  kh: '\u062E', // خ (kha)
  dz: '\u0630', // ذ (dzal)
  sy: '\u0634', // ش (syin)
  sh: '\u0635', // ص (shad)
  dh: '\u0636', // ض (dhad)
  th: '\u0637', // ط (tho)
  zh: '\u0638', // ظ (zho)
  gh: '\u0638', // غ (ghain) - alt: '\u063 غ'
  ny: '\u06BD', // ڽ (nya / jawi)
  ng: '\u06A0', // ڠ (nga / jawi)
};

/**
 * Set of prefix characters that could begin a two-character combo.
 */
export const COMBO_PREFIX_CHARS: ReadonlySet<string> = new Set(
  Object.keys(REGULAR_COMBOS).map((combo) => combo[0])
);
