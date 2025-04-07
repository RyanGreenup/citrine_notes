import { theme } from '@renderer/theme'
import { SidebarItem } from './SidebarItem'
import { BookIcon, Compass, FlameIcon, PanelLeft } from 'lucide-solid'
import { DUMMY_NOTES, SearchInput } from './SearchInput'
import { createSignal, For, Show } from 'solid-js'
import { NoteListItem } from '../common/NoteListItem'
import { TreeView, createTreeCollection } from '@ark-ui/solid/tree-view'

export function SearchContent() {
  const unordered_list_with_top_line = `pt-4 mt-4 space-y-2 font-medium border-t ${theme.border.light} ${theme.border.dark}`
  const [searchQuery, setSearchQuery] = createSignal('')
  const [searchResults, setSearchResults] = createSignal<typeof DUMMY_NOTES>([])
  const [hasSearched, setHasSearched] = createSignal(false)
  const [selectedNoteId, setSelectedNoteId] = createSignal<string | null>(null)

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

  const handleSearch = (query: string, results: typeof DUMMY_NOTES) => {
    setSearchQuery(query)
    setSearchResults(results)
    setHasSearched(query.trim() !== '')
    setSelectedNoteId(null)
  }

  const handleNoteClick = (id: string) => {
    setSelectedNoteId(id)
    console.log(`Note clicked: ${id}`)
    // In a real implementation, this would navigate to the note or open it
  }

  return (
    <div class="flex flex-col gap-4">
      <div class="px-3 pt-3">
        <SearchInput onSearch={handleSearch} />
      </div>

      <Show when={hasSearched()}>
        <div class="px-3">
          <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
            {searchResults().length > 0
              ? `Results for "${searchQuery()}" (${searchResults().length})`
              : `No results for "${searchQuery()}"`}
          </h3>

          <div class="max-h-[calc(100vh-200px)] overflow-y-auto">
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
        <div class="px-3 pt-2">
          <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Quick Access</h3>
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
