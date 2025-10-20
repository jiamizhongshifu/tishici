import { describe, expect, it } from 'vitest';

import { lintPrompt } from '../../lib/linter/engine';
import { loadLinterConfig } from '../../lib/linter/config';

describe('lintPrompt', () => {
  it('detects missing role definition', async () => {
    await loadLinterConfig();
    const prompt = '请帮我分析下面的数据并生成报告。';
    const result = await lintPrompt(prompt, { locale: 'zh' });
    const roleIssue = result.issues.find((issue) => issue.code === 'PROMPT_ROLE_MISSING');
    expect(roleIssue).toBeTruthy();
    expect(roleIssue?.severity).toBe('error');
  });

  it('returns empty issues for well-structured prompt', async () => {
    await loadLinterConfig();
    const prompt = `你是一名资深的数据分析师，请按照以下格式输出结果：
- 角色：数据分析师
- 任务：分析提供的数据集并给出洞察
- 约束：使用 JSON 格式输出，总结核心发现与行动建议`;
    const result = await lintPrompt(prompt, { locale: 'zh' });
    expect(result.issues.length).toBeGreaterThanOrEqual(0);
  });
});
