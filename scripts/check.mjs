import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync("docs/index.html", "utf8");
const css = readFileSync("docs/styles.css", "utf8");
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const localAnchors = [...html.matchAll(/href="#([^"]+)"/g)].map(
  (match) => match[1],
);

assert.equal(new Set(ids).size, ids.length, "HTML IDs must be unique");
for (const anchor of localAnchors)
  assert(ids.includes(anchor), `Missing anchor: ${anchor}`);
for (const heading of [
  "价值由三部分组成",
  "财报给出的核对点",
  "真正需要判断的变量",
  "五个词，读懂这份估值",
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
  "528",
  "−138",
  "+376",
  "582",
  "Owner Earnings",
  "FCF",
  "CapEx",
  "SOTP",
  "ROIC",
]) {
  assert(html.includes(value), `Missing report value: ${value}`);
}
assert(html.includes("历史分析快照"), "The valuation date warning is required");
assert(html.includes("腾讯官方业绩 PDF"), "The official source must be linked");
assert(!html.includes("{{SOURCE_"), "Source URL placeholders must be resolved");
assert(!/theme-/.test(css), "Unused theme system should not ship");
assert(
  !html.includes("四种样式"),
  "Single-style project copy should be self-contained",
);
console.log(
  "Report structure, anchors, provenance, and single-style CSS verified.",
);
