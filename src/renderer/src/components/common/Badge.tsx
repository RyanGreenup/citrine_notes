export interface BadgeProps {
  text: string
  textColor?: string
  bgColor?: string
}

export function Badge(props: BadgeProps) {
  const defaultClass = `inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium rounded-full`
  const defaultBg = 'bg-blue-100 dark:bg-blue-900'
  const defaultText = 'text-blue-800 dark:text-blue-300'
  
  return (
    <span class={`${defaultClass} ${props.textColor || defaultText} ${props.bgColor || defaultBg}`}>
      {props.text}
    </span>
  )
}
