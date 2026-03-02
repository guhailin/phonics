<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-02 | Updated: 2026-03-02 -->

# components

## Purpose
可复用 React 组件目录，包含视频播放器等 UI 组件。

## Key Files
| File | Description |
|------|-------------|
| `VideoPlayer.js` | 视频播放器组件，使用 expo-av 播放视频 |

## Subdirectories
无

## For AI Agents

### Working In This Directory
- 组件应该是可复用的、无状态的或自包含的
- 使用 props 传递数据和回调
- 所有 Text 组件应使用 `fontFamily: 'SassoonPrimary'`

### VideoPlayer Component
- 使用 `expo-av` 的 Video 组件
- 支持 Modal 模式显示
- 提供播放/暂停控制
- 处理视频加载错误和重试
- Props:
  - `videoFile` - 视频文件名
  - `visible` - 是否显示 Modal
  - `onClose` - 关闭回调

## Dependencies

### Internal
- 被 `../screens/UnitScreen.js` 使用

### External
- `expo-av` - 视频播放库
- React Native Modal - 模态框组件

<!-- MANUAL: -->
