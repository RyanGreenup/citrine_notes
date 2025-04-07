import { Splitter, useSplitter } from '@ark-ui/solid/splitter'
import { Component, createSignal, createEffect } from 'solid-js'
import { theme } from '../theme'
import { Maximize2, AlignCenter, Columns } from 'lucide-solid'
import { TextEditor } from './TextEditor'

export const NoteEditor: Component = () => {
  const [content, setContent] = createSignal<string>('# Your note here\n\nStart typing to edit...')
  const [isEditorMaximized, setIsEditorMaximized] = createSignal(false)
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
      </div>
      <Splitter.RootProvider value={splitter} class="flex-grow h-full">
        <Splitter.Panel id="editor" class={theme.editor.panel.base}>
          <TextEditor 
            initialContent={content()} 
            onContentChange={(newContent) => setContent(newContent)} 
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
          <div class={theme.editor.panel.preview}>
            <div class={theme.editor.panel.content}>
              {content()}
            </div>
          </div>
        </Splitter.Panel>
      </Splitter.RootProvider>
    </div>
  )
}
