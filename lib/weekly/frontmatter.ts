export function parseFrontmatter(raw: string): { fm: Record<string, any>, body: string } {
  if (!raw.startsWith('---'))
    return { fm: {}, body: raw }

  const end = raw.indexOf('\n---', 3)
  if (end === -1)
    return { fm: {}, body: raw }

  const fmRaw = raw.slice(3, end).trim()
  const body = raw.slice(end + 4).replace(/^\n/, '')
  const fm: Record<string, any> = {}

  // Minimal YAML subset: key: value, arrays like [a, b]
  for (const line of fmRaw.split(/\r?\n/)) {
    const idx = line.indexOf(':')
    if (idx <= 0)
      continue

    const key = line.slice(0, idx).trim()
    let val: any = line.slice(idx + 1).trim()

    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith('\'') && val.endsWith('\''))) {
      val = val.slice(1, -1)
    }
    else if (val.startsWith('[') && val.endsWith(']')) {
      const inner = val.slice(1, -1).trim()
      val = inner
        ? inner.split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''))
        : []
    }

    fm[key] = val
  }

  return { fm, body }
}
