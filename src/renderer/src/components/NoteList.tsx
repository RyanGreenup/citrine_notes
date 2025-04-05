import { createSignal, createEffect, For, Show } from 'solid-js'

interface Note {
  id: string
  title: string
  body: string
  parent_id: string
  user_created_time: number
  user_updated_time: number
}

interface DatabaseStatus {
  connected: boolean
  path: string | null
}

const NoteList = () => {
  const [notes, setNotes] = createSignal<Note[]>([])
  const [loading, setLoading] = createSignal(true)
  const [error, setError] = createSignal<string | null>(null)
  const [dbStatus, setDbStatus] = createSignal<DatabaseStatus>({ connected: false, path: null })

  createEffect(async () => {
    try {
      setLoading(true)

      // Get database status first
      const status = await window.electron.ipcRenderer.invoke('db:getStatus')
      setDbStatus(status)

      if (!status.connected) {
        setError('Database is not connected')
        return
      }

      const allNotes = (await window.electron.ipcRenderer.invoke('db:getAllNotes')) as Note[]
      // Get only the first 10 notes
      setNotes(allNotes.slice(0, 10))
      setError(null)
    } catch (err) {
      console.error('Failed to fetch notes:', err)
      setError('Failed to load notes from database')

      // Try to get database status even if note loading failed
      try {
        const status = await window.electron.ipcRenderer.invoke('db:getStatus')
        setDbStatus(status)
      } catch (statusErr) {
        console.error('Failed to get database status:', statusErr)
      }
    } finally {
      setLoading(false)
    }
  })

  return (
    <div class="mt-6 p-4 bg-white rounded shadow">
      <h2 class="text-xl font-semibold mb-4">Notes List (First 10)</h2>

      <Show when={loading()}>
        <p class="text-gray-500">Loading notes...</p>
      </Show>

      <Show when={error()}>
        <div class="text-red-500 mb-2">
          <p>{error()}</p>
          <Show when={dbStatus().path}>
            <p class="text-sm mt-1">
              Database path: <code class="bg-gray-100 px-1 py-0.5 rounded">{dbStatus().path}</code>
            </p>
          </Show>
          <Show when={!dbStatus().path}>
            <p class="text-sm mt-1">No database path available</p>
          </Show>
        </div>
      </Show>

      <Show when={!loading() && !error() && notes().length === 0}>
        <p class="text-gray-500">No notes found in database.</p>
        <Show when={dbStatus().path}>
          <p class="text-sm text-gray-400 mt-1">
            Database path: <code class="bg-gray-100 px-1 py-0.5 rounded">{dbStatus().path}</code>
          </p>
        </Show>
      </Show>

      <ul class="space-y-2">
        <For each={notes()}>
          {(note) => (
            <li class="p-3 border border-gray-200 rounded hover:bg-gray-50">
              <h3 class="font-medium">{note.title} </h3>
              <p class="text-sm text-gray-600 truncate">{note.title}</p>
              <div class="text-xs text-gray-400 mt-1">
                Last updated: {new Date(note.user_updated_time).toLocaleString()}
                <br />
                {note.body.length > 80 ? note.body.substring(0, 80) + '...' : note.body}
              </div>
            </li>
          )}
        </For>
      </ul>
    </div>
  )
}

export default NoteList
