import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNaskhEditor } from '@/editor/EditorContext';
import { useUIStore } from '@/stores/uiStore';
import { useKeyboardStore, type KeyboardMode } from '@/stores/keyboardStore';
import {
  X,
  CornerDownLeft,
  Delete,
  Space,
  ArrowBigUp,
  Keyboard as KeyboardIcon,
} from 'lucide-react';

interface KeyConfig {
  normal: string;
  shift?: string;
  display?: string;
  shiftDisplay?: string;
  width?: string;
  isAction?: boolean;
}

export function VirtualKeyboard() {
  const { t } = useTranslation();
  const editor = useNaskhEditor();

  const virtualKeyboardOpen = useUIStore((s) => s.virtualKeyboardOpen);
  const setVirtualKeyboardOpen = useUIStore((s) => s.setVirtualKeyboardOpen);

  const keyboardMode = useKeyboardStore((s) => s.keyboardMode);
  const setKeyboardMode = useKeyboardStore((s) => s.setKeyboardMode);
  const isVirtualKeyboardCaps = useKeyboardStore((s) => s.isVirtualKeyboardCaps);
  const toggleCaps = useKeyboardStore((s) => s.toggleCaps);

  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [physicalShift, setPhysicalShift] = useState(false);

  // Listen to physical keyboard Shift keydown and keyup events
  useEffect(() => {
    if (!virtualKeyboardOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setPhysicalShift(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setPhysicalShift(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [virtualKeyboardOpen]);

  if (!virtualKeyboardOpen) return null;

  const isShiftActive = isVirtualKeyboardCaps || physicalShift;

  const handleKeyClick = (char: string) => {
    setActiveKey(char);
    setTimeout(() => setActiveKey(null), 120);

    if (!editor) return;

    editor.chain().focus().insertContent(char).run();
  };

  const handleBackspace = () => {
    if (!editor) return;
    editor.chain().focus().deleteRange({ from: editor.state.selection.from - 1, to: editor.state.selection.from }).run();
  };

  const handleEnter = () => {
    if (!editor) return;
    editor.chain().focus().splitBlock().run();
  };

  const handleSpace = () => {
    if (!editor) return;
    editor.chain().focus().insertContent(' ').run();
  };

  // Harakat bar symbols
  const harakatBar = [
    { label: 'َ', char: '\u064E', name: 'Fathah' },
    { label: 'ِ', char: '\u0650', name: 'Kasrah' },
    { label: 'ُ', char: '\u064F', name: 'Dhammah' },
    { label: 'ً', char: '\u064B', name: 'Fathatain' },
    { label: 'ٍ', char: '\u064D', name: 'Kasratain' },
    { label: 'ٌ', char: '\u064C', name: 'Dhammatain' },
    { label: 'ّ', char: '\u0651', name: 'Tasydid' },
    { label: 'َّ', char: '\u0651\u064E', name: 'Tasydid + Fathah' },
    { label: 'ِّ', char: '\u0651\u0650', name: 'Tasydid + Kasrah' },
    { label: 'ُّ', char: '\u0651\u064F', name: 'Tasydid + Dhammah' },
    { label: 'ۤ', char: '\u0653', name: 'Maddah' },
    { label: 'ْ', char: '\u0652', name: 'Sukun' },
    { label: 'ـ', char: '\u0640', name: 'Kashida (Tatweel)' },
    { label: 'ﷺ', char: 'ﷺ', name: 'SAW' },
    { label: 'ﷻ', char: 'ﷻ', name: 'Jalla' },
    { label: '۝', char: '\u06DD', name: 'Ayah' },
  ];

  // Arabic Numeral Row
  const numberRow: KeyConfig[] = [
    { normal: 'ذ', shift: 'ّ' },
    { normal: '١', shift: '!' },
    { normal: '٢', shift: '@' },
    { normal: '٣', shift: '#' },
    { normal: '٤', shift: '$' },
    { normal: '٥', shift: '%' },
    { normal: '٦', shift: '^' },
    { normal: '٧', shift: '&' },
    { normal: '٨', shift: '*' },
    { normal: '٩', shift: '(' },
    { normal: '٠', shift: ')' },
    { normal: '-', shift: '_' },
    { normal: '=', shift: '+' },
  ];

  // Arabic Standard Keyboard Layout (Windows 101 Arabic Layout - RTL Rows)
  const row1: KeyConfig[] = [
    { normal: 'ض', shift: 'َ' },
    { normal: 'ص', shift: 'ً' },
    { normal: 'ث', shift: 'ُ' },
    { normal: 'ق', shift: 'ٌ' },
    { normal: 'ف', shift: 'لإ' },
    { normal: 'غ', shift: 'إ' },
    { normal: 'ع', shift: '‘' },
    { normal: 'ه', shift: '÷' },
    { normal: 'خ', shift: '×' },
    { normal: 'ح', shift: '؛' },
    { normal: 'ج', shift: '<' },
    { normal: 'د', shift: '>' },
    { normal: '\\', shift: '|' },
  ];

  const row2: KeyConfig[] = [
    { normal: 'ش', shift: 'ِ' },
    { normal: 'س', shift: 'ٍ' },
    { normal: 'ي', shift: ']' },
    { normal: 'ب', shift: '[' },
    { normal: 'ل', shift: 'لأ' },
    { normal: 'ا', shift: 'أ' },
    { normal: 'ت', shift: 'ـ' },
    { normal: 'ن', shift: '،' },
    { normal: 'م', shift: '/' },
    { normal: 'ك', shift: ':' },
    { normal: 'ط', shift: '"' },
  ];

  const row3: KeyConfig[] = [
    { normal: 'ئ', shift: '~' },
    { normal: 'ء', shift: 'ْ' },
    { normal: 'ؤ', shift: '}' },
    { normal: 'ر', shift: '{' },
    { normal: 'لا', shift: 'لآ' },
    { normal: 'ى', shift: 'آ' },
    { normal: 'ة', shift: '،' },
    { normal: 'و', shift: ',' },
    { normal: 'ز', shift: '.' },
    { normal: 'ظ', shift: '؟' },
  ];

  return (
    <div className="w-full flex justify-center px-6 sm:px-12 py-5 bg-[#EDEAE0]/95 dark:bg-gray-950/95 border-t border-gray-300 dark:border-gray-800 z-30 select-none backdrop-blur-xs">
      <aside
        aria-label="Arabic Virtual Keyboard"
        className="w-full max-w-4xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-300 dark:border-gray-700/80 p-4 sm:p-6 shadow-2xl flex flex-col gap-3.5"
      >
        {/* Top Controller Bar */}
        <div className="flex items-center justify-between px-2 pb-1 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
              <KeyboardIcon size={16} className="text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">{t('keyboard.title', 'Papan Ketik Virtual')}</span>
            </div>

            {/* Mode Selector */}
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-xs border border-gray-200 dark:border-gray-700 gap-1">
              {(['regular', 'standard', 'arabic'] as KeyboardMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setKeyboardMode(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    keyboardMode === mode
                      ? 'bg-white dark:bg-gray-700 text-amber-800 dark:text-amber-300 font-bold shadow-xs'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                  }`}
                >
                  {t(`keyboard.${mode}`, mode)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggleCaps}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isShiftActive
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <ArrowBigUp size={15} className={isShiftActive ? 'fill-current' : ''} />
              <span>Shift {physicalShift ? '(Keyboard)' : ''}</span>
            </button>

            <button
              type="button"
              onClick={() => setVirtualKeyboardOpen(false)}
              className="p-1.5 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              title={t('keyboard.hide', 'Tutup Keyboard')}
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Harakat Quick Strip */}
        <div
          className="flex items-center gap-2 overflow-x-auto py-1 px-1 scrollbar-thin"
          dir="rtl"
        >
          {harakatBar.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleKeyClick(item.char)}
              title={item.name}
              className="virtual-key min-w-[2.5rem] h-9 text-base shrink-0 bg-amber-50/70 dark:bg-gray-800/80 border-amber-200/80 dark:border-gray-700 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-arabic font-bold rounded-lg transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Main Arabic Keyboard Layout (RTL) */}
        <div className="flex flex-col gap-2 w-full" dir="rtl">
          {/* Row 0: Numbers */}
          <div className="flex items-center gap-1.5 justify-center">
            {numberRow.map((key, i) => {
              const char = isShiftActive && key.shift ? key.shift : key.normal;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleKeyClick(char)}
                  className={`virtual-key flex-1 min-w-[1.8rem] sm:min-w-[2.2rem] h-9 sm:h-10 text-sm sm:text-base font-arabic font-semibold rounded-md ${
                    activeKey === char ? 'scale-90 bg-amber-200 dark:bg-amber-800' : ''
                  }`}
                >
                  {char}
                </button>
              );
            })}
            {/* Backspace on Row 0 */}
            <button
              type="button"
              onClick={handleBackspace}
              title={t('keyboard.backspace', 'Backspace')}
              className="virtual-key flex-[1.5] min-w-[3rem] h-9 sm:h-10 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-rose-700 dark:text-rose-400 flex items-center justify-center rounded-md cursor-pointer"
            >
              <Delete size={18} />
            </button>
          </div>

          {/* Row 1 */}
          <div className="flex items-center gap-1 justify-center">
            {row1.map((key, i) => {
              const char = isShiftActive && key.shift ? key.shift : key.normal;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleKeyClick(char)}
                  className={`virtual-key flex-1 min-w-[2rem] sm:min-w-[2.5rem] h-9 sm:h-10 text-base sm:text-lg font-arabic font-semibold rounded-md ${
                    activeKey === char ? 'scale-90 bg-amber-200 dark:bg-amber-800' : ''
                  }`}
                >
                  {char}
                </button>
              );
            })}
          </div>

          {/* Row 2 */}
          <div className="flex items-center gap-1 justify-center">
            {row2.map((key, i) => {
              const char = isShiftActive && key.shift ? key.shift : key.normal;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleKeyClick(char)}
                  className={`virtual-key flex-1 min-w-[2rem] sm:min-w-[2.5rem] h-9 sm:h-10 text-base sm:text-lg font-arabic font-semibold rounded-md ${
                    activeKey === char ? 'scale-90 bg-amber-200 dark:bg-amber-800' : ''
                  }`}
                >
                  {char}
                </button>
              );
            })}
            {/* Enter on Row 2 */}
            <button
              type="button"
              onClick={handleEnter}
              title={t('keyboard.enter', 'Enter')}
              className="virtual-key flex-[1.5] min-w-[3rem] h-9 sm:h-10 bg-amber-600 hover:bg-amber-700 text-white border-amber-600 flex items-center justify-center rounded-md cursor-pointer"
            >
              <CornerDownLeft size={16} />
            </button>
          </div>

          {/* Row 3 */}
          <div className="flex items-center gap-1 justify-center">
            {/* Shift Key */}
            <button
              type="button"
              onClick={toggleCaps}
              title={t('keyboard.shift', 'Shift')}
              className={`virtual-key flex-[1.4] min-w-[2.8rem] h-9 sm:h-10 flex items-center justify-center gap-1 text-xs font-semibold rounded-md cursor-pointer ${
                isShiftActive
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700'
              }`}
            >
              <ArrowBigUp size={16} className={isShiftActive ? 'fill-current' : ''} />
            </button>

            {row3.map((key, i) => {
              const char = isShiftActive && key.shift ? key.shift : key.normal;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleKeyClick(char)}
                  className={`virtual-key flex-1 min-w-[2rem] sm:min-w-[2.5rem] h-9 sm:h-10 text-base sm:text-lg font-arabic font-semibold rounded-md ${
                    activeKey === char ? 'scale-90 bg-amber-200 dark:bg-amber-800' : ''
                  }`}
                >
                  {char}
                </button>
              );
            })}
          </div>

          {/* Bottom Row: Space & Utility */}
          <div className="flex items-center gap-1.5 justify-center pt-0.5">
            <button
              type="button"
              onClick={() => handleKeyClick('،')}
              className="virtual-key min-w-[2.5rem] h-9 text-base font-arabic font-bold rounded-md"
            >
              ،
            </button>
            <button
              type="button"
              onClick={() => handleKeyClick('؟')}
              className="virtual-key min-w-[2.5rem] h-9 text-base font-arabic font-bold rounded-md"
            >
              ؟
            </button>
            <button
              type="button"
              onClick={handleSpace}
              aria-label={t('keyboard.space', 'Spasi')}
              className="virtual-key flex-1 max-w-md h-9 sm:h-10 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center gap-2 text-xs font-medium text-gray-500 rounded-md"
            >
              <Space size={16} />
              <span className="hidden sm:inline">{t('keyboard.space', 'Spasi')}</span>
            </button>
            <button
              type="button"
              onClick={() => handleKeyClick('.')}
              className="virtual-key min-w-[2.5rem] h-9 text-base font-arabic font-bold rounded-md"
            >
              .
            </button>
            <button
              type="button"
              onClick={() => handleKeyClick(':')}
              className="virtual-key min-w-[2.5rem] h-9 text-base font-arabic font-bold rounded-md"
            >
              :
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default VirtualKeyboard;
