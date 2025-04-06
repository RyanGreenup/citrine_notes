import type { Component } from 'solid-js'
import { SidebarToggleButton } from './navbar/SidebarToggleButton'
import { AppLogo } from './navbar/AppLogo'
import { NavbarActions } from './navbar/NavbarActions'

interface NavbarProps {
  toggleSidebar: () => void
}

export const Navbar: Component<NavbarProps> = (props) => {
  // Color scheme
  const BG_COLOR = "bg-white dark:bg-gray-800"
  const BORDER_COLOR = "border-gray-200 dark:border-gray-700"
  
  return (
    <nav class={`fixed top-0 z-50 w-full ${BG_COLOR} border-b ${BORDER_COLOR}`}>
      <div class="px-3 py-3 lg:px-5 lg:pl-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center justify-start">
            <SidebarToggleButton onClick={props.toggleSidebar} />
            <AppLogo />
          </div>
          <NavbarActions />
        </div>
      </div>
    </nav>
  )
}
