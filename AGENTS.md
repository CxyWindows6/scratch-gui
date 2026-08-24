# AGENTS.md - scratch-gui (TurboWarp fork)

## Commands

| Command | What it does |
|---|---|
| `npm start` | Dev server on port 8601 (`build.bat`, `dev.bat` for Windows) |
| `npm run build` | Production build (`BUILD_MODE=dist npm run build` for library output) |
| `npm run test:lint` | ESLint `. --ext .js,.jsx` |
| `npm run test:unit` | Jest `test/unit/addons` (only addon tests) |
| `npm run test:integration` | Jest `test/integration` — **requires `npm run build` first**, uses chromedriver |
| `npm run test:smoke` | Jest `--runInBand test/smoke` |
| `npm test` | Full pipeline: lint → unit → build → integration (slow; CI only runs build+unit) |
| `npm run build` then `npm run test:integration` | Correct order for integration tests |
| `npm run test:unit -- --watch` | Watch mode for unit tests |

**CI** (`.github/workflows/node.js.yml`): `npm ci` → `npm run build` → `npm run test:unit`. Uses Node 22. `.nvmrc` says v24.

## Architecture

- **React 16** + **Redux 3** + **Webpack 4** + **PostCSS** (CSS Modules, camelCase from kebab)
- **Enzyme** with React 16 adapter for tests (not React Testing Library)
- **jest 29**, setup: `raf/polyfill` + `test/helpers/enzyme-setup.js`
- Library entrypoint: `src/index.js`. Dev server entrypoints: `src/playground/editor.jsx` etc.
- `src/lib/brand.js` sets `APP_NAME: 'TurboWarp'` (not Scratch)
- `tw-*` prefixed files are TurboWarp-specific; everything else is upstream scratch-gui
- Project loading uses a finite state machine in `src/reducers/project-state.js`
- Depends on GitHub-hosted scratch-* packages (`scratch-vm`, `scratch-blocks`, `scratch-render`, etc.)

## Addon system

- `src/addons/` is a built-in addon system pulled from Scratch Addons via `pull.js`
- `src/addons/generated/` — auto-generated, **do not edit by hand**
- Unit tests only cover addon settings (`test/unit/addons/settings.test.js`)
- Addons are loaded lazily via dynamic imports (see `src/addons/generated/addon-entries.js`)

## Style / conventions

- ESLint: `eslint-config-scratch`, extends `['scratch', 'scratch/node', 'scratch/es6']`
- Commit: conventional commits via commitlint (`@commitlint/config-conventional`)
- Release: `scratch-semantic-release-config`, branches: `develop` (default), `beta` (prerelease), `hotfix/*`
- Tests use Jest + Enzyme with `react-test-renderer` and `redux-mock-store`
- On Windows, run test scripts in `cmd.exe`, **not** Git Bash/MINGW64

## i18n

- `react-intl` 2.x with babel plugin extracting messages to `translations/messages/`
- Transifex: `npm run i18n:push` / `npm run i18n:src`
- `@turbowarp/scratch-l10n` replaces upstream l10n
- `babel-plugin-react-intl` requires `defaultMessage`/`description`/`id` on `<FormattedMessage>` to be **statically evaluate-able**. NEVER use template literals, ternary expressions, or variables for these props. Use `defineMessages({key: {defaultMessage, description, id}})` and spread `{...messages[key]}` instead.

### TurboWarp `tw.*` translation pipeline

```
源代码 defineMessages (英文 defaultMessage)
    │
    ▼ npm run i18n:src (babel 提取 → build-i18n-src 聚合)
    │
translations/en.json (所有英文原文)
    │
    ▼ @turbowarp/scratch-l10n 的 tw:push
    │
Transifex (turbowarp 项目, guijson 资源) ← 在此翻译
    │
    ▼ @turbowarp/scratch-l10n 的 tw:pull
    │
src/lib/tw-translations/generated-translations.json ← 编译产物，勿直接编辑
```

| 文件 | 角色 |
|---|---|
| `translations/messages/src/**/*.json` | babel 提取的英文源词条（`id` + `defaultMessage` + `description`），是 `tw:push` 的输入 |
| `src/lib/tw-translations/generated-translations.json` | 自动生成，由 `@turbowarp/scratch-l10n` 管理（`README.md` 有说明），**手动编辑会被 `tw:pull` 覆盖** |
| `src/lib/tw-translations/index.js` | 运行时将 `generated-translations.json` 合并进 `editorMessages` |

### 添加本地译文（未推至 Transifex 时的临时方案）

在 `src/lib/tw-translations/index.js` 中有一个 `LOCAL_OVERRIDES` 对象，合并顺序在 `generated-translations.json` 之后。当 `tw.*` 词条尚未推至 Transifex 时，在此添加译文不会被 `tw:pull` 覆盖。等词条正式上线 Transifex 并 pull 回来后，从 `LOCAL_OVERRIDES` 移除对应条目即可。
