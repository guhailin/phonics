<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-02 | Updated: 2026-03-02 -->

# fonts

## Purpose
自定义字体文件目录，包含应用使用的字体资源。

## Key Files
| File | Description |
|------|-------------|
| `SassoonPrimary.otf` | Sassoon Primary 字体，专为儿童阅读设计 |

## Subdirectories
无

## For AI Agents

### Working In This Directory
- 添加新字体时，确保字体文件格式兼容（.otf, .ttf）
- 在 `App.js` 中通过 `useFonts` hook 注册新字体
- 更新所有使用字体的组件以引用新字体名

### Font Usage
- 字体名称：`'SassoonPrimary'`
- 在 StyleSheet 中通过 `fontFamily: 'SassoonPrimary'` 使用
- 所有 Text 组件都应该使用这个字体

## Dependencies

### Internal
- `../../App.js` - 字体加载配置

### External
- `expo-font` - 字体加载库

<!-- MANUAL: -->
