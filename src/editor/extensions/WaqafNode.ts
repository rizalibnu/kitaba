import { Node, mergeAttributes } from '@tiptap/core';

export interface WaqafOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    waqafSign: {
      insertWaqaf: (sign: string, label?: string) => ReturnType;
    };
  }
}

export const WaqafNode = Node.create<WaqafOptions>({
  name: 'waqafSign',
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
      sign: {
        default: '',
        parseHTML: (element) => {
          const attrVal = element.getAttribute('data-sign') || element.getAttribute('data-waqaf');
          if (attrVal && attrVal !== 'true' && attrVal !== 'false') {
            return attrVal;
          }
          return element.textContent?.trim() || '';
        },
        renderHTML: (attributes) => ({
          'data-waqaf': attributes.sign,
          'data-sign': attributes.sign,
        }),
      },
      label: {
        default: '',
        parseHTML: (element) =>
          element.getAttribute('title') || element.getAttribute('data-label') || '',
        renderHTML: (attributes) => {
          if (!attributes.label) {
            return {};
          }
          return {
            'data-label': attributes.label,
            title: attributes.label,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-waqaf]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const sign = HTMLAttributes['data-sign'] ?? HTMLAttributes.sign ?? '';
    return [
      'span',
      mergeAttributes(
        { 'data-waqaf': '', class: 'waqaf-sign' },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      String(sign),
    ];
  },

  addCommands() {
    return {
      insertWaqaf:
        (sign: string, label: string = '') =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { sign, label },
          });
        },
    };
  },
});

export default WaqafNode;
