import { useState } from 'react';
import { Dialog } from '@/components/common/Dialog';
import { useUIStore } from '@/stores/uiStore';
import { useNaskhEditor } from '@/editor/EditorContext';
import { KITABA_WAQAF_SIGNS, type WaqafSign } from '@/types';
import { Check } from 'lucide-react';

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
  const [selectedWaqaf, setSelectedWaqaf] = useState<string>(KITABA_WAQAF_SIGNS[0].char);
  const [ayahNumber, setAyahNumber] = useState<string>('1');
  const [withWaqaf, setWithWaqaf] = useState<boolean>(true);

  // Convert Arabic/Eastern numbers
  const toEasternArabicNumerals = (num: number | string): string => {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(num).replace(/[0-9]/g, (d) => arabicDigits[parseInt(d, 10)]);
  };

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
    }

    handleClose();
  };

  const isEndMode = waqafDialogMode === 'end';
  const title = isEndMode
    ? 'Tanda Waqof di akhir ayat (Nomor Ayat & Waqaf)'
    : 'Tanda Waqof di tengah ayat';

  return (
    <Dialog open={isOpen} onClose={handleClose} title={title} size="md">
      <div className="space-y-4 select-none text-xs text-gray-800 dark:text-gray-200">
        {/* Nomor Ayat section (Only in End Mode / F12) */}
        {isEndMode && (
          <div className="p-3 bg-[#F4F3E8] dark:bg-gray-800/80 rounded-md border border-gray-300 dark:border-gray-700 space-y-2">
            <div className="flex items-center gap-3">
              <label className="font-semibold text-gray-700 dark:text-gray-300">
                Nomor Ayat:
              </label>
              <input
                type="number"
                min={1}
                max={286}
                value={ayahNumber}
                onChange={(e) => setAyahNumber(e.target.value)}
                className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 font-bold text-center text-sm focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
              />
              <span className="text-[11px] text-gray-500">
                (Nomor ayat diisi antara 1 s/d 286)
              </span>
            </div>

            {/* Preview of Ayah Number */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-gray-500 text-[11px]">Preview:</span>
              <span className="font-arabic text-xl font-bold text-amber-900 dark:text-amber-300 px-2 py-0.5 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                {withWaqaf ? `${selectedWaqaf} ` : ''}﴿{toEasternArabicNumerals(ayahNumber || 1)}﴾
              </span>
            </div>
          </div>
        )}

        {/* Tanda Waqaf 12-Grid */}
        <div className="p-3 bg-[#F8F7EE] dark:bg-gray-800/50 rounded-md border border-gray-300 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {isEndMode ? 'Pilihan Tanda Waqaf di atas nomor ayat:' : 'Pilih Tanda Waqaf:'}
            </span>
            {isEndMode && (
              <label className="flex items-center gap-1.5 cursor-pointer text-[11px]">
                <input
                  type="checkbox"
                  checked={withWaqaf}
                  onChange={(e) => setWithWaqaf(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span>dengan Tanda Waqof</span>
              </label>
            )}
          </div>

          <div
            className={`grid grid-cols-4 gap-2 ${
              isEndMode && !withWaqaf ? 'opacity-40 pointer-events-none' : ''
            }`}
          >
            {KITABA_WAQAF_SIGNS.map((sign: WaqafSign) => {
              const isSelected = selectedWaqaf === sign.char;
              return (
                <label
                  key={sign.id}
                  onClick={() => setSelectedWaqaf(sign.char)}
                  className={`flex flex-col items-center justify-center p-2 rounded-md border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-500 text-amber-950 dark:text-amber-100 font-bold shadow-xs'
                      : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-400 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="waqafSignRadio"
                      checked={isSelected}
                      onChange={() => setSelectedWaqaf(sign.char)}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="font-arabic text-xl font-bold" dir="rtl">
                      {sign.char}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-full">
                    {sign.nameId}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Footer OK & Cancel */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={handleClose}
            className="px-4 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            className="px-5 py-1.5 rounded-md bg-amber-600 text-white font-semibold hover:bg-amber-700 shadow-xs flex items-center gap-1.5"
          >
            <Check size={14} /> OK
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default WaqafDialog;
