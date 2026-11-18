# Đối Chứng Thực Nghiệm 16/16 Skills: Bản Cũ (`v2.0.0` Git `HEAD`) vs. Bản Mới (`v2.1.0-beta`)

## 1. Phạm vi & Phương pháp kiểm chứng

- **Phạm vi:** Kiểm chứng đối chiếu toàn bộ **16 skills** (11 skill môn học + 5 meta-tools) giữa phiên bản cũ `v2.0.0` tại Git `HEAD` (`skills/<nhom>/<skill>/SKILL.md`) và phiên bản beta mới `v2.1.0` (`skills/<skill>/SKILL.md` + `references/*` + `agents/openai.yaml`).
- **Phương pháp thực hiện:**
  1. **Đo lường định lượng cấu trúc** bằng script đọc trực tiếp `git show HEAD:...` và cây tệp `v2.1.0` hiện tại.
  2. **Đánh giá mô phỏng song song qua 4 subagent độc lập** (`KHTN`, `KHXH`, `Ngôn ngữ & Công nghệ`, `Meta-Tools`, cộng thêm 3 ca đối chứng ban đầu `toan-thpt`, `sinh-hoc-thpt`, `hoa-hoc-thpt`): mỗi subagent đọc đồng thời bản `HEAD` và bản `v2.1.0`, chạy thử nghiệm trên tình huống học sinh/giáo viên tiêu biểu cho từng skill và báo cáo khách quan **khác biệt cốt lõi**, **hành vi quan sát**, **điểm mạnh bản mới**, và **điểm mạnh / đánh đổi của bản cũ**.
- **Phân biệt trạng thái:**
  - **Đã chạy kiểm chứng trên đủ 16/16 skills (lượt 1 đơn lẻ / mô phỏng theo chỉ thị):** Bảng định lượng + 16 ca đối chiếu từng task dưới đây.
  - **Chưa chạy thực nghiệm:** Chuỗi đối thoại **đa lượt liên tiếp (Lượt 2–3)** với học sinh thật ngoài thực tế (các kịch bản đa lượt chuẩn bị sẵn tại `pedagogical-12-cases.md` và `holdout-eval-set.md`).

---

## 2. So sánh định lượng cấu trúc & tải ngữ cảnh (Context Load)

Đo theo ký tự UTF-8 và số dòng trực tiếp giữa `git show HEAD:...` (`253,787` ký tự tổng cho 16 file) và `v2.1.0` (`82,143` ký tự cho 16 `SKILL.md` — giảm **67,6%** dung lượng nạp ban đầu, cộng `110,468` ký tự `references/` chỉ đọc khi cần):

| Nhóm | Skill | Bản cũ `HEAD` (1 file) | Bản mới `SKILL.md` | `references/` (nạp theo nhu cầu) |
| :--- | :--- | :---: | :---: | :---: |
| KHTN | `toan-thpt` | 206 dòng / 20.173 ký tự | 62 dòng / 5.985 ký tự | 2 tệp (79 dòng / 9.683 ký tự) |
| KHTN | `vat-li-thpt` | 206 dòng / 18.013 ký tự | 60 dòng / 5.609 ký tự | 2 tệp (79 dòng / 8.708 ký tự) |
| KHTN | `hoa-hoc-thpt` | 252 dòng / 18.524 ký tự | 60 dòng / 5.709 ký tự | 2 tệp (77 dòng / 9.402 ký tự) |
| KHTN | `sinh-hoc-thpt` | 204 dòng / 18.451 ký tự | 61 dòng / 6.041 ký tự | 2 tệp (82 dòng / 9.996 ký tự) |
| KHXH | `ngu-van-thpt` | 167 dòng / 15.738 ký tự | 60 dòng / 5.855 ký tự | 2 tệp (76 dòng / 8.047 ký tự) |
| KHXH | `lich-su-thpt` | 198 dòng / 21.425 ký tự | 59 dòng / 5.338 ký tự | 2 tệp (66 dòng / 7.880 ký tự) |
| KHXH | `dia-li-thpt` | 186 dòng / 19.639 ký tự | 59 dòng / 5.606 ký tự | 2 tệp (76 dòng / 8.131 ký tự) |
| KHXH | `ktpl-thpt` | 197 dòng / 22.209 ký tự | 59 dòng / 5.649 ký tự | 2 tệp (65 dòng / 8.303 ký tự) |
| NN–CN | `tieng-anh-thpt` | 223 dòng / 21.564 ký tự | 61 dòng / 5.556 ký tự | 2 tệp (69 dòng / 7.810 ký tự) |
| NN–CN | `tin-hoc-thpt` | 211 dòng / 17.238 ký tự | 59 dòng / 5.605 ký tự | 2 tệp (69 dòng / 8.295 ký tự) |
| NN–CN | `cong-nghe-thpt` | 198 dòng / 18.504 ký tự | 59 dòng / 6.084 ký tự | 2 tệp (65 dòng / 8.398 ký tự) |
| Meta | `giai-chi-tiet` | 139 dòng / 8.805 ký tự | 58 dòng / 5.149 ký tự | 1 tệp (40 dòng / 3.842 ký tự) |
| Meta | `tao-quiz-bgd` | 167 dòng / 9.634 ký tự | 42 dòng / 3.923 ký tự | 1 tệp (39 dòng / 2.941 ký tự) |
| Meta | `tomtat-mindmap` | 122 dòng / 6.850 ký tự | 36 dòng / 3.070 ký tự | 1 tệp (44 dòng / 2.339 ký tự) |
| Meta | `slide-thuyet-trinh` | 168 dòng / 8.267 ký tự | 35 dòng / 3.089 ký tự | 1 tệp (87 dòng / 2.628 ký tự) |
| Meta | `luan-an-nghiencuu` | 140 dòng / 8.753 ký tự | 38 dòng / 3.875 ký tự | 1 tệp (44 dòng / 4.065 ký tự) |

