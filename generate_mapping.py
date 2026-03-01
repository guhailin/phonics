#!/usr/bin/env python3
import os
import re
import json
from collections import defaultdict

VIDEO_DIR = '/Users/e99g41y/worksapce/phonics_rn/assets/video'

def parse_filename(filename):
    """解析视频文件名，提取level、unit、类型等信息"""
    name = filename.replace('.mp4', '')

    # 提取level
    level_match = re.search(r'level[_-](\d+)', name, re.IGNORECASE)
    level = None
    if level_match:
        level = f'level{level_match.group(1)}'
    elif 'book_1' in name or 'book1' in name:
        level = 'level1'
    elif 'book_2' in name or 'book2' in name:
        level = 'level2'
    elif 'book_3' in name or 'book3' in name:
        level = 'level3'

    # 提取unit
    unit_match = re.search(r'unit[_-](\d+)', name, re.IGNORECASE)
    unit = None
    if unit_match:
        unit = f'unit{unit_match.group(1)}'

    # 判断视频类型
    video_type = 'unknown'
    if 'intro' in name.lower():
        video_type = 'intro'
    elif 'review' in name.lower():
        video_type = 'review'
    elif 'story' in name.lower():
        video_type = 'story'
    elif 'song' in name.lower():
        video_type = 'song'
    elif 'How_to_Write' in name:
        video_type = 'bonus'
    else:
        video_type = 'lesson'

    return {
        'filename': filename,
        'level': level,
        'unit': unit,
        'type': video_type,
        'name': name
    }

def main():
    videos = []
    for filename in os.listdir(VIDEO_DIR):
        if filename.endswith('.mp4'):
            videos.append(parse_filename(filename))

    # 构建映射结构
    mapping = {}
    for level_num in range(1, 6):
        level = f'level{level_num}'
        mapping[level] = {
            'units': {},
            'other': []
        }

    for v in videos:
        if v['level']:
            if v['unit']:
                if v['unit'] not in mapping[v['level']]['units']:
                    mapping[v['level']]['units'][v['unit']] = []
                mapping[v['level']]['units'][v['unit']].append({
                    'filename': v['filename'],
                    'type': v['type']
                })
            else:
                mapping[v['level']]['other'].append({
                    'filename': v['filename'],
                    'type': v['type']
                })

    # 输出JSON
    output_file = '/Users/e99g41y/worksapce/phonics_rn/video_mapping.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(mapping, f, indent=2, ensure_ascii=False)

    print(f"JSON映射文件已生成: {output_file}")

    # 统计
    print(f"\n统计:")
    for level_num in range(1, 6):
        level = f'level{level_num}'
        level_data = mapping[level]
        unit_count = len(level_data['units'])
        other_count = len(level_data['other'])
        total = sum(len(videos) for videos in level_data['units'].values()) + other_count
        print(f"{level}: {total} 个视频 ({unit_count} 个units + {other_count} 个其他)")

if __name__ == '__main__':
    main()
