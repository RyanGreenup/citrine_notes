import { Component, createMemo, onMount } from 'solid-js'
import { theme } from '../theme'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import { createStyleTag } from '../utils/styleUtils'

interface NotePreviewProps {
  content: string
}

export const NotePreview: Component<NotePreviewProps> = (props) => {
  // Add custom CSS to make highlight.js backgrounds transparent
  // and improve the splitter styling with Tailwind-compatible classes
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
    `);
  });

  // Create a marked instance with the highlight plugin
  const markedInstance = new Marked(
    markedHighlight({
      langPrefix: 'hljs language-',
      emptyLangClass: 'hljs',
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      }
    })
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
