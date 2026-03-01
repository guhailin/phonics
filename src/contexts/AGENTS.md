<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-25 | Updated: 2026-02-25 -->

# contexts

## Purpose
React Context 状态管理目录，提供应用的全局状态。

## Key Files
| File | Description |
|------|-------------|
| `AppContext.js` | 主应用 Context，提供全局状态和方法 |

## Subdirectories
无

## For AI Agents

### Working In This Directory
- 使用 `useApp()` hook 访问 Context
- 在添加新状态前，先考虑是否真的需要全局状态
- 保持 Context 提供者在应用树的高层

### AppContext State
当前提供的状态：
- `currentLevel` - 当前选中的级别
- `currentUnit` - 当前选中的单元
- `speechConfig` - 语音配置（语速、音调等）
- `favorites` - 收藏的单词
- `isLoading` - 加载状态

### AppContext Actions
- `setCurrentLevel()` - 设置当前级别
- `setCurrentUnit()` - 设置当前单元
- `updateSpeechConfig()` - 更新语音配置
- `speakWord()` - 朗读单词
- `toggleFavorite()` - 切换收藏

## Dependencies

### Internal
- `../constants/index.js` - 默认语音配置
- `../services/SpeechService.js` - 语音服务
- `../services/StorageService.js` - 存储服务

### External
- React Context API

<!-- MANUAL: -->
