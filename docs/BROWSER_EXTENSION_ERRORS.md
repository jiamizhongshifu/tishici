# 浏览器扩展错误说明

## 问题描述

在开发环境中,浏览器控制台可能会显示大量来自浏览器扩展的错误信息:

```
Error: Attempting to use a disconnected port object
SecretSessionError: Called encrypt() without a session key
Failed to load resource: net::ERR_FILE_NOT_FOUND
```

## 错误来源

这些错误**不是应用代码的问题**,而是来自以下浏览器扩展:

1. **密码管理器** (1Password, Bitwarden, LastPass, Dashlane等)
2. **广告拦截器** (AdBlock, uBlock Origin等)
3. **其他浏览器扩展**

## 解决方案

### 方案1: 使用控制台过滤器 (推荐)

1. 打开浏览器开发者工具 (F12)
2. 切换到 **Console** 标签页
3. 点击右上角的 **过滤器** 图标 (漏斗图标)
4. 输入以下过滤规则:
   ```
   -background.js -content.js -extensionState.js -utils.js
   ```
5. 或者取消勾选 **"Extension errors"** 选项

### 方案2: 使用无痕模式测试

在无痕/隐私模式下打开应用(扩展默认不会运行):

- **Chrome/Edge**: `Ctrl+Shift+N` (Windows) 或 `Cmd+Shift+N` (Mac)
- **Firefox**: `Ctrl+Shift+P` (Windows) 或 `Cmd+Shift+P` (Mac)

### 方案3: 临时禁用扩展

1. 打开扩展管理页面:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Firefox: `about:addons`
2. 临时禁用所有扩展
3. 刷新应用页面

### 方案4: 使用代码屏蔽 (已集成)

项目已集成扩展错误屏蔽功能,在开发环境自动启用:

- 文件位置: `lib/suppressExtensionErrors.ts`
- 自动加载: 通过 `components/ExtensionErrorSuppressor.tsx` 组件

## 验证应用正常工作

如果你的应用功能正常运行,这些扩展错误可以安全忽略。

检查应用是否有**真实的错误**:
1. 查看控制台中是否有来自你自己代码的错误
2. 检查 Network 标签页是否有失败的请求
3. 测试应用的核心功能是否正常

## 常见问题

**Q: 这些错误会影响应用性能吗?**
A: 不会。这些是扩展内部的错误,不会影响你的应用。

**Q: 为什么会有这么多错误?**
A: 某些扩展(特别是密码管理器)会在每个页面上注入脚本,当页面快速刷新或导航时,扩展的通信端口可能断开,导致这些错误。

**Q: 可以永久解决吗?**
A: 这是浏览器扩展的问题,无法从应用层面永久解决。最佳方案是使用控制台过滤器或无痕模式进行开发调试。

## 相关资源

- [Chrome Extension Port Errors](https://developer.chrome.com/docs/extensions/develop/concepts/messaging#port-lifetime)
- [Console Filtering Guide](https://developer.chrome.com/docs/devtools/console/reference/#filter)
