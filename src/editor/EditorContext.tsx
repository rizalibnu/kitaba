import { createContext, useContext } from 'react';
import type { Editor } from '@tiptap/react';

export interface EditorContextValue {
  editor: Editor | null;
}

let globalActiveEditor: Editor | null = null;

export const getActiveEditor = (): Editor | null => globalActiveEditor;
export const setActiveEditor = (editor: Editor | null): void => {
  globalActiveEditor = editor;
};

export const EditorContext = createContext<EditorContextValue>({
  editor: null,
});

export function useEditorContext(): EditorContextValue {
  const ctx = useContext(EditorContext);
  return {
    editor: ctx?.editor ?? globalActiveEditor,
  };
}

export const useNaskhEditor = (): Editor | null => {
  const ctx = useContext(EditorContext);
  return ctx?.editor ?? globalActiveEditor;
};
