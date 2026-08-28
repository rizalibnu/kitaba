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
        default: '1',
        parseHTML: (element) => {
          const attrVal = element.getAttribute('data-ayah') || element.getAttribute('data-number');
          if (attrVal && attrVal !== 'true' && attrVal !== 'false') {
            return attrVal;
          }
          return element.textContent?.trim() || '1';
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
      {
        tag: 'span.ayah-number',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const rawVal =
      HTMLAttributes.number ??
      HTMLAttributes['data-ayah'] ??
      '1';
    const valStr = String(rawVal === 'true' || rawVal === 'false' ? '1' : rawVal);
    const displayText = valStr.startsWith('﴿') ? valStr : `﴿${valStr}﴾`;

    return [
      'span',
      mergeAttributes(
        { 'data-ayah': valStr, class: 'ayah-number' },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      displayText,
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
