import type { LintRange, LintSeverity } from '../linter/types';

export type PromptLintIssueRecord = {
  code: string;
  severity: LintSeverity;
  message: string;
  range?: LintRange | null;
  fix_hint?: string | null;
  tags?: string[] | null;
  metadata?: Record<string, unknown> | null;
};

export type PromptLintSummary = {
  totalIssues: number;
  errors: number;
  warnings: number;
  infos: number;
  successes: number;
};

export type PromptLintSnapshot = {
  issues: PromptLintIssueRecord[];
  summary: PromptLintSummary | null;
  generated_at?: string | null;
  config_version?: string | null;
};

export type PromptEvalScore = {
  clarity?: number | null;
  constraints?: number | null;
  reproducibility?: number | null;
  overall?: number | null;
  strengths?: string[] | null;
  improvements?: string[] | null;
  cost?: {
    totalTokens?: number | null;
    inputTokens?: number | null;
    outputTokens?: number | null;
    estimatedUsd?: number | null;
  } | null;
  model?: string | null;
  evaluatedAt?: string | null;
  notes?: string | null;
};

export type PromptRecord = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category_id: string | null;
  created_at: string;
  updated_at: string;
  lint_issues: PromptLintSnapshot | null;
  eval_score: PromptEvalScore | null;
};
