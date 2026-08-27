import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './idbStorage';

export type Theme = 'light' | 'dark' | 'system';
export type WaqafDialogMode = 'mid' | 'end';

export interface UiState {
  theme: Theme;
  sidebarOpen: boolean;
  virtualKeyboardOpen: boolean;
  harakatPaletteOpen: boolean;
  specialCharactersOpen: boolean;
  specialCharactersGroup: number; // 1 to 5
  waqafDialogMode: WaqafDialogMode;
  activeDialog: string | null;
  statusBarVisible: boolean;

  // Actions
  setTheme: (theme: Theme) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setVirtualKeyboardOpen: (open: boolean) => void;
  toggleVirtualKeyboard: () => void;
  setHarakatPaletteOpen: (open: boolean) => void;
  toggleHarakatPalette: () => void;
  setSpecialCharactersOpen: (open: boolean) => void;
  toggleSpecialCharacters: () => void;
  setSpecialCharactersGroup: (group: number) => void;
  setWaqafDialogMode: (mode: WaqafDialogMode) => void;
  openWaqafDialog: (mode?: WaqafDialogMode) => void;
  setActiveDialog: (dialog: string | null) => void;
  closeDialog: () => void;
  setStatusBarVisible: (visible: boolean) => void;
  toggleStatusBar: () => void;
}

export function applyThemeToDocument(theme: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  let isDark = false;

  if (theme === 'dark') {
    isDark = true;
  } else if (theme === 'light') {
    isDark = false;
  } else {
    // system
    isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  root.setAttribute('data-theme', isDark ? 'dark' : 'light');
  root.style.colorScheme = isDark ? 'dark' : 'light';
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: 'system',
      sidebarOpen: false,
      virtualKeyboardOpen: false,
      harakatPaletteOpen: false,
      specialCharactersOpen: false,
      specialCharactersGroup: 1,
      waqafDialogMode: 'end',
      activeDialog: null,
      statusBarVisible: true,

      setTheme: (theme: Theme) => {
        applyThemeToDocument(theme);
        set({ theme });
      },

      setSidebarOpen: (sidebarOpen: boolean) => set({ sidebarOpen }),

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setVirtualKeyboardOpen: (virtualKeyboardOpen: boolean) =>
        set({ virtualKeyboardOpen }),

      toggleVirtualKeyboard: () =>
        set((state) => ({ virtualKeyboardOpen: !state.virtualKeyboardOpen })),

      setHarakatPaletteOpen: (harakatPaletteOpen: boolean) =>
        set({ harakatPaletteOpen }),

      toggleHarakatPalette: () =>
        set((state) => ({ harakatPaletteOpen: !state.harakatPaletteOpen })),

      setSpecialCharactersOpen: (specialCharactersOpen: boolean) =>
        set({ specialCharactersOpen }),

      toggleSpecialCharacters: () =>
        set((state) => ({ specialCharactersOpen: !state.specialCharactersOpen })),

      setSpecialCharactersGroup: (specialCharactersGroup: number) =>
        set({ specialCharactersGroup: Math.max(1, Math.min(5, specialCharactersGroup)) }),

      setWaqafDialogMode: (waqafDialogMode: WaqafDialogMode) =>
        set({ waqafDialogMode }),

      openWaqafDialog: (mode: WaqafDialogMode = 'end') =>
        set({ activeDialog: 'waqaf', waqafDialogMode: mode }),

      setActiveDialog: (activeDialog: string | null) => set({ activeDialog }),

      closeDialog: () => set({ activeDialog: null }),

      setStatusBarVisible: (statusBarVisible: boolean) => set({ statusBarVisible }),

      toggleStatusBar: () =>
        set((state) => ({ statusBarVisible: !state.statusBarVisible })),
    }),
    {
      name: 'kitaba_ui_storage',
      storage: createJSONStorage(() => idbStorage),
      version: 3,
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        statusBarVisible: state.statusBarVisible,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyThemeToDocument(state.theme);
        }
      },
    }
  )
);

export const useUIStore = useUiStore;
export default useUiStore;
