#!/usr/bin/env python3
"""
使用 AI API 为单词生成图片
支持多种图片生成服务：OpenAI DALL-E、Stability AI 等
如果没有API，可以使用智能emoji推荐功能
"""

import os
import json
import re
import base64
import requests
from pathlib import Path

# 图片保存目录
IMAGES_DIR = Path(__file__).parent / 'images'
IMAGES_DIR.mkdir(exist_ok=True)

# API 配置
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
STABILITY_API_KEY = os.getenv('STABILITY_API_KEY')

def extract_words_from_datajs(data_js_path='data.js'):
    """从 data.js 中提取使用默认emoji(📝)的单词"""
    with open(data_js_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 查找所有使用 📝 emoji 的单词
    pattern = r"\{\s*word:\s*'([^']+)',\s*highlight:\s*'([^']+)',\s*emoji:\s*'📝'\s*\}"
    matches = re.findall(pattern, content)
    
    words_to_generate = []
    for word, highlight in matches:
        words_to_generate.append({
            'word': word,
            'highlight': highlight
        })
    
    print(f"找到 {len(words_to_generate)} 个需要生成图片的单词")
    return words_to_generate

def generate_with_dalle(word, save_path):
    """使用 OpenAI DALL-E 3 生成图片"""
    if not OPENAI_API_KEY:
        return False
    
    try:
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {OPENAI_API_KEY}"
        }
        
        prompt = f"""A simple, colorful, child-friendly illustration of "{word}" for an educational flashcard. 
Cartoon style, bright colors, clear and easy to understand for young children learning English. 
Minimal background, focus on the subject. Age-appropriate for 5-8 year olds."""
        
        data = {
            "model": "dall-e-3",
            "prompt": prompt,
            "n": 1,
            "size": "1024x1024",
            "quality": "standard"
        }
        
        print(f"正在使用 DALL-E 为 '{word}' 生成图片...")
        response = requests.post(
            "https://api.openai.com/v1/images/generations",
            headers=headers,
            json=data,
            timeout=60
        )
        
        if response.status_code == 200:
            image_url = response.json()['data'][0]['url']
            # 下载图片
            img_response = requests.get(image_url)
            with open(save_path, 'wb') as f:
                f.write(img_response.content)
            print(f"✓ '{word}' 图片已保存")
            return True
        else:
            print(f"✗ '{word}' 生成失败：{response.text}")
            return False
            
    except Exception as e:
        print(f"✗ '{word}' 生成失败：{e}")
        return False

def generate_with_stability(word, save_path):
    """使用 Stability AI 生成图片"""
    if not STABILITY_API_KEY:
        return False
    
    try:
        headers = {
            "Authorization": f"Bearer {STABILITY_API_KEY}",
            "Content-Type": "application/json"
        }
        
        prompt = f"Simple colorful cartoon illustration of {word} for children's educational flashcard, bright colors, clear subject, minimal background"
        
        data = {
            "text_prompts": [{"text": prompt}],
            "cfg_scale": 7,
            "height": 1024,
            "width": 1024,
            "samples": 1,
            "steps": 30
        }
        
        print(f"正在使用 Stability AI 为 '{word}' 生成图片...")
        response = requests.post(
            "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
            headers=headers,
            json=data,
            timeout=60
        )
        
        if response.status_code == 200:
            image_data = response.json()['artifacts'][0]['base64']
            with open(save_path, 'wb') as f:
                f.write(base64.b64decode(image_data))
            print(f"✓ '{word}' 图片已保存")
            return True
        else:
            print(f"✗ '{word}' 生成失败：{response.text}")
            return False
            
    except Exception as e:
        print(f"✗ '{word}' 生成失败：{e}")
        return False

