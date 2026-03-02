# Phonics - 儿童自然拼读学习应用

一款基于 **Oxford Phonics World** 课程体系开发的 React Native 移动应用，帮助儿童学习自然拼读（Phonics）。支持 iOS、Android 和 Web 平台。

![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61dafb)
![Expo](https://img.shields.io/badge/Expo-~54.0.33-000020)

---

## ✨ 功能特点

### 📚 分级课程体系（Level 1-5）
| 等级 | 主题 | 内容 |
|------|------|------|
| **Level 1** | The Alphabet | 26个字母音 |
| **Level 2** | Short Vowels | 短元音（a, e, i, o, u）|
| **Level 3** | Long Vowels | 长元音（Magic E）|
| **Level 4** | Consonant Blends | 辅音组合 |
| **Level 5** | Letter Combinations | 字母组合 |

### 🎯 核心功能
- **单词卡片** - 每个 Unit 展示精选单词，配有音标、中文释义和表情符号
- **例句练习** - 每个单词配有例句，帮助理解用法
- **语音朗读** - 支持 TTS 语音朗读单词和例句（可调节语速）
- **复习模式** - 闪卡式复习，巩固学习成果
- **探索模式** - 更多扩展单词，拓展词汇量
- **学习进度** - 自动保存学习进度

### 🎨 界面特色
- 色彩丰富的分级主题（紫色、绿色、蓝色、橙色、红色）
- 适合儿童的大字体、大按钮设计
- 直观的手势操作和导航
- 支持横竖屏适配

---

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | React Native 0.81.5 + Expo ~54.0.33 |
| **导航** | React Navigation v7 |
| **状态管理** | React Context API |
| **存储** | @react-native-async-storage/async-storage |
| **语音** | expo-speech (TTS) |
| **音频** | expo-av |
| **图标** | react-native-vector-icons |

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
cd phonics_rn

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

---

## 📁 项目结构

```
phonics_rn/
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
    │   ├── UnitScreen.js       # 单词卡片
    │   ├── ReviewScreen.js     # 复习模式
    │   ├── ExploreScreen.js    # 探索模式
    │   └── SettingsScreen.js   # 设置
    ├── services/
    │   ├── SpeechService.js    # 语音服务
    │   └── StorageService.js   # 存储服务
    └── assets/data/
        ├── phonicsData.js      # 课程数据
        └── wordInfo.js         # 单词音标和释义
```

---

## 🎯 数据说明

### 核心数据文件

| 文件 | 说明 | 数据量 |
|------|------|--------|
| `phonics.md` | 课程数据参考文档 | - |
| `phonicsData.js` | 主数据结构 | 768 精选单词 + 820 扩展单词 |
| `wordInfo.js` | 单词音标和中文释义 | 768 条 |

### 数据结构示例

```javascript
{
  id: 'unit1',
  name: 'Unit 1: Short a',
  patterns: ['a', 'am', 'an'],      // 发音模式
  words: [
    { word: 'ant', highlight: 'a', emoji: '🐜' },
    { word: 'yam', highlight: 'am', emoji: '🍠' },
    // ...
  ],
  exploreWords: [ /* 扩展单词 */ ],
  examples: [ /* 例句 */ ]
}
```

---

## 🔊 语音功能

应用使用 `expo-speech` 提供 TTS 功能：

- **语速调节**: 0.1 - 0.8（默认 0.35，适合儿童学习）
- **音调**: 1.0（自然音调）
- **智能停顿**: 针对尾音（如 t, p, k）自动添加额外停顿
- **语音偏好**: Premium > Enhanced > Compact

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
  level1: '#9C27B0', // 紫色
  level2: '#4CAF50', // 绿色
  // ...
}
```

### 清除缓存

```bash
# 清除 Expo 缓存
npx expo start --clear

# 重置 node_modules
rm -rf node_modules/.cache
```

---

## 📋 课程统计

| 等级 | Units | 精选单词 | 扩展单词 | 例句 |
|------|-------|----------|----------|------|
| Level 1 | 8 | ~100 | ~100 | - |
| Level 2 | 8 | ~150 | ~150 | 160 |
| Level 3 | 8 | ~150 | ~150 | - |
| Level 4 | 8 | ~200 | ~200 | - |
| Level 5 | 8 | ~168 | ~220 | - |
| **总计** | **40** | **768** | **820** | **160** |

---

## 📄 许可证

MIT License

---

## 🙏 致谢

- 课程内容基于 **Oxford Phonics World**
- 图标来自 [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons)
- 开发框架 [Expo](https://expo.dev/)
