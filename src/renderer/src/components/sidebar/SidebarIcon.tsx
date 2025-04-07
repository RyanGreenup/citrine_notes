import type { LucideIcon } from 'lucide-solid'
import { theme } from '../../theme'
import { JSXElement } from 'solid-js'

/**
 * Sidebar Icon Component wraps an icon in the appropriate class for icons in the sidebar
 *
 * Props:
 * - icon (LucideIcon): The lucide-solid Icon to be displayed
 * - textColor (string, optional): A custom text color class for the badge.
 * - bgColor (string, optional): A custom background color class for the badge.
 */
export function SidebarIcon({ icon: Icon }: { icon: LucideIcon }): JSXElement {
  return (
    <Icon
      class={`shrink-0 w-5 h-5 ${theme.text.muted.light} ${theme.text.muted.dark} transition duration-75 ${theme.text.hover.light} ${theme.text.hover.dark}`}
      aria-hidden="true"
    />
  )
}
