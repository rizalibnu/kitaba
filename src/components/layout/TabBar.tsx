import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Plus,
  X,
  Edit3,
  Copy,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDocumentStore, type Document } from '@/stores/documentStore';

interface ContextMenuState {
  x: number;
  y: number;
  docId: string;
}

export function TabBar() {
  const { t } = useTranslation();

  // Stores
  const documents = useDocumentStore((s) => s.documents);
  const activeDocumentId = useDocumentStore((s) => s.activeDocumentId);
  const setActiveDocument = useDocumentStore((s) => s.setActiveDocument);
  const createDocument = useDocumentStore((s) => s.createDocument);
  const deleteDocument = useDocumentStore((s) => s.deleteDocument);
  const renameDocument = useDocumentStore((s) => s.renameDocument);
  const duplicateDocument = useDocumentStore((s) => s.duplicateDocument);

  // Local state for inline title editing
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const editInputRef = useRef<HTMLInputElement>(null);

  // Local state for right-click context menu
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const tabContainerRef = useRef<HTMLDivElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (editingDocId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingDocId]);

  // Close context menu on outside click or escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setContextMenu(null);
        setEditingDocId(null);
      }
    };

    if (contextMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [contextMenu]);

  const handleStartRename = (doc: Document) => {
    setEditingDocId(doc.id);
    setEditingTitle(doc.title);
    setContextMenu(null);
  };

  const handleFinishRename = (docId: string) => {
    if (editingTitle.trim()) {
      renameDocument(docId, editingTitle.trim());
    }
    setEditingDocId(null);
  };

  const handleTabContextMenu = (e: React.MouseEvent, docId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      docId,
    });
  };

  const handleCloseOthers = (keepDocId: string) => {
    documents.forEach((d) => {
      if (d.id !== keepDocId) {
        deleteDocument(d.id);
      }
    });
    setActiveDocument(keepDocId);
    setContextMenu(null);
  };

  return (
    <div
      role="tablist"
      aria-label="Document Tabs"
      className="h-10 bg-[#E6E2D4] dark:bg-gray-900/90 border-b border-gray-300 dark:border-gray-800 flex items-center pl-4 sm:pl-5 pr-4 sm:pr-6 gap-2 select-none relative z-20"
    >
      {/* Scrollable Tabs Wrapper */}
      <div
        ref={tabContainerRef}
        className="flex items-center gap-1.5 overflow-x-auto scrollbar-none h-full py-1 flex-1 pl-1"
      >
        {documents.map((doc) => {
          const isActive = doc.id === activeDocumentId;
          const isEditing = doc.id === editingDocId;

          return (
            <div
              key={doc.id}
              role="tab"
              aria-selected={isActive}
              tabIndex={0}
              onClick={() => {
                if (!isEditing) {
                  setActiveDocument(doc.id);
                }
              }}
              onDoubleClick={() => handleStartRename(doc)}
              onContextMenu={(e) => handleTabContextMenu(e, doc.id)}
              className={cn(
                'group relative flex items-center gap-2 h-8 px-4 text-xs rounded-t-lg transition-all cursor-pointer border-t border-s border-e shrink-0 max-w-[220px]',
                isActive
                  ? 'bg-[#F3F1E7] dark:bg-[#252533] text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 shadow-xs font-semibold border-b-2 border-b-amber-600 dark:border-b-amber-400'
                  : 'bg-[#DCD8C8]/60 dark:bg-gray-800/40 text-gray-600 dark:text-gray-400 border-transparent hover:bg-[#DCD8C8] dark:hover:bg-gray-800/70 hover:text-gray-900 dark:hover:text-gray-200'
              )}
            >
              {/* Document Icon */}
              <FileText size={13} className="shrink-0 text-gray-400 dark:text-gray-500" />

              {/* Title / Inline Rename Input */}
              {isEditing ? (
                <input
                  ref={editInputRef}
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onBlur={() => handleFinishRename(doc.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleFinishRename(doc.id);
                    if (e.key === 'Escape') setEditingDocId(null);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="h-5 px-1 text-xs bg-white dark:bg-gray-700 border border-primary-500 rounded focus:outline-hidden text-gray-900 dark:text-gray-100 min-w-[80px]"
                />
              ) : (
                <span className="truncate" title={doc.title}>
                  {doc.title}
                </span>
              )}

              {/* Unsaved Changes Indicator */}
              {doc.isDirty && (
                <span
                  title={t('statusBar.unsaved')}
                  className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"
                />
              )}

              {/* Close Tab Button */}
              <button
                type="button"
                title={t('tabs.close')}
                aria-label={`Close ${doc.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteDocument(doc.id);
                }}
                className={cn(
                  'p-0.5 rounded-sm transition-colors text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-300/60 dark:hover:bg-gray-700 shrink-0 opacity-60 group-hover:opacity-100',
                  isActive && 'opacity-90'
                )}
              >
                <X size={12} />
              </button>
            </div>
          );
        })}

        {/* Plus / New Tab Button */}
        <button
          type="button"
          title={t('tabs.newTab')}
          aria-label={t('tabs.newTab')}
          onClick={() => createDocument()}
          className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer shrink-0 focus:outline-hidden"
        >
          <Plus size={15} />
        </button>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl py-1 z-50 min-w-[150px] animate-in fade-in-50 zoom-in-95 duration-100"
        >
          {/* Rename */}
          <button
            type="button"
            onClick={() => {
              const doc = documents.find((d) => d.id === contextMenu.docId);
              if (doc) handleStartRename(doc);
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-950/40 hover:text-primary-600 dark:hover:text-primary-400 text-start cursor-pointer"
          >
            <Edit3 size={13} />
            <span>{t('tabs.rename')}</span>
          </button>

          {/* Duplicate */}
          <button
            type="button"
            onClick={() => {
              duplicateDocument(contextMenu.docId);
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-950/40 hover:text-primary-600 dark:hover:text-primary-400 text-start cursor-pointer"
          >
            <Copy size={13} />
            <span>{t('tabs.duplicate')}</span>
          </button>

          {/* Close Others */}
          {documents.length > 1 && (
            <button
              type="button"
              onClick={() => handleCloseOthers(contextMenu.docId)}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-950/40 hover:text-primary-600 dark:hover:text-primary-400 text-start cursor-pointer"
            >
              <Layers size={13} />
              <span>{t('tabs.closeOthers')}</span>
            </button>
          )}

          <div className="my-1 border-t border-gray-100 dark:border-gray-700" />

          {/* Close */}
          <button
            type="button"
            onClick={() => {
              deleteDocument(contextMenu.docId);
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-start cursor-pointer"
          >
            <X size={13} />
            <span>{t('tabs.close')}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default TabBar;
