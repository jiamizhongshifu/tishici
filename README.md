# Prompt Builder MVP

一个简单的基于 Next.js + Supabase 的提示词生成与管理工具（MVP）。支持邮箱魔法链接登录、提示词分类、创建/编辑/删除，以及调用 OpenAI 接口生成提示草稿。适合部署到 Vercel。

## 技术栈

- 前端：Next.js 14（App Router, Server Actions）
- 后端：Supabase（Postgres + RLS + Auth）
- AI：OpenAI API（默认 `gpt-4o-mini`）
- 部署：Vercel

## 快速开始

1) 克隆并安装依赖

```
npm install
```

2) 创建 Supabase 项目

- 新建项目，拿到 `Project URL` 与 `anon key`
- 在 SQL Editor 中运行 `supabase/migrations/0001_init.sql`
- 在 Authentication 设置中将 `Site URL` 配置为你的本地或线上地址（本地可设为 `http://localhost:3000`；线上为你的 Vercel 域名），并确保有重定向到 `/auth/callback`。

3) 配置环境变量（本地 `.env.local`）

参考 `.env.example`：

```
NEXT_PUBLIC_SUPABASE_URL=...        # Supabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=...   # Supabase anon key
OPENAI_API_KEY=...                  # OpenAI API key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4) 本地启动

```
npm run dev
```

打开 `http://localhost:3000`

## 部署到 Vercel

1) 导入本仓库到 Vercel
2) 在 Vercel 项目设置中增加环境变量：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_SITE_URL`（可选，通常 Vercel 会自动提供）

3) 在 Supabase Authentication 设置中：

- 将 `Site URL` 设置为你的 Vercel 域名（例如 `https://your-app.vercel.app`）
- 确保 OAuth/魔法链接重定向包含 `https://your-app.vercel.app/auth/callback`

## 数据模型

- `categories`：提示词分类，包含 `id, name, slug`
- `prompts`：用户的提示词，包含 `id, user_id, title, content, category_id, created_at`

启用了 RLS，用户仅能访问自己的 `prompts` 数据；`categories` 对所有人可读。

## 功能点

- 邮箱魔法链接登录（Supabase Auth）
- 列表查看/筛选自己的提示词
- 新建提示词（可通过 OpenAI 生成草稿，再编辑保存）
- 删除提示词

## 自定义和扩展

- 可在 `supabase/migrations/0001_init.sql` 中扩充分类或增加多对多标签表
- 在 `app/api/generate/route.ts` 中调整生成提示的模型/温度与输出结构
- 在 `app/actions.ts` 中扩展 CRUD 或共享（public）功能

