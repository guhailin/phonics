# 数据更新说明

## 最后更新时间
2026年2月18日

## 更新历史

### 第三轮更新 - 2026年2月18日
**修复 Level 3 单词卡片显示重复问题**

#### 问题描述
Level 3 Unit 1 和 Unit 2 页面中，单词卡片出现视觉重复。经排查，根本原因是 app.js 中的单词过滤逻辑存在 bug：对于 Magic E 模式（如 a_e, i_e），使用了 includes(vowel) 进行模糊匹配，导致 a_e 模式会错误匹配所有 highlight 中包含字母 a 的单词（如 ame, ake, ate, ave），造成同一个单词在多个 pattern 下重复显示。

#### 修复内容
- **app.js**：将 Magic E 模式的模糊匹配改为精确匹配 (wordObj.highlight === cleanPattern)
- 修复后，每个 pattern 标签下只显示对应的单词，不再重复

---

### 第二轮更新 - 2026年2月17日
**全面审查并修正 Level 2-5 所有单元数据，确保与 phonics.md 一致**

#### Level 2 - Short Vowels（短元音）
- 删除 Unit 3、Unit 4、Unit 6、Unit 7 中的重复单词
- 补充约 23 个遗漏单词
- 修正后 8 个单元共 142 个单词

#### Level 4 - Consonant Blends（辅音混合音）
- 全面重构，补充约 91 个遗漏单词
- 修正后 8 个单元共 201 个单词

#### Level 5 - Letter Combinations（字母组合）
- 全面重构，补充约 80+ 个遗漏单词
- 修正多个单元的 highlight 错误（Unit 2, 5, 6, 7）
- 修正 Unit 6 的 patterns 配置
- 修正后 8 个单元共 219 个单词

#### word-info.js
- 验证所有单词均有对应的音标和中文释义，无遗漏

---

### 第一轮更新 - 2026年2月7日至17日
**初始数据导入与 Level 1-3 结构重构**

- Level 1：更新所有 exploreWords，匹配 phonics.md
- Level 2：初始导入 8 个单元数据
- Level 3：从 4 个单元重构为 8 个单元
- Level 4-5：初始导入数据

---

## 当前数据统计

### Level 1 - Alphabet & Sounds（字母与发音）
| 单元 | 内容 | 单词数 | 例句数 | 探索单词 |
|------|------|--------|--------|----------|
| Unit 1 | Aa, Bb, Cc | 9 | - | 15 |
| Unit 2 | Dd, Ee, Ff | 9 | - | 15 |
| Unit 3 | Gg, Hh, Ii | 9 | - | 15 |
| Unit 4 | Jj, Kk, Ll | 9 | - | 15 |
| Unit 5 | Mm, Nn, Oo | 9 | - | 15 |
| Unit 6 | Pp, Qq, Rr | 9 | - | 15 |
| Unit 7 | Ss, Tt, Uu, Vv | 12 | - | 20 |
| Unit 8 | Ww, Xx, Yy, Zz | 12 | - | 20 |
| **合计** | | **78** | **0** | **130** |

### Level 2 - Short Vowels（短元音）
| 单元 | 内容 | 单词数 | 例句数 | 探索单词 |
|------|------|--------|--------|----------|
| Unit 1 | Short a (a, am, an) | 15 | 20 | 15 |
| Unit 2 | Short a (ad, ag, ap, at) | 20 | 20 | 20 |
| Unit 3 | Short e (e, et, en, ed) | 17 | 20 | 17 |
| Unit 4 | Short i (i, ip, ib, id) | 19 | 20 | 19 |
| Unit 5 | Short i (in, ig, it, ix) | 19 | 20 | 19 |
| Unit 6 | Short o (o, ot, op) | 13 | 20 | 13 |
| Unit 7 | Short u (u, ug, ud, up) | 19 | 20 | 19 |
| Unit 8 | Short u (ut, ub, um, un) | 20 | 20 | 20 |
| **合计** | | **142** | **160** | **142** |

