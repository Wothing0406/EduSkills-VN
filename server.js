/**
 * EduSkills-VN Local Server (Node.js)
 * Máy chủ cục bộ phục vụ Web Hub 3D & API Dataset Kỹ Năng
 * Tác giả: Nguyễn Duy Quang | Hotline: 0795277227 | Email: poiairo4628@gmail.com
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { runValidation } = require('./scripts/validate-dataset');

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

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // --- API Endpoints ---
  if (pathname === '/api/skills') {
    const catalogPath = path.join(DATASET_DIR, 'skills-catalog.json');
    if (!fs.existsSync(catalogPath)) {
      runValidation();
    }
    const data = fs.readFileSync(catalogPath, 'utf-8');
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(data);
  }

  if (pathname === '/api/skill-content') {
    const skillPath = parsedUrl.searchParams.get('path');
    if (skillPath) {
      const targetFile = path.resolve(ROOT_DIR, skillPath);
      // Đảm bảo an toàn không thoát khỏi ROOT_DIR
      if (targetFile.startsWith(ROOT_DIR) && fs.existsSync(targetFile)) {
        const content = fs.readFileSync(targetFile, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end(content);
      }
    }
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Skill file not found');
  }

  if (pathname === '/api/validate') {
    const report = runValidation();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify(report, null, 2));
  }

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

  if (pathname === '/api/stats') {
    const reportPath = path.join(DATASET_DIR, 'validation-report.json');
    let report = {};
    if (fs.existsSync(reportPath)) {
      report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    }
    const stats = {
      project: 'EduSkills-VN Matcha Hub',
      version: '0.1.2-beta',
      theme: 'Matcha Mèo Ú Tối Giản',
      curriculum: 'Bộ SGK Thống Nhất Toàn Quốc 2026 & BGD 2025-2027',
      totalSkills: report.validCount || 16,
      categories: 4,
      author: 'Nguyễn Duy Quang',
      hotline: '0795277227',
      email: 'poiairo4628@gmail.com',
      driveStorage: 'Google Drive Cloud Storage (3 khối lớp 10, 11, 12)'
    };
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify(stats, null, 2));
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

server.listen(PORT, () => {
  console.log('\n=============================================================');
  console.log('  🎓 EDUSKILLS-VN LOCAL NODE.JS SERVER ĐANG CHẠY!');
  console.log('=============================================================');
  console.log(`  🌐 Web Hub 3D & Catalog: http://localhost:${PORT}`);
  console.log(`  📊 API Skills Dataset:    http://localhost:${PORT}/api/skills`);
  console.log(`  🧪 API Kiểm Định:         http://localhost:${PORT}/api/validate`);
  console.log(`  📈 API Thống Kê:          http://localhost:${PORT}/api/stats`);
  console.log('-------------------------------------------------------------');
  console.log('  👨‍🏫 Tác giả & Hỗ trợ:     Nguyễn Duy Quang');
  console.log('  📞 Hotline / Zalo:        0795277227');
  console.log('  ✉️ Email:                 poiairo4628@gmail.com');
  console.log('=============================================================\n');
  console.log('  💡 Mẹo: Nhấn Ctrl + C để dừng máy chủ bất cứ lúc nào.\n');
});

// Xử lý lỗi cổng đã bị chiếm
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const altPort = Number(PORT) + 1;
    console.log(`⚠️ Cổng ${PORT} đang bận, tự động chuyển sang cổng ${altPort}...`);
    server.listen(altPort);
  } else {
    console.error('Lỗi máy chủ:', err);
  }
});
