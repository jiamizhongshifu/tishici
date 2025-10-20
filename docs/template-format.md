# Template Format Specification

Guide to creating and managing prompt templates in the Template Library.

## Overview

Templates are reusable prompt structures with customizable variables. They help users quickly create high-quality prompts without starting from scratch.

**Location**: `data/templates/`

**Supported categories**:
- `writing.json` - Content creation and copywriting
- `coding.json` - Development and code-related tasks
- `research.json` - Data analysis and research
- `drawing.json` - AI image generation and design
- `chat.json` - Conversational AI and chatbots

## Category File Structure

Each category file follows this structure:

```json
{
  "category": "string - Unique category identifier (lowercase, no spaces)",
  "label": {
    "en": "string - Display name in English",
    "zh": "string - Display name in Chinese"
  },
  "description": {
    "en": "string - Category description in English",
    "zh": "string - Category description in Chinese"
  },
  "templates": [
    // Array of template objects
  ]
}
```

### Example

```json
{
  "category": "writing",
  "label": {
    "en": "Writing",
    "zh": "文案创作"
  },
  "description": {
    "en": "Templates for content creation, copywriting, and documentation",
    "zh": "内容创作、文案撰写和文档编写的模板"
  },
  "templates": [ /* ... */ ]
}
```

## Template Object Structure

### Required Fields

```json
{
  "id": "string (required) - Unique template ID within category (kebab-case)",
  "title": {
    "en": "string (required) - Template name in English",
    "zh": "string (required) - Template name in Chinese"
  },
  "description": {
    "en": "string (required) - Brief description in English (1-2 sentences)",
    "zh": "string (required) - Brief description in Chinese (1-2 sentences)"
  },
  "content": {
    "en": "string (required) - Template content in English",
    "zh": "string (required) - Template content in Chinese"
  },
  "variables": [
    // Array of variable definitions
  ],
  "tags": [
    "string - Searchable tags (lowercase, hyphen-separated)"
  ]
}
```

### Variable Definition

```json
{
  "key": "string (required) - Variable name (snake_case or camelCase)",
  "label": {
    "en": "string (required) - Display label in English",
    "zh": "string (required) - Display label in Chinese"
  },
  "placeholder": {
    "en": "string (optional) - Placeholder text in English",
    "zh": "string (optional) - Placeholder text in Chinese"
  },
  "defaultValue": "string (optional) - Default value if not filled",
  "required": "boolean (optional) - Whether this variable is required, defaults to false"
}
```

## Variable Placeholders

### Syntax

Variables in template content use double curly braces:

```
{{variable_name}}
```

### Rules

1. **Naming**: Use `snake_case` or `camelCase` (consistent within template)
2. **Whitespace**: Spaces around variable names are allowed: `{{ var }}` = `{{var}}`
3. **Matching**: All placeholders in content must have corresponding variable definitions
4. **Validation**: The `fillTemplateVariables()` function validates and fills variables

### Example

**Template content**:
```
You are a {{role}} helping {{audience}}.

Task: {{task_description}}

Output format: {{output_format}}
```

**Variables**:
```json
[
  {
    "key": "role",
    "label": { "en": "AI Role", "zh": "AI 角色" },
    "required": true
  },
  {
    "key": "audience",
    "label": { "en": "Target Audience", "zh": "目标受众" },
    "required": true
  },
  {
    "key": "task_description",
    "label": { "en": "Task Description", "zh": "任务描述" },
    "required": true
  },
  {
    "key": "output_format",
    "label": { "en": "Output Format", "zh": "输出格式" },
    "defaultValue": "Markdown"
  }
]
```

## Template Content Guidelines

### Structure

A good template should include:

1. **Role definition**: Clear AI persona
   ```
   You are a [specific role] who [expertise/specialty].
   ```

2. **Context setup**: Background and variables
   ```
   Topic: {{topic}}
   Audience: {{audience}}
   Requirements: {{requirements}}
   ```

3. **Task description**: What to accomplish
   ```
   Task: Create a comprehensive [deliverable] that [objectives].
   ```

4. **Execution guidelines**: How to approach the task
   ```
   Approach:
   1. [Step 1]
   2. [Step 2]
   3. [Step 3]
   ```

