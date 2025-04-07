interface Note {
  id: string
  title: string
  body: string
  parent_id?: string
  user_created_time: number
  user_updated_time: number
}

interface DatabaseAPI {
  getAllNotes: () => Promise<Note[]>
  getNoteById: (id: string) => Promise<Note | null>
  getNoteBodyById: (id: string) => Promise<string | null>
  getStatus: () => Promise<{ connected: boolean; path: string | null }>
  createNote: (title: string, body: string, folderId?: string) => Promise<Note | null>
  updateNote: (id: string, title: string, body: string) => Promise<Note | null>
  searchNotes: (query: string, limit?: number) => Promise<Note[]>
  getBacklinks: (noteId: string) => Promise<Note[]>
  getHomeNote: () => Promise<Note | null>
}

interface ZoomAPI {
  zoomIn: () => Promise<number>
  zoomOut: () => Promise<number>
  resetZoom: () => Promise<number>
  getZoomFactor: () => Promise<number>
}

interface Window {
  editorControls?: {
    toggleVim: () => void;
    isVimEnabled: () => boolean;
  };
  saveTimeout?: number;
  api?: {
    database: DatabaseAPI;
    zoom: ZoomAPI;
  };
  electron?: any;
}
