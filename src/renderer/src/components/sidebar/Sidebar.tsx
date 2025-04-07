import { SIDEBAR_TOP_PADDING } from '@renderer/constants/layout'
import { Tabs } from '@ark-ui/solid/tabs'
import { theme } from '@renderer/theme'
import { initFlowbite } from 'flowbite'
import { onMount } from 'solid-js'
import { SidebarItem, SidebarItemWithElement } from './SidebarItem'

import {
  BookIcon,
  ChartPie,
  Compass,
  FlameIcon,
  Group,
  KanbanIcon,
  LogIn,
  Mailbox,
  PanelLeft,
  ShoppingBag,
  Signature
} from 'lucide-solid'
import { Tag } from '../common/Tag'
import { Badge } from '../common/Badge'

interface SidebarProps {
  isOpen: boolean
}

function FileTree() {
  return (
    <>
      <ul class="space-y-2 font-medium">
        <SidebarItem icon={ChartPie} href="#" label="Dashboard" />
        <SidebarItem icon={Mailbox} href="#" label="Inbox" />
        <SidebarItemWithElement
          icon={KanbanIcon}
          href="#"
          label="Kanban"
          element={<Tag text="pro" />}
        />
        <SidebarItemWithElement
          icon={Mailbox}
          href="#"
          label="Inbox"
          element={<Badge text="3" />}
        />
        <SidebarItem icon={Group} href="#" label="Users" />
        <SidebarItem icon={ShoppingBag} href="#" label="Products" />
        <SidebarItem icon={LogIn} href="#" label="Log In" />
        <SidebarItem icon={Signature} href="#" label="Sign Up" />
      </ul>
    </>
  )
}

export function Sidebar(props: SidebarProps) {
  // Required because of the Button
  onMount(() => {
    initFlowbite()
  })

  /**
   * Draw a line above an unordered list but not between items. Draws a line between two lists to separate them
   */
  let unordered_list_with_top_line = `pt-4 mt-4 space-y-2 font-medium border-t ${theme.border.light} ${theme.border.dark}`

  return (
    <>
      <aside
        id="separator-sidebar"
        class={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          props.isOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div
          class={`h-full px-3 py-4 overflow-y-auto ${theme.bg.light} ${theme.bg.dark} ${SIDEBAR_TOP_PADDING}`}
        >
          <Tabs.Root>
            <Tabs.List>
              <Tabs.Trigger value="links">Links</Tabs.Trigger>
              <Tabs.Trigger value="backlinks">Backlinks</Tabs.Trigger>
              <Tabs.Trigger value="related">Related Pages</Tabs.Trigger>
              <Tabs.Trigger value="search">Search</Tabs.Trigger>
              <Tabs.Indicator />
            </Tabs.List>
            <Tabs.Content value="links">
              <FileTree />
            </Tabs.Content>
            <Tabs.Content value="backlinks">
              <ul class={unordered_list_with_top_line}>
                <SidebarItem icon={FlameIcon} href="#" label="Upgrade to Pro" />
                <SidebarItem icon={BookIcon} href="#" label="Documentation" />
                <SidebarItem icon={PanelLeft} href="#" label="Components" />
                <SidebarItem icon={Compass} href="#" label="Help" />
              </ul>
            </Tabs.Content>
            <Tabs.Content value="related">
              <ul class={unordered_list_with_top_line}>
                <SidebarItem icon={FlameIcon} href="#" label="Upgrade to Pro" />
                <SidebarItem icon={BookIcon} href="#" label="Documentation" />
                <SidebarItem icon={PanelLeft} href="#" label="Components" />
                <SidebarItem icon={Compass} href="#" label="Help" />
              </ul>
            </Tabs.Content>
            <Tabs.Content value="search">
              <ul class={unordered_list_with_top_line}>
                <SidebarItem icon={FlameIcon} href="#" label="Upgrade to Pro" />
                <SidebarItem icon={BookIcon} href="#" label="Documentation" />
                <SidebarItem icon={PanelLeft} href="#" label="Components" />
                <SidebarItem icon={Compass} href="#" label="Help" />
              </ul>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </aside>
    </>
  )
}
