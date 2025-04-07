import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Define types for our database API
interface Note {
  id: string
  title: string
  body: string
  parent_id: string
  user_created_time: number
  user_updated_time: number
}

interface Folder {
  id: string
  title: string
  parent_id: string
  user_created_time: number
  user_updated_time: number
}

interface Tag {
  id: string
  title: string
  parent_id: string
  user_created_time: number
  user_updated_time: number
}

interface Resource {
  id: string
  title: string
  mime: string
  filename: string
  created_time: number
  updated_time: number
  user_created_time: number
  user_updated_time: number
  file_extension: string
  size: number
}

interface ZoomAPI {
  zoomIn: () => Promise<number>
  zoomOut: () => Promise<number>
  resetZoom: () => Promise<number>
  getZoomFactor: () => Promise<number>
}

interface DialogAPI {
  openFile: () => Promise<{
    path: string
    name: string
    extension: string
    size: number
    mime: string
  } | null>
}

interface DatabaseAPI {
  // Database status
  getStatus: () => Promise<{ connected: boolean; path: string | null }>

  // Notes - Create
  createNote: (title: string, body: string, folderId?: string) => Promise<Note | null>

  // Notes - Read
  getAllNotes: () => Promise<Note[]>
  getNoteById: (id: string) => Promise<Note | null>
  getNoteBodyById: (id: string) => Promise<string | null>
  getHomeNote: () => Promise<Note | null>

  // Notes - Update
  updateNoteTitle: (id: string, title: string) => Promise<Note | null>
  updateNoteBody: (id: string, body: string) => Promise<Note | null>
  updateNote: (id: string, title: string, body: string) => Promise<Note | null>

  // Notes - Delete
  deleteNote: (id: string) => Promise<boolean>

  // Notes - Tree
  buildNoteTree: () => Promise<any>

  // Folders - Create
  createFolder: (title: string, parentId?: string) => Promise<Folder | null>

  // Folders - Read
  getFolderById: (id: string) => Promise<Folder | null>

  // Folders - Update
  updateFolder: (id: string, title: string) => Promise<Folder | null>
  moveFolder: (id: string, newParentId: string) => Promise<Folder | null>

  // Folders - Delete
  deleteFolder: (id: string, recursive?: boolean) => Promise<boolean>

  // Folder-Notes
  getNotesByFolderId: (folderId: string) => Promise<Note[]>
  moveNote: (noteId: string, newFolderId: string) => Promise<Note | null>

  // Search
  searchNotes: (query: string, limit?: number) => Promise<Note[]>

  // Links
  getBacklinks: (noteId: string) => Promise<Note[]>
  getForwardLinks: (noteId: string) => Promise<Note[]>

  // Tags - Create
  createTag: (title: string, parentId?: string) => Promise<Tag | null>

  // Tags - Read
  getTagById: (id: string) => Promise<Tag | null>
  getAllTags: () => Promise<Tag[]>

  // Tags - Update
  updateTag: (id: string, title: string) => Promise<Tag | null>
  moveTag: (id: string, newParentId: string) => Promise<Tag | null>

  // Tags - Delete
  deleteTag: (id: string) => Promise<boolean>

  // Tags - Tree
  buildTagTree: () => Promise<any>

  // Note-Tags
  assignTagToNote: (noteId: string, tagId: string) => Promise<boolean>
  getTagsByNoteId: (noteId: string) => Promise<Tag[]>
  getNotesByTagId: (tagId: string) => Promise<Note[]>
  removeTagFromNote: (noteId: string, tagId: string) => Promise<boolean>

  // Resources - Create
  createResource: (
    title: string,
    mime: string,
    filename: string,
    fileExtension: string,
    size: number,
    sourcePath: string
  ) => Promise<Resource | null>

  // Resources - Read
  getResourceById: (id: string) => Promise<Resource | null>
  getAllResources: () => Promise<Resource[]>
  getResourcesByMimeType: (mimeType: string) => Promise<Resource[]>

  // Resources - Update
  updateResource: (id: string, title: string, filename: string) => Promise<Resource | null>
  updateResourceOcr: (
    id: string,
    ocrText: string,
    ocrStatus: number,
    ocrError?: string
  ) => Promise<Resource | null>

  // Resources - Delete
  deleteResource: (id: string) => Promise<boolean>
}

