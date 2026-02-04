import Link from 'next/link'

import { Pagination } from '@/components/theme/Pagination'
import { PostMeta } from '@/components/theme/PostMeta'
import { TagList } from '@/components/theme/TagList'
import { TerminalLayout } from '@/components/theme/TerminalLayout'
import { getWeeklyList } from '@/lib/weekly/data'

interface WeeklyIndexPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function WeeklyIndexPage({ searchParams }: WeeklyIndexPageProps) {
  const params = await searchParams
  const page = parsePage(params?.page)
  const weeklyList = await getWeeklyList({ page })

  const { hasNextPage, hasPrevPage } = weeklyList.pagination
  const prevLink = hasPrevPage
    ? { href: `/weekly?page=${weeklyList.pagination.page - 1}`, text: '上一页' }
    : undefined
  const nextLink = hasNextPage
    ? { href: `/weekly?page=${weeklyList.pagination.page + 1}`, text: '下一页' }
    : undefined

  return (
    <TerminalLayout>
      <div className="posts">
        {weeklyList.items.map(item => (
          <article className="post on-list" key={item.slug}>
            <h2 className="post-title">
              <Link href={`/weekly/${item.slug}`}>{item.title}</Link>
            </h2>

            <PostMeta date={item.publishDate} />

            <TagList tags={item.tags} />

            <div className="post-content">
              {item.summary ? <p>{item.summary}</p> : <p />}
            </div>

            <div>
              <Link className="read-more button inline" href={`/weekly/${item.slug}`}>
                阅读更多
              </Link>
            </div>
          </article>
        ))}

        <Pagination prev={prevLink} next={nextLink} />
      </div>
    </TerminalLayout>
  )
}

function parsePage(page: string | string[] | undefined) {
  const value = Array.isArray(page) ? page[0] : page
  if (!value)
    return 1

  const parsed = Number(value)
  if (Number.isNaN(parsed) || parsed <= 0)
    return 1

  return Math.floor(parsed)
}