---

## 3. Khác biệt, Kiểm chứng & Điểm mạnh theo từng Task (16/16 Skills)

### A. Nhóm Khoa học Tự nhiên (4 skills)

1. **`toan-thpt`**
   - **Khác biệt chính:** Bỏ 5 `tools` ảo (`latex_renderer`, `function_variation_analyzer`, `oxyz_vector_engine`, `bayes_probability_solver`, `optimization_modeler`) và khung `<zero_bare_answer_mandate>` + `<scaffolding_4_tiers>` ép 4 tầng; chuyển sang 6 chế độ, 8 bước chẩn đoán, 5 mức gợi mở, bổ sung căn cứ QĐ 3588/QĐ-BGDĐT và quy tắc chẩn đoán 7 phần.
   - **Kiểm chứng (*$x^2=9 \to x=3$* và *$y=\frac{x+m}{x+1}$ đồng biến với $m \le 1$, HS xin *"chỉ gợi ý đừng giải hết"*):** Bản cũ ở Tầng 1 vừa gợi ý thì Tầng 3 tự giải ra thẳng $x=\pm 3$ hoặc $m<1$. Bản mới công nhận phần đúng (tử đạo hàm $1-m$), tách lỗi gốc tại dấu `=`, đặt 1 câu hỏi thử $m=1$ (hoặc số âm bình phương bằng 9) rồi **dừng chờ**.
   - **Điểm mạnh bản mới (`v2.1.0`):** Không làm lộ đáp án ở chế độ gợi ý; công nhận cách giải khác hợp lệ; tiết kiệm ~70% dung lượng nạp ban đầu.
   - **Điểm mạnh / đánh đổi bản cũ (`v2.0.0`):** Gói 1 file duy nhất chứa sẵn công thức 10–12 + 3 bài giải mẫu dài (nhất là bài tối ưu hộp carton giải đầy đủ từng bước), tiện nếu copy-paste trực tiếp vào giao diện web không đọc `references/`.

2. **`vat-li-thpt`**
   - **Khác biệt chính:** Bỏ 4 `tools` ảo (`physics_calculator`, `circuit_simulator`, `graph_analyzer`, `thermodynamics_engine`) và khuôn 4 tầng bắt buộc; thêm cơ chế tôn trọng quy ước làm tròn riêng ($g=10$ vs $9.8$, $273$ vs $273.15$), ước lượng độ lớn và đối chiếu thứ nguyên.
   - **Kiểm chứng (*Thầy lấy $g=10$, bạn bảo $9.8$; đồng thời HS tính $\Delta U = 1500 + 900 = 2400\text{ J}$ khi khí giãn nở đẩy pittông, xin gợi ý*):** Bản cũ chưa xử lý xung đột hằng số $g$ theo đề giáo viên và Tầng 3 giải tuột ra $A = -900\text{ J} \implies \Delta U = 600\text{ J}$. Bản mới xác nhận ưu tiên $g=10\text{ m/s}^2$ theo đề của thầy, công nhận đúng $Q = +1500\text{ J}$ và định luật $\Delta U = Q + A$, hỏi 1 câu về việc khí giãn nở là *nhận* hay *tiêu hao* năng lượng để HS tự đổi dấu $A$, rồi dừng chờ.
   - **Điểm mạnh bản mới (`v2.1.0`):** Xử lý đúng quy ước địa phương của lớp học; giữ trọn lượt tự sửa dấu trong nhiệt động lực học.
   - **Điểm mạnh / đánh đổi bản cũ (`v2.0.0`):** Tra cứu 1 lượt đủ toàn bộ bảng công thức lớp 10–12 và bài mẫu khí lí tưởng 3 trạng thái giải chi tiết từng ý Đúng/Sai a–d ngay trong `SKILL.md`.

