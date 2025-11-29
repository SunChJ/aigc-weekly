import type { PaginatedDocs } from 'payload'
import type { Weekly } from '@/payload-types'
import payloadConfig from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

const DEFAULT_PAGE_SIZE = 3
const MAX_PAGE_SIZE = 50

const getPayloadClient = cache(async () => {
  const config = await payloadConfig
  return getPayload({ config })
})

export interface WeeklyListParams {
  page?: number
  pageSize?: number
}

export interface WeeklyListItem {
  id: number
  slug: string
  title: string
  summary: string
  content: string
  publishDate: string
  tags?: string[]
}

export interface WeeklyListResult {
  items: WeeklyListItem[]
  pagination: {
    page: number
    pageSize: number
    totalDocs: number
    totalPages: number
    hasPrevPage: boolean
    hasNextPage: boolean
  }
}

export async function getWeeklyList(params: WeeklyListParams = {}): Promise<WeeklyListResult> {
  const page = normalizePositiveInteger(params.page, 1)
  const pageSize = normalizePositiveInteger(params.pageSize, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE)

  const payload = await getPayloadClient()
  const response = (await payload.find({
    collection: 'weekly',
    limit: pageSize,
    page,
    where: {
      status: {
        equals: 'published',
      },
    },
    sort: '-publishDate',
  })) as PaginatedDocs<Weekly>

  return {
    items: response.docs.map(doc => ({
      id: doc.id,
      slug: doc.issueNumber,
      title: doc.title,
      summary: doc.summary,
      content: doc.content,
      publishDate: doc.publishDate,
      tags: doc.tags?.map(t => t.value) ?? [],
    })),
    pagination: {
      page: response.page,
      pageSize: response.limit,
      totalDocs: response.totalDocs,
      totalPages: response.totalPages,
      hasPrevPage: response.hasPrevPage,
      hasNextPage: response.hasNextPage,
    },
  }
}

export async function getWeeklyBySlug(slug: string) {
  if (!slug) {
    return null
  }

  const payload = await getPayloadClient()
  const response = (await payload.find({
    collection: 'weekly',
    limit: 1,
    where: {
      issueNumber: {
        equals: slug.toUpperCase(),
      },
      status: {
        equals: 'published',
      },
    },
  })) as PaginatedDocs<Weekly>

  const currentDoc = response.docs[0]
  if (!currentDoc)
    return null

  // Fetch adjacent posts
  const [prevDoc, nextDoc] = await Promise.all([
    payload.find({
      collection: 'weekly',
      limit: 1,
      where: {
        publishDate: {
          less_than: currentDoc.publishDate,
        },
        status: {
          equals: 'published',
        },
      },
      sort: '-publishDate',
    }),
    payload.find({
      collection: 'weekly',
      limit: 1,
      where: {
        publishDate: {
          greater_than: currentDoc.publishDate,
        },
        status: {
          equals: 'published',
        },
      },
      sort: 'publishDate',
    }),
  ])

  return {
    ...currentDoc,
    prev: prevDoc.docs[0] ? { title: prevDoc.docs[0].title, slug: prevDoc.docs[0].issueNumber } : null,
    next: nextDoc.docs[0] ? { title: nextDoc.docs[0].title, slug: nextDoc.docs[0].issueNumber } : null,
  }
}

function normalizePositiveInteger(value: number | undefined, fallback: number, max = Number.POSITIVE_INFINITY) {
  if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
    return fallback
  }

  const normalized = Math.floor(value)
  return Math.min(normalized, max)
}
