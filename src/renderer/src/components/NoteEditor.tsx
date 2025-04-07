import { Splitter, useSplitter } from '@ark-ui/solid/splitter'
import { Component, createSignal, createEffect, Show } from 'solid-js'
import { theme, animations } from '../theme'
import { Maximize2, AlignCenter, Columns, Terminal, Save } from 'lucide-solid'
import { TextEditor } from './TextEditor'
import { NotePreview } from './NotePreview'
import { getCurrentNoteId, onNoteChange } from '../utils/viewUtils'

export const NoteEditor: Component = () => {
  const [content, setContent] = createSignal<string>('')
  const [isEditorMaximized, setIsEditorMaximized] = createSignal(false)
  const [isVimEnabled, setIsVimEnabled] = createSignal(false)
  const [loading, setLoading] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)
  const [currentNote, setCurrentNote] = createSignal<{ id: string; title: string } | null>(null)

  // Load note content when the current note ID changes
  onNoteChange(async (noteId) => {
    if (!noteId) return

    try {
      setLoading(true)
      setError(null)

      // Make sure the API is available
      if (!window.api || !window.api.database) {
        setError('Database API not available')
        return
      }

      const noteBody = await window.api.database.getNoteBodyById(noteId)
      if (noteBody) {
        setContent(noteBody)

        // Get the full note to display title
        const fullNote = await window.api.database.getNoteById(noteId)
        if (fullNote) {
          setCurrentNote({ id: fullNote.id, title: fullNote.title })
        }
      } else {
        setError(`Could not load note content for ID: ${noteId}`)
      }
    } catch (err) {
      console.error('Error loading note content:', err)
      setError(`Failed to load note: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  })

  // Function to save content
  const saveContent = async (contentToSave: string) => {
    const noteId = getCurrentNoteId()
    if (!noteId || !currentNote()) {
      console.warn('Cannot save: No note is currently selected')
      return
    }

    try {
      // Make sure the API is available
      if (!window.api || !window.api.database) {
        console.error('Database API not available')
        return
      }

      // Use updateNoteBody instead of updateNote since we're only changing the content
      const result = await window.api.database.updateNoteBody(
        noteId,
        contentToSave
      )

      if (result) {
        console.log('Note content saved successfully:', result.id)
      } else {
        console.error('Failed to save note content')
      }
    } catch (err) {
      console.error('Error saving note content:', err)
    }
  }

  // Check if we're running in SSR mode (SolidStart)
  const isSSR = () => {
    return typeof window === 'undefined' || window.location.href.includes('solidstart')
  }

  // Callback function that fires when content changes
  // Does nothing if using Server Side Rendering with Solid Start
  const handleContentChange = (newContent: string) => {
    setContent(newContent)
  }

  // Effect to handle saving content with debounce
  createEffect(() => {
    const currentContent = content();
    
    // Skip saving content if using SSR with SolidStart
    if (!isSSR() && currentContent) {
      // Use debounce to avoid saving on every keystroke
      if (window.saveTimeout) {
        clearTimeout(window.saveTimeout)
      }

      window.saveTimeout = setTimeout(() => {
        saveContent(currentContent)
      }, 1000) // Save after 1 second of inactivity
    }
  });
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

      <Show when={loading()}>
        <div class="flex items-center justify-center h-full">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </Show>

      <Show when={error()}>
        <div class="p-4 m-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md">
          <p>{error()}</p>
        </div>
      </Show>

      <Show when={!loading() && !error()}>
        <div class={`${theme.editor.header.container} ${theme.border.light} ${theme.border.dark}`}>
          <div class="flex items-center">
            <Show when={currentNote()}>
              <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {currentNote()?.title}
              </h2>
            </Show>
          </div>
          <div class="flex items-center gap-1">
            <div class={theme.editor.header.buttonGroup}>
              <button 
                onClick={equalSplit} 
                class={`${theme.editor.header.button} text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 ${animations.transition.fast}`} 
                title="Equal split"
              >
                <Columns size={18} />
              </button>
              <button
                onClick={toggleMaximized}
                class={`${theme.editor.header.button} text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 ${animations.transition.fast}`}
                title={isEditorMaximized() ? 'Maximize preview' : 'Maximize editor'}
              >
                {isEditorMaximized() ? <AlignCenter size={18} /> : <Maximize2 size={18} />}
              </button>
            </div>
            
            <div class={`${theme.editor.header.buttonGroup} ${theme.editor.header.buttonGroupSpacing}`}>
              <button
                onClick={toggleVim}
                class={`${theme.editor.header.button} ${isVimEnabled() ? 'bg-blue-500 text-white dark:bg-blue-600 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'} ${animations.transition.fast}`}
                title="Toggle Vim mode"
              >
                <Terminal size={18} />
              </button>
            </div>
            
            <div class={`${theme.editor.header.buttonGroup} ${theme.editor.header.buttonGroupSpacing}`}>
              <button
                onClick={saveContentButton}
                class={`${theme.editor.header.button} text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 ${animations.transition.fast}`}
                title="Save content"
              >
                <Save size={18} />
              </button>
            </div>
          </div>
        </div>
        <Splitter.RootProvider
          value={splitter}
          class={`flex-grow h-full overflow-hidden rounded-b-md shadow-sm border-x border-b ${theme.border.light} ${theme.border.dark} ${animations.transition.normal}`}
        >
          <Splitter.Panel
            id="editor"
            class={`h-full overflow-hidden ${animations.transition.normal}`}
          >
            <TextEditor initialContent={content()} onContentChange={handleContentChange} />
          </Splitter.Panel>
          <Splitter.ResizeTrigger
            id="editor:preview"
            aria-label="Resize"
            class={`flex items-center justify-center w-2 cursor-col-resize hover:bg-gray-200 dark:hover:bg-gray-700 ${animations.transition.fast}`}
          >
            <div
              class={`w-[3px] h-16 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-blue-400 dark:hover:bg-blue-500 ${animations.transition.fast}`}
            ></div>
          </Splitter.ResizeTrigger>
          <Splitter.Panel
            id="preview"
            class={`h-full overflow-y-auto bg-white dark:bg-gray-800 ${animations.transition.normal}`}
            style="overflow-y: auto;"
          >
            <NotePreview content={content()} />
          </Splitter.Panel>
        </Splitter.RootProvider>
      </Show>
    </div>
  )
}
