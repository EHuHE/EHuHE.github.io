import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.dirname(scriptDir);
const sourceRoot =
  process.env.PAPER_LOG_SOURCE_ROOT ?? "/Users/snailsareverycow/Desktop/日志";
const postsDir = path.join(projectRoot, "src", "content", "posts");
const publicAssetDir = path.join(projectRoot, "public", "paper-log-assets");
const managedMarker = "<!-- paper-log-sync: managed -->";
const sourceFileName = "论文清单与阅读笔记.md";

function toPosixPath(value) {
  return value.split(path.sep).join("/");
}

function yamlString(value) {
  return JSON.stringify(value);
}

function getDateFromContent(content, folderName, sourcePath) {
  const headingMatch = content.match(/论文清单与阅读笔记（(\d{4})-(\d{1,2})-(\d{1,2})）/);

  if (headingMatch) {
    return [
      headingMatch[1],
      headingMatch[2].padStart(2, "0"),
      headingMatch[3].padStart(2, "0"),
    ].join("-");
  }

  const folderMatch = folderName.match(/^(\d{1,2})_(\d{1,2})$/);

  if (!folderMatch) {
    throw new Error(`无法从目录名推断日期：${sourcePath}`);
  }

  const year = new Date(fs.statSync(sourcePath).mtime).getFullYear();
  return [
    String(year),
    folderMatch[1].padStart(2, "0"),
    folderMatch[2].padStart(2, "0"),
  ].join("-");
}

function getDescription(content) {
  const countMatch = content.match(/已选篇目数[:：]\s*(\d+)\s*篇/);

  if (countMatch) {
    return `自动化论文精读日志，收录 ${countMatch[1]} 篇论文的阅读笔记、评分与复现风险。`;
  }

  return "自动化论文精读日志，记录论文监测、阅读笔记、评分与复现风险。";
}

function stripSourceTitle(content) {
  return content.replace(/^#\s+论文清单与阅读笔记[^\n]*\n+/, "");
}

function parseMarkdownTarget(rawTarget) {
  const target = rawTarget.trim();

  if (target.startsWith("<")) {
    const endIndex = target.indexOf(">");

    if (endIndex !== -1) {
      return {
        url: target.slice(1, endIndex),
        suffix: target.slice(endIndex + 1).trim(),
      };
    }
  }

  const match = target.match(/^(\S+)(\s+.*)?$/s);

  if (!match) {
    return null;
  }

  return {
    url: match[1],
    suffix: match[2]?.trim() ?? "",
  };
}

function isExternalTarget(url) {
  return /^(?:[a-z][a-z\d+.-]*:|#|\/)/i.test(url);
}

function rewriteImageLinks(content, sourceDir, isoDate) {
  return content.replace(/!\[([^\]]*)\]\(([^)\n]+)\)/g, (match, alt, rawTarget) => {
    const parsedTarget = parseMarkdownTarget(rawTarget);

    if (!parsedTarget || isExternalTarget(parsedTarget.url)) {
      return match;
    }

    const [urlWithoutHash] = parsedTarget.url.split("#");
    const [urlPath, queryString] = urlWithoutHash.split("?");
    let decodedUrlPath;

    try {
      decodedUrlPath = decodeURIComponent(urlPath);
    } catch {
      decodedUrlPath = urlPath;
    }

    const sourceAssetPath = path.resolve(sourceDir, decodedUrlPath);
    const sourceDirWithSeparator = `${path.resolve(sourceDir)}${path.sep}`;

    if (!sourceAssetPath.startsWith(sourceDirWithSeparator) || !fs.existsSync(sourceAssetPath)) {
      return match;
    }

    const relativeAssetPath = toPosixPath(path.relative(sourceDir, sourceAssetPath));
    const destinationPath = path.join(publicAssetDir, isoDate, relativeAssetPath);
    fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
    fs.copyFileSync(sourceAssetPath, destinationPath);

    const publicUrl = encodeURI(`../../paper-log-assets/${isoDate}/${relativeAssetPath}`);
    const publicTarget = `${publicUrl}${queryString ? `?${queryString}` : ""}`;
    const rebuiltTarget = parsedTarget.suffix
      ? `${publicTarget} ${parsedTarget.suffix}`
      : publicTarget;

    return `![${alt}](${rebuiltTarget})`;
  });
}

