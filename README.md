# Prompt Builder

基于 Next.js + Supabase 的专业提示词管理工具，提供完整的提示词生命周期管理、质量检查和资源化能力。

## 核心功能

### Stage 1：反馈循环 - 提示词质量管理

**Prompt Linting（提示词检查）**
- 8 条专业规则覆盖结构、上下文、约束、格式和一致性
- 实时自动检查，支持 error/warning/info 三级严重程度
- 内联高亮显示问题位置，提供详细的修复建议
- 规则配置文件：`config/linter-rules.json`

**Auto-Fix（自动修复）**
- AI 驱动的智能修复建议生成
- 可视化 diff 预览修改内容
- 一键应用修复，支持 undo 撤销
- 保留原始意图，确保变量占位符完整性

**Prompt Evaluation（提示词评估）**
- 多维度评分：清晰度、约束性、可复现性
- 0-100 分制评分系统
- 识别优势和改进点
- Token 使用统计和成本追踪

### Stage 2：资源化 - 提示词生态系统

**Pack Import/Export（包导入导出）**
- 批量导入提示词包（JSON 格式）
- 导出个人提示词集合
- 版本管理和 Diff 可视化
- 支持标准和自定义格式

**Bootstrap（快速启动）**
- 基于目标自动生成最佳实践模板
- 符合 prompt engineering 规范
- 自动包含角色定义、任务描述、约束条件等
- 支持领域、受众、约束条件定制

**Template Library（模板库）**
- 17+ 精选专业模板，涵盖 5 大类别
- 可变量化模板，支持自定义填充
- 分类浏览和全文搜索
- 模板类别：
  - **Writing**（文案创作）：博客文章、营销邮件、产品描述、社交媒体
  - **Coding**（编程开发）：代码审查、API文档、Bug调试、单元测试
  - **Research**（研究分析）：数据分析、文献综述、市场研究
  - **Image Generation**（图像生成）：AI图像提示词、UI设计、角色设计
  - **Conversational AI**（对话AI）：客服机器人、面试教练、语言导师、头脑风暴

## 技术栈

- **前端**：Next.js 14（App Router、Server Actions）
- **后端**：Supabase（Postgres + RLS + Auth）
- **AI**：OpenAI API（默认 `gpt-5`）
- **测试**：Vitest（单元测试）、Playwright（E2E测试）
- **部署**：Vercel

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 数据库设置
创建 Supabase 项目并执行迁移：
```bash
# 初始化数据库
npx supabase migration up --file supabase/migrations/0001_init.sql

# 添加 lint 和 eval 支持
npx supabase migration up --file supabase/migrations/20251020_eval_lint.sql
```

### 3. 环境变量配置
创建 `.env.local` 文件：
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 可选：使用兼容的 OpenAI 服务
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_DEFAULT_MODEL=gpt-4o
```

### 4. Supabase Auth 配置
在 Supabase Dashboard > Authentication > URL Configuration：
- **Site URL**: `http://localhost:3000`（或你的生产域名）
- **Redirect URLs**: 添加 `http://localhost:3000/auth/callback`

### 5. 本地启动
```bash
npm run dev
```
打开 `http://localhost:3000`

## 主要功能说明

### 创建和编辑提示词
- **Manual Mode**（手动模式）：直接编写提示词
- **Generator Mode**（生成模式）：AI 辅助生成草稿
- **Bootstrap Mode**（快速启动）：基于目标生成专业模板
- **Template Mode**（模板模式）：从 17+ 模板中选择

### Lint 检查和修复
1. 输入提示词后自动运行 lint 检查（400ms 防抖）
2. 查看检查结果和问题统计
3. 点击"生成修复建议"获取 AI 驱动的改进方案
4. 预览 diff，一键应用或撤销

### 评估提示词质量
1. 保存提示词后点击"Run Evaluation"
2. 查看多维度评分和详细反馈
3. 评分结果自动保存到数据库

### 导入导出 Pack
访问 `/packs/io`：
- **导入**：上传 JSON 文件批量导入提示词
- **导出**：选择提示词并导出为 JSON 包

## API 文档

### Linter API

**POST `/api/linter`**
- 检查提示词质量
- Request: `{ prompt: string, locale?: string }`
- Response: `{ lint_issues: Array, summary: Object, generated_at: string }`

**POST `/api/linter/fix`**
- 生成修复建议
- Request: `{ prompt: string, issues: Array, locale?: string }`
- Response: `{ summary: string, suggestions: Array, revised_prompt: string, diff: string }`

### Evaluation API

**POST `/api/eval/run`**
- 评估提示词质量
- Request: `{ prompts: Array<{id, title, content}>, locale?: string }`
- Response: `{ results: Array<{prompt_id, score, usage}> }`

### Bootstrap API

**POST `/api/bootstrap`**
- 生成最佳实践模板
- Request: `{ goal: string, domain?: string, audience?: string, constraints?: string, locale?: string }`
- Response: `{ title: string, content: string, suggestedCategory: string }`

### Generate API

**POST `/api/generate`**
- AI 辅助生成提示词
- Request: `{ goal: string, audience?: string, tone?: string, language?: string, style?: string }`
- Response: `{ title: string, content: string }`

## 开发指南

### 运行测试

```bash
# 运行所有单元测试
npm run test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 运行 E2E 测试（需要先安装 Playwright）
npx playwright install
npm run test:e2e
```

### 添加 Lint 规则

