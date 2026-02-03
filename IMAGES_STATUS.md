# 图片生成使用指南

## ✅ 已完成

已为 **133 个单词** 更新了更合适的 emoji 图标（从默认的 📝 更新为更具代表性的图标）。

## 📊 更新统计

- 第一次运行：18 个单词
- 第二次运行：115 个单词
- **总计：133 个单词**

## 🎨 图片显示优先级

应用会按以下优先级显示：
1. **真实图片** (如果有 `image` 字段) - 最优先
2. **Emoji图标** (使用 `emoji` 字段) - 作为后备
3. **默认图标** 🖼️ - 最终后备

## 🚀 如何使用真实图片

### 方案 1：使用 AI 图片生成服务（推荐）

#### OpenAI DALL-E 3
1. 获取 API Key：https://platform.openai.com/api-keys
2. 设置环境变量：
   ```bash
   export OPENAI_API_KEY="your-key-here"
   ```
3. 运行脚本：
   ```bash
   python3 generate_images.py
   ```

#### Stability AI
1. 获取 API Key：https://platform.stability.ai/
2. 设置环境变量：
   ```bash
   export STABILITY_API_KEY="your-key-here"
   ```
3. 运行脚本：
   ```bash
   python3 generate_images.py
   ```

### 方案 2：手动添加图片

1. 准备图片文件（建议 PNG 格式，正方形 1:1 比例）
2. 命名为 `单词.png`（例如：`cat.png`, `dog.png`）
3. 放入 `images/` 目录
4. 在 `data.js` 中添加 `image` 字段：
   ```javascript
   { word: 'cat', highlight: 'at', emoji: '🐱', image: 'images/cat.png' }
   ```

### 方案 3：使用在线图片服务

可以使用以下免费服务：
- **Unsplash** - https://unsplash.com/ (需要Attribution)
- **Pexels** - https://www.pexels.com/ (免费商用)
- **Pixabay** - https://pixabay.com/ (免费商用)

## 📝 当前状态

目前所有单词都有合适的emoji作为图标，可以正常使用。如果想要更真实的图片效果，可以：

1. 选择上述方案之一生成/添加图片
2. 优先为常用单词添加图片（如动物、食物等）
3. 逐步完善整个词库

## 🎯 优先级建议

建议优先为以下类别添加真实图片：
- 🐱 **动物类**：cat, dog, pig, hen, fox 等
- 🍎 **食物类**：jam, ham, beef, bean 等
- 🚗 **交通工具**：van, jet, coach 等
- 👨 **人物类**：man, dad, mom 等

这些单词更适合用真实或卡通图片展示。

## 💡 提示

- emoji 图标已经足够清晰，适合儿童学习
- 如果预算有限，继续使用 emoji 也是不错的选择
- 可以混合使用：重要单词用图片，其他用 emoji
