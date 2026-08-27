import { useState, useEffect } from 'react';
import { Dialog } from '@/components/common/Dialog';
import { useUIStore } from '@/stores/uiStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useNaskhEditor } from '@/editor/EditorContext';
import { Trash2, Check } from 'lucide-react';

interface FastWordDialogProps {
  open?: boolean;
  onClose?: () => void;
}

export function FastWordDialog({ open, onClose }: FastWordDialogProps) {
  const editor = useNaskhEditor();
  const activeDialog = useUIStore((s) => s.activeDialog);
  const closeDialog = useUIStore((s) => s.closeDialog);

  const fastWords = useSettingsStore((s) => s.fastWords);
  const setFastWord = useSettingsStore((s) => s.setFastWord);
  const deleteFastWord = useSettingsStore((s) => s.deleteFastWord);

  const isOpen = open !== undefined ? open : activeDialog === 'fastWord';

  const [selectedKey, setSelectedKey] = useState<string>('B');
  const [name, setName] = useState<string>('');
  const [text, setText] = useState<string>('');

  const keys = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)); // A to Z

  // Load current selected key data
  useEffect(() => {
    const existing = fastWords[selectedKey];
    if (existing) {
      setName(existing.name);
      setText(existing.text);
    } else {
      setName('');
      // If editor has selected text, pre-fill text
      if (editor && isOpen) {
        const selection = editor.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to,
          ' '
        );
        if (selection.trim()) {
          setText(selection);
        } else {
          setText('');
        }
      } else {
        setText('');
      }
    }
  }, [selectedKey, fastWords, isOpen]);

  const handleClose = () => {
    if (onClose) onClose();
    else closeDialog();
  };

  const handleSave = () => {
    if (!name.trim() || !text.trim()) return;
    setFastWord(selectedKey, name.trim(), text.trim());
    handleClose();
  };

  const handleDelete = () => {
    deleteFastWord(selectedKey);
    setName('');
    setText('');
  };

  const handleInsert = (phraseText: string) => {
    if (!editor) return;
    editor.chain().focus().insertContent(phraseText).run();
    handleClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      title="Fast Word (Penyimpan Kata/Kalimat Cepat)"
      size="md"
    >
      <div className="space-y-4 text-xs select-none">
        <p className="text-gray-600 dark:text-gray-300">
          Simpan kata/kalimat yang sering digunakan dan panggil seketika dengan menekan{' '}
          <kbd className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/60 font-mono font-bold text-amber-900 dark:text-amber-200 rounded-sm">
            (Alt+W) + [Huruf]
          </kbd>
        </p>

        <div className="grid grid-cols-3 gap-3">
          {/* Left Column: List of ShortKeys (Alt+W):A - Z */}
          <div className="border border-gray-300 dark:border-gray-600 rounded-md p-1 max-h-56 overflow-y-auto bg-white dark:bg-gray-900">
            <div className="font-bold px-2 py-1 text-gray-500 border-b border-gray-200 dark:border-gray-800 text-[11px]">
              ShortKey
            </div>
            {keys.map((k) => {
              const item = fastWords[k];
              const isSelected = selectedKey === k;
              return (
                <button
                  key={k}
                  onClick={() => setSelectedKey(k)}
                  className={`w-full text-left px-2 py-1 rounded-xs flex items-center justify-between text-xs transition-colors ${
                    isSelected
                      ? 'bg-amber-500 text-white font-bold'
                      : item
                      ? 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                      : 'text-gray-400 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/40'
                  }`}
                >
                  <span>(Alt+W):{k}</span>
                  {item && <span className="text-[10px] truncate max-w-[60px] opacity-80">{item.name}</span>}
                </button>
              );
            })}
          </div>

          {/* Right Column: Name & Text editor for selected ShortKey */}
          <div className="col-span-2 space-y-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Nama Singkat:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Bismillaah"
                className="w-full px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Teks Arab:
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                dir="rtl"
                placeholder="Tulis kalimat Arab berharakat di sini..."
                className="w-full px-2.5 py-1.5 font-arabic text-base border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-hidden focus:ring-1 focus:ring-amber-500 leading-relaxed"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2">
              {fastWords[selectedKey] ? (
                <button
                  onClick={handleDelete}
                  className="px-2.5 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md border border-red-200 dark:border-red-800 flex items-center gap-1"
                >
                  <Trash2 size={12} /> Hapus
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                {fastWords[selectedKey] && (
                  <button
                    onClick={() => handleInsert(fastWords[selectedKey].text)}
                    className="px-3 py-1.5 text-xs bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 hover:bg-amber-200 rounded-md border border-amber-300 font-semibold"
                  >
                    Sisipkan
                  </button>
                )}
                <button
                  onClick={handleSave}
                  className="px-4 py-1.5 text-xs bg-amber-600 text-white hover:bg-amber-700 rounded-md font-semibold flex items-center gap-1 shadow-xs"
                >
                  <Check size={13} /> Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default FastWordDialog;
