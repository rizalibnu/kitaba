import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '@/components/common/Dialog';
import { useNaskhEditor } from '@/editor/EditorContext';
import { useUIStore } from '@/stores/uiStore';
import { Sparkles, Hash, BookOpen } from 'lucide-react';

interface AyahNumberDialogProps {
  open?: boolean;
  onClose?: () => void;
}

// Map Western digits 0-9 to Eastern Arabic numerals
function toEasternArabicDigits(num: number | string): string {
  const digits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/[0-9]/g, (w) => digits[parseInt(w, 10)]);
}

// Common Quran Surah list (1-114) with Arabic & transliterated names
const SURAHS = [
  { no: 1, name: 'Al-Fatihah', ar: 'الفاتحة', ayahs: 7 },
  { no: 2, name: 'Al-Baqarah', ar: 'البقرة', ayahs: 286 },
  { no: 3, name: 'Ali Imran', ar: 'آل عمران', ayahs: 200 },
  { no: 4, name: 'An-Nisa', ar: 'النساء', ayahs: 176 },
  { no: 5, name: 'Al-Maidah', ar: 'المائدة', ayahs: 120 },
  { no: 6, name: 'Al-Anam', ar: 'الأنعام', ayahs: 165 },
  { no: 7, name: 'Al-Araf', ar: 'الأعراف', ayahs: 206 },
  { no: 8, name: 'Al-Anfal', ar: 'الأنفال', ayahs: 75 },
  { no: 9, name: 'At-Tawbah', ar: 'التوبة', ayahs: 129 },
  { no: 10, name: 'Yunus', ar: 'يونس', ayahs: 109 },
  { no: 11, name: 'Hud', ar: 'هود', ayahs: 123 },
  { no: 12, name: 'Yusuf', ar: 'يوسف', ayahs: 111 },
  { no: 13, name: 'Ar-Rad', ar: 'الرعد', ayahs: 43 },
  { no: 14, name: 'Ibrahim', ar: 'إبراهيم', ayahs: 52 },
  { no: 15, name: 'Al-Hijr', ar: 'الحجر', ayahs: 99 },
  { no: 16, name: 'An-Nahl', ar: 'النحل', ayahs: 128 },
  { no: 17, name: 'Al-Isra', ar: 'الإسراء', ayahs: 111 },
  { no: 18, name: 'Al-Kahf', ar: 'الكهف', ayahs: 110 },
  { no: 19, name: 'Maryam', ar: 'مريم', ayahs: 98 },
  { no: 20, name: 'Taha', ar: 'طه', ayahs: 135 },
  { no: 21, name: 'Al-Anbiya', ar: 'الأنبياء', ayahs: 112 },
  { no: 22, name: 'Al-Hajj', ar: 'الحج', ayahs: 78 },
  { no: 23, name: 'Al-Muminun', ar: 'المؤمنون', ayahs: 118 },
  { no: 24, name: 'An-Nur', ar: 'النور', ayahs: 64 },
  { no: 25, name: 'Al-Furqan', ar: 'الفرقان', ayahs: 77 },
  { no: 26, name: 'Ash-Shuara', ar: 'الشعراء', ayahs: 227 },
  { no: 27, name: 'An-Naml', ar: 'النمل', ayahs: 93 },
  { no: 28, name: 'Al-Qasas', ar: 'القصص', ayahs: 88 },
  { no: 29, name: 'Al-Ankabut', ar: 'العنكبوت', ayahs: 69 },
  { no: 30, name: 'Ar-Rum', ar: 'الروم', ayahs: 60 },
  { no: 31, name: 'Luqman', ar: 'لقمان', ayahs: 34 },
  { no: 32, name: 'As-Sajdah', ar: 'السجدة', ayahs: 30 },
  { no: 33, name: 'Al-Ahzab', ar: 'الأحزاب', ayahs: 73 },
  { no: 34, name: 'Saba', ar: 'سبأ', ayahs: 54 },
  { no: 35, name: 'Fatir', ar: 'فاطر', ayahs: 45 },
  { no: 36, name: 'Ya-Sin', ar: 'يس', ayahs: 83 },
  { no: 37, name: 'As-Saffat', ar: 'الصافات', ayahs: 182 },
  { no: 38, name: 'Sad', ar: 'ص', ayahs: 88 },
  { no: 39, name: 'Az-Zumar', ar: 'الزمر', ayahs: 75 },
  { no: 40, name: 'Ghafir', ar: 'غافر', ayahs: 85 },
  { no: 41, name: 'Fussilat', ar: 'فصلت', ayahs: 54 },
  { no: 42, name: 'Ash-Shura', ar: 'الشورى', ayahs: 53 },
  { no: 43, name: 'Az-Zukhruf', ar: 'الزخرف', ayahs: 89 },
  { no: 44, name: 'Ad-Dukhan', ar: 'الدخان', ayahs: 59 },
  { no: 45, name: 'Al-Jathiyah', ar: 'الجاثية', ayahs: 37 },
  { no: 46, name: 'Al-Ahqaf', ar: 'الأحقاف', ayahs: 35 },
  { no: 47, name: 'Muhammad', ar: 'محمد', ayahs: 38 },
  { no: 48, name: 'Al-Fath', ar: 'الفتح', ayahs: 29 },
  { no: 49, name: 'Al-Hujurat', ar: 'الحجرات', ayahs: 18 },
  { no: 50, name: 'Qaf', ar: 'ق', ayahs: 45 },
  { no: 51, name: 'Adh-Dhariyat', ar: 'الذاريات', ayahs: 60 },
  { no: 52, name: 'At-Tur', ar: 'الطور', ayahs: 49 },
  { no: 53, name: 'An-Najm', ar: 'النجم', ayahs: 62 },
  { no: 54, name: 'Al-Qamar', ar: 'القمر', ayahs: 55 },
  { no: 55, name: 'Ar-Rahman', ar: 'الرحمن', ayahs: 78 },
  { no: 56, name: 'Al-Waqiah', ar: 'الواقعة', ayahs: 96 },
  { no: 57, name: 'Al-Hadid', ar: 'الحديد', ayahs: 29 },
  { no: 58, name: 'Al-Mujadilah', ar: 'المجادلة', ayahs: 22 },
  { no: 59, name: 'Al-Hashr', ar: 'الحشر', ayahs: 24 },
  { no: 60, name: 'Al-Mumtahanah', ar: 'الممتحنة', ayahs: 13 },
  { no: 61, name: 'As-Saff', ar: 'الصف', ayahs: 14 },
  { no: 62, name: 'Al-Jumuah', ar: 'الجمعة', ayahs: 11 },
  { no: 63, name: 'Al-Munafiqun', ar: 'المنافقون', ayahs: 11 },
  { no: 64, name: 'At-Taghabun', ar: 'التغابن', ayahs: 18 },
  { no: 65, name: 'At-Talaq', ar: 'الطلاق', ayahs: 12 },
  { no: 66, name: 'At-Tahrim', ar: 'التحريم', ayahs: 12 },
  { no: 67, name: 'Al-Mulk', ar: 'الملك', ayahs: 30 },
  { no: 68, name: 'Al-Qalam', ar: 'القلم', ayahs: 52 },
  { no: 69, name: 'Al-Haqqah', ar: 'الحاقة', ayahs: 52 },
  { no: 70, name: 'Al-Marij', ar: 'المعارج', ayahs: 44 },
  { no: 71, name: 'Nuh', ar: 'نوح', ayahs: 28 },
  { no: 72, name: 'Al-Jinn', ar: 'الجن', ayahs: 28 },
  { no: 73, name: 'Al-Muzzammil', ar: 'المزمل', ayahs: 20 },
  { no: 74, name: 'Al-Muddaththir', ar: 'المدثر', ayahs: 56 },
  { no: 75, name: 'Al-Qiyamah', ar: 'القيامة', ayahs: 40 },
  { no: 76, name: 'Al-Insan', ar: 'الإنسان', ayahs: 31 },
  { no: 77, name: 'Al-Mursalat', ar: 'المرسلات', ayahs: 50 },
  { no: 78, name: 'An-Naba', ar: 'النبأ', ayahs: 40 },
  { no: 79, name: 'An-Naziat', ar: 'النازعات', ayahs: 46 },
  { no: 80, name: 'Abasa', ar: 'عبس', ayahs: 42 },
  { no: 81, name: 'At-Takwir', ar: 'التكوير', ayahs: 29 },
  { no: 82, name: 'Al-Infitar', ar: 'الانفطار', ayahs: 19 },
  { no: 83, name: 'Al-Mutaffifin', ar: 'المطففين', ayahs: 36 },
  { no: 84, name: 'Al-Inshiqaq', ar: 'الانشقاق', ayahs: 25 },
  { no: 85, name: 'Al-Buruj', ar: 'البروج', ayahs: 22 },
  { no: 86, name: 'At-Tariq', ar: 'الطارق', ayahs: 17 },
  { no: 87, name: 'Al-Ala', ar: 'الأعلى', ayahs: 19 },
  { no: 88, name: 'Al-Ghashiyah', ar: 'الغاشية', ayahs: 26 },
  { no: 89, name: 'Al-Fajr', ar: 'الفجر', ayahs: 30 },
  { no: 90, name: 'Al-Balad', ar: 'البلد', ayahs: 20 },
  { no: 91, name: 'Ash-Shams', ar: 'الشمس', ayahs: 15 },
  { no: 92, name: 'Al-Layl', ar: 'الليل', ayahs: 21 },
  { no: 93, name: 'Ad-Duha', ar: 'الضحى', ayahs: 11 },
  { no: 94, name: 'Ash-Sharh', ar: 'الشرح', ayahs: 8 },
  { no: 95, name: 'At-Tin', ar: 'التين', ayahs: 8 },
  { no: 96, name: 'Al-Alaq', ar: 'العلق', ayahs: 19 },
  { no: 97, name: 'Al-Qadr', ar: 'القدر', ayahs: 5 },
  { no: 98, name: 'Al-Bayyinah', ar: 'البينة', ayahs: 8 },
  { no: 99, name: 'Az-Zalzalah', ar: 'الزلزلة', ayahs: 8 },
  { no: 100, name: 'Al-Adiyat', ar: 'العاديات', ayahs: 11 },
  { no: 101, name: 'Al-Qariah', ar: 'القارعة', ayahs: 11 },
  { no: 102, name: 'At-Takathur', ar: 'التكاثر', ayahs: 8 },
  { no: 103, name: 'Al-Asr', ar: 'العصر', ayahs: 3 },
  { no: 104, name: 'Al-Humazah', ar: 'الهمزة', ayahs: 9 },
  { no: 105, name: 'Al-Fil', ar: 'الفيل', ayahs: 5 },
  { no: 106, name: 'Quraysh', ar: 'قريش', ayahs: 4 },
  { no: 107, name: 'Al-Maun', ar: 'الماعون', ayahs: 7 },
  { no: 108, name: 'Al-Kawthar', ar: 'الكوثر', ayahs: 3 },
  { no: 109, name: 'Al-Kafirun', ar: 'الكافرون', ayahs: 6 },
  { no: 110, name: 'An-Nasr', ar: 'النصر', ayahs: 3 },
  { no: 111, name: 'Al-Masad', ar: 'المسد', ayahs: 5 },
  { no: 112, name: 'Al-Ikhlas', ar: 'الإخلاص', ayahs: 4 },
  { no: 113, name: 'Al-Falaq', ar: 'الفلق', ayahs: 5 },
  { no: 114, name: 'An-Nas', ar: 'الناس', ayahs: 6 },
];

