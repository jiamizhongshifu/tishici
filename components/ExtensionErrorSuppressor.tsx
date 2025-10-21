'use client';

import { useEffect } from 'react';
import { suppressExtensionErrors } from '../lib/suppressExtensionErrors';

/**
 * 客户端组件,用于在开发环境下屏蔽浏览器扩展错误
 */
export default function ExtensionErrorSuppressor() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      suppressExtensionErrors();
    }
  }, []);

  return null; // 不渲染任何内容
}