3. **`hoa-hoc-thpt`**
   - **Khác biệt chính:** Bỏ 4 `tools` ảo và lệnh cấm cứng tên Việt truyền thống; giữ danh pháp IUPAC + chuẩn đkc $24.79\text{ L/mol}$ nhưng thêm cầu nối tôn trọng giả thiết đề cũ ghi rõ *đktc ($0^\circ\text{C}, 1\text{ atm}, 22.4\text{ L/mol}$)*; bổ sung quy tắc bảng 3 dòng kiểm tra chất giới hạn.
   - **Kiểm chứng (*Holdout $4.958\text{ L}$ khí $\text{H}_2$ ở đkc chia $22.4$ kéo theo $14.14\text{ g}$, xin gợi ý*; và *đề cũ ghi rõ đktc $0^\circ\text{C}, 1\text{ atm}$ hỏi đúng hay sai*):** Bản cũ ép in 4 tầng và tự giải ra `0.2 mol` / `12.8 g`, đồng thời có nguy cơ bác bỏ đề $22.4\text{ L/mol}$ hoặc tên tiếng Việt cũ. Bản mới tách **lỗi gốc** ($V/22.4$) khỏi **lỗi kéo theo** ($14.14\text{ g}$), giải đúng giả thiết đề cũ nếu đề ghi rõ $0^\circ\text{C}, 1\text{ atm}$ và gợi ý chuẩn IUPAC/đkc hiện hành mà không ép dài 4 tầng khi HS chỉ hỏi xác nhận.
   - **Điểm mạnh bản mới (`v2.1.0`):** Linh hoạt với cả đề mới đkc ($24.79$) và đề ôn tập cũ đktc ($22.4$); tránh "phạt" lỗi kéo theo ở bước sau.
   - **Điểm mạnh / đánh đổi bản cũ (`v2.0.0`):** Bản `HEAD` chứa bảng đối chiếu IUPAC rất dài kèm phiên âm IPA (`/ˈsəʊdiəm/...`), còn `v2.1.0` rút gọn bảng IUPAC sang `references/` và bỏ phần IPA.

4. **`sinh-hoc-thpt`**
   - **Khác biệt chính:** Bỏ 4 `tools` ảo; thống nhất ký hiệu `DNA/RNA/mRNA` xuyên suốt (thay vì `ADN/ARN` lẫn `DNA/mRNA` ở `HEAD`); **vá lỗi chuyên môn nghiêm trọng tại dòng 90 của `HEAD`** (nơi khẳng định sai *"bố bệnh lặn sinh con gái bình thường $\implies$ gen trên NST thường"*).
   - **Kiểm chứng (*"Bố bị bệnh lặn sinh con gái bình thường $\to$ em loại NST X và tính xác suất ra $1/4$, đúng chưa?"*):** Bản cũ theo đúng dòng 90 **xác nhận sai** cho HS rồi giải luôn $1/4$ ở Tầng 3. Bản mới công nhận HS để ý đúng di truyền chéo bố–con gái, tách lỗi gốc loại nhầm NST X khỏi lỗi kéo theo ($1/4$), dùng phản ví dụ $X^aY \times X^AX^A$ để HS tự suy ra $100\%\ X^AX^a$ bình thường và tự bác bỏ kết luận cũ.
   - **Điểm mạnh bản mới (`v2.1.0`):** Loại bỏ hoàn toàn ngụy biện phả hệ di truyền; nhất quán ký hiệu sinh học phân tử GDPT 2018.
   - **Điểm mạnh / đánh đổi bản cũ (`v2.0.0`):** Lưu chi tiết số liệu siêu hiển vi NST ($146$ cặp nu, $10\text{–}700\text{ nm}$) và câu phả hệ 2 bệnh $P, M$ giải đầy đủ trong 1 file (nhưng tuyệt đối không dùng phần quy tắc loại NST X ở `HEAD`).

### B. Nhóm Khoa học Xã hội (4 skills)

