import Link from 'next/link'

import { Pagination } from '@/components/theme/Pagination'
import { PostMeta } from '@/components/theme/PostMeta'
import { TagList } from '@/components/theme/TagList'
import { TerminalLayout } from '@/components/theme/TerminalLayout'
import { getWeeklyList } from '@/lib/weekly/data'

export const dynamic = 'force-static'

export default async function WeeklyIndexPage() {
  const weeklyList = await getWeeklyList({ page: 1 })

  const { hasNextPage, hasPrevPage } = weeklyList.pagination
  const prevLink = hasPrevPage
    ? { href: '/weekly', text: '上一页' }
    : undefined
  const nextLink = hasNextPage
    ? { href: '/weekly', text: '下一页' }
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
