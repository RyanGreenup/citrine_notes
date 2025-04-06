import { Component, createSignal, createEffect, onMount } from 'solid-js'
import { marked } from 'marked'
import markedKatex from 'marked-katex-extension'
import 'katex/dist/katex.min.css'

/**
 * Editor component provides a markdown editing experience with live preview
 * 
 * This component handles text input and renders a live preview of the markdown content.
 * Supports KaTeX for mathematical equations.
 */
export const Editor: Component = () => {
  const [content, setContent] = createSignal('# Hello World\n\nStart typing your note here...\n\nTry some math: $c = \\pm\\sqrt{a^2 + b^2}$\n\nOr block math:\n\n$$\nc = \\pm\\sqrt{a^2 + b^2}\n$$')
  const [renderedContent, setRenderedContent] = createSignal('')

  // Initialize marked with KaTeX extension
  onMount(() => {
    marked.use(markedKatex({
      throwOnError: false
    }))
  })

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
        <div class="flex-1 p-4 bg-white dark:bg-gray-800 overflow-auto">
          <div class="prose dark:prose-invert prose-sm md:prose-base lg:prose-lg max-w-none" innerHTML={renderedContent()} />
        </div>
      </div>
    </div>
  )
}
