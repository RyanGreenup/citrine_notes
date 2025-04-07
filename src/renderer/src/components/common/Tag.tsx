export interface TagProps {
  text: string
  bgColor?: string
  textColor?: string
}

export function Tag(props: TagProps) {
  const defaultClass = 'inline-flex items-center justify-center px-2 ms-3 text-sm font-medium rounded-full'
  const defaultBg = 'bg-gray-100 dark:bg-gray-700'
  const defaultText = 'text-gray-800 dark:text-gray-300'
  
  return (
    <span class={`${defaultClass} ${props.bgColor || defaultBg} ${props.textColor || defaultText}`}>
      {props.text}
    </span>
  )
}
