import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

class StorageService {
  static async getItem(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Failed to get ${key}:`, error);
      return null;
    }
  }

  static async setItem(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Failed to set ${key}:`, error);
      return false;
    }
  }

  static async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
      return false;
    }
  }

  // Speech config helpers
  static async getSpeechConfig() {
    return await this.getItem(STORAGE_KEYS.SPEECH_CONFIG);
  }

  static async setSpeechConfig(config) {
    return await this.setItem(STORAGE_KEYS.SPEECH_CONFIG, config);
  }

  // Favorites helpers
  static async getFavorites() {
    const favorites = await this.getItem(STORAGE_KEYS.FAVORITES);
    return favorites || [];
  }

  static async addFavorite(word) {
    const favorites = await this.getFavorites();
    if (!favorites.includes(word)) {
      favorites.push(word);
      return await this.setItem(STORAGE_KEYS.FAVORITES, favorites);
    }
    return true;
  }

  static async removeFavorite(word) {
    const favorites = await this.getFavorites();
    const filtered = favorites.filter(w => w !== word);
    return await this.setItem(STORAGE_KEYS.FAVORITES, filtered);
  }
}

export default StorageService;
