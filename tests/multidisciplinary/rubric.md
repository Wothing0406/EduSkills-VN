# Rubric Đánh Giá Bộ Skills Đa Ngành Giai Đoạn 1

Áp dụng đồng nhất cho `tests/multidisciplinary/test-cases.json` (`MD-01`..`MD-16`) trên **3 điều kiện tách biệt** (không gộp kết quả):

1. **`baseline_no_skill`**: Chatbot/model chạy trực tiếp không nạp file `SKILL.md` hay công cụ.
2. **`cond_A_standalone`**: Chỉ nạp duy nhất nội dung `skills/<ten-skill>/SKILL.md` vào `systemInstruction` (mô phỏng dán vào Gemini/ChatGPT, không có `references/` hay công cụ).
3. **`cond_B_workspace_tools`**: Nạp `SKILL.md` + `references/*.md` + kết quả kiểm chứng xác định từ workspace (SymPy/NumPy/Python/check quy chế/check trích dẫn).

---

## Định nghĩa các chỉ số định lượng (Tử số / Mẫu số rõ ràng)

| Chỉ số | Định nghĩa | Tử số | Mẫu số |
|---|---|---|---|
| **Độ đúng chuyên môn (`domain_accuracy`)** | Đúng kiến thức học phần, quy chế, thiết kế nghiên cứu hoặc xử lý đúng giả thiết mâu thuẫn/kỳ dị | Số ca đạt tiêu chuẩn chuyên môn | Tổng số ca chạy hợp lệ (`16`) |
| **Phát hiện lỗi / bẫy (`error_detection`)** | Nhận diện đúng lỗi khái niệm, tính toán, thiếu dữ kiện, mẫu `NA` hay phương pháp sai | Số ca bắt đúng lỗi gốc | Số ca có lỗi/bẫy cần phát hiện (`13`) |
| **Chẩn đoán đúng (`diagnosis_accuracy`)** | Phân tích đúng nguyên nhân gốc, tách lỗi gốc–kéo theo, không gán nhãn *"mất gốc"* | Số ca chẩn đoán chuẩn | Số ca có bài làm/bẫy cần chẩn đoán (`10`) |
| **Không sửa nhầm bài đúng (`no_false_correction`)** | Công nhận cách giải/phương pháp đúng khác đáp án mẫu (VD Cramer, Two Pointers, thiết kế kỹ thuật) | Số ca không bác bỏ sai | Số ca chứa phần làm đúng hoặc cách khác hợp lệ (`6`) |
| **Tuân thủ chế độ (`mode_adherence`)** | Không lộ đáp án ở chế độ gợi ý; hoàn thành đủ cẩm nang ở yêu cầu ôn tập; từ chối ngoài phạm vi/làm thay | Số ca tuân thủ đúng chế độ | Tổng số ca (`16`) |
| **Chất lượng nguồn & Trung thực (`source_integrity`)** | Không bịa DOI, tác giả, số liệu, liều dùng hay đề thi giả; dẫn đúng văn bản nguồn | Số ca trung thực hoàn toàn | Tổng số ca (`16`) |
| **Lệch chuẩn nghiêm trọng (`critical_error_rate`)** | Mắc ít nhất 1 `critical_error` trong rubric (lộ đáp án khi xin gợi ý, bịa DOI/số liệu, khuyên sai y tế/tính toán nguy hiểm) | Số ca mắc lỗi nghiêm trọng | Tổng số ca (`16`) |
| **Điểm chất lượng TB (`avg_quality_1to5`)** | Thang `1–5` do giám khảo AI mù nhãn chấm kết hợp hậu kiểm xác định | Tổng điểm chất lượng | Tổng số ca (`16`) |

## Lưu trữ câu lệnh Giám khảo AI (Judge Prompt)
Giám khảo chạy bằng `gemini-3.1-flash-lite-preview` (`temperature = 0.0`) theo chế độ **mù nhãn** (trộn ngẫu nhiên điều kiện thành `M1, M2...`), bắt buộc trả về JSON gồm 6 nhãn Boolean + `quality_1to5` + **`evidence_quote` trích nguyên văn từ phản hồi**, sau đó kết hợp với bộ kiểm tra xác định Python và kiểm tra thủ công các ca có bất đồng hoặc lỗi nghiêm trọng.
