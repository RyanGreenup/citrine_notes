import { Component, createMemo } from 'solid-js'
import { theme } from '../theme'
import { marked } from 'marked'

interface NotePreviewProps {
  content: string
}

export const NotePreview: Component<NotePreviewProps> = (props) => {
  // Memoize the parsed markdown to avoid unnecessary re-rendering
  const parsedMarkdown = createMemo(() => {
    try {
      return marked.parse(props.content || '', { 
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
        class={theme.editor.panel.content}
        innerHTML={parsedMarkdown()}
      />
    </div>
  )
}
