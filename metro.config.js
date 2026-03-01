const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for video files
config.resolver.assetExts.push(
  'mp4',
  'mov',
  'avi',
  'mkv'
);

module.exports = config;