5. **Constraints**: Rules and limitations
   ```
   Constraints:
   - [Constraint 1]
   - [Constraint 2]
   - Do not [restriction]
   ```

6. **Output format**: Expected structure
   ```
   Output format:
   ## Section 1
   ## Section 2
   ## Section 3
   ```

7. **Quality standards**: Success criteria
   ```
   Ensure:
   - [Quality criterion 1]
   - [Quality criterion 2]
   ```

### Best Practices

**DO**:
- ✅ Use clear, specific language
- ✅ Include concrete examples where helpful
- ✅ Specify output format explicitly
- ✅ Add constraints to prevent common errors
- ✅ Use variables for customizable parts
- ✅ Keep variables to 3-8 per template (sweet spot)
- ✅ Provide sensible default values
- ✅ Test with actual variable values

**DON'T**:
- ❌ Leave task objectives vague
- ❌ Use too many variables (>10)
- ❌ Forget to escape special characters in JSON
- ❌ Include hard-coded, user-specific information
- ❌ Make templates overly complex
- ❌ Duplicate variables across templates (consider reusability)

### Escaping Special Characters

**JSON string escaping**:
```json
{
  "content": {
    "en": "Use \"double quotes\" inside strings by escaping them",
    "zh": "在字符串中使用 \"双引号\" 时需要转义"
  }
}
```

**Common escapes**:
- `\"` - Double quote
- `\\` - Backslash
- `\n` - Newline
- `\t` - Tab

## Template Quality Checklist

Before adding a template, verify:

- [ ] Unique `id` within category
- [ ] Bilingual `title`, `description`, and `content`
- [ ] All content placeholders have variable definitions
- [ ] All variable definitions are used in content
- [ ] At least 2 relevant tags
- [ ] Clear role definition in content
- [ ] Explicit task description
- [ ] Output format specification
- [ ] Constraints or guidelines included
- [ ] No JSON syntax errors (test with `JSON.parse()`)
- [ ] Examples or sample output (if applicable)
- [ ] Appropriate variable `required` flags
- [ ] Sensible default values where applicable

## Variable UI Rendering

The `TemplatePicker` component automatically detects variable types and renders appropriate inputs:

**Text input** (default):
- Short variables (name, email, topic, etc.)

**Textarea** (multi-line):
- Variables containing: `content`, `description`, `code`, `sample`, `data`, `message`, `sources`, `constraints`

**Custom logic**: Defined in `components/TemplatePicker.tsx`

## Creating a New Template

### Step 1: Choose a Category

Decide which existing category fits best, or propose a new one.

### Step 2: Define the Template

Create the template object:

```json
{
  "id": "unique-template-id",
  "title": {
    "en": "Template Name",
    "zh": "模板名称"
  },
  "description": {
    "en": "What this template does",
    "zh": "这个模板的作用"
  },
  "content": {
    "en": "Full prompt content in English...",
    "zh": "完整的中文提示词内容..."
  },
  "variables": [
    {
      "key": "variable_name",
      "label": { "en": "Label", "zh": "标签" },
      "placeholder": { "en": "Hint", "zh": "提示" },
      "required": true
    }
  ],
  "tags": ["relevant", "searchable", "keywords"]
}
```

### Step 3: Add to Category File

Edit the appropriate file in `data/templates/` and add your template to the `templates` array.

### Step 4: Validate JSON

```bash
node -e "require('./data/templates/your-category.json'); console.log('Valid');"
```

### Step 5: Test in UI

1. Start dev server: `npm run dev`
2. Navigate to create prompt → Template mode
3. Select your category and template
4. Fill in variables
5. Verify the filled prompt looks correct

### Step 6: Write Tests

Add test cases to `tests/lib/templates.test.ts`:

```typescript
it('should load your-template-id template', () => {
  const template = getTemplate('category-name', 'your-template-id');
  expect(template).toBeTruthy();
  expect(template?.variables.length).toBeGreaterThan(0);
});
```

## Template Examples

### Minimal Template

