import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useApp } from '../contexts/AppContext';
import SpeechService from '../services/SpeechService';

const SettingsScreen = () => {
  const { speechConfig, updateSpeechConfig, speakWord } = useApp();
  const [rate, setRate] = useState(speechConfig?.rate || 0.8);
  const [pitch, setPitch] = useState(speechConfig?.pitch || 1.1);
  const [currentVoice, setCurrentVoice] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);

  // 辅助函数：从语音标识符中提取语音名称
  const extractVoiceName = (voice) => {
    if (!voice || !voice.identifier) return 'Unknown';
    const match = voice.identifier.match(/\.([^.]+)$/);
    return match ? match[1] : 'Unknown';
  };

  // 辅助函数：检查是否为低质量声音
  const isLowQuality = (identifier) => {
    const lowQuality = ['super-compact', 'compact'];
    return lowQuality.some(kw => identifier.toLowerCase().includes(kw));
  };

  useEffect(() => {
    setRate(speechConfig?.rate || 0.8);
    setPitch(speechConfig?.pitch || 1.1);
  }, [speechConfig]);

  useEffect(() => {
    loadVoiceInfo();
  }, []);

  const loadVoiceInfo = async () => {
    let voices = await SpeechService.getVoices();

    // 如果第一次加载没有语音，尝试重新初始化 SpeechService
    if (!voices || voices.length === 0) {
      console.log('No voices found, reinitializing SpeechService...');
      await SpeechService.init();
      voices = await SpeechService.getVoices();
    }

    setAvailableVoices(voices);

    // 获取所有英语语音
    const enVoices = voices.filter(v => v.language?.startsWith('en'));

    // 女声优先级列表（与 SpeechService 保持一致）
    const femaleVoiceNames = [
      'Samantha', 'Victoria', 'Karen', 'Allison', 'Ava', 'Tessa',
      'Susan', 'Serena', 'Moira', 'Fiona', 'sfg', 'sfs', 'sfc'
    ];

    // 1. 优先找指定的女声 (优先非 compact 版本，找不到可以接受 compact)
    let preferredVoice = null;
    for (const name of femaleVoiceNames) {
      // 先找非 compact 版本
      let voice = enVoices.find(v =>
        v.identifier.includes(name) &&
        !isLowQuality(v.identifier)
      );
      // 如果没找到，再找任何版本
      if (!voice) {
        voice = enVoices.find(v =>
          v.identifier.includes(name)
        );
      }
      if (voice) {
        preferredVoice = voice;
        break;
      }
    }

    // 2. 如果没找到指定女声，选择任何非 compact 的英语语音
    if (!preferredVoice) {
      preferredVoice = enVoices.find(v => !isLowQuality(v.identifier));
    }

    // 3. 最后的回退
    if (!preferredVoice && enVoices.length > 0) {
      preferredVoice = enVoices[0];
    }

    if (preferredVoice) {
      setCurrentVoice(preferredVoice);
      // 自动设置为当前使用的语音
      SpeechService.setVoice(preferredVoice.identifier);
    }
  };

  const handleRefreshVoices = () => {
    Alert.alert(
      'Refresh Voices',
      'This will reload all available voices. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Refresh', onPress: loadVoiceInfo }
      ]
    );
  };

  const handleSave = () => {
    updateSpeechConfig({ rate, pitch });
  };

  const handleTest = () => {
    speakWord('Hello, welcome to Phonics World');
  };

  const showVoicePicker = () => {
    const enVoices = availableVoices.filter(v => v.language?.startsWith('en'));
    if (enVoices.length === 0) {
      Alert.alert('No Voices', 'No English voices available');
      return;
    }

    const voiceOptions = enVoices.map((v, index) => ({
      text: `${extractVoiceName(v)} (${v.language})${isLowQuality(v.identifier) ? ' [Compact]' : ''}`,
      onPress: () => selectVoice(v),
    }));

    voiceOptions.push({ text: 'Cancel', style: 'cancel' });

    Alert.alert(
      'Select Voice',
      'Choose a voice for speech',
      voiceOptions,
      { cancelable: true }
    );
  };

  const selectVoice = (voice) => {
    SpeechService.setVoice(voice.identifier);
    setCurrentVoice(voice);
    Alert.alert('Voice Changed', `Selected: ${voice.identifier}`);
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

          <View style={styles.voiceInfo}>
            <Text style={styles.voiceLabel}>Current Voice:</Text>
            <Text style={styles.voiceValue}>
              {currentVoice ? extractVoiceName(currentVoice) : 'Default'}
            </Text>
            <Text style={styles.voiceId}>
              {currentVoice?.identifier || ''}
            </Text>
            <Text style={styles.voiceLanguage}>
              {currentVoice?.language || ''}
            </Text>
          </View>

          <TouchableOpacity style={styles.voiceButton} onPress={showVoicePicker}>
            <Text style={styles.voiceButtonText}>🎙️ Change Voice</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.voiceButton, {backgroundColor: '#FF9800'}]} onPress={handleRefreshVoices}>
            <Text style={styles.voiceButtonText}>🔄 Refresh Voices</Text>
          </TouchableOpacity>

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
  voiceInfo: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  voiceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  voiceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9C27B0',
    marginBottom: 4,
  },
  voiceId: {
    fontSize: 11,
    color: '#888',
    marginBottom: 2,
  },
  voiceLanguage: {
    fontSize: 12,
    color: '#999',
  },
  voiceButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  voiceButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default SettingsScreen;