def suggest_better_emoji(word):
    """为单词推荐更好的emoji"""
    # 常见单词的emoji映射
    emoji_map = {
        # 动物
        'ram': '🐏', 'bat': '🦇', 'cat': '🐱', 'hen': '🐔', 'pig': '🐷', 'dog': '🐕',
        'ox': '🐂', 'fox': '🦊', 'snail': '🐌', 'swan': '🦢', 'quail': '🦤',
        
        # 人物
        'man': '👨', 'dad': '👨‍👧', 'mom': '👩', 'Ben': '👦', 'Sam': '👦', 'lad': '👦',
        
        # 食物
        'jam': '🍓', 'ham': '🍖', 'yam': '🍠', 'bun': '🍔', 'nut': '🥜',
        'beef': '🥩', 'bean': '🫘', 'juice': '🧃', 'snack': '🍿',
        
        # 物品
        'fan': '🪭', 'pan': '🍳', 'can': '🥫', 'cap': '🧢', 'hat': '🎩', 'map': '🗺️',
        'bag': '👜', 'tag': '🏷️', 'van': '🚐', 'bed': '🛏️', 'pen': '🖊️',
        'net': '🎣', 'jet': '✈️', 'web': '🕸️', 'mug': '☕', 'jug': '🏺',
        'pin': '📌', 'bin': '🗑️', 'bib': '👶', 'lid': '🎩', 'wig': '💇',
        'box': '📦', 'mop': '🧹', 'pot': '🍯', 'cot': '🛏️', 'log': '🪵',
        'bow': '🎀', 'coach': '🚌', 'coal': '⚫', 'frame': '🖼️',
        'branch': '🌳', 'brake': '🚗', 'crack': '💥', 'craft': '✂️', 'crash': '💥',
        
        # 动作/状态
        'sad': '😢', 'mad': '😠', 'bad': '👎', 'wet': '💧', 'hot': '🔥',
        'fit': '💪', 'dip': '🏊', 'hip': '🕺', 'rip': '✂️', 'nip': '✂️',
        'got': '✅', 'dug': '⛏️', 'but': '🤚', 'sup': '👋', 'yup': '👍',
        'die': '💀', 'cry': '😭', 'dry': '🌵', 'blow': '💨', 
        'grab': '✊', 'pray': '🙏', 'press': '👆', 'track': '🛤️', 'trade': '🤝', 'trail': '🥾',
        'smash': '💥', 'snag': '🪝', 'swap': '🔄', 'swam': '🏊',
        'band': '🎵', 'bend': '↪️', 'blink': '👁️', 'bent': '↪️', 'count': '🔢', 'along': '➡️',
        'thank': '🙏', 'quack': '🦆', 'quake': '🌋', 'blur': '😵', 'blurt': '🗣️',
        'anger': '😡', 'after': '⏭️', 'walk': '🚶', 'walker': '🚶', 'walking': '🚶',
        'born': '👶', 'applaud': '👏', 'assault': '⚔️', 
        
        # 颜色
        'red': '🔴', 'black': '⚫',
        
        # 自然
        'beach': '🏖️', 'space': '🚀', 'stage': '🎭',
        
        # 其他
        'dam': '🏞️', 'gap': '↔️', 'lap': '🏃', 'nap': '😴', 'mat': '🧘',
        'bet': '🎲', 'get': '✅', 'let': '👌', 'met': '🤝', 'wed': '💒',
        'peg': '📌', 'leg': '🦵', 'fed': '🍽️', 'led': '👉',
        'gag': '🤐', 'hag': '🧙', 'jag': '⚡', 'gig': '🎸', 'din': '🔊',
        'bit': '🍪', 'fin': '🐟', 'dig': '⛏️', 'rib': '🥩', 'tip': '💡',
        'bop': '🎵', 'pox': '🤒', 'lox': '🐟', 'gut': '🤢', 'setup': '⚙️',
        'beep': '🔔', 'beak': '🦆', 'tried': '💪', 'by': '👋',
        'abuse': '⚠️', 'accuse': '☝️', 'clue': '🔍', 'cue': '🎱', 
        'bruise': '🤕', 'cruise': '🚢', 'blew': '💨', 'brew': '☕', 'chew': '🍔',
        'brave': '🦁', 'free': '🕊️', 'freeze': '🧊', 'grace': '🙏', 'grade': '📊',
        'practice': '🎯', 'praise': '🌟', 'pretty': '✨', 'smart': '🧠', 'smack': '👋',
        'spade': '♠️', 'spare': '🔄', 'stack': '📚', 'staff': '👥',
        'bank': '🏦', 'blank': '📄', 'cent': '💰', 'ash': '🌋',
        'batch': '📦', 'blotch': '🎨', 'clutch': '🤏',
        'birch': '🌳', 'about': '💭', 'cruel': '😈', 
        'awful': '😖', 'awe': '😮', 'all': '💯',
        'walkway': '🚶', 'waltz': '💃', 'corner': '📐',
        'had': '✅'
    }
    
    return emoji_map.get(word.lower(), '📝')

