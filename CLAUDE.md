# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **React Native** mobile application for teaching phonics to children, based on Oxford Phonics World curriculum (Level 1-5). It was migrated from a pure web frontend project to React Native using Expo.

**Critical Requirement**: Word cards and example sentences must strictly follow the data and order defined in `phonics.md`. This is the single source of truth for all content.

## Tech Stack

- **Framework**: React Native 0.81.5 with Expo ~54.0.33
- **Navigation**: React Navigation v7 (@react-navigation/native, stack, bottom-tabs)
- **State Management**: React Context API (AppContext)
- **Storage**: @react-native-async-storage/async-storage
- **Speech**: expo-speech (TTS)
- **Audio**: expo-av (for future audio playback)
- **UI**: React Native built-in components + react-native-vector-icons

## Running the Application

```bash
# Install dependencies
npm install

# Start Expo development server
npm start
# or
expo start

# Run on specific platform
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser
```

## Project Structure

```
/Users/e99g41y/worksapce/phonics_rn/
├── App.js                      # App entry point with navigation setup
├── app.json                    # Expo configuration
├── index.js                    # Main entry (expo/AppEntry)
├── package.json                # Dependencies
├── phonics.md                  # Source of truth for curriculum data
├── assets/                     # Static assets (images, fonts)
├── ios/                        # iOS native project (expo prebuild)
└── src/
    ├── contexts/
    │   └── AppContext.js       # Global state management (React Context)
    ├── constants/
    │   └── index.js            # App constants (colors, names, config)
    ├── screens/
    │   ├── HomeScreen.js       # Level selection screen
    │   ├── LevelScreen.js      # Unit selection for a level
    │   ├── UnitScreen.js       # Word cards and patterns
    │   ├── ReviewScreen.js     # Flashcard review mode
    │   ├── ExploreScreen.js    # Extended word exploration
    │   └── SettingsScreen.js   # App settings (speech, etc.)
    ├── services/
    │   ├── SpeechService.js    # TTS using expo-speech
    │   └── StorageService.js   # AsyncStorage wrapper
    └── assets/data/
        ├── phonicsData.js      # Core curriculum data (matches phonics.md)
        └── wordInfo.js         # Word phonetics and definitions
```

## Code Architecture

### Navigation Structure

```
Home (Stack Navigator root)
├── HomeScreen           # Level 1-5 selection
├── LevelScreen          # Units for selected level
├── UnitScreen           # Word cards and patterns
├── ReviewScreen         # Flashcard review mode
├── ExploreScreen        # Extended word exploration
└── SettingsScreen       # App settings
```

### Data Flow Pattern

1. **phonics.md** → Single source of truth for all curriculum data
2. **phonicsData.js** → Main data structure that must match phonics.md exactly
3. **AppContext** → Provides data and state to all screens
4. **Screens** → Consume context and render UI
5. **wordInfo.js** → Phonetic symbols and Chinese definitions

### Key Data Structures

Each Level contains 8 Units. Each Unit has:
- `patterns`: Array of phonics patterns (determines word display order)
- `words`: Curated words with `{ word, highlight, emoji }`
- `exploreWords`: Additional practice words with `{ word, highlight }`
- `examples`: Array of HTML-formatted sentences (Level 1 has none)

```javascript
// Example from phonicsData.js
{
  id: 'unit1',
  name: 'Unit 1: Short a',
  patterns: ['a', 'am', 'an'],  // Determines display order
  words: [
    { word: 'ant', highlight: 'a', emoji: '🐜' },
    { word: 'yam', highlight: 'am', emoji: '🍠' },
    // ...
  ],
  exploreWords: [
    { word: 'ant', highlight: 'a' },
    { word: 'yam', highlight: 'am' },
    // ...
  ],
  examples: [
    "<span class='highlight'>I see an <span class='pattern'>ant</span>.</span>",
    // ...
  ]
}
```

### Global State (AppContext)

