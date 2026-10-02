// One-page static generator. The report is a dated analysis snapshot, not a live quote.
declare const require: any;
declare const process: any;
const fs = require("fs");
const path = require("path");
const nodeCrypto = require("crypto");

const sourceChat =
  "https://chatgpt.com/share/6abf5c95-2d88-83ea-b81d-019e484110e8";
const sourceQ2 =
  "https://www.tencent.com/wp-content/uploads/2026/08/Tencent-Announces-2026-Second-Quarter-Results.pdf";
const sourceFY25 =
  "https://static.www.tencent.com/uploads/2026/03/18/bd32d8ee320b72f0d72d545fd2d65851.pdf";
const sourceAnnual =
  "https://static.www.tencent.com/uploads/2026/04/09/62d786fcf3d3c8cb7e54791ee95439ac.pdf";
const sourceTeam = "https://www.tencent.com/zh-cn/team/ma-huateng-pony-ma/";

type Explanation = { title: string; body: string };
const notes: Record<string, Explanation> = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), "src/notes.json"), "utf8"),
);
function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const commonMain = fs
  .readFileSync(path.resolve(process.cwd(), "src/report.html"), "utf8")
  .replace("{{SOURCE_CHAT}}", sourceChat)
  .replace("{{SOURCE_Q2}}", sourceQ2)
  .replace("{{SOURCE_FY25}}", sourceFY25)
  .replace("{{SOURCE_ANNUAL}}", sourceAnnual)
  .replace("{{SOURCE_TEAM}}", sourceTeam)
  .replace(/data-note="([^"]+)"/g, (_: string, key: string) => {
    if (!notes[key]) throw new Error(`Missing explanation: ${key}`);
    return `data-note="${key}" title="${escapeAttribute(notes[key].body)}"`;
  });
const stylePath = path.resolve(process.cwd(), "src/styles.css");
const styleHash = nodeCrypto
  .createHash("sha256")
  .update(fs.readFileSync(stylePath))
  .digest("hex")
  .slice(0, 12);
const scriptHash = nodeCrypto
  .createHash("sha256")
  .update(fs.readFileSync(path.resolve(process.cwd(), "docs/explain.js")))
  .digest("hex")
  .slice(0, 12);
const notesJson = JSON.stringify(notes).replace(/</g, "\\u003c");

const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#fafaf7">
  <meta name="description" content="腾讯控股估值分析快照：价值构成、2026 年第二季财报核对、关键假设和就地悬停解释。">
  <meta property="og:type" content="article">
  <meta property="og:title" content="腾讯的合理价值，取决于现金怎样增长">
  <meta property="og:description" content="用金融杂志的形式阅读一份有来源、有时间标记的腾讯估值分析。">
  <title>腾讯估值分析｜金融杂志</title>
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="stylesheet" href="styles.css?v=${styleHash}">
</head>
<body class="magazine">
  <a class="skip-link" href="#main">跳到正文</a>
  <header class="site-head" id="top">
    <a class="brand" href="#top" aria-label="返回页首"><span class="brand-symbol">T</span><span>腾讯估值 · 金融杂志</span></a>
    <nav class="site-nav" aria-label="页面目录">
      <a href="#bridge-title">估值结构</a>
      <a href="#facts-title">财报核对</a>
      <a href="#cash-title">现金流与 AI</a>
      <a href="#thesis-title">关键判断</a>
      <a href="#source-title">来源与版本</a>
    </nav>
    <span class="issue-label">2026 Q2</span>
  </header>
  ${commonMain}
  <footer class="page-footer"><span>独立研究展示 · 数据与假设见原始来源</span><a href="#source-title">查看来源与版本 ↑</a></footer>
  <script id="explain-data" type="application/json">${notesJson}</script>
  <script src="explain.js?v=${scriptHash}" defer></script>
</body>
</html>`;

const output = path.resolve(process.cwd(), "docs");
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, "index.html"), html);
fs.copyFileSync(stylePath, path.join(output, "styles.css"));
fs.copyFileSync(
  path.resolve(process.cwd(), "src/favicon.svg"),
  path.join(output, "favicon.svg"),
);
fs.writeFileSync(path.join(output, ".nojekyll"), "");
console.log("Built docs/index.html");
