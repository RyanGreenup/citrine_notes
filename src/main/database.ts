import { app } from 'electron'
import { join } from 'path'
import { existsSync } from 'fs'

// Import better-sqlite3 with error handling
import BetterSqlite3 from 'better-sqlite3'
let Database: any
try {
  Database = require('better-sqlite3')
} catch (error) {
  console.error('Failed to load better-sqlite3:', error)
}

// Define the Note interface to match the database schema
export interface Note {
  id: string
  title: string
  body: string
  parent_id: string
  user_created_time: number
  user_updated_time: number
}

// Define the Folder interface to match the database schema
export interface Folder {
  id: string
  title: string
  parent_id: string
  user_created_time: number
  user_updated_time: number
}

// Database service class
export class DatabaseService {
  private db: any
  private static instance: DatabaseService | null = null
  private dbPath: string

  private constructor(dbPath: string) {
    this.dbPath = dbPath

    if (!existsSync(dbPath)) {
      throw new Error(`Database file not found: ${dbPath}`)
    }

    if (!Database) {
      throw new Error(
        'better-sqlite3 module could not be loaded. Try running "npm rebuild better-sqlite3"'
      )
    }

    try {
      // Initialize the database connection
      // For write operations like createNote and updateNote, we need to set readonly to false
      this.db = new Database(dbPath, { readonly: false })
      console.log(`Connected to database: ${dbPath}`)
    } catch (error) {
      console.error('Failed to connect to database:', error)
      throw error
    }
  }

