import React from 'react'
import { themeScript } from './theme-script'

export function ThemeScript() {
  return React.createElement('script', {
    dangerouslySetInnerHTML: {
      __html: themeScript,
    },
  })
}
