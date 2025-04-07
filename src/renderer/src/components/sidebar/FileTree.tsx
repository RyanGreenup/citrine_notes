
import { TreeView, createTreeCollection } from '@ark-ui/solid/tree-view'
import { CheckSquareIcon, ChevronRightIcon, FileIcon, FolderIcon } from 'lucide-solid'
import { For, Show } from 'solid-js'
import { theme } from '../../theme'

interface Node {
  id: string
  name: string
  children?: Node[]
}

const collection = createTreeCollection<Node>({
  nodeToValue: (node) => node.id,
  nodeToString: (node) => node.name,
  rootNode: {
    id: 'ROOT',
    name: '',
    children: [
      {
        id: 'notes',
        name: 'Notes',
        children: [
          { id: 'notes/personal', name: 'Personal' },
          { id: 'notes/work', name: 'Work' },
          {
            id: 'notes/projects',
            name: 'Projects',
            children: [
              { id: 'notes/projects/project1', name: 'Project 1' },
              { id: 'notes/projects/project2', name: 'Project 2' },
            ],
          },
        ],
      },
      {
        id: 'resources',
        name: 'Resources',
        children: [
          { id: 'resources/images', name: 'Images' },
          { id: 'resources/documents', name: 'Documents' },
        ],
      },
      { id: 'trash', name: 'Trash' },
    ],
  },
})

const TreeNode = (props: TreeView.NodeProviderProps<Node>) => {
  const { node, indexPath } = props
  return (
    <TreeView.NodeProvider node={node} indexPath={indexPath}>
      <Show
        when={node.children}
        fallback={
          <TreeView.Item class={`flex items-center py-1 px-2 ${theme.bg.hover.light} ${theme.bg.hover.dark} rounded`}>
            <TreeView.ItemText class="flex items-center gap-2 text-sm">
              <FileIcon size={16} />
              {node.name}
            </TreeView.ItemText>
          </TreeView.Item>
        }
      >
        <TreeView.Branch>
          <TreeView.BranchControl class={`flex items-center py-1 px-2 ${theme.bg.hover.light} ${theme.bg.hover.dark} rounded`}>
            <TreeView.BranchText class="flex items-center gap-2 text-sm">
              <FolderIcon size={16} />
              {node.name}
            </TreeView.BranchText>
            <TreeView.BranchIndicator class="ml-auto">
              <ChevronRightIcon size={16} />
            </TreeView.BranchIndicator>
          </TreeView.BranchControl>
          <TreeView.BranchContent class="ml-4">
            <For each={node.children}>
              {(child, index) => <TreeNode node={child} indexPath={[...indexPath, index()]} />}
            </For>
          </TreeView.BranchContent>
        </TreeView.Branch>
      </Show>
    </TreeView.NodeProvider>
  )
}

export function FileTree() {
  return (
    <div class="mt-4 px-2">
      <h3 class={`text-sm font-medium mb-2 ${theme.text.light} ${theme.text.dark}`}>Files</h3>
      <TreeView.Root collection={collection}>
        <TreeView.Tree class="w-full">
          <For each={collection.rootNode.children}>
            {(node, index) => <TreeNode node={node} indexPath={[index()]} />}
          </For>
        </TreeView.Tree>
      </TreeView.Root>
    </div>
  )
}

export default FileTree
