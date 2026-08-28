import type { Editor } from '@tiptap/react';
import { parseKhtContent } from './khtParser';
import { useDocumentStore } from '@/stores/documentStore';

/**
 * Triggers a file picker to import .kht, .rtf, .txt, or .html documents into Kitaba.
 */
export async function triggerKhtImport(editor?: Editor | null): Promise<boolean> {
  return new Promise((resolve) => {
    // If Native File System Access API is available, try opening with OS picker
    if (typeof window !== 'undefined' && 'showOpenFilePicker' in window) {
      (async () => {
        try {
          const [fileHandle] = await (window as unknown as {
            showOpenFilePicker: (opts: {
              types: Array<{ description: string; accept: Record<string, string[]> }>;
              multiple: boolean;
            }) => Promise<FileSystemFileHandle[]>;
          }).showOpenFilePicker({
            types: [
              {
                description: 'Dokumen Khot & Teks (.kht, .rtf, .txt, .html)',
                accept: {
                  'text/plain': ['.kht', '.rtf', '.txt', '.html', '.htm'],
                  'application/rtf': ['.kht', '.rtf'],
                },
              },
            ],
            multiple: false,
          });

          if (!fileHandle) {
            resolve(false);
            return;
          }

          const file = await fileHandle.getFile();
          const content = await file.text();
          processImportedContent(content, file.name, editor);
          resolve(true);
          return;
        } catch (err: unknown) {
          if ((err as Error)?.name === 'AbortError') {
            resolve(false);
            return;
          }
          // Fallback to standard input element
        }
      })();
    }

    // Standard HTML5 input file fallback
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.kht,.rtf,.txt,.html,.htm';

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) {
        resolve(false);
        return;
      }

      try {
        const content = await file.text();
        processImportedContent(content, file.name, editor);
        resolve(true);
      } catch (err) {
        console.error('Failed to read file:', err);
        alert('Gagal membaca file: ' + (err as Error)?.message);
        resolve(false);
      }
    };

    input.click();
  });
}

/**
 * Parses and loads the imported file into the document store & Tiptap editor
 */
export function processImportedContent(
  rawContent: string,
  filename: string,
  editor?: Editor | null
): void {
  const parsed = parseKhtContent(rawContent, filename);
  const docStore = useDocumentStore.getState();

  // Create a new document in the store with the imported title
  const newDoc = docStore.createDocument(parsed.title);

  // If editor is available, update content immediately
  if (editor) {
    setTimeout(() => {
      editor.commands.setContent(parsed.html);
      docStore.updateDocumentContent(newDoc.id, editor.getJSON());
      docStore.markDocumentSaved(newDoc.id);
    }, 50);
  }
}