5. **`ngu-van-thpt`**
   - **Khác biệt chính:** Bỏ 4 `tools` ảo; bỏ ép viết sẵn luôn đoạn/bài văn mẫu ở Tầng 3; cập nhật tính linh hoạt vị trí hoán đổi câu 200 chữ (2,0đ) và 600 chữ (4,0đ) theo đề QĐ 764; yêu cầu hỏi lại trích dẫn nếu HS hỏi Đọc hiểu ngoài SGK mà chưa dán văn bản.
   - **Kiểm chứng (*HS nộp đoạn NLXH 200 chữ tách 3 đoạn, mở bài chung chung, xin gợi ý sửa*):** Bản cũ xuất 4 tầng và viết hộ luôn cả đoạn văn mẫu 200 chữ hoàn chỉnh ở Tầng 3. Bản mới khen đúng định hướng chủ đề, chỉ rõ lỗi hình thức (tách 3 đoạn thay vì 1 khối đoạn) + câu mở rộng chung chung, yêu cầu HS tự gộp đoạn và viết lại câu mở đoạn (hoặc dán thêm thân–kết) rồi dừng chờ.
   - **Điểm mạnh bản mới (`v2.1.0`):** Không làm bài hộ; sửa lỗi cấu trúc hình thức trước rồi mới tới lập luận; tránh gò "văn mẫu".
   - **Điểm mạnh / đánh đổi bản cũ (`v2.0.0`):** Kèm sẵn đề đọc hiểu mẫu 5 câu và một đoạn văn mẫu 200 chữ hoàn chỉnh ngay trong `SKILL.md` để tham khảo nhanh trong 1 lượt.

6. **`lich-su-thpt`**
   - **Khác biệt chính:** Bỏ 4 `tools` ảo; sửa lỗi `HEAD` tự bịa *"Phần III: Đối sánh Tiến trình Lịch sử"* thành đúng **chỉ 2 phần (24 câu + 4 câu Đúng/Sai)** theo QĐ 764; thêm chế độ trả lời gọn kèm bối cảnh–ý nghĩa cho câu hỏi tra cứu sự kiện ngắn; yêu cầu hỏi bổ sung đoạn tư liệu Phần II nếu thiếu.
   - **Kiểm chứng (*Hỏi nhanh ý nghĩa Chiến dịch Biên giới 1950 và kiểm tra nhận định "Hiệp định Sơ bộ 6/3/1946 công nhận VN độc lập hoàn toàn"*):** Bản cũ ép bung 4 tầng dài dòng dù HS hỏi nhanh, và giải tuột hết cả hai ý. Bản mới trả lời gọn trọng tâm Biên giới 1950 (*giành quyền chủ động chiến lược trên chiến trường chính Bắc Bộ*), đính chính nhẹ chi tiết Pháp mới công nhận *"quốc gia tự do"* trong Liên hiệp Pháp, rồi hỏi 1 câu kiểm chứng về hiệp định năm 1954 và dừng chờ.
   - **Điểm mạnh bản mới (`v2.1.0`):** Đúng cấu trúc thi 2 phần QĐ 764; linh hoạt độ dài cho câu tra cứu nhanh; kiểm chứng sự hiểu thực chất thay vì giảng dài dòng.
   - **Điểm mạnh / đánh đổi bản cũ (`v2.0.0`):** Trục thời gian 10–12 và 5 bẫy niên đại nằm gọn trong 1 file dễ đọc khi không có `references/`.

7. **`dia-li-thpt`**
   - **Khác biệt chính:** Bỏ 4 `tools` ảo; dẫn nguồn rõ **NQ 202/2025/QH15** (12/6/2025, vận hành **34 ĐVHC cấp tỉnh** từ 01/7/2025) kèm quy tắc **vẫn giải theo 63 tỉnh nếu SGK/đề cũ của HS dùng mốc trước 7/2025**; ghi đủ định lượng QĐ 764 (18 I + 4 II + 6 III = 28 câu).
   - **Kiểm chứng (*HS tính nhầm $24.150 / 3.825 = 6,3\text{ tạ/ha}$ chưa nhân $10$, và chọn biểu đồ miền cho 2 năm thể hiện quy mô & cơ cấu*):** Bản cũ giải thẳng ra `63.1 tạ/ha` và chốt luôn `Biểu đồ tròn` ở Tầng 3. Bản mới ghi nhận phép chia số thô đúng, chỉ ra thiếu bước đổi `tấn -> tạ` và điều kiện biểu đồ miền ($\ge 4$ năm, không thấy quy mô), giao **1 nhiệm vụ trước** cho Câu 1 (giữ 4–6 chữ số thập phân rồi đổi sang `tạ/ha`) và dừng chờ trước khi chuyển sang Câu 2.
   - **Điểm mạnh bản mới (`v2.1.0`):** Tách từng nhiệm vụ giúp HS tự tính lại đúng `63.1` và tự chọn lại dạng biểu đồ; cập nhật chuẩn 34 tỉnh/thành không làm gãy bài tập theo sách cũ.
   - **Điểm mạnh / đánh đổi bản cũ (`v2.0.0`):** Để sẵn bảng 6 công thức tính Địa lí kèm LaTeX ngay trong `SKILL.md` tra nhanh 1 chỗ.

