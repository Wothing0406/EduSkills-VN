# AGENTS.md

Hướng dẫn dành cho AI agents làm việc với repository **THPT Agent Skills (EduSkills-VN)**.

## Cấu trúc dự án

- `skills/<ten-skill>/SKILL.md`: 16 skills độc lập cho học sinh và giáo viên THPT lớp 10–12 (11 skill môn học + 5 meta-tools).
- `skills/<ten-skill>/agents/openai.yaml`: metadata giao diện (`display_name`, `short_description` 25–64 ký tự, `default_prompt` chứa `$<ten-skill>`).
- `skills/<ten-skill>/references/`: tài liệu chuyên sâu theo từng môn (khung chương trình 2 học kì HK1–HK2, quy tắc 7 phần, cấu trúc thi QĐ 764/QĐ-BGDĐT, bảng bẫy và ví dụ mẫu).
- `scripts/validate_skills.py`: kiểm định toàn bộ cấu trúc, frontmatter, liên kết tự chứa, tên công cụ/tài nguyên và metadata giao diện.
- `tests/scenarios/`: bộ kiểm thử hành vi sư phạm và đối chứng phiên bản.

## Ngôn từ và quy tắc sư phạm với học sinh THPT

1. **Tôn trọng yêu cầu và phân loại 4 nhóm nhiệm vụ (A/B/C/D):**
   - **Loại A (*"ôn tập chương..., xây dựng cẩm nang, tổng hợp kiến thức, bảng phân biệt, tự kiểm tra"*):** Hoàn thành ngay học liệu có cấu trúc 8 phần đúng phạm vi (Bản đồ nội dung → Kiến thức cốt lõi từng chương → Công thức/điều kiện/ví dụ → Bảng phân biệt dễ nhầm → Ma trận bẫy 6 cột → Bài luyện tập vừa mục tiêu → Đáp án tách/ẩn & tự kiểm tra → Liên hệ liên chương); **không dừng lại sau 1 câu hỏi chẩn đoán không thiết yếu**. Không gọi mọi bẫy là *"lỗi học sinh đang mắc"* khi chưa có bài làm.
   - **Loại B (*"em sai ở đâu, chỉ gợi ý, đừng giải hết"*):** Chẩn đoán bằng bằng chứng, tách lỗi gốc khỏi lỗi kéo theo, công nhận cách giải khác hợp lệ, dùng câu có điều kiện (không gán nhãn *"mất gốc"*, *"yếu tư duy"*), đặt **1 câu hỏi trọng tâm rồi dừng chờ**, **0% lộ đáp án cuối**.
   - **Loại C (*"giải đầy đủ, cho đáp án và giải thích vì sao đúng/sai"*):** Giải trọn vẹn từng bước, kiểm chứng điều kiện/bảo toàn và giải thích rõ **vì sao phương án sai có vẻ hợp lý** kèm câu phản ví dụ/biến thể.
   - **Loại D (*"tạo @canvas, ứng dụng, học liệu tương tác"*):** Nếu môi trường hỗ trợ Canvas/HTML, xuất mã hoặc ứng dụng có các tab nội dung thật, câu hỏi chấm điểm + gợi ý mở dần + xem đáp án + làm lại thật, không lộ mã LaTeX thô (`$...$`, `\frac`) và không đặt công cụ giả. Nếu môi trường chỉ là chat thuần, nói trung thực giới hạn rồi cung cấp cẩm nang cấu trúc Tab + mã HTML/CSS/JS tự chạy ngoài chat, **không tự nhận đã khởi chạy ứng dụng**.
2. **Phạm vi quy tắc "mỗi lượt 1 câu hỏi rồi chờ":** Quy tắc dừng chờ chỉ áp dụng cho **chế độ đối thoại gợi mở / sửa bài (Loại B)**; **không** áp dụng cho soạn học liệu tổng hợp (Loại A), giải đầy đủ (Loại C), nghiên cứu hoặc tạo sản phẩm `@canvas` (Loại D).
3. **Kiểm chứng tiến bộ thực sự:** Không kết luận học sinh đã hiểu chỉ vì họ đồng ý hoặc chép lại lời giải; trong cẩm nang và luyện tập tích hợp gợi ý mở dần, đáp án tách/ẩn, phản ví dụ/kiểm tra điều kiện, bài biến thể và cách tự đánh giá.
4. **Trung thực chuyên môn:** Kiểm chứng công thức, đơn vị, nguồn pháp lý/chương trình; không ép định dạng thi tốt nghiệp QĐ 764 (22/28/40 câu) lên bài ôn giữa kỳ nếu không được yêu cầu; chỉ rõ điểm chưa xác minh và không bịa số liệu hay tài liệu tham khảo.

## Nguyên tắc bảo trì Skill

- Giữ mỗi skill tự chứa hoàn toàn bên trong `skills/<ten-skill>/` để cài riêng bằng `npx skills add` vẫn hoạt động đầy đủ.
- Không tạo `SKILL.md` ở repository root, không tạo thư mục rỗng và không khai báo tên công cụ hoặc tài nguyên không tồn tại.
- **Không lấy độ ngắn của `SKILL.md` làm mục tiêu tối ưu chính.** Mỗi `SKILL.md` phải tự chứa quy trình chọn nhiệm vụ (Loại A/B/C/D), tiêu chí đầu ra, kiến thức chuyên môn thiết yếu theo chương/lớp, bảng phân biệt khái niệm, ma trận bẫy 6 phần và ví dụ mẫu để chatbot không đọc được `references/` vẫn tạo được học liệu ôn tập và sản phẩm cốt lõi đạt chuẩn; `references/` dùng để mở rộng chiều sâu.

## Lệnh kiểm tra bắt buộc sau khi sửa

```bash
python scripts/validate_skills.py
npm test
npx skills add "." --list
```
