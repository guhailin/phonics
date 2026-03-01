<!-- Generated: 2026-02-25 | Updated: 2026-02-25 -->

# phonics_rn

## Purpose
React Native 移动应用，基于 Oxford Phonics World 课程（Level 1-5）教儿童自然拼读。从纯 Web 前端项目迁移到 React Native + Expo。

**重要要求**：单词卡片和例句必须严格遵循 `phonics.md` 中定义的数据和顺序。这是所有内容的唯一事实来源。

## Key Files
| File | Description |
|------|-------------|
| `App.js` | 应用入口点，包含导航设置 |
| `app.json` | Expo 配置 |
| `index.js` | 主入口文件 (expo/AppEntry) |
| `package.json` | 项目依赖和脚本 |
| `CLAUDE.md` | Claude Code 项目指南 |
| `phonics.md` | 课程数据的事实来源 |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `assets/` | 静态资源（图片、字体等） |
| `src/` | 应用源代码（见 `src/AGENTS.md`） |

## For AI Agents

### Working In This Directory
- 运行应用前先安装依赖：`npm install`
- 使用 `npm start` 启动 Expo 开发服务器
- 在修改课程数据前，始终先阅读 `phonics.md`
- 保持 `phonics.md` → `phonicsData.js` → UI 的数据一致性

### Testing Requirements
- 在 iOS/Android 模拟器或实际设备上测试
- 验证语音功能（TTS）能正常工作
- 检查所有 5 个级别的单词卡片和例句

### Common Patterns
- 使用 React Context API 进行状态管理
- 使用 `SpeechService` 进行 TTS，不要直接调用 expo-speech
- 使用 `StorageService` 包装 AsyncStorage
- 从 `constants/index.js` 导入颜色和名称

## Dependencies

### Internal
- `src/contexts/AppContext.js` - 全局状态管理
- `src/constants/index.js` - 应用常量
- `src/assets/data/phonicsData.js` - 核心课程数据

### External
- React 19.1.0 - UI 框架
- React Native 0.81.5 - 移动应用框架
- Expo ~54.0.33 - 开发平台
- React Navigation v7 - 导航库
- expo-speech - 文本转语音
- @react-native-async-storage/async-storage - 持久化存储

<!-- MANUAL: -->
