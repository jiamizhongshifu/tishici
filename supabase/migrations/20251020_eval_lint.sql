alter table if exists public.prompts
  add column if not exists lint_issues jsonb default '[]'::jsonb;

alter table if exists public.prompts
  add column if not exists eval_score jsonb;
