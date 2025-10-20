# Prompt Management Tool — Stage 1–2 Roadmap

## 项目概览
- **项目名称：** Prompt Management Tool — Stage 1–2
- **目标：** 从“提示收藏”升级为“提示优化与知识资产化工作台”，涵盖反馈闭环（Linter/Eval）与资产化闭环（Pack/Template）。
- **启动日期：** 2025-10-20
- **时区：** Asia/Tokyo
- **代码仓库：** `nextjs-supabase-prompts`

## 里程碑
| 里程碑 | 截止日期 | 范围 | 描述 |
| --- | --- | --- | --- |
| Stage 1 — 反馈闭环（Linter + Eval） | 2025-11-02 | ms-stage1 | 在保存/查看提示时获得结构分析、改进建议与评分反馈。 |
| Stage 2 — 资产化闭环（Pack + Template） | 2025-11-16 | ms-stage2 | Prompt Pack 2.0：版本 Diff、导入导出、模板库、Bootstrap 生成器。 |

## 冲刺计划
| 冲刺 | 时间范围 | 目标 |
| --- | --- | --- |
| Week 1 | 2025-10-20 – 2025-10-26 | Linter 规则与 API 完成；前端集成基础校验；DB 字段扩展。 |
| Week 2 | 2025-10-27 – 2025-11-02 | Eval Runner API/组件与评分 UI；修正建议一键替换；Stage 1 验收。 |
| Week 3 | 2025-11-03 – 2025-11-09 | Pack Diff 与 Import/Export 基础能力。 |
| Week 4 | 2025-11-10 – 2025-11-16 | Bootstrap API/表单集成；Template Library；Stage 2 验收。 |
| Week 5 | 2025-11-17 – 2025-11-23 | 预研：使用统计与 Pack 分享机制 POC。 |

## 任务清单
| ID | 标题 | 负责人 | 状态 | 冲刺 | 相关里程碑 | 预估（天） | 主要标签 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-001 | 定义 Prompt Linter 规则集（JSON） | Dev A | TODO | Week 1 | ms-stage1 | 1 | stage:1-feedback-loop, documentation, frontend, backend |
| T-002 | 实现 /api/linter 路由 | Dev A | TODO | Week 1 | ms-stage1 | 2 | stage:1-feedback-loop, api, backend |
| T-003 | PromptForm 集成 Linter 高亮 | Dev B | TODO | Week 1 | ms-stage1 | 1 | stage:1-feedback-loop, frontend, ui |
| T-004 | 修正建议 API /api/linter/fix | Dev B | TODO | Week 2 | ms-stage1 | 1 | stage:1-feedback-loop, api, backend |
| T-005 | 一键替换 UI 与回退 | Dev B | TODO | Week 2 | ms-stage1 | 1 | stage:1-feedback-loop, frontend, ui |
| T-006 | Eval Runner API /api/eval/run | Dev C | TODO | Week 2 | ms-stage1 | 2 | stage:1-feedback-loop, api, backend |
| T-007 | EvalRunner 组件与任务面板 | Dev C | TODO | Week 2 | ms-stage1 | 1 | stage:1-feedback-loop, frontend, ui |
| T-008 | 评分展示卡片与重新评测 | Dev C | TODO | Week 2 | ms-stage1 | 0.5 | stage:1-feedback-loop, frontend, ui |
| T-009 | DB 迁移：prompts 增加 eval_score/lint_issues | Dev A | TODO | Week 1 | ms-stage1 | 0.5 | stage:1-feedback-loop, db, backend |
| T-010 | Stage 1 QA：E2E 测试与验收 | QA | TODO | Week 2 | ms-stage1 | 1 | stage:1-feedback-loop, quality |
| T-011 | Pack 版本 Diff 后端与路由 | Dev D | TODO | Week 3 | ms-stage2 | 1.5 | stage:2-assetization, api, backend |
| T-012 | Diff 可视化 UI | Dev D | TODO | Week 3 | ms-stage2 | 1.5 | stage:2-assetization, frontend, ui |
| T-013 | Pack 导入/导出（JSON） | Dev B | TODO | Week 3 | ms-stage2 | 2 | stage:2-assetization, backend, frontend |
| T-014 | DB 迁移：Pack 元数据（tags/use_case/model_compat/lang） | Dev A | TODO | Week 3 | ms-stage2 | 0.5 | stage:2-assetization, db |
| T-015 | Bootstrap API /api/bootstrap | Dev C | TODO | Week 4 | ms-stage2 | 2 | stage:2-assetization, api, backend |
| T-016 | Bootstrap 表单集成 | Dev C | TODO | Week 4 | ms-stage2 | 1 | stage:2-assetization, frontend, ui |
| T-017 | Template Library（预置 5 类） | Dev D | TODO | Week 4 | ms-stage2 | 2 | stage:2-assetization, frontend, documentation |
| T-018 | Stage 2 QA：E2E 测试与验收 | QA | TODO | Week 4 | ms-stage2 | 1 | stage:2-assetization, quality |
| T-019 | 预研：使用统计与推荐（Supabase Functions） | Dev A | TODO | Week 5 | — | 1.5 | infra, quality |
| T-020 | 预研：Pack 分享与权限模型 | Dev D | TODO | Week 5 | — | 1.5 | infra, backend, db |

## 依赖关系
- T-002 依赖 T-001。
- T-003 依赖 T-002。
- T-004 依赖 T-002。
- T-005 依赖 T-004。
- T-007 依赖 T-006。
- T-008 依赖 T-006。
- T-010 依赖 T-003、T-005、T-007、T-008。
- T-012 依赖 T-011。
- T-013 无显式依赖。
- T-016 依赖 T-015。
- T-018 依赖 T-012、T-013、T-016、T-017。

## 其他备注
- 所有 API 路由需校验 Supabase 会话并记录用量（`lib/openai.ts` 统一封装）。
- 前端表单错误需使用 Toast 与内联提示并存，确保无障碍性。
- DB 迁移每周统一上线并包含回滚脚本。
- Playwright 覆盖核心路径：创建 → Lint → Fix → Eval → 保存 → 导出/导入 → Diff → Bootstrap。
