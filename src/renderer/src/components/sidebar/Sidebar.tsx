import { SIDEBAR_TOP_PADDING } from '@renderer/constants/layout'
import { Tabs } from '@ark-ui/solid/tabs'
import { theme } from '@renderer/theme'
import { initFlowbite } from 'flowbite'
import { onMount } from 'solid-js'
import { SidebarItem, SidebarItemWithElement } from './SidebarItem'
import { BacklinksContent } from './BacklinksContent'
import { RelatedContent } from './RelatedContent'
import { SearchContent } from './SearchContent'

import {
  ChartPie,
  Group,
  KanbanIcon,
  LogIn,
  Mailbox,
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
              <BacklinksContent />
            </Tabs.Content>
            <Tabs.Content value="related">
              <RelatedContent />
            </Tabs.Content>
            <Tabs.Content value="search">
              <SearchContent />
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </aside>
    </>
  )
}
