<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-25 | Updated: 2026-02-25 -->

# services

## Purpose
服务层目录，提供语音、存储等核心功能的封装。

## Key Files
| File | Description |
|------|-------------|
| `SpeechService.js` - 文本转语音服务（TTS），使用 expo-speech |
| `StorageService.js` - 存储服务，封装 @react-native-async-storage/async-storage |

## Subdirectories
无

## For AI Agents

### Working In This Directory
- 使用服务包装器，不要直接调用底层库
- 在 App 启动时初始化 SpeechService
- 从 `constants/index.js` 导入存储键名

### SpeechService Features
- 语音优先级：Premium > Enhanced > Compact
- 默认语音：Samantha (en-US) 或最佳可用英语语音
- 语速：0.35（非常慢，用于儿童学习）
- 音调：1.0（自然）
- 智能文本处理：
  - 检测词尾的清辅音（p, t, k, s, f, sh, ch, th）
  - 为清辅音结尾的单词添加额外停顿
  - 为其他单词添加适度停顿

### StorageService Keys
- `@phonics_speech_config` - 语音设置
- `@phonics_favorites` - 收藏的单词
- `@phonics_progress` - 学习进度

## Dependencies

### Internal
- `../constants/index.js` - 默认语音配置和存储键名

### External
- expo-speech - 文本转语音
- @react-native-async-storage/async-storage - 持久化存储

<!-- MANUAL: -->
