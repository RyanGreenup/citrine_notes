import { theme } from '@renderer/theme'
import { TreeView, createTreeCollection } from '@ark-ui/solid/tree-view'
import { For, createSignal } from 'solid-js'
import { NoteListItem } from '@renderer/components/common/NoteListItem'
import { setCurrentView } from '@renderer/utils/viewUtils'

interface BacklinkNote {
  id: string
  title: string
  content: string
}

export function BacklinksContent() {
  const containerClass = `pt-4 mt-4 space-y-2 font-medium border-t ${theme.border.light} ${theme.border.dark}`
  const [selectedNoteId, setSelectedNoteId] = createSignal<string | null>(null)
  
  // Sample backlink notes - in a real app, these would come from a database or API
  const backlinkNotes: BacklinkNote[] = [
    { 
      id: 'note1', 
      title: 'Meeting Notes', 
      content: 'This document references your current note and includes important discussion points from our last meeting about the project roadmap.' 
    },
    { 
      id: 'note2', 
      title: 'Project Ideas', 
      content: 'A collection of ideas that relate to concepts mentioned in this note. We should explore these further in our next brainstorming session.' 
    },
    { 
      id: 'note3', 
      title: 'Research Findings', 
      content: 'Key research findings that support the arguments made in your current note. The data suggests a strong correlation between the variables.' 
    },
    { 
      id: 'note4', 
      title: 'Related Concepts', 
      content: 'This note explores additional concepts that build upon the foundation established in your current document.' 
    }
  ]
  
  // Create a tree collection with just one level of depth
  const collection = createTreeCollection<BacklinkNote>({
    nodeToValue: (node) => node.id,
    nodeToString: (node) => node.title,
    rootNode: {
      id: 'ROOT',
      title: '',
      content: '',
      children: backlinkNotes
    }
  })

  // Handle note selection
  const handleNoteClick = (id: string) => {
    setSelectedNoteId(id)
    setCurrentView(id)
  }

  return (
    <div class={containerClass}>
      <h3 class={`mb-3 text-sm font-semibold ${theme.text.light} ${theme.text.dark}`}>
        Notes that link to this one
      </h3>
      
      <TreeView.Root collection={collection} lazyMount={true}>
        <TreeView.Tree class="w-full space-y-2">
          <For each={collection.rootNode.children}>
            {(node, index) => (
              <TreeView.NodeProvider node={node} indexPath={[index()]}>
                <TreeView.Item class="p-0 border-0">
                  <NoteListItem
                    id={node.id}
                    title={node.title}
                    content={node.content}
                    onClick={handleNoteClick}
                    selected={selectedNoteId() === node.id}
                  />
                </TreeView.Item>
              </TreeView.NodeProvider>
            )}
          </For>
        </TreeView.Tree>
      </TreeView.Root>
    </div>
  )
}
