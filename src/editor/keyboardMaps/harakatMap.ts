export type HarakatKey = string;

export interface HarakatNameInfo {
  id: string;
  en: string;
  ar: string;
}

export interface HarakatItem {
  id: string;
  nameId: string;
  nameEn: string;
  nameAr: string;
  char: string; // The combining diacritic(s)
  sampleWithBa: string; // Preview sample with letter Ba (e.g. بَ)
  shortcut: string;
  fkey: string;
  mod: 'none' | 'shift' | 'ctrl';
}

export interface HarakatCategory {
  id: string;
  titleId: string;
  titleEn: string;
  titleAr: string;
  items: HarakatItem[];
}

export const HARAKAT_CATEGORIES: HarakatCategory[] = [
  {
    id: 'single',
    titleId: 'Harakat Tunggal (F1 - F10)',
    titleEn: 'Single Diacritics (F1 - F10)',
    titleAr: 'الحركات المفردة (F1 - F10)',
    items: [
      {
        id: 'f1_fathah',
        nameId: 'Fathah',
        nameEn: 'Fathah',
        nameAr: 'فَتْحَة',
        char: '\u064E',
        sampleWithBa: 'بَ',
        shortcut: 'F1',
        fkey: 'F1',
        mod: 'none',
      },
      {
        id: 'f2_kasrah',
        nameId: 'Kasrah',
        nameEn: 'Kasrah',
        nameAr: 'كَسْرَة',
        char: '\u0650',
        sampleWithBa: 'بِ',
        shortcut: 'F2',
        fkey: 'F2',
        mod: 'none',
      },
      {
        id: 'f3_dhammah',
        nameId: 'Dhammah',
        nameEn: 'Dhammah',
        nameAr: 'ضَمَّة',
        char: '\u064F',
        sampleWithBa: 'بُ',
        shortcut: 'F3',
        fkey: 'F3',
        mod: 'none',
      },
      {
        id: 'f4_fathatain',
        nameId: 'Fathatain (Tanwin Fathah)',
        nameEn: 'Fathatain',
        nameAr: 'فَتْحَتَيْن',
        char: '\u064B',
        sampleWithBa: 'بً',
        shortcut: 'F4',
        fkey: 'F4',
        mod: 'none',
      },
      {
        id: 'f5_kasratain',
        nameId: 'Kasratain (Tanwin Kasrah)',
        nameEn: 'Kasratain',
        nameAr: 'كَسْرَتَيْن',
        char: '\u064D',
        sampleWithBa: 'بٍ',
        shortcut: 'F5',
        fkey: 'F5',
        mod: 'none',
      },
      {
        id: 'f6_dhammatain',
        nameId: 'Dhammatain (Tanwin Dhammah)',
        nameEn: 'Dhammatain',
        nameAr: 'ضَمَّتَيْن',
        char: '\u064C',
        sampleWithBa: 'بٌ',
        shortcut: 'F6',
        fkey: 'F6',
        mod: 'none',
      },
      {
        id: 'f7_fathah_berdiri',
        nameId: 'Fathah Berdiri (Alif Khanjariyah)',
        nameEn: 'Dagger Alif (Fathah Vertical)',
        nameAr: 'أَلِف خَنْجَرِيَّة',
        char: '\u0670',
        sampleWithBa: 'بٰ',
        shortcut: 'F7',
        fkey: 'F7',
        mod: 'none',
      },
      {
        id: 'f8_kasrah_berdiri',
        nameId: 'Kasrah Berdiri',
        nameEn: 'Subscript Alif (Kasrah Vertical)',
        nameAr: 'كَسْرَة قَائِمَة',
        char: '\u0656',
        sampleWithBa: 'بٖ',
        shortcut: 'F8',
        fkey: 'F8',
        mod: 'none',
      },
      {
        id: 'f9_dhammah_terbalik',
        nameId: 'Dhammah Terbalik',
        nameEn: 'Inverted Damma',
        nameAr: 'ضَمَّة مَقْلُوبَة',
        char: '\u0657',
        sampleWithBa: 'بٗ',
        shortcut: 'F9',
        fkey: 'F9',
        mod: 'none',
      },
      {
        id: 'f10_sukun',
        nameId: 'Sukun',
        nameEn: 'Sukun',
        nameAr: 'سُكُون',
        char: '\u0652',
        sampleWithBa: 'بْ',
        shortcut: 'F10',
        fkey: 'F10',
        mod: 'none',
      },
    ],
  },
  {
    id: 'tasydid',
    titleId: 'Tasydid Kombinasi (Shift + F1 - F10)',
    titleEn: 'Shaddah Combinations (Shift + F1 - F10)',
    titleAr: 'تراكيب الشدة (Shift + F1 - F10)',
    items: [
      {
        id: 'sf1_t_fathah',
        nameId: 'Tasydid + Fathah',
        nameEn: 'Shaddah + Fathah',
        nameAr: 'شَدَّة وَفَتْحَة',
        char: '\u0651\u064E',
        sampleWithBa: 'بَّ',
        shortcut: 'Shift + F1',
        fkey: 'F1',
        mod: 'shift',
      },
      {
        id: 'sf2_t_kasrah',
        nameId: 'Tasydid + Kasrah',
        nameEn: 'Shaddah + Kasrah',
        nameAr: 'شَدَّة وَكَسْرَة',
        char: '\u0651\u0650',
        sampleWithBa: 'بِّ',
        shortcut: 'Shift + F2',
        fkey: 'F2',
        mod: 'shift',
      },
      {
        id: 'sf3_t_dhammah',
        nameId: 'Tasydid + Dhammah',
        nameEn: 'Shaddah + Dhammah',
        nameAr: 'شَدَّة وَضَمَّة',
        char: '\u0651\u064F',
        sampleWithBa: 'بُّ',
        shortcut: 'Shift + F3',
        fkey: 'F3',
        mod: 'shift',
      },
      {
        id: 'sf4_t_fathatain',
        nameId: 'Tasydid + Fathatain',
        nameEn: 'Shaddah + Fathatain',
        nameAr: 'شَدَّة وَفَتْحَتَيْن',
        char: '\u0651\u064B',
        sampleWithBa: 'بًّ',
        shortcut: 'Shift + F4',
        fkey: 'F4',
        mod: 'shift',
      },
      {
        id: 'sf5_t_kasratain',
        nameId: 'Tasydid + Kasratain',
        nameEn: 'Shaddah + Kasratain',
        nameAr: 'شَدَّة وَكَسْرَتَيْن',
        char: '\u0651\u064D',
        sampleWithBa: 'بٍّ',
        shortcut: 'Shift + F5',
        fkey: 'F5',
        mod: 'shift',
      },
      {
        id: 'sf6_t_dhammatain',
        nameId: 'Tasydid + Dhammatain',
        nameEn: 'Shaddah + Dhammatain',
        nameAr: 'شَدَّة وَضَمَّتَيْن',
        char: '\u0651\u064C',
        sampleWithBa: 'بٌّ',
        shortcut: 'Shift + F6',
        fkey: 'F6',
        mod: 'shift',
      },
      {
        id: 'sf7_t_fathah_berdiri',
        nameId: 'Tasydid + Fathah Berdiri',
        nameEn: 'Shaddah + Vertical Fathah',
        nameAr: 'شَدَّة وَأَلِف خَنْجَرِيَّة',
        char: '\u0651\u0670',
        sampleWithBa: 'بَّٰ',
        shortcut: 'Shift + F7',
        fkey: 'F7',
        mod: 'shift',
      },
      {
        id: 'sf8_t_kasrah_berdiri',
        nameId: 'Tasydid + Kasrah Berdiri',
        nameEn: 'Shaddah + Vertical Kasrah',
        nameAr: 'شَدَّة وَكَسْرَة قَائِمَة',
        char: '\u0651\u0656',
        sampleWithBa: 'بِّٖ',
        shortcut: 'Shift + F8',
        fkey: 'F8',
        mod: 'shift',
      },
      {
        id: 'sf9_t_dhammah_terbalik',
        nameId: 'Tasydid + Dhammah Terbalik',
        nameEn: 'Shaddah + Inverted Damma',
        nameAr: 'شَدَّة وَضَمَّة مَقْلُوبَة',
        char: '\u0651\u0657',
        sampleWithBa: 'بُّٗ',
        shortcut: 'Shift + F9',
        fkey: 'F9',
        mod: 'shift',
      },
      {
        id: 'sf10_maddah',
        nameId: 'Maddah (Mad Wajib/Jaiz)',
        nameEn: 'Maddah Sign',
        nameAr: 'مَدَّة',
        char: '\u0653',
        sampleWithBa: 'بٓ',
        shortcut: 'Shift + F10',
        fkey: 'F10',
        mod: 'shift',
      },
    ],
  },
  {
    id: 'maddah',
    titleId: 'Maddah & Tasydid Khusus (Ctrl + F1 - F6, Ctrl + F10)',
    titleEn: 'Maddah & Special Shaddah (Ctrl + F1 - F6, Ctrl + F10)',
    titleAr: 'المدود والشدة الخاصة (Ctrl + F1 - F6, Ctrl + F10)',
    items: [
      {
        id: 'cf1_m_fathah',
        nameId: 'Maddah + Fathah',
        nameEn: 'Maddah + Fathah',
        nameAr: 'مَدَّة وَفَتْحَة',
        char: '\u0653\u064E',
        sampleWithBa: 'بَٓ',
        shortcut: 'Ctrl + F1',
        fkey: 'F1',
        mod: 'ctrl',
      },
      {
        id: 'cf2_m_kasrah',
        nameId: 'Maddah + Kasrah',
        nameEn: 'Maddah + Kasrah',
        nameAr: 'مَدَّة وَكَسْرَة',
        char: '\u0653\u0650',
        sampleWithBa: 'بِٓ',
        shortcut: 'Ctrl + F2',
        fkey: 'F2',
        mod: 'ctrl',
      },
      {
        id: 'cf3_m_dhammah',
        nameId: 'Maddah + Dhammah',
        nameEn: 'Maddah + Dhammah',
        nameAr: 'مَدَّة وَضَمَّة',
        char: '\u0653\u064F',
        sampleWithBa: 'بُٓ',
        shortcut: 'Ctrl + F3',
        fkey: 'F3',
        mod: 'ctrl',
      },
      {
        id: 'cf4_t_maddah',
        nameId: 'Tasydid + Maddah',
        nameEn: 'Shaddah + Maddah',
        nameAr: 'شَدَّة وَمَدَّة',
        char: '\u0651\u0653',
        sampleWithBa: 'بّٓ',
        shortcut: 'Ctrl + F4',
        fkey: 'F4',
        mod: 'ctrl',
      },
      {
        id: 'cf5_t_m_kasrah',
        nameId: 'Tasydid + Maddah + Kasrah',
        nameEn: 'Shaddah + Maddah + Kasrah',
        nameAr: 'شَدَّة وَمَدَّة وَكَسْرَة',
        char: '\u0651\u0653\u0650',
        sampleWithBa: 'بِّٓ',
        shortcut: 'Ctrl + F5',
        fkey: 'F5',
        mod: 'ctrl',
      },
      {
        id: 'cf6_t_m_dhammah',
        nameId: 'Tasydid + Maddah + Dhammah',
        nameEn: 'Shaddah + Maddah + Dhammah',
        nameAr: 'شَدَّة وَمَدَّة وَضَمَّة',
        char: '\u0651\u0653\u064F',
        sampleWithBa: 'بُّٓ',
        shortcut: 'Ctrl + F6',
        fkey: 'F6',
        mod: 'ctrl',
      },
      {
        id: 'cf10_tasydid',
        nameId: 'Tasydid Tunggal',
        nameEn: 'Shaddah (Alone)',
        nameAr: 'شَدَّة مُنْفَرِدَة',
        char: '\u0651',
        sampleWithBa: 'بّ',
        shortcut: 'Ctrl + F10',
        fkey: 'F10',
        mod: 'ctrl',
      },
    ],
  },
  {
    id: 'special',
    titleId: 'Mad & Iqlab Khusus (Ctrl + -, Ctrl + =, Ctrl + \\)',
    titleEn: 'Special Floating Mad & Iqlab',
    titleAr: 'المدود الخاصة والإقلاب المنفصل',
    items: [
      {
        id: 'sp_mad_wajib',
        nameId: 'Mad Wajib (Terlepas)',
        nameEn: 'Mad Wajib (Standalone)',
        nameAr: 'مَدّ وَاجِب مُنْفَصِل',
        char: '\u0654',
        sampleWithBa: 'عۤ',
        shortcut: 'Ctrl + -',
        fkey: 'MINUS',
        mod: 'ctrl',
      },
      {
        id: 'sp_mad_jaiz',
        nameId: 'Mad Jaiz (Terlepas)',
        nameEn: 'Mad Jaiz (Standalone)',
        nameAr: 'مَدّ جَائِز مُنْفَصِل',
        char: '\u0653',
        sampleWithBa: 'عٓ',
        shortcut: 'Ctrl + =',
        fkey: 'EQUAL',
        mod: 'ctrl',
      },
      {
        id: 'sp_mim_iqlab',
        nameId: 'Mim Iqlab (Terlepas)',
        nameEn: 'Meem Iqlab (Standalone)',
        nameAr: 'مِيم الإِقْلَاب',
        char: '\u06E2',
        sampleWithBa: 'نۢ',
        shortcut: 'Ctrl + \\',
        fkey: 'BACKSLASH',
        mod: 'ctrl',
      },
      {
        id: 'sp_sukun_qurani',
        nameId: 'Sukun Qurani',
        nameEn: 'Quranic Sukun',
        nameAr: 'سُكُون قُرْآنِي',
        char: '\u06E1',
        sampleWithBa: 'بۡ',
        shortcut: 'F11',
        fkey: 'F11',
        mod: 'none',
      },
      {
        id: 'sp_sifir_mustadir',
        nameId: 'Sifir Mustadir (Bulat)',
        nameEn: 'Rounded Zero (Sifir)',
        nameAr: 'صِفْر مُسْتَدِير',
        char: '\u06DF',
        sampleWithBa: 'ب۟',
        shortcut: 'Alt+2, D',
        fkey: 'SIFIR1',
        mod: 'none',
      },
      {
        id: 'sp_sifir_mustathil',
        nameId: 'Sifir Mustathil (Lonjong)',
        nameEn: 'Rectangular Zero (Sifir)',
        nameAr: 'صِفْر مُسْتَطِيل',
        char: '\u06E0',
        sampleWithBa: 'ب۠',
        shortcut: 'Alt+2, E',
        fkey: 'SIFIR2',
        mod: 'none',
      },
      {
        id: 'sp_nun_wiqoyah',
        nameId: 'Nun Wiqoyah Kecil',
        nameEn: 'Small High Noon',
        nameAr: 'نُون الوِقَايَة الصَّغِيرَة',
        char: '\u06E8',
        sampleWithBa: 'بۨ',
        shortcut: 'Alt+2, F',
        fkey: 'NOON',
        mod: 'none',
      },
    ],
  },
];

