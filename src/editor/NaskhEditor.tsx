import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
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
import { AVAILABLE_FONTS } from '@/types';

export function NaskhEditor() {
  const { t, i18n } = useTranslation();
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

  // Global Keyboard shortcuts for Zoom (Ctrl/Cmd + Plus, Minus, 0)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomIn, zoomOut, resetZoom]);

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
      Placeholder.configure({
        placeholder: ({ node, pos }) => {
          if (pos === 0 || node.type.name === 'paragraph') {
            return t('editor.placeholder');
          }
          return '';
        },
        emptyNodeClass: 'is-empty',
        emptyEditorClass: 'is-editor-empty',
        showOnlyWhenEditable: true,
      }),
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
  }, [editor, activeDoc?.id, activeDoc?.content]);

  // Update editor attributes and inline styling when formatting state changes
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

  // Re-render editor when language changes so placeholder updates
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    const phExt = editor.extensionManager.extensions.find((e) => e.name === 'placeholder');
    if (phExt) {
      phExt.options.placeholder = ({ node, pos }: { node: any; pos: number }) => {
        if (pos === 0 || node.type.name === 'paragraph') {
          return t('editor.placeholder');
        }
        return '';
      };
    }
    editor.view.dispatch(editor.state.tr);
  }, [editor, i18n.language, t]);

  if (!activeDoc) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 bg-[#A2A582] dark:bg-gray-900">
        <p>{t('editor.newDocument', 'New Document')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden bg-[#A2A582] dark:bg-gray-950">
      {/* Editor Canvas Page */}
      <div
        ref={canvasContainerRef}
        className="flex-1 overflow-auto flex justify-center p-4 sm:p-6"
        style={{
          zoom: zoom !== 100 ? `${zoom}%` : undefined,
        }}
      >
        <div
          className="w-full bg-[#EDEAD8] dark:bg-[#252533] text-gray-950 dark:text-gray-50 shadow-2xl rounded-xs min-h-[900px] border border-gray-400 dark:border-gray-700 transition-all cursor-text"
          style={{
            maxWidth: '820px', // A4 proportion page width
            padding: '2.5rem 3rem',
          }}
          onClick={() => editor?.commands.focus()}
        >
          <EditorContent editor={editor} className="min-h-full" />
        </div>
      </div>
    </div>
  );
}

export default NaskhEditor;
