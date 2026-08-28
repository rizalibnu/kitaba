import type { JSONContent } from '@tiptap/react';

export interface NaskhDocument {
  id: string;
  title: string;
  content: JSONContent | null;
  createdAt: number;
  updatedAt: number;
  isDirty: boolean;
}

export type KeyboardMode = 'regular' | 'standard' | 'arabic';
export type ThemeMode = 'light' | 'dark' | 'system';
export type UILanguage = 'id' | 'en' | 'ar';
export type ExportFormat = 'pdf' | 'html' | 'png' | 'jpg' | 'rtf' | 'text';
export type TextDirection = 'rtl' | 'ltr';

export interface EditorConfig {
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  textDirection: TextDirection;
  lineHeight: number;
  showHarakat: boolean;
  zoom: number;
  autoReplace: boolean;
  rulerVisible: boolean;
}

export interface FastWordItem {
  key: string; // 'A' through 'Z'
  name: string;
  text: string;
}

export interface WaqafSign {
  id: string;
  char: string;
  nameId: string;
  nameEn: string;
  nameAr: string;
  unicode: string;
}

export interface SpecialCharItem {
  id: string;
  keyLetter: string; // Shortcut letter in group (e.g. 'A', 'B', 'C'...)
  charTop: string;   // Top row character (Alt + Letter)
  charBottom: string;// Bottom row character (Letter)
  labelTop: string;
  labelBottom: string;
}

export interface SpecialCharGroup {
  id: number;
  nameId: string;
  nameEn: string;
  nameAr: string;
  items: SpecialCharItem[];
}

export type FontScript = 'arabic' | 'latin';

export interface FontOption {
  family: string;
  label: string;
  cssFamily: string;
  script: FontScript;
}

// Model Font Arab Unik (Standar Mushaf, Naskh Klasik, Farisy, Ruq'ah, Modern)
export const ARABIC_FONTS: FontOption[] = [
  {
    family: 'LPMQ Isep Misbah',
    label: 'LPMQ Isep Misbah (Kemenag RI)',
    cssFamily: '"LPMQ Isep Misbah", "Amiri", serif',
    script: 'arabic',
  },
  {
    family: 'Amiri',
    label: 'Amiri (Naskh Klasik)',
    cssFamily: '"Amiri", serif',
    script: 'arabic',
  },
  {
    family: 'Scheherazade New',
    label: 'Scheherazade New (Naskh Timur)',
    cssFamily: '"Scheherazade New", serif',
    script: 'arabic',
  },
  {
    family: 'Noto Naskh Arabic',
    label: 'Noto Naskh (Modern Clean)',
    cssFamily: '"Noto Naskh Arabic", serif',
    script: 'arabic',
  },
  {
    family: 'Noto Nastaliq Urdu',
    label: 'Farisy (Nastaliq Persia/Urdu)',
    cssFamily: '"Noto Nastaliq Urdu", serif',
    script: 'arabic',
  },
  {
    family: 'Aref Ruqaa',
    label: "Ruq'ah (Aref Ruqaa)",
    cssFamily: '"Aref Ruqaa", serif',
    script: 'arabic',
  },
  {
    family: 'Amiri Quran',
    label: 'Amiri Quran (Mushaf Standar)',
    cssFamily: '"Amiri Quran", "Amiri", serif',
    script: 'arabic',
  },
  {
    family: 'Cairo',
    label: 'Cairo (Modern Sans)',
    cssFamily: '"Cairo", sans-serif',
    script: 'arabic',
  },
];

