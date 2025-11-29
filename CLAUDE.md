# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 全局约定

- **语言**：所有对话、提交信息与界面交互均使用简体中文。
- **工作目录**：位于仓库根目录；临时/生成文件应写入 `data/` 或 `.next/` 等路径，避免使用外部目录。
- **环境**：Node.js 22 与 pnpm 10 是默认运行时；脚本假定 `pnpm` 在 PATH 中。
- **约束**：忽略 `agent/.claude` 目录中的文件。

## 常用命令

### 开发与构建

- **Next.js 应用**：
  - 开发：`pnpm dev`
  - 构建：`pnpm build`
  - 启动：`pnpm start`
- **Claude Agent**：
  - 本地开发：`pnpm dev:agent`
  - 调试：`pnpm debug:agent`
  - 构建：`pnpm build:agent`
- **Cloudflare Worker**：
  - 开发：`pnpm dev:worker`
  - 部署：`pnpm deploy:worker`
- **整体部署**：
  - 完整部署：`pnpm deploy`（依次执行数据库和应用部署）
  - 数据库部署：`pnpm deploy:database`
  - 应用部署：`pnpm deploy:app`

### 工具与维护

- **类型生成**：`pnpm generate:types`（生成 Cloudflare 和 Payload 类型）
- **代码检查**：`pnpm lint:fix`（优先使用），或 `pnpm lint`
- **Payload CMS**：`pnpm payload`（本地 CMS 操作/迁移）
- **清理**：`pnpm clean`（移除构建产物和临时文件）

## 架构概览

- **Next.js (`app/`)**
  - 使用 App Router 架构
  - `app/(frontend)`：面向读者的周刊页面
  - `app/(payload)`：Payload Admin 界面，复用 Next runtime

- **Payload CMS**
  - 配置入口：`payload.config.ts`
  - 数据库：Cloudflare D1
  - 媒体存储：Cloudflare R2
  - 数据模型：`collections/`
  - 迁移文件：`migrations/`
  - 插件：启用 MCP 插件允许 Agent 读写 `weekly` 集合

- **Claude Agent (`agent/`)**
  - 基于 `@anthropic-ai/claude-agent-sdk`
  - Hono WebSocket/HTTP 服务器（`agent/index.ts`）
  - 默认工作目录：`data/app`

- **Cloudflare Worker (`worker/`)**
  - 使用 Hono 适配
  - 负责 API 和边缘逻辑
  - 配置文件：`worker/wrangler.jsonc`

## 关键文件

- `next.config.mjs`：Next.js + OpenNext Cloudflare 配置
- `open-next.config.ts`：OpenNext 部署配置
- `payload.config.ts`：CMS 核心配置（集合、编辑器、绑定）
- `agent/mcp.json`：Agent 可用的 MCP 服务器列表
- `worker/wrangler.jsonc`：Worker 部署配置

## 部署说明

- 依赖 Cloudflare 环境变量（通过 Wrangler 绑定）：`D1`, `R2`, `PAYLOAD_SECRET`
- `payload.config.ts` 自动适配本地 Wrangler 或远程环境
- 部署数据库会自动运行 Payload 迁移
- OpenNext 构建会生成 `.open-next` 目录推送到 Cloudflare
