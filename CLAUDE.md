# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a bilingual (Chinese/English) prompt management tool built with Next.js 14 and Supabase. It provides comprehensive prompt lifecycle management including quality checking (linting), evaluation, and resourceization (pack import/export). The application uses server-side rendering with the App Router and server actions for data mutations.

## Communication Guidelines

When working with this codebase, Claude Code should follow these communication preferences:

1. **Language Preference**: Respond in Chinese (中文) whenever possible, unless the user explicitly requests English or when technical documentation requires English.

2. **Code Compatibility**: Avoid writing compatibility code or polyfills unless explicitly required by the user or project requirements. Focus on modern, clean implementations that target the project's specified environment.

## Development Commands

### Setup
```bash
npm install
```

### Database
```bash
# Run migrations (requires Supabase CLI or direct SQL execution)
npx supabase migration up --file supabase/migrations/0001_init.sql
npx supabase migration up --file supabase/migrations/20251020_eval_lint.sql
```

### Development
```bash
npm run dev              # Start dev server at http://localhost:3000
npm run build            # Build for production
npm start                # Start production server
```

### Testing
```bash
npm run test             # Run unit tests (Vitest)
npm run test:watch       # Run tests in watch mode
npx playwright install   # Install Playwright browsers (one-time)
npm run test:e2e         # Run E2E tests (Playwright)
```

### Translation and Packs
```bash
npm run sync:prompt-packs  # Sync prompt pack data
node verify-translation.js  # Verify translation file formats
node verify-all-packs.js   # Verify all prompt packs
```

### Type Checking
```bash
npx tsc --noEmit         # Type check without emitting files
```

## Architecture

### Core Features

**Stage 1: Prompt Quality Management (Feedback Loop)**
- **Linter**: 8 professional rules covering structure, context, constraints, format, and consistency. Rules are defined in `config/linter-rules.json` and processed by `lib/linter/engine.ts`
- **Auto-Fix**: AI-driven fix suggestions with visual diff preview via `/api/linter/fix`
- **Evaluation**: Multi-dimensional scoring (clarity, constraints, reproducibility) via `/api/eval/run`

**Stage 2: Resourceization (Ecosystem)**
- **Pack Import/Export**: Batch import/export prompts in JSON format via `PackIO.tsx` component
- **Bootstrap**: Generate best-practice templates via `/api/bootstrap`
- **Template Library**: 17+ professional templates across 5 categories (Writing, Coding, Research, Drawing, Chat) loaded from `data/templates/`

### Tech Stack Architecture

**Frontend Layer**
- Next.js 14 App Router with Server Components (RSC)
- TypeScript with strict mode enabled
- Client components use "use client" directive
- Form submissions handled via server actions

**Backend Layer**
- Server Actions in `app/actions.ts` for data mutations (createPrompt, updatePrompt, importPromptPack, exportPromptPack)
- API Routes in `app/api/` for AI integrations (linter, eval, bootstrap, generate)
- Row Level Security (RLS) enforced at database level

**Data Layer**
- Supabase for auth, database (PostgreSQL), and storage
- Two Supabase client patterns:
  - `createRSCClient()` for Server Components (read-only cookies)
  - `createActionClient()` for Route Handlers and Server Actions (can modify cookies)
- Main tables: `prompts`, `categories`, `openai_usage`

**AI Integration**
- OpenAI client wrapper in `lib/openai.ts`
- Default model: `gpt-5` (configurable via `OPENAI_DEFAULT_MODEL`)
- Compatible with OpenAI-compatible services via `OPENAI_BASE_URL`
- Usage tracking: `runChatCompletionWithUsage()` tracks tokens and cost

### Key Architectural Patterns

**Bilingual i18n System**
- Dictionary-based translations in `lib/i18n.ts`
- Locale stored in cookies, accessed via `getDictionary()`
- Supports `zh` (Chinese) and `en` (English)
- All user-facing strings must have both translations

**Linter System Architecture**
- Rules configured in `config/linter-rules.json` with version tracking
- Engine in `lib/linter/engine.ts` evaluates rules via regex patterns
- Rules support:
  - `must_include_any`: Pattern matching with min matches/length
  - `placeholder_consistency`: Variable naming consistency
  - `max_length`: Content length constraints
  - `suppressOtherRules`: Complex guidance detection can suppress basic checks
- Lint results stored in `prompts.lint_issues` JSONB column

