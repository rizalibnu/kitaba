import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './idbStorage';

export type KeyboardMode = 'regular' | 'standard' | 'arabic';

export const KEYBOARD_MODES: readonly KeyboardMode[] = [
  'regular',
  'standard',
  'arabic',
] as const;

export interface KeyboardState {
  keyboardMode: KeyboardMode;
  isVirtualKeyboardCaps: boolean;

  // Actions
  setKeyboardMode: (mode: KeyboardMode) => void;
  cycleKeyboardMode: () => void;
  toggleCaps: () => void;
  setCaps: (caps: boolean) => void;
}

export const useKeyboardStore = create<KeyboardState>()(
  persist(
    (set) => ({
      keyboardMode: 'regular',
      isVirtualKeyboardCaps: false,

      setKeyboardMode: (keyboardMode: KeyboardMode) => set({ keyboardMode }),

      cycleKeyboardMode: () =>
        set((state) => {
          const currentIndex = KEYBOARD_MODES.indexOf(state.keyboardMode);
          const nextIndex =
            currentIndex === -1 ? 0 : (currentIndex + 1) % KEYBOARD_MODES.length;
          return { keyboardMode: KEYBOARD_MODES[nextIndex] };
        }),

      toggleCaps: () =>
        set((state) => ({
          isVirtualKeyboardCaps: !state.isVirtualKeyboardCaps,
        })),

      setCaps: (isVirtualKeyboardCaps: boolean) => set({ isVirtualKeyboardCaps }),
    }),
    {
      name: 'naskh_keyboard_storage',
      storage: createJSONStorage(() => idbStorage),
      version: 1,
      // Persist keyboardMode, transient virtual keyboard shift/caps state is not persisted
      partialize: (state) => ({
        keyboardMode: state.keyboardMode,
      }),
    }
  )
);

export default useKeyboardStore;
