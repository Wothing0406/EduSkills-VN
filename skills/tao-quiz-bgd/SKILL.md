---
name: tao-quiz-bgd
description: "Thiết kế câu hỏi kiểm tra mức hiểu, bài luyện tập biến thể và đề thi thử THPT theo đúng cấu trúc từng môn của Bộ GD&ĐT (QĐ 764/QĐ-BGDĐT). Sử dụng khi giáo viên hoặc học sinh cần tạo vài câu kiểm chứng lỗ hổng, mini-test ôn tập 2 học kì hoặc đề thi THPT kèm đáp án."
license: MIT
metadata:
  author: "Nguyễn Duy Quang"
  version: "2.1.0"
  category: "meta-tools"
---

# Tạo Câu Hỏi Luyện Tập & Đề Thi Chuẩn BGD&ĐT

## 1. Phạm vi và cách chọn chế độ
- **Phạm vi:** Thiết kế câu hỏi chẩn đoán mức hiểu, bài luyện tập biến thể (vừa sức sau khi sửa lỗi), bài ôn tập tổng hợp 2 học kì và đề kiểm tra/thi thử cho tất cả 11 môn thi THPT theo Chương trình GDPT 2018 & QĐ 764/QĐ-BGDĐT. Hoạt động độc lập hoàn toàn.
- **Điều chỉnh quy mô linh hoạt theo nhu cầu:**
  - *Chế độ câu hỏi chẩn đoán / kiểm tra mức hiểu (1–3 câu):* Dùng khi học sinh vừa học xong khái niệm mới hoặc vừa sửa xong lỗi và cần 1–2 câu đổi dữ kiện/ngữ cảnh để tự làm ngay. **Không** bắt buộc sinh đủ cả bộ đề 28 câu trong tình huống này.
  - *Chế độ mini-test / ôn tập 2 học kì (5–12 câu):* Tập trung vào sự liên thông HK1 – HK2 và bài toán vận dụng thực tiễn.
  - *Chế độ đề kiểm tra đầy đủ (22/28/40 câu hoặc tự luận Ngữ văn):* Áp dụng khi người dùng yêu cầu rõ tạo đề thi thử hoàn chỉnh đúng cấu trúc môn theo QĐ 764/QĐ-BGDĐT.

## 2. Xử lý dữ kiện thiếu và nguồn tài liệu
- **Tài liệu riêng:** Nếu người dùng nói *"tạo đề từ đoạn văn/bài giảng em gửi"* nhưng chưa dán nội dung, yêu cầu gửi nội dung trước, không bịa văn bản.
- **Chủ đề chuẩn THPT đã nêu rõ:** Nếu người dùng yêu cầu tạo vài câu ôn tập cho một chuyên đề chuẩn (như *"Tạo 3 câu Vật lí nhiệt lớp 12"*), làm ngay đúng quy mô yêu cầu, không chặn học sinh bằng bảng khảo sát dài dòng.
- **Ưu tiên tài liệu người dùng:** Bám sát ma trận phân bổ điểm hoặc giới hạn kiến thức riêng nếu giáo viên/học sinh cung cấp.

## 3. Quy trình thiết kế câu hỏi và đáp án
1. **Xác định đúng dạng thức của môn được yêu cầu:** Tra bảng cấu trúc từng môn trong `references/exam-matrix-qd764.md` (ví dụ Sử, KTPL, Công nghệ, Tin học chỉ có Phần I và Phần II; Tiếng Anh chỉ có 40 câu Phần I; Ngữ văn tự luận; Toán/Lý/Hóa/Sinh/Địa mới có thêm Phần III).
2. **Thiết kế phương án nhiễu (Distractor Engineering) có ý nghĩa chẩn đoán:** Mỗi phương án sai tương ứng với 1 lỗi tư duy thực tế (nhầm đơn vị, thiếu nghiệm, đảo dấu, đọc sai yêu cầu, ngụy biện loại trừ), tránh nhiễu vô lý dễ đoán.
3. **Tách đề và đáp án rõ ràng:**
   - Trong chế độ tương tác rèn luyện cho học sinh: đưa đề trước để học sinh tự làm (hoặc ẩn/tách đáp án bên dưới theo yêu cầu) kèm barem và giải thích vì sao phương án nhiễu có vẻ hợp lý nhưng sai.
   - Tuyệt đối không chỉ xuất mỗi danh sách chữ cái `1A, 2B, 3C` trơ trọi khi người học cần hướng dẫn giải hoặc chấm chi tiết.

## 4. Kiểm chứng chuyên môn & trung thực
- Tự giải lại toàn bộ câu hỏi vừa tạo để bảo đảm: mỗi câu Phần I có duy nhất 1 phương án đúng; các số liệu không mâu thuẫn; đáp án Phần III (với 5 môn có Phần III) không vượt quá 4 ký tự và nêu rõ cách làm tròn.
- Với ngữ liệu đọc hiểu tự biên soạn để luyện tập, đánh dấu rõ `[Ngữ liệu minh họa phục vụ luyện tập]`, không bịa tên tác phẩm hay văn kiện thật. Không lộ suy nghĩ nội bộ.

## 5. Tài liệu tham chiếu
- Khi cần tra cấu trúc chính thức cả 11 môn thi theo QĐ 764/QĐ-BGDĐT (nguồn, ngày kiểm tra, số câu, thang điểm) và kỹ thuật thiết kế phương án nhiễu: đọc [references/exam-matrix-qd764.md](references/exam-matrix-qd764.md).

## 6. Ví dụ ngắn
**Ví dụ (Tạo câu kiểm tra mức hiểu sau sửa lỗi Toán):**  
*Yêu cầu:* "Học sinh vừa sửa xong lỗi giải $x^2 = 9$ thiếu nghiệm âm, tạo giúp 1 câu kiểm chứng có thay đổi bối cảnh."  
*Đầu ra phù hợp:* Ra ngay 1 câu ngắn tương tự $(x - 1)^2 = 16$ hoặc gắn bối cảnh hình học ($x^2 = 16$ với độ dài cạnh $x > 0$) để kiểm tra xem học sinh có phân biệt được khi nào lấy 2 nghiệm và khi nào loại nghiệm âm, không tạo nguyên một đề thi 22 câu thừa thãi.
