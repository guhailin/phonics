// Color constants for levels (matching web app)
export const LEVEL_COLORS = {
  level1: '#9C27B0', // Purple - Alphabet
  level2: '#4CAF50', // Green - Short Vowels
  level3: '#2196F3', // Blue - Long Vowels
  level4: '#FF9800', // Orange - Consonant Blends
  level5: '#F44336', // Red - Letter Combinations
};

export const LEVEL_NAMES = {
  level1: { title: 'The Alphabet', subtitle: '字母音' },
  level2: { title: 'Short Vowels', subtitle: '短元音' },
  level3: { title: 'Long Vowels', subtitle: '长元音' },
  level4: { title: 'Consonant Blends', subtitle: '辅音组合' },
  level5: { title: 'Letter Combinations', subtitle: '字母组合' },
};

// Magic E patterns for special highlighting
export const MAGIC_E_PATTERNS = ['a_e', 'e_e', 'i_e', 'o_e', 'u_e'];

// Default speech configuration
export const DEFAULT_SPEECH_CONFIG = {
  rate: 0.8,  // Slower for children
  pitch: 1.1, // Slightly higher
  volume: 1.0,
  voice: null, // Will be set to Samantha on iOS
};

// Storage keys
export const STORAGE_KEYS = {
  SPEECH_CONFIG: '@phonics_speech_config',
  FAVORITES: '@phonics_favorites',
  PROGRESS: '@phonics_progress',
};
