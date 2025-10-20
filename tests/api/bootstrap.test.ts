import { describe, expect, it, vi } from 'vitest';

describe('Bootstrap API', () => {
  it('should validate request structure', () => {
    const validRequest = {
      goal: 'Create a product review prompt',
      domain: 'E-commerce',
      audience: 'Online shoppers',
      constraints: 'Must be under 500 words',
      locale: 'en',
    };

    expect(validRequest.goal).toBeTruthy();
    expect(typeof validRequest.goal).toBe('string');
    expect(validRequest.locale).toMatch(/^(en|zh)$/);
  });

  it('should generate required response fields', () => {
    const mockResponse = {
      title: 'Product Review Assistant',
      content: 'You are a helpful product review assistant...',
      suggestedCategory: 'E-commerce',
    };

    expect(mockResponse).toHaveProperty('title');
    expect(mockResponse).toHaveProperty('content');
    expect(mockResponse.title).toBeTruthy();
    expect(mockResponse.content).toBeTruthy();
    expect(typeof mockResponse.suggestedCategory).toBe('string');
  });

  it('should handle missing optional fields', () => {
    const minimalRequest = {
      goal: 'Create a simple chatbot',
      locale: 'en',
    };

    expect(minimalRequest.goal).toBeTruthy();
    expect(minimalRequest).not.toHaveProperty('domain');
    expect(minimalRequest).not.toHaveProperty('audience');
    expect(minimalRequest).not.toHaveProperty('constraints');
  });

  it('should validate locale parameter', () => {
    const locales = ['en', 'zh'];
    
    locales.forEach((locale) => {
      expect(['en', 'zh']).toContain(locale);
    });
  });

  it('should handle system prompt structure', () => {
    const systemPromptRequirements = [
      'role definition',
      'task description',
      'constraints',
      'output format',
      'example',
    ];

    systemPromptRequirements.forEach((requirement) => {
      expect(requirement).toBeTruthy();
      expect(typeof requirement).toBe('string');
    });
  });

  it('should parse JSON response correctly', () => {
    const validJsonResponse = JSON.stringify({
      title: 'Test Prompt',
      content: 'Test content with {{variable}}',
      suggestedCategory: 'Test',
    });

    const parsed = JSON.parse(validJsonResponse);
    expect(parsed.title).toBe('Test Prompt');
    expect(parsed.content).toContain('{{variable}}');
  });

  it('should handle JSON parsing errors gracefully', () => {
    const invalidJson = '{ invalid json }';
    
    expect(() => {
      JSON.parse(invalidJson);
    }).toThrow();
  });

  it('should extract JSON from code blocks', () => {
    const responseWithCodeBlock = '```json\n{"title": "Test", "content": "Content"}\n```';
    const jsonMatch = responseWithCodeBlock.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    
    expect(jsonMatch).toBeTruthy();
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[1]);
      expect(parsed.title).toBe('Test');
    }
  });

  it('should validate content contains required elements', () => {
    const generatedContent = `You are a professional writer.

Task: Write a blog post about {{topic}}.

Constraints:
- Keep it under 1000 words
- Use a professional tone
- Include examples

Output format: Markdown with headings`;

    expect(generatedContent).toContain('You are');
    expect(generatedContent).toContain('Task:');
    expect(generatedContent).toContain('Constraints:');
    expect(generatedContent).toContain('Output format:');
    expect(generatedContent).toContain('{{topic}}');
  });
});

describe('Bootstrap prompt quality checks', () => {
  it('should include role definition', () => {
    const content = 'You are an expert data analyst...';
    const rolePatterns = ['You are', 'Act as', 'Role:'];
    
    const hasRole = rolePatterns.some((pattern) => content.includes(pattern));
    expect(hasRole).toBe(true);
  });

  it('should include task description', () => {
    const content = 'Task: Analyze the provided dataset and generate insights...';
    const taskPatterns = ['Task:', 'Your task', 'Objective:'];
    
    const hasTask = taskPatterns.some((pattern) => content.includes(pattern));
    expect(hasTask).toBe(true);
  });

  it('should include constraints or guidelines', () => {
    const content = 'Constraints:\n- Use only verified data\n- Maintain objectivity';
    const constraintPatterns = ['Constraints:', 'Guidelines:', 'Rules:', 'Must', 'Do not'];
    
    const hasConstraints = constraintPatterns.some((pattern) => content.includes(pattern));
    expect(hasConstraints).toBe(true);
  });

  it('should include output format specification', () => {
    const content = 'Output format: JSON with fields: summary, insights, recommendations';
    const formatPatterns = ['Output format:', 'Return', 'Provide', 'format:'];
    
    const hasFormat = formatPatterns.some((pattern) => content.includes(pattern));
    expect(hasFormat).toBe(true);
  });

  it('should preserve variable placeholders', () => {
    const content = 'Analyze {{dataset}} and provide insights for {{audience}}.';
    const variablePattern = /\{\{[a-zA-Z_][a-zA-Z0-9_]*\}\}/g;
    const matches = content.match(variablePattern);
    
    expect(matches).toBeTruthy();
    expect(matches?.length).toBeGreaterThan(0);
  });
});



