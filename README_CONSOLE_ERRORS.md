# 🛡️ 控制台错误屏蔽指南

## 快速解决方案

如果你在开发时看到大量浏览器扩展错误,使用以下**最快速**的方法:

### 🎯 推荐方法:浏览器控制台过滤

1. 按 `F12` 打开开发者工具
2. 在 Console 标签页,找到右上角的**过滤器输入框**
3. 输入以下内容并回车:

```
-background.js -content.js -SecretSessionError
```

**效果**: 立即隐藏所有扩展错误,只显示你的应用错误

---

## 其他解决方案

### 方法1: 无痕模式 (最干净)

```
Windows: Ctrl + Shift + N
Mac: Cmd + Shift + N
```

### 方法2: 代码屏蔽 (已集成)

项目已自动集成错误屏蔽功能:

- ✅ 自动在开发环境启用
- ✅ 不影响生产环境
- ✅ 只屏蔽扩展错误,保留应用错误

**位置**: `components/ExtensionErrorSuppressor.tsx`

### 方法3: 临时禁用扩展

访问 `chrome://extensions/` 临时禁用所有扩展

---

## 为什么会有这些错误?

这些错误来自**浏览器扩展**(如密码管理器、广告拦截器),不是你的代码问题:

| 错误信息 | 来源 |
|---------|------|
| `Attempting to use a disconnected port object` | 扩展端口通信断开 |
| `SecretSessionError` | 密码管理器扩展 |
| `Failed to load resource: net::ERR_FILE_NOT_FOUND` | 扩展资源加载失败 |

**重要**: 这些错误**完全不影响**你的应用功能!

---

## 验证应用是否正常

### ✅ 正常标志:

- 页面能正常加载和显示
- 所有功能(登录、创建、编辑等)正常工作
- Network 标签没有失败的API请求
- 没有来自 `app/` 或 `components/` 目录的错误

### ❌ 需要关注的错误:

- 来自你的代码文件的错误 (如 `app/page.tsx`)
- API请求失败 (状态码 4xx, 5xx)
- React 渲染错误
- TypeScript 类型错误

---

## 技术细节

详细说明请查看: [`docs/BROWSER_EXTENSION_ERRORS.md`](./docs/BROWSER_EXTENSION_ERRORS.md)

---

## 快速参考命令

```bash
# 验证应用编译无误
npm run build

# 启动开发服务器
npm run dev

# TypeScript类型检查
npx tsc --noEmit
```

---

**记住**: 扩展错误 ≠ 应用错误。只要功能正常,可以安全忽略! 🚀
