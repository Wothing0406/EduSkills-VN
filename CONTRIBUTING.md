# Hướng Dẫn Đóng Góp (Contributing Guidelines) — EduSkills-VN

Cảm ơn bạn đã quan tâm và muốn đóng góp cho dự án **EduSkills-VN**! Mọi sự đóng góp từ các bạn học sinh, giáo viên, chuyên gia sư phạm và lập trình viên nhằm hoàn thiện hệ thống trợ lý học tập thông minh cho học sinh THPT Việt Nam đều rất đáng trân trọng.

Tài liệu này quy định chuẩn mực kiến trúc, quy trình làm việc và tiêu chí thẩm định chất lượng áp dụng cho phiên bản **EduSkills-VN v2.0.0**.

---

## 🧭 1. Tầm Nhìn & Phạm Trù Giới Hạn (Scope & Boundaries)

Dự án **EduSkills-VN** hoạt động dựa trên các nguyên tắc bất biến:
1. **100% Vendor-Agnostic (Không phụ thuộc hệ sinh thái độc quyền):**
   - Toàn bộ Prompt và Skill được thiết kế theo tiêu chuẩn mở UASS v2.0 (Universal Agentic Skill Specification).
   - Hoạt động tương thích hoàn toàn trên mọi mô hình ngôn ngữ lớn (Google Gemini, OpenAI GPT-4o, Anthropic Claude, DeepSeek, hoặc các mô hình mã nguồn mở chạy local qua Ollama/vLLM).
   - Không hardcode cú pháp phụ thuộc riêng vào bất kỳ CLI hay nền tảng đóng nào.
2. **Bám sát Chương Trình GDPT 2018 & Định Dạng Đề Thi Bộ GD&ĐT:**
   - Nội dung kiến thức bám sát 3 bộ sách giáo khoa: *Kết nối tri thức với cuộc sống*, *Chân trời sáng tạo*, và *Cánh diều*.
   - Cấu trúc bài tập tuân thủ Quyết định **764/QĐ-BGDĐT** (gồm 3 phần: Trắc nghiệm nhiều lựa chọn, Trắc nghiệm Đúng/Sai, Trắc nghiệm Trả lời ngắn).
3. **Triết Lý Sư Phạm Socrates & Chống Gian Lận (Zero-Bare-Answer Mandate):**
   - **Tuyệt đối không giải bài hộ để chép đáp án:** AI luôn đóng vai trò trợ lý khai phóng tư duy. Khi học sinh gửi bài tập, hệ thống kích hoạt giàn giáo 4 bậc Socrates (Socratic Scaffolding) để gợi ý từng bước, yêu cầu học sinh tự suy nghĩ và hoàn thành bài học.
4. **Epistemic Grounding (Kiểm chứng thực chứng & Không bịa trích dẫn):**
   - Mọi dẫn chứng lịch sử, định lý toán - lý - hóa, quy tắc ngữ pháp hoặc ngữ liệu văn học phải có căn cứ khoa học chính xác, không tự tạo thông tin giả (Zero Fake-Citation).

---

## 🗂️ 2. Cấu Trúc Thư Mục & Phân Hệ Dự Án

Khi đóng góp, bạn cần đặt tệp tin vào đúng phân hệ chức năng:

```text
skillsGeminiTHPT/
├── skills/                            # Kho tri thức Prompt Skills (UASS v2.0)
│   ├── khoa-hoc-tu-nhien/             # KHTN: Toán, Vật lí, Hóa học, Sinh học
│   ├── khoa-hoc-xa-hoi/              # KHXH: Ngữ văn, Lịch sử, Địa lí, GD Kinh tế & Pháp luật
│   ├── ngon-ngu-cong-nghe/            # Ngôn ngữ - Công nghệ: Tiếng Anh, Tin học, Công nghệ
│   └── meta-tools/                    # Công cụ sư phạm meta: Quiz, Mindmap, Slide, Giải chi tiết
├── backend/                           # Backend Node.js / Express API
│   ├── server.js                      # API Server xử lý OCR, Prompt compilation & LLM Gateway
│   ├── ocr-engine.js                  # Engine nhận diện ảnh đề bài, công thức LaTeX & tiếng Việt
│   └── hybrid-retrieval.js            # Hệ thống tìm kiếm SGK & kiến thức liên quan
├── web/                               # Giao diện người dùng Web Local Client
│   └── index.html                     # SPA giao diện học tập Socrates, render LaTeX KaTeX & OCR
├── scripts/                           # Bộ công cụ tự động hóa & kiểm thử
│   ├── validate-dataset.js            # Kiểm tra cú pháp YAML & cấu trúc 7 Trụ Cột của SKILL.md
│   ├── build-dataset.js               # Đóng gói toàn bộ skills thành bundle JSON tối ưu
│   └── test-suite.js                  # Bộ kiểm thử tự động (Unit & Integration tests)
├── LICENSE                            # Giấy phép bản quyền MIT
├── CONTRIBUTING.md                    # Bản hướng dẫn đóng góp này
└── package.json                       # Cấu hình dependency & scripts
```

