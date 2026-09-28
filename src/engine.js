/* GTNH Planner 中文汉化引擎 (v0.1.0)
 * 适用于 https://gtnhplanner.com/
 * 界面词典 + 物品/流体/机器名词典（源自 GTNH 官方中文本地化数据）
 */
(function () {
  'use strict';
  if (window.__GTNH_ZH_LOADED__) { window.__GTNH_ZH_TOGGLE__ && window.__GTNH_ZH_TOGGLE__(); return; }
  window.__GTNH_ZH_LOADED__ = true;

  var UI_DICT = /*__UI_DICT__*/{};
  var NAME_DICT = /*__NAME_DICT__*/{};

  // ---- 组合词兜底规则（词典查不到整词时按 GT 命名规则拼接） ----
  function lk(en) { return NAME_DICT[en] || null; }
  var PATTERNS = [
    [/^Page (\d+) of (\d+)$/, function (m) { return '第 ' + m[1] + ' 页，共 ' + m[2] + ' 页'; }],
    [/^by (.+)$/, function (m) { return '作者 ' + m[1]; }],
    [/^Tiny Pile of (.+)$/, function (m) { var t = lk(m[1]); return t ? '小撮' + t : null; }],
    [/^Small Pile of (.+)$/, function (m) { var t = lk(m[1]); return t ? '小堆' + t : null; }],
    [/^Molten (.+)$/, function (m) { var t = lk(m[1]); return t ? '熔融' + t : null; }],
    [/^Hot (.+)$/, function (m) { var t = lk(m[1]); return t ? '热' + t : null; }],
    [/^Empty (.+)$/, function (m) { var t = lk(m[1]); return t ? '空' + t : null; }],
    [/^(.+) Cell$/, function (m) { var t = lk(m[1]); return t ? t + '单元' : null; }],
    [/^(.+) Ingot$/, function (m) { var t = lk(m[1]); return t ? t + '锭' : null; }],
    [/^(.+) Dust$/, function (m) { var t = lk(m[1]); return t ? t + '粉' : null; }],
    [/^(.+) Plate$/, function (m) { var t = lk(m[1]); return t ? t + '板' : null; }],
    [/^(.+) Foil$/, function (m) { var t = lk(m[1]); return t ? t + '箔' : null; }],
    [/^(.+) Rod$/, function (m) { var t = lk(m[1]); return t ? t + '杆' : null; }],
    [/^(.+) Screw$/, function (m) { var t = lk(m[1]); return t ? t + '螺丝' : null; }],
    [/^(.+) Ring$/, function (m) { var t = lk(m[1]); return t ? t + '环' : null; }],
    [/^(.+) Gear$/, function (m) { var t = lk(m[1]); return t ? t + '齿轮' : null; }],
    [/^(.+) Rotor$/, function (m) { var t = lk(m[1]); return t ? t + '转子' : null; }],
    [/^(.+) Wire$/, function (m) { var t = lk(m[1]); return t ? t + '线' : null; }],
    [/^(.+) Nugget$/, function (m) { var t = lk(m[1]); return t ? t + '粒' : null; }],
    [/^(.+) Gem$/, function (m) { var t = lk(m[1]); return t ? t + '宝石' : null; }],
    [/^(.+) Lens$/, function (m) { var t = lk(m[1]); return t ? t + '透镜' : null; }],
    [/^(.+) Block$/, function (m) { var t = lk(m[1]); return t ? t + '块' : null; }]
  ];

  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, CODE: 1, PRE: 1 };

  // 翻译一段文本；返回替换后的全文，或 null 表示不翻译
  var UI_LOWER = {};
  (function () { for (var k in UI_DICT) UI_LOWER[k.toLowerCase()] = UI_DICT[k]; })();

  function trText(s) {
    var t = s.trim();
    if (!t || !/[\x20-\x7e]/.test(t)) return null; // 无 ASCII 内容跳过
    var hit = UI_DICT[t] || UI_LOWER[t.toLowerCase()];
    if (hit) return s.replace(t, hit);
    hit = NAME_DICT[t];
    if (hit) return s.replace(t, hit);
    for (var i = 0; i < PATTERNS.length; i++) {
      var m = t.match(PATTERNS[i][0]);
      if (m) {
        var rep = PATTERNS[i][1](m);
        if (rep) return s.replace(t, rep);
      }
    }
    return null;
  }

  function processNode(node) {
    if (!node) return;
    if (SKIP_TAGS[node.nodeName]) return;
    var txt = node.nodeValue;
    if (!txt || txt.length > 300) return;
    var rep = trText(txt);
    if (rep !== null && rep !== txt) node.nodeValue = rep;
  }

  // 处理"纯文本子节点"元素：整段合并后再尝试匹配（应对 React 把 "Page 1 of 1801" 拆成多个文本节点的情况）
  function processElement(el) {
    var kids = el.childNodes;
    var texts = [];
    for (var i = 0; i < kids.length; i++) {
      if (kids[i].nodeType === 1) { texts = null; break; }
      if (kids[i].nodeType === 3) texts.push(kids[i]);
    }
    if (!texts || texts.length < 2) return;
    var combined = texts.map(function (n) { return n.nodeValue; }).join('');
    if (combined.length > 300) return;
    var rep = trText(combined);
    if (rep !== null && rep !== combined) {
      texts[0].nodeValue = rep;
      for (var j = 1; j < texts.length; j++) texts[j].nodeValue = '';
    }
  }

  function processElementAttrs(el) {
    if (el.hasAttribute && el.hasAttribute('placeholder')) {
      var ph = el.getAttribute('placeholder');
      var phR = trText(ph);
      if (phR !== null && phR !== ph) el.setAttribute('placeholder', phR);
    }
    ['title', 'aria-label'].forEach(function (a) {
      if (el.hasAttribute && el.hasAttribute(a)) {
        var v = el.getAttribute(a);
        var r = trText(v);
        if (r !== null && r !== v) el.setAttribute(a, r);
      }
    });
  }

  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { processNode(root); return; }
    if (root.nodeType !== 1) return;
    processElementAttrs(root);
    if (SKIP_TAGS[root.nodeName]) return;
    // 元素级合并匹配（含后代中"纯文本+内联数字"拆分的情况，如分页器）+ 属性
    var ew = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null);
    var e;
    while ((e = ew.nextNode())) {
      processElementAttrs(e);
      if (e !== root) processElement(e);
    }
    processElement(root);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = w.nextNode())) processNode(n);
  }

  var pending = [];
  var timer = null;
  function schedule(root) {
    pending.push(root);
    if (timer) return;
    timer = setTimeout(function () {
      timer = null;
      var batch = pending; pending = [];
      for (var i = 0; i < batch.length; i++) walk(batch[i]);
    }, 120);
  }

  function applyAll() {
    walk(document.body);
    if (/gtnhplanner\.com/.test(location.host)) {
      var t = document.title;
      var r = trText(t);
      if (r) document.title = r;
    }
  }

  var enabled = true;
  try { enabled = localStorage.getItem('gtnh-zh-enabled') !== '0'; } catch (e) {}

  var mo = new MutationObserver(function (muts) {
    if (!enabled) return;
    for (var i = 0; i < muts.length; i++) {
      var m = muts[i];
      if (m.type === 'attributes') { schedule(m.target); continue; }
      var added = m.addedNodes;
      for (var j = 0; j < added.length; j++) schedule(added[j]);
      if (m.type === 'characterData' && m.target.parentNode) schedule(m.target.parentNode);
    }
  });

  function start() {
    mo.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['placeholder', 'title', 'aria-label'] });
    if (enabled) applyAll();
  }

  function refresh() {
    applyAll();
  }

  window.__GTNH_ZH_TOGGLE__ = function () {
    enabled = !enabled;
    try { localStorage.setItem('gtnh-zh-enabled', enabled ? '1' : '0'); } catch (e) {}
    if (enabled) refresh();
    else location.reload();
    return enabled;
  };

  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('汉化 开/关 (Toggle)', function () { window.__GTNH_ZH_TOGGLE__(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