/**
 * Fast lookup helper: maps (fkey, shift, ctrl) to combining harakat string.
 */
export function getHarakatFromShortcut(fkey: string, isShift: boolean, isCtrl: boolean): string | null {
  const cleanKey = fkey.toUpperCase();
  const mod: 'none' | 'shift' | 'ctrl' = isCtrl ? 'ctrl' : isShift ? 'shift' : 'none';

  for (const cat of HARAKAT_CATEGORIES) {
    for (const item of cat.items) {
      if (item.fkey === cleanKey && item.mod === mod) {
        return item.char;
      }
    }
  }

  return null;
}

// Backward compatibility map
export const HARAKAT_MAP: Record<string, string> = {
  F1: '\u064E',
  F2: '\u0650',
  F3: '\u064F',
  F4: '\u064B',
  F5: '\u064D',
  F6: '\u064C',
  F7: '\u0670',
  F8: '\u0656',
  F9: '\u0657',
  F10: '\u0652',
  F11: '\u06E1', // Sukun Qurani
};

export const HARAKAT_NAMES: Record<string, { id: string; en: string; ar: string }> = {
  F1: { id: 'Fathah', en: 'Fathah', ar: 'فَتْحَة' },
  F2: { id: 'Kasrah', en: 'Kasrah', ar: 'كَسْرَة' },
  F3: { id: 'Dhammah', en: 'Dhammah', ar: 'ضَمَّة' },
  F4: { id: 'Fathatain', en: 'Fathatain', ar: 'فَتْحَتَيْن' },
  F5: { id: 'Kasratain', en: 'Kasratain', ar: 'كَسْرَتَيْن' },
  F6: { id: 'Dhammatain', en: 'Dhammatain', ar: 'ضَمَّتَيْن' },
  F7: { id: 'Fathah Berdiri', en: 'Dagger Alif', ar: 'أَلِف خَنْجَرِيَّة' },
  F8: { id: 'Kasrah Berdiri', en: 'Subscript Alif', ar: 'كَسْرَة قَائِمَة' },
  F9: { id: 'Dhammah Terbalik', en: 'Inverted Damma', ar: 'ضَمَّة مَقْلُوبَة' },
  F10: { id: 'Sukun', en: 'Sukun', ar: 'سُكُون' },
  F11: { id: 'Sukun Qurani', en: 'Quranic Sukun', ar: 'سُكُون قُرْآنِي' },
};
