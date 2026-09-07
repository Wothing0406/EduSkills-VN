# Bộ Tiêu Chuẩn Prompt Mạnh Trong Học Tập (Modern Prompt Engineering)

Một prompt mạnh trong học tập hiện nay không phải là câu lệnh dài dòng, mà là câu lệnh có **cấu trúc chặt chẽ**, **giảm thiểu ảo giác (hallucination)** và **buộc AI phải kích hoạt tư duy phản biện thay vì chỉ đưa ra câu trả lời có sẵn**.

---

## 1. Khung 5 Thành Phần Cốt Lõi (Core Framework)

- **Role (Vai trò chuyên môn):** Định vị góc nhìn và trình độ chuyên môn cho AI (ví dụ: _Gia sư phương pháp Feynman_, _Giám khảo chấm thi chuyên ngành_, _Kỹ sư tối ưu thuật toán_).
- **Context (Bối cảnh & Trình độ hiện tại):** Nêu rõ cấp độ kiến thức của người học, mục tiêu cụ thể (ôn thi, hiểu bản chất, làm đề tài nghiên cứu) và những gì đã nắm vững.
- **Task (Nhiệm vụ cụ thể):** Hành động chính xác cần thực hiện. Tránh các câu chung chung như _"giải thích X"_; thay vào đó dùng _"phân tích cơ chế hoạt động của X, so sánh với Y và chỉ ra 3 lỗi sai phổ biến"_.
- **Constraints & Format (Ràng buộc & Định dạng):** Giới hạn độ dài, phong cách hành văn, yêu cầu chia bảng so sánh, dùng công thức LaTeX hoặc code mẫu có chú thích từng dòng.
- **Cognitive Prompts (Kỹ thuật kích hoạt tư duy):**
  - _Chain-of-Thought:_ Yêu cầu giải thích từng bước (step-by-step) trước khi kết luận.
  - _Socratic Method:_ Yêu cầu AI đặt câu hỏi gợi mở để người học tự tư duy thay vì đưa ngay đáp án.
  - _Few-shot:_ Đưa kèm 1–2 ví dụ mẫu về phong cách hoặc định dạng mong muốn.

---

## 2. Bảng So Sánh Prompt Yếu vs. Prompt Mạnh

| Tiêu chí                  | Prompt yếu / Lỗi thời             | Prompt mạnh đạt chuẩn học tập                                                                                                                                                                                                                                                                   |
| :------------------------ | :-------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mục tiêu lý thuyết**    | "Giải thích thuật toán Dijkstra." | "Đóng vai trò là giảng viên Cấu trúc dữ liệu & Giải thuật. Hãy giải thích cơ chế của thuật toán Dijkstra theo phương pháp trực quan cho học sinh/sinh viên mới học. Đi kèm bảng mô phỏng từng bước (trace) trên một đồ thị mẫu gồm 5 đỉnh và nêu rõ điều kiện thuật toán bị sai (trọng số âm)." |
| **Sửa lỗi / Tối ưu code** | "Sửa code này giúp tôi: [Code]"   | "Đóng vai trò chuyên gia review mã nguồn. Hãy kiểm tra đoạn mã dưới đây về: độ phức tạp thời gian/không gian ($O(n)$), các trường hợp biên (edge cases) có thể gây tràn mảng/lỗi bộ nhớ, và đề xuất cách tối ưu. Giải thích nguyên nhân của từng lỗi sai trước khi đưa ra code sửa đổi."        |
| **Học hiểu bản chất**     | "Tóm tắt bài học X."              | "Hãy đóng vai trò là người phản biện phương pháp học (Feynman). Tôi sẽ giải thích khái niệm X bằng từ ngữ của mình bên dưới. Hãy chỉ ra những điểm tôi hiểu sai, những lỗ hổng logic và đặt cho tôi 2 câu hỏi tình huống thực tế để kiểm tra mức độ hiểu sâu."                                  |

---

## 3. Khung Mẫu Chuẩn (Template) Áp Dụng Nhanh

> **[Vai trò]:** Bạn là [chuyên gia/gia sư môn X].  
> **[Bối cảnh]:** Tôi đang tự học [chủ đề/thuật toán/khái niệm], hiện nắm được phần [A] nhưng chưa rõ về [B].  
> **[Yêu cầu]:** Hãy giải thích [nội dung cụ thể] bằng cách:
>
> 1. Phân tích bản chất theo từng bước (step-by-step).
> 2. Đưa ra một ví dụ/phép ẩn dụ thực tế minh họa.
> 3. Chỉ ra 2 lỗi sai/hiểu nhầm phổ biến nhất.  
>    **[Ràng buộc & Định dạng]:** Trình bày bằng markdown, sử dụng gạch đầu dòng rõ ràng, [kèm bảng/code/công thức toán nếu cần]. Cuối phản hồi, hãy đặt cho tôi 1 câu hỏi bài tập ngắn để tôi tự kiểm tra kiến thức.
