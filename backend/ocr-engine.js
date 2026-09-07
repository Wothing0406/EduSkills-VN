/**
 * EduSkills-VN Smart OCR & Multi-Domain Educational Parser Engine
 * Hỗ trợ quét chữ thực tế từ hình ảnh (Tesseract AI OCR Engine)
 * Bóc tách công thức Toán LaTeX, Vật lí SI, Hóa học IUPAC, Ngữ văn
 * Tác giả: Nguyễn Duy Quang | Hotline: 0795277227 | Email: poiairo4628@gmail.com
 */

const fs = require('fs');
const path = require('path');
let Tesseract = null;

try {
  Tesseract = require('tesseract.js');
} catch (e) {
  console.warn('⚠️ Ghi chú: tesseract.js chưa được cài đặt, sẽ dùng heuristic OCR parser.');
}

// IUPAC Dictionary for High School Chemistry (GDPT 2018)
const IUPAC_DICTIONARY = [
  { vn: /axit\s+axetic/gi, iupac: 'ethanoic acid (acetic acid)' },
  { vn: /axit\s+formic/gi, iupac: 'methanoic acid (formic acid)' },
  { vn: /axit\s+sunfuric/gi, iupac: 'sulfuric acid (H2SO4)' },
  { vn: /axit\s+clohidric/gi, iupac: 'hydrochloric acid (HCl)' },
  { vn: /axit\s+nitric/gi, iupac: 'nitric acid (HNO3)' },
  { vn: /axit\s+photphoric/gi, iupac: 'phosphoric acid (H3PO4)' },
  { vn: /ancol\s+etylic/gi, iupac: 'ethanol (C2H5OH)' },
  { vn: /ancol\s+metylic/gi, iupac: 'methanol (CH3OH)' },
  { vn: /glucozo/gi, iupac: 'glucose (C6H12O6)' },
  { vn: /fructozo/gi, iupac: 'fructose (C6H12O6)' },
  { vn: /sacarozo/gi, iupac: 'sucrose (C12H22O11)' },
  { vn: /xenlulozo/gi, iupac: 'cellulose (C6H10O5)n' },
  { vn: /\bđồng\b/gi, iupac: 'copper (Cu)' },
  { vn: /\bsắt\b/gi, iupac: 'iron (Fe)' },
  { vn: /\bnhôm\b/gi, iupac: 'aluminium (Al)' },
  { vn: /\bchì\b/gi, iupac: 'lead (Pb)' },
  { vn: /\bthủy\s+ngân\b/gi, iupac: 'mercury (Hg)' },
  { vn: /\bnatri\b/gi, iupac: 'sodium (Na)' },
  { vn: /\bkali\b/gi, iupac: 'potassium (K)' },
  { vn: /\bcanxi\b/gi, iupac: 'calcium (Ca)' },
  { vn: /\bclo\b/gi, iupac: 'chlorine (Cl2)' },
  { vn: /\bnitơ\b/gi, iupac: 'nitrogen (N2)' },
  { vn: /\boxi\b/gi, iupac: 'oxygen (O2)' },
  { vn: /\bkhí\s+hiđro\b/gi, iupac: 'hydrogen gas (H2)' },
  { vn: /\bhiđro\b/gi, iupac: 'hydrogen (H)' }
];

// SI Units for Physics
const SI_UNITS = [
  { raw: /\b(m\/s2|m\/s\^2)\b/g, si: '$\\text{m/s}^2$' },
  { raw: /\b(m\/s)\b/g, si: '$\\text{m/s}$' },
  { raw: /\b(km\/h)\b/g, si: '$\\text{km/h}$' },
  { raw: /\b(kg\.m\/s)\b/g, si: '$\\text{kg}\\cdot\\text{m/s}$' },
  { raw: /\b(N\/m)\b/g, si: '$\\text{N/m}$' },
  { raw: /\b(J\/kg\.K)\b/g, si: '$\\text{J/(kg}\\cdot\\text{K)}$' },
  { raw: /\b(rad\/s)\b/g, si: '$\\text{rad/s}$' }
];

/**
 * 0. Quét chữ thực tế từ hình ảnh bằng Tesseract AI Engine
 */
async function scanImageOCR(imageSource, lang = 'eng') {
  if (!imageSource || !Tesseract) {
    return { rawText: '', confidence: 0 };
  }

  let bufferTarget = imageSource;
  if (typeof imageSource === 'string' && imageSource.startsWith('data:image/')) {
    const base64Data = imageSource.replace(/^data:image\/\w+;base64,/, '');
    bufferTarget = Buffer.from(base64Data, 'base64');
  }

  try {
    const result = await Tesseract.recognize(bufferTarget, lang, {
      errorHandler: e => console.warn('Tesseract notice:', e)
    });

    const text = result && result.data && result.data.text ? result.data.text.trim() : '';
    const confidence = result && result.data && result.data.confidence ? Math.round(result.data.confidence) : 0;

    return { rawText: text, confidence };
  } catch (err) {
    console.warn('Tesseract scan warning:', err.message);
    return { rawText: '', confidence: 0, error: err.message };
  }
}

