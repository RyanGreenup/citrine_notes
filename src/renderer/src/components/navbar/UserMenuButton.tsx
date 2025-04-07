import type { Component } from 'solid-js'
import { UserCircleIcon } from 'lucide-solid'
import { theme } from '../../theme'

export const UserMenuButton: Component = () => {
  return (
    <button
      type="button"
      class={`flex text-sm ${theme.bg.primary} rounded-full focus:ring-4 ${theme.border.light} ${theme.border.dark}`}
      id="user-menu-button"
      aria-expanded="false"
    >
      <span class="sr-only">Open user menu</span>
      <UserCircleIcon class={`w-8 h-8 ${theme.text.muted.light}`} />
    </button>
  )
}
