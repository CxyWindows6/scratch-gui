# 前端 UI MDUI 改造审计报告

> 日期：2026-08-27
> 方法：15 路子代理只读并行审计 + 主代理静态/运行时复核
> 范围：`src/lib/mdui`、`src/lib/mdui-theme`、`src/lib/themes`、`src/components`、`src/containers`、`webpack.config.js`、`run-verify.js`、`capture-tests.js`
> 结论：**未完全改造完成**；核心 chrome 已 MDUI 化，但仍有大量组件保留原生 scratch DOM 与遗留样式，并发现若干功能性 bug。

---

## 一、覆盖率统计

| 维度 | 结果 |
| --- | --- |
| `src/components/**/*.jsx` | 158 个；**直接**使用 MDUI（import `lib/mdui` 或 `<mdui-*>`）28 个，其余 130 个为原生/转发壳/非 UI |
| `src/containers/*.jsx` | 78 个；直接 MDUI 3 个；纯转发壳 62 个；原生 scratch DOM 5 个；逻辑/HOC 6 个 |
| `src/lib/mdui` | 17 个组件包装模块 + 1 个工厂 `make-component` |
| 菜单栏 `menu-bar` | 22 个 JSX/CSS；已改造 8 个、未改造 6 个、死代码 3 个、部分改造 1 个 |
| tw-* 弹窗/功能 UI | 弹窗外框已 MDUI，内部内容大部分仍原生；功能类 UI 几乎全部未改 |

### 分域覆盖判定（汇总 15 路）

| 模块 | 判定 |
| --- | --- |
| mdui 包装层 17 组件 | 部分可用；dialog/dropdown/snackbar/icon/divider 基本正确，menu/list 属性名错误 |
| bootstrap + webpack | ✅ 接线正确（单次导入、CSS Modules 排除正确、babel include 覆盖浏览器产物） |
| 主题系统 | ✅ 主链路可用；存在 icon 字体与 color-scheme 双写缺陷 |
| menu-bar 顶级 chrome | ✅ 已 MDUI（编辑/文件/设置/语言/主题/对齐/桌面设置） |
| 通用弹窗 | ⚠️ 部分：modal 已 MDUI；prompt/slider/question/record 部分；**connection-modal 全原生** |
| tw-* 弹窗 | ⚠️ 外壳已 MDUI；内容多数原生 |
| 按钮/输入/控件 | ⚠️ 公共 Button/Input/Checkbox/Filter 已改；icon/close/delete/play/stop/green-flag/toggle/project-input 未改 |
| 资产面板/素材库 | ⚠️ filter 已 MDUI；selector/sortable-asset/library-item/asset-panel 仍原生 |
| 舞台/目标/精灵/监视器 | ❌ 无直接 MDUI，仅经 Button/Input/ActionMenu 间接；target-pane/monitor 全原生 |
| 背包/提示/卡片/菜单 | ⚠️ 背包/动作菜单部分；context-menu/menu/tips/cards 未改 |
| tw-* 功能 UI | ❌ 除 tw-see-inside 经 Button 间接外，其余全原生 |
| 遗留 scratch 收尾 | 3 已改（spinner/loader/progress-ring），8 不适用，**4 未改（coming-soon、meter、question、forms/label）** |
| containers 接线层 | 基本完成（62/78 转发壳），5 处原生 DOM 尾留 |
| CSS 令牌/深色模式 | rgb()/::part 用法正确；存在 `$ui-white` 语义反转与旧蓝/旧橙残留 |
| lint / i18n | lint 0 报错；i18n 词条静态合规 |

**结论：改造覆盖不完整。** 顶部菜单栏是完成度最高的区域；弹窗、素材库、监视器、连接向导、各类 tw 功能 UI 仍大量使用原生 `div/button/input` 与遗留 `$ui-*` 变量。

---

## 二、高严重度 bug

