import type { Options, SDKUserMessage } from '@anthropic-ai/claude-agent-sdk'
import { Container, getContainer } from '@cloudflare/containers'
import { env } from 'cloudflare:workers'

const PORT = 2442

// Cloudflare env can include non-string bindings; filter to container-friendly entries
const containerEnv = Object.fromEntries(
  Object.entries(env).filter(([, value]) => typeof value === 'string'),
)

export class AgentContainer extends Container {
  sleepAfter = '10m'
  defaultPort = PORT
  envVars = {
    ...containerEnv,
    PORT: PORT.toString(),
  }

  async watchContainer() {
    try {
      const res = await this.containerFetch(new Request('http://container/ws', { headers: { Upgrade: 'websocket' } }))
      if (res.webSocket === null)
        throw new Error('websocket server is faulty')

      res.webSocket.addEventListener('message', (msg) => {
        this.renewActivityTimeout()
        console.info(msg.data)
      })
      res.webSocket.accept()
    }
    catch (error) {
      console.error('Failed to connect to container WebSocket:', error)
    }
  }

  override async onStart(): Promise<void> {
    await this.watchContainer()
  }
}

export interface Payload {
  prompt?: string | AsyncIterable<SDKUserMessage>
  options?: Options
}

export async function chatWithContainerAgent(payload?: Payload) {
  const container = getContainer(env.AGENT_CONTAINER)
  return container.fetch('http://container/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload ?? {}),
  })
}

export async function forwardRequestToContainer(request: Request) {
  const container = getContainer(env.AGENT_CONTAINER)
  return container.fetch(request)
}
