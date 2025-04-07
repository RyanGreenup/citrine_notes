import { theme } from '@renderer/theme'
import { SidebarItem } from './SidebarItem'
import { BookIcon, Compass, FlameIcon, PanelLeft } from 'lucide-solid'
import { SearchInput } from './SearchInput'
import { createSignal, For, Show } from 'solid-js'
import { NoteListItem } from '../common/NoteListItem'
import { TreeView, createTreeCollection } from '@ark-ui/solid/tree-view'

interface SearchNote {
  id: string;
  title: string;
  content: string;
}

export function SearchContent() {
  const unordered_list_with_top_line = `pt-4 mt-4 space-y-2 font-medium border-t ${theme.border.light} ${theme.border.dark}`
  const [searchQuery, setSearchQuery] = createSignal('')
  const [searchResults, setSearchResults] = createSignal<SearchNote[]>([])
  const [hasSearched, setHasSearched] = createSignal(false)
  const [selectedNoteId, setSelectedNoteId] = createSignal<string | null>(null)
  const [isSearching, setIsSearching] = createSignal(false)

  // Create a tree collection for search results
  const getCollection = () => createTreeCollection({
    nodeToValue: (node) => node.id,
    nodeToString: (node) => node.title,
    rootNode: {
      id: 'ROOT',
      title: '',
      content: '',
      children: searchResults()
    }
  })

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    setIsSearching(true)
    setHasSearched(query.trim() !== '')
    setSelectedNoteId(null)
    
    if (!query.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }
    
    try {
      // Call the database API to search notes
      const notes = await window.api.database.searchNotes(query)
      
      // Transform the notes to include a content field (using body as content)
      const formattedResults: SearchNote[] = notes.map((note: any) => ({
        id: note.id,
        title: note.title,
        content: note.body
      }))
      
      setSearchResults(formattedResults)
    } catch (error) {
      console.error('Error searching notes:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const setCurrentView = (noteId: string) => {
    console.log(`Setting view to note: ${noteId}`)
    // In a real implementation, this would navigate to the note or open it
  }

  const handleNoteClick = (id: string) => {
    setSelectedNoteId(id)
    setCurrentView(id)
  }

  return (
    <div class={theme.sidebar.search.container}>
      <div class={theme.sidebar.search.inputWrapper}>
        <SearchInput onSearch={handleSearch} />
      </div>

      <Show when={hasSearched()}>
        <div class={theme.sidebar.search.resultsContainer}>
          <h3 class={theme.sidebar.search.resultsHeading}>
            {isSearching() 
              ? `Searching for "${searchQuery()}"...`
              : searchResults().length > 0
                ? `Results for "${searchQuery()}" (${searchResults().length})`
                : `No results for "${searchQuery()}"`}
          </h3>

          <div class={theme.sidebar.search.resultsList}>
            <Show when={searchResults().length > 0}>
              <TreeView.Root collection={getCollection()} lazyMount={true}>
                <TreeView.Tree class="w-full space-y-2">
                  <For each={searchResults()}>
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
                            class="rounded p-2"
                          />
                        </TreeView.Item>
                      </TreeView.NodeProvider>
                    )}
                  </For>
                </TreeView.Tree>
              </TreeView.Root>
            </Show>
          </div>
        </div>
      </Show>

      <Show when={!hasSearched()}>
        <div class={theme.sidebar.search.quickAccessContainer}>
          <h3 class={theme.sidebar.search.quickAccessHeading}>Quick Access</h3>
        </div>
        <ul>
          <SidebarItem icon={BookIcon} href="#" label="Recent Notes" />
          <SidebarItem icon={PanelLeft} href="#" label="Knowledge Base" />
          <SidebarItem icon={FlameIcon} href="#" label="Bookmarked Pages" />
          <SidebarItem icon={Compass} href="#" label="Table of Contents" />
        </ul>
      </Show>
    </div>
  )
}
