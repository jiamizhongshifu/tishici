# Linter Rules Guide

Complete guide to understanding and customizing the prompt linting system.

## Overview

The linter analyzes prompts against a configurable set of rules to ensure quality, clarity, and completeness. Rules are defined in `config/linter-rules.json` and executed by the linter engine in `lib/linter/engine.ts`.

## Rule Structure

Each rule in `config/linter-rules.json` follows this schema:

```json
{
  "code": "string - Unique rule identifier (UPPERCASE_SNAKE_CASE)",
  "category": "string - Rule category",
  "severity": "string - 'error' | 'warning' | 'info'",
  "target": "string - What the rule applies to",
  "title": {
    "zh-CN": "string - Rule title in Chinese",
    "en-US": "string - Rule title in English"
  },
  "description": {
    "zh-CN": "string - Rule description in Chinese",
    "en-US": "string - Rule description in English"
  },
  "checks": [
    {
      "type": "string - Check type",
      "patterns": ["string - Regex patterns"],
      "...": "other type-specific options"
    }
  ],
  "fixHint": {
    "zh-CN": "string - Fix suggestion in Chinese",
    "en-US": "string - Fix suggestion in English"
  },
  "tags": ["string - Related tags"],
  "examples": {
    "bad": {
      "zh-CN": "string - Bad example",
      "en-US": "string - Bad example"
    },
    "good": {
      "zh-CN": "string - Good example",
      "en-US": "string - Good example"
    }
  },
  "autoFix": {
    "strategy": "string - Auto-fix strategy name",
    "options": {}
  }
}
```

## Rule Categories

### 1. Structure (`structure`)

Rules that ensure the prompt has essential structural elements.

**Purpose**: Verify the prompt includes fundamental components like role definition and task description.

**Examples**:
- `PROMPT_ROLE_MISSING`: Prompt lacks a clear AI persona or role
- `PROMPT_TASK_UNCLEAR`: Task objective is ambiguous

### 2. Context Variables (`context`)

Rules for managing placeholders and dynamic content.

**Purpose**: Ensure variables are used consistently and correctly.

**Examples**:
- `PROMPT_VARIABLE_PLACEHOLDER_MISMATCH`: Inconsistent placeholder naming

### 3. Constraints & Safety (`constraints`)

Rules for execution constraints and safety guardrails.

**Purpose**: Promote safe, compliant prompt usage.

**Examples**:
- `PROMPT_CONSTRAINTS_MISSING`: Lacks execution constraints
- `PROMPT_SAFETY_GUARDRAIL_MISSING`: Missing safety reminders for sensitive tasks

### 4. Output Format (`format`)

Rules for output structure specifications.

**Purpose**: Ensure the prompt specifies expected output format.

**Examples**:
- `PROMPT_OUTPUT_FORMAT_MISSING`: No format specification

### 5. Consistency (`consistency`)

Rules for maintaining clarity and conciseness.

**Purpose**: Improve prompt quality and reduce token waste.

**Examples**:
- `PROMPT_EXAMPLE_MISSING`: Could benefit from examples
- `PROMPT_LENGTH_EXCESSIVE`: Prompt is too long

## Severity Levels

### Error

**When to use**: Critical issues that will likely cause poor results or failures.

**Impact**: High priority, should be fixed before deployment.

**Examples**:
- Missing role definition
- Unclear task description
- Variable mismatch errors
- Safety guardrail missing in sensitive contexts

### Warning

**When to use**: Important issues that may reduce quality but won't break functionality.

**Impact**: Medium priority, recommended to fix.

**Examples**:
- Missing constraints
- Missing output format specification

### Info

**When to use**: Suggestions for improvement that are optional.

**Impact**: Low priority, nice-to-have improvements.

**Examples**:
- Missing examples
- Excessive length

## Check Types

### `must_include_any`

Checks if the prompt contains at least one of the specified patterns.

**Configuration**:
```json
{
  "type": "must_include_any",
  "patterns": ["(?i)角色", "(?i)You are", "(?i)作为"],
  "minMatches": 1
}
```

**Parameters**:
- `patterns`: Array of regex patterns (use `(?i)` for case-insensitive)
- `minMatches`: Minimum number of patterns that must match (optional, default: 1)

