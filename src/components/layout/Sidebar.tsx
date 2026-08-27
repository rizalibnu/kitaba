import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Plus,
  Search,
  X,
  MoreVertical,
  Edit3,
  Copy,
  Trash2,
  Clock,
  PanelLeftClose,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/uiStore';
import { useDocumentStore, type Document } from '@/stores/documentStore';

interface ItemContextMenu {
  x: number;
  y: number;
  docId: string;
}

export function Sidebar() {
  const { t } = useTranslation();

  // Stores
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);

  const documents = useDocumentStore((s) => s.documents);
  const activeDocumentId = useDocumentStore((s) => s.activeDocumentId);
  const setActiveDocument = useDocumentStore((s) => s.setActiveDocument);
  const createDocument = useDocumentStore((s) => s.createDocument);
  const deleteDocument = useDocumentStore((s) => s.deleteDocument);
  const renameDocument = useDocumentStore((s) => s.renameDocument);
  const duplicateDocument = useDocumentStore((s) => s.duplicateDocument);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Inline rename state
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const renameInputRef = useRef<HTMLInputElement>(null);

  // More menu state
  const [activeMenuDocId, setActiveMenuDocId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<ItemContextMenu | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Focus rename input
  useEffect(() => {
    if (editingDocId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [editingDocId]);

  // Click outside to close menus
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuDocId(null);
        setContextMenu(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMenuDocId(null);
        setContextMenu(null);
        setEditingDocId(null);
      }
    };

    if (activeMenuDocId || contextMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeMenuDocId, contextMenu]);

  // Filter documents
  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return documents;
    const q = searchQuery.toLowerCase();
    return documents.filter((doc) => doc.title.toLowerCase().includes(q));
  }, [documents, searchQuery]);

  const handleStartRename = (doc: Document) => {
    setEditingDocId(doc.id);
    setEditingTitle(doc.title);
    setActiveMenuDocId(null);
    setContextMenu(null);
  };

  const handleFinishRename = (docId: string) => {
    if (editingTitle.trim()) {
      renameDocument(docId, editingTitle.trim());
    }
    setEditingDocId(null);
  };

  const handleContextMenu = (e: React.MouseEvent, docId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      docId,
    });
    setActiveMenuDocId(null);
  };

  const formatDate = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return '';
    }
  };

  if (!sidebarOpen) return null;

  return (
    <aside
      role="complementary"
      aria-label="Documents Sidebar"
      className="w-64 bg-gray-50 dark:bg-gray-900 border-e border-gray-200 dark:border-gray-800 flex flex-col h-full shrink-0 select-none z-10 transition-all duration-200"
    >
      {/* Header */}
      <div className="h-11 px-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-primary-600 dark:text-primary-400" />
          <h2 className="font-semibold text-xs text-gray-800 dark:text-gray-200">
            {t('sidebar.title')}
          </h2>
          <span className="text-[10px] bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded-full font-medium">
            {documents.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          title={t('sidebar.closeSidebar')}
          aria-label={t('sidebar.closeSidebar')}
          className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition-colors cursor-pointer"
        >
          <PanelLeftClose size={15} />
        </button>
      </div>

      {/* Search Filter */}
      <div className="p-2 border-b border-gray-200 dark:border-gray-800">
        <div className="relative flex items-center">
          <Search size={13} className="absolute start-2.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('sidebar.search')}
            className="w-full h-7 ps-8 pe-6 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-hidden focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute end-2 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Document List */}
      <div
        role="list"
        aria-label="Documents"
        className="flex-1 overflow-y-auto px-2 py-1.5 space-y-1 scrollbar-thin"
      >
        {filteredDocuments.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400 dark:text-gray-500">
            <p>{t('sidebar.noDocuments')}</p>
          </div>
        ) : (
          filteredDocuments.map((doc) => {
            const isActive = doc.id === activeDocumentId;
            const isEditing = doc.id === editingDocId;
            const isMenuOpen = activeMenuDocId === doc.id;

            return (
              <div
                key={doc.id}
                role="listitem"
                onClick={() => {
                  if (!isEditing) {
                    setActiveDocument(doc.id);
                  }
                }}
                onDoubleClick={() => handleStartRename(doc)}
                onContextMenu={(e) => handleContextMenu(e, doc.id)}
                className={cn(
                  'group relative flex items-center justify-between p-2 rounded-md text-xs transition-colors cursor-pointer border',
                  isActive
                    ? 'bg-white dark:bg-gray-800 border-primary-300 dark:border-primary-800 text-gray-900 dark:text-gray-100 shadow-xs'
                    : 'border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-800/60'
                )}
              >
                <div className="flex items-start gap-2 min-w-0 flex-1 me-1">
                  <FileText
                    size={15}
                    className={cn(
                      'shrink-0 mt-0.5',
                      isActive
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600'
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    {isEditing ? (
                      <input
                        ref={renameInputRef}
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onBlur={() => handleFinishRename(doc.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleFinishRename(doc.id);
                          if (e.key === 'Escape') setEditingDocId(null);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full h-5 px-1 text-xs bg-white dark:bg-gray-700 border border-primary-500 rounded focus:outline-hidden text-gray-900 dark:text-gray-100"
                      />
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium truncate block">{doc.title}</span>
                        {doc.isDirty && (
                          <span
                            title={t('statusBar.unsaved')}
                            className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"
                          />
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                      <Clock size={10} />
                      <span>{formatDate(doc.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* More Action Button */}
                <div className="relative shrink-0">
                  <button
                    type="button"
                    title="Options"
                    aria-label="Options"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuDocId(isMenuOpen ? null : doc.id);
                      setContextMenu(null);
                    }}
                    className={cn(
                      'p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors',
                      isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    )}
                  >
                    <MoreVertical size={13} />
                  </button>

                  {/* Dropdown Menu for this doc */}
                  {isMenuOpen && (
                    <div
                      ref={menuRef}
                      className="absolute end-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl py-1 z-50 min-w-[140px] animate-in fade-in-50 zoom-in-95 duration-100"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartRename(doc);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-950/40 hover:text-primary-600 dark:hover:text-primary-400 text-start cursor-pointer"
                      >
                        <Edit3 size={13} />
                        <span>{t('sidebar.rename')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateDocument(doc.id);
                          setActiveMenuDocId(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-950/40 hover:text-primary-600 dark:hover:text-primary-400 text-start cursor-pointer"
                      >
                        <Copy size={13} />
                        <span>{t('sidebar.duplicate')}</span>
                      </button>

                      <div className="my-1 border-t border-gray-100 dark:border-gray-700" />

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDocument(doc.id);
                          setActiveMenuDocId(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-start cursor-pointer"
                      >
                        <Trash2 size={13} />
                        <span>{t('sidebar.delete')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Right-Click Context Menu */}
      {contextMenu && (
        <div
          ref={menuRef}
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl py-1 z-50 min-w-[140px] animate-in fade-in-50 zoom-in-95 duration-100"
        >
          <button
            type="button"
            onClick={() => {
              const doc = documents.find((d) => d.id === contextMenu.docId);
              if (doc) handleStartRename(doc);
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-950/40 hover:text-primary-600 dark:hover:text-primary-400 text-start cursor-pointer"
          >
            <Edit3 size={13} />
            <span>{t('sidebar.rename')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              duplicateDocument(contextMenu.docId);
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-950/40 hover:text-primary-600 dark:hover:text-primary-400 text-start cursor-pointer"
          >
            <Copy size={13} />
            <span>{t('sidebar.duplicate')}</span>
          </button>

          <div className="my-1 border-t border-gray-100 dark:border-gray-700" />

          <button
            type="button"
            onClick={() => {
              deleteDocument(contextMenu.docId);
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-start cursor-pointer"
          >
            <Trash2 size={13} />
            <span>{t('sidebar.delete')}</span>
          </button>
        </div>
      )}

      {/* Bottom Footer: + New Document Button */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={() => createDocument()}
          className="w-full flex items-center justify-center gap-2 h-8 px-3 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-500 rounded-md transition-colors shadow-xs cursor-pointer focus:outline-hidden"
        >
          <Plus size={15} />
          <span>{t('sidebar.newDocument')}</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
