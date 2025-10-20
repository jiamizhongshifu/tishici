export type LintSeverity = 'error' | 'warning' | 'info' | 'success';

export type LintRange = {
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
};

export type LintFix = {
  hint: string | null;
  replacement?: {
    text: string;
    range: LintRange;
  };
};

export type LintIssue = {
  code: string;
  severity: LintSeverity;
  message: string;
  range?: LintRange | null;
  fix?: LintFix | null;
  tags?: string[];
  metadata?: Record<string, unknown>;
};

export type LinterSummary = {
  totalIssues: number;
  errors: number;
  warnings: number;
  infos: number;
  successes: number;
};

export type LinterResponse = {
  issues: LintIssue[];
  summary: LinterSummary;
  generatedAt: string;
  configVersion?: string;
};

export type LinterRequestBody = {
  prompt: string;
  locale?: string;
  model?: string;
};

export type LinterConfig = {
  version: string;
  metadata: {
    localeFallback: string;
    severityOrder: LintSeverity[];
    ruleCategories: Record<
      string,
      {
        label: Record<string, string>;
      }
    >;
  };
  rules: Array<{
    code: string;
    category: string;
    severity: LintSeverity;
    target: string;
    title: Record<string, string>;
    description: Record<string, string>;
    checks: Array<Record<string, unknown>>;
    fixHint?: Record<string, string>;
    tags?: string[];
    examples?: Record<string, Record<string, string>>;
    autoFix?: Record<string, unknown>;
    suppressOtherRules?: string[];
  }>;
};
