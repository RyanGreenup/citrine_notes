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
  onMount(() => {
    createStyleTag(`
      .hljs {
        background: transparent !important;
      }
      pre code.hljs {
        background: transparent !important;
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
        class={`${theme.editor.panel.content} prose prose-sm dark:prose-invert max-w-none`}
        innerHTML={parsedMarkdown()}
      />
    </div>
  )
}