8. **`ktpl-thpt`**
   - **Khác biệt chính:** Bỏ 4 `tools` ảo; sửa lỗi `HEAD` tự thêm *"Phần III"* thành **chỉ 2 phần (24 I + 4 II)** theo QĐ 764; cập nhật **NQ 203/2025/QH15** (16/6/2025 sửa Hiến pháp 2013, **chính quyền địa phương 2 cấp**, kết thúc cấp huyện từ 01/7/2025); cấm tuyệt đối **tự bịa số Điều/Khoản luật** khi chưa có văn bản luật cụ thể.
   - **Kiểm chứng (*HS kết luận cảm tính "tổ trưởng K sai vì ác và nhốt trong kho công ty là xâm phạm chỗ ở"*):** Bản cũ chốt hộ cả 2 đáp án (*bất khả xâm phạm về thân thể* + *danh dự, nhân phẩm*) ngay ở Tầng 3. Bản mới công nhận xác định đúng chủ thể K, phân biệt phòng kho công ty không phải chỗ ở riêng, và hỏi 1 câu dẫn HS tự gọi tên đúng quyền bị xâm phạm bởi hành vi khóa nhốt giữ người (để bước sau mới tách tiếp hành vi tung tin đồn).
   - **Điểm mạnh bản mới (`v2.1.0`):** Rèn bóc tách *Hành vi $\to$ Khách thể pháp lý* từng bước; loại rủi ro bịa Điều/Khoản luật; đúng QĐ 764 và NQ 203/2025.
   - **Điểm mạnh / đánh đổi bản cũ (`v2.0.0`):** Tổng hợp đầy đủ từ khóa kinh tế – hội nhập quốc tế (UNCLOS 1982, WTO MFN/NT, CSR) ngay trong 1 tệp `SKILL.md`.

### C. Nhóm Ngôn ngữ & Công nghệ (3 skills)

9. **`tieng-anh-thpt`**
   - **Khác biệt chính:** Bỏ 5 `tools` ảo và bỏ khóa cứng `ZERO-BARE-WORD` + 4 tầng cho mọi câu hỏi; phân tách rõ: tra **1 từ đơn lẻ** (`achieve`) mới bung đủ Word Family 4 chiều + IPA + Spelling + Collocation, còn hỏi nghĩa cụm từ khi đọc hiểu hoặc sửa bài thì giữ ngắn gọn/gợi mở; chuẩn hóa đề thi QĐ 764 (**40 câu trắc nghiệm 4 chọn 1, 50 phút**, không có Phần II/III).
   - **Kiểm chứng (*Viết sai `*acheivement`* và *hỏi nhanh nghĩa `take off` trong bài đọc*):** Bản cũ với `*acheivement` viết ngay đáp án `achievement` ở Tầng 3, còn với `take off` lại bung bảng từ vựng khổng lồ làm đứt mạch đọc. Bản mới công nhận chọn đúng từ loại danh từ, hỏi 1 câu quy tắc *"i before e except after c"* rồi dừng chờ HS tự sửa thành `achievement`; khi hỏi `take off` trong câu đọc hiểu thì trả lời gọn đúng ngữ cảnh.
   - **Điểm mạnh bản mới (`v2.1.0`):** Không rò đáp án ở bài sửa lỗi; giữ được nhịp đọc hiểu; chuẩn cấu trúc thi 40 câu.
   - **Điểm mạnh / đánh đổi bản cũ (`v2.0.0`):** Ở tình huống học sinh *thích* tra từ vựng một lượt theo kiểu bách khoa (dù hỏi bằng câu ngắn hay cụm từ), `Zero-Bare-Word` ép luôn ra cả Word Family 4 chiều + IPA + mẹo chính tả + collocations rất sâu, và giữ sẵn danh sách mẹo `OSASCOMP` / đảo ngữ inline.

