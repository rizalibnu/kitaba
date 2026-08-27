import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { JSONContent } from '@tiptap/core';
import { idbStorage } from './idbStorage';

export interface Document {
  id: string;
  title: string;
  content: JSONContent | null; // Tiptap JSON
  createdAt: number;
  updatedAt: number;
  isDirty: boolean;
}

export interface DocumentState {
  documents: Document[];
  activeDocumentId: string | null;

  // Getters
  getActiveDocument: () => Document | null;

  // Actions
  createDocument: (title?: string, content?: JSONContent | null) => Document;
  deleteDocument: (id: string) => void;
  updateDocumentContent: (id: string, content: JSONContent | null) => void;
  renameDocument: (id: string, title: string) => void;
  setActiveDocument: (id: string | null) => void;
  reorderDocuments: (fromIndex: number, toIndex: number) => void;
  setDocumentDirty: (id: string, isDirty: boolean) => void;
  markDocumentSaved: (id: string) => void;
  duplicateDocument: (id: string) => Document | null;
  clearAllDocuments: () => void;
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `doc_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function createDefaultDocument(title: string = 'Dokumen Baru 1'): Document {
  const now = Date.now();
  return {
    id: generateId(),
    title,
    content: null,
    createdAt: now,
    updatedAt: now,
    isDirty: false,
  };
}

const defaultInitialDoc = createDefaultDocument();

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set, get) => ({
      documents: [defaultInitialDoc],
      activeDocumentId: defaultInitialDoc.id,

      getActiveDocument: () => {
        const { documents, activeDocumentId } = get();
        if (!activeDocumentId) return null;
        return documents.find((doc) => doc.id === activeDocumentId) ?? null;
      },

      createDocument: (title?: string, content: JSONContent | null = null) => {
        const { documents } = get();
        const docCount = documents.length + 1;
        const newTitle = title?.trim() || `Dokumen Baru ${docCount}`;
        const newDoc: Document = {
          id: generateId(),
          title: newTitle,
          content,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          isDirty: false,
        };

        set((state) => ({
          documents: [...state.documents, newDoc],
          activeDocumentId: newDoc.id,
        }));

        return newDoc;
      },

      deleteDocument: (id: string) => {
        const { documents, activeDocumentId } = get();
        const targetIndex = documents.findIndex((doc) => doc.id === id);
        if (targetIndex === -1) return;

        const remainingDocs = documents.filter((doc) => doc.id !== id);

        if (remainingDocs.length === 0) {
          const freshDoc = createDefaultDocument();
          set({
            documents: [freshDoc],
            activeDocumentId: freshDoc.id,
          });
          return;
        }

        let nextActiveId = activeDocumentId;
        if (activeDocumentId === id) {
          const nextIndex = Math.min(targetIndex, remainingDocs.length - 1);
          nextActiveId = remainingDocs[nextIndex]?.id ?? null;
        }

        set({
          documents: remainingDocs,
          activeDocumentId: nextActiveId,
        });
      },

      updateDocumentContent: (id: string, content: JSONContent | null) => {
        const now = Date.now();
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id
              ? {
                  ...doc,
                  content,
                  updatedAt: now,
                  isDirty: true,
                }
              : doc
          ),
        }));
      },

      renameDocument: (id: string, title: string) => {
        const trimmed = title.trim();
        if (!trimmed) return;
        const now = Date.now();
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id
              ? {
                  ...doc,
                  title: trimmed,
                  updatedAt: now,
                }
              : doc
          ),
        }));
      },

      setActiveDocument: (id: string | null) => {
        set({ activeDocumentId: id });
      },

      reorderDocuments: (fromIndex: number, toIndex: number) => {
        set((state) => {
          if (
            fromIndex < 0 ||
            fromIndex >= state.documents.length ||
            toIndex < 0 ||
            toIndex >= state.documents.length ||
            fromIndex === toIndex
          ) {
            return state;
          }

          const reordered = [...state.documents];
          const [movedDoc] = reordered.splice(fromIndex, 1);
          reordered.splice(toIndex, 0, movedDoc);

          return { documents: reordered };
        });
      },

      setDocumentDirty: (id: string, isDirty: boolean) => {
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id ? { ...doc, isDirty } : doc
          ),
        }));
      },

      markDocumentSaved: (id: string) => {
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id ? { ...doc, isDirty: false } : doc
          ),
        }));
      },

      duplicateDocument: (id: string) => {
        const { documents } = get();
        const original = documents.find((doc) => doc.id === id);
        if (!original) return null;

        const now = Date.now();
        const duplicated: Document = {
          id: generateId(),
          title: `${original.title} (Salinan)`,
          content: original.content ? JSON.parse(JSON.stringify(original.content)) : null,
          createdAt: now,
          updatedAt: now,
          isDirty: true,
        };

        const originalIndex = documents.findIndex((doc) => doc.id === id);
        const updatedDocs = [...documents];
        updatedDocs.splice(originalIndex + 1, 0, duplicated);

        set({
          documents: updatedDocs,
          activeDocumentId: duplicated.id,
        });

        return duplicated;
      },

      clearAllDocuments: () => {
        const freshDoc = createDefaultDocument();
        set({
          documents: [freshDoc],
          activeDocumentId: freshDoc.id,
        });
      },
    }),
    {
      name: 'naskh_documents_storage',
      storage: createJSONStorage(() => idbStorage),
      version: 1,
    }
  )
);

export default useDocumentStore;
