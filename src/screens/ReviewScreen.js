import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { LEVEL_COLORS } from '../constants';
import phonicsData from '../assets/data/phonicsData';
import { wordInfo } from '../assets/data/wordInfo';
import { useApp } from '../contexts/AppContext';

const ReviewScreen = ({ route, navigation }) => {
  const { levelId, unitId } = route.params || {};
  const { speakWord } = useApp();

  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [flipAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    let wordList = [];

    if (unitId && levelId) {
      const unitData = phonicsData[levelId].units.find(u => u.id === unitId);
      wordList = unitData ? [...unitData.words] : [];
    } else if (levelId) {
      const levelData = phonicsData[levelId];
      levelData.units.forEach(unit => {
        wordList.push(...unit.words);
      });
    } else {
      Object.values(phonicsData).forEach(level => {
        level.units.forEach(unit => {
          wordList.push(...unit.words);
        });
      });
    }

    const shuffled = [...wordList].sort(() => Math.random() - 0.5);
    setWords(shuffled);
  }, [levelId, unitId]);

  const handleFlip = () => {
    const toValue = showAnswer ? 0 : 1;

    Animated.spring(flipAnim, {
      toValue,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();

    setShowAnswer(!showAnswer);
  };

  const handleNext = () => {
    setShowAnswer(false);
    flipAnim.setValue(0);
    setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  const handlePrevious = () => {
    setShowAnswer(false);
    flipAnim.setValue(0);
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
  };

  if (words.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No words to review</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentWord = words[currentIndex];
  const info = wordInfo[currentWord.word.toLowerCase()];
  const color = levelId ? LEVEL_COLORS[levelId] : '#9C27B0';

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: color }]}>
        <Text style={styles.headerTitle}>Review Mode</Text>
        <Text style={styles.headerSubtitle}>
          {currentIndex + 1} / {words.length}
        </Text>
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity activeOpacity={0.9} onPress={handleFlip}>
          {/* Front of card */}
          <Animated.View
            style={[
              styles.card,
              { borderColor: color },
              { transform: [{ rotateY: frontInterpolate }] },
              showAnswer && styles.hidden,
            ]}
          >
            <Text style={styles.cardEmoji}>{currentWord.emoji}</Text>
            <Text style={styles.cardWord}>{currentWord.word}</Text>
            <TouchableOpacity
              style={styles.speakButton}
              onPress={() => speakWord(currentWord.word)}
            >
              <Text style={styles.speakButtonText}>🔊</Text>
            </TouchableOpacity>
            <Text style={styles.tapHint}>Tap to flip</Text>
          </Animated.View>

          {/* Back of card */}
          <Animated.View
            style={[
              styles.card,
              styles.cardBack,
              { borderColor: color },
              { transform: [{ rotateY: backInterpolate }] },
              !showAnswer && styles.hidden,
            ]}
          >
            <Text style={styles.cardWordBack}>{currentWord.word}</Text>
            {info && (
              <>
                <Text style={styles.phoneticBack}>{info.phonetic}</Text>
                <Text style={styles.definitionBack}>{info.definition}</Text>
              </>
            )}
            <View style={styles.patternContainer}>
              <Text style={styles.patternLabelBack}>Pattern:</Text>
              <Text style={styles.patternValue}>{currentWord.highlight}</Text>
            </View>
            <Text style={styles.tapHint}>Tap to flip back</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={handlePrevious}>
          <Text style={styles.controlButtonText}>← Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.shuffleButton, { backgroundColor: color }]}
          onPress={() => {
            setWords([...words].sort(() => Math.random() - 0.5));
            setCurrentIndex(0);
            setShowAnswer(false);
            flipAnim.setValue(0);
          }}
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
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: 320,
    height: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  hidden: {
    opacity: 0,
  },
  cardEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  cardWord: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'SassoonPrimary',
  },
  cardWordBack: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    fontFamily: 'SassoonPrimary',
  },
  speakButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
  },
  speakButtonText: {
    fontSize: 24,
  },
  tapHint: {
    marginTop: 20,
    fontSize: 12,
    color: '#999',
    fontFamily: 'SassoonPrimary',
  },
  phoneticBack: {
    fontSize: 20,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
    fontFamily: 'SassoonPrimary',
  },
  definitionBack: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    paddingHorizontal: 20,
    fontFamily: 'SassoonPrimary',
  },
  patternContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  patternLabelBack: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'SassoonPrimary',
  },
  patternValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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

export default ReviewScreen;
