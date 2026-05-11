# 安全修复指南 - 处理敏感信息泄露

## 紧急程度：HIGH

### 问题描述
`.env.example` 文件中包含了真实的 Supabase 项目密钥，已被提交并推送到 GitHub 远程仓库。

### 泄露的信息
- `NUXT_PUBLIC_SUPABASE_URL`
- `NUXT_PUBLIC_SUPABASE_ANON_KEY`
- `NUXT_SUPABASE_SERVICE_KEY`

---

## 完整操作步骤

### 阶段一：立即轮换密钥（必须立即执行！）

1. **访问 Supabase 控制台**
   - 打开：https://supabase.com/dashboard/project/[你的项目ID]/settings/api
   - 或访问：https://supabase.com/dashboard/projects

2. **重新生成 API 密钥**
   - 找到 `service_role` 密钥 → 点击 `Regenerate`
   - 找到 `anon public` 密钥 → 点击 `Regenerate`
   - **复制新密钥到安全位置**

3. **更新本地 .env 文件**
   - 使用新的密钥更新你的本地 `.env` 文件

### 阶段二：备份当前仓库（防止数据丢失）

```bash
cd /path/to/your/project
cd ..
tar -czf Nuxt_Mkdirs_backup_$(date +%Y%m%d_%H%M%S).tar.gz Nuxt_Mkdirs
echo "备份已创建!"
```

### 阶段三：从 Git 历史中彻底清除敏感文件

#### 方案 A：使用 git-filter-repo（推荐）

1. **安装 git-filter-repo**（如果尚未安装）
   ```bash
   # macOS (Homebrew)
   brew install git-filter-repo
   
   # Linux (Debian/Ubuntu)
   sudo apt install git-filter-repo
   
   # Windows (Git Bash)
   pip install git-filter-repo
   ```

2. **确保工作区干净**
   ```bash
   cd /path/to/your/project
   git add .
   git commit -m "temp: save current work before cleanup"
   ```

3. **从历史中删除 .env.example**
   ```bash
   git-filter-repo --invert-paths --path .env.example --force
   ```

4. **添加新的安全的 .env.example**
   ```bash
   # 已经创建好了，直接提交
   git add .env.example
   git commit -m "fix: add safe .env.example with placeholders"
   ```

#### 方案 B：使用 git filter-branch（备选方案）

```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.example" \
  --prune-empty --tag-name-filter cat -- --all
```

### 阶段四：强制推送到远程仓库

⚠️ **警告：这会永久修改远程仓库的历史记录！**

```bash
# 查看当前远程
git remote -v

# 强制推送所有分支
git push --force --all origin

# 强制推送所有标签
git push --force --tags origin
```

### 阶段五：通知团队成员

向所有协作者发送通知，包含以下内容：

1. 仓库历史已重写
2. 删除本地仓库并重新克隆
3. 使用新的 Supabase 密钥更新本地 .env 文件

```
团队成员操作指南：
1. cd ~
2. mv Nuxt_Mkdirs Nuxt_Mkdirs_old
3. git clone <repository-url> Nuxt_Mkdirs
4. cd Nuxt_Mkdirs
5. 从项目管理者获取新的 .env 配置
```

---

## 防止未来泄露的措施

### 1. 更新 .gitignore

确保以下内容在 `.gitignore` 中：
```
# Environment variables (never commit these!)
.env
.env.local
.env.*.local

# Editor files
.DS_Store
.vscode/
.idea/
*.swp
*.swo

# Build output
.nuxt/
.output/
dist/
node_modules/

# Logs
*.log
npm-debug.log*
```

### 2. 使用 git secrets（推荐）

```bash
# 安装
brew install git-secrets  # macOS
# 或访问 https://github.com/awslabs/git-secrets

# 初始化仓库
cd /path/to/your/project
git secrets --install
git secrets --register-aws

# 添加自定义规则
git secrets --add 'NUXT_SUPABASE_SERVICE_KEY=.*'
git secrets --add 'NUXT_PUBLIC_SUPABASE_ANON_KEY=.*'
git secrets --add 'NUXT_STRIPE_SECRET_KEY=.*'
git secrets --add 'NUXT_RESEND_API_KEY=.*'
git secrets --add 'NUXT_GOOGLE_AI_API_KEY=.*'
git secrets --add 'NUXT_DEEPSEEK_API_KEY=.*'
git secrets --add 'NUXT_OPENAI_API_KEY=.*'
```

### 3. 使用 Husky pre-commit hooks

```bash
npm install -D husky
npx husky install
npx husky add .husky/pre-commit
```

在 `.husky/pre-commit` 中添加：
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Check for accidentally committed env files
if git diff --cached --name-only | grep -qE '\.env$|\.env\.'; then
    echo "❌ 检测到环境变量文件被暂存！"
    echo "请确保不提交 .env 或包含真实密钥的 .env.example 文件。"
    echo "如果这是安全的示例文件，请运行: git commit --no-verify"
    exit 1
fi
```

---

## 认证迁移完成情况

✅ **已完成：**
1. 认证逻辑梳理
2. 认证 API 修改（使用 Supabase 自带用户系统）
3. 认证回调中间件优化
4. Admin 相关 API 更新
5. 数据库 Schema 更新
6. 安全的 .env.example 创建

📋 **下一步：**
1. 执行上述安全修复操作
2. 全面测试认证功能
3. 验证 Supabase OAuth（Google、GitHub）登录正常工作
4. 验证管理员权限检查

---

## 验证检查清单

- [ ] Supabase 密钥已轮换
- [ ] 本地 .env 文件已更新
- [ ] 仓库历史已清理
- [ ] 远程仓库已强制推送
- [ ] 团队已通知并同步
- [ ] .gitignore 已更新
- [ ] Git hooks 已配置（可选）
- [ ] 邮箱密码登录正常
- [ ] Google OAuth 登录正常
- [ ] GitHub OAuth 登录正常
- [ ] 邮箱验证自动登录正常
- [ ] 管理员权限检查正常
- [ ] 用户信息管理正常
