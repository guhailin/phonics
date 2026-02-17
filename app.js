// ========== 全局状态管理 ==========
let currentLevel = null;
let currentUnit = null;
let reviewWords = [];
let currentReviewIndex = 0;
let exploreWords = [];
let currentExploreIndex = 0;
let currentExamples = [];
let currentExampleIndex = 0;

// ========== 朗读单词配置 ==========
const speechConfig = {
    lang: 'en-US',                           // 语言: en-US(美式), en-GB(英式), zh-CN(中文)
    rate: 0.4,                               // 语速: 0.1(最慢) - 10(最快), 默认1
    pitch: 1.0,                              // 音调: 0(最低) - 2(最高), 默认1
    volume: 1,                               // 音量: 0(静音) - 1(最大)
    voiceName: 'Google US English 1 (Natural)'  // 指定特定语音
};

// ========== 显示配置 ==========
const displayConfig = {
    showPhonetic: true,    // 显示音标
    showDefinition: true,   // 显示释义
    hoverDisplay: true      // 单词卡片悬停显示
};

// ========== 朗读单词功能 ==========
// 缓存已加载的语音列表
let cachedVoices = [];

function loadVoices() {
    cachedVoices = window.speechSynthesis.getVoices();
    return cachedVoices;
}

function speakWord(word) {
    // 使用浏览器内置的语音合成 API
    if (!('speechSynthesis' in window)) {
        console.warn('浏览器不支持语音合成功能');
        return;
    }

    // 取消正在播放的语音
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = speechConfig.lang;
    utterance.rate = speechConfig.rate;
    utterance.pitch = speechConfig.pitch;
    utterance.volume = speechConfig.volume;

    // 尝试选择指定语音
    const voices = cachedVoices.length > 0 ? cachedVoices : loadVoices();
    if (speechConfig.voiceName && voices.length > 0) {
        const selectedVoice = voices.find(v => v.name === speechConfig.voiceName)
            || voices.find(v => v.name.includes(speechConfig.voiceName));
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
    }

    // 必须在用户手势的同步上下文中直接调用 speak()
    // 不能放在 setTimeout 里，否则浏览器会因为安全策略拒绝播放
    window.speechSynthesis.speak(utterance);
}

// 获取可用语音列表（调试用）
function listVoices() {
    if ('speechSynthesis' in window) {
        const voices = cachedVoices.length > 0 ? cachedVoices : loadVoices();
        console.log('可用语音列表:');
        voices.forEach((voice, i) => {
            console.log(`${i}: ${voice.name} (${voice.lang})`);
        });
        return voices;
    }
    return [];
}

// 自动选择最佳语音
function findBestVoice() {
    if (!('speechSynthesis' in window)) return null;

    const voices = cachedVoices.length > 0 ? cachedVoices : loadVoices();
    if (voices.length === 0) return null;

    // 按优先级排列的女声列表
    const preferredVoices = [
        'Samantha',         // macOS 美式女声 - 最推荐
        'Karen',            // macOS 澳式女声
        'Tessa',            // macOS 南非女声
        'Moira',            // macOS 苏格兰女声
        'Fiona',            // macOS 爱尔兰女声
        'Veena',            // macOS 印度女声
        'Zira',             // Windows 美式女声
        'Hazel',            // Windows 英式女声
        'Susan',            // Windows 美式女声
        'Heera',            // Windows 印度女声
        'Google US English', // Chrome 中性声
        'Microsoft Zira Desktop',
        'Microsoft Hazel Desktop'
    ];

    // 查找匹配的语音
    for (const preferred of preferredVoices) {
        const voice = voices.find(v => v.name.includes(preferred));
        if (voice) {
            console.log(`自动选择语音: ${voice.name}`);
            return voice.name;
        }
    }

    // 如果没找到推荐的，找第一个美式英语女声
    const enFemale = voices.find(v =>
        v.lang.startsWith('en') &&
        (v.name.includes('Female') || v.name.includes('Woman') || v.name.includes('Zira') || v.name.includes('Hazel'))
    );
    if (enFemale) {
        console.log(`自动选择语音: ${enFemale.name}`);
        return enFemale.name;
    }

    // 最后回退到默认美式英语
    const enDefault = voices.find(v => v.lang.startsWith('en'));
    if (enDefault) {
        console.log(`自动选择语音: ${enDefault.name}`);
        return enDefault.name;
    }

    return '';
}

