import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Video } from 'expo-av';

const VideoPlayer = ({ videoFile, visible, onClose }) => {
  const [status, setStatus] = useState({});
  const [videoSource, setVideoSource] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (visible && videoFile) {
      loadVideo(videoFile);
    } else {
      setVideoSource(null);
      setErrorMessage(null);
    }
  }, [visible, videoFile]);

  const loadVideo = async (filename) => {
    setIsLoading(true);
    setVideoSource(null);
    setErrorMessage(null);

    try {
      // Try multiple approaches to load the video

      // Approach 1: Simple URI (works in some Expo environments)
      console.log('Trying to load video:', filename);

      // For Expo Go, we need to use a different approach
      // Since we can't use dynamic require, let's try direct URI first
      const source = { uri: `assets/video/${filename}` };
      setVideoSource(source);

    } catch (error) {
      console.error('Error setting up video:', error);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoError = (error) => {
    console.error('Video playback error:', error);
    setErrorMessage('Video could not be loaded. The file may be missing or in an unsupported format.');
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
          <Text style={styles.title}>Phonics Video</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.videoContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading video...</Text>
              <Text style={styles.loadingSubtext}>{videoFile}</Text>
            </View>
          ) : errorMessage ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load video</Text>
              <Text style={styles.errorSubtext}>{errorMessage}</Text>
              <Text style={styles.errorSubtext}>Video: {videoFile}</Text>
              <Text style={styles.hintText}>
                Note: Local video playback in Expo Go requires special setup.
                {'\n'}For development, you may need to use remote URLs.
              </Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => loadVideo(videoFile)}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : videoSource ? (
            <>
              <Video
                ref={videoRef}
                style={styles.video}
                source={videoSource}
                useNativeControls
                resizeMode="contain"
                isLooping={false}
                onPlaybackStatusUpdate={(newStatus) => {
                  setStatus(newStatus);
                  if (newStatus.error) {
                    handleVideoError(newStatus.error);
                  }
                }}
                onError={handleVideoError}
              />
              <View style={styles.infoOverlay}>
                <Text style={styles.infoText}>{videoFile}</Text>
              </View>
            </>
          ) : (
            <View style={styles.placeholderVideo}>
              <Text style={styles.placeholderText}>Video not available</Text>
              <Text style={styles.placeholderSubtext}>{videoFile}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => loadVideo(videoFile)}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => {
              if (videoRef.current) {
                if (status.isPlaying) {
                  videoRef.current.pauseAsync();
                } else {
                  videoRef.current.playAsync();
                }
              }
            }}
          >
            <Text style={styles.playButtonText}>
              {status.isPlaying ? '⏸ Pause' : '▶ Play'}
            </Text>
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
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 60,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 8,
  },
  infoText: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 4,
  },
  hintText: {
    color: '#888',
    fontSize: 10,
  },
  controls: {
    padding: 20,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  loadingSubtext: {
    color: '#888',
    fontSize: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorSubtext: {
    color: '#ffcccc',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  placeholderVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  placeholderText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  placeholderSubtext: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
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
  },
});

export default VideoPlayer;
