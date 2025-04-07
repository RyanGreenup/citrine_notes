import type { LucideIcon } from 'lucide-solid'
import { theme } from '../../theme'

export function SidebarIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <Icon
      class={`shrink-0 w-5 h-5 ${theme.text.muted.light} ${theme.text.muted.dark} transition duration-75 ${theme.text.hover.light} ${theme.text.hover.dark}`}
      aria-hidden="true"
    />
  )
}
