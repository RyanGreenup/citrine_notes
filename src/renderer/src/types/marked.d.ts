declare module 'marked' {
  export interface MarkedOptions {
    gfm?: boolean;
    breaks?: boolean;
    pedantic?: boolean;
    sanitize?: boolean;
    smartLists?: boolean;
    smartypants?: boolean;
    xhtml?: boolean;
    renderer?: any;
    headerIds?: boolean;
    mangle?: boolean;
    highlight?: (code: string, lang: string) => string;
  }

  export function parse(src: string, options?: MarkedOptions): string;
  export function parseInline(src: string, options?: MarkedOptions): string;
  
  export const marked: {
    parse: typeof parse;
    parseInline: typeof parseInline;
    setOptions: (options: MarkedOptions) => void;
  };
}
