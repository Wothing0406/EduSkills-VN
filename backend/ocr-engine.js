/**
 * EduSkills-VN Universal Multi-Domain Educational Parser & 7-Pillar Meta-Prompt Engine (v2.0.0)
 * Kiến trúc Độc lập Hệ sinh thái (100% Vendor-Agnostic & Self-Contained)
 * Hỗ trợ:
 *   - Quét chữ thực tế từ hình ảnh (Tesseract OCR song ngữ vie+eng với fallback an toàn)
 *   - Bóc tách thông minh Toán LaTeX (bảo vệ URL/ngày tháng/đơn vị), Vật lí SI, Hóa học IUPAC, Sinh học, Ngữ văn, Tin học, Địa lí, Lịch sử, KTPL, Tiếng Anh, Công nghệ
 *   - Ma trận Bẫy Nhận thức (Cognitive Trap Matrix), Dynamic Few-Shot Exemplars & Chain-of-Verification (CoVe) cho đủ 16/16 kỹ năng
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

// ============================================================================
// 1. TỪ ĐIỂN DANH PHÁP HÓA HỌC IUPAC (CHUẨN GDPT 2018 & BGD 2026)
// ============================================================================
const IUPAC_DICTIONARY = [
  { vn: /axit\s+axetic/gi, iupac: 'ethanoic acid (acetic acid, $CH_3COOH$)' },
  { vn: /axit\s+fomic|axit\s+formic/gi, iupac: 'methanoic acid (formic acid, $HCOOH$)' },
  { vn: /axit\s+sunfuric/gi, iupac: 'sulfuric acid ($H_2SO_4$)' },
  { vn: /axit\s+clohiđric|axit\s+clohidric/gi, iupac: 'hydrochloric acid ($HCl$)' },
  { vn: /axit\s+nitric/gi, iupac: 'nitric acid ($HNO_3$)' },
  { vn: /axit\s+photphoric/gi, iupac: 'phosphoric acid ($H_3PO_4$)' },
  { vn: /ancol\s+etylic|rượu\s+etylic/gi, iupac: 'ethanol ($C_2H_5OH$)' },
  { vn: /ancol\s+metylic|rượu\s+metylic/gi, iupac: 'methanol ($CH_3OH$)' },
  { vn: /glixerol|glixerin/gi, iupac: 'glycerol (propane-1,2,3-triol)' },
  { vn: /andehit\s+axetic|anđehit\s+axetic/gi, iupac: 'ethanal (acetaldehyde)' },
  { vn: /andehit\s+fomic|anđehit\s+fomic/gi, iupac: 'methanal (formaldehyde)' },
  { vn: /etyl\s+axetat/gi, iupac: 'ethyl ethanoate (ethyl acetate)' },
  { vn: /metyl\s+axetat/gi, iupac: 'methyl ethanoate (methyl acetate)' },
  { vn: /glucozơ|glucozo/gi, iupac: 'glucose ($C_6H_{12}O_6$)' },
  { vn: /fructozơ|fructozo/gi, iupac: 'fructose ($C_6H_{12}O_6$)' },
  { vn: /saccarozơ|sacarozo/gi, iupac: 'sucrose ($C_{12}H_{22}O_{11}$)' },
  { vn: /mantozơ|mantozo/gi, iupac: 'maltose ($C_{12}H_{22}O_{11}$)' },
  { vn: /xenlulozơ|xenlulozo/gi, iupac: 'cellulose ($(C_6H_{10}O_5)_n$)' },
  { vn: /(?<![\p{L}\p{N}_])(đồng\(II\)\s+sunfat)(?![\p{L}\p{N}_])/giu, iupac: 'copper(II) sulfate ($CuSO_4$)' },
  { vn: /(?<![\p{L}\p{N}_])(natri\s+hiđroxit|natri\s+hidroxit)(?![\p{L}\p{N}_])/giu, iupac: 'sodium hydroxide ($NaOH$)' },
  { vn: /(?<![\p{L}\p{N}_])(kali\s+hiđroxit|kali\s+hidroxit)(?![\p{L}\p{N}_])/giu, iupac: 'potassium hydroxide ($KOH$)' },
  { vn: /(?<![\p{L}\p{N}_])(canxi\s+cacbonat)(?![\p{L}\p{N}_])/giu, iupac: 'calcium carbonate ($CaCO_3$)' },
  { vn: /(?<![\p{L}\p{N}_])(đồng)(?![\p{L}\p{N}_])/giu, iupac: 'copper (Cu)' },
  { vn: /(?<![\p{L}\p{N}_])(sắt)(?![\p{L}\p{N}_])/giu, iupac: 'iron (Fe)' },
  { vn: /(?<![\p{L}\p{N}_])(nhôm)(?![\p{L}\p{N}_])/giu, iupac: 'aluminium (Al)' },
  { vn: /(?<![\p{L}\p{N}_])(kẽm)(?![\p{L}\p{N}_])/giu, iupac: 'zinc (Zn)' },
  { vn: /(?<![\p{L}\p{N}_])(bạc)(?![\p{L}\p{N}_])/giu, iupac: 'silver (Ag)' },
  { vn: /(?<![\p{L}\p{N}_])(chì)(?![\p{L}\p{N}_])/giu, iupac: 'lead (Pb)' },
  { vn: /(?<![\p{L}\p{N}_])(thủy\s+ngân)(?![\p{L}\p{N}_])/giu, iupac: 'mercury (Hg)' },
  { vn: /(?<![\p{L}\p{N}_])(natri)(?![\p{L}\p{N}_])/giu, iupac: 'sodium (Na)' },
  { vn: /(?<![\p{L}\p{N}_])(kali)(?![\p{L}\p{N}_])/giu, iupac: 'potassium (K)' },
  { vn: /(?<![\p{L}\p{N}_])(canxi)(?![\p{L}\p{N}_])/giu, iupac: 'calcium (Ca)' },
  { vn: /(?<![\p{L}\p{N}_])(magie)(?![\p{L}\p{N}_])/giu, iupac: 'magnesium (Mg)' },
  { vn: /(?<![\p{L}\p{N}_])(bari)(?![\p{L}\p{N}_])/giu, iupac: 'barium (Ba)' },
  { vn: /(?<![\p{L}\p{N}_])(clo)(?![\p{L}\p{N}_])/giu, iupac: 'chlorine ($Cl_2$)' },
  { vn: /(?<![\p{L}\p{N}_])(nitơ)(?![\p{L}\p{N}_])/giu, iupac: 'nitrogen ($N_2$)' },
  { vn: /(?<![\p{L}\p{N}_])(oxi)(?![\p{L}\p{N}_])/giu, iupac: 'oxygen ($O_2$)' },
  { vn: /(?<![\p{L}\p{N}_])(khí\s+hiđro|khí\s+hidro)(?![\p{L}\p{N}_])/giu, iupac: 'hydrogen gas ($H_2$)' },
  { vn: /(?<![\p{L}\p{N}_])(hiđro|hidro)(?![\p{L}\p{N}_])/giu, iupac: 'hydrogen (H)' }
];

// ============================================================================
// 2. ĐƠN VỊ HỆ SI CHUẨN CHO VẬT LÍ & KỸ THUẬT
// ============================================================================
const SI_UNITS = [
  { raw: /\b(m\/s2|m\/s\^2)\b/g, si: '$\\text{m/s}^2$' },
  { raw: /(?<!\\text\{)\b(m\/s)(?!2|\^2|\})\b/g, si: '$\\text{m/s}$' },
  { raw: /\b(km\/h)\b/g, si: '$\\text{km/h}$' },
  { raw: /\b(kg\.m\/s)\b/g, si: '$\\text{kg}\\cdot\\text{m/s}$' },
  { raw: /\b(N\/m)\b/g, si: '$\\text{N/m}$' },
  { raw: /\b(J\/kg\.K)\b/g, si: '$\\text{J/(kg}\\cdot\\text{K)}$' },
  { raw: /\b(rad\/s)\b/g, si: '$\\text{rad/s}$' },
  { raw: /\b(g\/mol)\b/g, si: '$\\text{g/mol}$' },
  { raw: /\b(mol\/l|mol\/L)\b/g, si: '$\\text{mol/L}$' }
];

// ============================================================================
// 3. CẤP ĐỘ NĂNG LỰC NHẬN THỨC & NGỮ CẢNH SƯ PHẠM
// ============================================================================
const COMPETENCY_TIERS = {
  'nb-th': {
    id: 'nb-th',
    name: 'Nhận Biết & Thông Hiểu',
    scoreTarget: 'Điểm 5.0 - 7.0 (Nền Tảng Vững Chắc)',
    badge: 'Cấp độ 1 • Cơ bản',
    color: '#2E7D32',
    bg: '#E8F5E9',
    description: 'Trực quan hóa định nghĩa, giải thích ký hiệu và công thức SGK chuẩn, nắm rõ bản chất hiện tượng và chống điểm liệt.'
  },
  'vd': {
    id: 'vd',
    name: 'Vận dụng',
    scoreTarget: 'Điểm 7.0 - 8.5 (Vận dụng)',
    badge: 'Cấp độ 2 • Vận dụng',
    color: '#1565C0',
    bg: '#E3F2FD',
    description: 'Vận dụng công thức và định luật để giải bài toán kết hợp, xử lý câu Đúng/Sai và Trả lời ngắn.'
  },
  'vdc': {
    id: 'vdc',
    name: 'Vận dụng cao',
    scoreTarget: 'Điểm 8.5 - 9.5 (Phân loại)',
    badge: 'Cấp độ 3 • Phân loại',
    color: '#E65100',
    bg: '#FFF3E0',
    description: 'Bài toán thực tế, liên môn, đồ thị phức hợp và các bài phân loại.'
  },
  'hsg': {
    id: 'hsg',
    name: 'Nâng cao & Học sinh giỏi',
    scoreTarget: 'Điểm 9.5+ (Nâng cao)',
    badge: 'Cấp độ 4 • Nâng cao',
    color: '#6A1B9A',
    bg: '#F3E5F5',
    description: 'Tư duy mô hình hóa, các bài toán nâng cao và ôn luyện học sinh giỏi, đánh giá năng lực.'
  }
};

const USAGE_CONTEXTS = {
  'giai-de': {
    id: 'giai-de',
    title: 'Giải đề kiểm tra',
    icon: 'fa-solid fa-bullseye',
    tagline: 'Cấu trúc 3 phần theo định dạng mới',
    description: 'Giải chi tiết theo cấu trúc: Trắc nghiệm 4 lựa chọn, Đúng/Sai và Trả lời ngắn điền số.'
  },
  'socrates': {
    id: 'socrates',
    title: 'Gợi mở Socrates',
    icon: 'fa-solid fa-lightbulb',
    tagline: 'Hướng dẫn từng bước, không lộ đáp án',
    description: 'Dẫn dắt bằng các câu hỏi gợi mở, giúp người học tự suy luận tìm ra lời giải.'
  },
  'chua-bay': {
    id: 'chua-bay',
    title: 'Phân tích lỗi sai thường gặp',
    icon: 'fa-solid fa-triangle-exclamation',
    tagline: 'Chỉ ra lỗi phổ biến và cách khắc phục',
    description: 'Phân tích nguyên nhân nhầm lẫn, lỗi đổi đơn vị, quên điều kiện xác định và lỗi suy luận.'
  },
  'soan-de': {
    id: 'soan-de',
    title: 'Tạo đề tương tự',
    icon: 'fa-solid fa-pen-ruler',
    tagline: 'Đề kiểm tra tương đương kèm ma trận',
    description: 'Tạo bài tập hoặc đề tương đương cùng mức độ nhận thức, có đáp án và hướng dẫn chấm.'
  },
  'on-cap-toc': {
    id: 'on-cap-toc',
    title: 'Sơ đồ tư duy & Tóm tắt',
    icon: 'fa-solid fa-bolt-lightning',
    tagline: 'Sơ đồ Mermaid và các ý cốt lõi',
    description: 'Tóm tắt kiến thức trọng tâm bằng sơ đồ tư duy Mermaid và bảng ghi chép Cornell.'
  }
};

// ============================================================================
// 4. HỒ SƠ NHẬN THỨC LUẬN CHUYÊN SÂU CHO ĐỦ 16/16 SKILLS (SKILL_DEEP_PROFILES)
// ============================================================================
const SKILL_DEEP_PROFILES = {
  'toan-thpt': {
    title: 'Kiến trúc sư Giải tích - Hình học Oxyz - Xác suất Bayes & Khảo thí Toán THPT',
    domainBadge: '📐 Toán học • Tiên đề Suy diễn & LaTeX Chuẩn Quốc Tế',
    epistemology: 'Tư duy Suy diễn Tiên đề (Axiomatic-Deductive Rigor), bảo toàn phép biến đổi tương đương trên tập xác định D, kết hợp Mô hình hóa Tối ưu Thực tiễn và Liên thông Đại số - Giải tích - Hình học Oxyz.',
    methodologySteps: [
      'Bước 1 (Khóa Miền Xác Định): Xác lập Tập xác định D và điều kiện biên thực tế của ẩn số (mẫu ≠ 0, căn ≥ 0, log > 0, kích thước hình học > 0).',
      'Bước 2 (Mô Hình Hóa & Chọn Công Cụ): Thiết lập hàm mục tiêu f(x), gắn hệ trục tọa độ Oxyz hoặc vẽ Sơ đồ hình cây xác suất Bayes.',
      'Bước 3 (Biến Đổi Tường Minh): Tính đạo hàm, lập bảng biến thiên, tính tích phân hoặc giải hệ phương trình từng bước bằng LaTeX chuẩn.',
      'Bước 4 (Kiểm Nghiệm Ngược & Chốt Đáp Số): Đối chiếu điều kiện D, kiểm tra xem đề hỏi x hay f(x) và làm tròn đúng hàng thập phân.'
    ],
    traps: [
      'Bẫy Tam giác Cực trị: Nhầm lẫn giữa Điểm cực trị của hàm số (x₀) vs. Giá trị cực trị của hàm số (y₀ = f(x₀)) vs. Điểm cực trị của đồ thị hàm số M(x₀; y₀).',
      'Bẫy Đơn điệu Hàm phân thức y = (ax+b)/(cx+d): Quên rằng điều kiện đồng biến trên từng khoảng xác định là ad - bc > 0 (tuyệt đối KHÔNG có dấu "=" vì nếu bằng 0 hàm suy biến thành hàm hằng).',
      'Bẫy Góc trong không gian Oxyz: Đường-Đường và Mặt-Mặt dùng cos φ, nhưng góc giữa Đường thẳng d và Mặt phẳng (P) bắt buộc dùng sin φ = |u_d · n_P| / (|u_d|·|n_P|).',
      'Bẫy Thể tích khối tròn xoay quanh trục Ox: Quên nhân hằng số π hoặc quên bình phương hàm số trong công thức V = π ∫[a,b] [f(x)]² dx.',
      'Bẫy Xác suất Bayes: Nhầm lẫn giữa xác suất có điều kiện thuận P(A|B) và xác suất hậu nghiệm Bayes P(B_k|A) khi biến cố kết quả A đã xảy ra.'
    ],
    coveChecklist: [
      'Nghiệm tìm được đã thỏa mãn tập xác định D và điều kiện thực tế (x > 0) chưa?',
      'Đã phân biệt đúng câu hỏi yêu cầu tìm hoành độ x hay giá trị hàm số y = f(x) chưa?',
      'Trong tích phân/hình học Oxyz, dấu của vector pháp tuyến và hằng số π đã chính xác chưa?',
      'Kết quả Phần III (Trả lời ngắn) đã làm tròn đúng yêu cầu đề bài và ≤ 4 ký tự chưa?'
    ],
    fewShot: {
      input: 'Tìm tiệm cận đứng và tiệm cận xiên của đồ thị hàm số $y = f(x) = \\frac{2x^2 - 3x + 5}{x - 1}$.',
      output: '- **Tầng 1 (Gợi mở Socrates):** Tập xác định của hàm phân thức này là gì? Khi bậc tử lớn hơn bậc mẫu 1 bậc, ta tách phần nguyên bằng phép chia đa thức như thế nào?\n- **Tầng 2 (Bản chất):** $D = \\mathbb{R} \\setminus \\{1\\}$. Chia tử cho mẫu: $y = 2x - 1 + \\frac{4}{x - 1}$.\n- **Tầng 3 (Giải chi tiết):** $\\lim_{x \\to 1^\\pm} f(x) = \\pm\\infty \\implies$ TCĐ: $x = 1$. $\\lim_{x \\to \\pm\\infty} [f(x) - (2x - 1)] = \\lim_{x \\to \\pm\\infty} \\frac{4}{x - 1} = 0 \\implies$ TCX: $y = 2x - 1$.\n- **Tầng 4 (Kiểm chứng CoVe & Bẫy):** Tránh nhầm tiệm cận xiên với tiệm cận ngang. Giao điểm hai tiệm cận $I(1; 1)$ chính là tâm đối xứng của đồ thị.'
    },
    sampleProblem: `Cho hàm số y = (2x^2 - 3x + 5)/(x - 1).\n1. Tìm tập xác định D, phương trình đường tiệm cận đứng và tiệm cận xiên của đồ thị hàm số.\n2. Tìm tọa độ tâm đối xứng I của đồ thị hàm số.\nA. TCĐ x = 1, TCX y = 2x - 1\nB. TCĐ x = 1, TCX y = 2x + 1\nC. TCĐ x = -1, TCX y = 2x - 3\nD. Đồ thị không có tiệm cận xiên`
  },

  'vat-li-thpt': {
    title: 'Kiến trúc sư Vật lí Thực nghiệm - Lý thuyết & Khảo thí THPT',
    domainBadge: '⚡ Vật lí • Đơn Vị SI, Bảo Toàn Năng Lượng & Bản Chất Hiện Tượng',
    epistemology: 'Tư duy Mô hình hóa Hiện tượng (Phenomenological Modeling), xác định rõ Hệ vật - Trạng thái - Quá trình, áp dụng các Định luật Bảo toàn và kiểm soát nghiêm ngặt Thứ nguyên hệ SI.',
    methodologySteps: [
      'Bước 1 (Hệ Quy Chiếu & Quy Đổi SI): Xác định hệ vật khảo sát và đổi 100% dữ kiện về hệ SI (T(K) = t(°C) + 273; V(m³) = V(L)×10⁻³; p(Pa)).',
      'Bước 2 (Xác Lập Định Luật Chi Phối): Chọn phương trình trạng thái khí lí tưởng pV = nRT, định luật I NĐLH ΔU = Q + A, cảm ứng điện từ Φ = NBS cos α hoặc phân rã hạt nhân.',
      'Bước 3 (Biến Đổi Đại Số & Thay Số): Rút biểu thức chữ tường minh trước khi thay số, giữ nguyên độ chính xác ở bước trung gian.',
      'Bước 4 (Kiểm Tra Thứ Nguyên & Chiều Vật Lí): Kiểm tra dấu của công A, nhiệt lượng Q và tính hợp lý thực nghiệm của kết quả.'
    ],
    traps: [
      'Bẫy Nhiệt độ Tuyệt đối Kelvin: Quên đổi độ Celsius (°C) sang Kelvin T(K) = t(°C) + 273 trong các định luật chất khí (Boyle, Charles, Clapeyron-Mendeleev).',
      'Bẫy Quy ước dấu ΔU = Q + A: Nhầm dấu khi khối khí giãn nở thực hiện công (phải lấy A < 0) hoặc khi khối khí tỏa nhiệt ra môi trường (phải lấy Q < 0).',
      'Bẫy Góc Pháp tuyến trong Từ thông Φ = NBS cos α: Lấy nhầm góc giữa cảm ứng từ B và mặt phẳng khung dây thay vì góc giữa B và vector pháp tuyến n của khung dây.',
      'Bẫy Hạt nhân Phân rã: Nhầm lẫn giữa số hạt nhân còn lại N(t) = N₀·2^(-t/T) và số hạt nhân đã bị phân rã (= số hạt nhân con tạo thành) ΔN = N₀·(1 - 2^(-t/T)).',
      'Bẫy Đồng nhất Đơn vị p·V: Nhân áp suất p (Pa) với thể tích V (lít) mà quên đổi 1 lít = 10⁻³ m³ khi tính công A = p·ΔV hoặc dùng R = 8.31 J/(mol·K).'
    ],
    coveChecklist: [
      'Nhiệt độ T đã được quy đổi sang thang Kelvin (K = °C + 273) chưa?',
      'Thể tích V đã quy đổi sang m³ khi tính toán với áp suất Pa và hằng số R = 8.31 J/(mol·K) chưa?',
      'Dấu của công A và nhiệt lượng Q trong ΔU = Q + A đã phản ánh đúng quá trình nén hay giãn nở chưa?',
      'Đơn vị của kết quả cuối cùng đã khớp với yêu cầu của câu hỏi chưa?'
    ],
    fewShot: {
      input: 'Cung cấp nhiệt lượng $Q = 1500\\text{ J}$ cho khối khí trong xilanh, khí giãn nở thực hiện công $900\\text{ J}$ đẩy pittông. Tính độ biến thiên nội năng $\\Delta U$.',
      output: '- **Tầng 1 (Gợi mở Socrates):** Theo Định luật I Nhiệt động lực học $\\Delta U = Q + A$, khi khí nhận nhiệt và tự giãn nở sinh công thì dấu của $Q$ và $A$ được lấy như thế nào?\n- **Tầng 2 (Bản chất):** Hệ nhận nhiệt nên $Q = +1500\\text{ J}$; hệ thực hiện công đẩy pittông nên $A = -900\\text{ J}$.\n- **Tầng 3 (Giải chi tiết):** $\\Delta U = Q + A = 1500 + (-900) = 600\\text{ J}$.\n- **Tầng 4 (Kiểm chứng CoVe & Bẫy):** Tránh cộng nhầm $1500 + 900 = 2400\\text{ J}$ do quên đổi dấu $A < 0$ khi khí sinh công.'
    },
    sampleProblem: `Một khối khí lí tưởng có thể tích 4 lít ở nhiệt độ 27 oC và áp suất 1 atm được dãn nở đẳng nhiệt đến thể tích 8 lít.\n1. Tính áp suất của khối khí sau khi dãn nở đẳng nhiệt (theo atm và Pa).\n2. Nếu trong quá trình dãn nở đẳng nhiệt này khối khí thực hiện công 280 J thì nhiệt lượng Q mà khối khí đã nhận được là bao nhiêu Joule?\nA. p2 = 0.5 atm; Q = 280 J\nB. p2 = 2 atm; Q = -280 J\nC. p2 = 0.5 atm; Q = 0 J\nD. p2 = 1 atm; Q = 560 J`
  },

  'hoa-hoc-thpt': {
    title: 'Kiến trúc sư Hóa học Phân tử - Nhiệt động học & Khảo thí THPT Chuẩn IUPAC',
    domainBadge: '🧪 Hóa học • 100% IUPAC Tiếng Anh, Bảo Toàn Vi Mô & Enthalpy',
    epistemology: 'Chuẩn hóa 100% danh pháp quốc tế IUPAC (GDPT 2018), giải quyết bài toán bằng Hệ 4 Định luật Bảo toàn Vi mô (Nguyên tố, Khối lượng, Điện tích, Mol Electron) kết hợp Nhiệt động học (Enthalpy) và Phổ học (IR, MS).',
    methodologySteps: [
      'Bước 1 (Chuẩn Hóa IUPAC & Số Mol ĐKC): Chuyển toàn bộ tên chất sang chuẩn IUPAC tiếng Anh; tính số mol khí ở đkc (25°C, 1 bar) theo công thức n = V / 24.79.',
      'Bước 2 (Bản Chất Phản Ứng & Phương Trình): Xác định nhóm chức/số oxi hóa, viết phương trình phân tử hoặc ion thu gọn kèm điều kiện phản ứng.',
      'Bước 3 (Thiết Lập Hệ Bảo Toàn): Áp dụng Bảo toàn khối lượng, Bảo toàn nguyên tố, Bảo toàn điện tích dung dịch và Bảo toàn mol electron trao đổi.',
      'Bước 4 (Kiểm Tra Chất Dư/Hết & Hiệu Suất): Đối chiếu điều kiện kết tủa/bay hơi, tính hiệu suất theo chất thiếu và kiểm tra dấu của biến thiên Enthalpy.'
    ],
    traps: [
      'Bẫy Thể tích mol khí đkc mới: Vẫn chia cho 22.4 L/mol (cũ) thay vì chia cho 24.79 L/mol ở điều kiện chuẩn mới (25°C, 1 bar).',
      'Bẫy Ester của Phenol (RCOOC₆H₄R\'): Quên rằng ester của phenol phản ứng với NaOH theo tỉ lệ mol 1:2 sinh ra 2 muối (carboxylate + phenolate) và nước chứ không sinh alcohol.',
      'Bẫy Công thức Biến thiên Enthalpy ΔrH°298: Nhầm thứ tự trừ giữa Nhiệt tạo thành ΔfH° (lấy Sản phẩm trừ Chất đầu) và Năng lượng liên kết Eb (lấy Chất đầu trừ Sản phẩm).',
      'Bẫy Tính Hiệu suất Phản ứng H%: Không so sánh tỉ lệ mol ban đầu để tìm chất hết (chất giới hạn) trước khi nhân/chia hiệu suất.',
      'Bẫy Thứ tự Điện phân Dung dịch: Quên xét cặp Fe³⁺ + 1e -> Fe²⁺ xảy ra trước Cu²⁺ + 2e -> Cu, sau đó mới đến Fe²⁺ + 2e -> Fe tại cathode.'
    ],
    coveChecklist: [
      '100% danh pháp nguyên tố và hợp chất đã viết đúng chuẩn IUPAC tiếng Anh (sodium, copper, ethanoic acid, ethyl acetate...) chưa?',
      'Thể tích khí ở điều kiện chuẩn (25°C, 1 bar) đã được chia cho 24.79 L/mol chưa?',
      'Tổng khối lượng và tổng số mol electron nhường - nhận hai vế đã cân bằng tuyệt đối chưa?',
      'Khi tính hiệu suất hoặc bài toán 2 chất tham gia, đã kiểm tra chất nào hết, chất nào dư chưa?'
    ],
    fewShot: {
      input: 'Thủy phân hoàn toàn $17.6\\text{ g}$ ethyl acetate ($CH_3COOC_2H_5$) bằng dung dịch $NaOH$ vừa đủ. Tính khối lượng muối sodium acetate thu được.',
      output: '- **Tầng 1 (Gợi mở Socrates):** Phân tử khối của ethyl acetate ($C_4H_8O_2$) là bao nhiêu? Tỉ lệ mol giữa ester đơn chức mạch hở và $NaOH$ là mấy?\n- **Tầng 2 (Bản chất):** $CH_3COOC_2H_5 + NaOH \\xrightarrow{t^\\circ} CH_3COONa + C_2H_5OH$. Tỉ lệ mol $1:1$.\n- **Tầng 3 (Giải chi tiết):** $n_{\\text{ester}} = \\frac{17.6}{88} = 0.2\\text{ mol} \\implies n_{CH_3COONa} = 0.2\\text{ mol} \\implies m_{\\text{muối}} = 0.2 \\times 82 = 16.4\\text{ g}$.\n- **Tầng 4 (Kiểm chứng CoVe & Bẫy):** Kiểm tra bảo toàn khối lượng: $17.6 + 0.2\\times 40 = 16.4 + 0.2\\times 46 = 25.6\\text{ g}$ (Khớp 100%).'
    },
    sampleProblem: `Hòa tan hoàn toàn m gam bột đồng (copper) trong dung dịch nitric acid (HNO3) loãng, dư thu được 4.958 lít khí NO (ở đkc 25 oC, 1 bar) là sản phẩm khử duy nhất.\n1. Viết phương trình hóa học, phương trình ion thu gọn và gọi tên các chất theo danh pháp IUPAC tiếng Anh.\n2. Sử dụng định luật bảo toàn mol electron để tính giá trị của m (biết Cu = 64, N = 14, O = 16).`
  },

  'sinh-hoc-thpt': {
    title: 'Kiến trúc sư Sinh học Phân tử - Di truyền - Sinh thái & Khảo thí THPT',
    domainBadge: '🧬 Sinh học • Di Truyền Phân Tử 3\'→5\', Hardy-Weinberg & Phả Hệ',
    epistemology: 'Kiểm soát nghiêm ngặt tính phân cực định hướng 3\'→5\' và 5\'→3\' của đại phân tử sinh học, phân tích tổ hợp - xác suất có điều kiện trong quy luật di truyền/phả hệ và mô hình hóa quần thể Hardy-Weinberg.',
    methodologySteps: [
      'Bước 1 (Xác Định Chiều Phân Tử / Quy Luật Di Truyền): Ghi rõ chiều 3\'→5\' của mạch gốc DNA và 5\'→3\' của mRNA; hoặc xác định quy luật phân li, liên kết gen, tương tác gen.',
      'Bước 2 (Mô Hình Hóa Cấu Trúc Di Truyền): Thiết lập cấu trúc quần thể p²AA + 2pqAa + q²aa = 1 hoặc biện luận kiểu gen bố mẹ trong sơ đồ phả hệ.',
      'Bước 3 (Thực Thi Tính Toán Xác Suất): Tính tách riêng từng cặp gen rồi nhân xác suất của các biến cố độc lập.',
      'Bước 4 (Đối Chiếu Mẫu Số Xác Suất Điều Kiện): Kiểm tra kỹ đề hỏi tỉ lệ trên "toàn quần thể" hay "trong số các cá thể mang kiểu hình trội".'
    ],
    traps: [
      'Bẫy Chiều Mạch khuôn DNA vs. mRNA: Quên rằng RNA polymerase chỉ trượt trên mạch khuôn có chiều 3\'→5\' để tổng hợp mRNA theo chiều 5\'→3\'.',
      'Bẫy Xác suất có điều kiện trong Quần thể: Nhầm lẫn giữa tỉ lệ kiểu gen dị hợp Aa trong toàn quần thể (2pq) với tỉ lệ Aa trong số các cá thể mang kiểu hình trội A- (bằng 2pq / (p² + 2pq) = 2q / (1 + q)).',
      'Bẫy Giảm phân của 1 Tế bào vs. 1 Cơ thể: 1 tế bào sinh tinh AaBb không hoán vị chỉ tạo ra 2 loại giao tử (trong khi 1 cơ thể tạo 4 loại); 1 tế bào sinh trứng luôn chỉ tạo đúng 1 giao tử trứng.',
      'Bẫy Cấu trúc Operon Lac: Nhầm rằng gen điều hòa R (lacI) nằm trong Operon Lac và chỉ phiên mã khi môi trường có lactose (thực tế gen R nằm ngoài Operon và luôn phiên mã).',
      'Bẫy Đột biến Thay thế cặp Nucleotide: Thay thế cặp A-T bằng G-C không làm thay đổi tổng số nucleotide N và chiều dài L của gen, nhưng làm tăng thêm 1 liên kết hydrogen.'
    ],
    coveChecklist: [
      'Chiều của các mạch đơn DNA (3\'→5\' / 5\'→3\') và mRNA (5\'→3\') đã được xác định chính xác chưa?',
      'Câu hỏi yêu cầu tính số loại giao tử của "1 tế bào" hay của "1 cơ thể"?',
      'Mẫu số của phép tính xác suất là toàn bộ quần thể hay chỉ nhóm cá thể mang kiểu hình bình thường/trội?',
      'Trong bài toán phả hệ, đã nhân xác suất giới tính (1/2 trai, 1/2 gái) khi đề bài có yêu cầu giới tính của con chưa?'
    ],
    fewShot: {
      input: 'Quần thể ngẫu phối cân bằng di truyền có tỉ lệ kiểu hình lặn $aa = 16\\%$. Tính tỉ lệ cá thể dị hợp $Aa$ trong tổng số các cá thể mang kiểu hình trội $A-$.',
      output: '- **Tầng 1 (Gợi mở Socrates):** Từ $q^2(aa) = 0.16$, ta tìm được tần số alen $q(a)$ và $p(A)$ bằng bao nhiêu? Mẫu số của câu hỏi là toàn quần thể hay chỉ nhóm kiểu hình trội?\n- **Tầng 2 (Bản chất):** $q = \\sqrt{0.16} = 0.4 \\implies p = 1 - 0.4 = 0.6$. Cấu trúc: $0.36 AA : 0.48 Aa : 0.16 aa$.\n- **Tầng 3 (Giải chi tiết):** Tỉ lệ $Aa$ trong số các cá thể trội $A-$ là $P(Aa \\mid A-) = \\frac{2pq}{p^2 + 2pq} = \\frac{0.48}{0.36 + 0.48} = \\frac{4}{7} \\approx 0.57$.\n- **Tầng 4 (Kiểm chứng CoVe & Bẫy):** Tránh điền nhầm $0.48$ (tỉ lệ trong toàn quần thể).'
    },
    sampleProblem: `Một phân tử DNA mạch kép có tổng số nucleotide là N = 3000, trong đó số nucleotide loại Adenine (A) chiếm 20% tổng số nucleotide.\n1. Tính số lượng từng loại nucleotide A, T, G, C và tổng số liên kết hydrogen H của phân tử DNA.\n2. Tính chiều dài L của phân tử DNA theo đơn vị Angstrom và nanomet (nm).`
  },

  'ngu-van-thpt': {
    title: 'Nhà Phê bình Thi pháp học & Chuyên gia Khảo thí Ngữ văn THPT',
    domainBadge: '📖 Ngữ văn • Đọc Hiểu Ngoài SGK, NLXH 200 Chữ & NLVH 600 Chữ',
    epistemology: 'Giải mã văn bản mới hoàn toàn ngoài SGK dựa trên Chìa khóa Mã Thể Loại (Genre-Based Poetics: cấu tứ, hình ảnh, chủ thể trữ tình với Thơ; tình huống, điểm nhìn trần thuật, chi tiết với Truyện) kết hợp Tư duy Nghị luận sắc bén.',
    methodologySteps: [
      'Bước 1 (Giải Mã Đọc Hiểu 4.0đ): Xác định đúng thể loại, phương thức biểu đạt chính, phân tích biện pháp tu từ đủ 3 lớp (Dấu hiệu từ ngữ → Tác dụng nội dung → Tác dụng nghệ thuật).',
      'Bước 2 (Kiến Tạo Đoạn NLXH 200 Chữ - 2.0đ): Viết đúng 1 đoạn văn duy nhất (không xuống dòng), tập trung bàn sâu 1 khía cạnh + 1 dẫn chứng thời sự thực tế + phản đề + bài học.',
      'Bước 3 (Triển Khai Bài NLVH 600 Chữ - 4.0đ): Bố cục 3 phần Mở - Thân - Kết, phân tích song hành giá trị tư tưởng và đặc sắc nghệ thuật theo đặc trưng thể loại.',
      'Bước 4 (Rà Soát Barem Chấm Thi): Kiểm tra dung lượng chữ, tính mạch lạc liên kết câu và triệt tiêu lối diễn xuôi cốt truyện.'
    ],
    traps: [
      'Bẫy "Phương thức biểu đạt chính": Liệt kê 2–3 phương thức trong khi đề hỏi phương thức "chính" (chỉ được ghi đúng 1 phương thức duy nhất: Biểu cảm, Tự sự hoặc Nghị luận).',
      'Bẫy Phân tích Biện pháp Tu từ thiếu vế: Chỉ nêu tác dụng nội dung mà quên chỉ ra từ ngữ chứa biện pháp tu từ và quên nêu tác dụng nghệ thuật (gợi hình, gợi cảm, tạo nhịp điệu).',
      'Bẫy Ngắt đoạn trong Câu NLXH 200 chữ: Xuống dòng tách đoạn trong câu viết đoạn văn 200 chữ làm vi phạm nghiêm trọng hình thức đoạn văn.',
      'Bẫy Giải thích lan man ở Đoạn 200 chữ: Dành quá nửa đoạn văn để giải thích khái niệm chung chung mà thiếu phần bàn luận trực tiếp trọng tâm câu hỏi và thiếu dẫn chứng thực tế.',
      'Bẫy Diễn xuôi văn bản ở Bài NLVH 600 chữ: Kể lại cốt truyện hoặc diễn xuôi ý thơ mà không phân tích các tín hiệu nghệ thuật đặc trưng thể loại (điểm nhìn, giọng điệu, cấu tứ, hình ảnh).'
    ],
    coveChecklist: [
      'Phần Đọc hiểu câu hỏi biện pháp tu từ đã trả lời đủ 3 lớp (Từ ngữ -> Nội dung -> Nghệ thuật) chưa?',
      'Câu Nghị luận xã hội 200 chữ đã được trình bày trong ĐÚNG 1 ĐOẠN VĂN DUY NHẤT (không xuống dòng giữa chừng) chưa?',
      'Bài Nghị luận văn học 600 chữ đã phân tích theo đặc trưng thể loại thay vì diễn xuôi văn bản chưa?',
      'Dẫn chứng đưa vào bài viết có xác thực, tiêu biểu và giàu sức thuyết phục không?'
    ],
    fewShot: {
      input: 'Chỉ ra và nêu tác dụng của biện pháp tu từ trong câu: "Tuổi trẻ không phải là một giai đoạn của cuộc đời, mà là một trạng thái tinh thần, là ý chí vươn lên, là khát vọng dấn thân."',
      output: '- **Tầng 1 (Gợi mở Socrates):** Cấu trúc câu có từ ngữ nào lặp lại liên tiếp? Phép điệp kết hợp liệt kê ấy tạo hiệu ứng gì cho nhịp văn và tư tưởng?\n- **Tầng 2 (Cấu trúc 3 lớp ăn điểm):** (1) Dấu hiệu từ ngữ $\\to$ (2) Tác dụng nghệ thuật $\\to$ (3) Tác dụng nội dung.\n- **Tầng 3 (Trả lời chuẩn barem):**\n  * *Biện pháp tu từ:* Điệp cấu trúc *"là..."* kết hợp phép liệt kê (*"trạng thái tinh thần", "ý chí vươn lên", "khát vọng dấn thân"*).\n  * *Tác dụng nghệ thuật:* Tạo nhịp điệu dồn dập, khỏe khoắn, giàu tính nhạc và tăng sức thuyết phục cho lập luận.\n  * *Tác dụng nội dung:* Khẳng định tuổi trẻ được định nghĩa bởi nhiệt huyết, bản lĩnh và khát vọng cống hiến chứ không chỉ là giới hạn tuổi tác.\n- **Tầng 4 (Kiểm chứng CoVe):** Đã đủ cả 3 ý theo đúng đáp án chuẩn của Bộ GD&ĐT.'
    },
    sampleProblem: `Đọc đoạn trích sau và thực hiện các yêu cầu:\n"Những giọt sương lặng lẽ đọng trên lá cỏ mỗi sớm mai không ồn ào khoe sắc, nhưng chính chúng lại nuôi dưỡng sự tươi xanh của cả cánh đồng. Cũng như trong cuộc đời, có những sự cống hiến âm thầm chẳng cần ai gọi tên..."\n1. Xác định phương thức biểu đạt chính và chỉ ra biện pháp tu từ nổi bật trong đoạn trích.\n2. Viết một đoạn văn nghị luận xã hội (khoảng 200 chữ) trình bày suy nghĩ về giá trị của những sự cống hiến thầm lặng trong cuộc sống hôm nay.`
  },

  'tieng-anh-thpt': {
    title: 'Kiến trúc sư Ngôn ngữ học Ứng dụng & Khảo thí Tiếng Anh THPT (CEFR B2-C1)',
    domainBadge: '🌐 Tiếng Anh • Syntactic Parsing, Word Formation, IPA & Spelling Rules',
    epistemology: 'Vận hành trên 4 trụ cột ngôn ngữ học: Cú pháp học Cấu trúc (Syntactic Parsing), Ngữ nghĩa học & Kết hợp từ (Collocations & Phrasal Verbs), Ngữ âm học chuẩn IPA Oxford và Phân tích Liên kết Diễn ngôn (Discourse Cohesion). TUYỆT ĐỐI CẤM trả lời cụt ngủn 1 từ đơn lẻ. Mọi câu hỏi từ vựng hay chuyển đổi từ loại bắt buộc triển khai trọn vẹn Bảng họ từ (Word Family: Verb/Noun/Adj/Adv), Phiên âm IPA Oxford, Quy tắc chính tả (Spelling Rules chống bẫy đảo ký tự i/e hay nhân đôi phụ âm), Collocations và câu ví dụ hoàn chỉnh.',
    methodologySteps: [
      'Bước 1 (Giải Phẫu Cú Pháp & Từ Loại): Tách Mệnh đề chính (Main Clause) và Mệnh đề phụ/Rút gọn phân từ để xác định chính xác từ loại (Noun, Verb, Adj, Adv) hoặc dạng động từ cần điền.',
      'Bước 2 (Kiểm Tra Chính Tả & Họ Từ Vựng - Word Formation): Đối chiếu chính tả từng chữ cái theo Oxford/Cambridge (quy tắc "i before e except after c": achieve -> achievement, receive -> receipt; maintain -> maintenance; pronounce -> pronunciation). Không bao giờ trả lời 1 từ trơ trọi.',
      'Bước 3 (Phân Tích Diễn Ngôn & Paraphrase): Với bài sắp xếp hội thoại/thư/đoạn văn, tìm Topic Sentence và bắt cặp đại từ quy chiếu; với bài Đọc hiểu, trích dẫn nguyên văn Evidence Span và phân tích Paraphrasing.',
      'Bước 4 (Loại Trừ Phương Án Nhiễu & Mở Rộng Collocations): Giải thích tường minh lý do loại bỏ từng phương án A, B, C, D (sai ngữ pháp, sai Collocation, sai chính tả hay bẫy Not Given).'
    ],
    traps: [
      'Bẫy Chính tả & Biến thể Từ loại (Orthographic & Word Formation Trap): Nhầm thứ tự nguyên âm (quy tắc "i before e except after c" trong achieve/achievement, tuyệt đối KHÔNG viết *acheivement; receive/receipt; believe); nhầm đuôi biến đổi gốc từ (maintain -> maintenance chứ không phải maintainance; pronounce -> pronunciation; separate chứ không phải seperate; environment có chữ n; accommodate có 2 chữ c và 2 chữ m).',
      'Bẫy Chủ ngữ giả khi Rút gọn Mệnh đề (Dangling Participle): Dùng V-ing/V3 ở đầu câu nhưng không kiểm tra chủ ngữ đứng sau dấu phẩy thực hiện (V-ing) hay chịu tác động (V3/ed) của hành động.',
      'Bẫy Cặp Tính từ Đồng gốc dễ nhầm: Nhầm lẫn giữa economic (thuộc kinh tế) vs. economical (tiết kiệm); considerate (chu đáo) vs. considerable (đáng kể); historic vs. historical.',
      'Bẫy Trật tự Tính từ & Cụm danh từ: Sắp xếp sai thứ tự OSASCOMP (Opinion - Size - Age - Shape - Color - Origin - Material - Purpose + Noun).',
      'Bẫy Word-Matching trong Đọc hiểu: Chọn phương án lặp lại nguyên xi từ vựng trong bài đọc nhưng cài thêm từ tuyệt đối hóa (only, all, never, completely) làm sai lệch nghĩa.',
      'Bẫy Đại từ Quan hệ sau dấu phẩy: Chọn "that" sau dấu phẩy hoặc dùng "what" làm đại từ quan hệ thay cho cả mệnh đề phía trước (đúng phải là ", which + V_số_ít").'
    ],
    coveChecklist: [
      'Chính tả của toàn bộ từ vựng tiếng Anh đã được rà soát từng ký tự theo từ điển Oxford/Cambridge chưa? Tuyệt đối không để xảy ra lỗi sai chính tả (ví dụ: achievement, không bao giờ là acheivement)?',
      'Đã tuân thủ nguyên tắc Zero-Bare-Word (tuyệt đối không trả lời cụt ngủn 1 từ), cung cấp đầy đủ Bảng họ từ (Word Family Matrix), phiên âm IPA và câu ví dụ ngữ cảnh chưa?',
      'Phiên âm IPA và vị trí dấu trọng âm đã chuẩn xác 100% theo từ điển Oxford / Cambridge chưa?',
      'Sự hòa hợp giữa Chủ ngữ chính (trước giới từ) và Động từ chia thì đã được kiểm tra chưa?',
      'Trong câu hỏi Đọc hiểu, đã trích dẫn chính xác câu bằng chứng trong bài đọc để chứng minh đáp án chưa?',
      'Trong bài Sắp xếp đoạn văn (a-b-c-d-e), mạch liên kết đại từ quy chiếu và từ nối giữa các câu liền kề đã hợp lý chưa?'
    ],
    fewShot: {
      input: 'Cho dạng đúng của từ trong ngoặc để hoàn thành câu: "Winning the prestigious national scholarship was a remarkable (ACHIEVE) for her academic career."',
      output: '- **Tầng 1 (Gợi mở Socrates):** Vị trí chỗ trống đứng sau mạo từ "a", tính từ "remarkable" và bổ nghĩa cho giới từ "for". Vị trí này cần từ loại nào? Động từ "achieve" biến đổi sang danh từ như thế nào và chú ý quy tắc chính tả gì?\n- **Tầng 2 (Bản chất Ngôn ngữ & Cấu trúc Họ từ):**\n  * *Quy tắc ngữ pháp:* Sau `a + Adjective` bắt buộc là một `Danh từ đếm được số ít (Singular Countable Noun)`.\n  * *Bảng họ từ (Word Family Matrix):*\n    - Động từ (Verb): `achieve` /əˈtʃiːv/ (đạt được, hoàn thành nhờ nỗ lực).\n    - Danh từ (Noun): **`achievement`** /əˈtʃiːvmənt/ (thành tựu, sự đạt được); `achiever` /əˈtʃiːvər/ (người thành công, người phấn đấu).\n    - Tính từ (Adjective): `achievable` /əˈtʃiːvəbl/ (có thể đạt được); `unachievable` (không thể đạt được).\n- **Tầng 3 (Lời giải chi tiết & Quy tắc chính tả vàng):**\n  * **Đáp án đúng:** **`achievement`**.\n  * **Quy tắc chính tả (Spelling Rule - Tránh bẫy phòng thi):** Áp dụng quy tắc kinh điển *"i before e except after c"* (chữ `i` đứng trước chữ `e`, trừ khi đứng sau chữ `c`). Động từ gốc là `a-c-h-i-e-v-e` thêm hậu tố danh từ `-ment` $\\to$ **`achievement`** (TUYỆT ĐỐI KHÔNG VIẾT NHẦM THÀNH `*acheivement`).\n  * **Phiên âm quốc tế IPA (Oxford OALD):** `/əˈtʃiːvmənt/` (trọng âm rơi vào âm tiết thứ 2, nguyên âm giữa là /iː/ dài).\n- **Tầng 4 (Collocations & Tự kiểm chứng CoVe):**\n  * *Cụm từ cố định đắt giá (Collocations):* `a remarkable/great/crowning achievement` (thành tựu đáng nể/vĩ đại), `a sense of achievement` (cảm giác thành tựu, tự hào khi đạt được điều gì).\n  * *Kiểm chứng CoVe:* Câu hoàn chỉnh: *"Winning the prestigious national scholarship was a remarkable achievement for her academic career."* $\\to$ Chuẩn ngữ pháp, chuẩn ngữ nghĩa và chính xác 100% chính tả.'
    },
    sampleProblem: `Read the following passage and mark the letter A, B, C, or D to indicate the correct option.\n"Artificial Intelligence is rapidly transforming modern education by providing personalized learning paths, (1) ______ helps students progress at their own pace. Learners who make consistent efforts will experience a tremendous sense of (2) ______."\n1. A. that   B. which   C. what   D. who\n2. A. achieve   B. achievement   C. achievable   D. acheivement`
  },

  'lich-su-thpt': {
    title: 'Sử gia Học thuật & Chuyên gia Khảo thí Lịch sử THPT',
    domainBadge: '📜 Lịch Sử • Phê Phán Tư Liệu Gốc, Mạch Nhân Quả & Đối Sánh Sử Học',
    epistemology: 'Kết hợp Tư duy Biên niên - Lịch đại (Diachronic), Tư duy Đồng đại - Toàn cầu (Synchronic), Phê phán Tư liệu Gốc (Primary Source Criticism) và Phân tích Chuỗi Nhân - Quả Lịch sử.',
    methodologySteps: [
      'Bước 1 (Định Vị Niên Đại & Không Gian): Khoanh vùng chính xác giai đoạn lịch sử của sự kiện/đoạn tư liệu và xác định từ khóa tính chất (mở đầu, bước ngoặt, quyết định).',
      'Bước 2 (Giải Mã Đoạn Tư Liệu Gốc - Phần II): Đối chiếu kép giữa thông tin hiển ngôn trong đoạn trích và bối cảnh lịch sử vĩ mô của thời kỳ đó.',
      'Bước 3 (Phân Tích Chuỗi Nhân Quả): Tách rõ Bối cảnh -> Nguyên nhân sâu xa -> Duyên cớ trực tiếp -> Diễn biến -> Kết quả -> Ý nghĩa & Bài học kinh nghiệm.',
      'Bước 4 (Đối Sánh & Loại Trừ Nhiễu): Kiểm tra tính chính xác của mốc thời gian và bác bỏ các phương án mắc lỗi lệch niên đại hoặc tuyệt đối hóa.'
    ],
    traps: [
      'Bẫy Bước chuyển Chiến lược (1947 vs. 1950 vs. 1960): Nhầm lẫn giữa Chiến dịch Việt Bắc 1947 (đập tan đánh nhanh thắng nhanh), Biên giới 1950 (giành quyền chủ động chiến lược trên chiến trường chính Bắc Bộ) và Đồng khởi 1960 (chuyển cách mạng miền Nam sang thế tiến công).',
      'Bẫy Hiệp định Ngoại giao (1946 vs. 1954 vs. 1973): Hiệp định Sơ bộ 6/3/1946 công nhận VN là "quốc gia tự do"; Hiệp định Giơ-ne-vơ 1954 và Paris 1973 công nhận 4 quyền dân tộc cơ bản; Tết Mậu Thân 1968 buộc Mỹ đàm phán ở Paris còn Điện Biên Phủ trên không 1972 buộc Mỹ ký Hiệp định Paris.',
      'Bẫy Chiến tranh lạnh (1947 vs. 1989 vs. 1991): Thông điệp Truman (3/1947) khởi đầu Chiến tranh lạnh; Hội nghị Malta (12/1989) tuyên bố chấm dứt Chiến tranh lạnh; Liên Xô tan rã (12/1991) đánh dấu Trật tự hai cực Ianta sụp đổ hoàn toàn.',
      'Bẫy Bản chất Đổi mới (1986): Nhận định sai rằng Đổi mới là thay đổi mục tiêu chủ nghĩa xã hội (thực chất Đổi mới giữ vững mục tiêu XHCN nhưng thực hiện bằng hình thức, bước đi phù hợp).',
      'Bẫy Cương lĩnh đầu tiên (2/1930) vs. Luận cương (10/1930): Cương lĩnh đầu tiên của Nguyễn Ái Quốc và Hội nghị TW 8 (5/1941) đặt nhiệm vụ giải phóng dân tộc lên hàng đầu, còn Luận cương 10/1930 nặng về đấu tranh giai cấp.'
    ],
    coveChecklist: [
      'Mốc thời gian (ngày, tháng, năm) và tên chiến dịch/văn kiện đã chuẩn xác 100% theo SGK GDPT 2018 chưa?',
      'Trong câu hỏi Đúng/Sai từ đoạn tư liệu, đã đối chiếu sát từng câu chữ trong đoạn trích chưa?',
      'Đã phân biệt rõ "thắng lợi mở đầu", "thắng lợi tạo bước ngoặt chuyển thế" và "thắng lợi quyết định" chưa?',
      'Có phương án nào chứa từ khóa tuyệt đối hóa sai lịch sử ("duy nhất", "hoàn toàn xóa bỏ ngay") không?'
    ],
    fewShot: {
      input: 'Thắng lợi quân sự nào của quân dân Việt Nam đã buộc Mỹ phải ký kết Hiệp định Paris (27/1/1973) về chấm dứt chiến tranh, lập lại hòa bình ở Việt Nam?',
      output: '- **Tầng 1 (Gợi mở Socrates):** Cần phân biệt sự kiện buộc Mỹ *chấp nhận ngồi vào bàn đàm phán* (năm 1968) và sự kiện buộc Mỹ *đặt bút ký hiệp định* (đầu năm 1973).\n- **Tầng 2 (Bối cảnh & Nhân quả):** Cuối năm 1972, Mỹ dùng B-52 tập kích chiến lược Hà Nội, Hải Phòng suốt 12 ngày đêm nhằm giành thế mạnh trên bàn đàm phán.\n- **Tầng 3 (Giải chi tiết):** Quân dân miền Bắc đã làm nên trận **"Điện Biên Phủ trên không" (18–29/12/1972)**, đập tan cuộc tập kích chiến lược bằng máy bay B-52 của Mỹ, buộc Mỹ phải ký Hiệp định Paris ngày 27/1/1973.\n- **Tầng 4 (Kiểm chứng CoVe & Bẫy):** Tránh chọn nhầm Tết Mậu Thân 1968 (mốc buộc Mỹ xuống thang và bắt đầu đàm phán).'
    },
    sampleProblem: `Đọc đoạn tư liệu lịch sử sau:\n"Chiến thắng Điện Biên Phủ đã đập tan hoàn toàn kế hoạch Nava, giáng đòn quyết định vào ý chí xâm lược của thực dân Pháp, làm xoay chuyển cục diện chiến tranh và tạo cơ sở thực lực về quân sự cho cuộc đấu tranh ngoại giao tại Hội nghị Giơ-ne-vơ."\nXét tính Đúng/Sai của các nhận định:\na) Chiến dịch Điện Biên Phủ (1954) là thắng lợi quân sự quyết định tạo cơ sở cho việc ký kết Hiệp định Giơ-ne-vơ.\nb) Chiến dịch Điện Biên Phủ đã mở đầu cho việc quân ta giành quyền chủ động chiến lược trên chiến trường chính Bắc Bộ.\nc) Thắng lợi này chứng minh quy luật: thắng lợi trên chiến trường quyết định thắng lợi trên bàn đàm phán ngoại giao.\nd) Ngay sau Hiệp định Giơ-ne-vơ năm 1954, cả hai miền Nam - Bắc Việt Nam đều hoàn toàn được giải phóng và thống nhất.`
  },

  'dia-li-thpt': {
    title: 'Chuyên gia Địa lí Tự nhiên - Kinh tế & Phân tích Thống kê Định lượng THPT',
    domainBadge: '🌍 Địa Lí • Hệ Thống Tự Nhiên - Kinh Tế, Biểu Đồ & Tính Toán Số Liệu',
    epistemology: 'Kết hợp Tư duy Hệ thống Tự nhiên (Vị trí - Gió mùa - Địa hình -> Khí hậu - Sông ngòi - Đất - Sinh vật), Tư duy Tổ chức Lãnh thổ Kinh tế và Phân tích Thống kê Định lượng chính xác tuyệt đối.',
    methodologySteps: [
      'Bước 1 (Xác Định Quy Luật / Công Thức Địa Lí): Nhận diện mối quan hệ nhân quả tự nhiên - kinh tế hoặc viết công thức tính toán (Mật độ dân số, Cán cân XNK, Năng suất, Tỉ trọng %, Biên độ nhiệt).',
      'Bước 2 (Kiểm Soát Quy Đổi Đơn Vị): Đổi chuẩn xác đơn vị trước khi tính (1 tấn = 10 tạ; 1 km² = 100 ha; tỉ suất sinh/tử ‰ chia 10 ra tỉ lệ tăng tự nhiên %).',
      'Bước 3 (Thực Thi Tính Toán & Phân Tích Bảng Số Liệu): Giữ nguyên số chữ số thập phân ở bước trung gian, kiểm tra kỹ tất cả các năm trước khi kết luận "tăng/giảm liên tục".',
      'Bước 4 (Làm Tròn Chuẩn Phần III): Chỉ làm tròn một lần duy nhất ở kết quả cuối cùng đúng hàng thập phân đề bài yêu cầu.'
    ],
    traps: [
      'Bẫy Đơn vị Năng suất Lúa (Tạ/ha vs. Tấn/ha): Lấy Sản lượng (nghìn tấn) chia Diện tích (nghìn ha) ra đơn vị tấn/ha nhưng quên nhân 10 để đổi sang tạ/ha theo yêu cầu câu hỏi.',
      'Bẫy So sánh Tỉ trọng (%) giữa hai năm: Khi số liệu đã là tỉ trọng (%), muốn biết tăng/giảm bao nhiêu % (điểm phần trăm) phải dùng phép TRỪ (A₂ - A₁), không lấy A₂ chia A₁.',
      'Bẫy Đồng nhất Tỉ trọng (%) với Quy mô Tuyệt đối: Thấy tỉ trọng ngành Nông nghiệp giảm liền kết luận giá trị sản xuất nông nghiệp giảm (thực tế quy mô vẫn tăng nhưng tăng chậm hơn ngành khác).',
      'Bẫy Mùa mưa Duyên hải Miền Trung: Quên rằng vùng đồng bằng ven biển Trung Bộ mưa lệch vào thu - đông (tháng 9 - 12) do gió mùa Đông Bắc qua biển kết hợp bức chắn Trường Sơn và dải hội tụ nhiệt đới, còn đầu mùa hạ lại khô nóng (gió Phơn).',
      'Bẫy Nhận diện Biểu đồ (Tròn vs. Miền vs. Đường): Tốc độ tăng trưởng (%) có gốc 100% -> Biểu đồ Đường; Quy mô và cơ cấu (≤ 3 năm) -> Biểu đồ Tròn; Chuyển dịch cơ cấu (≥ 4 năm) -> Biểu đồ Miền.'
    ],
    coveChecklist: [
      'Đơn vị của đáp số đã khớp 100% với câu hỏi chưa (tạ/ha hay tấn/ha, người/km², tỉ USD, % hay ‰)?',
      'Đã kiểm tra từng mốc năm trung gian trong bảng số liệu trước khi kết luận "tăng/giảm liên tục" chưa?',
      'Đã giữ nguyên độ chính xác ở bước tính trung gian và chỉ làm tròn ở kết quả cuối cùng chưa?',
      'Loại biểu đồ được chọn đã khớp với từ khóa câu hỏi ("tốc độ tăng trưởng", "quy mô và cơ cấu", "chuyển dịch cơ cấu") chưa?'
    ],
    fewShot: {
      input: 'Năm 2023, diện tích lúa của vùng là $3825\\text{ nghìn ha}$, sản lượng đạt $24150\\text{ nghìn tấn}$. Tính năng suất lúa theo đơn vị **tạ/ha** (làm tròn đến 1 chữ số thập phân).',
      output: '- **Tầng 1 (Gợi mở Socrates):** $\\text{Năng suất} = \\frac{\\text{Sản lượng}}{\\text{Diện tích}}$. Khi lấy nghìn tấn chia nghìn ha ta được đơn vị gì? Đổi sang tạ/ha phải nhân mấy?\n- **Tầng 2 (Công thức):** $1\\text{ tấn} = 10\\text{ tạ} \\implies \\text{Năng suất (tạ/ha)} = \\frac{\\text{Sản lượng (nghìn tấn)}}{\\text{Diện tích (nghìn ha)}} \\times 10$.\n- **Tầng 3 (Giải chi tiết):** $\\text{Năng suất} = \\frac{24150}{3825} \\times 10 \\approx 63.137 \\approx \\mathbf{63.1}\\text{ (tạ/ha)}$.\n- **Tầng 4 (Kiểm chứng CoVe & Bẫy):** Tránh điền $6.3$ (đơn vị tấn/ha do quên nhân 10).'
    },
    sampleProblem: `Cho số liệu xuất nhập khẩu hàng hóa của nước ta năm 2023: Trị giá xuất khẩu đạt 354.7 tỉ USD, trị giá nhập khẩu đạt 326.4 tỉ USD.\n1. Tính tổng kim ngạch xuất nhập khẩu và cán cân xuất nhập khẩu của nước ta năm 2023 (đơn vị: tỉ USD).\n2. Tính tỉ trọng trị giá xuất khẩu trong tổng kim ngạch xuất nhập khẩu năm 2023 (làm tròn đến 1 chữ số thập phân của %).`
  },

  'ktpl-thpt': {
    title: 'Chuyên gia Kinh tế học - Luật học Thực chứng & Khảo thí GDKT&PL THPT',
    domainBadge: '⚖️ KTPL • Giải Phẫu Tình Huống Pháp Lý, Kinh Tế Vĩ Mô & Hội Nhập',
    epistemology: 'Giải phẫu Tình huống Pháp lý theo Ma trận Chủ thể - Hành vi - Khách thể xâm phạm - Hình thức thực hiện pháp luật - Chế tài, kết hợp Phân tích Kinh tế Vĩ mô / Vi mô và Công pháp Quốc tế.',
    methodologySteps: [
      'Bước 1 (Tách Chủ Thể & Hành Vi): Liệt kê từng nhân vật/tổ chức trong tình huống và hành vi cụ thể của mỗi người.',
      'Bước 2 (Định Danh Quyền & Hình Thức Thực Hiện Pháp Luật): Đối chiếu hành vi với 4 hình thức (Sử dụng, Thi hành, Tuân thủ, Áp dụng pháp luật) và các quyền tự do/dân chủ cơ bản.',
      'Bước 3 (Phân Tích Chỉ Tiêu Kinh Tế / Hội Nhập): Phân biệt Tăng trưởng (GDP, GNI) vs. Phát triển kinh tế (HDI), 4 trách nhiệm CSR và cấp độ hội nhập (Song phương, Khu vực, Toàn cầu).',
      'Bước 4 (Kiểm Chứng Chéo Trách Nhiệm Pháp Lý): Đảm bảo không đánh đồng lỗi của các nhân vật khác nhau trong cùng một tình huống.'
    ],
    traps: [
      'Bẫy Sử dụng pháp luật vs. Thi hành pháp luật: Công dân thực hiện quyền (khiếu nại, đăng ký kinh doanh, bầu cử) là "Sử dụng pháp luật"; thực hiện nghĩa vụ bắt buộc (nộp thuế, đội mũ bảo hiểm) là "Thi hành pháp luật".',
      'Bẫy Xâm phạm Thân thể vs. Tính mạng, Sức khỏe vs. Danh dự, Nhân phẩm: Bắt, giam, nhốt người trái phép là xâm phạm "thân thể"; đánh đập gây thương tích là xâm phạm "tính mạng, sức khỏe"; bịa đặt vu khống là xâm phạm "danh dự, nhân phẩm".',
      'Bẫy Khiếu nại vs. Tố cáo: Khiếu nại là yêu cầu xem xét lại quyết định hành chính xâm phạm quyền lợi của chính mình; Tố cáo là báo tin cho cơ quan có thẩm quyền về hành vi vi phạm pháp luật của bất kỳ ai.',
      'Bẫy Tăng trưởng kinh tế (GDP vs. GNI): GDP tính theo lãnh thổ quốc gia (gồm cả doanh nghiệp FDI tại VN); GNI tính theo quyền sở hữu của công dân quốc gia đó.',
      'Bẫy Chủ quyền trên Biển theo UNCLOS 1982: Quốc gia ven biển có "chủ quyền hoàn toàn, tuyệt đối/đầy đủ" ở Nội thủy và Lãnh hải (12 hải lý); còn ở Vùng đặc quyền kinh tế (EEZ - 200 hải lý) và Thềm lục địa là "quyền chủ quyền" và "quyền tài phán".'
    ],
    coveChecklist: [
      'Đã tách riêng hành vi của từng nhân vật (A, B, C...) trong tình huống pháp luật chưa?',
      'Đã phân biệt chính xác hành vi bắt nhốt người (xâm phạm thân thể) với hành hung gây thương tích (xâm phạm sức khỏe) chưa?',
      'Đã phân biệt đúng "Sử dụng pháp luật" (quyền) và "Thi hành pháp luật" (nghĩa vụ) chưa?',
      'Trong hội nhập kinh tế, đã xác định đúng cấp độ Song phương (2 bên), Khu vực (ASEAN, APEC) hay Toàn cầu (WTO) chưa?'
    ],
    fewShot: {
      input: 'Do nghi ngờ anh P lấy trộm điện thoại, anh K đã tự ý khóa trái cửa nhốt anh P trong nhà kho 3 tiếng đồng hồ và đăng bài vu khống anh P lên mạng xã hội. Anh K đã vi phạm những quyền nào của công dân?',
      output: '- **Tầng 1 (Gợi mở Socrates):** Anh K có mấy hành vi tách biệt? Hành vi khóa cửa nhốt người và hành vi đăng tin bịa đặt xâm phạm tới khách thể nào?\n- **Tầng 2 (Căn cứ Pháp lý):** (1) Tự ý bắt, giam, giữ người trái phép $\\to$ Quyền bất khả xâm phạm về thân thể. (2) Vu khống, xúc phạm uy tín $\\to$ Quyền được pháp luật bảo hộ về danh dự, nhân phẩm.\n- **Tầng 3 (Kết luận):** Anh K đồng thời vi phạm **quyền bất khả xâm phạm về thân thể** và **quyền được pháp luật bảo hộ về danh dự, nhân phẩm** của anh P.\n- **Tầng 4 (Kiểm chứng CoVe & Bẫy):** Anh K không đánh đập gây thương tích nên không chọn "tính mạng, sức khỏe"; nhà kho không phải nơi ở của P nên không chọn "bất khả xâm phạm về chỗ ở".'
    },
    sampleProblem: `Đọc tình huống sau:\nCông ty X do ông M làm giám đốc chuyên xuất khẩu nông sản sang EU theo Hiệp định EVFTA. Ông M luôn nộp thuế đầy đủ, đóng bảo hiểm xã hội bắt buộc cho công nhân và trích quỹ 300 triệu đồng xây nhà tình nghĩa. Tuy nhiên, bảo vệ công ty là anh H khi phát hiện anh T đột nhập đã tự ý trói và nhốt anh T trong phòng bảo vệ suốt 12 giờ mà không báo công an.\n1. Xác định hình thức thực hiện pháp luật và trách nhiệm xã hội (CSR) của Công ty X.\n2. Hành vi của anh H đã vi phạm quyền cơ bản nào của công dân?`
  },

  'tin-hoc-thpt': {
    title: 'Kiến trúc sư Khoa học Máy tính & Sư phạm Tin học THPT (CS & ICT)',
    domainBadge: '💻 Tin Học • Thuật Toán Python, Bảng Trace, SQL, HTML/CSS & AI',
    epistemology: 'Tư duy Máy tính (Computational Thinking) dựa trên Minh bạch Trạng thái Thực thi qua Bảng Vết (Dry-Run State Trace Table), Đánh giá Độ phức tạp T(n) = O(...), Toàn vẹn Tham chiếu CSDL SQL và Chuẩn Web HTML5/CSS3.',
    methodologySteps: [
      'Bước 1 (Đặc Tả Đầu Vào & Điều Kiện Biên): Xác định kiểu dữ liệu, chỉ số mảng từ 0 và quy tắc nửa khoảng [start, stop) của Python range/slicing.',
      'Bước 2 (Lập Bảng Vết Thực Thi - Trace Table): Kẻ bảng theo dõi giá trị từng biến qua mỗi vòng lặp Python hoặc thứ tự thực thi mệnh đề SQL.',
      'Bước 3 (Phân Tích Độ Phức Tạp / Độ Ưu Tiên CSS): Đánh giá Big-O (O(1), O(log n), O(n), O(n log n), O(n²)) hoặc tính điểm ưu tiên CSS Specificity (Inline, ID, Class, Tag).',
      'Bước 4 (Kiểm Chứng Ràng Buộc): Kiểm tra tính khả biến (Mutability) của list trong Python và ràng buộc khóa chính/khóa ngoại (PK/FK) trong SQL.'
    ],
    traps: [
      'Bẫy Cận trên range(start, stop, step) trong Python: Quên rằng vòng lặp luôn dừng trước stop (tại stop - 1 đối với bước nhảy dương).',
      'Bẫy Tham chiếu Danh sách (List Aliasing): Gán B = A trên kiểu list rồi sửa B[0] sẽ làm thay đổi cả A[0] vì cùng trỏ tới một vùng nhớ.',
      'Bẫy WHERE vs. HAVING trong SQL: Đặt hàm tổng hợp (COUNT, SUM, AVG, MAX, MIN) trong mệnh đề WHERE thay vì đặt trong mệnh đề HAVING sau GROUP BY.',
      'Bẫy Độ ưu tiên CSS (Specificity): Tưởng rằng quy tắc CSS viết ở dòng dưới luôn ghi đè dòng trên mà quên rằng #id (0,1,0,0) luôn thắng .class (0,0,1,0) và thẻ HTML (0,0,0,1).',
      'Bẫy Điều kiện Tìm kiếm Nhị phân (Binary Search): Áp dụng Binary Search O(log n) trên dãy số chưa được sắp xếp tăng dần hoặc giảm dần.'
    ],
    coveChecklist: [
      'Đã lập Bảng Vết Thực Thi (Dry-Run Trace Table) theo từng bước lặp cho đoạn code Python chưa?',
      'Trong SQL, điều kiện lọc trên hàm tổng hợp (AVG, COUNT, SUM) đã đặt ở HAVING sau GROUP BY chưa?',
      'Trong CSS, đã so sánh bộ điểm Specificity (Inline, ID, Class, Element) trước khi xét thứ tự dòng lệnh chưa?',
      'Độ phức tạp thuật toán thời gian T(n) và không gian S(n) đã được xác định chính xác chưa?'
    ],
    fewShot: {
      input: 'Cho code Python: `s = 0; a = [2, 5, 4, 7]; for i in range(1, len(a)): if a[i] % 2 == 1: s += a[i]`. Tìm giá trị của `s`.',
      output: '- **Tầng 1 (Gợi mở Socrates):** `len(a)` bằng mấy? `range(1, 4)` duyệt qua những chỉ số `i` nào (có tính `i = 0` không)?\n- **Tầng 2 (Bảng Trace):** `i` nhận các giá trị `1, 2, 3`.\n  * `i = 1`: `a[1] = 5` (lẻ) $\\implies s = 0 + 5 = 5$.\n  * `i = 2`: `a[2] = 4` (chẵn) $\\implies s = 5$.\n  * `i = 3`: `a[3] = 7` (lẻ) $\\implies s = 5 + 7 = 12$.\n- **Tầng 3 (Kết luận):** Giá trị cuối cùng của `s` là **`12`**.\n- **Tầng 4 (Kiểm chứng CoVe & Bẫy):** Tránh cộng nhầm `a[0] = 2` vì vòng lặp bắt đầu từ `i = 1`.'
    },
    sampleProblem: `Viết chương trình Python thực hiện thuật toán Tìm kiếm nhị phân (Binary Search) trên dãy số nguyên đã sắp xếp tăng dần A = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91] để tìm vị trí của phần tử x = 23.\n1. Lập bảng vết thực thi (Trace Table) theo dõi các biến left, right, mid qua từng bước lặp.\n2. Phân tích độ phức tạp thời gian O(log n) của thuật toán.`
  },

  'cong-nghe-thpt': {
    title: 'Kỹ sư Hệ thống & Chuyên gia Sư phạm Công nghệ THPT (Công nghiệp & Nông nghiệp)',
    domainBadge: '⚙️ Công Nghệ • Mạch Điện 3 Pha, Điện Tử Số, Cơ Khí & Nông-Lâm-Thủy Sản 4.0',
    epistemology: 'Phân tích Hệ thống Kỹ thuật theo mô hình Input - Process - Control - Output, tính toán định lượng mạch điện xoay chiều 3 pha (Sao Y / Tam giác Δ), mạch điện tử tương tự/số và quy trình sinh thái Nông - Lâm - Thủy sản công nghệ cao (Biofloc, RAS, VietGAP).',
    methodologySteps: [
      'Bước 1 (Nhận Diện Sơ Đồ & Thông Số Định Mức): Xác định lưới điện (Ud, Up), cách đấu nối tải 3 pha (Y hay Δ), sơ đồ cổng logic hoặc chỉ số môi trường ao nuôi/lâm nghiệp.',
      'Bước 2 (Thiết Lập Hệ Thức Kỹ Thuật): Áp dụng hệ thức nối Sao (Ud = √3 Up, Id = Ip), nối Tam giác (Ud = Up, Id = √3 Ip) hoặc hàm đại số Boole.',
      'Bước 3 (Tính Toán Định Lượng & Phân Tích Quy Trình): Thay số chuẩn đơn vị kỹ thuật (V, A, Ω, W, kW, mg/L) và phân tích cơ chế sinh hóa.',
      'Bước 4 (Kiểm Chứng An Toàn Kỹ Thuật): Kiểm tra điện áp đặt vào mỗi pha của tải có vượt quá định mức gây cháy thiết bị hay không.'
    ],
    traps: [
      'Bẫy Ký hiệu Lưới điện 220/380 V: Trong lưới điện 3 pha luôn có Ud = √3 Up > Up, nên số lớn (380 V) luôn là điện áp dây Ud, số nhỏ (220 V) luôn là điện áp pha Up.',
      'Bẫy Đấu nối Động cơ Δ/Y - 220/380 V: Khi đấu động cơ này vào lưới có Ud = 380 V, bắt buộc phải đấu hình Sao (Y) để mỗi pha chịu đúng 220 V (nếu đấu Δ mỗi pha chịu 380 V sẽ cháy động cơ).',
      'Bẫy Công thức Công suất 3 pha: Nhầm lẫn giữa P = √3·Ud·Id·cos φ (theo đại lượng dây) và P = 3·Up·Ip·cos φ (theo đại lượng pha).',
      'Bẫy Oxy hòa tan (DO) trong Thủy sản: Tăng lượng thức ăn khi DO tụt thấp vào lúc rạng sáng (đúng ra phải ngừng/giảm cho ăn và bật tối đa quạt nước/sục khí).',
      'Bẫy Phối trộn Phân bón: Trộn vôi (CaO, Ca(OH)₂) với phân đạm ammonium (NH₄⁺) gây phản ứng giải phóng khí NH₃ làm mất đạm.'
    ],
    coveChecklist: [
      'Trong mạch 3 pha, đã xác định đúng số lớn là Ud (380 V) và số nhỏ là Up (220 V) chưa?',
      'Điện áp đặt vào mỗi pha của tải đã khớp với điện áp định mức pha của tải chưa?',
      'Hệ số √3 (theo dây) và 3 (theo pha) trong công thức dòng điện/công suất đã chính xác chưa?',
      'Trong tình huống Nông - Lâm - Thủy sản, giải pháp đưa ra có đảm bảo cân bằng sinh thái (pH, DO, C/N) và VietGAP không?'
    ],
    fewShot: {
      input: 'Một tải 3 pha đối xứng gồm 3 điện trở $R = 38\\text{ }\\Omega$ nối hình tam giác ($\\Delta$) đấu vào nguồn 3 pha có $U_d = 380\\text{ V}$. Tính dòng điện pha $I_p$ và dòng điện dây $I_d$.',
      output: '- **Tầng 1 (Gợi mở Socrates):** Khi tải nối hình tam giác ($\\Delta$), điện áp pha $U_p$ đặt lên mỗi điện trở $R$ có quan hệ thế nào với điện áp dây $U_d$?\n- **Tầng 2 (Công thức):** Nối $\\Delta \\implies U_p = U_d = 380\\text{ V}$ và $I_d = \\sqrt{3} I_p$.\n- **Tầng 3 (Giải chi tiết):** $I_p = \\frac{U_p}{R} = \\frac{380}{38} = 10\\text{ A} \\implies I_d = 10\\sqrt{3} \\approx 17.32\\text{ A}$.\n- **Tầng 4 (Kiểm chứng CoVe & Bẫy):** Tránh chia $\\sqrt{3}$ khi tính $U_p$ của mạch nối tam giác.'
    },
    sampleProblem: `Một tải ba pha đối xứng gồm 3 điện trở thuần R = 22 Ohm được nối hình tam giác (Delta) và đấu vào nguồn điện ba pha bốn dây có điện áp 220/380 V.\n1. Xác định điện áp pha Up đặt lên mỗi điện trở R.\n2. Tính cường độ dòng điện pha Ip, cường độ dòng điện dây Id và công suất tiêu thụ P của tải ba pha.`
  },

  'giai-chi-tiet': {
    title: 'Kiến trúc sư Sư phạm Giải Chi Tiết Đa Tầng Socrates (/giai-chi-tiet)',
    domainBadge: '🧩 Giải Chi Tiết • Sư Phạm 4 Tầng Socrates & Chống Học Vẹt',
    epistemology: 'Phương pháp Sư phạm Đa tầng Socrates kết hợp Chuỗi suy luận Nguyên lý gốc (First-Principles CoT) và Tự kiểm chứng (CoVe): Khơi mở tư duy -> Bản chất khoa học -> Lời giải tường minh -> Giải mã bẫy & Tự luyện.',
    methodologySteps: [
      'Tầng 1 (Khơi Mở Tư Duy Socrates): Đặt 2–3 câu hỏi định hướng giúp học sinh tự phát hiện dữ kiện ẩn và định lý cốt lõi cần dùng.',
      'Tầng 2 (Bản Chất Khoa Học & Chiến Thuật): Phân tích mô hình khoa học và lý giải tại sao chọn phương pháp giải tối ưu.',
      'Tầng 3 (Lời Giải Tường Minh Từng Bước): Trình bày đầy đủ từng bước biến đổi có căn cứ định lý, 100% LaTeX chuẩn, đơn vị SI và danh pháp IUPAC.',
      'Tầng 4 (Giải Mã Bẫy, CoVe & Bài Tập Tương Tự): Chỉ rõ vì sao các phương án nhiễu lại sai, kiểm nghiệm ngược đáp số và ra 1 bài toán biến thể tự luyện.'
    ],
    traps: [
      'Bẫy Làm tắt nhảy bước (Step-Skipping): Đưa ngay phương trình rút gọn mà không nêu định lý hay điều kiện tương đương.',
      'Bẫy Bỏ quên Điều kiện biên: Không đối chiếu nghiệm tìm được với tập xác định D hoặc điều kiện thực tế (x > 0, T > 0).',
      'Bẫy Bỏ qua Phương án nhiễu: Chỉ giải ra đáp án đúng mà không phân tích cơ chế lừa học sinh của 3 phương án nhiễu còn lại.',
      'Bẫy Sai lệch Đơn vị & Danh pháp: Quên đổi đơn vị về hệ SI hoặc dùng tên hóa học phiên âm cũ.'
    ],
    coveChecklist: [
      'Bài giải đã được trình bày tách bạch và đầy đủ cả 4 tầng Socrates chưa?',
      'Mọi bước biến đổi ở Tầng 3 đã có giải thích căn cứ định lý/định luật rõ ràng chưa?',
      'Đã thay ngược đáp số vào phương trình/mô hình ban đầu để kiểm chứng độ chính xác 100% chưa?',
      'Đã đính kèm 1 bài tập tương tự kèm đáp số ở cuối Tầng 4 để học sinh tự rèn luyện chưa?'
    ],
    fewShot: {
      input: 'Giải phương trình $\\log_2(x - 1) + \\log_2(x + 1) = 3$.',
      output: '- **Tầng 1 (Gợi mở Socrates):** Điều kiện để hai biểu thức logarit có nghĩa là gì? Tổng hai logarit cùng cơ số được gộp lại theo công thức nào?\n- **Tầng 2 (Bản chất):** Điều kiện xác định: $\\begin{cases} x - 1 > 0 \\\\ x + 1 > 0 \\end{cases} \\iff x > 1$. Dùng $\\log_a M + \\log_a N = \\log_a(MN)$.\n- **Tầng 3 (Giải chi tiết):** Phương trình $\\iff \\log_2[(x - 1)(x + 1)] = 3 \\iff x^2 - 1 = 2^3 = 8 \\iff x^2 = 9 \\iff x = 3$ (nhận) hoặc $x = -3$ (loại do $x > 1$). Vậy $S = \\{3\\}$.\n- **Tầng 4 (Kiểm chứng CoVe & Bẫy):** Nếu quên đặt điều kiện $x > 1$, học sinh sẽ kết luận nhầm 2 nghiệm $x = \\pm 3$. *Bài tự luyện:* Giải $\\log_3(x - 2) + \\log_3(x + 6) = 2$ (ĐS: $x = 3$).'
    },
    sampleProblem: `Giải chi tiết bài toán sau theo đầy đủ 4 tầng sư phạm Socrates:\nCho hàm số y = x^3 - 3x^2 + 2. Tìm giá trị lớn nhất và giá trị nhỏ nhất của hàm số trên đoạn [0; 3].`
  },

  'tao-quiz-bgd': {
    title: 'Kiến trúc sư Khảo thí & Đo lường Đánh giá Chuẩn QĐ 764/QĐ-BGDĐT (/tao-quiz-bgd)',
    domainBadge: '🎯 Khảo Thí BGD • Ma Trận Đề Thi 3 Phần QĐ 764 & Distractor Engineering',
    epistemology: 'Thiết kế đề kiểm tra đánh giá năng lực dựa trên Ma trận Đặc tả 3 Phần (Quyết định 764/QĐ-BGDĐT), Kỹ thuật Chế tác Phương án Nhiễu từ Lỗi Tư duy Điển hình (Distractor Engineering) và Barem điểm lũy tiến.',
    methodologySteps: [
      'Bước 1 (Phân Tích Học Liệu & Ma Trận Năng Lực): Bóc tách các đơn vị kiến thức từ tài liệu/chủ đề theo 4 mức độ: Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao.',
      'Bước 2 (Thiết Kế Phần I - Trắc Nghiệm 4 Chọn 1): Tạo câu hỏi kèm 1 đáp án đúng và 3 phương án nhiễu tương ứng với 3 lỗi tính toán/nhận thức phổ biến.',
      'Bước 3 (Thiết Kế Phần II - Đúng/Sai 4 Ý Lũy Tiến): Xây dựng 1 ngữ cảnh thực tiễn/thí nghiệm chung và 4 mệnh đề a (NB), b (TH), c (VD), d (VDC) có thang điểm 0.1 - 0.25 - 0.5 - 1.0đ.',
      'Bước 4 (Thiết Kế Phần III - Trả Lời Ngắn & Hướng Dẫn Chấm): Xây dựng câu hỏi điền số (≤ 4 ký tự) kèm Bảng đáp án và Lời giải giải mã từng phương án nhiễu.'
    ],
    traps: [
      'Bẫy Phương án nhiễu ngây ngô: Tạo các phương án sai quá rõ ràng khiến học sinh không cần tính cũng loại trừ được.',
      'Bẫy Đúng/Sai rời rạc: 4 mệnh đề a, b, c, d không liên kết với phần dẫn chung hoặc đều ở mức nhận biết dễ dãi.',
      'Bẫy Đáp số Phần III quá 4 ký tự: Sinh ra đáp số có hơn 4 ký tự hoặc không nêu rõ quy tắc làm tròn đến hàng thập phân nào.',
      'Bẫy Đề thi mâu thuẫn dữ kiện: Tự gán các con số không tương thích về mặt toán học/vật lý/hóa học.'
    ],
    coveChecklist: [
      'Đề thi đã bao gồm đầy đủ cả 3 phần (Phần I: 4 chọn 1; Phần II: Đúng/Sai 4 ý a,b,c,d; Phần III: Trả lời ngắn) chưa?',
      'Mỗi câu ở Phần I đã đảm bảo có duy nhất 1 phương án đúng và 3 phương án nhiễu có cơ sở tâm lý học chưa?',
      'Tất cả đáp số ở Phần III đã là số nguyên hoặc số thập phân ≤ 4 ký tự và có quy định làm tròn rõ ràng chưa?',
      'Bảng đáp án và Lời giải chi tiết ở cuối đề đã khớp 100% với phép tính kiểm nghiệm độc lập chưa?'
    ],
    fewShot: {
      input: 'Thiết kế 1 câu hỏi Phần II (Đúng/Sai 4 ý lũy tiến) chủ đề Khảo sát hàm số Toán 12.',
      output: '- **Câu hỏi:** Cho hàm số $y = f(x) = x^3 - 3x + 1$. Xét tính Đúng/Sai của các mệnh đề:\n  * **a)** Đạo hàm của hàm số là $f\'(x) = 3x^2 - 3$. *(Nhận biết - ĐÚNG)*\n  * **b)** Hàm số đồng biến trên khoảng $(-1; 1)$. *(Thông hiểu - SAI, vì $f\'(x) < 0$ trên $(-1; 1)$ nên hàm nghịch biến)*\n  * **c)** Giá trị cực đại của hàm số bằng $-1$. *(Vận dụng - SAI, vì tại $x_{CĐ} = -1$ thì $y_{CĐ} = f(-1) = 3$, còn $-1$ là điểm cực đại của hàm số)*\n  * **d)** Phương trình $f(x) = m$ có 3 nghiệm thực phân biệt khi và chỉ khi $-1 < m < 3$. *(Vận dụng cao - ĐÚNG)*'
    },
    sampleProblem: `Hãy thiết kế một đề kiểm tra đánh giá năng lực chuẩn cấu trúc 3 phần theo Quyết định 764/QĐ-BGDĐT (gồm Phần I: 4 câu trắc nghiệm 4 chọn 1; Phần II: 2 câu Đúng/Sai 4 ý lũy tiến a, b, c, d; Phần III: 2 câu Trả lời ngắn điền số) kèm Bảng đáp án và Lời giải giải mã bẫy chi tiết.`
  },

  'slide-thuyet-trinh': {
    title: 'Kiến trúc sư Thiết kế Trình chiếu Sư phạm Marp & HTML 16:9 (/slide-thuyet-trinh)',
    domainBadge: '📊 Slide Marp • Kiến Trúc Trực Quan 16:9, Rule of Six & Mermaid',
    epistemology: 'Thiết kế trình chiếu học thuật dựa trên Lý thuyết Tải nhận thức (Cognitive Load Theory), Quy tắc 6 dòng (Rule of Six), Phân cấp Thị giác (Visual Hierarchy) và Mã hóa Kép (Văn bản cô đọng + Sơ đồ Mermaid + Bảng đối sánh).',
    methodologySteps: [
      'Bước 1 (Cấu Trúc Kịch Bản): Phân bổ nội dung thành chuỗi slide mạch lạc: Slide bìa (Lead Hook) -> Đặt vấn đề -> Cơ sở lý thuyết/Mô hình -> Số liệu/So sánh -> Tổng kết & Tương tác.',
      'Bước 2 (Cô Đọng Theo Rule of Six): Mỗi slide tối đa 6 gạch đầu dòng, mỗi dòng 6–8 từ khóa trọng tâm được tô đậm nổi bật.',
      'Bước 3 (Trực Quan Hóa Bằng Mermaid & Bảng): Chuyển các đoạn văn mô tả quy trình thành sơ đồ Mermaid.js và số liệu thành bảng hoặc thẻ .stat-card.',
      'Bước 4 (Biên Soạn Speaker Notes): Đính kèm lời dẫn thuyết trình chi tiết trong khối chú thích <!-- Speaker Notes: ... --> dưới mỗi slide.'
    ],
    traps: [
      'Bẫy Bức tường chữ (Wall of Text): Nhồi nhét nguyên đoạn văn dài từ SGK lên slide làm người xem quá tải nhận thức.',
      'Bẫy Thiếu Tương phản Màu sắc: Dùng màu chữ và màu nền kém tương phản gây mờ nhòe khi chiếu trên máy chiếu lớp học.',
      'Bẫy Slide Thuần Chữ: Không có bất kỳ bảng biểu, thẻ số liệu hay sơ đồ luồng Mermaid nào minh họa.',
      'Bẫy Thiếu Kịch bản Nói: Không cung cấp Speaker Notes khiến học sinh chỉ biết đứng đọc lại chữ trên màn hình.'
    ],
    coveChecklist: [
      'Mã nguồn đã có đầy đủ cấu hình YAML Frontmatter của Marp (marp: true, size: 16:9, paginate: true) chưa?',
      'Tất cả các slide đã tuân thủ nghiêm ngặt Rule of Six (không quá 6 gạch đầu dòng/slide) chưa?',
      'Đã tích hợp ít nhất 1 sơ đồ Mermaid hợp lệ và 1 bảng đối chiếu trực quan chưa?',
      'Mỗi slide đã có phần <!-- Speaker Notes --> hướng dẫn cách trình bày thuyết phục chưa?'
    ],
    fewShot: {
      input: 'Thiết kế 1 slide Marp giới thiệu Hiệu ứng nhà kính.',
      output: '```markdown\n---\n## 🌍 CƠ CHẾ HIỆU ỨNG NHÀ KÍNH & BIẾN ĐỔI KHÍ HẬU\n- **Bức xạ sóng ngắn** từ Mặt Trời xuyên qua khí quyển làm nóng bề mặt Trái Đất.\n- Mặt Đất phát xạ ngược **tia hồng ngoại sóng dài** trở lại không gian.\n- Các khí nhà kính ($CO_2, CH_4, N_2O$) **hấp thụ và giữ nhiệt** trong tầng đối lưu.\n\n<div class="stat-card"><strong>Cảnh báo:</strong> Nồng độ $CO_2$ vượt ngưỡng <strong>420 ppm</strong>, làm nhiệt độ toàn cầu tăng $\\approx 1.2^\\circ\\text{C}$.</div>\n\n<!-- Speaker Notes: Hãy nhấn mạnh sự khác biệt giữa bức xạ sóng ngắn đi vào và bức xạ hồng ngoại sóng dài bị giữ lại bởi khí CO2. -->\n```'
    },
    sampleProblem: `Thiết kế bộ Slide thuyết trình chuẩn Marp Markdown tỷ lệ 16:9 (gồm 6-8 slides, có bảng so sánh, sơ đồ quy trình Mermaid và Speaker Notes cho từng slide) về chủ đề: "Ứng dụng Trí tuệ nhân tạo (AI) và Chuyển đổi xanh trong Nông nghiệp bền vững tại Việt Nam".`
  },

  'tomtat-mindmap': {
    title: 'Kiến trúc sư Khoa học Nhận thức, Sơ đồ Tư duy Mermaid & Ghi chép Cornell (/tomtat-mindmap)',
    domainBadge: '🧠 Mindmap Mermaid • Siêu Trí Nhớ Cornell 60s & Active Recall',
    epistemology: 'Hệ thống hóa tri thức dựa trên Lý thuyết Mã hóa Kép (Dual-Coding Theory), Phương pháp Ghi chép Cornell (Khái niệm - Bản chất/Công thức - Cạm bẫy) và Truy hồi Chủ động (Active Recall).',
    methodologySteps: [
      'Tầng 1 (Sơ Đồ Tư Duy Mermaid.js): Trích xuất cấu trúc phân cấp của bài học thành sơ đồ mindmap hoặc flowchart TD với cú pháp hợp lệ 100%.',
      'Tầng 2 (Bảng Cornell Cheatsheet 60 Giây): Lập bảng đối chiếu 3 cột: [Khái niệm / Định lý then chốt] | [Công thức & Bản chất khoa học] | [Bẫy phòng thi cần tránh].',
      'Tầng 3 (Chuỗi Flashcards Truy Hồi Chủ Động - Active Recall): Thiết kế 3–5 câu hỏi phản biện buộc não bộ tự truy xuất kiến thức kèm gợi ý ẩn.',
      'Tầng 4 (Mẹo Ghi Nhớ Siêu Tốc - Mnemonics): Cung cấp quy tắc liên tưởng hoặc câu thần chú giúp nhớ nhanh thứ tự/công thức.'
    ],
    traps: [
      'Bẫy Chép nguyên văn dài dòng: Không cô đọng thành từ khóa neo (anchor keywords ≤ 6 từ) làm mất tác dụng của sơ đồ tư duy.',
      'Bẫy Lỗi Cú pháp Mermaid: Đặt ký tự ngoặc đơn (), ngoặc vuông [] hoặc công thức phức tạp không bọc nháy kép làm gãy trình vẽ sơ đồ.',
      'Bẫy Bảng Tóm tắt Thiếu Cột Cảnh báo Bẫy: Chỉ liệt kê định nghĩa mà không chỉ ra các điểm dễ nhầm lẫn khi làm bài thi.',
      'Bẫy Thiếu Câu hỏi Active Recall: Khiến học sinh chỉ đọc thụ động ("quen mắt") mà không kích hoạt vùng ghi nhớ dài hạn.'
    ],
    coveChecklist: [
      'Cú pháp khối ```mermaid ... ``` đã hợp lệ 100% (không chứa ký tự ngoặc chưa thoát trong node) chưa?',
      'Bảng Cheatsheet Cornell đã có đủ 3 cột (Khái niệm | Bản chất & Công thức | Bẫy phòng thi) chưa?',
      'Đã có bộ 3–5 câu hỏi Active Recall ở cuối bản tóm tắt để học sinh tự kiểm tra chưa?',
      '100% công thức và danh pháp trong bảng đã chuẩn LaTeX và IUPAC chưa?'
    ],
    fewShot: {
      input: 'Tóm tắt siêu tốc định luật I Nhiệt động lực học (Vật lí 12).',
      output: '- **Tầng 1 (Sơ đồ Mermaid):** `flowchart LR; A["Định luật I NĐLH: ΔU = Q + A"] --> B["Nhiệt lượng Q (Nhận > 0, Tỏa < 0)"]; A --> C["Công cơ học A (Nhận > 0, Sinh < 0)"];`\n- **Tầng 2 (Bảng Cornell Cheatsheet):**\n  | Đại lượng | Bản chất & Công thức | Bẫy phòng thi |\n  |---|---|---|\n  | Nội năng $\\Delta U$ | $\\Delta U = Q + A\\text{ (J)}$ | Khí giãn nở đẩy pittông $\\implies$ khí thực hiện công $\\implies$ phải lấy $A < 0$! |\n- **Tầng 3 (Active Recall):** *Trong quá trình đẳng tích ($V = \\text{const}$), công $A$ bằng bao nhiêu và $\\Delta U$ phụ thuộc vào đại lượng nào?*'
    },
    sampleProblem: `Hãy tóm tắt toàn diện chuyên đề kiến thức bằng cấu trúc 3 tầng (Tầng 1: Sơ đồ tư duy Mermaid.js; Tầng 2: Bảng Cheatsheet Cornell 60 giây gồm Khái niệm - Công thức - Bẫy phòng thi; Tầng 3: Bộ câu hỏi Active Recall tự kiểm tra).`
  },

  'luan-an-nghiencuu': {
    title: 'Cố vấn Học thuật Nghiên cứu Khoa học Kỹ thuật THPT Chuẩn ViSEF & ISEF (/luan-an-nghiencuu)',
    domainBadge: '🔬 Nghiên Cứu ViSEF • Giả Thuyết H0/H1, Thực Nghiệm Đối Chứng & Phản Biện',
    epistemology: 'Áp dụng Phương pháp Thực nghiệm Khoa học (Scientific Method: Câu hỏi nghiên cứu -> Giả thuyết H₀/H₁ -> Thiết kế Lô đối chứng vs. Lô thực nghiệm -> Thống kê kiểm định) và Quy trình Thiết kế Kỹ thuật (Engineering Design Process) chuẩn hội thi KHKT cấp Quốc gia (ViSEF) và Quốc tế (ISEF).',
    methodologySteps: [
      'Phần I (Đặt Vấn Đề & Giả Thuyết Khoa Học): Xác định tính cấp thiết thực tiễn, điểm mới (Novelty), câu hỏi nghiên cứu và giả thuyết H₀, H₁.',
      'Phần II (Tổng Quan & Thiết Kế Thực Nghiệm Đối Chứng): Xác định Biến độc lập, Biến phụ thuộc, Biến kiểm soát; thiết lập Lô đối chứng (Control) và Lô thực nghiệm (Experimental) với số lần lặp lại N ≥ 3.',
      'Phần III (Xử Lý Số Liệu Thống Kê & Bàn Luận): Trình bày bảng số liệu (Trung bình X̄ ± Độ lệch chuẩn SD), đánh giá độ tin cậy thống kê (p-value) và phân tích sai số.',
      'Phần IV (Kết Luận, Tài Liệu APA 7th & Phản Biện Hội Đồng): Đưa ra kết luận, trích dẫn chuẩn APA 7th và mô phỏng 3–5 câu hỏi chất vấn từ Ban Giám khảo.'
    ],
    traps: [
      'Bẫy Thiếu Lô đối chứng (Control Group): Thiết kế thí nghiệm chỉ có mẫu thử mà không có mẫu đối chứng âm/dương để làm mốc so sánh khoa học.',
      'Bẫy Số liệu Tròn trĩnh Giả tạo: Đưa ra các con số tuyệt đối không có độ lệch chuẩn (± SD) hoặc cỡ mẫu quá nhỏ (N = 1) không có giá trị thống kê.',
      'Bẫy Vi phạm An toàn Sinh học & Khả thi THPT: Đề xuất nuôi cấy vi sinh vật gây bệnh nguy hiểm hoặc dùng thiết bị phân tích vượt quá điều kiện trường THPT.',
      'Bẫy Nhầm lẫn Biến độc lập và Biến phụ thuộc: Không tách bạch được yếu tố người nghiên cứu chủ động thay đổi (biến độc lập) và chỉ số đo đạc kết quả (biến phụ thuộc).'
    ],
    coveChecklist: [
      'Đề cương/Báo cáo đã xác định rõ Giả thuyết khoa học (H₀, H₁) và Điểm mới sáng tạo (Novelty) chưa?',
      'Thiết kế thực nghiệm đã phân định rõ Biến độc lập, Biến phụ thuộc, Biến kiểm soát và Lô đối chứng chưa?',
      'Bảng số liệu minh họa đã biểu diễn dưới dạng Trung bình ± Độ lệch chuẩn (X̄ ± SD) hợp lý chưa?',
      'Đã đính kèm bộ câu hỏi phản biện từ góc nhìn Giám khảo ViSEF và hướng dẫn trả lời chưa?'
    ],
    fewShot: {
      input: 'Thiết kế các biến và lô đối chứng cho đề tài: "Chế tạo màng lọc hấp phụ ion kim loại nặng $Cu^{2+}$ trong nước thải từ phụ phẩm vỏ bưởi".',
      output: '- **Giả thuyết $H_1$:** Pectin và cellulose biến tính từ vỏ bưởi có khả năng hấp phụ $\\ge 85\\%$ ion $Cu^{2+}$ trong dung dịch ở $\\text{pH} = 5.5$.\n- **Hệ thống biến:**\n  * *Biến độc lập:* Liều lượng vật liệu vỏ bưởi biến tính ($1\\text{ g/L}, 2\\text{ g/L}, 5\\text{ g/L}$) và thời gian khuấy ($30, 60, 90\\text{ phút}$).\n  * *Biến phụ thuộc:* Hiệu suất hấp phụ $H(\\%)$ và dung lượng hấp phụ $q_e\\text{ (mg/g)}$.\n  * *Biến kiểm soát:* Nồng độ $Cu^{2+}$ ban đầu ($50\\text{ mg/L}$), nhiệt độ ($25^\\circ\\text{C}$), $\\text{pH} = 5.5$.\n- **Thiết kế đối chứng ($n = 3$ lần lặp):** Lô ĐC1 (Nước chứa $Cu^{2+}$ không có vật liệu); Lô ĐC2 (Than hoạt tính thương mại); Lô TN1–TN3 (Vật liệu vỏ bưởi ở 3 nồng độ).'
    },
    sampleProblem: `Hãy xây dựng Đề cương Nghiên cứu Khoa học Kỹ thuật cấp THPT chuẩn ViSEF (gồm 5 phần: Đặt vấn đề & Giả thuyết H0/H1; Tổng quan & Điểm mới; Thiết kế thực nghiệm có Lô đối chứng và các biến; Bảng số liệu kỳ vọng X ± SD; Câu hỏi phản biện Hội đồng giám khảo) cho đề tài: "Nghiên cứu chế tạo màng bọc thực phẩm phân hủy sinh học kháng khuẩn từ tinh bột hạt mít và dịch chiết lá trầu không".`
  }
};

// ============================================================================
// 5. ĐỘNG CƠ OCR SONG NGỮ (VIE + ENG) & CÁC BỘ PARSER CHUYÊN BIỆT
// ============================================================================

/**
 * 0. Quét chữ thực tế từ hình ảnh bằng Tesseract AI Engine
 * Tự động ưu tiên ngôn ngữ tiếng Việt + tiếng Anh nếu có dữ liệu hoặc fallback an toàn
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

  // Kiểm tra xem có file vie.traineddata cục bộ không để tự động kích hoạt song ngữ vie+eng
  const viePath = path.join(__dirname, '..', 'vie.traineddata');
  const effectiveLang = (lang === 'vie+eng' || fs.existsSync(viePath)) ? 'vie+eng' : 'eng';

  try {
    const result = await Tesseract.recognize(bufferTarget, effectiveLang, {
      errorHandler: e => console.warn('Tesseract notice:', e)
    });

    const text = result && result.data && result.data.text ? result.data.text.trim() : '';
    const confidence = result && result.data && result.data.confidence ? Math.round(result.data.confidence) : 0;

    return { rawText: text, confidence, langUsed: effectiveLang };
  } catch (err) {
    // Fallback về 'eng' nếu gói ngôn ngữ mở rộng chưa sẵn sàng
    if (effectiveLang !== 'eng') {
      try {
        const fallbackRes = await Tesseract.recognize(bufferTarget, 'eng');
        const text = fallbackRes && fallbackRes.data && fallbackRes.data.text ? fallbackRes.data.text.trim() : '';
        const confidence = fallbackRes && fallbackRes.data && fallbackRes.data.confidence ? Math.round(fallbackRes.data.confidence) : 0;
        return { rawText: text, confidence, langUsed: 'eng' };
      } catch (innerErr) {
        return { rawText: '', confidence: 0, error: innerErr.message };
      }
    }
    console.warn('Tesseract scan warning:', err.message);
    return { rawText: '', confidence: 0, error: err.message };
  }
}

/**
 * 1. Toán học: Chuẩn hóa công thức sang LaTeX an toàn
 * Bảo vệ tuyệt đối URL (https://...), ngày tháng (20/10/2026), đơn vị (m/s, km/h) và từ ghép tiếng Việt (Đúng/Sai, anh/chị)
 */
