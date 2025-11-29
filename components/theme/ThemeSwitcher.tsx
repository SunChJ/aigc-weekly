'use client'

import { useEffect, useRef, useState } from 'react'

import { useMounted } from './hooks'
import { useTheme } from './ThemeContext'

export function ThemeSwitcher() {
  const { theme, themes, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLLIElement>(null)

  const mounted = useMounted()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (!mounted) {
    return (
      <ul className="menu menu--desktop menu--theme-selector">
        <li className="menu__item menu__dropdown-wrapper">
          <span className="menu__trigger">
            Theme ▾
          </span>
        </li>
      </ul>
    )
  }

  return (
    <ul className="menu menu--desktop menu--theme-selector">
      <li
        className={`menu__item menu__dropdown-wrapper ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        ref={wrapperRef}
      >
        <span className="menu__trigger">
          {themes.find(preset => preset.id === theme)?.label ?? 'Theme'}
          {' '}
          ▾
        </span>
        <ul className="menu__dropdown">
          {themes.map(preset => (
            <li key={preset.id}>
              <div
                className="menu__dropdown-item"
                onClick={(e) => {
                  e.stopPropagation()
                  setTheme(preset.id)
                  setIsOpen(false)
                }}
                style={{
                  display: 'flex',
                  padding: '5px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {preset.label}
              </div>
            </li>
          ))}
        </ul>
      </li>
    </ul>
  )
}
