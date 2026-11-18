# Kịch Bản Kiểm Thử Hành Vi: Nhóm Khoa học Tự nhiên (12 tình huống)

---

## 1. `toan-thpt`

### Tình huống 1.1 — Phù hợp kích hoạt (Chế độ gợi ý / Socrates)
- **Prompt người dùng:** *"Em đang làm câu tối ưu hóa hộp không nắp đáy vuông cạnh $x$, thể tích $500\text{ dm}^3$, em chỉ xin gợi ý bước lập hàm diện tích thôi ạ."*
- **Hành vi mong đợi:**
  - Nêu được công thức thể tích $V = x^2 h = 500 \implies h = \frac{500}{x^2}$ và đặt điều kiện $x > 0$.
  - Nhắc hộp không nắp chỉ có **1 đáy + 4 mặt bên** để học sinh tự lập $S(x)$.
  - Dừng ở mức gợi mở, không giải trọn vẹn đến kết quả $300\text{ dm}^2$ khi người học chỉ xin gợi ý.

### Tình huống 1.2 — Gần chủ đề nhưng KHÔNG nên kích hoạt `toan-thpt`
- **Prompt người dùng:** *"Thiết kế giúp tôi một ma trận đề kiểm tra 45 phút môn Toán 11 đúng chuẩn phân cấp độ nhận thức kèm phương án nhiễu."*
- **Hành vi mong đợi:**
  - Ưu tiên điều hướng sang `tao-quiz-bgd` (vì trọng tâm là thiết kế đề & distractor engineering). Nếu chỉ cài một mình `toan-thpt` mới xử lý trực tiếp theo cấu trúc Toán 11.

### Tình huống 1.3 — Thiếu dữ kiện / Giả thiết sai / Cần kiểm chứng
- **Prompt người dùng:** *"Cô giáo em bảo hàm $y = \frac{x+m}{x+1}$ đồng biến trên từng khoảng xác định khi $1 - m \ge 0 \iff m \le 1$. Kiểm tra giúp em đúng chưa?"*
- **Hành vi mong đợi:**
  - Kiểm chứng và chỉ rõ sai ở dấu $\ge$: nếu $m = 1$, $y = 1$ (với $x \ne -1$) là hàm hằng, không đồng biến. Kết luận đúng phải là $1 - m > 0 \iff m < 1$.

---

## 2. `vat-li-thpt`

### Tình huống 2.1 — Phù hợp kích hoạt (Giải chi tiết bài toán khí lí tưởng)
- **Prompt người dùng:** *"Một lượng khí ở $27^\circ\text{C}$, thể tích $4\text{ L}$, áp suất $10^5\text{ Pa}$ được nung nóng đẳng áp tới thể tích $6\text{ L}$. Tính công khối khí sinh ra và nhiệt độ sau theo độ C."*
- **Hành vi mong đợi:**
  - Đổi $T_1 = 27 + 273 = 300\text{ K}$ và $\Delta V = 2 \times 10^{-3}\text{ m}^3$.
  - Tính công khí sinh ra $A' = p\Delta V = 200\text{ J}$ (nêu rõ nếu viết theo $\Delta U = Q + A$ thì $A = -200\text{ J}$).
  - Tính $T_2 = 450\text{ K}$ rồi đổi về $t_2 = 177^\circ\text{C}$ theo đúng yêu cầu đề.

### Tình huống 2.2 — Gần chủ đề nhưng KHÔNG nên kích hoạt `vat-li-thpt`
- **Prompt người dùng:** *"Tạo cho em sơ đồ tư duy Mermaid và flashcards Active Recall ôn chương Nhiệt học Vật lí 12."*
- **Hành vi mong đợi:**
  - Điều hướng sang `tomtat-mindmap` (chuyên hệ thống hóa mindmap & flashcards ôn tập).

### Tình huống 2.3 — Thiếu dữ kiện / Giả thiết sai / Cần kiểm chứng
- **Prompt người dùng:** *"Tính suất điện động cảm ứng trong khung dây 100 vòng đặt trong từ trường $B = 0.2\text{ T}$ hợp với mặt phẳng khung dây góc $30^\circ$ trong $0.1\text{ s}$."*
- **Hành vi mong đợi:**
  - Phát hiện **thiếu diện tích khung dây $S$** và **sự biến thiên $\Delta B$ hoặc độ biến thiên từ thông $\Delta \Phi$** (một trạng thái tĩnh không tạo suất điện động cảm ứng).
  - Đồng thời nhắc bẫy góc $\alpha$ trong $\Phi = NBS\cos\alpha$: nếu đề cho góc với mặt phẳng khung dây là $30^\circ$ thì góc với pháp tuyến $\vec{n}$ là $60^\circ$. Hỏi lại người dùng dữ kiện bị thiếu, không tự bịa diện tích $S$.

---

## 3. `hoa-hoc-thpt`

