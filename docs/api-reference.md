# API Reference

Complete reference for all API endpoints in the Prompt Builder application.

## Authentication

All API routes require authentication via Supabase. Users must be logged in to access these endpoints.

**Authentication Method**: Supabase Session (Cookie-based)

**Error Responses**:
- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Server-side error

---

## Linter API

### POST `/api/linter`

Analyzes a prompt and returns lint issues based on configured rules.

**Request Body**:
```json
{
  "prompt": "string (required) - The prompt content to analyze",
  "locale": "string (optional) - Language locale ('zh' or 'en'), defaults to 'zh'"
}
```

**Response** (200 OK):
```json
{
  "lint_issues": [
    {
      "code": "string - Rule code (e.g., 'PROMPT_ROLE_MISSING')",
      "severity": "string - 'error' | 'warning' | 'info'",
      "message": "string - Human-readable issue description",
      "range": {
        "start": "number - Start character position (optional)",
        "end": "number - End character position (optional)"
      },
      "fix_hint": "string - Suggestion for fixing (optional)",
      "tags": ["string - Related tags (optional)"],
      "metadata": "object - Additional context (optional)"
    }
  ],
  "summary": {
    "totalIssues": "number - Total count of issues",
    "errors": "number - Count of error-level issues",
    "warnings": "number - Count of warning-level issues",
    "infos": "number - Count of info-level issues"
  },
  "generated_at": "string - ISO 8601 timestamp",
  "config_version": "string - Linter config version"
}
```

**Error Responses**:
- `400 Bad Request`: Missing or empty prompt
- `401 Unauthorized`: Not authenticated

**Example Request**:
```bash
curl -X POST http://localhost:3000/api/linter \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "请帮我写一份市场调研报告。",
    "locale": "zh"
  }'
```

---

### POST `/api/linter/fix`

Generates AI-powered fix suggestions for lint issues.

**Request Body**:
```json
{
  "prompt": "string (required) - Original prompt content",
  "issues": [
    {
      "code": "string - Issue code",
      "severity": "string - 'error' | 'warning' | 'info'",
      "message": "string - Issue message",
      "fix_hint": "string (optional) - Fix hint"
    }
  ],
  "locale": "string (optional) - 'zh' or 'en', defaults to 'zh'",
  "model": "string (optional) - OpenAI model to use",
  "config_version": "string (optional) - Linter config version"
}
```

**Response** (200 OK):
```json
{
  "summary": "string - Brief overview of changes",
  "suggestions": [
    {
      "issue_code": "string - Related issue code",
      "description": "string - How the issue was addressed"
    }
  ],
  "revised_prompt": "string - The improved prompt text",
  "diff": "string - Readable diff or bullet list of changes",
  "usage": {
    "model": "string - Model used",
    "inputTokens": "number",
    "outputTokens": "number",
    "totalTokens": "number",
    "costUsd": "number",
    "latencyMs": "number"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Missing prompt or no issues provided
- `401 Unauthorized`: Not authenticated
- `502 Bad Gateway`: Failed to parse OpenAI response

**Example Request**:
```bash
curl -X POST http://localhost:3000/api/linter/fix \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "请帮我写报告",
    "issues": [
      {
        "code": "PROMPT_ROLE_MISSING",
        "severity": "error",
        "message": "缺少角色设定",
        "fix_hint": "在开头加入描述 AI 身份的句子"
      }
    ],
    "locale": "zh"
  }'
