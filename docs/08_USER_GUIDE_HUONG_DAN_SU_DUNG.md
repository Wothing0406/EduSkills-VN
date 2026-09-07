# 📖 Cẩm Nang Hướng Dẫn Sử Dụng EduSkills-VN (User Guide Handbook)
### 🐾 Dành Cho Học Sinh THPT, Thầy Cô Giáo & Phụ Huynh

> **Phiên bản:** `Beta v0.1.2-beta`  
> **Chủ nhiệm dự án:** **Nguyễn Duy Quang** (📞 `0795277227` | ✉️ `poiairo4628@gmail.com`)  
> **Kho lưu trữ mã nguồn mở:** [`https://github.com/Wothing0406/EduSkills-VN`](https://github.com/Wothing0406/EduSkills-VN)

---

## 🍵 1. Triết Lý Thiết Kế: "Matcha Mèo Ú Tối Giản"

EduSkills-VN không phải là một công cụ giải bài hộ để đối phó. Đây là một **Hệ Thống Trợ Lý Sư Phạm Đa Tác Nhân (Agentic Educational Brain)** được thiết kế với mục tiêu:
1. **Dịu Mắt & Tinh Gọn:** Gam màu xanh matcha latte kết hợp bọt sữa kem mềm xua tan áp lực phòng thi căng thẳng, bảo vệ thị lực học sinh khi tự học đêm muộn.
2. **Triệt Tiêu Ảo Giác 100%:** Chỉ giải bài và sinh đề khi có dữ liệu đầu vào cụ thể (Document-First) và đối chiếu trực tiếp với từng cuốn **Sách Giáo Khoa cụ thể** trên Google Drive Cloud.
3. **Khơi Mở Tư Duy Socrates:** Không đưa đáp số thô, mà dẫn dắt từng bước để học sinh tự hiểu bản chất, phát hiện bẫy và tự giải được các bài tương tự.

---

## 🚀 2. Quy Trình 5 Bước Sử Dụng Chuẩn Mực

```mermaid
flowchart LR
    A[Bước 1: Chọn Kỹ Năng & Lớp 10-11-12] --> B[Bước 2: Tải / Paste Ảnh Ctrl+V & Bóc Tách OCR]
    B --> C[Bước 3: Xác Nhận Đề & Chọn Cuốn SGK Cụ Thể]
    C --> D[Bước 4: Bật Kỹ Thuật Tư Duy CoT/Socratic]
    D --> E[Bước 5: Dán Vào Gemini/Claude/ChatGPT]
    E --> F([Nhận Lời Giải 4 Tầng Socrates Chuẩn Xác])
```

---

### 🔹 BƯỚC 1: Chọn Kỹ Năng Môn Học & Khối Lớp
1. Mở giao diện tại địa chỉ `http://localhost:3000` (hoặc nhấp đúp file [`web/index.html`](../web/index.html)).
2. Tại thanh danh mục bên trái, chọn môn học bạn cần ôn luyện:
   - 🔬 **Tự nhiên:** `toan-thpt`, `vat-li-thpt`, `hoa-hoc-thpt`, `sinh-hoc-thpt`.
   - 📚 **Xã hội:** `ngu-van-thpt`, `lich-su-thpt`, `dia-li-thpt`, `ktpl-thpt`.
   - 💻 **Công nghệ & Ngôn ngữ:** `tieng-anh-thpt`, `tin-hoc-thpt`, `cong-nghe-thpt`.
   - 🛠️ **Công cụ thông minh:** `giai-chi-tiet`, `tao-quiz-bgd`, `slide-thuyet-trinh`, `tomtat-mindmap`, `luan-an-nghiencuu`.
3. Chọn khối lớp: **Lớp 10**, **Lớp 11** hoặc **Lớp 12**.

---

### 🔹 BƯỚC 2: Chụp Màn Hình & Dán Trực Tiếp (`Ctrl + V`) Hoặc Tải File Đề Cương
- ⚡ **Tiện ích sao chép chụp màn hình:** Dùng phím tắt Windows `Win + Shift + S` (hoặc Mac `Cmd + Shift + 4`) chụp vùng bài tập trên màn hình $\to$ Quay lại trình duyệt và nhấn phím **`Ctrl + V`**. Hệ thống sẽ tự động bắt lấy ảnh từ clipboard và nạp vào tức thì!
- **Hỗ trợ tệp đa dạng:** Bạn cũng có thể kéo thả ảnh (`PNG, JPG, WebP`) hoặc file đề cương ôn tập (`PDF, DOCX, TXT, MD`).
- **Bộ Bóc Tách OCR Backend Đa Môn:**
  - 📐 **Toán học:** Chuẩn hóa các biểu thức phân số, căn thức, số mũ, tích phân, giới hạn sang mã **LaTeX ($...$)**.
  - ⚡ **Vật lí:** Tự động nhận diện đơn vị chuẩn SI ($Pa, N, J, K, m/s^2$) và chu trình nhiệt.
  - 🧪 **Hóa học:** Tự động chuyển đổi sang 100% danh pháp IUPAC tiếng Anh (copper(II) sulfate, sulfuric acid, ethanoic acid...) và chuẩn hóa biến thiên Enthalpy $\Delta_r H^0_{298}$.
  - 📖 **Ngữ văn:** Bóc tách cấu trúc Đọc hiểu ngữ liệu trích dẫn ngoài SGK, hệ thống câu hỏi nhận biết/thông hiểu/vận dụng và đề tài viết đoạn văn 200 chữ.

---

### 🔹 BƯỚC 3: Xác Nhận Kiểm Chứng & Chọn Đúng Cuốn SGK Cụ Thể
- Thay vì chỉ trích dẫn chung chung vô định, hệ thống tự động đối soát trong cơ sở dữ liệu `dataset/books-database.json` và trích xuất:
  - **Tên Cuốn SGK Cụ Thể:** ví dụ: *SGK Toán 12 - Tập 1*, *Sách học sinh Vật lí 12*, *Chuyên đề học tập Hóa học 12 (IUPAC Thống Nhất)*...
  - **Mã File PDF Gốc:** ví dụ: `12-sgk-toan-12-tap-mot.pdf`, `12-shs-vat-li-12.pdf`...
  - **Đường Dẫn Drive Khối Lớp:** Dẫn thẳng đến kho sách điện tử chứa đúng file đó.
- Kiểm tra lại nội dung bài tập trong **Thẻ Xác Nhận Kiểm Chứng**, chỉnh sửa số liệu nếu cần và bấm **"Đưa Vào Prompt Sư Phạm"**.

---

### 🔹 BƯỚC 4: Bộ Tạo Prompt Thông Minh Phân Chia Rõ Ràng Có Chủ Đích
Mọi mã lệnh sinh ra từ EduSkills-VN được phân định thành 4 phân khu sư phạm tuyệt đối rõ ràng:

1. 🎯 **MỤC TIÊU & NHIỆM VỤ THỰC THI (WHAT THIS PROMPT DOES):** Nêu rõ hành động bắt buộc AI phải thực hiện (giải chi tiết 4 tầng Socrates, phân tích bản chất từng bước bằng Chain-of-Thought, khơi mở tư duy và đặt câu hỏi phản biện Active Recall ở cuối bài).
2. 🧠 **CƠ SỞ NHẬN THỨC & BỐI CẢNH (WHAT THE AI MUST UNDERSTAND):** Định hình rõ đối tượng người học Lớp 10/11/12, mục tiêu điểm số (8.5+), và liệt kê danh sách các bẫy phòng thi trắc nghiệm học sinh hay mắc phải để AI cảnh báo trước.
3. 📖 **DẪN CHỨNG & CHỈ DẪN CÓ CHỦ ĐÍCH (INTENTIONAL CITATIONS & INSTRUCTIONS):** Cung cấp tên cuốn sách giáo khoa cụ thể, mã file PDF gốc, link Google Drive và CHỈ DẪN BẮT BUỘC AI phải đối chiếu định lý, định luật và số trang SGK để bảo chứng kết quả.
4. ⚡ **RÀNG BUỘC KỸ THUẬT & ĐỊNH DẠNG ĐẦU RA (OUTPUT CONSTRAINTS & FORMAT):** Ràng buộc 100% công thức LaTeX `$..$`, danh pháp IUPAC tiếng Anh, bảng so sánh và cấu trúc 4 tầng Socrates.

---

### 🔹 BƯỚC 5: Sao Chép Prompt & Nạp Vào AI Của Bạn
- Bấm nút **"Sao chép Prompt"** hoặc **"Copy Toàn Bộ File SKILL.md"**.
- Mở nền tảng AI bạn sử dụng:
  - **Google Gemini 1.5 Pro / AI Studio:** Dán vào ô Chat kèm file PDF bài học (tải từ Drive) để tận dụng cửa sổ 2 triệu tokens.
  - **Anthropic Claude (Projects):** Tải file `.SKILL.md` lên mục Project Knowledge.
  - **OpenAI ChatGPT:** Dán vào ô Chat hoặc tạo Custom GPT.
  - **Google NotebookLM:** Nạp link PDF SGK làm nguồn và bấm nghe Podcast đàm thoại bài giảng.

---

## 💡 3. Cách Đọc Hiểu Lời Giải 4 Tầng Socrates

Khi nhận được phản hồi từ AI sử dụng kỹ năng `/giai-chi-tiet`, hãy học theo 4 tầng:

```text
[TẦNG 1: GỢI MỞ TƯ DUY SOCRATES]
👉 Đọc gợi ý hướng đi, dừng lại 3 phút tự lấy giấy nháp làm thử.

[TẦNG 2: BẢN CHẤT KHOA HỌC & CHIẾN THUẬT GIẢI]
👉 Đối chiếu định lý, công thức xem mình đã nắm chắc lý thuyết SGK chưa.

[TẦNG 3: LỜI GIẢI CHI TIẾT TỪNG BƯỚC (LATEX CHUẨN)]
👉 So sánh từng bước biến đổi đại số / hình học với bài làm của mình.

[TẦNG 4: GIẢI MÃ BẪY PHÒNG THI & BÀI TẬP TỰ LUYỆN]
👉 Ghi chép các bẫy dễ mất điểm vào sổ tay và tự giải bài tập tương tự.
```

---

## 📚 4. Bảng Tra Cứu Kho Sách Giáo Khoa Cloud Chi Tiết

| Khối Lớp | Dung Lượng | File PDF SGK Tiêu Biểu | Thư Mục Google Drive Trực Tiếp |
| :---: | :---: | :--- | :---: |
| 📗 **Lớp 10** | **74 files** | • `10-sgk-toan-10-tap-mot.pdf`<br/>• `10-sgk-vat-li-10.pdf`<br/>• `10-sgk-hoa-hoc-10.pdf`<br/>• `10-sgk-tieng-anh-10-global-sucess.pdf` | [👉 Mở Kho Sách Lớp 10](https://drive.google.com/drive/folders/1H4BU2OMP1h5VJUtF8iQp9Dpmo40oHX6o?usp=drive_link) |
| 📘 **Lớp 11** | **10 files** | • `11-sgk-toan-11-tap-mot.pdf`<br/>• `11-sgk-vat-li-11.pdf`<br/>• `11-sgk-chuyen-de-hoc-tap-hoa-hoc-11.pdf` | [👉 Mở Kho Sách Lớp 11](https://drive.google.com/drive/folders/1w8QOaRc_V5It9Xh0PvT_QwO_G7V22jZr?usp=drive_link) |
| 📙 **Lớp 12** | **46 files** | • `12-sgk-toan-12-tap-mot.pdf`<br/>• `12-shs-vat-li-12.pdf`<br/>• `12-sgk-chuyen-de-hoc-tap-hoa-hoc-12.pdf`<br/>• `12-sgk-sinh-hoc-12.pdf` | [👉 Mở Kho Sách Lớp 12 (Trọng tâm thi)](https://drive.google.com/drive/folders/1I3h4nfdJTO5KdPsD4UWYdYJlMXQL1YwD?usp=drive_link) |
