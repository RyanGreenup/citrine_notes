import { JSXElement } from 'solid-js'

interface TagProps {
  text: string
  bgColor?: string
  textColor?: string
}

export function Tag(props: TagProps): JSXElement {
  let bgColor = 'bg-gray-100 dark:bg-gray-700 '
  let textColor = 'text-gray-800 dark:text-gray-300'
  let default_class =
    'inline-flex items-center justify-center px-2 ms-3 text-sm font-medium rounded-full'
  return (
    <>
      <span class={`${default_class} ${props.bgColor || bgColor} ${props.textColor || textColor}`}>
        {props.text}
      </span>
    </>
  )
}
