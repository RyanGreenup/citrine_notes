import { Component, createSignal, onMount, onCleanup, createEffect } from 'solid-js'
import { theme } from '../theme'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { markdown } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'
import { vim, Vim } from '@replit/codemirror-vim'
import { Terminal } from 'lucide-solid'
import { isMobileDevice } from '@renderer/utils/check_mobile'

interface TextEditorProps {
  initialContent?: string
  onContentChange?: (content: string) => void
}

interface EditorControls {
  toggleVim: () => void
  isVimEnabled: () => boolean
}

export const TextEditor: Component<TextEditorProps> = (props) => {
  const [content, setContent] = createSignal<string>(
    props.initialContent || '# Your note here\n\nStart typing to edit...'
  )
  let editorRef: HTMLDivElement | undefined
  let editorView: EditorView | undefined
  const [isDarkMode, setIsDarkMode] = createSignal(false)
  // Enable Vim by default for desktop users
  const [vimEnabled, setVimEnabled] = createSignal(!isMobileDevice())

  // Check if dark mode is active
  const checkDarkMode = () => {
    const isDark = document.documentElement.classList.contains('dark')
    setIsDarkMode(isDark)
    return isDark
  }

  // Initialize editor with the appropriate theme
  const initEditor = () => {
    if (!editorRef) return

    const isDark = checkDarkMode()

    const extensions = [
      basicSetup,
      markdown(),
      isDark ? oneDark : [],
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const newContent = update.state.doc.toString()
          setContent(newContent)
          if (props.onContentChange) {
            props.onContentChange(newContent)
          }
        }
      })
    ]

    // Add vim extension if enabled
    if (vimEnabled()) {
      extensions.push(vim())
    }

    const startState = EditorState.create({
      doc: content(),
      extensions
    })

    editorView = new EditorView({
      state: startState,
      parent: editorRef
    })
  }

  onMount(() => {
    // Register Vim keybindings
    Vim.map('jj', '<Esc>', 'insert') // in insert mode
    Vim.map('Y', 'y$') // in normal mode
    Vim.map('za', 'za') // toggle fold
    Vim.map('zc', 'zc') // close fold

    initEditor()

    // Listen for theme changes via MutationObserver
    const observer = new MutationObserver(() => {
      const newIsDark = checkDarkMode()
      if (newIsDark !== isDarkMode()) {
        updateEditorTheme(newIsDark)
      }
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    // Also listen for the custom theme-changed event
    const themeChangeHandler = (e: CustomEvent) => {
      const newIsDark = e.detail.isDark
      if (newIsDark !== isDarkMode()) {
        updateEditorTheme(newIsDark)
      }
    }

    window.addEventListener('theme-changed', themeChangeHandler as EventListener)

    onCleanup(() => {
      observer.disconnect()
      window.removeEventListener('theme-changed', themeChangeHandler as EventListener)
    })
  })

  // Function to update the editor theme
  const updateEditorTheme = (isDark: boolean) => {
    if (editorView) {
      const currentContent = editorView.state.doc.toString()
      editorView.destroy()

      // Small delay to ensure DOM is updated
      setTimeout(() => {
        if (editorRef) {
          const extensions = [
            basicSetup,
            markdown(),
            isDark ? oneDark : [],
            EditorView.updateListener.of((update) => {
              if (update.docChanged) {
                const newContent = update.state.doc.toString()
                setContent(newContent)
                if (props.onContentChange) {
                  props.onContentChange(newContent)
                }
              }
            })
          ]

          // Add vim extension if enabled
          if (vimEnabled()) {
            extensions.push(vim())
          }

          const startState = EditorState.create({
            doc: currentContent,
            extensions
          })

          editorView = new EditorView({
            state: startState,
            parent: editorRef
          })

          setIsDarkMode(isDark)
        }
      }, 10)
    }
  }

  // Toggle Vim mode
  const toggleVim = () => {
    const newVimState = !vimEnabled()
    setVimEnabled(newVimState)

    // Recreate the editor with or without vim bindings
    if (editorView) {
      const currentContent = editorView.state.doc.toString()
      editorView.destroy()

      setTimeout(() => {
        if (editorRef) {
          initEditor()
        }
      }, 10)
    }
  }

  // Expose controls to parent component
  const editorControls: EditorControls = {
    toggleVim,
    isVimEnabled: vimEnabled
  }

  // Expose the controls to the parent component
  if (typeof window !== 'undefined') {
    // @ts-ignore - Adding a custom property to window
    window.editorControls = editorControls
  }

  onCleanup(() => {
    editorView?.destroy()
  })

  return (
    <div class="relative h-full w-full">
      {vimEnabled() && (
        <div class="absolute bottom-2 right-2 z-10 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-70">
          VIM
        </div>
      )}
      <div ref={editorRef} class={`h-full w-full p-0`} />
    </div>
  )
}