```

---

## Evaluation API

### POST `/api/eval/run`

Evaluates one or more prompts across multiple quality dimensions.

**Request Body**:
```json
{
  "prompts": [
    {
      "id": "string (optional) - Prompt ID to update eval_score",
      "title": "string (optional) - Prompt title",
      "content": "string (required) - Prompt content to evaluate"
    }
  ],
  "locale": "string (optional) - 'zh' or 'en', defaults to 'zh'",
  "model": "string (optional) - OpenAI model to use"
}
```

**Response** (200 OK):
```json
{
  "results": [
    {
      "prompt_id": "string | null - ID if provided",
      "score": {
        "overall": "number (0-100) - Overall quality score",
        "clarity": "number (0-100) - Clarity score",
        "constraints": "number (0-100) - Constraints score",
        "reproducibility": "number (0-100) - Reproducibility score",
        "strengths": ["string - Key strengths"],
        "improvements": ["string - Suggested improvements"],
        "notes": "string - Additional notes",
        "model": "string - Model used for evaluation",
        "evaluatedAt": "string - ISO 8601 timestamp",
        "cost": {
          "inputTokens": "number",
          "outputTokens": "number",
          "totalTokens": "number",
          "estimatedUsd": "number"
        }
      },
      "usage": {
        "model": "string",
        "inputTokens": "number",
        "outputTokens": "number",
        "totalTokens": "number",
        "costUsd": "number",
        "latencyMs": "number"
      }
    }
  ]
}
```

**Error Responses**:
- `400 Bad Request`: No prompts provided or empty content
- `401 Unauthorized`: Not authenticated

**Notes**:
- If `prompt.id` is provided and valid, the eval score is automatically saved to the database
- Evaluation runs sequentially for multiple prompts
- Each evaluation is logged to the `openai_usage` table

**Example Request**:
```bash
curl -X POST http://localhost:3000/api/eval/run \
  -H "Content-Type: application/json" \
  -d '{
    "prompts": [
      {
        "id": "prompt-uuid",
        "title": "数据分析助手",
        "content": "你是一名专业数据分析师。任务：分析数据并生成报告。"
      }
    ],
    "locale": "zh"
  }'
```

---

## Bootstrap API

### POST `/api/bootstrap`

Generates a production-ready prompt template based on user requirements, following prompt engineering best practices.

**Request Body**:
```json
{
  "goal": "string (required) - What the prompt should accomplish",
  "domain": "string (optional) - Domain or industry (e.g., 'Marketing', 'Code Review')",
  "audience": "string (optional) - Target audience",
  "constraints": "string (optional) - Specific rules or limitations",
  "locale": "string (optional) - 'zh' or 'en', defaults to 'zh'",
  "model": "string (optional) - OpenAI model to use"
}
```

**Response** (200 OK):
```json
{
  "title": "string - Generated prompt title (5-10 words)",
  "content": "string - Complete, production-ready prompt text",
  "suggestedCategory": "string | null - Suggested category name",
  "usage": {
    "model": "string",
    "inputTokens": "number",
    "outputTokens": "number",
    "totalTokens": "number",
    "costUsd": "number",
    "latencyMs": "number"
  }
}
```

**Generated Prompt Structure**:

The bootstrap API generates prompts that include:
1. **Role definition**: Clear AI persona or identity
2. **Task description**: Explicit, actionable task
3. **Execution constraints**: Rules, limitations, safety considerations
4. **Output format**: Structured response specification
5. **Examples**: Sample input/output (when applicable)
6. **Variables**: Placeholders like `{{variable_name}}`

**Error Responses**:
- `400 Bad Request`: Missing `goal` parameter
- `401 Unauthorized`: Not authenticated
- `502 Bad Gateway`: Failed to parse OpenAI response

**Example Request**:
```bash
curl -X POST http://localhost:3000/api/bootstrap \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "帮助用户审查代码并提供改进建议",
    "domain": "软件开发",
    "audience": "开发团队",
    "constraints": "必须包含安全性检查，输出格式为 Markdown",
    "locale": "zh"
  }'
```

**Example Response**:
```json
{
  "title": "代码审查助手",
  "content": "你是一名经验丰富的软件工程师，专注于代码质量和安全性审查。\n\n任务：审查以下代码并提供详细的改进建议。\n\n代码：\n{{code}}\n\n审查重点：\n1. 代码正确性和逻辑错误\n2. 性能优化机会\n3. 安全漏洞和风险点\n4. 可维护性和可读性\n5. 最佳实践遵循情况\n\n约束条件：\n- 必须进行安全性检查\n- 提供具体的代码示例\n- 不做主观判断，基于事实\n\n输出格式：Markdown\n## 审查摘要\n## 发现的问题\n## 建议的改进\n## 安全性评估",
  "suggestedCategory": "编程开发",
  "usage": {
    "model": "gpt-5",
    "inputTokens": 245,
    "outputTokens": 312,
    "totalTokens": 557,
    "costUsd": 0.00278,
    "latencyMs": 1834
  }
}
```

---

## Generate API

### POST `/api/generate`

Generates a prompt draft based on user-provided parameters (original generator mode).

**Request Body**:
```json
{
  "goal": "string (required) - Goal or purpose",
  "audience": "string (optional) - Target audience",
  "tone": "string (optional) - Desired tone (e.g., 'formal', 'casual', 'neutral')",
  "language": "string (optional) - Output language ('zh' or 'en')",
  "style": "string (optional) - Additional style requirements"
}
```

**Response** (200 OK):
```json
{
  "title": "string - Generated title",
  "content": "string - Generated prompt content"
}
```

**Error Responses**:
- `400 Bad Request`: Missing `goal` parameter
- `401 Unauthorized`: Not authenticated

**Example Request**:
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "分析用户反馈并生成改进建议",
    "audience": "产品团队",
    "tone": "professional",
    "language": "zh"
  }'
```

