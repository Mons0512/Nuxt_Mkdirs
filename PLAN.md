# 项目后端改造计划 - 从 Sanity CMS 迁移至 Supabase

## 一、项目现状分析

### 1.1 技术栈概览

| 类别 | 技术 |
|------|------|
| 前端框架 | Nuxt 4.2.1 (Vue 3.5) |
| 后端 | Nuxt Server API (Nitro) |
| 当前 CMS | Sanity CMS (@nuxtjs/sanity) |
| 数据库 | Sanity (文档数据库) |
| 存储 | Sanity Asset Storage |
| 认证 | 自定义 Session + OAuth (Google/GitHub) |
| 支付 | Stripe / Creem |
| 邮件 | Resend |
| 部署 | Cloudflare Workers (NuxtHub) |

### 1.2 现有数据结构 (Sanity Schemas)

| 文档类型 | 用途 | 主要字段 |
|----------|------|----------|
| `item` | 导航站项目/网站 | name, slug, link, description, introduction, image, icon, featured, pricePlan, status, submitter, categories[], tags[], collections[] |
| `category` | 分类 | name, slug, description, group (ref), priority |
| `group` | 分组 | name, slug, description, priority |
| `tag` | 标签 | name, slug, description |
| `collection` | 集合 | name, slug, description, icon, priority |
| `blogPost` | 博客文章 | title, slug, excerpt, featured, body, image, author (ref), categories[], publishDate |
| `blogCategory` | 博客分类 | name, slug, description, priority |
| `user` | 用户 | name, email, password, image, role, provider, emailVerified |
| `account` | OAuth账户 | userId, type, provider, providerAccountId, tokens... |
| `verificationToken` | 邮箱验证Token | identifier, token, expires |
| `passwordResetToken` | 密码重置Token | identifier, token, expires |
| `order` | 订单 | user (ref), item (ref), status, date |
| `subscriber` | Newsletter订阅者 | email, status, source, subscribedAt |
| `page` | 静态页面 | title, slug, excerpt, body, publishDate |
| `settings` | 设置 | title |

### 1.3 现有 API 端点分析

**数据获取 API:**
- `/api/items` - 获取项目列表 (支持分页、筛选、搜索)
- `/api/items/[slug]` - 获取单个项目详情
- `/api/items/featured` - 获取精选项目
- `/api/items/latest` - 获取最新项目
- `/api/items/sponsor` - 获取赞助项目
- `/api/categories` - 获取分类列表
- `/api/categories/[slug]` - 获取单个分类
- `/api/collections` - 获取集合列表
- `/api/collections/[slug]` - 获取单个集合
- `/api/tags` - 获取标签列表
- `/api/tags/[slug]` - 获取单个标签
- `/api/groups` - 获取分组列表
- `/api/blog` - 获取博客文章列表
- `/api/blog/[slug]` - 获取博客文章详情
- `/api/blog/categories` - 获取博客分类
- `/api/blog/latest` - 获取最新博客

**用户相关 API:**
- `/api/auth/login` - 邮箱登录
- `/api/auth/register` - 用户注册
- `/api/auth/session` - 获取会话
- `/api/auth/signout` - 登出
- `/api/auth/callback/google` - Google OAuth回调
- `/api/auth/callback/github` - GitHub OAuth回调
- `/api/auth/settings` - 更新设置

**提交流程 API:**
- `/api/submit` - 提交新项目
- `/api/submissions` - 获取用户提交列表
- `/api/publish` - 发布项目
- `/api/unpublish` - 取消发布
- `/api/submit-to-review` - 提交审核

**支付相关 API:**
- `/api/checkout/create` - 创建 Stripe Checkout
- `/api/checkout` - Creem 支付
- `/api/webhooks/stripe` - Stripe Webhook
- `/api/webhooks/creem` - Creem Webhook

**其他 API:**
- `/api/newsletter/subscribe` - 订阅 Newsletter
- `/api/newsletter/unsubscribe` - 取消订阅
- `/api/upload-image` - 上传图片
- `/api/ai/analyze-website` - AI 分析网站
- `/api/admin/users` - 获取用户列表 (Admin)

---

## 二、Supabase 数据库设计

### 2.1 数据库表结构

