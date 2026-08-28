import { useState, useEffect } from 'react';
import { useNaskhEditor } from '@/editor/EditorContext';
import { useEditorStore } from '@/stores/editorStore';
import { useKeyboardStore } from '@/stores/keyboardStore';
import { cn } from '@/lib/utils';

export function StatusBar() {
  const editor = useNaskhEditor();

  const autoReplace = useEditorStore((s) => s.autoReplace);
  const toggleAutoReplace = useEditorStore((s) => s.toggleAutoReplace);

  const keyboardMode = useKeyboardStore((s) => s.keyboardMode);
  const cycleKeyboardMode = useKeyboardStore((s) => s.cycleKeyboardMode);

  const [cursorPos, setCursorPos] = useState<{ line: number; col: number }>({
    line: 1,
    col: 1,
  });
  const [capsLock, setCapsLock] = useState<boolean>(false);

  // Update line and column number from editor selection
  useEffect(() => {
    if (!editor) return;

    const updatePosition = () => {
      const { from } = editor.state.selection;
      const textBefore = editor.state.doc.textBetween(0, from, '\n', '\n');
      const lines = textBefore.split('\n');
      const line = lines.length;
      const col = lines[lines.length - 1].length + 1;

      setCursorPos({ line, col });
    };

    editor.on('selectionUpdate', updatePosition);
    editor.on('update', updatePosition);

    return () => {
      editor.off('selectionUpdate', updatePosition);
      editor.off('update', updatePosition);
    };
  }, [editor]);

  // Track Caps Lock key state
  useEffect(() => {
    const handleKeyEvent = (e: KeyboardEvent) => {
      setCapsLock(e.getModifierState('CapsLock'));
    };

    window.addEventListener('keydown', handleKeyEvent);
    window.addEventListener('keyup', handleKeyEvent);

    return () => {
      window.removeEventListener('keydown', handleKeyEvent);
      window.removeEventListener('keyup', handleKeyEvent);
    };
  }, []);

  const fontScript = useEditorStore((s) => s.fontScript);
  const toggleFontScript = useEditorStore((s) => s.toggleFontScript);
  const zoom = useEditorStore((s) => s.zoom);
  const zoomIn = useEditorStore((s) => s.zoomIn);
  const zoomOut = useEditorStore((s) => s.zoomOut);
  const resetZoom = useEditorStore((s) => s.resetZoom);

  return (
    <div className="flex items-center justify-between h-6 px-6 sm:px-8 bg-[#EDEAE0] dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 text-[11px] font-sans text-gray-700 dark:text-gray-300 select-none z-30 shadow-inner">
      {/* Left: Line & Column indicator */}
      <div className="flex items-center gap-4">
        <div className="font-mono">
          <span>Line: </span>
          <span className="font-bold text-gray-900 dark:text-white">{cursorPos.line}</span>
          <span className="ml-3">Col: </span>
          <span className="font-bold text-gray-900 dark:text-white">{cursorPos.col}</span>
        </div>

        {/* Font Script Toggle Indicator */}
        <button
          onClick={toggleFontScript}
          title="Klik untuk beralih antara Mode Font & Keyboard Arab / Latin"
          className={cn(
            'px-2 py-0.5 rounded-xs text-[10px] font-bold border transition-colors',
            fontScript === 'arabic'
              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-400'
              : 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-200 border-indigo-400'
          )}
        >
          SCRIPT: {fontScript === 'arabic' ? 'ARABIC (ع)' : 'LATIN (A)'}
        </button>

        {/* Keyboard Mode Indicator (Only relevant in Arabic mode) */}
        {fontScript === 'arabic' && (
          <button
            onClick={cycleKeyboardMode}
            title="Klik untuk mengganti mode keyboard (Regular / Standard / Arabic)"
            className="px-2 py-0.5 rounded-xs bg-[#DCD8C8] dark:bg-gray-800 text-[10px] font-semibold text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:border-amber-500 transition-colors"
          >
            KB: {keyboardMode.toUpperCase()}
          </button>
        )}
      </div>

      {/* Center: Auto Replace / Manual Mode toggle */}
      <div className="flex items-center">
        <button
          onClick={toggleAutoReplace}
          title="Klik untuk toggle Mode Auto Replace / Mode Manual (Ctrl+F)"
          className={cn(
            'px-3 py-0.5 rounded-xs text-[11px] font-medium border transition-colors cursor-pointer',
            autoReplace
              ? 'bg-[#E3DFCD] dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-400 dark:border-gray-600 font-semibold'
              : 'bg-transparent text-gray-500 border-transparent hover:border-gray-300'
          )}
        >
          {autoReplace ? 'Mode Auto Replace' : 'Mode Manual'}
        </button>
      </div>

      {/* Right: Zoom controls & CAPS lock indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-[#DCD8C8] dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-700">
          <button
            onClick={() => zoomOut(10)}
            title="Zoom Out"
            disabled={zoom <= 30}
            className="px-1 text-[11px] font-bold hover:text-amber-600 disabled:opacity-40"
          >
            -
          </button>
          <button
            onClick={resetZoom}
            title="Klik untuk Reset Zoom ke 100%"
            className="font-mono font-semibold text-[10px] px-1 hover:underline cursor-pointer"
          >
            {zoom}%
          </button>
          <button
            onClick={() => zoomIn(10)}
            title="Zoom In"
            disabled={zoom >= 300}
            className="px-1 text-[11px] font-bold hover:text-amber-600 disabled:opacity-40"
          >
            +
          </button>
        </div>

        <div
          className={cn(
            'px-2 py-0.5 rounded-xs font-mono font-bold text-[10px] border tracking-wider',
            capsLock
              ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
              : 'text-gray-400 dark:text-gray-600 border-transparent'
          )}
        >
          CAPS
        </div>
      </div>
    </div>
  );
}

export default StatusBar;
