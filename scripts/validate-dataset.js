/**
 * EduSkills-VN Dataset Validator & Compiler
 * Theo chuẩn kiến trúc AAS Core (Agentic Awesome Skills Specification)
 * Tác giả: Nguyễn Duy Quang
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const OUTPUT_DIR = path.join(__dirname, '..', 'dataset');
const CATALOG_FILE = path.join(OUTPUT_DIR, 'skills-catalog.json');
const REPORT_FILE = path.join(OUTPUT_DIR, 'validation-report.json');

const VALID_CATEGORIES = [
  'khoa-hoc-tu-nhien',
  'khoa-hoc-xa-hoi',
  'ngon-ngu-cong-nghe',
  'meta-tools'
];

// Parser đơn giản cho YAML Frontmatter (Zero external dependency)
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };

  const rawYaml = match[1];
  const body = match[2];
  const meta = {};

  let currentKey = null;
  let isArray = false;

  rawYaml.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    if (trimmed.startsWith('- ') && currentKey && isArray) {
      const val = trimmed.substring(2).trim().replace(/^["']|["']$/g, '');
      meta[currentKey].push(val);
      return;
    }

    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.substring(0, colonIdx).trim();
      let val = line.substring(colonIdx + 1).trim();

      if (val === '') {
        currentKey = key;
        isArray = true;
        meta[key] = [];
      } else if (val.startsWith('[') && val.endsWith(']')) {
        currentKey = key;
        isArray = false;
        meta[key] = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
      } else {
        currentKey = key;
        isArray = false;
        meta[key] = val.replace(/^["']|["']$/g, '');
      }
    }
  });

  return { meta, body };
}

// Quét đệ quy tìm tất cả file SKILL.md
function scanSkills(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(scanSkills(fullPath));
    } else if (file.toLowerCase() === 'skill.md') {
      results.push(fullPath);
    }
  });
  return results;
}

function runValidation() {
  console.log('\n=============================================================');
  console.log('  🔍 EDUSKILLS-VN: KIỂM ĐỊNH DATASET KỸ NĂNG (AAS STANDARD)');
  console.log('  Tác giả: Nguyễn Duy Quang | Hotline: 0795277227');
  console.log('=============================================================\n');

  const files = scanSkills(SKILLS_DIR);
  console.log(`📁 Tìm thấy ${files.length} file SKILL.md trong thư mục skills/\n`);

  const catalog = [];
  const report = {
    timestamp: new Date().toISOString(),
    totalScanned: files.length,
    validCount: 0,
    errorCount: 0,
    warningCount: 0,
    details: []
  };

  files.forEach(file => {
    const relPath = path.relative(path.join(__dirname, '..'), file).replace(/\\/g, '/');
    const content = fs.readFileSync(file, 'utf-8');
    const { meta, body } = parseFrontmatter(content);

    const issues = [];
    const warnings = [];

    // Kiểm tra các trường bắt buộc
    if (!meta.name) issues.push('Thiếu trường "name" trong YAML Frontmatter');
    if (!meta.description) issues.push('Thiếu trường "description" trong YAML Frontmatter');
    if (!meta.category) {
      issues.push('Thiếu trường "category"');
    } else if (!VALID_CATEGORIES.includes(meta.category)) {
      warnings.push(`Phân loại "${meta.category}" chưa thuộc danh mục chuẩn: ${VALID_CATEGORIES.join(', ')}`);
    }

    if (!meta.anti_hallucination_rules || meta.anti_hallucination_rules.length === 0) {
      warnings.push('Chưa định nghĩa quy tắc chống ảo giác (anti_hallucination_rules)');
    }

    const isValid = issues.length === 0;
    if (isValid) {
      report.validCount++;
      console.log(`  ✅ [HỢP LỆ] ${meta.name || relPath} (${meta.category || 'N/A'})`);
      
      catalog.push({
        id: meta.name,
        name: meta.name,
        version: meta.version || '1.0.0-beta',
        category: meta.category,
        description: meta.description,
        gradeLevels: meta.grade_levels || meta.grade_level || [10, 11, 12],
        subject: meta.subject || '',
        tools: meta.tools || [],
        antiHallucinationRules: meta.anti_hallucination_rules || [],
        curriculum: meta.curriculum_alignment || 'Bộ SGK Thống Nhất 2026',
        filePath: relPath,
        contentSample: body.substring(0, 300) + '...'
      });
    } else {
      report.errorCount++;
      console.log(`  ❌ [LỖI] ${relPath}`);
      issues.forEach(err => console.log(`      - ${err}`));
    }

    if (warnings.length > 0) {
      report.warningCount += warnings.length;
      warnings.forEach(w => console.log(`      ⚠️  ${w}`));
    }

    report.details.push({
      file: relPath,
      name: meta.name || 'UNKNOWN',
      isValid,
      issues,
      warnings
    });
  });

  // Tạo thư mục dataset nếu chưa có
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Ghi kết quả ra file JSON
  fs.writeFileSync(CATALOG_FILE, JSON.stringify(catalog, null, 2), 'utf-8');
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2), 'utf-8');

  console.log('\n-------------------------------------------------------------');
  console.log(`  📊 KẾT QUẢ KIỂM ĐỊNH:`);
  console.log(`     - Tổng số skills:  ${report.totalScanned}`);
  console.log(`     - Đạt chuẩn 100%:  ${report.validCount}`);
  console.log(`     - Lỗi cần sửa:     ${report.errorCount}`);
  console.log(`     - Cảnh báo:        ${report.warningCount}`);
  console.log('-------------------------------------------------------------');
  console.log(`  💾 Đã biên dịch Catalog tại:  dataset/skills-catalog.json`);
  console.log(`  📋 Đã lưu Báo cáo kiểm định: dataset/validation-report.json\n`);

  return report;
}

if (require.main === module) {
  runValidation();
}

module.exports = { runValidation, scanSkills, parseFrontmatter };
