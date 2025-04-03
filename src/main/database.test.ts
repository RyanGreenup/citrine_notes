import { DatabaseService, Note } from './database';
import * as crypto from 'crypto';

// Mock the better-sqlite3 module
jest.mock('better-sqlite3', () => {
  // Create mock implementation
  const mockPrepare = jest.fn();
  const mockGet = jest.fn();
  const mockAll = jest.fn();
  const mockRun = jest.fn();
  const mockExec = jest.fn();
  const mockClose = jest.fn();
  
  // Mock database constructor
  const mockDatabase = jest.fn().mockImplementation(() => ({
    prepare: mockPrepare,
    exec: mockExec,
    close: mockClose
  }));
  
  return mockDatabase;
});

// Mock crypto for predictable UUIDs in tests
jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomUUID: jest.fn()
}));

describe('DatabaseService', () => {
  let dbService: DatabaseService;
  const testDbPath = '/mock/test.db';
  
  // Initialize fresh database service before each test
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock Date.now() to return a fixed timestamp
    jest.spyOn(Date, 'now').mockReturnValue(1000000);
    
    // Mock UUID generation
    (crypto.randomUUID as jest.Mock).mockReturnValue('test-uuid-123');
    
    // Create a fake file system check to avoid the file not found error
    jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
    
    // Mock console methods to reduce test output noise
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Initialize the database service with the test database
    dbService = DatabaseService.getInstance(testDbPath);
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
    
    // Reset the singleton instance
    // @ts-ignore: Accessing private static property for testing
    DatabaseService.instance = null;
  });
  
  describe('getAllNotes', () => {
    it('should return an empty array when there are no notes', () => {
      // Arrange
      const mockDb = require('better-sqlite3')();
      const mockStatement = { all: jest.fn().mockReturnValue([]) };
      mockDb.prepare.mockReturnValue(mockStatement);
      
      // Act
      const notes = dbService.getAllNotes();
      
      // Assert
      expect(notes).toEqual([]);
      expect(mockDb.prepare).toHaveBeenCalledWith(
        'SELECT id, title, body, user_created_time, user_updated_time FROM notes'
      );
    });
    
    it('should return all notes in the database', () => {
      // Arrange
      const mockNotes = [
        { id: 'note-1', title: 'Note 1', body: 'Body 1', user_created_time: 1000000, user_updated_time: 1000000 },
        { id: 'note-2', title: 'Note 2', body: 'Body 2', user_created_time: 1000000, user_updated_time: 1000000 },
        { id: 'note-3', title: 'Note 3', body: 'Body 3', user_created_time: 1000000, user_updated_time: 1000000 }
      ];
      
      const mockDb = require('better-sqlite3')();
      const mockStatement = { all: jest.fn().mockReturnValue(mockNotes) };
      mockDb.prepare.mockReturnValue(mockStatement);
      
      // Act
      const notes = dbService.getAllNotes();
      
      // Assert
      expect(notes).toEqual(mockNotes);
      expect(notes.length).toBe(3);
      expect(notes.map(note => note.id)).toEqual(['note-1', 'note-2', 'note-3']);
      expect(notes.map(note => note.title)).toEqual(['Note 1', 'Note 2', 'Note 3']);
    });
    
    it('should return an empty array when an error occurs', () => {
      // Arrange - create a scenario that will cause an error
      const mockDb = require('better-sqlite3')();
      mockDb.prepare.mockImplementation(() => {
        throw new Error('Database error');
      });
      
      // Act
      const notes = dbService.getAllNotes();
      
      // Assert
      expect(notes).toEqual([]);
    });
  });
  
  describe('getNoteById', () => {
    it('should return null when note with given ID does not exist', () => {
      // Arrange
      const mockDb = require('better-sqlite3')();
      const mockStatement = { get: jest.fn().mockReturnValue(null) };
      mockDb.prepare.mockReturnValue(mockStatement);
      
      // Act
      const note = dbService.getNoteById('non-existent-id');
      
      // Assert
      expect(note).toBeNull();
      expect(mockDb.prepare).toHaveBeenCalledWith(
        'SELECT id, title, body, user_created_time, user_updated_time FROM notes WHERE id = ?'
      );
      expect(mockStatement.get).toHaveBeenCalledWith('non-existent-id');
    });
    
    it('should return the note with the given ID', () => {
      // Arrange
      const mockNote = {
        id: 'specific-note-id',
        title: 'Test Note',
        body: 'Test Body',
        user_created_time: 1000000,
        user_updated_time: 1000000
      };
      
      const mockDb = require('better-sqlite3')();
      const mockStatement = { get: jest.fn().mockReturnValue(mockNote) };
      mockDb.prepare.mockReturnValue(mockStatement);
      
      // Act
      const note = dbService.getNoteById('specific-note-id');
      
      // Assert
      expect(note).not.toBeNull();
      expect(note).toEqual(mockNote);
      expect(mockStatement.get).toHaveBeenCalledWith('specific-note-id');
    });
    
    it('should return null when an error occurs', () => {
      // Arrange - create a scenario that will cause an error
      const mockDb = require('better-sqlite3')();
      mockDb.prepare.mockImplementation(() => {
        throw new Error('Database error');
      });
      
      // Act
      const note = dbService.getNoteById('any-id');
      
      // Assert
      expect(note).toBeNull();
    });
  });
  
  describe('createNote', () => {
    it('should create a new note with the provided title and body', () => {
      // Arrange
      const title = 'Test Note';
      const body = 'This is a test note';
      const mockDb = require('better-sqlite3')();
      const mockStatement = { run: jest.fn() };
      mockDb.prepare.mockReturnValue(mockStatement);
      
      // Act
      const result = dbService.createNote(title, body);
      
      // Assert
      expect(result).not.toBeNull();
      expect(result).toEqual({
        id: 'test-uuid-123',
        title: 'Test Note',
        body: 'This is a test note',
        user_created_time: 1000000,
        user_updated_time: 1000000
      });
      
      // Verify the SQL statement was prepared correctly
      expect(mockDb.prepare).toHaveBeenCalledWith(
        'INSERT INTO notes (id, title, body, user_created_time, user_updated_time) VALUES (?, ?, ?, ?, ?)'
      );
      
      // Verify the run method was called with the correct parameters
      expect(mockStatement.run).toHaveBeenCalledWith(
        'test-uuid-123', 
        'Test Note', 
        'This is a test note', 
        1000000, 
        1000000
      );
    });
    
    it('should return null when an error occurs during note creation', () => {
      // Arrange - create a scenario that will cause an error
      const mockDb = require('better-sqlite3')();
      mockDb.prepare.mockImplementation(() => {
        throw new Error('Database error');
      });
      
      // Act
      const result = dbService.createNote('Title', 'Body');
      
      // Assert
      expect(result).toBeNull();
    });
    
    it('should generate a unique ID for each note', () => {
      // Arrange
      (crypto.randomUUID as jest.Mock)
        .mockReturnValueOnce('uuid-1')
        .mockReturnValueOnce('uuid-2');
      
      const mockDb = require('better-sqlite3')();
      const mockStatement = { run: jest.fn() };
      mockDb.prepare.mockReturnValue(mockStatement);
      
      // Act
      const note1 = dbService.createNote('Note 1', 'Body 1');
      const note2 = dbService.createNote('Note 2', 'Body 2');
      
      // Assert
      expect(note1?.id).toBe('uuid-1');
      expect(note2?.id).toBe('uuid-2');
      
      // Verify the run method was called with different IDs
      expect(mockStatement.run).toHaveBeenNthCalledWith(
        1, 'uuid-1', 'Note 1', 'Body 1', 1000000, 1000000
      );
      expect(mockStatement.run).toHaveBeenNthCalledWith(
        2, 'uuid-2', 'Note 2', 'Body 2', 1000000, 1000000
      );
    });
  });
});