---

## 📐 3. Quy Chuẩn Kỹ Thuật Viết SKILL.md (UASS v2.0 Standard)

Mỗi kỹ năng môn học hoặc công cụ phụ trợ bắt buộc phải là một tệp `SKILL.md` nằm trong thư mục con tương ứng (ví dụ: `skills/khoa-hoc-tu-nhien/toan-thpt/SKILL.md`) và tuân thủ chặt chẽ **7 Trụ Cột Tri Thức (7-Pillar Architecture)**:

### 3.1. YAML Frontmatter (Bắt buộc)
```yaml
---
name: "<Tên định danh duy nhất của skill, e.g. toan-thpt>"
version: "2.0.0"
description: "<Mô tả ngắn gọn mục đích sư phạm và năng lực của skill>"
domain: "<khoa-hoc-tu-nhien | khoa-hoc-xa-hoi | ngon-ngu-cong-nghe | meta-tools>"
standards:
  - "GDPT 2018"
  - "QĐ 764/QĐ-BGDĐT"
triggers:
  - "<từ khóa kích hoạt 1>"
  - "<từ khóa kích hoạt 2>"
---
```

### 3.2. Cấu Trúc Nội Dung 7 Trụ Cột
Nội dung file `SKILL.md` phải có đầy đủ các mục sau:

1. **Pillar 1: Epistemic & Pedagogical Identity (Bản sắc nhận thức sư phạm):** Định hình rõ tư duy của chuyên gia bộ môn, phương pháp tiếp cận vấn đề.
2. **Pillar 2: Curriculum & Cognitive Focus Map:** Ma trận kiến thức theo 4 cấp độ tư duy: *Nhận biết* $\rightarrow$ *Thông hiểu* $\rightarrow$ *Vận dụng* $\rightarrow$ *Vận dụng cao*.
3. **Pillar 3: 4-Tier Socratic Scaffolding Protocol:**
   - **Tier 1 (Chẩn đoán):** Đặt câu hỏi thăm dò xem người học đang vướng ở khái niệm hay công thức nào.
   - **Tier 2 (Khơi gợi tri thức nền):** Gợi mở định lý, quy tắc hoặc bối cảnh liên quan.
   - **Tier 3 (Định hướng bước nhỏ):** Dẫn dắt biến đổi 1 phép tính hoặc 1 luận điểm trung gian.
   - **Tier 4 (Tổng kết & Siêu nhận thức):** Đúc kết phương pháp tổng quát và cách tránh bẫy.
4. **Pillar 4: Cognitive Trap Matrix & Edge Cases:** Bảng tổng hợp các lỗi sai phổ biến mà học sinh Việt Nam thường gặp (quên điều kiện xác định, nhầm đơn vị, bẫy thì tiếng Anh, nhầm niên đại lịch sử,...).
5. **Pillar 5: Dynamic Few-Shot Explicitation:** Tối thiểu 2 ví dụ đối thoại mẫu thể hiện rõ phong cách sư phạm Socrates và chuẩn đề thi Bộ GD&ĐT (Phần I, II, III).
6. **Pillar 6: Chain-of-Verification (CoVe) & Epistemic Grounding:** Bộ quy tắc tự kiểm chứng (fact-check), nghiêm cấm bịa đặt trích dẫn hoặc công thức ảo.
7. **Pillar 7: Universal System Prompt & Operational Rules:** Khối prompt hệ thống XML chuẩn hóa:
   - `<zero_bare_answer_mandate>`: Bắt buộc không xuất đáp án thô ngay lập tức nếu chưa qua tương tác gợi mở.
   - `<pedagogical_execution_loop>`: Chu trình xử lý câu hỏi theo tiêu chuẩn nghiệp vụ.

