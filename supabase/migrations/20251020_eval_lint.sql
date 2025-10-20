-- Prompt feedback fields (lint issues + eval scores)
alter table public.prompts
  add column if not exists lint_issues jsonb not null default '[]'::jsonb;

alter table public.prompts
  add column if not exists eval_score jsonb;

comment on column public.prompts.lint_issues is 'Latest lint issues returned by /api/linter.';
comment on column public.prompts.eval_score is 'Latest evaluation scores payload returned by /api/eval/run.';
