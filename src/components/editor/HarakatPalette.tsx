import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNaskhEditor } from '@/editor/EditorContext';
import { useUIStore } from '@/stores/uiStore';
import { HARAKAT_MAP, HARAKAT_NAMES } from '@/editor/keyboardMaps';
import { X, Sparkles } from 'lucide-react';

export function HarakatPalette() {
  const { t, i18n } = useTranslation();
  const editor = useNaskhEditor();

  const harakatPaletteOpen = useUIStore((s) => s.harakatPaletteOpen);
  const setHarakatPaletteOpen = useUIStore((s) => s.setHarakatPaletteOpen);

  const [activeFKey, setActiveFKey] = useState<string | null>(null);

  if (!harakatPaletteOpen) return null;

  const getHarakatName = (fkey: string) => {
    const info = HARAKAT_NAMES[fkey];
    if (!info) return fkey;
    const lang = i18n.language;
    if (lang === 'ar') return info.ar;
    if (lang === 'id') return info.id;
    return info.en;
  };

  const getHarakatChar = (fkey: string) => {
    const mark = HARAKAT_MAP[fkey];
    if (!mark) return '';
    return Array.isArray(mark) ? mark.join('') : mark;
  };

  const handleInsert = (fkey: string) => {
    setActiveFKey(fkey);
    setTimeout(() => setActiveFKey(null), 120);

    if (!editor) return;
    const char = getHarakatChar(fkey);
    editor.chain().focus().insertContent(char).run();
  };

  const fkeys = [
    'F1',
    'F2',
    'F3',
    'F4',
    'F5',
    'F6',
    'F7',
    'F8',
    'F9',
    'F10',
    'F11',
    'F12',
  ];

  return (
    <div className="bg-amber-50/90 dark:bg-gray-800/95 border-b border-amber-200/70 dark:border-gray-700/80 px-3 py-2 flex items-center justify-between gap-3 shadow-xs z-20 backdrop-blur-xs">
      <div className="flex items-center gap-2 shrink-0">
        <Sparkles size={14} className="text-amber-600 dark:text-amber-400" />
        <span className="text-xs font-semibold text-amber-900 dark:text-amber-200 hidden sm:inline">
          {t('harakat.title', 'Harakat Palette')}
        </span>
      </div>

      {/* Horizontal Strip of Harakat */}
      <div
        className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-thin max-w-4xl"
        dir="rtl"
      >
        {fkeys.map((fkey) => {
          const char = getHarakatChar(fkey);
          const name = getHarakatName(fkey);
          const isPressed = activeFKey === fkey;

          return (
            <button
              key={fkey}
              type="button"
              onClick={() => handleInsert(fkey)}
              title={`${name} (${fkey})`}
              className={`group flex flex-col items-center justify-center min-w-[2.75rem] h-12 px-1 rounded-lg border border-amber-200/70 dark:border-gray-700 bg-white dark:bg-gray-900/90 hover:bg-amber-100/70 dark:hover:bg-amber-950/40 hover:border-amber-400/80 dark:hover:border-amber-500/80 shadow-2xs hover:shadow-xs transition-all ${
                isPressed ? 'scale-90 bg-amber-200 dark:bg-amber-900' : ''
              }`}
            >
              {/* Arabic character with dotted circle placeholder or sample letter */}
              <span className="text-lg font-arabic font-bold text-amber-800 dark:text-amber-300 leading-tight group-hover:scale-110 transition-transform">
                {`ـ${char}`}
              </span>
              {/* F-Key badge */}
              <span className="text-[9px] font-mono font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1 rounded-sm mt-0.5">
                {fkey}
              </span>
            </button>
          );
        })}
      </div>

      {/* Close button */}
      <button
        type="button"
        onClick={() => setHarakatPaletteOpen(false)}
        className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-amber-200/50 dark:hover:bg-gray-700 transition-colors shrink-0"
        title="Close Palette"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default HarakatPalette;
