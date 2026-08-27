import type { ElementType } from 'react';
import {
  FilePlus,
  FolderOpen,
  Save,
  Printer,
  Undo2,
  Redo2,
  Scissors,
  Copy,
  ClipboardPaste,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  HelpCircle,
  BookmarkPlus,
  Keyboard,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/uiStore';
import { useDocumentStore } from '@/stores/documentStore';
import { useEditorStore } from '@/stores/editorStore';
import { useNaskhEditor } from '@/editor/EditorContext';
import { ARABIC_FONTS, LATIN_FONTS, FONT_SIZES } from '@/types';

export function Toolbar() {
  const editor = useNaskhEditor();

  const createDocument = useDocumentStore((s) => s.createDocument);
  const activeDoc = useDocumentStore((s) => s.getActiveDocument());
  const markDocumentSaved = useDocumentStore((s) => s.markDocumentSaved);

  const fontFamily = useEditorStore((s) => s.fontFamily);
  const setFontFamily = useEditorStore((s) => s.setFontFamily);
  const fontSize = useEditorStore((s) => s.fontSize);
  const setFontSize = useEditorStore((s) => s.setFontSize);
  const fontScript = useEditorStore((s) => s.fontScript);
  const toggleFontScript = useEditorStore((s) => s.toggleFontScript);

  const setActiveDialog = useUIStore((s) => s.setActiveDialog);
  const toggleSpecialCharacters = useUIStore((s) => s.toggleSpecialCharacters);
  const specialCharactersOpen = useUIStore((s) => s.specialCharactersOpen);
  const toggleVirtualKeyboard = useUIStore((s) => s.toggleVirtualKeyboard);
  const virtualKeyboardOpen = useUIStore((s) => s.virtualKeyboardOpen);

  const currentFonts = fontScript === 'arabic' ? ARABIC_FONTS : LATIN_FONTS;

  const handleColorPick = () => {
    const color = prompt('Masukkan kode warna (hex):', '#000000');
    if (color && editor) {
      editor.chain().focus().setColor(color).run();
    }
  };

  return (
    <div className="flex items-center gap-2 px-6 sm:px-8 py-2 bg-[#EDEAE0] dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 select-none overflow-x-auto shadow-xs">
      {/* Group 1: File Actions (New, Open, Save, Print) */}
      <div className="flex items-center gap-1">
        <ToolbarIconButton
          icon={FilePlus}
          label="New (Ctrl+N)"
          onClick={() => createDocument()}
        />
        <ToolbarIconButton
          icon={FolderOpen}
          label="Open (Ctrl+O)"
          onClick={() => useUIStore.getState().setSidebarOpen(true)}
        />
        <ToolbarIconButton
          icon={Save}
          label="Save (Ctrl+S)"
          onClick={() => {
            if (activeDoc) markDocumentSaved(activeDoc.id);
          }}
        />
        <ToolbarIconButton
          icon={Printer}
          label="Print Document (Ctrl+P)"
          onClick={() => window.print()}
        />
      </div>

      <ToolbarSeparator />

      {/* Group 2: History & Clipboard (Undo, Redo, Cut, Copy, Paste) */}
      <div className="flex items-center gap-1">
        <ToolbarIconButton
          icon={Undo2}
          label="Undo (Ctrl+Z)"
          disabled={!editor?.can().undo()}
          onClick={() => editor?.chain().focus().undo().run()}
        />
        <ToolbarIconButton
          icon={Redo2}
          label="Redo (Ctrl+Y)"
          disabled={!editor?.can().redo()}
          onClick={() => editor?.chain().focus().redo().run()}
        />
        <ToolbarIconButton
          icon={Scissors}
          label="Cut (Ctrl+X)"
          onClick={() => document.execCommand('cut')}
        />
        <ToolbarIconButton
          icon={Copy}
          label="Copy (Ctrl+C)"
          onClick={() => document.execCommand('copy')}
        />
        <ToolbarIconButton
          icon={ClipboardPaste}
          label="Paste (Ctrl+V)"
          onClick={() => document.execCommand('paste')}
        />
      </div>

      <ToolbarSeparator />

      {/* Group 3: Basic Formatting (Bold, Underline, Italic) */}
      <div className="flex items-center gap-1">
        <ToolbarIconButton
          icon={Bold}
          label="Bold (Ctrl+B)"
          active={editor?.isActive('bold')}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        />
        <ToolbarIconButton
          icon={Underline}
          label="Underline (Ctrl+U)"
          active={editor?.isActive('underline')}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        />
        <ToolbarIconButton
          icon={Italic}
          label="Italic (Ctrl+I)"
          active={editor?.isActive('italic')}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        />
      </div>

      <ToolbarSeparator />

      {/* Group 4: Alignment (Left, Center, Right) */}
      <div className="flex items-center gap-1">
        <ToolbarIconButton
          icon={AlignLeft}
          label="Align Left (Ctrl+L)"
          active={editor?.isActive({ textAlign: 'left' })}
          onClick={() => editor?.chain().focus().setTextAlign('left').run()}
        />
        <ToolbarIconButton
          icon={AlignCenter}
          label="Align Center (Ctrl+E)"
          active={editor?.isActive({ textAlign: 'center' })}
          onClick={() => editor?.chain().focus().setTextAlign('center').run()}
        />
        <ToolbarIconButton
          icon={AlignRight}
          label="Align Right (Ctrl+R)"
          active={editor?.isActive({ textAlign: 'right' })}
          onClick={() => editor?.chain().focus().setTextAlign('right').run()}
        />
      </div>

      <ToolbarSeparator />

      {/* Group 5: Text Color */}
      <button
        onClick={handleColorPick}
        title="Text Color (Ctrl+T)"
        className="flex items-center justify-center w-8.5 h-8.5 rounded-md hover:bg-[#DCD8C8] dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 border border-transparent hover:border-gray-400 transition-colors"
      >
        <span className="font-serif font-bold text-base underline decoration-amber-600 decoration-2">
          A
        </span>
      </button>

      {/* Group 6: Font Script Switcher (ع / A Toggle) */}
      <button
        onClick={toggleFontScript}
        title={
          fontScript === 'arabic'
            ? 'Mode Font Arab (Klik untuk ganti ke Font Latin / A)'
            : 'Mode Font Latin (Klik untuk ganti ke Font Arab / ع)'
        }
        className={cn(
          'flex items-center justify-center w-8.5 h-8.5 rounded-md font-bold text-lg transition-colors border shadow-xs',
          fontScript === 'arabic'
            ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-400 font-arabic'
            : 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-200 border-indigo-400 font-serif'
        )}
      >
        {fontScript === 'arabic' ? 'ع' : 'A'}
      </button>

      {/* Group 7: Font Family Dropdown (Dynamic based on Arabic/Latin script) */}
      <select
        value={fontFamily}
        onChange={(e) => setFontFamily(e.target.value)}
        className="h-8.5 px-3 text-xs font-semibold bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-hidden focus:border-amber-500 cursor-pointer shadow-xs"
        style={{ minWidth: '160px' }}
      >
        {currentFonts.map((font) => (
          <option key={font.family} value={font.family}>
            {font.label}
          </option>
        ))}
      </select>

      {/* Group 8: Font Size Dropdown */}
      <select
        value={fontSize}
        onChange={(e) => setFontSize(Number(e.target.value))}
        className="h-8.5 px-2 text-xs font-bold bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-hidden focus:border-amber-500 cursor-pointer shadow-xs text-center"
        style={{ width: '62px' }}
      >
        {FONT_SIZES.map((sz) => (
          <option key={sz} value={sz}>
            {sz}
          </option>
        ))}
      </select>

      <ToolbarSeparator />

      {/* Group 9: Special Characters (Dock Toggle) */}
      <ToolbarIconButton
        icon={Sparkles}
        label="Special Characters Panel (Ctrl+K)"
        active={specialCharactersOpen}
        onClick={toggleSpecialCharacters}
      />

      {/* Group 10: FastWord Edit Icon */}
      <ToolbarIconButton
        icon={BookmarkPlus}
        label="Save/Manage FastWord (Alt+W)"
        onClick={() => setActiveDialog('fastWord')}
      />

      {/* Group 11: Virtual Keyboard Toggle */}
      <ToolbarIconButton
        icon={Keyboard}
        label="Toggle Virtual Keyboard"
        active={virtualKeyboardOpen}
        onClick={toggleVirtualKeyboard}
      />

      {/* Group 12: Help / Shortcuts (?) */}
      <ToolbarIconButton
        icon={HelpCircle}
        label="Petunjuk & Shortcut Naskh"
        onClick={() => setActiveDialog('shortcuts')}
      />
    </div>
  );
}

function ToolbarIconButton({
  icon: Icon,
  label,
  active,
  disabled,
  onClick,
}: {
  icon: ElementType;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'p-2 rounded-md transition-colors border',
        disabled
          ? 'opacity-35 cursor-not-allowed border-transparent'
          : active
          ? 'bg-amber-200/90 dark:bg-amber-900/60 text-amber-950 dark:text-amber-100 border-amber-400 dark:border-amber-600 shadow-xs font-bold'
          : 'text-gray-800 dark:text-gray-200 hover:bg-[#DCD8C8] dark:hover:bg-gray-800 border-transparent hover:border-gray-300'
      )}
    >
      <Icon size={17} />
    </button>
  );
}

function ToolbarSeparator() {
  return <div className="h-6 w-[1px] bg-gray-300 dark:bg-gray-600 mx-1" />;
}

export default Toolbar;
