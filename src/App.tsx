import { useEffect } from 'react';
import { useUIStore, applyThemeToDocument } from '@/stores/uiStore';
import { useDocumentStore } from '@/stores/documentStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { MenuBar } from '@/components/layout/MenuBar';
import { Toolbar } from '@/components/layout/Toolbar';
import { TabBar } from '@/components/layout/TabBar';
import { StatusBar } from '@/components/layout/StatusBar';
import { Sidebar } from '@/components/layout/Sidebar';
import { NaskhEditor } from '@/editor/NaskhEditor';
import { SpecialCharactersPanel } from '@/components/editor/SpecialCharactersPanel';
import { VirtualKeyboard } from '@/components/editor/VirtualKeyboard';
import { HarakatPalette } from '@/components/editor/HarakatPalette';
import { WaqafDialog } from '@/components/dialogs/WaqafDialog';
import { AyahNumberDialog } from '@/components/dialogs/AyahNumberDialog';
import { SettingsDialog } from '@/components/dialogs/SettingsDialog';
import { FindReplaceDialog } from '@/components/dialogs/FindReplaceDialog';
import { ExportDialog } from '@/components/dialogs/ExportDialog';
import { FastWordDialog } from '@/components/dialogs/FastWordDialog';
import { KeyboardShortcutsDialog } from '@/components/dialogs/KeyboardShortcutsDialog';
import { AboutDialog } from '@/components/dialogs/AboutDialog';
import { PwaUpdatePrompt } from '@/components/common/PwaUpdatePrompt';
import { Agentation } from 'agentation';

export default function App() {
  const theme = useUIStore((s) => s.theme);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const statusBarVisible = useUIStore((s) => s.statusBarVisible);
  const virtualKeyboardOpen = useUIStore((s) => s.virtualKeyboardOpen);
  const harakatPaletteOpen = useUIStore((s) => s.harakatPaletteOpen);
  const specialCharactersOpen = useUIStore((s) => s.specialCharactersOpen);
  const activeDialog = useUIStore((s) => s.activeDialog);
  const setActiveDialog = useUIStore((s) => s.setActiveDialog);

  const language = useSettingsStore((s) => s.language);
  const documents = useDocumentStore((s) => s.documents);
  const activeDoc = useDocumentStore((s) => s.getActiveDocument());
  const createDocument = useDocumentStore((s) => s.createDocument);

  // Apply theme
  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  // Apply language direction
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Create initial document if none exists
  useEffect(() => {
    if (documents.length === 0) {
      createDocument();
    }
  }, []);

  // Update window title
  useEffect(() => {
    const docTitle = activeDoc?.title || 'Untitled';
    document.title = `Kitaba (كتابة) - ${docTitle}`;
  }, [activeDoc?.title]);

  // Auto-save timer
  const autoSaveInterval = useSettingsStore((s) => s.autoSaveInterval);
  useEffect(() => {
    const timer = setInterval(() => {
      const docs = useDocumentStore.getState().documents;
      docs.forEach((doc) => {
        if (doc.isDirty) {
          useDocumentStore.getState().markDocumentSaved(doc.id);
        }
      });
    }, autoSaveInterval);
    return () => clearInterval(timer);
  }, [autoSaveInterval]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark', e.matches);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  return (
    <div className="flex flex-col h-screen bg-[#EDEAE0] dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden font-sans">
      {/* Kitaba Title Header */}
      <div className="no-print flex items-center justify-between px-6 py-1.5 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 text-white text-xs select-none shadow-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="font-arabic text-amber-300 text-base font-bold">كتابة</span>
          <span className="font-semibold text-sm">Kitaba</span>
          <span className="opacity-60">•</span>
          <span className="font-normal opacity-90 text-xs">{activeDoc?.title || 'Untitled Document'}</span>
        </div>
      </div>

      {/* Menu Bar (File, Edit, Format, Help) */}
      <div className="no-print">
        <MenuBar />
      </div>

      {/* Toolbar */}
      <div className="no-print">
        <Toolbar />
      </div>

      {/* Harakat Palette (if enabled) */}
      {harakatPaletteOpen && (
        <div className="no-print">
          <HarakatPalette />
        </div>
      )}

      {/* Tab Bar for multi-document */}
      <div className="no-print">
        <TabBar />
      </div>

      {/* Main Content Area (Sidebar + Canvas Editor) */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="no-print h-full flex">
            <Sidebar />
          </div>
        )}

        {/* Editor */}
        <main className="flex-1 overflow-hidden flex flex-col relative">
          <NaskhEditor />
        </main>
      </div>

      {/* Special Characters Docked Bottom Panel */}
      {specialCharactersOpen && (
        <div className="no-print">
          <SpecialCharactersPanel />
        </div>
      )}

      {/* Virtual Keyboard */}
      {virtualKeyboardOpen && (
        <div className="no-print">
          <VirtualKeyboard />
        </div>
      )}

      {/* Status Bar */}
      {statusBarVisible && (
        <div className="no-print">
          <StatusBar />
        </div>
      )}

      {/* Dialogs */}
      <WaqafDialog
        open={activeDialog === 'waqaf'}
        onClose={() => setActiveDialog(null)}
      />
      <AyahNumberDialog
        open={activeDialog === 'ayahNumber'}
        onClose={() => setActiveDialog(null)}
      />
      <FastWordDialog
        open={activeDialog === 'fastWord'}
        onClose={() => setActiveDialog(null)}
      />
      <SettingsDialog
        open={activeDialog === 'settings'}
        onClose={() => setActiveDialog(null)}
      />
      <FindReplaceDialog
        open={activeDialog === 'findReplace'}
        onClose={() => setActiveDialog(null)}
      />
      <ExportDialog
        open={activeDialog === 'export'}
        onClose={() => setActiveDialog(null)}
      />
      <KeyboardShortcutsDialog
        open={activeDialog === 'shortcuts'}
        onClose={() => setActiveDialog(null)}
      />
      <AboutDialog
        open={activeDialog === 'about'}
        onClose={() => setActiveDialog(null)}
      />

      {/* PWA Update Notification Prompt */}
      <PwaUpdatePrompt />

      {/* Agentation Visual Feedback (Development Mode Only) */}
      {import.meta.env.DEV && <Agentation />}
    </div>
  );
}