/**
 * 1. Toán học: Chuẩn hóa công thức sang LaTeX
 */
function formatMathToLatex(rawText) {
  if (!rawText) return '';
  let text = rawText.trim();

  // Phân số dạng (a)/(b) hoặc a/b -> \frac{a}{b}
  text = text.replace(/\(([^)]+)\)\/\(([^)]+)\)/g, '\\frac{$1}{$2}');
  text = text.replace(/([a-zA-Z0-9_]+)\/([a-zA-Z0-9_]+)/g, '\\frac{$1}{$2}');

  // Số mũ
  text = text.replace(/\^([0-9a-zA-Z\+\-]+)/g, '^{$1}');

  // Căn bậc hai
  text = text.replace(/(?:sqrt|căn)\(([^)]+)\)/gi, '\\sqrt{$1}');
  text = text.replace(/(?:sqrt|căn)\s*([a-zA-Z0-9]+)/gi, '\\sqrt{$1}');

  // Giới hạn
  text = text.replace(/lim\s*x\s*->\s*(\+?oo|\+?inf)/gi, '\\lim_{x \\to +\\infty}');
  text = text.replace(/lim\s*x\s*->\s*(-oo|-inf)/gi, '\\lim_{x \\to -\\infty}');
  text = text.replace(/lim\s*x\s*->\s*([a-zA-Z0-9]+)/gi, '\\lim_{x \\to $1}');

  // Vector
  text = text.replace(/vec\(([a-zA-Z]+)\)/gi, '\\vec{$1}');

  // Tích phân
  text = text.replace(/int_([0-9a-zA-Z]+)\^([0-9a-zA-Z]+)/g, '\\int_{$1}^{$2}');

  // Kí tự đặc biệt
  text = text.replace(/\bDelta\b/g, '\\Delta');
  text = text.replace(/\balpha\b/g, '\\alpha');
  text = text.replace(/\bbeta\b/g, '\\beta');
  text = text.replace(/\bpi\b/g, '\\pi');

  // Phương án trắc nghiệm A, B, C, D
  text = text.replace(/([A-D])[\.\)]\s*/g, '\n**$1.** ');

  return text;
}

/**
 * 2. Vật lí: Chuẩn hóa đơn vị SI, đại lượng & chu trình
 */
function formatPhysicsToSI(rawText) {
  if (!rawText) return '';
  let text = rawText.trim();

  // Chuẩn hóa đơn vị SI
  SI_UNITS.forEach(item => {
    text = text.replace(item.raw, item.si);
  });

  // Ký hiệu nhiệt độ Kelvin
  text = text.replace(/([0-9]+)\s*K\b/g, '$1\\text{ K}');
  text = text.replace(/([0-9]+)\s*oC\b/gi, '$1^\\circ\\text{C}');
  text = text.replace(/([0-9]+)\s*Pa\b/g, '$1\\text{ Pa}');
  text = text.replace(/([0-9]+)\s*atm\b/g, '$1\\text{ atm}');
  text = text.replace(/([0-9]+)\s*N\b/g, '$1\\text{ N}');
  text = text.replace(/([0-9]+)\s*J\b/g, '$1\\text{ J}');

  // Phương án trắc nghiệm
  text = text.replace(/([A-D])[\.\)]\s*/g, '\n**$1.** ');

  return text;
}

/**
 * 3. Hóa học: Chuyển đổi danh pháp 100% IUPAC tiếng Anh & định dạng phản ứng
 */
function formatChemistryToIUPAC(rawText) {
  if (!rawText) return '';
  let text = rawText.trim();

  // Thay thế tên thông thường bằng danh pháp IUPAC chuẩn SGK mới
  IUPAC_DICTIONARY.forEach(item => {
    text = text.replace(item.vn, item.iupac);
  });

  // Định dạng mũi tên phản ứng hóa học
  text = text.replace(/->|-->/g, ' $\\rightarrow$ ');
  text = text.replace(/<->|<=>/g, ' $\\rightleftharpoons$ ');

  // Định dạng biến thiên Enthalpy
  text = text.replace(/Delta\s*r\s*H\s*0\s*298/gi, '$\\Delta_r H^0_{298}$');
  text = text.replace(/Delta\s*f\s*H\s*0\s*298/gi, '$\\Delta_f H^0_{298}$');

  // Phương án trắc nghiệm
  text = text.replace(/([A-D])[\.\)]\s*/g, '\n**$1.** ');

  return text;
}

/**
 * 4. Ngữ văn: Bóc tách cấu trúc Đọc hiểu & Đoạn văn nghị luận 200 chữ
 */
