import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync("docs/index.html", "utf8");
const css = readFileSync("docs/styles.css", "utf8");
const client = readFileSync("docs/explain.js", "utf8");
const notes = JSON.parse(readFileSync("src/notes.json", "utf8"));
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const localAnchors = [...html.matchAll(/href="#([^"]+)"/g)].map(
  (match) => match[1],
);
const noteKeys = [...html.matchAll(/data-note="([^"]+)"/g)].map(
  (match) => match[1],
);

assert.equal(new Set(ids).size, ids.length, "HTML IDs must be unique");
for (const anchor of localAnchors)
  assert(ids.includes(anchor), `Missing anchor: ${anchor}`);
for (const heading of [
  "价值由三部分组成",
  "上下限是怎样算出来的",
  "财报给出的核对点",
  "花出去的钱，哪些是维持业务所需？",
  "真正需要判断的变量",
  "来源与版本",
]) {
  assert(html.includes(heading), `Missing section: ${heading}`);
}
for (const value of [
  "HK$470–600",
  "HK$530–550",
  "HK$431",
  "2048",
  "436",
  "同比 +11%",
  "同比 +22%",
  "528",
  "−138",
  "+376",
  "582",
  "Owner Earnings",
  "FCF",
  "CapEx",
  "SOTP",
  "ROIC",
  "1826",
  "984",
  "603",
  "1.534",
  "632.2 万股",
  "HK$800",
  "19%–22%",
  "约 8%",
  "18–21 倍",
  "5%–6%",
  "12%–15%+",
  "9%–11%",
  "600+ 港元",
  "470–500 港元",
  "微信关系链 → 用户时间 → 小程序 → 支付 → 广告 → 游戏发行 → 企业服务",
  "同一份流量，能否创造更多收入？",
  "长青游戏能否持续产生现金？",
]) {
  assert(html.includes(value), `Missing report value: ${value}`);
}
assert(html.includes("历史分析快照"), "The valuation date warning is required");
assert(html.includes("腾讯官方业绩 PDF"), "The official source must be linked");
assert(html.includes("腾讯 2025 年业绩稿"), "The annual source must be linked");
assert(
  html.includes("腾讯 2025 年年报"),
  "Buyback cancellation source must be linked",
);
assert(html.includes("腾讯管理团队介绍"), "Leadership source must be linked");
assert(!html.includes("{{SOURCE_"), "Source URL placeholders must be resolved");
assert(
  !html.includes("glossary-section"),
  "The bottom glossary must be removed",
);
assert(noteKeys.length >= 20, "Key concepts should have inline explanations");
for (const key of noteKeys) assert(notes[key], `Missing explanation: ${key}`);
for (const key of Object.keys(notes))
  assert(noteKeys.includes(key), `Unused explanation: ${key}`);
for (const row of [
  {
    bound: "lower",
    parts: ["3.20", "0.10", "0.55"],
    fx: "1.09",
    total: "3.85",
    hkd: "4.1965",
    perShare: "466.3",
    rounded: "470",
  },
  {
    bound: "upper",
    parts: ["4.00", "0.15", "0.75"],
    fx: "1.10",
    total: "4.90",
    hkd: "5.3900",
    perShare: "598.9",
    rounded: "600",
  },
]) {
  const scenario = html.match(
    new RegExp(
      `<article class="calculation-case(?: upper)?" data-bound="${row.bound}">([\\s\\S]*?)<\\/article>`,
    ),
  )?.[1];
  assert(scenario, `Missing ${row.bound} calculation`);
  const shown = scenario.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const total = row.parts.reduce((sum, part) => sum + Number(part), 0);
  assert.equal(total.toFixed(2), row.total);
  assert.equal((total * Number(row.fx)).toFixed(4), row.hkd);
  assert.equal(
    ((total * Number(row.fx) * 10000) / 90).toFixed(1),
    row.perShare,
  );
  assert(shown.includes(`${row.parts.join(" + ")} = ${row.total} 万亿元`));
  assert(shown.includes(`${row.total} × ${row.fx} = ${row.hkd} 万亿港元`));
  assert(
    shown.includes(
      `${row.hkd} 万亿港元 ÷ 约 90 亿股 = HK$${row.perShare} / 股`,
    ),
  );
  assert(shown.includes(`约 HK$${row.rounded} / 股`));
}
assert(
  html.includes("原文没有完整列出折现率"),
  "Core valuation limits must stay explicit",
);
assert.equal(Math.round((1 - 431 / 530) * 100), 19);
assert.equal(Math.round((1 - 431 / 550) * 100), 22);
assert.equal(Math.round((1 - 431 / 470) * 100), 8);
assert.equal(((800 / 50000) * 100).toFixed(1), "1.6");
assert.equal(((800 / 40000) * 100).toFixed(1), "2.0");
assert(html.includes("不是公司指引、实时目标价或未来股价预测"));
assert(
  !html.includes('class="chart-note"'),
  "Chart explanation should be in hover notes",
);
assert(
  !html.includes('class="inline-note"'),
  "Data footnotes should be in hover notes",
);
assert(client.includes("pointerenter"), "Hover behavior must be built");
assert(client.includes("keydown"), "Keyboard behavior must be built");
assert(
  /href="styles\.css\?v=[a-f0-9]{12}"/.test(html),
  "Stylesheet needs a versioned URL",
);
assert(
  /src="explain\.js\?v=[a-f0-9]{12}"/.test(html),
  "Explanation script needs a versioned URL",
);
assert(!/theme-/.test(css), "Unused theme system should not ship");
assert(
  !html.includes("四种样式"),
  "Single-style project copy should be self-contained",
);
console.log(
  "Report structure, inline explanations, anchors, provenance, and assets verified.",
);
