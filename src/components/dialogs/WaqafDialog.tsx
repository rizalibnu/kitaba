import { useState, useEffect, useRef } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { useNaskhEditor } from '@/editor/EditorContext';
import { KITABA_WAQAF_SIGNS, type WaqafSign } from '@/types';
import { X } from 'lucide-react';

interface WaqafDialogProps {
  open?: boolean;
  onClose?: () => void;
}

export function WaqafDialog({ open, onClose }: WaqafDialogProps) {
  const editor = useNaskhEditor();
  const activeDialog = useUIStore((s) => s.activeDialog);
  const closeDialog = useUIStore((s) => s.closeDialog);
  const waqafDialogMode = useUIStore((s) => s.waqafDialogMode);

  const isOpen = open !== undefined ? open : activeDialog === 'waqaf';

  // Selected waqaf sign (default: mim 'مـ')
  const [selectedWaqaf, setSelectedWaqaf] = useState<string>('مـ');
  const [ayahNumber, setAyahNumber] = useState<string>('1');
  const [withWaqaf, setWithWaqaf] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Convert Arabic/Eastern numbers
  const toEasternArabicNumerals = (num: number | string): string => {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(num).replace(/[0-9]/g, (d) => arabicDigits[parseInt(d, 10)]);
  };

  // Focus input when dialog opens in end mode
  useEffect(() => {
    if (isOpen && waqafDialogMode === 'end') {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  }, [isOpen, waqafDialogMode]);

  const handleClose = () => {
    if (onClose) onClose();
    else closeDialog();
  };

  const handleInsert = () => {
    if (!editor) return;

    if (waqafDialogMode === 'mid') {
      // Shift+F12: Tanda waqof di tengah ayat
      editor.chain().focus().insertContent(` ${selectedWaqaf} `).run();
    } else {
      // F12: Tanda waqof di akhir ayat (Nomor ayat + opsional waqaf di atasnya)
      const num = parseInt(ayahNumber, 10);
      const safeNum = isNaN(num) || num < 1 || num > 286 ? 1 : num;
      const easternNum = toEasternArabicNumerals(safeNum);

      let contentToInsert = ` ﴿${easternNum}﴾ `;
      if (withWaqaf && selectedWaqaf) {
        contentToInsert = ` ${selectedWaqaf} ﴿${easternNum}﴾ `;
      }

      editor.chain().focus().insertContent(contentToInsert).run();

      // Auto-increment ayah number for next insertion
      if (safeNum < 286) {
        setAyahNumber(String(safeNum + 1));
      }
    }

    handleClose();
  };

  // Handle Enter key for quick submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInsert();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
    }
  };

  if (!isOpen) return null;

  const isEndMode = waqafDialogMode === 'end';
  const title = isEndMode
    ? 'Tanda Waqof di akhir ayat'
    : 'Tanda Waqof di tengah ayat';

  // 12 Waqaf signs ordered in exact 4 rows x 3 columns matrix:
  // Row 1: مـ   , صلى  , صـ
  // Row 2: لا   , ؞    , ق
  // Row 3: جـ   , طـ   , ع
  // Row 4: قلى  , ز    , سكته
  const orderedWaqaf = [
    KITABA_WAQAF_SIGNS[0],  // مـ
    KITABA_WAQAF_SIGNS[1],  // صلى
    KITABA_WAQAF_SIGNS[2],  // صـ
    KITABA_WAQAF_SIGNS[3],  // لا
    KITABA_WAQAF_SIGNS[4],  // ؞
    KITABA_WAQAF_SIGNS[5],  // ق
    KITABA_WAQAF_SIGNS[6],  // جـ
    KITABA_WAQAF_SIGNS[7],  // طـ
    KITABA_WAQAF_SIGNS[8],  // ع
    KITABA_WAQAF_SIGNS[9],  // قلى
    KITABA_WAQAF_SIGNS[10], // ز
    KITABA_WAQAF_SIGNS[11], // سكته
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs animate-in fade-in duration-200"
      onClick={handleClose}
      onKeyDown={handleKeyDown}
    >
      <div
        className="bg-[#ECE9D8] dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-2xl border-2 border-[#0055EA] dark:border-amber-600 w-full max-w-md overflow-hidden select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Windows-style Header Bar */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-gradient-to-r from-[#0058EE] via-[#2F81FB] to-[#0058EE] text-white font-bold text-xs sm:text-sm">
          <span>{title}</span>
          <button
            onClick={handleClose}
            className="w-5 h-5 flex items-center justify-center bg-[#E81123] hover:bg-[#F1707A] active:bg-[#B00] text-white rounded-xs transition-colors cursor-pointer"
            title="Tutup"
          >
            <X size={13} strokeWidth={3} />
          </button>
        </div>

        {/* Dialog Content */}
        <div className="p-4 sm:p-5 space-y-3.5 text-xs">
          {/* Fieldset 1: Nomor Ayat (Only in End Mode / F12) */}
          {isEndMode && (
            <fieldset className="border border-gray-400 dark:border-gray-600 rounded-xs p-3 pt-2 bg-[#F3F0E2] dark:bg-gray-900/60">
              <legend className="px-1 text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                Nomor Ayat
              </legend>
              <div className="flex items-center gap-3">
                <input
                  ref={inputRef}
                  type="number"
                  min={1}
                  max={286}
                  value={ayahNumber}
                  onChange={(e) => setAyahNumber(e.target.value)}
                  className="w-16 px-2 py-0.5 border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-950 font-bold text-center text-sm rounded-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
                <span className="text-[11px] text-gray-600 dark:text-gray-400">
                  Nomor ayat diisi antara 1 s/d 286
                </span>
              </div>
            </fieldset>
          )}

          {/* Fieldset 2: Tanda Waqaf 4x3 Radio Grid */}
          <fieldset
            className={`border border-gray-400 dark:border-gray-600 rounded-xs p-3.5 pt-2.5 bg-[#F3F0E2] dark:bg-gray-900/60 ${
              isEndMode && !withWaqaf ? 'opacity-40 pointer-events-none' : ''
            }`}
          >
            {isEndMode && (
              <legend className="px-1 text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                Tanda Waqaf
              </legend>
            )}

            <div className="grid grid-cols-3 gap-y-3 gap-x-4">
              {orderedWaqaf.map((sign: WaqafSign) => {
                const isChecked = selectedWaqaf === sign.char;
                return (
                  <label
                    key={sign.id}
                    onClick={() => setSelectedWaqaf(sign.char)}
                    className="flex items-center justify-between px-2 py-1 rounded-xs hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="waqaf_selection"
                      checked={isChecked}
                      onChange={() => setSelectedWaqaf(sign.char)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span
                      className="font-arabic font-bold text-2xl text-gray-900 dark:text-white"
                      dir="rtl"
                    >
                      {sign.char}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Bottom Controls */}
          <div className="flex items-center justify-between pt-1">
            {isEndMode ? (
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-800 dark:text-gray-200">
                <input
                  type="checkbox"
                  checked={withWaqaf}
                  onChange={(e) => setWithWaqaf(e.target.checked)}
                  className="w-4 h-4 rounded-xs text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>dengan Tanda <u>W</u>aqof</span>
              </label>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleInsert}
                className="min-w-[5.5rem] px-4 py-1 bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:from-gray-100 hover:to-gray-300 border border-gray-500 dark:border-gray-500 rounded-xs shadow-xs text-xs font-semibold text-gray-900 dark:text-gray-100 active:scale-95 transition-all cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WaqafDialog;
