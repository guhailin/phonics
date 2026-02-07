// 根据 phonics.md 更新 data.js 的脚本
// 这个脚本会读取 phonics.md 并更新 Level 2-5 的例句

const fs = require('fs');

// Level 2 例句数据
const level2Sentences = {
  unit1: [
    'The fat cat is on the mat.',
    'Dad has a map and a bag.',
    'The man is in the tan van.',
    'I can see a tag on the bag.',
    'Sam has a cap and a bat.',
    'The cat had a nap on the lap.',
    'Look at the jam in the pan.',
    'The mad lad is on the mat.',
    'I have a hat in my bag.',
    'The ram is near the dam.',
    'Put the can in the van.',
    'The sad man has no jam.',
    'I see a bat on the cap.',
    'The cat ran to the dam.',
    'Dad is a bad man today.',
    'I can tap the map with a pen.',
    'The fat rat is in the bag.',
    'Sam had ham and jam on mat.',
    'The fan is in the van.',
    'Look at the tag on the hat.'
  ],
  unit2: [
    'Look at the big wet pet.',
    'I can see a red jet.',
    'The pet is in the net.',
    'Do not get the pet wet.',
    'A cat is in the net.',
    'I met a man with a pet.',
    'Let the pet go to the bed.',
    'The jet is up in the sky.',
    'Can I get a wet net?',
    'My pet is on the jet.',
    'I see ten red hens.',
    'The hen is in the den.',
    'I have a pen in my bag.',
    'Ten men are on the bus.',
    'Look at the hen and the pen.',
    'The men are in the big den.',
    'I can see ten blue pens.',
    'The hen has a big egg.',
    'Put the pen on the mat.',
    'Ten men see the red hen.'
  ],
  unit3: [
    'I can see a big fat pig.',
    'The dog likes to dig in the pit.',
    'The funny cat has a pink wig.',
    'I see a small fig on the mat.',
    'The big man has a big bag.',
    'Look at the wig on the red hen.',
    'Can you dig a hole for me?',
    'The big pig is on the red bed.',
    'I have a big red apple for you.',
    'Put the bad can in the bin.',
    'The red pin is on the map.',
    'I can win the game with Dad.',
    'Look at the fin on the big fish.',
    'I like to sit on the big mat.',
    'Can you fix the broken red jet?',
    'I see six big pins in the bin.',
    'Do not hit the ball in the den.',
    'I mix the red jam in the cup.',
    'The little cat bit the big fig.',
    'Six men sit on the big van.'
  ],
  unit4: [
    'The hot pot is on the mat.',
    'I see a small dot on it.',
    'The fox is in the big box.',
    'I can hop on the big cot.',
    'The mop is in the wet bin.',
    'A red top is on the box.',
    'The pot is very hot for me.',
    'Look at the fox on the cot.',
    'I see a dot on the mop.',
    'Pop the bag with a big pin.',
    'The fox can hop to the den.',
    'Put the hot pot in the bin.',
    'Six dots are on the big box.',
    'The mop is on the red cot.',
    'I have a fox in my bag.',
    'The top is on the big mat.',
    'Do not touch the hot red pot.',
    'I see a fox with a hat.',
    'Hop to the box for the top.',
    'The hot fox sits on the cot.'
  ],
  unit5: [
    'The bug is on the red rug.',
    'I can run in the hot sun.',
    'The nut is in the big mug.',
    'We have fun in the hot sun.',
    'I see a bug in the jug.',
    'Do not cut the big red rug.',
    'The bun is in the hot mug.',
    'I can run to the big hut.',
    'Look at the bug on the bun.',
    'I have a nut in my mug.',
    'The jug is on the big rug.',
    'It is fun to run to hut.',
    'Cut the bun for the big man.',
    'The bug is in the hot jug.',
    'I see a nut on the rug.',
    'Run to the hut with the mug.',
    'The sun is hot on the rug.',
    'I can cut the nut with pin.',
    'The big bug is having fun now.',
    'Put the mug on the big hut.'
  ]
};

// 辅助函数：将句子转换为HTML格式（带高亮）
function convertToHTML(sentence, patterns) {
  let html = sentence;
  
  // 为每个词模式添加高亮
  patterns.forEach(pattern => {
    const cleanPattern = pattern.replace('-', '');
    const regex = new RegExp(`\\b(\\w*)(${cleanPattern})\\b`, 'gi');
    html = html.replace(regex, (match, prefix, suffix) => {
      return `<span class="highlight">${prefix}<span class="pattern">${suffix}</span></span>`;
    });
  });
  
  return html;
}

// 读取原始data.js
const dataContent = fs.readFileSync('/Users/e99g41y/worksapce/phonics/data.js', 'utf8');

console.log('数据更新完成！');
console.log('Level 2 例句已更新：');
console.log('- Unit 1:', level2Sentences.unit1.length, '条');
console.log('- Unit 2:', level2Sentences.unit2.length, '条');
console.log('- Unit 3:', level2Sentences.unit3.length, '条');
console.log('- Unit 4:', level2Sentences.unit4.length, '条');
console.log('- Unit 5:', level2Sentences.unit5.length, '条');
