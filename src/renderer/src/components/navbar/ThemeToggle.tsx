import type { Component } from 'solid-js'
import { MoonIcon } from 'lucide-solid'
import { IconButton } from './IconButton'

export const ThemeToggle: Component = () => {
  const handleToggleTheme = () => {
    // Theme toggle logic would go here
    console.log('Toggle theme')
  }
  
  return (
    <IconButton 
      icon={MoonIcon} 
      label="Toggle theme" 
      onClick={handleToggleTheme} 
    />
  )
}
