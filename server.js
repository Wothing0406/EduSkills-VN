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

  if (pathname === '/api/validate') {
    const report = runValidation();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify(report, null, 2));
  }

  if (pathname === '/api/stats') {
    const reportPath = path.join(DATASET_DIR, 'validation-report.json');
    let report = {};
    if (fs.existsSync(reportPath)) {
      report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    }
    const stats = {
      project: 'EduSkills-VN',
      version: '0.1.0-beta',
      curriculum: 'Bộ SGK Thống Nhất Toàn Quốc 2026 & BGD 2025-2027',
      totalSkills: report.validCount || 16,
      categories: 4,
      author: 'Nguyễn Duy Quang',
      hotline: '0795277227',
      email: 'poiairo4628@gmail.com'
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
