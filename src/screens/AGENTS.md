<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-25 | Updated: 2026-02-25 -->

# screens

## Purpose
应用的屏幕组件目录，包含所有主要页面。

## Key Files
| File | Description |
|------|-------------|
| `HomeScreen.js` | 级别选择页面（Level 1-5） |
| `LevelScreen.js` | 单元选择页面（选中级别后的单元列表） |
| `UnitScreen.js` | 单词卡片和例句页面（包含单词和例句两个标签页） |
| `ReviewScreen.js` | 抽认卡复习模式 |
| `ExploreScreen.js` | 扩展单词探索 |
| `SettingsScreen.js` | 应用设置（语音配置等） |
| `FontTestScreen.js` | 字体测试页面（用于调试字体显示） |

## Subdirectories
无

## For AI Agents

### Working In This Directory
- 使用 React Navigation hooks 进行导航
- 使用 `useApp()` hook 访问全局状态
- 屏幕组件应该是纯函数组件
- 使用 StyleSheet.create 定义样式

### Navigation Flow
```
Home (Stack Navigator root)
├── HomeScreen           → 选择级别 (1-5)
├── LevelScreen          → 选择单元
├── UnitScreen           → 单词卡片 + 例句 (Tab Navigator)
├── ReviewScreen         → 复习模式
├── ExploreScreen        → 探索模式
└── SettingsScreen       → 设置页面
```

### Common Patterns
- 使用 route.params 传递数据
- 使用 SafeAreaView 处理安全区域
- 使用 TouchableOpacity 处理用户交互
- 从 `constants/index.js` 导入颜色和名称

## Dependencies

### Internal
- `../contexts/AppContext.js` - 全局状态
- `../constants/index.js` - 常量
- `../assets/data/phonicsData.js` - 课程数据
- `../assets/data/wordInfo.js` - 单词信息

### External
- React Navigation v7 - 导航
- React Native 组件 - UI

<!-- MANUAL: -->