**Template System**
- Templates organized by category in `data/templates/*.json`
- Each template has bilingual content with `{{variable}}` placeholders
- `lib/templates.ts` provides:
  - `getAllTemplateCategories()`: Get all template categories
  - `getTemplate()`: Get specific template
  - `fillTemplateVariables()`: Replace variables with values
  - `extractTemplateVariables()`: Extract variable names from content

**Prompt Pack Format**
- Two schemas supported:
  1. Simple: `{ prompts: [{ title, content, category }] }`
  2. Sectioned: `{ title, summary, sections: [{ heading, prompts: [{ useCase, prompt }] }] }`
- Import/export logic in `app/actions.ts` handles both formats
- Pack data stored in `data/promptPacks.ts` and `lib/promptPacks.ts`

### Important File Locations

**Core Business Logic**
- `app/actions.ts`: All server actions for CRUD operations
- `lib/openai.ts`: OpenAI integration with cost tracking
- `lib/linter/engine.ts`: Prompt linting engine
- `lib/templates.ts`: Template loading and variable filling
- `lib/supabase/server.ts`: Supabase client factory functions

**Configuration**
- `config/linter-rules.json`: Linter rule definitions (versioned)
- `data/templates/*.json`: Template definitions by category
- `lib/i18n.ts`: Complete bilingual dictionary (800+ lines)

**Key Components**
- `components/PromptForm.tsx`: Main form with 4 modes (Manual, Generator, Bootstrap, Template)
- `components/PackIO.tsx`: Import/export pack functionality
- `components/TemplatePicker.tsx`: Template browsing and selection
- `components/EvalRunner.tsx`: Evaluation UI and score display

**API Routes**
- `/api/linter`: Run lint checks on prompt content
- `/api/linter/fix`: Generate AI-driven fix suggestions
- `/api/eval/run`: Evaluate prompt quality with scoring
- `/api/eval/suggest`: Generate improvement suggestions
- `/api/bootstrap`: Generate best-practice templates
- `/api/generate`: AI-assisted prompt generation

## Development Guidelines

### When Adding Linter Rules

1. Edit `config/linter-rules.json`
2. Follow the schema: `code`, `category`, `severity`, `title`, `description`, `checks`, `fixHint`
3. Both `zh-CN` and `en-US` translations required for user-facing strings
4. Supported check types: `must_include_any`, `placeholder_consistency`, `max_length`
5. Test rules by running lint on sample prompts

### When Adding Templates

1. Add to appropriate category file in `data/templates/`
2. Provide bilingual `title`, `description`, and `content`
3. Use `{{variable_name}}` syntax for placeholders
4. Define `variables` array with labels and placeholders in both languages
5. Add relevant `tags` for search discoverability

### When Working with Server Actions

- Server actions must be in files with `'use server'` directive
- Use `createActionClient()` for Supabase client (not RSC client)
- Always revalidate paths after mutations: `revalidatePath()`
- Return structured state objects for form error handling
- Use `redirect()` after successful mutations when needed

### When Working with Supabase

- Use `createRSCClient()` in Server Components for data fetching
- Use `createActionClient()` in Server Actions and Route Handlers
- RLS policies enforce user_id checks - always filter by auth.uid()
- Schema changes require migrations in `supabase/migrations/`
- Category creation: Use `ensureCategory()` helper from `lib/categories.ts`

### When Working with AI APIs

- Use `runChatCompletionWithUsage()` from `lib/openai.ts` for all OpenAI calls
- Pass `onUsage` callback to persist usage data to `openai_usage` table
- Model resolution: `resolveModel()` checks env vars with fallback to `gpt-5`
- Always handle errors gracefully and return user-friendly messages

### Internationalization (i18n)

- All user-facing strings must be in `lib/i18n.ts` dictionary
- Access via `const dict = await getDictionary()` in Server Components
- Use structured paths like `dict.promptForm.titleLabel`
- Forms and components receive dictionary as prop
- Locale switching handled by `LanguageToggle.tsx` component

### Database Schema Notes

**prompts table**
- `lint_issues`: JSONB field storing linter output (issues, summary, metadata)
- `eval_score`: JSONB field storing evaluation results
- `category_id`: Foreign key to categories (nullable)
- Auto-updated `updated_at` via trigger function

**categories table**
- Global categories readable by all, writable by authenticated users
- Custom categories created per-user via `ensureCategory()` helper

**openai_usage table** (optional)
- Tracks token usage, cost, and metadata per API call
- Links to user_id and task_id for analytics