### Level 3 - Long Vowels（长元音）
| 单元 | 内容 | 单词数 | 例句数 | 探索单词 |
|------|------|--------|--------|----------|
| Unit 1 | Long a (a_e, ame, ake, ate, ave) | 22 | 20 | 22 |
| Unit 2 | Long i (i_e, ime, ike, ive, ine) | 21 | 20 | 21 |
| Unit 3 | Long o & u (o_e, u_e) | 15 | 20 | 15 |
| Unit 4 | Long a (ai, ay) | 10 | 20 | 10 |
| Unit 5 | Long e (ee, ea, y, ey) | 15 | 20 | 15 |
| Unit 6 | Long i (igh, ie, y) | 15 | 20 | 15 |
| Unit 7 | Long o (oa, ow) | 10 | 20 | 10 |
| Unit 8 | Long u (ue, ui, ew, oo) | 20 | 20 | 20 |
| **合计** | | **128** | **160** | **128** |

### Level 4 - Consonant Blends（辅音混合音）
| 单元 | 内容 | 单词数 | 例句数 | 探索单词 |
|------|------|--------|--------|----------|
| Unit 1 | L/R Blends (bl, cl, br, cr, fl, gl) | 30 | 20 | 30 |
| Unit 2 | L/R/S Blends (fr, gr, pl, sl, dr, tr) | 30 | 20 | 30 |
| Unit 3 | S Blends (sm, sn, sp, sw, st) | 26 | 20 | 26 |
| Unit 4 | Digraphs (sh, ch, tch, ph, wh) | 25 | 20 | 25 |
| Unit 5 | Digraphs & Blends (th, ck, qu) | 18 | 20 | 18 |
| Unit 6 | Final Blends (ng, nk, nd, nt, lt, mp) | 30 | 20 | 30 |
| Unit 7 | Complex Blends (sk, sc, spr, str, spl, squ) | 30 | 20 | 30 |
| Unit 8 | Soft Sounds (c, g, s) | 12 | 20 | 12 |
| **合计** | | **201** | **160** | **201** |

### Level 5 - Letter Combinations（字母组合）
| 单元 | 内容 | 单词数 | 例句数 | 探索单词 |
|------|------|--------|--------|----------|
| Unit 1 | R-controlled Vowels (ar, ir, er, or) | 20 | 20 | 20 |
| Unit 2 | Diphthongs (ou, ow, oi, oy, oo, u) | 30 | 20 | 30 |
| Unit 3 | AU/AW Sounds (au, aw, all, wa, or, oar) | 30 | 20 | 30 |
| Unit 4 | AIR/EAR Sounds (are, air, ea, ear, eer) | 25 | 20 | 25 |
| Unit 5 | Open Syllables (a, e, i, o, u) | 25 | 20 | 25 |
| Unit 6 | Schwa Sound (schwa a, e, i, o, u) | 30 | 20 | 30 |
| Unit 7 | Silent Letters (kn, wr, mb, e, rh, st) | 29 | 20 | 29 |
| Unit 8 | Word Endings (ture, sure, tion, sion, ous, ful) | 30 | 20 | 30 |
| **合计** | | **219** | **160** | **219** |

### 总计
| 项目 | 数量 |
|------|------|
| 精选单词 | **768** |
| 例句 | **640** |
| 探索模式单词 | **820** |
| 总单元数 | **40** |

## 数据特点

1. **每个单元包含**:
   - 音素模式 (patterns)
   - 20个例句 (examples)，句子中的音素模式已高亮显示（Level 1除外）
   - 核心单词 (words)，带有 emoji 图标，数量因单元而异（10-30个）
   - 探索单词列表 (exploreWords)

2. **句子高亮**:
   - 所有句子都已自动标注音素模式
   - 使用 highlight 和 pattern class 标签高亮显示

3. **单词配置**:
   - 每个单词都有对应的 emoji 图标
   - highlight 字段标注了单词中的关键音素模式
   - word-info.js 提供所有单词的音标和中文释义

## 备份

原始 data.js 已备份为 data.js.backup 文件。

## 验证

- ✅ JavaScript 语法检查通过（data.js, app.js, word-info.js）
- ✅ 所有 Level 数据完整，与 phonics.md 一致
- ✅ 句子高亮正常
- ✅ 单词 emoji 显示正常
- ✅ Magic E 模式匹配正确（app.js 已修复）
- ✅ 所有单词在 word-info.js 中有对应条目
