import type { Component, JSXElement } from 'solid-js'
import type { LucideIcon } from 'lucide-solid'
import { theme } from '../../theme'
import { SidebarIcon } from './SidebarIcon'

const SidebarText: Component<{
  text: string
  muted?: boolean
}> = (props) => {
  const textClass = props.muted
    ? `${theme.sidebar.item.text.base} ${theme.sidebar.item.text.muted}`
    : `${theme.sidebar.item.text.base} ${theme.sidebar.item.text.normal}`

  return <span class={textClass}>{props.text}</span>
}

export const SidebarItem: Component<{
  icon: LucideIcon
  label: string
  href: string
  muted?: boolean
}> = (props) => {
  return (
    <li>
      <a href={props.href} class={theme.sidebar.item.base}>
        <SidebarIcon icon={props.icon} />
        <SidebarText text={props.label} muted={props.muted} />
      </a>
    </li>
  )
}

export const SidebarItemWithElement: Component<{
  icon: LucideIcon
  label: string
  href: string
  element: JSXElement
  muted?: boolean
}> = (props) => {
  return (
    <li>
      <a href={props.href} class={theme.sidebar.item.base}>
        <SidebarIcon icon={props.icon} />
        <SidebarText text={props.label} muted={props.muted} />
        {props.element}
      </a>
    </li>
  )
}
