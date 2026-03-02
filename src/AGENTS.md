<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-25 | Updated: 2026-03-02 -->

# src

## Purpose
应用源代码目录，包含所有 React Native 组件、屏幕、服务和数据文件。

## Key Files
无（这是一个容器目录）

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `assets/` | 静态资源和数据文件（见 `assets/AGENTS.md`） |
| `components/` | 可复用 React 组件（见 `components/AGENTS.md`） |
| `constants/` | 应用常量定义（见 `constants/AGENTS.md`） |
| `contexts/` | React Context 状态管理（见 `contexts/AGENTS.md`） |
| `screens/` | 应用屏幕组件（见 `screens/AGENTS.md`） |
| `services/` | 服务层（语音、存储等）（见 `services/AGENTS.md`） |

## For AI Agents

### Working In This Directory
- 遵循 `CLAUDE.md` 中的开发指南
- 保持数据一致性：`phonics.md` → `phonicsData.js` → UI
- 使用从 `constants/index.js` 导入的颜色和名称
- 使用服务包装器，不要直接调用底层库

### Common Patterns
- 使用 `useApp()` hook 访问全局状态
- 使用 React Navigation hooks 进行导航
- 使用 StyleSheet.create 进行样式定义

## Dependencies

### Internal
- `App.js` - 根组件和导航设置
- `CLAUDE.md` - 项目开发指南

<!-- MANUAL: -->
