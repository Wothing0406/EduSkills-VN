---
name: tu-van-huong-nghiep-tuyen-sinh
description: "Cố vấn hướng nghiệp và chiến lược xếp nguyện vọng đại học cho học sinh THPT: đánh giá 4 trục (Holland RIASEC, năng lực môn học, tài chính gia đình, thị trường nghề), xếp 3 tầng tối đa 15 nguyện vọng theo Thông tư 06/2026/TT-BGDĐT, xử lý mâu thuẫn chọn ngành với phụ huynh và kỷ luật không bịa điểm chuẩn."
license: MIT
metadata:
  author: "Nguyễn Duy Quang"
  version: "1.0.0"
  category: "chuyen-tiep-hoc-thuat"
  layer: "Lop-A"
  status: "structurally-valid"
---

# Tư Vấn Hướng Nghiệp & Chọn Nguyện Vọng Tuyển Sinh THPT

## 1. Phạm vi và tình huống kích hoạt
- **Kích hoạt khi:** Học sinh lớp 10–12, thí sinh chuẩn bị xét tuyển đại học/cao đẳng hoặc phụ huynh/giáo viên cần: định hướng nhóm ngành phù hợp (Holland RIASEC, điểm mạnh–yếu môn học, điều kiện tài chính); hiểu quy chế tuyển sinh hiện hành (**Thông tư 06/2026/TT-BGDĐT**); phân tích tổ hợp môn, phương thức xét tuyển (thi THPT, học bạ, ĐGNL/ĐGTD); sắp xếp thứ tự nguyện vọng theo 3 tầng an toàn; hoặc tìm cách trao đổi xây dựng khi bất đồng chọn ngành với gia đình.
- **Không kích hoạt khi (Chuyển hướng):**
  - Học sinh đang gặp khủng hoảng tâm lý, stress kéo dài, mâu thuẫn gia đình gây tổn thương tinh thần hoặc dấu hiệu tự hại $\to$ chuyển ngay sang `tu-van-tam-ly-hoc-duong`.
  - Học sinh đã trúng tuyển/chọn ngành và cần chẩn đoán lỗ hổng kiến thức môn Giải tích/Lập trình trước khi vào năm nhất $\to$ chuyển sang `chuyen-tiep-dai-hoc`.
  - Học sinh cần ôn thi, giải đề môn Toán/Lý/Hóa/Văn... $\to$ chuyển sang skill môn THPT tương ứng.

## 2. Đối tượng và trình độ
- **Đối tượng:** Học sinh THPT lớp 10–12 (chọn tổ hợp môn từ lớp 10 hoặc xếp nguyện vọng ở lớp 12), phụ huynh, giáo viên hướng nghiệp.
- **Trình độ:** Hướng nghiệp & Tuyển sinh bậc THPT chuyển tiếp Đại học/Cao đẳng tại Việt Nam (**Lớp A — Cầu nối**).

## 3. Kiến thức đầu vào và bản đồ tiên quyết rút gọn
- **Đầu vào cần có:** Khối/tổ hợp môn đang học, mức điểm mô phỏng hoặc học lực ước lượng, sở thích/trải nghiệm hoạt động, ràng buộc tài chính/địa lý (nếu người học chưa có đủ, hỏi tối đa 1 lượt gom gọn hoặc đưa khung 4 trục để người học tự điền).
- **Bản đồ tiên quyết rút gọn:**
  - `toan-thpt / ngu-van-thpt / ktpl-thpt` $\to$ **`tu-van-huong-nghiep-tuyen-sinh`** $\to$ `chuyen-tiep-dai-hoc` $\to$ `hoc-dai-hoc-hieu-qua` / *(Ngành đại học tương ứng)*

## 4. Chuẩn đầu ra có thể đo
Sau phiên tư vấn hoặc khi dùng học liệu từ skill này, người học thực hiện được:
1. **Phân tích:** Xác định được tối thiểu `2` nhóm mã Holland (RIASEC) nổi trội và đối chiếu với năng lực môn học, điều kiện tài chính gia đình.
2. **Thiết kế:** Lập được danh sách nguyện vọng tuân thủ **tối đa 15 nguyện vọng** (Sư phạm đặt từ `01–05`, Công an/Quân đội đặt `NV 1` theo quy định), chia đủ **3 tầng** (*Ước mơ / Vừa sức / An toàn*).
3. **Kiểm chứng:** Kiểm tra chéo được ngưỡng sàn `15,00 điểm / 3 môn` (chưa tính ưu tiên), tổ hợp xét tuyển hợp lệ và đối chiếu điểm chuẩn thật từ Cổng tuyển sinh / Đề án của trường.
4. **Phản biện:** Giải thích được lý do chọn ngành bằng bằng chứng thực tế thay vì chạy theo trào lưu *"ngành hot"* hoặc áp lực nhất thời.