// 页面加载时自动选择最佳语音
function initVoices() {
    loadVoices();
    const bestVoice = findBestVoice();
    if (bestVoice) {
        speechConfig.voiceName = bestVoice;
        console.log(`已更新 voiceName 为: ${bestVoice}`);
    }
}

// 监听 voiceschanged 事件（Chrome 等浏览器异步加载语音列表）
if ('speechSynthesis' in window) {
    // 某些浏览器立即可用，某些需要等事件
    window.speechSynthesis.onvoiceschanged = () => {
        initVoices();
        // 如果设置页面打开中，同步刷新语音下拉框
        const voiceSelect = document.getElementById('voiceSelect');
        const settingsPage = document.getElementById('settings-page');
        if (voiceSelect && settingsPage && settingsPage.classList.contains('active')) {
            loadVoiceList();
        }
    };
    // 也在 load 时尝试一次（Safari 等不触发 voiceschanged 的浏览器）
    window.addEventListener('load', () => {
        setTimeout(initVoices, 200);
    });
}

// 获取单词信息（音标和释义）
function getWordInfo(word) {
    const lowerWord = word.toLowerCase();
    if (wordInfo[lowerWord]) {
        return wordInfo[lowerWord];
    }
    // 如果没有找到，返回空对象
    return { phonetic: '', definition: '' };
}

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
    
    // 初始化例句
    currentExamples = unit.examples || (unit.example ? [unit.example] : []);
    currentExampleIndex = 0;
    renderExamples();
    
    // 默认显示单词tab
    switchTab('words');
    
    // 按pattern分组并排序单词
    const wordsGrid = document.querySelector('.words-grid');
    wordsGrid.innerHTML = '';
    
    // 按照patterns顺序分组单词
    unit.patterns.forEach(pattern => {
        const cleanPattern = pattern.replace(/^-/, ''); // 去掉前导的'-'
        
        // 找到该pattern的所有单词
        const patternWords = unit.words.filter(wordObj => {
            // 精确匹配 highlight 值
            return wordObj.highlight === cleanPattern || wordObj.highlight === pattern;
        });
        
               // 渲染该pattern的单词
        patternWords.forEach(wordObj => {
            const wordCard = document.createElement('div');
            wordCard.className = 'word-card';

            // 获取音标和释义
            const wordInfoData = getWordInfo(wordObj.word);

            // 高亮显示文本
            const displayedWord = highlightWord(wordObj.word, wordObj.highlight);

            // 保存原始单词用于朗读
            wordCard.dataset.word = wordObj.word;

            wordCard.innerHTML = `
                <span class="speaker-icon">🔊</span>
                <div class="word-image">
                    ${getWordImageHTML(wordObj)}
                </div>
                <div class="word-content">
                    <div class="word-text">${displayedWord}</div>
                    ${wordInfoData.phonetic ? `<div class="word-phonetic">${wordInfoData.phonetic}</div>` : ''}
                    ${wordInfoData.definition ? `<div class="word-definition">${wordInfoData.definition}</div>` : ''}
                </div>
            `;

            // 点击朗读单词
            wordCard.addEventListener('click', () => {
                speakWord(wordObj.word);
            });

            wordsGrid.appendChild(wordCard);
        });
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

    // 获取音标和释义
    const wordInfoData = getWordInfo(wordObj.word);
    const reviewPhonetic = document.getElementById('review-phonetic');
    const reviewDefinition = document.getElementById('review-definition');

    if (reviewPhonetic) {
        reviewPhonetic.textContent = wordInfoData.phonetic || '';
        reviewPhonetic.style.display = wordInfoData.phonetic ? 'block' : 'none';
    }
    if (reviewDefinition) {
        reviewDefinition.textContent = wordInfoData.definition || '';
        reviewDefinition.style.display = wordInfoData.definition ? 'block' : 'none';
    }

    // 更新图片
    const imagePlaceholder = document.querySelector('.word-image-placeholder');
    imagePlaceholder.innerHTML = getWordImageHTML(wordObj);

    // 更新进度
    const progress = document.getElementById('review-progress');
    progress.textContent = `${currentReviewIndex + 1} / ${reviewWords.length}`;

    // 添加点击朗读功能到单词显示区域
    const wordDisplay = document.querySelector('#review-page .word-display');
    if (wordDisplay) {
        wordDisplay.style.cursor = 'pointer';
        wordDisplay.onclick = () => speakWord(wordObj.word);
    }
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

// 获取单词图片或emoji的HTML
function getWordImageHTML(wordObj) {
    if (wordObj.image) {
        // 如果有图片路径，显示图片
        return `<img src="${wordObj.image}" alt="${wordObj.word}" class="word-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <span class="image-icon" style="display:none;">${wordObj.emoji || '🖼️'}</span>`;
    } else {
        // 否则显示emoji
        return `<span class="image-icon">${wordObj.emoji || '🖼️'}</span>`;
    }
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

    // 获取音标和释义
    const wordInfoData = getWordInfo(wordObj.word);
    const explorePhonetic = document.getElementById('explore-phonetic');
    const exploreDefinition = document.getElementById('explore-definition');

    if (explorePhonetic) {
        explorePhonetic.textContent = wordInfoData.phonetic || '';
        explorePhonetic.style.display = wordInfoData.phonetic ? 'block' : 'none';
    }
    if (exploreDefinition) {
        exploreDefinition.textContent = wordInfoData.definition || '';
        exploreDefinition.style.display = wordInfoData.definition ? 'block' : 'none';
    }

    // 更新进度
    const progress = document.getElementById('explore-progress');
    progress.textContent = `${currentExploreIndex + 1} / ${exploreWords.length}`;

    // 添加点击朗读功能到单词显示区域
    const wordDisplay = document.querySelector('#explore-page .word-display');
    if (wordDisplay) {
        wordDisplay.style.cursor = 'pointer';
        wordDisplay.onclick = () => speakWord(wordObj.word);
    }
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
// ========== Tab 切换功能 ==========
function switchTab(tabName) {
    // 更新tab按钮状态
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach((btn, index) => {
        btn.classList.remove('active');
        // 根据tabName设置对应按钮为active
        if ((tabName === 'words' && index === 0) || (tabName === 'examples' && index === 1)) {
            btn.classList.add('active');
        }
    });
    
    // 切换内容区域
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    if (tabName === 'words') {
        document.getElementById('words-tab').classList.add('active');
    } else if (tabName === 'examples') {
        document.getElementById('examples-tab').classList.add('active');
    }
}

// ========== 例句渲染和浏览功能 ==========
function renderExamples() {
    const container = document.querySelector('.examples-container');
    container.innerHTML = '';

    if (currentExamples.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">暂无例句</p>';
        return;
    }

    // 创建所有例句项
    currentExamples.forEach((example, index) => {
        const exampleItem = document.createElement('div');
        exampleItem.className = 'example-item';
        if (index === currentExampleIndex) {
            exampleItem.classList.add('active');
        }

        // 添加朗读按钮
        exampleItem.innerHTML = `
            <button class="example-speak-btn" onclick="speakExample(${index})">▶</button>
            <div class="example-text">${example}</div>
        `;

        container.appendChild(exampleItem);
    });

    // 更新计数器
    updateExampleCounter();
}

// 朗读例句（提取纯文本）
function speakExample(index) {
    if (index < 0 || index >= currentExamples.length) return;

    const exampleHTML = currentExamples[index];
    // 从HTML中提取纯文本
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = exampleHTML;
    const text = tempDiv.textContent || tempDiv.innerText;

    speakWord(text);
}

function updateExampleCounter() {
    const counter = document.getElementById('example-counter');
    if (currentExamples.length > 0) {
        counter.textContent = `${currentExampleIndex + 1} / ${currentExamples.length}`;
    } else {
        counter.textContent = '0 / 0';
    }
}

function nextExample() {
    if (currentExamples.length === 0) return;
    
    currentExampleIndex = (currentExampleIndex + 1) % currentExamples.length;
    
    // 更新显示
    document.querySelectorAll('.example-item').forEach((item, index) => {
        item.classList.remove('active');
        if (index === currentExampleIndex) {
            item.classList.add('active');
        }
    });
    
    updateExampleCounter();
}

function prevExample() {
    if (currentExamples.length === 0) return;
    
    currentExampleIndex = (currentExampleIndex - 1 + currentExamples.length) % currentExamples.length;
    
    // 更新显示
    document.querySelectorAll('.example-item').forEach((item, index) => {
        item.classList.remove('active');
        if (index === currentExampleIndex) {
            item.classList.add('active');
        }
    });
    
    updateExampleCounter();
}
// ========== 设置页面 ==========
function showSettings() {
    loadVoiceList();
    loadSettingsToUI();
    navigateTo('settings');
}

// 加载语音列表到下拉框
function loadVoiceList() {
    const voiceSelect = document.getElementById('voiceSelect');
    if (!voiceSelect) return;

    const voices = cachedVoices.length > 0 ? cachedVoices : loadVoices();

    if (voices.length === 0) {
        voiceSelect.innerHTML = '<option value="">没有可用语音</option>';
        return;
    }

    // 按优先级排序
    const preferredVoices = [
        'Google US English 1 (Natural)',
        'Google US English',
        'Samantha',
        'Karen',
        'Zira',
        'Hazel',
        'Microsoft Zira Desktop'
    ];

    const sortedVoices = [...voices].sort((a, b) => {
        const aIndex = preferredVoices.findIndex(v => a.name.includes(v));
        const bIndex = preferredVoices.findIndex(v => b.name.includes(v));

        if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
        } else if (aIndex !== -1) {
            return -1;
        } else if (bIndex !== -1) {
            return 1;
        }
        return a.name.localeCompare(b.name);
    });

    voiceSelect.innerHTML = '';
    sortedVoices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.name;
        option.textContent = voice.name;

        // 标记推荐语音
        if (preferredVoices.some(p => voice.name.includes(p))) {
            option.textContent += ' ⭐';
        }

        // 标记女声
        if (voice.name.includes('Female') || voice.name.includes('Samantha') ||
            voice.name.includes('Karen') || voice.name.includes('Zira')) {
            option.textContent += ' 👩';
        }

        if (voice.name === speechConfig.voiceName) {
            option.selected = true;
        }

        voiceSelect.appendChild(option);
    });
}

