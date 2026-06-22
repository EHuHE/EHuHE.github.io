# He Hu Academic Homepage

Astro static site for the academic homepage and research notes of He Hu (胡禾). The site is designed for GitHub Pages and keeps the OpenReview verification information visible on the public homepage.

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

这个项目是纯静态 Astro 站点。除非明确需要后端服务，否则优先用 GitHub Pages、Cloudflare Pages 或 Vercel。

推荐顺序：

1. GitHub Pages：适合用户主页仓库 `EHuHE/EHuHE.github.io`，根路径为 `https://ehuhe.github.io/`。
2. Cloudflare Pages / Vercel：推送 GitHub 后自动构建，有 HTTPS 和 CDN，不需要运维服务器。
3. 云服务器 + Docker + Nginx：控制力最强，但维护成本最高。

### 托管静态平台

构建命令：

```bash
npm run build
```

输出目录：

```bash
dist
```

Vercel 可直接导入仓库部署，不需要 Astro Vercel adapter。Cloudflare Pages 也可直接连接 GitHub 仓库，选择 npm，构建命令 `npm run build`，输出目录 `dist`。

用户主页仓库部署时建议设置：

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
