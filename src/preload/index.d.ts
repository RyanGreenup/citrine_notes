import { ElectronAPI } from '@electron-toolkit/preload'
import { Note } from '../shared/types'

interface DatabaseAPI {
  getAllNotes: () => Promise<Note[]>
  getNoteById: (id: string) => Promise<Note | null>
  getStatus: () => Promise<{ connected: boolean; path: string | null }>
  createNote: (title: string, body: string, folderId?: string) => Promise<Note | null>
  updateNote: (id: string, title: string, body: string) => Promise<Note | null>
  searchNotes: (query: string, limit?: number) => Promise<Note[]>
  getBacklinks: (noteId: string) => Promise<Note[]>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      database: DatabaseAPI
    }
  }
}
