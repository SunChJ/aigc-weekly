import type { Payload } from './container.js'
import process from 'node:process'
import { chatWithContainerAgent, forwardRequestToContainer } from './container.js'

export { AgentContainer } from './container.js'
export { ChatWorkflow } from './workflow.js'

const isProd = process.env.NODE_ENV === 'production'

export default {
  async fetch(request) {
    if (isProd) {
      return Response.redirect('https://aigc-weekly.agi.li', 302)
    }
    const { pathname } = new URL(request.url)
    if (pathname === '/chat' && request.method === 'POST') {
      const payload = await request.json() as Payload
      return chatWithContainerAgent(payload)
    }
    return forwardRequestToContainer(request)
  },
  async scheduled() {
    await chatWithContainerAgent()
  },
} satisfies ExportedHandler<Cloudflare.Env>
