import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

import { parseFrontmatter } from './frontmatter'

export interface DailyFrontmatter {
  slug: string
  title: string
  publishDate: string
  summary?: string
  tags?: string[]
  status?: 'published' | 'draft'
}

export interface DailyDoc extends DailyFrontmatter {
  content: string
}

const CONTENT_ROOT = path.resolve(process.cwd(), 'content', 'daily')

export async function listDailySlugs(): Promise<string[]> {
  const entries = await fs.readdir(CONTENT_ROOT, { withFileTypes: true })
  return entries
    .filter(e => e.isFile() && e.name.endsWith('.md') && e.name !== 'README.md')
    .map(e => e.name.replace(/\.md$/, ''))
    .sort()
}

export async function getDailyBySlug(slug: string): Promise<DailyDoc | null> {
  const file = path.join(CONTENT_ROOT, `${slug}.md`)
  let raw: string
  try {
    raw = await fs.readFile(file, 'utf8')
  }
  catch {
    return null
  }

  const { fm, body } = parseFrontmatter(raw)
  const doc: DailyDoc = {
    slug: fm.slug || slug,
    title: fm.title || slug,
    publishDate: fm.publishDate || slug,
    summary: fm.summary || '',
    tags: fm.tags || [],
    status: fm.status || 'published',
    content: body.trim(),
  }

  if (doc.status !== 'published')
    return null
  return doc
}

export async function listDailyDocs(): Promise<DailyDoc[]> {
  const slugs = await listDailySlugs()
  const docs = await Promise.all(slugs.map(s => getDailyBySlug(s)))
  return docs.filter(Boolean) as DailyDoc[]
}
