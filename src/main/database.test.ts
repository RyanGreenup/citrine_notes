import { DatabaseService, Note } from './database'
import * as crypto from 'crypto'

// Mock the better-sqlite3 module
jest.mock('better-sqlite3', () => {
  // Create mock implementation
  const mockPrepare = jest.fn()
  const mockGet = jest.fn()
  const mockAll = jest.fn()
  const mockRun = jest.fn()
  const mockExec = jest.fn()
  const mockClose = jest.fn()

  // Mock database constructor
  const mockDatabase = jest.fn().mockImplementation(() => ({
    prepare: mockPrepare,
    exec: mockExec,
    close: mockClose
  }))

  return mockDatabase
})

// Mock crypto for predictable UUIDs in tests
jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomUUID: jest.fn()
}))

describe('DatabaseService', () => {
  let dbService: DatabaseService
  const testDbPath = '/mock/test.db'

  // Initialize fresh database service before each test
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()

    // Mock Date.now() to return a fixed timestamp
    jest.spyOn(Date, 'now').mockReturnValue(1000000)

    // Mock UUID generation
    ;(crypto.randomUUID as jest.Mock).mockReturnValue('test-uuid-123')

    // Create a fake file system check to avoid the file not found error
    jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true)

    // Mock console methods to reduce test output noise
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})

    // Initialize the database service with the test database
    dbService = DatabaseService.getInstance(testDbPath)
  })

  afterEach(() => {
    jest.restoreAllMocks()

    // Reset the singleton instance
    // @ts-ignore: Accessing private static property for testing
    DatabaseService.instance = null
  })

  describe('getAllNotes', () => {
    it('should return an empty array when there are no notes', () => {
      // Arrange
      const mockDb = require('better-sqlite3')()
      const mockStatement = { all: jest.fn().mockReturnValue([]) }
      mockDb.prepare.mockReturnValue(mockStatement)

      // Act
      const notes = dbService.getAllNotes()

      // Assert
      expect(notes).toEqual([])
      expect(mockDb.prepare).toHaveBeenCalledWith(
        'SELECT id, title, body, parent_id, user_created_time, user_updated_time FROM notes'
      )
    })

    it('should return all notes in the database', () => {
      // Arrange
      const mockNotes = [
        {
          id: 'note-1',
          title: 'Note 1',
          body: 'Body 1',
          parent_id: 'folder-1',
          user_created_time: 1000000,
          user_updated_time: 1000000
        },
        {
          id: 'note-2',
          title: 'Note 2',
          body: 'Body 2',
          parent_id: 'folder-1',
          user_created_time: 1000000,
          user_updated_time: 1000000
        },
        {
          id: 'note-3',
          title: 'Note 3',
          body: 'Body 3',
          parent_id: 'folder-2',
          user_created_time: 1000000,
          user_updated_time: 1000000
        }
      ]

      const mockDb = require('better-sqlite3')()
      const mockStatement = { all: jest.fn().mockReturnValue(mockNotes) }
      mockDb.prepare.mockReturnValue(mockStatement)

      // Act
      const notes = dbService.getAllNotes()

      // Assert
      expect(notes).toEqual(mockNotes)
      expect(notes.length).toBe(3)
      expect(notes.map((note) => note.id)).toEqual(['note-1', 'note-2', 'note-3'])
      expect(notes.map((note) => note.title)).toEqual(['Note 1', 'Note 2', 'Note 3'])
    })

    it('should return an empty array when an error occurs', () => {
      // Arrange - create a scenario that will cause an error
      const mockDb = require('better-sqlite3')()
      mockDb.prepare.mockImplementation(() => {
        throw new Error('Database error')
      })

      // Act
      const notes = dbService.getAllNotes()

      // Assert
      expect(notes).toEqual([])
    })
  })

  describe('getNoteById', () => {
    it('should return null when note with given ID does not exist', () => {
      // Arrange
      const mockDb = require('better-sqlite3')()
      const mockStatement = { get: jest.fn().mockReturnValue(null) }
      mockDb.prepare.mockReturnValue(mockStatement)

      // Act
      const note = dbService.getNoteById('non-existent-id')

      // Assert
      expect(note).toBeNull()
      expect(mockDb.prepare).toHaveBeenCalledWith(
        'SELECT id, title, body, parent_id, user_created_time, user_updated_time FROM notes WHERE id = ?'
      )
      expect(mockStatement.get).toHaveBeenCalledWith('non-existent-id')
    })

    it('should return the note with the given ID', () => {
      // Arrange
      const mockNote = {
        id: 'specific-note-id',
        title: 'Test Note',
        body: 'Test Body',
        parent_id: 'folder-id',
        user_created_time: 1000000,
        user_updated_time: 1000000
      }

      const mockDb = require('better-sqlite3')()
      const mockStatement = { get: jest.fn().mockReturnValue(mockNote) }
      mockDb.prepare.mockReturnValue(mockStatement)

      // Act
      const note = dbService.getNoteById('specific-note-id')

      // Assert
      expect(note).not.toBeNull()
      expect(note).toEqual(mockNote)
      expect(mockStatement.get).toHaveBeenCalledWith('specific-note-id')
    })

    it('should return null when an error occurs', () => {
      // Arrange - create a scenario that will cause an error
      const mockDb = require('better-sqlite3')()
      mockDb.prepare.mockImplementation(() => {
        throw new Error('Database error')
      })

      // Act
      const note = dbService.getNoteById('any-id')

      // Assert
      expect(note).toBeNull()
    })
  })

  describe('createNote', () => {
    it('should create a new note with the provided title, body, and folder ID', () => {
      // Arrange
      const title = 'Test Note'
      const body = 'This is a test note'
      const folderId = 'folder-123'
      const mockDb = require('better-sqlite3')()
      const mockStatement = { run: jest.fn() }
      mockDb.prepare.mockReturnValue(mockStatement)

      // Act
      const result = dbService.createNote(title, body, folderId)

      // Assert
      expect(result).not.toBeNull()
      expect(result).toEqual({
        id: 'test-uuid-123',
        title: 'Test Note',
        body: 'This is a test note',
        parent_id: 'folder-123',
        user_created_time: 1000000,
        user_updated_time: 1000000
      })

      // Verify the SQL statement was prepared correctly
      expect(mockDb.prepare).toHaveBeenCalledWith(
        'INSERT INTO notes (id, title, body, parent_id, user_created_time, user_updated_time) VALUES (?, ?, ?, ?, ?, ?)'
      )

      // Verify the run method was called with the correct parameters
      expect(mockStatement.run).toHaveBeenCalledWith(
        'test-uuid-123',
        'Test Note',
        'This is a test note',
        'folder-123',
        1000000,
        1000000
      )
    })

    it('should create a note with empty folder ID when not specified', () => {
      // Arrange
      const title = 'Test Note'
      const body = 'This is a test note'
      const mockDb = require('better-sqlite3')()
      const mockStatement = { run: jest.fn() }
      mockDb.prepare.mockReturnValue(mockStatement)

      // Act
      const result = dbService.createNote(title, body)

      // Assert
      expect(result).not.toBeNull()
      expect(result).toEqual({
        id: 'test-uuid-123',
        title: 'Test Note',
        body: 'This is a test note',
        parent_id: '',
        user_created_time: 1000000,
        user_updated_time: 1000000
      })

      // Verify the run method was called with empty folder ID
      expect(mockStatement.run).toHaveBeenCalledWith(
        'test-uuid-123',
        'Test Note',
        'This is a test note',
        '',
        1000000,
        1000000
      )
    })

    it('should return null when an error occurs during note creation', () => {
      // Arrange - create a scenario that will cause an error
      const mockDb = require('better-sqlite3')()
      mockDb.prepare.mockImplementation(() => {
        throw new Error('Database error')
      })

      // Act
      const result = dbService.createNote('Title', 'Body')

      // Assert
      expect(result).toBeNull()
    })

    it('should generate a unique ID for each note', () => {
      // Arrange
      ;(crypto.randomUUID as jest.Mock).mockReturnValueOnce('uuid-1').mockReturnValueOnce('uuid-2')

      const mockDb = require('better-sqlite3')()
      const mockStatement = { run: jest.fn() }
      mockDb.prepare.mockReturnValue(mockStatement)

      // Act
      const note1 = dbService.createNote('Note 1', 'Body 1', 'folder-1')
      const note2 = dbService.createNote('Note 2', 'Body 2', 'folder-2')

      // Assert
      expect(note1?.id).toBe('uuid-1')
      expect(note2?.id).toBe('uuid-2')

      // Verify the run method was called with different IDs
      expect(mockStatement.run).toHaveBeenNthCalledWith(
        1,
        'uuid-1',
        'Note 1',
        'Body 1',
        'folder-1',
        1000000,
        1000000
      )
      expect(mockStatement.run).toHaveBeenNthCalledWith(
        2,
        'uuid-2',
        'Note 2',
        'Body 2',
        'folder-2',
        1000000,
        1000000
      )
    })
  })

  describe('createFolder', () => {
    it('should create a new folder with the provided title', () => {
      // Arrange
      const title = 'Test Folder'
      const mockDb = require('better-sqlite3')()
      const mockStatement = { run: jest.fn() }
      mockDb.prepare.mockReturnValue(mockStatement)

      // Act
      const result = dbService.createFolder(title)

      // Assert
      expect(result).not.toBeNull()
      expect(result).toEqual({
        id: 'test-uuid-123',
        title: 'Test Folder',
        parent_id: '',
        user_created_time: 1000000,
        user_updated_time: 1000000
      })

      // Verify the SQL statement was prepared correctly
      expect(mockDb.prepare).toHaveBeenCalledWith(
        'INSERT INTO folders (id, title, parent_id, created_time, updated_time, user_created_time, user_updated_time) VALUES (?, ?, ?, ?, ?, ?, ?)'
      )

      // Verify the run method was called with the correct parameters
      expect(mockStatement.run).toHaveBeenCalledWith(
        'test-uuid-123',
        'Test Folder',
        '',
        1000000,
        1000000,
        1000000,
        1000000
      )
    })

    it('should create a folder with a parent folder ID when provided', () => {
      // Arrange
      const title = 'Child Folder'
      const parentId = 'parent-folder-id'
      const mockDb = require('better-sqlite3')()
      const mockStatement = { run: jest.fn() }
      mockDb.prepare.mockReturnValue(mockStatement)

      // Act
      const result = dbService.createFolder(title, parentId)

      // Assert
      expect(result).not.toBeNull()
      expect(result).toEqual({
        id: 'test-uuid-123',
        title: 'Child Folder',
        parent_id: 'parent-folder-id',
        user_created_time: 1000000,
        user_updated_time: 1000000
      })

      // Verify the run method was called with the parent ID
      expect(mockStatement.run).toHaveBeenCalledWith(
        'test-uuid-123',
        'Child Folder',
        'parent-folder-id',
        1000000,
        1000000,
        1000000,
        1000000
      )
    })

    it('should return null when an error occurs during folder creation', () => {
      // Arrange - create a scenario that will cause an error
      const mockDb = require('better-sqlite3')()
      mockDb.prepare.mockImplementation(() => {
        throw new Error('Database error')
      })

      // Act
      const result = dbService.createFolder('Error Folder')

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('deleteNote', () => {
    it('should delete a note when it exists', () => {
      // Arrange
      const noteId = 'note-to-delete'
      const mockDb = require('better-sqlite3')()

      // Mock getNoteById to return a note
      const mockNote = {
        id: noteId,
        title: 'Note to Delete',
        body: 'This note will be deleted',
        parent_id: 'folder-1',
        user_created_time: 1000000,
        user_updated_time: 1000000
      }

      // First prepare call is for getNoteById
      const mockGetStatement = { get: jest.fn().mockReturnValue(mockNote) }
      // Second prepare call is for the DELETE statement
      const mockDeleteStatement = { run: jest.fn().mockReturnValue({ changes: 1 }) }

      mockDb.prepare.mockReturnValueOnce(mockGetStatement).mockReturnValueOnce(mockDeleteStatement)

      // Act
      const result = dbService.deleteNote(noteId)

      // Assert
      expect(result).toBe(true)
      expect(mockDb.prepare).toHaveBeenNthCalledWith(
        1,
        'SELECT id, title, body, parent_id, user_created_time, user_updated_time FROM notes WHERE id = ?'
      )
      expect(mockGetStatement.get).toHaveBeenCalledWith(noteId)
      expect(mockDb.prepare).toHaveBeenNthCalledWith(2, 'DELETE FROM notes WHERE id = ?')
      expect(mockDeleteStatement.run).toHaveBeenCalledWith(noteId)
    })

    it('should return false when the note does not exist', () => {
      // Arrange
      const noteId = 'non-existent-note'
      const mockDb = require('better-sqlite3')()

      // Mock getNoteById to return null (note not found)
      const mockGetStatement = { get: jest.fn().mockReturnValue(null) }
      mockDb.prepare.mockReturnValue(mockGetStatement)

      // Act
      const result = dbService.deleteNote(noteId)

      // Assert
      expect(result).toBe(false)
      expect(mockDb.prepare).toHaveBeenCalledWith(
        'SELECT id, title, body, parent_id, user_created_time, user_updated_time FROM notes WHERE id = ?'
      )
      expect(mockGetStatement.get).toHaveBeenCalledWith(noteId)
      // The DELETE statement should not be prepared or executed
      expect(mockDb.prepare).toHaveBeenCalledTimes(1)
    })

    it('should return false when no rows are affected by the delete operation', () => {
      // Arrange
      const noteId = 'note-not-deleted'
      const mockDb = require('better-sqlite3')()

      // Mock getNoteById to return a note
      const mockNote = {
        id: noteId,
        title: 'Note Not Deleted',
        body: 'This note will not be deleted',
        parent_id: 'folder-1',
        user_created_time: 1000000,
        user_updated_time: 1000000
      }

      // First prepare call is for getNoteById
      const mockGetStatement = { get: jest.fn().mockReturnValue(mockNote) }
      // Second prepare call is for the DELETE statement, but no rows affected
      const mockDeleteStatement = { run: jest.fn().mockReturnValue({ changes: 0 }) }

      mockDb.prepare.mockReturnValueOnce(mockGetStatement).mockReturnValueOnce(mockDeleteStatement)

      // Act
      const result = dbService.deleteNote(noteId)

      // Assert
      expect(result).toBe(false)
      expect(mockDeleteStatement.run).toHaveBeenCalledWith(noteId)
    })

    it('should return false when an error occurs during deletion', () => {
      // Arrange
      const noteId = 'error-note'
      const mockDb = require('better-sqlite3')()

      // Mock getNoteById to return a note
      const mockNote = {
        id: noteId,
        title: 'Error Note',
        body: 'This note will cause an error',
        parent_id: 'folder-1',
        user_created_time: 1000000,
        user_updated_time: 1000000
      }

      // First prepare call is for getNoteById
      const mockGetStatement = { get: jest.fn().mockReturnValue(mockNote) }

      // Second prepare call throws an error
      mockDb.prepare.mockReturnValueOnce(mockGetStatement).mockImplementationOnce(() => {
        throw new Error('Database error during deletion')
      })

      // Act
      const result = dbService.deleteNote(noteId)

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('updateFolder', () => {
    it('should update a folder title when the folder exists', () => {
      // Arrange
      const folderId = 'folder-to-update'
      const newTitle = 'Updated Folder Title'
      const mockDb = require('better-sqlite3')()

      // Mock getFolderById to return a folder
      const mockFolder = {
        id: folderId,
        title: 'Original Folder Title',
        parent_id: 'parent-folder-id',
        user_created_time: 1000000,
        user_updated_time: 1000000
      }

      // First prepare call is for getFolderById
      const mockGetStatement = { get: jest.fn().mockReturnValue(mockFolder) }
      // Second prepare call is for the UPDATE statement
      const mockUpdateStatement = { run: jest.fn().mockReturnValue({ changes: 1 }) }

      mockDb.prepare.mockReturnValueOnce(mockGetStatement).mockReturnValueOnce(mockUpdateStatement)

      // Act
      const result = dbService.updateFolder(folderId, newTitle)

      // Assert
      expect(result).not.toBeNull()
      expect(result).toEqual({
        id: folderId,
        title: newTitle,
        parent_id: 'parent-folder-id',
        user_created_time: 1000000,
        user_updated_time: 1000000
      })

      expect(mockDb.prepare).toHaveBeenNthCalledWith(
        1,
        'SELECT id, title, parent_id, user_created_time, user_updated_time FROM folders WHERE id = ?'
      )
      expect(mockGetStatement.get).toHaveBeenCalledWith(folderId)

      expect(mockDb.prepare).toHaveBeenNthCalledWith(
        2,
        'UPDATE folders SET title = ?, updated_time = ?, user_updated_time = ? WHERE id = ?'
      )
      expect(mockUpdateStatement.run).toHaveBeenCalledWith(newTitle, 1000000, 1000000, folderId)
    })

    it('should return null when the folder does not exist', () => {
      // Arrange
      const folderId = 'non-existent-folder'
      const newTitle = 'New Title'
      const mockDb = require('better-sqlite3')()

      // Mock getFolderById to return null (folder not found)
      const mockGetStatement = { get: jest.fn().mockReturnValue(null) }
      mockDb.prepare.mockReturnValue(mockGetStatement)

      // Act
      const result = dbService.updateFolder(folderId, newTitle)

      // Assert
      expect(result).toBeNull()
      expect(mockDb.prepare).toHaveBeenCalledWith(
        'SELECT id, title, parent_id, user_created_time, user_updated_time FROM folders WHERE id = ?'
      )
      expect(mockGetStatement.get).toHaveBeenCalledWith(folderId)
      // The UPDATE statement should not be prepared or executed
      expect(mockDb.prepare).toHaveBeenCalledTimes(1)
    })

    it('should return null when no rows are affected by the update operation', () => {
      // Arrange
      const folderId = 'folder-not-updated'
      const newTitle = 'New Title'
      const mockDb = require('better-sqlite3')()

      // Mock getFolderById to return a folder
      const mockFolder = {
        id: folderId,
        title: 'Original Title',
        parent_id: 'parent-folder-id',
        user_created_time: 1000000,
        user_updated_time: 1000000
      }

      // First prepare call is for getFolderById
      const mockGetStatement = { get: jest.fn().mockReturnValue(mockFolder) }
      // Second prepare call is for the UPDATE statement, but no rows affected
      const mockUpdateStatement = { run: jest.fn().mockReturnValue({ changes: 0 }) }

      mockDb.prepare.mockReturnValueOnce(mockGetStatement).mockReturnValueOnce(mockUpdateStatement)

      // Act
      const result = dbService.updateFolder(folderId, newTitle)

      // Assert
      expect(result).toBeNull()
      expect(mockUpdateStatement.run).toHaveBeenCalledWith(newTitle, 1000000, 1000000, folderId)
    })

    it('should return null when an error occurs during update', () => {
      // Arrange
      const folderId = 'error-folder'
      const newTitle = 'Error Title'
      const mockDb = require('better-sqlite3')()

      // Mock getFolderById to return a folder
      const mockFolder = {
        id: folderId,
        title: 'Original Title',
        parent_id: 'parent-folder-id',
        user_created_time: 1000000,
        user_updated_time: 1000000
      }

      // First prepare call is for getFolderById
      const mockGetStatement = { get: jest.fn().mockReturnValue(mockFolder) }

      // Second prepare call throws an error
      mockDb.prepare.mockReturnValueOnce(mockGetStatement).mockImplementationOnce(() => {
        throw new Error('Database error during update')
      })

      // Act
      const result = dbService.updateFolder(folderId, newTitle)

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('moveFolder', () => {
    it('should change the parent_id of a folder when the folder exists', () => {
      // Arrange
      const folderId = 'folder-to-move'
      const newParentId = 'new-parent-folder'
      const mockDb = require('better-sqlite3')()

      // Mock getFolderById to return a folder
      const mockFolder = {
        id: folderId,
        title: 'Folder to Move',
        parent_id: 'old-parent-folder',
        user_created_time: 1000000,
        user_updated_time: 1000000
      }

      // First prepare call is for getFolderById
      const mockGetStatement = { get: jest.fn().mockReturnValue(mockFolder) }
      // Second prepare call is for the UPDATE statement
      const mockUpdateStatement = { run: jest.fn().mockReturnValue({ changes: 1 }) }

      mockDb.prepare.mockReturnValueOnce(mockGetStatement).mockReturnValueOnce(mockUpdateStatement)

      // Act
      const result = dbService.moveFolder(folderId, newParentId)

      // Assert
      expect(result).not.toBeNull()
      expect(result).toEqual({
        id: folderId,
        title: 'Folder to Move',
        parent_id: newParentId,
        user_created_time: 1000000,
        user_updated_time: 1000000
      })

      expect(mockDb.prepare).toHaveBeenNthCalledWith(
        1,
        'SELECT id, title, parent_id, user_created_time, user_updated_time FROM folders WHERE id = ?'
      )
      expect(mockGetStatement.get).toHaveBeenCalledWith(folderId)

      expect(mockDb.prepare).toHaveBeenNthCalledWith(
        2,
        'UPDATE folders SET parent_id = ?, updated_time = ?, user_updated_time = ? WHERE id = ?'
      )
      expect(mockUpdateStatement.run).toHaveBeenCalledWith(newParentId, 1000000, 1000000, folderId)
    })

    it('should allow moving a folder to the root level by passing empty parent_id', () => {
      // Arrange
      const folderId = 'folder-to-root'
      const newParentId = '' // Empty string for root level
      const mockDb = require('better-sqlite3')()

      // Mock getFolderById to return a folder
      const mockFolder = {
        id: folderId,
        title: 'Folder to Root',
        parent_id: 'some-parent-folder',
        user_created_time: 1000000,
        user_updated_time: 1000000
      }

      // First prepare call is for getFolderById
      const mockGetStatement = { get: jest.fn().mockReturnValue(mockFolder) }
      // Second prepare call is for the UPDATE statement
      const mockUpdateStatement = { run: jest.fn().mockReturnValue({ changes: 1 }) }

      mockDb.prepare.mockReturnValueOnce(mockGetStatement).mockReturnValueOnce(mockUpdateStatement)

      // Act
      const result = dbService.moveFolder(folderId, newParentId)

      // Assert
      expect(result).not.toBeNull()
      expect(result.parent_id).toBe('')
      expect(mockUpdateStatement.run).toHaveBeenCalledWith('', 1000000, 1000000, folderId)
    })

    it('should return null when the folder does not exist', () => {
      // Arrange
      const folderId = 'non-existent-folder'
      const newParentId = 'some-parent'
      const mockDb = require('better-sqlite3')()

      // Mock getFolderById to return null (folder not found)
      const mockGetStatement = { get: jest.fn().mockReturnValue(null) }
      mockDb.prepare.mockReturnValue(mockGetStatement)

      // Act
      const result = dbService.moveFolder(folderId, newParentId)

      // Assert
      expect(result).toBeNull()
      expect(mockDb.prepare).toHaveBeenCalledWith(
        'SELECT id, title, parent_id, user_created_time, user_updated_time FROM folders WHERE id = ?'
      )
      expect(mockGetStatement.get).toHaveBeenCalledWith(folderId)
      // The UPDATE statement should not be prepared or executed
      expect(mockDb.prepare).toHaveBeenCalledTimes(1)
    })

    it('should return null when no rows are affected by the move operation', () => {
      // Arrange
      const folderId = 'folder-not-moved'
      const newParentId = 'new-parent'
      const mockDb = require('better-sqlite3')()

      // Mock getFolderById to return a folder
      const mockFolder = {
        id: folderId,
        title: 'Folder Not Moved',
        parent_id: 'old-parent',
        user_created_time: 1000000,
        user_updated_time: 1000000
      }

      // First prepare call is for getFolderById
      const mockGetStatement = { get: jest.fn().mockReturnValue(mockFolder) }
      // Second prepare call is for the UPDATE statement, but no rows affected
      const mockUpdateStatement = { run: jest.fn().mockReturnValue({ changes: 0 }) }

      mockDb.prepare.mockReturnValueOnce(mockGetStatement).mockReturnValueOnce(mockUpdateStatement)

      // Act
      const result = dbService.moveFolder(folderId, newParentId)

      // Assert
      expect(result).toBeNull()
      expect(mockUpdateStatement.run).toHaveBeenCalledWith(newParentId, 1000000, 1000000, folderId)
    })

    it('should return null when an error occurs during the move operation', () => {
      // Arrange
      const folderId = 'error-folder'
      const newParentId = 'error-parent'
      const mockDb = require('better-sqlite3')()

      // Mock getFolderById to return a folder
      const mockFolder = {
        id: folderId,
        title: 'Error Folder',
        parent_id: 'old-parent',
        user_created_time: 1000000,
        user_updated_time: 1000000
      }

      // First prepare call is for getFolderById
      const mockGetStatement = { get: jest.fn().mockReturnValue(mockFolder) }

      // Second prepare call throws an error
      mockDb.prepare.mockReturnValueOnce(mockGetStatement).mockImplementationOnce(() => {
        throw new Error('Database error during move operation')
      })

      // Act
      const result = dbService.moveFolder(folderId, newParentId)

      // Assert
      expect(result).toBeNull()
    })

    it('should prevent moving a folder to be its own parent', () => {
      // Arrange
      const folderId = 'self-parent-folder'
      const newParentId = folderId // Same as folder ID
      const mockDb = require('better-sqlite3')()

      // Mock getFolderById to return a folder
      const mockFolder = {
        id: folderId,
        title: 'Self Parent Folder',
        parent_id: 'old-parent',
        user_created_time: 1000000,
        user_updated_time: 1000000
      }

      const mockGetStatement = { get: jest.fn().mockReturnValue(mockFolder) }
      mockDb.prepare.mockReturnValue(mockGetStatement)

      // Act
      const result = dbService.moveFolder(folderId, newParentId)

      // Assert
      expect(result).toBeNull()
      // The UPDATE statement should not be prepared or executed
      expect(mockDb.prepare).toHaveBeenCalledTimes(1)
    })
  })

  describe('moveNote', () => {
    it('should move a note to a new parent folder', () => {
      // Arrange
      const noteId = 'note-to-move'
      const newFolderId = 'new-parent-folder'
      const mockDb = require('better-sqlite3')()

      // Mock getNoteById to return a note
      const mockNote = {
        id: noteId,
        title: 'Note to Move',
        body: 'This note will be moved',
        parent_id: 'old-parent-folder',
        user_created_time: 1000000,
        user_updated_time: 1000000
      }

      // First prepare call is for getNoteById
      const mockGetStatement = { get: jest.fn().mockReturnValue(mockNote) }
      // Second prepare call is for the UPDATE statement
      const mockUpdateStatement = { run: jest.fn().mockReturnValue({ changes: 1 }) }

      mockDb.prepare.mockReturnValueOnce(mockGetStatement).mockReturnValueOnce(mockUpdateStatement)

      // Act
      const result = dbService.moveNote(noteId, newFolderId)

      // Assert
      expect(result).not.toBeNull()
      expect(result).toEqual({
        id: noteId,
        title: 'Note to Move',
        body: 'This note will be moved',
        parent_id: newFolderId,
        user_created_time: 1000000,
        user_updated_time: 1000000
      })

      expect(mockDb.prepare).toHaveBeenNthCalledWith(
        1,
        'SELECT id, title, body, parent_id, user_created_time, user_updated_time FROM notes WHERE id = ?'
      )
      expect(mockGetStatement.get).toHaveBeenCalledWith(noteId)

      expect(mockDb.prepare).toHaveBeenNthCalledWith(
        2,
        'UPDATE notes SET parent_id = ?, user_updated_time = ? WHERE id = ?'
      )
      expect(mockUpdateStatement.run).toHaveBeenCalledWith(newFolderId, 1000000, noteId)
    })

    it('should return null when the note does not exist', () => {
      // Arrange
      const noteId = 'non-existent-note'
      const newFolderId = 'some-folder'
      const mockDb = require('better-sqlite3')()

      // Mock getNoteById to return null (note not found)
      const mockGetStatement = { get: jest.fn().mockReturnValue(null) }
      mockDb.prepare.mockReturnValue(mockGetStatement)

      // Act
      const result = dbService.moveNote(noteId, newFolderId)

      // Assert
      expect(result).toBeNull()
      expect(mockDb.prepare).toHaveBeenCalledWith(
        'SELECT id, title, body, parent_id, user_created_time, user_updated_time FROM notes WHERE id = ?'
      )
      expect(mockGetStatement.get).toHaveBeenCalledWith(noteId)
      // The UPDATE statement should not be prepared or executed
      expect(mockDb.prepare).toHaveBeenCalledTimes(1)
    })

    it('should return null when no rows are affected by the move operation', () => {
      // Arrange
      const noteId = 'note-not-moved'
      const newFolderId = 'new-folder'
      const mockDb = require('better-sqlite3')()

      // Mock getNoteById to return a note
      const mockNote = {
        id: noteId,
        title: 'Note Not Moved',
        body: 'This note will not be moved',
        parent_id: 'old-folder',
        user_created_time: 1000000,
        user_updated_time: 1000000
      }

      // First prepare call is for getNoteById
      const mockGetStatement = { get: jest.fn().mockReturnValue(mockNote) }
      // Second prepare call is for the UPDATE statement, but no rows affected
      const mockUpdateStatement = { run: jest.fn().mockReturnValue({ changes: 0 }) }

      mockDb.prepare.mockReturnValueOnce(mockGetStatement).mockReturnValueOnce(mockUpdateStatement)

      // Act
      const result = dbService.moveNote(noteId, newFolderId)

      // Assert
      expect(result).toBeNull()
      expect(mockUpdateStatement.run).toHaveBeenCalledWith(newFolderId, 1000000, noteId)
    })

    it('should return null when an error occurs during the move operation', () => {
      // Arrange
      const noteId = 'error-note'
      const newFolderId = 'error-folder'
      const mockDb = require('better-sqlite3')()

      // Mock getNoteById to return a note
      const mockNote = {
        id: noteId,
        title: 'Error Note',
        body: 'This note will cause an error',
        parent_id: 'old-folder',
        user_created_time: 1000000,
        user_updated_time: 1000000
      }

      // First prepare call is for getNoteById
      const mockGetStatement = { get: jest.fn().mockReturnValue(mockNote) }

      // Second prepare call throws an error
      mockDb.prepare.mockReturnValueOnce(mockGetStatement).mockImplementationOnce(() => {
        throw new Error('Database error during move operation')
      })

      // Act
      const result = dbService.moveNote(noteId, newFolderId)

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('getNotesByFolderId', () => {
    it('should return all notes in a specific folder', () => {
      // Arrange
      const folderId = 'test-folder-id'
      const mockNotes = [
        {
          id: 'note-1',
          title: 'Note 1',
          body: 'Body 1',
          parent_id: folderId,
          user_created_time: 1000000,
          user_updated_time: 1000000
        },
        {
          id: 'note-2',
          title: 'Note 2',
          body: 'Body 2',
          parent_id: folderId,
          user_created_time: 1000000,
          user_updated_time: 1000000
        }
      ]

      const mockDb = require('better-sqlite3')()
      const mockStatement = { all: jest.fn().mockReturnValue(mockNotes) }
      mockDb.prepare.mockReturnValue(mockStatement)

      // Act
      const notes = dbService.getNotesByFolderId(folderId)

      // Assert
      expect(notes).toEqual(mockNotes)
      expect(notes.length).toBe(2)
      expect(mockDb.prepare).toHaveBeenCalledWith(
        'SELECT id, title, body, parent_id, user_created_time, user_updated_time FROM notes WHERE parent_id = ?'
      )
      expect(mockStatement.all).toHaveBeenCalledWith(folderId)
    })

    it('should return an empty array when no notes exist in the folder', () => {
      // Arrange
      const folderId = 'empty-folder-id'
      const mockDb = require('better-sqlite3')()
      const mockStatement = { all: jest.fn().mockReturnValue([]) }
      mockDb.prepare.mockReturnValue(mockStatement)

      // Act
      const notes = dbService.getNotesByFolderId(folderId)

      // Assert
      expect(notes).toEqual([])
      expect(notes.length).toBe(0)
      expect(mockStatement.all).toHaveBeenCalledWith(folderId)
    })

    it('should return an empty array when an error occurs', () => {
      // Arrange
      const folderId = 'error-folder-id'
      const mockDb = require('better-sqlite3')()
      mockDb.prepare.mockImplementation(() => {
        throw new Error('Database error')
      })

      // Act
      const notes = dbService.getNotesByFolderId(folderId)

      // Assert
      expect(notes).toEqual([])
      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('buildNoteTree', () => {
    it('should build a tree structure from flat lists of notes and folders', () => {
      // Arrange
      // Mock folders data
      const mockFolders = [
        { id: 'folder1', title: 'Root Folder 1', parent_id: '' },
        { id: 'folder2', title: 'Root Folder 2', parent_id: '' },
        { id: 'subfolder1', title: 'Subfolder 1', parent_id: 'folder1' },
        { id: 'subfolder2', title: 'Subfolder 2', parent_id: 'folder1' }
      ]

      // Mock notes data
      const mockNotes = [
        { id: 'note1', title: 'Root Note 1', parent_id: '' },
        { id: 'note2', title: 'Folder Note 1', parent_id: 'folder1' },
        { id: 'note3', title: 'Subfolder Note 1', parent_id: 'subfolder1' },
        { id: 'note4', title: 'Folder Note 2', parent_id: 'folder2' }
      ]

      // Expected tree structure
      const expectedTree = {
        id: 'ROOT',
        name: '',
        children: [
          {
            id: 'folder1',
            name: 'Root Folder 1',
            children: [
              {
                id: 'subfolder1',
                name: 'Subfolder 1',
                children: [
                  {
                    id: 'note3',
                    name: 'Subfolder Note 1'
                  }
                ]
              },
              {
                id: 'subfolder2',
                name: 'Subfolder 2'
              },
              {
                id: 'note2',
                name: 'Folder Note 1'
              }
            ]
          },
          {
            id: 'folder2',
            name: 'Root Folder 2',
            children: [
              {
                id: 'note4',
                name: 'Folder Note 2'
              }
            ]
          },
          {
            id: 'note1',
            name: 'Root Note 1'
          }
        ]
      }

      // Mock database methods to return our test data
      const mockDb = require('better-sqlite3')()

      // Mock for getAllFolders (we'll need to implement this)
      const mockFoldersStatement = { all: jest.fn().mockReturnValue(mockFolders) }

      // Mock for getAllNotes
      const mockNotesStatement = { all: jest.fn().mockReturnValue(mockNotes) }

      mockDb.prepare
        .mockReturnValueOnce(mockFoldersStatement)
        .mockReturnValueOnce(mockNotesStatement)

      // Act
      const tree = dbService.buildNoteTree()

      // Assert
      expect(tree).toEqual(expectedTree)

      // Verify the database was queried for folders and notes
      expect(mockDb.prepare).toHaveBeenNthCalledWith(1, 'SELECT id, title, parent_id FROM folders')
      expect(mockFoldersStatement.all).toHaveBeenCalled()

      expect(mockDb.prepare).toHaveBeenNthCalledWith(2, 'SELECT id, title, parent_id FROM notes')
      expect(mockNotesStatement.all).toHaveBeenCalled()
    })

    it('should handle empty database with no notes or folders', () => {
      // Arrange
      const mockFolders: any[] = []
      const mockNotes: any[] = []

      // Expected tree structure with just the root
      const expectedTree = {
        id: 'ROOT',
        name: '',
        children: []
      }

      // Mock database methods to return empty arrays
      const mockDb = require('better-sqlite3')()
      const mockFoldersStatement = { all: jest.fn().mockReturnValue(mockFolders) }
      const mockNotesStatement = { all: jest.fn().mockReturnValue(mockNotes) }

      mockDb.prepare
        .mockReturnValueOnce(mockFoldersStatement)
        .mockReturnValueOnce(mockNotesStatement)

      // Act
      const tree = dbService.buildNoteTree()

      // Assert
      expect(tree).toEqual(expectedTree)
    })

    it('should handle circular references in folder structure', () => {
      // Arrange - create a circular reference in folders
      const mockFolders = [
        { id: 'folder1', title: 'Folder 1', parent_id: 'folder2' },
        { id: 'folder2', title: 'Folder 2', parent_id: 'folder1' } // Circular reference
      ]

      const mockNotes = [{ id: 'note1', title: 'Note 1', parent_id: 'folder1' }]

      // Expected tree - both folders should be at root level to break the circular reference
      const expectedTree = {
        id: 'ROOT',
        name: '',
        children: [
          {
            id: 'folder1',
            name: 'Folder 1',
            children: [
              {
                id: 'note1',
                name: 'Note 1'
              }
            ]
          },
          {
            id: 'folder2',
            name: 'Folder 2'
          }
        ]
      }

      // Mock database methods
      const mockDb = require('better-sqlite3')()
      const mockFoldersStatement = { all: jest.fn().mockReturnValue(mockFolders) }
      const mockNotesStatement = { all: jest.fn().mockReturnValue(mockNotes) }

      mockDb.prepare
        .mockReturnValueOnce(mockFoldersStatement)
        .mockReturnValueOnce(mockNotesStatement)

      // Act
      const tree = dbService.buildNoteTree()

      // Assert
      expect(tree).toEqual(expectedTree)
    })

    it('should handle notes with non-existent parent folders', () => {
      // Arrange
      const mockFolders = [{ id: 'folder1', title: 'Folder 1', parent_id: '' }]

      const mockNotes = [{ id: 'note1', title: 'Note 1', parent_id: 'non-existent-folder' }]

      // Expected tree - note with non-existent parent should be at root level
      const expectedTree = {
        id: 'ROOT',
        name: '',
        children: [
          {
            id: 'folder1',
            name: 'Folder 1'
          },
          {
            id: 'note1',
            name: 'Note 1'
          }
        ]
      }

      // Mock database methods
      const mockDb = require('better-sqlite3')()
      const mockFoldersStatement = { all: jest.fn().mockReturnValue(mockFolders) }
      const mockNotesStatement = { all: jest.fn().mockReturnValue(mockNotes) }

      mockDb.prepare
        .mockReturnValueOnce(mockFoldersStatement)
        .mockReturnValueOnce(mockNotesStatement)

      // Act
      const tree = dbService.buildNoteTree()

      // Assert
      expect(tree).toEqual(expectedTree)
    })
  })

  describe('getTagById', () => {
    it('should return null when tag with given ID does not exist', () => {
      // Arrange
      const mockDb = require('better-sqlite3')()
      const mockStatement = { get: jest.fn().mockReturnValue(null) }
      mockDb.prepare.mockReturnValue(mockStatement)

      // Act
      const tag = dbService.getTagById('non-existent-id')

      // Assert
      expect(tag).toBeNull()
      expect(mockDb.prepare).toHaveBeenCalledWith(
        'SELECT id, title, parent_id, user_created_time, user_updated_time FROM tags WHERE id = ?'
      )
      expect(mockStatement.get).toHaveBeenCalledWith('non-existent-id')
    })

    it('should return the tag with the given ID', () => {
      // Arrange
      const mockTag = {
        id: 'specific-tag-id',
        title: 'Test Tag',
        parent_id: 'parent-tag-id',
        user_created_time: 1000000,
        user_updated_time: 1000000
      }

      const mockDb = require('better-sqlite3')()
      const mockStatement = { get: jest.fn().mockReturnValue(mockTag) }
      mockDb.prepare.mockReturnValue(mockStatement)

      // Act
      const tag = dbService.getTagById('specific-tag-id')

      // Assert
      expect(tag).not.toBeNull()
      expect(tag).toEqual(mockTag)
      expect(mockStatement.get).toHaveBeenCalledWith('specific-tag-id')
    })

    it('should return null when an error occurs', () => {
      // Arrange - create a scenario that will cause an error
      const mockDb = require('better-sqlite3')()
      mockDb.prepare.mockImplementation(() => {
        throw new Error('Database error')
      })

      // Act
      const tag = dbService.getTagById('any-id')

      // Assert
      expect(tag).toBeNull()
      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('getAllTags', () => {
    it('should return all tags in the database', () => {
      // Arrange
      const mockTags = [
        {
          id: 'tag-1',
          title: 'Tag 1',
          parent_id: '',
          user_created_time: 1000000,
          user_updated_time: 1000000
        },
        {
          id: 'tag-2',
          title: 'Tag 2',
          parent_id: '',
          user_created_time: 1000000,
          user_updated_time: 1000000
        },
        {
          id: 'tag-3',
          title: 'Child Tag',
          parent_id: 'tag-1',
          user_created_time: 1000000,
          user_updated_time: 1000000
        }
      ];
      
      const mockDb = require('better-sqlite3')();
      const mockStatement = { all: jest.fn().mockReturnValue(mockTags) };
      mockDb.prepare.mockReturnValue(mockStatement);
      
      // Act
      const tags = dbService.getAllTags();
      
      // Assert
      expect(tags).toEqual(mockTags);
      expect(tags.length).toBe(3);
      expect(mockDb.prepare).toHaveBeenCalledWith(
        'SELECT id, title, parent_id, user_created_time, user_updated_time FROM tags'
      );
    });
    
    it('should return an empty array when there are no tags', () => {
      // Arrange
      const mockDb = require('better-sqlite3')();
      const mockStatement = { all: jest.fn().mockReturnValue([]) };
      mockDb.prepare.mockReturnValue(mockStatement);
      
      // Act
      const tags = dbService.getAllTags();
      
      // Assert
      expect(tags).toEqual([]);
      expect(tags.length).toBe(0);
    });
    
    it('should return an empty array when an error occurs', () => {
      // Arrange
      const mockDb = require('better-sqlite3')();
      mockDb.prepare.mockImplementation(() => {
        throw new Error('Database error');
      });
      
      // Act
      const tags = dbService.getAllTags();
      
      // Assert
      expect(tags).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('updateTag', () => {
    it('should update a tag title when the tag exists', () => {
      // Arrange
      const tagId = 'tag-to-update';
      const newTitle = 'Updated Tag Title';
      const mockDb = require('better-sqlite3')();
      
      // Mock getTagById to return a tag
      const mockTag = {
        id: tagId,
        title: 'Original Tag Title',
        parent_id: 'parent-tag-id',
        user_created_time: 1000000,
        user_updated_time: 1000000
      };
      
      // First prepare call is for getTagById
      const mockGetStatement = { get: jest.fn().mockReturnValue(mockTag) };
      // Second prepare call is for the UPDATE statement
      const mockUpdateStatement = { run: jest.fn().mockReturnValue({ changes: 1 }) };
      
      mockDb.prepare
        .mockReturnValueOnce(mockGetStatement)
        .mockReturnValueOnce(mockUpdateStatement);
      
      // Act
      const result = dbService.updateTag(tagId, newTitle);
      
      // Assert
      expect(result).not.toBeNull();
      expect(result).toEqual({
        id: tagId,
        title: newTitle,
        parent_id: 'parent-tag-id',
        user_created_time: 1000000,
        user_updated_time: 1000000
      });
      
      expect(mockDb.prepare).toHaveBeenNthCalledWith(
        1, 'SELECT id, title, parent_id, user_created_time, user_updated_time FROM tags WHERE id = ?'
      );
      expect(mockGetStatement.get).toHaveBeenCalledWith(tagId);
      
      expect(mockDb.prepare).toHaveBeenNthCalledWith(
        2, 'UPDATE tags SET title = ?, updated_time = ?, user_updated_time = ? WHERE id = ?'
      );
      expect(mockUpdateStatement.run).toHaveBeenCalledWith(newTitle, 1000000, 1000000, tagId);
    });
    
    it('should return null when the tag does not exist', () => {
      // Arrange
      const tagId = 'non-existent-tag';
      const newTitle = 'New Title';
      const mockDb = require('better-sqlite3')();
      
      // Mock getTagById to return null (tag not found)
      const mockGetStatement = { get: jest.fn().mockReturnValue(null) };
      mockDb.prepare.mockReturnValue(mockGetStatement);
      
      // Act
      const result = dbService.updateTag(tagId, newTitle);
      
      // Assert
      expect(result).toBeNull();
      expect(mockDb.prepare).toHaveBeenCalledWith(
        'SELECT id, title, parent_id, user_created_time, user_updated_time FROM tags WHERE id = ?'
      );
      expect(mockGetStatement.get).toHaveBeenCalledWith(tagId);
      // The UPDATE statement should not be prepared or executed
      expect(mockDb.prepare).toHaveBeenCalledTimes(1);
    });
    
    it('should return null when no rows are affected by the update operation', () => {
      // Arrange
      const tagId = 'tag-not-updated';
      const newTitle = 'New Title';
      const mockDb = require('better-sqlite3')();
      
      // Mock getTagById to return a tag
      const mockTag = {
        id: tagId,
        title: 'Original Title',
        parent_id: 'parent-tag-id',
        user_created_time: 1000000,
        user_updated_time: 1000000
      };
      
      // First prepare call is for getTagById
      const mockGetStatement = { get: jest.fn().mockReturnValue(mockTag) };
      // Second prepare call is for the UPDATE statement, but no rows affected
      const mockUpdateStatement = { run: jest.fn().mockReturnValue({ changes: 0 }) };
      
      mockDb.prepare
        .mockReturnValueOnce(mockGetStatement)
        .mockReturnValueOnce(mockUpdateStatement);
      
      // Act
      const result = dbService.updateTag(tagId, newTitle);
      
      // Assert
      expect(result).toBeNull();
      expect(mockUpdateStatement.run).toHaveBeenCalledWith(newTitle, 1000000, 1000000, tagId);
    });
    
    it('should return null when an error occurs during update', () => {
      // Arrange
      const tagId = 'error-tag';
      const newTitle = 'Error Title';
      const mockDb = require('better-sqlite3')();
      
      // Mock getTagById to return a tag
      const mockTag = {
        id: tagId,
        title: 'Original Title',
        parent_id: 'parent-tag-id',
        user_created_time: 1000000,
        user_updated_time: 1000000
      };
      
      // First prepare call is for getTagById
      const mockGetStatement = { get: jest.fn().mockReturnValue(mockTag) };
      
      // Second prepare call throws an error
      mockDb.prepare
        .mockReturnValueOnce(mockGetStatement)
        .mockImplementationOnce(() => {
          throw new Error('Database error during update');
        });
      
      // Act
      const result = dbService.updateTag(tagId, newTitle);
      
      // Assert
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('moveTag', () => {
    it('should move a tag to a new parent tag', () => {
      // Arrange
      const tagId = 'tag-to-move';
      const newParentId = 'new-parent-tag';
      const mockDb = require('better-sqlite3')();
      
      // Mock getTagById to return a tag
      const mockTag = {
        id: tagId,
        title: 'Tag to Move',
        parent_id: 'old-parent-tag',
        user_created_time: 1000000,
        user_updated_time: 1000000
      };
      
      // First prepare call is for getTagById
      const mockGetStatement = { get: jest.fn().mockReturnValue(mockTag) };
      // Second prepare call is for the UPDATE statement
      const mockUpdateStatement = { run: jest.fn().mockReturnValue({ changes: 1 }) };
      
      mockDb.prepare
        .mockReturnValueOnce(mockGetStatement)
        .mockReturnValueOnce(mockUpdateStatement);
      
      // Act
      const result = dbService.moveTag(tagId, newParentId);
      
      // Assert
      expect(result).not.toBeNull();
      expect(result).toEqual({
        id: tagId,
        title: 'Tag to Move',
        parent_id: newParentId,
        user_created_time: 1000000,
        user_updated_time: 1000000
      });
      
      expect(mockDb.prepare).toHaveBeenNthCalledWith(
        1, 'SELECT id, title, parent_id, user_created_time, user_updated_time FROM tags WHERE id = ?'
      );
      expect(mockGetStatement.get).toHaveBeenCalledWith(tagId);
      
      expect(mockDb.prepare).toHaveBeenNthCalledWith(
        2, 'UPDATE tags SET parent_id = ?, updated_time = ?, user_updated_time = ? WHERE id = ?'
      );
      expect(mockUpdateStatement.run).toHaveBeenCalledWith(newParentId, 1000000, 1000000, tagId);
    });
    
    it('should allow moving a tag to the root level by passing empty parent_id', () => {
      // Arrange
      const tagId = 'tag-to-root';
      const newParentId = ''; // Empty string for root level
      const mockDb = require('better-sqlite3')();
      
      // Mock getTagById to return a tag
      const mockTag = {
        id: tagId,
        title: 'Tag to Root',
        parent_id: 'some-parent-tag',
        user_created_time: 1000000,
        user_updated_time: 1000000
      };
      
      // First prepare call is for getTagById
      const mockGetStatement = { get: jest.fn().mockReturnValue(mockTag) };
      // Second prepare call is for the UPDATE statement
      const mockUpdateStatement = { run: jest.fn().mockReturnValue({ changes: 1 }) };
      
      mockDb.prepare
        .mockReturnValueOnce(mockGetStatement)
        .mockReturnValueOnce(mockUpdateStatement);
      
      // Act
      const result = dbService.moveTag(tagId, newParentId);
      
      // Assert
      expect(result).not.toBeNull();
      expect(result.parent_id).toBe('');
      expect(mockUpdateStatement.run).toHaveBeenCalledWith('', 1000000, 1000000, tagId);
    });
    
    it('should return null when the tag does not exist', () => {
      // Arrange
      const tagId = 'non-existent-tag';
      const newParentId = 'some-parent';
      const mockDb = require('better-sqlite3')();
      
      // Mock getTagById to return null (tag not found)
      const mockGetStatement = { get: jest.fn().mockReturnValue(null) };
      mockDb.prepare.mockReturnValue(mockGetStatement);
      
      // Act
      const result = dbService.moveTag(tagId, newParentId);
      
      // Assert
      expect(result).toBeNull();
      expect(mockDb.prepare).toHaveBeenCalledWith(
        'SELECT id, title, parent_id, user_created_time, user_updated_time FROM tags WHERE id = ?'
      );
      expect(mockGetStatement.get).toHaveBeenCalledWith(tagId);
      // The UPDATE statement should not be prepared or executed
      expect(mockDb.prepare).toHaveBeenCalledTimes(1);
    });
    
    it('should prevent a tag from being its own parent', () => {
      // Arrange
      const tagId = 'self-parent-tag';
      const newParentId = tagId; // Same as tag ID
      const mockDb = require('better-sqlite3')();
      
      // Mock getTagById to return a tag
      const mockTag = {
        id: tagId,
        title: 'Self Parent Tag',
        parent_id: 'old-parent',
        user_created_time: 1000000,
        user_updated_time: 1000000
      };
      
      const mockGetStatement = { get: jest.fn().mockReturnValue(mockTag) };
      mockDb.prepare.mockReturnValue(mockGetStatement);
      
      // Act
      const result = dbService.moveTag(tagId, newParentId);
      
      // Assert
      expect(result).toBeNull();
      // The UPDATE statement should not be prepared or executed
      expect(mockDb.prepare).toHaveBeenCalledTimes(1);
    });
    
    it('should return null when no rows are affected by the move operation', () => {
      // Arrange
      const tagId = 'tag-not-moved';
      const newParentId = 'new-parent';
      const mockDb = require('better-sqlite3')();
      
      // Mock getTagById to return a tag
      const mockTag = {
        id: tagId,
        title: 'Tag Not Moved',
        parent_id: 'old-parent',
        user_created_time: 1000000,
        user_updated_time: 1000000
      };
      
      // First prepare call is for getTagById
      const mockGetStatement = { get: jest.fn().mockReturnValue(mockTag) };
      // Second prepare call is for the UPDATE statement, but no rows affected
      const mockUpdateStatement = { run: jest.fn().mockReturnValue({ changes: 0 }) };
      
      mockDb.prepare
        .mockReturnValueOnce(mockGetStatement)
        .mockReturnValueOnce(mockUpdateStatement);
      
      // Act
      const result = dbService.moveTag(tagId, newParentId);
      
      // Assert
      expect(result).toBeNull();
      expect(mockUpdateStatement.run).toHaveBeenCalledWith(newParentId, 1000000, 1000000, tagId);
    });
    
    it('should return null when an error occurs during the move operation', () => {
      // Arrange
      const tagId = 'error-tag';
      const newParentId = 'error-parent';
      const mockDb = require('better-sqlite3')();
      
      // Mock getTagById to return a tag
      const mockTag = {
        id: tagId,
        title: 'Error Tag',
        parent_id: 'old-parent',
        user_created_time: 1000000,
        user_updated_time: 1000000
      };
      
      // First prepare call is for getTagById
      const mockGetStatement = { get: jest.fn().mockReturnValue(mockTag) };
      
      // Second prepare call throws an error
      mockDb.prepare
        .mockReturnValueOnce(mockGetStatement)
        .mockImplementationOnce(() => {
          throw new Error('Database error during move operation');
        });
      
      // Act
      const result = dbService.moveTag(tagId, newParentId);
      
      // Assert
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('createTag', () => {
    it('should create a new tag with the provided title', () => {
      // Arrange
      const title = 'Test Tag'
      const mockDb = require('better-sqlite3')()
      const mockStatement = { run: jest.fn() }
      mockDb.prepare.mockReturnValue(mockStatement)

      // Act
      const result = dbService.createTag(title)

      // Assert
      expect(result).not.toBeNull()
      expect(result).toEqual({
        id: 'test-uuid-123',
        title: 'Test Tag',
        parent_id: '',
        user_created_time: 1000000,
        user_updated_time: 1000000
      })

      // Verify the SQL statement was prepared correctly
      expect(mockDb.prepare).toHaveBeenCalledWith(
        'INSERT INTO tags (id, title, parent_id, created_time, updated_time, user_created_time, user_updated_time) VALUES (?, ?, ?, ?, ?, ?, ?)'
      )

      // Verify the run method was called with the correct parameters
      expect(mockStatement.run).toHaveBeenCalledWith(
        'test-uuid-123',
        'Test Tag',
        '',
        1000000,
        1000000,
        1000000,
        1000000
      )
    })

    it('should create a tag with a parent tag ID when provided', () => {
      // Arrange
      const title = 'Child Tag'
      const parentId = 'parent-tag-id'
      const mockDb = require('better-sqlite3')()
      const mockStatement = { run: jest.fn() }
      mockDb.prepare.mockReturnValue(mockStatement)

      // Act
      const result = dbService.createTag(title, parentId)

      // Assert
      expect(result).not.toBeNull()
      expect(result).toEqual({
        id: 'test-uuid-123',
        title: 'Child Tag',
        parent_id: 'parent-tag-id',
        user_created_time: 1000000,
        user_updated_time: 1000000
      })

      // Verify the run method was called with the parent ID
      expect(mockStatement.run).toHaveBeenCalledWith(
        'test-uuid-123',
        'Child Tag',
        'parent-tag-id',
        1000000,
        1000000,
        1000000,
        1000000
      )
    })

    it('should return null when an error occurs during tag creation', () => {
      // Arrange - create a scenario that will cause an error
      const mockDb = require('better-sqlite3')()
      mockDb.prepare.mockImplementation(() => {
        throw new Error('Database error')
      })

      // Act
      const result = dbService.createTag('Error Tag')

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('deleteFolder', () => {
    it('should delete a folder and all its notes when the folder exists', () => {
      // Arrange
      const folderId = 'folder-to-delete'
      const mockDb = require('better-sqlite3')()

      // Mock getFolderById to return a folder
      const mockFolder = {
        id: folderId,
        title: 'Folder to Delete',
        parent_id: 'parent-folder-id',
        user_created_time: 1000000,
        user_updated_time: 1000000
      }

      // First prepare call is for getFolderById
      const mockGetStatement = { get: jest.fn().mockReturnValue(mockFolder) }
      // Second prepare call is for deleting notes in the folder
      const mockDeleteNotesStatement = { run: jest.fn().mockReturnValue({ changes: 3 }) }
      // Third prepare call is for deleting the folder
      const mockDeleteFolderStatement = { run: jest.fn().mockReturnValue({ changes: 1 }) }

      mockDb.prepare
        .mockReturnValueOnce(mockGetStatement)
        .mockReturnValueOnce(mockDeleteNotesStatement)
        .mockReturnValueOnce(mockDeleteFolderStatement)

      // Act
      const result = dbService.deleteFolder(folderId)

      // Assert
      expect(result).toBe(true)
      expect(mockDb.prepare).toHaveBeenNthCalledWith(
        1,
        'SELECT id, title, parent_id, user_created_time, user_updated_time FROM folders WHERE id = ?'
      )
      expect(mockGetStatement.get).toHaveBeenCalledWith(folderId)

      // Verify notes with the folder as parent were deleted
      expect(mockDb.prepare).toHaveBeenNthCalledWith(2, 'DELETE FROM notes WHERE parent_id = ?')
      expect(mockDeleteNotesStatement.run).toHaveBeenCalledWith(folderId)

      // Verify the folder itself was deleted
      expect(mockDb.prepare).toHaveBeenNthCalledWith(3, 'DELETE FROM folders WHERE id = ?')
      expect(mockDeleteFolderStatement.run).toHaveBeenCalledWith(folderId)
    })

    it('should return false when the folder does not exist', () => {
      // Arrange
      const folderId = 'non-existent-folder'
      const mockDb = require('better-sqlite3')()

      // Mock getFolderById to return null (folder not found)
      const mockGetStatement = { get: jest.fn().mockReturnValue(null) }
      mockDb.prepare.mockReturnValue(mockGetStatement)

      // Act
      const result = dbService.deleteFolder(folderId)

      // Assert
      expect(result).toBe(false)
      expect(mockDb.prepare).toHaveBeenCalledWith(
        'SELECT id, title, parent_id, user_created_time, user_updated_time FROM folders WHERE id = ?'
      )
      expect(mockGetStatement.get).toHaveBeenCalledWith(folderId)
      // No delete operations should be performed
      expect(mockDb.prepare).toHaveBeenCalledTimes(1)
    })

    it('should return false when folder deletion fails', () => {
      // Arrange
      const folderId = 'folder-not-deleted'
      const mockDb = require('better-sqlite3')()

      // Mock getFolderById to return a folder
      const mockFolder = {
        id: folderId,
        title: 'Folder Not Deleted',
        parent_id: 'parent-folder-id',
        user_created_time: 1000000,
        user_updated_time: 1000000
      }

      // First prepare call is for getFolderById
      const mockGetStatement = { get: jest.fn().mockReturnValue(mockFolder) }
      // Second prepare call is for deleting notes in the folder
      const mockDeleteNotesStatement = { run: jest.fn().mockReturnValue({ changes: 2 }) }
      // Third prepare call is for deleting the folder, but it fails
      const mockDeleteFolderStatement = { run: jest.fn().mockReturnValue({ changes: 0 }) }

      mockDb.prepare
        .mockReturnValueOnce(mockGetStatement)
        .mockReturnValueOnce(mockDeleteNotesStatement)
        .mockReturnValueOnce(mockDeleteFolderStatement)

      // Act
      const result = dbService.deleteFolder(folderId)

      // Assert
      expect(result).toBe(false)
      // Notes should be deleted, but operation should fail because folder deletion failed
      expect(mockDeleteNotesStatement.run).toHaveBeenCalledWith(folderId)
      expect(mockDeleteFolderStatement.run).toHaveBeenCalledWith(folderId)
    })

    it('should return false when an error occurs during deletion', () => {
      // Arrange
      const folderId = 'error-folder'
      const mockDb = require('better-sqlite3')()

      // Mock getFolderById to return a folder
      const mockFolder = {
        id: folderId,
        title: 'Error Folder',
        parent_id: 'parent-folder-id',
        user_created_time: 1000000,
        user_updated_time: 1000000
      }

      // First prepare call is for getFolderById
      const mockGetStatement = { get: jest.fn().mockReturnValue(mockFolder) }

      // Second prepare call throws an error
      mockDb.prepare.mockReturnValueOnce(mockGetStatement).mockImplementationOnce(() => {
        throw new Error('Database error during deletion')
      })

      // Act
      const result = dbService.deleteFolder(folderId)

      // Assert
      expect(result).toBe(false)
    })

    it('should delete child folders recursively', () => {
      // Arrange
      const folderId = 'parent-folder'
      const mockDb = require('better-sqlite3')()

      // Mock getFolderById to return a folder
      const mockFolder = {
        id: folderId,
        title: 'Parent Folder',
        parent_id: '',
        user_created_time: 1000000,
        user_updated_time: 1000000
      }

      // Mock to find child folders
      const mockChildFolders = [{ id: 'child-folder-1' }, { id: 'child-folder-2' }]

      // First prepare call is for getFolderById
      const mockGetStatement = { get: jest.fn().mockReturnValue(mockFolder) }
      // Second prepare call is for finding child folders
      const mockFindChildrenStatement = { all: jest.fn().mockReturnValue(mockChildFolders) }
      // Third and subsequent calls for deleting notes and folders
      const mockDeleteStatement = { run: jest.fn().mockReturnValue({ changes: 1 }) }

      mockDb.prepare
        .mockReturnValueOnce(mockGetStatement)
        .mockReturnValueOnce(mockFindChildrenStatement)
        .mockReturnValue(mockDeleteStatement)

      // Act
      const result = dbService.deleteFolder(folderId, true) // true for recursive deletion

      // Assert
      expect(result).toBe(true)

      // Verify child folders were found
      expect(mockDb.prepare).toHaveBeenNthCalledWith(
        2,
        'SELECT id FROM folders WHERE parent_id = ?'
      )
      expect(mockFindChildrenStatement.all).toHaveBeenCalledWith(folderId)

      // Verify notes deletion and folder deletion were called for each child folder
      // and for the parent folder
      expect(mockDeleteStatement.run).toHaveBeenCalledTimes(6) // 2 child folders (notes + folder) + parent folder (notes + folder) + recursive calls
    })
  })
})
