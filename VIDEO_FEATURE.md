# Phonics Video Feature - Implementation Summary

## Overview

已实现 YouTube 视频集成功能，允许在每个 unit 页面播放对应的自然拼读视频。

## Files Created/Modified

### New Files:
1. **`src/assets/data/videoInfo.js`** - 视频信息映射文件
   - 映射每个 level 和 unit 到对应的视频文件
   - 包含所有 5 个播放列表的 URL

2. **`src/components/VideoPlayer.js`** - 视频播放器组件
   - 使用 expo-av 播放视频
   - 全屏模态展示
   - 原生播放控制
   - 播放/暂停按钮

3. **`download-videos.sh`** - YouTube 视频下载脚本
   - 使用 yt-dlp 下载视频
   - 自动保存到 assets/video/ 目录
   - 按 levelX-unitY.mp4 格式命名

### Modified Files:
1. **`src/screens/LevelScreen.js`** - 级别页面
   - 添加视频播放按钮
   - 集成 VideoPlayer 组件
   - 按钮显示在每个 unit 卡片右上角

## Usage Instructions

### Step 1: Download Videos

```bash
# Run the download script
./download-videos.sh
```

这会将所有 YouTube 视频下载到 `assets/video/` 目录。

### Step 2: Verify Filenames

确保下载的视频文件名与 `src/assets/data/videoInfo.js` 中的映射匹配：
- `level1-unit1.mp4`
- `level1-unit2.mp4`
- ...
- `level5-unit8.mp4`

### Step 3: Run the App

```bash
npm start
```

## Features

### Video Player
- 全屏模态展示
- 原生播放器控制
- 播放/暂停按钮
- 关闭按钮

### Unit Card Integration
- 视频按钮仅在有对应视频时显示
- 按钮使用对应级别的主题色
- 点击按钮不影响进入 unit 页面
- 点击卡片仍然可以进入 unit 页面

## Technical Details

### Dependencies
- `expo-av` - 视频播放（已在项目中）
- `yt-dlp` - YouTube 下载（需单独安装）

### Video File Location
Video files should be placed in:
```
assets/video/
├── level1-unit1.mp4
├── level1-unit2.mp4
├── ...
└── level5-unit8.mp4
```

### Data Structure
```javascript
// src/assets/data/videoInfo.js
{
  level1: {
    playlist: 'YouTube playlist URL',
    units: {
      unit1: 'level1-unit1.mp4',
      unit2: 'level1-unit2.mp4',
      // ...
    }
  },
  // ... level2-5
}
```

## Notes

1. **Copyright**: Ensure you have the rights to use and download these videos.
2. **File Size**: Videos can take significant storage space.
3. **Download Time**: Downloading 40 videos (5 levels × 8 units) may take time.
4. **Alternative**: Consider using YouTube embedding if downloading is not feasible.

## Troubleshooting

### Video not playing
- Verify the video file exists in `assets/video/`
- Check filename matches exactly (case-sensitive)
- Ensure video format is supported (MP4 recommended)

### yt-dlp not found
Install yt-dlp:
```bash
# macOS
brew install yt-dlp

# or using pip
pip install yt-dlp
```

### Button not showing
- Check that video file is properly mapped in videoInfo.js
- Verify hasVideo() function returns true
