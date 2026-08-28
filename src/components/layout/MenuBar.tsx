import { useState, useRef, useEffect } from 'react';
import type { ElementType } from 'react';
import {
  FilePlus,
  FolderOpen,
  Save,
  Printer,
  X,
  Undo2,
  Redo2,
  Scissors,
  Copy,
  ClipboardPaste,
  CheckSquare,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Keyboard,
  Sparkles,
  Info,
  Check,
  ChevronRight,
  BookmarkPlus,
  Image,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  PanelLeft,
  Eye,
  Upload,
  Hash,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/uiStore';
import { useDocumentStore } from '@/stores/documentStore';
import { useEditorStore } from '@/stores/editorStore';
import { useKeyboardStore } from '@/stores/keyboardStore';
import { useNaskhEditor } from '@/editor/EditorContext';
import { exportImage } from '@/lib/export';
import { triggerKhtImport } from '@/lib/khtImportHelper';

interface MenuItem {
  id: string;
  label: string;
  icon?: ElementType;
  shortcut?: string;
  action?: () => void;
  disabled?: boolean;
  checked?: boolean;
  separator?: boolean;
  submenu?: MenuItem[];
}

interface MenuCategory {
  id: string;
  label: string;
  items: MenuItem[];
}

export function MenuBar() {
  const editor = useNaskhEditor();

  // Stores
  const createDocument = useDocumentStore((s) => s.createDocument);
  const activeDoc = useDocumentStore((s) => s.getActiveDocument());
  const markDocumentSaved = useDocumentStore((s) => s.markDocumentSaved);

  const fontSize = useEditorStore((s) => s.fontSize);
  const setFontSize = useEditorStore((s) => s.setFontSize);
  const autoReplace = useEditorStore((s) => s.autoReplace);
  const toggleAutoReplace = useEditorStore((s) => s.toggleAutoReplace);
  const zoom = useEditorStore((s) => s.zoom);
  const zoomIn = useEditorStore((s) => s.zoomIn);
  const zoomOut = useEditorStore((s) => s.zoomOut);
  const resetZoom = useEditorStore((s) => s.resetZoom);

  const keyboardMode = useKeyboardStore((s) => s.keyboardMode);
  const setKeyboardMode = useKeyboardStore((s) => s.setKeyboardMode);

  const setActiveDialog = useUIStore((s) => s.setActiveDialog);
  const toggleSpecialCharacters = useUIStore((s) => s.toggleSpecialCharacters);
  const specialCharactersOpen = useUIStore((s) => s.specialCharactersOpen);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const harakatPaletteOpen = useUIStore((s) => s.harakatPaletteOpen);
  const toggleHarakatPalette = useUIStore((s) => s.toggleHarakatPalette);
  const virtualKeyboardOpen = useUIStore((s) => s.virtualKeyboardOpen);
  const toggleVirtualKeyboard = useUIStore((s) => s.toggleVirtualKeyboard);
  const statusBarVisible = useUIStore((s) => s.statusBarVisible);
  const toggleStatusBar = useUIStore((s) => s.toggleStatusBar);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
        setActiveSubmenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyAs = async (format: 'html' | 'text' | 'image') => {
    if (!editor) return;
    try {
      if (format === 'html') {
        const html = editor.getHTML();
        await navigator.clipboard.writeText(html);
        alert('Teks berhasil disalin dalam format HTML!');
      } else if (format === 'text') {
        const text = editor.getText();
        await navigator.clipboard.writeText(text);
        alert('Teks berhasil disalin dalam format Plain Text!');
      } else if (format === 'image') {
        await exportImage(editor, activeDoc?.title || 'document', 'png');
      }
    } catch (err) {
      console.warn('Copy failed:', err);
    }
  };

  // 4 Menu Utama Kitaba
  const menuCategories: MenuCategory[] = [
    {
      id: 'file',
      label: 'File',
      items: [
        {
          id: 'new',
          label: 'New',
          icon: FilePlus,
          shortcut: 'Ctrl+N',
          action: () => createDocument(),
        },
        {
          id: 'import',
          label: 'Import File (.kht, .rtf, .txt)...',
          icon: Upload,
          shortcut: 'Ctrl+I',
          action: () => triggerKhtImport(editor),
        },
        {
          id: 'open',
          label: 'Open Document List',
          icon: FolderOpen,
          shortcut: 'Ctrl+O',
          action: () => useUIStore.getState().setSidebarOpen(true),
        },
        {
          id: 'save',
          label: 'Save',
          icon: Save,
          shortcut: 'Ctrl+S',
          action: () => {
            if (activeDoc) markDocumentSaved(activeDoc.id);
          },
        },
        {
          id: 'saveAs',
          label: 'Save As...',
          icon: Save,
          action: () => setActiveDialog('export'),
        },
        { id: 'sep-file-1', label: '', separator: true },
        {
          id: 'print',
          label: 'Print...',
          icon: Printer,
          shortcut: 'Ctrl+P',
          action: () => window.print(),
        },
        { id: 'sep-file-2', label: '', separator: true },
        {
          id: 'exit',
          label: 'Exit',
          icon: X,
          shortcut: 'Alt+F4',
          action: () => {
            if (confirm('Tutup aplikasi Kitaba?')) {
              window.close();
            }
          },
        },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      items: [
        {
          id: 'undo',
          label: 'Undo',
          icon: Undo2,
          shortcut: 'Ctrl+Z',
          action: () => editor?.chain().focus().undo().run(),
          disabled: !editor?.can().undo(),
        },
        {
          id: 'redo',
          label: 'Redo',
          icon: Redo2,
          shortcut: 'Ctrl+Y',
          action: () => editor?.chain().focus().redo().run(),
          disabled: !editor?.can().redo(),
        },
        { id: 'sep-edit-1', label: '', separator: true },
        {
          id: 'cut',
          label: 'Cut',
          icon: Scissors,
          shortcut: 'Ctrl+X',
          action: () => document.execCommand('cut'),
        },
        {
          id: 'copy',
          label: 'Copy',
          icon: Copy,
          shortcut: 'Ctrl+C',
          action: () => document.execCommand('copy'),
        },
        {
          id: 'copyHtml',
          label: 'Copy as HTML',
          shortcut: 'Shift+Ctrl+H',
          action: () => handleCopyAs('html'),
        },
        {
          id: 'copyMetafile',
          label: 'Copy as Metafile',
          shortcut: 'Shift+Ctrl+M',
          action: () => handleCopyAs('image'),
        },
        {
          id: 'copyBitmap',
          label: 'Copy as Bitmap',
          shortcut: 'Shift+Ctrl+B',
          action: () => handleCopyAs('image'),
        },
        {
          id: 'paste',
          label: 'Paste',
          icon: ClipboardPaste,
          shortcut: 'Ctrl+V',
          action: () => document.execCommand('paste'),
        },
        { id: 'sep-edit-2', label: '', separator: true },
        {
          id: 'clear',
          label: 'Clear',
          shortcut: 'Ctrl+Del',
          action: () => editor?.chain().focus().deleteSelection().run(),
        },
        {
          id: 'selectAll',
          label: 'Select All',
          icon: CheckSquare,
          shortcut: 'Ctrl+A',
          action: () => editor?.chain().focus().selectAll().run(),
        },
        { id: 'sep-edit-3', label: '', separator: true },
        {
          id: 'saveFastWord',
          label: 'Save to FastWord..',
          icon: BookmarkPlus,
          action: () => setActiveDialog('fastWord'),
        },
        {
          id: 'saveAsImage',
          label: 'Save as Image..',
          icon: Image,
          action: () => setActiveDialog('export'),
        },
      ],
    },
    {
      id: 'view',
      label: 'View',
      items: [
        {
          id: 'zoomIn',
          label: 'Zoom In',
          icon: ZoomIn,
          shortcut: 'Ctrl++',
          disabled: zoom >= 300,
          action: () => zoomIn(10),
        },
        {
          id: 'zoomOut',
          label: 'Zoom Out',
          icon: ZoomOut,
          shortcut: 'Ctrl+-',
          disabled: zoom <= 30,
          action: () => zoomOut(10),
        },
        {
          id: 'resetZoom',
          label: `Reset Zoom (100%) [Now: ${zoom}%]`,
          icon: RotateCcw,
          shortcut: 'Ctrl+0',
          action: () => resetZoom(),
        },
        { id: 'sep-view-1', label: '', separator: true },
        {
          id: 'toggleSidebar',
          label: 'Dokumen / Bilah Sisi',
          icon: PanelLeft,
          checked: sidebarOpen,
          action: () => toggleSidebar(),
        },
        {
          id: 'toggleHarakat',
          label: 'Panel Tanda Harakat',
          icon: Sparkles,
          shortcut: 'Ctrl+Shift+H',
          checked: harakatPaletteOpen,
          action: () => toggleHarakatPalette(),
        },
        {
          id: 'toggleSpecialChars',
          label: 'Panel Karakter Spesial',
          icon: Sparkles,
          shortcut: 'Ctrl+K',
          checked: specialCharactersOpen,
          action: () => toggleSpecialCharacters(),
        },
        {
          id: 'toggleVirtualKb',
          label: 'Papan Ketik Virtual',
          icon: Keyboard,
          checked: virtualKeyboardOpen,
          action: () => toggleVirtualKeyboard(),
        },
        {
          id: 'toggleStatusBar',
          label: 'Bilah Status (Status Bar)',
          icon: Eye,
          checked: statusBarVisible,
          action: () => toggleStatusBar(),
        },
      ],
    },
    {
      id: 'format',
      label: 'Format',
      items: [
        {
          id: 'bold',
          label: 'Bold',
          icon: Bold,
          shortcut: 'Ctrl+B',
          checked: editor?.isActive('bold'),
          action: () => editor?.chain().focus().toggleBold().run(),
        },
        {
          id: 'underline',
          label: 'Underline',
          icon: Underline,
          shortcut: 'Ctrl+U',
          checked: editor?.isActive('underline'),
          action: () => editor?.chain().focus().toggleUnderline().run(),
        },
        {
          id: 'italic',
          label: 'Italic',
          icon: Italic,
          shortcut: 'Ctrl+I',
          checked: editor?.isActive('italic'),
          action: () => editor?.chain().focus().toggleItalic().run(),
        },
        { id: 'sep-fmt-1', label: '', separator: true },
        {
          id: 'increaseFont',
          label: 'Increase Font Size',
          shortcut: 'Ctrl+H',
          action: () => {
            if (!editor) return;
            const activeTextStyle = editor.getAttributes('textStyle') || {};
            const activeSize = activeTextStyle.fontSize ? parseInt(String(activeTextStyle.fontSize), 10) : fontSize;
            const nextSize = (isNaN(activeSize) ? fontSize : activeSize) + 2;
            editor.chain().focus().setFontSize(`${nextSize}px`).run();
            setFontSize(nextSize);
          },
        },
        {
          id: 'decreaseFont',
          label: 'Decrease Font Size',
          shortcut: 'Ctrl+D',
          action: () => {
            if (!editor) return;
            const activeTextStyle = editor.getAttributes('textStyle') || {};
            const activeSize = activeTextStyle.fontSize ? parseInt(String(activeTextStyle.fontSize), 10) : fontSize;
            const nextSize = Math.max(8, (isNaN(activeSize) ? fontSize : activeSize) - 2);
            editor.chain().focus().setFontSize(`${nextSize}px`).run();
            setFontSize(nextSize);
          },
        },
        { id: 'sep-fmt-2', label: '', separator: true },
        {
          id: 'alignLeft',
          label: 'Align Left',
          icon: AlignLeft,
          shortcut: 'Ctrl+L',
          checked: editor?.isActive({ textAlign: 'left' }),
          action: () => editor?.chain().focus().setTextAlign('left').run(),
        },
        {
          id: 'alignCenter',
          label: 'Align Center',
          icon: AlignCenter,
          shortcut: 'Ctrl+E',
          checked: editor?.isActive({ textAlign: 'center' }),
          action: () => editor?.chain().focus().setTextAlign('center').run(),
        },
        {
          id: 'alignRight',
          label: 'Align Right',
          icon: AlignRight,
          shortcut: 'Ctrl+R',
          checked: editor?.isActive({ textAlign: 'right' }),
          action: () => editor?.chain().focus().setTextAlign('right').run(),
        },
        { id: 'sep-fmt-3', label: '', separator: true },
        {
          id: 'textColor',
          label: 'Text Color',
          icon: Palette,
          shortcut: 'Ctrl+T',
          action: () => {
            const color = prompt('Masukkan kode warna (hex):', '#000000');
            if (color) editor?.chain().focus().setColor(color).run();
          },
        },
        {
          id: 'keyboardMapping',
          label: 'Keyboard Mapping',
          icon: Keyboard,
          submenu: [
            {
              id: 'kb-regular',
              label: 'Mode Regular (Urut Alif-Yaa)',
              checked: keyboardMode === 'regular',
              action: () => setKeyboardMode('regular'),
            },
            {
              id: 'kb-standard',
              label: 'Mode Standard (Phonetic Latin)',
              checked: keyboardMode === 'standard',
              action: () => setKeyboardMode('standard'),
            },
            {
              id: 'kb-arabic',
              label: 'Mode Arabic (Windows Arabic 101)',
              checked: keyboardMode === 'arabic',
              action: () => setKeyboardMode('arabic'),
            },
          ],
        },
        {
          id: 'specialCharacters',
          label: 'Special Characters',
          icon: Sparkles,
          shortcut: 'Ctrl+K',
          checked: specialCharactersOpen,
          action: () => toggleSpecialCharacters(),
        },
        {
          id: 'autoReplace',
          label: 'Auto Replace',
          shortcut: 'Ctrl+F',
          checked: autoReplace,
          action: () => toggleAutoReplace(),
        },
      ],
    },
    {
      id: 'insert',
      label: 'Insert',
      items: [
        {
          id: 'waqafAndAyah',
          label: 'Tanda Waqaf & Nomor Ayat..',
          icon: Hash,
          shortcut: 'F12',
          action: () => useUIStore.getState().openWaqafDialog('end'),
        },
        { id: 'sep-ins-1', label: '', separator: true },
        {
          id: 'insHarakat',
          label: 'Panel Tanda Harakat',
          icon: Layers,
          shortcut: 'Ctrl+Shift+H',
          action: () => useUIStore.getState().toggleHarakatPalette(),
        },
        {
          id: 'insSpecialChars',
          label: 'Panel Karakter Spesial',
          icon: Sparkles,
          shortcut: 'Ctrl+K',
          action: () => useUIStore.getState().toggleSpecialCharacters(),
        },
      ],
    },
    {
      id: 'help',
      label: 'Help',
      items: [
        {
          id: 'shortcuts',
          label: 'Keyboard Shortcuts Reference',
          icon: Keyboard,
          shortcut: 'F1',
          action: () => setActiveDialog('shortcuts'),
        },
        {
          id: 'fastWordHelp',
          label: 'FastWord Manager',
          icon: BookmarkPlus,
          action: () => setActiveDialog('fastWord'),
        },
        {
          id: 'settings',
          label: 'Settings (Pengaturan)',
          action: () => setActiveDialog('settings'),
        },
        { id: 'sep-help-1', label: '', separator: true },
        {
          id: 'about',
          label: 'About Kitaba',
          icon: Info,
          action: () => setActiveDialog('about'),
        },
      ],
    },
  ];

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(activeMenu === menuId ? null : menuId);
    setActiveSubmenu(null);
  };

  const handleMenuHover = (menuId: string) => {
    if (activeMenu !== null) {
      setActiveMenu(menuId);
      setActiveSubmenu(null);
    }
  };

  const executeItem = (item: MenuItem) => {
    if (item.disabled || item.separator) return;
    if (item.action) item.action();
    setActiveMenu(null);
    setActiveSubmenu(null);
  };

  return (
    <div
      ref={menuBarRef}
      className="flex items-center h-9 pl-4 sm:pl-5 pr-4 sm:pr-6 bg-[#EDEAE0] dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 text-[13.5px] select-none z-30 font-sans shadow-xs gap-1.5"
    >
      {menuCategories.map((cat) => {
        const isOpen = activeMenu === cat.id;
        return (
          <div key={cat.id} className="relative">
            <button
              onClick={() => handleMenuClick(cat.id)}
              onMouseEnter={() => handleMenuHover(cat.id)}
              className={cn(
                'px-3 py-1 rounded-sm transition-colors font-medium text-[13.5px]',
                isOpen
                  ? 'bg-[#316AC5] text-white shadow-xs'
                  : 'text-gray-800 dark:text-gray-200 hover:bg-[#D8D5C4] dark:hover:bg-gray-800'
              )}
            >
              {cat.label}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute top-full left-0 min-w-[250px] bg-white dark:bg-gray-800 rounded-md shadow-2xl border border-gray-300 dark:border-gray-700 py-1.5 z-50 text-[13px]">
                {cat.items.map((item) => {
                  if (item.separator) {
                    return (
                      <div
                        key={item.id}
                        className="my-1.5 border-t border-gray-200 dark:border-gray-700"
                      />
                    );
                  }

                  const hasSubmenu = Boolean(item.submenu && item.submenu.length > 0);
                  const isSubmenuOpen = activeSubmenu === item.id;
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.id}
                      className="relative"
                      onMouseEnter={() => hasSubmenu && setActiveSubmenu(item.id)}
                    >
                      <button
                        onClick={() => executeItem(item)}
                        disabled={item.disabled}
                        className={cn(
                          'w-full flex items-center justify-between px-3.5 py-1.5 text-left transition-colors',
                          item.disabled
                            ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            : 'text-gray-800 dark:text-gray-200 hover:bg-[#316AC5] hover:text-white'
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-4 h-4 flex items-center justify-center">
                            {item.checked ? (
                              <Check size={14} className="text-amber-600 dark:text-amber-400" />
                            ) : Icon ? (
                              <Icon size={14} className="opacity-75" />
                            ) : null}
                          </div>
                          <span className="font-normal">{item.label}</span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] opacity-70">
                          {item.shortcut && <span className="font-mono">{item.shortcut}</span>}
                          {hasSubmenu && <ChevronRight size={13} />}
                        </div>
                      </button>

                      {/* Submenu */}
                      {hasSubmenu && isSubmenuOpen && (
                        <div className="absolute top-0 left-full min-w-[220px] bg-white dark:bg-gray-800 rounded-md shadow-2xl border border-gray-300 dark:border-gray-700 py-1.5 z-50 text-[13px]">
                          {item.submenu!.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => executeItem(sub)}
                              className="w-full flex items-center justify-between px-3.5 py-1.5 text-left hover:bg-[#316AC5] hover:text-white text-gray-800 dark:text-gray-200"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-4 h-4 flex items-center justify-center">
                                  {sub.checked && <Check size={14} />}
                                </div>
                                <span className="font-normal">{sub.label}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default MenuBar;
