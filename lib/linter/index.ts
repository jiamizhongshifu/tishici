import rulesConfig from '../../config/linter-rules.json';
import type { LintIssue, LintRange, LintSeverity, LintStats } from '../../types/lint';

type RuleMetadata = {
  code: string;
  title: string;
  message: string;
  severity: LintSeverity;
  fix_hint?: string;
};

type RulesConfig = {
  version: string;
  rules: RuleMetadata[];
};

type SectionKey = 'role' | 'task' | 'constraints' | 'output' | 'variables' | 'guardrails';

type SectionCheck = {
  keywords?: string[];
  regex?: RegExp[];
};

const config = rulesConfig as RulesConfig;

const RULE_MAP = new Map<string, RuleMetadata>(config.rules.map((rule) => [rule.code, rule]));

const SECTION_RULE: Record<SectionKey, string> = {
  role: 'ROLE_MISSING',
  task: 'TASK_MISSING',
  constraints: 'CONSTRAINTS_MISSING',
  output: 'OUTPUT_FORMAT_MISSING',
  variables: 'VARIABLE_PLACEHOLDER_MISSING',
  guardrails: 'SAFETY_GUARDRAIL_MISSING',
};

const SECTION_CHECKS: Record<SectionKey, SectionCheck> = {
  role: {
    keywords: ['角色：', '角色:', 'role:', 'role：', '作为', '你是', 'you are', 'act as'],
    regex: [/^\s*(角色|角色设定|Role|Context)\s*[:：]/im],
  },
  task: {
    keywords: ['任务：', '任务:', '目标：', '目标:', 'task:', 'goal:', 'deliverables:', 'your task'],
    regex: [/^\s*(任务|目标|Task|Goal|Deliverables)\s*[:：]/im],
  },
  constraints: {
    keywords: ['约束', '必须', '应当', '限制', '规则', '要求', 'constraints', 'requirements', 'must', 'should not'],
    regex: [/^\s*(约束|规则|要求|Constraints|Requirements)\s*[:：]/im],
  },
  output: {
    keywords: ['输出', '格式', '返回', 'output', 'format', 'respond with', 'return'],
    regex: [/^\s*(输出|格式|Output|Format)\s*[:：]/im],
  },
  variables: {
    keywords: ['{{', '}}', '{input}', '{context}', '[input]', '[context]', '变量', 'placeholders'],
    regex: [/\{\{[^}]+\}\}/, /\[[^\]]+\]/],
  },
  guardrails: {
    keywords: ['不得', '禁止', '不要', '仅限', 'avoid', 'do not', 'never', 'guardrails', 'safety'],
    regex: [/^\s*(安全|限制|Guardrails|Safety)\s*[:：]/im],
  },
};

function toPosition(text: string, offset: number) {
  const preceding = text.slice(0, offset);
  const line = preceding.split('\n').length;
  const lastBreak = preceding.lastIndexOf('\n');
  const column = lastBreak === -1 ? offset + 1 : offset - lastBreak;
  return { line, column, offset };
}

function toRange(text: string, offset: number, length: number): LintRange {
  const start = toPosition(text, offset);
  const end = toPosition(text, Math.min(text.length, offset + Math.max(length, 1)));
  return { start, end };
}

function findSectionHit(text: string, check: SectionCheck) {
  if (check.regex) {
    for (const pattern of check.regex) {
      const regexp = new RegExp(pattern.source, pattern.flags);
      const match = regexp.exec(text);
      if (match && typeof match.index === 'number') {
        return { index: match.index, length: match[0].length };
      }
    }
  }

  if (check.keywords) {
    const lower = text.toLowerCase();
    for (const keyword of check.keywords) {
      const idx = lower.indexOf(keyword.toLowerCase());
      if (idx >= 0) {
        return { index: idx, length: keyword.length };
      }
    }
  }

  return null;
}

function createIssue(code: string, overrides: Partial<LintIssue> = {}): LintIssue {
  const meta = RULE_MAP.get(code);
  if (!meta) {
    throw new Error(`Unknown linter rule: ${code}`);
  }
  return {
    code,
    severity: meta.severity,
    message: meta.message,
    fix_hint: meta.fix_hint,
    ...overrides,
  };
}

export function lintPrompt(content: string) {
  const text = content ?? '';
  const trimmed = text.trim();
  const issues: LintIssue[] = [];
  const sections: Record<string, boolean> = {
    role: false,
    task: false,
    constraints: false,
    output: false,
    variables: false,
    guardrails: false,
  };

  const severityCount: Record<LintSeverity, number> = { error: 0, warning: 0, info: 0 };

  (Object.keys(SECTION_CHECKS) as SectionKey[]).forEach((section) => {
    const check = SECTION_CHECKS[section];
    const hit = findSectionHit(text, check);
    if (hit) {
      sections[section] = true;
    } else {
      sections[section] = false;
      const code = SECTION_RULE[section];
      issues.push(createIssue(code, { range: null }));
    }
  });

  if (trimmed.length > 0 && trimmed.length < 120) {
    issues.push(createIssue('PROMPT_TOO_SHORT', { range: toRange(text, 0, text.length) }));
  }

  issues.forEach((issue) => {
    severityCount[issue.severity] += 1;
  });

  const stats: LintStats = {
    lineCount: text ? text.split(/\n/).length : 0,
    wordCount: trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0,
    charCount: text.length,
    sections,
    severityCount,
  };

  return {
    issues,
    stats,
    version: config.version,
  };
}

export function locateSection(content: string, section: SectionKey) {
  const text = content ?? '';
  const check = SECTION_CHECKS[section];
  const hit = findSectionHit(text, check);
  if (!hit) return null;
  return toRange(text, hit.index, hit.length);
}

export const ruleVersion = config.version;
