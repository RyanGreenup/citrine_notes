import { theme } from '@renderer/theme'
import { SidebarItem } from './SidebarItem'
import { BookIcon, Compass, FlameIcon, PanelLeft } from 'lucide-solid'
import { SearchInput } from './SearchInput'

export function SearchContent() {
  const unordered_list_with_top_line = `pt-4 mt-4 space-y-2 font-medium border-t ${theme.border.light} ${theme.border.dark}`

  return (
    <div class="flex flex-col gap-4">
      <div class="px-3 pt-3">
        <SearchInput />
      </div>
      
      <ul class={unordered_list_with_top_line}>
        <SidebarItem icon={FlameIcon} href="#" label="Upgrade to Pro" />
        <SidebarItem icon={BookIcon} href="#" label="Documentation" />
        <SidebarItem icon={PanelLeft} href="#" label="Components" />
        <SidebarItem icon={Compass} href="#" label="Help" />
      </ul>
    </div>
  )
}
