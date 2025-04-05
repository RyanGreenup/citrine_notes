import { createSignal, Show } from 'solid-js'

const ResourceUploader = () => {
  const [uploading, setUploading] = createSignal(false)
  const [uploadedResource, setUploadedResource] = createSignal<{ id: string; title: string } | null>(null)
  const [error, setError] = createSignal<string | null>(null)

  const handleUpload = async () => {
    try {
      setUploading(true)
      setError(null)
      setUploadedResource(null)

      // Open file dialog
      const fileInfo = await window.electron.ipcRenderer.invoke('dialog:openFile')
      
      if (!fileInfo) {
        setUploading(false)
        return // User canceled
      }

      // Create resource in database
      const resource = await window.electron.ipcRenderer.invoke(
        'db:resources:create',
        fileInfo.name, // title
        fileInfo.mime, // mime type
        fileInfo.name, // filename
        fileInfo.extension, // file extension
        fileInfo.size, // size
        fileInfo.path // source path
      )

      if (!resource) {
        throw new Error('Failed to create resource')
      }

      setUploadedResource({
        id: resource.id,
        title: resource.title
      })
    } catch (err) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload resource')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div class="mt-6 p-4 bg-white rounded shadow">
      <h2 class="text-xl font-semibold mb-4">Resource Uploader</h2>
      
      <button
        onClick={handleUpload}
        disabled={uploading()}
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {uploading() ? 'Uploading...' : 'Upload Resource'}
      </button>

      <Show when={error()}>
        <div class="mt-4 p-3 bg-red-100 text-red-700 rounded">
          <p>Error: {error()}</p>
        </div>
      </Show>

      <Show when={uploadedResource()}>
        <div class="mt-4 p-3 bg-green-100 text-green-700 rounded">
          <p>Resource uploaded successfully!</p>
          <p class="mt-2">
            <span class="font-semibold">Resource ID:</span> {uploadedResource()?.id}
          </p>
          <p>
            <span class="font-semibold">Title:</span> {uploadedResource()?.title}
          </p>
        </div>
      </Show>
    </div>
  )
}

export default ResourceUploader
