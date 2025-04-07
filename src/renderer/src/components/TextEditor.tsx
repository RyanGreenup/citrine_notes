import { Component, createSignal, onMount, onCleanup, createEffect } from 'solid-js'
import { theme } from '../theme'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { markdown } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'

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
  const [isDarkMode, setIsDarkMode] = createSignal(false)

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
    
    const startState = EditorState.create({
      doc: content(),
      extensions: [
        basicSetup,
        markdown(),
        isDark ? oneDark : [],
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
  }

  onMount(() => {
    initEditor()

    // Listen for theme changes via MutationObserver
    const observer = new MutationObserver(() => {
      const newIsDark = checkDarkMode()
      if (newIsDark !== isDarkMode()) {
        updateEditorTheme(newIsDark);
      }
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    // Also listen for the custom theme-changed event
    const themeChangeHandler = (e: CustomEvent) => {
      const newIsDark = e.detail.isDark;
      if (newIsDark !== isDarkMode()) {
        updateEditorTheme(newIsDark);
      }
    };
    
    window.addEventListener('theme-changed', themeChangeHandler as EventListener);

    onCleanup(() => {
      observer.disconnect();
      window.removeEventListener('theme-changed', themeChangeHandler as EventListener);
    });
  });
  
  // Function to update the editor theme
  const updateEditorTheme = (isDark: boolean) => {
    if (editorView) {
      const currentContent = editorView.state.doc.toString();
      editorView.destroy();
      
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        if (editorRef) {
          const startState = EditorState.create({
            doc: currentContent,
            extensions: [
              basicSetup,
              markdown(),
              isDark ? oneDark : [],
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
          });
          
          editorView = new EditorView({
            state: startState,
            parent: editorRef
          });
          
          setIsDarkMode(isDark);
        }
      }, 10);
    }
  }

  onCleanup(() => {
    editorView?.destroy()
  })

  return (
    <div 
      ref={editorRef} 
      class={`h-full w-full p-0`}
    />
  )
}
