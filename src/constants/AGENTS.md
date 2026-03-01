<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-25 | Updated: 2026-02-25 -->

# constants

## Purpose
存储应用常量定义，包括颜色、名称、配置等。

## Key Files
| File | Description |
|------|-------------|
| `index.js` | 所有常量的导出文件 |

## Subdirectories
无

## For AI Agents

### Working In This Directory
- 在添加新常量前，先检查是否已存在
- 保持常量命名使用大写和下划线（如 LEVEL_COLORS）
- 从这里导入常量，不要在文件中硬编码值

### Constants Overview
- `LEVEL_COLORS` - 5 个级别的颜色主题
- `LEVEL_NAMES` - 5 个级别的显示名称
- `MAGIC_E_PATTERNS` - Magic E 模式列表
- `DEFAULT_SPEECH_CONFIG` - 默认语音配置
- `STORAGE_KEYS` - AsyncStorage 键名

## Dependencies

### Internal
- 被 `src/contexts/AppContext.js` 使用
- 被 `src/screens/` 中的屏幕组件使用

<!-- MANUAL: -->
