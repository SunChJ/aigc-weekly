import type { WorkflowEvent, WorkflowStep } from 'cloudflare:workers'
import type { Payload } from './container'
import { WorkflowEntrypoint } from 'cloudflare:workers'
import { chatWithContainerAgent } from './container'

export class ChatWorkflow extends WorkflowEntrypoint<Cloudflare.Env, Payload> {
  async run(event: WorkflowEvent<Payload>, step: WorkflowStep) {
    const result = await step.do('chat', async () => {
      const response = await chatWithContainerAgent(event.payload)
      return response.json()
    })
    return result
  }
}
