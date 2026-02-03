// ========== 全局状态管理 ==========
let currentLevel = null;
let currentUnit = null;
let reviewWords = [];
let currentReviewIndex = 0;
let exploreWords = [];
let currentExploreIndex = 0;

// ========== 页面导航 ==========
function navigateTo(pageName) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 显示目标页面
    const targetPage = document.getElementById(`${pageName}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

function navigateToLevel() {
    if (currentLevel) {
        showLevelPage(currentLevel);
    } else {
        navigateTo('home');
    }
}

// ========== 首页渲染 ==========
function renderHomePage() {
    const levelsContainer = document.querySelector('.levels-container');
    levelsContainer.innerHTML = '';
    
    // 遍历所有 level
    Object.values(phonicsData).forEach((level, index) => {
        const levelCard = document.createElement('div');
        levelCard.className = 'level-card';
        levelCard.style.animationDelay = `${index * 0.1}s`;
        levelCard.style.borderColor = level.color;
        
        levelCard.innerHTML = `
            <span class="level-emoji">${level.emoji}</span>
            <h2 class="level-name">${level.name}</h2>
            <p class="level-title">${level.title}</p>
            <p class="level-subtitle">${level.subtitle}</p>
        `;
        
        levelCard.addEventListener('click', () => showLevelPage(level.id));
        levelsContainer.appendChild(levelCard);
    });
}

// ========== Level 详情页 ==========
function showLevelPage(levelId) {
    currentLevel = levelId;
    const level = phonicsData[levelId];
    
    if (!level) return;
    
    // 更新页面标题
    const levelTitle = document.getElementById('level-title');
    levelTitle.innerHTML = `${level.emoji} ${level.name}: ${level.title}`;
    levelTitle.style.color = level.color;
    
    // 渲染 units
    const unitsContainer = document.querySelector('.units-container');
    unitsContainer.innerHTML = '';
    
    level.units.forEach(unit => {
        const unitCard = document.createElement('div');
        unitCard.className = 'unit-card';
        unitCard.style.borderColor = level.color;
        
        unitCard.innerHTML = `
            <h3 class="unit-name">${unit.name}</h3>
            <p class="unit-patterns">${unit.patterns.join(', ')}</p>
        `;
        
        unitCard.addEventListener('click', () => showUnitPage(levelId, unit.id));
        unitsContainer.appendChild(unitCard);
    });
    
    navigateTo('level');
}

// ========== Unit 详情页 ==========
function showUnitPage(levelId, unitId) {
    currentLevel = levelId;
    currentUnit = unitId;
    
    const level = phonicsData[levelId];
    const unit = level.units.find(u => u.id === unitId);
    
    if (!unit) return;
    
    // 更新页面标题
    document.getElementById('unit-title').textContent = `${level.name} - ${unit.name}`;
    document.getElementById('unit-patterns').textContent = unit.patterns.join(' · ');
    
    // 渲染单词
    const wordsGrid = document.querySelector('.words-grid');
    wordsGrid.innerHTML = '';
    
    unit.words.forEach(wordObj => {
        const wordCard = document.createElement('div');
        wordCard.className = 'word-card';
        
        // 高亮关键字母
        const highlightedWord = highlightWord(wordObj.word, wordObj.highlight);
        
        wordCard.innerHTML = `
            <div class="word-image">
                ${wordObj.emoji || '🖼️'}
            </div>
            <div class="word-text">${highlightedWord}</div>
        `;
        
        wordsGrid.appendChild(wordCard);
    });
    
    navigateTo('unit');
}

// ========== 单词高亮函数 ==========
function highlightWord(word, highlight) {
    // 处理 i_e, o_e, u_e, a_e 这种 magic e 模式
    if (highlight.includes('_')) {
        const parts = highlight.split('_');
        const vowel = parts[0];
        const consonantAndE = parts[1]; // 通常是 'e'
        
        // 查找元音和最后的 e
        const vowelIndex = word.indexOf(vowel);
        const lastE = word.lastIndexOf('e');
        
        if (vowelIndex !== -1 && lastE !== -1 && lastE > vowelIndex) {
            let result = '';
            for (let i = 0; i < word.length; i++) {
                if (i === vowelIndex || i === lastE) {
                    result += `<span class="highlight">${word[i]}</span>`;
                } else {
                    result += word[i];
                }
            }
            return result;
        }
    }
    
    // 普通高亮
    const index = word.toLowerCase().indexOf(highlight.toLowerCase());
    if (index === -1) {
        return word;
    }
    
    const before = word.substring(0, index);
    const highlighted = word.substring(index, index + highlight.length);
    const after = word.substring(index + highlight.length);
    
    return `${before}<span class="highlight">${highlighted}</span>${after}`;
}

// ========== 复习模式 ==========
function startReview() {
    if (!currentLevel) return;
    
    const level = phonicsData[currentLevel];
    
    // 收集该 level 下所有单词
    reviewWords = [];
    level.units.forEach(unit => {
        unit.words.forEach(wordObj => {
            reviewWords.push({
                word: wordObj.word,
                highlight: wordObj.highlight,
                emoji: wordObj.emoji
            });
        });
    });
    
    // 随机打乱
    shuffleArray(reviewWords);
    currentReviewIndex = 0;
    
    // 显示第一个单词
    showReviewWord();
    navigateTo('review');
}

function showReviewWord() {
    if (reviewWords.length === 0) return;
    
    const wordObj = reviewWords[currentReviewIndex];
    const reviewWord = document.getElementById('review-word');
    reviewWord.innerHTML = highlightWord(wordObj.word, wordObj.highlight);
    
    // 更新图片
    const imagePlaceholder = document.querySelector('.word-image-placeholder');
    imagePlaceholder.innerHTML = `<span class="image-icon">${wordObj.emoji || '🖼️'}</span>`;
    
    // 更新进度
    const progress = document.getElementById('review-progress');
    progress.textContent = `${currentReviewIndex + 1} / ${reviewWords.length}`;
}

function nextWord() {
    if (reviewWords.length === 0) return;
    
    currentReviewIndex = (currentReviewIndex + 1) % reviewWords.length;
    showReviewWord();
    
    // 添加动画效果
    const card = document.querySelector('.review-card');
    card.style.animation = 'none';
    setTimeout(() => {
        card.style.animation = 'cardPop 0.5s ease';
    }, 10);
}

function previousWord() {
    if (reviewWords.length === 0) return;
    
    currentReviewIndex = (currentReviewIndex - 1 + reviewWords.length) % reviewWords.length;
    showReviewWord();
    
    // 添加动画效果
    const card = document.querySelector('.review-card');
    card.style.animation = 'none';
    setTimeout(() => {
        card.style.animation = 'cardPop 0.5s ease';
    }, 10);
}

function shuffleReview() {
    if (reviewWords.length === 0) return;
    
    shuffleArray(reviewWords);
    currentReviewIndex = 0;
    showReviewWord();
    
    // 添加动画效果
    const card = document.querySelector('.review-card');
    card.style.animation = 'none';
    setTimeout(() => {
        card.style.animation = 'cardPop 0.5s ease';
    }, 10);
}

// ========== 工具函数 ==========
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ========== 初始化应用 ==========
document.addEventListener('DOMContentLoaded', () => {
    renderHomePage();
    navigateTo('home');
});

// ========== 键盘快捷键 ==========
document.addEventListener('keydown', (e) => {
    const currentPage = document.querySelector('.page.active');
    
    if (currentPage && currentPage.id === 'review-page') {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            nextWord();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            previousWord();
        } else if (e.key === 'r' || e.key === 'R') {
            shuffleReview();
        }
    }
    
    if (currentPage && currentPage.id === 'explore-page') {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            nextExploreWord();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            previousExploreWord();
        } else if (e.key === 'r' || e.key === 'R') {
            shuffleExplore();
        }
    }
});

// ========== 探索模式 ==========
function startExplore() {
    if (!currentLevel) return;
    
    const level = phonicsData[currentLevel];
    
    // 收集该 level 下所有 units 的探索模式单词
    exploreWords = [];
    level.units.forEach(unit => {
        if (unit.exploreWords && unit.exploreWords.length > 0) {
            exploreWords.push(...unit.exploreWords);
        }
    });
    
    if (exploreWords.length === 0) {
        alert('该级别暂无探索模式单词');
        return;
    }
    
    // 随机打乱
    shuffleArray(exploreWords);
    currentExploreIndex = 0;
    
    // 显示第一个单词
    showExploreWord();
    navigateTo('explore');
}

function showExploreWord() {
    if (exploreWords.length === 0) return;
    
    const wordObj = exploreWords[currentExploreIndex];
    const exploreWord = document.getElementById('explore-word');
    exploreWord.innerHTML = highlightWord(wordObj.word, wordObj.highlight);
    
    // 更新进度
    const progress = document.getElementById('explore-progress');
    progress.textContent = `${currentExploreIndex + 1} / ${exploreWords.length}`;
}

function nextExploreWord() {
    if (exploreWords.length === 0) return;
    
    currentExploreIndex = (currentExploreIndex + 1) % exploreWords.length;
    showExploreWord();
    
    // 添加动画效果
    const card = document.querySelector('#explore-page .review-card');
    card.style.animation = 'none';
    setTimeout(() => {
        card.style.animation = 'cardPop 0.5s ease';
    }, 10);
}

function previousExploreWord() {
    if (exploreWords.length === 0) return;
    
    currentExploreIndex = (currentExploreIndex - 1 + exploreWords.length) % exploreWords.length;
    showExploreWord();
    
    // 添加动画效果
    const card = document.querySelector('#explore-page .review-card');
    card.style.animation = 'none';
    setTimeout(() => {
        card.style.animation = 'cardPop 0.5s ease';
    }, 10);
}

function shuffleExplore() {
    if (exploreWords.length === 0) return;
    
    shuffleArray(exploreWords);
    currentExploreIndex = 0;
    showExploreWord();
    
    // 添加动画效果
    const card = document.querySelector('#explore-page .review-card');
    card.style.animation = 'none';
    setTimeout(() => {
        card.style.animation = 'cardPop 0.5s ease';
    }, 10);
}

function backToLevel() {
    if (currentLevel) {
        showLevelPage(currentLevel);
    } else {
        navigateTo('home');
    }
}
