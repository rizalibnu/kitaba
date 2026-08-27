/**
 * F-Key to Arabic Harakat (Tashkeel / Diacritics) mapping.
 * Provides quick diacritic insertion via F1-F12 keys.
 */

export type HarakatKey =
  | 'F1'
  | 'F2'
  | 'F3'
  | 'F4'
  | 'F5'
  | 'F6'
  | 'F7'
  | 'F8'
  | 'F9'
  | 'F10'
  | 'F11'
  | 'F12';

export interface HarakatNameInfo {
  id: string;
  en: string;
  ar: string;
}

/**
 * Mapping of Function keys (F1-F12) to Arabic diacritic marks (harakat).
 * Composite marks (like Tasydid + vowel) are represented as string arrays.
 */
export const HARAKAT_MAP: Record<string, string | string[]> = {
  F1: '\u064E', // َ Fathah
  F2: '\u0650', // ِ Kasrah
  F3: '\u064F', // ُ Dhammah
  F4: '\u064B', // ً Fathatain (Tanwin Fathah)
  F5: '\u064D', // ٍ Kasratain (Tanwin Kasrah)
  F6: '\u064C', // ٌ Dhammatain (Tanwin Dhammah)
  F7: '\u0651', // ّ Tasydid (Shaddah)
  F8: ['\u0651', '\u064E'], // َّ Tasydid + Fathah
  F9: ['\u0651', '\u0650'], // ِّ Tasydid + Kasrah
  F10: ['\u0651', '\u064F'], // ُّ Tasydid + Dhammah
  F11: '\u0653', // ۤ Maddah
  F12: '\u0652', // ْ Sukun
};

/**
 * Multilingual descriptive names for all Harakat mapped to F-keys.
 */
export const HARAKAT_NAMES: Record<string, HarakatNameInfo> = {
  F1: { id: 'Fathah', en: 'Fathah', ar: 'فَتْحَة' },
  F2: { id: 'Kasrah', en: 'Kasrah', ar: 'كَسْرَة' },
  F3: { id: 'Dhammah', en: 'Dhammah', ar: 'ضَمَّة' },
  F4: { id: 'Fathatain', en: 'Fathatain', ar: 'فَتْحَتَيْن' },
  F5: { id: 'Kasratain', en: 'Kasratain', ar: 'كَسْرَتَيْن' },
  F6: { id: 'Dhammatain', en: 'Dhammatain', ar: 'ضَمَّتَيْن' },
  F7: { id: 'Tasydid', en: 'Shaddah', ar: 'شَدَّة' },
  F8: { id: 'Tasydid + Fathah', en: 'Shaddah + Fathah', ar: 'شَدَّة وَفَتْحَة' },
  F9: { id: 'Tasydid + Kasrah', en: 'Shaddah + Kasrah', ar: 'شَدَّة وَكَسْرَة' },
  F10: { id: 'Tasydid + Dhammah', en: 'Shaddah + Dhammah', ar: 'شَدَّة وَضَمَّة' },
  F11: { id: 'Maddah', en: 'Maddah', ar: 'مَدَّة' },
  F12: { id: 'Sukun', en: 'Sukun', ar: 'سُكُون' },
};
