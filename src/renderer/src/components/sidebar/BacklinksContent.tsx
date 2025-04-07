import { theme } from '@renderer/theme'
import { TreeView, createTreeCollection } from '@ark-ui/solid/tree-view'
import { BookIcon, Compass, FlameIcon, PanelLeft, FileIcon } from 'lucide-solid'
import { For } from 'solid-js'

interface BacklinkItem {
  id: string
  name: string
  icon: typeof FileIcon
  href: string
}

export function BacklinksContent() {
  const containerClass = `pt-4 mt-4 space-y-2 font-medium border-t ${theme.border.light} ${theme.border.dark}`
  
  // Define our backlinks as a flat list
  const backlinkItems: BacklinkItem[] = [
    { id: 'upgrade', name: 'Upgrade to Pro', icon: FlameIcon, href: '#' },
    { id: 'docs', name: 'Documentation', icon: BookIcon, href: '#' },
    { id: 'components', name: 'Components', icon: PanelLeft, href: '#' },
    { id: 'help', name: 'Help', icon: Compass, href: '#' }
  ]
  
  // Create a tree collection with just one level of depth
  const collection = createTreeCollection<BacklinkItem>({
    nodeToValue: (node) => node.id,
    nodeToString: (node) => node.name,
    rootNode: {
      id: 'ROOT',
      name: '',
      children: backlinkItems
    }
  })

  return (
    <div class={containerClass}>
      <TreeView.Root collection={collection} lazyMount={true}>
        <TreeView.Tree class="w-full">
          <For each={collection.rootNode.children}>
            {(node, index) => <BacklinkNode node={node} indexPath={[index()]} />}
          </For>
        </TreeView.Tree>
      </TreeView.Root>
    </div>
  )
}

// Component for rendering each backlink item
const BacklinkNode = (props: TreeView.NodeProviderProps<BacklinkItem>) => {
  const { node, indexPath } = props
  const Icon = node.icon
  
  return (
    <TreeView.NodeProvider node={node} indexPath={indexPath}>
      <TreeView.Item class="flex items-center p-2 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group">
        <a href={node.href} class="flex items-center w-full">
          <Icon class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          <span class="ms-3">{node.name}</span>
        </a>
      </TreeView.Item>
    </TreeView.NodeProvider>
  )
}