// Custom APIs for renderer
const api = {
  // Database API
  database: {
    // Database status
    getStatus: (): Promise<{ connected: boolean; path: string | null }> =>
      ipcRenderer.invoke('db:getStatus'),

    // Notes - Create
    createNote: (title: string, body: string, folderId: string = ''): Promise<Note | null> =>
      ipcRenderer.invoke('db:createNote', title, body, folderId),

    // Notes - Read
    getAllNotes: (): Promise<Note[]> => ipcRenderer.invoke('db:getAllNotes'),
    getNoteById: (id: string): Promise<Note | null> => ipcRenderer.invoke('db:getNoteById', id),
    getNoteBodyById: (id: string): Promise<string | null> =>
      ipcRenderer.invoke('db:getNoteBodyById', id),
    getHomeNote: (): Promise<Note | null> => ipcRenderer.invoke('db:getHomeNote'),

    // Notes - Update
    updateNoteTitle: (id: string, title: string): Promise<Note | null> =>
      ipcRenderer.invoke('db:updateNoteTitle', id, title),
    updateNoteBody: (id: string, body: string): Promise<Note | null> =>
      ipcRenderer.invoke('db:updateNoteBody', id, body),
    updateNote: (id: string, title: string, body: string): Promise<Note | null> =>
      ipcRenderer.invoke('db:updateNote', id, title, body),

    // Notes - Delete
    deleteNote: (id: string): Promise<boolean> => ipcRenderer.invoke('db:deleteNote', id),

    // Notes - Tree
    buildNoteTree: (): Promise<any> => ipcRenderer.invoke('db:buildNoteTree'),

    // Folders - Create
    createFolder: (title: string, parentId: string = ''): Promise<Folder | null> =>
      ipcRenderer.invoke('db:createFolder', title, parentId),

    // Folders - Read
    getFolderById: (id: string): Promise<Folder | null> =>
      ipcRenderer.invoke('db:getFolderById', id),

    // Folders - Update
    updateFolder: (id: string, title: string): Promise<Folder | null> =>
      ipcRenderer.invoke('db:updateFolder', id, title),
    moveFolder: (id: string, newParentId: string): Promise<Folder | null> =>
      ipcRenderer.invoke('db:moveFolder', id, newParentId),

    // Folders - Delete
    deleteFolder: (id: string, recursive: boolean = false): Promise<boolean> =>
      ipcRenderer.invoke('db:deleteFolder', id, recursive),

    // Folder-Notes
    getNotesByFolderId: (folderId: string): Promise<Note[]> =>
      ipcRenderer.invoke('db:getNotesByFolderId', folderId),
    moveNote: (noteId: string, newFolderId: string): Promise<Note | null> =>
      ipcRenderer.invoke('db:moveNote', noteId, newFolderId),

    // Search
    searchNotes: (query: string, limit: number = 20): Promise<Note[]> =>
      ipcRenderer.invoke('db:searchNotes', query, limit),

    // Links
    getBacklinks: (noteId: string): Promise<Note[]> =>
      ipcRenderer.invoke('db:getBacklinks', noteId),
    getForwardLinks: (noteId: string): Promise<Note[]> =>
      ipcRenderer.invoke('db:getForwardLinks', noteId),

    // Tags - Create
    createTag: (title: string, parentId: string = ''): Promise<Tag | null> =>
      ipcRenderer.invoke('db:createTag', title, parentId),

    // Tags - Read
    getTagById: (id: string): Promise<Tag | null> => ipcRenderer.invoke('db:getTagById', id),
    getAllTags: (): Promise<Tag[]> => ipcRenderer.invoke('db:getAllTags'),

    // Tags - Update
    updateTag: (id: string, title: string): Promise<Tag | null> =>
      ipcRenderer.invoke('db:updateTag', id, title),
    moveTag: (id: string, newParentId: string): Promise<Tag | null> =>
      ipcRenderer.invoke('db:moveTag', id, newParentId),

    // Tags - Delete
    deleteTag: (id: string): Promise<boolean> => ipcRenderer.invoke('db:deleteTag', id),

    // Tags - Tree
    buildTagTree: (): Promise<any> => ipcRenderer.invoke('db:buildTagTree'),

    // Note-Tags
    assignTagToNote: (noteId: string, tagId: string): Promise<boolean> =>
      ipcRenderer.invoke('db:assignTagToNote', noteId, tagId),
    getTagsByNoteId: (noteId: string): Promise<Tag[]> =>
      ipcRenderer.invoke('db:getTagsByNoteId', noteId),
    getNotesByTagId: (tagId: string): Promise<Note[]> =>
      ipcRenderer.invoke('db:getNotesByTagId', tagId),
    removeTagFromNote: (noteId: string, tagId: string): Promise<boolean> =>
      ipcRenderer.invoke('db:removeTagFromNote', noteId, tagId),

    // Resources - Create
    createResource: (
      title: string,
      mime: string,
      filename: string,
      fileExtension: string,
      size: number,
      sourcePath: string
    ): Promise<Resource | null> =>
      ipcRenderer.invoke(
        'db:createResource',
        title,
        mime,
        filename,
        fileExtension,
        size,
        sourcePath
      ),

    // Resources - Read
    getResourceById: (id: string): Promise<Resource | null> =>
      ipcRenderer.invoke('db:getResourceById', id),
    getAllResources: (): Promise<Resource[]> => ipcRenderer.invoke('db:getAllResources'),
    getResourcesByMimeType: (mimeType: string): Promise<Resource[]> =>
      ipcRenderer.invoke('db:getResourcesByMimeType', mimeType),

    // Resources - Update
    updateResource: (id: string, title: string, filename: string): Promise<Resource | null> =>
      ipcRenderer.invoke('db:updateResource', id, title, filename),
    updateResourceOcr: (
      id: string,
      ocrText: string,
      ocrStatus: number,
      ocrError: string = ''
    ): Promise<Resource | null> =>
      ipcRenderer.invoke('db:updateResourceOcr', id, ocrText, ocrStatus, ocrError),

    // Resources - Delete
    deleteResource: (id: string): Promise<boolean> => ipcRenderer.invoke('db:deleteResource', id)
  } as DatabaseAPI,

  // Zoom API
  zoom: {
    zoomIn: (): Promise<number> => ipcRenderer.invoke('zoom:in'),
    zoomOut: (): Promise<number> => ipcRenderer.invoke('zoom:out'),
    resetZoom: (): Promise<number> => ipcRenderer.invoke('zoom:reset'),
    getZoomFactor: (): Promise<number> => ipcRenderer.invoke('zoom:get')
  } as ZoomAPI,

  // Dialog API
  dialog: {
    openFile: (): Promise<{
      path: string
      name: string
      extension: string
      size: number
      mime: string
    } | null> => ipcRenderer.invoke('dialog:openFile')
  } as DialogAPI
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
