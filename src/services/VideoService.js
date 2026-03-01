import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

// Get video URI - try multiple approaches
export async function getVideoUri(filename) {
  if (!filename) return null;

  try {
    // First, try direct local URI for development
    // This works when the file is in assets/video/
    const localUri = `${FileSystem.documentDirectory}../assets/video/${filename}`;
    const fileInfo = await FileSystem.getInfoAsync(localUri);
    if (fileInfo.exists) {
      return localUri;
    }
  } catch (e) {
    console.log('Local URI approach failed:', e);
  }

  try {
    // Fall back to Asset.fromURI
    const asset = Asset.fromURI(`assets/video/${filename}`);
    await asset.downloadAsync();
    return asset.localUri || asset.uri;
  } catch (error) {
    console.error('Asset approach also failed:', error);

    // Last resort: return a simple URI string
    return `assets/video/${filename}`;
  }
}

// Preload multiple videos
export async function preloadVideos(filenames) {
  const results = [];
  for (const filename of filenames) {
    try {
      const uri = await getVideoUri(filename);
      results.push({ filename, uri, success: !!uri });
    } catch (error) {
      results.push({ filename, uri: null, success: false, error });
    }
  }
  return results;
}

export default {
  getVideoUri,
  preloadVideos,
};
