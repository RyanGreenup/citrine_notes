import { Component, createSignal, onMount } from 'solid-js'
import { Search, ZoomIn, ZoomOut, RotateCcw } from 'lucide-solid'

export const ZoomControls: Component = () => {
  const [zoomFactor, setZoomFactor] = createSignal<number>(1.0)
  const [zoomPercent, setZoomPercent] = createSignal<number>(100)

  onMount(async () => {
    const currentZoom = await window.api.zoom.getZoomFactor()
    setZoomFactor(currentZoom)
    setZoomPercent(Math.round(currentZoom * 100))
  })

  const handleZoomIn = async () => {
    const newZoom = await window.api.zoom.zoomIn()
    setZoomFactor(newZoom)
    setZoomPercent(Math.round(newZoom * 100))
  }

  const handleZoomOut = async () => {
    const newZoom = await window.api.zoom.zoomOut()
    setZoomFactor(newZoom)
    setZoomPercent(Math.round(newZoom * 100))
  }

  const handleResetZoom = async () => {
    const newZoom = await window.api.zoom.resetZoom()
    setZoomFactor(newZoom)
    setZoomPercent(Math.round(newZoom * 100))
  }

  return (
    <div class="flex items-center space-x-2">
      <button
        onClick={handleZoomOut}
        class="p-1 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        title="Zoom Out"
      >
        <ZoomOut size={18} />
      </button>
      
      <span class="text-sm text-gray-500 dark:text-gray-400 min-w-[40px] text-center">
        {zoomPercent()}%
      </span>
      
      <button
        onClick={handleZoomIn}
        class="p-1 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        title="Zoom In"
      >
        <ZoomIn size={18} />
      </button>
      
      <button
        onClick={handleResetZoom}
        class="p-1 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        title="Reset Zoom"
      >
        <RotateCcw size={18} />
      </button>
    </div>
  )
}