// Model Font Latin (Standard & Google Fonts)
export const LATIN_FONTS: FontOption[] = [
  { family: 'Times New Roman', label: 'Times New Roman', cssFamily: '"Times New Roman", Times, serif', script: 'latin' },
  { family: 'Arial', label: 'Arial', cssFamily: 'Arial, Helvetica, sans-serif', script: 'latin' },
  { family: 'Georgia', label: 'Georgia', cssFamily: 'Georgia, serif', script: 'latin' },
  { family: 'Calibri', label: 'Calibri', cssFamily: 'Calibri, "Segoe UI", sans-serif', script: 'latin' },
  { family: 'Roboto', label: 'Roboto', cssFamily: '"Roboto", sans-serif', script: 'latin' },
  { family: 'Open Sans', label: 'Open Sans', cssFamily: '"Open Sans", sans-serif', script: 'latin' },
  { family: 'Inter', label: 'Inter', cssFamily: '"Inter", sans-serif', script: 'latin' },
  { family: 'Tahoma', label: 'Tahoma', cssFamily: 'Tahoma, Verdana, sans-serif', script: 'latin' },
  { family: 'Verdana', label: 'Verdana', cssFamily: 'Verdana, Geneva, sans-serif', script: 'latin' },
  { family: 'Courier New', label: 'Courier New', cssFamily: '"Courier New", Courier, monospace', script: 'latin' },
];

export const AVAILABLE_FONTS: FontOption[] = [...ARABIC_FONTS, ...LATIN_FONTS];

export const FONT_SIZES = [12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 36, 48, 72];

// Tanda Waqaf Standar Al-Qur'an (Unicode Combining Small High Signs U+06D6 - U+06E3)
export const KITABA_WAQAF_SIGNS: (WaqafSign & { displayLabel?: string })[] = [
  { id: 'mim', char: '\u06D6', displayLabel: 'مـ', nameId: 'Waqaf Lazim (U+06D6)', nameEn: 'Compulsory Stop (مـ)', nameAr: 'وقف لازم', unicode: 'U+06D6' },
  { id: 'qaly', char: '\u06D7', displayLabel: 'قلى', nameId: 'Waqaf Qila (U+06D7)', nameEn: 'Preferred Stop (قلى)', nameAr: 'الوقف أولى', unicode: 'U+06D7' },
  { id: 'saly', char: '\u06D8', displayLabel: 'صلى', nameId: 'Wasal Awla (U+06D8)', nameEn: 'Preferred Continue (صلى)', nameAr: 'الوصل أولى', unicode: 'U+06D8' },
  { id: 'jim', char: '\u06D9', displayLabel: 'ج', nameId: 'Waqaf Jaiz (U+06D9)', nameEn: 'Permissible Stop (ج)', nameAr: 'وقف جائز', unicode: 'U+06D9' },
  { id: 'tho', char: '\u06DA', displayLabel: 'ط', nameId: 'Waqaf Mutlaq (U+06DA)', nameEn: 'Absolute Stop (ط)', nameAr: 'وقف مطلق', unicode: 'U+06DA' },
  { id: 'three_dots', char: '\u06DB', displayLabel: '؞', nameId: "Waqaf Mu'anaqah (U+06DB)", nameEn: 'Embracing Stop (؞)', nameAr: 'معانقة', unicode: 'U+06DB' },
  { id: 'la', char: '\u06E2', displayLabel: 'لا', nameId: 'La Tazil (U+06E2)', nameEn: 'Do Not Stop (لا)', nameAr: 'لا تقف', unicode: 'U+06E2' },
  { id: 'saktah', char: '\u06DC', displayLabel: 'سكته', nameId: 'Saktah (U+06DC)', nameEn: 'Short Silence (سكته)', nameAr: 'سكتة لطيفة', unicode: 'U+06DC' },
  { id: 'ain', char: '\u06E3', displayLabel: 'ع', nameId: 'Tanda Ruku (U+06E3)', nameEn: 'Ruku End (ع)', nameAr: 'علامة الركوع', unicode: 'U+06E3' },
];

