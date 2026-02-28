import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LEVEL_COLORS } from '../constants';
import phonicsData from '../assets/data/phonicsData';
import { getVideoFile } from '../assets/data/videoInfo';
import VideoPlayer from '../components/VideoPlayer';

const LevelScreen = ({ route, navigation }) => {
  const { levelId } = route.params;
  const levelData = phonicsData[levelId];
  const color = LEVEL_COLORS[levelId];
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoVisible, setVideoVisible] = useState(false);

  const handlePlayVideo = (unitId) => {
    const videoFile = getVideoFile(levelId, unitId);
    if (videoFile) {
      setSelectedVideo(videoFile);
      setVideoVisible(true);
    }
  };

  const renderUnitItem = ({ item: unit }) => {
    const videoFile = getVideoFile(levelId, unit.id);
    const hasVideo = !!videoFile;

    return (
      <TouchableOpacity
        style={[styles.unitCard, { borderLeftColor: color, borderLeftWidth: 6 }]}
        onPress={() =>
          navigation.navigate('Unit', {
            levelId,
            unitId: unit.id,
            unitName: unit.name,
            color: color,
          })
        }
      >
        <View style={styles.unitHeader}>
          <Text style={styles.unitName}>{unit.name}</Text>
          {hasVideo && (
            <TouchableOpacity
              style={[styles.videoButton, { backgroundColor: color }]}
              onPress={(e) => {
                e.stopPropagation();
                handlePlayVideo(unit.id);
              }}
            >
              <Text style={styles.videoButtonText}>▶ Video</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.patternLabel}>Patterns:</Text>
        <View style={styles.patternsContainer}>
          {unit.patterns.map((pattern, index) => (
            <View key={index} style={[styles.patternBadge, { backgroundColor: color }]}>
              <Text style={styles.patternText}>{pattern}</Text>
            </View>
          ))}
        </View>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {unit.words.length} words • {unit.exploreWords?.length || 0} explore
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: color }]}>
        <Text style={styles.headerTitle}>{levelData.name}</Text>
        <Text style={styles.headerSubtitle}>{levelData.title}</Text>
      </View>

      <FlatList
        data={levelData.units}
        renderItem={renderUnitItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <VideoPlayer
        videoFile={selectedVideo}
        visible={videoVisible}
        onClose={() => {
          setVideoVisible(false);
          setSelectedVideo(null);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  listContainer: {
    padding: 12,
  },
  unitCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  unitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  unitName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  videoButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  videoButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  patternLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  patternsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  patternBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  patternText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  statsText: {
    fontSize: 12,
    color: '#888',
  },
});

export default LevelScreen;
