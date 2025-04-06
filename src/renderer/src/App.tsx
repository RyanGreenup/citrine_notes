import type { Component, JSXElement, ComponentProps } from 'solid-js'
import type { LucideIcon } from 'lucide-solid'
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

import { FillerContent } from './components/FillerContent'

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
    'flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
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
  const baseClass = ' flex items-center p-2 rounded-lg dark:text-white group '
  const textColor = ' text-gray-900 dark:text-white'
  const bgColor = ' hover:bg-gray-100 dark:hover:bg-gray-700 '
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

function Sidebar() {
  /**
   * Draw a line above an unordered list but not between items. Drawes a line between two lists to separate them
   */
  let unordered_list_with_top_line =
    'pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700'

  let bgColor = ' bg-gray-900 dark:bg-gray-700 '
  let textColor = ' text-white '
  return (
    <>
      <div
        id="tooltip-default"
        role="tooltip"
        class={
          `absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300  rounded-lg shadow-xs opacity-0 tooltip ` +
          bgColor +
          textColor
        }
      >
        Tooltip content
        <div class="tooltip-arrow" data-popper-arrow></div>
      </div>
      <button
        data-tooltip-target="tooltip-default"
        data-drawer-target="separator-sidebar"
        data-drawer-toggle="separator-sidebar"
        aria-controls="separator-sidebar"
        type="button"
        class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span class="sr-only">Open sidebar</span>
        <SidebarIcon icon={KanbanIcon} />
      </button>
      <aside
        id="separator-sidebar"
        class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
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
  let textColor = 'dark:text-gray-300 text-gray-800'
  let default_class =
    'inline-flex items-center justify-center px-2 ms-3 text-sm font-medium   rounded-full'
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
      class="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
      aria-hidden="true"
    />
  )
}

const DummyContent: Component = () => {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  return (
    <>
      <FillerContent />
      <Sidebar />
    </>
  )
}

const App: Component = () => {
  return (
    <>
      <DummyContent />
    </>
  )
}

export default App
