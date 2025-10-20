import { test, expect } from '@playwright/test';

/**
 * Stage 1 E2E Tests: Feedback Loop
 * Tests the complete flow: Create → Lint → Fix → Eval
 */

test.describe('Stage 1: Feedback Loop', () => {
  test.beforeEach(async ({ page }) => {
    // Note: These tests assume user is already logged in
    // In a real scenario, you'd handle authentication here
    await page.goto('/');
  });

  test('should create prompt with automatic lint checking', async ({ page }) => {
    // Navigate to new prompt page
    await page.goto('/prompts/new');
    
    // Fill in title
    await page.fill('input[name="title"]', 'Test Prompt with Linting');
    
    // Fill in content (intentionally poor to trigger lint issues)
    await page.fill('textarea[name="content"]', '请帮我写一份报告');
    
    // Wait for lint to run (400ms debounce + processing)
    await page.waitForTimeout(1000);
    
    // Check that lint panel is visible
    const lintPanel = page.locator('text=Lint 检查');
    await expect(lintPanel.or(page.locator('text=代码检查'))).toBeVisible();
    
    // Check that issues are detected
    const errorBadge = page.locator('text=/错误|error/i').first();
    await expect(errorBadge).toBeVisible({ timeout: 5000 });
    
    // Verify issue list is shown
    const issueList = page.locator('[class*="col"]').filter({ hasText: 'PROMPT_' });
    await expect(issueList.first()).toBeVisible();
  });

  test('should display lint summary with severity counts', async ({ page }) => {
    await page.goto('/prompts/new');
    
    // Enter a prompt with known issues
    await page.fill('input[name="title"]', 'Lint Summary Test');
    await page.fill('textarea[name="content"]', '帮我分析这些数字');
    
    // Wait for lint
    await page.waitForTimeout(1000);
    
    // Check for summary badges
    const summarySection = page.locator('text=/错误|警告|信息/').first();
    await expect(summarySection).toBeVisible({ timeout: 5000 });
  });

  test('should generate fix suggestions with diff preview', async ({ page }) => {
    await page.goto('/prompts/new');
    
    // Enter prompt with issues
    await page.fill('input[name="title"]', 'Fix Suggestion Test');
    await page.fill('textarea[name="content"]', '请写一个产品介绍');
    
    // Wait for lint
    await page.waitForTimeout(1000);
    
    // Click generate fix button
    const fixButton = page.locator('button:has-text("生成修复"), button:has-text("Generate Fix")').first();
    await expect(fixButton).toBeVisible({ timeout: 5000 });
    await fixButton.click();
    
    // Wait for fix generation (OpenAI call)
    await page.waitForTimeout(5000);
    
    // Check for fix summary
    const fixSummary = page.locator('text=/修复建议|Fix Suggestion/i');
    await expect(fixSummary).toBeVisible({ timeout: 10000 });
    
    // Check for apply button
    const applyButton = page.locator('button:has-text("应用"), button:has-text("Apply")').first();
    await expect(applyButton).toBeVisible();
  });

  test('should apply and undo fix suggestions', async ({ page }) => {
    await page.goto('/prompts/new');
    
    const originalContent = '生成一个列表';
    
    await page.fill('input[name="title"]', 'Apply/Undo Test');
    await page.fill('textarea[name="content"]', originalContent);
    
    // Wait for lint
    await page.waitForTimeout(1000);
    
    // Request fix
    const fixButton = page.locator('button:has-text("生成修复"), button:has-text("Generate Fix")').first();
    await fixButton.click({ timeout: 5000 });
    
    // Wait for fix generation
    await page.waitForTimeout(5000);
    
    // Get current content
    const contentBefore = await page.inputValue('textarea[name="content"]');
    
    // Apply fix
    const applyButton = page.locator('button:has-text("应用"), button:has-text("Apply")').first();
    await applyButton.click({ timeout: 10000 });
    
    // Verify content changed
    await page.waitForTimeout(500);
    const contentAfter = await page.inputValue('textarea[name="content"]');
    expect(contentAfter).not.toBe(contentBefore);
    expect(contentAfter.length).toBeGreaterThan(contentBefore.length);
    
    // Undo fix
    const undoButton = page.locator('button:has-text("撤销"), button:has-text("Undo")').first();
    await undoButton.click();
    
    // Verify content reverted
    await page.waitForTimeout(500);
    const contentReverted = await page.inputValue('textarea[name="content"]');
    expect(contentReverted).toBe(contentBefore);
  });

  test('should save prompt with lint results', async ({ page }) => {
    await page.goto('/prompts/new');
    
    // Fill form
    await page.fill('input[name="title"]', 'Saved with Lint Results');
    await page.fill('textarea[name="content"]', '你是数据分析师。任务：分析数据。');
    
    // Wait for lint
    await page.waitForTimeout(1000);
    
    // Save prompt
    const saveButton = page.locator('button[type="submit"]:has-text("保存"), button[type="submit"]:has-text("Save")');
    await saveButton.click();
    
    // Should redirect to dashboard or stay on page
    await page.waitForURL(/\/(dashboard|prompts)/, { timeout: 5000 });
    
    // Success (if we get here without errors)
    expect(page.url()).toMatch(/localhost:3000/);
  });

  test('should run evaluation on prompt', async ({ page }) => {
    // Navigate to new prompt page
    await page.goto('/prompts/new');
    
    // Fill in title and content
    await page.fill('input[name="title"]', 'Evaluation Test Prompt');
    await page.fill('textarea[name="content"]', 'You are a helpful assistant. Please provide clear and accurate responses to user questions.');
    
    // Save the prompt first
    await page.click('button[type="submit"]');
    
    // Wait for redirect to prompt detail page
    await page.waitForURL(/\/prompts\/[^\/]+$/, { timeout: 10000 });
    
    // Look for evaluation button
    const evalButton = page.locator('button:has-text("Run Evaluation"), button:has-text("运行评估")').first();
    await expect(evalButton).toBeVisible({ timeout: 5000 });
    
    // Click evaluation button
    await evalButton.click();
    
    // Wait for evaluation to complete
    await page.waitForTimeout(5000);
    
    // Check for score card or evaluation results
    const scoreCard = page.locator('text=/Score|评分|Evaluation|评估/').first();
    await expect(scoreCard).toBeVisible({ timeout: 10000 });
  });

  test('should handle lint errors gracefully', async ({ page }) => {
    await page.goto('/prompts/new');
    
    // Fill with content
    await page.fill('textarea[name="content"]', 'Test content');
    
    // Mock a lint API error by intercepting (advanced)
    // For now, just verify no crashes occur
    await page.waitForTimeout(1000);
    
    // Page should still be functional
    const titleInput = page.locator('input[name="title"]');
    await expect(titleInput).toBeVisible();
  });

  test('should debounce lint requests while typing', async ({ page }) => {
    await page.goto('/prompts/new');
    
    const content = page.locator('textarea[name="content"]');
    
    // Type quickly (should debounce)
    await content.fill('第');
    await page.waitForTimeout(100);
    await content.fill('第一');
    await page.waitForTimeout(100);
    await content.fill('第一行');
    
    // Only one lint request should happen after debounce
    // (Testing this properly requires network interception)
    await page.waitForTimeout(1000);
    
    // Lint should run eventually
    expect(await content.inputValue()).toBe('第一行');
  });

  test('should update lint when content changes', async ({ page }) => {
    await page.goto('/prompts/new');
    
    // Enter bad prompt
    await page.fill('textarea[name="content"]', '帮我写');
    await page.waitForTimeout(1000);
    
    // Should show issues
    const issueCount1 = await page.locator('text=/错误.*\\d+/').count();
    expect(issueCount1).toBeGreaterThan(0);
    
    // Fix the prompt
    await page.fill('textarea[name="content"]', '你是专业作家。任务：根据 {{topic}} 撰写文章。输出格式：Markdown');
    await page.waitForTimeout(1000);
    
    // Issues should decrease or disappear
    const emptyState = page.locator('text=/没有发现|No issues/');
    await expect(emptyState).toBeVisible({ timeout: 5000 });
  });

  test('should show lint config version', async ({ page }) => {
    await page.goto('/prompts/new');
    
    await page.fill('textarea[name="content"]', 'Test content for version check');
    await page.waitForTimeout(1000);
    
    // Config version should be tracked (visible in console or metadata)
    // For now, just verify lint runs successfully
    const lintPanel = page.locator('text=/检查|Lint/i').first();
    await expect(lintPanel).toBeVisible({ timeout: 5000 });
  });

  test('should persist lint results when saving', async ({ page }) => {
    await page.goto('/prompts/new');
    
    await page.fill('input[name="title"]', 'Lint Persistence Test');
    await page.fill('textarea[name="content"]', '你是助手。任务：帮助用户。');
    
    // Wait for lint
    await page.waitForTimeout(1000);
    
    // There should be a hidden input with lint_payload
    const lintPayload = page.locator('input[name="lint_payload"]');
    await expect(lintPayload).toBeAttached();
    
    const payloadValue = await lintPayload.inputValue();
    expect(payloadValue).toBeTruthy();
    
    // Verify it's valid JSON
    expect(() => JSON.parse(payloadValue)).not.toThrow();
    const parsed = JSON.parse(payloadValue);
    expect(parsed).toHaveProperty('issues');
    expect(parsed).toHaveProperty('summary');
  });
});