```sql
-- 用户表 (基于 Supabase Auth + RLS 需求)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    email_verified TIMESTAMPTZ,
    image TEXT,
    role TEXT DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    provider TEXT,
    provider_id TEXT,
    password TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- OAuth 账户表
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    provider_account_id TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at BIGINT,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(provider, provider_account_id)
);

-- 验证 Token 表
CREATE TABLE verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 密码重置 Token 表
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session 表
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_token TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 分组表
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 分类表
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 标签表
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 集合表
CREATE TABLE collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon_url TEXT,
    icon_alt TEXT,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 项目表 (核心导航项目)
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    link TEXT,
    affiliate_link TEXT,
    description TEXT,
    introduction TEXT,
    image_url TEXT,
    image_alt TEXT,
    icon_url TEXT,
    icon_alt TEXT,
    featured BOOLEAN DEFAULT FALSE,
    sponsor BOOLEAN DEFAULT FALSE,
    sponsor_start_date TIMESTAMPTZ,
    sponsor_end_date TIMESTAMPTZ,
    publish_date TIMESTAMPTZ,
    price_plan TEXT DEFAULT 'free' CHECK (price_plan IN ('free', 'pro', 'sponsor')),
    free_plan_status TEXT DEFAULT 'submitting' CHECK (free_plan_status IN ('submitting', 'pending', 'approved', 'rejected')),
    pro_plan_status TEXT DEFAULT 'submitting' CHECK (pro_plan_status IN ('submitting', 'pending', 'success', 'failed')),
    sponsor_plan_status TEXT DEFAULT 'submitting' CHECK (sponsor_plan_status IN ('submitting', 'pending', 'success', 'failed')),
    rejection_reason TEXT,
    paid BOOLEAN DEFAULT FALSE,
    force_hidden BOOLEAN DEFAULT FALSE,
    note TEXT,
    submitter_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 项目-分类关联表
CREATE TABLE item_categories (
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (item_id, category_id)
);

-- 项目-标签关联表
CREATE TABLE item_tags (
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (item_id, tag_id)
);

-- 项目-集合关联表
CREATE TABLE item_collections (
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    PRIMARY KEY (item_id, collection_id)
);

-- 博客分类表
CREATE TABLE blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 博客文章表
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    featured BOOLEAN DEFAULT FALSE,
    body TEXT,
    image_url TEXT,
    image_alt TEXT,
    publish_date TIMESTAMPTZ,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 博客文章-分类关联表
CREATE TABLE blog_post_categories (
    blog_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    blog_category_id UUID NOT NULL REFERENCES blog_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_post_id, blog_category_id)
);

-- 博客文章关联表
CREATE TABLE blog_post_related (
    blog_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    related_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_post_id, related_post_id)
);

-- 订单表
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
    payment_provider TEXT,
    payment_id TEXT,
    amount DECIMAL(10, 2),
    currency TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 更新 items 表添加 order 引用
ALTER TABLE items ADD COLUMN order_id UUID REFERENCES orders(id) ON DELETE SET NULL;

-- Newsletter 订阅者表
CREATE TABLE subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
    source TEXT DEFAULT 'website',
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 静态页面表
CREATE TABLE pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    body TEXT,
    publish_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 设置表 (简化)
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.2 行级安全策略 (RLS)

Supabase Auth 与 RLS 深度集成，使用 `auth.uid()` 获取当前登录用户 ID。

```sql
-- Users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "Admins can update all users" ON users FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Items table
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published items" ON items FOR SELECT USING (
    publish_date IS NOT NULL AND force_hidden = FALSE
);
CREATE POLICY "Users can view own submissions" ON items FOR SELECT USING (
    submitter_id = auth.uid() OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "Authenticated users can create items" ON items FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own items" ON items FOR UPDATE USING (
    submitter_id = auth.uid() OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "Only admins can delete items" ON items FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Categories, Tags, Groups, Collections (public read)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

CREATE POLICY "Public read access" ON tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage tags" ON tags FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

CREATE POLICY "Public read access" ON groups FOR SELECT USING (true);
CREATE POLICY "Admins can manage groups" ON groups FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

CREATE POLICY "Public read access" ON collections FOR SELECT USING (true);
CREATE POLICY "Admins can manage collections" ON collections FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Blog posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published posts" ON blog_posts FOR SELECT USING (
    publish_date IS NOT NULL
);
CREATE POLICY "Authors can manage own posts" ON blog_posts FOR ALL USING (
    author_id = auth.uid() OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Blog categories (public read)
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON blog_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage blog categories" ON blog_categories FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Subscribers
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can subscribe" ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own subscription" ON subscribers FOR SELECT USING (
    email = (SELECT email FROM users WHERE id = auth.uid())
);
CREATE POLICY "Admins can manage subscribers" ON subscribers FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Pages (public read when published)
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON pages FOR SELECT USING (publish_date IS NOT NULL);
CREATE POLICY "Admins can manage pages" ON pages FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);
```

### 2.3 索引设计

```sql
-- 性能优化索引
CREATE INDEX idx_items_slug ON items(slug);
CREATE INDEX idx_items_publish_date ON items(publish_date) WHERE publish_date IS NOT NULL;
CREATE INDEX idx_items_featured ON items(featured) WHERE featured = TRUE;
CREATE INDEX idx_items_categories ON items(id) INCLUDE (categories);
CREATE INDEX idx_items_submitter ON items(submitter_id);
CREATE INDEX idx_items_price_plan ON items(price_plan);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_group ON categories(group_id);

