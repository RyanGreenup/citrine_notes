import type { Component, JSX } from 'solid-js'
import type { LucideIcon } from 'lucide-solid'
import { theme } from '../../theme'

interface IconButtonProps {
  icon: LucideIcon
  label?: string
  onClick?: () => void
  class?: string
}

export const IconButton: Component<IconButtonProps> = (props) => {
  return (
    <button
      type="button"
      onClick={props.onClick}
      class={`p-2 ${theme.text.muted.light} ${theme.text.muted.dark} rounded-lg ${theme.text.hover.light} ${theme.text.hover.dark} ${theme.bg.hover.light} ${theme.bg.hover.dark} ${props.class || ''}`}
      aria-label={props.label}
    >
      {props.label && <span class="sr-only">{props.label}</span>}
      <props.icon class="w-5 h-5" />
    </button>
  )
}
