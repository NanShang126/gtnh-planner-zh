// 构建脚本：生成油猴脚本 gtnh-planner-zh.user.js 与书签注入 gtnh-zh-inject.js
// 用法: node build.js  （需把词典 JSON 放在 ../name_dict_raw.json）
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT = path.join(ROOT, '..'); // gtnh-planner-zh/
const engine = fs.readFileSync(path.join(ROOT, 'engine.js'), 'utf8');
const uiDict = require('./ui_dict.js');

// 物品名词典：来自 name_dict_raw.json（如不存在则尝试上层目录）
let nameDict = {};
const dictPath = path.join(OUT, '..', 'name_dict_raw.json');
if (fs.existsSync(dictPath)) {
  nameDict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
} else {
  console.warn('警告: 未找到 name_dict_raw.json，仅打包界面词典');
}

// 人工补丁：常见机器名（数据版本差异导致的缺词）
const PATCH = {
  "Electrolyzer": "电解机",
  "Macerator": "研磨机",
  "Chemical Reactor": "化学反应釜",
  "Assembler": "组装机",
  "Multi-Smelter": "多功能熔炉",
  "Extractor": "提取机",
  "Compressor": "压缩机",
  "Alloy Smelter": "合金冶炼炉",
  "Arc Furnace": "电弧炉",
  "Canner": "装罐机",
  "Cutter": "切割机",
  "Lathe": "车床",
  "Wiremill": "轧线机",
  "Bender": "折板机",
  "Forge Hammer": "锻锤",
  "Nitrogen": "氮",
  "Oxygen": "氧",
  "Hydrogen": "氢",
  "Oil Berry": "油浆果",
  "Salty Root": "盐根"
};
for (const k in PATCH) if (!nameDict[k]) nameDict[k] = PATCH[k];

const uiJson = JSON.stringify(uiDict);
const nameJson = JSON.stringify(nameDict);

function fill(code) {
  return code
    .replace('/*__UI_DICT__*/{}', uiJson)
    .replace('/*__NAME_DICT__*/{}', nameJson);
}

const ts = new Date().toISOString().slice(0, 10);

// 1) 油猴脚本
const userjs = `// ==UserScript==
// @name         GTNH Planner 中文汉化
// @namespace    gtnh-planner-zh
// @version      0.1.0
// @description  为 gtnhplanner.com 提供简体中文界面与物品/机器名词典（GTNH 官方中文数据）
// @author       gtnh-planner-zh
// @match        https://gtnhplanner.com/*
// @match        https://*.gtnhplanner.com/*
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @license      MIT
// ==/UserScript==
// 构建日期: ${ts} | 词典条目: ${Object.keys(nameDict).length}
` + fill(engine) + '\n';

fs.writeFileSync(path.join(OUT, 'gtnh-planner-zh.user.js'), userjs);

// 2) 书签栏注入脚本（与油猴同引擎）
fs.writeFileSync(path.join(OUT, 'gtnh-zh-inject.js'), fill(engine) + '\n');

console.log('OK: gtnh-planner-zh.user.js (%s KB), gtnh-zh-inject.js (%s KB)',
  (userjs.length / 1024).toFixed(0), (fill(engine).length / 1024).toFixed(0));
