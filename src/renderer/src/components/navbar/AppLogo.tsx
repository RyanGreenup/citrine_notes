
// Not all of thesse should be type AI!
import type { Component, onCleanup, onMount, createSignal } from 'solid-js'

/**
 * This simply returns the date and time as it's convenient for users.
 */
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

  // Reactive signal for the current date and time
  const [currentDateTime, setCurrentDateTime] = createSignal(getCurrentDateTime());

  // Update the date and time every second
  let interval: NodeJS.Timeout;
  onMount(() => {
    interval = setInterval(() => {
      setCurrentDateTime(getCurrentDateTime());
    }, 1000);
  });

  // Clean up the interval when the component is unmounted
  onCleanup(() => {
    clearInterval(interval);
  });

  return (
    <a href="#" class="flex ml-2 md:mr-24">
      <span class={`self-center ${HEADING_TEXT}`}>
        {currentDateTime()}
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
