import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import i18n from '../i18n';
import { idbStorage } from './idbStorage';

export type Language = 'id' | 'en' | 'ar';

export interface FastWordEntry {
  name: string;
  text: string;
}

export interface SettingsState {
  language: Language;
  autoSaveInterval: number; // in milliseconds (e.g. 5000)
  enableFKeyShortcuts: boolean;
  enableAutoReplace: boolean;
  defaultFont: string;
  fastWords: Record<string, FastWordEntry>; // Key is 'A' - 'Z'

  // Actions
  setLanguage: (language: Language) => void;
  setAutoSaveInterval: (interval: number) => void;
  setEnableFKeyShortcuts: (enabled: boolean) => void;
  setEnableAutoReplace: (enabled: boolean) => void;
  setDefaultFont: (font: string) => void;
  setFastWord: (key: string, name: string, text: string) => void;
  deleteFastWord: (key: string) => void;
  getFastWord: (key: string) => FastWordEntry | undefined;
  resetSettings: () => void;
}

export const DEFAULT_FASTWORDS: Record<string, FastWordEntry> = {
  B: { name: 'Bismillaah', text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
  A: { name: 'Allaah', text: 'اللَّه' },
  H: { name: 'Hamdalah', text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ' },
  S: { name: 'Shalawat', text: 'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ' },
};

export const DEFAULT_SETTINGS = {
  language: 'id' as Language,
  autoSaveInterval: 5000,
  enableFKeyShortcuts: true,
  enableAutoReplace: true,
  defaultFont: 'Naskh (harakat)',
  fastWords: DEFAULT_FASTWORDS,
};

function applyLanguageToDocument(language: Language) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }
  if (i18n && typeof i18n.changeLanguage === 'function') {
    i18n.changeLanguage(language).catch((error) => {
      console.warn('[settingsStore] Failed to update i18n language:', error);
    });
  }
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      language: DEFAULT_SETTINGS.language,
      autoSaveInterval: DEFAULT_SETTINGS.autoSaveInterval,
      enableFKeyShortcuts: DEFAULT_SETTINGS.enableFKeyShortcuts,
      enableAutoReplace: DEFAULT_SETTINGS.enableAutoReplace,
      defaultFont: DEFAULT_SETTINGS.defaultFont,
      fastWords: DEFAULT_SETTINGS.fastWords,

      setLanguage: (language: Language) => {
        applyLanguageToDocument(language);
        set({ language });
      },

      setAutoSaveInterval: (autoSaveInterval: number) =>
        set({ autoSaveInterval: Math.max(1000, autoSaveInterval) }),

      setEnableFKeyShortcuts: (enableFKeyShortcuts: boolean) =>
        set({ enableFKeyShortcuts }),

      setEnableAutoReplace: (enableAutoReplace: boolean) =>
        set({ enableAutoReplace }),

      setDefaultFont: (defaultFont: string) => set({ defaultFont }),

      setFastWord: (key: string, name: string, text: string) =>
        set((state) => ({
          fastWords: {
            ...state.fastWords,
            [key.toUpperCase()]: { name, text },
          },
        })),

      deleteFastWord: (key: string) =>
        set((state) => {
          const next = { ...state.fastWords };
          delete next[key.toUpperCase()];
          return { fastWords: next };
        }),

      getFastWord: (key: string) => {
        return get().fastWords[key.toUpperCase()];
      },

      resetSettings: () => {
        applyLanguageToDocument(DEFAULT_SETTINGS.language);
        set({ ...DEFAULT_SETTINGS });
      },
    }),
    {
      name: 'naskh_settings_storage',
      storage: createJSONStorage(() => idbStorage),
      version: 2,
      onRehydrateStorage: () => (state) => {
        if (state?.language) {
          applyLanguageToDocument(state.language);
        }
      },
    }
  )
);

export default useSettingsStore;
