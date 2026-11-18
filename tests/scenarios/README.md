# Bộ Tình Huống Kiểm Thử Hành Vi (Evaluation Scenarios)

Thư mục này lưu các kịch bản kiểm thử hành vi sư phạm và đối chứng phiên bản cho **16 skills THPT**.

---

## Phân biệt rõ trạng thái kiểm chứng

1. **Kiểm tra cấu trúc, liên kết, metadata & cài đặt CLI (`ĐÃ CHẠY THỰC TẾ`):**
   - `scripts/validate_skills.py`: kiểm định toàn bộ 16 skills (tên, frontmatter, liên kết nội bộ tự chứa, không công cụ giả, không quy định cứng nhắc bị cấm, `agents/openai.yaml`).
   - Validator chính thức của `skill-creator`: `quick_validate.py`.
   - `npm test`: kiểm thử tích hợp dataset, OCR parser, web bundle và HTTP REST API.
   - `npx skills add <SOURCE_PATH> --list`, cài thử 1 skill (`toan-thpt`) và cài thử toàn bộ 16 skills vào dự án tạm ngoài cây nguồn + `npx skills list`.

2. **Kiểm thử đối chứng hành vi & kiến thức trên đủ 16/16 skills ([baseline-vs-refactored.md](baseline-vs-refactored.md)):**
   - Đã đo định lượng dung lượng/cấu trúc và chạy đối chứng song song qua 4 subagent độc lập trên cả **16 skills** (`v2.0.0` Git `HEAD` vs. `v2.1.0` hiện tại) cho từng task tiêu biểu, ghi rõ điểm mạnh của bản mới lẫn giá trị/đánh đổi của bản cũ.
   - **Điểm chưa chạy thực nghiệm:** Chuỗi đối thoại **đa lượt liên tiếp (Lượt 2–3)** với học sinh thật ngoài thực tế.

3. **Kịch bản đánh giá sư phạm thiết kế sẵn (`THIẾT KẾ SẴN — ĐỂ ĐÁNH GIÁ CHẤT LƯỢNG SƯ PHẠM`):**
   - [pedagogical-12-cases.md](pedagogical-12-cases.md): 12 tình huống sư phạm cốt lõi kèm Rubric 8 tiêu chí quan sát được.
   - [holdout-eval-set.md](holdout-eval-set.md): 6 bài kiểm thử độc lập (Holdout) chưa dùng làm ví dụ mẫu trong skills.
   - [baseline-vs-refactored.md](baseline-vs-refactored.md): Báo cáo so sánh bản cũ vs bản mới.
   - 4 tệp kịch bản theo từng nhóm môn (48 tình huống kích hoạt / ranh giới / thiếu dữ kiện):
     - [khtn-scenarios.md](khtn-scenarios.md)
     - [khxh-scenarios.md](khxh-scenarios.md)
     - [ngon-ngu-cong-nghe-scenarios.md](ngon-ngu-cong-nghe-scenarios.md)
     - [meta-tools-scenarios.md](meta-tools-scenarios.md)
