const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./data/promptPacks.json', 'utf8'));
const targetPacks = [
  'use-cases-it',
  'use-cases-for-managers',
  'use-cases-executives',
  'use-cases-finance',
  'use-cases-marketing'
];

console.log('=== 5个提示包翻译完成状态验证 ===\n');

let grandTotal = 0;
let grandTranslated = 0;

targetPacks.forEach((slug, index) => {
  const pack = data.find(p => p.slug === slug);

  if (!pack) {
    console.log(`${index + 1}. ${slug}: ❌ NOT FOUND\n`);
    return;
  }

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

    const sectionName = typeof section.heading === 'object' ? section.heading.zh : section.heading;
    sections.push({
      name: sectionName,
      translated: sectionTranslated,
      total: sectionTotal
    });
  });

  grandTotal += totalPrompts;
  grandTranslated += translatedPrompts;

  const percentage = totalPrompts > 0 ? Math.round((translatedPrompts / totalPrompts) * 100) : 0;
  const status = translatedPrompts === totalPrompts ? '✅' : '❌';
  const title = typeof pack.title === 'object' ? pack.title.zh : pack.title;

  console.log(`${index + 1}. ${title}`);
  console.log(`   Slug: ${slug}`);
  console.log(`   进度: ${translatedPrompts}/${totalPrompts} prompts (${percentage}%) ${status}`);
  console.log(`   Sections:`);
  sections.forEach((s, i) => {
    const sectionStatus = s.translated === s.total ? '✅' : '❌';
    console.log(`     ${i + 1}. ${s.name}: ${s.translated}/${s.total} ${sectionStatus}`);
  });
  console.log('');
});

console.log('=== 总体统计 ===');
console.log(`总计: ${grandTranslated}/${grandTotal} prompts`);
console.log(`完成度: ${Math.round((grandTranslated / grandTotal) * 100)}%`);
console.log(grandTranslated === grandTotal ? '\n🎉 所有翻译已100%完成!' : '\n⚠️ 仍有部分翻译未完成');
