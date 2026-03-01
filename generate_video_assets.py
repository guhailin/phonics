#!/usr/bin/env python3
import os
import json

VIDEO_DIR = '/Users/e99g41y/worksapce/phonics_rn/assets/video'
OUTPUT_FILE = '/Users/e99g41y/worksapce/phonics_rn/src/assets/data/videoAssets.js'

def generate_video_assets():
    video_files = [f for f in os.listdir(VIDEO_DIR) if f.endswith('.mp4')]

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write('// Auto-generated video assets mapping\n')
        f.write('// Do not edit manually - regenerate with generate_video_assets.py\n\n')

        # Write import statements for a few test videos first
        # For all videos, we'll create a lookup function
        f.write('// Video asset lookup function\n')
        f.write('export function getVideoSource(filename) {\n')
        f.write('  // In Expo, assets need to be required statically\n')
        f.write('  // This is a placeholder - you need to manually add requires\n')
        f.write('  // or use a different approach for many videos\n')
        f.write('  return filename;\n')
        f.write('}\n\n')

        f.write('// For development, we export the list of video files\n')
        f.write('export const videoFiles = [\n')
        for video in sorted(video_files):
            f.write(f"  '{video}',\n")
        f.write('];\n\n')

        f.write('export default videoFiles;\n')

    print(f"Generated: {OUTPUT_FILE}")
    print(f"Found {len(video_files)} video files")

    # Also create a simple version that uses Asset from expo-asset
    with open('/Users/e99g41y/worksapce/phonics_rn/src/assets/data/videoHelper.js', 'w', encoding='utf-8') as f:
        f.write('// Helper for loading videos in Expo\n')
        f.write('import { Asset } from "expo-asset";\n\n')
        f.write('// Video files list\n')
        f.write('export const videoFiles = [\n')
        for video in sorted(video_files):
            f.write(f"  '{video}',\n")
        f.write('];\n\n')
        f.write('// Load a video asset by filename\n')
        f.write('export async function loadVideoAsset(filename) {\n')
        f.write('  try {\n')
        f.write('    // For local development, we try different approaches\n')
        f.write('    // In production, you would need static requires\n')
        f.write('    const asset = Asset.fromURI(`assets/video/${filename}`);\n')
        f.write('    await asset.downloadAsync();\n')
        f.write('    return asset.localUri || asset.uri;\n')
        f.write('  } catch (error) {\n')
        f.write('    console.error("Error loading video:", error);\n')
        f.write('    return null;\n')
        f.write('  }\n')
        f.write('}\n\n')
        f.write('export default videoFiles;\n')

    print("Generated: src/assets/data/videoHelper.js")

if __name__ == '__main__':
    generate_video_assets()
