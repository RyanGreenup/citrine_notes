import { Splitter, useSplitter } from '@ark-ui/solid/splitter'
import { Component, createSignal, createEffect } from 'solid-js'
import { theme } from '../theme'
import { Maximize2, AlignCenter, Columns, Terminal, Save } from 'lucide-solid'
import { TextEditor } from './TextEditor'
import { NotePreview } from './NotePreview'

export const NoteEditor: Component = () => {
  const [content, setContent] = createSignal<string>('# Your note here\n\nStart typing to edit...')
  const [isEditorMaximized, setIsEditorMaximized] = createSignal(false)
  const [isVimEnabled, setIsVimEnabled] = createSignal(false)

  // Function to save content
  const saveContent = (contentToSave: string) => {
    console.log('Saving content:', contentToSave)
  }

  // Callback function that fires when content changes
  // NOTE when implementing with SolidStart this will need a save button
  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    saveContent(newContent)
  }
  const splitter = useSplitter({
    defaultSize: [50, 50],
    panels: [{ id: 'editor' }, { id: 'preview' }]
  })

  const toggleMaximized = () => {
    if (isEditorMaximized()) {
      // Switch to preview maximized
      splitter().setSizes([0, 100])
    } else {
      // Switch to editor maximized
      splitter().setSizes([100, 0])
    }
    setIsEditorMaximized(!isEditorMaximized())
  }

  const equalSplit = () => {
    splitter().setSizes([50, 50])
    setIsEditorMaximized(false)
  }

  const toggleVim = () => {
    // Access the editor controls exposed on the window object
    if (typeof window !== 'undefined' && window.editorControls) {
      window.editorControls.toggleVim()
      setIsVimEnabled(window.editorControls.isVimEnabled())
    }
  }

  const saveContentButton = () => {
    // Manually trigger the save function with current content
    saveContent(content())
  }

  // When the splitter changes, we may need to refresh the editor
  createEffect(() => {
    // This will re-run when splitter state changes
    const sizes = splitter().getSizes()
    if (sizes[0] > 0) {
      // Force a layout recalculation for CodeMirror
      window.dispatchEvent(new Event('resize'))
    }
  })

  return (
    <div class={`${theme.editor.container} h-full`}>
      <div class={theme.editor.controls}>
        <button
          onClick={equalSplit}
          class={theme.editor.controlButton}
          title="Equal split"
        >
          <Columns size={16} />
        </button>
        <button
          onClick={toggleMaximized}
          class={theme.editor.controlButton}
          title={isEditorMaximized() ? "Maximize preview" : "Maximize editor"}
        >
          {isEditorMaximized() ? <AlignCenter size={16} /> : <Maximize2 size={16} />}
        </button>
        <button
          onClick={toggleVim}
          class={`${theme.editor.controlButton} ${isVimEnabled() ? theme.editor.controlButtonActive : ''}`}
          title="Toggle Vim mode"
        >
          <Terminal size={16} />
        </button>
        <button
          onClick={saveContentButton}
          class={theme.editor.controlButton}
          title="Save content"
        >
          <Save size={16} />
        </button>
      </div>
      <Splitter.RootProvider value={splitter} class="flex-grow h-full">
        <Splitter.Panel id="editor" class={theme.editor.panel.base}>
          <TextEditor
            initialContent={content()}
            onContentChange={handleContentChange}
          />
        </Splitter.Panel>
        <Splitter.ResizeTrigger
          id="editor:preview"
          aria-label="Resize"
          class={theme.editor.resizeTrigger.base}
        >
          <div class={theme.editor.resizeTrigger.handle}></div>
        </Splitter.ResizeTrigger>
        <Splitter.Panel id="preview" class={theme.editor.panel.base}>
          <NotePreview content={content()} />
        </Splitter.Panel>
      </Splitter.RootProvider>
    </div>
  )
}