function formatMathToLatex(rawText) {
  if (!rawText) return '';
  let text = rawText.trim();

  // Bước 1: Bảo vệ các mẫu không phải phân số toán học (URL, ngày tháng, đơn vị đo, từ ghép tiếng Việt)
  const protectedTokens = [];
  const protect = (match) => {
    const token = `__PROTECTED_TOKEN_${protectedTokens.length}__`;
    protectedTokens.push(match);
    return token;
  };

  // Bảo vệ URL
  text = text.replace(/https?:\/\/[^\s)]+/gi, protect);
  // Bảo vệ ngày tháng năm dạng DD/MM/YYYY hoặc DD/MM hoặc tháng/năm (ví dụ 20/10/2026, 6/3/1946, 30/4/1975, 1945/1975)
  text = text.replace(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g, protect);
  text = text.replace(/\b(0?[1-9]|[12]\d|3[01])\/(0?[1-9]|1[0-2])\b/g, protect);
  text = text.replace(/\b(1[89]\d{2}|20\d{2})\/(1[89]\d{2}|20\d{2})\b/g, protect);
  // Bảo vệ các đơn vị vật lý/hóa học/địa lý thông dụng và ký hiệu điện áp 220/380 V
  text = text.replace(/\b(m\/s\^?2|m\/s|km\/h|rad\/s|g\/mol|mol\/L|mol\/l|mg\/L|mg\/l|tạ\/ha|tấn\/ha|người\/km2|người\/km\^2|J\/kg|W\/m2|220\/380\s*V?|380\/220\s*V?|50\/30\/20)\b/gi, protect);
  // Bảo vệ các cụm từ tiếng Việt có dấu gạch chéo (Đúng/Sai, và/hoặc, anh/chị, học sinh/sinh viên, Đ/S)
  text = text.replace(/(Đúng\/Sai|đúng\/sai|Đ\/S|anh\/chị|Anh\/Chị|và\/hoặc|trội\/lặn|nam\/nữ|xuất\/nhập|cung\/cầu)/g, protect);

  // Bước 2: Chuyển đổi phân số toán học rõ ràng
  // Phân số có ngoặc: (2x - 1)/(x + 1) -> \frac{2x - 1}{x + 1}
  text = text.replace(/\(([^()]+)\)\/\(([^()]+)\)/g, '\\frac{$1}{$2}');
  // Phân số đại số chứa biến x, y, z, n, t, a, b, c hoặc số ngắn (ví dụ 2x/3, 1/2, 3/4, a/b)
  text = text.replace(/\b([0-9]*[a-zA-Z]|[0-9]{1,3})\/([0-9]*[a-zA-Z]|[0-9]{1,3})\b/g, '\\frac{$1}{$2}');

  // Bước 3: Số mũ, căn thức, giới hạn, vector, tích phân
  text = text.replace(/\^([0-9a-zA-Z\+\-]+)/g, '^{$1}');
  text = text.replace(/(?:sqrt|căn)\(([^)]+)\)/gi, '\\sqrt{$1}');
  text = text.replace(/(?:sqrt|căn)\s*([a-zA-Z0-9]+)/gi, '\\sqrt{$1}');
  text = text.replace(/lim\s*x\s*->\s*(\+?oo|\+?inf)/gi, '\\lim_{x \\to +\\infty}');
  text = text.replace(/lim\s*x\s*->\s*(-oo|-inf)/gi, '\\lim_{x \\to -\\infty}');
  text = text.replace(/lim\s*x\s*->\s*([a-zA-Z0-9\+\-]+)/gi, '\\lim_{x \\to $1}');
  text = text.replace(/vec\(([a-zA-Z0-9]+)\)/gi, '\\vec{$1}');
  text = text.replace(/int_([0-9a-zA-Z\+\-]+)\^([0-9a-zA-Z\+\-]+)/g, '\\int_{$1}^{$2}');

  // Kí tự Hy Lạp
  text = text.replace(/\bDelta\b/g, '\\Delta');
  text = text.replace(/\balpha\b/g, '\\alpha');
  text = text.replace(/\bbeta\b/g, '\\beta');
  text = text.replace(/\bpi\b/g, '\\pi');

  // Bước 4: Khôi phục các token đã bảo vệ
  protectedTokens.forEach((original, idx) => {
    text = text.replace(`__PROTECTED_TOKEN_${idx}__`, original);
  });

  // Phương án trắc nghiệm A, B, C, D ở đầu dòng
  text = text.replace(/(^|\n)\s*([A-D])[\.\)]\s+/g, '$1**$2.** ');

  return text;
}

