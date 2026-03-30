# Phonics World - 儿童自然拼读学习应用

一款基于 **Oxford Phonics World** 课程体系开发的 React Native 移动应用，帮助儿童学习自然拼读（Phonics）。支持 iOS、Android 和 Web 平台。

![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61dafb)
![Expo](https://img.shields.io/badge/Expo-~54.0.33-000020)

---

## ✨ 功能特点

### 📚 分级课程体系（Level 1-5）
| 等级 | 主题 | 副标题 | 内容 |
|------|------|--------|------|
| **Level 1** | The Alphabet | 字母音 | 26个字母音 |
| **Level 2** | Short Vowels | 短元音 | CVC拼读（a, e, i, o, u）|
| **Level 3** | Long Vowels | 长元音 | Magic E 规则 |
| **Level 4** | Consonant Blends | 辅音组合 | 辅音连读 |
| **Level 5** | Letter Combinations | 字母组合 | 复合字母发音 |

### 🎯 核心功能
- **单词卡片** - 每个 Unit 展示精选单词，配有音标、中文释义和表情符号
- **例句练习** - 160个例句帮助理解单词用法（Level 2-5）
- **语音朗读** - TTS 语音朗读单词和例句，针对尾音自动优化停顿
- **视频教程** - 集成 Bilibili 教育视频（186个视频覆盖全部40个单元）
- **画板练习** - 交互式画板，支持多画笔尺寸和颜色选择
- **复习模式** - 闪卡式复习，巩固学习成果
- **收藏功能** - 收藏喜欢的单词，方便复习
- **学习进度** - 自动保存学习进度

### 🎨 界面特色
- 色彩丰富的分级主题（紫色、绿色、蓝色、橙色、红色）
- 儿童友好的 **SassoonPrimary** 专用字体
- 大字体、大按钮设计，适合儿童操作
- 底部标签导航，直观切换单词/例句/视频/画板
- 支持横竖屏适配

---

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | React Native 0.81.5 + Expo ~54.0.33 |
| **导航** | React Navigation v7 (Stack + Bottom Tabs) |
| **状态管理** | React Context API |
| **存储** | @react-native-async-storage/async-storage |
| **语音** | expo-speech (TTS) |
| **音频/视频** | expo-av, react-native-webview |
| **图形** | react-native-svg (画板) |
| **图标** | react-native-vector-icons |
| **字体** | SassoonPrimary (儿童专用字体) |

---

## 📱 安装与运行

### 环境要求
- Node.js >= 18
- npm 或 yarn
- iOS: Xcode（仅 Mac）
- Android: Android Studio + Android SDK

### 安装步骤

```bash
# 1. 克隆仓库
git clone <repository-url>
cd phonics

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm start
# 或
expo start
```

### 运行应用

```bash
# iOS 模拟器
npm run ios

# Android 模拟器
npm run android

# Web 浏览器
npm run web
```

### Xcode 运行与同步

如果使用 Xcode 直接运行 iOS 工程，常用命令如下：

```bash
# 安装 JS 依赖
npm install

# 刷新 iOS Pods，修复原生依赖路径变化问题
cd ios
pod install
cd ..

# 启动 Expo / Metro，供 Xcode 的 Debug 包加载 JS
npx expo start --dev-client

# 或普通 Expo 开发服务器
npm start

# 重新生成并同步原生 iOS 工程（适合修改 app.json 后）
npx expo run:ios

# 重新预构建 iOS 工程并清理旧原生配置（适合图标、启动图、插件配置变更后）
npx expo prebuild -p ios --clean
```

说明：
- Xcode 运行 `Debug` 时，需要先启动 Metro，否则 App 会报 `No script URL provided`
- Xcode 运行 `Release` 时，会使用内置 bundle，一般不依赖 Metro
- 修改 [app.json](./app.json) 中的 `icon`、`splash`、`plugins` 后，建议执行 `npx expo run:ios` 或 `npx expo prebuild -p ios --clean` 同步到原生工程

---

## 📁 项目结构

```
phonics/
├── App.js                      # 应用入口（导航配置）
├── app.json                    # Expo 配置
├── index.js                    # 主入口
├── package.json                # 依赖管理
├── phonics.md                  # 课程数据源（核心参考）
├── assets/                     # 静态资源（图标、图片、字体）
├── ios/                        # iOS 原生项目
├── android/                    # Android 原生项目
└── src/
    ├── contexts/
    │   └── AppContext.js       # 全局状态管理
    ├── constants/
    │   └── index.js            # 常量（颜色、配置）
    ├── screens/
    │   ├── HomeScreen.js       # 首页（Level 选择）
    │   ├── LevelScreen.js      # 单元列表
    │   ├── UnitScreen.js       # 单词卡片（含底部标签导航）
    │   ├── ReviewScreen.js     # 复习模式
    │   ├── SettingsScreen.js   # 设置（语音调节）
    │   └── FontTestScreen.js   # 字体测试
    ├── services/
    │   ├── SpeechService.js    # 语音服务（TTS）
    │   ├── StorageService.js   # 存储服务
    │   └── VideoService.js     # 视频服务
    ├── components/
    │   ├── BilibiliVideoPlayer.js  # Bilibili 视频播放器
    │   ├── DrawingCanvas.js        # 画板组件
    │   ├── VideoPlayer.js          # 视频播放器
    │   ├── common/                 # 通用UI组件
    │   ├── examples/               # 例句组件
    │   ├── review/                 # 复习模式组件
    │   └── words/                  # 单词卡片组件
    └── assets/data/
        ├── phonicsData.js      # 课程数据（768精选）
        ├── wordInfo.js         # 单词音标和释义
        ├── bilibiliVideos.js   # Bilibili视频映射（186个）
        └── videoInfo.js        # 视频元数据
```

---

## 🎯 数据说明

### 核心数据文件

| 文件 | 说明 | 数据量 |
|------|------|--------|
| `phonics.md` | 课程数据参考文档（唯一数据源） | - |
| `phonicsData.js` | 主数据结构 | 768 精选单词 |
| `wordInfo.js` | 单词音标和中文释义 | 768 条 |
| `bilibiliVideos.js` | Bilibili视频ID映射 | 186 个视频 |

### 数据结构示例

```javascript
{
  id: 'unit1',
  name: 'Unit 1: Short a',
  patterns: ['a', 'am', 'an'],      // 发音模式（决定显示顺序）
  words: [
    { word: 'ant', highlight: 'a', emoji: '🐜' },
    { word: 'yam', highlight: 'am', emoji: '🍠' },
    // ...
  ],
  examples: [ /* 例句（HTML格式） */ ]
}
```

---

## 🔊 语音功能

应用使用 `expo-speech` 提供 TTS 功能，针对儿童学习进行了特别优化：

- **语速调节**: 0.1 - 0.8（默认 0.35，适合儿童学习）
- **音调**: 1.0（自然音调）
- **智能停顿**: 自动检测尾音（p, t, k, s等），添加额外停顿确保清晰
- **语音偏好**: Premium > Enhanced > Compact
- **默认语音**: Samantha (en-US) 或最佳可用英语语音

---

## 🎬 视频功能

- **186个教育视频** 映射到全部40个单元
- 通过 Unit 页面的 **Videos** 标签访问
- 使用 Bilibili 嵌入式播放器
- 支持自动播放

---

## 🎨 画板功能

- 交互式矢量画板，使用 react-native-svg
- 支持多画笔尺寸选择
- 颜色选择器
- 一键清除功能

---

## 🔧 开发指南

### 添加新单词

1. 参考 `phonics.md` 确认单词和发音模式
2. 在 `phonicsData.js` 的对应 Unit 中添加单词
3. 在 `wordInfo.js` 中添加音标和释义

### 修改主题颜色

编辑 `src/constants/index.js` 中的 `LEVEL_COLORS`：

```javascript
LEVEL_COLORS = {
  level1: '#9C27B0', // 紫色 - 字母音
  level2: '#4CAF50', // 绿色 - 短元音
  level3: '#2196F3', // 蓝色 - 长元音
  level4: '#FF9800', // 橙色 - 辅音组合
  level5: '#F44336', // 红色 - 字母组合
}
```

### 清除缓存

```bash
# 清除 Expo 缓存
npx expo start --clear

# 重置 node_modules 缓存
rm -rf node_modules/.cache
```

---

## 📋 课程统计

| 等级 | Units | 精选单词 | 例句 | 视频 |
|------|-------|----------|------|------|
| Level 1 | 8 | 100 | - | 38 |
| Level 2 | 8 | 150 | 160 | 35 |
| Level 3 | 8 | 150 | 160 | 40 |
| Level 4 | 8 | 200 | 160 | 38 |
| Level 5 | 8 | 168 | 160 | 35 |
| **总计** | **40** | **768** | **640** | **186** |

---

## 🔄 从 Web 迁移到 React Native

本项目已从纯 Web 前端迁移到 React Native：

| Web (旧版) | React Native (当前) |
|-----------|---------------------|
| Vanilla JS + HTML + CSS | React Native + Expo |
| Web Speech API | expo-speech |
| LocalStorage | @react-native-async-storage/async-storage |
| DOM 操作 | React 组件 |
| CSS 样式 | StyleSheet |
| index.html 页面 | React Navigation 屏幕 |

---

## 📄 许可证

MIT License

---

## 🙏 致谢

- 课程内容基于 **Oxford Phonics World**
- 字体：**SassoonPrimary**（儿童专用字体）
- 图标来自 [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons)
- 开发框架 [Expo](https://expo.dev/)
- 视频内容来自 Bilibili
