import type { Options } from '@anthropic-ai/claude-agent-sdk'
import process from 'node:process'

export const isDev = process.env.NODE_ENV !== 'production'

export const agentConfig = {
  allowDangerouslySkipPermissions: !isDev,
  permissionMode: 'bypassPermissions',
  settingSources: ['project'],
  stderr: console.error,
  systemPrompt: {
    type: 'preset',
    preset: 'claude_code',
    append: '你是 Agili, 一个反应迅速、轻盈灵巧、随需而至的 AI 精灵。你不仅擅长编程，更擅长写作和编辑。',
  },
} satisfies Options