// 更新语音选择
function updateVoice() {
    const voiceSelect = document.getElementById('voiceSelect');
    if (voiceSelect) {
        speechConfig.voiceName = voiceSelect.value;
    }
}

// 测试语音
function testVoice() {
    const testWord = document.getElementById('testWord');
    const text = testWord ? testWord.value : 'Hello, how are you today?';

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechConfig.lang;
    utterance.rate = speechConfig.rate;
    utterance.pitch = speechConfig.pitch;
    utterance.volume = speechConfig.volume;

    const voices = cachedVoices.length > 0 ? cachedVoices : loadVoices();
    const voice = voices.find(v => v.name === speechConfig.voiceName);
    if (voice) {
        utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
}

// 更新语速
function updateRate() {
    const slider = document.getElementById('rateSlider');
    const display = document.getElementById('rateValue');
    if (slider) {
        speechConfig.rate = parseFloat(slider.value);
        if (display) display.textContent = '(' + slider.value + ')';
    }
}

// 更新音调
function updatePitch() {
    const slider = document.getElementById('pitchSlider');
    const display = document.getElementById('pitchValue');
    if (slider) {
        speechConfig.pitch = parseFloat(slider.value);
        if (display) display.textContent = '(' + slider.value + ')';
    }
}

// 更新音量
function updateVolume() {
    const slider = document.getElementById('volumeSlider');
    const display = document.getElementById('volumeValue');
    if (slider) {
        speechConfig.volume = parseFloat(slider.value);
        if (display) {
            const volPercent = Math.round(slider.value * 100);
            display.textContent = '(' + volPercent + '%)';
        }
    }
}

// 更新显示设置
function updateDisplaySettings() {
    const showPhonetic = document.getElementById('showPhonetic');
    const showDefinition = document.getElementById('showDefinition');
    const hoverDisplay = document.getElementById('hoverDisplay');

    if (showPhonetic) displayConfig.showPhonetic = showPhonetic.checked;
    if (showDefinition) displayConfig.showDefinition = showDefinition.checked;
    if (hoverDisplay) displayConfig.hoverDisplay = hoverDisplay.checked;

    applyDisplaySettings();
}

// 应用显示设置到页面
function applyDisplaySettings() {
    // 根据悬停设置更新CSS
    const style = document.getElementById('dynamic-styles') || document.createElement('' + 'style');
    style.id = 'dynamic-styles';

    if (displayConfig.hoverDisplay) {
        style.textContent = '.word-phonetic, .word-definition { opacity: 0; max-height: 0; overflow: hidden; transition: all 0.3s ease; } .word-card:hover .word-phonetic, .word-card:hover .word-definition { opacity: 1; max-height: 50px; }';
    } else {
        style.textContent = '.word-phonetic, .word-definition { opacity: 1; max-height: 50px; overflow: visible; }';
    }

    if (!document.getElementById('dynamic-styles')) {
        document.head.appendChild(style);
    }

    // 控制音标和释义的显示
    const phoneticElements = document.querySelectorAll('.word-phonetic, .review-phonetic, #explore-phonetic');
    const definitionElements = document.querySelectorAll('.word-definition, .review-definition, #explore-definition');

    phoneticElements.forEach(el => {
        el.style.display = displayConfig.showPhonetic && el.textContent ? '' : 'none';
    });
    definitionElements.forEach(el => {
        el.style.display = displayConfig.showDefinition && el.textContent ? '' : 'none';
    });
}

// 加载设置到UI
function loadSettingsToUI() {
    const rateSlider = document.getElementById('rateSlider');
    const pitchSlider = document.getElementById('pitchSlider');
    const volumeSlider = document.getElementById('volumeSlider');
    const showPhonetic = document.getElementById('showPhonetic');
    const showDefinition = document.getElementById('showDefinition');
    const hoverDisplay = document.getElementById('hoverDisplay');

    if (rateSlider) {
        rateSlider.value = speechConfig.rate;
        document.getElementById('rateValue').textContent = '(' + speechConfig.rate + ')';
    }
    if (pitchSlider) {
        pitchSlider.value = speechConfig.pitch;
        document.getElementById('pitchValue').textContent = '(' + speechConfig.pitch + ')';
    }
    if (volumeSlider) {
        volumeSlider.value = speechConfig.volume;
        const volPercent = Math.round(speechConfig.volume * 100);
        document.getElementById('volumeValue').textContent = '(' + volPercent + '%)';
    }
    if (showPhonetic) showPhonetic.checked = displayConfig.showPhonetic;
    if (showDefinition) showDefinition.checked = displayConfig.showDefinition;
    if (hoverDisplay) hoverDisplay.checked = displayConfig.hoverDisplay;
}

// 重置设置为默认
function resetSettings() {
    speechConfig.rate = 0.8;
    speechConfig.pitch = 1.0;
    speechConfig.volume = 1;
    speechConfig.voiceName = 'Google US English 1 (Natural)';
    speechConfig.lang = 'en-US';

    displayConfig.showPhonetic = true;
    displayConfig.showDefinition = true;
    displayConfig.hoverDisplay = true;

    loadSettingsToUI();
    loadVoiceList();
    applyDisplaySettings();
}


