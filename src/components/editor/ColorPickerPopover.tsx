import { useState, useEffect, useRef } from 'react';
import type { Editor } from '@tiptap/react';
import { Check, RotateCcw, Palette } from 'lucide-react';

interface ColorPickerPopoverProps {
  editor: Editor | null;
  open: boolean;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLElement | null>;
}

// Preset warna khusus teks Arab, Mushaf Tajwid, & Kaligrafi
const TAJWID_COLORS = [
  { color: '#000000', label: 'Hitam (Teks Utama)' },
  { color: '#DC2626', label: 'Merah Tajwid (Idgham/Waqaf)' },
  { color: '#059669', label: 'Hijau Tajwid (Ikhfa/Ghunnah)' },
  { color: '#2563EB', label: 'Biru Tajwid (Qalqalah/Mad)' },
  { color: '#D97706', label: 'Emas Kaligrafi' },
  { color: '#4B5563', label: 'Abu-abu' },
];

const STANDARD_PALETTE = [
  // Baris 1: Monokrom & Netral
  ['#000000', '#1F2937', '#4B5563', '#6B7280', '#9CA3AF', '#D1D5DB'],
  // Baris 2: Merah & Cokelat
  ['#7F1D1D', '#991B1B', '#DC2626', '#EF4444', '#78350F', '#B45309'],
  // Baris 3: Oranye & Kuning/Emas
  ['#9A3412', '#C2410C', '#EA580C', '#D97706', '#F59E0B', '#EAB308'],
  // Baris 4: Hijau & Zamrud
  ['#064E3B', '#065F46', '#059669', '#10B981', '#15803D', '#65A30D'],
  // Baris 5: Biru & Teal
  ['#134E4A', '#0D9488', '#0284C7', '#2563EB', '#1D4ED8', '#1E40AF'],
  // Baris 6: Ungu & Merah Muda
  ['#581C87', '#7C3AED', '#9333EA', '#C026D3', '#DB2777', '#E11D48'],
];

export function ColorPickerPopover({
  editor,
  open,
  onClose,
  anchorRef,
}: ColorPickerPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const currentColor = editor?.getAttributes('textStyle').color || '#000000';
  const [hexInput, setHexInput] = useState(currentColor);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  // Calculate coordinates relative to anchor button
  useEffect(() => {
    if (open && anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const popoverWidth = 270;
      const left = Math.max(10, Math.min(rect.left, window.innerWidth - popoverWidth - 16));
      const top = rect.bottom + 6;
      setPosition({ top, left });
    }
  }, [open, anchorRef]);

  // Sync input value when current color changes
  useEffect(() => {
    if (currentColor) {
      setHexInput(currentColor);
    }
  }, [currentColor]);

  // Click outside and Escape key listener
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        (!anchorRef?.current || !anchorRef.current.contains(target))
      ) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  const handleApplyColor = (color: string) => {
    if (!editor) return;
    editor.chain().focus().setColor(color).run();
    setHexInput(color);
    onClose();
  };

  const handleResetColor = () => {
    if (!editor) return;
    editor.chain().focus().unsetColor().run();
    setHexInput('#000000');
    onClose();
  };

  const handleHexChange = (val: string) => {
    setHexInput(val);
    if (/^#([0-9A-F]{3}){1,2}$/i.test(val)) {
      editor?.chain().focus().setColor(val).run();
    }
  };

  return (
    <div
      ref={popoverRef}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9999,
        minWidth: '260px',
      }}
      className="w-68 bg-white dark:bg-gray-850 rounded-xl shadow-2xl border border-gray-300 dark:border-gray-700 p-3.5 select-none animate-in fade-in zoom-in-95 duration-100 font-sans"
    >
      {/* Section 1: Tajwid & Calligraphy Quick Palette */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5 px-0.5">
          <span>Warna Mushaf & Tajwid</span>
          <Palette size={13} className="text-amber-600 dark:text-amber-400" />
        </div>
        <div className="grid grid-cols-6 gap-1.5">
          {TAJWID_COLORS.map((item) => {
            const isSelected = currentColor.toLowerCase() === item.color.toLowerCase();
            return (
              <button
                key={item.color}
                type="button"
                title={item.label}
                onClick={() => handleApplyColor(item.color)}
                className="group relative w-7 h-7 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer shadow-2xs"
                style={{ backgroundColor: item.color }}
              >
                {isSelected && (
                  <Check
                    size={14}
                    className={
                      item.color === '#000000' ||
                      item.color === '#DC2626' ||
                      item.color === '#059669' ||
                      item.color === '#2563EB' ||
                      item.color === '#4B5563'
                        ? 'text-white drop-shadow-sm'
                        : 'text-black drop-shadow-sm'
                    }
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 2: Standard Color Grid */}
      <div className="mb-3">
        <span className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5 px-0.5">
          Palet Warna Standar
        </span>
        <div className="space-y-1.5">
          {STANDARD_PALETTE.map((row, rowIdx) => (
            <div key={rowIdx} className="grid grid-cols-6 gap-1.5">
              {row.map((col) => {
                const isSelected = currentColor.toLowerCase() === col.toLowerCase();
                return (
                  <button
                    key={col}
                    type="button"
                    title={col}
                    onClick={() => handleApplyColor(col)}
                    className="w-7 h-7 rounded-md border border-gray-200 dark:border-gray-700/80 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer shadow-2xs"
                    style={{ backgroundColor: col }}
                  >
                    {isSelected && (
                      <Check
                        size={13}
                        className={
                          col === '#000000' ||
                          col.startsWith('#1') ||
                          col.startsWith('#0') ||
                          col.startsWith('#7') ||
                          col.startsWith('#9') ||
                          col.startsWith('#5')
                            ? 'text-white'
                            : 'text-gray-900'
                        }
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Custom Color & Hex Input */}
      <div className="pt-2.5 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          {/* Native Color Picker Swatch */}
          <div className="relative w-7 h-7 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden cursor-pointer shadow-2xs shrink-0">
            <input
              type="color"
              value={currentColor || '#000000'}
              onChange={(e) => handleHexChange(e.target.value)}
              className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer opacity-0"
              title="Pilih Warna Kustom"
            />
            <div
              className="w-full h-full"
              style={{ backgroundColor: currentColor || '#000000' }}
            />
          </div>

          {/* Hex Input Field */}
          <div className="relative flex-1">
            <input
              type="text"
              value={hexInput}
              onChange={(e) => handleHexChange(e.target.value)}
              placeholder="#000000"
              maxLength={7}
              className="w-full h-7 px-2 font-mono text-[11px] uppercase bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-hidden focus:border-amber-500 text-center"
            />
          </div>
        </div>

        {/* Reset Color Button */}
        <button
          type="button"
          onClick={handleResetColor}
          title="Reset ke warna default"
          className="h-7 px-2 flex items-center gap-1 text-[11px] font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 transition-colors cursor-pointer shrink-0"
        >
          <RotateCcw size={11} />
          <span>Default</span>
        </button>
      </div>
    </div>
  );
}

export default ColorPickerPopover;