```javascript
{
  // Navigation state
  currentLevel,      // Current selected level (e.g., 'level1')
  currentUnit,       // Current selected unit (e.g., 'unit1')

  // Review mode state
  reviewWords,       // Array of words in review mode
  currentReviewIndex,

  // Explore mode state
  exploreWords,      // Array of words in explore mode
  currentExploreIndex,

  // Example sentences
  currentExamples,
  currentExampleIndex,

  // Actions
  setCurrentLevel,
  setCurrentUnit,
  setReviewWords,
  setCurrentReviewIndex,
  setExploreWords,
  setCurrentExploreIndex,
  setCurrentExamples,
  setCurrentExampleIndex,
}
```

## Speech Service (TTS)

The app uses `expo-speech` for text-to-speech:

```javascript
import SpeechService from './src/services/SpeechService';

// Initialize on app startup (in AppContext or App.js)
await SpeechService.init();

// Speak a word
await SpeechService.speak('hello', { rate: 0.4, pitch: 1.0 });

// Stop speaking
await SpeechService.stop();
```

Features:
- Voice preference: Premium > Enhanced > Compact (accept compact when non-compact not available)
- Default voice: Samantha (en-US) or best available English voice
- Rate: 0.35 (very slow for children's learning, especially for trailing consonants)
- Pitch: 1.0 (natural)
- Text processing:
  - Adds multiple ellipsis and spaces to force proper pronunciation of trailing consonants
  - Detects voiceless consonants (p, t, k, s, f, sh, ch, th) at word end
  - Adds extra pauses for words ending with voiceless consonants: `word...   ...   ...`
  - Adds moderate pauses for other words: `word...   ...`

## Storage Service

Uses `@react-native-async-storage/async-storage` for persistence:

```javascript
import StorageService from './src/services/StorageService';

// Save data
await StorageService.setItem('key', value);

// Load data
const value = await StorageService.getItem('key');

// Remove data
await StorageService.removeItem('key');
```

Storage keys (defined in `constants/index.js`):
- `@phonics_speech_config`: Speech settings (rate, pitch, voice)
- `@phonics_favorites`: Favorite words
- `@phonics_progress`: Learning progress

## Constants

Key constants in `src/constants/index.js`:

```javascript
// Level colors for UI theming
LEVEL_COLORS = {
  level1: '#9C27B0', // Purple - Alphabet
  level2: '#4CAF50', // Green - Short Vowels
  level3: '#2196F3', // Blue - Long Vowels
  level4: '#FF9800', // Orange - Consonant Blends
  level5: '#F44336', // Red - Letter Combinations
}

// Level display names
LEVEL_NAMES = {
  level1: { title: 'The Alphabet', subtitle: '字母音' },
  level2: { title: 'Short Vowels', subtitle: '短元音' },
  level3: { title: 'Long Vowels', subtitle: '长元音' },
  level4: { title: 'Consonant Blends', subtitle: '辅音组合' },
  level5: { title: 'Letter Combinations', subtitle: '字母组合' },
}

// Magic E patterns for special handling
MAGIC_E_PATTERNS = ['a_e', 'e_e', 'i_e', 'o_e', 'u_e']

// Default speech configuration
DEFAULT_SPEECH_CONFIG = {
  rate: 0.35, // Very slow for clearest pronunciation of trailing consonants
  pitch: 1.0, // Natural pitch
  volume: 1.0,
  voice: null, // Will be set to Samantha on iOS
}

// Storage keys
STORAGE_KEYS = {
  SPEECH_CONFIG: '@phonics_speech_config',
  FAVORITES: '@phonics_favorites',
  PROGRESS: '@phonics_progress',
}
```

## Important Rendering Logic

### Word Grouping (UnitScreen)

- Words are filtered and displayed in the exact order defined in `unit.patterns`
- Uses exact matching: `wordObj.highlight === cleanPattern`
- This ensures word cards follow phonics.md order

### Magic E Patterns

- Patterns like `i_e`, `o_e`, `a_e` use underscore notation
- The highlight logic highlights both the vowel and final 'e'
- Example: "kite" with `highlight: 'i_e'` → k-**i**-t-**e**

### HTML Example Format (for examples array)

```html
<span class='highlight'>I see an <span class='pattern'>ant</span>.</span>
```
- `highlight` spans the entire word being emphasized
- `pattern` spans only the key phonics pattern

## When Modifying Data

### Updating Word Data

1. First read `phonics.md` to find the source of truth
2. Update `phonicsData.js` to match exactly:
   - Same patterns in the same order
   - Same words with correct `highlight` values
   - Same emoji assignments
3. Update `wordInfo.js` for any new words (add phonetic and definition)

### Adding New Examples

Examples must use HTML span formatting:
```javascript
examples: [
  "<span class='highlight'>The <span class='pattern'>cat</span> sat on the mat.</span>"
]
```

### Magic E Pattern Examples

For words like "cake" (a_e), "kite" (i_e), "home" (o_e):
```javascript
{ word: 'cake', highlight: 'a_e', emoji: '🎂' }
```

The highlight logic will highlight 'a' and final 'e' separately.

## Data Validation Checklist

Before committing changes to `phonicsData.js`:

- [ ] Word count matches `phonics.md` (768 curated + 820 explore)
- [ ] Each Unit has correct `patterns` order
- [ ] All `highlight` values match patterns
- [ ] Level 1 has no examples; Levels 2-5 have 160 examples total (20 per unit)
- [ ] All example sentences have proper HTML span formatting
- [ ] `wordInfo.js` has entries for all 768 curated words

## Common Issues

**Duplicate word cards in Unit page**:
- Caused by: `highlight` matching multiple patterns (e.g., 'i' matching 'i' in 'i_e')
- Solution: Use exact matching `===` (already fixed)

**Words out of order**:
- Caused by: `patterns` array order doesn't match phonics.md
- Solution: Ensure `unit.patterns` exactly mirrors the source document

**Missing phonetic/definition**:
- Check `wordInfo.js` has lowercase key for the word
- Example: `cat: { phonetic: '/kæt/', definition: 'n. 猫' }`

**Speech not working**:
- Ensure `SpeechService.init()` is called on app startup
- Check iOS/Android TTS permissions
- Verify voice availability on device

**Metro bundler issues**:
- Clear cache: `npx expo start --clear`
- Reset cache: `rm -rf node_modules/.cache`

**Trailing consonants not clear enough**:
- Problem: Word endings like "t", "p", "k", "s" are too quick and hard to hear
- Solution: Implemented intelligent text processing with multiple pause strategies
- Key improvements:
  - Slower default rate: 0.35 (was 0.4)
  - Detect voiceless consonants at word end
  - Add extra ellipsis and spaces for trailing consonants: `...   ...   ...`
  - Code in: `SpeechService.speak()` method
- Files modified:
  - `src/services/SpeechService.js` - Enhanced text processing
  - `src/constants/index.js` - Updated default rate to 0.35
  - `src/screens/SettingsScreen.js` - Updated default values

## Migration Notes (Web → React Native)

This project was migrated from a pure web frontend to React Native:

| Web (Old) | React Native (Current) |
|-----------|------------------------|
| Vanilla JS + HTML + CSS | React Native + Expo |
| Web Speech API | expo-speech |
| LocalStorage | @react-native-async-storage/async-storage |
| DOM manipulation | React components |
| CSS styling | StyleSheet |
| index.html pages | React Navigation screens |
| data.js | phonicsData.js |
| word-info.js | wordInfo.js |

## Development Guidelines

1. **Always maintain data consistency**: `phonics.md` → `phonicsData.js` → UI
2. **Use constants**: Import colors, names from `constants/index.js`
3. **Speech**: Use `SpeechService` methods, don't call expo-speech directly
4. **Storage**: Use `StorageService` wrapper, not AsyncStorage directly
5. **Styling**: Use StyleSheet.create, follow existing color schemes
6. **Navigation**: Use React Navigation hooks and params for data passing
