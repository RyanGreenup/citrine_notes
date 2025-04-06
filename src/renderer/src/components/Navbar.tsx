import type { Component } from 'solid-js'
import { KanbanIcon, BellIcon, UserCircleIcon, MoonIcon, SunIcon } from 'lucide-solid'

interface NavbarProps {
  toggleSidebar: () => void
}

export const Navbar: Component<NavbarProps> = (props) => {
  // Class that hides elements on screens wider than small breakpoint (640px+)
  const HIDE_ON_WIDE_SCREENS = "sm:hidden"
  
  return (
    <nav class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div class="px-3 py-3 lg:px-5 lg:pl-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center justify-start">
            <button
              onClick={props.toggleSidebar}
              type="button"
              class={`inline-flex items-center p-2 text-sm text-gray-500 rounded-lg ${HIDE_ON_WIDE_SCREENS} hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600`}
            >
              <span class="sr-only">Open sidebar</span>
              <KanbanIcon class="w-6 h-6" />
            </button>
            <a href="#" class="flex ml-2 md:mr-24">
              <span class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                Note App
              </span>
            </a>
          </div>
          <div class="flex items-center">
            <div class="flex items-center ml-3">
              <div class="flex space-x-3">
                <button
                  type="button"
                  class="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  <MoonIcon class="w-5 h-5" />
                </button>
                <button
                  type="button"
                  class="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  <BellIcon class="w-5 h-5" />
                </button>
                <button
                  type="button"
                  class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
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
