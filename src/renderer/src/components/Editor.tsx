import { Component, createSignal, createEffect, onMount } from 'solid-js'
import { Marked } from 'marked'
import markedKatex from 'marked-katex-extension'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github-dark.css'

/**
 * Editor component provides a markdown editing experience with live preview
 * 
 * This component handles text input and renders a live preview of the markdown content.
 * Supports KaTeX for mathematical equations.
 */
export const Editor: Component = () => {
  const [content, setContent] = createSignal(`# Hello World

Start typing your note here...

Try some math: $c = \\pm\\sqrt{a^2 + b^2}$

Or block math:

$$
c = \\pm\\sqrt{a^2 + b^2}
$$

\`\`\`javascript
// Code with syntax highlighting
function hello() {
  console.log("Hello, world!");
  return 42;
}
\`\`\`

\`\`\`typescript
// TypeScript example
interface User {
  name: string;
  id: number;
}

class UserAccount {
  name: string;
  id: number;

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}
\`\`\`
`)
  const [renderedContent, setRenderedContent] = createSignal('')

  // Initialize marked with KaTeX and syntax highlighting extensions
  const [markedInstance] = createSignal(
    new Marked(
      markedKatex({
        throwOnError: false
      }),
      markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang) {
          const language = hljs.getLanguage(lang) ? lang : 'plaintext';
          return hljs.highlight(code, { language }).value;
        }
      })
    )
  )

  // Update the preview whenever content changes
  createEffect(() => {
    setRenderedContent(markedInstance().parse(content()))
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
