# Kịch Bản Kiểm Thử Hành Vi: Nhóm Khoa học Xã hội (12 tình huống)

---

## 5. `ngu-van-thpt`

### Tình huống 5.1 — Phù hợp kích hoạt (Chấm và sửa đoạn văn 200 chữ)
- **Prompt người dùng:** *"Em viết xong đoạn văn NLXH 200 chữ về tinh thần vượt khỏi vùng an toàn nhưng lại chia thành 3 đoạn Mở – Thân – Kết xuống dòng cho đẹp. Sửa giúp em."*
- **Hành vi mong đợi:**
  - Cảnh báo lỗi hình thức nghiêm trọng: đề yêu cầu **"một đoạn văn"** bắt buộc viết liền mạch thành **1 khối duy nhất**, không xuống dòng tách 3 đoạn.
  - Góp ý cách gộp chuyển ý mượt mà, kiểm tra độ dài ~200 chữ và chất lượng dẫn chứng thực tế.

### Tình huống 5.2 — Gần chủ đề nhưng KHÔNG nên kích hoạt `ngu-van-thpt`
- **Prompt người dùng:** *"Tạo giúp em 1 đề kiểm tra môn Địa lí 12 chuẩn 3 phần về kinh tế biển."*
- **Hành vi mong đợi:**
  - Hoàn toàn ngoài phạm vi Ngữ văn; điều hướng sang `tao-quiz-bgd` hoặc `dia-li-thpt`.

### Tình huống 5.3 — Thiếu dữ kiện / Giả thiết sai / Cần kiểm chứng
- **Prompt người dùng:** *"Trả lời giúp em câu 1 và câu 3 phần Đọc hiểu trong đề thi thử Ngữ văn trường em sáng nay nhé!"* *(không gửi kèm văn bản ngữ liệu và câu hỏi)*
- **Hành vi mong đợi:**
  - Không bịa nội dung tác phẩm hay câu hỏi; yêu cầu người học dán đầy đủ ngữ liệu đọc hiểu và câu hỏi cụ thể.

---

## 6. `lich-su-thpt`

### Tình huống 6.1 — Phù hợp kích hoạt (Phân tích tư liệu gốc & mốc chuyển thế)
- **Prompt người dùng:** *"Giải thích giúp em sự khác nhau về ý nghĩa giữa Chiến dịch Việt Bắc 1947 và Chiến dịch Biên giới 1950 trong kháng chiến chống Pháp."*
- **Hành vi mong đợi:**
  - Phân biệt chính xác: Việt Bắc thu–đông 1947 đập tan âm mưu *"đánh nhanh thắng nhanh"*, buộc Pháp chuyển sang đánh lâu dài; Biên giới thu–đông 1950 mở rộng căn cứ Việt Bắc, khai thông biên giới Việt–Trung và **giành quyền chủ động chiến lược** trên chiến trường chính Bắc Bộ.

### Tình huống 6.2 — Gần chủ đề nhưng KHÔNG nên kích hoạt `lich-su-thpt`
- **Prompt người dùng:** *"Hãy làm giúp em 10 slide trình chiếu Marp về Chiến thắng Điện Biên Phủ để nhóm em thuyết trình tiết Lịch sử."*
- **Hành vi mong đợi:**
  - Nên ưu tiên `slide-thuyet-trinh` (về kỹ thuật tạo deck Marp 16:9, Rule of Six, Speaker Notes).

### Tình huống 6.3 — Thiếu dữ kiện / Giả thiết sai / Cần kiểm chứng
- **Prompt người dùng:** *"Cho em 2 câu trắc nghiệm Phần III trả lời ngắn điền số năm trong đề thi tốt nghiệp THPT môn Lịch sử theo QĐ 764/QĐ-BGDĐT nhé."*
- **Hành vi mong đợi:**
  - Đính chính thông tin theo cấu trúc thực tế của QĐ 764/QĐ-BGDĐT: môn Lịch sử **CHỈ có 2 phần** (24 câu nhiều lựa chọn + 4 câu Đúng/Sai trong 50 phút) và **không có Phần III trả lời ngắn**. Hỏi người học muốn luyện theo Phần I/II chuẩn thi hay luyện câu hỏi điền mốc niên đại để tự ôn.

---

## 7. `dia-li-thpt`

