import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '@/components/common/Dialog';
import { useNaskhEditor } from '@/editor/EditorContext';
import { useUIStore } from '@/stores/uiStore';
import {
  Search,
  Replace,
  ChevronDown,
  ChevronUp,
  CheckCheck,
  CaseSensitive,
  WholeWord,
} from 'lucide-react';

interface FindReplaceDialogProps {
  open?: boolean;
  onClose?: () => void;
}

interface MatchPosition {
  from: number;
  to: number;
}

export function FindReplaceDialog({ open, onClose }: FindReplaceDialogProps) {
  const { t } = useTranslation();
  const editor = useNaskhEditor();
  const activeDialog = useUIStore((s) => s.activeDialog);
  const closeDialog = useUIStore((s) => s.closeDialog);

  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [matches, setMatches] = useState<MatchPosition[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [message, setMessage] = useState<string | null>(null);

  const isOpen = open !== undefined ? open : activeDialog === 'findReplace';
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      closeDialog();
    }
  };

  // Find all matches in the editor document
  const computeMatches = useCallback(() => {
    if (!editor || !searchQuery.trim()) {
      setMatches([]);
      setCurrentIndex(-1);
      return [];
    }

    const doc = editor.state.doc;
    const found: MatchPosition[] = [];
    const escaped = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = wholeWord
      ? `(?<=^|\\s|[.,!?;:،؛؟])${escaped}(?=$|\\s|[.,!?;:،؛؟])`
      : escaped;
    const flags = caseSensitive ? 'g' : 'gi';

    let regex: RegExp;
    try {
      regex = new RegExp(pattern, flags);
    } catch {
      return [];
    }

    doc.descendants((node, pos) => {
      if (node.isText && node.text) {
        let match: RegExpExecArray | null;
        while ((match = regex.exec(node.text)) !== null) {
          found.push({
            from: pos + match.index,
            to: pos + match.index + match[0].length,
          });
          if (match.index === regex.lastIndex) regex.lastIndex++;
        }
      }
    });

    setMatches(found);
    return found;
  }, [editor, searchQuery, caseSensitive, wholeWord]);

  // Recalculate matches when search parameters or dialog opens
  useEffect(() => {
    if (isOpen) {
      const found = computeMatches();
      if (found.length > 0) {
        setCurrentIndex(0);
      } else {
        setCurrentIndex(-1);
      }
      setMessage(null);
    }
  }, [isOpen, searchQuery, caseSensitive, wholeWord, computeMatches]);

  const selectMatch = (index: number, matchPositions: MatchPosition[] = matches) => {
    if (!editor || index < 0 || index >= matchPositions.length) return;
    const match = matchPositions[index];
    editor
      .chain()
      .focus()
      .setTextSelection({ from: match.from, to: match.to })
      .scrollIntoView()
      .run();
    setCurrentIndex(index);
  };

  const handleFindNext = () => {
    const latest = computeMatches();
    if (latest.length === 0) {
      setMessage(t('findReplace.noMatches', 'No matches found'));
      return;
    }
    const nextIdx = currentIndex + 1 >= latest.length ? 0 : currentIndex + 1;
    selectMatch(nextIdx, latest);
  };

  const handleFindPrevious = () => {
    const latest = computeMatches();
    if (latest.length === 0) {
      setMessage(t('findReplace.noMatches', 'No matches found'));
      return;
    }
    const prevIdx = currentIndex - 1 < 0 ? latest.length - 1 : currentIndex - 1;
    selectMatch(prevIdx, latest);
  };

  const handleReplace = () => {
    if (!editor || currentIndex < 0 || currentIndex >= matches.length) {
      handleFindNext();
      return;
    }

    const currentMatch = matches[currentIndex];
    // Replace text at selected position
    editor
      .chain()
      .focus()
      .insertContentAt(
        { from: currentMatch.from, to: currentMatch.to },
        replaceQuery
      )
      .run();

    // Recompute matches after replacement
    setTimeout(() => {
      const updated = computeMatches();
      if (updated.length > 0) {
        const nextIdx = currentIndex >= updated.length ? 0 : currentIndex;
        selectMatch(nextIdx, updated);
      } else {
        setCurrentIndex(-1);
        setMessage(t('findReplace.replacedCount', { count: 1 }));
      }
    }, 20);
  };

  const handleReplaceAll = () => {
    if (!editor || !searchQuery.trim()) return;

    const allMatches = computeMatches();
    if (allMatches.length === 0) {
      setMessage(t('findReplace.noMatches', 'No matches found'));
      return;
    }

    const count = allMatches.length;
    // Dispatch transaction replacing from bottom to top so positions stay valid
    const { tr } = editor.state;
    for (let i = allMatches.length - 1; i >= 0; i--) {
      const { from, to } = allMatches[i];
      if (replaceQuery) {
        tr.replaceWith(from, to, editor.schema.text(replaceQuery));
      } else {
        tr.delete(from, to);
      }
    }
    editor.view.dispatch(tr);

    setMatches([]);
    setCurrentIndex(-1);
    setMessage(t('findReplace.replacedCount', { count }));
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      title={t('findReplace.title', 'Find & Replace')}
      size="md"
    >
      <div className="space-y-4">
        {/* Search Field */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Search size={14} className="text-emerald-600 dark:text-emerald-400" />
              {t('findReplace.find', 'Find')}
            </span>
            {matches.length > 0 && (
              <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
                {t('findReplace.matchCount', {
                  current: currentIndex + 1,
                  total: matches.length,
                })}
              </span>
            )}
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('findReplace.findPlaceholder', 'Search text...')}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              autoFocus
            />
          </div>
        </div>

        {/* Replace Field */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
            <Replace size={14} className="text-emerald-600 dark:text-emerald-400" />
            {t('findReplace.replace', 'Replace with')}
          </label>
          <input
            type="text"
            value={replaceQuery}
            onChange={(e) => setReplaceQuery(e.target.value)}
            placeholder={t('findReplace.replacePlaceholder', 'Replacement text...')}
            className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Options Toggles */}
        <div className="flex items-center gap-4 pt-1">
          <label className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <CaseSensitive size={14} className="text-gray-500" />
            <span>{t('findReplace.matchCase', 'Match Case')}</span>
          </label>
          <label className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={wholeWord}
              onChange={(e) => setWholeWord(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <WholeWord size={14} className="text-gray-500" />
            <span>{t('findReplace.wholeWord', 'Whole Word')}</span>
          </label>
        </div>

        {/* Status / Message bar */}
        {message && (
          <div className="text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-md">
            {message}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <button
            type="button"
            onClick={handleFindPrevious}
            disabled={!searchQuery.trim()}
            className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 rounded-lg transition-colors text-gray-800 dark:text-gray-200"
          >
            <ChevronUp size={14} />
            <span>{t('findReplace.findPrevious', 'Prev')}</span>
          </button>
          <button
            type="button"
            onClick={handleFindNext}
            disabled={!searchQuery.trim()}
            className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 rounded-lg transition-colors text-gray-800 dark:text-gray-200"
          >
            <ChevronDown size={14} />
            <span>{t('findReplace.findNext', 'Next')}</span>
          </button>
          <button
            type="button"
            onClick={handleReplace}
            disabled={!searchQuery.trim()}
            className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 disabled:opacity-40 rounded-lg transition-colors"
          >
            <Replace size={14} />
            <span>{t('findReplace.replaceBtn', 'Replace')}</span>
          </button>
          <button
            type="button"
            onClick={handleReplaceAll}
            disabled={!searchQuery.trim()}
            className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 rounded-lg transition-colors"
          >
            <CheckCheck size={14} />
            <span>{t('findReplace.replaceAll', 'All')}</span>
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default FindReplaceDialog;
