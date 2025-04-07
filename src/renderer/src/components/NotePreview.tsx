import { Component, createMemo, onMount } from 'solid-js'
import { theme } from '../theme'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import markedKatex from 'marked-katex-extension'
import markedFootnote from 'marked-footnote'
import markedAlert from 'marked-alert'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import 'katex/dist/katex.min.css'
import { createStyleTag } from '../utils/styleUtils'

interface NotePreviewProps {
  content: string
}

export const NotePreview: Component<NotePreviewProps> = (props) => {
  // Add custom CSS to make highlight.js backgrounds transparent,
  // improve the splitter styling with Tailwind-compatible classes,
  // and apply KaTeX dark mode styling
  onMount(() => {

    createStyleTag(`
      .hljs {
        background: transparent !important;
      }
      pre code.hljs {
        background: transparent !important;
      }
      
      /* Tailwind-compatible splitter styling */
      [data-role="resize-trigger"] {
        @apply relative cursor-col-resize transition-colors duration-200 ease-in-out;
      }
      
      [data-role="resize-trigger"]:hover {
        @apply bg-slate-200 dark:bg-slate-700;
      }
      
      [data-role="resize-trigger"]:active {
        @apply bg-slate-300 dark:bg-slate-600;
      }
      
      [data-role="resize-trigger"] > div {
        @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2;
        @apply w-0.5 h-10 bg-slate-300 dark:bg-slate-600 rounded-full;
        @apply transition-all duration-200 ease-in-out;
      }
      
      [data-role="resize-trigger"]:hover > div {
        @apply h-16 bg-slate-400 dark:bg-slate-500;
      }
      
      [data-role="resize-trigger"]:active > div {
        @apply bg-slate-500 dark:bg-slate-400;
      }
      
      /* Add subtle transition to panels */
      [data-role="panel"] {
        @apply transition-[width] duration-150 ease-out;
      }
      
      /* KaTeX styling adjustments for dark mode */
      .dark .katex {
        color: #e2e8f0;
      }
      
      /* Footnote styling */
      .footnotes {
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid #e2e8f0;
        font-size: 0.875rem;
      }
      
      .dark .footnotes {
        border-top-color: #4b5563;
      }
      
      .footnote-ref {
        font-size: 0.75rem;
        vertical-align: super;
        margin-left: 0.125rem;
      }
      
      .footnote-backref {
        text-decoration: none;
        margin-left: 0.25rem;
      }
      
      /* Alert styling */
      .alert {
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 0.375rem;
        border-left-width: 4px;
      }
      
      .alert-note {
        background-color: #e0f2fe;
        border-left-color: #0ea5e9;
        color: #0c4a6e;
      }
      
      .alert-tip {
        background-color: #dcfce7;
        border-left-color: #22c55e;
        color: #166534;
      }
      
      .alert-important {
        background-color: #fef3c7;
        border-left-color: #f59e0b;
        color: #78350f;
      }
      
      .alert-warning {
        background-color: #fee2e2;
        border-left-color: #ef4444;
        color: #7f1d1d;
      }
      
      .alert-caution {
        background-color: #fce7f3;
        border-left-color: #ec4899;
        color: #831843;
      }
      
      /* Dark mode alert styling */
      .dark .alert-note {
        background-color: rgba(14, 165, 233, 0.15);
        border-left-color: #0ea5e9;
        color: #e0f2fe;
      }
      
      .dark .alert-tip {
        background-color: rgba(34, 197, 94, 0.15);
        border-left-color: #22c55e;
        color: #dcfce7;
      }
      
      .dark .alert-important {
        background-color: rgba(245, 158, 11, 0.15);
        border-left-color: #f59e0b;
        color: #fef3c7;
      }
      
      .dark .alert-warning {
        background-color: rgba(239, 68, 68, 0.15);
        border-left-color: #ef4444;
        color: #fee2e2;
      }
      
      .dark .alert-caution {
        background-color: rgba(236, 72, 153, 0.15);
        border-left-color: #ec4899;
        color: #fce7f3;
      }
    `);
  });

  // Create a marked instance with the highlight plugin, KaTeX extension, footnotes, and alerts
  const markedInstance = new Marked(
    markedHighlight({
      langPrefix: 'hljs language-',
      emptyLangClass: 'hljs',
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      }
    }),
    markedKatex({
      throwOnError: false,
      output: 'html',
      nonStandard: true // Allow KaTeX without spaces around delimiters
    }),
    markedFootnote(),
    markedAlert()
  );

  // Memoize the parsed markdown to avoid unnecessary re-rendering
  const parsedMarkdown = createMemo(() => {
    try {
      return markedInstance.parse(props.content || '', { 
        gfm: true, // GitHub Flavored Markdown
        breaks: true // Convert line breaks to <br>
      });
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return '<p>Error rendering markdown</p>';
    }
  });

  return (
    <div class={theme.editor.panel.preview}>
      <div 
        class={`${theme.editor.panel.content} prose prose-sm dark:prose-invert max-w-none p-6 md:p-8`}
        innerHTML={parsedMarkdown()}
      />
    </div>
  )
}