function formatLiteratureReading(rawText) {
  if (!rawText) return '';
  let text = rawText.trim();

  // Đảm bảo cấu trúc rõ ràng giữa Ngữ liệu và Hệ thống câu hỏi
  if (!text.includes('PHẦN ĐỌC HIỂU')) {
    text = `### I. PHẦN ĐỌC HIỂU (4,0 điểm)\n\n**1. Ngữ liệu trích dẫn:**\n${text}\n\n**2. Hệ thống câu hỏi định hướng:**\n- **Câu 1 (Nhận biết):** Xác định thể thơ / phương thức biểu đạt chính.\n- **Câu 2 (Thông hiểu):** Chỉ ra và nêu tác dụng của biện pháp tu từ trong ngữ liệu.\n- **Câu 3 (Vận dụng):** Nêu thông điệp hoặc bài học sâu sắc nhất rút ra từ đoạn trích.\n\n### II. PHẦN LÀM VĂN (6,0 điểm)\n- **Câu 1 (2,0 điểm):** Viết đoạn văn nghị luận xã hội (khoảng 200 chữ) bàn về vấn đề đặt ra từ đoạn trích.\n- **Câu 2 (4,0 điểm):** Viết bài văn nghị luận phân tích giá trị tư tưởng và nghệ thuật của tác phẩm.`;
  }

  return text;
}

/**
 * 5. Sinh học: Chuẩn hóa công thức di truyền, tế bào & barem BGD
 */
function formatBiologyToGenetics(rawText) {
  if (!rawText) return '';
  let text = rawText.trim();
  text = text.replace(/([0-9]+)\s*Angstrom\b/gi, '$1\\text{ \\AA}');
  text = text.replace(/([0-9]+)\s*nm\b/gi, '$1\\text{ nm}');
  text = text.replace(/\bDelta\s*L\b/gi, '$\\Delta L$');
  text = text.replace(/([A-D])[\.\)]\s*/g, '\n**$1.** ');
  return text;
}

/**
 * 6. Tin học: Chuẩn hóa khối mã nguồn và độ phức tạp thuật toán
 */
function formatInformaticsCode(rawText) {
  if (!rawText) return '';
  let text = rawText.trim();
  text = text.replace(/\bO\(n\^2\)/g, '$O(n^2)$');
  text = text.replace(/\bO\(n\s*log\s*n\)/gi, '$O(n \\log n)$');
  text = text.replace(/\bO\(log\s*n\)/gi, '$O(\\log n)$');
  text = text.replace(/\bO\(n\)/g, '$O(n)$');
  text = text.replace(/\bO\(1\)/g, '$O(1)$');
  return text;
}

/**
 * Xử lý đa năng theo kỹ năng/môn học chuyên biệt (16 kỹ năng chuẩn BGD 2026)
 */
function processTextBySubject(rawText, subject) {
  switch (subject) {
    case 'toan-thpt':
      return {
        formattedText: formatMathToLatex(rawText),
        domainBadge: '📐 Toán học • LaTeX Chuẩn Quốc Tế'
      };
    case 'vat-li-thpt':
      return {
        formattedText: formatPhysicsToSI(rawText),
        domainBadge: '⚡ Vật lí • Đơn Vị SI & Định Luật Bảo Toàn'
      };
    case 'hoa-hoc-thpt':
      return {
        formattedText: formatChemistryToIUPAC(rawText),
        domainBadge: '🧪 Hóa học • 100% IUPAC Tiếng Anh & Enthalpy'
      };
    case 'sinh-hoc-thpt':
      return {
        formattedText: formatBiologyToGenetics(rawText),
        domainBadge: '🧬 Sinh học • Di Truyền Phân Tử & Barem BGD'
      };
    case 'ngu-van-thpt':
      return {
        formattedText: formatLiteratureReading(rawText),
        domainBadge: '📖 Ngữ văn • Đọc Hiểu Ngoài SGK & Đoạn Văn 200 Chữ'
      };
    case 'tieng-anh-thpt':
      return {
        formattedText: rawText.trim(),
        domainBadge: '🌐 Tiếng Anh • BGD Reading & Grammar B2-C1'
      };
    case 'lich-su-thpt':
      return {
        formattedText: rawText.trim(),
        domainBadge: '📜 Lịch Sử • Mốc Thời Gian & Lập Luận Kháng Chiến'
      };
    case 'dia-li-thpt':
      return {
        formattedText: rawText.trim(),
        domainBadge: '🌍 Địa Lí • Phân Tích Biểu Đồ & Atlat Địa Lí'
      };
    case 'ktpl-thpt':
      return {
        formattedText: rawText.trim(),
        domainBadge: '⚖️ KTPL • Tình Huống Pháp Luật & Kinh Tế Thị Trường'
      };
    case 'tin-hoc-thpt':
      return {
        formattedText: formatInformaticsCode(rawText),
        domainBadge: '💻 Tin Học • Thuật Toán & Mã Nguồn Python'
      };
    case 'cong-nghe-thpt':
      return {
        formattedText: rawText.trim(),
        domainBadge: '⚙️ Công Nghệ • Kỹ Thuật Mạch Điện & Nông Nghiệp 4.0'
      };
    case 'giai-chi-tiet':
      return {
        formattedText: formatMathToLatex(rawText),
        domainBadge: '🧩 Giải Chi Tiết • Sư Phạm Đa Tầng Socrates'
      };
    case 'tao-quiz-bgd':
      return {
        formattedText: rawText.trim(),
        domainBadge: '🎯 Khảo Thí BGD • Ma Trận Đề Thi 3 Phần QĐ 764'
      };
    case 'slide-thuyet-trinh':
      return {
        formattedText: rawText.trim(),
        domainBadge: '📊 Slide Marp • Kiến Trúc Trực Quan 16:9'
      };
    case 'tomtat-mindmap':
      return {
        formattedText: rawText.trim(),
        domainBadge: '🧠 Mindmap Mermaid • Siêu Trí Nhớ Cornell'
      };
    case 'luan-an-nghiencuu':
      return {
        formattedText: rawText.trim(),
        domainBadge: '🔬 Nghiên Cứu ViSEF • Đề Cương Khoa Học Kỹ Thuật'
      };
    default:
      return {
        formattedText: formatMathToLatex(rawText),
        domainBadge: '📚 Đa Môn THPT • Chuẩn GDPT 2018'
      };
  }
}

