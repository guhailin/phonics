import React, { createContext, useContext, useState, useEffect } from 'react';
import SpeechService from '../services/SpeechService';
import StorageService from '../services/StorageService';
import { DEFAULT_SPEECH_CONFIG } from '../constants';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentLevel, setCurrentLevel] = useState(null);
  const [currentUnit, setCurrentUnit] = useState(null);
  const [speechConfig, setSpeechConfig] = useState(DEFAULT_SPEECH_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize speech service
      await SpeechService.init();

      // Load saved speech config
      const savedConfig = await StorageService.getSpeechConfig();
      if (savedConfig) {
        setSpeechConfig({ ...DEFAULT_SPEECH_CONFIG, ...savedConfig });
      }

      // Load favorites
      const savedFavorites = await StorageService.getFavorites();
      setFavorites(savedFavorites);
    } catch (error) {
      console.error('Failed to initialize app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSpeechConfig = async (newConfig) => {
    const updated = { ...speechConfig, ...newConfig };
    setSpeechConfig(updated);
    await StorageService.setSpeechConfig(updated);
  };

  const speakWord = async (word) => {
    await SpeechService.speak(word, {
      rate: speechConfig.rate,
      pitch: speechConfig.pitch,
    });
  };

  const toggleFavorite = async (word) => {
    if (favorites.includes(word)) {
      await StorageService.removeFavorite(word);
      setFavorites(favorites.filter(w => w !== word));
    } else {
      await StorageService.addFavorite(word);
      setFavorites([...favorites, word]);
    }
  };

  const value = {
    currentLevel,
    setCurrentLevel,
    currentUnit,
    setCurrentUnit,
    speechConfig,
    updateSpeechConfig,
    speakWord,
    isLoading,
    favorites,
    toggleFavorite,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