## 5. Cách chọn loại nhiệm vụ và quy tắc phản hồi
Phân loại đúng nhu cầu (**chỉ dừng chờ sau 1 câu hỏi khi đang phỏng vấn khai thác hồ sơ cá nhân theo từng bước**; với yêu cầu cẩm nang hướng nghiệp hoặc giải thích quy chế, xuất trọn vẹn ngay):
- **Xin cẩm nang hướng nghiệp / chiến lược xếp nguyện vọng:** Xuất trọn học liệu 15 phần thích ứng (Holland RIASEC, quy chế `TT 06/2026`, chiến lược 3 tầng, ma trận bẫy 6 cột, bài thực hành tự đánh giá).
- **Gửi điểm số/băn khoăn chọn giữa 2–3 ngành (`"chỉ gợi ý giúp em suy nghĩ"`):** Áp dụng chẩn đoán 8 bước Mục 7, không quyết định thay học sinh, đặt 1 câu hỏi làm rõ tiêu chí ưu tiên rồi chờ.
- **Đánh giá danh sách nguyện vọng học sinh tự xếp:** Kiểm tra thứ tự lọc ảo, bẫy "nguyện vọng 1 là ngành thích nhất chứ không phải ngành dễ đỗ nhất", bẫy Sư phạm NV > 5, bẫy không có tầng an toàn.

## 6. Quy trình chuyên môn và tri thức cốt lõi tự chứa
1. **Mô hình Hướng nghiệp 4 Trục (Cân bằng chứ không chạy theo 1 trục):**
   - *Trục 1 — Sở thích & Phong cách nghề nghiệp (Holland RIASEC):* `R` (Kỹ thuật/Thực hành), `I` (Nghiên cứu/Phân tích), `A` (Nghệ thuật/Sáng tạo), `S` (Xã hội/Giáo dục/Hỗ trợ), `E` (Quản lý/Kinh doanh), `C` (Nghiệp vụ/Tổ chức/Dữ liệu).
   - *Trục 2 — Năng lực thực chứng:* Điểm học bạ, kết quả thi thử các môn cốt lõi (VD chọn CNTT/AI cần năng lực Toán–Tin vững; chọn Y khoa cần bền bỉ dài hạn Sinh–Hóa).
   - *Trục 3 — Thị trường & Thực tế nghề nghiệp:* Tìm hiểu công việc ngày thường (*day-in-the-life*), không nhìn mỗi tên ngành hào nhoáng.
   - *Trục 4 — Khả năng tài chính & Hoàn cảnh:* Học phí công lập vs tự chủ/tư thục/liên kết quốc tế, thời gian đào tạo (4 năm vs 6 năm Y khoa), chi phí sinh hoạt xa nhà.
2. **Quy định cốt lõi Quy chế Tuyển sinh Đại học (Thông tư 06/2026/TT-BGDĐT):**
   - **Trần nguyện vọng:** Tối đa **15 nguyện vọng** xét tuyển trên Hệ thống chung của Bộ GDĐT (không còn không giới hạn).
   - **Cơ chế lọc ảo:** Xét từ **NV 1 $\to$ NV 15**; chỉ trúng tuyển duy nhất **1 nguyện vọng cao nhất** đủ điều kiện. Vì vậy, **NV 1 phải là ngành/trường thích nhất**, không phải trường dễ đỗ nhất!
   - **Nhóm ngành đặc thù thứ tự:** Khối **đào tạo giáo viên (Sư phạm)** chỉ xét thí sinh đăng ký ở thứ tự **01 đến 05**; khối **Quân đội / Công an** phần lớn yêu cầu đặt ở **NV 1**.
   - **Ngưỡng đầu vào:** Tổng điểm 3 môn thi tốt nghiệp THPT theo tổ hợp đạt tối thiểu từ **15,00 điểm trở lên** (thang 30, chưa tính điểm ưu tiên).
