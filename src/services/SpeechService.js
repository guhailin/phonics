import * as Speech from 'expo-speech';

let currentVoice = null;
let isSpeaking = false;

class SpeechService {
  static async init() {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      // Prefer Samantha on iOS (female voice)
      const preferredVoice = voices.find(v =>
        v.identifier.includes('Samantha') ||
        v.identifier.includes('female')
      );
      currentVoice = preferredVoice || voices[0] || null;
      console.log('Speech initialized with voice:', currentVoice?.identifier);
    } catch (error) {
      console.error('Failed to initialize speech:', error);
    }
  }

  static async speak(text, options = {}) {
    try {
      // Stop any current speech
      await this.stop();

      const { rate = 0.8, pitch = 1.1, onDone } = options;

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

      await Speech.speak(text, speakOptions);
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
