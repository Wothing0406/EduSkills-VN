# Quy Tắc Chuyên Môn, Chẩn Đoán Lỗi & Cấu Trúc Thi — Vật lí THPT

## 1. Cấu trúc đề thi Tốt nghiệp THPT môn Vật lí (QĐ 764/QĐ-BGDĐT)
- **Văn bản căn cứ:** Quyết định 764/QĐ-BGDĐT ngày 08/03/2024 (áp dụng từ năm 2025). Nguồn: `https://thuvienphapluat.vn` / `https://chinhphu.vn` (kiểm tra `2026-11-18`).
- **Thời gian & cấu trúc:** **50 phút**, **28 câu / 10,0 điểm**:
  - **Phần I (18 câu):** Nhiều lựa chọn (4 chọn 1), $0,25\text{đ/câu}$ ($4,5\text{đ}$).
  - **Phần II (4 câu):** Đúng/Sai 4 ý a, b, c, d; lũy tiến **0,1 – 0,25 – 0,5 – 1,0đ/câu** ($4,0\text{đ}$).
  - **Phần III (6 câu):** Trả lời ngắn ($\le 4$ ký tự), $0,25\text{đ/câu}$ ($1,5\text{đ}$).

---

## 2. Quy tắc chuyên môn chẩn đoán 7 phần

### Quy tắc 1: Thang nhiệt độ Kelvin ($T$) và Celsius ($t$) trong Khí lí tưởng
1. **Tình huống áp dụng:** Tính nhiệt độ hoặc lập tỉ số trong định luật Boyle, Charles, Gay-Lussac, phương trình trạng thái $pV = nRT$ và $\overline{E_{\text{đ}}} = \frac{3}{2}kT$.
2. **Điều kiện / Giả định:** Khí lí tưởng, khối lượng xác định (trừ $pV=nRT$ xét biến đổi số mol).
3. **Ví dụ sai & Giải thích lỗi:** Cho $V_1 = 4\text{ L}, t_1 = 27^\circ\text{C}$, đẳng áp tăng lên $V_2 = 6\text{ L}$. Học sinh viết $\frac{t_2}{27} = \frac{6}{4} \implies t_2 = 40.5^\circ\text{C}$ *(Loại lỗi: dùng công thức ngoài điều kiện thang đo / sai đơn vị)*.
4. **Ví dụ đúng:** Đổi $T_1 = 27 + 273 = 300\text{ K}$. Theo Charles: $\frac{V_1}{T_1} = \frac{V_2}{T_2} \implies T_2 = 300 \cdot \frac{6}{4} = 450\text{ K} \implies t_2 = 450 - 273 = 177^\circ\text{C}$. *(Chỉ độ biến thiên $\Delta T = \Delta t$ mới giữ nguyên trị số).*
5. **Câu hỏi chẩn đoán:** *"Trong công thức $\frac{V_1}{T_1} = \frac{V_2}{T_2}$, $T$ đo bằng độ C ($^\circ\text{C}$) hay độ Kelvin ($\text{K}$)?"*
6. **Gợi ý sửa:** Cộng thêm $273$ trước khi lập tỉ lệ và chỉ trừ $273$ ở bước cuối nếu đề hỏi nhiệt độ $^\circ\text{C}$.
7. **Cách kiểm tra lại:** Nếu $t_1 = 0^\circ\text{C}$, việc chia cho $t_1$ sẽ vô nghĩa ($\frac{V_1}{0}$), chứng tỏ bắt buộc dùng thang Kelvin.

### Quy tắc 2: Quy ước dấu trong Định luật I Nhiệt động lực học ($\Delta U = Q + A$)
1. **Tình huống áp dụng:** Tính độ biến thiên nội năng, công hay nhiệt lượng của khối khí trong xilanh.
2. **Điều kiện / Giả định:** Dùng quy ước SGK GDPT 2018 ($A$ là công **hệ nhận vào**).
3. **Ví dụ sai & Giải thích lỗi:** Hệ nhận $Q = 1500\text{ J}$ và giãn nở thực hiện công $900\text{ J}$; học sinh cộng $\Delta U = 1500 + 900 = 2400\text{ J}$ *(Loại lỗi: hiểu sai khái niệm dấu công nhận vs công sinh ra)*.
4. **Ví dụ đúng:** Nhận nhiệt $Q = +1500\text{ J}$; khí sinh công $A' = 900\text{ J} \implies$ công hệ nhận là $A = -900\text{ J} \implies \Delta U = 1500 + (-900) = +600\text{ J}$.
5. **Câu hỏi chẩn đoán:** *"Khi khí giãn nở đẩy pittông đi ra ngoài, khối khí đang nhận thêm năng lượng cơ học từ bên ngoài hay tự bỏ năng lượng ra để đẩy?"*
6. **Gợi ý sửa:** Ghi chú rõ "nhận = $+$", "tỏa nhiệt / tự thực hiện công = $-$" ngay cạnh từng dữ kiện trước khi cộng vào $\Delta U$.
7. **Cách kiểm tra lại:** Quá trình giãn nở nhận nhiệt có thể làm nội năng tăng ít hơn phần nhiệt truyền vào vì một phần chuyển hóa thành công cơ học ($600 < 1500$).

