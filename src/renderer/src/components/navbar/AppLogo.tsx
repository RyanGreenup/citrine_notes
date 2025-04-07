
import type { Component } from 'solid-js'

/**
 * This simply returns the date and time as it's convenient for users.
 */
export const AppLogo: Component = () => {
  // Color scheme
  const HEADING_TEXT = "text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white"

  return (
    <a href="#" class="flex ml-2 md:mr-24">
      <span class={`self-center ${HEADING_TEXT}`}>
      // Replace this with a call to a function that returnes datetime AI!
       2025-04-07 12:34:56
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
