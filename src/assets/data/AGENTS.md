<!-- Parent: ../../AGENTS.md -->
<!-- Generated: 2026-02-25 | Updated: 2026-02-25 -->

# data

## Purpose
存储课程数据文件，包括自然拼读课程的单词、例句和单词信息。

## Key Files
| File | Description |
|------|-------------|
| `phonicsData.js` | 核心课程数据（必须与 phonics.md 完全匹配） |
| `wordInfo.js` | 单词的音标和中文定义 |

## Subdirectories
无

## For AI Agents

### Working In This Directory
- **关键要求**：在修改 `phonicsData.js` 之前，必须先阅读 `phonics.md`
- `phonicsData.js` 必须与 `phonics.md` 中的数据和顺序完全一致
- 修改数据后，运行数据验证检查清单

### Data Validation Checklist
在提交 `phonicsData.js` 的更改前：
- [ ] 单词数量与 `phonics.md` 匹配（768 个精选 + 820 个探索）
- [ ] 每个单元有正确的 `patterns` 顺序
- [ ] 所有 `highlight` 值与 patterns 匹配
- [ ] Level 1 没有例句；Level 2-5 共有 160 条例句（每单元 20 条）
- [ ] 所有例句有正确的 HTML span 格式
- [ ] `wordInfo.js` 包含所有 768 个精选单词的条目

### Common Patterns
- 例句使用 HTML span 格式进行高亮
- Magic E 模式使用下划线表示（如 `i_e`、`a_e`）
- 单词对象格式：`{ word, highlight, emoji }`

## Dependencies

### Internal
- `../../../phonics.md` - 课程数据的事实来源

<!-- MANUAL: -->