---

## Server Actions

These are Next.js Server Actions used in forms, not HTTP endpoints.

### `createPrompt(formData)`

Creates a new prompt in the database.

**FormData Fields**:
- `title`: string (optional, auto-generated from content if empty)
- `content`: string (required)
- `category_id`: string (optional)
- `category_name`: string (optional, creates new category if provided)
- `lint_payload`: string (optional, JSON-stringified lint results)
- `redirectTo`: string (optional, redirect target after save)

**Returns**: `{ success: boolean, error?: string }`

### `updatePrompt(formData)`

Updates an existing prompt.

**FormData Fields**:
- `prompt_id`: string (required)
- `title`: string (optional)
- `content`: string (required)
- `category_id`: string (optional)
- `category_name`: string (optional)
- `lint_payload`: string (optional)
- `redirectTo`: string (optional)

**Returns**: `{ success: boolean, error?: string }`

### `importPromptPack(formData)`

Imports prompts from a JSON Pack file.

**FormData Fields**:
- `pack_json`: string (required, JSON-stringified pack data)

**Returns**: `{ success: boolean, count?: number, error?: string }`

**Supported Pack Formats**:

1. **Sections format** (recommended):
```json
{
  "title": "Pack Title",
  "summary": "Pack description",
  "sections": [
    {
      "heading": "Category Name",
      "description": "Optional description",
      "prompts": [
        {
          "useCase": "Prompt title",
          "prompt": "Prompt content",
          "url": "Optional reference URL"
        }
      ]
    }
  ]
}
```

2. **Direct prompts format**:
```json
{
  "prompts": [
    {
      "title": "Prompt title",
      "content": "Prompt content",
      "category": "Optional category name"
    }
  ]
}
```

**Error Codes**:
- `NOT_AUTHENTICATED`: User not logged in
- `PACK_JSON_REQUIRED`: No JSON provided
- `PACK_JSON_INVALID`: Invalid JSON format
- `NO_PROMPTS_FOUND`: No prompts found in pack
- `NO_VALID_PROMPTS`: No valid prompts after parsing

### `exportPromptPack(formData)`

Exports selected prompts as a JSON Pack.

**FormData Fields**:
- `prompt_ids`: string[] (required, array of prompt IDs)
- `pack_title`: string (optional, defaults to 'My Prompt Pack')
- `pack_summary`: string (optional)

**Returns**:
```json
{
  "success": boolean,
  "packJson": "string (JSON-stringified pack)",
  "error": "string (optional)"
}
```

**Output Format**:
```json
{
  "title": "Pack Title",
  "summary": "Pack description",
  "generated_at": "ISO 8601 timestamp",
  "sections": [
    {
      "heading": "Category Name",
      "prompts": [
        {
          "useCase": "Prompt title",
          "prompt": "Prompt content"
        }
      ]
    }
  ]
}
```

---

## Rate Limiting

Currently, there are no rate limits enforced at the application level. However, OpenAI API calls are subject to:
- OpenAI's rate limits
- Your API key quota
- Supabase connection limits

**Recommendations**:
- Implement client-side debouncing (already done for linter: 400ms)
- Monitor usage via `openai_usage` table
- Set up alerts for cost spikes

---

## Usage Tracking

All OpenAI API calls are logged to the `openai_usage` table (if the table exists) with:
- `user_id`: Who made the request
- `task_id`: Which operation (`linter_fix`, `eval_run`, `bootstrap`, etc.)
- `model`: Which model was used
- `input_tokens`, `output_tokens`, `total_tokens`: Token counts
- `cost_usd`: Estimated cost
- `latency_ms`: Request duration
- `meta`: Additional context (JSONB)

---

## Error Handling

### Standard Error Response Format

```json
{
  "error": "string - Error message"
}
```

