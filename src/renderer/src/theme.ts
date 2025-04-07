/**
 * Theme configuration for the application
 * 
 * This file centralizes all theme-related variables following Tailwind CSS best practices.
 * It exports theme objects that can be imported and used throughout the application.
 */

// Color palette
export const colors = {
  // Base colors
  white: '#fff',
  black: '#000',
  
  // Gray scale
  gray: {
    50: 'var(--color-gray-50)',
    100: 'var(--color-gray-100)',
    200: 'var(--color-gray-200)',
    300: 'var(--color-gray-300)',
    400: 'var(--color-gray-400)',
    500: 'var(--color-gray-500)',
    600: 'var(--color-gray-600)',
    700: 'var(--color-gray-700)',
    800: 'var(--color-gray-800)',
    900: 'var(--color-gray-900)',
    950: 'var(--color-gray-950)',
  },
  
  // Brand colors
  blue: {
    100: 'var(--color-blue-100)',
    300: 'var(--color-blue-300)',
    500: 'var(--color-blue-500)',
    700: 'var(--color-blue-700)',
    900: 'var(--color-blue-900)',
  },
}

// Typography
export const typography = {
  fontFamily: {
    sans: 'var(--font-sans)',
    serif: 'var(--font-serif)',
    mono: 'var(--font-mono)',
  },
  fontSize: {
    xs: 'var(--text-xs)',
    sm: 'var(--text-sm)',
    base: 'var(--text-base)',
    lg: 'var(--text-lg)',
    xl: 'var(--text-xl)',
    '2xl': 'var(--text-2xl)',
  },
  fontWeight: {
    normal: 'var(--font-weight-normal)',
    medium: 'var(--font-weight-medium)',
    semibold: 'var(--font-weight-semibold)',
    bold: 'var(--font-weight-bold)',
  },
}

// Spacing
export const spacing = {
  px: '1px',
  0: '0',
  1: 'var(--spacing)',
  2: 'calc(var(--spacing) * 2)',
  3: 'calc(var(--spacing) * 3)',
  4: 'calc(var(--spacing) * 4)',
  5: 'calc(var(--spacing) * 5)',
  6: 'calc(var(--spacing) * 6)',
  8: 'calc(var(--spacing) * 8)',
  10: 'calc(var(--spacing) * 10)',
  12: 'calc(var(--spacing) * 12)',
  16: 'calc(var(--spacing) * 16)',
}

// Borders
export const borders = {
  radius: {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
    full: '9999px',
  },
}

// Shadows
export const shadows = {
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  xl: 'var(--shadow-xl)',
}

// Animations
export const animations = {
  transition: {
    fast: 'transition-all duration-150 ease-in-out',
    normal: 'transition-all duration-300 ease-in-out',
    slow: 'transition-all duration-500 ease-in-out',
  }
}

// Tailwind CSS class mappings for common use cases
export const theme = {
  // Background colors
  bg: {
    light: 'bg-gray-50',
    dark: 'dark:bg-gray-800',
    white: 'bg-white',
    primary: 'bg-blue-500 dark:bg-blue-700',
    hover: {
      light: 'hover:bg-gray-100',
      dark: 'dark:hover:bg-gray-700',
    }
  },
  
  // Text colors
  text: {
    light: 'text-gray-900',
    dark: 'dark:text-white',
    muted: {
      light: 'text-gray-500',
      dark: 'dark:text-gray-400',
    },
    hover: {
      light: 'group-hover:text-gray-900',
      dark: 'dark:group-hover:text-white',
    }
  },
  
  // Border colors
  border: {
    light: 'border-gray-200',
    dark: 'dark:border-gray-700',
  },
  
  // Layout
  layout: {
    content: 'p-4 sm:ml-64 mt-16 flex flex-col',
    contentBg: 'bg-white dark:bg-gray-900',
    contentHeight: 'min-h-screen h-[calc(100vh-4rem)]',
  },
  
  // Editor
  editor: {
    container: 'w-full flex flex-col flex-1',
    splitter: 'h-full flex-1 transition-all duration-300 ease-in-out',
    controls: 'flex items-center justify-end gap-2 p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700',
    controlButton: 'p-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
    controlButtonActive: 'bg-gray-700 text-white dark:bg-blue-600 dark:text-white',
    header: {
      container: 'flex items-center justify-between px-3 py-2 border-b',
      buttonGroup: 'flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5',
      buttonGroupSpacing: 'ml-1',
      button: 'p-1 rounded-md',
    },
    panel: {
      base: 'h-full overflow-auto flex-grow transition-all duration-300 ease-in-out',
      textarea: 'w-full h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100',
      preview: 'w-full h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md',
      content: 'prose dark:prose-invert max-w-none text-gray-900 dark:text-gray-100'
    },
    resizeTrigger: {
      base: 'w-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-col-resize flex items-center justify-center transition-colors duration-200 ease-in-out',
      handle: 'w-1 h-8 bg-gray-400 dark:bg-gray-500 rounded hover:bg-blue-400 dark:hover:bg-blue-500 transition-colors duration-200'
    }
  },

  // Sidebar
  sidebar: {
    item: {
      base: 'flex items-center p-2 rounded-lg group',
      text: {
        base: 'ml-3',
        muted: 'text-gray-400 dark:text-gray-400 group-hover:text-gray-200 dark:group-hover:text-gray-300',
        normal: 'text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-white'
      }
    },
    tabs: {
      trigger: 'p-2 rounded-t-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 data-[state=active]:text-gray-900 data-[state=active]:dark:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500'
    },
    fileTree: {
      container: 'mt-4 px-2',
      heading: 'text-sm font-medium mb-2',
      item: 'flex items-center py-1 px-2 rounded',
      itemHover: 'hover:bg-gray-100 dark:hover:bg-gray-700',
      itemText: 'flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300',
      folderIcon: 'text-yellow-500 dark:text-yellow-400',
      fileIcon: 'text-blue-500 dark:text-blue-400',
      branchContent: 'ml-4'
    },
    noteList: {
      container: 'space-y-2',
      item: 'w-full cursor-pointer transition-colors duration-150',
      selected: 'bg-gray-100 dark:bg-gray-700',
      title: 'font-medium text-sm',
      content: 'text-xs line-clamp-2 mt-1 opacity-80'
    },
    search: {
      container: 'flex flex-col gap-4',
      inputWrapper: 'px-3 pt-3',
      resultsContainer: 'px-3',
      resultsHeading: 'text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2',
      resultsList: 'max-h-[calc(100vh-200px)] overflow-y-auto',
      quickAccessHeading: 'text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2',
      quickAccessContainer: 'px-3 pt-2'
    }
  }
}
