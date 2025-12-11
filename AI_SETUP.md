# AI 自动填充功能使用指南

## 功能概述

AI 自动填充功能可以帮助用户在提交网站时，自动提取和填充以下信息：

- ✅ **网站名称** - 从网页标题或 meta 标签提取
- ✅ **简短描述** - 1-2 句话的产品介绍
- ✅ **详细介绍** - 2-3 段 Markdown 格式的详细说明
- ✅ **Logo/图标** - 自动下载 favicon 并上传到 Sanity
- ✅ **主图** - 自动下载 OG Image 并上传到 Sanity
- 📝 **分类和标签建议** - AI 会分析并建议（需手动选择）

## 配置步骤

### 1. 选择 AI 提供商

项目支持三种 AI 提供商，选择其中一种即可：

#### 方案 A: Google Gemini（推荐）

**优点：** 免费额度高，速度快，中文支持好

1. 访问 [Google AI Studio](https://aistudio.google.com/apikey)
2. 点击 "Get API Key" 创建密钥
3. 复制 API Key

```bash
# .env 配置
NUXT_AI_PROVIDER=google
NUXT_GOOGLE_AI_API_KEY=your_google_ai_api_key
```

#### 方案 B: DeepSeek（国内推荐）

**优点：** 国内访问快，价格便宜，中文能力强

1. 访问 [DeepSeek 平台](https://platform.deepseek.com/api_keys)
2. 注册并创建 API Key
3. 复制 API Key

```bash
# .env 配置
NUXT_AI_PROVIDER=deepseek
NUXT_DEEPSEEK_API_KEY=your_deepseek_api_key
```

#### 方案 C: OpenAI

**优点：** 效果最好，但需要付费

1. 访问 [OpenAI Platform](https://platform.openai.com/settings/organization/api-keys)
2. 创建 API Key
3. 复制 API Key

```bash
# .env 配置
NUXT_AI_PROVIDER=openai
NUXT_OPENAI_API_KEY=your_openai_api_key
```

### 2. 启用功能

确保 `nuxt.config.ts` 中的功能开关已开启（默认已开启）：

```typescript
public: {
  supportAiSubmit: true,
}
```

### 3. 重启开发服务器

```bash
pnpm dev
```

## 使用方法

1. 访问提交页面 `/submit`
2. 在 **Link** 输入框中输入要提交的网站 URL
3. 点击右侧的 **"AI Auto-fill"** 按钮（带 ✨ 图标）
4. 等待 AI 分析（通常需要 5-15 秒）
5. 表单会自动填充提取的信息
6. 检查并调整自动填充的内容
7. 手动选择分类和标签
8. 点击提交

## 工作原理

```
用户输入 URL
    ↓
抓取网页内容 (cheerio)
    ↓
提取基础信息 (title, description, images)
    ↓
AI 分析内容 (Gemini/DeepSeek/OpenAI)
    ↓
下载图片并上传到 Sanity
    ↓
自动填充表单
```

## 技术架构

### 后端 API

- **`/api/ai/analyze-website`** - 主 API 端点
  - 接收网站 URL
  - 返回提取的元数据和图片资源

### 工具函数

- **`server/utils/scraper.ts`** - 网页抓取
  - 使用 `cheerio` 解析 HTML
  - 提取 meta 标签和图片 URL
  
- **`server/utils/ai.ts`** - AI 分析
  - 使用 Vercel AI SDK
  - 支持多个 AI 提供商
  
- **`server/utils/upload.ts`** - 图片上传
  - 下载远程图片
  - 上传到 Sanity CMS

## 常见问题

### Q: AI 分析失败怎么办？

**A:** 检查以下几点：
1. 确认 API Key 配置正确
2. 检查网络连接（国内用户使用 DeepSeek）
3. 确认目标网站可以正常访问
4. 查看控制台错误信息

### Q: 为什么有些网站无法提取信息？

**A:** 可能原因：
- 网站使用了反爬虫机制
- 网站是纯 JavaScript 渲染（SPA）
- 网站需要登录才能访问
- 网站的 meta 标签不完整

### Q: 如何提高提取准确度？

**A:** 建议：
- 选择内容丰富的网站
- 确保网站有完整的 meta 标签
- 使用 OpenAI 可获得更好的效果
- 提取后手动检查和调整

### Q: 费用如何计算？

**A:** 
- **Google Gemini**: 每月 60 次/分钟免费
- **DeepSeek**: 约 ¥0.001/次（非常便宜）
- **OpenAI**: 约 $0.01-0.02/次

## 安全建议

1. **不要泄露 API Key**
   - 不要将 `.env` 文件提交到 Git
   - 使用环境变量管理密钥

2. **设置使用限制**
   - 考虑添加频率限制
   - 监控 API 使用量

3. **验证用户输入**
   - 已内置 URL 格式验证
   - 防止恶意 URL 注入

## 开发调试

查看 AI 分析日志：

```bash
# 开发环境会在控制台输出详细日志
pnpm dev

# 测试 API
curl -X POST http://localhost:3000/api/ai/analyze-website \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

## 未来优化方向

- [ ] 支持更多 AI 模型（Claude, Llama 等）
- [ ] 智能匹配现有分类和标签
- [ ] 批量导入功能
- [ ] 支持 JavaScript 渲染的网站（使用 Puppeteer）
- [ ] 添加缓存机制减少 API 调用
- [ ] 多语言内容提取

---

如有问题，请查看项目文档或提交 Issue。
