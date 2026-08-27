import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '@/components/common/Dialog';
import { useUIStore } from '@/stores/uiStore';
import { HARAKAT_MAP, HARAKAT_NAMES } from '@/editor/keyboardMaps';
import {
  Keyboard,
  FileText,
  Type,
  Move,
  Search,
} from 'lucide-react';

interface KeyboardShortcutsDialogProps {
  open?: boolean;
  onClose?: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
  charPreview?: string;
}

interface ShortcutSection {
  id: 'harakat' | 'editing' | 'general' | 'navigation';
  titleKey: string;
  defaultTitle: string;
  icon: typeof Keyboard;
  items: ShortcutItem[];
}

export function KeyboardShortcutsDialog({
  open,
  onClose,
}: KeyboardShortcutsDialogProps) {
  const { t, i18n } = useTranslation();
  const activeDialog = useUIStore((s) => s.activeDialog);
  const closeDialog = useUIStore((s) => s.closeDialog);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');

  const isOpen = open !== undefined ? open : activeDialog === 'shortcuts';
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      closeDialog();
    }
  };

  const getHarakatName = (key: string) => {
    const info = HARAKAT_NAMES[key];
    if (!info) return key;
    const lang = i18n.language;
    if (lang === 'ar') return info.ar;
    if (lang === 'id') return info.id;
    return info.en;
  };

  const getHarakatChar = (key: string) => {
    const mark = HARAKAT_MAP[key];
    if (!mark) return '';
    return Array.isArray(mark) ? mark.join('') : mark;
  };

  // Build harakat list items from F1-F12
  const harakatItems: ShortcutItem[] = Object.keys(HARAKAT_NAMES).map((fkey) => ({
    keys: [fkey],
    description: getHarakatName(fkey),
    charPreview: `ب${getHarakatChar(fkey)}`,
  }));

  const sections: ShortcutSection[] = [
    {
      id: 'harakat',
      titleKey: 'shortcuts.harakat_title',
      defaultTitle: 'Harakat & Tashkeel (F1-F12)',
      icon: Keyboard,
      items: harakatItems,
    },
    {
      id: 'editing',
      titleKey: 'shortcuts.editing',
      defaultTitle: 'Text Formatting & Editing',
      icon: Type,
      items: [
        { keys: ['Ctrl / ⌘', 'B'], description: t('shortcuts.bold', 'Bold Text') },
        { keys: ['Ctrl / ⌘', 'I'], description: t('shortcuts.italic', 'Italic Text') },
        { keys: ['Ctrl / ⌘', 'U'], description: t('shortcuts.underline', 'Underline Text') },
        { keys: ['Ctrl / ⌘', 'Z'], description: t('shortcuts.undo', 'Undo') },
        { keys: ['Ctrl / ⌘', 'Shift', 'Z'], description: t('shortcuts.redo', 'Redo') },
        { keys: ['Ctrl / ⌘', 'F'], description: t('shortcuts.find', 'Find & Replace') },
      ],
    },
    {
      id: 'general',
      titleKey: 'shortcuts.general',
      defaultTitle: 'General & File Management',
      icon: FileText,
      items: [
        { keys: ['Ctrl / ⌘', 'N'], description: t('shortcuts.newDoc', 'New Document') },
        { keys: ['Ctrl / ⌘', 'S'], description: t('shortcuts.saveDoc', 'Save Document') },
        { keys: ['Ctrl / ⌘', 'E'], description: t('shortcuts.exportDoc', 'Export Document') },
        { keys: ['Ctrl / ⌘', 'K'], description: t('shortcuts.toggleKeyboard', 'Toggle Virtual Keyboard') },
        { keys: ['Ctrl / ⌘', 'H'], description: t('shortcuts.toggleHarakat', 'Toggle Harakat Palette') },
      ],
    },
    {
      id: 'navigation',
      titleKey: 'shortcuts.navigation',
      defaultTitle: 'Keyboard Modes & Combos',
      icon: Move,
      items: [
        { keys: ['Ctrl / ⌘', 'M'], description: t('shortcuts.cycleMode', 'Cycle Keyboard Mode') },
        { keys: ['s', '+', 'h'], description: 'Regular Mode: Type ص (Sad)' },
        { keys: ['s', '+', 'y'], description: 'Regular Mode: Type ش (Shin)' },
        { keys: ['t', '+', 'h'], description: 'Regular Mode: Type ث (Tsa)' },
        { keys: ['d', '+', 'h'], description: 'Regular Mode: Type ض (Dhad)' },
        { keys: ['k', '+', 'h'], description: 'Regular Mode: Type خ (Kha)' },
        { keys: ['g', '+', 'h'], description: 'Regular Mode: Type غ (Ghain)' },
        { keys: ['z', '+', 'h'], description: 'Regular Mode: Type ظ (Zha)' },
      ],
    },
  ];

  const filteredSections = sections
    .filter((sec) => activeTab === 'all' || sec.id === activeTab)
    .map((sec) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return sec;
      const filteredItems = sec.items.filter(
        (item) =>
          item.description.toLowerCase().includes(q) ||
          item.keys.some((k) => k.toLowerCase().includes(q)) ||
          (item.charPreview && item.charPreview.includes(q))
      );
      return { ...sec, items: filteredItems };
    })
    .filter((sec) => sec.items.length > 0);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      title={t('shortcuts.title', 'Keyboard Shortcuts')}
      size="xl"
    >
      <div className="space-y-4">
        {/* Search & Tabs */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex bg-gray-100 dark:bg-gray-700/60 p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('harakat')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                activeTab === 'harakat'
                  ? 'bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              F1-F12 Harakat
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('editing')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                activeTab === 'editing'
                  ? 'bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              Editing
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('navigation')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                activeTab === 'navigation'
                  ? 'bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              Combos
            </button>
          </div>

          <div className="relative w-full sm:w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shortcut..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Shortcut Sections */}
        <div className="space-y-5 max-h-[55vh] overflow-y-auto pr-1">
          {filteredSections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.id} className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  <Icon size={14} />
                  <span>{t(section.titleKey, section.defaultTitle)}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {section.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200 dark:border-gray-700/80 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-colors"
                    >
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.keys.map((k, kIdx) => (
                          <kbd
                            key={kIdx}
                            className="px-2 py-1 text-[11px] font-mono font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-2xs"
                          >
                            {k}
                          </kbd>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-right">
                        <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                          {item.description}
                        </span>
                        {item.charPreview && (
                          <span className="text-xl font-arabic text-amber-700 dark:text-amber-400 font-bold px-1.5 py-0.5 bg-amber-50 dark:bg-amber-950/40 rounded-md">
                            {item.charPreview}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredSections.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-400">
              {t('findReplace.noMatches', 'No matching shortcuts found')}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-gray-100 dark:border-gray-700">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-xs transition-colors"
          >
            {t('dialog.close', 'Close')}
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default KeyboardShortcutsDialog;
