import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LEVEL_COLORS, LEVEL_NAMES } from '../constants';
import phonicsData from '../assets/data/phonicsData';

const levels = ['level1', 'level2', 'level3', 'level4', 'level5'];

const HomeScreen = ({ navigation }) => {
  const renderLevelItem = ({ item: levelId }) => {
    const levelData = phonicsData[levelId];
    const colors = LEVEL_COLORS[levelId];
    const names = LEVEL_NAMES[levelId];

    return (
      <TouchableOpacity
        style={[styles.levelCard, { backgroundColor: colors }]}
        onPress={() =>
          navigation.navigate('Level', {
            levelId,
            levelTitle: levelData.name,
          })
        }
      >
        <Text style={styles.emoji}>{levelData.emoji}</Text>
        <Text style={styles.levelTitle}>{levelData.name}</Text>
        <Text style={styles.levelSubtitle}>{names.subtitle}</Text>
        <Text style={styles.levelDescription}>{names.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Phonics World</Text>
        <Text style={styles.headerSubtitle}>Oxford Phonics World</Text>
      </View>

      <FlatList
        data={levels}
        renderItem={renderLevelItem}
        keyExtractor={(item) => item}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
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
    backgroundColor: '#9C27B0',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  listContainer: {
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  levelCard: {
    flex: 1,
    margin: 8,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    minHeight: 180,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  levelSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  levelDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default HomeScreen;