| 位置 | 问题 |
| --- | --- |
| `src/lib/mdui/make-component.jsx:25-28` | `onFocus/onBlur` 绑定原生 `focus/blur`。原生 focus/blur 不冒泡、不跨 Shadow DOM，且 mdui 不重发这两个事件 → **onFocus/onBlur 永不触发**。 |
| `src/components/forms/buffered-input-hoc.jsx:46` | 依赖 `onBlur` 提交，因上一条失效：**失焦不提交**，仅 Enter 生效。 |
| `src/components/direction-picker/direction-picker.jsx:101` | 依赖 `onFocus` 打开方向 popover，因上一条失效：**点击输入框打不开 popover**。 |
| `src/lib/mdui/menu.jsx:14` | `selectable` 属性名错误；mdui 2.1.5 真实属性是 `selects`（`single`/`multiple`）。 |
| `src/lib/mdui/list.jsx:21-23` | list-item 属性错名：`title`→应为 `headline`、`selected`→应为 `active`、`value` 不存在。 |
| `src/lib/mdui-theme/overrides.css:85-91` | 把 mdui-icon 默认硬编码的 `'Material Icons'`（实心）映射到 `material-symbols-rounded.woff2`，且未设 `FILL 1` → **全部默认 `mdui-icon` 渲染为描边而非实心**；`Material Icons Two Tone` 未注册。 |
| `src/components/prompt/prompt.jsx:76-85` | ref 误把 DOM 元素当 wrapper 实例读 `instance.elementRef`（恒 undefined）→ `defaultValue` 从未写入输入框。 |
| `src/components/tw-news/…`（`menu-bar/tw-news.jsx:9`） | `newsAppliesToUser = () => false` 导致组件永远不渲染（死代码）。 |
| `src/lib/themes/guiHelpers.js:79,92-93` | `ui-white*` 映射到 `--mdui-color-surface`，深色模式下语义反转；触发 `monitor.css`/`crash-message.css`/`close-button.css`/`library-item.css`/`backpack.css` 多处背景/文字色异常。 |
| `src/components/connection-modal/*` | 整个连接向导仍为原生 `button/div/textarea`，未使用任何 mdui 组件（覆盖缺口，用户在深色/统一视觉下最明显）。 |

---

## 三、中/低严重度 bug 摘要

### 中
- `project-title-input.jsx:30,32` — `maxLength`/`tabIndex` 被 kebab 成 `max-length`/`tab-index`，mdui 只认全小写 `maxlength`/`tabindex`，**100 字符限制失效**。
- `modal.jsx:97-101,110-114` — X/Back 按钮直接 `onRequestClose` 跳过 mdui 关闭动画，与 ESC/遮罩路径不一致。
- `prompt.jsx:64-72`、`slider-prompt.jsx` — `label` 在顶部 Box 与 text-field 悬浮标签**重复显示**。
- `prompt.jsx:103-124` — radio-group `value` 与 radio `checked` 双向绑定冲突。
- `question.jsx:32-41` / `recording-step.jsx:64` — 提交/主按钮仍原生 `<button>`。
- `filter.css:48` — `:not([value=""])` 依赖 mdui 反射 value，但 value 并不 reflect → **搜索框宽度收缩动画失效**。
- `library-item.jsx` — 收藏星原生按钮 Enter 同时触发整卡选中 + 收藏切换。
- `sprite-list.jsx:52` / `list-monitor.jsx:66` / `list-monitor-scroller.jsx:93` — hoveredTarget/list value 未判空。
- `watermark.jsx:51-52` — `targets.stage.costume` 未判空。
- `stage-selector.css` / `menu-bar.css:20` — fallback 仍用旧 Scratch 蓝 `#4c97ff`。
- `capture-tests.js:45` — `mdui-icon-button` 应为 `mdui-button-icon`；`:17` 仅中文；`run-verify.js:22` 点宿主非 trigger。
- 品牌/链接残留：`featured-projects.jsx:96`、`description.jsx:14/33/49`、`invalid-embed.jsx:27/33/38` 仍指向 `scratch.mit.edu` / `turbowarp.org`。

