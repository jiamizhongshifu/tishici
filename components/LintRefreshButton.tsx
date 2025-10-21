'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type LintRefreshButtonProps = {
  promptId: string;
  content: string;
  locale: 'zh' | 'en';
  refreshLabel: string;
  refreshingLabel: string;
};

export default function LintRefreshButton({
  promptId,
  content,
  locale,
  refreshLabel,
  refreshingLabel,
}: LintRefreshButtonProps) {
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    if (refreshing || !content.trim()) return;

    setRefreshing(true);
    try {
      // 调用 linter API 获取最新的体检结果
      const lintResponse = await fetch('/api/linter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: content, locale }),
      });

      if (!lintResponse.ok) {
        throw new Error('Lint failed');
      }

      const lintData = await lintResponse.json();

      // 更新数据库中的 lint_issues
      const updateResponse = await fetch('/api/prompts/update-lint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptId,
          lintIssues: lintData.lint_issues || [],
          summary: lintData.summary || {},
          generatedAt: new Date().toISOString(),
          configVersion: lintData.config_version || '1.0',
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Update failed');
      }

      // 刷新页面数据
      router.refresh();
    } catch (error) {
      console.error('Lint refresh error:', error);
      alert('体检失败，请重试');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleRefresh}
      disabled={refreshing || !content.trim()}
      className="btn-link"
      style={{
        fontSize: 12,
        padding: '4px 8px',
        opacity: refreshing ? 0.6 : 1,
      }}
    >
      {refreshing ? refreshingLabel : refreshLabel}
    </button>
  );
}
