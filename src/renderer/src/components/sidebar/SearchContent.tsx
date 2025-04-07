import { theme } from '@renderer/theme'
import { SidebarItem } from './SidebarItem'
import { BookIcon, Compass, FlameIcon, PanelLeft } from 'lucide-solid'
import { DUMMY_NOTES, SearchInput } from './SearchInput'
import { createSignal, For, Show } from 'solid-js'
import { NoteListItem } from '../common/NoteListItem'

export function SearchContent() {
  const unordered_list_with_top_line = `pt-4 mt-4 space-y-2 font-medium border-t ${theme.border.light} ${theme.border.dark}`
  const [searchQuery, setSearchQuery] = createSignal('')
  const [searchResults, setSearchResults] = createSignal<typeof DUMMY_NOTES>([])
  const [hasSearched, setHasSearched] = createSignal(false)

  const handleSearch = (query: string, results: typeof DUMMY_NOTES) => {
    setSearchQuery(query)
    setSearchResults(results)
    setHasSearched(query.trim() !== '')
  }

  const handleNoteClick = (id: string) => {
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
          
          <div class="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
            <For each={searchResults()}>
              {(note) => (
                <NoteListItem
                  id={note.id}
                  title={note.title}
                  content={note.content}
                  onClick={handleNoteClick}
                  truncateContent={true}
                  maxContentLength={80}
                  class="rounded p-2"
                />
              )}
            </For>
          </div>
        </div>
      </Show>
      
      <Show when={!hasSearched()}>
        <ul class={unordered_list_with_top_line}>
          <SidebarItem icon={FlameIcon} href="#" label="Upgrade to Pro" />
          <SidebarItem icon={BookIcon} href="#" label="Documentation" />
          <SidebarItem icon={PanelLeft} href="#" label="Components" />
          <SidebarItem icon={Compass} href="#" label="Help" />
        </ul>
      </Show>
    </div>
  )
}
