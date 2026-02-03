#!/usr/bin/env python3
"""检查所有exploreWords里的单词是否符合对应level里unit的pattern"""

import json
import re
from collections import defaultdict

# 读取data.js文件
with open('data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 提取phonicsData对象
start = content.find('const phonicsData = {')
if start == -1:
    print("未找到phonicsData")
    exit(1)

# 找到对应的结束大括号
bracket_count = 0
start_pos = content.find('{', start)
for i in range(start_pos, len(content)):
    if content[i] == '{':
        bracket_count += 1
    elif content[i] == '}':
        bracket_count -= 1
        if bracket_count == 0:
            end_pos = i + 1
            break

# 提取JSON字符串并解析
json_str = content[start_pos:end_pos]

# 清理JavaScript语法，使其成为有效的JSON
json_str = re.sub(r"(\w+):", r'"\1":', json_str)  # 给键加引号
json_str = re.sub(r"'([^']*)'", r'"\1"', json_str)  # 单引号改双引号

try:
    data = json.loads(json_str)
except json.JSONDecodeError as e:
    print(f"JSON解析错误: {e}")
    # 使用正则表达式手动解析
    data = None

if data is None:
    # 手动解析JavaScript对象
    print("使用正则表达式手动解析...")
    data = {}
    
# 由于JSON解析可能有问题，我们直接用正则表达式匹配
levels_pattern = r'(level\d+):\s*\{[^}]*name:\s*[\'"]([^\'"]+)[\'"]'
levels = re.findall(levels_pattern, content)

print("=" * 80)
print("检查所有exploreWords是否符合对应unit的pattern")
print("=" * 80)
print()

total_issues = 0
total_words = 0

# 遍历每个level
for level_match in re.finditer(r'(level\d+):\s*\{', content):
    level_id = level_match.group(1)
    level_start = level_match.end()
    
    # 找到这个level的结束位置
    bracket_count = 1
    level_end = level_start
    for i in range(level_start, len(content)):
        if content[i] == '{':
            bracket_count += 1
        elif content[i] == '}':
            bracket_count -= 1
            if bracket_count == 0:
                level_end = i
                break
    
    level_content = content[level_start:level_end]
    
    # 提取level名称
    level_name_match = re.search(r'name:\s*[\'"]([^\'"]+)[\'"]', level_content)
    level_name = level_name_match.group(1) if level_name_match else level_id
    
    print(f"\n{'='*80}")
    print(f"{level_name} ({level_id})")
    print(f"{'='*80}")
    
    # 遍历这个level中的每个unit
    for unit_match in re.finditer(r'\{\s*id:\s*[\'"]([^\'"]+)[\'"],\s*name:\s*[\'"]([^\'"]+)[\'"]', level_content):
        unit_id = unit_match.group(1)
        unit_name = unit_match.group(2)
        unit_start = unit_match.start()
        
        # 找到这个unit的结束位置（下一个unit的开始或level的结束）
        next_unit = re.search(r'\},\s*\{[^}]*id:', level_content[unit_start+1:])
        if next_unit:
            unit_end = unit_start + 1 + next_unit.start()
        else:
            unit_end = len(level_content)
        
        unit_content = level_content[unit_start:unit_end]
        
        # 提取patterns
        patterns_match = re.search(r'patterns:\s*\[(.*?)\]', unit_content, re.DOTALL)
        if not patterns_match:
            continue
            
        patterns_str = patterns_match.group(1)
        patterns = [p.strip().strip('\'"') for p in patterns_str.split(',')]
        patterns = [p for p in patterns if p]
        
        # 提取exploreWords
        explore_match = re.search(r'exploreWords:\s*\[(.*?)\]', unit_content, re.DOTALL)
        if not explore_match:
            continue
            
        explore_str = explore_match.group(1)
        
        # 提取所有的word
        word_matches = re.findall(r'word:\s*[\'"]([^\'"]+)[\'"]', explore_str)
        
        print(f"\n{unit_name}")
        print(f"  Patterns: {', '.join(patterns)}")
        print(f"  Total words: {len(word_matches)}")
        
        # 检查每个单词
        issues = []
        for word in word_matches:
            total_words += 1
            word_lower = word.lower()
            matched = False
            
            for pattern in patterns:
                pattern_lower = pattern.lower()
                
                # 处理不同类型的pattern
                if pattern_lower.startswith('-'):
                    # 后缀pattern，如-an, -at
                    if word_lower.endswith(pattern_lower[1:]):
                        matched = True
                        break
                elif '_' in pattern_lower:
                    # 分割pattern，如i_e (表示i...e)
                    parts = pattern_lower.split('_')
                    if len(parts) == 2:
                        # 检查是否包含第一个字母，然后以第二个字母结尾
                        if parts[0] in word_lower and word_lower.endswith(parts[1]):
                            matched = True
                            break
                else:
                    # 普通包含pattern
                    if pattern_lower in word_lower:
                        matched = True
                        break
            
            if not matched:
                issues.append(word)
                total_issues += 1
        
        if issues:
            print(f"  ❌ 不符合pattern的单词 ({len(issues)}):")
            for word in issues:
                print(f"     - {word}")
        else:
            print(f"  ✅ 所有单词都符合pattern")

print(f"\n{'='*80}")
print(f"检查完成")
print(f"{'='*80}")
print(f"总单词数: {total_words}")
print(f"不符合pattern的单词数: {total_issues}")
if total_issues == 0:
    print("✅ 所有单词都符合对应的pattern!")
else:
    print(f"❌ 发现 {total_issues} 个不符合pattern的单词")
