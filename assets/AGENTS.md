<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-02 | Updated: 2026-03-02 -->

# assets

## Purpose
应用静态资源目录，包含图标、启动画面、字体等资源文件。

## Key Files
| File | Description |
|------|-------------|
| `icon.png` | 应用图标 (1024x1024) |
| `adaptive-icon.png` | Android 自适应图标 |
| `favicon.png` | Web 端 favicon |
| `splash-icon.png` | 启动画面图标 |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `fonts/` | 自定义字体文件 |

## For AI Agents

### Working In This Directory
- 字体文件放在 `fonts/` 子目录中
- 图片资源直接放在此目录
- 在 `app.json` 中配置资源引用

### Font Configuration
- 当前使用 `SassoonPrimary.otf` 作为主要字体
- 在 `App.js` 中通过 `expo-font` 的 `useFonts` hook 加载
- 所有 Text 组件应使用 `fontFamily: 'SassoonPrimary'`

## Dependencies

### Internal
- `../App.js` - 字体加载配置
- `../app.json` - Expo 资源配置

### External
- `expo-font` - 字体加载库

<!-- MANUAL: -->