/**
 * 2. Vật lí: Chuẩn hóa đơn vị SI, đại lượng & chu trình
 */
function formatPhysicsToSI(rawText) {
  if (!rawText) return '';
  let text = rawText.trim();

  SI_UNITS.forEach(item => {
    text = text.replace(item.raw, item.si);
  });

  text = text.replace(/([0-9]+)\s*K\b/g, '$1\\text{ K}');
  text = text.replace(/([0-9]+)\s*oC\b/gi, '$1^\\circ\\text{C}');
  text = text.replace(/([0-9]+)\s*Pa\b/g, '$1\\text{ Pa}');
  text = text.replace(/([0-9]+)\s*atm\b/g, '$1\\text{ atm}');
  text = text.replace(/([0-9]+)\s*N\b/g, '$1\\text{ N}');
  text = text.replace(/([0-9]+)\s*J\b/g, '$1\\text{ J}');
  text = text.replace(/(^|\n)\s*([A-D])[\.\)]\s+/g, '$1**$2.** ');

  return text;
}

/**
 * 3. Hóa học: Chuẩn hóa danh pháp tiếng Việt cũ sang IUPAC tiếng Anh & công thức
 */
function formatChemistryToIUPAC(rawText) {
  if (!rawText) return '';
  let text = rawText.trim();

  IUPAC_DICTIONARY.forEach(entry => {
    text = text.replace(entry.vn, entry.iupac);
  });

  text = text.replace(/\bDelta\s*r\s*H\s*0\s*298\b/gi, '$\\Delta_r H^\\circ_{298}$');
  text = text.replace(/\bDelta\s*f\s*H\s*0\s*298\b/gi, '$\\Delta_f H^\\circ_{298}$');
  text = text.replace(/([0-9]+)\s*oC\b/gi, '$1^\\circ\\text{C}');
  text = text.replace(/(^|\n)\s*([A-D])[\.\)]\s+/g, '$1**$2.** ');

  return text;
}

