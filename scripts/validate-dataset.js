/**
 * EduSkills-VN Dataset Validator & Static Bundle Compiler (v2.0.0)
 * Theo chuẩn Universal Agentic Skill Specification (UASS v2.0 - Độc lập Hệ sinh thái)
 * Tác giả: Nguyễn Duy Quang | Hotline: 0795277227 | Email: poiairo4628@gmail.com
 */

const fs = require('fs');
const path = require('path');
const { SKILL_DEEP_PROFILES, COMPETENCY_TIERS, USAGE_CONTEXTS } = require('../backend/ocr-engine');

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

const MIN_SKILL_CONTENT_LENGTH = 3500; // Chặn đứng các file stub sơ sài

// Parser cho YAML Frontmatter (Zero external dependency)
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

function runValidation(silent = false) {
  if (!silent) {
    console.log('\n=============================================================');
    console.log('  🔍 EDUSKILLS-VN: KIỂM ĐỊNH DATASET KỸ NĂNG (UASS v2.0)');
    console.log('  Tác giả: Nguyễn Duy Quang | Hotline: 0795277227');
    console.log('=============================================================\n');
  }

  const files = scanSkills(SKILLS_DIR);
  if (!silent) {
    console.log(`📁 Tìm thấy ${files.length} file SKILL.md trong thư mục skills/\n`);
  }

  const catalog = [];
  const report = {
    timestamp: new Date().toISOString(),
    standard: 'Universal Agentic Skill Specification (UASS v2.0)',
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

    // 1. Kiểm tra các trường YAML bắt buộc
    if (!meta.name) issues.push('Thiếu trường "name" trong YAML Frontmatter');
    if (!meta.description) issues.push('Thiếu trường "description" trong YAML Frontmatter');
    if (!meta.category) {
      issues.push('Thiếu trường "category"');
    } else if (!VALID_CATEGORIES.includes(meta.category)) {
      issues.push(`Phân loại "${meta.category}" không thuộc danh mục chuẩn: ${VALID_CATEGORIES.join(', ')}`);
    }

    if (!meta.anti_hallucination_rules || meta.anti_hallucination_rules.length < 3) {
      issues.push('Cần tối thiểu 3 quy tắc chống ảo giác (anti_hallucination_rules)');
    }

    // 2. Kiểm tra chiều sâu nội dung (Chống file stub sơ sài)
    if (content.length < MIN_SKILL_CONTENT_LENGTH) {
      issues.push(`Nội dung quá ngắn (${content.length} bytes < ${MIN_SKILL_CONTENT_LENGTH} bytes tối thiểu)`);
    }

    // 3. Kiểm tra các thành phần kiến trúc v2.0 bắt buộc
    const hasUniversalPrompt = content.includes('<universal_agentic_skill') && content.includes('</universal_agentic_skill>');
    const hasTrapMatrix = content.includes('Trap Matrix') || content.includes('Ma Trận Bẫy');
    const hasCoVe = content.includes('<chain_of_verification>');

    if (!hasUniversalPrompt) {
      issues.push('Thiếu khối Master Universal System Prompt (<universal_agentic_skill>...</universal_agentic_skill>)');
    }
    if (!hasTrapMatrix) {
      warnings.push('Chưa có bảng Ma Trận Bẫy (Cognitive Trap Matrix)');
    }
    if (!hasCoVe) {
      issues.push('Thiếu giao thức Tự kiểm chứng (<chain_of_verification>)');
    }
    if (!SKILL_DEEP_PROFILES[meta.name]) {
      issues.push(`Thiếu hồ sơ nhận thức luận SKILL_DEEP_PROFILES cho "${meta.name}" trong backend/ocr-engine.js`);
    }

    const isValid = issues.length === 0;
    const deepProfile = SKILL_DEEP_PROFILES[meta.name] || {};

    if (isValid) {
      report.validCount++;
      if (!silent) {
        console.log(`  ✅ [ĐẠT CHUẨN v2.0] ${meta.name.padEnd(20)} | ${String(content.length).padStart(5)} chars | ${meta.category}`);
      }

      catalog.push({
        id: meta.name,
        name: meta.name,
        canonicalId: meta.canonical_id || meta.name,
        version: meta.version || '2.0.0',
        category: meta.category,
        description: meta.description,
        gradeLevels: meta.grade_levels || meta.grade_level || ['10', '11', '12'],
        subject: meta.subject || deepProfile.title || '',
        tools: meta.tools || [],
        antiHallucinationRules: meta.anti_hallucination_rules || [],
        curriculum: meta.curriculum || 'GDPT 2018 (Bộ SGK Thống Nhất 2026)',
        examFormat: meta.exam_format || 'Quyết định 764/QĐ-BGDĐT',
        domainBadge: deepProfile.domainBadge || '',
        epistemology: deepProfile.epistemology || '',
        trapsCount: (deepProfile.traps || []).length,
        coveCount: (deepProfile.coveChecklist || []).length,
        filePath: relPath,
        contentLength: content.length,
        contentSample: body.substring(0, 300) + '...',
        rawContent: content
      });
    } else {
      report.errorCount++;
      if (!silent) {
        console.log(`  ❌ [LỖI] ${relPath}`);
        issues.forEach(err => console.log(`      - ${err}`));
      }
    }

    if (warnings.length > 0) {
      report.warningCount += warnings.length;
      if (!silent) {
        warnings.forEach(w => console.log(`      ⚠️  ${w}`));
      }
    }

    report.details.push({
      file: relPath,
      name: meta.name || 'UNKNOWN',
      version: meta.version || 'UNKNOWN',
      contentLength: content.length,
      hasUniversalPrompt,
      hasTrapMatrix,
      hasCoVe,
      isValid,
      issues,
      warnings
    });
  });

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  fs.writeFileSync(CATALOG_FILE, JSON.stringify(catalog, null, 2), 'utf-8');
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2), 'utf-8');

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

  // Cơ sở dữ liệu chi tiết từng cuốn sách theo môn học và khối lớp (Đầy đủ 10, 11, 12 cho toàn bộ 16 skills)
  const BOOKS_DATABASE = {
    'toan-thpt': {
      10: [
        { title: 'SGK Toán 10 - Tập 1 (GDPT 2018)', file: '10-sgk-toan-10-tap-mot.pdf', drive: driveLinks.lop_10.url },
        { title: 'SGK Toán 10 - Tập 2 (GDPT 2018)', file: '10-sgk-toan-10-tap-hai.pdf', drive: driveLinks.lop_10.url },
        { title: 'Chuyên đề học tập Toán 10', file: '10-sgk-chuyen-de-hoc-tap-toan-10.pdf', drive: driveLinks.lop_10.url }
      ],
      11: [
        { title: 'SGK Toán 11 - Tập 1 (GDPT 2018)', file: '11-sgk-toan-11-tap-mot.pdf', drive: driveLinks.lop_11.url },
        { title: 'SGK Toán 11 - Tập 2 (GDPT 2018)', file: '11-sgk-toan-11-tap-hai.pdf', drive: driveLinks.lop_11.url }
      ],
      12: [
        { title: 'SGK Toán 12 - Tập 1 (Bộ Thống Nhất 2026)', file: '12-sgk-toan-12-tap-mot.pdf', drive: driveLinks.lop_12.url },
        { title: 'SGK Toán 12 - Tập 2 (Bộ Thống Nhất 2026)', file: '12-sgk-toan-12-tap-hai.pdf', drive: driveLinks.lop_12.url },
        { title: 'Chuyên đề học tập Toán 12 (Ứng dụng thực tế)', file: '12-sgk-chuyen-de-hoc-tap-toan-12.pdf', drive: driveLinks.lop_12.url }
      ]
    },
    'vat-li-thpt': {
      10: [
        { title: 'SGK Vật lí 10 (GDPT 2018)', file: '10-sgk-vat-li-10.pdf', drive: driveLinks.lop_10.url },
        { title: 'Chuyên đề học tập Vật lí 10', file: '10-sgk-chuyen-de-hoc-tap-vat-li-10.pdf', drive: driveLinks.lop_10.url }
      ],
      11: [
        { title: 'SGK Vật lí 11 (GDPT 2018)', file: '11-sgk-vat-li-11.pdf', drive: driveLinks.lop_11.url },
        { title: 'Chuyên đề học tập Vật lí 11', file: '11-sgk-chuyen-de-hoc-tap-vat-li-11.pdf', drive: driveLinks.lop_11.url }
      ],
      12: [
        { title: 'Sách học sinh Vật lí 12 (Vật lí nhiệt, Khí lí tưởng, Từ trường & Hạt nhân)', file: '12-shs-vat-li-12.pdf', drive: driveLinks.lop_12.url },
        { title: 'Chuyên đề học tập Vật lí 12', file: '12-sgk-chuyen-de-hoc-tap-vat-li-12.pdf', drive: driveLinks.lop_12.url }
      ]
    },
    'hoa-hoc-thpt': {
      10: [
        { title: 'SGK Hóa học 10 (IUPAC Tiếng Anh)', file: '10-sgk-hoa-hoc-10.pdf', drive: driveLinks.lop_10.url },
        { title: 'Chuyên đề học tập Hóa học 10', file: '10-sgk-chuyen-de-hoc-tap-hoa-hoc-10.pdf', drive: driveLinks.lop_10.url }
      ],
      11: [
        { title: 'SGK & Chuyên đề học tập Hóa học 11 (IUPAC)', file: '11-sgk-chuyen-de-hoc-tap-hoa-hoc-11.pdf', drive: driveLinks.lop_11.url }
      ],
      12: [
        { title: 'SGK & Chuyên đề Hóa học 12 (IUPAC Thống Nhất 2026)', file: '12-sgk-chuyen-de-hoc-tap-hoa-hoc-12.pdf', drive: driveLinks.lop_12.url },
        { title: 'Sách giáo viên Hóa học 12', file: '12-sgv-chuyen-de-hoc-tap-hoa-hoc-12.pdf', drive: driveLinks.lop_12.url }
      ]
    },
    'sinh-hoc-thpt': {
      10: [
        { title: 'SGK Sinh học 10 (Sinh học Tế bào & Vi sinh vật)', file: '10-sgk-sinh-hoc-10.pdf', drive: driveLinks.lop_10.url }
      ],
      11: [
        { title: 'SGK Sinh học 11 (Sinh học Cơ thể Thực vật & Động vật)', file: '11-sgk-sinh-hoc-11.pdf', drive: driveLinks.lop_11.url }
      ],
      12: [
        { title: 'SGK & Chuyên đề Sinh học 12 (Di truyền phân tử, Quần thể & Sinh thái)', file: '12-sgv-chuyen-de-hoc-tap-sinh-hoc-12.pdf', drive: driveLinks.lop_12.url }
      ]
    },
    'ngu-van-thpt': {
      10: [
        { title: 'SGK Ngữ văn 10 - Tập 1 & 2 (GDPT 2018)', file: '10-sgk-ngu-van-10-tap-hai.pdf', drive: driveLinks.lop_10.url }
      ],
      11: [
        { title: 'SGK Ngữ văn 11 - Tập 1 & 2 (GDPT 2018)', file: '11-sgk-ngu-van-11.pdf', drive: driveLinks.lop_11.url }
      ],
      12: [
        { title: 'SGK Ngữ văn 12 - Tập 1 & 2 (Đọc hiểu theo thể loại & Viết 200/600 chữ)', file: '12-sgk-ngu-van-12-tap-hai.pdf', drive: driveLinks.lop_12.url },
        { title: 'Chuyên đề học tập Ngữ văn 12', file: '12-sgk-chuyen-de-hoc-tap-ngu-van-12.pdf', drive: driveLinks.lop_12.url }
      ]
    },
    'lich-su-thpt': {
      10: [
        { title: 'SGK Lịch sử 10 (Văn minh Thế giới & Đại Việt)', file: '10-sgk-lich-su-10.pdf', drive: driveLinks.lop_10.url }
      ],
      11: [
        { title: 'SGK Lịch sử 11 (Cách mạng Tư sản, CNXH & Chiến tranh bảo vệ Tổ quốc)', file: '11-sgk-lich-su-11.pdf', drive: driveLinks.lop_11.url }
      ],
      12: [
        { title: 'SGK Lịch sử 12 (Thế giới hiện đại, ASEAN, Cách mạng VN 1945-1975 & Đổi mới)', file: '12-sgk-lich-su-12.pdf', drive: driveLinks.lop_12.url }
      ]
    },
    'dia-li-thpt': {
      10: [
        { title: 'SGK Địa lí 10 (Địa lí Tự nhiên & Kinh tế - Xã hội Đại cương)', file: '10-sgk-dia-li-10.pdf', drive: driveLinks.lop_10.url }
      ],
      11: [
        { title: 'SGK & Chuyên đề Địa lí 11 (Địa lí Khu vực và Quốc gia)', file: '11-sgv-chuyen-de-hoc-tap-dia-li-11.pdf', drive: driveLinks.lop_11.url }
      ],
      12: [
        { title: 'SGK Địa lí 12 (Địa lí Tự nhiên, Dân cư, Ngành & Vùng kinh tế Việt Nam)', file: '12-sgk-dia-li-12.pdf', drive: driveLinks.lop_12.url }
      ]
    },
    'ktpl-thpt': {
      10: [
        { title: 'SGK Giáo dục Kinh tế & Pháp luật 10 (Cơ chế thị trường & Hiến pháp)', file: '10-sgk-giao-duc-kinh-te-va-phap-luat-10.pdf', drive: driveLinks.lop_10.url }
      ],
      11: [
        { title: 'SGK Giáo dục Kinh tế & Pháp luật 11 (Cạnh tranh, Lạm phát & Quyền công dân)', file: '11-sgk-giao-duc-kinh-te-va-phap-luat-11.pdf', drive: driveLinks.lop_11.url }
      ],
      12: [
        { title: 'SGK Giáo dục Kinh tế & Pháp luật 12 (Tăng trưởng, Hội nhập, Bảo hiểm & Luật Quốc tế)', file: '12-sgk-giao-duc-kinh-te-va-phap-luat-12.pdf', drive: driveLinks.lop_12.url }
      ]
    },
    'tin-hoc-thpt': {
      10: [
        { title: 'SGK Tin học 10 (Lập trình Python & Xã hội số)', file: '10-sgk-tin-hoc-10.pdf', drive: driveLinks.lop_10.url }
      ],
      11: [
        { title: 'SGK Tin học 11 (Cơ sở dữ liệu SQL & Cấu trúc dữ liệu - Giải thuật)', file: '11-sgk-tin-hoc-11.pdf', drive: driveLinks.lop_11.url }
      ],
      12: [
        { title: 'SGK Tin học 12 (Trí tuệ nhân tạo, Mạng TCP/IP & Thiết kế Web HTML/CSS)', file: '12-sgk-tin-hoc-12-dinh-huong-tin-hoc-ung-dung.pdf', drive: driveLinks.lop_12.url }
      ]
    },
    'cong-nghe-thpt': {
      10: [
        { title: 'SGK Công nghệ 10 (Thiết kế kỹ thuật & Công nghệ trồng trọt)', file: '10-sgk-cong-nghe-10-thiet-ke-va-cong-nghe.pdf', drive: driveLinks.lop_10.url }
      ],
      11: [
        { title: 'SGK Công nghệ 11 (Cơ khí chế tạo, Động cơ đốt trong & Chăn nuôi)', file: '11-sgk-cong-nghe-11-cong-nghe-co-khi.pdf', drive: driveLinks.lop_11.url }
      ],
      12: [
        { title: 'SGK Công nghệ 12 (Mạch điện 3 pha, Điện tử & Lâm nghiệp - Thủy sản)', file: '12-sgk-cong-nghe-12-cong-nghe-dien-dien-tu.pdf', drive: driveLinks.lop_12.url }
      ]
    },
    'tieng-anh-thpt': {
      10: [
        { title: 'SGK Tiếng Anh 10 (Global Success - CEFR B1)', file: '10-sgk-tieng-anh-10-global-sucess.pdf', drive: driveLinks.lop_10.url }
      ],
      11: [
        { title: 'SGK Tiếng Anh 11 (Global Success - CEFR B1+/B2)', file: '11-sgk-tieng-anh-11.pdf', drive: driveLinks.lop_11.url }
      ],
      12: [
        { title: 'SGK Tiếng Anh 12 (Global Success - CEFR B2/C1 Trọng tâm Thi)', file: '12-sgk-tieng-anh-12.pdf', drive: driveLinks.lop_12.url }
      ]
    },
    'giai-chi-tiet': {
      10: [{ title: 'Tổng hợp SGK Lớp 10 (Phương pháp giải chi tiết 4 tầng Socrates)', file: '10-sgk-toan-10-tap-mot.pdf', drive: driveLinks.lop_10.url }],
      11: [{ title: 'Tổng hợp SGK Lớp 11 (Phương pháp giải chi tiết 4 tầng Socrates)', file: '11-sgk-toan-11-tap-mot.pdf', drive: driveLinks.lop_11.url }],
      12: [{ title: 'Tổng hợp SGK Lớp 12 (Phương pháp giải chi tiết 4 tầng Socrates)', file: '12-sgk-toan-12-tap-mot.pdf', drive: driveLinks.lop_12.url }]
    },
    'tao-quiz-bgd': {
      10: [{ title: 'Khung Ma trận Đề kiểm tra Lớp 10 (Chuẩn QĐ 764/QĐ-BGDĐT)', file: '10-sgk-toan-10-tap-mot.pdf', drive: driveLinks.lop_10.url }],
      11: [{ title: 'Khung Ma trận Đề kiểm tra Lớp 11 (Chuẩn QĐ 764/QĐ-BGDĐT)', file: '11-sgk-toan-11-tap-mot.pdf', drive: driveLinks.lop_11.url }],
      12: [{ title: 'Khung Ma trận Đề thi Tốt nghiệp THPT Lớp 12 (Chuẩn QĐ 764/QĐ-BGDĐT)', file: '12-sgk-toan-12-tap-mot.pdf', drive: driveLinks.lop_12.url }]
    },
    'slide-thuyet-trinh': {
      10: [{ title: 'Học liệu Dự án Thuyết trình Lớp 10 (Marp 16:9 & Mermaid)', file: '10-sgk-chuyen-de-hoc-tap-toan-10.pdf', drive: driveLinks.lop_10.url }],
      11: [{ title: 'Học liệu Dự án Thuyết trình Lớp 11 (Marp 16:9 & Mermaid)', file: '11-sgk-vat-li-11.pdf', drive: driveLinks.lop_11.url }],
      12: [{ title: 'Học liệu Dự án Thuyết trình Lớp 12 (Marp 16:9 & Mermaid)', file: '12-sgk-chuyen-de-hoc-tap-toan-12.pdf', drive: driveLinks.lop_12.url }]
    },
    'tomtat-mindmap': {
      10: [{ title: 'Hệ thống Sơ đồ Tư duy & Cornell Cheatsheet Lớp 10', file: '10-sgk-sinh-hoc-10.pdf', drive: driveLinks.lop_10.url }],
      11: [{ title: 'Hệ thống Sơ đồ Tư duy & Cornell Cheatsheet Lớp 11', file: '11-sgk-sinh-hoc-11.pdf', drive: driveLinks.lop_11.url }],
      12: [{ title: 'Hệ thống Sơ đồ Tư duy & Cornell Cheatsheet Lớp 12', file: '12-shs-vat-li-12.pdf', drive: driveLinks.lop_12.url }]
    },
    'luan-an-nghiencuu': {
      10: [{ title: 'Cẩm nang Nghiên cứu Khoa học Kỹ thuật THPT Lớp 10 (ViSEF/STEM)', file: '10-sgk-chuyen-de-hoc-tap-hoa-hoc-10.pdf', drive: driveLinks.lop_10.url }],
      11: [{ title: 'Cẩm nang Nghiên cứu Khoa học Kỹ thuật THPT Lớp 11 (ViSEF/STEM)', file: '11-sgk-chuyen-de-hoc-tap-hoa-hoc-11.pdf', drive: driveLinks.lop_11.url }],
      12: [{ title: 'Cẩm nang Nghiên cứu Khoa học Kỹ thuật THPT Lớp 12 (ViSEF/ISEF)', file: '12-sgk-chuyen-de-hoc-tap-hoa-hoc-12.pdf', drive: driveLinks.lop_12.url }]
    }
  };

  fs.writeFileSync(path.join(OUTPUT_DIR, 'books-database.json'), JSON.stringify(BOOKS_DATABASE, null, 2), 'utf-8');

  const jsBundle = `/**
 * EduSkills-VN Offline Static Data Bundle (v2.0.0 - Vendor-Agnostic Universal Edition)
 * Tự động biên dịch bởi scripts/validate-dataset.js & scripts/build-dataset.js
 * Đảm bảo giao diện hoạt động 100% offline không phụ thuộc mạng hay hệ sinh thái đóng
 */
window.EDUSKILLS_CATALOG = ${JSON.stringify(catalog, null, 2)};
window.EDUSKILLS_DRIVE_LINKS = ${JSON.stringify(driveLinks, null, 2)};
window.EDUSKILLS_BOOKS = ${JSON.stringify(BOOKS_DATABASE, null, 2)};
window.EDUSKILLS_DEEP_PROFILES = ${JSON.stringify(SKILL_DEEP_PROFILES, null, 2)};
window.EDUSKILLS_COMPETENCY_TIERS = ${JSON.stringify(COMPETENCY_TIERS, null, 2)};
window.EDUSKILLS_USAGE_CONTEXTS = ${JSON.stringify(USAGE_CONTEXTS, null, 2)};
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'skills-data.js'), jsBundle, 'utf-8');
  const webDir = path.join(__dirname, '..', 'web');
  if (fs.existsSync(webDir)) {
    fs.writeFileSync(path.join(webDir, 'skills-data.js'), jsBundle, 'utf-8');
  }

  if (!silent) {
    console.log('\n-------------------------------------------------------------');
    console.log(`  📊 KẾT QUẢ KIỂM ĐỊNH (UASS v2.0):`);
    console.log(`     - Tổng số skills:  ${report.totalScanned}`);
    console.log(`     - Đạt chuẩn 100%:  ${report.validCount}`);
    console.log(`     - Lỗi cần sửa:     ${report.errorCount}`);
    console.log(`     - Cảnh báo:        ${report.warningCount}`);
    console.log('-------------------------------------------------------------');
    console.log(`  💾 Đã biên dịch Catalog tại:     dataset/skills-catalog.json`);
    console.log(`  📦 Đã xuất Bundle Offline tại:   web/skills-data.js`);
    console.log(`  📋 Đã lưu Báo cáo kiểm định:    dataset/validation-report.json\n`);
  }

  return report;
}

if (require.main === module) {
  const report = runValidation();
  if (report.errorCount > 0) {
    process.exit(1);
  }
}

module.exports = { runValidation, scanSkills, parseFrontmatter };
