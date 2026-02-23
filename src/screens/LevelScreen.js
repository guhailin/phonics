import React from 'react';
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

const LevelScreen = ({ route, navigation }) => {
  const { levelId } = route.params;
  const levelData = phonicsData[levelId];
  const color = LEVEL_COLORS[levelId];

  const renderUnitItem = ({ item: unit }) => {
    return (
      <TouchableOpacity
        style={[styles.unitCard, { borderLeftColor: color, borderLeftWidth: 6 }]}
        onPress={() =>
          navigation.navigate('Unit', {
            levelId,
            unitId: unit.id,
            unitName: unit.name,
          })
        }
      >
        <Text style={styles.unitName}>{unit.name}</Text>
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
  unitName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
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
