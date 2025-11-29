'use client'

import type { THEME_PRESETS, ThemePreference } from './constants'
import { createContext, use } from 'react'

export interface ThemeContextValue {
  theme: ThemePreference
  setTheme: (value: ThemePreference) => void
  toggleTheme: () => void
  themes: typeof THEME_PRESETS
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function useTheme() {
  const context = use(ThemeContext)
  if (!context)
    throw new Error('useTheme must be used within ThemeProvider')

  return context
}
