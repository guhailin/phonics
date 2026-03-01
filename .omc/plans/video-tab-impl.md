# Phonics App Video Tab Implementation Plan

## Context

The user wants to add a "Videos" tab to the UnitScreen in the Phonics app. Currently, UnitScreen has two tabs: "Words" and "Examples". The new tab should:
- Be placed as the first tab (leftmost)
- Tab order: Videos → Words → Examples
- Default to the "Words" tab when entering a unit
- Show all videos corresponding to the current unit
- Display the actual video filenames
- Allow playing videos on click

## Current Structure

Based on code exploration:

- **Navigation**: React Navigation v7 with `@react-navigation/bottom-tabs`
- **UnitScreen File**: `/Users/e99g41y/worksapce/phonics_rn/src/screens/UnitScreen.js`
- **Video Player**: `VideoPlayer` component using `expo-av` already exists at `/Users/e99g41y/worksapce/phonics_rn/src/components/VideoPlayer.js`
- **Video Mapping**: Detailed mapping in `video_mapping.json` at project root
- **Video Location**: `assets/video/` directory

## Acceptance Criteria

1. **Tab Structure**:
   - [ ] Videos tab is the first tab in UnitScreen
   - [ ] Tab order: Videos (🎬) → Words (🔤) → Examples (📖)
   - [ ] Default tab is "Words" when navigating to UnitScreen

2. **Videos Tab Content**:
   - [ ] Displays all videos for the current level/unit
   - [ ] Shows actual video filenames (not renamed)
   - [ ] Videos are categorized by type (lesson, story, review, intro) if applicable
   - [ ] Each video has a play button indicator

3. **Video Playback**:
   - [ ] Clicking a video opens the VideoPlayer modal
   - [ ] Video plays using the existing VideoPlayer component
   - [ ] Closing the modal returns to the Videos tab

4. **Data Integration**:
   - [ ] Uses the detailed `video_mapping.json` file
   - [ ] Falls back gracefully if no videos exist for a unit
   - [ ] Handles both unit-specific videos and level-level videos

## Implementation Steps

### Step 1: Import Video Mapping Data

**File**: `/Users/e99g41y/worksapce/phonics_rn/src/screens/UnitScreen.js`

- Import the `video_mapping.json` file at the top
- Create a helper function to get videos for a level/unit combination

### Step 2: Create VideosTab Component

**File**: `/Users/e99g41y/worksapce/phonics_rn/src/screens/UnitScreen.js`

Add a new `VideosTab` component after the imports and before the existing tab components.

### Step 3: Add Styles for VideosTab

**File**: `/Users/e99g41y/worksapce/phonics_rn/src/screens/UnitScreen.js`

Add necessary styles to the `StyleSheet.create`.

### Step 4: Update Tab Navigator

**File**: `/Users/e99g41y/worksapce/phonics_rn/src/screens/UnitScreen.js`

Modify the `Tab.Navigator` section to:
1. Add the Videos tab as the first tab
2. Set `initialRouteName="Words"` to default to the Words tab
3. Keep the existing Words and Examples tabs

### Step 5: Add Necessary Imports

**File**: `/Users/e99g41y/worksapce/phonics_rn/src/screens/UnitScreen.js`

Add imports for VideoPlayer and video mapping data.

## Files to Modify

| File | Changes |
|------|---------|
| `src/screens/UnitScreen.js` | Add VideosTab component, update tabs, add styles, add imports |

## Files Already Available (No Changes Needed)

| File | Purpose |
|------|---------|
| `src/components/VideoPlayer.js` | Video playback component |
| `video_mapping.json` | Video to unit mapping |
| `assets/video/` | Video files directory |
| `src/constants/index.js` | Level colors and constants |

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Video files not found at the expected path | Use `require()` with dynamic paths or ensure VIDEO_DIR is correct |
| video_mapping.json format changes | Add validation checks before accessing nested properties |
| Performance issues with many videos | Use FlatList for efficient rendering |
| Videos tab is empty for some units | Show friendly "No videos" message |

## Verification Steps

1. **Manual Testing**:
   - [ ] Navigate to Level 1, Unit 1
   - [ ] Verify the tab order: Videos → Words → Examples
   - [ ] Verify default tab is "Words"
   - [ ] Tap Videos tab
   - [ ] Verify videos are listed with filenames
   - [ ] Tap a video
   - [ ] Verify video plays in the modal
   - [ ] Close video modal
   - [ ] Verify returned to Videos tab
   - [ ] Test with multiple levels/units

2. **Edge Cases**:
   - [ ] Test a unit with no videos (should show empty state)
   - [ ] Test a unit with multiple video types
   - [ ] Test navigation from different entry points

## Dependencies

No new dependencies needed - all required libraries already installed:
- `@react-navigation/bottom-tabs` - already used
- `expo-av` - already installed
- `react-native` - core components
