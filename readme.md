# 🎓 EduSkills-VN: Bộ Não Agentic AI Skills Dành Cho Học Sinh THPT

> **Phiên bản:** `Beta v0.1-beta`  
> **Chuẩn hóa:** Bộ Sách Giáo Khoa Thống Nhất Toàn Quốc từ năm học 2026 & Định Dạng Đề Thi Tốt Nghiệp THPT 2025–2027 của Bộ Giáo dục & Đào tạo Việt Nam.  
> **Tương thích:** **Claude Code / Cursor**, **Google Antigravity / Gemini**, **OpenAI ChatGPT / Codex**.  
> **Kiến trúc:** AAS Core Standard ([`sickn33/agentic-awesome-skills`](https://github.com/sickn33/agentic-awesome-skills)).

---

[![Version: Beta v0.1-beta](https://img.shields.io/badge/Version-Beta%20v0.1--beta-orange.svg)](#)
[![Curriculum: BGD 2026 Unified](https://img.shields.io/badge/Curriculum-BGD%202026%20Unified%20SGK-blue.svg)](https://moet.gov.vn)
[![Exam: BGD 2025-2027](https://img.shields.io/badge/Exam%20Format-3%20Phần%20Chuẩn%20BGD-red.svg)](https://moet.gov.vn)
[![Interface: 3D Web Experience](https://img.shields.io/badge/UI-3D%20Three.js%20Experience-emerald.svg)](web/index.html)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 1. Điểm Mới Cốt Lõi: Bộ SGK Thống Nhất 2026 & Quy Chuẩn Đề Thi Mới

Khác với các công cụ AI thông thường đưa ra kết quả lệch chuẩn hoặc dùng tài liệu cũ:
1. **Dữ liệu chuẩn 100% SGK Thống Nhất 2026:** Từ năm 2026, Bộ GD&ĐT chính thức gộp và thống nhất một bộ SGK chuẩn toàn quốc (kho PDF SGK Lớp 10, 11, 12 được lưu trữ tại thư mục `sgk/`). Mọi công thức, định lý và ví dụ của EduSkills-VN đều trích xuất trực tiếp từ bộ sách chuẩn này.
2. **Quy trình tạo Quiz "Document-First" (`/taoquiz-bgd`):** Học sinh bắt buộc phải gửi tài liệu/ngữ liệu bài học trước $\to$ AI phân tích sâu để tạo đề thi **ĐỘ KHÓ CAO** (Vận dụng & Vận dụng cao) bám sát tài liệu, có bẫy tư duy tinh vi và barem điểm chuẩn 3 phần (Phần I trắc nghiệm 4 lựa chọn, Phần II Đúng/Sai lũy tiến điểm 0.1-0.25-0.5-1.0, Phần III Trả lời ngắn).
3. **Danh pháp Hóa học 100% IUPAC tiếng Anh:** *Sodium, Copper, Sulfuric acid, Ethanoic acid, Glucose, Fructose* theo đúng sách mới.
4. **Trải nghiệm 3D Web Experience (`web/index.html`):** Giao diện vũ trụ 3D không gian Three.js tương tác trực quan để khám phá kỹ năng và copy prompt chuẩn.

---

## 🌐 2. Trải Nghiệm Giao Diện 3D Web (3D Web Experience)

Dự án tích hợp sẵn một ứng dụng Web 3D hiện đại xây dựng bằng **Three.js & WebGL** tại [`web/index.html`](web/index.html):
*   **Vũ trụ kỹ năng 3D:** Khối cầu trung tâm *"EduSkills Brain"* cùng 4 quỹ đạo hành tinh đại diện cho 4 phân hệ kỹ năng.
*   **Hộp kiểm tra & Tạo Prompt tương tác:** Click vào từng quả cầu kỹ năng để xem thông số, thử nghiệm tính năng thả tài liệu (Dropzone), và bấm 1 nút để sao chép Prompt Payload.
*   **Cách khởi chạy:** Mở trực tiếp file `web/index.html` bằng trình duyệt (Chrome, Edge, Firefox) hoặc chạy lệnh trong terminal:
    ```bash
    start web/index.html
    ```

---

## 📂 3. Cấu Trúc Phân Mục Kỹ Năng (`skills/`)

Thư mục `skills/` được phân chia thành 4 phân hệ chủ đề khoa học, không để lộn xộn:

```text
skills/
├── khoa-hoc-tu-nhien/         # 🔬 Môn Khoa Học Tự Nhiên
│   ├── toan-thpt/SKILL.md     # Giải tích, Hình không gian Oxyz, Xác suất Bayes (Lớp 10, 11, 12)
│   ├── vat-li-thpt/SKILL.md   # Dao động cơ, Sóng, Vật lí nhiệt (Kelvin), Khí lí tưởng
│   ├── hoa-hoc-thpt/SKILL.md  # Chuẩn hóa 100% danh pháp IUPAC tiếng Anh, bài toán bảo toàn e
│   └── sinh-hoc-thpt/SKILL.md # Di truyền học phân tử, sơ đồ phả hệ, tiến hóa
├── khoa-hoc-xa-hoi/          # 📚 Môn Khoa Học Xã Hội
│   ├── ngu-van-thpt/SKILL.md  # Đọc hiểu ngữ liệu ngoài SGK (4đ), NLXH 200 chữ (2đ), NLVH (4đ)
│   ├── lich-su-thpt/SKILL.md  # Trục thời gian (Timeline), phân tích nguyên nhân - ý nghĩa lịch sử
│   ├── dia-li-thpt/SKILL.md   # Bảng số liệu, biểu đồ kinh tế - xã hội và khai thác Atlat VN
│   └── ktpl-thpt/SKILL.md     # Cơ chế thị trường, Lạm phát, giải quyết tình huống pháp lý
├── ngon-ngu-cong-nghe/       # 💻 Ngôn Ngữ & Kỹ Thuật
│   ├── tieng-anh-thpt/SKILL.md# Ngữ pháp trọng điểm, phiên âm IPA, kỹ năng đọc hiểu phân hóa
│   ├── tin-hoc-thpt/SKILL.md  # Lập trình Python, CSDL quan hệ SQL, mạng máy tính
│   └── cong-nghe-thpt/SKILL.md# Mạch điện 3 pha, vi điều khiển, cơ khí & nông nghiệp CNC
└── meta-tools/               # 🛠️ Công Cụ Học Tập Thông Minh
    ├── tao-quiz-bgd/SKILL.md  # Tạo đề thi 3 phần chuẩn BGD độ khó cao (Document-First)
    ├── slide-thuyet-trinh/SKILL.md # Slide Marp / HTML tỷ lệ 16:9 chuẩn visual sang trọng
    ├── tomtat-mindmap/SKILL.md# Sơ đồ tư duy Mermaid.js & Cheatsheet nhớ nhanh 60 giây
    ├── giai-chi-tiet/SKILL.md # Gia sư khơi mở tư duy Socrates (không làm tắt, không giải hộ)
    └── luan-an-nghiencuu/SKILL.md # Hướng dẫn NCKH kỹ thuật học sinh THPT ViSEF
```

---

## 🛠️ 4. Hướng Dẫn Nạp Skills Vào Các Nền Tảng AI Cục Bộ (Local Prompting Guide)

### 🤖 Cách 1: Sử dụng trong Google Antigravity IDE (Gemini)
Vì dự án nằm trực tiếp trong thư mục cấu hình của Antigravity (`~/.gemini/config/projects/skillsGeminiTHPT`), hệ thống tự động nhận diện các skills:
```text
/taoquiz-bgd [Dán bài học Toán 12] Hãy tạo đề thi 50 phút phân hóa học sinh khá giỏi.
```

### 🧠 Cách 2: Sử dụng trong Claude Code / Claude Desktop
Khi chat với Claude Code, bạn chỉ cần nạp playbook tương ứng:
```text
Áp dụng toàn bộ quy tắc và barem chấm điểm từ file:
skills/meta-tools/tao-quiz-bgd/SKILL.md

Đây là tài liệu bài học của tôi:
[Dán đoạn trích SGK 2026 hoặc tải file tài liệu]

Yêu cầu: Hãy phân tích tài liệu và xuất đề thi 3 phần chuẩn Bộ GD&ĐT với các câu hỏi Vận dụng cao.
```

### 💻 Cách 3: Sử dụng trong Cursor IDE
Thêm vào file `.cursorrules` hoặc gõ trong cửa sổ Composer của Cursor:
```text
@skills/khoa-hoc-tu-nhien/toan-thpt/SKILL.md Giải bài toán khảo sát hàm số sau theo đúng quy chuẩn sư phạm 4 bước: y = (x^2 - 3x + 2)/(x - 1).
```

### 🌐 Cách 4: Sử dụng trong OpenAI ChatGPT (Custom GPTs / System Instructions)
1. Mở trang tạo **Custom GPT** trên ChatGPT Plus.
2. Sao chép toàn bộ nội dung file `SKILL.md` (ví dụ `skills/meta-tools/tao-quiz-bgd/SKILL.md`) dán vào mục **Instructions**.
3. Học sinh chỉ cần tải ảnh bài tập hoặc dán tài liệu, GPT sẽ tự động đóng vai chuyên viên khảo thí BGD tạo đề thi chuẩn mực.

---

## 🎯 5. Hướng Dẫn Sử Dụng Chi Tiết Meta-Skill `/taoquiz-bgd`

> [!IMPORTANT]
> **Định luật Document-First:** `/taoquiz-bgd` sẽ từ chối sinh đề nếu bạn không cung cấp ngữ liệu hoặc tài liệu đính kèm.

### Ví Dụ Thực Tế:
*   **Bước 1 (Học sinh gửi):**
    ```text
    /taoquiz-bgd
    [ĐÍNH KÈM HOẶC DÁN VĂN BẢN]:
    "Bài 2: Khí lí tưởng - Định luật Boyle và định luật Charles. Ở nhiệt độ không đổi, áp suất của một lượng khí tỉ lệ nghịch với thể tích... Định luật Charles: Khi áp suất không đổi, thể tích của một lượng khí xác định tỉ lệ thuận với nhiệt độ tuyệt đối T (Kelvin)..."
    
    Yêu cầu: Tạo đề kiểm tra 15 phút độ khó cao có bẫy về thang đo nhiệt độ Celsius và Kelvin.
    ```
*   **Bước 2 (AI phân tích và xuất đề):**
    *   **Phần I:** 4 câu trắc nghiệm nhiều lựa chọn gài bẫy nhầm lẫn giữa $t$ (°C) và $T$ (K).
    *   **Phần II:** 2 câu Đúng/Sai, mỗi câu có 4 ý $a, b, c, d$ liên hoàn biện luận đồ thị $p-V$ và $V-T$.
    *   **Phần III:** 2 câu trả lời ngắn yêu cầu tính áp suất cuối cùng và điền đáp số số học $\le 4$ ký tự.
    *   **Barem điểm:** Tính lũy tiến chuẩn xác (1 ý = 0.1đ; 2 ý = 0.25đ; 3 ý = 0.5đ; 4 ý = 1.0đ).

---

## 🚀 6. Hướng Dẫn Đẩy Code Lên GitHub (`git@github.com:Wothing0406/EduSkills-VN.git`)

Khóa công khai SSH (Public Key) trên máy tính của bạn đã được khởi tạo:
```text
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICAsPe46dHXRaMiRcnDj6FE1wvM9zpcpQzR9g0Q21m38 quangdev@QuangDev
```

### Các bước thực hiện:
1. Mở trình duyệt và truy cập: [https://github.com/settings/ssh/new](https://github.com/settings/ssh/new)
2. Nhập tiêu đề (Title): `QuangDev PC`
3. Dán toàn bộ dòng khóa `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICAsPe46dHXRaMiRcnDj6FE1wvM9zpcpQzR9g0Q21m38 quangdev@QuangDev` vào ô Key rồi bấm **Add SSH Key**.
4. Mở terminal và chạy lệnh:
   ```bash
   git push -u origin main
   ```
*(Nếu bạn muốn đẩy qua HTTPS, chạy lệnh: `git push -u https-origin main`)*

---

## 📚 7. Danh Mục Tài Liệu Kỹ Thuật Trong [`docs/`](docs/)

- [**01. Khám Nghiệm Ý Tưởng (Idea Autopsy)**](docs/01_IDEA_AUTOPSY_AND_VALIDATION.md)
- [**02. Kiến Trúc Agentic Skills Chuẩn AAS**](docs/02_ARCHITECTURE_AGENTIC_SKILLS.md)
- [**03. Chuẩn BGD & Bộ SGK Thống Nhất 2026**](docs/03_CURRICULUM_BGD_2026_STANDARDS.md)
- [**04. Ma Trận Danh Mục Toàn Diện 36+ Skills**](docs/04_SKILLS_CATALOG_MATRIX.md)
- [**05. Pipeline Trích Xuất SGK Bằng Azure AI**](docs/05_PDF_EXTRACTION_PIPELINE.md)
- [**06. Khung Kiểm Thử & Benchmark Chất Lượng**](docs/06_TESTING_AND_BENCHMARK_FRAMEWORK.md)
- [**07. Lộ Trình Phát Triển & Bảng Phân Việc Mã Màu**](docs/07_ROADMAP_AND_TASK_BOARD.md)
