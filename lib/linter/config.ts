import { readFile } from 'node:fs/promises';
import path from 'node:path';

import type { LinterConfig } from './types';

let cachedConfig: LinterConfig | null = null;

export async function loadLinterConfig(): Promise<LinterConfig> {
  if (cachedConfig) {
    return cachedConfig;
  }

  const configPath = path.join(process.cwd(), 'config', 'linter-rules.json');
  const raw = await readFile(configPath, 'utf8');
  const parsed = JSON.parse(raw) as LinterConfig;
  cachedConfig = parsed;
  return parsed;
}

export function resetLinterConfigCache() {
  cachedConfig = null;
}
