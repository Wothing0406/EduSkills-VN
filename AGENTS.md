# AGENTS.md

Hướng dẫn dành cho AI agents làm việc với repository **THPT Agent Skills (EduSkills-VN)**.

## Cấu trúc dự án

- `skills/<ten-skill>/SKILL.md`: 16 skills độc lập cho học sinh và giáo viên THPT lớp 10–12 (11 skill môn học + 5 meta-tools).
- `skills/<ten-skill>/agents/openai.yaml`: metadata giao diện (`display_name`, `short_description` 25–64 ký tự, `default_prompt` chứa `$<ten-skill>`).
- `skills/<ten-skill>/references/`: tài liệu chuyên sâu theo từng môn (khung chương trình 2 học kì HK1–HK2, quy tắc 7 phần, cấu trúc thi QĐ 764/QĐ-BGDĐT, bảng bẫy và ví dụ mẫu).
- `scripts/validate_skills.py`: kiểm định toàn bộ cấu trúc, frontmatter, liên kết tự chứa, tên công cụ/tài nguyên và metadata giao diện.
- `tests/scenarios/`: bộ kiểm thử hành vi sư phạm và đối chứng phiên bản.

## Ngôn từ và quy tắc sư phạm với học sinh THPT

1. **Tôn trọng yêu cầu và thích ứng chế độ:** Chọn đúng chế độ (*học mới, gợi ý, sửa bài, luyện tập, giải mẫu, phản biện*); trả lời ngắn cho câu hỏi đơn giản; không ép khảo sát dài dòng hay khuôn mẫu cố định cho mọi lượt.
2. **Chẩn đoán bằng bằng chứng, không phán xét:** Công nhận phần làm đúng và cách làm khác hợp lệ; tách lỗi gốc khỏi lỗi kéo theo; dùng câu có điều kiện (*"Bước này có thể do em chưa..."*) thay vì gán nhãn cố định (*"mất gốc"*, *"yếu tư duy"*).
3. **Kỷ luật tương tác khi gợi mở:** Mỗi lượt chỉ giao một câu hỏi hoặc một nhiệm vụ trọng tâm; dừng và chờ học sinh trả lời; không vừa đặt câu hỏi gợi ý vừa viết sẵn đáp án bên dưới.
4. **Kiểm chứng tiến bộ thực sự:** Không kết luận học sinh đã hiểu chỉ vì họ đồng ý hoặc chép lại lời giải; yêu cầu giải thích lại, tự sửa hoặc giải bài biến thể khi cần xác nhận mức làm độc lập.
5. **Trung thực chuyên môn:** Kiểm chứng công thức, đơn vị, nguồn pháp lý/chương trình và chỉ rõ điểm chưa xác minh hoặc giả định khi thiếu dữ kiện; không bịa số liệu hay tài liệu tham khảo.

## Nguyên tắc bảo trì Skill

- Giữ mỗi skill tự chứa hoàn toàn bên trong `skills/<ten-skill>/` để cài riêng bằng `npx skills add` vẫn hoạt động đầy đủ.
- Không tạo `SKILL.md` ở repository root, không tạo thư mục rỗng và không khai báo tên công cụ hoặc tài nguyên không tồn tại.
- Không đẩy các tài nguyên lớn, bảng công thức dài hoặc ví dụ nhiều bước vào `SKILL.md`; giữ `SKILL.md` tinh gọn và dẫn link kèm điều kiện đọc sang `references/`.

## Lệnh kiểm tra bắt buộc sau khi sửa

```bash
python scripts/validate_skills.py
npm test
npx skills add "." --list
```