```json
{
  "id": "simple-translator",
  "title": {
    "en": "Simple Translator",
    "zh": "简单翻译器"
  },
  "description": {
    "en": "Translate text between languages",
    "zh": "在语言之间翻译文本"
  },
  "content": {
    "en": "Translate the following text from {{source_language}} to {{target_language}}:\n\n{{text}}",
    "zh": "将以下文本从 {{source_language}} 翻译成 {{target_language}}：\n\n{{text}}"
  },
  "variables": [
    {
      "key": "source_language",
      "label": { "en": "Source Language", "zh": "源语言" },
      "required": true
    },
    {
      "key": "target_language",
      "label": { "en": "Target Language", "zh": "目标语言" },
      "required": true
    },
    {
      "key": "text",
      "label": { "en": "Text to Translate", "zh": "待翻译文本" },
      "required": true
    }
  ],
  "tags": ["translation", "language"]
}
```

### Comprehensive Template

```json
{
  "id": "comprehensive-analyzer",
  "title": {
    "en": "Data Analysis Expert",
    "zh": "数据分析专家"
  },
  "description": {
    "en": "Perform comprehensive data analysis with insights and recommendations",
    "zh": "执行全面的数据分析，提供洞察和建议"
  },
  "content": {
    "en": "You are an expert data analyst with {{years_experience}} years of experience in {{specialty}}.\n\nDataset: {{dataset_description}}\n\nAnalysis objective: {{objective}}\n\nTask:\n1. Examine the data structure and quality\n2. Calculate descriptive statistics\n3. Identify patterns, trends, and anomalies\n4. Answer the research question: {{research_question}}\n5. Provide actionable recommendations\n\nConstraints:\n- Use statistical rigor\n- Cite data points to support claims\n- Maintain objectivity\n- Note any limitations or assumptions\n- Keep analysis under {{word_limit}} words\n\nOutput format:\n## Executive Summary\n## Data Overview\n## Key Findings\n## Statistical Analysis\n## Insights & Recommendations\n## Methodology & Limitations\n\nVisualization suggestions:\n- Recommend charts/graphs to illustrate findings\n- Describe what each visualization should show",
    "zh": "你是一名拥有 {{years_experience}} 年经验的专业数据分析师，专长领域为 {{specialty}}。\n\n数据集：{{dataset_description}}\n\n分析目标：{{objective}}\n\n任务：\n1. 检查数据结构和质量\n2. 计算描述性统计\n3. 识别模式、趋势和异常\n4. 回答研究问题：{{research_question}}\n5. 提供可操作的建议\n\n约束条件：\n- 使用统计严谨性\n- 引用数据点支持论断\n- 保持客观性\n- 注明任何局限性或假设\n- 控制分析在 {{word_limit}} 字以内\n\n输出格式：\n## 执行摘要\n## 数据概览\n## 关键发现\n## 统计分析\n## 洞察与建议\n## 方法论与局限性\n\n可视化建议：\n- 推荐用于说明发现的图表\n- 描述每个可视化应显示什么"
  },
  "variables": [
    {
      "key": "years_experience",
      "label": { "en": "Years of Experience", "zh": "工作年限" },
      "placeholder": { "en": "e.g., 10", "zh": "例如：10" },
      "defaultValue": "5",
      "required": false
    },
    {
      "key": "specialty",
      "label": { "en": "Specialty Area", "zh": "专长领域" },
      "placeholder": { "en": "e.g., Financial analysis, Marketing analytics", "zh": "例如：财务分析、营销分析" },
      "required": true
    },
    {
      "key": "dataset_description",
      "label": { "en": "Dataset Description", "zh": "数据集描述" },
      "placeholder": { "en": "Describe the data structure, size, and source", "zh": "描述数据结构、大小和来源" },
      "required": true
    },
    {
      "key": "objective",
      "label": { "en": "Analysis Objective", "zh": "分析目标" },
      "required": true
    },
    {
      "key": "research_question",
      "label": { "en": "Research Question", "zh": "研究问题" },
      "required": true
    },
    {
      "key": "word_limit",
      "label": { "en": "Word Limit", "zh": "字数限制" },
      "defaultValue": "1000",
      "required": false
    }
  ],
  "tags": ["data-analysis", "statistics", "research", "insights"]
}
```

## Field Specifications

