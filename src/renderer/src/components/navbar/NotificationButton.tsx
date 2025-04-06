import type { Component } from 'solid-js'
import { BellIcon } from 'lucide-solid'
import { IconButton } from './IconButton'

export const NotificationButton: Component = () => {
  const handleNotificationClick = () => {
    // Notification logic would go here
    console.log('Open notifications')
  }
  
  return (
    <IconButton 
      icon={BellIcon} 
      label="View notifications" 
      onClick={handleNotificationClick} 
    />
  )
}
