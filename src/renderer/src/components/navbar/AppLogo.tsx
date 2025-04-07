import type { Component } from 'solid-js'

import type { Component } from 'solid-js'

export const AppLogo: Component = () => {
  // Color scheme
  const HEADING_TEXT = "text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white"
  
  return (
    <a href="#" class="flex ml-2 md:mr-24">
      <span class={`self-center ${HEADING_TEXT}`}>
        Note App - 2025-04-07 12:34:56
      </span>
    </a>
  )
}
