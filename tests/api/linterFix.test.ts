import { describe, expect, it } from 'vitest';

import { buildUsageInsert } from '../../lib/openai';

describe('linter fix integrations', () => {
  it('buildUsageInsert maps usage data', () => {
    const mockUsage = {
      inputTokens: 100,
      outputTokens: 50,
      totalTokens: 150,
      latencyMs: 1200,
      costUsd: 0.02,
      model: 'gpt-4o-mini',
    };
    const context = { userId: 'user-1', taskId: 'task', runId: 'run', meta: { foo: 'bar' } };
    const payload = buildUsageInsert(mockUsage, context);
    expect(payload.user_id).toBe('user-1');
    expect(payload.model).toBe('gpt-4o-mini');
  });
});
