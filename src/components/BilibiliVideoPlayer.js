import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';

const BilibiliVideoPlayer = ({ videoUrl, visible, onClose, title }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState(null);

  // Convert Bilibili URL to embed player URL
  const getEmbedUrl = (url) => {
    if (!url) return null;

    // Extract BV number from URL
    // Example: https://www.bilibili.com/video/BV19KNwzRE7B/ -> BV19KNwzRE7B
    const bvMatch = url.match(/BV[a-zA-Z0-9]+/);
    if (bvMatch) {
      const bvid = bvMatch[0];
      // Add autoplay=1 and muted=1 (muted may be required for autoplay on some platforms)
      return `https://player.bilibili.com/player.html?bvid=${bvid}&high_quality=1&danmaku=0&autoplay=1&muted=0`;
    }

    // If it's already an embed URL, return it
    if (url.includes('player.bilibili.com')) {
      // Ensure autoplay parameters are present
      if (!url.includes('autoplay=')) {
        const separator = url.includes('?') ? '&' : '?';
        return url + separator + 'autoplay=1&muted=0';
      }
      return url;
    }

    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  const handleError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    setErrorMessage('Failed to load video. Please check your internet connection.');
    setIsLoading(false);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    setErrorMessage(null);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  // For web platform, use an iframe approach
  const renderWebContent = () => {
    if (!embedUrl) return null;

    if (Platform.OS === 'web') {
      return (
        <iframe
          src={embedUrl}
          style={{ width: '100%', height: '100%', border: 'none' }}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title={title || 'Bilibili Video'}
        />
      );
    }

    // JavaScript to auto-click play button as fallback
    const injectedJavaScript = `
      (function() {
        // Try to auto-play by clicking the play button
        setTimeout(function() {
          var playButton = document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-play') ||
                           document.querySelector('.play-btn') ||
                           document.querySelector('.play-button') ||
                           document.querySelector('button[title*="play" i]');
          if (playButton) {
            playButton.click();
          }
        }, 1500);
      })();
      true;
    `;

    return (
      <WebView
        source={{ uri: embedUrl }}
        style={styles.webview}
        onError={handleError}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsFullscreenVideo={true}
        mixedContentMode="compatibility"
        // iOS: Disable user action requirement for media playback
        mediaPlaybackRequiresUserAction={false}
        // Android: Also set via the same prop (supported in newer versions)
        androidHardwareAccelerationDisabled={false}
        // Inject JavaScript to auto-click play button as fallback
        injectedJavaScript={injectedJavaScript}
        // For older Android versions compatibility
        setBuiltInZoomControls={false}
        displayZoomControls={false}
      />
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕ Close</Text>
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>
            {title || 'Bilibili Video'}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.videoContainer}>
          {isLoading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading video...</Text>
              <Text style={styles.loadingSubtext}>{embedUrl}</Text>
            </View>
          )}

          {errorMessage && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load video</Text>
              <Text style={styles.errorSubtext}>{errorMessage}</Text>
              <Text style={styles.hintText}>
                Note: Bilibili videos may have regional restrictions.
                {'\n'}You can also watch directly on Bilibili website.
              </Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => {
                  setErrorMessage(null);
                  setIsLoading(true);
                }}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {!errorMessage && renderWebContent()}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.openButton} onPress={onClose}>
            <Text style={styles.openButtonText}>Done Watching</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'SassoonPrimary',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
    fontFamily: 'SassoonPrimary',
  },
  placeholder: {
    width: 60,
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'SassoonPrimary',
  },
  loadingSubtext: {
    color: '#888',
    fontSize: 12,
    fontFamily: 'SassoonPrimary',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#000',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'SassoonPrimary',
  },
  errorSubtext: {
    color: '#ffcccc',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'SassoonPrimary',
  },
  hintText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'SassoonPrimary',
  },
  retryButton: {
    backgroundColor: '#333',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#E91E63',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'SassoonPrimary',
  },
  footer: {
    padding: 20,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
  },
  openButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
  },
  openButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'SassoonPrimary',
  },
});

export default BilibiliVideoPlayer;