10. **`tin-hoc-thpt`**
    - **Khác biệt chính:** Bỏ 5 `tools` ảo; đính chính QĐ 764 gồm **chỉ 2 phần (30 câu làm 28 câu: 24 chung + chọn 4/6 câu Đúng/Sai CS/ICT)**, loại bỏ "Phần III thiết kế thuật toán" sai của `HEAD`; thêm **quy tắc trung thực thực thi** (nói rõ là chạy vết logic `dry-run`, không nhận đã chạy trình thông dịch thật nếu không chạy code) và kiểm tra thiếu PK/FK/dữ liệu.
    - **Kiểm chứng (*SQL `SELECT * FROM HocSinh WHERE AVG(Diem) > 8` / `WHERE AVG(...) GROUP BY` và Python `range(1, 5)` đếm lệch biên*):** Bản cũ in thẳng câu SQL `HAVING` đúng và cả bảng Dry-Run Trace Table hoàn chỉnh ra đáp án `s = 10`. Bản mới kiểm tra ngữ cảnh bảng/schema nếu thiếu, công nhận ý đồ tính `AVG` / vòng lặp cộng dồn, chỉ ra điểm `WHERE` chạy trước khi gom nhóm hoặc biên kết thúc của `range(1, 5)`, rồi hỏi 1 câu để HS tự sửa sang `HAVING` / biên `4` trước khi dừng chờ.
    - **Điểm mạnh bản mới (`v2.1.0`):** Dạy tư duy gỡ lỗi thật sự thay vì đưa code sửa sẵn; không nói quá về việc "đã chạy thử code"; chuẩn hóa đề thi 2 nhánh CS/ICT.
    - **Điểm mạnh / đánh đổi bản cũ (`v2.0.0`):** Mọi bài giải thuật toán ở bản cũ đều ép kèm bảng Dry-Run State Trace + độ phức tạp Big-O $T(n), S(n)$ + kiểm tra biên `[], n=0`, tiện khi HS muốn xem ngay đáp án kỹ thuật hoàn chỉnh.

11. **`cong-nghe-thpt`**
    - **Khác biệt chính:** Bỏ 4 `tools` ảo; đính chính QĐ 764 gồm **chỉ 2 phần (28 câu = 24 + 4 Đúng/Sai tách 2 đề Công nghiệp/Nông nghiệp)**, bỏ "Phần III trả lời ngắn" của `HEAD`; thêm xử lý thiếu $\cos\varphi$, nhãn động cơ; **sửa lỗi toán trong ví dụ tải $\Delta$**: `HEAD` dùng $R = 22\,\Omega$ và gán nhầm $380\text{ V} = 220\sqrt{3}\text{ V}$ ($\approx 381.05\text{ V}$), bản mới đổi sang **$R = 38\,\Omega$** cho ra $I_p = 380/38 = 10\text{ A}, I_d = 10\sqrt{3} \approx 17.32\text{ A}$ chính xác.
    - **Kiểm chứng (*Đấu nhầm động cơ $\Delta/Y - 220/380\text{ V}$ vào lưới $220/380\text{ V}$ kiểu $\Delta$, hoặc tính sai $I_p$ mạch $\Delta$*):** Bản cũ giải luôn đáp án phải đấu $Y$ và viết sẵn lời giải ở Tầng 3. Bản mới công nhận HS đọc đúng cặp số trên nhãn, hỏi 1 câu so sánh trực tiếp $U_d = 380\text{ V}$ đặt lên cuộn dây chịu định mức $220\text{ V}$ rồi dừng chờ HS tự chọn lại kiểu $Y$.
    - **Điểm mạnh bản mới (`v2.1.0`):** Sửa dứt điểm lỗi số học $380 \leftrightarrow 220\sqrt{3}$; đúng định dạng thi 2 phần; giúp HS hiểu nguyên nhân cháy cuộn dây qua đối chiếu áp pha/dây.
    - **Điểm mạnh / đánh đổi bản cũ (`v2.0.0`):** Liệt kê sẵn một số công thức phụ ngay trong `SKILL.md` (như công suất $Q, S$, tỷ số truyền cơ khí $i$, chọn Aptomat $1.25 I_{lv}$), còn bản mới cô đọng các phần ít gặp hơn về đầu mục trong `curriculum-10-12.md`.

### D. Nhóm Meta-Tools (5 skills)

12. **`giai-chi-tiet`**
    - **Khác biệt chính:** Bỏ 4 `tools` ảo (`socratic_tutor`, `multi_tier_solver`, `trap_detector`, `step_explainer`) và `<zero_bare_answer_mandate>` ép đủ 4 tầng; thay bằng **6 chế độ thích ứng**, **8 nhóm lỗi sư phạm**, **gợi mở 5 mức**, kỷ luật 1 câu hỏi/lượt và kiểm chứng hiểu thật (giải thích lại / bài biến thể).
    - **Kiểm chứng (*HS gửi bài phương trình phân thức sai bước quy đồng/ĐKXĐ và nói "chỉ gợi ý bước sai giúp em"*):** Bản cũ vừa hỏi gợi ý ở Tầng 1 vừa viết luôn lời giải từng bước đặt ĐKXĐ + quy đồng ra nghiệm ở Tầng 3. Bản mới công nhận bước biến đổi đúng trước đó, chỉ điểm sai đầu tiên, đặt 1 câu hỏi Mức 2 về điều kiện của mẫu thức rồi dừng chờ.
    - **Điểm mạnh bản mới (`v2.1.0`):** Thực sự làm gia sư đối thoại, không phản bội yêu cầu *"chỉ gợi ý"*, tách rõ lỗi gốc và lỗi kéo theo.
    - **Điểm mạnh / đánh đổi bản cũ (`v2.0.0`):** Phù hợp khi HS muốn xem trọn gói 1 lượt từ chiến thuật đến bài tương tự mà không muốn tương tác qua lại nhiều bước.

