import { describe, expect, it } from 'vitest';

import { estimateCostUsd, resolveModel } from '../../lib/openai';

describe('evaluation helpers', () => {
  it('resolveModel falls back to default', () => {
    expect(resolveModel(undefined)).toBe('gpt-5');
  });

  it('estimateCostUsd calculates known pricing', () => {
    const cost = estimateCostUsd('gpt-4o-mini', 1000, 500);
    expect(cost).toBeGreaterThan(0);
  });
});
