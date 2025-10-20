# 多模型试跑设计草案

## 背景
- 阶段 4 目标：一次触发多模型比对，帮助运营快速验证跨模型表现。
- 现状：prompt_runs 仅记录单模型评测，需扩展数据结构和 UI。

## API 设计
### POST /api/prompts/:id/try-multi
- **请求体**
  `json
  {
    "models": ["gpt-4o-mini", "gpt-4o"],
    "input": { "variables": { "topic": "..." } },
    "options": {
      "temperature": 0.4,
      "maxRetries": 2
    }
  }
  `
- **逻辑**
  1. 校验提示所有必填变量是否齐全。
  2. 并行触发 createOpenAIClient()，按模型顺序串行回退。
  3. 每个模型回写 prompt_multi_runs（待建表）并累积 tokens/cost。
  4. 汇总 diff（输出差异、耗时、token）返回给前端。
- **响应示例**
  `json
  {
    "summary": {
      "models": ["gpt-4o-mini", "gpt-4o"],
      "bestModel": "gpt-4o-mini",
      "totalCostUsd": 0.0034
    },
    "runs": [
      {
        "model": "gpt-4o-mini",
        "tokens": {"prompt": 520, "completion": 312},
        "latencyMs": 2450,
        "output": "..."
      }
    ]
  }
  `

## 数据模型
- 新表 prompt_multi_runs
  - id, owner, prompt_id, models（text[]）
  - esults jsonb：保存每个模型输出、统计
  - created_at
- 新视图 prompt_multi_stats（可选）：聚合近 7/30 天跨模型运行情况。
- 后续与 usage:collect 联动，输出跨模型次数/成本。

## UI 草图
- /prompts/:id 增加 “Multi-model” 页签。
  - 模型选择器（默认读取环境变量白名单）。
  - 运行历史列表：展示模型组合、平均 Δtokens、手动标记“最佳模型”。
  - Diff 视图：并排呈现不同模型输出，支持一键复制。
- Dashboard 指标扩展：
  - “跨模型试跑次数”
  - “最佳模型分布”

## 技术拆解
1. 迁移脚本：创建 prompt_multi_runs 表 + RLS。
2. API Route：pp/api/prompts/[id]/try-multi/route.ts。
3. 前端组件：MultiModelPanel（参考 BootstrapPanel）。
4. 指标埋点：复用现有 stats schema，新增 multiModelRuns 汇总逻辑。

## 风险与对策
- **速率限制**：增加串行 fallback 与 maxRetries 配置，必要时写入队列。
- **Token 成本**：运行前估算（以 longest prompt * 模型数），提示用户。
- **模型白名单**：读取 .env.local 中 NEXT_PUBLIC_ALLOWED_MODELS，避免随意调用昂贵模型。
