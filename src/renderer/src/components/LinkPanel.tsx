import { Component } from 'solid-js'

interface Link {
  id: string
  title: string
}

interface LinkPanelProps {
  title: string
  links: Link[]
}

/**
 * LinkItem component displays a single link in a link panel
 */
const LinkItem: Component<{ link: Link }> = (props) => {
  return (
    <li class="py-1">
      <a 
        href={`#${props.link.id}`} 
        class="text-blue-600 dark:text-blue-400 hover:underline"
      >
        {props.link.title}
      </a>
    </li>
  )
}

/**
 * LinkPanel component displays a list of links with a title
 * Used for both backlinks and forward links
 */
export const LinkPanel: Component<LinkPanelProps> = (props) => {
  return (
    <div class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {props.title}
      </h3>
      {props.links.length > 0 ? (
        <ul class="space-y-1">
          {props.links.map(link => (
            <LinkItem link={link} />
          ))}
        </ul>
      ) : (
        <p class="text-gray-500 dark:text-gray-400 italic">No links found</p>
      )}
    </div>
  )
}
