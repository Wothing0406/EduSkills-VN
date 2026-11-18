# Templates Phát Triển Skill Mới (Ngoài `skills/`)

Thư mục `templates/` chứa khung chuẩn để biên soạn skill đại học hoặc nghiên cứu mới theo đúng quy trình 12 bước tại [`docs/11_QUY_TRINH_PHAT_TRIEN_SKILL_MOI.md`](../docs/11_QUY_TRINH_PHAT_TRIEN_SKILL_MOI.md).

- **Lưu ý cài đặt CLI:** Template nằm ngoài `skills/` để `npx skills add "." --list` chỉ phát hiện các skills đã triển khai thật, không nhận nhầm mẫu trống.
- **Cách dùng khi thêm skill mới:**
  1. Kiểm tra đủ điều kiện giai đoạn/Lớp D và đặt tên thư mục `kebab-case` không dấu trong `skills/<ten-skill>/`.
  2. Sao chép `templates/university-skill-template/` sang `skills/<ten-skill>/`.
  3. Thay toàn bộ khối khung bằng nội dung chuyên môn, phản ví dụ, nguồn đã xác minh và bảng lỗi riêng của ngành (không để sót placeholder `[...]` hoặc `TBD`).
  4. Tạo bộ test trong `tests/multidisciplinary/`, cập nhật `catalog/skills-catalog.json`, `catalog/prerequisite-graph.json`, `scripts/validate_skills.py`, rồi chạy kiểm định và benchmark cả điều kiện A (chỉ `SKILL.md`) lẫn điều kiện B (đủ thư mục + công cụ).