CREATE INDEX idx_tags_slug ON tags(slug);

CREATE INDEX idx_collections_slug ON collections(slug);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_publish_date ON blog_posts(publish_date) WHERE publish_date IS NOT NULL;

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_item ON orders(item_id);

CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_status ON subscribers(status);

CREATE INDEX idx_users_email ON users(LOWER(email));
```

---

## 三、认证系统方案

### 3.1 确定采用 Supabase Auth

**决策：采用 Supabase Auth 作为认证系统**

Supabase Auth 提供完整的认证解决方案，与本项目改造深度契合：

| 认证功能 | 实现方式 |
|----------|----------|
| 邮箱/密码登录 | Supabase Auth `signInWithPassword()` |
| 用户注册 | Supabase Auth `signUp()` |
| OAuth 登录 (Google/GitHub) | Supabase Auth `signInWithOAuth()` |
| 邮箱验证 | Supabase Auth 内置邮件模板 |
| 密码重置 | Supabase Auth 内置邮件模板 |
| Session 管理 | Supabase Auth 自动管理 JWT refresh token |
| 权限控制 | Supabase RLS + `auth.uid()` |

### 3.2 技术优势

1. **RLS 无缝集成** - `auth.uid()` 可直接在行级安全策略中使用，实现细粒度权限控制
2. **代码简化** - 移除自定义 session、password hashing、token 管理代码
3. **安全可靠** - Supabase 自动处理 token 刷新、过期、安全更新
4. **功能完整** - OAuth (Google/GitHub)、邮箱验证、密码重置均已内置
5. **维护成本低** - 无需自行维护认证系统安全更新

### 3.3 与现有系统的差异

| 功能 | 现有实现 | 改造后 (Supabase Auth) |
|------|----------|------------------------|
| 登录方式 | 自定义 Session + Cookie | Supabase Auth JWT + Cookie |
| 密码验证 | bcryptjs 哈希 | Supabase Auth 内置 |
| OAuth | 手动实现回调 | `signInWithOAuth()` 自动处理 |
| 会话获取 | 自定义 base64 解码 | `getSession()` API |
| 邮箱验证 | 手动生成 token | Supabase Auth 邮件模板 |
| 权限检查 | 手动查库比对 | `auth.uid()` + RLS 自动控制 |

### 3.4 实施要点

- 用户角色 (role) 存储在 `public.users` 表中
- 管理员需在 Supabase Dashboard 或数据库中手动设置初始管理员账号
- 保持现有的 session cookie 机制 (`sb-access-token`)
- OAuth 回调使用 Supabase Auth 路由 (`/auth/v1/callback`)

---

## 四、改造实施计划

### 阶段一：Supabase 基础集成

1. **安装 Supabase 依赖**
   ```bash
   pnpm add @supabase/supabase-js @supabase/ssr
   ```

2. **创建 Supabase 客户端模块**
   - `server/utils/supabase.ts` - 服务器端 Supabase 客户端 (含 Admin 客户端)
   - `app/utils/supabase.ts` - 客户端 Supabase 客户端
   - `app/composables/useSupabase.ts` - Supabase 组合式函数

3. **执行数据库 SQL**
   - 创建所有表结构 (见 2.1)
   - 配置行级安全策略 (见 2.2)
   - 创建必要索引 (见 2.3)

4. **配置 Storage**
   - 配置 Supabase Storage buckets (images, icons)
   - 创建 `server/utils/storage.ts` 处理图片上传

### 阶段二：认证系统重构

1. **配置 Supabase Auth**
   - 在 Supabase Dashboard 配置 Email/Password 提供商
   - 配置 Google OAuth 提供商
   - 配置 GitHub OAuth 提供商
   - 配置邮件模板 (验证邮件、密码重置邮件)

2. **创建认证工具模块**
   - `server/utils/auth.ts` - 封装 Supabase Auth 操作
   - `server/middleware/auth.ts` - 认证中间件 (保护管理后台)

3. **更新认证 API**
   - `/api/auth/login` → 使用 `supabase.auth.signInWithPassword()`
   - `/api/auth/register` → 使用 `supabase.auth.signUp()`
   - `/api/auth/session` → 使用 `supabase.auth.getSession()`
   - `/api/auth/signout` → 使用 `supabase.auth.signOut()`
   - OAuth 回调 → 使用 Supabase Auth 路由

4. **同步用户角色**
   - 用户首次登录/注册时在 `users` 表创建角色记录
   - 初始管理员账号需手动在数据库设置

### 阶段三：数据层重构

1. **创建数据访问层 (DAL)**
   ```
   server/
   ├── utils/
   │   └── db/
   │       ├── users.ts
   │       ├── items.ts
   │       ├── categories.ts
   │       ├── tags.ts
   │       ├── collections.ts
   │       ├── groups.ts
   │       ├── blog-posts.ts
   │       ├── blog-categories.ts
   │       ├── orders.ts
   │       ├── subscribers.ts
   │       └── pages.ts
   ```

2. **迁移 API 端点**
   - 更新所有 `server/api/` 端点使用 Supabase
   - 保持 API 接口不变，只改变数据源

3. **实现图片上传/管理**
   - 替换 Sanity 图片上传到 Supabase Storage

### 阶段四：后台管理功能开发

1. **创建管理后台页面**
   ```
   app/
   └── pages/
       └── admin/
           ├── index.vue          # 管理首页
           ├── login.vue          # 管理员登录
           ├── items/
           │   ├── index.vue      # 项目列表
           │   ├── new.vue        # 新建项目
           │   └── [id].vue       # 编辑项目
           ├── categories.vue     # 分类管理
           ├── tags.vue          # 标签管理
           ├── collections.vue    # 集合管理
           ├── groups.vue         # 分组管理
           ├── blog/
           │   ├── posts.vue      # 博客文章
           │   └── categories.vue  # 博客分类
           ├── users.vue          # 用户管理
           ├── orders.vue         # 订单管理
           ├── subscribers.vue    # 订阅者管理
           └── settings.vue       # 网站设置
   ```

2. **创建管理后台组件**
   ```
   app/
   └── components/
       └── admin/
           ├── Sidebar.vue
           ├── Header.vue
           ├── DataTable.vue
           ├── ItemForm.vue
           ├── CategoryForm.vue
           └── ...
   ```

3. **实现管理后台 API**
   ```
   server/
   └── api/
       └── admin/
           ├── items/
           │   ├── index.get.ts
           │   ├── index.post.ts
           │   ├── [id].get.ts
           │   ├── [id].put.ts
           │   └── [id].delete.ts
           ├── categories/
           ├── tags/
           ├── users/
           └── ...
   ```

### 阶段五：移除 Sanity 依赖

1. **移除 Sanity 相关包**
   ```bash
   pnpm remove @nuxtjs/sanity @sanity/image-url @sanity/uuid sanity
   ```

2. **删除 Sanity 相关文件**
   - 删除 `sanity/` 目录
   - 删除 `app/pages/studio/[...index].vue`
   - 删除 Sanity 配置

3. **更新 nuxt.config.ts**
   - 移除 `@nuxtjs/sanity` 模块
   - 移除 Sanity 相关配置

4. **更新环境变量**
   - 添加 Supabase 配置
   - 移除 Sanity 配置

---

## 五、关键实现细节

### 5.1 Supabase 客户端配置

```typescript
// server/utils/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { H3Event } from 'h3';