/**
 * 4. Ngữ văn: Chuẩn hóa cấu trúc Đọc hiểu & Nghị luận
 */
function formatLiteratureReading(rawText) {
  if (!rawText) return '';
  let text = rawText.trim();

  text = text.replace(/(Câu\s+[0-9]+[\.\:])/gi, '\n**$1**');
  text = text.replace(/(Phần\s+[I|V|X]+[\.\:])/gi, '\n### $1');

  return text.trim();
}

/**
 * 5. Sinh học: Chuẩn hóa đơn vị di truyền phân tử & bài toán quy luật
 */
function formatBiologyToGenetics(rawText) {
  if (!rawText) return '';
  let text = rawText.trim();
  text = text.replace(/([0-9]+)\s*Angstrom\b/gi, '$1\\text{ \\AA}');
  text = text.replace(/([0-9]+)\s*nm\b/gi, '$1\\text{ nm}');
  text = text.replace(/\bDelta\s*L\b/gi, '$\\Delta L$');
  text = text.replace(/(^|\n)\s*([A-D])[\.\)]\s+/g, '$1**$2.** ');
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

// ============================================================================
// 4B. TỪ ĐIỂN BẪY LỖI CHÍNH TẢ TIẾNG ANH & BỘ PARSER HỌC THUẬT (WORD FORMATION)
// ============================================================================
const COMMON_ENGLISH_SPELLING_CORRECTIONS = [
  { wrong: /\bacheive\b/gi, right: 'achieve', rule: 'i before e except after c' },
  { wrong: /\bacheivement\b/gi, right: 'achievement', rule: 'achieve + ment -> achievement (i trước e)' },
  { wrong: /\bacheivements\b/gi, right: 'achievements', rule: 'achieve + ments -> achievements' },
  { wrong: /\bacheived\b/gi, right: 'achieved', rule: 'achieve + d -> achieved' },
  { wrong: /\bacheiving\b/gi, right: 'achieving', rule: 'achieve + ing -> achieving' },
  { wrong: /\bacheiver\b/gi, right: 'achiever', rule: 'achieve + r -> achiever' },
  { wrong: /\bacheivers\b/gi, right: 'achievers', rule: 'achieve + rs -> achievers' },
  { wrong: /\brecieve\b/gi, right: 'receive', rule: 'i before e except after c (sau c dùng ei)' },
  { wrong: /\brecieving\b/gi, right: 'receiving', rule: 'receiving' },
  { wrong: /\brecieved\b/gi, right: 'received', rule: 'received' },
  { wrong: /\breciept\b/gi, right: 'receipt', rule: 'receipt' },
  { wrong: /\bseperate\b/gi, right: 'separate', rule: 'sep-a-rate (không phải sep-e-rate)' },
  { wrong: /\bseperately\b/gi, right: 'separately', rule: 'separately' },
  { wrong: /\bseperation\b/gi, right: 'separation', rule: 'separation' },
  { wrong: /\boccurance\b/gi, right: 'occurrence', rule: 'occurrence (nhân đôi c và r)' },
  { wrong: /\boccured\b/gi, right: 'occurred', rule: 'occurred (nhân đôi r)' },
  { wrong: /\boccuring\b/gi, right: 'occurring', rule: 'occurring (nhân đôi r)' },
  { wrong: /\bmaintainance\b/gi, right: 'maintenance', rule: 'maintain -> maintenance (đổi ai thành e)' },
  { wrong: /\bpronounciation\b/gi, right: 'pronunciation', rule: 'pronounce -> pronunciation (bỏ o)' },
  { wrong: /\benviroment\b/gi, right: 'environment', rule: 'environment (có âm n giữa)' },
  { wrong: /\benviromental\b/gi, right: 'environmental', rule: 'environmental' },
  { wrong: /\baccomodate\b/gi, right: 'accommodate', rule: 'accommodate (2 chữ c, 2 chữ m)' },
  { wrong: /\baccomodation\b/gi, right: 'accommodation', rule: 'accommodation' },
  { wrong: /\bembarass\b/gi, right: 'embarrass', rule: 'embarrass (2 chữ r, 2 chữ s)' },
  { wrong: /\bdefinately\b/gi, right: 'definitely', rule: 'definitely (gốc finite)' },
  { wrong: /\bsuccessfull\b/gi, right: 'successful', rule: 'successful (hậu tố -ful chỉ có 1 chữ l)' },
  { wrong: /\bindependant\b/gi, right: 'independent', rule: 'independent (đuôi -ent)' },
  { wrong: /\bpriviledge\b/gi, right: 'privilege', rule: 'privilege (không có d)' },
  { wrong: /\bexistance\b/gi, right: 'existence', rule: 'existence (đuôi -ence)' },
  { wrong: /\bcalender\b/gi, right: 'calendar', rule: 'calendar (đuôi -ar)' },
  { wrong: /\bneccessary\b/gi, right: 'necessary', rule: 'necessary (1 chữ c, 2 chữ s)' },
  { wrong: /\boppurtunity\b/gi, right: 'opportunity', rule: 'opportunity (o-p-p-o-r)' }
];

