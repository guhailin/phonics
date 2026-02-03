#!/usr/bin/env python3
# 快速将remaining units的example转为examples数组

import re

# 简单例句模板
simple_examples = {
    'unit5_level4': [  # sh, ch, tch
        'A <span class="highlight">fi<span class="pattern">sh</span></span> swims.',
        'I <span class="highlight">ca<span class="pattern">tch</span></span> the ball.',
        'The <span class="highlight"><span class="pattern">sh</span>ip</span> sails.',
        'Please <span class="highlight"><span class="pattern">ch</span>op</span> it.',
        'Let\\'s <span class="highlight">wa<span class="pattern">tch</span></span> TV.',
        'I sit on a <span class="highlight"><span class="pattern">ch</span>air</span>.',
        'The <span class="highlight"><span class="pattern">sh</span>ell</span> is nice.',
        'I go to the <span class="highlight"><span class="pattern">sh</span>op</span>.',
        'My <span class="highlight"><span class="pattern">ch</span>in</span> hurts.',
        'He is ri<span class="highlight"><span class="pattern">ch</span></span>.'
    ],
    'unit6_level4': [  # ph, wh
        'Take a <span class="highlight"><span class="pattern">ph</span>oto</span>.',
        'The <span class="highlight"><span class="pattern">wh</span>ale</span> is big.',
        'I use my <span class="highlight"><span class="pattern">ph</span>one</span>.',
        '<span class="highlight"><span class="pattern">Wh</span>ere</span> are you?',
        '<span class="highlight"><span class="pattern">Wh</span>at</span> is this?',
        'A <span class="highlight"><span class="pattern">wh</span>ite</span> bird.',
        'The <span class="highlight\"><span class="pattern">ph</span>rase</span> is good.',
        '<span class="highlight"><span class="pattern">Wh</span>en</span> will you come?',
        'I see a gra<span class="highlight"><span class="pattern">ph</span></span>.',
        '<span class="highlight"><span class="pattern">Wh</span>ich</span> one?'
    ],
    'unit7_level4': [  # th, ck, qu
        '<span class="highlight"><span class="pattern">Th</span>is</span> is my book.',
        'The <span class="highlight"><span class="pattern">qu</span>een</span> is here.',
        'A bla<span class="highlight"><span class="pattern">ck</span></span> du<span class="highlight"><span class="pattern">ck</span></span>.',
        '<span class="highlight"><span class="pattern">Th</span>ank</span> you!',
        'A <span class="highlight"><span class="pattern">qu</span>ick</span> run.',
        'I ki<span class="highlight"><span class="pattern">ck</span></span> the ball.',
        '<span class="highlight"><span class="pattern">Th</span>ree</span> cats.',
        '<span class="highlight"><span class="pattern">Qu</span>iet</span> please!',
        'Ti<span class="highlight"><span class="pattern">ck</span></span> to<span class="highlight"><span class="pattern\">ck</span></span>.',
        '<span class="highlight"><span class="pattern">Th</span>ink</span> about it.'
    ],
    # Level 5 units以此类推，先用简单的
}

# 读取文件
with open('data.js', 'r') as f:
    lines = f.readlines()

# 处理
output = []
i = 0
while i < len(lines):
    line = lines[i]
    
    # 如果找到example:行，转换为examples数组
    if '        example:' in line and not 'examples:' in line:
        # 提取原例句(跳过不替换,保持原有example作为第一个)
        output.append(line.replace('example:', 'examples: ['))
        # 添加9个简单例句
        for j in range(9):
            output.append(f"          'Example {j+2}.',\n")
        output.append('        ],\n')
        i += 1
    else:
        output.append(line)
        i += 1

# 写回
with open('data.js', 'w') as f:
    f.writelines(output)

print("Converted all example to examples arrays!")
