import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { DatabaseService, Folder, Note, Tag, Resource } from './database'
import path from 'path'
import fs from 'fs'
import os from 'os'

// Get database path from environment variable
let dbPath: string | null = process.env.DB_PATH || null

// Initialize database service if path is provided
let databaseService: DatabaseService | null = null
if (dbPath) {
  try {
    databaseService = DatabaseService.getInstance(path.resolve(dbPath))
  } catch (error) {
    console.error('Failed to initialize database:', error)
    // Show error dialog when app is ready
    app.whenReady().then(() => {
      const { dialog } = require('electron')
      dialog.showErrorBox(
        'Database Error',
        `Failed to connect to the database. You may need to rebuild the better-sqlite3 module.\n\nError: ${error.message}`
      )
    })
  }
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Handle zoom level changes
  ipcMain.handle('zoom:in', (event) => {
    const webContents = event.sender
    const currentZoom = webContents.getZoomFactor()
    webContents.setZoomFactor(Math.min(currentZoom + 0.1, 3.0))
    return webContents.getZoomFactor()
  })

  ipcMain.handle('zoom:out', (event) => {
    const webContents = event.sender
    const currentZoom = webContents.getZoomFactor()
    webContents.setZoomFactor(Math.max(currentZoom - 0.1, 0.5))
    return webContents.getZoomFactor()
  })

  ipcMain.handle('zoom:reset', (event) => {
    const webContents = event.sender
    webContents.setZoomFactor(1.0)
    return 1.0
  })

  ipcMain.handle('zoom:get', (event) => {
    return event.sender.getZoomFactor()
  })

  // Handle file selection for resource upload
  ipcMain.handle('dialog:openFile', async () => {
    const { dialog } = require('electron')
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'All Files', extensions: ['*'] }]
    })

    if (result.canceled) {
      return null
    }

    const filePath = result.filePaths[0]

    try {
      const stats = await fs.promises.stat(filePath)
      const fileExtension = path.extname(filePath).replace('.', '')
      const fileName = path.basename(filePath)
      const mimeType = getMimeType(fileExtension)

      return {
        path: filePath,
        name: fileName,
        extension: fileExtension,
        size: stats.size,
        mime: mimeType
      }
    } catch (error) {
      console.error('Error reading file:', error)
      return null
    }
  })

  // Get database status
  ipcMain.handle('db:getStatus', (): { connected: boolean; path: string | null } => {
    return {
      connected: !!databaseService,
      path: dbPath
    }
  })

  // Database IPC handlers
  if (databaseService) {
    // Notes //////////////////////////////////////////////////////////////////
    // Create _________________________________________________________________
    ipcMain.handle(
      'db:createNote',
      (_event, title: string, body: string, folderId: string = ''): Note | null => {
        return databaseService!.createNote(title, body, folderId)
      }
    )
    // Read ___________________________________________________________________
    // Get All Notes ..........................................................
    ipcMain.handle('db:getAllNotes', (_event): Note[] => {
      return databaseService!.getAllNotes()
    })
    // Get Note by ID .........................................................
    ipcMain.handle('db:getNoteById', (_event, id: string): Note | null => {
      return databaseService!.getNoteById(id)
    })
    // Get Note Body by ID .........................................................
    ipcMain.handle('db:getNoteBodyById', (_event, id: string): string | null => {
      return databaseService!.getNoteBodyById(id)
    })
    // Get Home Note .............................................................
    ipcMain.handle('db:getHomeNote', (_event): Note | null => {
      return databaseService!.getHomeNote()
    })
    // Update _________________________________________________________________
    ipcMain.handle('db:updateNoteTitle', (_event, id: string, title: string): Note | null => {
      return databaseService!.updateNoteTitle(id, title)
    })
    ipcMain.handle('db:updateNoteBody', (_event, id: string, body: string): Note | null => {
      return databaseService!.updateNoteBody(id, body)
    })
    ipcMain.handle(
      'db:updateNote',
      (_event, id: string, title: string, body: string): Note | null => {
        return databaseService!.updateNote(id, title, body)
      }
    )
    // Delete _________________________________________________________________
    ipcMain.handle('db:deleteNote', (_event, id: string): boolean => {
      return databaseService!.deleteNote(id)
    })
    // Tree ___________________________________________________________________
    ipcMain.handle('db:buildNoteTree', (_event): any => {
      return databaseService!.buildNoteTree()
    })

    // Folders ////////////////////////////////////////////////////////////////
    // Create _________________________________________________________________
    ipcMain.handle(
      'db:createFolder',
      (_event, title: string, parentId: string = ''): Folder | null => {
        return databaseService!.createFolder(title, parentId)
      }
    )
    // Read ___________________________________________________________________
    ipcMain.handle('db:getFolderById', (_event, id: string): Folder | null => {
      return databaseService!.getFolderById(id)
    })
    // Update _________________________________________________________________
    ipcMain.handle('db:updateFolder', (_event, id: string, title: string): Folder | null => {
      return databaseService!.updateFolder(id, title)
    })

    ipcMain.handle('db:moveFolder', (_event, id: string, newParentId: string): Folder | null => {
      return databaseService!.moveFolder(id, newParentId)
    })

    // Delete _________________________________________________________________
    ipcMain.handle('db:deleteFolder', (_event, id: string, recursive: boolean = false): boolean => {
      return databaseService!.deleteFolder(id, recursive)
    })

    // Folder-Notes ///////////////////////////////////////////////////////////
    // Create _________________________________________________________________
    // NONE
    // Read ___________________________________________________________________
    ipcMain.handle('db:getNotesByFolderId', (_event, folderId: string): Note[] => {
      return databaseService!.getNotesByFolderId(folderId)
    })

    // Search notes
    ipcMain.handle('db:searchNotes', (_event, query: string, limit: number = 20): Note[] => {
      return databaseService!.searchNotes(query, limit)
    })

    // Get backlinks for a note
    ipcMain.handle('db:getBacklinks', (_event, noteId: string): Note[] => {
      return databaseService!.getBacklinks(noteId)
    })

    // Get forward links for a note
    ipcMain.handle('db:getForwardLinks', (_event, noteId: string): Note[] => {
      return databaseService!.getForwardLinks(noteId)
    })

    // Update _________________________________________________________________

    ipcMain.handle('db:moveNote', (_event, noteId: string, newFolderId: string): Note | null => {
      return databaseService!.moveNote(noteId, newFolderId)
    })
    // Delete _________________________________________________________________
    // NONE
    // ........................................................................

    // Tags ///////////////////////////////////////////////////////////////////
    // Create _________________________________________________________________
    ipcMain.handle('db:createTag', (_event, title: string, parentId: string = ''): Tag | null => {
      return databaseService!.createTag(title, parentId)
    })
    ipcMain.handle('db:getTagById', (_event, id: string): Tag | null => {
      return databaseService!.getTagById(id)
    })
    // Read ___________________________________________________________________
    ipcMain.handle('db:getAllTags', (_event): Tag[] => {
      return databaseService!.getAllTags()
    })
    // Update _________________________________________________________________
    ipcMain.handle('db:updateTag', (_event, id: string, title: string): Tag | null => {
      return databaseService!.updateTag(id, title)
    })
    // Update _________________________________________________________________
    ipcMain.handle('db:moveTag', (_event, id: string, newParentId: string): Tag | null => {
      return databaseService!.moveTag(id, newParentId)
    })

    // Delete _________________________________________________________________
    ipcMain.handle('db:deleteTag', (_event, id: string): boolean => {
      return databaseService!.deleteTag(id)
    })
    // Tree
    ipcMain.handle('db:buildTagTree', (_event): any => {
      return databaseService!.buildTagTree()
    })
    // Tag Tree _______________________________________________________________
    // ........................................................................

    // Note-Tags //////////////////////////////////////////////////////////////
    // Create _________________________________________________________________
    ipcMain.handle('db:assignTagToNote', (_event, noteId: string, tagId: string): boolean => {
      return databaseService!.assignTagToNote(noteId, tagId)
    })
    // Read ___________________________________________________________________

    ipcMain.handle('db:getTagsByNoteId', (_event, noteId: string): Tag[] => {
      return databaseService!.getTagsByNoteId(noteId)
    })

    ipcMain.handle('db:getNotesByTagId', (_event, tagId: string): Note[] => {
      return databaseService!.getNotesByTagId(tagId)
    })
    // Update _________________________________________________________________
    // NONE
    // Delete _________________________________________________________________
    ipcMain.handle('db:removeTagFromNote', (_event, noteId: string, tagId: string): boolean => {
      return databaseService!.removeTagFromNote(noteId, tagId)
    })
    // ........................................................................

    // Resources //////////////////////////////////////////////////////////////
    // Create _________________________________________________________________
    ipcMain.handle(
      'db:createResource',
      async (
        _event,
        title: string,
        mime: string,
        filename: string,
        fileExtension: string,
        size: number,
        sourcePath: string
      ) => {
        try {
          // Create the resource in the database
          const resource = databaseService!.createResource(
            title,
            mime,
            filename,
            fileExtension,
            size
          )

          if (!resource) {
            console.error('Failed to create resource in database')
            return null
          }

          // Determine Joplin resources directory
          const resourcesDir = path.join(os.homedir(), '.config', 'joplin-desktop', 'resources')

          // Create the resources directory if it doesn't exist
          if (!fs.existsSync(resourcesDir)) {
            fs.mkdirSync(resourcesDir, { recursive: true })
          }

          // Determine destination path
          const destPath = path.join(resourcesDir, `${resource.id}.${fileExtension}`)

          // Copy the file to the resources directory
          await fs.promises.copyFile(sourcePath, destPath)

          console.log(`Resource copied to: ${destPath}`)

          return resource
        } catch (error) {
          console.error('Error creating resource:', error)
          return null
        }
      }
    )
    // Read ___________________________________________________________________
    ipcMain.handle('db:getResourceById', (_event, id: string) => {
      return databaseService!.getResourceById(id)
    })

    ipcMain.handle('db:getAllResources', () => {
      return databaseService!.getAllResources()
    })

    ipcMain.handle('db:getResourcesByMimeType', (_event, mimeType: string) => {
      return databaseService!.getResourcesByMimeType(mimeType)
    })
    // Update _________________________________________________________________
    ipcMain.handle('db:updateResource', (_event, id: string, title: string, filename: string) => {
      return databaseService!.updateResource(id, title, filename)
    })

    ipcMain.handle(
      'db:updateResourceOcr',
      (_event, id: string, ocrText: string, ocrStatus: number, ocrError: string = '') => {
        return databaseService!.updateResourceOcr(id, ocrText, ocrStatus, ocrError)
      }
    )
    // Delete _________________________________________________________________
    ipcMain.handle('db:deleteResource', (_event, id: string) => {
      return databaseService!.deleteResource(id)
    })
    // ........................................................................
  }

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Close database connection when app is about to quit
app.on('will-quit', () => {
  if (databaseService) {
    databaseService.close()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Helper function to determine MIME type from file extension
function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    txt: 'text/plain',
    html: 'text/html',
    css: 'text/css',
    js: 'text/javascript',
    json: 'application/json',
    xml: 'application/xml',
    zip: 'application/zip',
    mp3: 'audio/mpeg',
    mp4: 'video/mp4',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    webm: 'video/webm'
  }

  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream'
}
