import fs from 'node:fs/promises'
import path from 'node:path'

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

function parseFrontmatter(raw: string): { fm: Record<string, any>, body: string } {
  if (!raw.startsWith('---')) return { fm: {}, body: raw }
  const end = raw.indexOf('\n---', 3)
  if (end === -1) return { fm: {}, body: raw }
  const fmRaw = raw.slice(3, end).trim()
  const body = raw.slice(end + 4).replace(/^\n/, '')
  const fm: Record<string, any> = {}

  // very small YAML subset: key: value, arrays like [a, b]
  for (const line of fmRaw.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_\-]+):\s*(.*)$/)
    if (!m) continue
    const key = m[1]
    let val: any = m[2].trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    } else if (val.startsWith('[') && val.endsWith(']')) {
      const inner = val.slice(1, -1).trim()
      val = inner ? inner.split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')) : []
    }
    fm[key] = val
  }

  return { fm, body }
}

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
  } catch {
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

  if (doc.status !== 'published') return null
  return doc
}

export async function listDailyDocs(): Promise<DailyDoc[]> {
  const slugs = await listDailySlugs()
  const docs = await Promise.all(slugs.map(s => getDailyBySlug(s)))
  return docs.filter(Boolean) as DailyDoc[]
}
