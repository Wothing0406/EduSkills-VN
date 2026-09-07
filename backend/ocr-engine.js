/**
 * EduSkills-VN Smart OCR & Multi-Domain Educational Parser Engine
 * Hỗ trợ nhận diện đề thi, bóc tách công thức Toán, Vật lí, Hóa học IUPAC, Ngữ văn
 * Tác giả: Nguyễn Duy Quang | Hotline: 0795277227 | Email: poiairo4628@gmail.com
 */

const fs = require('fs');
const path = require('path');

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
  if (!text.includes('### I. PHẦN ĐỌC HIỂU')) {
    text = `### I. PHẦN ĐỌC HIỂU (4,0 điểm)\n\n**1. Ngữ liệu trích dẫn:**\n${text}\n\n**2. Hệ thống câu hỏi định hướng:**\n- **Câu 1 (Nhận biết):** Xác định thể thơ / phương thức biểu đạt chính.\n- **Câu 2 (Thông hiểu):** Chỉ ra và nêu tác dụng của biện pháp tu từ trong ngữ liệu.\n- **Câu 3 (Vận dụng):** Nêu thông điệp hoặc bài học sâu sắc nhất rút ra từ đoạn trích.\n\n### II. PHẦN LÀM VĂN (6,0 điểm)\n- **Câu 1 (2,0 điểm):** Viết đoạn văn nghị luận xã hội (khoảng 200 chữ) bàn về vấn đề đặt ra từ đoạn trích.\n- **Câu 2 (4,0 điểm):** Viết bài văn nghị luận phân tích giá trị tư tưởng và nghệ thuật của tác phẩm.`;
  }

  return text;
}

/**
 * Xử lý đa năng theo môn học được chọn
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
    case 'ngu-van-thpt':
      return {
        formattedText: formatLiteratureReading(rawText),
        domainBadge: '📖 Ngữ văn • Đọc Hiểu Ngoài SGK & Đoạn Văn 200 Chữ'
      };
    default:
      return {
        formattedText: formatMathToLatex(rawText),
        domainBadge: '📚 Đa Môn THPT • Chuẩn GDPT 2018'
      };
  }
}

/**
 * Bộ tạo Prompt Thông Minh Phân Chia Rõ Ràng:
 * 1. Mục tiêu (What it does)
 * 2. Nhận thức (What it understands)
 * 3. Dẫn chứng có chủ đích (Intentional citations)
 * 4. Ràng buộc & Định dạng (Output constraints)
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
  subject = 'toan-thpt'
}) {
  const grade = gradeLevel || 12;
  const bookTitle = bookObject ? bookObject.title : `Sách Giáo Khoa Lớp ${grade}`;
  const bookFile = bookObject ? bookObject.file : 'Tài liệu SGK chuẩn';
  const bookDrive = bookObject ? bookObject.drive : 'https://drive.google.com/drive/folders/1I3h4nfdJTO5KdPsD4UWYdYJlMXQL1YwD?usp=drive_link';

  let p = `# ==============================================================================\n`;
  p += `# 🍵 EDUSKILLS-VN INTENT-DRIVEN PROMPT (CHUẨN TIEUCHUANPROMPT.MD & BGD 2026)\n`;
  p += `# ==============================================================================\n\n`;

  // PHÂN KHU 1: MỤC TIÊU & NHIỆM VỤ THỰC THI
  p += `## 🎯 1. MỤC TIÊU & NHIỆM VỤ THỰC THI (WHAT THIS PROMPT DOES)\n`;
  p += `- **Vai trò sư phạm:** ${role || 'Chuyên gia Sư phạm THPT chuẩn Bộ Giáo dục & Đào tạo Việt Nam'}.\n`;
  p += `- **Nhiệm vụ cụ thể:** ${taskPrompt || 'Phân tích bản chất, giải chi tiết từng bước và chỉ ra các bẫy phòng thi'}.\n`;
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
  p += `- **Trình độ & Năng lực hiện tại:** "${studentLevel || 'Khá - Giỏi (Mục tiêu 8.5+ THPT Quốc Gia)'}".\n`;
  p += `- **Tình trạng nhận thức:** ${currentStatus || 'Nắm được lý thuyết nền tảng nhưng hay bị lừa bởi các bẫy trắc nghiệm phân hóa'}.\n`;
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

  // PHÂN KHU 5: NỘI DUNG ĐỀ BÀI ĐÃ ĐƯỢC KIỂM CHỨNG
  if (verifiedContent && verifiedContent.trim()) {
    p += `## 📝 5. NỘI DUNG ĐỀ BÀI / NGỮ LIỆU ĐÃ XÁC NHẬN KIỂM CHỨNG\n`;
    p += `\`\`\`text\n${verifiedContent.trim()}\n\`\`\`\n\n`;
    p += `👉 Bắt đầu phân tích và giải quyết bài toán theo đầy đủ 4 tầng sư phạm trên:`;
  }

  return p;
}

module.exports = {
  formatMathToLatex,
  formatPhysicsToSI,
  formatChemistryToIUPAC,
  formatLiteratureReading,
  processTextBySubject,
  generateIntentDrivenPrompt,
  IUPAC_DICTIONARY,
  SI_UNITS
};
