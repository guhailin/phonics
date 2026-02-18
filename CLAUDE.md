# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a pure frontend web application for teaching phonics to children, based on Oxford Phonics World curriculum (Level 1-5). It requires no build tools, npm, or external dependencies—simply open `index.html` in a browser.

**Critical Requirement**: Word cards and example sentences must strictly follow the data and order defined in `phonics.md`. This is the single source of truth for all content.

## Running the Application

```bash
# Simply open in a browser (no build process)
open index.html        # macOS
# or double-click index.html on Windows
```

## Code Architecture

### Data Flow Pattern

1. **phonics.md** → Single source of truth for all curriculum data
2. **data.js** → Main data structure that must match phonics.md exactly
3. **app.js** → Renders UI from data.js
4. **word-info.js** → Phonetic symbols and Chinese definitions

### Key Files

| File | Purpose | Lines |
|------|---------|-------|
| `data.js` | Core curriculum data (768 curated words + 820 explore words) | ~2600 |
| `app.js` | Application logic, navigation, speech synthesis | ~1013 |
| `word-info.js` | Word phonetics and definitions | ~937 |
| `index.html` | Multi-page structure (home, level, unit, review, explore, settings) | ~300 |
| `style.css` | Cartoon-style responsive CSS | ~600 |
| `phonics.md` | Reference document - must match data.js | ~1175 |

### Data Structure

Each Level contains 8 Units. Each Unit has:
- `patterns`: Array of phonics patterns (determines word display order)
- `words`: Curated words with `{ word, highlight, emoji }`
- `exploreWords`: Additional practice words with `{ word, highlight }`
- `examples`: Array of HTML-formatted sentences (Level 1 has none)

```javascript
// Example from data.js
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

### Important Rendering Logic

**Word Grouping** (`app.js:324-332`):
- Words are filtered and displayed in the exact order defined in `unit.patterns`
- Uses exact matching: `wordObj.highlight === cleanPattern`
- This ensures word cards follow phonics.md order

**Magic E Patterns** (`app.js:372-394`):
- Patterns like `i_e`, `o_e`, `a_e` use underscore notation
- The `highlightWord()` function highlights both the vowel and final 'e'
- Example: "kite" with `highlight: 'i_e'` → k-**i**-t-**e**

**Example Sentence HTML Format**:
```html
<span class='highlight'>I see an <span class='pattern'>ant</span>.</span>
```
- `highlight` spans the entire word being emphasized
- `pattern` spans only the key phonics pattern

### Global State Management (app.js)

```javascript
let currentLevel = null;      // e.g., 'level1'
let currentUnit = null;       // e.g., 'unit1'
let reviewWords = [];         // Array for review mode
let currentReviewIndex = 0;   // Current word in review
let exploreWords = [];        // Array for explore mode
let currentExploreIndex = 0;   // Current word in explore
let currentExamples = [];     // Current unit's examples
let currentExampleIndex = 0;   // Current example being displayed
```

## When Modifying Data

### Updating Word Data

1. First read `phonics.md` to find the source of truth
2. Update `data.js` to match exactly:
   - Same patterns in the same order
   - Same words with correct `highlight` values
   - Same emoji assignments
3. Update `word-info.js` for any new words (add phonetic and definition)

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

The `highlightWord()` function will highlight 'a' and final 'e' separately.

## Speech Synthesis (app.js:11-207)

The app uses Web Speech API (`window.speechSynthesis`):

- **Config**: `speechConfig` object controls rate, pitch, volume, voice selection
- **Auto-voice selection**: `findBestVoice()` prefers female English voices (Samantha, Karen, Zira)
- **Chrome bug fix**: `setInterval` calls `resume()` every 5s to prevent hang

Key functions:
- `speakWord(word)` - Plays word pronunciation
- `initSpeechSynthesis()` - Initializes on page load
- Settings page allows voice/rate/pitch customization

## Keyboard Shortcuts

- **Review/Explore pages**:
  - `→` or `Space`: Next word
  - `←`: Previous word
  - `R`: Shuffle/resort words

## Data Validation Checklist

Before committing changes to `data.js`:

- [ ] Word count matches `phonics.md` (768 curated + 820 explore)
- [ ] Each Unit has correct `patterns` order
- [ ] All `highlight` values match patterns
- [ ] Level 1 has no examples; Levels 2-5 have 160 examples total (20 per unit)
- [ ] All example sentences have proper HTML span formatting
- [ ] `word-info.js` has entries for all 768 curated words

## Common Issues

**Duplicate word cards in Unit page**:
- Caused by: `highlight` matching multiple patterns (e.g., 'i' matching 'i' in 'i_e')
- Solution: Use exact matching `===` (already fixed in app.js:331)

**Words out of order**:
- Caused by: `patterns` array order doesn't match phonics.md
- Solution: Ensure `unit.patterns` exactly mirrors the source document

**Missing phonetic/definition**:
- Check `word-info.js` has lowercase key for the word
- Example: `cat: { phonetic: '/kæt/', definition: 'n. 猫' }`
