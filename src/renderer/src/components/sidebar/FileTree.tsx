
import { TreeView, createTreeCollection } from '@ark-ui/solid/tree-view'
import { ChevronRightIcon, FileIcon, FolderIcon } from 'lucide-solid'
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
          <TreeView.Item class={`${theme.sidebar.fileTree.item} ${theme.sidebar.fileTree.itemHover}`}>
            <TreeView.ItemText class={theme.sidebar.fileTree.itemText}>
              <FileIcon size={16} class={theme.sidebar.fileTree.fileIcon} />
              {node.name}
            </TreeView.ItemText>
          </TreeView.Item>
        }
      >
        <TreeView.Branch>
          <TreeView.BranchControl class={`${theme.sidebar.fileTree.item} ${theme.sidebar.fileTree.itemHover}`}>
            <TreeView.BranchText class={theme.sidebar.fileTree.itemText}>
              <FolderIcon size={16} class={theme.sidebar.fileTree.folderIcon} />
              {node.name}
            </TreeView.BranchText>
            <TreeView.BranchIndicator class="ml-auto">
              <ChevronRightIcon size={16} class={`transition-transform duration-200 ${theme.text.muted.light} ${theme.text.muted.dark}`} />
            </TreeView.BranchIndicator>
          </TreeView.BranchControl>
          <TreeView.BranchContent class={theme.sidebar.fileTree.branchContent}>
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
  const handleFocusChange = (details: { value: string }) => {
    console.log('Focus changed to node:', details)
  }

  return (
    <div class={theme.sidebar.fileTree.container}>
      <h3 class={`${theme.sidebar.fileTree.heading} ${theme.text.light} ${theme.text.dark}`}>Files</h3>
      <TreeView.Root
        collection={collection}
        lazyMount={true}
        onFocusChange={handleFocusChange}
      >
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
