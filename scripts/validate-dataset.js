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
        contentSample: body.substring(0, 300) + '...',
        rawContent: content
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

  // Ghi file JS Static Bundle để chạy 100% offline kể cả khi mở trực tiếp file:///
  const driveLinks = {
    lop_10: {
      title: 'Sách Giáo Khoa Lớp 10 (GDPT 2018 Toàn Bộ Các Bộ Sách)',
      url: 'https://drive.google.com/drive/folders/1H4BU2OMP1h5VJUtF8iQp9Dpmo40oHX6o?usp=drive_link',
      grade: 10,
      badge: 'Đầy đủ các bộ sách chuẩn'
    },
    lop_11: {
      title: 'Sách Giáo Khoa Lớp 11 (GDPT 2018 Bản Chuẩn Hóa BGD)',
      url: 'https://drive.google.com/drive/folders/1w8QOaRc_V5It9Xh0PvT_QwO_G7V22jZr?usp=drive_link',
      grade: 11,
      badge: 'Bản chuẩn hóa BGD'
    },
    lop_12: {
      title: 'Sách Giáo Khoa Lớp 12 (Bộ SGK Thống Nhất 2026-2027 Trọng Tâm Thi)',
      url: 'https://drive.google.com/drive/folders/1I3h4nfdJTO5KdPsD4UWYdYJlMXQL1YwD?usp=drive_link',
      grade: 12,
      badge: 'Trọng tâm thi THPT Quốc Gia'
    }
  };

  // Cơ sở dữ liệu chi tiết từng cuốn sách theo môn học và khối lớp
  const BOOKS_DATABASE = {
    'toan-thpt': {
      10: [
        { title: 'SGK Toán 10 - Tập 1 (GDPT 2018)', file: '10-sgk-toan-10-tap-mot.pdf', drive: 'https://drive.google.com/drive/folders/1H4BU2OMP1h5VJUtF8iQp9Dpmo40oHX6o?usp=drive_link' },
        { title: 'SGK Toán 10 - Tập 2 (GDPT 2018)', file: '10-sgk-toan-10-tap-hai.pdf', drive: 'https://drive.google.com/drive/folders/1H4BU2OMP1h5VJUtF8iQp9Dpmo40oHX6o?usp=drive_link' },
        { title: 'Chuyên đề học tập Toán 10', file: '10-sgk-chuyen-de-hoc-tap-toan-10.pdf', drive: 'https://drive.google.com/drive/folders/1H4BU2OMP1h5VJUtF8iQp9Dpmo40oHX6o?usp=drive_link' }
      ],
      11: [
        { title: 'SGK Toán 11 - Tập 1 (GDPT 2018)', file: '11-sgk-toan-11-tap-mot.pdf', drive: 'https://drive.google.com/drive/folders/1w8QOaRc_V5It9Xh0PvT_QwO_G7V22jZr?usp=drive_link' },
        { title: 'SGK Toán 11 - Tập 2 (GDPT 2018)', file: '11-sgk-toan-11-tap-hai.pdf', drive: 'https://drive.google.com/drive/folders/1w8QOaRc_V5It9Xh0PvT_QwO_G7V22jZr?usp=drive_link' }
      ],
      12: [
        { title: 'SGK Toán 12 - Tập 1 (Bộ Thống Nhất 2026)', file: '12-sgk-toan-12-tap-mot.pdf', drive: 'https://drive.google.com/drive/folders/1I3h4nfdJTO5KdPsD4UWYdYJlMXQL1YwD?usp=drive_link' },
        { title: 'SGK Toán 12 - Tập 2 (Bộ Thống Nhất 2026)', file: '12-sgk-toan-12-tap-hai.pdf', drive: 'https://drive.google.com/drive/folders/1I3h4nfdJTO5KdPsD4UWYdYJlMXQL1YwD?usp=drive_link' },
        { title: 'Chuyên đề học tập Toán 12 (Ứng dụng thực tế)', file: '12-sgk-chuyen-de-hoc-tap-toan-12.pdf', drive: 'https://drive.google.com/drive/folders/1I3h4nfdJTO5KdPsD4UWYdYJlMXQL1YwD?usp=drive_link' }
      ]
    },
    'vat-li-thpt': {
      10: [
        { title: 'SGK Vật lí 10 (GDPT 2018)', file: '10-sgk-vat-li-10.pdf', drive: 'https://drive.google.com/drive/folders/1H4BU2OMP1h5VJUtF8iQp9Dpmo40oHX6o?usp=drive_link' },
        { title: 'Chuyên đề học tập Vật lí 10', file: '10-sgk-chuyen-de-hoc-tap-vat-li-10.pdf', drive: 'https://drive.google.com/drive/folders/1H4BU2OMP1h5VJUtF8iQp9Dpmo40oHX6o?usp=drive_link' }
      ],
      11: [
        { title: 'SGK Vật lí 11 (GDPT 2018)', file: '11-sgk-vat-li-11.pdf', drive: 'https://drive.google.com/drive/folders/1w8QOaRc_V5It9Xh0PvT_QwO_G7V22jZr?usp=drive_link' },
        { title: 'Chuyên đề học tập Vật lí 11', file: '11-sgk-chuyen-de-hoc-tap-vat-li-11.pdf', drive: 'https://drive.google.com/drive/folders/1w8QOaRc_V5It9Xh0PvT_QwO_G7V22jZr?usp=drive_link' }
      ],
      12: [
        { title: 'Sách học sinh Vật lí 12 (Vật lí nhiệt & Khí lí tưởng)', file: '12-shs-vat-li-12.pdf', drive: 'https://drive.google.com/drive/folders/1I3h4nfdJTO5KdPsD4UWYdYJlMXQL1YwD?usp=drive_link' },
        { title: 'Chuyên đề học tập Vật lí 12', file: '12-sgk-chuyen-de-hoc-tap-vat-li-12.pdf', drive: 'https://drive.google.com/drive/folders/1I3h4nfdJTO5KdPsD4UWYdYJlMXQL1YwD?usp=drive_link' }
      ]
    },
    'hoa-hoc-thpt': {
      10: [
        { title: 'SGK Hóa học 10 (IUPAC Tiếng Anh)', file: '10-sgk-hoa-hoc-10.pdf', drive: 'https://drive.google.com/drive/folders/1H4BU2OMP1h5VJUtF8iQp9Dpmo40oHX6o?usp=drive_link' },
        { title: 'Chuyên đề học tập Hóa học 10', file: '10-sgk-chuyen-de-hoc-tap-hoa-hoc-10.pdf', drive: 'https://drive.google.com/drive/folders/1H4BU2OMP1h5VJUtF8iQp9Dpmo40oHX6o?usp=drive_link' }
      ],
      11: [
        { title: 'Chuyên đề học tập Hóa học 11', file: '11-sgk-chuyen-de-hoc-tap-hoa-hoc-11.pdf', drive: 'https://drive.google.com/drive/folders/1w8QOaRc_V5It9Xh0PvT_QwO_G7V22jZr?usp=drive_link' }
      ],
      12: [
        { title: 'Chuyên đề học tập Hóa học 12 (IUPAC Thống Nhất 2026)', file: '12-sgk-chuyen-de-hoc-tap-hoa-hoc-12.pdf', drive: 'https://drive.google.com/drive/folders/1I3h4nfdJTO5KdPsD4UWYdYJlMXQL1YwD?usp=drive_link' },
        { title: 'Sách giáo viên Hóa học 12', file: '12-sgv-chuyen-de-hoc-tap-hoa-hoc-12.pdf', drive: 'https://drive.google.com/drive/folders/1I3h4nfdJTO5KdPsD4UWYdYJlMXQL1YwD?usp=drive_link' }
      ]
    },
    'sinh-hoc-thpt': {
      10: [
        { title: 'SGK Sinh học 10', file: '10-sgk-sinh-hoc-10.pdf', drive: 'https://drive.google.com/drive/folders/1H4BU2OMP1h5VJUtF8iQp9Dpmo40oHX6o?usp=drive_link' }
      ],
      11: [
        { title: 'SGK Sinh học 11', file: '11-sgk-sinh-hoc-11.pdf', drive: 'https://drive.google.com/drive/folders/1w8QOaRc_V5It9Xh0PvT_QwO_G7V22jZr?usp=drive_link' }
      ],
      12: [
        { title: 'Sách giáo viên Sinh học 12 (Di truyền phân tử & Phả hệ)', file: '12-sgv-chuyen-de-hoc-tap-sinh-hoc-12.pdf', drive: 'https://drive.google.com/drive/folders/1I3h4nfdJTO5KdPsD4UWYdYJlMXQL1YwD?usp=drive_link' }
      ]
    },
    'ngu-van-thpt': {
      10: [
        { title: 'SGK Ngữ văn 10 - Tập 1 & 2', file: '10-sgk-ngu-van-10-tap-hai.pdf', drive: 'https://drive.google.com/drive/folders/1H4BU2OMP1h5VJUtF8iQp9Dpmo40oHX6o?usp=drive_link' }
      ],
      11: [
        { title: 'SGK Ngữ văn 11', file: '11-sgk-ngu-van-11.pdf', drive: 'https://drive.google.com/drive/folders/1w8QOaRc_V5It9Xh0PvT_QwO_G7V22jZr?usp=drive_link' }
      ],
      12: [
        { title: 'SGK Ngữ văn 12 - Tập 2 (Đọc hiểu ngoài SGK)', file: '12-sgk-ngu-van-12-tap-hai.pdf', drive: 'https://drive.google.com/drive/folders/1I3h4nfdJTO5KdPsD4UWYdYJlMXQL1YwD?usp=drive_link' },
        { title: 'Chuyên đề học tập Ngữ văn 12', file: '12-sgk-chuyen-de-hoc-tap-ngu-van-12.pdf', drive: 'https://drive.google.com/drive/folders/1I3h4nfdJTO5KdPsD4UWYdYJlMXQL1YwD?usp=drive_link' }
      ]
    },
    'lich-su-thpt': {
      10: [
        { title: 'SGK Lịch sử 10', file: '10-sgk-lich-su-10.pdf', drive: 'https://drive.google.com/drive/folders/1H4BU2OMP1h5VJUtF8iQp9Dpmo40oHX6o?usp=drive_link' }
      ],
      11: [],
      12: [
        { title: 'SGK Lịch sử 12 (Thống Nhất 2026)', file: '12-sgk-lich-su-12.pdf', drive: 'https://drive.google.com/drive/folders/1I3h4nfdJTO5KdPsD4UWYdYJlMXQL1YwD?usp=drive_link' }
      ]
    },
    'dia-li-thpt': {
      10: [
        { title: 'SGK Địa lí 10 (Khai thác Atlat)', file: '10-sgk-dia-li-10.pdf', drive: 'https://drive.google.com/drive/folders/1H4BU2OMP1h5VJUtF8iQp9Dpmo40oHX6o?usp=drive_link' }
      ],
      11: [
        { title: 'Chuyên đề học tập Địa lí 11', file: '11-sgv-chuyen-de-hoc-tap-dia-li-11.pdf', drive: 'https://drive.google.com/drive/folders/1w8QOaRc_V5It9Xh0PvT_QwO_G7V22jZr?usp=drive_link' }
      ],
      12: [
        { title: 'SGK Địa lí 12 (Thống Nhất 2026)', file: '12-sgk-dia-li-12.pdf', drive: 'https://drive.google.com/drive/folders/1I3h4nfdJTO5KdPsD4UWYdYJlMXQL1YwD?usp=drive_link' }
      ]
    },
    'ktpl-thpt': {
      10: [
        { title: 'SGK Giáo dục Kinh tế & Pháp luật 10', file: '10-sgk-giao-duc-kinh-te-va-phap-luat-10.pdf', drive: 'https://drive.google.com/drive/folders/1H4BU2OMP1h5VJUtF8iQp9Dpmo40oHX6o?usp=drive_link' }
      ],
      11: [],
      12: [
        { title: 'SGK Giáo dục Kinh tế & Pháp luật 12', file: '12-sgk-giao-duc-kinh-te-va-phap-luat-12.pdf', drive: 'https://drive.google.com/drive/folders/1I3h4nfdJTO5KdPsD4UWYdYJlMXQL1YwD?usp=drive_link' }
      ]
    },
    'tin-hoc-thpt': {
      10: [
        { title: 'SGK Tin học 10 (Python & CSDL)', file: '10-sgk-tin-hoc-10.pdf', drive: 'https://drive.google.com/drive/folders/1H4BU2OMP1h5VJUtF8iQp9Dpmo40oHX6o?usp=drive_link' }
      ],
      11: [],
      12: [
        { title: 'SGK Tin học 12 (Định hướng tin học ứng dụng & KHMT)', file: '12-sgk-tin-hoc-12-dinh-huong-tin-hoc-ung-dung.pdf', drive: 'https://drive.google.com/drive/folders/1I3h4nfdJTO5KdPsD4UWYdYJlMXQL1YwD?usp=drive_link' }
      ]
    },
    'cong-nghe-thpt': {
      10: [
        { title: 'SGK Công nghệ 10 (Thiết kế & Công nghệ)', file: '10-sgk-cong-nghe-10-thiet-ke-va-cong-nghe.pdf', drive: 'https://drive.google.com/drive/folders/1H4BU2OMP1h5VJUtF8iQp9Dpmo40oHX6o?usp=drive_link' }
      ],
      11: [],
      12: [
        { title: 'SGK Công nghệ 12 (Điện - Điện tử & Nông nghiệp)', file: '12-sgk-cong-nghe-12-cong-nghe-dien-dien-tu.pdf', drive: 'https://drive.google.com/drive/folders/1I3h4nfdJTO5KdPsD4UWYdYJlMXQL1YwD?usp=drive_link' }
      ]
    },
    'tieng-anh-thpt': {
      10: [
        { title: 'SGK Tiếng Anh 10 (Global Success)', file: '10-sgk-tieng-anh-10-global-sucess.pdf', drive: 'https://drive.google.com/drive/folders/1H4BU2OMP1h5VJUtF8iQp9Dpmo40oHX6o?usp=drive_link' }
      ],
      11: [
        { title: 'SGK Tiếng Anh 11 (Global Success)', file: '11-sgk-tieng-anh-11.pdf', drive: 'https://drive.google.com/drive/folders/1w8QOaRc_V5It9Xh0PvT_QwO_G7V22jZr?usp=drive_link' }
      ],
      12: [
        { title: 'SGK Tiếng Anh 12 (Global Success)', file: '12-sgk-tieng-anh-12.pdf', drive: 'https://drive.google.com/drive/folders/1I3h4nfdJTO5KdPsD4UWYdYJlMXQL1YwD?usp=drive_link' }
      ]
    }
  };

  fs.writeFileSync(path.join(OUTPUT_DIR, 'books-database.json'), JSON.stringify(BOOKS_DATABASE, null, 2), 'utf-8');

  const jsBundle = `/**
 * EduSkills-VN Offline Static Data Bundle
 * Tự động sinh bởi scripts/validate-dataset.js
 * Giúp giao diện hoạt động 100% offline không phụ thuộc mạng
 */
window.EDUSKILLS_CATALOG = ${JSON.stringify(catalog, null, 2)};
window.EDUSKILLS_DRIVE_LINKS = ${JSON.stringify(driveLinks, null, 2)};
window.EDUSKILLS_BOOKS = ${JSON.stringify(BOOKS_DATABASE, null, 2)};
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'skills-data.js'), jsBundle, 'utf-8');
  const webDir = path.join(__dirname, '..', 'web');
  if (fs.existsSync(webDir)) {
    fs.writeFileSync(path.join(webDir, 'skills-data.js'), jsBundle, 'utf-8');
  }

  console.log('\n-------------------------------------------------------------');
  console.log(`  📊 KẾT QUẢ KIỂM ĐỊNH:`);
  console.log(`     - Tổng số skills:  ${report.totalScanned}`);
  console.log(`     - Đạt chuẩn 100%:  ${report.validCount}`);
  console.log(`     - Lỗi cần sửa:     ${report.errorCount}`);
  console.log(`     - Cảnh báo:        ${report.warningCount}`);
  console.log('-------------------------------------------------------------');
  console.log(`  💾 Đã biên dịch Catalog tại:     dataset/skills-catalog.json`);
  console.log(`  📦 Đã xuất Bundle Offline tại:   web/skills-data.js`);
  console.log(`  📋 Đã lưu Báo cáo kiểm định:    dataset/validation-report.json\n`);

  return report;
}

if (require.main === module) {
  runValidation();
}

module.exports = { runValidation, scanSkills, parseFrontmatter };
