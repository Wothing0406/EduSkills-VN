# Catalog Đa Ngành EduSkills-VN (THPT $\to$ Đại Học $\to$ Nghiên Cứu)

Nguồn JSON máy đọc: [`catalog/skills-catalog.json`](skills-catalog.json).  
**Nguyên tắc độc lập:** Catalog dùng để điều phối và theo dõi chất lượng dự án; **không phải phụ thuộc bắt buộc** khi cài riêng bất kỳ skill nào qua `npx skills add`.

---

## 1. Kiến trúc Phân tầng 4 Lớp + Nền tảng THPT

| Tầng | Phạm vi | Số skill đã có thư mục thật trong `skills/` | Trạng thái công bố |
|---|---|---:|---|
| **THPT (Lớp 10–12)** | 11 môn học GDPT 2018 + 5 meta-tools (`v2.4.0`) | **16** | `released` (đã test `24` ca + `7` hồi quy trên `gemini-3.1-flash-lite`; chưa gắn `expert-reviewed`) |
| **Lớp A (Giai đoạn 1 + Tư vấn)** | `chuyen-tiep-dai-hoc`, `hoc-dai-hoc-hieu-qua`, `viet-hoc-thuat`, `phuong-phap-nghien-cuu`, `tu-van-huong-nghiep-tuyen-sinh`, `tu-van-tam-ly-hoc-duong` | **6** | 4 skill học thuật/nghiên cứu đạt `behavior-tested`; 2 skill tư vấn ở trạng thái `structurally-valid` |
| **Lớp B (Giai đoạn 1)** | `giai-tich-dai-hoc`, `dai-so-tuyen-tinh`, `xac-suat-thong-ke`, `lap-trinh-can-ban` | **4** | Đang kiểm định cấu trúc & chạy test đa ngành (`v1.0.0`) |
| **Giai đoạn 2 (Lộ trình)** | `vat-li-dai-cuong`, `hoa-hoc-dai-cuong`, `sinh-hoc-dai-cuong`, `kinh-te-hoc-co-ban`, `doc-phan-bien-paper`, `phan-tich-du-lieu`, `thiet-ke-thi-nghiem`, `do-an-dai-hoc` | **0** *(không tạo file rỗng)* | `planned` |
| **Lớp C & Lớp D (Lộ trình)** | 14 nhóm ngành nền tảng & học phần chuyên sâu (*cấu-trúc-dữ-liệu, học-máy, kinh-tế-vi-mô, di-truyền-học...*) | **0** *(chỉ mở khi đủ 6 điều kiện & hoàn tất Giai đoạn 1–2)* | `planned` |

---

## 2. Danh mục 8 Skills Giai Đoạn 1 (Đang Triển Khai & Kiểm Chứng)

| Skill (`kebab-case`) | Lớp | Kiến thức đầu vào chính | Chuẩn đầu ra trọng tâm | Nguồn đã xác minh |
|---|---|---|---|---|
| `chuyen-tiep-dai-hoc` | Lớp A | THPT 10–12 tương ứng môn | Ánh xạ syllabus ĐH $\to$ THPT; chẩn đoán mini-probe không gán nhãn mất gốc; lập lộ trình bù phẫu thuật; bài chuyển giao | `TT 08/2021/TT-BGDĐT`, GDPT 2018 |
| `hoc-dai-hoc-hieu-qua` | Lớp A | `chuyen-tiep-dai-hoc` | Giải mã syllabus/CLO; lịch tự học tín chỉ 1:2; SQ3R + Cornell + Active Recall; kỷ luật AI | `TT 08/2021/TT-BGDĐT` |
| `giai-tich-dai-hoc` | Lớp B | `toan-thpt`, `chuyen-tiep-dai-hoc` | Kiểm chứng điều kiện định lý + phản ví dụ; tính giới hạn, Taylor, suy rộng, chuỗi, Hessian/Lagrange | OpenStax *Calculus Vol. 1–3* (Strang & Herman) |
| `dai-so-tuyen-tinh` | Lớp B | `toan-thpt`, `chuyen-tiep-dai-hoc` | Tính RREF, $\det$, $\text{Col}/\text{Null}$, trị riêng–chéo hóa; chứng minh $\text{rank}+\text{nullity}=n$; công nhận Cramer/Gauss | MIT OCW 18.06 *Linear Algebra* (Strang) |
| `xac-suat-thong-ke` | Lớp B | `toan-thpt`, `chuyen-tiep-dai-hoc`, `giai-tich-dai-hoc` | Tính phân phối/Bayes/CI/test $Z, t, \chi^2$; phân biệt $p$-value & nhân quả; báo cáo missing data trung thực | OpenStax *Introductory Statistics* |
| `lap-trinh-can-ban` | Lớp B | `tin-hoc-thpt`, `chuyen-tiep-dai-hoc` | Triển khai Python/C++, đệ quy an toàn, Big-$O$, Trace Table debug & thiết kế $\ge 4$ nhóm test biên | OpenStax *Introduction to Python Programming* |
| `viet-hoc-thuat` | Lớp A | `ngu-van-thpt`, `chuyen-tiep-dai-hoc` | Thiết kế IMRaD, viết `Claim–Evidence–Warrant`, chuẩn APA 7 / IEEE, Zero Fake-Citation/DOI | APA Style 7th Edition (`apastyle.apa.org`) |
| `phuong-phap-nghien-cuu` | Lớp A | `chuyen-tiep-dai-hoc`, `viet-hoc-thuat`, `xac-suat-thong-ke` | 14 bước nghiên cứu + chọn đúng trong 10 loại hình theo đặc thù ngành; 7 bậc nguồn/9 trường truy vết; dữ liệu tái lập | Creswell & Creswell (*Research Design*) |
| `tu-van-huong-nghiep-tuyen-sinh` | Lớp A | `toan-thpt`, `ngu-van-thpt`, `ktpl-thpt` | Hướng nghiệp 4 trục (RIASEC), xếp $\le 15$ nguyện vọng 3 tầng (Sư phạm 01–05, sàn 15,00đ), không bịa điểm chuẩn | `TT 06/2026/TT-BGDĐT` |
| `tu-van-tam-ly-hoc-duong` | Lớp A (Rủi ro cao) | Sàng lọc an toàn tâm lý | Lắng nghe OARS/Validation, bước nhỏ 24–48h, cấm chẩn đoán DSM-5/ICD-11, chuyển tuyến `111`/`115`/`113` khi có Red-Flag | `TT 18/2025/TT-BGDĐT` |
