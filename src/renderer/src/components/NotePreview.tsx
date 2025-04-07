import { Component, createMemo, onMount } from 'solid-js'
import { theme } from '../theme'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import markedKatex from 'marked-katex-extension'
import markedFootnote from 'marked-footnote'
import markedAlert from 'marked-alert'
import { createDirectives } from 'marked-directive'
import markedExtendedTables from 'marked-extended-tables'
import markedCodePreview from 'marked-code-preview'
import markedLinkifyIt from 'marked-linkify-it'
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
      
      /* GitHub-style Alert styling */
      .markdown-alert {
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 0.375rem;
        border-left-width: 4px;
        position: relative;
      }
      
      .markdown-alert-title {
        font-weight: 600;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
      }
      
      /* Octicon placeholders - will be replaced by actual icons */
      .octicon {
        display: inline-block;
        width: 16px;
        height: 16px;
      }
      
      .mr-2 {
        margin-right: 0.5rem;
      }
      
      /* Note alert (blue) */
      .markdown-alert-note {
        background-color: #e0f2fe;
        border-left-color: #0ea5e9;
        color: #0c4a6e;
      }
      
      .markdown-alert-note .octicon-info::before {
        content: "ℹ️";
      }
      
      /* Tip alert (green) */
      .markdown-alert-tip {
        background-color: #dcfce7;
        border-left-color: #22c55e;
        color: #166534;
      }
      
      .markdown-alert-tip .octicon-light-bulb::before {
        content: "💡";
      }
      
      /* Important alert (yellow) */
      .markdown-alert-important {
        background-color: #fef3c7;
        border-left-color: #f59e0b;
        color: #78350f;
      }
      
      .markdown-alert-important .octicon-report::before {
        content: "📢";
      }
      
      /* Warning alert (red) */
      .markdown-alert-warning {
        background-color: #fee2e2;
        border-left-color: #ef4444;
        color: #7f1d1d;
      }
      
      .markdown-alert-warning .octicon-alert::before {
        content: "⚠️";
      }
      
      /* Caution alert (pink) */
      .markdown-alert-caution {
        background-color: #fce7f3;
        border-left-color: #ec4899;
        color: #831843;
      }
      
      .markdown-alert-caution .octicon-stop::before {
        content: "🛑";
      }
      
      /* Dark mode alert styling */
      .dark .markdown-alert-note {
        background-color: rgba(14, 165, 233, 0.15);
        border-left-color: #0ea5e9;
        color: #e0f2fe;
      }
      
      .dark .markdown-alert-tip {
        background-color: rgba(34, 197, 94, 0.15);
        border-left-color: #22c55e;
        color: #dcfce7;
      }
      
      .dark .markdown-alert-important {
        background-color: rgba(245, 158, 11, 0.15);
        border-left-color: #f59e0b;
        color: #fef3c7;
      }
      
      .dark .markdown-alert-warning {
        background-color: rgba(239, 68, 68, 0.15);
        border-left-color: #ef4444;
        color: #fee2e2;
      }
      
      .dark .markdown-alert-caution {
        background-color: rgba(236, 72, 153, 0.15);
        border-left-color: #ec4899;
        color: #fce7f3;
      }
      
      /* Directive styling */
      .directive {
        margin: 1rem 0;
      }
      
      .directive-label {
        font-weight: 600;
        margin-bottom: 0.25rem;
      }
      
      /* Custom directive styles */
      .directive-mermaid {
        background-color: #f8fafc;
        padding: 1rem;
        border-radius: 0.375rem;
        border: 1px solid #e2e8f0;
      }
      
      .dark .directive-mermaid {
        background-color: #1e293b;
        border-color: #334155;
      }
      
      /* Code preview styles */
      .code-preview {
        margin: 1.5rem 0;
        border: 1px solid #e2e8f0;
        border-radius: 0.375rem;
        overflow: hidden;
      }
      
      .dark .code-preview {
        border-color: #334155;
      }
      
      .code-preview .preview-container {
        padding: 1rem;
        background-color: #ffffff;
        border-bottom: 1px solid #e2e8f0;
      }
      
      .dark .code-preview .preview-container {
        background-color: #1e293b;
        border-color: #334155;
      }
      
      .code-preview figcaption {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        font-weight: 500;
        background-color: #f8fafc;
        color: #475569;
      }
      
      .dark .code-preview figcaption {
        background-color: #0f172a;
        color: #94a3b8;
      }
      
      .directive-tabs {
        border: 1px solid #e2e8f0;
        border-radius: 0.375rem;
        overflow: hidden;
      }
      
      .dark .directive-tabs {
        border-color: #334155;
      }
      
      .directive-tab-labels {
        display: flex;
        background-color: #f1f5f9;
        border-bottom: 1px solid #e2e8f0;
      }
      
      .dark .directive-tab-labels {
        background-color: #1e293b;
        border-color: #334155;
      }
      
      .directive-tab-label {
        padding: 0.5rem 1rem;
        cursor: pointer;
        border-right: 1px solid #e2e8f0;
      }
      
      .dark .directive-tab-label {
        border-color: #334155;
      }
      
      .directive-tab-label.active {
        background-color: #ffffff;
        font-weight: 600;
      }
      
      .dark .directive-tab-label.active {
        background-color: #0f172a;
      }
      
      .directive-tab-content {
        padding: 1rem;
      }
    `);
  });

  // Custom template for code previews
  const customTemplate = `
  <figure class="code-preview">
    <div class="preview-container">
      {preview}
    </div>
    <figcaption>{title}</figcaption>
  </figure>
  `;

  // Create a marked instance with the highlight plugin, KaTeX extension, footnotes, alerts, directives, extended tables, code preview, and linkify-it
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
    markedAlert(),
    createDirectives(),
    markedExtendedTables(),
    markedCodePreview({ template: customTemplate }),
    markedLinkifyIt() // Auto-link URLs in plain text
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