**Use cases**:
- Checking for role definitions
- Verifying task descriptions
- Ensuring constraints are present

### `max_length`

Checks if the prompt exceeds a maximum character length.

**Configuration**:
```json
{
  "type": "max_length",
  "limit": 1800
}
```

**Parameters**:
- `limit`: Maximum character count

**Use cases**:
- Preventing excessively long prompts
- Managing token costs

### `placeholder_consistency`

Checks if variable placeholders are used consistently.

**Configuration**:
```json
{
  "type": "placeholder_consistency",
  "patterns": ["\\{\\{[^}]+\\}\\}", "<<[^>]+>>", "\\[[A-Z_]+\\]"]
}
```

**Parameters**:
- `patterns`: Array of placeholder patterns to detect

**Use cases**:
- Ensuring consistent variable syntax
- Detecting orphaned or misnamed variables

### `contextual` (Advanced)

Checks that only apply when certain keywords are present.

**Configuration**:
```json
{
  "type": "must_include_any",
  "patterns": ["(?i)不得违反", "(?i)Comply with"],
  "contextHint": {
    "keywords": ["信用", "医疗", "财务", "legal", "compliance"]
  }
}
```

**Parameters**:
- `contextHint.keywords`: Trigger words that activate this check

**Use cases**:
- Safety guardrails for sensitive domains
- Domain-specific requirements

## Adding New Rules

### Step 1: Define the Rule

Add a new object to the `rules` array in `config/linter-rules.json`:

```json
{
  "code": "PROMPT_CUSTOM_RULE",
  "category": "structure",
  "severity": "warning",
  "target": "prompt.content",
  "title": {
    "zh-CN": "自定义规则标题",
    "en-US": "Custom Rule Title"
  },
  "description": {
    "zh-CN": "规则描述",
    "en-US": "Rule description"
  },
  "checks": [
    {
      "type": "must_include_any",
      "patterns": ["(?i)custom_pattern"]
    }
  ],
  "fixHint": {
    "zh-CN": "修复建议",
    "en-US": "Fix suggestion"
  },
  "tags": ["custom", "example"]
}
```

### Step 2: Update Config Version

Update the `version` field at the top of the config file:

```json
{
  "version": "2025-10-21",
  "metadata": { ... },
  "rules": [ ... ]
}
```

### Step 3: Test the Rule

Create a test in `tests/api/linter.test.ts`:

```typescript
it('detects custom rule violation', async () => {
  await loadLinterConfig();
  const prompt = 'Prompt that violates custom rule';
  const result = await lintPrompt(prompt, { locale: 'zh' });
  const issue = result.issues.find((i) => i.code === 'PROMPT_CUSTOM_RULE');
  expect(issue).toBeTruthy();
  expect(issue?.severity).toBe('warning');
});
```

### Step 4: Verify in UI

1. Start the dev server: `npm run dev`
2. Navigate to create prompt page
3. Enter a prompt that should trigger the rule
4. Verify the issue appears in the lint panel

## Current Rules Reference

### PROMPT_ROLE_MISSING

**Category**: Structure
**Severity**: Error

**What it checks**: Presence of role or persona definition

**Patterns**:
- `(?i)角色`
- `(?i)You are`
- `(?i)作为`
- `(?i)Role:`
- `(?i)Act as`

**Fix hint**: Add an opening sentence defining the AI's identity (e.g., "You are a senior market analyst")

**Example**:
- ❌ Bad: "请帮我写一份市场调研报告。"
- ✅ Good: "你是一名资深的市场分析师，需要为产品 A 撰写调研报告。"

---

### PROMPT_TASK_UNCLEAR

**Category**: Structure
**Severity**: Error

**What it checks**: Clear task objective or deliverable

**Patterns**:
- `(?i)任务`
- `(?i)目标`
- `(?i)请生成`
- `(?i)Your task`
- `(?i)Deliver`

**Min length**: 20 characters

**Fix hint**: State the expected task and output clearly

**Example**:
- ❌ Bad: "帮我分析数据"
- ✅ Good: "任务：分析提供的销售数据，识别趋势并生成包含可视化建议的报告"

