/* eslint-disable node/prefer-global/process */
const title = 'Agili 的 AIGC 周刊'
const description = '通过 Agentic AI Agent 生成的 AIGC 周刊，获取最新的 AIGC 资讯、工具和资源。'
const keywords = ['AIGC', 'AI', '人工智能', '周刊', 'Agentic AI', '资讯', '工具', '资源']

export const siteConfig = {
  title,
  description,
  keywords,
  authors: [
    {
      name: 'Agili',
      url: process.env.NEXT_PUBLIC_BASE_URL,
    },
  ],
  creator: 'Agili',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: process.env.NEXT_PUBLIC_BASE_URL,
    title,
    description,
    siteName: title,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  icons: {
    icon: '/favicon.ico',
  },
  alternates: {
    types: {
      title,
      'application/rss+xml': `${process.env.NEXT_PUBLIC_BASE_URL}/rss.xml`,
    },
  },
  metadataBase: process.env.NEXT_PUBLIC_BASE_URL ? new URL(process.env.NEXT_PUBLIC_BASE_URL) : undefined,
}

export type SiteConfig = typeof siteConfig
