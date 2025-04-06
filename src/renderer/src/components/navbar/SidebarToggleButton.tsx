import type { Component } from 'solid-js'
import { KanbanIcon } from 'lucide-solid'

interface SidebarToggleButtonProps {
  onClick: () => void
}

export const SidebarToggleButton: Component<SidebarToggleButtonProps> = (props) => {
  // UI visibility classes
  const HIDE_ON_WIDE_SCREENS = "sm:hidden"
  
  // Color scheme
  const TEXT_COLOR = "text-gray-500 dark:text-gray-400"
  const BG_COLOR_HOVER = "hover:bg-gray-100 dark:hover:bg-gray-700"
  
  return (
    <button
      onClick={props.onClick}
      type="button"
      class={`inline-flex items-center p-2 text-sm ${TEXT_COLOR} rounded-lg ${HIDE_ON_WIDE_SCREENS} ${BG_COLOR_HOVER} focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600`}
    >
      <span class="sr-only">Open sidebar</span>
      <KanbanIcon class="w-6 h-6" />
    </button>
  )
}