const config = useRuntimeConfig();

// 普通客户端 - 用于公开数据读取
export const supabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseAnonKey
);

// Admin 客户端 - 用于服务端敏感操作 (绕过 RLS)
export const supabaseAdmin = createClient(
  config.public.supabaseUrl,
  config.supabaseServiceKey
);

// 获取带认证的客户端
export async function getSupabase(event: H3Event) {
  const token = getCookie(event, 'sb-access-token');
  if (!token) {
    return supabase;
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return supabase;
  }

  return supabase;
}
```

### 5.2 图片上传处理

```typescript
// server/utils/storage.ts
import { supabaseAdmin } from './supabase';

export async function uploadImage(
  file: File,
  bucket: string = 'images',
  folder: string = ''
): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = folder ? `${folder}/${fileName}` : fileName;

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(filePath, file.buffer || file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
    return null;
  }

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
}

export async function deleteImage(url: string, bucket: string = 'images') {
  const fileName = url.split(`${bucket}/`).pop();
  if (!fileName) return;

  await supabaseAdmin.storage.from(bucket).remove([fileName]);
}
```

### 5.3 认证中间件

```typescript
// server/middleware/auth.ts
export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);

  // 管理后台路由保护
  if (url.pathname.startsWith('/admin') && !url.pathname.startsWith('/admin/login')) {
    const token = getCookie(event, 'sb-access-token');

    if (!token) {
      return sendRedirect(event, '/admin/login');
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      deleteCookie(event, 'sb-access-token');
      return sendRedirect(event, '/admin/login');
    }

    // 检查管理员权限
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'ADMIN') {
      throw createError({
        statusCode: 403,
        message: 'Access denied',
      });
    }

    event.context.user = user;
  }
});
```

### 5.4 认证工具模块

```typescript
// server/utils/auth.ts
import { supabaseAdmin } from './supabase';
import type { User } from '@supabase/supabase-js';

