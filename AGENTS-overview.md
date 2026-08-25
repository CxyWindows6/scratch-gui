# AGENTS-overview.md — 项目总览

## 项目身份
- **Surge Editor / scratch-gui（TurboWarp fork）**：基于 Scratch 3.0 GUI 的图形化编程编辑器
- 技术栈：React 16 + Redux 3 + Webpack 4 + PostCSS（CSS Modules，camelCase from kebab）+ Jest 29 + Enzyme
- 库入口：`src/index.js`；开发入口：`src/playground/editor.jsx`、`player.jsx` 等
- `src/lib/brand.js` 设置 `APP_NAME: 'TurboWarp'`（不是 Scratch）
- `tw-*` 前缀文件是 TurboWarp 特有；其余为上游 scratch-gui
- 依赖 GitHub 托管的 scratch-* 包（`scratch-vm`、`scratch-blocks`、`scratch-render` 等）
- 项目是 git 仓库

## 顶层结构
- **源码**：`src/`（React/Redux 应用、addons、`tw-*` 扩展）
- **测试**：`test/`（unit / integration / smoke；Jest + Enzyme）
- **翻译**：`translations/`（babel 提取的英文源词条 + i18n 配置）
- **构建配置**：`webpack.config.js`、`.babelrc`、`.browserslistrc`、`build.bat` / `dev.bat`
- **CI/发布**：`.github/workflows/node.js.yml`、`release.config.js`
- **生成物**：`build/`（站点/示例输出）、`dist/`（UMD 库输出），均勿手改
- **其他**：`docs/`、`static/`、`scripts/`、`patches/`（patch-package 补丁）

## 常用命令
| 命令 | 作用 |
| --- | --- |
| `npm start` | 本地开发服务器（默认 8601；`dev.bat` 同） |
| `npm run build` | 清理 build/dist 后 webpack 生产构建；`BUILD_MODE=dist npm run build` 额外输出库文件 |
| `npm run test:lint` | ESLint `. --ext .js,.jsx` |
| `npm run test:unit` | Jest `test/unit/addons`（仅 addon 测试） |
| `npm run test:integration` | Jest `test/integration` — 需先 `npm run build`，使用 chromedriver |
| `npm run test:smoke` | Jest `--runInBand test/smoke` |
| `npm test` | 完整流水线：lint → unit → build → integration（慢；CI 只跑 build+unit） |
| `npm run i18n:src` / `npm run i18n:push` | 提取英文词条 / 推送 Transifex |
| `npm run deploy` | gh-pages 部署 `build/` |
| `npm run prune` | 清理 gh-pages 上无对应远程分支的旧目录 |

## 架构要点
- 项目加载使用有限状态机：`src/reducers/project-state.js`
- Addon 系统：`src/addons/` 内建，来自 Scratch Addons（`pull.js`）；`src/addons/generated/` 自动生成，**禁止手改**；addon 懒加载（见 `src/addons/generated/addon-entries.js`）
- 样式：CSS Modules + PostCSS（camelCase from kebab）
- 测试：Jest + Enzyme（React 16 adapter），setup 为 `raf/polyfill` + `test/helpers/enzyme-setup.js`；不是 React Testing Library

## 风格 / 约定
- ESLint：`eslint-config-scratch`，extends `['scratch', 'scratch/node', 'scratch/es6']`
- 提交：conventional commits（commitlint `@commitlint/config-conventional`）
- 发布：`scratch-semantic-release-config`，分支 `develop`（默认）、`beta`（prerelease）、`hotfix/*`
- Windows 上测试脚本用 pwsh 运行，不要用 Git Bash/MINGW64

## i18n
- `react-intl` 2.x + babel 插件提取消息到 `translations/messages/`
- `@turbowarp/scratch-l10n` 替代上游 l10n；**来源 = 自己的 fork `github:CxyWindows6/scratch-l10n#new`**（2026-08 起，不再用 npm registry 版本）
- `babel-plugin-react-intl` 要求 `<FormattedMessage>` 的 `defaultMessage` / `description` / `id` **静态可求值**。不要用模板字符串、三元表达式或变量；用 `defineMessages({key: {defaultMessage, description, id}})` 后展开 `{...messages[key]}`

### 翻译流水线（自管，2026-08 起；旧 Transifex 流程已停用）
翻译主仓库是 gui 的兄弟目录 `..\scratch-l10n`（fork `CxyWindows6/scratch-l10n`，分支 `new`，构建产物有意入库；仓库细节见 `AGENTS-repo.md`）。

```
源代码 defineMessages (英文 defaultMessage)
    │
    ▼ npm run i18n:src（babel 提取 → build-i18n-src 聚合）
translations/en.json（英文原文，供翻译参考）
    │
    ▼ 手动翻译：编辑 ../scratch-l10n/editor/<component>/<locale>.json
    │   component = interface / blocks / extensions / paint-editor
    │   key = react-intl 消息 id（如 gui.menuBar.file）
    ▼ cd ../scratch-l10n && npm install && npm run build
locales/*.js + dist/* 构建产物 → git add locales dist → commit → push origin new
    │
    ▼ scratch-gui 里执行 npm update @turbowarp/scratch-l10n
node_modules/@turbowarp/scratch-l10n ← 运行时读取（lockfile 锁定 fork SHA）
```

**新增词条必踩的坑**：`../scratch-l10n/scripts/build-data.js` 构建时按 `scripts/tw-all-used-ids.json` 白名单**裁掉不在清单内的消息 id**。新词条（如 `surge.*` 或新 `tw.*`）除了写进 editor json，还必须把 id 同步追加进该清单，否则构建时被静默删除。

运行时合并链（`src/reducers/locales.js`）：editor-msgs 基础译文（来自 fork 包）→ `generated-translations.json`（历史 tw:pull 产物，仅含旧 `tw.*` 词条，冻结不再维护）。

| 文件 | 角色 |
| --- | --- |
| `translations/messages/src/**/*.json` | babel 提取的英文源词条（`id` + `defaultMessage` + `description`），`i18n:src` 的输出 |
| `../scratch-l10n/editor/<component>/<locale>.json` | **各语言译文的正式维护处** |
| `../scratch-l10n/scripts/tw-all-used-ids.json` | 词条 id 白名单，新增词条必须同步 |
| `src/lib/tw-translations/generated-translations.json` | 自动生成产物，勿手改 |
| `src/lib/tw-translations/index.js` | 运行时将 `generated-translations.json` 合并进 `editorMessages`；es-419 复用 es |

### LOCAL_OVERRIDES（已废除）
2026-08 起彻底移除：**任何译文一律走上述 fork 流水线**，临时试验也不例外（构建只需十几秒）。

### 已停用的旧流程
Transifex 全链路（`npm run i18n:push`、`tw:push`、`tw:pull`）不再使用；`i18n:src` 仅用于提取英文原文供参考。若将来恢复需配置 TX_TOKEN。

## 详细约定（按需读分册）
- 环境/工具要点 → `.dsh/skills/env-environment/SKILL.md`（根目录 `AGENTS-environment.md` 为指针页）
- 工作流与门禁 → `.dsh/skills/env-workflow/SKILL.md`（根目录 `AGENTS-workflow.md` 为指针页）
- 部署/发布 → `.dsh/skills/env-network/SKILL.md`（根目录 `AGENTS-network.md` 为指针页）
- 仓库/上游同步 → `AGENTS-repo.md`（远程结构、推送规则、各 fork 同步上游流程）
- UI 组件 → `.dsh/skills/mdui/SKILL.md`（创建/修改/检查任何 mdui UI）