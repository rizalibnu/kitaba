/**
 * Regular mode keyboard mapping (Phonetic Latin to Arabic).
 * Maps Latin characters and combinations to Arabic Unicode letters based on phonetic similarity.
 *
 * Examples:
 * a → ا, b → ب, t → ت, ts → ث, j → ج, h → ح, kh → خ, d → د, dz → ذ,
 * r → ر, z → ز, s → س, sy → ش, sh → ص, dh → ض, th → ط, zh → ظ,
 * ' → ع, gh → غ, f → ف, q → ق, k → ك, l → ل, m → م, n → ن,
 * w → و, H → ه, y → ي, e → ة, A → ى, ` → ء
 */

/**
 * Two-character phonetic combinations mapping to single Arabic letters.
 */
export const REGULAR_COMBOS: Record<string, string> = {
  ts: '\u062B', // ث (tsa / theh)
  kh: '\u062E', // خ (kha / khah)
  dz: '\u0630', // ذ (dzal / thal)
  sy: '\u0634', // ش (syin / sheen)
  sh: '\u0635', // ص (shad / saad)
  dh: '\u0636', // ض (dhad / daad)
  th: '\u0637', // ط (tho / tah)
  zh: '\u0638', // ظ (zho / zah)
  gh: '\u063A', // غ (ghain)
};

/**
 * Single-character phonetic mappings to Arabic letters.
 */
export const REGULAR_MAP: Record<string, string> = {
  // Letters
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

  // Uppercase special letters
  H: '\u0647', // ه (ha / heh)
  A: '\u0649', // ى (alif maqsura)
  T: '\u0637', // ط (tho / tah)
  S: '\u0644\u0625', // لإ (Lam Alif with Hamzah below - Nonosoft specification)
  L: '\u0644\u0627', // لا (Lam Alif)
  Z: '\u0638', // ظ (zho / zah)
  E: '\u0629', // ة (ta marbuta)
  I: '\u0625', // إ (alif with hamza below)
  O: '\u0623', // أ (alif with hamza above)
  U: '\u0621', // ء (hamza)
  N: '\u064B', // ً (tanwin fathah)

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
 * Set of prefix characters that could begin a two-character combo.
 */
export const COMBO_PREFIX_CHARS: ReadonlySet<string> = new Set(
  Object.keys(REGULAR_COMBOS).map((combo) => combo[0])
);
