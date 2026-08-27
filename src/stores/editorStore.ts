import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './idbStorage';
import type { FontScript } from '@/types';

export type TextDirection = 'rtl' | 'ltr';

export interface EditorState {
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  textDirection: TextDirection;
  lineHeight: number;
  showHarakat: boolean;
  zoom: number; // 50 to 200 (percentage)
  autoReplace: boolean;
  rulerVisible: boolean;
  fontScript: FontScript; // 'arabic' or 'latin'

  // Actions
  setFontFamily: (fontFamily: string) => void;
  setFontSize: (fontSize: number) => void;
  setFontColor: (fontColor: string) => void;
  setTextDirection: (textDirection: TextDirection) => void;
  toggleTextDirection: () => void;
  setLineHeight: (lineHeight: number) => void;
  setShowHarakat: (showHarakat: boolean) => void;
  toggleShowHarakat: () => void;
  setAutoReplace: (autoReplace: boolean) => void;
  toggleAutoReplace: () => void;
  setRulerVisible: (rulerVisible: boolean) => void;
  toggleRulerVisible: () => void;
  setFontScript: (script: FontScript) => void;
  toggleFontScript: () => void;
  setZoom: (zoom: number) => void;
  zoomIn: (step?: number) => void;
  zoomOut: (step?: number) => void;
  resetZoom: () => void;
  resetEditorSettings: () => void;
}

export const DEFAULT_EDITOR_CONFIG = {
  fontFamily: 'Naskh (harakat)',
  fontSize: 26,
  fontColor: '#000000',
  textDirection: 'rtl' as TextDirection,
  lineHeight: 2.0,
  showHarakat: true,
  zoom: 100,
  autoReplace: true,
  rulerVisible: true,
  fontScript: 'arabic' as FontScript,
};

const MIN_ZOOM = 50;
const MAX_ZOOM = 200;
const DEFAULT_ZOOM_STEP = 10;

function clampZoom(value: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(value)));
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      fontFamily: DEFAULT_EDITOR_CONFIG.fontFamily,
      fontSize: DEFAULT_EDITOR_CONFIG.fontSize,
      fontColor: DEFAULT_EDITOR_CONFIG.fontColor,
      textDirection: DEFAULT_EDITOR_CONFIG.textDirection,
      lineHeight: DEFAULT_EDITOR_CONFIG.lineHeight,
      showHarakat: DEFAULT_EDITOR_CONFIG.showHarakat,
      zoom: DEFAULT_EDITOR_CONFIG.zoom,
      autoReplace: DEFAULT_EDITOR_CONFIG.autoReplace,
      rulerVisible: DEFAULT_EDITOR_CONFIG.rulerVisible,
      fontScript: DEFAULT_EDITOR_CONFIG.fontScript,

      setFontFamily: (fontFamily: string) => set({ fontFamily }),

      setFontSize: (fontSize: number) => set({ fontSize: Math.max(8, fontSize) }),

      setFontColor: (fontColor: string) => set({ fontColor }),

      setTextDirection: (textDirection: TextDirection) => set({ textDirection }),

      toggleTextDirection: () =>
        set((state) => ({
          textDirection: state.textDirection === 'rtl' ? 'ltr' : 'rtl',
        })),

      setLineHeight: (lineHeight: number) =>
        set({ lineHeight: Math.max(1.0, Math.min(4.0, lineHeight)) }),

      setShowHarakat: (showHarakat: boolean) => set({ showHarakat }),

      toggleShowHarakat: () =>
        set((state) => ({ showHarakat: !state.showHarakat })),

      setAutoReplace: (autoReplace: boolean) => set({ autoReplace }),

      toggleAutoReplace: () =>
        set((state) => ({ autoReplace: !state.autoReplace })),

      setRulerVisible: (rulerVisible: boolean) => set({ rulerVisible }),

      toggleRulerVisible: () =>
        set((state) => ({ rulerVisible: !state.rulerVisible })),

      setFontScript: (fontScript: FontScript) =>
        set({
          fontScript,
          fontFamily: fontScript === 'arabic' ? 'Naskh (harakat)' : 'Times New Roman',
          textDirection: fontScript === 'arabic' ? 'rtl' : 'ltr',
        }),

      toggleFontScript: () =>
        set((state) => {
          const nextScript: FontScript = state.fontScript === 'arabic' ? 'latin' : 'arabic';
          return {
            fontScript: nextScript,
            fontFamily: nextScript === 'arabic' ? 'Naskh (harakat)' : 'Times New Roman',
            textDirection: nextScript === 'arabic' ? 'rtl' : 'ltr',
          };
        }),

      setZoom: (zoom: number) => set({ zoom: clampZoom(zoom) }),

      zoomIn: (step: number = DEFAULT_ZOOM_STEP) =>
        set((state) => ({ zoom: clampZoom(state.zoom + step) })),

      zoomOut: (step: number = DEFAULT_ZOOM_STEP) =>
        set((state) => ({ zoom: clampZoom(state.zoom - step) })),

      resetZoom: () => set({ zoom: DEFAULT_EDITOR_CONFIG.zoom }),

      resetEditorSettings: () => set({ ...DEFAULT_EDITOR_CONFIG }),
    }),
    {
      name: 'naskh_editor_config_storage',
      storage: createJSONStorage(() => idbStorage),
      version: 3,
    }
  )
);

export default useEditorStore;
