#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re
import json

# 读取data.js文件
with open('data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 提取所有levels和units
levels = re.findall(r'(level\d+):\s*\{[^}]*name:\s*["\']([^"\']+)["\']', content)
print("开始检查每个unit的示例单词数量...\n")
print("="*80)

# 逐个检查每个unit
unit_pattern = r"id:\s*'(unit\d+)'[^}]*?name:\s*'([^']+)'[^}]*?patterns:\s*\[(.*?)\][^}]*?words:\s*\[([\s\S]*?)\]"

issues_found = []
total_units = 0
total_patterns = 0

for match in re.finditer(unit_pattern, content):
    unit_id = match.group(1)
    unit_name = match.group(2)
    patterns_str = match.group(3)
    words_str = match.group(4)
    
    # 提取patterns列表
    patterns = re.findall(r"'([^']+)'", patterns_str)
    
    # 找到当前unit所属的level
    pos = match.start()
    level_matches = list(re.finditer(r'(level\d+):\s*\{', content))
    current_level = None
    for i, lm in enumerate(level_matches):
        if lm.start() < pos:
            if i == len(level_matches) - 1 or level_matches[i+1].start() > pos:
                current_level = re.search(r"name:\s*'([^']+)'", content[lm.start():lm.start()+200]).group(1)
                level_id = re.search(r'(level\d+)', content[lm.start():lm.start()+20]).group(1)
                break
    
    if not current_level:
        continue
    
    total_units += 1
    
    print(f"\n{level_id} - {unit_id} ({unit_name})")
    print(f"Patterns: {patterns}")
    
    # 统计每个pattern的单词数
    pattern_counts = {p: 0 for p in patterns}
    
    # 提取所有单词
    words = re.findall(r"word:\s*'([^']+)'[^}]*?highlight:\s*'([^']+)'", words_str)
    
    for word, highlight in words:
        if highlight in pattern_counts:
            pattern_counts[highlight] += 1
    
    # 检查是否都有10个
    has_issue = False
    for pattern in patterns:
        total_patterns += 1
        count = pattern_counts[pattern]
        status = "✓" if count >= 10 else "✗"
        if count < 10:
            has_issue = True
            issues_found.append(f"{level_id}/{unit_id}: {pattern} 只有 {count} 个单词 (需要10个)")
        print(f"  {status} {pattern}: {count} 个单词")
    
    if has_issue:
        print("  ⚠️ 该单元有pattern单词数不足10个")

print("\n" + "="*80)
print(f"\n总计检查: {total_units} 个units, {total_patterns} 个patterns")

if issues_found:
    print(f"\n❌ 发现 {len(issues_found)} 个问题:")
    for issue in issues_found:
        print(f"  - {issue}")
else:
    print("\n✅ 所有patterns都有至少10个示例单词！")

