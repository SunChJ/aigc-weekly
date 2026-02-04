export interface WeeklyListParams {
  page?: number
  pageSize?: number
}

export interface WeeklyListResult {
  items: Array<{
    id: number
    slug: string
    title: string
    summary: string
    content: string
    publishDate: string
    tags?: string[]
  }>
  pagination: {
    page: number
    pageSize: number
    totalDocs: number
    totalPages: number
    hasPrevPage: boolean
    hasNextPage: boolean
  }
}
