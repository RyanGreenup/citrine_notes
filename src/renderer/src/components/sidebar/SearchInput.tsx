import { Component, createSignal } from 'solid-js'
import { Search } from 'lucide-solid'
import { theme } from '@renderer/theme'

// Dummy data for search results
export const DUMMY_NOTES = [
  { id: '1', title: 'Meeting Notes', content: 'Discussion about the new project timeline and resource allocation.' },
  { id: '2', title: 'Project Ideas', content: 'Brainstorming session for Q3 marketing campaign.' },
  { id: '3', title: 'Shopping List', content: 'Groceries: milk, eggs, bread, vegetables, fruits.' },
  { id: '4', title: 'Book Recommendations', content: 'Fiction: Project Hail Mary, Dune. Non-fiction: Atomic Habits, Thinking Fast and Slow.' },
  { id: '5', title: 'Travel Plans', content: 'Flight details, hotel reservations, and places to visit in Barcelona.' },
  { id: '6', title: 'Workout Routine', content: 'Monday: Chest and triceps, Tuesday: Back and biceps, Wednesday: Rest, Thursday: Legs, Friday: Shoulders.' }
]

export interface SearchInputProps {
  onSearch: (query: string, results: typeof DUMMY_NOTES) => void
}

export const SearchInput: Component<SearchInputProps> = (props) => {
  const [searchQuery, setSearchQuery] = createSignal('')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    
    if (!query.trim()) {
      props.onSearch('', [])
      return
    }
    
    // Filter dummy data based on search query
    const results = DUMMY_NOTES.filter(note => 
      note.title.toLowerCase().includes(query.toLowerCase()) || 
      note.content.toLowerCase().includes(query.toLowerCase())
    )
    
    props.onSearch(query, results)
  }

  return (
    <div class="relative">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search class="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </div>
      <input
        type="search"
        class={`block w-full p-2 pl-10 text-sm ${theme.text.light} ${theme.text.dark} border ${theme.border.light} ${theme.border.dark} rounded-lg ${theme.bg.light} ${theme.bg.dark} focus:ring-blue-500 focus:border-blue-500`}
        placeholder="Search notes..."
        value={searchQuery()}
        onInput={(e) => handleSearch(e.currentTarget.value)}
      />
    </div>
  )
}
