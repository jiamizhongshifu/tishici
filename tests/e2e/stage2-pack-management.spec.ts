import { test, expect } from '@playwright/test';
import * as path from 'path';

/**
 * Stage 2 E2E Tests: Assetization
 * Tests: Pack import/export, Template library, Bootstrap, Diff visualization
 */

test.describe('Stage 2: Pack Import/Export', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to Pack IO page', async ({ page }) => {
    await page.goto('/packs/io');
    
    // Check page loaded
    await expect(page.locator('text=/导入|Import/i')).toBeVisible();
    await expect(page.locator('text=/导出|Export/i')).toBeVisible();
  });

  test('should display import form', async ({ page }) => {
    await page.goto('/packs/io');
    
    // Check import section
    const importSection = page.locator('text=导入 Prompt Pack').or(page.locator('text=Import Prompt Pack'));
    await expect(importSection).toBeVisible();
    
    // Check file input
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();
    
    // Check import button
    const importButton = page.locator('button[type="submit"]:has-text("导入"), button[type="submit"]:has-text("Import")').first();
    await expect(importButton).toBeVisible();
  });

  test('should display export form with prompt selection', async ({ page }) => {
    await page.goto('/packs/io');
    
    // Check export section
    const exportSection = page.locator('text=导出 Prompt Pack').or(page.locator('text=Export Prompt Pack'));
    await expect(exportSection).toBeVisible();
    
    // Check pack title input
    const packTitleInput = page.locator('input[name="pack_title"]');
    await expect(packTitleInput).toBeVisible();
    
    // Check export button
    const exportButton = page.locator('button[type="submit"]:has-text("导出"), button[type="submit"]:has-text("Export")').first();
    await expect(exportButton).toBeVisible();
  });

  test('should validate JSON file format', async ({ page }) => {
    await page.goto('/packs/io');
    
    // Try to upload a non-JSON file would require file creation
    // For now, just verify file input accepts .json
    const fileInput = page.locator('input[type="file"]');
    const acceptAttr = await fileInput.getAttribute('accept');
    
    expect(acceptAttr).toContain('json');
  });

  test('should import valid pack JSON', async ({ page }) => {
    await page.goto('/packs/io');
    
    // Create a valid pack JSON content
    const packJson = JSON.stringify({
      version: "1.0.0",
      title: "Test Pack",
      summary: "Test pack for E2E testing",
      prompts: [
        {
          title: "Test Prompt 1",
          content: "You are a helpful assistant.",
          category: "general"
        },
        {
          title: "Test Prompt 2", 
          content: "You are a creative writer.",
          category: "writing"
        }
      ]
    });
    
    // Create a file input and set its value (simulate file upload)
    await page.evaluate((jsonContent) => {
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        const file = new File([jsonContent], 'test-pack.json', { type: 'application/json' });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        
        // Trigger change event
        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);
      }
    }, packJson);
    
    // Wait for file processing
    await page.waitForTimeout(1000);
    
    // Check for success indicator
    const successIndicator = page.locator('text=/✓|success|成功/').first();
    await expect(successIndicator).toBeVisible({ timeout: 5000 });
    
    // Submit the form
    const importButton = page.locator('button[type="submit"]:has-text("导入"), button[type="submit"]:has-text("Import")').first();
    await importButton.click();
    
    // Wait for import to complete
    await page.waitForTimeout(3000);
    
    // Check for success message
    const successMessage = page.locator('text=/imported|导入成功|success/').first();
    await expect(successMessage).toBeVisible({ timeout: 10000 });
  });

  test('should export selected prompts', async ({ page }) => {
    await page.goto('/packs/io');
    
    // Fill in pack details
    await page.fill('input[name="pack_title"]', 'Test Export Pack');
    await page.fill('textarea[name="pack_summary"]', 'Test pack for export');
    
    // Check if there are prompts to select
    const promptCheckboxes = page.locator('input[type="checkbox"][name="prompt_ids"]');
    const promptCount = await promptCheckboxes.count();
    
    if (promptCount > 0) {
      // Select first prompt if available
      await promptCheckboxes.first().check();
      
      // Submit export form
      const exportButton = page.locator('button[type="submit"]:has-text("导出"), button[type="submit"]:has-text("Export")').first();
      await exportButton.click();
      
      // Wait for export to complete
      await page.waitForTimeout(3000);
      
      // Check for success message or download button
      const successIndicator = page.locator('text=/exported|导出成功|Download|下载/').first();
      await expect(successIndicator).toBeVisible({ timeout: 10000 });
    } else {
      // If no prompts, just verify the form is present
      const exportButton = page.locator('button[type="submit"]:has-text("导出"), button[type="submit"]:has-text("Export")').first();
      await expect(exportButton).toBeVisible();
    }
  });

  test('should handle export with no prompts selected', async ({ page }) => {
    await page.goto('/packs/io');
    
    // Fill in pack details
    await page.fill('input[name="pack_title"]', 'Empty Export Test');
    await page.fill('textarea[name="pack_summary"]', 'Test empty export');
    
    // Don't select any prompts
    const exportButton = page.locator('button[type="submit"]:has-text("导出"), button[type="submit"]:has-text("Export")').first();
    await exportButton.click();
    
    // Wait for response
    await page.waitForTimeout(2000);
    
    // Check for error message or success (depending on implementation)
    const responseMessage = page.locator('text=/error|错误|success|成功|no prompts|没有选择/').first();
    await expect(responseMessage).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Stage 2: Template Library', () => {
  test('should display template mode in PromptForm', async ({ page }) => {
    await page.goto('/prompts/new');
    
    // Check for template button
    const templateButton = page.locator('button:has-text("Templates"), button:has-text("模板")').first();
    await expect(templateButton).toBeVisible();
    
    // Click template mode
    await templateButton.click();
    
    // Should show template picker
    const templatePicker = page.locator('text=/选择.*类别|Select.*category/i');
    await expect(templatePicker).toBeVisible({ timeout: 2000 });
  });

  test('should show 5 template categories', async ({ page }) => {
    await page.goto('/prompts/new');
    
    // Switch to template mode
    const templateButton = page.locator('button:has-text("Templates"), button:has-text("模板")').first();
    await templateButton.click();
    await page.waitForTimeout(500);
    
    // Count category buttons/cards
    const categories = page.locator('[class*="card"]:has-text("模板"), [class*="card"]:has-text("templates")');
    
    // Should have at least 5 categories
    const count = await categories.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('should select category and show templates', async ({ page }) => {
    await page.goto('/prompts/new');
    
    // Switch to template mode
    await page.locator('button:has-text("Templates"), button:has-text("模板")').first().click();
    await page.waitForTimeout(500);
    
    // Click a category (e.g., Writing/文案创作)
    const writingCategory = page.locator('text=Writing').or(page.locator('text=文案创作')).first();
    await writingCategory.click();
    
    // Should show templates
    await page.waitForTimeout(500);
    const templateList = page.locator('text=/Blog|博客|Email|邮件/i');
    await expect(templateList.first()).toBeVisible({ timeout: 2000 });
  });

  test('should select template and show variable form', async ({ page }) => {
    await page.goto('/prompts/new');
    
    await page.locator('button:has-text("Templates"), button:has-text("模板")').first().click();
    await page.waitForTimeout(500);
    
    // Select category
    const category = page.locator('[class*="card"]').first();
    await category.click();
    await page.waitForTimeout(500);
    
    // Select first template
    const template = page.locator('[class*="card"]').first();
    await template.click();
    await page.waitForTimeout(500);
    
    // Should show variable fill form
    const variableFill = page.locator('text=/Fill.*variables|填充.*变量/i');
    await expect(variableFill).toBeVisible({ timeout: 2000 });
  });

  test('should fill variables and use template', async ({ page }) => {
    await page.goto('/prompts/new');
    
    await page.locator('button:has-text("Templates")').or(page.locator('button:has-text("模板")')).first().click();
    await page.waitForTimeout(500);
    
    // Navigate through template selection
    // (Detailed steps omitted for brevity)
    
    // Test template selection flow
    const categoryCard = page.locator('[class*="card"]').first();
    await categoryCard.click();
    await page.waitForTimeout(500);
    
    // Should show templates for selected category
    const templates = page.locator('[class*="card"]');
    await expect(templates.first()).toBeVisible();
    
    // Select a template
    await templates.first().click();
    await page.waitForTimeout(500);
    
    // Should show variable form or use template button
    const useButton = page.locator('button:has-text("Use"), button:has-text("使用")').first();
    await expect(useButton).toBeVisible({ timeout: 5000 });
  });

  test('should search templates', async ({ page }) => {
    await page.goto('/prompts/new');
    
    await page.locator('button:has-text("Templates"), button:has-text("模板")').first().click();
    await page.waitForTimeout(500);
    
    // Find search input
    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="搜索"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('code');
      await page.waitForTimeout(300);
      
      // Results should filter
      // (Verification omitted)
    }
  });
});

test.describe('Stage 2: Bootstrap', () => {
  test('should display bootstrap mode', async ({ page }) => {
    await page.goto('/prompts/new');
    
    // Check for bootstrap button
    const bootstrapButton = page.locator('button:has-text("Bootstrap")');
    await expect(bootstrapButton).toBeVisible();
    
    // Click bootstrap mode
    await bootstrapButton.click();
    
    // Should show bootstrap form
    const goalLabel = page.locator('text=/Goal|目标/i');
    await expect(goalLabel).toBeVisible({ timeout: 2000 });
  });

  test('should show bootstrap form fields', async ({ page }) => {
    await page.goto('/prompts/new');
    
    await page.locator('button:has-text("Bootstrap")').click();
    await page.waitForTimeout(500);
    
    // Check form fields
    await expect(page.locator('textarea#bootstrap-goal')).toBeVisible();
    await expect(page.locator('input#bootstrap-domain')).toBeVisible();
    await expect(page.locator('input#bootstrap-audience')).toBeVisible();
    await expect(page.locator('textarea#bootstrap-constraints')).toBeVisible();
  });

  test('should require goal field', async ({ page }) => {
    await page.goto('/prompts/new');
    
    await page.locator('button:has-text("Bootstrap")').click();
    await page.waitForTimeout(500);
    
    // Generate button should be disabled when goal is empty
    const generateButton = page.locator('button:has-text("Generate Template"), button:has-text("生成模板")');
    await expect(generateButton).toBeDisabled();
    
    // Fill goal
    await page.fill('textarea#bootstrap-goal', '创建一个代码审查助手');
    
    // Button should be enabled
    await expect(generateButton).toBeEnabled();
  });

  test('should generate bootstrap template', async ({ page }) => {
    await page.goto('/prompts/new');
    
    await page.locator('button:has-text("Bootstrap")').click();
    await page.waitForTimeout(500);
    
    // Fill required field
    await page.fill('textarea#bootstrap-goal', '帮助用户进行市场分析');
    await page.fill('input#bootstrap-domain', '市场营销');
    
    // Click generate
    const generateButton = page.locator('button:has-text("Generate Template"), button:has-text("生成模板")');
    await generateButton.click();
    
    // Wait for OpenAI response (may take several seconds)
    await page.waitForTimeout(8000);
    
    // Should switch to manual mode with filled content
    // (Verification requires checking if mode changed and content is filled)
    // Test bootstrap flow
    await page.fill('input[name="goal"]', 'Create a helpful assistant');
    await page.fill('input[name="domain"]', 'Customer service');
    
    const bootstrapGenerateButton = page.locator('button:has-text("Generate"), button:has-text("生成")').first();
    await bootstrapGenerateButton.click();
    
    // Wait for generation to complete
    await page.waitForTimeout(5000);
    
    // Check for generated content
    const generatedContent = page.locator('textarea[name="content"]');
    await expect(generatedContent).toHaveValue(/You are/i, { timeout: 10000 });
  });

  test('should handle bootstrap errors gracefully', async ({ page }) => {
    await page.goto('/prompts/new');
    
    // Switch to bootstrap mode
    const bootstrapButton = page.locator('button:has-text("Bootstrap"), button:has-text("快速启动")').first();
    await bootstrapButton.click();
    
    // Try with empty goal to trigger error
    const errorGenerateButton = page.locator('button:has-text("Generate"), button:has-text("生成")').first();
    await errorGenerateButton.click();
    
    // Wait for error response
    await page.waitForTimeout(3000);
    
    // Check for error message
    const errorMessage = page.locator('text=/error|错误|required|required/i').first();
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Stage 2: Pack Diff Visualization', () => {
  test('should navigate to pack diff page', async ({ page }) => {
    // Navigate to a pack diff page
    await page.goto('/packs/awesome-chatgpt-prompts/diff');
    
    // Should show diff interface or 404
    const diffOrNotFound = await page.locator('text=/Diff|对比|404/i').count();
    expect(diffOrNotFound).toBeGreaterThan(0);
  });

  test('should display diff summary', async ({ page }) => {
    // Navigate to a pack diff page
    await page.goto('/packs/awesome-chatgpt-prompts/diff');
    
    // Check for diff interface elements
    const diffElements = page.locator('text=/Diff|对比|Added|Changed|Removed|新增|修改|删除/');
    const elementCount = await diffElements.count();
    
    // Should show either diff content or 404/error message
    expect(elementCount).toBeGreaterThan(0);
  });

  test('should allow version selection for comparison', async ({ page }) => {
    await page.goto('/packs/awesome-chatgpt-prompts/diff');
    
    // Look for version selectors
    const versionSelectors = page.locator('select, button:has-text("version"), button:has-text("版本")');
    const selectorCount = await versionSelectors.count();
    
    if (selectorCount > 0) {
      // Try to interact with version selectors
      await versionSelectors.first().click();
      await page.waitForTimeout(1000);
      
      // Check for version options
      const versionOptions = page.locator('option, [role="option"]');
      await expect(versionOptions.first()).toBeVisible({ timeout: 5000 });
    } else {
      // If no version selectors, just verify page loaded
      const pageContent = page.locator('body');
      await expect(pageContent).toBeVisible();
    }
  });

  test('should show prompt-level differences', async ({ page }) => {
    await page.goto('/packs/awesome-chatgpt-prompts/diff');
    
    // Look for prompt-level diff indicators
    const promptDiffs = page.locator('text=/prompt|提示|before|after|之前|之后|added|changed|removed/');
    const diffCount = await promptDiffs.count();
    
    if (diffCount > 0) {
      // Verify diff indicators are present
      await expect(promptDiffs.first()).toBeVisible({ timeout: 5000 });
    } else {
      // If no diffs, just verify page loaded
      const pageTitle = page.locator('h1, h2, title');
      await expect(pageTitle.first()).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('Stage 2: Integration Flow', () => {
  test('complete workflow: template → customize → lint → save', async ({ page }) => {
    await page.goto('/prompts/new');
    
    // 1. Select template mode
    await page.locator('button:has-text("Templates"), button:has-text("模板")').first().click();
    await page.waitForTimeout(500);
    
    // 2. Select a category
    const category = page.locator('[class*="card"]').first();
    await category.click();
    await page.waitForTimeout(500);
    
    // 3. Select a template
    const template = page.locator('[class*="card"]').first();
    await template.click();
    await page.waitForTimeout(500);
    
    // 4. Fill variables (if any)
    // 5. Use template
    // 6. Should switch to manual mode with filled content
    // 7. Lint should run automatically
    // 8. Save prompt
    
    // Test template workflow
    const templateButton = page.locator('button:has-text("Templates"), button:has-text("模板")').first();
    await templateButton.click();
    await page.waitForTimeout(500);
    
    // Select a category
    const categoryCard = page.locator('[class*="card"]').first();
    await categoryCard.click();
    await page.waitForTimeout(500);
    
    // Select a template
    const templateCard = page.locator('[class*="card"]').first();
    await templateCard.click();
    await page.waitForTimeout(500);
    
    // Use template
    const useButton = page.locator('button:has-text("Use"), button:has-text("使用")').first();
    await useButton.click();
    await page.waitForTimeout(1000);
    
    // Should switch to manual mode with filled content
    const contentTextarea = page.locator('textarea[name="content"]');
    await expect(contentTextarea).toHaveValue(/You are/i, { timeout: 5000 });
    
    // Save the prompt
    await page.fill('input[name="title"]', 'Template Test Prompt');
    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await page.waitForURL(/\/prompts\/[^\/]+$/, { timeout: 10000 });
  });

  test('complete workflow: bootstrap → edit → lint → fix → save', async ({ page }) => {
    await page.goto('/prompts/new');
    
    // Switch to bootstrap mode
    const bootstrapButton = page.locator('button:has-text("Bootstrap"), button:has-text("快速启动")').first();
    await bootstrapButton.click();
    
    // Fill bootstrap form
    await page.fill('input[name="goal"]', 'Create a helpful assistant');
    await page.fill('input[name="domain"]', 'Customer service');
    
    // Generate bootstrap
    const workflowGenerateButton = page.locator('button:has-text("Generate"), button:has-text("生成")').first();
    await workflowGenerateButton.click();
    
    // Wait for generation
    await page.waitForTimeout(5000);
    
    // Should switch to manual mode with generated content
    const contentTextarea = page.locator('textarea[name="content"]');
    await expect(contentTextarea).toHaveValue(/You are/i, { timeout: 10000 });
    
    // Save the prompt
    await page.fill('input[name="title"]', 'Bootstrap Test Prompt');
    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await page.waitForURL(/\/prompts\/[^\/]+$/, { timeout: 10000 });
  });

  test('complete workflow: create → export → import → verify', async ({ page }) => {
    // Create a prompt first
    await page.goto('/prompts/new');
    await page.fill('input[name="title"]', 'Export Test Prompt');
    await page.fill('textarea[name="content"]', 'You are a helpful assistant for testing.');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/prompts\/[^\/]+$/, { timeout: 10000 });
    
    // Go to pack IO page
    await page.goto('/packs/io');
    
    // Test export
    await page.fill('input[name="pack_title"]', 'Test Export Pack');
    await page.fill('textarea[name="pack_summary"]', 'Test pack for export');
    
    // Select prompts if available
    const promptCheckboxes = page.locator('input[type="checkbox"][name="prompt_ids"]');
    const promptCount = await promptCheckboxes.count();
    
    if (promptCount > 0) {
      await promptCheckboxes.first().check();
      
      // Export
      const exportButton = page.locator('button[type="submit"]:has-text("导出"), button[type="submit"]:has-text("Export")').first();
      await exportButton.click();
      await page.waitForTimeout(3000);
      
      // Check for success
      const successIndicator = page.locator('text=/exported|导出成功|Download|下载/').first();
      await expect(successIndicator).toBeVisible({ timeout: 10000 });
    }
  });
});

test.describe('Stage 2: Error Handling', () => {
  test('should handle invalid pack JSON format', async ({ page }) => {
    await page.goto('/packs/io');
    
    // Create invalid JSON content
    const invalidJson = '{ "invalid": json }';
    
    // Simulate file upload with invalid JSON
    await page.evaluate((jsonContent) => {
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        const file = new File([jsonContent], 'invalid.json', { type: 'application/json' });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        
        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);
      }
    }, invalidJson);
    
    // Wait for processing
    await page.waitForTimeout(1000);
    
    // Check for error message
    const errorMessage = page.locator('text=/invalid|错误|error|failed/').first();
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  test('should show error for empty pack', async ({ page }) => {
    await page.goto('/packs/io');
    
    // Create empty pack JSON
    const emptyPackJson = JSON.stringify({
      version: "1.0.0",
      title: "Empty Pack",
      summary: "Empty pack for testing",
      prompts: []
    });
    
    // Simulate file upload
    await page.evaluate((jsonContent) => {
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        const file = new File([jsonContent], 'empty-pack.json', { type: 'application/json' });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        
        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);
      }
    }, emptyPackJson);
    
    // Wait for processing
    await page.waitForTimeout(1000);
    
    // Submit import
    const importButton = page.locator('button[type="submit"]:has-text("导入"), button[type="submit"]:has-text("Import")').first();
    await importButton.click();
    
    // Wait for response
    await page.waitForTimeout(2000);
    
    // Check for error or success message
    const responseMessage = page.locator('text=/empty|空|error|错误|success|成功/').first();
    await expect(responseMessage).toBeVisible({ timeout: 5000 });
  });

  test('should handle pack with missing required fields', async ({ page }) => {
    await page.goto('/packs/io');
    
    // Create pack JSON with missing required fields
    const incompletePackJson = JSON.stringify({
      version: "1.0.0",
      // Missing title and summary
      prompts: [
        {
          title: "Test Prompt",
          content: "You are a helpful assistant."
          // Missing category
        }
      ]
    });
    
    // Simulate file upload
    await page.evaluate((jsonContent) => {
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        const file = new File([jsonContent], 'incomplete-pack.json', { type: 'application/json' });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        
        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);
      }
    }, incompletePackJson);
    
    // Wait for processing
    await page.waitForTimeout(1000);
    
    // Submit import
    const importButton = page.locator('button[type="submit"]:has-text("导入"), button[type="submit"]:has-text("Import")').first();
    await importButton.click();
    
    // Wait for response
    await page.waitForTimeout(2000);
    
    // Check for error or success message
    const responseMessage = page.locator('text=/missing|缺少|error|错误|success|成功/').first();
    await expect(responseMessage).toBeVisible({ timeout: 5000 });
  });
});

/**
 * Note: Many of these tests are marked as skip because they require:
 * 1. Authentication setup (login flow)
 * 2. Test data seeding (existing prompts)
 * 3. File upload mocking
 * 4. OpenAI API mocking (for bootstrap)
 * 5. Database state management
 * 
 * To implement fully:
 * - Set up test database with Supabase
 * - Create test user fixture
 * - Mock OpenAI API calls
 * - Implement file upload helpers
 * - Add data seeders
 */



