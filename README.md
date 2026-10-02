# 腾讯估值 · 金融杂志

一个可独立部署的单页网站，用金融杂志的排版呈现腾讯控股估值分析。页面逐层展示原分析的价值区间、上下限复算、历史价格与 PE 对照、2025/2026 财报、Owner Earnings 口径、AI 投入情景和管理层资本配置。专业术语与关键口径可在原位悬停查看，键盘聚焦或触屏点按也能打开说明。

**在线页面：** https://joy-tianqing.github.io/tencent-valuation-magazine/

## 内容边界

- **HK$470–600/股**是[原对话](https://chatgpt.com/share/6abf5c95-2d88-83ea-b81d-019e484110e8)的历史分析区间；HK$431 是原对话引用的 2026-09-30 价格。网站不提供实时行情或更新后的目标价。
- 页面逐步展示人民币三项估值加总、按约 1.09–1.10 换算为港元、再除以约 90 亿股的上下限复算。原对话未完整给出经营业务现金流折现参数，因此经营业务估值本身仍是原分析的判断值。
- 收入、资本开支、自由现金流、净现金和持股数据来自[腾讯 2026 年第二季官方业绩稿](https://www.tencent.com/wp-content/uploads/2026/08/Tencent-Announces-2026-Second-Quarter-Results.pdf)。页面将季度数与期末余额分开标示。
- 2025 年全年自由现金流和回购金额、股数来自[腾讯 2025 年业绩稿](https://static.www.tencent.com/uploads/2026/03/18/bd32d8ee320b72f0d72d545fd2d65851.pdf)；回购股份的注销情况来自[腾讯 2025 年年报](https://static.www.tencent.com/uploads/2026/04/09/62d786fcf3d3c8cb7e54791ee95439ac.pdf)。
- 正常化 Owner Earnings、增长率、投资资产折价和 AI 投入的未来回报都是分析判断，不能从财报数字直接推出。
- 历史价格层级、PE 交叉检查与未来情景仅复述原对话当时的判断，未重新核验行情口径或给出新的买卖建议。

## 本地开发

需要 Node.js 18+、npm 和 Python 3。安装依赖后运行：

```bash
npm ci
npm run check
npm run dev
```

浏览 http://127.0.0.1:8767/ 。`npm run build` 将网站生成到 `docs/`；说明浮层由少量 TypeScript 编译的浏览器脚本控制。

## 修改与发布

- 正文与数字：`src/report.html`
- 解释词条：`src/notes.json`
- 悬停、键盘和触屏交互：`src/explain.ts`
- 页面外壳与构建逻辑：`src/build.ts`
- 色彩、排版和响应式布局：`src/styles.css`
- 站点图标：`src/favicon.svg`
- 生成结果：`docs/`，提交到 `main` 分支后由 GitHub Pages 从 `/docs` 发布

修改后运行 `npm run check`，检查生成页面的章节、锚点、主要数字、来源和单样式 CSS，再提交 `src/` 与 `docs/`。部署设置使用 GitHub Pages 的 **Deploy from a branch → main → /docs**。

## 授权

本项目原创代码和设计采用 [MIT License](LICENSE)。腾讯名称、商标及官方数据属于各自权利人；页面注明了数据来源。页面仅是带来源的历史分析展示，不构成投资建议。