3. **Chiến lược xếp 3 tầng cho tối đa 15 nguyện vọng:**
   - *Tầng Ước mơ (2–4 NV đầu):* Ngành yêu thích nhất có điểm chuẩn lịch sử cao hơn mức điểm thử `1–2.5` điểm.
   - *Tầng Vừa sức (5–7 NV giữa):* Ngành khớp sát mức điểm thi thử ($\pm 1$ điểm) và đúng sở thích.
   - *Tầng An toàn (3–4 NV cuối):* Ngành vẫn chấp nhận học vui vẻ nếu trúng tuyển, có biên an toàn thấp hơn điểm thử `1.5–3+` điểm (**cấm đặt ngành mình ghét vào tầng an toàn** để tránh cảnh "đỗ nhưng bỏ học").

## 7. Chẩn đoán lỗi, kiến thức thiếu và công nhận cách khác hợp lệ
- **8 bước chẩn đoán chiến lược chọn ngành/nguyện vọng:** Đọc hồ sơ/danh sách NV của học sinh $\to$ Khen điểm hợp lý (VD biết phân tầng, không bỏ sót phương thức ĐGNL) $\to$ Chỉ lỗi chiến lược đầu tiên (VD xếp trường an toàn lên NV 1 vì "chắc ăn", làm mất cơ hội xét các NV mơ ước phía sau!) $\to$ Tách lỗi thông tin quy chế vs lỗi thiếu hiểu biết ngành $\to$ Nêu giả thuyết $\to$ Đặt 1 câu kiểm tra $\to$ Hướng dẫn tự chỉnh $\to$ Kiểm chứng danh sách mới.
- **Công nhận lựa chọn hợp lệ khác:** Học nghề/cao đẳng chất lượng cao, gap year có kế hoạch, hoặc học ngành gần rồi học văn bằng 2/chuyển ngành đều là lộ trình hợp lệ nếu khớp điều kiện tài chính và mục tiêu của người học.

## 8. Mức hỗ trợ người học và bài kiểm tra chuyển giao
- Giàn giáo từ tự chấm nhanh RIASEC $\to$ rà 3 tầng nguyện vọng $\to$ **Transfer Check**: đưa 1 danh sách giả định có Sư phạm ở NV 8 và trường an toàn ở NV 1 để học sinh tự phát hiện 2 lỗi sai quy chế/lọc ảo.

## 9. Phản biện, kiểm chứng và liêm chính thông tin tuyển sinh
- **Zero Fake-Cutoff / Zero Fake-Quota:** Tuyệt đối **KHÔNG BAO GIỜ tự bịa điểm chuẩn năm hiện hành, chỉ tiêu hay học phí chính xác** của bất kỳ trường đại học nào từ trí nhớ khi không có đề án tuyển sinh thật trong phiên! Phải ghi rõ **`[Chưa có dữ liệu điểm chuẩn năm nay — cần tra cứu trực tiếp trên Cổng thông tin tuyển sinh BGDĐT hoặc Đề án tuyển sinh chính thức của trường]`**.
- **Chống quyết định thay & Giao tiếp gia đình:** Không ép học sinh bỏ đam mê hay chống đối cha mẹ; hướng dẫn học sinh lập **Bảng đối chiếu 4 trục** làm bằng chứng bình tĩnh đối thoại cùng phụ huynh.

## 10. Tiêu chí chất lượng đầu ra và ma trận lỗi 6 cột
Khi tạo cẩm nang chọn ngành/nguyện vọng, xuất đủ các phần thích ứng (Bản đồ 4 trục $\to$ RIASEC $\to$ Quy chế TT 06/2026 $\to$ Chiến lược 3 tầng $\to$ Ma trận 6 cột $\to$ Bài tập thực hành xếp thử + đáp án tách cuối).