### `id`

**Format**: `kebab-case` (lowercase with hyphens)

**Requirements**:
- Unique within the category
- Descriptive of the template purpose
- 3-30 characters

**Examples**:
- ✅ `blog-post-writer`
- ✅ `code-review-assistant`
- ✅ `api-documentation`
- ❌ `template1` (not descriptive)
- ❌ `BlogPostWriter` (not kebab-case)

### `title`

**Format**: Bilingual object with `en` and `zh` keys

**Requirements**:
- Clear, concise (3-6 words)
- Describes what the template does
- Proper capitalization

**Examples**:
```json
{
  "en": "Blog Post Writer",
  "zh": "博客文章写手"
}
```

### `description`

**Format**: Bilingual object

**Requirements**:
- 1-2 sentences
- Explains template use case
- Action-oriented

**Examples**:
```json
{
  "en": "Generate engaging blog posts on any topic",
  "zh": "根据任何主题生成引人入胜的博客文章"
}
```

### `content`

**Format**: Bilingual object

**Requirements**:
- Complete, production-ready prompt
- Includes role, task, constraints, output format
- Uses `{{variable}}` syntax for placeholders
- 200-2000 characters (recommended)
- Must be valid JSON string (escape quotes, newlines)

**Structure recommendation**:
```
[Role definition]

[Context with variables]

[Task description]

[Guidelines/Requirements]

[Constraints]

[Output format]

[Examples if applicable]
```

**Character escaping**:
```json
{
  "content": {
    "en": "Use \\n for newlines.\nUse \\\" for quotes within the string.",
    "zh": "使用 \\n 表示换行。\\n使用 \\\" 表示字符串内的引号。"
  }
}
```

### `variables`

**Format**: Array of variable objects

**Requirements**:
- At least one variable (recommended)
- All content placeholders must be defined
- No unused variable definitions
- Logical ordering (required first, then optional)

**Variable types** (automatically detected in UI):

1. **Single-line text** (default):
   - Names, emails, topics, roles, etc.
   - Rendered as `<input type="text">`

2. **Multi-line text**:
   - Variables with keys containing: `content`, `description`, `code`, `sample`, `data`, `message`, `sources`, `constraints`
   - Rendered as `<textarea>`

### `tags`

**Format**: Array of strings

**Requirements**:
- Lowercase
- Hyphen-separated for multi-word tags
- 2-10 tags per template
- Relevant for search

**Examples**:
```json
["code-review", "quality", "best-practices", "debugging"]
```

**Categories**:
- Task type: `analysis`, `generation`, `review`, `translation`
- Domain: `marketing`, `development`, `research`, `design`
- Technique: `few-shot`, `chain-of-thought`, `structured-output`
- Audience: `beginners`, `experts`, `general`
- Format: `json`, `markdown`, `code`, `table`

## Localization

### Translation Guidelines

When translating:

1. **Preserve meaning**: Don't just translate literally
2. **Adapt examples**: Use culturally relevant examples
3. **Match tone**: Professional consistency across languages
4. **Preserve placeholders**: Keep `{{variables}}` unchanged
5. **Maintain structure**: Keep the same sections and ordering

### Example

**English**:
```
You are a marketing copywriter.

Create a compelling email campaign for {{product}}.

Constraints:
- Subject line under 50 characters
- Professional yet friendly tone
```

**Chinese** (good translation):
```
你是一名营销文案撰写专家。

为 {{product}} 创建一个引人注目的邮件营销活动。

约束条件：
- 主题行不超过 50 个字符
- 专业而友好的语气
```

## Testing Templates

### Unit Tests

In `tests/lib/templates.test.ts`:

```typescript
it('should load [template-id] template', () => {
  const template = getTemplate('[category]', '[template-id]');
  expect(template).toBeTruthy();
  expect(template?.id).toBe('[template-id]');
});

it('should have all variables declared in [template-id]', () => {
  const template = getTemplate('[category]', '[template-id]');
  const contentVars = extractTemplateVariables(template!.content.en);
  const declaredVars = template!.variables.map(v => v.key);
  
  contentVars.forEach(varName => {
    expect(declaredVars).toContain(varName);
  });
});
```

