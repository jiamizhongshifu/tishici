# Prompt Management Tool – Stage 1 & 2 Delivery Plan

## 1. Vision & Scope
- Evolve the existing “Prompt Collections” into a unified Prompt Management Tool that closes the feedback loop (linting, evaluation, guided fixes) and establishes reusable prompt assets (packs, templates, bootstrap flows).
- Stage 1 focuses on the feedback loop from prompt authoring to iterative improvement.
- Stage 2 delivers assetization: diffable prompt packs, import/export, template library, and guided bootstrap creation.

## 2. Timeline & Milestones (Tokyo Time, 2025)
| Sprint | Dates | Primary Focus | Exit Criteria |
| --- | --- | --- | --- |
| Week 1 | Oct 20 – Oct 26 | Linter rules + API, PromptForm lint integration, DB support | `/api/linter` returns structured issues; PromptForm surfaces inline highlights; `prompts` table stores lint + eval placeholders. |
| Week 2 | Oct 27 – Nov 2 | Eval runner backend + UI, auto-fix API/UI, QA coverage | `/api/eval/run` operational with Supabase auth + usage logging; one-click fix flow functional; Stage 1 end-to-end Playwright suite green. |
| Week 3 | Nov 3 – Nov 9 | Pack diff backend + visualization groundwork, import/export backend | `/packs/[id]/diff` produces structured JSON; initial diff UI renders comparisons; Pack import/export actions verified. |
| Week 4 | Nov 10 – Nov 16 | Bootstrap API + form integration, template library | Bootstrap flow produces editable templates; Template picker ships with 5 preset categories; Stage 2 acceptance tests pass. |
| Week 5 | Nov 17 – Nov 23 | Research POCs (usage analytics, sharing model) | Architecture notes + data dictionary for analytics; RLS-sharing strategy documented with prototype data structures. |

Milestones:
- **Stage 1 — Feedback Loop (ms-stage1)** due Nov 2.
- **Stage 2 — Assetization (ms-stage2)** due Nov 16.

## 3. Stage Breakdown & Key Outcomes
### Stage 1 — Feedback Loop (Sprints 1–2)
- Robust linting ruleset with severity grading and fix hints (`config/linter-rules.json`).
- `/api/linter` and `/api/linter/fix` enforce session validation, call OpenAI gateway (`lib/openai.ts`), and log consumption.
- PromptForm surfaces lint highlights, statistics, and single-click fixes with undo history.
- Eval runner supports batch and single runs, returning structured scores and token accounting.
- Stage 1 QA signs off via Playwright flows covering create → lint → fix → eval → save.

### Stage 2 — Assetization (Sprints 3–4)
- Prompt packs gain diff views, metadata expansion, and import/export flows.
- Users can bootstrap new prompts from goals and choose from curated templates.
- Template library ships five preset pack types (writing, drawing, coding, research, chat).
- QA validates import/export, diff, bootstrap, and template flows end-to-end.

### Week 5 Research Tracks
- Usage analytics & recommendations (Supabase Functions POC, metrics definition, visualization sketch).
- Pack sharing & permissions (visibility modes, RLS draft, minimal viable data model).

## 4. Team & Ownership
- **Dev A**: Linter rules, `/api/linter`, DB migrations (`prompts` extensions, pack metadata), analytics research.
- **Dev B**: PromptForm integrations (lint, fixes, import/export UI), Pack IO.
- **Dev C**: Eval runner backend/UI, bootstrap API + form integration.
- **Dev D**: Pack diff backend/UI, template library, sharing research.
- **QA**: Stage acceptance testing (Playwright suites), regression coverage.

Weekly sync cadence:
1. Monday: Sprint kickoff (backlog review, risk assessment).
2. Wednesday: API/frontend integration checkpoint.
3. Friday: Demo + QA handoff, backlog grooming for next sprint.

## 5. Deliverables by Sprint
- **Week 1 Deliverables**
  - `config/linter-rules.json` with severity, category, fix hints.
  - `/api/linter` route + Supabase session validation.
  - `components/PromptForm.tsx` lint highlights & summary.
  - Supabase migration `20251020_eval_lint.sql` storing lint/eval JSONB fields.
- **Week 2 Deliverables**
  - `/api/linter/fix` route with OpenAI-powered diff suggestions.
  - `/api/eval/run` with token logging and scoring schema.
  - `EvalRunner` and `ScoreCard` components for detailed feedback.
  - One-click apply/undo for lint fixes.
  - Playwright Stage 1 scenarios automated.
- **Week 3 Deliverables**
  - `/packs/[id]/diff` backend comparison logic in `lib/promptPacks.ts`.
  - Diff visualization groundwork + JSON export option.
  - `app/actions.ts` import/export flows + `components/PackIO.tsx`.
- **Week 4 Deliverables**
  - `/api/bootstrap` generating structured templates.
  - PromptForm bootstrap integration.
  - Template library JSONs under `data/templates/` + picker UI.
  - Stage 2 Playwright coverage.
- **Week 5 Deliverables**
  - Usage analytics POC documentation + sketches.
  - Sharing & permissions data model + RLS strategy note.

## 6. Architecture & Integration Notes
- Centralize OpenAI client logic in `lib/openai.ts` with request auditing and Supabase session enforcement.
- Supabase schema revisions deployed weekly with rollback scripts; coordinate migrations affecting packs/prompts.
- Frontend error handling pairs inline annotations with accessible toasts to ensure screen-reader reach.
- Evaluate caching strategies for lint/eval results to reduce redundant model calls.

## 7. Quality Strategy
- Unit coverage: lint rule validation, diff generator, bootstrap prompt structuring.
- Integration tests: API routes with mocked OpenAI responses and Supabase session stubs.
- Playwright suites: Stage 1 flow (Week 2), Stage 2 asset flows (Week 4).
- Observability: log request IDs and token usage; add dashboards in Supabase for API success/failure rates.

## 8. Risks & Mitigations
- **Model API latency or cost spikes** → cache recent lint/eval results; implement exponential backoff and alerting.
- **Schema drift during weekly releases** → enforce migration rehearsal + rollback scripts, align with QA window.
- **UI complexity for diff/highlight** → prototype interactions early, usability test with internal stakeholders.
- **Cross-team dependency on OpenAI quotas** → monitor consumption, prepare fallback provider configuration.
- **P0 regression from auto-fix** → ensure diff preview + undo path; add contract tests for fix suggestions.

## 9. Metrics & Reporting
- Prompt lifecycle KPIs: lint issues per prompt, average eval scores, time-to-fix, adoption of packs/templates.
- Operational metrics: API latency, OpenAI token usage, error rate per route.
- Weekly dashboard updates plus sprint review highlights; share with stakeholders via README badge or Notion.

## 10. Immediate Next Steps (Pre-Sprint Checklist)
1. Finalize linter rule taxonomy and confirm JSON schema.
2. Provision Supabase service role + OpenAI keys in `.env.local` (mirrored in secrets manager).
3. Align QA on Playwright test plan and data fixtures.
4. Schedule design review for lint highlight UX and diff visualization.
5. Confirm logging requirements with infra (usage tracking, cost monitoring).
