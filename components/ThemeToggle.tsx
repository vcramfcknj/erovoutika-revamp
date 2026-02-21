'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="relative w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:border-orange-400 hover:bg-orange-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-orange-500 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
    >
      <Sun
        className={`absolute w-4 h-4 text-orange-500 transition-all duration-300 ${
          theme === 'light' ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-90'
        }`}
      />
      <Moon
        className={`absolute w-4 h-4 text-orange-400 transition-all duration-300 ${
          theme === 'dark' ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'
        }`}
      />
    </button>
  )
}