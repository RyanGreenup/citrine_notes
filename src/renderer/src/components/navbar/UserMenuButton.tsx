import type { Component } from 'solid-js'
import { UserCircleIcon } from 'lucide-solid'

export const UserMenuButton: Component = () => {
  // Color scheme
  const FOCUS_RING = "focus:ring-gray-300 dark:focus:ring-gray-600"
  
  return (
    <button
      type="button"
      class={`flex text-sm bg-gray-800 rounded-full focus:ring-4 ${FOCUS_RING}`}
      id="user-menu-button"
      aria-expanded="false"
    >
      <span class="sr-only">Open user menu</span>
      <UserCircleIcon class="w-8 h-8 text-gray-400" />
    </button>
  )
}