  // Singleton pattern with configurable database path
  public static getInstance(dbPath: string): DatabaseService {
    // If instance exists but with different path, close it and create new one
    if (DatabaseService.instance && DatabaseService.instance.dbPath !== dbPath) {
      DatabaseService.instance.close()
      DatabaseService.instance = null
    }

    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService(dbPath)
    }
    return DatabaseService.instance
  }

  /////////////////////////////////////////////////////////////////////////////
  // Notes ////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  // Create ///////////////////////////////////////////////////////////////////

  // Create a new note
  // TODO parent_id is not NULL
  public createNote(title: string, body: string, folderId: string = ''): Note | null {
    try {
      // Generate a new UUID for the note
      const id = require('crypto').randomUUID()
      const now = Date.now()

      // Insert the new note into the database
      const stmt = this.db.prepare(
        'INSERT INTO notes (id, title, body, parent_id, user_created_time, user_updated_time) VALUES (?, ?, ?, ?, ?, ?)'
      )

      stmt.run(id, title, body, folderId, now, now)

      // Return the newly created note
      return {
        id,
        title,
        body,
        parent_id: folderId,
        user_created_time: now,
        user_updated_time: now
      }
    } catch (error) {
      console.error('Error creating new note:', error)
      return null
    }
  }

  // Read ////////////////////////////////////////////////////////////////////////

  // Get all notes from the database
  public getAllNotes(): Note[] {
    try {
      const stmt = this.db.prepare(
        'SELECT id, title, body, parent_id, user_created_time, user_updated_time FROM notes'
      )
      return stmt.all() as Note[]
    } catch (error) {
      console.error('Error fetching notes:', error)
      return []
    }
  }

  // Get a single note by ID
  public getNoteById(id: string): Note | null {
    try {
      const stmt = this.db.prepare(
        'SELECT id, title, body, parent_id, user_created_time, user_updated_time FROM notes WHERE id = ?'
      )
      return (stmt.get(id) as Note) || null
    } catch (error) {
      console.error(`Error fetching note with ID ${id}:`, error)
      return null
    }
  }

  // Update ///////////////////////////////////////////////////////////////////

  // Update an existing note
  public updateNote(id: string, title: string, body: string): Note | null {
    try {
      const now = Date.now()

      // Check if the note exists
      const existingNote = this.getNoteById(id)
      if (!existingNote) {
        console.error(`Cannot update note: Note with ID ${id} not found`)
        return null
      }

      // Update the note in the database
      const stmt = this.db.prepare(
        'UPDATE notes SET title = ?, body = ?, user_updated_time = ? WHERE id = ?'
      )

      const result = stmt.run(title, body, now, id)

      if (result.changes === 0) {
        console.error(`No changes made to note with ID ${id}`)
        return null
      }

      // Return the updated note
      return {
        id,
        title,
        body,
        parent_id: existingNote.parent_id,
        user_created_time: existingNote.user_created_time,
        user_updated_time: now
      }
    } catch (error) {
      console.error(`Error updating note with ID ${id}:`, error)
      return null
    }
  }

  // Delete ///////////////////////////////////////////////////////////////////

  // Delete a note by ID
  public deleteNote(id: string): boolean {
    try {
      // Check if the note exists
      const existingNote = this.getNoteById(id)
      if (!existingNote) {
        console.error(`Cannot delete note: Note with ID ${id} not found`)
        return false
      }

      // Delete the note from the database
      const stmt = this.db.prepare('DELETE FROM notes WHERE id = ?')
      const result = stmt.run(id)

      if (result.changes === 0) {
        console.error(`No note deleted with ID ${id}`)
        return false
      }

      return true
    } catch (error) {
      console.error(`Error deleting note with ID ${id}:`, error)
      return false
    }
  }

  /////////////////////////////////////////////////////////////////////////////
  // Folders //////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  // Create ///////////////////////////////////////////////////////////////////

  // Create a new folder
  public createFolder(title: string, parentId: string = ''): Folder | null {
    try {
      // Generate a new UUID for the folder
      const id = require('crypto').randomUUID()
      const now = Date.now()

      // Insert the new folder into the database
      const stmt = this.db.prepare(
        'INSERT INTO folders (id, title, parent_id, created_time, updated_time, user_created_time, user_updated_time) VALUES (?, ?, ?, ?, ?, ?, ?)'
      )

      stmt.run(id, title, parentId, now, now, now, now)

      // Return the newly created folder
      return {
        id,
        title,
        parent_id: parentId,
        user_created_time: now,
        user_updated_time: now
      }
    } catch (error) {
      console.error('Error creating new folder:', error)
      return null
    }
  }

  // Get a single folder by ID
  public getFolderById(id: string): Folder | null {
    try {
      const stmt = this.db.prepare(
        'SELECT id, title, parent_id, user_created_time, user_updated_time FROM folders WHERE id = ?'
      )
      return (stmt.get(id) as Folder) || null
    } catch (error) {
      console.error(`Error fetching folder with ID ${id}:`, error)
      return null
    }
  }

  // Update ///////////////////////////////////////////////////////////////////
  // Title  ...................................................................

  // Update an existing folder
  public updateFolder(id: string, title: string): Folder | null {
    try {
      const now = Date.now()

      // Check if the folder exists
      const existingFolder = this.getFolderById(id)
      if (!existingFolder) {
        console.error(`Cannot update folder: Folder with ID ${id} not found`)
        return null
      }

      // Update the folder in the database
      const stmt = this.db.prepare(
        'UPDATE folders SET title = ?, updated_time = ?, user_updated_time = ? WHERE id = ?'
      )

      const result = stmt.run(title, now, now, id)

      if (result.changes === 0) {
        console.error(`No changes made to folder with ID ${id}`)
        return null
      }

      // Return the updated folder
      return {
        id,
        title,
        parent_id: existingFolder.parent_id,
        user_created_time: existingFolder.user_created_time,
        user_updated_time: now
      }
    } catch (error) {
      console.error(`Error updating folder with ID ${id}:`, error)
      return null
    }
  }

  // Parent ...................................................................
  // Move a folder to a different parent folder
  public moveFolder(id: string, newParentId: string): Folder | null {
    try {
      const now = Date.now()

      // Check if the folder exists
      const existingFolder = this.getFolderById(id)
      if (!existingFolder) {
        console.error(`Cannot move folder: Folder with ID ${id} not found`)
        return null
      }

      // Prevent a folder from being its own parent
      if (id === newParentId) {
        console.error(`Cannot move folder: A folder cannot be its own parent`)
        return null
      }

      // Update the folder's parent_id in the database
      const stmt = this.db.prepare(
        'UPDATE folders SET parent_id = ?, updated_time = ?, user_updated_time = ? WHERE id = ?'
      )

      const result = stmt.run(newParentId, now, now, id)

      if (result.changes === 0) {
        console.error(`No changes made to folder with ID ${id}`)
        return null
      }

      // Return the updated folder
      return {
        id,
        title: existingFolder.title,
        parent_id: newParentId,
        user_created_time: existingFolder.user_created_time,
        user_updated_time: now
      }
    } catch (error) {
      console.error(`Error moving folder with ID ${id}:`, error)
      return null
    }
  }

  // Delete a folder and all its notes
  public deleteFolder(id: string, recursive: boolean = false): boolean {
    try {
      // Check if the folder exists
      const existingFolder = this.getFolderById(id)
      if (!existingFolder) {
        console.error(`Cannot delete folder: Folder with ID ${id} not found`)
        return false
      }

      // If recursive is true, delete all child folders first
      if (recursive) {
        // Find all child folders
        const stmt = this.db.prepare('SELECT id FROM folders WHERE parent_id = ?')
        const childFolders = stmt.all(id)

        // Recursively delete each child folder
        for (const childFolder of childFolders) {
          // Delete notes in child folder
          const deleteChildNotesStmt = this.db.prepare('DELETE FROM notes WHERE parent_id = ?')
          deleteChildNotesStmt.run(childFolder.id)

          // Delete the child folder itself
          const deleteChildFolderStmt = this.db.prepare('DELETE FROM folders WHERE id = ?')
          deleteChildFolderStmt.run(childFolder.id)

          // Also check for nested child folders
          this.deleteFolder(childFolder.id, true)
        }
      }

      // Delete all notes with this folder as parent
      const deleteNotesStmt = this.db.prepare('DELETE FROM notes WHERE parent_id = ?')
      deleteNotesStmt.run(id)

      // Delete the folder itself
      const deleteFolderStmt = this.db.prepare('DELETE FROM folders WHERE id = ?')
      const result = deleteFolderStmt.run(id)

      if (result.changes === 0) {
        console.error(`No folder deleted with ID ${id}`)
        return false
      }

      return true
    } catch (error) {
      console.error(`Error deleting folder with ID ${id}:`, error)
      return false
    }
  }

  /////////////////////////////////////////////////////////////////////////////
  // Folder-Notes /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  // Create ///////////////////////////////////////////////////////////////////
  // No note should be without a parent, so there's no notion of
  // creating a fresh relationship
  // Read /////////////////////////////////////////////////////////////////////
  // List all children of a folder
  // Get all notes in a specific folder
  public getNotesByFolderId(folderId: string): Note[] {
    try {
      const stmt = this.db.prepare(
        'SELECT id, title, body, parent_id, user_created_time, user_updated_time FROM notes WHERE parent_id = ?'
      )
      return stmt.all(folderId) as Note[]
    } catch (error) {
      console.error(`Error fetching notes for folder ID ${folderId}:`, error)
      return []
    }
  }
  // Update ///////////////////////////////////////////////////////////////////
  // Assign a note to a new parent
  public moveNote(noteId: string, newFolderId: string): Note | null {
    try {
      // Check if the note exists
      const existingNote = this.getNoteById(noteId);
      if (!existingNote) {
        console.error(`Cannot move note: Note with ID ${noteId} not found`);
        return null;
      }

      const now = Date.now();

      // Update the note's parent_id in the database
      const stmt = this.db.prepare(
        'UPDATE notes SET parent_id = ?, user_updated_time = ? WHERE id = ?'
      );

      const result = stmt.run(newFolderId, now, noteId);

      if (result.changes === 0) {
        console.error(`No changes made to note with ID ${noteId}`);
        return null;
      }

      // Return the updated note
      return {
        id: noteId,
        title: existingNote.title,
        body: existingNote.body,
        parent_id: newFolderId,
        user_created_time: existingNote.user_created_time,
        user_updated_time: now
      };
    } catch (error) {
      console.error(`Error moving note with ID ${noteId}:`, error);
      return null;
    }
  }

  // Delete ///////////////////////////////////////////////////////////////////
  // No note can be without a parent, so we don't delete any such relationship

  /////////////////////////////////////////////////////////////////////////////
  // Tree /////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  // Close the database connection
  public close(): void {
    try {
      if (this.db) {
        this.db.close()
        console.log('Database connection closed')
      }
    } catch (error) {
      console.error('Error closing database connection:', error)
    }
  }
}
