import { useUIStore } from '@/stores/uiStore';
import { useNaskhEditor } from '@/editor/EditorContext';
import { SPECIAL_CHARACTER_GROUPS, type SpecialCharItem } from '@/types';
import { X, Sparkles } from 'lucide-react';

export function SpecialCharactersPanel() {
  const editor = useNaskhEditor();
  const specialCharactersOpen = useUIStore((s) => s.specialCharactersOpen);
  const toggleSpecialCharacters = useUIStore((s) => s.toggleSpecialCharacters);
  const specialCharactersGroup = useUIStore((s) => s.specialCharactersGroup);
  const setSpecialCharactersGroup = useUIStore((s) => s.setSpecialCharactersGroup);

  if (!specialCharactersOpen) return null;

  const currentGroup =
    SPECIAL_CHARACTER_GROUPS.find((g) => g.id === specialCharactersGroup) ||
    SPECIAL_CHARACTER_GROUPS[0];

  const handleInsert = (text: string) => {
    if (!editor) return;
    editor.chain().focus().insertContent(text).run();
  };

  return (
    <div className="border-t-2 border-amber-500/40 bg-[#EDEBD7] dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-xl z-20 transition-all select-none">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#DEDCC6] dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-amber-700 dark:text-amber-400" />
          <span className="font-semibold tracking-wide text-gray-800 dark:text-gray-200">
            Special Characters (Karakter Spesial)
          </span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400">
            [Shortcut: Alt+1..5 / Alt+(Group, Key)]
          </span>
        </div>

        {/* Tab Groups 1 - 5 */}
        <div className="flex items-center gap-1">
          {SPECIAL_CHARACTER_GROUPS.map((grp) => (
            <button
              key={grp.id}
              onClick={() => setSpecialCharactersGroup(grp.id)}
              className={`px-2.5 py-0.5 text-xs font-medium rounded-t-md border border-b-0 transition-colors ${
                specialCharactersGroup === grp.id
                  ? 'bg-[#EDEBD7] dark:bg-gray-800 text-amber-900 dark:text-amber-300 font-bold border-gray-400 dark:border-gray-600 shadow-xs'
                  : 'bg-[#D2D0B8] dark:bg-gray-950 text-gray-600 dark:text-gray-400 hover:bg-[#DDDBC2] border-transparent'
              }`}
            >
              Group {grp.id}
            </button>
          ))}
        </div>

        <button
          onClick={toggleSpecialCharacters}
          className="p-1 rounded-sm hover:bg-black/10 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300"
          title="Close Special Characters (Ctrl+K)"
        >
          <X size={15} />
        </button>
      </div>

      {/* Grid of Characters (Two rows: Top row with Alt shortcut, Middle shortcut letter, Bottom row) */}
      <div className="p-2 overflow-x-auto">
        <div className="flex items-stretch gap-1.5 justify-start min-w-max pb-1">
          {currentGroup.items.map((item: SpecialCharItem) => (
            <div
              key={item.id}
              className="flex flex-col items-center bg-[#F8F7EE] dark:bg-gray-700/80 rounded-md border border-gray-300 dark:border-gray-600 shadow-xs hover:border-amber-500 transition-colors"
              style={{ width: '80px' }}
            >
              {/* Top Character Button */}
              <button
                onClick={() => handleInsert(item.charTop)}
                title={`${item.labelTop} (Alt+${currentGroup.id}, ${item.keyLetter})`}
                className="w-full h-12 flex items-center justify-center text-lg font-arabic font-bold text-gray-900 dark:text-white hover:bg-amber-100 dark:hover:bg-amber-950/60 rounded-t-md transition-colors px-1"
                dir="rtl"
              >
                {item.charTop}
              </button>

              {/* Middle Key Letter Indicator */}
              <div className="w-full py-0.5 bg-[#E4E2CC] dark:bg-gray-800 text-[10px] font-mono font-bold text-center text-amber-800 dark:text-amber-400 border-y border-gray-300 dark:border-gray-600">
                {item.keyLetter}
              </div>

              {/* Bottom Character Button */}
              <button
                onClick={() => handleInsert(item.charBottom)}
                title={`${item.labelBottom} (${item.keyLetter})`}
                className="w-full h-12 flex items-center justify-center text-lg font-arabic font-bold text-gray-900 dark:text-white hover:bg-amber-100 dark:hover:bg-amber-950/60 rounded-b-md transition-colors px-1"
                dir="rtl"
              >
                {item.charBottom}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SpecialCharactersPanel;
