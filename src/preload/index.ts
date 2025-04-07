import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Define types for our database API
interface Note {
  id: string
  title: string
  body: string
  user_created_time: number
  user_updated_time: number
}

interface ZoomAPI {
  zoomIn: () => Promise<number>
  zoomOut: () => Promise<number>
  resetZoom: () => Promise<number>
  getZoomFactor: () => Promise<number>
}

interface DatabaseAPI {
  getAllNotes: () => Promise<Note[]>
  getNoteById: (id: string) => Promise<Note | null>
  getStatus: () => Promise<{ connected: boolean; path: string | null }>
  createNote: (title: string, body: string) => Promise<Note | null>
  updateNote: (id: string, title: string, body: string) => Promise<Note | null>
  searchNotes: (query: string, limit?: number) => Promise<Note[]>
  getBacklinks: (noteId: string) => Promise<Note[]>
  getHomeNote: () => Promise<Note | null>
}

// Custom APIs for renderer
const api = {
  database: {
    getAllNotes: (): Promise<Note[]> => ipcRenderer.invoke('db:getAllNotes'),
    getNoteById: (id: string): Promise<Note | null> =>
      ipcRenderer.invoke('db:notes:getNoteById', id),
    getNoteBodyById: (id: string): Promise<string | null> =>
      ipcRenderer.invoke('db:notes:getNoteBodyById', id),
    getStatus: (): Promise<{ connected: boolean; path: string | null }> =>
      ipcRenderer.invoke('db:getStatus'),
    createNote: (title: string, body: string): Promise<Note | null> =>
      ipcRenderer.invoke('db:createNote', title, body),
    updateNote: (id: string, title: string, body: string): Promise<Note | null> =>
      ipcRenderer.invoke('db:updateNote', id, title, body),
    searchNotes: (query: string, limit: number = 20): Promise<Note[]> =>
      ipcRenderer.invoke('db:searchNotes', query, limit),
    getBacklinks: (noteId: string): Promise<Note[]> =>
      ipcRenderer.invoke('db:notes:getBacklinks', noteId),
    getHomeNote: (): Promise<Note | null> => ipcRenderer.invoke('db:notes:getHomeNote')
  } as DatabaseAPI,
  zoom: {
    zoomIn: (): Promise<number> => ipcRenderer.invoke('zoom:in'),
    zoomOut: (): Promise<number> => ipcRenderer.invoke('zoom:out'),
    resetZoom: (): Promise<number> => ipcRenderer.invoke('zoom:reset'),
    getZoomFactor: (): Promise<number> => ipcRenderer.invoke('zoom:get')
  } as ZoomAPI
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
