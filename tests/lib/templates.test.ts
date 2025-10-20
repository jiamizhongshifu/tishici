import { describe, expect, it } from 'vitest';
import {
  getAllTemplateCategories,
  getTemplateCategory,
  getTemplate,
  searchTemplates,
  fillTemplateVariables,
  extractTemplateVariables,
} from '../../lib/templates';

describe('Template Library', () => {
  describe('getAllTemplateCategories', () => {
    it('should return all template categories', () => {
      const categories = getAllTemplateCategories();
      
      expect(categories).toBeTruthy();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
    });

    it('should include expected categories', () => {
      const categories = getAllTemplateCategories();
      const categoryIds = categories.map((cat) => cat.category);
      
      expect(categoryIds).toContain('writing');
      expect(categoryIds).toContain('coding');
      expect(categoryIds).toContain('research');
      expect(categoryIds).toContain('drawing');
      expect(categoryIds).toContain('chat');
    });

    it('should have valid category structure', () => {
      const categories = getAllTemplateCategories();
      
      categories.forEach((category) => {
        expect(category).toHaveProperty('category');
        expect(category).toHaveProperty('label');
        expect(category).toHaveProperty('description');
        expect(category).toHaveProperty('templates');
        expect(category.label).toHaveProperty('en');
        expect(category.label).toHaveProperty('zh');
        expect(Array.isArray(category.templates)).toBe(true);
      });
    });
  });

  describe('getTemplateCategory', () => {
    it('should return category by id', () => {
      const category = getTemplateCategory('writing');
      
      expect(category).toBeTruthy();
      expect(category?.category).toBe('writing');
    });

    it('should return null for non-existent category', () => {
      const category = getTemplateCategory('non-existent');
      
      expect(category).toBeNull();
    });

    it('should return category with templates', () => {
      const category = getTemplateCategory('coding');
      
      expect(category).toBeTruthy();
      expect(category?.templates.length).toBeGreaterThan(0);
    });
  });

  describe('getTemplate', () => {
    it('should return template by category and id', () => {
      const categories = getAllTemplateCategories();
      const firstCategory = categories[0];
      const firstTemplate = firstCategory.templates[0];
      
      const template = getTemplate(firstCategory.category, firstTemplate.id);
      
      expect(template).toBeTruthy();
      expect(template?.id).toBe(firstTemplate.id);
    });

    it('should return null for non-existent template', () => {
      const template = getTemplate('writing', 'non-existent-template');
      
      expect(template).toBeNull();
    });

    it('should return null for non-existent category', () => {
      const template = getTemplate('non-existent', 'some-template');
      
      expect(template).toBeNull();
    });

    it('should return template with valid structure', () => {
      const template = getTemplate('writing', 'blog-post-writer');
      
      if (template) {
        expect(template).toHaveProperty('id');
        expect(template).toHaveProperty('title');
        expect(template).toHaveProperty('description');
        expect(template).toHaveProperty('content');
        expect(template).toHaveProperty('variables');
        expect(template).toHaveProperty('tags');
        expect(Array.isArray(template.variables)).toBe(true);
        expect(Array.isArray(template.tags)).toBe(true);
      }
    });
  });

  describe('searchTemplates', () => {
    it('should find templates by title', () => {
      const results = searchTemplates('blog');
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    it('should find templates by tag', () => {
      const results = searchTemplates('code');
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    it('should be case insensitive', () => {
      const lowerResults = searchTemplates('code');
      const upperResults = searchTemplates('CODE');
      
      expect(lowerResults.length).toBe(upperResults.length);
    });

    it('should return empty array for no matches', () => {
      const results = searchTemplates('xyzabc123nonexistent');
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });

    it('should return results with category info', () => {
      const results = searchTemplates('analysis');
      
      if (results.length > 0) {
        results.forEach((result) => {
          expect(result).toHaveProperty('category');
          expect(result).toHaveProperty('template');
          expect(typeof result.category).toBe('string');
        });
      }
    });
  });

  describe('fillTemplateVariables', () => {
    it('should replace variables with values', () => {
      const content = 'Hello {{name}}, welcome to {{place}}!';
      const variables = {
        name: 'Alice',
        place: 'Wonderland',
      };
      
      const result = fillTemplateVariables(content, variables);
      
      expect(result).toBe('Hello Alice, welcome to Wonderland!');
    });

    it('should handle multiple occurrences of same variable', () => {
      const content = '{{name}} is great. {{name}} is awesome.';
      const variables = { name: 'Bob' };
      
      const result = fillTemplateVariables(content, variables);
      
      expect(result).toBe('Bob is great. Bob is awesome.');
    });

    it('should leave unfilled variables as placeholders', () => {
      const content = 'Hello {{name}}, age {{age}}';
      const variables = { name: 'Charlie' };
      
      const result = fillTemplateVariables(content, variables);
      
      expect(result).toContain('Charlie');
      expect(result).toContain('{{age}}');
    });

    it('should handle empty variable values', () => {
      const content = 'Hello {{name}}!';
      const variables = { name: '' };
      
      const result = fillTemplateVariables(content, variables);
      
      expect(result).toBe('Hello {{name}}!');
    });

    it('should handle variables with whitespace', () => {
      const content = 'Value: {{ variable }}';
      const variables = { variable: 'test' };
      
      const result = fillTemplateVariables(content, variables);
      
      expect(result).toContain('test');
    });

    it('should not replace non-matching patterns', () => {
      const content = 'This {is} not a {{variable}}';
      const variables = { variable: 'value' };
      
      const result = fillTemplateVariables(content, variables);
      
      expect(result).toContain('value');
      expect(result).toContain('{is}');
    });
  });

  describe('extractTemplateVariables', () => {
    it('should extract variable names from content', () => {
      const content = 'Hello {{name}}, your age is {{age}}';
      
      const variables = extractTemplateVariables(content);
      
      expect(Array.isArray(variables)).toBe(true);
      expect(variables).toContain('name');
      expect(variables).toContain('age');
    });

    it('should return unique variable names', () => {
      const content = '{{var}} appears {{var}} twice';
      
      const variables = extractTemplateVariables(content);
      
      expect(variables.length).toBe(1);
      expect(variables[0]).toBe('var');
    });

    it('should handle content with no variables', () => {
      const content = 'This has no variables';
      
      const variables = extractTemplateVariables(content);
      
      expect(Array.isArray(variables)).toBe(true);
      expect(variables.length).toBe(0);
    });

    it('should handle snake_case variable names', () => {
      const content = 'Value: {{user_name}} and {{user_email}}';
      
      const variables = extractTemplateVariables(content);
      
      expect(variables).toContain('user_name');
      expect(variables).toContain('user_email');
    });

    it('should handle camelCase variable names', () => {
      const content = 'Value: {{userName}} and {{userEmail}}';
      
      const variables = extractTemplateVariables(content);
      
      expect(variables).toContain('userName');
      expect(variables).toContain('userEmail');
    });
  });

  describe('Template content quality', () => {
    it('should have all templates with bilingual content', () => {
      const categories = getAllTemplateCategories();
      
      categories.forEach((category) => {
        category.templates.forEach((template) => {
          expect(template.title).toHaveProperty('en');
          expect(template.title).toHaveProperty('zh');
          expect(template.description).toHaveProperty('en');
          expect(template.description).toHaveProperty('zh');
          expect(template.content).toHaveProperty('en');
          expect(template.content).toHaveProperty('zh');
        });
      });
    });

    it('should have all templates with at least one tag', () => {
      const categories = getAllTemplateCategories();
      
      categories.forEach((category) => {
        category.templates.forEach((template) => {
          expect(template.tags.length).toBeGreaterThan(0);
        });
      });
    });

    it('should have template variables match content placeholders', () => {
      const categories = getAllTemplateCategories();
      
      categories.forEach((category) => {
        category.templates.forEach((template) => {
          const declaredVars = template.variables.map((v) => v.key);
          const contentVars = extractTemplateVariables(template.content.en);
          
          // All content variables should be declared
          contentVars.forEach((varName) => {
            expect(declaredVars).toContain(varName);
          });
        });
      });
    });

    it('should have all variable labels in both languages', () => {
      const categories = getAllTemplateCategories();
      
      categories.forEach((category) => {
        category.templates.forEach((template) => {
          template.variables.forEach((variable) => {
            expect(variable.label).toHaveProperty('en');
            expect(variable.label).toHaveProperty('zh');
            expect(variable.label.en).toBeTruthy();
            expect(variable.label.zh).toBeTruthy();
          });
        });
      });
    });
  });

  describe('Template statistics', () => {
    it('should have at least 15 templates total', () => {
      const categories = getAllTemplateCategories();
      const totalTemplates = categories.reduce(
        (sum, category) => sum + category.templates.length,
        0
      );
      
      expect(totalTemplates).toBeGreaterThanOrEqual(15);
    });

    it('should have templates in all 5 categories', () => {
      const categories = getAllTemplateCategories();
      
      expect(categories.length).toBeGreaterThanOrEqual(5);
      
      categories.forEach((category) => {
        expect(category.templates.length).toBeGreaterThan(0);
      });
    });

    it('should have each category with 3-5 templates', () => {
      const categories = getAllTemplateCategories();
      
      categories.forEach((category) => {
        expect(category.templates.length).toBeGreaterThanOrEqual(3);
        expect(category.templates.length).toBeLessThanOrEqual(5);
      });
    });
  });
});