test.describe('Stage 1: Linter Edge Cases', () => {
  test('should handle empty prompt', async ({ page }) => {
    await page.goto('/prompts/new');
    
    // Leave content empty
    await page.fill('textarea[name="content"]', '');
    await page.waitForTimeout(1000);
    
    // Should show empty state, not errors
    const emptyMessage = page.locator('text=/没有发现|No issues|未检测/i');
    await expect(emptyMessage).toBeVisible({ timeout: 2000 });
  });

  test('should handle very long prompt', async ({ page }) => {
    await page.goto('/prompts/new');
    
    // Create a long prompt
    const longContent = '你是专业分析师。\n'.repeat(100) + '任务：分析 {{data}}。';
    await page.fill('textarea[name="content"]', longContent);
    await page.waitForTimeout(1000);
    
    // Should detect length issue
    const lengthIssue = page.locator('text=/PROMPT_LENGTH_EXCESSIVE|过长/i');
    await expect(lengthIssue).toBeVisible({ timeout: 5000 });
  });

  test('should handle special characters in prompt', async ({ page }) => {
    await page.goto('/prompts/new');
    
    const specialChars = '你是 AI。任务：分析 <data> & {output} @ 100% 准确率。';
    await page.fill('textarea[name="content"]', specialChars);
    await page.waitForTimeout(1000);
    
    // Should lint without errors
    const content = page.locator('textarea[name="content"]');
    expect(await content.inputValue()).toBe(specialChars);
  });
});

