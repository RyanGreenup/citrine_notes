import { Component, createSignal, createEffect } from 'solid-js'
import { marked } from 'marked'

/**
 * Editor component provides a markdown editing experience with live preview
 * 
 * This component handles text input and renders a live preview of the markdown content.
 */
export const Editor: Component = () => {
  const [content, setContent] = createSignal('# Hello World\n\nStart typing your note here...')
  const [renderedContent, setRenderedContent] = createSignal('')

  // Update the preview whenever content changes
  createEffect(() => {
    setRenderedContent(marked(content()))
  })

  return (
    <div class="flex flex-col h-full">
      <div class="flex-1 flex">
        {/* Editor pane */}
        <div class="flex-1 border-r dark:border-gray-700">
          <textarea
            class="w-full h-full p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:outline-none"
            value={content()}
            onInput={(e) => setContent(e.target.value)}
          />
        </div>
        
        {/* Preview pane */}
        <div class="flex-1 p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white overflow-auto">
          <div class="prose dark:prose-invert max-w-none" innerHTML={renderedContent()} />
        </div>
      </div>
    </div>
  )
}
