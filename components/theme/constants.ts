export const THEME_STORAGE_KEY = 'aigc-weekly-theme'

export const THEME_PRESETS = [
  { id: 'terminal', label: 'Terminal' },
  { id: 'terminal-light', label: 'Terminal Light' },
  { id: 'tahiti-gold', label: 'Tahiti Gold' },
  { id: 'hopbush', label: 'Hopbush' },
  { id: 'studio', label: 'Studio' },
  { id: 'teal', label: 'Teal' },
  { id: 'heliotrope', label: 'Heliotrope' },
  { id: 'viking', label: 'Viking' },
  { id: 'white-black', label: 'White & Black' },
  { id: 'black-white', label: 'Black & White' },
  { id: 'matrix', label: 'Matrix' },
  { id: 'pink-panther', label: 'Pink Panther' },
  { id: 'blue-screen-of-death', label: 'Blue Screen of Death' },
  { id: 'vanilla-sky', label: 'Vanilla Sky' },
  { id: 'tomato', label: 'Tomato' },
  { id: 'pistachio', label: 'Pistachio' },
] as const

export type ThemePreference = typeof THEME_PRESETS[number]['id']
