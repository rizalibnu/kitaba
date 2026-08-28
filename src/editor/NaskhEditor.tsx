import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import CharacterCount from '@tiptap/extension-character-count';
import { TextStyle } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';

import { FontSize } from './extensions/FontSize';
import { ArabicKeyboard } from './extensions/ArabicKeyboard';
import { WaqafNode } from './extensions/WaqafNode';
import { AyahNode } from './extensions/AyahNode';
import { setActiveEditor } from './EditorContext';

import { useDocumentStore } from '@/stores/documentStore';
import { useEditorStore } from '@/stores/editorStore';
import { useUIStore } from '@/stores/uiStore';
import { AVAILABLE_FONTS } from '@/types';
import { processImportedContent } from '@/lib/khtImportHelper';

export function NaskhEditor() {
  const { t } = useTranslation();
  const activeDoc = useDocumentStore((s) => s.getActiveDocument());
  const updateContent = useDocumentStore((s) => s.updateDocumentContent);
  const { fontFamily, fontSize, lineHeight, textDirection, zoom } = useEditorStore();
  const zoomIn = useEditorStore((s) => s.zoomIn);
  const zoomOut = useEditorStore((s) => s.zoomOut);
  const resetZoom = useEditorStore((s) => s.resetZoom);

  // Wheel zoom with Ctrl/Cmd key
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          zoomIn(5);
        } else if (e.deltaY > 0) {
          zoomOut(5);
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [zoomIn, zoomOut]);

  // Resolve CSS font family
  const resolvedFont =
    AVAILABLE_FONTS.find((f) => f.family === fontFamily)?.cssFamily ||
    '"Amiri", "Noto Naskh Arabic", serif';

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'right',
      }),
      Underline,
      CharacterCount,
      TextStyle,
      FontFamily,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      FontSize,
      ArabicKeyboard,
      WaqafNode,
      AyahNode,
    ],
    content: activeDoc?.content || '<p dir="rtl"></p>',
    editorProps: {
      attributes: {
        class: 'tiptap focus:outline-hidden',
        dir: textDirection,
        style: `font-family: ${resolvedFont}; font-size: ${fontSize}px; line-height: ${lineHeight};`,
      },
    },
    onUpdate: ({ editor }) => {
      const currentActive = useDocumentStore.getState().getActiveDocument();
      if (currentActive) {
        updateContent(currentActive.id, editor.getJSON());
      }
    },
  });

  // Global Keyboard shortcuts for Zoom and Formatting (Ctrl/Cmd + Keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const keyLower = e.key.toLowerCase();

        // Zoom shortcuts
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          zoomIn(10);
        } else if (e.key === '-' || e.key === '_') {
          e.preventDefault();
          zoomOut(10);
        } else if (e.key === '0') {
          e.preventDefault();
          resetZoom();
        }

        // Formatting Shortcuts
        else if (keyLower === 'b') {
          e.preventDefault();
          editor?.chain().focus().toggleBold().run();
        } else if (keyLower === 'i') {
          e.preventDefault();
          editor?.chain().focus().toggleItalic().run();
        } else if (keyLower === 'u') {
          e.preventDefault();
          editor?.chain().focus().toggleUnderline().run();
        }

        // Alignment Shortcuts
        else if (keyLower === 'r') {
          e.preventDefault();
          editor?.chain().focus().setTextAlign('right').run();
        } else if (keyLower === 'e') {
          e.preventDefault();
          editor?.chain().focus().setTextAlign('center').run();
        } else if (keyLower === 'l') {
          e.preventDefault();
          editor?.chain().focus().setTextAlign('left').run();
        } else if (keyLower === 'j') {
          e.preventDefault();
          editor?.chain().focus().setTextAlign('justify').run();
        }

        // Font Size Shortcuts
        else if (keyLower === 'h' || e.key === ']') {
          e.preventDefault();
          useEditorStore.getState().setFontSize(fontSize + 2);
        } else if (keyLower === 'd' || e.key === '[') {
          e.preventDefault();
          useEditorStore.getState().setFontSize(Math.max(8, fontSize - 2));
        }

        // Document Save (Ctrl+S)
        else if (keyLower === 's') {
          e.preventDefault();
          if (activeDoc) {
            useDocumentStore.getState().markDocumentSaved(activeDoc.id);
          }
        }

        // Special Characters Panel Toggle (Ctrl+K)
        else if (keyLower === 'k') {
          e.preventDefault();
          useUIStore.getState().toggleSpecialCharacters();
        }
      }

      // Alt/Option + 1..5: Open Special Characters group
      const isAltKey = e.altKey || e.getModifierState?.('Alt');
      if (isAltKey && !e.ctrlKey && !e.metaKey) {
        if (/^[1-5]$/.test(e.key) || /^Digit[1-5]$/.test(e.code)) {
          e.preventDefault();
          const digitMatch = e.key.match(/^[1-5]$/) || e.code.match(/Digit([1-5])/);
          const grpNum = digitMatch ? parseInt(digitMatch[1] || digitMatch[0], 10) : 1;
          useUIStore.getState().setSpecialCharactersOpen(true);
          useUIStore.getState().setSpecialCharactersGroup(grpNum);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor, activeDoc, fontSize, zoomIn, zoomOut, resetZoom]);

  // Track global active editor instance for toolbars and dialogs
  useEffect(() => {
    if (editor) {
      setActiveEditor(editor);
    }
    return () => {
      setActiveEditor(null);
    };
  }, [editor]);

  // Track active document ID across tab switches
  const currentDocIdRef = useRef<string | null>(activeDoc?.id ?? null);

  useEffect(() => {
    if (!editor || !activeDoc) return;

    if (currentDocIdRef.current !== activeDoc.id) {
      currentDocIdRef.current = activeDoc.id;

      if (activeDoc.content) {
        editor.commands.setContent(activeDoc.content);
      } else {
        editor.commands.setContent('<p dir="rtl"></p>');
      }
    }
  }, [editor, activeDoc?.id]);

  // Sync editor font, size, line-height, and text direction changes
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;

    const styleStr = `font-family: ${resolvedFont}; font-size: ${fontSize}px; line-height: ${lineHeight};`;

    if (editor.view?.dom) {
      editor.view.dom.setAttribute('dir', textDirection);
      editor.view.dom.style.fontFamily = resolvedFont;
      editor.view.dom.style.fontSize = `${fontSize}px`;
      editor.view.dom.style.lineHeight = `${lineHeight}`;
    }

    editor.setOptions({
      editorProps: {
        attributes: {
          class: 'tiptap focus:outline-hidden',
          dir: textDirection,
          style: styleStr,
        },
      },
    });
  }, [editor, resolvedFont, fontSize, lineHeight, textDirection]);

  if (!activeDoc) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 bg-[#A2A582] dark:bg-gray-900">
        <p>{t('editor.newDocument', 'New Document')}</p>
      </div>
    );
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      try {
        const text = await file.text();
        processImportedContent(text, file.name, editor);
      } catch (err) {
        console.error('Failed to import dropped file:', err);
      }
    }
  };

  return (
    <div
      className="flex flex-col flex-1 h-full overflow-hidden bg-[#A2A582] dark:bg-gray-950"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Editor Canvas Page */}
      <div
        ref={canvasContainerRef}
        className="flex-1 overflow-y-auto overflow-x-auto flex justify-center p-4 sm:p-8"
        style={{
          zoom: zoom !== 100 ? `${zoom}%` : undefined,
        }}
      >
        <div
          className="w-full bg-[#EDEAD8] dark:bg-[#252533] text-gray-950 dark:text-gray-50 shadow-2xl rounded-xs min-h-[960px] h-fit mb-24 border border-gray-400 dark:border-gray-700 transition-all cursor-text"
          style={{
            maxWidth: '820px', // A4 proportion page width
            padding: '2.5rem 3rem',
          }}
          onClick={() => editor?.commands.focus()}
        >
          <EditorContent editor={editor} className="min-h-[850px] h-auto" />
        </div>
      </div>
    </div>
  );
}

export default NaskhEditor;
