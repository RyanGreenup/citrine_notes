import type { Component } from 'solid-js'
import { KanbanIcon, BellIcon, UserCircleIcon, MoonIcon, SunIcon } from 'lucide-solid'

interface NavbarProps {
  toggleSidebar: () => void
}

export const Navbar: Component<NavbarProps> = (props) => {
  // UI visibility classes
  const HIDE_ON_WIDE_SCREENS = "sm:hidden"
  
  // Color scheme
  const BG_COLOR = "bg-white dark:bg-gray-800"
  const BORDER_COLOR = "border-gray-200 dark:border-gray-700"
  const TEXT_COLOR = "text-gray-500 dark:text-gray-400"
  const TEXT_COLOR_HOVER = "hover:text-gray-900 dark:hover:text-white"
  const BG_COLOR_HOVER = "hover:bg-gray-100 dark:hover:bg-gray-700"
  const FOCUS_RING = "focus:ring-gray-300 dark:focus:ring-gray-600"
  const HEADING_TEXT = "text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white"
  
  return (
    <nav class={`fixed top-0 z-50 w-full ${BG_COLOR} border-b ${BORDER_COLOR}`}>
      <div class="px-3 py-3 lg:px-5 lg:pl-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center justify-start">
            <button
              onClick={props.toggleSidebar}
              type="button"
              class={`inline-flex items-center p-2 text-sm ${TEXT_COLOR} rounded-lg ${HIDE_ON_WIDE_SCREENS} ${BG_COLOR_HOVER} focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600`}
            >
              <span class="sr-only">Open sidebar</span>
              <KanbanIcon class="w-6 h-6" />
            </button>
            <a href="#" class="flex ml-2 md:mr-24">
              <span class={`self-center ${HEADING_TEXT}`}>
                Note App
              </span>
            </a>
          </div>
          <div class="flex items-center">
            <div class="flex items-center ml-3">
              <div class="flex space-x-3">
                <button
                  type="button"
                  class={`p-2 ${TEXT_COLOR} rounded-lg ${TEXT_COLOR_HOVER} ${BG_COLOR_HOVER}`}
                >
                  <MoonIcon class="w-5 h-5" />
                </button>
                <button
                  type="button"
                  class={`p-2 ${TEXT_COLOR} rounded-lg ${TEXT_COLOR_HOVER} ${BG_COLOR_HOVER}`}
                >
                  <BellIcon class="w-5 h-5" />
                </button>
                <button
                  type="button"
                  class={`flex text-sm bg-gray-800 rounded-full focus:ring-4 ${FOCUS_RING}`}
                  id="user-menu-button"
                  aria-expanded="false"
                >
                  <span class="sr-only">Open user menu</span>
                  <UserCircleIcon class="w-8 h-8 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
