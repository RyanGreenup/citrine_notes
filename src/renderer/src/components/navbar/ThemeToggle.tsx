import type { Component } from 'solid-js'
import { MoonIcon, SunIcon } from 'lucide-solid'
import { createSignal, onMount } from 'solid-js'

export const ThemeToggle: Component = () => {
  const [isDark, setIsDark] = createSignal(false);
  
  onMount(() => {
    // Check if theme is set in localStorage
    if (localStorage.getItem('color-theme') === 'dark' || 
        (!('color-theme' in localStorage) && 
         window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  });

  const handleToggleTheme = () => {
    // Toggle dark mode
    if (isDark()) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
      setIsDark(false);
      
      // Dispatch an event to notify other components
      window.dispatchEvent(new CustomEvent('theme-changed', { detail: { isDark: false } }));
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
      setIsDark(true);
      
      // Dispatch an event to notify other components
      window.dispatchEvent(new CustomEvent('theme-changed', { detail: { isDark: true } }));
    }
  }
  
  return (
    <button 
      type="button" 
      onClick={handleToggleTheme}
      class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
      aria-label="Toggle dark mode"
    >
      {isDark() ? (
        <SunIcon class="w-5 h-5" />
      ) : (
        <MoonIcon class="w-5 h-5" />
      )}
    </button>
  )
}
