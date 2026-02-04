import type { DailyDoc } from './fs'
import type { WeeklyListParams, WeeklyListResult } from './types'

import { cache } from 'react'

import { getDailyBySlug, listDailyDocs } from './fs'

// NOTE: Migration to filesystem-backed content.
// We keep the old public function names so the frontend routes don't need to change.

export interface WeeklyListItem {
  id: number
  slug: string
  title: string
  summary: string
  content: string
  publishDate: string
  tags?: string[]
}

function toWeeklyListItem(doc: DailyDoc, id: number): WeeklyListItem {
  return {
    id,
    slug: doc.slug,
    title: doc.title,
    summary: doc.summary || '',
    content: doc.content,
    publishDate: doc.publishDate,
    tags: doc.tags || [],
  }
}

const getAll = cache(async () => {
  const docs = await listDailyDocs()
  // newest first by publishDate/slug
  docs.sort((a, b) => (b.publishDate || '').localeCompare(a.publishDate || ''))
  return docs
})

export async function getWeeklyList(params: WeeklyListParams = {}): Promise<WeeklyListResult> {
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 3

  const docs = await getAll()
  const totalDocs = docs.length
  const totalPages = Math.max(1, Math.ceil(totalDocs / pageSize))
  const p = Math.min(Math.max(1, page), totalPages)

  const start = (p - 1) * pageSize
  const slice = docs.slice(start, start + pageSize)

  return {
    items: slice.map((d, idx) => toWeeklyListItem(d, start + idx + 1)),
    pagination: {
      page: p,
      pageSize,
      totalDocs,
      totalPages,
      hasPrevPage: p > 1,
      hasNextPage: p < totalPages,
    },
  }
}

export async function getWeeklyBySlug(slug: string) {
  const docs = await getAll()
  const current = await getDailyBySlug(slug)
  if (!current)
    return null

  // adjacent by sorted list
  const sorted = [...docs].sort((a, b) => (b.publishDate || '').localeCompare(a.publishDate || ''))
  const idx = sorted.findIndex(d => d.slug === current.slug)
  const prev = idx >= 0 ? sorted[idx + 1] : null
  const next = idx > 0 ? sorted[idx - 1] : null

  return {
    ...toWeeklyListItem(current, 0),
    issueNumber: current.slug,
    prev: prev ? { title: prev.title, slug: prev.slug } : null,
    next: next ? { title: next.title, slug: next.slug } : null,
  }
}
