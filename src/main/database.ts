import { app } from 'electron'
import { join } from 'path'
import { existsSync } from 'fs'

// Import better-sqlite3 with error handling
import BetterSqlite3 from 'better-sqlite3';
let Database: any;
try {
  Database = require('better-sqlite3');
} catch (error) {
  console.error('Failed to load better-sqlite3:', error);
}

// Define the Note interface to match the database schema
export interface Note {
  id: string;
  title: string;
  body: string;
  parent_id: string;
  user_created_time: number;
  user_updated_time: number;
}

// Define the Folder interface to match the database schema
export interface Folder {
  id: string;
  title: string;
  parent_id: string;
  user_created_time: number;
  user_updated_time: number;
}

// Database service class
export class DatabaseService {
  private db: any;
  private static instance: DatabaseService | null = null;
  private dbPath: string;

  private constructor(dbPath: string) {
    this.dbPath = dbPath;
    
    if (!existsSync(dbPath)) {
      throw new Error(`Database file not found: ${dbPath}`);
    }
    
    if (!Database) {
      throw new Error('better-sqlite3 module could not be loaded. Try running "npm rebuild better-sqlite3"');
    }
    
    try {
      // Initialize the database connection
      // For write operations like createNote and updateNote, we need to set readonly to false
      this.db = new Database(dbPath, { readonly: false });
      console.log(`Connected to database: ${dbPath}`);
    } catch (error) {
      console.error('Failed to connect to database:', error);
      throw error;
    }
  }

  // Singleton pattern with configurable database path
  public static getInstance(dbPath: string): DatabaseService {
    // If instance exists but with different path, close it and create new one
    if (DatabaseService.instance && DatabaseService.instance.dbPath !== dbPath) {
      DatabaseService.instance.close();
      DatabaseService.instance = null;
    }
    
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService(dbPath);
    }
    return DatabaseService.instance;
  }

  // Create a new note
  public createNote(title: string, body: string, folderId: string = ''): Note | null {
    try {
      // Generate a new UUID for the note
      const id = require('crypto').randomUUID();
      const now = Date.now();
      
      // Insert the new note into the database
      const stmt = this.db.prepare(
        'INSERT INTO notes (id, title, body, parent_id, user_created_time, user_updated_time) VALUES (?, ?, ?, ?, ?, ?)'
      );
      
      stmt.run(id, title, body, folderId, now, now);
      
      // Return the newly created note
      return {
        id,
        title,
        body,
        parent_id: folderId,
        user_created_time: now,
        user_updated_time: now
      };
    } catch (error) {
      console.error('Error creating new note:', error);
      return null;
    }
  }

  // Get all notes from the database
  public getAllNotes(): Note[] {
    try {
      const stmt = this.db.prepare(
        'SELECT id, title, body, parent_id, user_created_time, user_updated_time FROM notes'
      );
      return stmt.all() as Note[];
    } catch (error) {
      console.error('Error fetching notes:', error);
      return [];
    }
  }

  // Get a single note by ID
  public getNoteById(id: string): Note | null {
    try {
      const stmt = this.db.prepare(
        'SELECT id, title, body, parent_id, user_created_time, user_updated_time FROM notes WHERE id = ?'
      );
      return stmt.get(id) as Note || null;
    } catch (error) {
      console.error(`Error fetching note with ID ${id}:`, error);
      return null;
    }
  }

  // Update an existing note
  public updateNote(id: string, title: string, body: string): Note | null {
    try {
      const now = Date.now();
      
      // Check if the note exists
      const existingNote = this.getNoteById(id);
      if (!existingNote) {
        console.error(`Cannot update note: Note with ID ${id} not found`);
        return null;
      }
      
      // Update the note in the database
      const stmt = this.db.prepare(
        'UPDATE notes SET title = ?, body = ?, user_updated_time = ? WHERE id = ?'
      );
      
      const result = stmt.run(title, body, now, id);
      
      if (result.changes === 0) {
        console.error(`No changes made to note with ID ${id}`);
        return null;
      }
      
      // Return the updated note
      return {
        id,
        title,
        body,
        parent_id: existingNote.parent_id,
        user_created_time: existingNote.user_created_time,
        user_updated_time: now
      };
    } catch (error) {
      console.error(`Error updating note with ID ${id}:`, error);
      return null;
    }
  }

  // Create a new folder
  public createFolder(title: string, parentId: string = ''): Folder | null {
    try {
      // Generate a new UUID for the folder
      const id = require('crypto').randomUUID();
      const now = Date.now();
      
      // Insert the new folder into the database
      const stmt = this.db.prepare(
        'INSERT INTO folders (id, title, parent_id, created_time, updated_time, user_created_time, user_updated_time) VALUES (?, ?, ?, ?, ?, ?, ?)'
      );
      
      stmt.run(id, title, parentId, now, now, now, now);
      
      // Return the newly created folder
      return {
        id,
        title,
        parent_id: parentId,
        user_created_time: now,
        user_updated_time: now
      };
    } catch (error) {
      console.error('Error creating new folder:', error);
      return null;
    }
  }

  // Close the database connection
  public close(): void {
    try {
      if (this.db) {
        this.db.close();
        console.log('Database connection closed');
      }
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  }
}