/**
 * 7. Tiếng Anh: Chuẩn hóa ngữ liệu học thuật, sửa bẫy lỗi chính tả phổ biến (Spelling Traps)
 * và mở rộng các truy vấn từ vựng ngắn (Word Formation Scaffolding)
 */
function formatEnglishAcademic(rawText) {
  if (!rawText) return '';
  let text = rawText.trim();

  // 1. Tự động rà soát và sửa các lỗi chính tả kinh điển trong đề thi THPT (Spelling Traps)
  COMMON_ENGLISH_SPELLING_CORRECTIONS.forEach(entry => {
    text = text.replace(entry.wrong, entry.right);
  });

  // 2. Định dạng phương án trắc nghiệm A, B, C, D ở đầu dòng
  text = text.replace(/(^|\n)\s*([A-D])[\.\)]\s+/g, '$1**$2.** ');

  // 3. Nếu là câu hỏi cực ngắn hoặc chỉ chứa 1-5 từ (ví dụ hỏi từ vựng, từ loại "achieve", "danh từ của achieve")
  // Bổ sung chỉ thị sư phạm bắt buộc triển khai cấu trúc Word Formation 4 chiều, cấm trả lời 1 từ cụt lủn.
  const isShortWordQuery = text.split(/\s+/).length <= 6 && !text.includes('**A.**') && !text.includes('\n');
  if (isShortWordQuery) {
    text += `\n\n[CHỈ THỊ SƯ PHẠM BẮT BUỘC]: Câu hỏi này yêu cầu giải thích từ vựng/biến thể từ loại (Word Formation). AI TUYỆT ĐỐI KHÔNG ĐƯỢC chỉ trả lời 1 từ đơn lẻ. Bắt buộc cung cấp:\n1. Bảng họ từ (Word Family Matrix: Verb - Noun - Adj - Adv).\n2. Phiên âm quốc tế IPA Oxford chuẩn xác (kèm vị trí dấu trọng âm).\n3. Quy tắc chính tả (Spelling Rules) chống nhầm lẫn âm/chữ cái (ví dụ: "i before e except after c").\n4. Cụm từ cố định (Collocations) và 1 câu ví dụ thực tế chuẩn SGK Global Success.`;
  }

  return text;
}

