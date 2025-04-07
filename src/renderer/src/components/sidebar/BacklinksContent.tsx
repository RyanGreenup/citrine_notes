import { theme } from '@renderer/theme'
import { TreeView, createTreeCollection } from '@ark-ui/solid/tree-view'
import { For, createSignal, createEffect, Show } from 'solid-js'
import { NoteListItem } from '@renderer/components/common/NoteListItem'
import { setCurrentView } from '@renderer/utils/viewUtils'

export function BacklinksContent() {
  const containerClass = `pt-4 mt-4 space-y-2 font-medium border-t ${theme.border.light} ${theme.border.dark}`
  const [selectedNoteId, setSelectedNoteId] = createSignal<string | null>(null)
  const [backlinks, setBacklinks] = createSignal<any[]>([])
  const [loading, setLoading] = createSignal(true)
  const [error, setError] = createSignal<string | null>(null)
  const [currentNoteId, setCurrentNoteId] = createSignal<string | null>(null)
  
  // Listen for changes to the current note
  createEffect(async () => {
    // Get the current note ID from the URL or state
    const noteId = window.location.hash.replace('#', '') || null
    
    if (noteId && noteId !== currentNoteId()) {
      setCurrentNoteId(noteId)
      await loadBacklinks(noteId)
    }
  })
  
  // Load backlinks for the given note ID
  const loadBacklinks = async (noteId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // Call the database API to get backlinks
      const notes = await window.api.database.getBacklinks(noteId)
      
      // Transform the notes to use content instead of body
      const formattedBacklinks = notes.map(note => ({
        id: note.id,
        title: note.title,
        content: note.body
      }))
      
      setBacklinks(formattedBacklinks)
    } catch (err) {
      console.error('Error loading backlinks:', err)
      setError('Failed to load backlinks')
      setBacklinks([])
    } finally {
      setLoading(false)
    }
  }
  
  // Create a tree collection with just one level of depth
  const getCollection = () => createTreeCollection({
    nodeToValue: (node) => node.id,
    nodeToString: (node) => node.title,
    rootNode: {
      id: 'ROOT',
      title: '',
      content: '',
      children: backlinks()
    }
  })

  // Handle note selection
  const handleNoteClick = (id: string) => {
    setSelectedNoteId(id)
    setCurrentView(id)
  }

  return (
    <div class={containerClass}>
      <h3 class={`mb-3 text-sm font-semibold ${theme.text.light} ${theme.text.dark}`}>
        Notes that link to this one
      </h3>
      
      <Show when={loading()}>
        <div class="text-sm text-gray-500 dark:text-gray-400 p-2">
          Loading backlinks...
        </div>
      </Show>
      
      <Show when={error()}>
        <div class="text-sm text-red-500 p-2">
          {error()}
        </div>
      </Show>
      
      <Show when={!loading() && !error() && backlinks().length === 0}>
        <div class="text-sm text-gray-500 dark:text-gray-400 p-2">
          No backlinks found for this note.
        </div>
      </Show>
      
      <Show when={!loading() && backlinks().length > 0}>
        <TreeView.Root collection={getCollection()} lazyMount={true}>
          <TreeView.Tree class="w-full space-y-2">
            <For each={backlinks()}>
              {(note, index) => (
                <TreeView.NodeProvider node={note} indexPath={[index()]}>
                  <TreeView.Item class="p-0 border-0">
                    <NoteListItem
                      id={note.id}
                      title={note.title}
                      content={note.content}
                      onClick={handleNoteClick}
                      selected={selectedNoteId() === note.id}
                      truncateContent={true}
                      maxContentLength={80}
                    />
                  </TreeView.Item>
                </TreeView.NodeProvider>
              )}
            </For>
          </TreeView.Tree>
        </TreeView.Root>
      </Show>
    </div>
  )
}
