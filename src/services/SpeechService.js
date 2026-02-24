import * as Speech from 'expo-speech';

let currentVoice = null;
let isSpeaking = false;

class SpeechService {
  static async init() {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      console.log('===========================================');
      console.log('Total voices available:', voices.length);
      console.log('All voices:');
      voices.forEach((v, i) => {
        const isEn = v.language?.startsWith('en') ? '✓EN' : '';
        console.log(`  ${i}: ${v.identifier} (${v.language}) ${isEn}`);
      });
      console.log('===========================================');

      // 获取所有英语语音 (包括 en-US, en-GB, en-AU 等)
      const englishVoices = voices.filter(v =>
        v.language && v.language.startsWith('en')
      );

      // Female voice priority list (清晰、适合儿童学习的女声)
      // 扩展列表，包含更多平台和地区的优质女声
      const femaleVoiceNames = [
        // iOS/macOS 优质女声
        'Samantha',      // iOS/macOS - 最推荐，清晰自然
        'Victoria',      // iOS - 清晰女声
        'Karen',         // iOS/macOS - 澳洲女声，非常清晰
        'Allison',       // macOS
        'Ava',           // macOS
        'Tessa',         // macOS
        'Susan',         // macOS
        'Serena',        // macOS
        'Moira',         // macOS
        'Fiona',         // macOS - 苏格兰口音，很清晰
        // Android/Google 女声
        'en-us-x-sfg',   // Google - 女声
        'en-us-x-sfs',   // Google - 女声
        'en-us-x-sfc',   // Google - 女声
        'en-us-x-sfw',   // Google - 女声
        'en-US-language',// Google 标准女声
      ];

      // 查找女声 (优先高质量声音，避免 compact/super-compact)
      let preferredVoice = null;
      let voiceName = '';

      // 辅助函数：检查是否为低质量声音
      const isLowQuality = (identifier) => {
        const lowQuality = ['super-compact', 'compact'];
        return lowQuality.some(kw => identifier.toLowerCase().includes(kw));
      };

      // 1. 优先找指定的女声 (优先非 compact 版本，找不到可以接受 compact)
      for (const name of femaleVoiceNames) {
        // 先找非 compact 版本
        let voice = englishVoices.find(v =>
          v.identifier.includes(name) &&
          !isLowQuality(v.identifier)
        );
        // 如果没找到，再找任何版本
        if (!voice) {
          voice = englishVoices.find(v =>
            v.identifier.includes(name)
          );
        }
        if (voice) {
          preferredVoice = voice;
          voiceName = name;
          break;
        }
      }

      // 2. 尝试任何高质量女声 (通过启发式判断)
      if (!preferredVoice) {
        // 优先选择 premium/enhanced 女声
        preferredVoice = englishVoices.find(v =>
          (v.identifier.includes('premium') || v.identifier.includes('enhanced')) &&
          !isLowQuality(v.identifier)
        );
      }

      // 3. 选择任何非 compact 的英语语音
      if (!preferredVoice) {
        preferredVoice = englishVoices.find(v => !isLowQuality(v.identifier));
      }

      // 4. 最后的回退
      if (!preferredVoice) {
        preferredVoice = englishVoices[0] || voices[0] || null;
      }

      currentVoice = preferredVoice;

      // 辅助函数：从语音标识符中提取语音名称
      const extractVoiceName = (voice) => {
        if (!voice || !voice.identifier) return 'Unknown';
        const match = voice.identifier.match(/\.([^.]+)$/);
        return match ? match[1] : 'Unknown';
      };

      // 如果没有设置 voiceName，从选中的语音标识符中提取
      if (!voiceName && currentVoice) {
        voiceName = extractVoiceName(currentVoice);
      }

      // 打印最终选择的语音详情
      if (currentVoice) {
        console.log('✅ ===========================================');
        console.log('✅ Speech initialized successfully');
        console.log(`✅ Voice Name: ${voiceName || 'Unknown'}`);
        console.log(`✅ Voice ID: ${currentVoice.identifier}`);
        console.log(`✅ Voice Language: ${currentVoice.language || 'Unknown'}`);
        console.log(`✅ Voice Quality: ${currentVoice.quality || 'Unknown'}`);
        console.log('✅ ===========================================');
      } else {
        console.error('❌ No voice could be selected!');
      }
    } catch (error) {
      console.error('Failed to initialize speech:', error);
    }
  }

  static async speak(text, options = {}) {
    try {
      // Stop any current speech
      await this.stop();

      const { rate = 0.4, pitch = 1.0, onDone } = options;

      // Add multiple periods and spaces to force TTS engine to fully pronounce
      // trailing voiceless consonants (p, t, k, s, f, etc.)
      // This creates a longer pause that helps the engine complete the word
      const processedText = text.trim() + '...';

      const speakOptions = {
        rate,
        pitch,
        volume: 1.0,
        voice: currentVoice?.identifier,
        onStart: () => { isSpeaking = true; },
        onDone: () => {
          isSpeaking = false;
          if (onDone) onDone();
        },
        onError: (error) => {
          console.error('Speech error:', error);
          isSpeaking = false;
        },
      };

      await Speech.speak(processedText, speakOptions);
    } catch (error) {
      console.error('Failed to speak:', error);
      isSpeaking = false;
    }
  }

  static async stop() {
    try {
      await Speech.stop();
      isSpeaking = false;
    } catch (error) {
      console.error('Failed to stop speech:', error);
    }
  }

  static isSpeaking() {
    return isSpeaking;
  }

  static async getVoices() {
    try {
      return await Speech.getAvailableVoicesAsync();
    } catch (error) {
      console.error('Failed to get voices:', error);
      return [];
    }
  }

  static setVoice(voiceId) {
    currentVoice = { identifier: voiceId };
  }
}

export default SpeechService;
