# MDUI 子代理发现摘记（阶段 3）

## 工作流10: backpack/tips/cards/menu/context/action/drag/watermark (7de37697)
覆盖：backpack 部分；action-menu 部分；context-menu/menu/tips/cards/drag/watermark 未改造。
bugs:
- action-menu.jsx:172-174 文件上传条目 onClick 直调 handleClick 绕过 clickDelayer，菜单不关（中）
- waterfall? -> watermark.jsx:51-52 targets.stage.costume / currentSprite.costume 未判空（中）
- action-menu.jsx:95 setTimeout 未清理（低）
- action-menu.jsx:28 Math.random tooltip id（低）

## 工作流11: tw 功能 UI (5a08103d)
覆盖：tw-see-inside 部分，其余全部未改造（15+ 文件）。
bugs:
- tw-news.jsx:9 newsAppliesToUser=()=>false 死代码（高）
- featured-projects.jsx:96 footer 指向 scratch.mit.edu 矛盾（中）
- description.jsx:14/33/49 链接指向 scratch.mit.edu 品牌（中）
- invalid-embed.jsx:27/33/38 硬编码 turbowarp.org + 废弃 frame 属性（中）
- cloud-variable-badge.jsx:46 无 href <a> 无键盘可达（中）
- cloud-server-button.jsx:21 / browser-modal.jsx:96 / crash-message.jsx:50 原生 button（低）
- coming-soon.jsx:73 / browser-modal.jsx:35 / telemetry-modal.jsx:135 用 react-tooltip/ReactModal 而非 mdui（中）
## 工作流1: mdui wrapper layer (f45bee95)
- menu.jsx:14 `selectable` -> 应为 `selects` (single/multiple) 高
- list.jsx:21-23 list-item 属性错名: title->headline, selected->active, value 不存在 高
- make-component.jsx:218-220 数组/对象 prop 丢弃 中
- tabs disabled 伪造; 缺 variant/placement; 无 tab-panel (中)
- radio name 属 radio-group; checkbox 缺 indeterminate; select 伪 open events; tooltip 缺 open/variant/delay 等
- top-app-bar scrollTarget 仅 string; tabIndex->tab-index 隐患
- dialog/dropdown/snackbar 基本正确

## 工作流2: bootstrap & webpack (bf338284) 尚未返回
## 工作流3: theme system (e9180b18)
- guiHelpers.js:176-182 + mdui-theme/index.js:114-124 setColorScheme 双写/重复; removeColorScheme 后又被 applyGuiColors setColorScheme(accentSeed) 中
- overrides.css:85-91 高 mdui-icon 默认 font-family 'Material Icons' 指向 rounded，且无 FILL 1 -> 描边 icon; Two Tone 未注册
- themePersistance.js:3 matchMedia window 未判空
- themePersistance.js:57 迁移断链: 旧 tw:theme 明暗未迁移 surge:mdui-theme
- overrides.css:69-73 color-scheme 依赖 applyGuiColors 写入, 初始窗口深色下滚动条 flash 低
- mdui-theme/index.js:96-99 rAF + MutationObserver 双重 sync 低

## 工作流5 尚未返回
## 工作流6 尚未返回
## 工作流7 尚未返回
## 工作流8 尚未返回
## 工作流9 stage/target/sprite/monitor (23c4ba67)
覆盖: 无直接 MDUI; 部分间接(button/Input/ActionMenu); target-pane/sprite-list/monitor* 未改造; stage.jsx/containers 不适用
bugs:
- sprite-list.jsx:52 hoveredTarget.sprite 空解引用 中
- list-monitor.jsx:66 / list-monitor-scroller.jsx:93 value.length 未判空 中
- list-monitor-scroller.jsx:56 autoComplete={false} -> autocomplete="false" 低
- sprite-selector-item.jsx contextMenuId 模块级渲染期 ++ 错配 低
- sprite-list.jsx:111-113 propTypes 废弃字段 低

## 工作流10 已记
## 工作流11 已记
## 工作流12 legacy leftovers (0c1b9581)
- 已 MDUI: spinner/loader/progress-ring (3)
- 不适用: box/loupe/time-travel/error-boundary/dom-element-renderer/target-highlight (8)
- 未改: coming-soon(完全), meter(部分), question(半), forms/label (4)
bugs: coming-soon tooltip 橙色冲突; meter mask $ui-primary; question 拼接断裂; forms/label 结构

## 工作流13 containers (9d3e9ae3)
- 78 containers: A5 B62 C5 D6
- C: balanced-text/green-flag-overlay/target-highlight/dom-element-renderer/extension-library 原生 DOM

## 工作流14 CSS tokens / dark mode (9adb4e1f)
高:
- guiHelpers.js ui-white* 映射 surface 语义反转 (92-93,79)
- monitor.css:78,123 / crash-message.css:28 $ui-white 深色反转
- close-button.css:26 / library-item.css:211 / backpack.css:94 $ui-white 作文字色
- stage-selector.css:29,30,35 fallback 旧蓝 冲突; menu-bar.css:20 #4c97ff
中: guiHelpers.js:83 ui-hover foo #ff6b35
::part 全部有效; rgb 包裹正确
Deep-dark top5 上面已列

