import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LEVEL_COLORS } from '../constants';
import phonicsData from '../assets/data/phonicsData';
import { wordInfo } from '../assets/data/wordInfo';
import { useApp } from '../contexts/AppContext';
import VideoPlayer from '../components/VideoPlayer';
import videoMapping from '../../video_mapping.json';

const Tab = createBottomTabNavigator();

// Videos Tab Component
const VideosTab = ({ route }) => {
  const { levelId, unitId } = route.params || {};
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoVisible, setVideoVisible] = useState(false);
  const color = LEVEL_COLORS[levelId];

  // Get videos for this unit
  const levelVideos = videoMapping[levelId] || { units: {}, other: [] };
  const unitVideos = levelVideos.units[unitId] || [];
  const otherVideos = levelVideos.other || [];

  const allVideos = [...unitVideos, ...otherVideos];

  const handlePlayVideo = (filename) => {
    // For React Native, we need to use require with static assets
    // In a real implementation, you would need to set up proper asset loading
    // For now, we'll just show the video player with a placeholder
    setSelectedVideo(filename);
    setVideoVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Render video list */}
      {allVideos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No videos available for this unit</Text>
        </View>
      ) : (
        <FlatList
          data={allVideos}
          keyExtractor={(item, index) => `${item.filename}-${index}`}
          contentContainerStyle={styles.videosList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.videoItem}
              onPress={() => handlePlayVideo(item.filename)}
            >
              <View style={styles.videoIcon}>
                <Text style={{ fontSize: 24 }}>▶️</Text>
              </View>
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle} numberOfLines={2}>
                  {item.filename.replace('.mp4', '')}
                </Text>
                <Text style={styles.videoType}>{item.type}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Video Player */}
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

// Word Highlight Component
const WordHighlight = ({ word, highlight }) => {
  const renderHighlightedWord = () => {
    // Handle Magic E patterns (i_e, a_e, etc.)
    if (highlight.includes('_')) {
      const vowel = highlight.split('_')[0];
      const letters = word.split('');
      const vowelIndex = letters.findIndex(l => l.toLowerCase() === vowel);
      const lastEIndex = letters.length - 1;

      return letters.map((letter, index) => {
        const isHighlighted = index === vowelIndex || (index === lastEIndex && letter === 'e');
        return (
          <Text key={index} style={isHighlighted ? styles.highlightedLetter : styles.letter}>
            {letter}
          </Text>
        );
      });
    }

    // Standard highlighting
    const letters = word.split('');
    const lowerWord = word.toLowerCase();
    const lowerHighlight = highlight.toLowerCase();
    const startIndex = lowerWord.indexOf(lowerHighlight);

    if (startIndex === -1) {
      return <Text style={styles.letter}>{word}</Text>;
    }

    return letters.map((letter, index) => {
      const isHighlighted = index >= startIndex && index < startIndex + highlight.length;
      return (
        <Text key={index} style={isHighlighted ? styles.highlightedLetter : styles.letter}>
          {letter}
        </Text>
      );
    });
  };

  return (
    <View style={styles.wordContainer}>
      <Text style={styles.wordText}>
        {renderHighlightedWord()}
      </Text>
    </View>
  );
};

