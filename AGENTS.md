# AGENTS.md — 参考文档索引

> 本文件只是索引。详细内容在各分册中，建议按需读取，不必预先读完。

## 铁律
- 命令用 run_command 执行；用户自己的常驻进程（如 8601 dev server）不擅自停止
- 只改应用本体（`src/`、`static/`、`scripts/`、`test/`、`translations/`、`docs/`、`patches/`、`webpack.config.js`、`package.json` 等），不动 `build/`、`dist/`、`node_modules/` 等生成物
- `src/addons/generated/` 是自动生成目录，**禁止手改**
- 项目是 git 仓库；不擅自执行强制推送/重置等破坏性 git 操作
- i18n 词条：`<FormattedMessage>` 的 `defaultMessage` / `description` / `id` 必须静态可求值；禁止模板字符串、三元表达式或变量，用 `defineMessages` + 展开
- Windows 下测试脚本用 `pwsh`，不要用 Git Bash/MINGW64

## 参考文档索引（按需读）
| 主题 | 文件 | 何时读 |
| --- | --- | --- |
| 环境/工具 | `.dsh/skills/env-environment/SKILL.md`（根目录 `AGENTS-environment.md` 为指针页） | 涉及 browser_*/mtl_* 工具、Node/npm/Windows shell 或浏览器验证 |
| 工作流 | `.dsh/skills/env-workflow/SKILL.md`（根目录 `AGENTS-workflow.md` 为指针页） | 执行命令/改动范围/测试门禁 |
| 部署/发布 | `.dsh/skills/env-network/SKILL.md`（根目录 `AGENTS-network.md` 为指针页） | CI/release/gh-pages 部署/构建产物 |
| 项目总览 | `AGENTS-overview.md` | 需要项目全貌、架构、i18n 或命令速查 |
| 仓库/上游同步 | `AGENTS-repo.md` | 远程结构、推送规则、各 fork 同步上游流程 |
| UI 组件 | `.dsh/skills/mdui/SKILL.md` | 创建/修改/检查任何 mdui UI |