---

### PROMPT_CONSTRAINTS_MISSING

**Category**: Constraints
**Severity**: Warning

**What it checks**: Execution constraints or quality standards

**Patterns**:
- `(?i)步骤`
- `(?i)请遵循`
- `(?i)不得`, `(?i)不要`, `(?i)必须`
- `(?i)Step`, `(?i)Guideline`
- `(?i)Do not`, `(?i)Must`

**Fix hint**: Add steps, constraints, or acceptance criteria

**Example**:
- ❌ Bad: "生成一篇文章"
- ✅ Good: "生成一篇文章，要求：1) 控制在 1000 字以内 2) 使用正式语气 3) 不得包含个人观点"

---

### PROMPT_OUTPUT_FORMAT_MISSING

**Category**: Format
**Severity**: Warning

**What it checks**: Explicit output format specification

**Patterns**:
- `(?i)JSON`
- `(?i)表格`, `(?i)列表`
- `(?i)格式`
- `(?i)Output format`
- `(?i)Return .* in`

**Fix hint**: Specify the output structure (e.g., "Return JSON with fields: title, insights, recommendations")

**Example**:
- ❌ Bad: "分析这些数据"
- ✅ Good: "分析这些数据，输出格式为 JSON，包含 summary、key_findings、recommendations 字段"

---

### PROMPT_VARIABLE_PLACEHOLDER_MISMATCH

**Category**: Context Variables
**Severity**: Error

**What it checks**: Consistent placeholder usage

**Detected patterns**:
- `{{variable}}`
- `<<variable>>`
- `[VARIABLE]`

**Fix hint**: Normalize placeholders and ensure consistency

**Auto-fix**: Available (strategy: `rename_placeholders`)

**Example**:
- ❌ Bad: "Analyze {{industry}} data. Report on {industry} trends."
- ✅ Good: "Analyze {{industry}} data. Report on {{industry}} trends."

---

### PROMPT_SAFETY_GUARDRAIL_MISSING

**Category**: Constraints
**Severity**: Error (contextual)

**What it checks**: Safety reminders in sensitive contexts

**Triggers**: Activates when prompt contains keywords like:
- 信用, 医疗, 财务, 法律
- legal, compliance, policy, sensitive

**Patterns**:
- `(?i)不得违反`, `(?i)遵守`
- `(?i)请确保合法`
- `(?i)Avoid (?:illegal|sensitive)`
- `(?i)Comply with`

**Fix hint**: Add safety guidance (e.g., "Do not output personal data and ensure compliance with local laws")

**Example**:
- ❌ Bad: "分析用户的医疗记录"
- ✅ Good: "分析用户的医疗记录。重要：不得输出个人隐私信息，遵守 HIPAA 等医疗隐私法规"

---

### PROMPT_EXAMPLE_MISSING

**Category**: Consistency
**Severity**: Info

**What it checks**: Presence of examples or sample responses

**Patterns**:
- `(?i)示例输出`, `(?i)示例输入`
- `(?i)Example response`
- `(?i)Sample output`
- `(?i)参考答案`

**Fix hint**: Add a sample input or output section

**Example**:
- ❌ Bad: "Generate a product review"
- ✅ Good: "Generate a product review.\n\nExample output:\n★★★★☆\nTitle: Great product with minor issues\nPros: [...]\nCons: [...]"

---

### PROMPT_LENGTH_EXCESSIVE

**Category**: Consistency
**Severity**: Info

**What it checks**: Prompt doesn't exceed recommended length

**Limit**: 1800 characters

**Fix hint**: Remove redundant sections, move background to variables

**Note**: This is a soft limit; some complex prompts legitimately need more content

---

## Customization Examples

### Example 1: Add Code Language Check

Ensure prompts for code-related tasks specify the programming language.