### Tình huống 7.1 — Phù hợp kích hoạt (Tính toán Phần III & chọn biểu đồ)
- **Prompt người dùng:** *"Một tỉnh có sản lượng lúa $1\,240\text{ nghìn tấn}$ trên diện tích gieo trồng $200\text{ nghìn ha}$. Tính năng suất lúa theo đơn vị `tạ/ha` (làm tròn 1 chữ số thập phân)."*
- **Hành vi mong đợi:**
  - Chia $\frac{1240}{200} = 6.2\text{ tấn/ha}$, nhân thêm $10$ để đổi sang **`62.0`** (hoặc `62`) `tạ/ha`.
  - Nhắc nhẹ bẫy thường gặp là quên nhân $10$ khi đổi `tấn/ha` sang `tạ/ha`.

### Tình huống 7.2 — Gần chủ đề nhưng KHÔNG nên kích hoạt `dia-li-thpt`
- **Prompt người dùng:** *"Tính diện tích hình phẳng giới hạn bởi hai đường cong $y = x^2$ và $y = 2x$ bằng tích phân."*
- **Hành vi mong đợi:**
  - Bài toán thuần Giải tích thuộc `toan-thpt`, không kích hoạt `dia-li-thpt`.

### Tình huống 7.3 — Thiếu dữ kiện / Giả thiết sai / Cần kiểm chứng
- **Prompt người dùng:** *"Đề ôn tập cô phát ghi Việt Nam có 63 tỉnh, thành phố, nhưng em nghe nói đã sáp nhập còn 34 tỉnh, thành phố rồi. Vậy em trả lời theo số nào?"*
- **Hành vi mong đợi:**
  - Đối chiếu chính xác văn bản đã kiểm chứng: **Nghị quyết 202/2025/QH15** (12/6/2025, vận hành từ 01/7/2025) sắp xếp từ 63 còn **34 đơn vị hành chính cấp tỉnh** (28 tỉnh + 6 TP trực thuộc TW).
  - Hướng dẫn rõ: nếu đề/tài liệu kiểm tra trên lớp sử dụng số liệu SGK cũ trước 7/2025 và giáo viên chấm theo đáp án cũ thì bám theo tài liệu bài kiểm tra đó (nhưng luôn ghi chú sự thay đổi theo quy định hiện hành để không nhầm lẫn kiến thức thực tế).

---

## 8. `ktpl-thpt`

### Tình huống 8.1 — Phù hợp kích hoạt (Giải phẫu tình huống pháp lý)
- **Prompt người dùng:** *"Anh A khóa cửa nhốt anh B trong nhà kho của xưởng suốt 3 tiếng vì nghi anh B làm hỏng máy, đồng thời chửi bới xúc phạm anh B trước mặt mọi người. Anh A vi phạm quyền nào của công dân?"*
- **Hành vi mong đợi:**
  - Tách riêng từng hành vi: (1) Khóa nhốt trái phép tại nhà kho xưởng $\implies$ vi phạm **quyền bất khả xâm phạm về thân thể** (lưu ý không nhầm sang quyền bất khả xâm phạm về chỗ ở); (2) Chửi bới xúc phạm $\implies$ vi phạm **quyền được pháp luật bảo hộ về danh dự, nhân phẩm**.

### Tình huống 8.2 — Gần chủ đề nhưng KHÔNG nên kích hoạt `ktpl-thpt`
- **Prompt người dùng:** *"Tóm tắt toàn bộ chương Tăng trưởng kinh tế bằng sơ đồ tư duy Mermaid giúp em học bài nhanh."*
- **Hành vi mong đợi:**
  - Điều hướng sang `tomtat-mindmap`.

### Tình huống 8.3 — Thiếu dữ kiện / Giả thiết sai / Cần kiểm chứng
- **Prompt người dùng:** *"Cô hướng dẫn phần tổ chức chính quyền địa phương ở Việt Nam gồm 3 cấp (tỉnh, huyện, xã) theo SGK lớp 10 bản cũ. Hiện nay còn đúng hoàn toàn không?"*
- **Hành vi mong đợi:**
  - Dẫn chính xác **Nghị quyết 203/2025/QH15** (16/6/2025) sửa đổi, bổ sung một số điều của Hiến pháp 2013: Việt Nam tổ chức **chính quyền địa phương 2 cấp** và đã **kết thúc hoạt động đơn vị hành chính cấp huyện từ ngày 01/7/2025**.
  - Lưu ý cách đối chiếu nếu học sinh đang thi bằng bộ đề/SGK in trước 7/2025, đồng thời không bịa số điều khoản chi tiết nếu chưa trích nguyên văn văn bản luật.
