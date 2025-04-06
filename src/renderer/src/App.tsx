import type { Component, JSXElement } from 'solid-js'
import type { LucideIcon } from 'lucide-solid'
import { SIDEBAR_TOP_PADDING } from './constants/layout'
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

import { NoteLayout } from './components/NoteLayout'
import { Navbar } from './components/Navbar'
import { initFlowbite } from 'flowbite'
import { onMount, createSignal } from 'solid-js'

// Color scheme variables
const BG_COLOR_LIGHT = "bg-gray-50"
const BG_COLOR_DARK = "dark:bg-gray-800"
const TEXT_COLOR_LIGHT = "text-gray-900"
const TEXT_COLOR_DARK = "dark:text-white"
const TEXT_COLOR_MUTED_LIGHT = "text-gray-500"
const TEXT_COLOR_MUTED_DARK = "dark:text-gray-400"
const HOVER_BG_LIGHT = "hover:bg-gray-100"
const HOVER_BG_DARK = "dark:hover:bg-gray-700"
const HOVER_TEXT_LIGHT = "group-hover:text-gray-900"
const HOVER_TEXT_DARK = "dark:group-hover:text-white"
const BORDER_COLOR_LIGHT = "border-gray-200"
const BORDER_COLOR_DARK = "dark:border-gray-700"

const SidebarText: Component<{
  text: string
}> = (props) => {
  return <span class="flex-1 ms-3 whitespace-nowrap">{props.text}</span>
}

const SidebarItem: Component<{
  icon: LucideIcon
  label: string
  href: string
}> = (props) => {
  let default_class =
    `flex items-center p-2 rounded-lg ${TEXT_COLOR_LIGHT} ${TEXT_COLOR_DARK} ${HOVER_BG_LIGHT} ${HOVER_BG_DARK} group`
  return (
    <>
      <li>
        <a href={props.href} class={default_class}>
          <SidebarIcon icon={props.icon} />
          <SidebarText text={props.label} />
        </a>
      </li>
    </>
  )
}

const SidebarItemWithElement: Component<{
  icon: LucideIcon
  label: string
  href: string
  element: JSXElement
}> = (props) => {
  const baseClass = ' flex items-center p-2 rounded-lg group '
  const textColor = ` ${TEXT_COLOR_LIGHT} ${TEXT_COLOR_DARK}`
  const bgColor = ` ${HOVER_BG_LIGHT} ${HOVER_BG_DARK} `
  return (
    <li>
      <a href={props.href} class={baseClass + textColor + bgColor}>
        <SidebarIcon icon={props.icon} />
        <SidebarText text={props.label} />
        {props.element}
      </a>
    </li>
  )
}

interface SidebarProps {
  isOpen: boolean
}

function Sidebar(props: SidebarProps) {
  // Required because of the Button
  onMount(() => {
    initFlowbite()
  })

  /**
   * Draw a line above an unordered list but not between items. Draws a line between two lists to separate them
   */
  let unordered_list_with_top_line =
    `pt-4 mt-4 space-y-2 font-medium border-t ${BORDER_COLOR_LIGHT} ${BORDER_COLOR_DARK}`

  let bgColor = ' bg-gray-900 dark:bg-gray-700 '
  let textColor = ' text-white '
  return (
    <>
      <aside
        id="separator-sidebar"
        class={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          props.isOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div class={`h-full px-3 py-4 overflow-y-auto ${BG_COLOR_LIGHT} ${BG_COLOR_DARK} ${SIDEBAR_TOP_PADDING}`}>
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
          <ul class={unordered_list_with_top_line}>
            <SidebarItem icon={FlameIcon} href="#" label="Upgrade to Pro" />
            <SidebarItem icon={BookIcon} href="#" label="Documentation" />
            <SidebarItem icon={PanelLeft} href="#" label="Components" />
            <SidebarItem icon={Compass} href="#" label="Help" />
          </ul>
        </div>
      </aside>
    </>
  )
}

interface TagProps {
  text: string
  bgColor?: string
  textColor?: string
}

function Tag(props: TagProps): JSXElement {
  let bgColor = 'bg-gray-100 dark:bg-gray-700 '
  let textColor = 'text-gray-800 dark:text-gray-300'
  let default_class =
    'inline-flex items-center justify-center px-2 ms-3 text-sm font-medium rounded-full'
  return (
    <>
      <span class={`${default_class} ${props.bgColor || bgColor} ${props.textColor || textColor}`}>
        {props.text}
      </span>
    </>
  )
}

/**
 * BadgeProps is an interface for defining the properties required
 * to customize a Badge component. It allows you to specify the text
 * displayed in the badge and optionally set the text and background
 * colors to be used.
 */
interface BadgeProps {
  /**
   * The text content to be displayed inside the badge.
   */
  text: string

  /**
   * Optional. The text color class for the badge.
   * If not provided, defaults to theme-specific colors.
   */
  textColor?: string

  /**
   * Optional. The background color class for the badge.
   * If not provided, defaults to theme-specific colors.
   */
  bgColor?: string
}

/**
 * Badge component displays a text string inside a rounded badge with customizable colors.
 *
 * Props:
 * - text (string): The text to display inside the badge.
 * - textColor (string, optional): A custom text color class for the badge.
 * - bgColor (string, optional): A custom background color class for the badge.
 *
 * The default colors are blue for both text and background, with dark mode variations.
 */
function Badge(props: BadgeProps): JSXElement {
  let default_class = `inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium rounded-full`
  let bgColor = 'bg-blue-100 dark:bg-blue-900'
  let textColor = 'text-blue-800 dark:text-blue-300'
  return (
    <span class={`${default_class} ${props.textColor || textColor} ${props.bgColor || bgColor}`}>
      {props.text}
    </span>
  )
}

/**
 * Sidebar Icon Component wraps an icon in the appropriate class for icons in the sidebar
 *
 * Props:
 * - icon (LucideIcon): The lucide-solid Icon to be displayed
 * - textColor (string, optional): A custom text color class for the badge.
 * - bgColor (string, optional): A custom background color class for the badge.
 */
function SidebarIcon({ icon: Icon }: { icon: LucideIcon }): JSXElement {
  return (
    <Icon
      class={`shrink-0 w-5 h-5 ${TEXT_COLOR_MUTED_LIGHT} ${TEXT_COLOR_MUTED_DARK} transition duration-75 ${HOVER_TEXT_LIGHT} ${HOVER_TEXT_DARK}`}
      aria-hidden="true"
    />
  )
}

const MainContent: Component = () => {
  const [sidebarOpen, setSidebarOpen] = createSignal(false)
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen())
  }
  
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  
  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen()} />
      <div class="p-4 sm:ml-64 mt-16 h-[calc(100vh-4rem)]">
        <NoteLayout />
      </div>
    </>
  )
}

const App: Component = () => {
  return (
    <>
      <MainContent />
    </>
  )
}

export default App
