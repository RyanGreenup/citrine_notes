/**
 * Utility functions for managing application views
 */
import { createSignal, createEffect } from 'solid-js'

// Create a signal to track the currently viewed note ID
const [currentNoteId, setCurrentNoteId] = createSignal<string | null>(null)

// Function to initialize view - exported for use in App.tsx
export const initializeView = () => {
  createEffect(async () => {
    const hashId = window.location.hash.replace('#', '')
    if (hashId) {
      setCurrentNoteId(hashId)
    } else {
      // If no hash is present, try to load the home note
      try {
        // Make sure the API is available before trying to use it
        if (window.api && window.api.database) {
          const homeNote = await window.api.database.getHomeNote()
          if (homeNote) {
            setCurrentNoteId(homeNote.id)
            window.location.hash = homeNote.id
            console.log('Set default view to home note:', homeNote.title)
          }
        } else {
          console.warn('API not available yet, cannot load home note')
        }
      } catch (error) {
        console.error('Failed to load home note:', error)
      }
    }
  })
}

/**
 * Sets the current view to display a specific note
 * @param noteId The ID of the note to display
 */
export const setCurrentView = (noteId: string): void => {
  // Only update if the note ID has changed
  if (noteId !== currentNoteId()) {
    console.log(`Setting view to note: ${noteId}`)
    setCurrentNoteId(noteId)
    
    // Update URL hash to reflect the current note
    window.location.hash = noteId
  }
}

/**
 * Gets the current viewed note ID
 * @returns The current note ID or null if none is selected
 */
export const getCurrentNoteId = () => currentNoteId

/**
 * Subscribe to changes in the current note ID
 * @param callback Function to call when the current note ID changes
 * @returns A function to dispose the effect
 */
export const onNoteChange = (callback: (noteId: string | null) => void) => {
  return createEffect(() => {
    callback(currentNoteId())
  })
}