### Tình huống 3.1 — Phù hợp kích hoạt (Giải toán và chuẩn hóa IUPAC)
- **Prompt người dùng:** *"Đốt cháy hoàn toàn $0.1\text{ mol}$ ethane trong khí oxygen vừa đủ, thu được $\text{CO}_2$ và hơi nước. Tính thể tích khí $\text{CO}_2$ ở điều kiện chuẩn ($25^\circ\text{C}, 1\text{ bar}$)."*
- **Hành vi mong đợi:**
  - Gọi tên chuẩn IUPAC (`ethane`, `oxygen`, `carbon dioxide`).
  - Lập phương trình $\text{C}_2\text{H}_6 + \frac{7}{2}\text{O}_2 \xrightarrow{t^\circ} 2\text{CO}_2 + 3\text{H}_2\text{O}$, dùng hằng số $24.79\text{ L/mol}$ ở $25^\circ\text{C}, 1\text{ bar}$ để tính $V = 0.2 \times 24.79 = 4.958\text{ L}$.

### Tình huống 3.2 — Gần chủ đề nhưng KHÔNG nên kích hoạt `hoa-hoc-thpt`
- **Prompt người dùng:** *"Tạo giúp em bộ slide Marp 16:9 kèm Speaker Notes cho bài Pin điện Hóa học 12 để nhóm em thuyết trình trên lớp."*
- **Hành vi mong đợi:**
  - Điều hướng sang `slide-thuyet-trinh` (chuyên thiết kế trình chiếu và lời thoại).

### Tình huống 3.3 — Thiếu dữ kiện / Giả thiết sai / Cần kiểm chứng
- **Prompt người dùng:** *"Thủy phân $0.1\text{ mol}$ phenyl acetate ($\text{CH}_3\text{COOC}_6\text{H}_5$) bằng lượng dư $\text{NaOH}$, em thu được $0.1\text{ mol}$ muối và $0.1\text{ mol}$ phenol theo tỉ lệ 1:1 đúng không ạ?"*
- **Hành vi mong đợi:**
  - Chỉnh lại giả thiết sai: ester của phenol tác dụng với $\text{NaOH}$ dư theo tỉ lệ **$1:2$**, tạo ra **2 muối** ($0.1\text{ mol }\text{CH}_3\text{COONa}$ và $0.1\text{ mol }\text{C}_6\text{H}_5\text{ONa}$) cộng $0.1\text{ mol }\text{H}_2\text{O}$, chứ không dừng ở phenol tự do.

---

## 4. `sinh-hoc-thpt`

### Tình huống 4.1 — Phù hợp kích hoạt (Phân tích phả hệ & quần thể)
- **Prompt người dùng:** *"Một quần thể ngẫu phối cân bằng di truyền có $16\%$ cây hoa trắng ($aa$). Giải thích cách tìm tỉ lệ cây hoa đỏ dị hợp trong tổng số các cây hoa đỏ."*
- **Hành vi mong đợi:**
  - Dùng ký hiệu chuẩn và giải thích từng bước tìm $q = 0.4, p = 0.6$, cấu trúc $0.36 AA : 0.48 Aa : 0.16 aa$.
  - Lấy mẫu số là **tổng số cây hoa đỏ** ($0.36 + 0.48 = 0.84$) chứ không phải toàn quần thể, tính ra $\frac{0.48}{0.84} = \frac{4}{7} \approx 0.57$.

### Tình huống 4.2 — Gần chủ đề nhưng KHÔNG nên kích hoạt `sinh-hoc-thpt`
- **Prompt người dùng:** *"Em muốn làm dự án nghiên cứu KHKT ViSEF về ứng dụng dịch chiết tỏi ức chế nấm trên cây trồng, giúp em thiết kế lô đối chứng và nhật ký thí nghiệm."*
- **Hành vi mong đợi:**
  - Điều hướng sang `luan-an-nghiencuu` (vì yêu cầu quy trình nghiên cứu khoa học kỹ thuật ViSEF, thiết kế đối chứng, biến kiểm soát và nhật ký theo TT 84/2026/TT-BGDĐT).

### Tình huống 4.3 — Thiếu dữ kiện / Giả thiết sai / Cần kiểm chứng
- **Prompt người dùng:** *"Cho một đoạn DNA có trình tự `ATGGCCATT`. Hãy dịch ra chuỗi mRNA tương ứng giúp em."*
- **Hành vi mong đợi:**
  - Phát hiện **thiếu ký hiệu chiều $3'/5'$** và **chưa rõ đây là mạch khuôn (mạch gốc $3'\to 5'$) hay mạch mã hóa ($5'\to 3'$)**.
  - Hỏi làm rõ (hoặc tách 2 trường hợp rõ ràng theo hai giả định nếu người học muốn tham khảo ngay) thay vì đoán bừa một chiều.
