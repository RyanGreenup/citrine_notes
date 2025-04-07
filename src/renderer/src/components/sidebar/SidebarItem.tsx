import type { Component, JSXElement } from 'solid-js'
import type { LucideIcon } from 'lucide-solid'
import { SidebarIcon } from './SidebarIcon'
import { SidebarText } from './SidebarText'

export const SidebarItem: Component<{
  icon: LucideIcon
  label: string
  href: string
}> = (props) => {
  const defaultClass = `flex items-center p-2 rounded-lg group`
  
  return (
    <li>
      <a href={props.href} class={defaultClass}>
        <SidebarIcon icon={props.icon} />
        <SidebarText text={props.label} />
      </a>
    </li>
  )
}

export const SidebarItemWithElement: Component<{
  icon: LucideIcon
  label: string
  href: string
  element: JSXElement
}> = (props) => {
  const baseClass = 'flex items-center p-2 rounded-lg group'
  
  return (
    <li>
      <a href={props.href} class={baseClass}>
        <SidebarIcon icon={props.icon} />
        <SidebarText text={props.label} />
        {props.element}
      </a>
    </li>
  )
}
