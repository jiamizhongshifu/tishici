'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

type AutoLintRefreshProps = {
  promptId: string;
  content: string;
  locale: 'zh' | 'en';
  hasLintSnapshot: boolean;
};

export default function AutoLintRefresh({
  promptId,
  content,
  locale,
  hasLintSnapshot,
}: AutoLintRefreshProps) {
  const router = useRouter();
  const hasRunRef = useRef(false);

  useEffect(() => {
    // 如果已经运行过或者已经有体检结果，则跳过
    if (hasRunRef.current || hasLintSnapshot) {
      return;
    }

    if (!content.trim()) {
      return;
    }

    hasRunRef.current = true;

    const runAutoLint = async () => {
      try {
        // 调用 linter API
        const lintResponse = await fetch('/api/linter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: content, locale }),
        });

        if (!lintResponse.ok) {
          console.error('Auto lint failed:', await lintResponse.text());
          return;
        }

        const lintData = await lintResponse.json();

        // 更新数据库
        const updateResponse = await fetch('/api/prompts/update-lint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            promptId,
            lintIssues: lintData.lint_issues || [],
            summary: lintData.summary || {},
            generatedAt: lintData.generated_at || new Date().toISOString(),
            configVersion: lintData.config_version || '1.0',
          }),
        });

        if (!updateResponse.ok) {
          console.error('Update lint failed:', await updateResponse.text());
          return;
        }

        // 刷新页面数据
        router.refresh();
      } catch (error) {
        console.error('Auto lint refresh error:', error);
      }
    };

    runAutoLint();
  }, [promptId, content, locale, hasLintSnapshot, router]);

  return null;
}
