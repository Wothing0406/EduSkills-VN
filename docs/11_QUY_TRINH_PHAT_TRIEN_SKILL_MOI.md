# Quy Trình Phát Triển Skill Mới 12 Bước & Chuẩn Chuyên Môn Đa Ngành

Tài liệu này quy định dây chuyền phát triển có kiểm soát cho mọi skill mở rộng thuộc **Lớp A (Năng lực học thuật chung)**, **Lớp B (Kiến thức nền đại học)**, **Lớp C (Nhóm ngành)** và **Lớp D (Chuyên ngành & học phần)**.

---

## 1. Quy trình 12 bước phát triển Skill mới

1. **Xác định ngành, lớp và phạm vi (Scope & Out-of-Scope):** Định rõ skill phục vụ môn/năng lực nào, đối tượng nào và trường hợp gần chủ đề nào **không** nên kích hoạt skill này.
2. **Thu thập đề cương và chuẩn đầu ra (Outcomes):** Viết chuẩn đầu ra bằng **động từ quan sát được** (*Giải thích, Phân tích, Tính toán, Chứng minh, Thiết kế, Triển khai, Kiểm chứng, So sánh, Phản biện, Tái lập*). Tuyệt đối không dùng cụm mơ hồ (*"hiểu sâu"*, *"nắm vững hoàn toàn"*) mà thiếu tiêu chí đo.
3. **Xây bản đồ tiên quyết (Prerequisite Mapping):** Nối ngược về THPT / `chuyen-tiep-dai-hoc` / Lớp A–B và nối xuôi lên học phần tiếp theo; cập nhật vào `catalog/prerequisite-graph.json`.
4. **Tìm và kiểm định nguồn chuyên môn:** Áp dụng thứ tự ưu tiên 7 bậc và lưu đủ 9 trường truy vết cho mọi tuyên bố phụ thuộc nguồn.
5. **Soạn `SKILL.md` (14 mục tự chứa) + `agents/openai.yaml` + `references/`:** Dùng `templates/university-skill-template/` làm khung khởi đầu, nhưng viết **tri thức, phản ví dụ, bẫy và rubric riêng theo chuyên môn** — không sao chép boilerplate rỗng.
6. **Tạo bộ test trước khi tối ưu prompt (`tests/multidisciplinary/`):** Thiết kế đủ các ca đúng phạm vi, ngoài phạm vi gần, cách giải đúng khác, sai khái niệm, sai tính toán, thiếu dữ kiện, giả thiết mâu thuẫn, chỉ gợi ý, giải đầy đủ, cẩm nang, nghiên cứu, nguồn/DOI giả, dữ liệu thiếu, kết luận vượt bằng chứng và bài chuyển giao.
7. **Chạy Baseline không có Skill:** Thu raw log trên mô hình mục tiêu khi không gắn skill.
8. **Chạy tách biệt 2 điều kiện Skill:**
   - **Điều kiện A (`standalone`):** Chỉ truyền duy nhất `SKILL.md` cho chatbot (không đọc `references/`, không công cụ).
   - **Điều kiện B (`workspace + tools`):** Truyền cả `SKILL.md`, `references/` và kết quả công cụ xác định (Python, kiểm tra cú pháp/dữ liệu, nguồn đối chứng). Không trộn điểm A và B.
9. **Chấm bằng Rubric + Đáp án độc lập:** Kết hợp kiểm tra xác định (regex/tính toán/code) và AI giám khảo mù nhãn có trích dẫn nguyên văn; rà soát thủ công mọi ca bất đồng hoặc lỗi nghiêm trọng.
10. **Sửa lỗi dựa trên bằng chứng thất bại:** Không sửa mò; mỗi lần sửa đều ghi rõ ca lỗi gốc.
11. **Chạy lại kiểm định cấu trúc, CLI & hồi quy:** Chạy `python scripts/validate_skills.py`, `npm test`, `npx skills add "." --list`, cài thử ra thư mục tạm ngoài repo, và chạy lại ca test hồi quy.
12. **Cập nhật Catalog & Đánh dấu trạng thái phát hành trung thực.**

---

## 2. Vòng đời 7 trạng thái phát hành (Lifecycle States)

