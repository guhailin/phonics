# 图片生成指南

本文档说明如何使用 Gemini 2.5 Flash Image API 为单词卡生成图片。

## 前置条件

1. **安装 Google Generative AI Python SDK**
   ```bash
   pip install google-generativeai
   ```

2. **获取 Gemini API Key**
   - 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
   - 创建或获取你的 API key

3. **设置环境变量**
   ```bash
   export GEMINI_API_KEY="your-api-key-here"
   ```

   或在 macOS/Linux 中永久设置：
   ```bash
   echo 'export GEMINI_API_KEY="your-api-key-here"' >> ~/.zshrc
   source ~/.zshrc
   ```

## 使用方法

### 1. 生成所有默认emoji(📝)的图片

运行脚本自动生成所有使用默认emoji的单词图片：

```bash
python3 generate_images.py
```

脚本会：
- 自动扫描 `data.js` 找出所有使用 📝 emoji 的单词
- 为每个单词调用 Gemini API 生成适合儿童学习的图片
- 将图片保存到 `images/` 目录
- 自动更新 `data.js`，添加图片路径到对应的单词对象

### 2. 查看生成进度

脚本会实时显示生成进度：

```
============================================================
Gemini 2.5 Flash Image API - 图片生成工具
============================================================

找到 50 个需要生成图片的单词

开始生成图片...
------------------------------------------------------------
[1/50] 正在为 'dam' 生成图片...
✓ 'dam' 图片已保存到 images/dam.png
[2/50] 正在为 'Sam' 生成图片...
✓ 'Sam' 图片已保存到 images/Sam.png
...
```

### 3. 手动生成单个图片

如果需要重新生成某个单词的图片，只需删除对应的图片文件，再次运行脚本：

```bash
rm images/dam.png
python3 generate_images.py
```

## 图片特点

生成的图片具有以下特点：
- **简单清晰**：适合儿童理解
- **卡通风格**：色彩鲜艳，友好可爱
- **教育性**：专注于单词的主要含义
- **1:1 比例**：适合作为flashcard使用

## 数据结构

更新后的 `data.js` 中，单词对象会包含 `image` 字段：

```javascript
// 之前
{ word: 'dam', highlight: 'am', emoji: '📝' }

// 之后
{ word: 'dam', highlight: 'am', emoji: '📝', image: 'images/dam.png' }
```

应用会优先显示图片，如果图片加载失败则显示emoji作为后备。

## 注意事项

1. **API 限流**：脚本在每次生成之间会延迟1秒，避免触发API限流
2. **费用**：Gemini API 可能产生费用，请查看 [定价信息](https://ai.google.dev/pricing)
3. **内容安全**：生成的内容会经过安全过滤，确保适合儿童
4. **图片质量**：AI生成的图片可能不总是完美，可以手动替换不满意的图片

## 自定义图片

如果对某些AI生成的图片不满意，可以：

1. 手动创建或下载更合适的图片
2. 将图片命名为 `单词.png`（如 `dam.png`）
3. 放入 `images/` 目录
4. 在 `data.js` 中手动添加或更新 `image` 字段

## 故障排除

### 问题：找不到模块 'google.generativeai'
```bash
pip install google-generativeai
```

### 问题：API key 未设置
确保环境变量已正确设置：
```bash
echo $GEMINI_API_KEY
```

### 问题：图片生成失败
- 检查网络连接
- 确认 API key 有效
- 查看错误信息，可能是内容安全过滤导致

### 问题：图片不显示
- 检查浏览器控制台错误
- 确认图片路径正确
- 确认图片文件存在于 `images/` 目录

## 支持

如有问题，请查看：
- [Gemini API 文档](https://ai.google.dev/docs)
- [Google AI Studio](https://makersuite.google.com/)
