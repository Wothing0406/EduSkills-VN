# 🍵 EduSkills-VN: The Agentic AI Brain for Vietnamese High School Education
### 🇻🇳 Hệ Sinh Thái Agentic AI Skills THPT Chuẩn Bộ Giáo Dục & Đào Tạo 2026–2027

> **Phiên bản:** `Beta v0.1.3-beta`  
> **Giao diện cốt lõi:** Matcha Mèo Ú Tối Giản (Cozy Minimalist Cat & Matcha Workspace - React 18)  
> **Backend OCR & Orchestrator:** Node.js Server (`http://localhost:3000`) tích hợp Multi-Domain Parser Engine  
> **Phân cấp nhận thức:** 4 Cấp bậc năng lực (Nhận biết - Thông hiểu -> Vận dụng -> Vận dụng cao -> Bồi dưỡng HSG & ĐGNL)  
> **Ngữ cảnh sư phạm:** 5 Kịch bản chuyên biệt (Giải đề BGD 2026, Gia sư Socrates, Giải mã bẫy, Soạn ma trận, Ôn cấp tốc 60s)  
> **Bộ nạp AI Agent:** Hỗ trợ 3 định dạng xuất (Web Chat 5 Khung, Agent System Prompt XML, Lệnh nạp Terminal CLI Antigravity/Claude)  
> **Chuẩn dữ liệu:** Bộ Sách Giáo Khoa Thống Nhất Toàn Quốc từ năm 2026 (Lớp 10, 11, 12) & Định dạng Đề thi Tốt nghiệp THPT 2025–2027 (Quyết định 764/QĐ-BGDĐT).  
> **Tác giả & Chủ nhiệm dự án:** **Nguyễn Duy Quang** (📞 `0795277227` | ✉️ `poiairo4628@gmail.com`)

---

