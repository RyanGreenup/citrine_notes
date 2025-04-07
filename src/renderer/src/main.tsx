import './assets/main.css'

import { render } from 'solid-js/web'
import App from './App'

// Initialize dark mode
const initDarkMode = () => {
  // On page load or when changing themes, best to add inline to avoid FOUC
  if (localStorage.getItem('color-theme') === 'dark' || 
      (!('color-theme' in localStorage) && 
       window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Run dark mode initialization
initDarkMode();

render(() => <App />, document.getElementById('root') as HTMLElement)
