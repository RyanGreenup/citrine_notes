import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Define types for our database API
interface Note {
  id: string;
  title: string;
  body: string;
  user_created_time: number;
  user_updated_time: number;
}

interface DatabaseAPI {
  getAllNotes: () => Promise<Note[]>;
  getNoteById: (id: string) => Promise<Note | null>;
  getStatus: () => Promise<{ connected: boolean; path: string | null }>;
  createNote: (title: string, body: string) => Promise<Note | null>;
  updateNote: (id: string, title: string, body: string) => Promise<Note | null>;
}

// Custom APIs for renderer
const api = {
  database: {
    getAllNotes: (): Promise<Note[]> => ipcRenderer.invoke('db:getAllNotes'),
    getNoteById: (id: string): Promise<Note | null> => ipcRenderer.invoke('db:getNoteById', id),
    getStatus: (): Promise<{ connected: boolean; path: string | null }> => ipcRenderer.invoke('db:getStatus'),
    createNote: (title: string, body: string): Promise<Note | null> => ipcRenderer.invoke('db:createNote', title, body),
    updateNote: (id: string, title: string, body: string): Promise<Note | null> => 
      ipcRenderer.invoke('db:updateNote', id, title, body)
  } as DatabaseAPI
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