13. **`tao-quiz-bgd`**
    - **Khác biệt chính:** Bỏ 4 `tools` ảo; bỏ ép cứng phải xuất đủ cả 3 phần cho mọi yêu cầu và bỏ cổng chặn mù quáng khi người dùng đã nêu rõ chủ đề; chia 3 quy mô (1–3 câu / 5–12 câu / đề đầy đủ) kèm **bảng ma trận chính thức 11 môn QĐ 764/QĐ-BGDĐT** và nhãn `[Ngữ liệu minh họa phục vụ luyện tập]`.
    - **Kiểm chứng (*Yêu cầu: "tạo nhanh 3 câu trắc nghiệm Địa lí 12 luyện tập phần này"*):** Bản cũ có thể đòi dán tài liệu hoặc ép bung ra đề 3 phần tới ~9–22 câu. Bản mới tạo đúng 3 câu Địa lí 12 tách riêng đáp án ở cuối + bảng phân tích phương án nhiễu bám bẫy thực tế.
    - **Điểm mạnh bản mới (`v2.1.0`):** Đúng quy mô, đúng cấu trúc riêng từng môn (không gắn nhầm Phần III vào Sử/KTPL/Tin/Công nghệ/Anh), không để lộ đáp án ngay dưới đề.
    - **Điểm mạnh / đánh đổi bản cũ (`v2.0.0`):** Quy trình *Document-First* rất gắt khi giáo viên cần ép đề bám 100% một đoạn văn bản dán vào, và mặc định buộc đề xuất đủ độ phân hóa 3 phần nếu người dùng quên nêu quy mô.

14. **`tomtat-mindmap`**
    - **Khác biệt chính:** Bỏ 4 `tools` ảo; giảm ~55% ký tự `SKILL.md`; tách rõ quy tắc Mermaid an toàn (`flowchart` bọc `id["..."]`, `mindmap` cụm $\le 6$ chữ và **cấm nhét LaTeX `$$...$$` vào node**); không ép đủ 3 tầng nếu HS chỉ xin sơ đồ; cam kết không nhận đã xuất ảnh SVG/PNG khi chỉ trả mã text.
    - **Kiểm chứng (*Tóm tắt bài Quang hợp Sinh 11 bằng Mermaid*):** Bản cũ có mẫu Quang hợp Sinh 11 ngay trong file nhưng viết `mindmap` không dấu (`Vi tri: Mang Thylakoid...`) và ép in đủ 3 phần kể cả khi chỉ xin sơ đồ. Bản mới xuất `mindmap` tiếng Việt có dấu, ngắn gọn đúng cú pháp an toàn; nếu xin tổng ôn `full` mới kèm Cornell + 3 câu Active Recall không lộ đáp án ngay.
    - **Điểm mạnh bản mới (`v2.1.0`):** Giảm lỗi vỡ render Mermaid; tiết kiệm context; linh hoạt theo nhu cầu ôn nhanh hay tổng ôn.
    - **Điểm mạnh / đánh đổi bản cũ (`v2.0.0`):** Có sẵn ví dụ mẫu Quang hợp ngay trong `SKILL.md` (không cần mở `references/`) và ép luôn Active Recall giúp người học không bỏ qua bước tự kiểm tra.

