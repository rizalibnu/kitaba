import { useState, useEffect, useRef } from 'react';
import { Dialog } from '@/components/common/Dialog';
import { useUIStore, type WaqafDialogMode } from '@/stores/uiStore';
import { useNaskhEditor } from '@/editor/EditorContext';
import { KITABA_WAQAF_SIGNS } from '@/types';
import { Check, Hash, Sparkles } from 'lucide-react';

interface WaqafDialogProps {
  open?: boolean;
  onClose?: () => void;
}

export function WaqafDialog({ open, onClose }: WaqafDialogProps) {
  const editor = useNaskhEditor();
  const activeDialog = useUIStore((s) => s.activeDialog);
  const closeDialog = useUIStore((s) => s.closeDialog);
  const waqafDialogMode = useUIStore((s) => s.waqafDialogMode);
  const setWaqafDialogMode = useUIStore((s) => s.setWaqafDialogMode);

  const isOpen = open !== undefined ? open : activeDialog === 'waqaf';

  // Configurable state
  const [mode, setMode] = useState<WaqafDialogMode>('end');
  const [selectedWaqaf, setSelectedWaqaf] = useState<string>(KITABA_WAQAF_SIGNS[0].char);
  const [ayahNumber, setAyahNumber] = useState<string>('1');
  const [withWaqaf, setWithWaqaf] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync mode with store when opened
  useEffect(() => {
    if (isOpen) {
      setMode(waqafDialogMode || 'end');
      if (waqafDialogMode === 'end') {
        setTimeout(() => {
          inputRef.current?.focus();
          inputRef.current?.select();
        }, 60);
      }
    }
  }, [isOpen, waqafDialogMode]);

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

    if (mode === 'mid') {
      // Di Tengah Ayat: Insert tanda waqaf kecil di atas huruf (Unicode Combining Mark)
      editor.chain().focus().insertContent(` ${selectedWaqaf} `).run();
    } else {
      // Di Akhir Ayat: Insert nomor ayat lengkap dengan penutup ornamen Quranic ﴿...﴾
      const num = parseInt(ayahNumber, 10);
      const safeNum = isNaN(num) || num < 1 || num > 286 ? 1 : num;
      const easternNum = toEasternArabicNumerals(safeNum);
      const formattedAyah = `﴿${easternNum}﴾`;

      if (withWaqaf && selectedWaqaf) {
        editor.chain().focus().insertContent(` ${selectedWaqaf} ${formattedAyah} `).run();
      } else {
        editor.chain().focus().insertContent(` ${formattedAyah} `).run();
      }

      // Auto-increment ayah number for next insertion
      if (safeNum < 286) {
        setAyahNumber(String(safeNum + 1));
      }
    }

    handleClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInsert();
    }
  };

  const currentWaqafObj = KITABA_WAQAF_SIGNS.find((w) => w.char === selectedWaqaf) || KITABA_WAQAF_SIGNS[0];

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      title="Tanda Waqaf & Nomor Ayat"
      description="Sisipkan tanda waqaf standar Al-Qur'an di tengah ayat atau nomor ayat berornamen di akhir ayat."
      size="lg"
    >
      <div className="space-y-4 text-xs select-none" onKeyDown={handleKeyDown}>
        {/* Section 1: Configurable Placement Mode Switcher */}
        <div className="flex p-1 bg-gray-100 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => {
              setMode('end');
              setWaqafDialogMode('end');
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md font-medium transition-all text-xs cursor-pointer ${
              mode === 'end'
                ? 'bg-white dark:bg-gray-850 text-emerald-800 dark:text-emerald-300 shadow-xs font-semibold'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Hash size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>Di Akhir Ayat (Nomor Ayat & Waqaf)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('mid');
              setWaqafDialogMode('mid');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md font-medium transition-all text-xs cursor-pointer ${
              mode === 'mid'
                ? 'bg-white dark:bg-gray-850 text-emerald-800 dark:text-emerald-300 shadow-xs font-semibold'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Sparkles size={14} className="text-amber-600 dark:text-amber-400" />
            <span>Di Tengah Ayat (Tanda Waqaf)</span>
          </button>
        </div>

        {/* Section 2: Nomor Ayat Configuration (Only in End Mode) */}
        {mode === 'end' && (
          <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800/40 rounded-xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-150">
            <div className="flex items-center gap-2.5">
              <label className="font-semibold text-gray-800 dark:text-gray-200 text-xs">
                Nomor Ayat:
              </label>
              <input
                ref={inputRef}
                type="number"
                min={1}
                max={286}
                value={ayahNumber}
                onChange={(e) => setAyahNumber(e.target.value)}
                className="w-20 px-2.5 py-1 text-center font-bold text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                (1 s/d 286)
              </span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={withWaqaf}
                onChange={(e) => setWithWaqaf(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <span>Sertakan Tanda Waqaf di Akhir</span>
            </label>
          </div>
        )}

        {/* Section 3: Waqaf Signs Grid */}
        <div
          className={`space-y-2 transition-opacity ${
            mode === 'end' && !withWaqaf ? 'opacity-40 pointer-events-none' : ''
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 px-0.5">
            <span>Pilih Tanda Waqaf Standar Al-Qur'an:</span>
            <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-normal">
              {currentWaqafObj.nameId} ({currentWaqafObj.unicode})
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {KITABA_WAQAF_SIGNS.map((sign) => {
              const isSelected = selectedWaqaf === sign.char;
              return (
                <button
                  type="button"
                  key={sign.id}
                  onClick={() => setSelectedWaqaf(sign.char)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 ring-2 ring-emerald-500/30 text-emerald-950 dark:text-emerald-100 shadow-xs'
                      : 'bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <div className="h-9 flex items-center justify-center">
                    <span
                      className="font-arabic text-2xl font-bold leading-none text-emerald-900 dark:text-emerald-200"
                      dir="rtl"
                    >
                      {sign.displayLabel || sign.char}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-gray-800 dark:text-gray-200 mt-1 truncate max-w-full font-sans">
                    {sign.nameId.split(' (')[0]}
                  </span>
                  <span className="text-[9px] font-mono text-gray-500 dark:text-gray-400">
                    {sign.unicode}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Real-time Live Preview */}
        <div className="p-3.5 bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-between gap-3">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Pratinjau:
          </span>
          <div
            className="font-arabic text-2xl text-gray-900 dark:text-white flex items-center gap-2"
            dir="rtl"
          >
            <span className="text-gray-400 text-base font-sans">...</span>
            {mode === 'mid' ? (
              <span className="text-gray-900 dark:text-white text-xl font-bold">
                قَوْمٍ <span className="waqaf-sign">{selectedWaqaf}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-gray-900 dark:text-white">
                {withWaqaf && (
                  <span className="waqaf-sign text-lg font-bold">
                    {selectedWaqaf}
                  </span>
                )}
                <span className="font-bold">
                  ﴿{toEasternArabicNumerals(ayahNumber || '1')}﴾
                </span>
              </span>
            )}
            <span className="text-gray-400 text-base font-sans">...</span>
          </div>
        </div>

        {/* Section 5: Action Footer */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleInsert}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5 transition-all active:scale-98 cursor-pointer"
          >
            <Check size={15} /> Sisipkan ke Dokumen
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default WaqafDialog;
