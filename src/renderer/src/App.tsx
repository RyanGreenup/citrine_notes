import type { Component } from 'solid-js'
import Versions from './components/Versions'
import NoteList from './components/NoteList'
import ResourceUploader from './components/ResourceUploader'
import electronLogo from './assets/electron.svg'

const DummyContent: Component = () => {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <div class="p-4">
      <h1 class="text-3xl font-bold underline mb-4">Notes App</h1>
      <div class="flex items-center mb-6">
        <img alt="logo" class="logo h-12 mr-4" src={electronLogo} />
        <div>
          <div class="creator">Powered by electron-vite</div>
          <div class="text">
            Build an Electron app with <span class="solid">Solid</span>
            &nbsp;and <span class="ts">TypeScript</span>
          </div>
        </div>
      </div>

      <p class="tip mt-6">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div class="actions">
        <div class="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div class="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>
      </div>
      <Versions />
    </div>
  )
}

const App: Component = () => {
  return <DummyContent />
}

export default App