## 工作流15 尚未返回

## 工作流2: bootstrap & webpack (bf338284)
- 接线整体正确; bootstrap 仅 gui.jsx:56 导入一次; CSS Modules 排除正确; babel include 覆盖浏览器产物
- overrides.css:99-111 缺 'Material Icons Two Tone' @font-face -> two-tone 无字形 中
- webpack.config.js:88 @lit[\/] 不匹配 @lit-labs/ssr-dom-shim (含 ??=) 潜在低
- webpack config 注释矛盾 低(事实正确)

## 工作流6: tw 弹窗外壳 (1440525a)
- 所有 tw 弹窗外壳已 MDUI (Modal->MduiDialog, FancyCheckbox->MduiCheckbox)
- 内容不全: tw-fonts-modal 完成度最高; username/invalid/unknown/feedback/community/restore-point/security-manager 基本原生
- bugs: username 空串可提交; font-name 双击 blur 重复 sanitize、下拉选中被 blur 覆盖; 多处原生 confirm/alert/prompt

## 工作流8: 资产面板/素材库 (46c80816)
覆盖: filter.jsx 已MDUI; library.jsx 部分; asset-panel/selector/sortable-asset/library-item 未MDUI; 容器仅逻辑
bugs:
- filter.css:48 :not([value=""]) 永远真 (mdui value 非 reflect) -> 搜索框宽度收缩失效 中
- library.jsx:130,169 getFilteredData()[[...]] 双括号笔误 低
- library-item.jsx 收藏星原生 button 键盘 Enter 同时触发 onSelect+favorite 中
- library.jsx:9 原生 Divider 未换 MduiDivider 低
- selector/sortable-asset 拖拽原生 div+order 低

## 工作流15: lint/i18n/静态 (959eda80)
- prompt.jsx:76-85 ref 把 instance 当 wrapper, 实际 forwardRef 传 DOM el -> defaultValue 未写入 高
- capture-tests.js:45 mdui-icon-button 应为 mdui-button-icon 中
- capture-tests.js:17 仅中文 转到源代码 中
- run-verify.js:22 mdui-dropdown 点宿主非 trigger; :31 li 选择器脆弱 中
- run-verify/capture-tests 等待+if 静默, 无断言 低
- menu-bar.jsx:597 key=itemProps.title 可能对象 低
- i18n 静态 OK; lint OK

## 工作流5: 通用弹窗 (cdd1ebd0)
覆盖: modal 已; prompt/slider-prompt/question/record-modal 部分; connection-modal 未改造; box 中性
bugs:
- modal.jsx:34 高 closingRef ref 非响应式, 不重置 -> 实例不复用自愈脆弱
- modal.jsx:97-101,110-114 中 X/Back 直调绕过动画
- prompt.jsx:71,76-85 中 defaultValue 死属性 + ref hack 私有 elementRef + !el.value; 
- prompt.jsx:64-72 / slider-prompt 重复 label 中
- prompt.jsx:103-124 radio 双向绑定 低
- question.jsx:32-41 提交按钮原生 中
- recording-step.jsx:64 主按钮原生 中
- connection-modal 全原生 高
- connection-modal.css 旧令牌 中

## 工作流7: 按钮/输入/控件 (837f2b62)
覆盖: button/input/fancy-checkbox/tag-button/filter 已MDUI; direction-picker/controls/label 部分或未改; icon-button/close/delete/play/stop-all/green-flag/toggle-buttons/tw-project-input 未改
bugs:
- 高 make-component.jsx:25-28 onFocus/onBlur 绑定 native focus/blur 不冒泡不跨 shadow, mdui 不重发 -> onBlur/onFocus 永不触发
- 高 buffered-input-hoc.jsx:46 blur 提交失效
- 高 direction-picker.jsx:101 onFocus 打开 popover 失效
- 中 close-button.jsx:22-35 role=button tabIndex 无 onKeyDown
- 低 direction-picker.jsx:98 tabIndex string -> tab-index
- 低 filter.jsx:20 filterQuery.length 无默认
- 修复核心: 改 focusin/focusout; tabindex

## 工作流4: menu-bar (31115272)
覆盖: menu-bar.jsx/settings-menu/language-menu/theme-blocks/accent/alignment/desktop-settings/project-title-input 已MDUI; tw-save-status/author-info/community-button/share-button/user-avatar/tw-see-inside 未改; menu-bar-menu/tw-menu-label/save-status 死代码; tw-surge-theme 部分(submenu 未接 redux)
bugs:
- 中 project-title-input.jsx:30,32 maxLength/tabIndex -> max-length/tab-index 属性失效
- 低 tw-surge-theme.jsx 未 connect, isOpen/onOpenMenu/onCloseMenu 恒 undefined, submenu 不同步
- 低 menu-bar.jsx:407,411 handleClickNew 重复 onRequestCloseFile
- 低 language-menu.jsx:53-56 closeSettingsMenu 双派发
- 低 reducers/menus.js:56,65 MENU_SETTINGS addChild 两次
- 事件/状态无死循环; 子菜单 toggle 正确; Save File 关闭正常; href/target/图标名有效
