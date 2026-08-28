import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNaskhEditor } from '@/editor/EditorContext';
import { useUIStore } from '@/stores/uiStore';
import { HARAKAT_CATEGORIES, type HarakatItem } from '@/editor/keyboardMaps';
import { X, Sparkles } from 'lucide-react';

export function HarakatPalette() {
  const { t, i18n } = useTranslation();
  const editor = useNaskhEditor();

  const harakatPaletteOpen = useUIStore((s) => s.harakatPaletteOpen);
  const setHarakatPaletteOpen = useUIStore((s) => s.setHarakatPaletteOpen);

  const [activeCategory, setActiveCategory] = useState<'all' | 'single' | 'tasydid' | 'maddah'>('all');
  const [pressedId, setPressedId] = useState<string | null>(null);

  if (!harakatPaletteOpen) return null;

  const handleInsert = (item: HarakatItem) => {
    setPressedId(item.id);
    setTimeout(() => setPressedId(null), 150);

    if (!editor) return;

    // Remove existing harakat before cursor and insert new one
    const { state } = editor;
    const { from } = state.selection;
    let deleteFrom = from;
    const HARAKAT_REGEX = /[\u064B-\u065F\u0670\u06D6-\u06ED]/;

    while (deleteFrom > 0) {
      const charBefore = state.doc.textBetween(deleteFrom - 1, deleteFrom, '');
      if (charBefore && HARAKAT_REGEX.test(charBefore)) {
        deleteFrom--;
      } else {
        break;
      }
    }

    if (deleteFrom < from) {
      editor.chain().focus().deleteRange({ from: deleteFrom, to: from }).insertContent(item.char).run();
    } else {
      editor.chain().focus().insertContent(item.char).run();
    }
  };

  const getCategoryTitle = (cat: typeof HARAKAT_CATEGORIES[0]) => {
    const lang = i18n.language;
    if (lang === 'ar') return cat.titleAr;
    if (lang === 'en') return cat.titleEn;
    return cat.titleId;
  };

  const getItemName = (item: HarakatItem) => {
    const lang = i18n.language;
    if (lang === 'ar') return item.nameAr;
    if (lang === 'en') return item.nameEn;
    return item.nameId;
  };

  const visibleCategories =
    activeCategory === 'all'
      ? HARAKAT_CATEGORIES
      : HARAKAT_CATEGORIES.filter((c) => c.id === activeCategory);

  return (
    <div className="border-b-2 border-amber-500/40 bg-[#EDEAE0] dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-xl z-20 transition-all select-none">
      {/* Top Bar / Category Switcher */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-2 bg-[#DED9CA] dark:bg-gray-950 border-b border-gray-300 dark:border-gray-800 text-xs">
        <div className="flex items-center gap-2.5">
          <Sparkles size={16} className="text-amber-700 dark:text-amber-400" />
          <span className="font-bold tracking-wide text-gray-900 dark:text-gray-100 text-xs sm:text-sm">
            {t('harakat.panelTitle', 'Panel Tanda Harakat & Tashkeel')}
          </span>
          <span className="hidden md:inline text-[11px] text-gray-600 dark:text-gray-400 font-mono bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">
            F1 - F10 • Shift+F1..F10 • Ctrl+F1..F10
          </span>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-white/60 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
            }`}
          >
            Semua (All)
          </button>
          {HARAKAT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-white/60 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
              }`}
            >
              {cat.id === 'single'
                ? 'Tunggal (F1-F10)'
                : cat.id === 'tasydid'
                ? 'Tasydid (Shift+F)'
                : 'Maddah (Ctrl+F)'}
            </button>
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={() => setHarakatPaletteOpen(false)}
          className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors cursor-pointer ml-2"
          title="Tutup Panel Harakat"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content Columns / Grid */}
      <div className="p-3 sm:p-4 overflow-x-auto max-h-72">
        <div className="flex flex-wrap lg:flex-nowrap items-start justify-center gap-4 min-w-max mx-auto">
          {visibleCategories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col bg-white/70 dark:bg-gray-800/80 rounded-xl border border-gray-300 dark:border-gray-700 p-2.5 shadow-2xs"
            >
              {/* Category Header */}
              <div className="text-[11px] font-bold text-amber-900 dark:text-amber-300 pb-1.5 mb-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2">
                <span>{getCategoryTitle(category)}</span>
                <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400">
                  {category.items.length} item
                </span>
              </div>

              {/* Items row */}
              <div className="flex items-center gap-2">
                {category.items.map((item) => {
                  const isPressed = pressedId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleInsert(item)}
                      title={`${getItemName(item)} (${item.shortcut})`}
                      className={`group flex flex-col items-center justify-between w-12 h-20 p-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer ${
                        isPressed ? 'scale-90 bg-amber-200 dark:bg-amber-900' : ''
                      }`}
                    >
                      {/* Shortcut Badge */}
                      <span className="text-[9px] font-mono font-bold text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-1 py-0.2 rounded-xs leading-none">
                        {item.shortcut.replace('Shift + ', 'S+').replace('Ctrl + ', 'C+')}
                      </span>

                      {/* Preview Character (e.g. بَ , بِّ , بّٓ) */}
                      <span
                        className="text-2xl font-arabic font-bold text-gray-900 dark:text-white leading-none my-auto group-hover:scale-115 transition-transform"
                        dir="rtl"
                      >
                        {item.sampleWithBa}
                      </span>

                      {/* Harakat Label name */}
                      <span className="text-[8px] text-gray-600 dark:text-gray-400 truncate max-w-full text-center leading-tight">
                        {getItemName(item)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HarakatPalette;
