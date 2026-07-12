# He Hu Academic Homepage

Astro static site for the academic homepage and research notes of He Hu (胡禾). The site is designed for GitHub Pages and keeps the OpenReview verification information visible on the public homepage.

Public URL: <https://ehuhe.github.io/>

## 开发

```bash
npm install
npm run dev
```

本地默认地址是 `http://127.0.0.1:4321`。

## 常用命令

```bash
npm run check
npm test
npm run build
npm run test:e2e
```

`astro build` 不会单独执行 TypeScript 检查，所以发布前至少运行 `npm run check && npm run build`。

## 内容维护

- Academic profile: update `src/lib/site.ts`
- Research notes: add `src/content/posts/*.md` or `*.mdx`
- Site resources: add `src/content/works/*.md`
- External links: add `src/content/links/*.md`
- Static assets: add files under `public/`

文章 frontmatter 示例：

```md
---
title: "Research note title"
description: "Brief summary"
pubDate: 2026-06-10
tags: ["Machine Learning", "Notes"]
featured: true
---
```

## 部署建议

这个项目是纯静态 Astro 站点。除非明确需要后端服务，否则优先用“域名 + 托管静态平台”，不需要单独购买云服务器。

推荐顺序：

1. Vercel / Cloudflare Pages + 自定义域名：推送 GitHub 后自动构建，有 HTTPS 和 CDN，维护成本最低。
2. GitHub Pages：适合用户主页仓库 `EHuHE/EHuHE.github.io`，根路径为 `https://ehuhe.github.io/`，也可以绑定自定义域名。
3. 云服务器 + Docker + Nginx：控制力最强，但需要长期维护系统、证书、反代和安全更新。

域名可以在阿里云、腾讯云、Cloudflare Registrar、Namecheap、NameSilo 等注册商购买。注册商只负责域名和 DNS，网站文件仍然部署到 Vercel / Cloudflare Pages / GitHub Pages。

### 托管静态平台

构建命令：

```bash
npm run build
```

输出目录：

```bash
dist
```

Vercel 可直接导入仓库部署。这个项目是静态 Astro 站点，不需要 `@astrojs/vercel` adapter；只有需要 Vercel Web Analytics、Image Optimization、SSR/按需渲染等平台特性时，才考虑添加 adapter。

Vercel 项目建议设置：

```bash
SITE_URL=https://你的域名
BASE_PATH=/
```

Framework Preset 选择 Astro，Build Command 使用 `npm run build`，Output Directory 使用 `dist`。Cloudflare Pages 也可直接连接 GitHub 仓库，选择 npm，构建命令 `npm run build`，输出目录 `dist`。

### 自定义域名 DNS

在 Vercel 项目的 Domains 页面添加域名后，按页面提示到域名注册商的 DNS 控制台添加记录：

- 根域名，例如 `example.com`：通常添加 `A` 记录。
- 子域名，例如 `www.example.com` 或 `blog.example.com`：通常添加 `CNAME` 记录。
- 如果域名已被其他 Vercel 账号使用：可能需要先添加 `TXT` 记录验证所有权。
- 如果使用通配符域名，例如 `*.example.com`：通常需要使用 nameservers 方式。

建议同时添加根域名和 `www` 域名，然后在 Vercel 中设置一个主域名并开启跳转，避免搜索引擎看到两个重复站点。

当前 GitHub Pages 用户主页部署时建议设置：

```bash
SITE_URL=https://ehuhe.github.io
BASE_PATH=/
```

GitHub Pages 项目页才需要类似：

```bash
SITE_URL=https://你的用户名.github.io
BASE_PATH=/仓库名/
```

如果部署到用户主页仓库或自定义域名，`BASE_PATH` 通常保持 `/`。

官方参考：

- [Astro deploy to Vercel](https://docs.astro.build/en/guides/deploy/vercel/)
- [Vercel Astro framework docs](https://vercel.com/docs/frameworks/frontend/astro)
- [Vercel custom domains](https://vercel.com/docs/domains/working-with-domains/add-a-domain)

### 云服务器 Docker 方案

服务器需要安装 Docker 和 Docker Compose。首次部署：

```bash
SITE_URL=https://你的域名 BASE_PATH=/ BLOG_PORT=8080 docker compose up -d --build
```

访问：

```text
http://服务器IP:8080
```

如果你已经有 Nginx/Caddy 负责 HTTPS，可以把域名反代到 `127.0.0.1:8080`。如果这台服务器只跑这个博客，也可以把 `BLOG_PORT=80`。

更新内容后：

```bash
git pull
SITE_URL=https://你的域名 BASE_PATH=/ BLOG_PORT=8080 docker compose up -d --build
```
