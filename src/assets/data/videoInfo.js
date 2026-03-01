// Video information mapping
// Maps each level and unit to a video file
// Videos should be placed in assets/video/ directory

export const VIDEO_INFO = {
  // Level 1: The Alphabet
  level1: {
    playlist: 'https://www.youtube.com/playlist?list=PL9CB949BhBAhVWqjLQxTnGfyZNT7K669W',
    units: {
      unit1: 'level1-unit1.mp4',
      unit2: 'level1-unit2.mp4',
      unit3: 'level1-unit3.mp4',
      unit4: 'level1-unit4.mp4',
      unit5: 'level1-unit5.mp4',
      unit6: 'level1-unit6.mp4',
      unit7: 'level1-unit7.mp4',
      unit8: 'level1-unit8.mp4',
    },
  },
  // Level 2: Short Vowels
  level2: {
    playlist: 'https://www.youtube.com/playlist?list=PL9CB949BhBAjbyCiR0zPEOpMS-nHsDcZA',
    units: {
      unit1: 'level2-unit1.mp4',
      unit2: 'level2-unit2.mp4',
      unit3: 'level2-unit3.mp4',
      unit4: 'level2-unit4.mp4',
      unit5: 'level2-unit5.mp4',
      unit6: 'level2-unit6.mp4',
      unit7: 'level2-unit7.mp4',
      unit8: 'level2-unit8.mp4',
    },
  },
  // Level 3: Long Vowels
  level3: {
    playlist: 'https://www.youtube.com/playlist?list=PL9CB949BhBAjfoNBnoRzJcg0yxDCNDPqE',
    units: {
      unit1: 'level3-unit1.mp4',
      unit2: 'level3-unit2.mp4',
      unit3: 'level3-unit3.mp4',
      unit4: 'level3-unit4.mp4',
      unit5: 'level3-unit5.mp4',
      unit6: 'level3-unit6.mp4',
      unit7: 'level3-unit7.mp4',
      unit8: 'level3-unit8.mp4',
    },
  },
  // Level 4: Consonant Blends
  level4: {
    playlist: 'https://www.youtube.com/playlist?list=PL9CB949BhBAiUFzoFb17CQY2nKH_J_YaG',
    units: {
      unit1: 'level4-unit1.mp4',
      unit2: 'level4-unit2.mp4',
      unit3: 'level4-unit3.mp4',
      unit4: 'level4-unit4.mp4',
      unit5: 'level4-unit5.mp4',
      unit6: 'level4-unit6.mp4',
      unit7: 'level4-unit7.mp4',
      unit8: 'level4-unit8.mp4',
    },
  },
  // Level 5: Letter Combinations
  level5: {
    playlist: 'https://www.youtube.com/playlist?list=PL9CB949BhBAi2x2xmhHcXd15HpixB00sy',
    units: {
      unit1: 'level5-unit1.mp4',
      unit2: 'level5-unit2.mp4',
      unit3: 'level5-unit3.mp4',
      unit4: 'level5-unit4.mp4',
      unit5: 'level5-unit5.mp4',
      unit6: 'level5-unit6.mp4',
      unit7: 'level5-unit7.mp4',
      unit8: 'level5-unit8.mp4',
    },
  },
};

// Get video filename for a specific level and unit
export const getVideoFile = (levelId, unitId) => {
  return VIDEO_INFO[levelId]?.units[unitId];
};

// Check if a video exists for a level and unit
export const hasVideo = (levelId, unitId) => {
  return !!getVideoFile(levelId, unitId);
};
