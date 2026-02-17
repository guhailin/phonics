# 数据更新说明

## 更新时间
2026年2月17日

## 更新内容
根据 `level2-playlist.md` 文件中的内容，完整更新了网页中 Level 2-5 的数据。

## 更新的 Level

### Level 2 - Short Vowels (短元音)
- **Unit 1**: Short a (a, am, an) - 15个单词，20个句子
- **Unit 2**: Short a (ad, ag, ap, at) - 15个单词，20个句子
- **Unit 3**: Short e (e, et, en, ed) - 15个单词，20个句子
- **Unit 4**: Short i (i, ip, ib, id) - 15个单词，20个句子
- **Unit 5**: Short i (in, ig, it, ix) - 15个单词，20个句子
- **Unit 6**: Short o (o, ot, op) - 15个单词，20个句子
- **Unit 7**: Short u (u, ug, ud, up) - 15个单词，20个句子
- **Unit 8**: Short u (ut, ub, um, un) - 15个单词，20个句子

### Level 3 - Long Vowels (长元音)
- **Unit 1**: Long a (a_e, ame, ake, ate, ave) - 15个单词，20个句子
- **Unit 2**: Long i (i_e, ime, ike, ive, ine) - 15个单词，20个句子
- **Unit 3**: Long o & Long u (o_e, u_e) - 15个单词，20个句子
- **Unit 4**: Long a (ai, ay) - 15个单词，20个句子
- **Unit 5**: Long e (ee, ea, y, ey) - 15个单词，20个句子
- **Unit 6**: Long i (igh, ie, y) - 15个单词，20个句子
- **Unit 7**: Long o (oa, ow) - 15个单词，20个句子
- **Unit 8**: Long u (ue, ui, ew, oo) - 15个单词，20个句子

### Level 4 - Consonant Blends (辅音组合)
- **Unit 1**: L/R Blends (bl, cl, br, cr, fl, gl) - 15个单词，20个句子
- **Unit 2**: L/R/S Blends (fr, gr, pl, sl, dr, tr) - 15个单词，20个句子
- **Unit 3**: S Blends (sm, sn, sp, sw, st) - 15个单词，20个句子
- **Unit 4**: Digraphs (sh, ch, tch, ph, wh) - 15个单词，20个句子
- **Unit 5**: Digraphs & Blends (th, ck, qu) - 15个单词，20个句子
- **Unit 6**: Final Blends (ng, nk, nd, nt, lt, mp) - 15个单词，20个句子
- **Unit 7**: Complex Blends (sk, sc, spr, str, spl, squ) - 15个单词，20个句子
- **Unit 8**: Soft Sounds (c, g, s) - 15个单词，20个句子

### Level 5 - Letter Combinations (字母组合)
- **Unit 1**: R-controlled Vowels (ar, ir, er, or) - 15个单词，20个句子
- **Unit 2**: Diphthongs & Special Sounds (ou, ow, oi, oy, oo, u) - 15个单词，20个句子
- **Unit 3**: AU/AW & OR Sounds (au, aw, all, wa, or, oar) - 15个单词，20个句子
- **Unit 4**: AIR/EAR Sounds (are, air, ea, ear, eer) - 15个单词，20个句子
- **Unit 5**: Open Syllables (a, e, i, o, u) - 15个单词，20个句子
- **Unit 6**: Schwa Sound (schwa a, e, i, o, u) - 15个单词，20个句子
- **Unit 7**: Silent Letters (kn, wr, mb, e, rh, st) - 15个单词，20个句子
- **Unit 8**: Word Endings (ture, sure, tion, sion, ous, ful) - 15个单词，20个句子

## 数据特点

1. **每个单元包含**:
   - 音素模式 (patterns)
   - 20个例句 (examples)，句子中的音素模式已高亮显示
   - 15个核心单词 (words)，带有 emoji 图标
   - 探索单词列表 (exploreWords)

2. **句子高亮**:
   - 所有句子都已自动标注音素模式
   - 使用 `<span class="highlight">` 和 `<span class="pattern">` 标签高亮显示

3. **单词配置**:
   - 每个单词都有对应的 emoji 图标
   - highlight 字段标注了单词中的关键音素模式

## 更新方法

使用 Python 脚本 `replace-all-levels.py` 自动解析 `level2-playlist.md` 并生成 JavaScript 数据结构。

## 备份

原始 data.js 已备份为 `data.js.backup-*` 文件。

## 验证

- ✅ JavaScript 语法检查通过
- ✅ 所有 Level 数据完整
- ✅ 句子高亮正常
- ✅ 单词 emoji 显示正常

## 使用方法

直接在浏览器中打开 `index.html` 即可查看更新后的内容。