def update_datajs_with_better_emojis(data_js_path='data.js'):
    """更新 data.js，为默认emoji的单词推荐更好的emoji"""
    with open(data_js_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    words = extract_words_from_datajs(data_js_path)
    updated = 0
    
    for word_data in words:
        word = word_data['word']
        better_emoji = suggest_better_emoji(word)
        
        if better_emoji != '📝':
            # 替换emoji
            old_pattern = f"word: '{word}', highlight: '{word_data['highlight']}', emoji: '📝'"
            new_text = f"word: '{word}', highlight: '{word_data['highlight']}', emoji: '{better_emoji}'"
            
            if old_pattern in content:
                content = content.replace(old_pattern, new_text)
                updated += 1
                print(f"✓ '{word}' -> {better_emoji}")
    
    # 保存更新
    with open(data_js_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return updated

def update_datajs_with_images(data_js_path='data.js'):
    """更新 data.js，将图片路径添加到单词对象中"""
    with open(data_js_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 查找所有生成的图片
    image_files = list(IMAGES_DIR.glob('*.png')) + list(IMAGES_DIR.glob('*.jpg'))
    
    for image_file in image_files:
        word = image_file.stem  # 获取不带扩展名的文件名
        image_path = f"images/{image_file.name}"
        
        # 查找这个单词的记录
        pattern = f"word: '{word}', highlight: '([^']+)', emoji: '([^']+)'"
        match = re.search(pattern, content)
        
        if match:
            highlight = match.group(1)
            emoji = match.group(2)
            
            # 添加 image 字段（如果还没有）
            old_text = f"word: '{word}', highlight: '{highlight}', emoji: '{emoji}'"
            if ', image:' not in content[content.find(old_text):content.find(old_text)+200]:
                new_text = f"word: '{word}', highlight: '{highlight}', emoji: '{emoji}', image: '{image_path}'"
                content = content.replace(old_text, new_text)
    
    # 保存更新后的文件
    with open(data_js_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\n已更新 data.js，添加了 {len(image_files)} 个图片路径")

def main():
    """主函数"""
    print("=" * 60)
    print("AI 图片生成工具 for Oxford Phonics World")
    print("=" * 60)
    print()
    
    # 检查可用的API
    has_openai = bool(OPENAI_API_KEY)
    has_stability = bool(STABILITY_API_KEY)
    
    print("可用的API:")
    print(f"  - OpenAI DALL-E: {'✓' if has_openai else '✗ (未设置 OPENAI_API_KEY)'}")
    print(f"  - Stability AI: {'✓' if has_stability else '✗ (未设置 STABILITY_API_KEY)'}")
    print()
    
    # 如果没有API，提供emoji优化选项
    if not (has_openai or has_stability):
        print("没有检测到图片生成API。")
        print("你可以：")
        print("  1. 设置 OPENAI_API_KEY 或 STABILITY_API_KEY 环境变量")
        print("  2. 使用智能emoji推荐功能（免费）")
        print()
        choice = input("是否使用智能emoji推荐? (y/n): ").strip().lower()
        
        if choice == 'y':
            print("\n开始优化emoji...")
            print("-" * 60)
            updated = update_datajs_with_better_emojis()
            print("-" * 60)
            print(f"\n✓ 完成！更新了 {updated} 个单词的emoji")
        else:
            print("\n请设置API密钥后重试")
        return
    
    # 1. 提取需要生成图片的单词
    words = extract_words_from_datajs()
    
    if not words:
        print("没有找到需要生成图片的单词")
        return
    
    # 2. 选择API
    if has_openai:
        generator = generate_with_dalle
        api_name = "DALL-E"
    else:
        generator = generate_with_stability
        api_name = "Stability AI"
    
    print(f"\n将使用 {api_name} 生成图片")
    print("-" * 60)
    
    # 3. 为每个单词生成图片
    success_count = 0
    for i, word_data in enumerate(words, 1):
        word = word_data['word']
        save_path = IMAGES_DIR / f"{word}.png"
        
        # 跳过已存在的图片
        if save_path.exists():
            print(f"[{i}/{len(words)}] '{word}' 图片已存在，跳过")
            success_count += 1
            continue
        
        # 生成图片
        print(f"[{i}/{len(words)}] ", end='')
        if generator(word, save_path):
            success_count += 1
        
        # 避免API限流，稍作延迟
        if i < len(words):
            import time
            time.sleep(2)
    
    # 4. 更新 data.js
    print()
    print("-" * 60)
    print(f"图片生成完成：{success_count}/{len(words)} 成功")
    
    if success_count > 0:
        print("\n正在更新 data.js...")
        update_datajs_with_images()
    
    print()
    print("=" * 60)
    print("✓ 全部完成！")
    print("=" * 60)

if __name__ == '__main__':
    main()
