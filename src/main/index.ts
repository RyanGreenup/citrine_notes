import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { DatabaseService, Note } from './database'
import path from 'path'

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
    // Read ___________________________________________________________________
    // Get All Notes ..........................................................
    ipcMain.handle('db:notes:getAllNotes', (_event): Note[] => {
      return databaseService!.getAllNotes()
    })
    // Get Note by ID .........................................................
    ipcMain.handle('db:notes:getNoteById', (_event, id: string): Note | null => {
      return databaseService!.getNoteById(id)
    })
    // Update _________________________________________________________________
    ipcMain.handle('db:notes:updateNoteTitle', (_event, id: string, title: string): Note | null => {
      return databaseService!.updateNoteTitle(id, title)
    })
    ipcMain.handle('db:notes:updateNoteBody', (_event, id: string, body: string): Note | null => {
      return databaseService!.updateNoteBody(id, body)
    })
    // Delete _________________________________________________________________
    // Tree ___________________________________________________________________
    // ........................................................................

    // Folders ////////////////////////////////////////////////////////////////
    // Create _________________________________________________________________
    // Read ___________________________________________________________________
    // Update _________________________________________________________________
    // Delete _________________________________________________________________
    // ........................................................................

    // Folder-Notes ///////////////////////////////////////////////////////////
    // Create _________________________________________________________________
    // Read ___________________________________________________________________
    // Update _________________________________________________________________
    // Delete _________________________________________________________________
    // ........................................................................

    // Tags ///////////////////////////////////////////////////////////////////
    // Create _________________________________________________________________
    // Read ___________________________________________________________________
    // Update _________________________________________________________________
    // Delete _________________________________________________________________
    // Tag Tree _______________________________________________________________
    // ........................................................................

    // Note-Tags //////////////////////////////////////////////////////////////
    // Create _________________________________________________________________
    // Read ___________________________________________________________________
    // Update _________________________________________________________________
    // Delete _________________________________________________________________
    // ........................................................................

    // Get note by ID
    ipcMain.handle('db:getNoteById', (_, id: string): Note | null => {
      return databaseService!.getNoteById(id)
    })

    // Create a new note
    ipcMain.handle('db:createNote', (_, title: string, body: string): Note | null => {
      return databaseService!.createNote(title, body)
    })

    // Update an existing note
    ipcMain.handle('db:updateNote', (_, id: string, title: string, body: string): Note | null => {
      return databaseService!.updateNote(id, title, body)
    })
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
