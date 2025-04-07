
import type { Component } from 'solid-js'

/**
 * This simply returns the date and time as it's convenient for users.
 */
// Will this tick as time moves AI?
const getCurrentDateTime = (): string => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    hour: '2-digit', 
    minute: '2-digit' 
  };
  return now.toLocaleDateString(undefined, options);
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