/**
 * 8. Lịch sử: Chuẩn hóa tư liệu lịch sử, bảo toàn mốc niên đại & chống cụt ngủn
 */
function formatHistoryChronology(rawText) {
  if (!rawText) return '';
  let text = rawText.trim();
  text = text.replace(/(^|\n)\s*([A-D])[\.\)]\s+/g, '$1**$2.** ');
  const isShortQuery = text.split(/\s+/).length <= 10 && !text.includes('**A.**') && !text.includes('\n');
  if (isShortQuery) {
    text += `\n\n[CHỈ THỊ SƯ PHẠM BẮT BUỘC]: Câu hỏi lịch sử ngắn. AI TUYỆT ĐỐI KHÔNG ĐƯỢC chỉ trả lời 1 mốc năm hay 1 dòng trần trụi. Bắt buộc triển khai:\n1. Bối cảnh lịch sử và nguyên nhân sâu xa / trực tiếp.\n2. Diễn biến trọng tâm và tính chất bước ngoặt của sự kiện.\n3. Kết quả, Ý nghĩa lịch sử & Bài học kinh nghiệm đối với cách mạng Việt Nam.`;
  }
  return text;
}

/**
 * 9. Địa lí: Chuẩn hóa bảng số liệu, đơn vị tính toán & chống cụt ngủn
 */
function formatGeographyStats(rawText) {
  if (!rawText) return '';
  let text = rawText.trim();
  text = text.replace(/(^|\n)\s*([A-D])[\.\)]\s+/g, '$1**$2.** ');
  text = text.replace(/\bta\/ha\b/gi, 'tạ/ha');
  text = text.replace(/\btan\/ha\b/gi, 'tấn/ha');
  text = text.replace(/\bkm2\b/gi, 'km²');
  const isShortQuery = text.split(/\s+/).length <= 10 && !text.includes('**A.**') && !text.includes('\n');
  if (isShortQuery) {
    text += `\n\n[CHỈ THỊ SƯ PHẠM BẮT BUỘC]: Câu hỏi địa lí định lượng/khái niệm ngắn. AI TUYỆT ĐỐI KHÔNG ĐƯỢC chỉ đưa ra con số trần trụi. Bắt buộc:\n1. Nêu rõ công thức địa lí định lượng và quy đổi đơn vị chuẩn trước khi tính.\n2. Thay số và tính toán từng bước, làm tròn chuẩn hàng thập phân.\n3. Rút ra nhận xét địa lí bản chất dựa trên số liệu vừa tính.`;
  }
  return text;
}

/**
 * 10. KTPL: Chuẩn hóa phân tích tình huống pháp lý & vĩ mô
 */
function formatLegalScenario(rawText) {
  if (!rawText) return '';
  let text = rawText.trim();
  text = text.replace(/(^|\n)\s*([A-D])[\.\)]\s+/g, '$1**$2.** ');
  const isShortQuery = text.split(/\s+/).length <= 10 && !text.includes('**A.**') && !text.includes('\n');
  if (isShortQuery) {
    text += `\n\n[CHỈ THỊ SƯ PHẠM BẮT BUỘC]: Câu hỏi KTPL ngắn. AI TUYỆT ĐỐI KHÔNG ĐƯỢC chỉ nêu 1 tên quyền hay 1 phán quyết cụt lủn. Bắt buộc:\n1. Phân tích Ma trận Chủ thể - Hành vi - Khách thể xâm phạm.\n2. Đối chiếu 4 hình thức thực hiện pháp luật (Sử dụng, Thi hành, Tuân thủ, Áp dụng).\n3. Kết luận căn cứ pháp lý và chế tài tương ứng theo quy định pháp luật.`;
  }
  return text;
}