// Word Card Component
const WordCard = ({ wordData, color, onPress }) => {
  const { word, highlight, emoji } = wordData;
  const info = wordInfo[word.toLowerCase()];

  return (
    <TouchableOpacity style={[styles.card, { borderColor: color }]} onPress={onPress}>
      <Text style={styles.emoji}>{emoji}</Text>
      <WordHighlight word={word} highlight={highlight} />
      {info && (
        <View style={styles.infoContainer}>
          <Text style={styles.phonetic}>{info.phonetic}</Text>
          <Text style={styles.definition}>{info.definition}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// Words Tab Component
const WordsTab = ({ route }) => {
  const { levelId, unitId } = route.params || {};
  const unitData = phonicsData[levelId]?.units.find(u => u.id === unitId);
  const color = LEVEL_COLORS[levelId];
  const { speakWord } = useApp();

  if (!unitData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Unit not found</Text>
      </SafeAreaView>
    );
  }

  // Group words by pattern
  const groupedWords = unitData.patterns.map(pattern => {
    const wordsForPattern = unitData.words.filter(w => w.highlight === pattern);
    return { pattern, words: wordsForPattern };
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {groupedWords.map((group, index) => (
          <View key={index} style={styles.patternSection}>
            <View style={[styles.patternHeader, { backgroundColor: color }]}>
              <Text style={styles.patternText}>{group.pattern}</Text>
            </View>
            <View style={styles.wordsGrid}>
              {group.words.map((wordData, idx) => (
                <WordCard
                  key={idx}
                  wordData={wordData}
                  color={color}
                  onPress={() => speakWord(wordData.word)}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// Example Highlight Component
const ExampleHighlight = ({ html, color }) => {
  const parseExample = (htmlString) => {
    // Extract plain text for speaking
    const plainText = htmlString.replace(/<[^>]*>/g, '');

    // Parse HTML into segments with highlighting info
    const segments = [];
    let currentText = '';
    const tagStack = [];

    // Simple HTML parser with stack for nested tags
    let i = 0;
    while (i < htmlString.length) {
      if (htmlString[i] === '<') {
        // Push current text if any
        if (currentText) {
          const inPattern = tagStack.includes('pattern');
          const inHighlight = tagStack.includes('highlight');
          segments.push({ text: currentText, isHighlight: inHighlight, isPattern: inPattern });
          currentText = '';
        }

        // Find end of tag
        const endIndex = htmlString.indexOf('>', i);
        if (endIndex === -1) break;

        const tag = htmlString.substring(i + 1, endIndex);
        if (tag === 'span class="highlight"' || tag === 'span class=\'highlight\'') {
          tagStack.push('highlight');
        } else if (tag === 'span class="pattern"' || tag === 'span class=\'pattern\'') {
          tagStack.push('pattern');
        } else if (tag === '/span') {
          tagStack.pop();
        }

        i = endIndex + 1;
      } else {
        currentText += htmlString[i];
        i++;
      }
    }

    // Push remaining text
    if (currentText) {
      const inPattern = tagStack.includes('pattern');
      const inHighlight = tagStack.includes('highlight');
      segments.push({ text: currentText, isHighlight: inHighlight, isPattern: inPattern });
    }

    return { plainText, segments };
  };

  const { plainText, segments } = parseExample(html);

  return (
    <View style={styles.exampleHighlightContainer}>
      {segments.map((segment, index) => (
        <Text
          key={index}
          style={[
            styles.exampleSegmentText,
            segment.isPattern && { color: color, fontWeight: 'bold' },
            segment.isHighlight && !segment.isPattern && { fontWeight: '600' },
          ]}
        >
          {segment.text}
        </Text>
      ))}
    </View>
  );
};

// Examples Tab Component
const ExamplesTab = ({ route }) => {
  const { levelId, unitId } = route.params || {};
  const unitData = phonicsData[levelId]?.units.find(u => u.id === unitId);
  const color = LEVEL_COLORS[levelId];
  const { speakWord } = useApp();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (!unitData || !unitData.examples || unitData.examples.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No examples available for this unit</Text>
      </View>
    );
  }

  const examples = unitData.examples;
  const currentExample = examples[currentIndex];

  // Get plain text for speaking
  const getPlainText = (html) => {
    return html.replace(/<[^>]*>/g, '');
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < examples.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.examplePagerContainer}>
        {/* Example Card */}
        <TouchableOpacity
          style={styles.examplePagerCard}
          onPress={() => speakWord(getPlainText(currentExample))}
        >
          <View style={styles.examplePagerContent}>
            <ExampleHighlight html={currentExample} color={color} />
          </View>
          <View style={styles.exampleTapHint}>
            <Text style={styles.exampleTapHintText}>Tap to listen 🔊</Text>
          </View>
        </TouchableOpacity>

        {/* Page Number and Navigation Buttons - Same Row */}
        <View style={styles.pageNavRow}>
          {/* Previous Button */}
          <TouchableOpacity
            style={[
              styles.exampleNavButton,
              currentIndex === 0 && styles.exampleNavButtonDisabled,
            ]}
            onPress={handlePrev}
            disabled={currentIndex === 0}
          >
            <Text style={[
              styles.exampleNavButtonText,
              currentIndex === 0 && styles.exampleNavButtonTextDisabled,
            ]}>← Previous</Text>
          </TouchableOpacity>

          {/* Page Number */}
          <View style={[styles.examplePagerNumber, { backgroundColor: color }]}>
            <Text style={styles.examplePagerNumberText}>{currentIndex + 1}</Text>
            <Text style={styles.examplePagerTotal}>/ {examples.length}</Text>
          </View>

          {/* Next Button */}
          <TouchableOpacity
            style={[
              styles.exampleNavButton,
              currentIndex === examples.length - 1 && styles.exampleNavButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={currentIndex === examples.length - 1}
          >
            <Text style={[
              styles.exampleNavButtonText,
              currentIndex === examples.length - 1 && styles.exampleNavButtonTextDisabled,
            ]}>Next →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Main Unit Screen with Tabs
const UnitScreen = ({ route }) => {
  const { levelId, unitId } = route.params || {};
  const color = LEVEL_COLORS[levelId];

  return (
    <Tab.Navigator
      initialRouteName="Words"
      screenOptions={{
        tabBarActiveTintColor: color,
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Videos"
        component={VideosTab}
        initialParams={{ levelId, unitId }}
        options={{
          tabBarLabel: 'Videos',
          tabBarIcon: () => (
            <Text style={{ fontSize: 20 }}>🎬</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Words"
        component={WordsTab}
        initialParams={{ levelId, unitId }}
        options={{
          tabBarLabel: 'Words',
          tabBarIcon: () => (
            <Text style={{ fontSize: 20 }}>🔤</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Examples"
        component={ExamplesTab}
        initialParams={{ levelId, unitId }}
        options={{
          tabBarLabel: 'Examples',
          tabBarIcon: () => (
            <Text style={{ fontSize: 20 }}>📖</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 12,
  },
  patternSection: {
    marginBottom: 16,
  },
  patternHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  patternText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  wordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    minHeight: 180,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  wordContainer: {
    marginBottom: 6,
  },
  wordText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  letter: {
    color: '#666',
    fontSize: 32,
  },
  highlightedLetter: {
    color: '#E91E63',
    fontWeight: 'bold',
    fontSize: 32,
  },
  infoContainer: {
    alignItems: 'center',
  },
  phonetic: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  definition: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  examplesList: {
    padding: 12,
  },
  exampleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  exampleNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exampleNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  exampleText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  examplePagerContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  examplePagerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    minHeight: 200,
  },
  examplePagerNumber: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  examplePagerNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  examplePagerTotal: {
    color: '#fff',
    fontSize: 10,
    marginLeft: 4,
    opacity: 0.8,
  },
  examplePagerContent: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 16,
  },
  examplePagerText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 28,
    textAlign: 'center',
  },
  exampleHighlightContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exampleSegmentText: {
    fontSize: 38,
    color: '#333',
    lineHeight: 50,
  },
  exampleTapHint: {
    alignItems: 'center',
    marginTop: 8,
  },
  exampleTapHintText: {
    fontSize: 12,
    color: '#999',
  },
  pageNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 8,
  },
  exampleNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  exampleNavButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minWidth: 100,
    alignItems: 'center',
  },
  exampleNavButtonDisabled: {
    backgroundColor: '#f0f0f0',
    elevation: 0,
  },
  exampleNavButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  exampleNavButtonTextDisabled: {
    color: '#ccc',
  },
  exampleProgressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    flexWrap: 'wrap',
  },
  exampleProgressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 3,
    marginVertical: 2,
  },
  videosList: {
    padding: 12,
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  videoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    lineHeight: 20,
  },
  videoType: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textTransform: 'capitalize',
  },
});

export default UnitScreen;