| Trạng thái | Điều kiện bắt buộc để gắn nhãn | Cấm vi phạm |
|---|---|---|
| `planned` | Chỉ nằm trong danh mục lộ trình `catalog/skills-catalog.json` | Không tạo thư mục rỗng trong `skills/` |
| `draft` | Đã tạo `SKILL.md` + `agents/openai.yaml` đúng template | Không công bố đã sẵn sàng sử dụng |
| `source-reviewed` | Nguồn chuyên môn đã kiểm tra tồn tại, lưu đủ 9 trường truy vết | Không dùng DOI/URL chưa tra cứu thật |
| `structurally-valid` | Vượt qua `validate_skills.py`, `npm test` và cài thử `npx skills add` | Chưa chứng minh hành vi sư phạm |
| `behavior-tested` | Đã chạy đủ Baseline + Điều kiện A + Điều kiện B có raw log & báo cáo | Chỉ được mô tả trên model/cỡ mẫu đã chạy |
| `expert-reviewed` | Có **chuyên gia thật** (giảng viên/nhà nghiên cứu đúng ngành) ký duyệt học thuật | **CẤM tự gắn `expert-reviewed` nếu chỉ có AI tự kiểm** |
| `released` | Đạt đủ 10 điều kiện hoàn thành Mục 22 và không còn lỗi nghiêm trọng mở | Phải kèm ngày `revalidate_by` cho nội dung đổi theo thời gian |
| `needs-revalidation` | Quá hạn `revalidate_by` hoặc pháp quy/chuẩn chuyên ngành thay đổi | Buộc rà lại nguồn trước khi giữ nhãn `released` |

---

## 3. Điều kiện mở Skill Lớp D (Chuyên ngành & Học phần sâu)

Chỉ được tạo thư mục mới thuộc **Lớp D** trong `skills/` khi có đủ **6 điều kiện**:
1. Phạm vi và ranh giới môn/học phần rõ ràng.
2. Đề cương chi tiết hoặc chuẩn đầu ra CLO cụ thể.
3. Nguồn chuyên môn đáng tin cậy (giáo trình chuẩn, tiêu chuẩn ngành, tài liệu pháp quy hoặc paper gốc).
4. Cơ chế hoặc người thẩm định chuyên môn.
5. Bộ test case có đáp án và rubric chấm độc lập.
6. Quy tắc an toàn và giới hạn nghề nghiệp rõ ràng (bắt buộc với y tế, dược, pháp luật, tài chính, kết cấu công trình, điện cao áp, hóa chất).

---

## 4. Quy chuẩn Nguồn, Dữ liệu Tái lập & Lĩnh vực Rủi ro Cao

- **Thứ tự ưu tiên nguồn tham khảo (tùy chỉnh theo mục tiêu câu hỏi):**
  1. Văn bản pháp lý hoặc tiêu chuẩn chính thức (ISO, TCVN, Luật, Thông tư).
  2. Bài báo gốc đã bình duyệt (peer-reviewed).
  3. Tổng quan hệ thống (systematic review / meta-analysis) hoặc hướng dẫn chuyên môn chính thức.
  4. Giáo trình học thuật chuẩn đại học.
  5. Cơ sở dữ liệu chính thức (Tổng cục Thống kê, World Bank, PubMed, IEEE, ACM, v.v.).
  6. Tài liệu chính thức của cơ sở đào tạo.
  7. Nguồn thứ cấp uy tín.
- **9 trường lưu vết tuyên bố phụ thuộc nguồn:** `supported_claim`, `url_or_doi`, `author_or_org`, `year`, `accessed_date`, `source_type`, `scope`, `limitations`, `verification_status`.
- **Dữ liệu tái lập:** Ghi nguồn + giấy phép, giữ nguyên bản gốc (`raw`), tách `processed`, lưu code làm sạch/phân tích + phiên bản thư viện, ghi tiêu chí loại bỏ giá trị ngoại lệ, báo missing values & sai số/độ bất định, nối bảng kết quả với script sinh.
- **Lĩnh vực rủi ro cao (y tế, dược, pháp luật, tài chính, xây dựng/kết cấu, điện, hóa chất):** Tách nội dung giáo dục khỏi chỉ định hành động thực tế; không bịa liều dùng, chẩn đoán, điều luật hay hệ số an toàn; không thay thế chuyên gia có chứng chỉ hành nghề.
