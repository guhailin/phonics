import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Slider,
  SafeAreaView,
} from 'react-native';
import { useApp } from '../contexts/AppContext';

const SettingsScreen = () => {
  const { speechConfig, updateSpeechConfig } = useApp();
  const [rate, setRate] = useState(speechConfig?.rate || 0.8);
  const [pitch, setPitch] = useState(speechConfig?.pitch || 1.1);

  useEffect(() => {
    setRate(speechConfig?.rate || 0.8);
    setPitch(speechConfig?.pitch || 1.1);
  }, [speechConfig]);

  const handleSave = () => {
    updateSpeechConfig({ rate, pitch });
  };

  const handleTest = () => {
    const { useApp } = require('../contexts/AppContext');
    const { speakWord } = useApp();
    speakWord('Hello, welcome to Phonics World');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Speech Settings</Text>
          <Text style={styles.sectionDescription}>
            Adjust the speech rate and pitch for the voice
          </Text>

          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>Speech Rate</Text>
              <Text style={styles.sliderValue}>{rate.toFixed(2)}</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0.3}
              maximumValue={1.5}
              step={0.05}
              value={rate}
              onValueChange={setRate}
              minimumTrackTintColor="#9C27B0"
              maximumTrackTintColor="#ddd"
              thumbTintColor="#9C27B0"
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderMinLabel}>Slow</Text>
              <Text style={styles.sliderMaxLabel}>Fast</Text>
            </View>
          </View>

          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>Pitch</Text>
              <Text style={styles.sliderValue}>{pitch.toFixed(2)}</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={1.5}
              step={0.05}
              value={pitch}
              onValueChange={setPitch}
              minimumTrackTintColor="#9C27B0"
              maximumTrackTintColor="#ddd"
              thumbTintColor="#9C27B0"
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderMinLabel}>Low</Text>
              <Text style={styles.sliderMaxLabel}>High</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.testButton} onPress={handleTest}>
            <Text style={styles.testButtonText}>🔊 Test Speech</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Settings</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            Phonics World - Oxford Phonics World Companion App
          </Text>
          <Text style={styles.aboutText}>Version 1.0.0</Text>
          <Text style={styles.aboutText}>© 2024 Phonics World</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  sliderContainer: {
    marginBottom: 24,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sliderValue: {
    fontSize: 14,
    color: '#666',
  },
  slider: {
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderMinLabel: {
    fontSize: 12,
    color: '#999',
  },
  sliderMaxLabel: {
    fontSize: 12,
    color: '#999',
  },
  testButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#9C27B0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default SettingsScreen;