### Manual Testing

1. **Load template** in UI
2. **Fill variables** with realistic values
3. **Check filled content**:
   - All placeholders replaced?
   - Content makes sense?
   - No grammar errors?
4. **Run lint** on filled template
   - Should pass with few or no issues
5. **Optional: Run eval** to verify quality score

## Migration from Prompt Packs

If you have existing prompt packs to convert to templates:

### Step 1: Extract Core Prompt

Take the prompt content and identify variable parts.

**Original**:
```
You are a blog writer. Write a post about artificial intelligence for tech professionals in a professional tone.
```

**Templated**:
```
You are a blog writer. Write a post about {{topic}} for {{audience}} in a {{tone}} tone.
```

### Step 2: Create Variable Definitions

For each `{{variable}}`, create a definition:

```json
{
  "key": "topic",
  "label": { "en": "Topic", "zh": "主题" },
  "required": true
},
{
  "key": "audience",
  "label": { "en": "Audience", "zh": "受众" },
  "defaultValue": "general audience"
},
{
  "key": "tone",
  "label": { "en": "Tone", "zh": "语气" },
  "defaultValue": "professional"
}
```

### Step 3: Enhance Structure

Add missing elements following the template guidelines:
- Explicit constraints
- Output format specification
- Examples (if helpful)

### Step 4: Translate

Create the Chinese version, adapting culturally as needed.

### Step 5: Validate and Test

Run through the checklist and testing procedures.

## Advanced Features

### Nested Variables (Not Currently Supported)

Future enhancement: Allow variables to reference other variables.

```json
{
  "key": "full_name",
  "derivedFrom": ["first_name", "last_name"],
  "template": "{{first_name}} {{last_name}}"
}
```

### Conditional Sections (Planned)

Allow template sections to appear conditionally:

```json
{
  "key": "include_examples",
  "type": "boolean",
  "controls": {
    "section": "examples"
  }
}
```

### Variable Validation (Planned)

Add validation rules to variables:

```json
{
  "key": "email",
  "validation": {
    "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    "message": "Please enter a valid email address"
  }
}
```

## Template Library Statistics

Current templates (as of 2025-10-20):

| Category | Templates | Total Variables | Average Variables per Template |
|----------|-----------|----------------|-------------------------------|
| Writing | 4 | 16 | 4.0 |
| Coding | 4 | 10 | 2.5 |
| Research | 3 | 11 | 3.7 |
| Drawing | 3 | 9 | 3.0 |
| Chat | 4 | 15 | 3.8 |
| **Total** | **18** | **61** | **3.4** |

## Contribution Guidelines

### Adding Templates

1. **Propose first**: Open an issue describing the template
2. **Follow format**: Use this specification
3. **Quality over quantity**: One great template > three mediocre ones
4. **Test thoroughly**: Don't submit untested templates
5. **Provide examples**: Show filled template in your PR

### Quality Standards

Templates should:
- Score >80 when evaluated by `/api/eval/run`
- Pass all applicable lint rules
- Be immediately usable without modification
- Serve a clear, common use case

### Naming Conventions

- **Template IDs**: `action-noun` (e.g., `generate-report`, `analyze-data`)
- **Variable keys**: `snake_case` preferred
- **Tags**: existing tags when possible, new ones sparingly

## FAQ

**Q: Can I have templates in categories other than the 5 default ones?**

A: Yes! Add a new JSON file in `data/templates/` and import it in `lib/templates.ts`.

**Q: How many variables is too many?**

A: More than 8-10 variables can overwhelm users. Consider splitting into multiple templates or using optional variables with good defaults.

**Q: Can templates reference other templates?**

A: Not currently. Each template is independent.

**Q: How do I delete a template?**

A: Remove it from the JSON file and restart the dev server. Users who have created prompts from that template are unaffected.

**Q: Can users create custom templates?**

A: Not yet. This is a planned feature for future releases.

**Q: What if my template needs dynamic logic?**

A: Templates are static. For complex logic, consider using the Bootstrap API instead.

---

**Related Documentation**:
- [API Reference](./api-reference.md)
- [Linter Rules Guide](./linter-rules-guide.md)
- [Main README](../README.md)