const COMPETENCY_TIERS = {
  'nb-th': {
    id: 'nb-th',
    name: 'Nhận Biết & Thông Hiểu',
    scoreTarget: 'Điểm 5.0 - 7.0 (Nền Tảng)',
    badge: 'Cấp độ 1 • Cơ bản',
    color: '#2E7D32',
    bg: '#E8F5E9',
    description: 'Nắm chắc định nghĩa, công thức SGK chuẩn, giải thích hiện tượng và chống điểm liệt.'
  },
  'vd': {
    id: 'vd',
    name: 'Vận Dụng Tiêu Chuẩn',
    scoreTarget: 'Điểm 7.0 - 8.5 (Chuẩn BGD)',
    badge: 'Cấp độ 2 • Vận dụng',
    color: '#1565C0',
    bg: '#E3F2FD',
    description: 'Vận dụng định luật, giải bài toán phối hợp, xử lý câu Đúng/Sai và Trả lời ngắn.'
  },
  'vdc': {
    id: 'vdc',
    name: 'Vận Dụng Cao - Phân Hóa',
    scoreTarget: 'Điểm 8.5 - 9.5+ (Phân Loại)',
    badge: 'Cấp độ 3 • Phân hóa',
    color: '#E65100',
    bg: '#FFF3E0',
    description: 'Bài toán thực tế, liên môn, đồ thị phức hợp, cực trị Oxyz và bài phân loại thí sinh giỏi.'
  },
  'hsg': {
    id: 'hsg',
    name: 'Bồi Dưỡng HSG & ĐGNL',
    scoreTarget: 'Olympic & ĐHQG/ĐHBK (Đỉnh Cao)',
    badge: 'Cấp độ 4 • Đỉnh cao',
    color: '#6A1B9A',
    bg: '#F3E5F5',
    description: 'Tư duy logic mô hình hóa bậc cao, đề thi ĐGNL ĐHQG/ĐHBK và thi Học sinh giỏi các cấp.'
  }
};

const USAGE_CONTEXTS = {
  'giai-de': {
    id: 'giai-de',
    title: 'Giải Đề Chuẩn BGD 2026',
    icon: 'fa-solid fa-bullseye',
    tagline: '3 Phần Chuẩn QĐ 764/QĐ-BGDĐT',
    description: 'Giải chi tiết theo cấu trúc 3 phần: Trắc nghiệm 4 lựa chọn, Đúng/Sai 4 ý lũy tiến và Trả lời ngắn điền số.'
  },
  'socrates': {
    id: 'socrates',
    title: 'Gia Sư Sư Phạm Socrates',
    icon: 'fa-solid fa-lightbulb',
    tagline: 'Khơi Mở Tư Duy, Không Lộ Đáp Số',
    description: 'Dẫn dắt bằng chuỗi 3-4 câu hỏi phản xạ gợi mở, buộc người học tự tư duy tìm ra lời giải.'
  },
  'chua-bay': {
    id: 'chua-bay',
    title: 'Giải Mã Bẫy Phòng Thi',
    icon: 'fa-solid fa-triangle-exclamation',
    tagline: '3 Sai Lầm Kinh Điển & Mẹo Né Bẫy',
    description: 'Mổ xẻ cạm bẫy tâm lý, sai thứ nguyên, quên điều kiện xác định và lỗi suy luận thường gặp.'
  },
  'soan-de': {
    id: 'soan-de',
    title: 'Soạn Ma Trận & Đề Tương Tự',
    icon: 'fa-solid fa-pen-ruler',
    tagline: 'Khảo Thí & Đề Kiểm Tra Tương Đương',
    description: 'Thiết kế 1 đề kiểm tra tương đương cùng cấp độ nhận thức kèm ma trận và hướng dẫn chấm chi tiết.'
  },
  'on-cap-toc': {
    id: 'on-cap-toc',
    title: 'Ôn Cấp Tốc 60s & Mindmap',
    icon: 'fa-solid fa-bolt-lightning',
    tagline: 'Mermaid Mindmap & 5 Khóa Cốt Lõi',
    description: 'Tóm lược siêu tốc toàn bộ kiến thức trọng tâm bằng sơ đồ tư duy Mermaid Cornell và bảng công thức 60 giây.'
  }
};

