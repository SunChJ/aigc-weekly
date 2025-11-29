import { siteConfig } from '@/lib/config'
import { formatDate } from '@/lib/weekly/utils'

interface PostMetaProps {
  date: string
  issueNumber?: string
}

export function PostMeta({ date, issueNumber }: PostMetaProps) {
  return (
    <div className="post-meta">
      <time className="post-date" dateTime={date}>
        {formatDate(date)}
      </time>
      <span className="post-author">{siteConfig.title}</span>
      {issueNumber && <span className="post-author">{issueNumber}</span>}
    </div>
  )
}