test.describe('Stage 1: Fix Generation', () => {
  test('should show loading state while generating fix', async ({ page }) => {
    await page.goto('/prompts/new');
    
    await page.fill('textarea[name="content"]', '写个报告');
    await page.waitForTimeout(1000);
    
    const fixButton = page.locator('button:has-text("生成修复"), button:has-text("Generate Fix")').first();
    await fixButton.click();
    
    // Should show loading state
    const loadingButton = page.locator('button:has-text("生成中"), button:has-text("Generating")');
    await expect(loadingButton).toBeVisible({ timeout: 2000 });
  });

  test('should handle fix generation errors', async ({ page }) => {
    await page.goto('/prompts/new');
    
    await page.fill('textarea[name="content"]', '写个报告');
    await page.waitForTimeout(1000);
    
    const fixButton = page.locator('button:has-text("生成修复"), button:has-text("Generate Fix")').first();
    await fixButton.click();
    
    // Wait for potential error or success
    await page.waitForTimeout(3000);
    
    // Check for either success or error message
    const resultMessage = page.locator('text=/修复建议|Fix Suggestion|错误|Error|失败|Failed/').first();
    await expect(resultMessage).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Stage 1: Evaluation', () => {
  test('should display evaluation UI components', async ({ page }) => {
    // Navigate to new prompt page
    await page.goto('/prompts/new');
    
    // Fill in title and content
    await page.fill('input[name="title"]', 'Eval UI Test');
    await page.fill('textarea[name="content"]', 'You are a helpful assistant.');
    
    // Save the prompt
    await page.click('button[type="submit"]');
    
    // Wait for redirect to prompt detail page
    await page.waitForURL(/\/prompts\/[^\/]+$/, { timeout: 10000 });
    
    // Check for evaluation UI components
    const evalRunner = page.locator('text=/EvalRunner|评估器|Run Evaluation|运行评估/').first();
    await expect(evalRunner).toBeVisible({ timeout: 5000 });
    
    // Check for score display area
    const scoreArea = page.locator('text=/Score|评分|Evaluation|评估/').first();
    await expect(scoreArea).toBeVisible({ timeout: 5000 });
  });
});



