import React, { useState, useEffect } from 'react';
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
import { wordInfo } from '../assets/data/wordInfo';
import { useApp } from '../contexts/AppContext';

const ExploreScreen = ({ route, navigation }) => {
  const { levelId, unitId } = route.params || {};
  const { speakWord } = useApp();

  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let exploreWords = [];

    if (unitId && levelId) {
      // Specific unit explore
      const unitData = phonicsData[levelId].units.find(u => u.id === unitId);
      exploreWords = unitData ? [...unitData.exploreWords] : [];
    } else if (levelId) {
      // All units in level
      const levelData = phonicsData[levelId];
      levelData.units.forEach(unit => {
        exploreWords.push(...unit.exploreWords);
      });
    } else {
      // All words from all levels
      Object.values(phonicsData).forEach(level => {
        level.units.forEach(unit => {
          exploreWords.push(...unit.exploreWords);
        });
      });
    }

    // Shuffle words
    const shuffled = [...exploreWords].sort(() => Math.random() - 0.5);
    setWords(shuffled);
  }, [levelId, unitId]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
  };

  const handleSpeak = () => {
    if (words[currentIndex]) {
      speakWord(words[currentIndex].word);
    }
  };

  const handleShuffle = () => {
    setWords([...words].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
  };

  if (words.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No words to explore</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentWord = words[currentIndex];
  const info = wordInfo[currentWord.word.toLowerCase()];
  const color = levelId ? LEVEL_COLORS[levelId] : '#9C27B0';

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: color }]}>
        <Text style={styles.headerTitle}>Explore Mode</Text>
        <Text style={styles.headerSubtitle}>
          {currentIndex + 1} / {words.length}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.card, { borderColor: color }]}>
          <Text style={styles.wordText}>{currentWord.word}</Text>

          {info && (
            <View style={styles.infoContainer}>
              <Text style={styles.phonetic}>{info.phonetic}</Text>
              <Text style={styles.definition}>{info.definition}</Text>
            </View>
          )}

          <View style={styles.patternContainer}>
            <Text style={styles.patternLabel}>Pattern: </Text>
            <Text style={styles.patternValue}>{currentWord.highlight}</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.speakButton, { backgroundColor: color }]} onPress={handleSpeak}>
          <Text style={styles.speakButtonText}>🔊 Speak Word</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={handlePrevious}>
          <Text style={styles.controlButtonText}>← Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.shuffleButton, { backgroundColor: color }]}
          onPress={handleShuffle}
        >
          <Text style={styles.controlButtonText}>Shuffle</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={handleNext}>
          <Text style={styles.controlButtonText}>Next →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'SassoonPrimary',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    fontFamily: 'SassoonPrimary',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 3,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  wordText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    fontFamily: 'SassoonPrimary',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  phonetic: {
    fontSize: 18,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
    fontFamily: 'SassoonPrimary',
  },
  definition: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    fontFamily: 'SassoonPrimary',
  },
  patternContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patternLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'SassoonPrimary',
  },
  patternValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'SassoonPrimary',
  },
  speakButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  speakButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'SassoonPrimary',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  controlButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  shuffleButton: {
    backgroundColor: '#9C27B0',
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'SassoonPrimary',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'SassoonPrimary',
  },
});

export default ExploreScreen;