1. 编辑 `config/linter-rules.json`
2. 添加新规则：
```json
{
  "code": "YOUR_RULE_CODE",
  "category": "structure|context|constraints|format|consistency",
  "severity": "error|warning|info",
  "title": { "zh-CN": "标题", "en-US": "Title" },
  "description": { "zh-CN": "描述", "en-US": "Description" },
  "checks": [
    {
      "type": "must_include_any",
      "patterns": ["pattern1", "pattern2"]
    }
  ],
  "fixHint": { "zh-CN": "修复提示", "en-US": "Fix hint" }
}
```

### 添加模板

1. 在 `data/templates/` 目录下编辑相应类别的 JSON 文件
2. 添加新模板：
```json
{
  "id": "unique-template-id",
  "title": { "en": "Template Name", "zh": "模板名称" },
  "description": { "en": "Description", "zh": "描述" },
  "content": { "en": "Template content with {{variables}}", "zh": "带 {{变量}} 的模板内容" },
  "variables": [
    {
      "key": "variable_name",
      "label": { "en": "Variable Label", "zh": "变量标签" },
      "placeholder": { "en": "Placeholder", "zh": "占位符" },
      "required": true
    }
  ],
  "tags": ["tag1", "tag2"]
}
```

### 目录结构

```
.
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── linter/        # Lint 检查
│   │   ├── eval/          # 评估
│   │   ├── bootstrap/     # Bootstrap 生成
│   │   └── generate/      # AI 生成
│   ├── dashboard/         # 用户面板
│   ├── packs/            # Pack 管理
│   └── prompts/          # 提示词详情
├── components/            # React 组件
│   ├── PromptForm.tsx    # 提示词表单
│   ├── PackIO.tsx        # 导入导出
│   └── TemplatePicker.tsx # 模板选择器
├── lib/                   # 工具库
│   ├── linter/           # Lint 引擎
│   ├── templates.ts      # 模板加载
│   └── openai.ts         # OpenAI 集成
├── data/                  # 数据文件
│   ├── templates/        # 模板库
│   └── promptPacks.json  # 预设 Pack
├── config/                # 配置文件
│   └── linter-rules.json # Lint 规则
├── tests/                 # 测试文件
│   ├── api/              # API 测试
│   ├── components/       # 组件测试
│   └── e2e/              # E2E 测试
└── supabase/             # Supabase 配置
    └── migrations/       # 数据库迁移
```

### 数据库 Schema

**prompts 表**
- `id`: UUID
- `user_id`: UUID (外键)
- `title`: TEXT
- `content`: TEXT
- `category_id`: UUID (外键)
- `lint_issues`: JSONB (lint 结果)
- `eval_score`: JSONB (评估分数)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

**categories 表**
- `id`: UUID
- `user_id`: UUID
- `name`: TEXT
- `created_at`: TIMESTAMP

**openai_usage 表**（可选，用于追踪 API 使用）
- `id`: UUID
- `user_id`: UUID
- `task_id`: TEXT
- `model`: TEXT
- `input_tokens`: INTEGER
- `output_tokens`: INTEGER
- `total_tokens`: INTEGER
- `cost_usd`: NUMERIC
- `created_at`: TIMESTAMP

## 自定义与扩展

### 调整 AI 模型
在 `lib/openai.ts` 中修改默认模型：
```typescript
const DEFAULT_MODEL = process.env.OPENAI_DEFAULT_MODEL || 'gpt-4o';
```

### 使用兼容的 OpenAI 服务
设置环境变量：
```env
OPENAI_BASE_URL=https://your-openai-compatible-service.com/v1
OPENAI_DEFAULT_MODEL=your-model-name
```

### 添加更多分类
在数据库中插入新分类：
```sql
INSERT INTO categories (user_id, name) VALUES ('user-uuid', 'New Category');
```

### 更新 Prompt Pack 数据
```bash
npm run sync:prompt-packs
```

## 部署到 Vercel

### 1. 导入仓库
在 Vercel 导入你的 Git 仓库

### 2. 配置环境变量
在 Vercel 项目设置中添加：
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

可选配置：
```
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_DEFAULT_MODEL=gpt-4o
```

### 3. 更新 Supabase Auth 设置
在 Supabase Dashboard > Authentication > URL Configuration：
- **Site URL**: `https://your-domain.vercel.app`
- **Redirect URLs**: 添加 `https://your-domain.vercel.app/auth/callback`

### 4. 部署
Vercel 会自动构建和部署。每次推送到主分支都会触发重新部署。

## 常见问题

### 1. OpenAI API 调用失败
- 检查 `OPENAI_API_KEY` 是否正确配置
- 确认 API 密钥有足够的额度
- 查看 OpenAI API 状态页面

### 2. Supabase 认证问题
- 确认 `Site URL` 和 `Redirect URLs` 配置正确
- 检查 RLS (Row Level Security) 策略是否正确
- 确认用户邮箱已验证（如果启用了邮箱验证）

### 3. Lint 规则不生效
- 检查 `config/linter-rules.json` 格式是否正确
- 确认规则的 `checks` 字段配置正确
- 查看浏览器控制台是否有错误信息

### 4. 模板无法加载
- 确认 `data/templates/` 目录下的 JSON 文件格式正确
- 检查模板的 `variables` 是否与 `content` 中的占位符匹配
- 确认 `lib/templates.ts` 中正确导入了所有模板文件

## 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

### 代码规范
- 使用 TypeScript
- 遵循 ESLint 配置
- 编写测试覆盖新功能
- 更新相关文档

## 许可证

MIT License

## 相关资源

- [Stage 1-2 开发计划](docs/stage1-2-plan.md)
- [Linter 规则指南](docs/linter-rules-guide.md) (待创建)
- [模板格式说明](docs/template-format.md) (待创建)
- [API 参考文档](docs/api-reference.md) (待创建)
