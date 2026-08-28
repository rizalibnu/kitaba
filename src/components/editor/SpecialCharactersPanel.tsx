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
    <div className="border-t-2 border-amber-500/50 bg-[#EDEAE0] dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-2xl z-20 transition-all select-none">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-2.5 bg-[#DED9CA] dark:bg-gray-950 border-b border-gray-300 dark:border-gray-800 text-xs">
        <div className="flex items-center gap-3">
          <Sparkles size={16} className="text-amber-700 dark:text-amber-400" />
          <span className="font-bold tracking-wide text-gray-900 dark:text-gray-100 text-xs sm:text-sm">
            Karakter Spesial & Simbol Kaligrafi
          </span>
          <span className="hidden sm:inline text-[11px] text-gray-600 dark:text-gray-400 font-mono bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">
            Shortcut: Alt+1..5 / Option+1..5
          </span>
        </div>

        {/* Tab Groups 1 - 5 */}
        <div className="flex items-center gap-2">
          {SPECIAL_CHARACTER_GROUPS.map((grp) => (
            <button
              key={grp.id}
              onClick={() => setSpecialCharactersGroup(grp.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-t-lg border border-b-0 transition-all cursor-pointer ${
                specialCharactersGroup === grp.id
                  ? 'bg-[#EDEAE0] dark:bg-gray-900 text-amber-900 dark:text-amber-300 border-gray-400 dark:border-gray-700 shadow-xs translate-y-[1px]'
                  : 'bg-[#CECAB9] dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-[#DDD9C8] dark:hover:bg-gray-700 border-transparent'
              }`}
            >
              Grup {grp.id}
            </button>
          ))}
        </div>

        <button
          onClick={toggleSpecialCharacters}
          className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
          title="Tutup Panel Karakter Spesial (Ctrl+K)"
        >
          <X size={16} />
        </button>
      </div>

      {/* Grid of Characters */}
      <div className="p-3 sm:p-4 overflow-x-auto flex justify-center">
        <div className="flex items-stretch gap-2.5 justify-center min-w-max mx-auto pb-1">
          {currentGroup.items.map((item: SpecialCharItem) => {
            const isLongText = item.charTop.length > 10 || item.charBottom.length > 10;
            return (
              <div
                key={item.id}
                className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 shadow-xs hover:border-amber-500 hover:shadow-md transition-all"
                style={{ width: isLongText ? '120px' : '90px' }}
              >
                {/* Top Character Button */}
                <button
                  onClick={() => handleInsert(item.charTop)}
                  title={`${item.labelTop} (Alt+${currentGroup.id}, ${item.keyLetter})`}
                  className="w-full h-14 flex items-center justify-center text-center font-arabic font-bold text-gray-900 dark:text-white hover:bg-amber-100/70 dark:hover:bg-amber-950/60 rounded-t-xl transition-colors px-2 cursor-pointer leading-snug overflow-hidden"
                  style={{ fontSize: isLongText ? '13px' : '20px' }}
                  dir="rtl"
                >
                  {item.charTop}
                </button>

                {/* Middle Key Letter Indicator */}
                <div className="w-full py-0.5 bg-[#F0ECE1] dark:bg-gray-700/70 text-[11px] font-mono font-bold text-center text-amber-900 dark:text-amber-300 border-y border-gray-200 dark:border-gray-700">
                  {item.keyLetter}
                </div>

                {/* Bottom Character Button */}
                <button
                  onClick={() => handleInsert(item.charBottom)}
                  title={`${item.labelBottom} (${item.keyLetter})`}
                  className="w-full h-14 flex items-center justify-center text-center font-arabic font-bold text-gray-900 dark:text-white hover:bg-amber-100/70 dark:hover:bg-amber-950/60 rounded-b-xl transition-colors px-2 cursor-pointer leading-snug overflow-hidden"
                  style={{ fontSize: isLongText ? '13px' : '20px' }}
                  dir="rtl"
                >
                  {item.charBottom}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SpecialCharactersPanel;