```json
{
  "code": "PROMPT_CODE_LANGUAGE_MISSING",
  "category": "structure",
  "severity": "warning",
  "target": "prompt.content",
  "title": {
    "zh-CN": "未指定编程语言",
    "en-US": "Programming language not specified"
  },
  "description": {
    "zh-CN": "代码相关提示词应明确指定编程语言",
    "en-US": "Code-related prompts should specify the programming language"
  },
  "checks": [
    {
      "type": "must_include_any",
      "patterns": [
        "(?i)Python",
        "(?i)JavaScript",
        "(?i)Java",
        "(?i)编程语言",
        "(?i)language:"
      ],
      "contextHint": {
        "keywords": ["code", "代码", "function", "函数", "class", "类"]
      }
    }
  ],
  "fixHint": {
    "zh-CN": "添加编程语言说明，例如 \"使用 Python 编写\"",
    "en-US": "Add language specification, e.g., \"Write in Python\""
  },
  "tags": ["code", "programming"]
}
```

### Example 2: Check for Specific Domain Requirements

For a company-specific requirement:

```json
{
  "code": "COMPANY_BRAND_VOICE_MISSING",
  "category": "consistency",
  "severity": "warning",
  "target": "prompt.content",
  "title": {
    "zh-CN": "未指定品牌声音",
    "en-US": "Brand voice not specified"
  },
  "description": {
    "zh-CN": "营销相关提示词应包含品牌声音指导",
    "en-US": "Marketing prompts should include brand voice guidelines"
  },
  "checks": [
    {
      "type": "must_include_any",
      "patterns": [
        "(?i)brand voice",
        "(?i)品牌声音",
        "(?i)tone:",
        "(?i)语气："
      ],
      "contextHint": {
        "keywords": ["marketing", "营销", "social media", "社交媒体", "email", "邮件"]
      }
    }
  ],
  "fixHint": {
    "zh-CN": "添加品牌声音指导，如 \"使用友好、专业的语气，符合我们的品牌形象\"",
    "en-US": "Add brand voice guidance, e.g., \"Use a friendly, professional tone aligned with our brand\""
  },
  "tags": ["marketing", "brand", "tone"]
}
```

### Example 3: Domain-Specific Vocabulary Check

Ensure medical prompts use appropriate terminology:

```json
{
  "code": "MEDICAL_DISCLAIMER_REQUIRED",
  "category": "constraints",
  "severity": "error",
  "target": "prompt.content",
  "title": {
    "zh-CN": "缺少医疗免责声明",
    "en-US": "Medical disclaimer required"
  },
  "description": {
    "zh-CN": "医疗健康相关提示词必须包含免责声明",
    "en-US": "Healthcare-related prompts must include a disclaimer"
  },
  "checks": [
    {
      "type": "must_include_any",
      "patterns": [
        "(?i)not a substitute for professional",
        "(?i)consult (?:a|your) (?:doctor|physician)",
        "(?i)仅供参考",
        "(?i)请咨询专业医生"
      ],
      "contextHint": {
        "keywords": ["medical", "health", "医疗", "健康", "诊断", "治疗", "药物"]
      }
    }
  ],
  "fixHint": {
    "zh-CN": "添加免责声明：\"本内容仅供参考，不能替代专业医疗建议，请咨询专业医生\"",
    "en-US": "Add disclaimer: \"This is for informational purposes only and is not a substitute for professional medical advice\""
  },
  "tags": ["medical", "safety", "compliance"]
}
```

## Advanced Features

### Auto-Fix Strategies

Some rules support automatic fixing. The `autoFix` field specifies the strategy:

**Available strategies**:

1. **`rename_placeholders`**: Normalize variable placeholder syntax
   ```json
   {
     "strategy": "rename_placeholders",
     "options": {
       "normalizeCase": "camel" | "snake" | "pascal"
     }
   }
   ```

2. **`insert_section`** (planned): Insert missing sections
3. **`reformat_output`** (planned): Restructure output format specifications

### Conditional Rules

Use `contextHint` to make rules conditional:

```json
{
  "checks": [
    {
      "type": "must_include_any",
      "patterns": ["pattern"],
      "contextHint": {
        "keywords": ["trigger_word"],
        "minKeywordMatches": 1
      }
    }
  ]
}
```

The rule only applies if at least one trigger keyword is found in the prompt.

## Rule Execution Flow

1. **Load config**: `loadLinterConfig()` reads and caches the JSON file
2. **For each rule**:
   - Check if rule applies (context hints)
   - Run checks against prompt content
   - If violation found, create issue object
