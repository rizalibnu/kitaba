import { Node, mergeAttributes } from '@tiptap/core';

export interface AyahOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    ayahNumber: {
      insertAyahNumber: (number: number | string) => ReturnType;
    };
  }
}

export const AyahNode = Node.create<AyahOptions>({
  name: 'ayahNumber',
  group: 'inline',
  inline: true,
  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      number: {
        default: 1,
        parseHTML: (element) => {
          const val =
            element.getAttribute('data-ayah') ||
            element.getAttribute('data-number') ||
            element.textContent ||
            '1';
          return val;
        },
        renderHTML: (attributes) => ({
          'data-ayah': attributes.number,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-ayah]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const num =
      HTMLAttributes['data-ayah'] ??
      HTMLAttributes.number ??
      HTMLAttributes.ayahNumber ??
      '1';
    return [
      'span',
      mergeAttributes(
        { 'data-ayah': String(num), class: 'ayah-number' },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      String(num),
    ];
  },

  addCommands() {
    return {
      insertAyahNumber:
        (number: number | string) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { number },
          });
        },
    };
  },
});

export default AyahNode;
