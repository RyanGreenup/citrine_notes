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
  Signature,
  FolderTree,
  Link,
  ArrowLeftRight,
  FileStack,
  Search
} from 'lucide-solid'
import { Tag } from '../common/Tag'
import { Badge } from '../common/Badge'
import FileTree from './FileTree'

interface SidebarProps {
  isOpen: boolean
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
            <Tabs.List class={`flex justify-between mb-4 border-b ${theme.border.light} ${theme.border.dark}`}>
              <Tabs.Trigger value="note_tree" class={theme.sidebar.tabs.trigger}>
                <FolderTree size={18} />
              </Tabs.Trigger>
              <Tabs.Trigger value="links" class={theme.sidebar.tabs.trigger}>
                <Link size={18} />
              </Tabs.Trigger>
              <Tabs.Trigger value="backlinks" class={theme.sidebar.tabs.trigger}>
                <ArrowLeftRight size={18} />
              </Tabs.Trigger>
              <Tabs.Trigger value="related" class={theme.sidebar.tabs.trigger}>
                <FileStack size={18} />
              </Tabs.Trigger>
              <Tabs.Trigger value="search" class={theme.sidebar.tabs.trigger}>
                <Search size={18} />
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="note_tree">
            <FileTree/>
            </Tabs.Content>
            <Tabs.Content value="links">
              <BacklinksContent />
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
