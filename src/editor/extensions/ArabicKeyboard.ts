import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import {
  getArabicChar,
  getHarakatFromShortcut,
  RegularComboStateMachine,
} from '@/editor/keyboardMaps';
import { useKeyboardStore } from '@/stores/keyboardStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUIStore } from '@/stores/uiStore';
import { useEditorStore } from '@/stores/editorStore';
import { useDocumentStore } from '@/stores/documentStore';
import { SPECIAL_CHARACTER_GROUPS } from '@/types';

export const ArabicKeyboard = Extension.create({
  name: 'arabicKeyboard',

  addKeyboardShortcuts() {
    return {
      'Mod-k': () => {
        useUIStore.getState().toggleSpecialCharacters();
        return true;
      },
      'Mod-Shift-h': () => {
        useUIStore.getState().toggleHarakatPalette();
        return true;
      },
      'Mod-Shift-H': () => {
        useUIStore.getState().toggleHarakatPalette();
        return true;
      },
      'Mod-f': () => {
        useEditorStore.getState().toggleAutoReplace();
        return true;
      },

      // Text Formatting Shortcuts
      'Mod-b': () => this.editor.commands.toggleBold(),
      'Mod-B': () => this.editor.commands.toggleBold(),
      'Mod-i': () => this.editor.commands.toggleItalic(),
      'Mod-I': () => this.editor.commands.toggleItalic(),
      'Mod-u': () => this.editor.commands.toggleUnderline(),
      'Mod-U': () => this.editor.commands.toggleUnderline(),

      // Text Alignment Shortcuts (Ctrl+R, Ctrl+E, Ctrl+L, Ctrl+J)
      'Mod-r': () => this.editor.commands.setTextAlign('right'),
      'Mod-R': () => this.editor.commands.setTextAlign('right'),
      'Mod-e': () => this.editor.commands.setTextAlign('center'),
      'Mod-E': () => this.editor.commands.setTextAlign('center'),
      'Mod-l': () => this.editor.commands.setTextAlign('left'),
      'Mod-L': () => this.editor.commands.setTextAlign('left'),
      'Mod-j': () => this.editor.commands.setTextAlign('justify'),
      'Mod-J': () => this.editor.commands.setTextAlign('justify'),

      'Mod-Shift-r': () => this.editor.commands.setTextAlign('right'),
      'Mod-Shift-R': () => this.editor.commands.setTextAlign('right'),
      'Mod-Shift-e': () => this.editor.commands.setTextAlign('center'),
      'Mod-Shift-E': () => this.editor.commands.setTextAlign('center'),
      'Mod-Shift-l': () => this.editor.commands.setTextAlign('left'),
      'Mod-Shift-L': () => this.editor.commands.setTextAlign('left'),
      'Mod-Shift-j': () => this.editor.commands.setTextAlign('justify'),
      'Mod-Shift-J': () => this.editor.commands.setTextAlign('justify'),

      // Font Size Shortcuts
      'Mod-h': () => {
        const currentSize = useEditorStore.getState().fontSize;
        useEditorStore.getState().setFontSize(currentSize + 2);
        return true;
      },
      'Mod-H': () => {
        const currentSize = useEditorStore.getState().fontSize;
        useEditorStore.getState().setFontSize(currentSize + 2);
        return true;
      },
      'Mod-d': () => {
        const currentSize = useEditorStore.getState().fontSize;
        useEditorStore.getState().setFontSize(Math.max(8, currentSize - 2));
        return true;
      },
      'Mod-D': () => {
        const currentSize = useEditorStore.getState().fontSize;
        useEditorStore.getState().setFontSize(Math.max(8, currentSize - 2));
        return true;
      },
      'Mod-]': () => {
        const currentSize = useEditorStore.getState().fontSize;
        useEditorStore.getState().setFontSize(currentSize + 2);
        return true;
      },
      'Mod-[': () => {
        const currentSize = useEditorStore.getState().fontSize;
        useEditorStore.getState().setFontSize(Math.max(8, currentSize - 2));
        return true;
      },

      // Document Actions
      'Mod-s': () => {
        const activeDoc = useDocumentStore.getState().getActiveDocument();
        if (activeDoc) {
          useDocumentStore.getState().markDocumentSaved(activeDoc.id);
        }
        return true;
      },
      'Mod-S': () => {
        const activeDoc = useDocumentStore.getState().getActiveDocument();
        if (activeDoc) {
          useDocumentStore.getState().markDocumentSaved(activeDoc.id);
        }
        return true;
      },
      'Mod-n': () => {
        useDocumentStore.getState().createDocument();
        return true;
      },
      'Mod-N': () => {
        useDocumentStore.getState().createDocument();
        return true;
      },
      'Mod-p': () => {
        window.print();
        return true;
      },
      'Mod-P': () => {
        window.print();
        return true;
      },

      // Zoom Shortcuts
      'Mod-=': () => {
        useEditorStore.getState().zoomIn(10);
        return true;
      },
      'Mod-+': () => {
        useEditorStore.getState().zoomIn(10);
        return true;
      },
      'Mod--': () => {
        useEditorStore.getState().zoomOut(10);
        return true;
      },
      'Mod-0': () => {
        useEditorStore.getState().resetZoom();
        return true;
      },
    };
  },

  addProseMirrorPlugins() {
    const comboMachine = new RegularComboStateMachine();
    let isFastWordPending = false;
    let pendingSpecialGroup: number | null = null;
    let pendingSpecialTimer: ReturnType<typeof setTimeout> | null = null;

    const setPendingGroup = (grp: number) => {
      pendingSpecialGroup = grp;
      if (pendingSpecialTimer) clearTimeout(pendingSpecialTimer);
      pendingSpecialTimer = setTimeout(() => {
        pendingSpecialGroup = null;
      }, 4000);
    };

    const clearPendingGroup = () => {
      pendingSpecialGroup = null;
      if (pendingSpecialTimer) {
        clearTimeout(pendingSpecialTimer);
        pendingSpecialTimer = null;
      }
    };

    return [
      new Plugin({
        key: new PluginKey('arabicKeyboard'),
        props: {
          handleKeyDown(view, event) {
            const commitText = (text: string) => {
              if (view.isDestroyed || !text) return;
              const { tr } = view.state;
              view.dispatch(tr.insertText(text));
            };

            const HARAKAT_REGEX = /[\u064B-\u065F\u0670\u06D6-\u06ED]/;

            const commitHarakat = (text: string) => {
              if (view.isDestroyed || !text) return;
              const { state } = view;
              const { from } = state.selection;
              let tr = state.tr;

              // Check and remove existing harakat immediately before cursor position
              let deleteFrom = from;
              while (deleteFrom > 0) {
                const charBefore = state.doc.textBetween(deleteFrom - 1, deleteFrom, '');
                if (charBefore && HARAKAT_REGEX.test(charBefore)) {
                  deleteFrom--;
                } else {
                  break;
                }
              }

              if (deleteFrom < from) {
                tr = tr.delete(deleteFrom, from);
              }

              view.dispatch(tr.insertText(text));
            };

            const flushCombo = () => {
              if (comboMachine.isPending) {
                comboMachine.flush(commitText);
              }
            };

            const upperKey = event.key ? event.key.toUpperCase() : '';
            const isAltKey = event.altKey || event.getModifierState?.('Alt');
            const isKeyW = event.code === 'KeyW' || event.key === 'w' || event.key === 'W' || event.key === '∑';

            // 1. Handle FastWord pending input (Alt+W then Letter A-Z)
            if (isFastWordPending && !event.ctrlKey && !event.metaKey) {
              const letterMatch = event.code.match(/^Key([A-Za-z])$/i) || event.key.match(/^[a-zA-Z]$/);
              if (letterMatch) {
                event.preventDefault();
                isFastWordPending = false;
                const letter = (letterMatch[1] || event.key).toUpperCase();
                const entry = useSettingsStore.getState().getFastWord(letter);
                if (entry && entry.text) {
                  commitText(entry.text);
                }
                return true;
              }
              // If another key is pressed, cancel pending fast word
              if (event.key !== 'Alt' && event.key !== 'Shift') {
                isFastWordPending = false;
              }
            }

            // 2. Handle pendingSpecialGroup when Alt has been released:
            // Skenario: (Alt + [1-5]) -> Lepas Alt -> Tekan huruf A-K untuk menyisipkan karakter baris BAWAH!
            if (pendingSpecialGroup !== null && !event.ctrlKey && !event.metaKey && !isAltKey) {
              const charKeyMatch = event.code.match(/^Key([A-Ka-k])$/i) || event.key.match(/^[a-kA-K]$/i);
              if (charKeyMatch) {
                const letter = (charKeyMatch[1] || event.key).toUpperCase();
                const group = SPECIAL_CHARACTER_GROUPS.find((g) => g.id === pendingSpecialGroup) || SPECIAL_CHARACTER_GROUPS[0];
                const item = group.items.find((it) => it.keyLetter.toUpperCase() === letter);
                if (item) {
                  event.preventDefault();
                  flushCombo();
                  clearPendingGroup();
                  // Sisipkan karakter baris bawah
                  commitText(item.charBottom);
                  return true;
                }
              }
              // If non-shift key pressed, clear pending group
              if (event.key !== 'Shift') {
                clearPendingGroup();
              }
            }

            // 3. Alt + W (or Option + W on Mac / Linux): Trigger FastWord waiting mode
            if (isAltKey && isKeyW) {
              event.preventDefault();
              flushCombo();
              clearPendingGroup();
              isFastWordPending = true;
              // Reset pending after 4 seconds if no key is pressed
              setTimeout(() => {
                isFastWordPending = false;
              }, 4000);
              return true;
            }

            // 4. Alt + 1..5: Open Special Characters group tab & set pending group
            if (isAltKey && (/^[1-5]$/.test(event.key) || /^Digit[1-5]$/.test(event.code))) {
              event.preventDefault();
              flushCombo();
              const digitMatch = event.key.match(/^[1-5]$/) || event.code.match(/Digit([1-5])/);
              const grpNum = digitMatch ? parseInt(digitMatch[1] || digitMatch[0], 10) : 1;
              useUIStore.getState().setSpecialCharactersOpen(true);
              useUIStore.getState().setSpecialCharactersGroup(grpNum);
              setPendingGroup(grpNum);
              return true;
            }

            // 5. Alt + [A-K]: Insert Special Character (Alt + Group, Huruf):
            // Jika Alt tetap ditahan: menyisipkan karakter baris ATAS (atau bawah jika ada shift)
            if (isAltKey && !isKeyW && !event.ctrlKey && !event.metaKey) {
              const charKeyMatch = event.code.match(/^Key([A-Ka-k])$/i) || event.key.match(/^[a-kA-K]$/i);
              if (charKeyMatch) {
                const letter = (charKeyMatch[1] || event.key).toUpperCase();
                const activeGroupNum = pendingSpecialGroup || useUIStore.getState().specialCharactersGroup || 1;
                const group = SPECIAL_CHARACTER_GROUPS.find((g) => g.id === activeGroupNum) || SPECIAL_CHARACTER_GROUPS[0];
                const item = group.items.find((it) => it.keyLetter.toUpperCase() === letter);
                if (item) {
                  event.preventDefault();
                  flushCombo();
                  clearPendingGroup();
                  const insertChar = event.shiftKey ? item.charBottom : item.charTop;
                  commitText(insertChar);
                  return true;
                }
              }
            }

            // 6. Function Keys (F1 - F12) for Harakat & Waqaf
            if (/^F([1-9]|1[0-2])$/.test(upperKey)) {
              const settings = useSettingsStore.getState();
              if (settings.enableFKeyShortcuts) {
                // F12: Waqaf & Nomor Ayat di akhir ayat (Manual halaman 17)
                if (upperKey === 'F12' && !event.shiftKey) {
                  event.preventDefault();
                  flushCombo();
                  useUIStore.getState().openWaqafDialog('end');
                  return true;
                }

                // Shift + F12: Tanda Waqaf di tengah ayat (Manual halaman 17)
                if (upperKey === 'F12' && event.shiftKey) {
                  event.preventDefault();
                  flushCombo();
                  useUIStore.getState().openWaqafDialog('mid');
                  return true;
                }

                // Lookup Harakat based on Nonosoft specification matrix:
                // Column 1: F1..F10 (Single Harakat)
                // Column 2: Shift + F1..F10 (Tasydid + Harakat / Maddah)
                // Column 3: Ctrl + F1..F6, Ctrl + F10 (Maddah + Harakat / Special Tasydid)
                const isCtrl = Boolean(event.ctrlKey || event.metaKey);
                const harakatChar = getHarakatFromShortcut(upperKey, event.shiftKey, isCtrl);
                if (harakatChar) {
                  event.preventDefault();
                  flushCombo();
                  commitHarakat(harakatChar);
                  return true;
                }

                // Fallback F11 (Sukun Qurani)
                if (upperKey === 'F11') {
                  event.preventDefault();
                  flushCombo();
                  commitHarakat('\u06E1');
                  return true;
                }
              }
            }

            const { fontScript } = useEditorStore.getState();

            // When in Latin font mode, let standard keyboard input pass through natively (A-Z Latin typing)
            if (fontScript === 'latin') {
              flushCombo();
              return false;
            }

            // 5. Special Quranic Diacritics shortcuts:
            // Ctrl + '-' -> Mad Wajib (ـۤ)
            if ((event.ctrlKey || event.metaKey) && event.key === '-') {
              event.preventDefault();
              flushCombo();
              commitHarakat('\u0654'); // Mad Wajib / Hamzah atas
              return true;
            }

            // Ctrl + '=' -> Mad Jaiz (ـٓ)
            if ((event.ctrlKey || event.metaKey) && (event.key === '=' || event.key === '+')) {
              event.preventDefault();
              flushCombo();
              commitHarakat('\u0653'); // Maddah / Mad Jaiz
              return true;
            }

            // Ctrl + '\' -> Mim Iqlab (مۢ)
            if ((event.ctrlKey || event.metaKey) && event.key === '\\') {
              event.preventDefault();
              flushCombo();
              commitHarakat('\u06E2'); // Meem Iqlab
              return true;
            }

            // 6. Direct '@' key for Lafadz Allah
            if (event.key === '@' && !event.ctrlKey && !event.metaKey && !event.altKey) {
              event.preventDefault();
              flushCombo();
              commitText('اللَّهِ');
              return true;
            }

            // 7. Space & Tatweel (Kashida) Variants (Manual Halaman 19, 26)
            if (event.code === 'Space' || event.key === ' ') {
              if (event.shiftKey) {
                // Shift + Space: Spasi kecil / ZWNJ
                event.preventDefault();
                flushCombo();
                commitText('\u200C');
                return true;
              }
              if (event.ctrlKey) {
                // Ctrl + Space: Menutup huruf tanpa spasi lebar
                event.preventDefault();
                flushCombo();
                commitText('\u00A0');
                return true;
              }
              // Normal Space
              flushCombo();
              return false;
            }

            // Minus '-' / Tatweel untuk perataan manual
            if (event.key === '-' && !event.ctrlKey && !event.metaKey && !event.altKey) {
              if (event.shiftKey) {
                // Shift + '-' -> Garis hubung panjang (Multi-Tatweel untuk manual justify)
                event.preventDefault();
                flushCombo();
                commitText('ــــ');
                return true;
              }
              // '-' -> Garis hubung normal (Tatweel)
              event.preventDefault();
              flushCombo();
              commitText('ـ');
              return true;
            }

            // 8. Normal Control / Navigation keys
            if (event.ctrlKey || event.metaKey || event.altKey) {
              flushCombo();
              return false;
            }

            if (event.key.length !== 1) {
              flushCombo();
              return false;
            }

            // 9. Arabic Character mapping based on Keyboard Mode
            const { keyboardMode, isVirtualKeyboardCaps } = useKeyboardStore.getState();
            const shiftActive = event.shiftKey || isVirtualKeyboardCaps;

            if (keyboardMode === 'regular') {
              if (shiftActive) {
                flushCombo();
                const mappedChar = getArabicChar(event.key, 'regular', true);
                if (mappedChar) {
                  event.preventDefault();
                  commitText(mappedChar);
                  return true;
                }
              }

              // Use combo machine for phonetic typing (sh -> ص, sy -> ش, etc.)
              event.preventDefault();
              const handled = comboMachine.handleKey(event.key, commitText);
              if (!handled) {
                const fallback = getArabicChar(event.key, 'regular', false) ?? event.key;
                commitText(fallback);
              }
              return true;
            }

            if (keyboardMode === 'standard' || keyboardMode === 'arabic') {
              flushCombo();
              const arabicChar = getArabicChar(event.key, keyboardMode, shiftActive);
              if (arabicChar !== null) {
                event.preventDefault();
                commitText(arabicChar);
                return true;
              }
              return false;
            }

            return false;
          },

          handleDOMEvents: {
            blur() {
              if (comboMachine.isPending) {
                comboMachine.reset();
              }
              isFastWordPending = false;
              return false;
            },
          },
        },

        destroy() {
          comboMachine.reset();
        },
      }),
    ];
  },
});

export default ArabicKeyboard;
