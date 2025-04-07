import type { Component, JSXElement } from 'solid-js'
import { FillerContent } from './components/FillerContent'
import { Navbar } from './components/Navbar'
import { createSignal } from 'solid-js'
import { theme } from './theme'
import { Sidebar } from './components/sidebar/Sidebar'

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
        <FillerContent />
      </div>
    </>
  )
}

const App: Component = () => {
  return (
    <>
      <DummyContent />
    </>
  )
}

export default App
