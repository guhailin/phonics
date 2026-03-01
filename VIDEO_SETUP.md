# 视频播放配置说明

## 问题说明

在 Expo/React Native 中播放本地视频文件有几种方案。当前视频文件已下载到 `assets/video/` 目录，但由于 Expo 的静态资源机制，需要特殊配置才能播放。

## 方案对比

### 方案 1：使用远程 URL（推荐，最简单）

**优点：**
- 实现简单，无需复杂配置
- 可以在任何设备上播放
- 不需要重新打包应用

**缺点：**
- 需要网络连接
- 需要云存储服务

**实现步骤：**
1. 将视频上传到云存储（阿里云 OSS、腾讯云 COS、AWS S3 等）
2. 修改 `video_mapping.json`，将文件名替换为远程 URL
3. 即可正常播放

### 方案 2：静态 require（适合少量视频）

**优点：**
- 离线可用
- 性能好

**缺点：**
- 186 个视频需要手动写 186 个 require 语句
- 增加应用体积
- 每次添加新视频都需要重新配置

### 方案 3：使用 expo-file-system

**优点：**
- 灵活控制文件

**缺点：**
- 实现复杂
- 需要处理文件系统权限

## 当前状态

✅ 已完成：
- 视频 tab UI 完整实现
- 视频列表显示正确
- 视频映射关系正确
- app.json 已配置 assetBundlePatterns
- metro.config.js 已创建

⚠️ 需要配置：
- 视频播放需要远程 URL 或更复杂的本地资源配置

## 快速测试

如果你想先测试视频播放器是否工作，可以修改一个视频项为远程测试 URL：

```javascript
// 在 VideosTab 组件中临时添加一个测试视频
const testVideo = {
  filename: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  type: 'test'
};
```

## 推荐下一步

**选择方案 1（远程 URL）**，因为：
1. 186 个视频文件体积较大
2. 实现最简单快速
3. 用户可以在任何地方使用

你想使用哪个方案？