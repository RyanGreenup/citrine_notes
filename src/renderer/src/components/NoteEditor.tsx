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

  // Check if we're running in SSR mode (SolidStart)
  const isSSR = () => {
    return typeof window === 'undefined' || window.location.href.includes('solidstart')
  }

  // Callback function that fires when content changes
  // Does nothing if using Server Side Rendering with Solid Start
  const handleContentChange = (newContent: string) => {
    setContent(newContent)

    // Skip saving content if using SSR with SolidStart
    if (!isSSR()) {
      saveContent(newContent)
    }
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
        <button onClick={equalSplit} class={theme.editor.controlButton} title="Equal split">
          <Columns size={16} />
        </button>
        <button
          onClick={toggleMaximized}
          class={theme.editor.controlButton}
          title={isEditorMaximized() ? 'Maximize preview' : 'Maximize editor'}
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
        <button onClick={saveContentButton} class={theme.editor.controlButton} title="Save content">
          <Save size={16} />
        </button>
      </div>
      <Splitter.RootProvider value={splitter} class="flex-grow h-full overflow-hidden rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
        <Splitter.Panel id="editor" class="h-full overflow-hidden">
          <TextEditor initialContent={content()} onContentChange={handleContentChange} />
        </Splitter.Panel>
        <Splitter.ResizeTrigger
          id="editor:preview"
          aria-label="Resize"
          class="flex items-center justify-center w-2 cursor-col-resize hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 ease-in-out"
        >
          <div class="w-[3px] h-16 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-blue-400 dark:hover:bg-blue-500 transition-colors duration-200"></div>
        </Splitter.ResizeTrigger>
        <Splitter.Panel id="preview" class="h-full overflow-auto bg-white dark:bg-gray-800">
          <NotePreview content={content()} />
        </Splitter.Panel>
      </Splitter.RootProvider>
    </div>
  )
}