export interface UserWithRole {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: 'USER' | 'ADMIN';
}

// 获取当前用户
export async function getCurrentUser(token: string): Promise<UserWithRole | null> {
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) {
    return null;
  }

  const { data: profile } = await supabaseAdmin
    .from('users')
    .select('name, image, role')
    .eq('id', user.id)
    .single();

  return {
    id: user.id,
    email: user.email!,
    name: profile?.name || user.user_metadata?.name,
    image: profile?.image || user.user_metadata?.avatar_url,
    role: profile?.role || 'USER',
  };
}

// 创建或更新用户配置
export async function upsertUserProfile(
  userId: string,
  profile: { name?: string; image?: string; role?: string }
) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .upsert({
      id: userId,
      ...profile,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'id',
    });

  return { data, error };
}
```

---

## 六、环境变量更新

```bash
# Supabase
NUXT_PUBLIC_SUPABASE_URL=
NUXT_PUBLIC_SUPABASE_ANON_KEY=
NUXT_SUPABASE_SERVICE_KEY=

# 移除 Sanity
# NUXT_PUBLIC_SANITY_PROJECT_ID=
# NUXT_PUBLIC_SANITY_DATASET=
# NUXT_SANITY_API_TOKEN=

# 保留其他配置...
```

---

## 七、测试计划

### 7.1 单元测试

```bash
pnpm test:unit
```

- 数据库操作函数测试
- API 端点测试
- 认证流程测试

### 7.2 集成测试

```bash
pnpm test:integration
```

- 完整数据流测试
- 图片上传/删除测试
- 支付流程测试

### 7.3 E2E 测试

```bash
pnpm test:e2e
```

- 用户注册/登录流程 (邮箱 + OAuth)
- 项目提交/审核流程
- 后台管理功能

---

## 八、风险评估与缓解

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| API 兼容性问题 | 中 | 保持 API 接口不变，逐步替换 |
| 图片存储迁移 | 中 | 使用 URL 重定向或批量迁移脚本 |
| 性能下降 | 低 | 合理使用索引，优化查询 |
| 现有用户需重新登录 | 低 | 提供迁移说明 |

---

## 九、预期交付物

1. **Supabase 数据库 SQL 文件** - `supabase/schema.sql`
2. **Supabase 客户端模块** - `server/utils/supabase.ts`
3. **认证工具模块** - `server/utils/auth.ts`
4. **完整的数据访问层** - `server/utils/db/`
5. **更新后的所有 API 端点** - `server/api/`
6. **后台管理界面** - `app/pages/admin/`
7. **后台管理 API** - `server/api/admin/`
8. **移除 Sanity 后的干净项目**

---

**请确认以上计划是否可以执行。如需调整某些部分（例如优先实现某个功能、跳过某些步骤、或有特殊要求），请告知。确认后我将立即开始执行实施。**