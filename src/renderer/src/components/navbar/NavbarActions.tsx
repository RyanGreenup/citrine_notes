import type { Component } from 'solid-js'
import { ThemeToggle } from './ThemeToggle'
import { NotificationButton } from './NotificationButton'
import { UserMenuButton } from './UserMenuButton'

export const NavbarActions: Component = () => {
  return (
    <div class="flex items-center">
      <div class="flex items-center ml-3">
        <div class="flex space-x-3">
          <ThemeToggle />
          <NotificationButton />
          <UserMenuButton />
        </div>
      </div>
    </div>
  )
}
