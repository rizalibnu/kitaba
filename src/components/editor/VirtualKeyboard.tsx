import { useState } from 'react';
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

  if (!virtualKeyboardOpen) return null;

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

  // Arabic Keyboard Layout Rows (Standard Arabic 101/102 RTL)
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
    <aside
      aria-label="Arabic Virtual Keyboard"
      className="border-t border-gray-200 dark:border-gray-700 bg-gray-100/90 dark:bg-gray-900/95 backdrop-blur-md p-2.5 sm:p-3 select-none transition-all duration-200 shadow-lg z-30 flex flex-col gap-2"
    >
      {/* Top Controller Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
            <KeyboardIcon size={15} className="text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">{t('keyboard.title', 'Arabic Keyboard')}</span>
          </div>

          {/* Mode Selector */}
          <div className="flex bg-gray-200 dark:bg-gray-800 p-0.5 rounded-lg text-xs">
            {(['regular', 'standard', 'arabic'] as KeyboardMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setKeyboardMode(mode)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  keyboardMode === mode
                    ? 'bg-white dark:bg-gray-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
              >
                {t(`keyboard.${mode}`, mode)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleCaps}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              isVirtualKeyboardCaps
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <ArrowBigUp size={14} />
            <span>Shift</span>
          </button>

          <button
            type="button"
            onClick={() => setVirtualKeyboardOpen(false)}
            className="p-1 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            title={t('keyboard.hide', 'Hide Keyboard')}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Harakat Quick Strip */}
      <div
        className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin pr-1"
        dir="rtl"
      >
        {harakatBar.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleKeyClick(item.char)}
            title={item.name}
            className="virtual-key min-w-[2.25rem] h-8 text-base shrink-0 bg-amber-50/50 dark:bg-gray-800/80 border-amber-200/60 dark:border-gray-700 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-amber-800 dark:text-amber-300 font-arabic font-bold"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Arabic Keyboard Layout (RTL) */}
      <div className="flex flex-col gap-1.5 max-w-4xl mx-auto w-full" dir="rtl">
        {/* Row 0: Numbers */}
        <div className="flex items-center gap-1 justify-center">
          {numberRow.map((key, i) => {
            const char = isVirtualKeyboardCaps && key.shift ? key.shift : key.normal;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleKeyClick(char)}
                className={`virtual-key flex-1 min-w-[1.8rem] sm:min-w-[2.2rem] h-9 sm:h-10 text-sm sm:text-base font-arabic font-semibold ${
                  activeKey === char ? 'scale-90 bg-emerald-200 dark:bg-emerald-800' : ''
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
            className="virtual-key flex-[1.5] min-w-[3rem] h-9 sm:h-10 bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-rose-700 dark:text-rose-400 flex items-center justify-center"
          >
            <Delete size={18} />
          </button>
        </div>

        {/* Row 1 */}
        <div className="flex items-center gap-1 justify-center">
          {row1.map((key, i) => {
            const char = isVirtualKeyboardCaps && key.shift ? key.shift : key.normal;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleKeyClick(char)}
                className={`virtual-key flex-1 min-w-[2rem] sm:min-w-[2.5rem] h-9 sm:h-10 text-base sm:text-lg font-arabic font-semibold ${
                  activeKey === char ? 'scale-90 bg-emerald-200 dark:bg-emerald-800' : ''
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
            const char = isVirtualKeyboardCaps && key.shift ? key.shift : key.normal;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleKeyClick(char)}
                className={`virtual-key flex-1 min-w-[2rem] sm:min-w-[2.5rem] h-9 sm:h-10 text-base sm:text-lg font-arabic font-semibold ${
                  activeKey === char ? 'scale-90 bg-emerald-200 dark:bg-emerald-800' : ''
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
            className="virtual-key flex-[1.5] min-w-[3rem] h-9 sm:h-10 bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 flex items-center justify-center"
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
            className={`virtual-key flex-[1.4] min-w-[2.8rem] h-9 sm:h-10 flex items-center justify-center gap-1 text-xs font-semibold ${
              isVirtualKeyboardCaps
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <ArrowBigUp size={16} />
          </button>

          {row3.map((key, i) => {
            const char = isVirtualKeyboardCaps && key.shift ? key.shift : key.normal;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleKeyClick(char)}
                className={`virtual-key flex-1 min-w-[2rem] sm:min-w-[2.5rem] h-9 sm:h-10 text-base sm:text-lg font-arabic font-semibold ${
                  activeKey === char ? 'scale-90 bg-emerald-200 dark:bg-emerald-800' : ''
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
            className="virtual-key min-w-[2.5rem] h-9 text-base font-arabic font-bold"
          >
            ،
          </button>
          <button
            type="button"
            onClick={() => handleKeyClick('؟')}
            className="virtual-key min-w-[2.5rem] h-9 text-base font-arabic font-bold"
          >
            ؟
          </button>
          <button
            type="button"
            onClick={handleSpace}
            aria-label={t('keyboard.space', 'Space')}
            className="virtual-key flex-1 max-w-md h-9 sm:h-10 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center gap-2 text-xs font-medium text-gray-500"
          >
            <Space size={16} />
            <span className="hidden sm:inline">{t('keyboard.space', 'Space')}</span>
          </button>
          <button
            type="button"
            onClick={() => handleKeyClick('.')}
            className="virtual-key min-w-[2.5rem] h-9 text-base font-arabic font-bold"
          >
            .
          </button>
          <button
            type="button"
            onClick={() => handleKeyClick(':')}
            className="virtual-key min-w-[2.5rem] h-9 text-base font-arabic font-bold"
          >
            :
          </button>
        </div>
      </div>
    </aside>
  );
}

export default VirtualKeyboard;
