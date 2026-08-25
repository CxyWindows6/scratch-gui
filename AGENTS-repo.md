# AGENTS-repo.md — 仓库与上游同步

> 分册：远程结构、推送规则、各 fork 同步上游流程。由 `AGENTS.md` 参考文档索引按需引入。

## 铁律（最高优先）
- **绝不推送到 TurboWarp 官方仓库**（`github.com/TurboWarp/*`）：官方零接触，只 fetch、不 push。
- 自己的 fork 是唯一推送目标（全部在 `CxyWindows6/` 名下）。

## 仓库布局（全部位于 `C:\Users\MSDN\Desktop\code\Surge Editor\`）

| 仓库 | 本地推送分支 | gui 依赖接线 | 上游跟踪分支 |
| --- | --- | --- | --- |
| scratch-gui | `main` | （本体） | develop |
| scratch-l10n | `new` | `github:CxyWindows6/scratch-l10n#new` | new |
| scratch-vm | `surge-editor` | `github:CxyWindows6/scratch-vm#surge-editor` | develop |
| scratch-audio | `develop` | `github:CxyWindows6/scratch-audio#develop` | develop |
| scratch-blocks | `develop-builds` | `github:CxyWindows6/scratch-blocks#develop-builds` | develop |
| scratch-paint | `develop` | `github:CxyWindows6/scratch-paint#develop` | develop |
| scratch-render | `develop` | `github:CxyWindows6/scratch-render#develop` | develop |

- 未走 fork 的依赖：`@turbowarp/scratch-storage`、`@turbowarp/scratch-svg-renderer`（仍为 npm registry 版本）
- 各 fork 均已配置 `upstream` 指向官方（只 fetch 不 push）；gui 的 upstream pushurl 已禁用（指向 `https://invalid.invalid/dsh-no-push`，双保险）
- **scratch-gui 仓库级 git 配置含 SSH→HTTPS 重写**（`url."https://github.com/".insteadOf ssh://…`）：本机无 SSH key，npm 对 github 依赖的取回依赖它，**勿删**

## 提交规范
- Conventional Commits：`type(scope): 描述`；常用 type：`feat` / `fix` / `chore` / `docs` / `refactor` / `perf` / `test`
- l10n 产物更新固定用：`chore: rebuild translation artifacts`

## 同步上游通用流程（在各 fork 目录执行）
```sh
git fetch upstream
git merge upstream/<上表"上游跟踪分支">
# 有冲突则解决后提交，然后：
git push origin <本地推送分支>
```
- gui 合并后执行 `npm install`（上游可能改了依赖）
- vm 推送新提交后，gui 需 `npm update scratch-vm` 才生效
- l10n 合并后必须重建产物并提交（见下节）

## gui 特有
- 分支 `main`：真祖先历史（上游 develop + 自定义提交，自 `844fc57` 起）——与上游可正常 merge/rebase
- `backup/pre-sync-main`：迁移前旧快照——**勿删勿推**
- 只推 `origin main`

## l10n 特殊策略（翻译主仓库）
- 日常翻译流程与 used-ids 白名单坑见 `AGENTS-overview.md` i18n 节
- **特殊策略：构建产物入库**——`locales/` 与 `dist/` 有意提交（`.gitignore` 已放行），使 gui 能直接以 GitHub 依赖安装而无需发布 npm
- 同步上游后：先解决源文件冲突 → `npm run build` → 提交产物（`chore: rebuild translation artifacts`）→ 推送
- 本地 git identity（仅该仓库级）：`CxyWindows6 <CxyWindows6@users.noreply.github.com>`

## 注意
- 本地杂物与 agent 配置（`logs/`、`.playwright-mcp/`、根级 `*.png`、临时脚本、`.dsh/` 整个目录）已列入 `.gitignore`；`AGENTS-*.md` 随仓库提交
- 改依赖版本或某 fork 推送新提交后，如需立即在 gui 生效，执行对应 `npm update <包名>` 并确认 `package-lock.json` 锁定 SHA