### 低
- 重复派发/死代码：`menu-bar.jsx:407,411`、`language-menu.jsx:53-56`、`reducers/menus.js:56,65`、`menu-bar/menu-bar-menu.jsx`+`tw-menu-label.jsx`+`save-status.jsx` 无引用。
- `tw-surge-theme.jsx` 未 connect，submenu 状态不同步 Redux。
- `action-menu.jsx` setTimeout 未清理、`Math.random` tooltip id；`contextMenuId` 渲染期递增错配。
- `webpack.config.js:88` — `@lit[\\/]` 匹配不到 `@lit-labs/ssr-dom-shim`（当前不进浏览器产物，webpack5 升级时踩雷）。
- `overrides.css:69-73` color-scheme 初始化窗口深色下短暂按 light；`mdui-theme/index.js:96-99` rAF + MutationObserver 双触发 syncThemeColorMeta。

---

## 四、可确认的正确项

- `mdui-bootstrap` 仅在 `gui.jsx:56` 导入一次；`mdui/mdui.css`、全量 `mdui`、Material Symbols 各引入一次。
- webpack CSS Modules 排除与 babel include 覆盖了所有实际进入浏览器产物的现代语法包。
- 所有 `--mdui-color-*` 引用都正确包 `rgb()/rgba()`；所有 `::part()` 目标在 mdui 2.1.5 中均有效。
- 菜单栏 opened/closed 状态同步无死循环；子菜单 toggle 逻辑正确；Save File 关闭正常。
- eslint 0 报错；i18n `defaultMessage/description/id` 全部静态可求值。

---

## 五、根本修复建议（按影响排序）

1. `make-component.jsx`：`onFocus/onBlur` 改绑 `focusin/focusout`（可冒泡、跨 Shadow DOM），并修正 `tabindex` 大小写、处理数组/对象 prop。
2. `list.jsx`/`menu.jsx`：修正属性名 `headline/active/selects`。
3. `overrides.css`：为 `Material Icons`（filled）补 `font-variation-settings:'FILL' 1`，注册 `Material Icons Two Tone`。
4. `prompt.jsx`：ref 直接用 DOM 元素写 `value`；去掉重复 label；radio 托管给 group。
5. `project-title-input.jsx`：改用全小写 `maxlength/tabindex`。
6. 深色模式：重映射 `ui-white*`，清理 `$ui-white` 作文字色/旧蓝 fallback。

## 六、修复记录（2026-08-27，已实施的最高危 bug 修复）

| # | 修复 | 文件 | 验证 |
| --- | --- | --- | --- |
| 1 | onFocus/onBlur → focusin/focusout（注释同步） | `src/lib/mdui/make-component.jsx` | eslint 0；build 通过 |
| 2 | list-item 属性名 title→headline、selected→active、去掉 value；menu selectable→selects，menu-item 补 endText/selectedIcon/submenuOpen/link 属性 | `src/lib/mdui/list.jsx`、`src/lib/mdui/menu.jsx` | eslint 0；build 通过 |
| 3 | 默认实心图标补 `FILL 1`；注册 Two Tone；Outlined=0、Round/Sharp=1 | `src/lib/mdui-theme/overrides.css` | build 通过（CSS 加载无误） |
| 4 | prompt ref 直接写 DOM 元素 value | `src/components/prompt/prompt.jsx` | eslint 0；build 通过 |
| 5 | maxlength/tabindex 全小写 | `src/components/menu-bar/project-title-input.jsx` | eslint 0；build 通过 |
| 6 | `$ui-white` 作文字色的两处改固定白 | `src/components/close-button/close-button.css`、`src/components/library-item/library-item.css` | build 通过 |
| 7a | 移除菜单栏对惰性 TWNews 的渲染与 import | `src/components/menu-bar/menu-bar.jsx` | eslint 0；build 通过 |
| 7b | **未动**：`connection-modal` 内部向导按钮仍原生（外层已走 MDUI Modal） | — | 属较大视觉重构，需单独视觉回归 |

> 注：`ui-white*` 作为背景的映射保留（背景本应符合明暗 surface 语义）；仅把把 `$ui-white` 当**文字色**的两处改为固定白，避免深色模式下文字变暗。