import { Component, createSignal } from 'solid-js'
import { theme } from '../theme'

interface TextEditorProps {
  initialContent?: string
  onContentChange?: (content: string) => void
}

export const TextEditor: Component<TextEditorProps> = (props) => {
  const [content, setContent] = createSignal<string>(
    props.initialContent || '# Your note here\n\nStart typing to edit...'
  )

  const handleInput = (e: Event) => {
    const value = (e.target as HTMLTextAreaElement).value
    setContent(value)
    if (props.onContentChange) {
      props.onContentChange(value)
    }
  }

  return (
    <textarea
      class={theme.editor.panel.textarea}
      value={content()}
      onInput={handleInput}
      placeholder="Start typing..."
    />
  )
}
