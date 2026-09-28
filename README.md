# GTNH Planner 中文汉化（gtnh-planner-zh）

为 [gtnhplanner.com](https://gtnhplanner.com/)（GregTech: New Horizons 工厂规划器）提供**简体中文界面 + 物品名词典**的浏览器脚本，可通过 GitHub Pages 一键安装使用。

> 原站闭源，本项目不做镜像、不复制其数据，只在浏览器端加一层实时"翻译滤镜"，原站功能与你的方案存档完全不受影响。

## 成品

| 文件 | 用途 |
|---|---|
| `gtnh-planner-zh.user.js` | 油猴（Tampermonkey）用户脚本，装一次永久生效 |
| `gtnh-zh-inject.js` | 书签栏注入脚本（免扩展方案），由 Pages 提供托管 |
| `index.html` | GitHub Pages 落地页（安装说明 + 拖拽书签生成器） |
| `src/` | 构建源码（引擎 + 界面词典 + 构建脚本） |

## 功能

- 主界面全量汉化（v3.9.2 实测）：导航、搜索栏、建造/求解/汇总、资源统计、共享方案页
- 约 **3.2 万条** 官方简体中文物品/流体/机器译名（GregTech、Thaumcraft、Botania、AE2 等）
- GT 命名规则智能拼接：`Tiny Pile of X` → 小撮X、`X Cell` → X单元、`Molten X` → 熔融X 等
- MutationObserver 实时翻译动态内容；油猴菜单一键开/关

## 部署到你的 GitHub Pages（3 步）

1. 在 GitHub 新建仓库（如 `gtnh-planner-zh`），把本目录全部文件推上去：
   ```bash
   cd gtnh-planner-zh
   git init && git add -A
   git commit -m "GTNH Planner 中文汉化 v0.1.0"
   git remote add origin https://github.com/<你的用户名>/gtnh-planner-zh.git
   git push -u origin main   # 若默认分支是 master，请用 master
   ```
2. 仓库 **Settings → Pages** → Source 选 `Deploy from a branch`，Branch 选 `main` / `(root)`，Save。
3. 等 1~2 分钟，访问 `https://<你的用户名>.github.io/gtnh-planner-zh/` 即为安装页，
   安装链接为 `https://<你的用户名>.github.io/gtnh-planner-zh/gtnh-planner-zh.user.js`。

## 本地修改词典

```bash
# 界面词条：编辑 src/ui_dict.js
# 物品词条：替换 name_dict_raw.json（{"英文名":"中文名", ...}）
node src/build.js   # 重新生成两个 js 文件，提交推送即自动更新 Pages
```

### 重建物品词典（可选）

词典由 GTNH 官方中文数据生成，方法：

1. 英文数据：`https://shadowtheage.github.io/gtnh/data/data.bin`（gzip，解开）
2. 中文数据：`https://cdn.jsdelivr.net/gh/KZdavid/gtnh-calc-data-zh-CN@GTNH-2.8.4/data.bin`（gzip，解开）
3. 按 [gtnh-calc 的 repository.ts](https://github.com/KZdavid/gtnh-calc/blob/main/src/repository.ts) 的 Int32Array 指针格式解析 items/fluids 的 `id→name`，按 id 对齐生成 `en≠zh` 的映射表。

## 许可与致谢

- 代码：MIT License
- 物品译名：来自 GTNH 官方中文本地化（[GTNewHorizons/GT5-Unofficial](https://github.com/GTNewHorizons/GT5-Unofficial) 等 mod 的 `zh_CN.lang` 与 [KZdavid/gtnh-calc](https://github.com/KZdavid/gtnh-calc) 中文数据）
- 本项目为社区工具，与 gtnhplanner.com 原作者及 GTNH 团队无隶属关系
