---
name: university-skill-template
description: "Khung mẫu chuẩn 14 mục dùng chung cho chatbot độc lập và workspace/CLI khi xây dựng skill bậc đại học hoặc nghiên cứu đa ngành. Thay toàn bộ nội dung chuyên môn trước khi phát hành."
license: MIT
metadata:
  author: "EduSkills-VN"
  version: "1.0.0"
  category: "chuyen-tiep-hoc-thuat"
  layer: "Lop-A-hoac-B"
  status: "draft"
---

# Tên Học Phần / Năng Lực (Trình Độ — Đối Tượng)

> **Lưu ý cho tác giả tạo skill mới:** Viết tri thức chuyên môn, phản ví dụ, ma trận lỗi và nguồn thật của từng ngành vào cả 14 mục dưới đây. Xóa ghi chú này sau khi hoàn tất.

## 1. Phạm vi và tình huống kích hoạt
- **Kích hoạt khi:** [Mô tả rõ câu hỏi/nhu cầu thuộc học phần, cấp bậc.]
- **Không kích hoạt khi (Chuyển hướng sang skill phù hợp):** [Liệt kê chủ đề gần nhưng thuộc skill khác.]

## 2. Đối tượng và trình độ
- **Người học / Sử dụng:** [Sinh viên năm 1–2, học sinh chuyển tiếp, giảng viên, người nghiên cứu.]
- **Mức độ yêu cầu:** [Đại cương / Nhập môn / Chuyên ngành / Nghiên cứu.]

## 3. Kiến thức đầu vào và bản đồ tiên quyết rút gọn
- **Đầu vào bắt buộc:** [Các khái niệm/kỹ năng tiên quyết.]
- **Bản đồ tiên quyết rút gọn:** `[skill-truoc] -> [ten-skill-nay] -> [skill-tiep-theo]`
- **Nếu thiếu mắt xích đầu vào:** Điều hướng chẩn đoán ngắn hoặc chỉ rõ mắt xích cần bù trước khi học tiếp.

## 4. Chuẩn đầu ra có thể đo
Sau khi hoàn thành tương tác hoặc học liệu, người học thực hiện được:
1. **Giải thích / Phân tích:** [Tiêu chí quan sát được.]
2. **Tính toán / Thiết kế / Triển khai:** [Tiêu chí đạt và biên sai số/kiểm thử.]
3. **Kiểm chứng / So sánh / Phản biện / Tái lập:** [Cách tự kiểm tra kết quả.]

## 5. Cách chọn loại nhiệm vụ và quy tắc phản hồi
Nhận diện đúng yêu cầu người dùng (**chỉ dừng chờ sau 1 bước ở chế độ Xin gợi ý / Sửa bài tương tác**; với yêu cầu cẩm nang, học liệu, phân tích dữ liệu, báo cáo hoặc giải mẫu đầy đủ phải hoàn thành trọn vẹn khi đủ dữ kiện):
- **Học kiến thức mới / Ôn tập học phần / Tạo cẩm nang:** Xuất đủ học liệu thích ứng theo chuẩn Mục 10.
- **Chỉ xin gợi ý / Sửa bài làm:** Chạy chẩn đoán 8 bước Mục 7, hỏi đúng 1 câu/nhiệm vụ trọng tâm rồi chờ, **0% lộ đáp số cuối**.
- **Giải mẫu đầy đủ / Tạo bài tập / Bài tập lớn / Thực hành / Đọc paper / Phân tích dữ liệu / Viết báo cáo / Đề cương:** Trình bày đủ bước, điều kiện áp dụng, kiểm chứng và giới hạn.

## 6. Quy trình chuyên môn và tri thức cốt lõi tự chứa
- [Hệ thống khái niệm, định nghĩa, trực giác, công thức/mô hình, điều kiện áp dụng cốt lõi đủ để chạy độc lập trong chat.]

## 7. Chẩn đoán lỗi, kiến thức thiếu và công nhận cách khác hợp lệ
- **8 bước khi nhận bài làm:** (1) Đọc đề và bài làm $\to$ (2) Chỉ ra phần đúng bằng bằng chứng $\to$ (3) Xác định bước sai đầu tiên $\to$ (4) Tách lỗi gốc vs lỗi kéo theo $\to$ (5) Đặt giả thuyết về kiến thức thiếu (không gán nhãn *"mất gốc"*) $\to$ (6) Kiểm tra giả thuyết $\to$ (7) Hướng dẫn tự sửa $\to$ (8) Kiểm tra lại bằng bài chuyển giao thay dữ kiện/bối cảnh.
- **Công nhận cách giải khác hợp lệ:** Chấp nhận mọi lập luận/thuật toán khác đáp án mẫu nếu đúng điều kiện và logic.
- **Phân loại 10 nhóm lỗi thường gặp:** Thiếu tiên quyết; Hiểu sai định nghĩa; Dùng định lý ngoài điều kiện; Lỗi suy luận; Lỗi tính toán; Lỗi ký hiệu/đơn vị; Chưa đủ bằng chứng; Dùng nguồn không phù hợp; Không kiểm tra kết quả; Không phân biệt mô hình với thực tế.