// 5 Group Karakter Spesial Kitaba
export const SPECIAL_CHARACTER_GROUPS: SpecialCharGroup[] = [
  {
    id: 1,
    nameId: 'Group 1 (Lafadz Allah & Lam Alif)',
    nameEn: 'Group 1 (Allah & Lam Alif)',
    nameAr: 'المجموعة ١ (لفظ الجلالة واللام ألف)',
    items: [
      { id: '1-a', keyLetter: 'A', charTop: 'اللَّهُ', charBottom: 'لَا', labelTop: 'Allahu', labelBottom: 'La' },
      { id: '1-b', keyLetter: 'B', charTop: 'اللَّهِ', charBottom: 'لَا', labelTop: 'Allahi', labelBottom: 'La' },
      { id: '1-c', keyLetter: 'C', charTop: 'اللَّهَ', charBottom: 'لَا', labelTop: 'Allaha', labelBottom: 'La' },
      { id: '1-d', keyLetter: 'D', charTop: 'لِلَّهِ', charBottom: 'لَا', labelTop: 'Lillahi', labelBottom: 'La' },
      { id: '1-e', keyLetter: 'E', charTop: 'ﷲ', charBottom: 'لَا', labelTop: 'Allah (Ligature)', labelBottom: 'La' },
      { id: '1-f', keyLetter: 'F', charTop: 'الله', charBottom: 'لَا', labelTop: 'Allah', labelBottom: 'La' },
      { id: '1-g', keyLetter: 'G', charTop: 'اللَّهُمَّ', charBottom: 'لَا', labelTop: 'Allahumma', labelBottom: 'La' },
      { id: '1-h', keyLetter: 'H', charTop: 'مُحَمَّدٌ', charBottom: 'لَا', labelTop: 'Muhammadun', labelBottom: 'La' },
      { id: '1-i', keyLetter: 'I', charTop: 'مُحَمَّدًا', charBottom: 'لَا', labelTop: 'Muhammadan', labelBottom: 'La' },
      { id: '1-j', keyLetter: 'J', charTop: 'مُحَمَّدٍ', charBottom: 'لَا', labelTop: 'Muhammadin', labelBottom: 'La' },
      { id: '1-k', keyLetter: 'K', charTop: 'ﷺ', charBottom: 'لَا', labelTop: 'Shallallahu Alaihi Wasallam', labelBottom: 'La' },
    ],
  },
  {
    id: 2,
    nameId: 'Group 2 (Kaligrafi, Sifir & Wiqoyah)',
    nameEn: 'Group 2 (Calligraphy, Sifir & Wiqoyah)',
    nameAr: 'المجموعة ٢ (الخط، الصفر المستدير، نون الوقاية)',
    items: [
      { id: '2-a', keyLetter: 'A', charTop: 'ﷻ', charBottom: 'رَضِيَ اللَّهُ عَنْهُ', labelTop: 'Jalla Jalaluh', labelBottom: 'Radhiyallahu Anhu' },
      { id: '2-b', keyLetter: 'B', charTop: 'ﷺ', charBottom: 'عَلَيْهِ السَّلَامُ', labelTop: 'SAW', labelBottom: 'Alaihissalam' },
      { id: '2-c', keyLetter: 'C', charTop: '﷽', charBottom: 'رَحِمَهُ اللَّهُ', labelTop: 'Basmalah', labelBottom: 'Rahimahullah' },
      { id: '2-d', keyLetter: 'D', charTop: 'ـْ', charBottom: 'ـ۟', labelTop: 'Sukun Normal', labelBottom: 'Sifir Mustadir' },
      { id: '2-e', keyLetter: 'E', charTop: 'ـۡ', charBottom: 'ـ۠', labelTop: 'Sukun Qurani', labelBottom: 'Sifir Mustathil' },
      { id: '2-f', keyLetter: 'F', charTop: 'ـۨ', charBottom: 'نِ', labelTop: 'Nun Wiqoyah Kecil', labelBottom: 'Nun Wiqoyah Bawah' },
      { id: '2-g', keyLetter: 'G', charTop: '۩', charBottom: 'ـۤ', labelTop: 'Tanda Sajdah', labelBottom: 'Mad Wajib' },
      { id: '2-h', keyLetter: 'H', charTop: '۞', charBottom: 'ـٓ', labelTop: 'Tanda Hizb', labelBottom: 'Mad Jaiz' },
      { id: '2-i', keyLetter: 'I', charTop: 'ع', charBottom: 'مۢ', labelTop: 'Tanda Ruku', labelBottom: 'Mim Iqlab' },
      { id: '2-j', keyLetter: 'J', charTop: 'ـٰ', charBottom: 'ـٖ', labelTop: 'Alif Khanjariyah', labelBottom: 'Kasrah Berdiri' },
      { id: '2-k', keyLetter: 'K', charTop: 'ـٗ', charBottom: 'ـۥ', labelTop: 'Dhammah Terbalik', labelBottom: 'Waw Kecil' },
    ],
  },
  {
    id: 3,
    nameId: "Group 3 (Tanda Qur'an & Ornamen)",
    nameEn: "Group 3 (Quranic Marks & Symbols)",
    nameAr: 'المجموعة ٣ (علامات المصحف والرموز)',
    items: [
      { id: '3-a', keyLetter: 'A', charTop: '﴿', charBottom: '﴾', labelTop: 'Kurung Awal Ayat', labelBottom: 'Kurung Akhir Ayat' },
      { id: '3-b', keyLetter: 'B', charTop: '۝', charBottom: '۞', labelTop: 'Akhir Ayat (Simbol)', labelBottom: 'Awal Hizb' },
      { id: '3-c', keyLetter: 'C', charTop: '۩', charBottom: 'ـ۩ـ', labelTop: 'Sajdah', labelBottom: 'Garis Sajdah' },
      { id: '3-d', keyLetter: 'D', charTop: 'ۺ', charBottom: 'ۻ', labelTop: 'Ornamen 1', labelBottom: 'Ornamen 2' },
      { id: '3-e', keyLetter: 'E', charTop: 'ـ', charBottom: 'ــــ', labelTop: 'Tatweel Pendek', labelBottom: 'Tatweel Panjang' },
      { id: '3-f', keyLetter: 'F', charTop: '،', charBottom: '؛', labelTop: 'Koma Arab', labelBottom: 'Titik Koma Arab' },
      { id: '3-g', keyLetter: 'G', charTop: '؟', charBottom: '٪', labelTop: 'Tanda Tanya Arab', labelBottom: 'Persen Arab' },
      { id: '3-h', keyLetter: 'H', charTop: '۰', charBottom: '۱', labelTop: 'Angka 0', labelBottom: 'Angka 1' },
      { id: '3-i', keyLetter: 'I', charTop: '۲', charBottom: '۳', labelTop: 'Angka 2', labelBottom: 'Angka 3' },
      { id: '3-j', keyLetter: 'J', charTop: '۴', charBottom: '۵', labelTop: 'Angka 4', labelBottom: 'Angka 5' },
      { id: '3-k', keyLetter: 'K', charTop: '٦', charBottom: '۷', labelTop: 'Angka 6', labelBottom: 'Angka 7' },
    ],
  },
  {
    id: 4,
    nameId: 'Group 4 (Kaligrafi Frasa & Doa)',
    nameEn: 'Group 4 (Phrase Calligraphy)',
    nameAr: 'المجموعة ٤ (العبارات والأدعية المخطوطة)',
    items: [
      { id: '4-a', keyLetter: 'A', charTop: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', charBottom: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', labelTop: 'Basmalah Lengkap', labelBottom: 'Hamdalah' },
      { id: '4-b', keyLetter: 'B', charTop: 'سُبْحَانَ اللَّهِ', charBottom: 'لَا إِلَٰهَ إِلَّا اللَّهُ', labelTop: 'Tasbih', labelBottom: 'Tahlil' },
      { id: '4-c', keyLetter: 'C', charTop: 'اللَّهُ أَكْبَرُ', charBottom: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', labelTop: 'Takbir', labelBottom: 'Hauqalah' },
      { id: '4-d', keyLetter: 'D', charTop: 'أَسْتَغْفِرُ اللَّهَ', charBottom: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ', labelTop: 'Istighfar', labelBottom: 'Tarji' },
      { id: '4-e', keyLetter: 'E', charTop: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ', charBottom: 'وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ', labelTop: 'Salam', labelBottom: 'Jawaban Salam' },
      { id: '4-f', keyLetter: 'F', charTop: 'جَزَاكَ اللَّهُ خَيْرًا', charBottom: 'بَارَكَ اللَّهُ فِيكَ', labelTop: 'Jazakallah', labelBottom: 'Barakallah' },
      { id: '4-g', keyLetter: 'G', charTop: 'مَا شَاءَ اللَّهُ', charBottom: 'إِنْ شَاءَ اللَّهُ', labelTop: 'Masha Allah', labelBottom: 'Insha Allah' },
      { id: '4-h', keyLetter: 'H', charTop: 'رَضِيَ اللَّهُ عَنْهَا', charBottom: 'رَضِيَ اللَّهُ عَنْهُمْ', labelTop: 'Anha', labelBottom: 'Anhum' },
      { id: '4-i', keyLetter: 'I', charTop: 'عَلَيْهِمَا السَّلَامُ', charBottom: 'عَلَيْهِمُ السَّلَامُ', labelTop: 'Alaihimas-salam', labelBottom: 'Alaihimus-salam' },
      { id: '4-j', keyLetter: 'J', charTop: 'رَحِمَهُمَا اللَّهُ', charBottom: 'رَحِمَهُمُ اللَّهُ', labelTop: 'Rahimahumallah', labelBottom: 'Rahimahumullah' },
      { id: '4-k', keyLetter: 'K', charTop: 'قَالَ رَسُولُ اللَّهِ ﷺ', charBottom: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ', labelTop: 'Qala Rasulullah', labelBottom: 'An Abi Hurairah' },
    ],
  },
  {
    id: 5,
    nameId: 'Group 5 (Huruf Jawi & Pegon)',
    nameEn: 'Group 5 (Jawi & Pegon Letters)',
    nameAr: 'المجموعة ٥ (أحرف الجاوي والبيغون)',
    items: [
      { id: '5-a', keyLetter: 'A', charTop: 'ڤ', charBottom: 'ڠ', labelTop: 'Pa (Jawi/Pegon)', labelBottom: 'Nga (Jawi/Pegon)' },
      { id: '5-b', keyLetter: 'B', charTop: 'چ', charBottom: 'ڽ', labelTop: 'Cha (Jawi/Pegon)', labelBottom: 'Nya (Jawi/Pegon)' },
      { id: '5-c', keyLetter: 'C', charTop: 'ݢ', charBottom: 'ۏ', labelTop: 'Ga (Jawi/Pegon)', labelBottom: 'Va (Jawi)' },
      { id: '5-d', keyLetter: 'D', charTop: 'ۑ', charBottom: 'ڎ', labelTop: 'Ya Nya', labelBottom: 'Dha' },
      { id: '5-e', keyLetter: 'E', charTop: 'ڟ', charBottom: 'ڢ', labelTop: 'Tho Titik 3', labelBottom: 'Fa Titik 1 Maghribi' },
      { id: '5-f', keyLetter: 'F', charTop: 'ڧ', charBottom: 'ڛ', labelTop: 'Qaf Titik 1 Bawah', labelBottom: 'Sin Titik 3 Bawah' },
      { id: '5-g', keyLetter: 'G', charTop: 'ڜ', charBottom: 'ڞ', labelTop: 'Syin Titik 3 Bawah', labelBottom: 'Dhad Titik 3' },
      { id: '5-h', keyLetter: 'H', charTop: 'ڲ', charBottom: 'ڴ', labelTop: 'Gaf Titik 2', labelBottom: 'Gaf Titik Atas' },
      { id: '5-i', keyLetter: 'I', charTop: 'ڷ', charBottom: 'ڸ', labelTop: 'Lam Titik 3', labelBottom: 'Lam Titik 4' },
      { id: '5-j', keyLetter: 'J', charTop: 'ڹ', charBottom: 'ں', labelTop: 'Nun Titik Atas Kiri', labelBottom: 'Nun Ghunnah' },
      { id: '5-k', keyLetter: 'K', charTop: 'ھ', charBottom: 'ۂ', labelTop: 'Ha Dua Mata (Do-Chashmi)', labelBottom: 'Ta Marbutah Gol' },
    ],
  },
];
