import { Component, createSignal, onMount, onCleanup, createEffect } from 'solid-js'
import { theme } from '../theme'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { markdown } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'
import { vim, Vim } from '@replit/codemirror-vim'
import { Terminal } from 'lucide-solid'

interface TextEditorProps {
  initialContent?: string
  onContentChange?: (content: string) => void
}

interface EditorControls {
  toggleVim: () => void
  isVimEnabled: () => boolean
}

// Function to detect if user is on mobile
const isMobileDevice = (): boolean => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
  
  // Regular expressions for mobile devices
  const mobileRegex = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i
  const mobileRegex2 = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
  
  return mobileRegex.test(userAgent) || mobileRegex2.test(userAgent.substr(0, 4))
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
    Vim.map("jj", "<Esc>", "insert"); // in insert mode
    Vim.map("Y", "y$"); // in normal mode
    Vim.map("za", "za"); // toggle fold
    Vim.map("zc", "zc"); // close fold
    
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
          const extensions = [
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
          
          // Add vim extension if enabled
          if (vimEnabled()) {
            extensions.push(vim())
          }
          
          const startState = EditorState.create({
            doc: currentContent,
            extensions
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
      <div 
        ref={editorRef} 
        class={`h-full w-full p-0`}
      />
    </div>
  )
}
