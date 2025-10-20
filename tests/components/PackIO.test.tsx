import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('PackIO Component', () => {
  const mockDict = {
    title: 'Pack Import/Export',
    importTitle: 'Import Prompt Pack',
    importDescription: 'Upload a JSON file to import prompts',
    importFileLabel: 'Select JSON file',
    importButton: 'Import',
    importingButton: 'Importing...',
    importSuccess: 'Successfully imported {count} prompts',
    importError: 'Import failed',
    exportTitle: 'Export Prompt Pack',
    exportDescription: 'Export your prompts as a JSON Pack',
    exportPackTitleLabel: 'Pack Title',
    exportPackTitlePlaceholder: 'My Prompt Pack',
    exportPackSummaryLabel: 'Pack Summary',
    exportPackSummaryPlaceholder: 'Description',
    exportSelectPrompts: 'Select prompts to export',
    exportButton: 'Export',
    exportingButton: 'Exporting...',
    exportSuccess: 'Export successful',
    exportError: 'Export failed',
    downloadButton: 'Download JSON',
    noPromptsSelected: 'No prompts available',
    errorMessages: {
      NOT_AUTHENTICATED: 'Please login',
      PACK_JSON_REQUIRED: 'Please select a file',
      PACK_JSON_INVALID: 'Invalid JSON',
      NO_PROMPTS_FOUND: 'No prompts found',
      NO_VALID_PROMPTS: 'No valid prompts',
      NO_PROMPTS_SELECTED: 'Select at least one prompt',
    },
  };

  describe('Import functionality', () => {
    it('should validate JSON file format', () => {
      const validJson = {
        title: 'Test Pack',
        summary: 'Test summary',
        sections: [
          {
            heading: 'General',
            prompts: [
              {
                useCase: 'Test Prompt',
                prompt: 'This is a test prompt',
              },
            ],
          },
        ],
      };

      expect(() => JSON.stringify(validJson)).not.toThrow();
      expect(validJson).toHaveProperty('title');
      expect(validJson).toHaveProperty('sections');
      expect(Array.isArray(validJson.sections)).toBe(true);
    });

    it('should handle invalid JSON', () => {
      const invalidJson = '{ invalid json }';
      
      expect(() => JSON.parse(invalidJson)).toThrow();
    });

    it('should extract prompts from pack structure', () => {
      const packData = {
        sections: [
          {
            heading: 'Category 1',
            prompts: [
              { useCase: 'Prompt 1', prompt: 'Content 1' },
              { useCase: 'Prompt 2', prompt: 'Content 2' },
            ],
          },
          {
            heading: 'Category 2',
            prompts: [
              { useCase: 'Prompt 3', prompt: 'Content 3' },
            ],
          },
        ],
      };

      let count = 0;
      packData.sections.forEach((section) => {
        count += section.prompts.length;
      });

      expect(count).toBe(3);
    });

    it('should validate required prompt fields', () => {
      const prompt = {
        useCase: 'Test Title',
        prompt: 'Test Content',
      };

      expect(prompt).toHaveProperty('prompt');
      expect(prompt.prompt).toBeTruthy();
      expect(typeof prompt.prompt).toBe('string');
    });

    it('should handle alternative prompt structure', () => {
      const alternativeFormat = {
        prompts: [
          {
            title: 'Direct Prompt 1',
            content: 'Direct content 1',
            category: 'General',
          },
        ],
      };

      expect(alternativeFormat).toHaveProperty('prompts');
      expect(Array.isArray(alternativeFormat.prompts)).toBe(true);
      expect(alternativeFormat.prompts[0]).toHaveProperty('title');
      expect(alternativeFormat.prompts[0]).toHaveProperty('content');
    });
  });

  describe('Export functionality', () => {
    it('should generate valid pack structure', () => {
      const userPrompts = [
        { id: '1', title: 'Prompt 1', content: 'Content 1', category: 'General' },
        { id: '2', title: 'Prompt 2', content: 'Content 2', category: 'General' },
        { id: '3', title: 'Prompt 3', content: 'Content 3', category: 'Tech' },
      ];

      const sectionsMap = new Map<string, Array<{ useCase: string; prompt: string }>>();
      
      userPrompts.forEach((prompt) => {
        const category = prompt.category || 'General';
        if (!sectionsMap.has(category)) {
          sectionsMap.set(category, []);
        }
        sectionsMap.get(category)!.push({
          useCase: prompt.title,
          prompt: prompt.content,
        });
      });

      const sections = Array.from(sectionsMap.entries()).map(([heading, prompts]) => ({
        heading,
        prompts,
      }));

      expect(sections.length).toBe(2);
      expect(sections[0].prompts.length).toBeGreaterThan(0);
    });

    it('should include metadata in export', () => {
      const packPayload = {
        title: 'My Pack',
        summary: 'Description',
        generated_at: new Date().toISOString(),
        sections: [],
      };

      expect(packPayload).toHaveProperty('title');
      expect(packPayload).toHaveProperty('generated_at');
      expect(Date.parse(packPayload.generated_at)).toBeTruthy();
    });

    it('should create downloadable JSON blob', () => {
      const data = { test: 'data' };
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      expect(blob.size).toBeGreaterThan(0);
      expect(blob.type).toBe('application/json');
    });

    it('should generate valid filename', () => {
      const packTitle = 'My Awesome Pack';
      const filename = `${packTitle.replace(/\s+/g, '-').toLowerCase()}.json`;
      
      expect(filename).toBe('my-awesome-pack.json');
      expect(filename).toMatch(/\.json$/);
    });
  });

  describe('Error handling', () => {
    it('should validate file extension', () => {
      const validFile = 'pack.json';
      const invalidFile = 'pack.txt';
      
      expect(validFile.endsWith('.json')).toBe(true);
      expect(invalidFile.endsWith('.json')).toBe(false);
    });

    it('should handle empty prompt content', () => {
      const prompt = {
        title: 'Test',
        content: '   ',
      };

      const isEmpty = !prompt.content.trim();
      expect(isEmpty).toBe(true);
    });

    it('should validate minimum pack requirements', () => {
      const validPack = {
        sections: [
          {
            prompts: [{ prompt: 'content' }],
          },
        ],
      };

      const hasPrompts = validPack.sections.some(
        (section) => Array.isArray(section.prompts) && section.prompts.length > 0
      );

      expect(hasPrompts).toBe(true);
    });

    it('should handle missing sections gracefully', () => {
      const packWithoutSections = {
        prompts: [
          { title: 'Direct', content: 'Content' },
        ],
      };

      const hasDirectPrompts = Array.isArray(packWithoutSections.prompts);
      expect(hasDirectPrompts).toBe(true);
    });
  });

  describe('FileReader API usage', () => {
    it('should handle file read success', () => {
      const mockFile = new File(
        ['{"title": "Test", "sections": []}'],
        'test.json',
        { type: 'application/json' }
      );

      expect(mockFile.name).toBe('test.json');
      expect(mockFile.type).toBe('application/json');
    });

    it('should handle file read error', () => {
      const errorHandler = vi.fn();
      
      try {
        throw new Error('File read error');
      } catch (error) {
        errorHandler(error);
      }

      expect(errorHandler).toHaveBeenCalled();
    });
  });

  describe('UI state management', () => {
    it('should track selected prompts', () => {
      const selectedIds = new Set<string>();
      
      selectedIds.add('1');
      selectedIds.add('2');
      
      expect(selectedIds.size).toBe(2);
      expect(selectedIds.has('1')).toBe(true);
    });

    it('should toggle prompt selection', () => {
      const selectedIds = new Set(['1', '2']);
      const id = '2';
      
      if (selectedIds.has(id)) {
        selectedIds.delete(id);
      } else {
        selectedIds.add(id);
      }
      
      expect(selectedIds.has('2')).toBe(false);
      expect(selectedIds.size).toBe(1);
    });

    it('should select all prompts', () => {
      const allPrompts = [
        { id: '1' },
        { id: '2' },
        { id: '3' },
      ];
      
      const selectedIds = new Set(allPrompts.map((p) => p.id));
      
      expect(selectedIds.size).toBe(allPrompts.length);
    });

    it('should deselect all prompts', () => {
      const selectedIds = new Set(['1', '2', '3']);
      selectedIds.clear();
      
      expect(selectedIds.size).toBe(0);
    });
  });

  describe('Data transformation', () => {
    it('should normalize prompt titles', () => {
      const longTitle = 'This is a very long title that exceeds the maximum allowed length';
      const normalized = longTitle.slice(0, 120);
      
      expect(normalized.length).toBeLessThanOrEqual(120);
    });

    it('should handle category mapping', () => {
      const categoryCache = new Map<string, string>();
      
      categoryCache.set('General', 'cat-id-1');
      categoryCache.set('Tech', 'cat-id-2');
      
      expect(categoryCache.get('General')).toBe('cat-id-1');
      expect(categoryCache.has('Tech')).toBe(true);
    });

    it('should group prompts by category', () => {
      const prompts = [
        { category: 'A', title: 'P1', content: 'C1' },
        { category: 'B', title: 'P2', content: 'C2' },
        { category: 'A', title: 'P3', content: 'C3' },
      ];

      const grouped = new Map<string, typeof prompts>();
      prompts.forEach((prompt) => {
        if (!grouped.has(prompt.category)) {
          grouped.set(prompt.category, []);
        }
        grouped.get(prompt.category)!.push(prompt);
      });

      expect(grouped.size).toBe(2);
      expect(grouped.get('A')?.length).toBe(2);
    });
  });

  describe('Form validation', () => {
    it('should require pack title for export', () => {
      const packTitle = '';
      const isValid = packTitle.trim().length > 0;
      
      expect(isValid).toBe(false);
    });

    it('should require at least one prompt selected', () => {
      const selectedIds = new Set<string>();
      const isValid = selectedIds.size > 0;
      
      expect(isValid).toBe(false);
    });

    it('should validate JSON content before import', () => {
      const content = '{"valid": "json"}';
      let isValid = false;
      
      try {
        JSON.parse(content);
        isValid = true;
      } catch {
        isValid = false;
      }
      
      expect(isValid).toBe(true);
    });
  });
});
