# 腾讯估值 · 金融杂志

一个可独立部署的单页网站，用金融杂志的排版呈现腾讯控股估值分析。页面包含原分析的价值区间和分部估值、2026 年第二季财报核对、影响结论的条件，以及可展开的专业术语解释。

**在线页面：** https://joy-tianqing.github.io/tencent-valuation-magazine/

## 内容边界

- **HK$470–600/股**是[原对话](https://chatgpt.com/share/6abf5c95-2d88-83ea-b81d-019e484110e8)的历史分析区间；HK$431 是原对话引用的 2026-09-30 价格。网站不提供实时行情或更新后的目标价。
- 收入、资本开支、自由现金流、净现金和持股数据来自[腾讯 2026 年第二季官方业绩稿](https://www.tencent.com/wp-content/uploads/2026/08/Tencent-Announces-2026-Second-Quarter-Results.pdf)。页面将季度数与期末余额分开标示。
- 正常化 Owner Earnings、增长率、投资资产折价和 AI 投入的未来回报都是分析判断，不能从财报数字直接推出。

## 本地开发

需要 Node.js 18+、npm 和 Python 3。安装依赖后运行：

```bash
npm ci
npm run check
npm run dev
```

浏览 http://127.0.0.1:8767/ 。`npm run build` 将静态网站生成到 `docs/`，其中不含运行时 JavaScript；页面的术语展开由原生 HTML `<details>` 实现。

## 修改与发布

- 正文、数字和解释：`src/report.html`
- 页面外壳与构建逻辑：`src/build.ts`
- 色彩、排版和响应式布局：`src/styles.css`
- 站点图标：`src/favicon.svg`
- 生成结果：`docs/`，提交到 `main` 分支后由 GitHub Pages 从 `/docs` 发布

修改后运行 `npm run check`，检查生成页面的章节、锚点、主要数字、来源和单样式 CSS，再提交 `src/` 与 `docs/`。部署设置使用 GitHub Pages 的 **Deploy from a branch → main → /docs**。

## 授权

本项目原创代码和设计采用 [MIT License](LICENSE)。腾讯名称、商标及官方数据属于各自权利人；页面注明了数据来源。页面仅是带来源的历史分析展示，不构成投资建议。
