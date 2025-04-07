import type { Component, JSXElement } from 'solid-js'
import { Navbar } from './components/Navbar'
import { createSignal, onMount } from 'solid-js'
import { theme } from './theme'
import { Sidebar } from './components/sidebar/Sidebar'
import { NoteEditor } from './components/NoteEditor'
import { initializeView } from './utils/viewUtils'

const DummyContent: Component = () => {
  const [sidebarOpen, setSidebarOpen] = createSignal(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen())
  }

  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen()} />
      <div
        class={`${theme.layout.content} ${theme.layout.contentBg} ${theme.layout.contentHeight}`}
      >
        <NoteEditor />
      </div>
    </>
  )
}

const App: Component = () => {
  onMount(() => {
    // Initialize the view after the app is mounted
    initializeView()
  })

  return (
    <>
      <DummyContent />
    </>
  )
}

export default App