### Quy tắc 3: Góc $\alpha$ trong Từ thông ($\Phi = NBS\cos\alpha$) vs Lực từ
1. **Tình huống áp dụng:** Tính từ thông và suất điện động cảm ứng khi quay khung dây hoặc đổi $B$.
2. **Điều kiện / Giả định:** Khung dây phẳng đặt trong từ trường đều $\vec{B}$.
3. **Ví dụ sai & Giải thích lỗi:** Đề cho $\vec{B}$ hợp với **mặt phẳng khung dây** góc $30^\circ$, học sinh thay thẳng $\cos 30^\circ$ *(Loại lỗi: hiểu sai định nghĩa góc hình học)*.
4. **Ví dụ đúng:** Góc $\alpha$ trong $\Phi = NBS\cos\alpha$ là góc giữa $\vec{B}$ và **pháp tuyến $\vec{n}$** $\implies \alpha = 90^\circ - 30^\circ = 60^\circ \implies \cos 60^\circ = 0.5$.
5. **Câu hỏi chẩn đoán:** *"Khi đường sức từ $\vec{B}$ nằm song song với mặt phẳng khung dây (tức góc giữa $\vec{B}$ và mặt khung bằng $0^\circ$), có đường sức nào xuyên qua khung dây không?"*
6. **Gợi ý sửa:** Dùng trường hợp biên song song ($\Phi = 0 = \cos 90^\circ$) để nhớ rằng góc cần tìm là góc với pháp tuyến $\vec{n}$.
7. **Cách kiểm tra lại:** Khi mặt khung vuông góc với $\vec{B}$, $\alpha = (\vec{B}, \vec{n}) = 0^\circ \implies \Phi = NBS\cos 0^\circ = NBS$ (cực đại).

### Quy tắc 4: Phóng xạ — Số hạt còn lại $N(t)$ vs Số hạt đã phân rã $\Delta N(t)$
1. **Tình huống áp dụng:** Tính số hạt nhân hay khối lượng chất phóng xạ sau thời gian $t$.
2. **Điều kiện / Giả định:** Mẫu phóng xạ nguyên chất ban đầu $N_0$, không xét phản ứng dây chuyền bổ sung.
3. **Ví dụ sai & Giải thích lỗi:** Đề hỏi số hạt nhân **đã phân rã** sau 2 chu kì ($t = 2T$) lại tính $N = \frac{1}{4}N_0$ *(Loại lỗi: đọc sai yêu cầu câu hỏi)*.
4. **Ví dụ đúng:** Sau $2T$, số hạt **còn lại** là $N = \frac{1}{4}N_0$, còn số hạt **đã phân rã** (tạo thành hạt nhân con) là $\Delta N = N_0 - N = \frac{3}{4}N_0$.
5. **Câu hỏi chẩn đoán:** *"Sau khi phân rã, tỉ lệ còn lại ngày càng giảm về $0$ còn lượng đã phân rã tăng lên hay giảm xuống theo thời gian?"*
6. **Gợi ý sửa:** Gạch chân từ khóa *"còn lại"* ($2^{-t/T}$) hay *"đã phân rã / tạo thành"* ($1 - 2^{-t/T}$) trước khi tính.
7. **Cách kiểm tra lại:** Tổng $N(t) + \Delta N(t)$ luôn phải bằng đúng $N_0$ ban đầu.

---

## 3. Ví dụ mẫu chuẩn 3 phần (Đã kiểm chứng)
- **Phần I:** Động năng tịnh tiến trung bình phân tử khí lí tưởng tỉ lệ thuận với **nhiệt độ tuyệt đối $T$ (K)** ($\overline{E_{\text{đ}}} = \frac{3}{2}kT$).
- **Phần II:** Khối khí lý tưởng từ TT1 ($10^5\text{ Pa}, 4\text{ L}, 27^\circ\text{C}$) đẳng áp đến TT2 ($6\text{ L}$), rồi đẳng tích đến TT3 ($0.6\times 10^5\text{ Pa}$): **a)** $T_1 = 300\text{ K}$ (**ĐÚNG**); **b)** $t_2 = 450^\circ\text{C}$ (**SAI**, $T_2 = 450\text{ K} \implies 177^\circ\text{C}$); **c)** Công sinh ra TT1 $\to$ TT2 là $200\text{ J}$ (**ĐÚNG**); **d)** TT2 $\to$ TT3 không sinh công và nội năng giảm (**ĐÚNG**).
- **Phần III:** Cung cấp $Q = 1500\text{ J}$, khí giãn nở sinh công $900\text{ J} \implies \Delta U = \mathbf{600}\text{ (J)}$.
