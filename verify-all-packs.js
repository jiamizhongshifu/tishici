const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./data/promptPacks.json', 'utf8'));

console.log('=== 所有11个提示包翻译状态完整验证 ===\n');

let grandTotal = 0;
let grandTranslated = 0;
let allComplete = true;

data.forEach((pack, index) => {
  let totalPrompts = 0;
  let translatedPrompts = 0;
  let sections = [];

  pack.sections.forEach(section => {
    let sectionTotal = section.prompts.length;
    let sectionTranslated = 0;

    section.prompts.forEach(prompt => {
      totalPrompts++;
      if (prompt.prompt.zh && prompt.prompt.zh.trim().length > 0) {
        translatedPrompts++;
        sectionTranslated++;
      }
    });

    const sectionName = typeof section.heading === 'object' ? section.heading.zh || section.heading.en : section.heading;
    sections.push({
      name: sectionName,
      translated: sectionTranslated,
      total: sectionTotal
    });
  });

  grandTotal += totalPrompts;
  grandTranslated += translatedPrompts;

  const percentage = totalPrompts > 0 ? Math.round((translatedPrompts / totalPrompts) * 100) : 0;
  const isComplete = translatedPrompts === totalPrompts;
  const status = isComplete ? '✅' : '❌';
  if (!isComplete) allComplete = false;

  const title = typeof pack.title === 'object' ? pack.title.zh || pack.title.en : pack.title;

  console.log(`${index + 1}. ${title}`);
  console.log(`   Slug: ${pack.slug}`);
  console.log(`   进度: ${translatedPrompts}/${totalPrompts} prompts (${percentage}%) ${status}`);

  if (sections.length > 0) {
    console.log(`   Sections:`);
    sections.forEach((s, i) => {
      const sectionStatus = s.translated === s.total ? '✅' : '❌';
      console.log(`     ${i + 1}. ${s.name}: ${s.translated}/${s.total} ${sectionStatus}`);
    });
  }
  console.log('');
});

console.log('=================================');
console.log('=== 总体统计 ===');
console.log(`总计: ${grandTranslated}/${grandTotal} prompts`);
console.log(`完成度: ${Math.round((grandTranslated / grandTotal) * 100)}%`);
console.log(`\n${allComplete ? '🎉 所有11个提示包翻译已100%完成!' : '⚠️ 仍有部分提示包翻译未完成'}`);