[![Version: Beta v0.1.3-beta](https://img.shields.io/badge/Version-Beta%20v0.1.3--beta-green.svg)](#)
[![Vibe: Matcha Mèo Ú Tối Giản](https://img.shields.io/badge/Vibe-Matcha%20M%C3%A8o%20%C3%9A%20Cozy-darkgreen.svg)](#)
[![Competency Tiers: 4 Levels](https://img.shields.io/badge/Competency%20Tiers-NB--TH%20•%20VD%20•%20VDC%20•%20HSG-blue.svg)](#-4-phân-cấp-bậc-năng-lực-nhận-thức--ngữ-cảnh-sư-phạm-chuyên-biệt)
[![Universal Agent Loader](https://img.shields.io/badge/Universal%20Loader-Claude%20•%20Gemini%20•%20Antigravity-orange.svg)](#-6-bộ-nạp-kỹ-năng-cho-ai-agent-universal-ai-agent-skill-loader)
[![OCR Backend: Multi-Domain](https://img.shields.io/badge/OCR%20Backend-Toán%20•%20Lí%20•%20Hóa%20•%20Văn-brightgreen.svg)](#)
[![Prompt Standard: Intent-Driven](https://img.shields.io/badge/Prompt%20Standard-4%20Pillars%20Intent--Driven-blue.svg)](docs/Tieuchuanprompt.md)
[![SGK Cloud Storage](https://img.shields.io/badge/SGK%20Cloud-Google%20Drive%2010--11--12-yellow.svg)](#-3-tủ-sách-sgk-điện-tử-cloud--đối-sánh-chính-xác-từng-file-pdf)
[![User Guide](https://img.shields.io/badge/Handbook-Cẩm%20Nang%20Sử%20Dụng-purple.svg)](docs/08_USER_GUIDE_HUONG_DAN_SU_DUNG.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🍵 1. Bản Sắc Riêng: Triết Lý "Matcha Mèo Ú Tối Giản"

Thay vì các giao diện 3D rườm rà làm quạt máy tính kêu to và gây xao nhãng khi học tập, **EduSkills-VN** định hình một bản sắc hoàn toàn riêng biệt:
- 🐱 **Linh vật Mèo Ú Thưởng Trà:** Biểu tượng của sự kiên nhẫn, điềm tĩnh và thông tuệ, xua tan áp lực thi cử căng thẳng.
- 🍵 **Tone màu Matcha Latte & Bọt Sữa:** Gam màu xanh trà matcha dịu mắt (`#385E47`, `#588B69`), nền kem sữa thanh lịch (`#F7F9F6`), bảo vệ thị lực tối đa cho học sinh khi tự học đêm muộn.
- ⚡ **Nền tảng React 18 & OCR Backend:** Khởi chạy tức thì qua Node.js (`server.js`), hỗ trợ dán ảnh bài tập trực tiếp từ clipboard (`Ctrl + V`), kéo thả tài liệu PDF và bóc tách dữ liệu theo môn học chuyên biệt.

---

## 📸 2. OCR Backend & Tính Năng Chụp Màn Hình Dán Trực Tiếp (`Ctrl + V`)

1. **Dán ảnh chụp màn hình tức thì (`Ctrl + V`):**
   - Học sinh dùng phím tắt `Win + Shift + S` (Windows) hoặc `Cmd + Shift + 4` (macOS) để chụp đề bài.
   - Nhấn **`Ctrl + V`** bất kỳ đâu trên trang web để dán ảnh trực tiếp từ clipboard.
2. **Bóc tách chuyên sâu theo từng môn học:**
   - 📐 **Toán học:** Chuyển đổi phân số, căn thức, tích phân, giới hạn sang mã **LaTeX ($...$)**.
   - ⚡ **Vật lí:** Tự động chuẩn hóa đơn vị đo hệ SI ($Pa, N, J, K, m/s^2$) và chu trình biến đổi nhiệt.
   - 🧪 **Hóa học:** Tự động chuyển 100% danh pháp tiếng Việt cũ sang danh pháp **IUPAC tiếng Anh chuẩn SGK mới** và định dạng biến thiên Enthalpy $\Delta_r H^0_{298}$.
   - 📖 **Ngữ văn:** Tự động cấu trúc phần **Đọc hiểu văn bản ngoài SGK** + Hệ thống câu hỏi + Đoạn văn nghị luận 200 chữ.
3. **Thẻ Xác Nhận Kiểm Chứng & Nút Gỡ Đề Bài Linh Hoạt:**
   - Rà soát số liệu trước khi chèn vào Prompt.
   - Nút **"🧹 Gỡ Bài Tập Khỏi Prompt"** cho phép học sinh xóa ngay bài tập khỏi prompt khi nạp nhầm, chuyển prompt về chế độ **Prompt Sư Phạm Thuần** mà không cần tải lại trang!

---

## 📚 3. Tủ Sách SGK Điện Tử Cloud & Đối Sánh Chính Xác Từng File PDF

Hệ thống lập chỉ mục chi tiết từng đầu sách giáo khoa chính khóa của Bộ GD&ĐT trong kho dữ liệu **> 2.03GB** tại [`dataset/books-database.json`](dataset/books-database.json):
- **Tên sách giáo khoa cụ thể:** (Ví dụ: *SGK Toán 12 - Tập 1*, *Sách học sinh Vật lí 12*, *Chuyên đề học tập Hóa học 12*...).
- **Mã file PDF gốc trong kho:** (Ví dụ: `12-sgk-toan-12-tap-mot.pdf`, `12-shs-vat-li-12.pdf`...).
- **Liên kết Google Drive chính xác:** Đường link trực tiếp đến thư mục chứa file PDF của đúng khối lớp đó.

---

## 🎯 4. Phân Cấp Bậc Năng Lực Nhận Thức & Ngữ Cảnh Sư Phạm Chuyên Biệt

Khắc phục triệt để tình trạng prompt chung chung của AI truyền thống, bản **v0.1.3-beta** phân định rành mạch:

### A. 4 Cấp Bậc Năng Lực Nhận Thức (Competency Tiers):
1. 🟢 **Nhận Biết & Thông Hiểu (`nb-th`):** Mục tiêu 5.0 - 7.0 điểm. Nắm vững định nghĩa, tiên đề, công thức cơ bản trong SGK, giải thích hiện tượng và chống điểm liệt.
2. 🔵 **Vận Dụng Tiêu Chuẩn (`vd`):** Mục tiêu 7.0 - 8.5 điểm. Vận dụng định luật, giải bài toán phối hợp 2-3 kiến thức thành phần, xử lý các câu Đúng/Sai đa ý và Trả lời ngắn.
3. 🟠 **Vận Dụng Cao - Phân Hóa (`vdc`):** Mục tiêu 8.5 - 9.5+ điểm. Bài toán thực tế liên môn, bài toán tối ưu, cực trị Oxyz, đồ thị phức hợp và bài phân loại học sinh giỏi.
4. 🟣 **Bồi Dưỡng HSG & ĐGNL (`hsg`):** Đỉnh cao tư duy Olympic, bài thi ĐGNL ĐHQG-HCM, ĐHQG-HN, TSA ĐHBK Hà Nội.

### B. 5 Ngữ Cảnh Sư Phạm Khi Sử Dụng (Pedagogical Scenarios):
- 🎯 **Giải Đề Chuẩn BGD 2026:** Bám sát định dạng 3 phần theo Quyết định 764/QĐ-BGDĐT.
- 💡 **Gia Sư Sư Phạm Socrates:** Chuỗi câu hỏi khơi mở phản xạ, tuyệt đối không lộ đáp số ngay.
- ⚠️ **Giải Mã Bẫy Phòng Thi:** Mổ xẻ 3 cạm bẫy tâm lý, nhầm dấu, sai thứ nguyên SI, quên điều kiện xác định.
- 📝 **Soạn Ma Trận & Đề Tương Tự:** Hỗ trợ giáo viên và học sinh thiết kế đề kiểm tra tương đương.
- ⚡ **Ôn Cấp Tốc 60s & Mindmap Cornell:** Tóm lược siêu tốc kiến thức bằng sơ đồ tư duy Mermaid và bảng tóm tắt 60 giây.

---

## 🤖 5. Bộ Nạp Kỹ Năng Cho AI Agent (Universal AI Agent Skill Loader)

Không chỉ phục vụ việc copy-paste vào giao diện web, EduSkills-VN v0.1.3-beta hỗ trợ nạp trực tiếp vào các mô hình Agentic AI hiện đại qua 3 chế độ:

1. 💬 **Web Chat (5 Khung):** Cấu trúc 5 trụ cột chuẩn `Tieuchuanprompt.md` để dán vào ChatGPT, Claude, Gemini web.
2. 🤖 **Agent System Prompt (XML Format):** Thẻ `<system_instruction>` chuẩn dành cho Claude Projects, Gemini System Instructions, hoặc OpenAI Custom GPTs.
3. 💻 **Lệnh Nạp CLI / Terminal:**
   - **Google Antigravity SDK & Gemini CLI:**
     ```bash
     gemini run --system-skill "skills/khoa-hoc-tu-nhien/toan-thpt/SKILL.md" \
       --grade 12 --tier "vdc" --context "socrates"
     ```
   - **Claude Code CLI:**
     ```bash
     /skill load skills/khoa-hoc-tu-nhien/toan-thpt/SKILL.md
     ```
   - **NPX Package Manager:**
     ```bash
     npx eduskills-vn load toan-thpt --grade 12 --tier vdc --context socrates
     ```
   - **Gọi Trực Tiếp Qua API Backend Local:**
     ```bash
     curl -X POST http://localhost:3000/api/generate-prompt \
       -H "Content-Type: application/json" \
       -d '{"subject":"toan-thpt","gradeLevel":12,"competencyTier":"vdc","usageContext":"socrates"}'
     ```

## ⚡ 4. RÀNG BUỘC KỸ THUẬT & ĐỊNH DẠNG ĐẦU RA (OUTPUT CONSTRAINTS & FORMAT)
- 100% công thức viết bằng LaTeX đặt trong cặp dấu $...$.
- 100% danh pháp hóa học viết bằng IUPAC tiếng Anh.
- Cấu trúc lời giải 4 tầng Socrates (Gợi mở -> Bản chất -> Từng bước -> Giải mã bẫy).

## 📝 5. NỘI DUNG ĐỀ BÀI / NGỮ LIỆU ĐÃ XÁC NHẬN KIỂM CHỨNG
[Nội dung đề bài tập / đề thi đã được bóc tách và chuẩn hóa]
```

---

## 🚀 5. Cài Đặt & Khởi Chạy Local Hub

Hệ thống hỗ trợ chạy cục bộ cực kỳ đơn giản cho cả người dùng không rành công nghệ:

```bash
# 1. Clone kho lưu trữ mã nguồn mở về máy
git clone https://github.com/Wothing0406/EduSkills-VN.git
cd EduSkills-VN

# 2. Khởi chạy 1-click trên Windows (Dành cho học sinh & giáo viên)
start-eduskills.bat

# Hoặc khởi chạy qua dòng lệnh Node.js:
npm install
node server.js
```

Sau khi khởi chạy, máy chủ mở tại địa chỉ: `http://localhost:3000`:
- 🌐 **Web Workspace:** `http://localhost:3000`
- 📸 **API OCR Backend:** `http://localhost:3000/api/ocr`
- 🎯 **API Tạo Prompt:** `http://localhost:3000/api/generate-prompt`
- 📊 **API Skills Catalog:** `http://localhost:3000/api/skills`

---

## 📞 6. Tác Giả & Hỗ Trợ Cộng Đồng

Dự án được xây dựng và duy trì bởi:
*   **Chủ nhiệm dự án:** **Nguyễn Duy Quang**
*   **Điện thoại / Zalo:** **`0795277227`**
*   **Email học thuật:** **`poiairo4628@gmail.com`**
*   **GitHub Repository:** [https://github.com/Wothing0406/EduSkills-VN](https://github.com/Wothing0406/EduSkills-VN)

Dự án phát hành dưới giấy phép mã nguồn mở **MIT License**. Chung tay vì một thế hệ học sinh Việt Nam làm chủ trí tuệ nhân tạo một cách văn minh, chuẩn mực và sáng tạo!