3. **Generate summary**: Count issues by severity
4. **Return results**: Array of issues plus summary

**Code location**: `lib/linter/engine.ts`

## Localization

Rules support bilingual messages:
- `title`: Displayed in issue list header
- `description`: Detailed explanation
- `fixHint`: Actionable suggestion

The linter automatically selects the appropriate language based on the `locale` parameter passed to `lintPrompt()`.

**Fallback behavior**:
- If requested locale not found, falls back to English
- If English not found, uses the first available language

## Performance Considerations

### Rule Complexity

- **Simple patterns**: Very fast (regex match)
- **Complex patterns**: Slightly slower but still <10ms
- **Multiple patterns**: Linear time with pattern count

**Recommendation**: Keep pattern count under 10 per check for best performance.

### Debouncing

The PromptForm component debounces lint requests by 400ms to avoid excessive calls while typing.

### Caching

The linter config is cached in memory after first load. To reload:
```typescript
import { loadLinterConfig } from './lib/linter/config';
await loadLinterConfig(true); // force reload
```

## Best Practices

### 1. Progressive Enhancement

Start with error-level rules for critical issues, then add warnings and info suggestions.

### 2. Clear Messages

Write fix hints that are:
- **Specific**: "Add role definition at the start"
- **Actionable**: "Include output format specification"
- **Concise**: Keep under 120 characters

### 3. Avoid Over-Linting

Too many rules can overwhelm users. Aim for:
- 3-5 error rules
- 5-10 warning rules
- 5-10 info rules

### 4. Test Thoroughly

For each rule, test:
- ✅ Correct detection (triggers when it should)
- ✅ No false positives (doesn't trigger incorrectly)
- ✅ Edge cases (empty prompts, long prompts, special characters)

### 5. Provide Examples

The `examples` field helps users understand the rule:
```json
{
  "examples": {
    "bad": {
      "zh-CN": "帮我分析数据",
      "en-US": "Help me analyze data"
    },
    "good": {
      "zh-CN": "你是数据分析专家。任务：分析销售数据并生成报告",
      "en-US": "You are a data analyst. Task: Analyze sales data and generate a report"
    }
  }
}
```

## Troubleshooting

### Rule not triggering

**Possible causes**:
1. Pattern syntax error (test regex separately)
2. Case sensitivity (add `(?i)` for case-insensitive)
3. Context hint not matched
4. Config not reloaded (restart dev server)

**Debug**:
```typescript
const result = await lintPrompt(prompt, { locale: 'zh' });
console.log('Issues found:', result.issues.map(i => i.code));
```

### False positives

**Solutions**:
1. Refine patterns to be more specific
2. Add context hints to limit applicability
3. Adjust severity (error → warning → info)
4. Add negative lookahead patterns

### Performance issues

**If linting is slow**:
1. Check pattern complexity (avoid nested lookaheads)
2. Reduce number of patterns per check
3. Profile with `console.time()` around `lintPrompt()`

## Integration with Auto-Fix

Rules with clear fix strategies work best with the `/api/linter/fix` endpoint:

**Good for auto-fix**:
- Missing sections (role, task, constraints)
- Format inconsistencies
- Placeholder normalization

**Not suitable for auto-fix**:
- Subjective improvements
- Domain-specific content
- Creative decisions

The AI-powered fix endpoint uses the `fixHint` as guidance but may provide more comprehensive improvements.

## Extending the Engine

To add new check types, edit `lib/linter/engine.ts`:

```typescript
async function runCheck(
  check: RuleCheck,
  content: string,
  context: LintContext
): Promise<boolean> {
  if (check.type === 'your_new_check_type') {
    // Implement your logic
    return yourCheckFunction(content, check.options);
  }
  // ... existing types
}
```

Then use in rules:
```json
{
  "checks": [
    {
      "type": "your_new_check_type",
      "options": { /* custom options */ }
    }
  ]
}
```

## Version History

- **2025-10-20**: Initial release with 8 rules covering structure, context, constraints, format, and consistency
- Future versions will add domain-specific rule packs and community contributions

---

**Related Documentation**:
- [API Reference](./api-reference.md)
- [Template Format](./template-format.md)
- [Main README](../README.md)



