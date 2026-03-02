import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { FONTS } from '../constants';

const FontTestScreen = () => {
  const currentFont = FONTS.primary;
  const platform = Platform.OS;

  const testTexts = [
    { label: '大号标题', size: 32, text: 'Phonics World' },
    { label: '中号文字', size: 24, text: 'ABCDEFG abcdefg' },
    { label: '正常文字', size: 18, text: 'The quick brown fox' },
    { label: '小号文字', size: 14, text: '1234567890' },
    { label: '中文测试', size: 20, text: '拼音世界 儿童学习' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Font Test Page</Text>
        <Text style={styles.headerSubtitle}>
          Platform: {platform} | Font: {currentFont}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {testTexts.map((item, index) => (
          <View key={index} style={styles.testItem}>
            <Text style={styles.label}>{item.label} ({item.size}px):</Text>
            <Text
              style={[
                styles.testText,
                { fontSize: item.size, fontFamily: currentFont },
              ]}
            >
              {item.text}
            </Text>
            <View style={styles.divider} />
          </View>
        ))}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>字体信息</Text>
          <Text style={styles.infoText}>当前平台: {platform}</Text>
          <Text style={styles.infoText}>字体名称: {currentFont}</Text>
          <Text style={styles.infoText}>
            如果上方文字看起来是手写风格/圆润的，说明字体已生效
          </Text>
          <Text style={styles.infoText}>
            如果文字是标准系统字体，字体可能未加载成功
          </Text>
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
  header: {
    backgroundColor: '#9C27B0',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
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
    padding: 16,
  },
  testItem: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    fontFamily: 'SassoonPrimary',
  },
  testText: {
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginTop: 12,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    fontFamily: 'SassoonPrimary',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontFamily: 'SassoonPrimary',
  },
});

export default FontTestScreen;
