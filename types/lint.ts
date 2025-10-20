export type LintSeverity = 'error' | 'warning' | 'info';

export type LintRangePoint = {
  line: number;
  column: number;
  offset: number;
};

export type LintRange = {
  start: LintRangePoint;
  end: LintRangePoint;
};

export type LintIssue = {
  code: string;
  severity: LintSeverity;
  message: string;
  range?: LintRange | null;
  fix_hint?: string;
};

export type LintStats = {
  lineCount: number;
  wordCount: number;
  charCount: number;
  sections: Record<string, boolean>;
  severityCount: Record<LintSeverity, number>;
};

export type LintResponse = {
  lint_issues: LintIssue[];
  stats: LintStats;
  rule_version: string;
};
