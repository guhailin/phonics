import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LEVEL_COLORS } from '../constants';
import phonicsData from '../assets/data/phonicsData';
import { wordInfo } from '../assets/data/wordInfo';
import { useApp } from '../contexts/AppContext';

const Tab = createBottomTabNavigator();

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

// Examples Tab Component
const ExamplesTab = ({ route }) => {
  const { levelId, unitId } = route.params || {};
  const unitData = phonicsData[levelId]?.units.find(u => u.id === unitId);
  const color = LEVEL_COLORS[levelId];
  const { speakWord } = useApp();

  if (!unitData || !unitData.examples || unitData.examples.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No examples available for this unit</Text>
      </View>
    );
  }

  // Simple HTML to text converter
  const parseExample = (html) => {
    // Remove HTML tags
    const text = html.replace(/\u003c[^\u003e]*\u003e/g, '');
    return { text };
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={unitData.examples}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          const { text } = parseExample(item);
          return (
            <TouchableOpacity
              style={styles.exampleCard}
              onPress={() => speakWord(text)}
            >
              <View style={[styles.exampleNumber, { backgroundColor: color }]}>
                <Text style={styles.exampleNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.exampleText}>{text}</Text>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.examplesList}
      />
    </SafeAreaView>
  );
};

// Main Unit Screen with Tabs
const UnitScreen = ({ route }) => {
  const { levelId, unitId } = route.params || {};
  const color = LEVEL_COLORS[levelId];

  return (
    <Tab.Navigator
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
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  wordContainer: {
    marginBottom: 6,
  },
  wordText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  letter: {
    color: '#666',
  },
  highlightedLetter: {
    color: '#E91E63',
    fontWeight: 'bold',
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
});

export default UnitScreen;
