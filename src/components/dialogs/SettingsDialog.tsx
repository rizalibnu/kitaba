import { useTranslation } from 'react-i18next';
import { Dialog } from '@/components/common/Dialog';
import { useSettingsStore, type Language } from '@/stores/settingsStore';
import { useUIStore } from '@/stores/uiStore';
import { useEditorStore } from '@/stores/editorStore';
import { AVAILABLE_FONTS } from '@/types';
import {
  Sun,
  Moon,
  Laptop,
  Languages,
  Clock,
  Keyboard,
  Type,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface SettingsDialogProps {
  open?: boolean;
  onClose?: () => void;
}

export function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const { t } = useTranslation();

  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);
  const activeDialog = useUIStore((s) => s.activeDialog);
  const closeDialog = useUIStore((s) => s.closeDialog);

  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const autoSaveInterval = useSettingsStore((s) => s.autoSaveInterval);
  const setAutoSaveInterval = useSettingsStore((s) => s.setAutoSaveInterval);
  const enableFKeyShortcuts = useSettingsStore((s) => s.enableFKeyShortcuts);
  const setEnableFKeyShortcuts = useSettingsStore((s) => s.setEnableFKeyShortcuts);
  const enableAutoReplace = useSettingsStore((s) => s.enableAutoReplace);
  const setEnableAutoReplace = useSettingsStore((s) => s.setEnableAutoReplace);
  const defaultFont = useSettingsStore((s) => s.defaultFont);
  const setDefaultFont = useSettingsStore((s) => s.setDefaultFont);
  const resetSettings = useSettingsStore((s) => s.resetSettings);

  const setEditorFontFamily = useEditorStore((s) => s.setFontFamily);

  const isOpen = open !== undefined ? open : activeDialog === 'settings';
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      closeDialog();
    }
  };

  const handleFontChange = (font: string) => {
    setDefaultFont(font);
    setEditorFontFamily(font);
  };

  const handleReset = () => {
    if (window.confirm(t('settings.resetConfirm', 'Are you sure you want to reset all settings to defaults?'))) {
      resetSettings();
      setTheme('system');
    }
  };

  // Convert ms to seconds for display
  const autoSaveSeconds = Math.round(autoSaveInterval / 1000);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      title={t('settings.title', 'Settings')}
      size="lg"
    >
      <div className="space-y-6">
        {/* Language selector */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700/60">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
              <Languages size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span>{t('settings.language', 'Language')}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Select your preferred interface language
            </p>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="px-3 py-1.5 text-xs font-medium bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="id">Bahasa Indonesia</option>
            <option value="en">English</option>
            <option value="ar">العربية (Arabic)</option>
          </select>
        </div>

        {/* Theme Mode Selector */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700/60">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
              <Sun size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span>{t('settings.theme', 'Theme')}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Choose visual appearance mode
            </p>
          </div>
          <div className="flex bg-gray-100 dark:bg-gray-700/70 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                theme === 'light'
                  ? 'bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              <Sun size={14} />
              <span>{t('settings.themeLight', 'Light')}</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                theme === 'dark'
                  ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              <Moon size={14} />
              <span>{t('settings.themeDark', 'Dark')}</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                theme === 'system'
                  ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              <Laptop size={14} />
              <span>{t('settings.themeSystem', 'System')}</span>
            </button>
          </div>
        </div>

        {/* Default Font */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700/60">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
              <Type size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span>{t('settings.defaultFont', 'Default Arabic Font')}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Preferred typeface for Arabic documents
            </p>
          </div>
          <select
            value={defaultFont}
            onChange={(e) => handleFontChange(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {AVAILABLE_FONTS.map((font) => (
              <option key={font.family} value={font.family}>
                {font.label}
              </option>
            ))}
          </select>
        </div>

        {/* Auto Save Interval */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700/60">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
              <Clock size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span>{t('settings.autoSave', 'Auto Save Interval')}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Automatically persist changes to offline storage
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={2}
              max={60}
              step={1}
              value={autoSaveSeconds}
              onChange={(e) => setAutoSaveInterval(Number(e.target.value) * 1000)}
              className="w-24 sm:w-32 accent-emerald-600 cursor-pointer"
            />
            <span className="text-xs font-mono text-gray-700 dark:text-gray-300 w-12 text-right">
              {autoSaveSeconds}s
            </span>
          </div>
        </div>

        {/* F1-F12 Harakat Shortcuts Toggle */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700/60">
          <div className="space-y-0.5 pr-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
              <Keyboard size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span>{t('settings.enableFKeys', 'F1-F12 Shortcuts')}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('settings.enableFKeysDesc', 'Quickly type diacritics using F1 to F12 keys')}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enableFKeyShortcuts}
              onChange={(e) => setEnableFKeyShortcuts(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {/* Auto Replace Combos Toggle */}
        <div className="flex items-center justify-between pb-2">
          <div className="space-y-0.5 pr-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
              <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span>{t('settings.enableAutoReplace', 'Phonetic Combos')}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('settings.enableAutoReplaceDesc', 'Auto-convert combos (e.g. sh -> ص, kh -> خ)')}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enableAutoReplace}
              onChange={(e) => setEnableAutoReplace(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
          >
            <RotateCcw size={14} />
            <span>{t('settings.resetDefaults', 'Reset Defaults')}</span>
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-xs transition-colors"
          >
            {t('dialog.close', 'Save & Close')}
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default SettingsDialog;