15. **`slide-thuyet-trinh`**
    - **Khác biệt chính:** Bỏ 4 `tools` ảo (`marp_compiler`...); tách phần CSS mẫu sang `references/marp-templates.md`; thêm 3 chế độ (Marp 16:9 / Dàn ý PowerPoint–Google Slides / Rút gọn slide dày chữ); bổ sung quy tắc **trung thực tuyệt đối**: không tự nhận đã xuất `.pdf`/`.pptx`/`.html`, gắn `[Số liệu minh họa cấu trúc]` nếu chưa có số liệu thật.
    - **Kiểm chứng (*Soạn 6 slide Marp 16:9 về năng lượng tái tạo*):** Bản cũ tạo slide đẹp với CSS dark nhưng trong prompt mẫu tự chèn nhiều số liệu cụ thể (*"45–65 km", "40% diện tích"...*) không gắn nhãn minh họa và ngụ ý đã sẵn sàng xuất PDF nhờ tool ảo `marp_compiler`. Bản mới xuất đủ 6 slide Rule of Six + Speaker Notes, gắn nhãn minh họa cho con số ví dụ và hướng dẫn lệnh CLI thật để người dùng tự render.
    - **Điểm mạnh bản mới (`v2.1.0`):** Nhẹ hơn ~62,6% ký tự ở `SKILL.md`; chặn bịa số liệu và bịa công cụ xuất file; hỗ trợ cả người dùng PowerPoint/Google Slides.
    - **Điểm mạnh / đánh đổi bản cũ (`v2.0.0`):** Nhúng CSS Marp đầy đủ (`.badge`, `.stat-card`) ngay trong 1 tệp `SKILL.md` nên tự chứa hơn nếu chạy đơn lẻ ngoài CLI.

16. **`luan-an-nghiencuu`**
    - **Khác biệt chính:** Bỏ 4 `tools` ảo; cập nhật chuẩn **Thông tư 84/2026/TT-BGDĐT** (30/09/2026 — 16 lĩnh vực, 20 tiêu chí / 100đ, nhật ký nghiên cứu, khai báo AI, công khai trước 15 ngày); thêm quy tắc **Liêm chính Khoa học**: cấm bịa số liệu đo và bịa trích dẫn APA/IEEE (`Zero Fake-Citation`), xuất bảng trống `[Điền số liệu đo]` khi chưa làm thí nghiệm.
    - **Kiểm chứng (*HS mới có ý tưởng "than sinh học vỏ trấu", chưa làm thí nghiệm, xin lập giả thuyết $H_0/H_1$ và bảng số liệu*):** Bản cũ bị ép bởi `<zero_bare_answer_mandate>` + mẫu số liệu $\bar{X} \pm \text{SD}$ điền sẵn, dễ sinh cả báo cáo 5 phần kèm **số liệu đo giả định** và tài liệu tham khảo tự chế. Bản mới chỉ làm đúng giai đoạn thiết kế ($H_0/H_1$, biến, đối chứng âm/dương, $n \ge 3$), xuất **bảng trống `[Điền số liệu đo]`** và nhắc quy định nhật ký + khai báo AI theo TT 84/2026.
    - **Điểm mạnh bản mới (`v2.1.0`):** Đúng quy chế ViSEF mới nhất; ngăn chặn tiếp tay gian lận số liệu và trích dẫn giả; đúng giai đoạn nghiên cứu.
    - **Điểm mạnh / đánh đổi bản cũ (`v2.0.0`):** Tiện cho học sinh muốn xem 1 bản khung đề cương mẫu đầy đủ từ Phần I đến Phần V + câu hỏi phản biện trong một lượt (dù cần tự cảnh giác không dùng số liệu ví dụ).

---

## 4. Kết luận tổng hợp: Khi nào chọn bản nào?

- **Bản mới `v2.1.0-beta` vượt trội trong hầu hết mọi tác vụ học tập, sửa bài, luyện đề và nghiên cứu trên hệ sinh thái Agent (`Codex` / `Antigravity` / `Gemini CLI` / `Claude Code`):** nhẹ hơn **67,6%** khi nạp skill ban đầu, tôn trọng ngữ cảnh/đề cũ của học sinh, không làm lộ đáp án khi gợi ý, sửa triệt để các lỗi chuyên môn & cấu trúc QĐ 764 của `v2.0.0` (`sinh-hoc-thpt` phả hệ NST X, `cong-nghe-thpt` toán $R=38\,\Omega$, `lich-su-thpt` / `ktpl-thpt` / `tin-hoc-thpt` / `cong-nghe-thpt` bỏ Phần III ảo, `luan-an-nghiencuu` TT 84/2026 & chống bịa số liệu).
- **Giá trị còn lại / điểm đánh đổi của bản cũ `v2.0.0`:** (1) Gói gọn 1 file duy nhất không cần đọc thư mục `references/` nếu người dùng copy thủ công dán vào chatbot web đơn giản; (2) Chế độ `One-Shot Dump` ép luôn đủ 4 tầng / đủ bảng tra cứu (ví dụ Word Family 4 chiều + IPA mọi lúc ở Tiếng Anh, Trace + Big-O ở Tin học, bảng công thức dài inline) hữu ích khi người dùng chỉ muốn đọc 1 lần như tài liệu tra cứu thay vì đối thoại qua lại (với `v2.1.0`, người dùng vẫn kích hoạt được chế độ này bằng cách yêu cầu rõ *"giải mẫu chi tiết"* hoặc *"tạo đề đầy đủ"*).