function getManagedPostBody(sourceContent, sourceDir, isoDate, sourceHash) {
  const rewrittenContent = rewriteImageLinks(stripSourceTitle(sourceContent), sourceDir, isoDate).trim();

  return [
    managedMarker,
    `<!-- paper-log-date: ${isoDate} -->`,
    `<!-- paper-log-source-hash: ${sourceHash} -->`,
    "",
    "> 本文由“每日论文精读与打分”自动化日志同步生成，用于保留每周论文监测、阅读笔记与复现风险记录。",
    "",
    rewrittenContent,
    "",
  ].join("\n");
}

function getPostContent(sourceContent, sourceDir, isoDate, sourceHash) {
  const title = `论文精读日志：${isoDate}`;
  const description = getDescription(sourceContent);
  const body = getManagedPostBody(sourceContent, sourceDir, isoDate, sourceHash);

  return [
    "---",
    `title: ${yamlString(title)}`,
    `description: ${yamlString(description)}`,
    `pubDate: ${isoDate}`,
    'tags: ["论文精读", "自动化", "研究日志"]',
    "featured: false",
    "---",
    "",
    body,
  ].join("\n");
}

function getSourceFiles() {
  if (!fs.existsSync(sourceRoot)) {
    throw new Error(`日志目录不存在：${sourceRoot}`);
  }

  return fs
    .readdirSync(sourceRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{1,2}_\d{1,2}$/.test(entry.name))
    .map((entry) => {
      const sourcePath = path.join(sourceRoot, entry.name, sourceFileName);

      return {
        folderName: entry.name,
        sourceDir: path.dirname(sourcePath),
        sourcePath,
      };
    })
    .filter((entry) => fs.existsSync(entry.sourcePath));
}

function syncPaperLogs() {
  fs.mkdirSync(postsDir, { recursive: true });
  fs.mkdirSync(publicAssetDir, { recursive: true });

  const results = [];
  const sourceFiles = getSourceFiles();

  for (const sourceFile of sourceFiles) {
    const sourceContent = fs.readFileSync(sourceFile.sourcePath, "utf8");
    const isoDate = getDateFromContent(sourceContent, sourceFile.folderName, sourceFile.sourcePath);
    const sourceHash = crypto.createHash("sha256").update(sourceContent).digest("hex").slice(0, 16);
    const slug = `paper-reading-log-${isoDate}`;
    const postPath = path.join(postsDir, `${slug}.md`);
    const nextContent = getPostContent(
      sourceContent,
      sourceFile.sourceDir,
      isoDate,
      sourceHash,
    );

    const postAlreadyExists = fs.existsSync(postPath);

    if (postAlreadyExists) {
      const existingContent = fs.readFileSync(postPath, "utf8");

      if (!existingContent.includes(managedMarker)) {
        results.push({ action: "skipped", path: postPath, reason: "existing-unmanaged-post" });
        continue;
      }

      if (existingContent === nextContent) {
        results.push({ action: "unchanged", path: postPath });
        continue;
      }
    }

    fs.writeFileSync(postPath, nextContent);
    results.push({ action: postAlreadyExists ? "updated" : "created", path: postPath });
  }

  return results;
}

const results = syncPaperLogs();
const counts = results.reduce((summary, result) => {
  summary[result.action] = (summary[result.action] ?? 0) + 1;
  return summary;
}, {});

console.log(
  [
    `Synced paper logs from ${sourceRoot}`,
    `Total source logs: ${results.length}`,
    `Created: ${counts.created ?? 0}`,
    `Updated: ${counts.updated ?? 0}`,
    `Unchanged: ${counts.unchanged ?? 0}`,
    `Skipped: ${counts.skipped ?? 0}`,
  ].join("\n"),
);

const skipped = results.filter((result) => result.action === "skipped");

if (skipped.length > 0) {
  for (const result of skipped) {
    console.warn(`Skipped unmanaged post: ${result.path}`);
  }
}