export function AyahNumberDialog({ open, onClose }: AyahNumberDialogProps) {
  const { t } = useTranslation();
  const editor = useNaskhEditor();
  const activeDialog = useUIStore((s) => s.activeDialog);
  const closeDialog = useUIStore((s) => s.closeDialog);

  const [surahNumber, setSurahNumber] = useState<number>(1);
  const [ayahNumber, setAyahNumber] = useState<number>(1);
  const [useArabicNumerals, setUseArabicNumerals] = useState<boolean>(true);
  const [useOrnamentalStyle, setUseOrnamentalStyle] = useState<'symbol' | 'bracket' | 'circle'>('symbol');

  const isOpen = open !== undefined ? open : activeDialog === 'ayahNumber';
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      closeDialog();
    }
  };

  const selectedSurah = SURAHS.find((s) => s.no === surahNumber) || SURAHS[0];

  const handleSurahChange = (no: number) => {
    const clamped = Math.max(1, Math.min(114, no || 1));
    setSurahNumber(clamped);
    const surah = SURAHS.find((s) => s.no === clamped);
    if (surah && ayahNumber > surah.ayahs) {
      setAyahNumber(surah.ayahs);
    }
  };

  const handleAyahChange = (ayah: number) => {
    const max = selectedSurah?.ayahs || 286;
    const clamped = Math.max(1, Math.min(max, ayah || 1));
    setAyahNumber(clamped);
  };

  const getFormattedAyahString = () => {
    const numStr = useArabicNumerals
      ? toEasternArabicDigits(ayahNumber)
      : String(ayahNumber);

    if (useOrnamentalStyle === 'symbol') {
      // Arabic end of ayah symbol U+06DD followed by numeral and spacing
      return ` \u06DD${numStr} `;
    } else if (useOrnamentalStyle === 'bracket') {
      return ` ﴿${numStr}﴾ `;
    } else {
      return ` (${numStr}) `;
    }
  };

  const handleInsert = () => {
    const formatted = getFormattedAyahString();
    if (editor) {
      editor.chain().focus().insertContent(formatted).run();
    }
    handleClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      title={t('ayah.title', 'Insert Ayah Number')}
      size="md"
    >
      <div className="space-y-4">
        {/* Surah Selection */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <BookOpen size={14} className="text-emerald-600 dark:text-emerald-400" />
              {t('ayah.surahNumber', 'Surah')}
            </span>
            <span className="text-[11px] font-arabic text-emerald-700 dark:text-emerald-400">
              {selectedSurah.ar} ({selectedSurah.ayahs} {t('ayah.ayahNumber', 'ayahs')})
            </span>
          </label>
          <select
            value={surahNumber}
            onChange={(e) => handleSurahChange(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {SURAHS.map((s) => (
              <option key={s.no} value={s.no}>
                {s.no}. {s.name} - {s.ar} ({s.ayahs} ayat)
              </option>
            ))}
          </select>
        </div>

        {/* Ayah Number Input & Stepper */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Hash size={14} className="text-emerald-600 dark:text-emerald-400" />
              {t('ayah.ayahNumber', 'Ayah Number')}
            </span>
            <span className="text-[11px] text-gray-500">
              1 - {selectedSurah.ayahs}
            </span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={selectedSurah.ayahs}
              value={ayahNumber}
              onChange={(e) => handleAyahChange(parseInt(e.target.value, 10))}
              className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => handleAyahChange(ayahNumber - 1)}
                disabled={ayahNumber <= 1}
                className="px-2.5 py-2 text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 rounded-lg transition-colors"
              >
                -1
              </button>
              <button
                type="button"
                onClick={() => handleAyahChange(ayahNumber + 1)}
                disabled={ayahNumber >= selectedSurah.ayahs}
                className="px-2.5 py-2 text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 rounded-lg transition-colors"
              >
                +1
              </button>
            </div>
          </div>
        </div>

        {/* Style Options */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              {t('ayah.style', 'Style')}
            </label>
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="style"
                  checked={useOrnamentalStyle === 'symbol'}
                  onChange={() => setUseOrnamentalStyle('symbol')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span>{t('ayah.includeSymbol', 'Ayah Mark (۝)')}</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="style"
                  checked={useOrnamentalStyle === 'bracket'}
                  onChange={() => setUseOrnamentalStyle('bracket')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span>Ornate Brackets ﴿ ﴾</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="style"
                  checked={useOrnamentalStyle === 'circle'}
                  onChange={() => setUseOrnamentalStyle('circle')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span>Parentheses ( )</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              {t('ayah.style', 'Numeral Format')}
            </label>
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="numeral"
                  checked={useArabicNumerals}
                  onChange={() => setUseArabicNumerals(true)}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span>{t('ayah.arabicNumerals', 'Arabic (١, ٢, ٣)')}</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="numeral"
                  checked={!useArabicNumerals}
                  onChange={() => setUseArabicNumerals(false)}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span>{t('ayah.standardNumerals', 'Western (1, 2, 3)')}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/40 text-center">
          <div className="text-xs text-amber-800 dark:text-amber-300 font-medium mb-1">
            {t('ayah.preview', 'Preview')}
          </div>
          <div className="text-3xl font-arabic text-amber-900 dark:text-amber-200 py-1" dir="rtl">
            {getFormattedAyahString()}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {t('dialog.cancel', 'Cancel')}
          </button>
          <button
            type="button"
            onClick={handleInsert}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-xs transition-colors"
          >
            <Sparkles size={14} />
            {t('ayah.insert', 'Insert Ayah')}
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default AyahNumberDialog;