### Common Error Codes

| Status Code | Meaning | Common Causes |
|-------------|---------|---------------|
| 400 | Bad Request | Missing required fields, invalid input |
| 401 | Unauthorized | Not logged in, session expired |
| 500 | Internal Server Error | Server-side error, database error |
| 502 | Bad Gateway | OpenAI API failure, parsing error |

### Client-Side Error Handling

The application handles errors at multiple levels:

1. **Network errors**: Caught in fetch try-catch blocks
2. **Validation errors**: Checked before API calls
3. **User feedback**: Displayed via inline messages and error states
4. **Logging**: Errors logged to console with context

**Example Error Handling Pattern**:
```typescript
try {
  const response = await fetch('/api/linter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, locale }),
  });
  
  if (!response.ok) {
    const detail = await response.json();
    throw new Error(detail?.error || 'Request failed');
  }
  
  const data = await response.json();
  // Process success
} catch (error) {
  // Display user-friendly error message
  setError(error.message);
}
```

---

## OpenAI Integration

### Model Configuration

Default model: `gpt-5` (configurable via `OPENAI_DEFAULT_MODEL` env var)

**Supported operations**:
- Linter fix suggestions
- Prompt evaluation
- Bootstrap template generation
- Prompt generation

### Token Estimation

Token costs are estimated using the following pricing (as of 2025):

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------|
| gpt-4o | $2.50 | $10.00 |
| gpt-4o-mini | $0.15 | $0.60 |
| gpt-5 | $5.00 | $15.00 |

**Cost Calculation**:
```typescript
costUsd = (inputTokens * inputPrice + outputTokens * outputPrice) / 1_000_000
```

### Request Flow

1. Client sends request to API route
2. API route validates authentication (Supabase session)
3. API route calls `runChatCompletionWithUsage` from `lib/openai.ts`
4. OpenAI client makes the request
5. Usage is logged via `persistOpenAIUsage`
6. Response is returned to client

---

## Caching Strategy

### Lint Results

- Lint runs are triggered automatically with 400ms debounce
- Results are not cached; each edit triggers a new lint
- Rationale: Rules are lightweight, no external API calls

### Eval Results

- Eval scores are saved to database (`prompts.eval_score`)
- Re-running eval on the same prompt updates the score
- No automatic re-evaluation on edit

### Fix Suggestions

- Not cached; each request generates new suggestions
- Rationale: OpenAI may provide different variations
- User can apply/undo to compare options

---

## Security Considerations

### Row Level Security (RLS)

All database operations enforce RLS policies:
- Users can only access their own prompts
- Users can only access their own categories
- Public packs are read-only for all users

### Input Validation

- All user inputs are sanitized before database operations
- JSON parsing is wrapped in try-catch
- SQL injection is prevented via Supabase client parameterization

### API Key Protection

- OpenAI API key stored server-side only
- Never exposed to client
- Accessed via environment variables

### Content Safety

- OpenAI's content moderation is inherited from the model
- No additional content filtering is applied
- Consider implementing custom filters for sensitive use cases

---

## Performance Optimization

### Recommendations

1. **Debouncing**: Already implemented for linter (400ms)
2. **Pagination**: Dashboard queries limit results to 100
3. **Selective queries**: Only fetch required fields
4. **Batch operations**: Import/export supports bulk operations
5. **Caching**: Consider Redis for eval results if usage grows

### Monitoring

Track these metrics:
- API response time (latency_ms in openai_usage)
- Error rate (console logs)
- Token usage (openai_usage table)
- Cost per user (aggregate usage)

---

## API Versioning

Current version: `v1` (implicit, no version prefix in URLs)

Future versioning strategy:
- Breaking changes → new version prefix (e.g., `/api/v2/linter`)
- Non-breaking changes → same endpoint, backward compatible
- Deprecation → 3-month notice, graceful fallbacks

---

## Testing APIs

### Mock Data

See `tests/api/` for example mock data structures.

### Integration Tests

Run with Vitest:
```bash
npm run test -- tests/api
```

### E2E Tests

Run with Playwright (when implemented):
```bash
npm run test:e2e
```

---

## Support & Resources

- [Linter Rules Guide](./linter-rules-guide.md)
- [Template Format Specification](./template-format.md)
- [Stage 1-2 Development Plan](./stage1-2-plan.md)
- [Main README](../README.md)



