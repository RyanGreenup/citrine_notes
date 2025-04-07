import { Component, JSX } from 'solid-js'
import { theme } from '@renderer/theme'
import { FileTextIcon } from 'lucide-solid'

export interface NoteListItemProps {
  id: string
  title: string
  content: string
  onClick?: (id: string) => void
  selected?: boolean
  truncateContent?: boolean
  maxContentLength?: number
  class?: string
}

export const NoteListItem: Component<NoteListItemProps> = (props) => {
  const {
    id,
    title,
    content,
    onClick,
    selected = false,
    truncateContent = true,
    maxContentLength = 120,
    class: additionalClass = ''
  } = props

  // Process content for display
  const displayContent = () => {
    if (!content) return ''
    
    let processedContent = content.replace(/\n/g, ' ').trim()
    if (truncateContent && processedContent.length > maxContentLength) {
      processedContent = `${processedContent.substring(0, maxContentLength)}...`
    }
    return processedContent
  }

  // Handle click event
  const handleClick: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent> = (e) => {
    e.preventDefault()
    if (onClick) onClick(id)
  }

  // Combine classes based on theme and selected state
  const containerClasses = `
    ${theme.sidebar.item.base}
    ${theme.sidebar.fileTree.item}
    ${theme.sidebar.fileTree.itemHover}
    ${selected ? 'bg-gray-100 dark:bg-gray-700' : ''}
    ${additionalClass}
  `.trim()

  return (
    <div 
      class={containerClasses}
      onClick={handleClick}
      data-note-id={id}
      role="button"
      tabIndex={0}
    >
      <div class="flex flex-col w-full">
        <div class="flex items-center">
          <FileTextIcon class="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
          <span class={`font-medium ${theme.text.light} ${theme.text.dark}`}>
            {title || 'Untitled Note'}
          </span>
        </div>
        
        {content && (
          <p class={`mt-1 text-sm ${theme.text.muted.light} ${theme.text.muted.dark} line-clamp-2`}>
            {displayContent()}
          </p>
        )}
      </div>
    </div>
  )
}