---

## 🛠️ 4. Quy Trình Gửi Đóng Góp (Git Pull Request Workflow)

Để đóng góp mã nguồn hoặc prompt mới, vui lòng thực hiện theo các bước sau:

### Bước 1: Fork & Clone Repository
```bash
# 1. Fork repository trên giao diện GitHub: https://github.com/Wothing0406/EduSkills-VN
# 2. Clone repository đã fork về máy cục bộ:
git clone https://github.com/<tai-khoan-cua-ban>/EduSkills-VN.git
cd EduSkills-VN

# 3. Cài đặt các thư viện phụ thuộc:
npm install
```

### Bước 2: Tạo Nhánh (Branch) Làm Việc
Đặt tên nhánh rõ ràng theo tiền tố:
- Thêm môn học/công cụ mới: `feature/them-skill-<ten-mon>`
- Tinh chỉnh prompt/sửa lỗi: `fix/chuan-hoa-prompt-<ten-mon>`
- Nâng cấp hệ thống/Web: `refactor/toi-uu-ocr-engine`

```bash
git checkout -b feature/them-skill-thien-van-hoc
```

### Bước 3: Thực Hiện Thay Đổi & Kiểm Tra Tại Chỗ
Sau khi thêm hoặc sửa đổi file, chạy bộ kiểm thử bắt buộc:

```bash
# 1. Kiểm tra tính hợp lệ của cấu trúc Prompt & Schema
npm run validate

# 2. Đóng gói lại bundle phân phối
npm run build

# 3. Chạy toàn bộ Test Suite (Bắt buộc phải PASS 100%)
npm test
```

> [!IMPORTANT]
> Mọi Pull Request có test thất bại hoặc vi phạm cú pháp `validate-dataset.js` sẽ không được phê duyệt hợp nhất (merge).

### Bước 4: Commit Tuân Thủ Chuẩn Conventional Commits
Viết commit message rõ ràng:
- `feat(skills): add GDQP-AN high school skill v2.0`
- `fix(tieng-anh): correct CEFR B1-B2 prompt edge cases`
- `docs: update deployment and socratic scaffolding guide`
- `test: add integration test for OCR math formula parsing`

```bash
git add .
git commit -m "feat(skills): add GDQP-AN high school skill v2.0"
```

### Bước 5: Đẩy Lên GitHub & Mở Pull Request
```bash
git push origin feature/them-skill-thien-van-hoc
```
Truy cập GitHub và nhấn **Compare & pull request**. Trong phần mô tả, hãy cung cấp:
- Mục đích của thay đổi.
- Danh sách các môn/tệp tin chịu tác động.
- Ảnh chụp màn hình hoặc log output của lệnh `npm test` thành công.

---

## ⚖️ 5. Tiêu Chuẩn Đạo Đức Học Thuật & Bản Quyền

1. **Bản quyền mã nguồn:** Dự án được phát hành theo giấy phép **MIT License**. Khi gửi mã hoặc prompt, bạn đồng ý cấp phép đóng góp của mình theo điều khoản MIT.
2. **Liêm chính học thuật (Academic Integrity):**
   - Không sao chép nguyên văn các tài liệu có bản quyền nghiêm ngặt mà không trích dẫn nguồn.
   - Nghiêm cấm đưa vào các prompt mang tính độc hại, bạo lực, vi phạm thuần phong mỹ tục hoặc sai lệch lịch sử - chủ quyền quốc gia Việt Nam.
   - Tuyệt đối giữ vững nguyên tắc **Socratic**: Giáo dục là rèn luyện năng lực tự học và tư duy phản biện, không phục vụ mục đích gian lận thi cử.

---

## 💬 6. Liên Hệ & Hỗ Trợ

Nếu bạn có câu hỏi, ý tưởng cải tiến hoặc muốn trao đổi chuyên môn:
- **Tác giả dự án:** Nguyễn Duy Quang
- **GitHub Issues:** [EduSkills-VN Issues](https://github.com/Wothing0406/EduSkills-VN/issues)
- **Repository Chính Thức:** [https://github.com/Wothing0406/EduSkills-VN](https://github.com/Wothing0406/EduSkills-VN)

Cảm ơn bạn đã chung tay kiến tạo hệ thống học tập mở vì thế hệ học sinh Việt Nam! 🚀
