import type { Component, JSX } from 'solid-js'
import type { LucideIcon } from 'lucide-solid'

interface IconButtonProps {
  icon: LucideIcon
  label?: string
  onClick?: () => void
  class?: string
}

export const IconButton: Component<IconButtonProps> = (props) => {
  // Color scheme
  const TEXT_COLOR = "text-gray-500 dark:text-gray-400"
  const TEXT_COLOR_HOVER = "hover:text-gray-900 dark:hover:text-white"
  const BG_COLOR_HOVER = "hover:bg-gray-100 dark:hover:bg-gray-700"
  
  return (
    <button
      type="button"
      onClick={props.onClick}
      class={`p-2 ${TEXT_COLOR} rounded-lg ${TEXT_COLOR_HOVER} ${BG_COLOR_HOVER} ${props.class || ''}`}
      aria-label={props.label}
    >
      {props.label && <span class="sr-only">{props.label}</span>}
      <props.icon class="w-5 h-5" />
    </button>
  )
}
