#!/usr/bin/env python3
import os
import re
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

    # 按level和unit分组
    by_level = defaultdict(list)
    for v in videos:
        by_level[v['level']].append(v)

    # 生成表格
    print("=" * 120)
    print(f"{'Level':<10} {'Unit':<10} {'Type':<10} {'Filename':<70}")
    print("=" * 120)

    # 按level顺序输出
    for level_num in range(1, 6):
        level = f'level{level_num}'
        level_videos = sorted(by_level.get(level, []), key=lambda x: (x['unit'] or '', x['type'], x['filename']))

        for v in level_videos:
            unit_display = v['unit'] if v['unit'] else '-'
            print(f"{level:<10} {unit_display:<10} {v['type']:<10} {v['filename']:<70}")

    print("=" * 120)

    # 统计信息
    print(f"\n统计信息:")
    print(f"总视频数: {len(videos)}")
    for level_num in range(1, 6):
        level = f'level{level_num}'
        count = len(by_level.get(level, []))
        print(f"{level}: {count} 个视频")

if __name__ == '__main__':
    main()
