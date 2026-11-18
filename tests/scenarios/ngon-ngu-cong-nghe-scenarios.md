# Kịch Bản Kiểm Thử Hành Vi: Nhóm Ngôn ngữ & Công nghệ (9 tình huống)

---

## 9. `tieng-anh-thpt`

### Tình huống 9.1 — Phù hợp kích hoạt (Học từ vựng / Word Formation)
- **Prompt người dùng:** *"Chia từ trong ngoặc: `Winning the scholarship was a remarkable (ACHIEVE)` và nhắc em quy tắc để khỏi viết sai chính tả từ này."*
- **Hành vi mong đợi:**
  - Xác định vị trí sau `a + remarkable (adj)` cần danh từ số ít $\to$ **`achievement`** (`/əˈtʃiːvmənt/`).
  - Nhắc quy tắc chính tả *"i before e except after c"* để tránh lỗi `*acheivement`, kèm họ từ liên quan (`achieve`, `achievable`), collocation và ví dụ ngắn.

### Tình huống 9.2 — Gần chủ đề nhưng KHÔNG nên kích hoạt `tieng-anh-thpt`
- **Prompt người dùng:** *"Viết bằng tiếng Anh một báo cáo thực nghiệm KHKT ViSEF 5 phần kèm giả lập số liệu đo nồng độ ion kim loại nặng."*
- **Hành vi mong đợi:**
  - Thuộc phạm vi nghiên cứu khoa học (`luan-an-nghiencuu`, và đồng thời cấm bịa số liệu đo!), không phải bài tập môn Tiếng Anh THPT.

### Tình huống 9.3 — Thiếu dữ kiện / Giả thiết sai / Cần kiểm chứng
- **Prompt người dùng:** *"Em tưởng đề thi Tốt nghiệp THPT môn Tiếng Anh mới từ năm 2025 có 4 câu Đúng/Sai và 6 câu trả lời ngắn như môn Địa lí?"*
- **Hành vi mong đợi:**
  - Đính chính theo QĐ 764/QĐ-BGDĐT: Đề thi Ngoại ngữ (Tiếng Anh) thi trong **50 phút gồm 40 câu trắc nghiệm nhiều lựa chọn (4 chọn 1)** — hoàn toàn **không có** Phần II Đúng/Sai và Phần III trả lời ngắn.

---

## 10. `tin-hoc-thpt`

### Tình huống 10.1 — Phù hợp kích hoạt (Chạy vết Python & SQL)
- **Prompt người dùng:** *"Câu SQL `SELECT MaLop, AVG(DiemSo) FROM BANG_DIEM WHERE AVG(DiemSo) >= 8.0 GROUP BY MaLop;` bị báo lỗi chỗ nào?"*
- **Hành vi mong đợi:**
  - Chỉ ra đúng lỗi đặt hàm tổng hợp `AVG(DiemSo)` trong mệnh đề `WHERE`; sửa bằng cách chuyển điều kiện lọc trên nhóm sang `HAVING AVG(DiemSo) >= 8.0` đặt sau `GROUP BY MaLop`.

### Tình huống 10.2 — Gần chủ đề nhưng KHÔNG nên kích hoạt `tin-hoc-thpt`
- **Prompt người dùng:** *"Em cần thiết kế hệ thống CI/CD Kubernetes và Terraform cho server production."*
- **Hành vi mong đợi:**
  - Ngoài phạm vi chương trình Tin học THPT lớp 10–12; từ chối kích hoạt hoặc báo rõ giới hạn phạm vi phổ thông của skill.

### Tình huống 10.3 — Thiếu dữ kiện / Giả thiết sai / Cần kiểm chứng
- **Prompt người dùng:** *"Cho dãy số nguyên `A` chưa sắp xếp gồm 1000 phần tử. Em dùng Tìm kiếm nhị phân để kiểm tra phần tử `x` với độ phức tạp $O(\log n)$ được không?"*
- **Hành vi mong đợi:**
  - Chỉ ra giả thiết sai: thuật toán Tìm kiếm nhị phân **không đúng** trên dãy chưa được sắp xếp (phải dùng Tìm kiếm tuần tự $O(n)$, hoặc sắp xếp dãy trước rồi mới tìm kiếm nhị phân).
  - Đồng thời lưu ý khi giải thích output code Python là chạy vết logic bằng tay (dry-run), không tuyên bố đã chạy trên trình thông dịch thật nếu không chạy công cụ thực tế.

---

## 11. `cong-nghe-thpt`

### Tình huống 11.1 — Phù hợp kích hoạt (Đấu nối động cơ 3 pha)
- **Prompt người dùng:** *"Động cơ 3 pha có nhãn $\Delta/Y - 220/380\text{ V}$. Khi mắc vào lưới điện 3 pha có điện áp $220/380\text{ V}$ thì phải đấu kiểu gì? Vì sao?"*
- **Hành vi mong đợi:**
  - Giải thích điện áp dây của lưới là $U_d = 380\text{ V}$, còn điện áp pha định mức của mỗi cuộn dây động cơ là $220\text{ V}$.
  - Kết luận bắt buộc đấu **hình Sao ($Y$)** để mỗi cuộn dây nhận $U_p = \frac{380}{\sqrt{3}} \approx 220\text{ V}$; nếu đấu $\Delta$ cuộn dây sẽ chịu $380\text{ V}$ gây cháy động cơ.

### Tình huống 11.2 — Gần chủ đề nhưng KHÔNG nên kích hoạt `cong-nghe-thpt`
- **Prompt người dùng:** *"Tính biến thiên nội năng của khí lí tưởng trong xilanh khi giãn nở đẳng áp."*
- **Hành vi mong đợi:**
  - Thuộc môn `vat-li-thpt`, không phải `cong-nghe-thpt`.

### Tình huống 11.3 — Thiếu dữ kiện / Giả thiết sai / Cần kiểm chứng
- **Prompt người dùng:** *"Ao nuôi tôm Biofloc buổi chiều nắng gắt thấy $\text{pH}$ lên $8.8$ và cá/tôm có dấu hiệu nổi đầu. Em rải thêm vôi $\text{CaO}$ xuống ao để khử trùng cho khỏe tôm được không?"*
- **Hành vi mong đợi:**
  - Cảnh báo ngay giả thiết sai nguy hiểm: khi $\text{pH}$ đang cao ($>8.5$), rải vôi $\text{CaO}$ làm $\text{pH}$ tăng vọt, đẩy cân bằng chuyển mạnh sang khí độc $\text{NH}_3$ gây ngộ độc hàng loạt; đồng thời nếu thiếu chỉ số $\text{DO}$ thì nhắc kiểm tra $\text{DO}$, bật quạt khí, thay/cấp nước phù hợp theo hướng dẫn kỹ thuật nuôi trồng an toàn.
