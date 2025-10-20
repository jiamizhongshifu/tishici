import writingTemplates from '../data/templates/writing.json';
import codingTemplates from '../data/templates/coding.json';
import researchTemplates from '../data/templates/research.json';
import drawingTemplates from '../data/templates/drawing.json';
import chatTemplates from '../data/templates/chat.json';

export type TemplateVariable = {
  key: string;
  label: { en: string; zh: string };
  placeholder?: { en: string; zh: string };
  defaultValue?: string;
  required?: boolean;
};

export type PromptTemplate = {
  id: string;
  title: { en: string; zh: string };
  description: { en: string; zh: string };
  content: { en: string; zh: string };
  variables: TemplateVariable[];
  tags: string[];
};

export type TemplateCategory = {
  category: string;
  label: { en: string; zh: string };
  description: { en: string; zh: string };
  templates: PromptTemplate[];
};

const allCategories: TemplateCategory[] = [
  writingTemplates as TemplateCategory,
  codingTemplates as TemplateCategory,
  researchTemplates as TemplateCategory,
  drawingTemplates as TemplateCategory,
  chatTemplates as TemplateCategory,
];

export function getAllTemplateCategories(): TemplateCategory[] {
  return allCategories;
}

export function getTemplateCategory(categoryId: string): TemplateCategory | null {
  return allCategories.find((cat) => cat.category === categoryId) ?? null;
}

export function getTemplate(categoryId: string, templateId: string): PromptTemplate | null {
  const category = getTemplateCategory(categoryId);
  if (!category) return null;
  return category.templates.find((template) => template.id === templateId) ?? null;
}

export function searchTemplates(query: string): Array<{
  category: string;
  template: PromptTemplate;
}> {
  const lowerQuery = query.toLowerCase();
  const results: Array<{ category: string; template: PromptTemplate }> = [];

  for (const category of allCategories) {
    for (const template of category.templates) {
      const titleMatch =
        template.title.en.toLowerCase().includes(lowerQuery) ||
        template.title.zh.toLowerCase().includes(lowerQuery);
      const descMatch =
        template.description.en.toLowerCase().includes(lowerQuery) ||
        template.description.zh.toLowerCase().includes(lowerQuery);
      const tagMatch = template.tags.some((tag) => tag.toLowerCase().includes(lowerQuery));

      if (titleMatch || descMatch || tagMatch) {
        results.push({ category: category.category, template });
      }
    }
  }

  return results;
}

export function fillTemplateVariables(
  content: string,
  variables: Record<string, string>
): string {
  let result = content;

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    result = result.replace(regex, value || `{{${key}}}`);
  }

  return result;
}

export function extractTemplateVariables(content: string): string[] {
  const regex = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;
  const matches = content.matchAll(regex);
  const variables = new Set<string>();

  for (const match of matches) {
    if (match[1]) {
      variables.add(match[1]);
    }
  }

  return Array.from(variables);
}



