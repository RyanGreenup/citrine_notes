import { Component } from 'solid-js'
import { theme } from '../theme'

interface NotePreviewProps {
  content: string
}

export const NotePreview: Component<NotePreviewProps> = (props) => {
  return (
    <div class={theme.editor.panel.preview}>
      <div class={theme.editor.panel.content}>
        {props.content}
      </div>
    </div>
  )
}