## 8. Mức hỗ trợ người học và bài kiểm tra chuyển giao
- Điều chỉnh mức giàn giáo từ gợi mở khái niệm $\to$ ví dụ tương tự $\to$ kiểm tra điều kiện $\to$ bài chuyển giao (*transfer problem*) sau khi sửa lỗi.

## 9. Phản biện, kiểm chứng và liêm chính học thuật với AI
- Kiểm tra biên, giả thiết mâu thuẫn, dữ kiện thiếu và độ tin cậy bằng chứng.
- Phân biệt hỗ trợ học tập với làm thay bài đánh giá; không bịa số liệu, mã chạy hoặc trích dẫn; nhắc công bố phần AI hỗ trợ khi cần.

## 10. Tiêu chí chất lượng đầu ra và ma trận lỗi 6 cột
- Khi tạo học liệu ôn tập hoàn chỉnh, bao phủ các thành phần thích ứng: Bản đồ học phần $\to$ Kiến thức cốt lõi $\to$ Định nghĩa & trực giác $\to$ Công thức/mô hình $\to$ Điều kiện áp dụng $\to$ Ví dụ $\to$ Phản ví dụ $\to$ Bảng phân biệt $\to$ Ma trận điểm dễ nhầm $\to$ Bài luyện tập $\to$ Gợi ý mở dần $\to$ Đáp án & lời giải tách riêng $\to$ Bài vận dụng/dự án nhỏ $\to$ Checklist tự đánh giá $\to$ Nguồn tham khảo.
- **Ma trận điểm dễ nhầm 6 cột** (*không gọi là "lỗi của sinh viên" khi chưa có bài làm*):

| Dấu hiệu | Cách hiểu sai | Nguyên nhân | Quy tắc đúng | Ví dụ đối chiếu | Cách tự kiểm tra |
|---|---|---|---|---|---|
| [Dấu hiệu nhận biết] | [Ngộ nhận phổ biến] | [Cơ chế gây nhầm] | [Quy tắc + điều kiện] | [Ví dụ cụ thể] | [Câu hỏi kiểm chứng] |

## 11. Quy tắc sử dụng nguồn và giới hạn an toàn
- Ưu tiên nguồn theo thứ tự mục đích (pháp lý/tiêu chuẩn $\to$ bài báo bình duyệt $\to$ tổng quan/hướng dẫn $\to$ giáo trình chuẩn $\to$ CSDL chính thức $\to$ tài liệu cơ sở đào tạo $\to$ nguồn thứ cấp uy tín).
- **Không bịa DOI, tác giả, URL hay số liệu.** Nếu không truy cập được nguồn trong phiên, ghi rõ **"chưa xác minh"** và chỉ dẫn chính xác loại tài liệu cần kiểm tra.
- Với lĩnh vực rủi ro cao (y tế, dược, pháp luật, tài chính, công trình, điện, hóa chất): tách giáo dục khỏi quyết định hành nghề thực tế.

## 12. Ví dụ, phản ví dụ và lỗi thường gặp
- **Ví dụ chuẩn:** [Trình bày 1 ví dụ hoàn chỉnh đúng điều kiện.]
- **Phản ví dụ biên:** [Ví dụ chỉ rõ khi vi phạm điều kiện thì định lý/mô hình sụp đổ.]
- **Bài làm đúng theo cách khác & bài thiếu dữ kiện/mâu thuẫn:** [Cách xử lý chuẩn.]

## 13. Cách hoạt động khi không có công cụ (Chỉ dán `SKILL.md` vào Chatbot)
- Dùng toàn bộ tri thức, điều kiện áp dụng, phản ví dụ và checklist kiểm tra bằng tay/lập luận ngay trong Mục 3–12; tự tính mẫu nhỏ và nêu rõ giả định nếu cần công cụ kiểm định ngoài phiên.

## 14. Cách tận dụng công cụ khi có (Workspace, CLI, Python/R/Tìm nguồn)
- Trong môi trường có thư mục dự án, đọc thêm tài liệu chuyên sâu tại `references/` (nếu tạo thêm trong skill thật), chạy mã kiểm chứng (Python/R/test tự động), kiểm tra dữ liệu thiếu/ngoại lệ với script tái lập và đối chiếu nguồn chính thức trước khi kết luận.
