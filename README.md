# Prompt Builder

基于 Next.js + Supabase 的轻量提示词收藏与生成工具。专注两个核心场景：

1. **快速收藏**：从外部平台复制优秀提示词，粘贴后立即保存，方便随时调用。
2. **辅助创作**：在工具内描述需求，由 OpenAI 帮忙生成草稿，再微调保存。

## 技术栈

- 前端：Next.js 14（App Router、Server Actions）
- 后端：Supabase（Postgres + RLS + Auth）
- AI：OpenAI API（默认 `gpt-4o-mini`）
- 部署：Vercel

## 快速开始

1. 安装依赖
   ```bash
   npm install
   ```
2. 创建 Supabase 项目并执行 `supabase/migrations/0001_init.sql`
3. 在 Supabase Auth 设置中将 `Site URL` 指向本地或线上地址（例如 `http://localhost:3000`），并允许重定向到 `/auth/callback`
4. 配置环境变量（参考 `.env.example`）
5. 本地启动
   ```bash
   npm run dev
   ```
   打开 `http://localhost:3000`

## 主要功能

- 邮箱魔法链接登录
- 快速粘贴保存提示词，支持分类
- 进入完整表单，使用 OpenAI 生成提示草稿后再编辑保存
- 浏览并导入预设 Prompt Pack（来自公开资料）
- 一键复制或删除自己的提示词

## 自定义与扩展

- 可在 `supabase/migrations/0001_init.sql` 中添加更多分类或扩充字段
- 在 `app/api/generate/route.ts` 调整生成模型、温度与返回格式
- 接入第三方 OpenAI 兼容服务时，设置 `.env.local` 中的 `OPENAI_BASE_URL` 与 `OPENAI_DEFAULT_MODEL`
- 更新 Prompt Pack 数据：`npm run sync:prompt-packs`

## 部署到 Vercel

1. 导入仓库到 Vercel
2. 在 Vercel 项目环境变量中配置：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_SITE_URL`（可选，通常 Vercel 会自动提供）
3. 在 Supabase Auth 设置中，将 `Site URL` 指向 Vercel 域名，并允许重定向到 `/auth/callback`
