# AI美术管线进度管理网站 - 部署指南

## 版本信息
- 当前版本：**V1.03**
- 部署日期：2026-04-07
- 数据模式：只读（使用打包的默认数据）

---

## 第一步：创建 GitHub 仓库

1. 打开 https://github.com/new
2. 仓库名称填写：`ai-progress-site`（或其他名称）
3. 选择 **Public**（公开）
4. **不要**勾选 "Add a README file"
5. 点击 **Create repository**

---

## 第二步：上传文件到 GitHub

### 方法一：使用 GitHub Desktop（推荐）

1. 下载安装 [GitHub Desktop](https://desktop.github.com/)
2. 打开 GitHub Desktop，登录你的 GitHub 账号
3. 点击 **File → Add Local Repository**
4. 选择文件夹：`C:\Users\gzliuyifeng\WorkBuddy\20260403153329\app`
5. 点击 **Create a Repository**
6. Repository name 填写：`ai-progress-site`
7. 点击 **Create Repository**
8. 点击 **Publish repository**
   - ✅ Keep this code private：**取消勾选**（保持公开）
9. 点击 **Publish Repository**

等待上传完成。

### 方法二：使用命令行

```bash
# 进入项目目录
cd C:\Users\gzliuyifeng\WorkBuddy\20260403153329\app

# 初始化 git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: AI美术管线进度管理网站 V1.03"

# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/ai-progress-site.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

---

## 第三步：在 Vercel 部署

1. 打开 https://vercel.com
2. 点击 **Sign Up** 或 **Log In**
3. 选择 **Continue with GitHub**
4. 授权 Vercel 访问你的 GitHub
5. 登录后，点击 **Add New → Project**
6. 在列表中找到 `ai-progress-site`，点击 **Import**
7. Framework Preset 会自动识别为 **Vite**
8. 点击 **Deploy**
9. 等待部署完成（约 1-2 分钟）

---

## 第四步：获取分享链接

部署完成后，Vercel 会给你一个链接，格式类似：
```
https://ai-progress-site-xxx.vercel.app
```

这个链接就是分享给别人的访问地址。

---

## 如何更新数据

如果需要更新网站数据：

1. 修改 `src/defaultData.ts` 文件中的 `DEFAULT_DATA`
2. 同时更新 `_exportedAt` 时间戳
3. 更新版本号（如 V1.03 → V1.04）
4. 提交并推送到 GitHub：
   ```bash
   git add .
   git commit -m "Update data to V1.04"
   git push
   ```
5. Vercel 会自动重新部署

---

## 文件清单

需要上传的核心文件：
```
app/
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── vercel.json
├── .gitignore
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── AIProgressDepartmentSite.tsx
    ├── defaultData.ts
    └── index.css
```

**不需要上传**：
- `node_modules/`（Vercel 会自动安装依赖）
- `dist/`（Vercel 会自动构建）
- `.env.local` 等本地配置文件

---

## 常见问题

### Q: 部署后打开是空白页？
A: 检查浏览器控制台是否有错误。可能是 `defaultData.ts` 格式问题。

### Q: 如何切换回开发模式（可编辑）？
A: 修改 `defaultData.ts` 中的 `USE_DEFAULT_DATA = false`，然后重新部署。

### Q: 如何绑定自定义域名？
A: 在 Vercel 项目设置中 → Domains → 添加你的域名。

---

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS
- xlsx（SheetJS）
