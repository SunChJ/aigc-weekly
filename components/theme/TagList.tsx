interface Tag {
  value: string
}

interface TagListProps {
  tags: string[] | Tag[]
}

export function TagList({ tags }: TagListProps) {
  if (!tags || tags.length === 0)
    return null

  // Normalize tags to string array
  const tagStrings = tags.map(tag => (typeof tag === 'string' ? tag : tag.value))

  return (
    <span className="post-tags">
      {tagStrings.map(tag => (
        <span key={tag} className="post-tag">
          #
          {tag}
        </span>
      ))}
    </span>
  )
}
