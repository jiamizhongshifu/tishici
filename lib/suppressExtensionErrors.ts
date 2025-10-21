/**
 * 开发环境下屏蔽浏览器扩展错误
 * 这些错误来自第三方扩展,不影响应用功能
 */

export function suppressExtensionErrors() {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
    return;
  }

  // 保存原始的console.error
  const originalError = console.error;
  const originalWarn = console.warn;

  // 需要屏蔽的错误模式
  const suppressPatterns = [
    /background\.js/i,
    /content\.js/i,
    /extensionState\.js/i,
    /heuristicsRedefinitions\.js/i,
    /Attempting to use a disconnected port object/i,
    /SecretSessionError/i,
    /Called encrypt\(\) without a session key/i,
    /runtime\.lastError/i,
    /Could not establish connection/i,
    /The message port closed before a response was received/i,
  ];

  // 检查是否应该屏蔽错误
  const shouldSuppress = (args: any[]): boolean => {
    const message = args.join(' ');
    return suppressPatterns.some((pattern) => pattern.test(message));
  };

  // 重写console.error
  console.error = (...args: any[]) => {
    if (!shouldSuppress(args)) {
      originalError.apply(console, args);
    }
  };

  // 重写console.warn
  console.warn = (...args: any[]) => {
    if (!shouldSuppress(args)) {
      originalWarn.apply(console, args);
    }
  };

  // 全局错误处理
  window.addEventListener('error', (event) => {
    if (shouldSuppress([event.message, event.filename])) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  });

  // Promise未捕获错误处理
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && shouldSuppress([String(event.reason)])) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  console.log(
    '%c🛡️ Extension error suppression enabled',
    'color: #4CAF50; font-weight: bold;'
  );
}

// 在开发环境自动启用(如果需要)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // suppressExtensionErrors(); // 取消注释以自动启用
}
