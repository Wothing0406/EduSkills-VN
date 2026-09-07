const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const pdfPath = path.join(__dirname, '..', 'sgk', 'PDF SGK Lớp 12 2026-2027', '12-sgk-toan-12-tap-mot.pdf');

async function test() {
  console.log('Đang đọc file:', pdfPath);
  const dataBuffer = fs.readFileSync(pdfPath);
  
  const data = await pdfParse(dataBuffer, {
    max: 10 // Đọc thử 10 trang đầu
  });

  console.log('Tổng số trang thực tế:', data.numpages);
  console.log('Thông tin tài liệu (Info):', data.info);
  console.log('--- 500 ký tự đầu tiên ---');
  console.log(data.text.substring(0, 500));
}

test().catch(console.error);