/**
 * 11. Công nghệ: Chuẩn hóa thông số kỹ thuật điện - điện tử
 */
function formatTechnologySpecs(rawText) {
  if (!rawText) return '';
  let text = rawText.trim();
  text = text.replace(/(^|\n)\s*([A-D])[\.\)]\s+/g, '$1**$2.** ');
  text = text.replace(/([0-9]+)\s*V\b/g, '$1 V');
  text = text.replace(/([0-9]+)\s*Hz\b/g, '$1 Hz');
  text = text.replace(/([0-9]+)\s*kW\b/g, '$1 kW');
  const isShortQuery = text.split(/\s+/).length <= 10 && !text.includes('**A.**') && !text.includes('\n');
  if (isShortQuery) {
    text += `\n\n[CHỈ THỊ SƯ PHẠM BẮT BUỘC]: Câu hỏi kỹ thuật ngắn. AI TUYỆT ĐỐI KHÔNG ĐƯỢC trả lời cụt lủn 1 dòng. Bắt buộc:\n1. Trình bày sơ đồ khối chức năng và nguyên lý biến đổi năng lượng/tín hiệu.\n2. Phân tích các thông số kỹ thuật định mức và quy trình công nghệ.\n3. Nêu các biện pháp an toàn kỹ thuật lao động bắt buộc.`;
  }
  return text;
}

/**
 * 12. Meta-Tools: Chuẩn hóa đề kiểm tra BGD 2025, Mindmap, Slide, Luận án
 */
function formatMetaToolsStandard(rawText, subject) {
  if (!rawText) return '';
  let text = rawText.trim();
  text = text.replace(/(^|\n)\s*([A-D])[\.\)]\s+/g, '$1**$2.** ');
  return text;
}

/**
 * Xử lý đa năng theo kỹ năng/môn học chuyên biệt (16 kỹ năng chuẩn BGD 2026)
 */
function processTextBySubject(rawText, subject) {
  const profile = SKILL_DEEP_PROFILES[subject];
  const badge = profile ? profile.domainBadge : '📚 Đa Môn THPT • Chuẩn GDPT 2018';

  switch (subject) {
    case 'toan-thpt':
      return { formattedText: formatMathToLatex(rawText), domainBadge: badge };
    case 'vat-li-thpt':
      return { formattedText: formatPhysicsToSI(rawText), domainBadge: badge };
    case 'hoa-hoc-thpt':
      return { formattedText: formatChemistryToIUPAC(rawText), domainBadge: badge };
    case 'sinh-hoc-thpt':
      return { formattedText: formatBiologyToGenetics(rawText), domainBadge: badge };
    case 'ngu-van-thpt':
      return { formattedText: formatLiteratureReading(rawText), domainBadge: badge };
    case 'tin-hoc-thpt':
      return { formattedText: formatInformaticsCode(rawText), domainBadge: badge };
    case 'tieng-anh-thpt':
      return { formattedText: formatEnglishAcademic(rawText), domainBadge: badge };
    case 'lich-su-thpt':
      return { formattedText: formatHistoryChronology(rawText), domainBadge: badge };
    case 'dia-li-thpt':
      return { formattedText: formatGeographyStats(rawText), domainBadge: badge };
    case 'ktpl-thpt':
      return { formattedText: formatLegalScenario(rawText), domainBadge: badge };
    case 'cong-nghe-thpt':
      return { formattedText: formatTechnologySpecs(rawText), domainBadge: badge };
    case 'giai-chi-tiet':
      return { formattedText: formatMathToLatex(rawText), domainBadge: badge };
    case 'tao-quiz-bgd':
    case 'slide-thuyet-trinh':
    case 'tomtat-mindmap':
    case 'luan-an-nghiencuu':
    default:
      return { formattedText: formatMetaToolsStandard(rawText, subject), domainBadge: badge };
  }
}

/**
 * ============================================================================
 * 4C. ĐỘNG CƠ TẠO CHỈ THỊ THỰC THI CHUYÊN BIỆT & CHỐNG CỤT NGỦN CHO CẢ 16 SKILLS
 * ============================================================================
 */
function getDomainExecutionMandates(subject) {
  const universalAntiTerse = `1. **QUY TẮC CHỐNG TRẢ LỜI CỤT NGỦN (ZERO-BARE-ANSWER POLICY - BẮT BUỘC TOÀN HỆ THỐNG):** Tuyệt đối KHÔNG ĐƯỢC chỉ trả lời 1 từ, 1 con số, 1 ký hiệu hay 1 dòng đáp án trơ trọi (kể cả với câu hỏi trắc nghiệm, điền số, hỏi nhanh hay biến đổi từ). Bắt buộc triển khai đầy đủ 4 tầng sư phạm Socrates (Tầng 1: Gợi mở Socrates; Tầng 2: Bản chất/Công thức gốc; Tầng 3: Biến đổi tường minh chi tiết; Tầng 4: Kiểm chứng CoVe & Bẫy).`;

  switch (subject) {
    case 'toan-thpt':
      return [
        universalAntiTerse,
        `2. **KHÓA TẬP XÁC ĐỊNH & BẢO TOÀN BIẾN ĐỔI TƯƠNG ĐƯƠNG (AXIOMATIC RIGOR):** Luôn xác lập tập xác định D trước mọi phép tính. Bảo toàn phép biến đổi tương đương (\\iff), loại trừ nghiệm ngoại lai và kiểm tra điều kiện biên.`,
        `3. **CHUẨN TRÌNH BÀY LATEX & ĐỊNH DẠNG KHẢO THÍ BGD 2026:** 100% biểu thức toán học viết bằng LaTeX ($...$ hoặc $$...$$). Phân biệt rành mạch hoành độ x, giá trị hàm số y = f(x) và tọa độ điểm M(x; y). Đáp án phần Trả lời ngắn phải làm tròn chuẩn và ≤ 4 ký tự.`
      ].join('\n');

    case 'vat-li-thpt':
      return [
        universalAntiTerse,
        `2. **CHUẨN HÓA THỨ NGUYÊN & HỆ ĐƠN VỊ SI (DIMENSIONAL INTEGRITY):** 100% dữ kiện phải đổi về đơn vị SI trước khi tính toán (T(K) = t(°C) + 273; 1 L = 10⁻³ m³; p(Pa)). Rút biểu thức chữ tổng quát tường minh trước khi thay số.`,
        `3. **KIỂM SOÁT DẤU NĂNG LƯỢNG & ĐỊNH LUẬT BẢO TOÀN:** Kiểm soát dấu trong Định luật I NĐLH ΔU = Q + A (khí sinh công A < 0, tỏa nhiệt Q < 0) và định luật bảo toàn động lượng, cơ năng, điện tích.`
      ].join('\n');

    case 'hoa-hoc-thpt':
      return [
        universalAntiTerse,
        `2. **CHUẨN HÓA 100% DANH PHÁP QUỐC TẾ IUPAC TIẾNG ANH (GDPT 2018):** Mọi tên đơn chất, hợp chất và gốc chức phải viết bằng tiếng Anh IUPAC (sodium, copper, hydrochloric acid, ethanoic acid, methyl methacrylate...). Tuyệt đối không dùng tên cũ phiên âm.`,
        `3. **HỆ 4 BẢO TOÀN VI MÔ & ĐIỀU KIỆN CHUẨN MỚI:** Sử dụng bảo toàn mol electron, bảo toàn nguyên tố, bảo toàn điện tích và bảo toàn khối lượng. Thể tích mol khí ở đkc mới (25°C, 1 bar) là 24.79 L/mol (không chia 22.4).`
      ].join('\n');

    case 'sinh-hoc-thpt':
      return [
        universalAntiTerse,
        `2. **KIỂM SOÁT PHÂN CỰC ĐẠI PHÂN TỬ (3'→5' / 5'→3'):** Ghi rõ chiều của mạch khuôn DNA và mRNA trong phiên mã, dịch mã. Phân tích tách riêng từng cặp gen trước khi nhân tích xác suất.`,
        `3. **XÁC SUẤT CÓ ĐIỀU KIỆN QUẦN THỂ (Hardy-Weinberg) & PHẢ HỆ:** Xác định chính xác không gian mẫu (mẫu số là toàn thể quần thể hay chỉ nhóm kiểu hình trội/bình thường). Phân biệt số loại giao tử của 1 tế bào vs 1 cơ thể.`
      ].join('\n');

    case 'ngu-van-thpt':
      return [
        universalAntiTerse,
        `2. **ĐỌC HIỂU ĐỦ 3 LỚP ĂN ĐIỂM BAREM BGD:** Phân tích biện pháp tu từ phải đủ 3 lớp: (1) Chỉ ra từ ngữ chứa biện pháp -> (2) Tác dụng nghệ thuật (nhịp điệu, gợi cảm) -> (3) Tác dụng nội dung (tư tưởng, cảm xúc).`,
        `3. **CHUẨN HÌNH THỨC NLXH 200 CHỮ & MÃ THỂ LOẠI NLVH:** Đoạn NLXH 200 chữ bắt buộc viết trong ĐÚNG 1 ĐOẠN VĂN DUY NHẤT (tuyệt đối không xuống dòng); bài NLVH 600 chữ phải phân tích theo mã thể loại (cấu tứ, thi ảnh, điểm nhìn), triệt tiêu lỗi diễn xuôi văn bản.`
      ].join('\n');

    case 'tieng-anh-thpt':
      return [
        universalAntiTerse,
        `2. **CHUẨN CHÍNH TẢ & TỪ ĐIỂN OXFORD (ORTHOGRAPHIC HONESTY):** Mọi từ ngữ tiếng Anh phải được rà soát chính tả từng ký tự 100% theo từ điển Oxford OALD. Kiểm tra kỹ các bẫy đổi vị trí ký tự i/e (quy tắc "i before e except after c": achieve -> achievement, KHÔNG viết *acheivement; receive -> receipt) và nhân đôi phụ âm.`,
        `3. **CẤU TRÚC HỌ TỪ VỰNG (WORD FORMATION MATRIX):** Nếu câu hỏi liên quan đến từ vựng hoặc chuyển đổi từ loại, BẮT BUỘC cung cấp bảng đầy đủ: Verb, Noun, Adj, Adv, Phiên âm IPA Oxford, Collocations thông dụng và 1 câu ví dụ chuẩn ngữ cảnh GDPT 2018.`
      ].join('\n');

    case 'lich-su-thpt':
      return [
        universalAntiTerse,
        `2. **PHÊ PHÁN TƯ LIỆU GỐC & CHUẨN XÁC NIÊN ĐẠI:** Bảo toàn chính xác mốc thời gian (ngày, tháng, năm). Đối chiếu kép giữa văn bản tư liệu gốc với bối cảnh lịch sử của thời kỳ.`,
        `3. **CHUỖI NHÂN - QUẢ & CHỐNG BẪY TUYỆT ĐỐI HÓA:** Tách bạch Bối cảnh -> Nguyên nhân -> Diễn biến bước ngoặt -> Ý nghĩa & Bài học lịch sử. Bác bỏ các phương án mang từ khóa cực đoan ("duy nhất", "hoàn toàn xóa bỏ ngay").`
      ].join('\n');

    case 'dia-li-thpt':
      return [
        universalAntiTerse,
        `2. **CÔNG THỨC ĐỊNH LƯỢNG & ĐỒNG NHẤT ĐƠN VỊ ĐỊA LÍ:** Nêu rõ công thức tính toán và đơn vị đo lường (tạ/ha vs tấn/ha, % vs điểm phần trăm). Phân biệt bản chất giữa Tỉ trọng (%) và Quy mô tuyệt đối.`,
        `3. **KIỂM CHỨNG BẢNG SỐ LIỆU & NHẬN DIỆN BIỂU ĐỒ:** Rà soát từng năm trung gian trước khi kết luận tăng/giảm liên tục. Nhận diện chuẩn dạng biểu đồ (Đường: tốc độ tăng trưởng; Tròn: cơ cấu ≤ 3 năm; Miền: chuyển dịch cơ cấu ≥ 4 năm).`
      ].join('\n');

    case 'ktpl-thpt':
      return [
        universalAntiTerse,
        `2. **MA TRẬN GIẢI PHẪU TÌNH HUỐNG PHÁP LÝ:** Tách riêng hành vi của từng nhân vật (Chủ thể - Hành vi - Khách thể xâm phạm - Hình thức thực hiện - Chế tài).`,
        `3. **CHUẨN HÓA KHÁI NIỆM PHÁP LUẬT & KINH TẾ VĨ MÔ:** Phân biệt rành mạch "Sử dụng pháp luật" (quyền) vs "Thi hành pháp luật" (nghĩa vụ); phân biệt xâm phạm "thân thể" (bắt nhốt) vs "tính mạng, sức khỏe" (đánh đập) vs "danh dự, nhân phẩm" (vu khống).`
      ].join('\n');

    case 'tin-hoc-thpt':
      return [
        universalAntiTerse,
        `2. **MINH BẠCH BẢNG VẾT THỰC THI (STATE TRACE TABLE):** Kẻ bảng theo dõi giá trị biến số qua từng bước lặp thuật toán Python hoặc thứ tự thực thi mệnh đề SQL.`,
        `3. **CHUẨN PEP 8 & ĐÁNH GIÁ ĐỘ PHỨC TẠP O(N):** Viết code Python chuẩn mực, chú ý quy tắc nửa khoảng [start, stop) của range() và tính biến đổi của danh sách; phân tích độ phức tạp thời gian/không gian Big-O.`
      ].join('\n');

    case 'cong-nghe-thpt':
      return [
        universalAntiTerse,
        `2. **PHÂN TÍCH SƠ ĐỒ KHỐI & NGUYÊN LÝ HOẠT ĐỘNG:** Giải thích cấu trúc mạch điện - điện tử hoặc quy trình công nghệ theo sơ đồ khối chức năng tường minh.`,
        `3. **THÔNG SỐ ĐỊNH MỨC & QUY TẮC AN TOÀN KỸ THUẬT:** Nêu rõ ý nghĩa các thông số kỹ thuật (U, I, P, f) và các tiêu chuẩn bảo vệ an toàn điện/công nghiệp bắt buộc.`
      ].join('\n');

    case 'giai-chi-tiet':
      return [
        universalAntiTerse,
        `2. **GIẢI PHẪU ĐỀ THEO BAREM CHUẨN 0.25 ĐIỂM:** Chia nhỏ bài giải theo barem chấm của Bộ GD&ĐT, chỉ rõ từng bước để học sinh giành trọn vẹn điểm số.`,
        `3. **GIẢI MÃ PHƯƠNG ÁN NHIỄU:** Với câu trắc nghiệm, giải thích cặn kẽ tại sao các phương án còn lại sai (sai bản chất, sai công thức hay bẫy số liệu).`
      ].join('\n');

    case 'tao-quiz-bgd':
      return [
        universalAntiTerse,
        `2. **CHUẨN CẤU TRÚC 3 PHẦN KHẢO THÍ BGD 2025 (QĐ 764):** Xây dựng câu hỏi đủ Phần I (Trắc nghiệm 4 chọn 1), Phần II (Trắc nghiệm Đúng/Sai 4 ý a-b-c-d) và Phần III (Trả lời ngắn).`,
        `3. **MA TRẬN NĂNG LỰC & ĐÁP ÁN KÈM BAREM:** Ghi rõ cấp độ nhận thức (Biết, Hiểu, Vận dụng) và cung cấp bảng đáp án chi tiết cho từng câu.`
      ].join('\n');

    case 'tomtat-mindmap':
      return [
        universalAntiTerse,
        `2. **TRỰC QUAN HÓA BẰNG MERMAID MARKDOWN HỢP LỆ:** Cung cấp khối mã sơ đồ tư duy Mermaid (flowchart TD hoặc mindmap) có cú pháp chuẩn, render mượt mà.`,
        `3. **BẢNG TỔNG KẾT CORNELL & TỪ KHÓA CỐT LÕI:** Tổng hợp kiến thức trọng tâm theo phương pháp Cornell (Keywords - Core Notes - Summary).`
      ].join('\n');

    case 'luan-an-nghiencuu':
      return [
        universalAntiTerse,
        `2. **CẤU TRÚC HỌC THUẬT CHUẨN IMRAD:** Triển khai theo cấu trúc nghiên cứu chuẩn quốc tế: Introduction - Methods - Results - And - Discussion.`,
        `3. **PHƯƠNG PHÁP LUẬN & ĐẠO ĐỨC HỌC THUẬT:** Nêu rõ phương pháp thu thập dữ liệu, cỡ mẫu và kiểm định giả thuyết thống kê, không đạo văn.`
      ].join('\n');

    case 'slide-thuyet-trinh':
      return [
        universalAntiTerse,
        `2. **CẤU TRÚC BỘ SLIDE 10 TRANG CHUYÊN NGHIỆP:** Thiết kế bố cục Slide mạch lạc: Tiêu đề -> Vấn đề -> Giải pháp -> Dữ liệu -> Kết luận/Kêu gọi hành động.`,
        `3. **LỜI THOẠI DIỄN THUYẾT (SPEAKER NOTES):** Kèm lời thoại thuyết trình chi tiết cho từng slide giúp người trình bày tự tin làm chủ sân khấu.`
      ].join('\n');

    default:
      return [
        universalAntiTerse,
        `2. **BÁM SÁT CHƯƠNG TRÌNH GDPT 2018:** Vận dụng chuẩn mực kiến thức, kỹ năng và phương pháp luận chuyên ngành của môn học.`,
        `3. **TRUNG THỰC HỌC THUẬT & KIỂM CHỨNG KẾT QUẢ:** Tự rà soát kiểm chứng kết quả trước khi đưa ra kết luận cuối cùng.`
      ].join('\n');
  }
}

/**
 * Lấy đề bài mẫu mặc định cho bất kỳ skill nào trong 16 skills
 */
function getDefaultSampleProblem(subject, grade = 12) {
  const profile = SKILL_DEEP_PROFILES[subject];
  if (profile && profile.sampleProblem) {
    return profile.sampleProblem;
  }
  return `Câu hỏi ôn tập và đánh giá năng lực THPT chuẩn Chương trình GDPT 2018 cho kỹ năng @${subject} (Khối Lớp ${grade}).`;
}

