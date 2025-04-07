import { Component, createSignal, onMount, onCleanup } from 'solid-js'
import { theme } from '../theme'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { markdown } from '@codemirror/lang-markdown'

interface TextEditorProps {
  initialContent?: string
  onContentChange?: (content: string) => void
}

export const TextEditor: Component<TextEditorProps> = (props) => {
  const [content, setContent] = createSignal<string>(
    props.initialContent || '# Your note here\n\nStart typing to edit...'
  )
  let editorRef: HTMLDivElement | undefined
  let editorView: EditorView | undefined

  onMount(() => {
    if (!editorRef) return

    const startState = EditorState.create({
      doc: content(),
      extensions: [
        basicSetup,
        markdown(),
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            const newContent = update.state.doc.toString()
            setContent(newContent)
            if (props.onContentChange) {
              props.onContentChange(newContent)
            }
          }
        })
      ]
    })

    editorView = new EditorView({
      state: startState,
      parent: editorRef
    })
  })

  onCleanup(() => {
    editorView?.destroy()
  })

  return (
    <div 
      ref={editorRef} 
      class={`h-full w-full`}
    />
  )
}
