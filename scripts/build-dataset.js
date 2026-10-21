/**
 * EduSkills-VN Dataset & Universal Prompt Bundle Builder (v2.0.0)
 * Biên dịch toàn bộ 16 Skills, CSDL Sách Giáo Khoa & Bộ Master Prompts Độc Lập Hệ Sinh Thái
 * Tác giả: Nguyễn Duy Quang | Hotline: 0795277227 | Email: poiairo4628@gmail.com
 */

const fs = require('fs');
const path = require('path');
const { runValidation } = require('./validate-dataset');
const {
  SKILL_DEEP_PROFILES,
  generateIntentDrivenPrompt
} = require('../backend/ocr-engine');

const ROOT_DIR = path.join(__dirname, '..');
const DATASET_DIR = path.join(ROOT_DIR, 'dataset');

function buildAll() {
  console.log('\n=============================================================');
  console.log('  🏗️  EDUSKILLS-VN: BUILD DATASET & UNIVERSAL PROMPT BUNDLE');
  console.log('=============================================================');

  // 1. Chạy kiểm định và biên dịch skills-catalog.json, books-database.json, skills-data.js
  const report = runValidation(false);
  if (report.errorCount > 0) {
    console.error(`❌ Build thất bại do có ${report.errorCount} lỗi trong dataset.`);
    process.exit(1);
  }

  // 2. Đọc books-database.json để liên kết sách chuẩn cho từng skill
  const booksDbPath = path.join(DATASET_DIR, 'books-database.json');
  const booksDb = fs.existsSync(booksDbPath)
    ? JSON.parse(fs.readFileSync(booksDbPath, 'utf-8'))
    : {};

  // 3. Biên dịch Universal Prompts Bundle cho toàn bộ 16 kỹ năng (Độc lập hệ sinh thái)
  const universalBundle = {
    version: '2.0.0',
    generatedAt: new Date().toISOString(),
    ecosystem: '100% Vendor-Agnostic & Self-Contained',
    totalSkills: Object.keys(SKILL_DEEP_PROFILES).length,
    skills: {}
  };

  Object.keys(SKILL_DEEP_PROFILES).forEach(skillId => {
    const profile = SKILL_DEEP_PROFILES[skillId];
    const bookRef = (booksDb[skillId] && booksDb[skillId][12] && booksDb[skillId][12][0])
      ? booksDb[skillId][12][0]
      : null;

    universalBundle.skills[skillId] = {
      id: skillId,
      title: profile.title,
      domainBadge: profile.domainBadge,
      epistemology: profile.epistemology,
      traps: profile.traps,
      coveChecklist: profile.coveChecklist,
      fewShot: profile.fewShot,
      prompts: {
        standard7Pillar: generateIntentDrivenPrompt({
          subject: skillId,
          gradeLevel: 12,
          competencyTier: 'vdc',
          usageContext: 'giai-de',
          exportMode: 'standard',
          bookObject: bookRef,
          verifiedContent: profile.sampleProblem
        }),
        universalXmlSystemPrompt: generateIntentDrivenPrompt({
          subject: skillId,
          gradeLevel: 12,
          competencyTier: 'vdc',
          usageContext: 'giai-de',
          exportMode: 'system-prompt',
          bookObject: bookRef,
          verifiedContent: profile.sampleProblem
        })
      }
    };
  });

  const bundlePath = path.join(DATASET_DIR, 'universal-prompts-bundle.json');
  fs.writeFileSync(bundlePath, JSON.stringify(universalBundle, null, 2), 'utf-8');

  console.log(`  ✨ Đã xuất Universal Prompts Bundle (16 skills): dataset/universal-prompts-bundle.json`);
  console.log('  ✅ BUILD HOÀN TẤT THÀNH CÔNG 100%!\n');
  return { report, universalBundle };
}

if (require.main === module) {
  buildAll();
}

module.exports = { buildAll };