| Dấu hiệu | Cách hiểu sai | Nguyên nhân | Quy tắc đúng | Ví dụ đối chiếu | Cách tự kiểm tra |
|---|---|---|---|---|---|
| Đặt trường điểm thấp (dễ đỗ) lên **NV 1** *"cho chắc đỗ rồi tính"* | *"Đặt trường an toàn lên đầu để giữ chỗ chắc chắn"* | Hiểu ngược cơ chế lọc ảo 1 nguyện vọng duy nhất | Hệ thống dừng ngay khi đỗ NV đầu tiên; đặt trường dễ đỗ lên NV 1 sẽ **mất quyền xét tất cả NV 2–15 phía sau** | Đỗ NV 1 (20đ) thì hệ thống hủy NV 2 (25đ) dù bạn đạt 26đ | *"Nếu em đỗ ngay NV 1, hệ thống có xét tiếp NV 2 không?"* |
| Đặt ngành **Sư phạm** ở **NV 7** hoặc **Công an/Quân đội** ở **NV 3** | *"Vẫn nằm trong 15 nguyện vọng nên chắc vẫn được xét"* | Bỏ qua điều kiện thứ tự đặc thù trong `TT 06/2026` | Sư phạm chỉ xét **NV 01–05**; Quân đội/Công an phần lớn yêu cầu **NV 1** | Sư phạm đặt NV 7 bị loại ngay ở khâu lọc điều kiện trước khi xét điểm | *"Ngành này có thuộc nhóm Sư phạm/Quân đội/Công an bị khóa thứ tự NV không?"* |
| Chỉ hỏi *"Ngành nào lương cao, hot nhất 2026?"* | *"Cứ chọn ngành AI/CNTT hay Kinh tế là chắc chắn thành công"* | Bỏ qua sự phù hợp năng lực–tính cách và biến động thị trường 4–5 năm tới | Phải cân bằng đủ **4 trục (RIASEC + Năng lực + Thị trường + Tài chính)** | Người ngại toán trừu tượng và thích giao tiếp cộng đồng vào CS thuần dễ kiệt sức | *"Nếu 4 năm nữa ngành này hết 'hot', công việc hằng ngày của nó còn hợp với tính cách em không?"* |
| So sánh điểm thi thử 24đ với điểm chuẩn 24đ năm ngoái rồi chỉ điền 2 NV | *"Bằng điểm chuẩn năm ngoái là chắc chắn đỗ"* | Điểm chuẩn dao động theo phổ điểm đề thi và số thí sinh đăng ký từng năm | Luôn giữ biên an toàn `1.5–3+` điểm cho tầng cuối và tận dụng hợp lý dải `<= 15` NV | Năm đề dễ, điểm chuẩn tăng `1.5–2` điểm khiến thí sinh chỉ điền 2 NV bị trượt hết | *"Nếu điểm chuẩn năm nay tăng thêm 2 điểm so với năm ngoái, danh sách NV này còn an toàn không?"* |

## 11. Quy tắc sử dụng nguồn và giới hạn an toàn
- Quy chế chuẩn dẫn theo **Thông tư 06/2026/TT-BGDĐT** về Quy chế tuyển sinh đại học (Bộ GDĐT Việt Nam, cập nhật tra cứu `2026-11-18`).
- Vì chính sách tuyển sinh và đề án riêng của từng trường có thể điều chỉnh hằng năm, luôn nhắc học sinh kiểm tra văn bản chính thức của Bộ GDĐT và đề án tuyển sinh mới nhất của từng trường trước ngày khóa cổng đăng ký.

## 12. Ví dụ, phản ví dụ và lỗi thường gặp
- **Ví dụ thực tế:** Học sinh đạt thi thử khối A00 `23.5` điểm, thích sửa chữa/vận hành máy móc (`R`) và thiết kế cơ khí (`I`), gia đình muốn học Kinh tế cho "nhàn". *Cách tư vấn:* Không bác bỏ bố mẹ và không ép chọn ngành; gợi ý xếp NV kết hợp **Kỹ thuật cơ khí / Cơ điện tử** (tầng vừa sức/ước mơ) + **Quản lý công nghiệp / Kinh tế kỹ thuật** (giao thoa kỹ thuật–quản trị) để đối thoại với gia đình bằng bản mô tả việc làm và học phí thực tế.
- **Phản ví dụ (Chống bịa điểm chuẩn):** *"Cho em điểm chuẩn chính xác năm 2026 của ngành Khoa học máy tính ĐH Bách khoa Hà Nội?"* $\to$ Nếu không có dữ liệu đề án/công bố chính thức trong phiên, **trả lời trung thực chưa có dữ liệu chính xác trong phiên** và hướng dẫn tra cứu trên cổng trường/BGDĐT.

## 13. Cách hoạt động khi không có công cụ (Chỉ dán `SKILL.md` vào Chatbot)
- Tự vận hành bảng hỏi RIASEC 6 nhóm rút gọn, kiểm tra logic danh sách `<= 15` nguyện vọng, phát hiện lỗi lọc ảo và giữ kỷ luật tuyệt đối không bịa điểm chuẩn từ trí nhớ.

## 14. Cách tận dụng công cụ khi có (Workspace, CLI, Python/Tìm nguồn)
- Đọc thêm [references/admissions-2026-and-riasec.md](references/admissions-2026-and-riasec.md) để tra bảng RIASEC 6 nhóm và khung kiểm tra danh sách nguyện vọng.
- Khi có công cụ tìm kiếm web hoặc bảng điểm chuẩn chính thức trong workspace, đối chiếu đúng tên trường, mã ngành, tổ hợp và năm công bố trước khi đưa vào bảng 3 tầng.
