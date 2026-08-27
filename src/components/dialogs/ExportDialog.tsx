import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '@/components/common/Dialog';
import { useNaskhEditor } from '@/editor/EditorContext';
import { useUIStore } from '@/stores/uiStore';
import { useDocumentStore } from '@/stores/documentStore';
import {
  exportPDF,
  exportHTML,
  exportImage,
  exportRTF,
  exportPlainText,
} from '@/lib/export';
import {
  FileType,
  FileCode,
  Image as ImageIcon,
  FileText,
  Download,
  Loader2,
  FileSpreadsheet,
} from 'lucide-react';
import type { ExportFormat } from '@/types';

interface ExportDialogProps {
  open?: boolean;
  onClose?: () => void;
}

interface FormatOption {
  id: ExportFormat;
  labelKey: string;
  descKey: string;
  extension: string;
  icon: typeof FileType;
  color: string;
}

const FORMAT_OPTIONS: FormatOption[] = [
  {
    id: 'pdf',
    labelKey: 'export.pdf',
    descKey: 'export.pdfDesc',
    extension: '.pdf',
    icon: FileType,
    color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40',
  },
  {
    id: 'html',
    labelKey: 'export.html',
    descKey: 'export.htmlDesc',
    extension: '.html',
    icon: FileCode,
    color: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40',
  },
  {
    id: 'png',
    labelKey: 'export.png',
    descKey: 'export.pngDesc',
    extension: '.png',
    icon: ImageIcon,
    color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40',
  },
  {
    id: 'jpg',
    labelKey: 'export.jpg',
    descKey: 'export.jpgDesc',
    extension: '.jpg',
    icon: ImageIcon,
    color: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40',
  },
  {
    id: 'rtf',
    labelKey: 'export.rtf',
    descKey: 'export.rtfDesc',
    extension: '.rtf',
    icon: FileSpreadsheet,
    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
  },
  {
    id: 'text',
    labelKey: 'export.plainText',
    descKey: 'export.plainTextDesc',
    extension: '.txt',
    icon: FileText,
    color: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/60',
  },
];

export function ExportDialog({ open, onClose }: ExportDialogProps) {
  const { t } = useTranslation();
  const editor = useNaskhEditor();
  const activeDialog = useUIStore((s) => s.activeDialog);
  const closeDialog = useUIStore((s) => s.closeDialog);
  const activeDoc = useDocumentStore((s) => s.getActiveDocument());

  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [filename, setFilename] = useState<string>(activeDoc?.title || 'naskh_document');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isOpen = open !== undefined ? open : activeDialog === 'export';
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      closeDialog();
    }
  };

  const handleExport = async () => {
    if (!editor) {
      setErrorMessage('Editor not ready');
      return;
    }

    const safeName = filename.trim() || 'document';
    setIsExporting(true);
    setErrorMessage(null);

    try {
      switch (selectedFormat) {
        case 'pdf':
          await exportPDF(editor, safeName);
          break;
        case 'html':
          await exportHTML(editor, safeName);
          break;
        case 'png':
          await exportImage(editor, safeName, 'png');
          break;
        case 'jpg':
          await exportImage(editor, safeName, 'jpg');
          break;
        case 'rtf':
          exportRTF(editor, safeName);
          break;
        case 'text':
          exportPlainText(editor, safeName);
          break;
      }
      handleClose();
    } catch (err) {
      console.error('Export failed:', err);
      setErrorMessage('Failed to export document. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      title={t('export.title', 'Export Document')}
      size="lg"
    >
      <div className="space-y-5">
        {/* Filename Input */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            {t('export.filename', 'File Name')}
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="document"
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none pr-16"
            />
            <span className="absolute right-3 text-xs font-mono text-gray-400">
              {FORMAT_OPTIONS.find((f) => f.id === selectedFormat)?.extension}
            </span>
          </div>
        </div>

        {/* Format Selection Cards */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {t('export.format', 'Export Format')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[42vh] overflow-y-auto pr-1">
            {FORMAT_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedFormat === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedFormat(option.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 ring-1 ring-emerald-500/50'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${option.color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                        {t(option.labelKey, option.id.toUpperCase())}
                      </div>
                      <span className="text-[10px] font-mono font-medium text-gray-400">
                        {option.extension}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">
                      {t(option.descKey, '')}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-2.5 text-xs text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button
            type="button"
            onClick={handleClose}
            disabled={isExporting}
            className="px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {t('export.cancel', 'Cancel')}
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 rounded-lg shadow-xs transition-colors"
          >
            {isExporting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>{t('export.exporting', 'Exporting...')}</span>
              </>
            ) : (
              <>
                <Download size={14} />
                <span>{t('export.exportBtn', 'Export')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default ExportDialog;
