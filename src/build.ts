// One-page static generator. The report is a dated analysis snapshot, not a live quote.
declare const require: any;
declare const process: any;
const fs = require("fs");
const path = require("path");

const sourceChat =
  "https://chatgpt.com/share/6abf5c95-2d88-83ea-b81d-019e484110e8";
const sourceQ2 =
  "https://www.tencent.com/wp-content/uploads/2026/08/Tencent-Announces-2026-Second-Quarter-Results.pdf";

const commonMain = fs
  .readFileSync(path.resolve(process.cwd(), "src/report.html"), "utf8")
  .replace("{{SOURCE_CHAT}}", sourceChat)
  .replace("{{SOURCE_Q2}}", sourceQ2);

const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#fafaf7">
  <meta name="description" content="腾讯控股估值分析快照：价值构成、2026 年第二季财报核对、关键假设和专业术语解释。">
  <meta property="og:type" content="article">
  <meta property="og:title" content="腾讯的合理价值，取决于现金怎样增长">
  <meta property="og:description" content="用金融杂志的形式阅读一份有来源、有时间标记的腾讯估值分析。">
  <title>腾讯估值分析｜金融杂志</title>
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="stylesheet" href="styles.css">
</head>
<body class="magazine">
  <a class="skip-link" href="#main">跳到正文</a>
  <header class="site-head" id="top">
    <a class="brand" href="#top" aria-label="返回页首"><span class="brand-symbol">T</span><span>腾讯估值 · 金融杂志</span></a>
    <nav class="site-nav" aria-label="页面目录">
      <a href="#bridge-title">估值结构</a>
      <a href="#facts-title">财报核对</a>
      <a href="#thesis-title">关键判断</a>
      <a href="#glossary-title">术语解释</a>
    </nav>
    <span class="issue-label">2026 Q2</span>
  </header>
  ${commonMain}
  <footer class="page-footer"><span>独立研究展示 · 数据与假设见原始来源</span><a href="#source-title">查看来源与版本 ↑</a></footer>
</body>
</html>`;

const output = path.resolve(process.cwd(), "docs");
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, "index.html"), html);
fs.copyFileSync(
  path.resolve(process.cwd(), "src/styles.css"),
  path.join(output, "styles.css"),
);
fs.copyFileSync(
  path.resolve(process.cwd(), "src/favicon.svg"),
  path.join(output, "favicon.svg"),
);
fs.writeFileSync(path.join(output, ".nojekyll"), "");
console.log("Built docs/index.html");