// ============================================================================
// 6. ĐỘNG CƠ KIẾN TẠO UNIVERSAL META-PROMPT 7 TRỤ CỘT (ĐỘC LẬP HỆ SINH THÁI)
// ============================================================================
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
  const skillProfile = SKILL_DEEP_PROFILES[subject] || SKILL_DEEP_PROFILES['toan-thpt'];

  const effectiveRole = role || skillProfile.title;
  const bookTitle = bookObject ? bookObject.title : `Sách Giáo Khoa Lớp ${grade} (Chương trình GDPT 2018)`;
  const bookFile = bookObject ? bookObject.file : `sgk-${subject}-lop-${grade}.pdf`;
  const bookDrive = bookObject ? bookObject.drive : 'https://drive.google.com/drive/folders/1I3h4nfdJTO5KdPsD4UWYdYJlMXQL1YwD?usp=drive_link';

  const useCoT = cognitiveOptions.useCoT !== false;
  const useSocratic = cognitiveOptions.useSocratic !== false;
  const useFewShot = cognitiveOptions.useFewShot !== false;
  const useActiveRecall = cognitiveOptions.useActiveRecall !== false;

  // --------------------------------------------------------------------------
  // CHẾ ĐỘ 2: UNIVERSAL SYSTEM PROMPT (XML / STRUCTURED AGENT SPECIFICATION)
  // Hoạt động độc lập trên mọi mô hình LLM (Local & Cloud)
  // --------------------------------------------------------------------------
  if (exportMode === 'system-prompt') {
    let xml = `<universal_agentic_prompt version="2.0.0" framework="EduSkills-VN" ecosystem="vendor-agnostic" standard="GDPT-2018-QD764">\n`;
    xml += `  <system_instruction>\n`;
    xml += `    <epistemological_identity>\n`;
    xml += `      <role>${effectiveRole}</role>\n`;
    xml += `      <skill_id>${subject}</skill_id>\n`;
    xml += `      <grade_level>Lớp ${grade}</grade_level>\n`;
    xml += `      <axiomatic_mindset>${skillProfile.epistemology}</axiomatic_mindset>\n`;
    xml += `    </epistemological_identity>\n\n`;

    xml += `    <cognitive_calibration tier="${tierObj.id}" scenario="${contextObj.id}">\n`;
    xml += `      <tier_name>${tierObj.name} (${tierObj.badge})</tier_name>\n`;
    xml += `      <target_score>${studentLevel || tierObj.scoreTarget}</target_score>\n`;
    xml += `      <learner_state>${currentStatus || tierObj.description}</learner_state>\n`;
    xml += `      <operational_scenario>${contextObj.title} — ${contextObj.description}</operational_scenario>\n`;
    xml += `    </cognitive_calibration>\n\n`;

    xml += `    <domain_methodology>\n`;
    skillProfile.methodologySteps.forEach((step, idx) => {
      xml += `      <step index="${idx + 1}">${step}</step>\n`;
    });
    xml += `    </domain_methodology>\n\n`;

    xml += `    <cognitive_trap_matrix>\n`;
    skillProfile.traps.forEach((trap, idx) => {
      xml += `      <trap index="${idx + 1}">${trap}</trap>\n`;
    });
    xml += `    </cognitive_trap_matrix>\n\n`;

    xml += `    <epistemic_grounding>\n`;
    xml += `      <reference_textbook>${bookTitle}</reference_textbook>\n`;
    xml += `      <pdf_source_code>${bookFile}</pdf_source_code>\n`;
    xml += `      <cloud_repository>${bookDrive}</cloud_repository>\n`;
    xml += `      <epistemic_honesty_protocol>Chỉ đối chiếu và nêu tên chuyên đề/bài học thực sự tồn tại trong chương trình GDPT 2018 của cuốn "${bookTitle}". Tuyệt đối KHÔNG bịa đặt số trang hoặc số dòng giả mạo nếu người dùng chưa đính kèm trực tiếp trích đoạn trang sách đó.</epistemic_honesty_protocol>\n`;
    xml += `    </epistemic_grounding>\n\n`;

    if (useFewShot && skillProfile.fewShot) {
      xml += `    <dynamic_few_shot_exemplar>\n`;
      xml += `      <sample_input>${skillProfile.fewShot.input}</sample_input>\n`;
      xml += `      <sample_reasoning_and_output>\n${skillProfile.fewShot.output}\n      </sample_reasoning_and_output>\n`;
      xml += `    </dynamic_few_shot_exemplar>\n\n`;
    }

    xml += `    <chain_of_verification_protocol>\n`;
    skillProfile.coveChecklist.forEach((chk, idx) => {
      xml += `      <verification_check index="${idx + 1}">${chk}</verification_check>\n`;
    });
    xml += `      <formatting_constraint>${constraintsPrompt || '100% công thức viết bằng LaTeX ($...$ hoặc $$...$$), đơn vị chuẩn SI, danh pháp hóa học chuẩn IUPAC tiếng Anh, cấu trúc 4 tầng Socrates.'}</formatting_constraint>\n`;
    xml += `    </chain_of_verification_protocol>\n`;
    xml += `    <execution_mandates>\n`;
    getDomainExecutionMandates(subject).split('\n').forEach(line => {
      xml += `      <mandate>${line.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</mandate>\n`;
    });
    xml += `    </execution_mandates>\n\n`;
    xml += `  </system_instruction>\n\n`;

    xml += `  <user_turn>\n`;
    xml += `    <task_directive>${taskPrompt || 'Phân tích bản chất, triển khai lời giải 4 tầng Socrates, giải mã ma trận bẫy và tự kiểm chứng kết quả (CoVe).'}</task_directive>\n`;
    if (verifiedContent && verifiedContent.trim()) {
      xml += `    <verified_problem_input>\n${verifiedContent.trim()}\n    </verified_problem_input>\n`;
    } else {
      xml += `    <autonomous_generation_mode>Chưa có đề bài đính kèm. Hãy tự khởi tạo 01 bài toán/câu hỏi chuẩn mực ở cấp độ "${tierObj.name}" thuộc chương trình "${bookTitle}" và giải chi tiết theo ngữ cảnh "${contextObj.title}".</autonomous_generation_mode>\n`;
    }
    xml += `  </user_turn>\n`;
    xml += `</universal_agentic_prompt>`;
    return xml;
  }

  // --------------------------------------------------------------------------
  // CHẾ ĐỘ 3: UNIVERSAL CLI & VENDOR-AGNOSTIC API PAYLOAD
  // Chạy độc lập bằng Node.js cục bộ, REST cURL hoặc bất kỳ OpenAI/Ollama/vLLM Server nào
  // --------------------------------------------------------------------------
  if (exportMode === 'agent-cli') {
    const cleanInput = (verifiedContent || '').trim();
    const openAiPayload = {
      model: 'local-or-cloud-llm',
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: `[EduSkills-VN v2.0 | Skill: ${subject} | Lớp ${grade} | Cấp độ: ${tierObj.name}] ${skillProfile.epistemology} Tuân thủ 4 tầng Socrates, chống bẫy nhận thức và kiểm chứng CoVe.`
        },
        {
          role: 'user',
          content: cleanInput || `Khởi tạo và giải 1 bài toán mẫu môn ${subject} Lớp ${grade} ở cấp độ ${tierObj.name} theo ngữ cảnh ${contextObj.title}.`
        }
      ]
    };

    let cli = `# ==============================================================================\n`;
    cli += `# 💻 UNIVERSAL CLI & VENDOR-AGNOSTIC API EXECUTION (ĐỘC LẬP HỆ SINH THÁI 100%)\n`;
    cli += `# Phiên bản: v2.0.0 • Dự án EduSkills-VN (Chủ nhiệm: Nguyễn Duy Quang)\n`;
    cli += `# Hoạt động độc lập trên: Node.js Local, cURL REST API, Ollama, vLLM, OpenAI-Compatible\n`;
    cli += `# ==============================================================================\n\n`;

    cli += `# 1. Xuất Prompt trực tiếp từ EduSkills-VN Local Server (Port 3000):\n`;
    cli += `curl -s -X POST http://localhost:3000/api/generate-prompt \\\n`;
    cli += `  -H "Content-Type: application/json" \\\n`;
    cli += `  -d '{\n`;
    cli += `    "subject": "${subject}",\n`;
    cli += `    "gradeLevel": ${grade},\n`;
    cli += `    "competencyTier": "${tierObj.id}",\n`;
    cli += `    "usageContext": "${contextObj.id}",\n`;
    cli += `    "exportMode": "standard",\n`;
    cli += `    "verifiedContent": ${JSON.stringify(cleanInput)}\n`;
    cli += `  }'\n\n`;

    cli += `# 2. Chạy với Local LLM (Ollama / vLLM / LM Studio / OpenAI-Compatible Endpoint):\n`;
    cli += `curl -s -X POST http://localhost:11434/v1/chat/completions \\\n`;
    cli += `  -H "Content-Type: application/json" \\\n`;
    cli += `  -d '${JSON.stringify(openAiPayload, null, 2)}'\n\n`;

    cli += `# 3. Đọc trực tiếp Playbook Kỹ năng gốc (Self-Contained Markdown):\n`;
    cli += `node -e "const fs=require('fs'); console.log(fs.readFileSync('dataset/skills-catalog.json','utf8'));"\n`;
    return cli;
  }

  // --------------------------------------------------------------------------
  // CHẾ ĐỘ 1 (MẶC ĐỊNH): KIẾN TRÚC UNIVERSAL META-PROMPT 7 TRỤ CỘT
  // Dành cho mọi nền tảng AI Chat, Local LLM và Hệ thống Học thuật
  // --------------------------------------------------------------------------
  let p = `# ==============================================================================\n`;
  p += `# 🍵 EDUSKILLS-VN UNIVERSAL META-COGNITIVE PROMPT (CHUẨN 7 TRỤ CỘT v2.0 & BGD 2026)\n`;
  p += `# Kỹ năng: @${subject} • Khối Lớp: ${grade} • Cấp độ: ${tierObj.name} • Độc lập Hệ sinh thái\n`;
  p += `# ==============================================================================\n\n`;

  // TRỤ CỘT 1: ĐỊNH VỊ NHẬN THỨC LUẬN & NHIỆM VỤ THỰC THI
  p += `## 🎯 1. ĐỊNH VỊ NHẬN THỨC LUẬN & NHIỆM VỤ THỰC THI (EPISTEMOLOGICAL IDENTITY & TASK)\n`;
  p += `- **Định danh chuyên gia:** ${effectiveRole}.\n`;
  p += `- **Hệ tiên đề & Phương pháp luận bộ môn:** ${skillProfile.epistemology}\n`;
  p += `- **Nhiệm vụ trọng tâm:** ${taskPrompt || 'Phân tích bản chất từ nguyên lý gốc, giải chi tiết từng bước, giải mã ma trận bẫy và tự kiểm chứng kết quả'}.\n`;
  p += `- **Ngữ cảnh vận hành sư phạm:** **${contextObj.title}** (*${contextObj.tagline}*).\n`;
  p += `  * *Chỉ thị ngữ cảnh:* ${contextObj.description}\n`;
  p += `- **Cơ chế kích hoạt nhận thức bắt buộc:**\n`;
  if (useCoT) {
    p += `  * **[First-Principles Chain-of-Thought]:** Suy luận từ định nghĩa, tiên đề và định luật gốc; chứng minh tường minh mọi bước biến đổi trước khi kết luận.\n`;
  }
  if (useSocratic) {
    p += `  * **[Socratic Scaffolding]:** Khơi mở tư duy bằng câu hỏi định hướng ở Tầng 1, giúp người học nhận ra cấu trúc ẩn thay vì chỉ chép đáp số thụ động.\n`;
  }
  if (useFewShot) {
    p += `  * **[Dynamic Few-Shot Anchoring]:** Tuân thủ nghiêm ngặt độ sâu phân tích và chuẩn trình bày của Mẫu Neo Chất Lượng tại Phân khu 6.\n`;
  }
  if (useActiveRecall) {
    p += `  * **[Active Recall & Transfer]:** Ở cuối bài giải, bắt buộc thiết kế 01 câu hỏi phản biện hoặc 01 bài toán biến thể đẳng cấu (kèm đáp số ẩn) để người học tự rèn luyện.\n`;
  }
  p += `\n`;

  // TRỤ CỘT 2: MÔ HÌNH HÓA NĂNG LỰC NHẬN THỨC & TRẠNG THÁI NGƯỜI HỌC
  p += `## 🧠 2. MÔ HÌNH HÓA NĂNG LỰC & VÙNG PHÁT TRIỂN GẦN (COGNITIVE CALIBRATION)\n`;
  p += `- **Đối tượng người học:** Học sinh Lớp ${grade} — Chương trình Giáo dục Phổ thông 2018 (Định dạng khảo thí Quyết định 764/QĐ-BGDĐT).\n`;
  p += `- **Phân cấp năng lực mục tiêu:** **${tierObj.name}** [${tierObj.badge} — *${tierObj.scoreTarget}*].\n`;
  p += `  * *Trọng tâm sư phạm:* ${tierObj.description}\n`;
  p += `- **Mục tiêu cá nhân hóa:** "${studentLevel || tierObj.scoreTarget}".\n`;
  p += `- **Chẩn đoán trạng thái hiện tại:** ${currentStatus || 'Nắm được kiến thức cơ bản nhưng cần chuẩn hóa lập luận chặt chẽ và tránh sập bẫy phương án nhiễu'}.\n\n`;

  // TRỤ CỘT 3: QUY TRÌNH TƯ DUY BỘ MÔN & KHUNG SƯ PHẠM 4 TẦNG SOCRATES
  p += `## 🔄 3. QUY TRÌNH TƯ DUY BỘ MÔN & KHUNG GIÀN GIÁO 4 TẦNG SOCRATES\n`;
  p += `### 3.1. Chuỗi thao tác tư duy chuyên ngành (@${subject}):\n`;
  skillProfile.methodologySteps.forEach(step => {
    p += `- ${step}\n`;
  });
  p += `\n### 3.2. Cấu trúc phản hồi 4 tầng bắt buộc:\n`;
  p += `- **🟢 Tầng 1 — Khơi Mở Tư Duy Socrates (Socratic Decomposition):** Đặt 2–3 câu hỏi định hướng giúp học sinh tự nhận diện dữ kiện ẩn, điều kiện xác định và định lý cốt lõi (chưa lộ đáp số ngay).\n`;
  p += `- **🔵 Tầng 2 — Bản Chất Khoa Học & Chiến Thuật Giải (First-Principles Strategy):** Phân tích bản chất hiện tượng/mô hình toán học, xác lập công thức gốc và lý giải chiến thuật tiếp cận tối ưu.\n`;
  p += `- **🟠 Tầng 3 — Thực Thi Lời Giải Tường Minh Từng Bước (Rigorous Step-by-Step Derivation):** Trình bày mạch lạc từng bước biến đổi có căn cứ định lý; công thức chữ trước, thay số chuẩn đơn vị sau.\n`;
  p += `- **🔴 Tầng 4 — Giải Mã Ma Trận Bẫy, Tự Kiểm Chứng (CoVe) & Bài Tập Tự Luyện:** Phân tích vì sao các phương án nhiễu lại sai, thực hiện kiểm tra chéo nghiệm và giao 1 bài tập tương tự.\n\n`;

  // TRỤ CỘT 4: MA TRẬN BẪY NHẬN THỨC CHUYÊN BIỆT CỦA BỘ MÔN
  p += `## ⚠️ 4. MA TRẬN BẪY NHẬN THỨC & SAI LẦM PHÒNG THI CẦN CẢNH BÁO (@${subject})\n`;
  skillProfile.traps.forEach((trap, idx) => {
    p += `${idx + 1}. ${trap}\n`;
  });
  p += `\n`;

  // TRỤ CỘT 5: DẪN CHỨNG HỌC LIỆU & GIAO THỨC TRUNG THỰC NHẬN THỨC
  p += `## 📖 5. DẪN CHỨNG HỌC LIỆU & TRUNG THỰC NHẬN THỨC (EPISTEMIC GROUNDING)\n`;
  p += `- **Sách Giáo Khoa chuẩn tham chiếu:** ${bookTitle}\n`;
  p += `- **Mã tài liệu gốc trong kho học liệu:** \`${bookFile}\`\n`;
  p += `- **Kho lưu trữ đối chiếu:** ${bookDrive}\n`;
  p += `- **GIAO THỨC TRUNG THỰC NHẬN THỨC (EPISTEMIC HONESTY PROTOCOL):**\n`;
  p += `  1. Chỉ sử dụng định nghĩa, ký hiệu, công thức và phương pháp nằm trong phạm vi Chương trình GDPT 2018 của cuốn **${bookTitle}**; nghiêm cấm dùng mẹo giải tắt làm mất bản chất khoa học.\n`;
  p += `  2. Nêu rõ tên **Chương / Chuyên đề / Bài học** tương ứng để học sinh tra cứu.\n`;
  p += `  3. **Chống ảo giác trích dẫn (Zero Fake-Citation):** Nếu người dùng không đính kèm trực tiếp văn bản trang sách trong đề bài, tuyệt đối KHÔNG tự bịa đặt số trang hay số dòng giả mạo.\n\n`;

  // TRỤ CỘT 6: MẪU NEO CHẤT LƯỢNG ĐỘNG (DYNAMIC FEW-SHOT) & TỰ KIỂM CHỨNG (CoVe)
  p += `## 🛡️ 6. MẪU NEO CHẤT LƯỢNG (FEW-SHOT EXEMPLAR) & GIAO THỨC TỰ KIỂM CHỨNG (CoVe)\n`;
  if (useFewShot && skillProfile.fewShot) {
    p += `### 6.1. Mẫu Neo Chất Lượng Chuẩn Mực (Few-Shot Exemplar cho @${subject}):\n`;
    p += `> **Đầu vào mẫu:** ${skillProfile.fewShot.input}\n`;
    p += `> **Chuẩn phân tích & đầu ra mẫu:**\n`;
    skillProfile.fewShot.output.split('\n').forEach(line => {
      p += `> ${line}\n`;
    });
    p += `\n`;
  }
  p += `### 6.2. Danh sách Tự Kiểm Chứng Đa Chiều (Chain-of-Verification - CoVe Checklist):\n`;
  p += `Trước khi xuất phản hồi cuối cùng, AI bắt buộc tự rà soát qua 4 chốt kiểm định:\n`;
  skillProfile.coveChecklist.forEach((chk, idx) => {
    p += `- **[CoVe Check #${idx + 1}]:** ${chk}\n`;
  });
  p += `- **[Ràng buộc định dạng]:** ${constraintsPrompt || '100% công thức viết bằng LaTeX ($...$ hoặc $$...$$), đơn vị chuẩn hệ SI, danh pháp hóa học chuẩn IUPAC tiếng Anh'}.\n\n`;

  // TRỤ CỘT 7: NỘI DUNG ĐỀ BÀI ĐÃ KIỂM CHỨNG HOẶC CHẾ ĐỘ KHỞI TẠO TỰ ĐỘNG
  if (verifiedContent && verifiedContent.trim()) {
    p += `## 📝 7. NỘI DUNG ĐỀ BÀI / NGỮ LIỆU ĐẦU VÀO ĐÃ XÁC NHẬN KIỂM CHỨNG\n`;
    p += `\`\`\`text\n${verifiedContent.trim()}\n\`\`\`\n\n`;
    p += `👉 **LỆNH THỰC THI BẮT BUỘC ĐỐI VỚI AI:**\n`;
    p += `${getDomainExecutionMandates(subject)}\n`;
    p += `4. Hãy bắt đầu giải quyết bài toán/đề bài theo trọn vẹn 4 tầng sư phạm:`;
  } else {
    p += `## 📝 7. CHẾ ĐỘ KHỞI TẠO ĐỀ BÀI & GIẢNG DẠY TỰ ĐỘNG (AUTONOMOUS PEDAGOGICAL MODE)\n`;
    p += `- **Trạng thái đầu vào:** Người dùng chưa đính kèm bài tập cụ thể (chế độ Khởi tạo & Dạy học chủ động).\n`;
    p += `- **LỆNH THỰC THI BẮT BUỘC ĐỐI VỚI AI:**\n`;
    p += `  1. Tự động thiết kế **01 bài toán / câu hỏi điển hình** bám sát chương trình **${bookTitle}** ở cấp độ nhận thức **${tierObj.name}** (*${tierObj.scoreTarget}*).\n`;
    p += `  2. Triển khai giảng dạy và giải quyết bài toán đó theo đúng ngữ cảnh **${contextObj.title}** (*${contextObj.tagline}*) với đầy đủ 4 tầng Socrates, Ma trận Bẫy và Kiểm chứng CoVe.\n`;
    p += `  3. Tuân thủ nghiêm ngặt các chỉ thị sư phạm chuyên biệt của bộ môn:\n`;
    p += `${getDomainExecutionMandates(subject)}\n`;
  }

  return p;
}

module.exports = {
  scanImageOCR,
  formatMathToLatex,
  formatPhysicsToSI,
  formatPhysicsStandard: formatPhysicsToSI,
  formatChemistryToIUPAC,
  formatChemistryIUPAC: formatChemistryToIUPAC,
  formatLiteratureReading,
  formatBiologyToGenetics,
  formatInformaticsCode,
  formatEnglishAcademic,
  COMMON_ENGLISH_SPELLING_CORRECTIONS,
  formatHistoryChronology,
  formatGeographyStats,
  formatLegalScenario,
  formatTechnologySpecs,
  formatMetaToolsStandard,
  getDomainExecutionMandates,
  processTextBySubject,
  getDefaultSampleProblem,
  generateIntentDrivenPrompt,
  COMPETENCY_TIERS,
  USAGE_CONTEXTS,
  SKILL_DEEP_PROFILES,
  IUPAC_DICTIONARY,
  SI_UNITS
};