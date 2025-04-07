
import type { Component } from 'solid-js'

/**
 * This simply returns the date and time as it's convenient for users.
 */
const getCurrentDateTime = (): string => {
  const now = new Date();
  // Use something like Saturday 3rd November AI!
  return now.toLocaleString();
}

export const AppLogo: Component = () => {
  // Color scheme
  const HEADING_TEXT = "text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white"

  return (
    <a href="#" class="flex ml-2 md:mr-24">
      <span class={`self-center ${HEADING_TEXT}`}>
        {getCurrentDateTime()}
      </span>
    </a>
  )
}

// export const AppLogo: Component = () => {
//   // Color scheme
//   const HEADING_TEXT = "text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white"
//
//   return (
//     <a href="#" class="flex ml-2 md:mr-24">
//       <span class={`self-center ${HEADING_TEXT}`}>
//         Note App
//       </span>
//     </a>
//   )
// }
