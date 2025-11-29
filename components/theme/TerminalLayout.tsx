'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { ThemeSwitcher } from '@/components/theme'

import { siteConfig } from '@/lib/config'

interface TerminalLayoutProps {
  header?: ReactNode
  children: ReactNode
  footer?: ReactNode
}

function HeaderNav() {
  return (
    <div className="header__inner">
      <h1 className="header__logo">
        <Link href="/" className="logo">
          {siteConfig.title}
        </Link>
      </h1>
      <ThemeSwitcher />
    </div>
  )
}

export function TerminalLayout({ header, children, footer }: TerminalLayoutProps) {
  return (
    <div className="container">
      <header className="header">
        <HeaderNav />
      </header>

      <main className="content">
        {header}
        {children}
      </main>

      <footer className="footer">
        <div className="footer__inner">
          <div className="copyright">
            <span>
              ©
              {new Date().getFullYear()}
              {' '}
              {siteConfig.title}
            </span>
            <span>
              :: Theme based on
              {' '}
              <a href="https://github.com/panr/hugo-theme-terminal" target="_blank" rel="noreferrer">Terminal</a>
            </span>
          </div>
        </div>
        {footer}
      </footer>
    </div>
  )
}
