import type { ReactNode } from 'react'
import Link from 'next/link'

interface PaginationLink {
  href: string
  text: ReactNode
}

interface PaginationProps {
  title?: string
  prev?: PaginationLink
  next?: PaginationLink
}

export function Pagination({ title = '', prev, next }: PaginationProps) {
  if (!prev && !next)
    return null

  return (
    <div className="pagination">
      <div className="pagination__title">
        <span className="pagination__title-h">{title}</span>
        <hr />
      </div>
      <div className="pagination__buttons">
        {prev && (
          <span className="button prev">
            <Link href={prev.href}>
              <span className="button__icon">←</span>
              <span className="button__text">{prev.text}</span>
            </Link>
          </span>
        )}
        {next && (
          <span className="button next">
            <Link href={next.href}>
              <span className="button__text">{next.text}</span>
              <span className="button__icon">→</span>
            </Link>
          </span>
        )}
      </div>
    </div>
  )
}
