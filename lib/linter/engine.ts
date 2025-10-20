import type { LintIssue, LinterConfig, LintSeverity, LinterResponse } from './types';
import { loadLinterConfig } from './config';

type EvaluateOptions = {
  locale?: string;
};

type RuleCheck = {
  type: string;
  [key: string]: unknown;
};

const RANGE_NULL = undefined;

function pickLocaleCopy(record: Record<string, string> | undefined, locale: string, fallback: string) {
  if (!record) return '';
  if (record[locale]) return record[locale];
  if (record[fallback]) return record[fallback];
  const [, value] = Object.entries(record)[0] ?? [];
  return value ?? '';
}

function toRegExp(pattern: string): RegExp {
  let flags = 'g';
  let source = pattern;
  const inlineCaseInsensitive = pattern.startsWith('(?i)');
  if (inlineCaseInsensitive) {
    source = pattern.slice(4);
    flags += 'i';
  }
  return new RegExp(source, flags);
}

function evaluateMustIncludeAny(check: RuleCheck, prompt: string) {
  const patterns = Array.isArray(check.patterns) ? (check.patterns as string[]) : [];
  const minMatches = typeof check.minMatches === 'number' ? check.minMatches : 1;
  const minLength = typeof check.minLength === 'number' ? check.minLength : null;

  if (minLength && prompt.trim().length < minLength) {
    return false;
  }

  let matches = 0;
  for (const pattern of patterns) {
    const regexp = toRegExp(pattern);
    if (regexp.test(prompt)) {
      matches += 1;
      if (matches >= minMatches) {
        return true;
      }
    }
  }
  return matches >= minMatches;
}

function extractPlaceholderName(raw: string) {
  if (raw.startsWith('{{') && raw.endsWith('}}')) {
    return raw.slice(2, -2).trim();
  }
  if (raw.startsWith('<<') && raw.endsWith('>>')) {
    return raw.slice(2, -2).trim();
  }
  if (raw.startsWith('[') && raw.endsWith(']')) {
    return raw.slice(1, -1).trim();
  }
  return raw.trim();
}

function normalizePlaceholderName(name: string) {
  return name.replace(/[^a-zA-Z0-9]+/g, ' ').trim().toLowerCase();
}

function evaluatePlaceholderConsistency(check: RuleCheck, prompt: string) {
  const patterns = Array.isArray(check.patterns) ? (check.patterns as string[]) : [];
  const placeholderMap = new Map<string, Set<string>>();

  for (const pattern of patterns) {
    const regexp = toRegExp(pattern);
    let match;
    while ((match = regexp.exec(prompt)) !== null) {
      const raw = match[0];
      const name = extractPlaceholderName(raw);
      if (!name) continue;
      const normalized = normalizePlaceholderName(name);
      if (!normalized) continue;
      if (!placeholderMap.has(normalized)) {
        placeholderMap.set(normalized, new Set());
      }
      placeholderMap.get(normalized)!.add(name);
    }
  }

  if (placeholderMap.size === 0) {
    return true;
  }

  for (const variantSet of placeholderMap.values()) {
    if (variantSet.size > 1) {
      return false;
    }
  }

  return true;
}

function evaluateMaxLength(check: RuleCheck, prompt: string) {
  const limit = typeof check.limit === 'number' ? check.limit : null;
  if (!limit) return true;
  return prompt.length <= limit;
}

function evaluateRule(config: LinterConfig, rule: LinterConfig['rules'][number], prompt: string) {
  for (const rawCheck of rule.checks) {
    const check = rawCheck as RuleCheck;
    switch (check.type) {
      case 'must_include_any':
        if (!evaluateMustIncludeAny(check, prompt)) {
          return false;
        }
        break;
      case 'placeholder_consistency':
        if (!evaluatePlaceholderConsistency(check, prompt)) {
          return false;
        }
        break;
      case 'max_length':
        if (!evaluateMaxLength(check, prompt)) {
          return false;
        }
        break;
      default:
        break;
    }
  }

  return true;
}

function buildIssue(
  config: LinterConfig,
  rule: LinterConfig['rules'][number],
  locale: string
): LintIssue {
  const fallbackLocale = config.metadata.localeFallback || 'zh-CN';
  const title = pickLocaleCopy(rule.title, locale, fallbackLocale);
  const description = pickLocaleCopy(rule.description, locale, fallbackLocale);
  const message = title && description ? `${title}：${description}` : title || description || rule.code;
  const fixHint = pickLocaleCopy(rule.fixHint, locale, fallbackLocale);

  return {
    code: rule.code,
    severity: rule.severity,
    message,
    range: RANGE_NULL,
    fix: fixHint ? { hint: fixHint } : null,
    tags: rule.tags,
    metadata: {
      category: rule.category,
      target: rule.target,
    },
  };
}

function summarize(issues: LintIssue[]): { totalIssues: number; errors: number; warnings: number; infos: number; successes: number } {
  return issues.reduce(
    (acc, issue) => {
      acc.totalIssues += 1;
      if (issue.severity === 'error') acc.errors += 1;
      else if (issue.severity === 'warning') acc.warnings += 1;
      else if (issue.severity === 'success') acc.successes += 1;
      else acc.infos += 1;
      return acc;
    },
    { totalIssues: 0, errors: 0, warnings: 0, infos: 0, successes: 0 }
  );
}

export async function lintPrompt(prompt: string, options: EvaluateOptions = {}): Promise<LinterResponse> {
  const config = await loadLinterConfig();
  const locale = options.locale || config.metadata.localeFallback || 'zh-CN';
  const trimmed = prompt ?? '';

  const issues: LintIssue[] = [];
  const suppressedRules = new Set<string>();

  // First pass: Check for complex guidance rules that suppress other rules
  for (const rule of config.rules) {
    if (rule.code === 'PROMPT_COMPLEX_GUIDANCE_DETECTED') {
      const passed = evaluateRule(config, rule, trimmed);
      if (passed) {
        // Complex guidance detected, suppress other rules
        if (rule.suppressOtherRules && Array.isArray(rule.suppressOtherRules)) {
          for (const suppressedRule of rule.suppressOtherRules) {
            suppressedRules.add(suppressedRule);
          }
        }
        issues.push(buildIssue(config, rule, locale));
      }
    }
  }

  // Second pass: Apply all other rules
  for (const rule of config.rules) {
    if (rule.code === 'PROMPT_COMPLEX_GUIDANCE_DETECTED') {
      continue; // Already processed
    }
    
    if (suppressedRules.has(rule.code)) {
      continue; // Skip suppressed rules
    }

    const passed = evaluateRule(config, rule, trimmed);
    if (!passed) {
      issues.push(buildIssue(config, rule, locale));
    }
  }

  const summary = summarize(issues);

  return {
    issues,
    summary,
    generatedAt: new Date().toISOString(),
    configVersion: config.version,
  };
}
