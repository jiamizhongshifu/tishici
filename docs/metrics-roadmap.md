# 观测与指标埋点计划（阶段 5）

## 目标
- 为阶段 5“细化观测”提前规划采集口径，减少二次返工。
- 覆盖 prompt 运行、自举、跨模型三大路径的核心指标。

## 指标清单
| 模块 | 指标 | 采集位置 | 说明 |
| --- | --- | --- | --- |
| Prompt Runs | inputTokens / outputTokens / latencyMs / model | 现有 prompt_runs.stats | 保持现有 schema；新增字段 errorCode 用于失败归因。 |
| Prompt Runs | successRate (P7d/P30d) | 报表层计算 | 通过 esult.passed 聚合。 |
| Bootstrap | dopted / eadabilityDelta / linterScoreBefore/After | 已在 prompt_bootstrap_runs.stats | Dashboard 已消费，后续可同步到报表。 |
| Bootstrap | kind+model+costUsd | prompt_bootstrap_runs | 统计不同自举类型的成本权重。 |
| Multi-model | modelComparisons / estModel | 未来 prompt_multi_runs.results | 记录每次试跑的最佳模型及耗时差。 |
| 全局 | errorBuckets | API 层 | 统一捕捉网络/限流/授权失败，写入 stats.errorCode。 |

## 实施步骤
1. **Schema 扩展**
   - prompt_runs.stats 新增 errorCode（字符串）与 
otes（jsonb，补充上下文）。
   - prompt_bootstrap_runs.stats 已包含阶段 3 字段，阶段 5 仅需兼容多语言格式。 
2. **API 统一封装**
   - 在 lib/openai.ts 增加 withUsageTracking(model, payload, runner) helper，集中统计 tokens/latency。
   - 所有调用（评测、自举、多模型）复用该 helper，保证采集一致。
3. **存储与报表**
   - 新建 scripts/exportMetrics.mjs：支持导出 CSV/JSON（7/30 天窗口）。
   - 与 
pm run usage:collect 协同：前者偏运营导出，后者偏实时控制台。
4. **Dashboard 显示**
   - 阶段 5 计划新增：
     1. 折线图展示 7/30 天 token 趋势。
     2. 指标卡：结构化提示占比、Linter 采纳率、自举采纳率、跨模型试跑次数。

## 待确认事项
- 是否需要针对不同模型设置成本预警阈值？（建议在 .env 中配置 map）。
- Export 脚本是否需要支持分页/大批量数据（>500 条）。
- Dashboard 是否需要多语言图表标题（提前在 i18n 预留）。