/**
 * Bộ tạo Prompt Thông Minh Phân Chia Rõ Ràng & Đa Chế Độ:
 * - standard: 5 khung chuẩn Tieuchuanprompt.md cho Chat Web
 * - system-prompt: Chuẩn XML / Markdown cho AI Agent (Claude / Gemini / GPT-4o)
 * - agent-cli: Lệnh nạp CLI / Terminal Loader cho Antigravity SDK & Claude Code
 */
function generateIntentDrivenPrompt({
  role,
  gradeLevel,
  studentLevel,
  currentStatus,
  taskPrompt,
  constraintsPrompt,
  cognitiveOptions = {},
  bookObject = null,
  verifiedContent = '',
  subject = 'toan-thpt',
  competencyTier = 'vd',
  usageContext = 'giai-de',
  exportMode = 'standard'
}) {
  const grade = gradeLevel || 12;
  const tierObj = COMPETENCY_TIERS[competencyTier] || COMPETENCY_TIERS['vd'];
  const contextObj = USAGE_CONTEXTS[usageContext] || USAGE_CONTEXTS['giai-de'];

  const bookTitle = bookObject ? bookObject.title : `Sách Giáo Khoa Lớp ${grade}`;
  const bookFile = bookObject ? bookObject.file : 'Tài liệu SGK chuẩn';
  const bookDrive = bookObject ? bookObject.drive : 'https://drive.google.com/drive/folders/1I3h4nfdJTO5KdPsD4UWYdYJlMXQL1YwD?usp=drive_link';

  // --- CHẾ ĐỘ 2: SYSTEM PROMPT CHO AI AGENT (XML / STRUCTURED FORMAT) ---
  if (exportMode === 'system-prompt') {
    let xml = `<system_instruction version="0.1.3-beta" framework="EduSkills-VN" standard="GDPT-2018">\n`;
    xml += `  <identity>\n`;
    xml += `    <role>${role || 'Chuyên gia Sư phạm THPT chuẩn Bộ Giáo dục & Đào tạo Việt Nam'}</role>\n`;
    xml += `    <subject_skill>@${subject}</subject_skill>\n`;
    xml += `    <grade_level>Lớp ${grade}</grade_level>\n`;
    xml += `    <author_attribution>Dự án EduSkills-VN | Chủ nhiệm: Nguyễn Duy Quang (0795277227)</author_attribution>\n`;
    xml += `  </identity>\n\n`;

    xml += `  <pedagogical_competency_tier level="${tierObj.id}">\n`;
    xml += `    <tier_name>${tierObj.name}</tier_name>\n`;
    xml += `    <target_score>${tierObj.scoreTarget}</target_score>\n`;
    xml += `    <pedagogical_mandate>${tierObj.description}</pedagogical_mandate>\n`;
    xml += `  </pedagogical_competency_tier>\n\n`;

    xml += `  <operational_context scenario="${contextObj.id}">\n`;
    xml += `    <scenario_title>${contextObj.title}</scenario_title>\n`;
    xml += `    <methodology_tagline>${contextObj.tagline}</methodology_tagline>\n`;
    xml += `    <instruction_mandate>${contextObj.description}</instruction_mandate>\n`;
    xml += `    <scaffolding_rule>Tuân thủ cấu trúc phân tích 4 tầng Socrates và barem Quyết định 764/QĐ-BGDĐT.</scaffolding_rule>\n`;
    xml += `  </operational_context>\n\n`;

    xml += `  <grounding_knowledge_base>\n`;
    xml += `    <mandate>TUYỆT ĐỐI CẤM BỊA ĐẶT CÔNG THỨC NGOÀI CHƯƠNG TRÌNH HOẶC DÙNG MẸO PHẢN SƯ PHẠM</mandate>\n`;
    xml += `    <target_textbook>${bookTitle}</target_textbook>\n`;
    xml += `    <pdf_reference_code>${bookFile}</pdf_reference_code>\n`;
    xml += `    <cloud_drive_repository>${bookDrive}</cloud_drive_repository>\n`;
    xml += `    <citation_rule>Mọi công thức, định lý, tên bài học phải được đối chiếu trực tiếp từ cuốn SGK trên.</citation_rule>\n`;
    xml += `  </grounding_knowledge_base>\n\n`;

    xml += `  <execution_constraints>\n`;
    xml += `    <constraints>${constraintsPrompt || '100% công thức viết bằng LaTeX đặt trong cặp dấu $...$'}</constraints>\n`;
    xml += `    <latex_rule>Mọi biểu thức toán/lý phải bọc trong LaTeX chuẩn: $...$ hoặc $$...$$</latex_rule>\n`;
    xml += `    <chemistry_rule>Nếu là môn Hóa: bắt buộc danh pháp IUPAC 100% tiếng Anh</chemistry_rule>\n`;
    xml += `    <methodology>Chain-of-Thought từng bước, gợi mở Socratic khơi dậy phản biện, chống ảo giác 100%</methodology>\n`;
    xml += `  </execution_constraints>\n\n`;

    xml += `  <task_instruction>\n`;
    xml += `    <task>${taskPrompt || 'Phân tích bản chất, giải chi tiết từng bước và chỉ ra các bẫy phòng thi'}</task>\n`;
    if (verifiedContent && verifiedContent.trim()) {
      xml += `    <verified_problem_input>\n${verifiedContent.trim()}\n    </verified_problem_input>\n`;
    } else {
      xml += `    <mode>Pure System Directive: Hãy tự động khởi tạo 01 đề bài mẫu chuẩn ở cấp độ "${tierObj.name}" theo SGK "${bookTitle}" và triển khai giảng dạy theo ngữ cảnh "${contextObj.title}".</mode>\n`;
    }
    xml += `  </task_instruction>\n`;
    xml += `</system_instruction>`;
    return xml;
  }

  // --- CHẾ ĐỘ 3: LỆNH NẠP CLI / TERMINAL CHO AI AGENT ---
  if (exportMode === 'agent-cli') {
    let cli = `# ==============================================================================\n`;
    cli += `# 💻 BỘ NẠP KỸ NĂNG CHO AI AGENT (CLI / TERMINAL / ANTIGRAVITY SDK / CLAUDE CODE)\n`;
    cli += `# Phiên bản: v0.1.3-beta • Dự án EduSkills-VN (Chủ nhiệm: Nguyễn Duy Quang)\n`;
    cli += `# ==============================================================================\n\n`;

    cli += `# 1. Nạp kỹ năng vào Google Antigravity SDK & Gemini CLI:\n`;
    cli += `gemini run --system-skill "skills/${subject}/SKILL.md" \\\n`;
    cli += `  --grade ${grade} \\\n`;
    cli += `  --tier "${tierObj.id}" \\\n`;
    cli += `  --context "${contextObj.id}" \\\n`;
    cli += `  --book "${bookFile}"`;
    if (verifiedContent && verifiedContent.trim()) {
      const cleanSnippet = verifiedContent.trim().replace(/\r?\n/g, ' ').slice(0, 100);
      cli += ` \\\n  --input "${cleanSnippet}..."\n\n`;
    } else {
      cli += `\n\n`;
    }

    cli += `# 2. Nạp kỹ năng vào Claude Code CLI:\n`;
    cli += `/skill load skills/${subject}/SKILL.md\n\n`;

    cli += `# 3. Nạp kỹ năng qua EduSkills-VN Package Manager (Node.js / NPX):\n`;
    cli += `npx eduskills-vn load ${subject} --grade ${grade} --tier ${tierObj.id} --context ${contextObj.id}\n\n`;

    cli += `# 4. Gọi API Backend EduSkills-VN trực tiếp từ Terminal (Port 3000):\n`;
    cli += `curl -X POST http://localhost:3000/api/generate-prompt \\\n`;
    cli += `  -H "Content-Type: application/json" \\\n`;
    cli += `  -d '{\n`;
    cli += `    "subject": "${subject}",\n`;
    cli += `    "gradeLevel": ${grade},\n`;
    cli += `    "competencyTier": "${tierObj.id}",\n`;
    cli += `    "usageContext": "${contextObj.id}",\n`;
    cli += `    "exportMode": "system-prompt",\n`;
    cli += `    "verifiedContent": ${JSON.stringify(verifiedContent.trim())}\n`;
    cli += `  }'\n`;
    return cli;
  }

  // --- CHẾ ĐỘ 1 (MẶC ĐỊNH): 5 KHUNG CHUẨN TIEUCHUANPROMPT.MD CHO CHAT WEB ---
  let p = `# ==============================================================================\n`;
  p += `# 🍵 EDUSKILLS-VN INTENT-DRIVEN PROMPT (CHUẨN TIEUCHUANPROMPT.MD & BGD 2026)\n`;
  p += `# Phiên bản: v0.1.3-beta • Khối Lớp: ${grade} • Môn: ${subject}\n`;
  p += `# ==============================================================================\n\n`;

  // PHÂN KHU 1: MỤC TIÊU & NHIỆM VỤ THỰC THI
  p += `## 🎯 1. MỤC TIÊU & NHIỆM VỤ THỰC THI (WHAT THIS PROMPT DOES)\n`;
  p += `- **Vai trò sư phạm:** ${role || 'Chuyên gia Sư phạm THPT chuẩn Bộ Giáo dục & Đào tạo Việt Nam'}.\n`;
  p += `- **Nhiệm vụ cụ thể:** ${taskPrompt || 'Phân tích bản chất, giải chi tiết từng bước và chỉ ra các bẫy phòng thi'}.\n`;
  p += `- **Ngữ cảnh sử dụng sư phạm:** ${contextObj.title} (${contextObj.tagline}).\n`;
  p += `  * *Định hướng sư phạm:* ${contextObj.description}\n`;
  p += `- **Hành động sư phạm bắt buộc:**\n`;
  if (cognitiveOptions.useCoT) {
    p += `  * [Chain-of-Thought]: Giải thích bản chất từng bước (step-by-step), chứng minh tường minh mọi phép suy luận trước khi đưa ra kết luận.\n`;
  }
  if (cognitiveOptions.useSocratic) {
    p += `  * [Socratic Method]: Cung cấp gợi ý tư duy khơi mở trước, không được phép đưa ngay đáp số thô làm mất đi khả năng tự học của học sinh.\n`;
  }
  if (cognitiveOptions.useFewShot) {
    p += `  * [Few-shot]: Kèm theo 1 ví dụ minh họa tương đương đạt chuẩn mực sư phạm cao nhất.\n`;
  }
  if (cognitiveOptions.useActiveRecall) {
    p += `  * [Active Recall]: Ở cuối bài giải, BẮT BUỘC đặt ra 1 câu hỏi kiểm tra tư duy phản biện hoặc 1 bài toán tương tự để học sinh tự làm.\n`;
  }
  p += `\n`;

  // PHÂN KHU 2: CƠ SỞ NHẬN THỨC & BỐI CẢNH HỌC TẬP
  p += `## 🧠 2. CƠ SỞ NHẬN THỨC & BỐI CẢNH (WHAT THE AI MUST UNDERSTAND)\n`;
  p += `- **Đối tượng người học:** Học sinh Lớp ${grade}, theo học Chương trình Giáo dục Phổ thông mới (GDPT 2018).\n`;
  p += `- **Phân cấp bậc năng lực nhận thức:** ${tierObj.name} [${tierObj.badge}].\n`;
  p += `  * *Mục tiêu đánh giá:* ${tierObj.scoreTarget}\n`;
  p += `  * *Yêu cầu năng lực:* ${tierObj.description}\n`;
  p += `- **Trình độ người học thiết lập:** "${studentLevel || tierObj.scoreTarget}".\n`;
  p += `- **Tình trạng nhận thức hiện thời:** ${currentStatus || 'Nắm được lý thuyết nền tảng nhưng hay bị lừa bởi các bẫy trắc nghiệm phân hóa'}.\n`;
  p += `- **Bản chất khoa học & Bẫy tư duy cần cảnh báo:**\n`;
  if (subject === 'toan-thpt') {
    p += `  * Quên điều kiện xác định của hàm số/phương trình trước khi biến đổi.\n`;
    p += `  * Nhầm lẫn giữa cực trị của hàm số, giá trị cực trị và điểm cực trị của đồ thị hàm số.\n`;
    p += `  * Nhầm dấu khi tính tích phân từng phần hoặc nhầm hệ số góc tiệm cận xiên $y = ax + b$.\n`;
  } else if (subject === 'vat-li-thpt') {
    p += `  * Không đổi đơn vị sang hệ chuẩn SI (ví dụ: nhiệt độ $^\\circ C$ chưa đổi sang Kelvin $K = T(^\\circ C) + 273$).\n`;
    p += `  * Nhầm dấu của công $A$ và nhiệt lượng $Q$ trong định luật 1 Nhiệt động lực học ($\\Delta U = A + Q$).\n`;
  } else if (subject === 'hoa-hoc-thpt') {
    p += `  * Dùng sai danh pháp cũ (bắt buộc dùng 100% IUPAC tiếng Anh: acetic acid, copper(II) sulfate...).\n`;
    p += `  * Quên cân bằng số electron trao đổi hoặc nhầm dấu của biến thiên Enthalpy $\\Delta_r H^0_{298}$ (tỏa nhiệt $< 0$, thu nhiệt $> 0$).\n`;
  } else if (subject === 'ngu-van-thpt') {
    p += `  * Viết đoạn văn 200 chữ bị lan man, thiếu dẫn chứng thực tế hoặc vi phạm dung lượng quy định.\n`;
    p += `  * Diễn xuôi lại thơ thay vì phân tích giá trị biểu đạt của hình ảnh và biện pháp tu từ.\n`;
  }
  p += `\n`;

  // PHÂN KHU 3: DẪN CHỨNG & CHỈ DẪN CÓ CHỦ ĐÍCH
  p += `## 📖 3. DẪN CHỨNG & CHỈ DẪN CÓ CHỦ ĐÍCH (INTENTIONAL GROUNDING & CITATIONS)\n`;
  p += `- **Sách Giáo Khoa chỉ định:** ${bookTitle}\n`;
  p += `- **Mã File PDF Gốc tham chiếu:** \`${bookFile}\`\n`;
  p += `- **Thư mục Google Drive trực tiếp:** ${bookDrive}\n`;
  p += `- **CHỈ DẪN BẮT BUỘC ĐỐI SOÁT:**\n`;
  p += `  1. Mọi công thức, định lý, định luật và phương pháp giải ĐỀU PHẢI TRÍCH DẪN VÀ ĐỐI CHIẾU TRỰC TIẾP từ cuốn sách giáo khoa trên.\n`;
  p += `  2. TUYỆT ĐỐI CẤM sử dụng các công thức ngoài chương trình hoặc các thuật toán mẹo làm mất đi bản chất khoa học.\n`;
  p += `  3. Hãy chỉ rõ tên chương/bài học cụ thể trong SGK để học sinh có thể mở sách tra cứu lại ngay lập tức.\n\n`;

  // PHÂN KHU 4: RÀNG BUỘC PHẠM VI & ĐỊNH DẠNG ĐẦU RA
  p += `## ⚡ 4. RÀNG BUỘC KỸ THUẬT & ĐỊNH DẠNG ĐẦU RA (OUTPUT CONSTRAINTS & FORMAT)\n`;
  p += `- ${constraintsPrompt || '100% công thức viết bằng LaTeX đặt trong cặp dấu $...$'}.\n`;
  p += `- Tuân thủ nghiêm ngặt Barem điểm lũy tiến và định dạng đề thi 3 phần của Bộ GD&ĐT (Quyết định 764/QĐ-BGDĐT).\n`;
  p += `- Cấu trúc trả lời 4 tầng Socrates:\n`;
  p += `  * **Tầng 1:** Gợi Mở Tư Duy Socrates (Socratic Clue - Không lộ đáp số).\n`;
  p += `  * **Tầng 2:** Bản Chất Lý Thuyết & Chiến Thuật Tiếp Cận Tối Ưu.\n`;
  p += `  * **Tầng 3:** Lời Giải Chi Tiết Từng Bước (Full Step-by-Step, có lập luận cho từng phép biến đổi).\n`;
  p += `  * **Tầng 4:** Giải Mã Bẫy Phòng Thi & 1 Bài Tập Tự Luyện Tương Tự.\n\n`;

  // PHÂN KHU 5: NỘI DUNG ĐỀ BÀI ĐÃ ĐƯỢC KIỂM CHỨNG HOẶC CHẾ ĐỘ SƯ PHẠM THUẦN
  if (verifiedContent && verifiedContent.trim()) {
    p += `## 📝 5. NỘI DUNG ĐỀ BÀI / NGỮ LIỆU ĐÃ XÁC NHẬN KIỂM CHỨNG\n`;
    p += `\`\`\`text\n${verifiedContent.trim()}\n\`\`\`\n\n`;
    p += `👉 Bắt đầu phân tích và giải quyết bài toán theo đầy đủ 4 tầng sư phạm trên:`;
  } else {
    p += `## 📝 5. CHẾ ĐỘ PROMPT SƯ PHẠM THUẦN (CHƯA ĐÍNH KÈM BÀI TẬP CỤ THỂ)\n`;
    p += `- **Tình trạng đính kèm:** Không có bài tập cụ thể trong ngữ cảnh này (người dùng đã gỡ bài tập hoặc muốn dùng Prompt Hệ Thống).\n`;
    p += `- **YÊU CẦU ĐỐI VỚI AI:**\n`;
    p += `  1. Tự động sinh ra 01 bài toán / câu hỏi mẫu điển hình trong chương trình SGK "${bookTitle}" ở Cấp độ nhận thức: "${tierObj.name}" (${tierObj.scoreTarget}).\n`;
    p += `  2. Đóng vai trò "${role || 'Chuyên gia Sư phạm'}" và triển khai giảng dạy bài toán mẫu đó theo đúng ngữ cảnh "${contextObj.title}" (${contextObj.tagline}).\n`;
    p += `  3. Hướng dẫn từng bước và đặt câu hỏi phản xạ để người học cùng tương tác.\n`;
  }

  return p;
}

module.exports = {
  scanImageOCR,
  formatMathToLatex,
  formatPhysicsToSI,
  formatChemistryToIUPAC,
  formatLiteratureReading,
  processTextBySubject,
  generateIntentDrivenPrompt,
  COMPETENCY_TIERS,
  USAGE_CONTEXTS,
  IUPAC_DICTIONARY,
  SI_UNITS
};
