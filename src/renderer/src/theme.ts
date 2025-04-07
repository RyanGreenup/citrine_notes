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
    content: 'p-4 sm:ml-64 mt-16',
    contentBg: 'bg-white dark:bg-gray-900',
    contentHeight: 'min-h-screen',
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
    }
  }
}
