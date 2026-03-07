const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'assets/images');
const backupDir = path.join(__dirname, 'assets/images_backup');

// 创建备份目录
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// 获取所有PNG图片
const imageFiles = fs.readdirSync(imagesDir).filter(file =>
  file.toLowerCase().endsWith('.png')
);

console.log(`Found ${imageFiles.length} images to compress...\n`);

async function compressImages() {
  let totalOriginalSize = 0;
  let totalCompressedSize = 0;

  for (const file of imageFiles) {
    const inputPath = path.join(imagesDir, file);
    const backupPath = path.join(backupDir, file);
    const outputPath = path.join(imagesDir, file);

    // 获取原始大小
    const stats = fs.statSync(inputPath);
    const originalSize = stats.size;
    totalOriginalSize += originalSize;

    // 备份原图
    fs.copyFileSync(inputPath, backupPath);
    console.log(`Backed up: ${file}`);

    // 压缩图片
    try {
      await sharp(inputPath)
        .png({
          quality: 80,
          compressionLevel: 9,
          effort: 10
        })
        .toFile(outputPath + '.tmp');

      // 替换原文件
      fs.unlinkSync(outputPath);
      fs.renameSync(outputPath + '.tmp', outputPath);

      // 获取压缩后大小
      const compressedStats = fs.statSync(outputPath);
      const compressedSize = compressedStats.size;
      totalCompressedSize += compressedSize;

      const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1);
      console.log(`Compressed: ${file} - ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(compressedSize / 1024 / 1024).toFixed(2)}MB (saved ${savings}%)`);
    } catch (error) {
      console.error(`Error compressing ${file}:`, error);
      // 恢复备份
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, inputPath);
      }
    }
  }

  console.log(`\nTotal: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB → ${(totalCompressedSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Total savings: ${(((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(1))}%`);
  console.log(`\nOriginal images backed up to: ${backupDir}`);
}

compressImages().catch(console.error);
