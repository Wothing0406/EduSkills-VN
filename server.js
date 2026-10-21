/**
 * EduSkills-VN Local Server (Node.js - v2.0.0 Universal Edition)
 * Máy chủ cục bộ phục vụ Web Hub Matcha Mèo Ú, API Dataset Kỹ Năng & Universal 7-Pillar Prompt / OCR Backend
 * Tác giả: Nguyễn Duy Quang | Hotline: 0795277227 | Email: poiairo4628@gmail.com
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { runValidation } = require('./scripts/validate-dataset');
const {
  scanImageOCR,
  processTextBySubject,
  getDefaultSampleProblem,
  generateIntentDrivenPrompt,
  SKILL_DEEP_PROFILES
} = require('./backend/ocr-engine');

let pdfParse = null;
try {
  pdfParse = require('pdf-parse');
} catch (e) {
  console.warn('⚠️ Ghi chú: pdf-parse chưa được nạp hoặc cần cài đặt qua npm install.');
}

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const WEB_DIR = path.join(ROOT_DIR, 'web');
const DATASET_DIR = path.join(ROOT_DIR, 'dataset');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.md': 'text/markdown; charset=utf-8'
};

// Đọc toàn bộ body của request (Hỗ trợ Base64 hình ảnh lên đến 25MB)
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 25 * 1024 * 1024) {
        reject(new Error('Payload quá lớn (Vượt quá 25MB)'));
      }
    });
    req.on('end', () => {
      try {
        const json = body ? JSON.parse(body) : {};
        resolve(json);
      } catch (err) {
        resolve({ rawBody: body });
      }
    });
    req.on('error', reject);
  });
}

// Tìm kiếm sách giáo khoa tham chiếu tương ứng trong database
function lookupBookReference(subject, grade) {
  const dbPath = path.join(DATASET_DIR, 'books-database.json');
  if (!fs.existsSync(dbPath)) return null;
  try {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    const subjectKey = subject || 'toan-thpt';
    const gradeKey = Number(grade) || 12;
    const subjectBooks = db[subjectKey] || db['toan-thpt'] || {};
    const books = (subjectBooks[gradeKey] && subjectBooks[gradeKey].length > 0)
      ? subjectBooks[gradeKey]
      : (subjectBooks[12] || (db['toan-thpt'] && db['toan-thpt'][12]) || []);
    return books.length > 0 ? books[0] : null;
  } catch (e) {
    return null;
  }
}

const server = http.createServer(async (req, res) => {
  // CORS Headers cho mọi yêu cầu
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // --- API 1: OCR & Multi-Domain Problem Parser Backend ---
  if (pathname === '/api/ocr' && req.method === 'POST') {
    try {
      const payload = await parseRequestBody(req);
      const {
        image,
        text,
        rawText,
        subject = 'toan-thpt',
        grade = 12,
        fileName = 'de-bai-tap.png',
        fileType = 'image/png',
        lang = 'vie+eng'
      } = payload;

      const validGrade = [10, 11, 12].includes(Number(grade)) ? Number(grade) : 12;
      const inputTxt = typeof text === 'string' ? text : (typeof rawText === 'string' ? rawText : '');
      let extractedRawText = inputTxt.trim();
      let ocrConfidence = 100;
      let isRealOcr = false;
      let scanDurationMs = 0;

      // Xử lý PDF nếu tải tệp PDF lên
      if (fileType === 'application/pdf' && image && pdfParse) {
        try {
          const base64Content = image.replace(/^data:application\/pdf;base64,/, '');
          const buffer = Buffer.from(base64Content, 'base64');
          const pdfData = await pdfParse(buffer, { max: 5 });
          if (pdfData && pdfData.text) {
            extractedRawText = pdfData.text.trim();
          }
        } catch (pdfErr) {
          console.warn('Lỗi đọc PDF:', pdfErr.message);
        }
      }

      // Quét chữ thực tế từ hình ảnh qua Tesseract AI Engine (tự động ưu tiên vie+eng hoặc fallback eng)
      if (!extractedRawText && image) {
        const startTime = Date.now();
        try {
          const scanRes = await scanImageOCR(image, lang);
          scanDurationMs = Date.now() - startTime;
          if (scanRes.rawText && scanRes.rawText.trim().length > 3) {
            extractedRawText = scanRes.rawText.trim();
            ocrConfidence = scanRes.confidence || 85;
            isRealOcr = true;
          }
        } catch (scanErr) {
          console.warn('Lỗi quét Tesseract:', scanErr.message);
        }
      }

      // Nếu là ảnh trống hoặc chưa quét ra chữ, áp dụng đề mẫu chuẩn theo từng skill trong 16 skills
      if (!extractedRawText) {
        extractedRawText = getDefaultSampleProblem(subject, validGrade);
      }

      // Phân tích định dạng theo từng môn học chuyên sâu
      const domainResult = processTextBySubject(extractedRawText, subject);
      const bookRef = lookupBookReference(subject, validGrade);
      const skillProfile = SKILL_DEEP_PROFILES[subject] || SKILL_DEEP_PROFILES['toan-thpt'];

      // Tạo Universal Meta-Prompt 7 Trụ Cột
      const intentPrompt = generateIntentDrivenPrompt({
        role: skillProfile.title,
        gradeLevel: validGrade,
        studentLevel: 'Khá - Giỏi (Mục tiêu 8.5+ THPT Quốc Gia)',
        currentStatus: 'Cần phân tích bản chất nguyên lý gốc, lời giải 4 tầng Socrates, giải mã ma trận bẫy và tự kiểm chứng CoVe',
        taskPrompt: 'Giải quyết bài tập / đề cương được cung cấp với độ chuẩn xác tuyệt đối',
        constraintsPrompt: 'Trình bày bằng LaTeX chuẩn ($...$), đơn vị hệ SI, danh pháp IUPAC tiếng Anh và cấu trúc 4 tầng Socrates',
        cognitiveOptions: { useCoT: true, useSocratic: true, useFewShot: true, useActiveRecall: true },
        bookObject: bookRef,
        verifiedContent: domainResult.formattedText,
        subject,
        competencyTier: payload.competencyTier || 'vd',
        usageContext: payload.usageContext || 'giai-de',
        exportMode: payload.exportMode || 'standard'
      });

      const responseData = {
        ocrEngine: isRealOcr
          ? 'Tesseract.js AI OCR Engine + EduSkills Universal Parser v2.0'
          : 'EduSkills Universal Multi-Domain Heuristic Parser v2.0',
        isRealOcr,
        ocrConfidence,
        scanDurationMs,
        fileName,
        subject,
        grade: validGrade,
        domainBadge: domainResult.domainBadge,
        rawText: extractedRawText,
        formattedText: domainResult.formattedText,
        bookReference: bookRef,
        intentDrivenPrompt: intentPrompt
      };

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({
        success: true,
        data: responseData,
        ...responseData
      }, null, 2));
    } catch (ocrErr) {
      console.error('OCR Error:', ocrErr);
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({
        success: false,
        error: { code: 'OCR_PROCESSING_ERROR', message: ocrErr.message }
      }));
    }
  }

  // --- API 2: Tạo Prompt Thông Minh 7 Trụ Cột (Universal Meta-Prompt Builder) ---
  if (pathname === '/api/generate-prompt' && req.method === 'POST') {
    try {
      const payload = await parseRequestBody(req);
      const {
        role,
        gradeLevel = 12,
        studentLevel,
        currentStatus,
        taskPrompt,
        constraintsPrompt,
        cognitiveOptions = {},
        bookObject,
        verifiedContent = '',
        subject = 'toan-thpt',
        competencyTier = 'vd',
        usageContext = 'giai-de',
        exportMode = 'standard'
      } = payload;

      const validGrade = [10, 11, 12].includes(Number(gradeLevel)) ? Number(gradeLevel) : 12;
      const resolvedBook = bookObject || lookupBookReference(subject, validGrade);

      const prompt = generateIntentDrivenPrompt({
        role,
        gradeLevel: validGrade,
        studentLevel,
        currentStatus,
        taskPrompt,
        constraintsPrompt,
        cognitiveOptions,
        bookObject: resolvedBook,
        verifiedContent,
        subject,
        competencyTier,
        usageContext,
        exportMode
      });

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({
        success: true,
        data: { prompt, subject, gradeLevel: validGrade, competencyTier, usageContext, exportMode, bookReference: resolvedBook },
        prompt,
        bookReference: resolvedBook
      }, null, 2));
    } catch (pErr) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({
        success: false,
        error: { code: 'PROMPT_GENERATION_ERROR', message: pErr.message }
      }));
    }
  }

  // --- API 3: Tiêu chuẩn Prompt ---
  if (pathname === '/api/prompt-standard') {
    const promptDocPath = path.join(ROOT_DIR, 'docs', 'Tieuchuanprompt.md');
    if (fs.existsSync(promptDocPath)) {
      const content = fs.readFileSync(promptDocPath, 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/markdown; charset=utf-8' });
      return res.end(content);
    }
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Prompt standard document not found' }
    }));
  }

  // --- API 4: Danh mục Kỹ Năng ---
  if (pathname === '/api/skills') {
    const catalogPath = path.join(DATASET_DIR, 'skills-catalog.json');
    if (!fs.existsSync(catalogPath)) {
      runValidation(true);
    }
    const data = fs.readFileSync(catalogPath, 'utf-8');
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(data);
  }

  if (pathname === '/api/skill-content') {
    const skillPath = parsedUrl.searchParams.get('path');
    if (skillPath) {
      const targetFile = path.resolve(ROOT_DIR, skillPath);
      if (targetFile.startsWith(ROOT_DIR) && fs.existsSync(targetFile)) {
        const content = fs.readFileSync(targetFile, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end(content);
      }
    }
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({
      success: false,
      error: { code: 'SKILL_NOT_FOUND', message: 'Skill file not found' }
    }));
  }

  // --- API 5: Kiểm định Dataset ---
  if (pathname === '/api/validate') {
    const report = runValidation(true);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({
      success: report.errorCount === 0,
      data: report,
      ...report
    }, null, 2));
  }

  // --- API 6: Link Google Drive ---
  if (pathname === '/api/drive-links') {
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
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify(driveLinks, null, 2));
  }

  // --- API 7: Thống kê Hệ Thống ---
  if (pathname === '/api/stats') {
    const reportPath = path.join(DATASET_DIR, 'validation-report.json');
    let report = {};
    if (fs.existsSync(reportPath)) {
      report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    }
    const stats = {
      project: 'EduSkills-VN Matcha Hub',
      version: '2.0.0',
      ecosystem: '100% Vendor-Agnostic & Self-Contained',
      theme: 'Matcha Mèo Ú Tối Giản',
      curriculum: 'Bộ SGK Thống Nhất Toàn Quốc 2026 & BGD 2025-2027 (QĐ 764/QĐ-BGDĐT)',
      totalSkills: report.validCount || 16,
      categories: 4,
      author: 'Nguyễn Duy Quang',
      hotline: '0795277227',
      email: 'poiairo4628@gmail.com',
      ocrEngine: 'Active (16 Skills Deep Profiles • Toán LaTeX • Vật lí SI • Hóa học IUPAC • CoVe Verified)',
      driveStorage: 'Google Drive Cloud Storage (3 khối lớp 10, 11, 12)'
    };
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({
      success: true,
      data: stats,
      ...stats
    }, null, 2));
  }

  // --- Unknown API Route Handler (404 JSON) ---
  if (pathname.startsWith('/api/')) {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({
      success: false,
      error: { code: 'ROUTE_NOT_FOUND', message: `Endpoint ${pathname} does not exist` }
    }));
  }

  // --- Static Files Serving ---
  if (pathname === '/' || pathname === '/index.html') {
    pathname = '/web/index.html';
  } else if (!pathname.startsWith('/web/') && !pathname.startsWith('/dataset/') && !pathname.startsWith('/skills/') && !pathname.startsWith('/docs/')) {
    pathname = '/web' + pathname;
  }

  const filePath = path.join(ROOT_DIR, pathname);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 Not Found: Tệp không tồn tại trên máy chủ EduSkills-VN.');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log('\n=============================================================');
    console.log('  🎓 EDUSKILLS-VN UNIVERSAL SERVER v2.0.0 ĐANG CHẠY!');
    console.log('=============================================================');
    console.log(`  🌐 Web Hub & Catalog:      http://localhost:${PORT}`);
    console.log(`  📸 API OCR & Multi-Parser: http://localhost:${PORT}/api/ocr`);
    console.log(`  🎯 API Tạo Prompt 7 Trụ:   http://localhost:${PORT}/api/generate-prompt`);
    console.log(`  📊 API Skills Dataset:     http://localhost:${PORT}/api/skills`);
    console.log(`  🧪 API Kiểm Định UASS:     http://localhost:${PORT}/api/validate`);
    console.log('-------------------------------------------------------------');
    console.log('  👨‍🏫 Tác giả & Hỗ trợ:      Nguyễn Duy Quang');
    console.log('  📞 Hotline / Zalo:         0795277227');
    console.log('  ✉️ Email:                  poiairo4628@gmail.com');
    console.log('=============================================================\n');
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const altPort = Number(PORT) + 1;
      console.log(`⚠️ Cổng ${PORT} đang bận, tự động chuyển sang cổng ${altPort}...`);
      server.listen(altPort);
    } else {
      console.error('Lỗi máy chủ:', err);
    }
  });
}

module.exports = { server, lookupBookReference };
