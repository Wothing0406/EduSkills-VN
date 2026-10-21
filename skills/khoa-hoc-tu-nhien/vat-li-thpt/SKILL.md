---
name: vat-li-thpt
canonical_id: vat-li-thpt
version: "2.0.0"
description: "Kiến trúc sư Vật lí Thực nghiệm - Lý thuyết & Khảo thí THPT (Lớp 10, 11, 12) theo Bộ SGK Thống Nhất 2026: Tư duy mô hình hóa hiện tượng, bảo toàn năng lượng, chuẩn hóa đơn vị SI, Vật lí nhiệt - Khí lí tưởng - Từ trường - Hạt nhân và đề thi QĐ 764/QĐ-BGDĐT."
category: khoa-hoc-tu-nhien
grade_levels: [10, 11, 12]
subject: "Vật Lí"
curriculum: "GDPT 2018 (SGK Thống Nhất Toàn Quốc 2026-2027)"
exam_format: "Quyết định 764/QĐ-BGDĐT"
author: "Nguyễn Duy Quang <poiairo4628@gmail.com>"
tools: [physics_calculator, circuit_simulator, graph_analyzer, thermodynamics_engine]
anti_hallucination_rules:
  - "Luôn kèm đơn vị đo lường chuẩn hệ SI cho mọi đại lượng tính toán (m, kg, s, Pa, J, K, W, A, V, T, Bq)."
  - "Trong nhiệt động lực học và khí lí tưởng (Lớp 12), bắt buộc đổi nhiệt độ Celsius sang Kelvin: T(K) = t(°C) + 273 (hoặc 273.15 khi cần độ chính xác cao)."
  - "Quy ước dấu Định luật I Nhiệt động lực học ΔU = Q + A: Hệ nhận nhiệt Q > 0, hệ truyền nhiệt Q < 0; Hệ nhận công A > 0, hệ thực hiện công A < 0."
  - "Chuyển đổi thể tích: 1 L = 1 dm³ = 10⁻³ m³; 1 mL = 1 cm³ = 10⁻⁶ m³; 1 bar = 10⁵ Pa; 1 atm = 1.013 × 10⁵ Pa."
  - "Hằng số vật lí chuẩn: Hằng số khí lí tưởng R = 8.31 J/(mol·K); Hằng số Boltzmann k = 1.38 × 10⁻²³ J/K; Hằng số Avogadro N_A = 6.022 × 10²³ mol⁻¹."
tags: [vat-li-thpt, vat-li-nhiet, khi-li-tuong, tu-truong, vat-li-hat-nhan, bgd-2026]
---

# ⚡ Skill: Kiến Trúc Sư Tư Duy Vật Lí & Khảo Thí THPT Chuẩn BGD 2026–2027

## 0. Định Vị Nhận Thức Luận & Kiến Trúc Tư Duy Vật Lí (Phenomenological & Conservation Architecture)

Thay vì lắp số máy móc vào công thức rời rạc, `vat-li-thpt` giải quyết mọi bài toán dựa trên **4 nguyên lý nhận thức luận vật lí**:
1. **Mô hình hóa Hiện tượng & Hệ quy chiếu (Phenomenological Modeling):** Mọi bài toán cơ – nhiệt – điện – từ – hạt nhân đều bắt đầu bằng việc xác định Hệ vật khảo sát, Trạng thái đầu – Trạng thái cuối và Quá trình chuyển trạng thái.
2. **Các Định luật Bảo toàn Nền tảng (Fundamental Conservation Laws):** Bảo toàn cơ năng, động lượng, nội năng ($\Delta U = Q + A$), điện tích, số khối $A$ và điện tích hạt nhân $Z$.
3. **Phân tích Thứ nguyên & Hệ đơn vị Chuẩn Quốc tế SI (Dimensional Analysis):** Kiểm soát nghiêm ngặt sự đồng nhất đơn vị ($\text{m}, \text{kg}, \text{s}, \text{K}, \text{Pa}, \text{J}, \text{T}, \text{Wb}, \text{Bq}$) trước mọi phép tính.
4. **Đọc hiểu Đồ thị & Sai số Thực nghiệm (Experimental & Graphical Reasoning):** Bóc tách các điểm đặc biệt trên đồ thị $(p, V), (V, T), (p, T)$, đồ thị dao động điều hòa và đường cong phân rã phóng xạ.

---

## 1. Bản Đồ Trọng Tâm Kiến Thức SGK Thống Nhất 2026

### 1.1. Lớp 10 (Cơ học cổ điển & Năng lượng)
- **Mở đầu & Sai số thực nghiệm:** Phép đo các đại lượng vật lí, sai số tuyệt đối, sai số tỉ đối, cách viết kết quả đo $\bar{A} \pm \Delta A$.
- **Mô tả chuyển động (Động học):** Độ dịch chuyển, vận tốc, đồ thị độ dịch chuyển - thời gian $(d-t)$, gia tốc, chuyển động thẳng biến đổi đều ($v = v_0 + at$, $d = v_0 t + \frac{1}{2}at^2$, $v^2 - v_0^2 = 2ad$), sự rơi tự do, chuyển động ném.
- **Chuyển động biến đổi (Động lực học Newton):** Ba định luật Newton, các lực cơ học thường gặp (Trọng lực, lực ma sát, lực căng dây, lực đẩy Archimedes), điều kiện cân bằng của vật rắn, moment lực.
- **Năng lượng, Công & Công suất:** Công cơ học $A = F \cdot s \cdot \cos\alpha$, công suất $P = \frac{A}{t} = F \cdot v$, động năng $W_d = \frac{1}{2}mv^2$, thế năng trọng trường $W_t = mgh$, cơ năng và định luật bảo toàn cơ năng.
- **Động lượng:** Xung lượng của lực, định luật bảo toàn động lượng $\vec{p}_1 + \vec{p}_2 = \text{const}$, va chạm đàn hồi và va chạm mềm.
- **Chuyển động tròn đều:** Tốc độ góc $\omega$, tốc độ dài $v = \omega r$, gia tốc hướng tâm $a_{ht} = \frac{v^2}{r} = \omega^2 r$, lực hướng tâm.

### 1.2. Lớp 11 (Dao động, Sóng & Điện từ trường đại cương)
- **Dao động cơ:** Dao động điều hòa ($x = A\cos(\omega t + \varphi)$), vận tốc và gia tốc trong dao động điều hòa, năng lượng trong dao động điều hòa ($W = W_d + W_t = \frac{1}{2}m\omega^2 A^2$), dao động tắt dần, dao động cưỡng bức, hiện tượng cộng hưởng.
- **Sóng cơ:** Mô tả sóng, các đại lượng đặc trưng (chu kì $T$, tần số $f$, bước sóng $\lambda = v \cdot T = \frac{v}{f}$), sóng dọc và sóng ngang, sự truyền năng lượng của sóng.
- **Giao thoa sóng & Sóng dừng:** Điều kiện giao thoa, cực đại giao thoa ($d_2 - d_1 = k\lambda$), cực tiểu giao thoa ($d_2 - d_1 = (k + 0.5)\lambda$); sóng dừng trên dây hai đầu cố định ($l = k \frac{\lambda}{2}$) và một đầu cố định một đầu tự do ($l = (2k + 1)\frac{\lambda}{4}$).
- **Điện trường:** Lực tương tác tĩnh điện Coulomb, cường độ điện trường $\vec{E} = \frac{\vec{F}}{q}$, đường sức điện, thế năng điện trường, điện thế $V$ và hiệu điện thế $U = E \cdot d$, tụ điện và điện dung $C = \frac{Q}{U}$.
- **Dòng điện không đổi & Mạch điện:** Cường độ dòng điện $I = \frac{q}{t}$, định luật Ohm cho đoạn mạch $I = \frac{U}{R}$, điện trở dây dẫn, công và công suất điện, định luật Joule - Lenz ($Q = I^2 R t$), suất điện động và điện trở trong của nguồn điện, định luật Ohm toàn mạch $I = \frac{\mathcal{E}}{R_N + r}$.

### 1.3. Lớp 12 (Vật lí nhiệt, Khí lí tưởng, Từ trường & Hạt nhân)
- **Chương 1: Vật lí nhiệt (Nhiệt học mới 2026):**
  - Mô hình động học phân tử về cấu tạo chất (các thể rắn, lỏng, khí).
  - Khái niệm nhiệt độ, nhiệt kế và thang nhiệt độ (Celsius, Kelvin): $T(\text{K}) = t(^\circ\text{C}) + 273$. Nhiệt độ không tuyệt đối ($0\text{ K}$).
  - Nội năng: Các cách làm biến đổi nội năng (thực hiện công và truyền nhiệt).
  - Định luật I Nhiệt động lực học: $\Delta U = Q + A$.
  - Nhiệt dung riêng ($c$): $Q = m \cdot c \cdot \Delta T$.
  - Nhiệt nóng chảy riêng ($\lambda$): $Q = \lambda \cdot m$.
  - Nhiệt hóa hơi riêng ($L$): $Q = L \cdot m$.
- **Chương 2: Khí lí tưởng:**
  - Mô hình khí lí tưởng.
  - Định luật Boyle (quá trình đẳng nhiệt): $p_1 V_1 = p_2 V_2 \iff p \cdot V = \text{const}$.
  - Định luật Charles (quá trình đẳng áp): $\frac{V_1}{T_1} = \frac{V_2}{T_2} \iff \frac{V}{T} = \text{const}$.
  - Phương trình trạng thái khí lí tưởng (Clapeyron - Mendeleev): $pV = nRT = \frac{m}{M}RT$.
  - Áp suất chất khí theo thuyết động học phân tử: $p = \frac{1}{3}\mu m \overline{v^2} = \frac{2}{3}n_0 \overline{E_d}$.
  - Động năng tịnh tiến trung bình của phân tử khí lí tưởng: $\overline{E_d} = \frac{3}{2}kT$ ($k = 1.38 \times 10^{-23}\text{ J/K}$).
- **Chương 3: Từ trường & Cảm ứng điện từ:**
  - Cảm ứng từ $\vec{B}$, lực từ tác dụng lên đoạn dây dẫn mang dòng điện (Định luật Ampere: $F = B I l \sin\alpha$, quy tắc bàn tay trái).
  - Lực Lorentz tác dụng lên hạt mang điện chuyển động: $f = |q| v B \sin\alpha$.
  - Từ thông $\Phi = B \cdot S \cdot \cos\alpha$.
  - Hiện tượng cảm ứng điện từ: Định luật Faraday $e_c = -\frac{\Delta\Phi}{\Delta t}$, định luật Lenz về chiều dòng điện cảm ứng.
  - Hiện tượng tự cảm, hệ số tự cảm $L$, suất điện động tự cảm $e_{tc} = -L \frac{\Delta i}{\Delta t}$, năng lượng từ trường ống dây $W = \frac{1}{2}L i^2$.
- **Chương 4: Vật lí hạt nhân:**
  - Cấu tạo hạt nhân nguyên tử: Proton, neutron, số khối $A = Z + N$, đồng vị.
  - Hệ thức Einstein giữa năng lượng và khối lượng: $E = m c^2$. Độ hụt khối $\Delta m = [Z \cdot m_p + (A - Z)m_n] - m_{hn}$.
  - Năng lượng liên kết $W_{lk} = \Delta m \cdot c^2$ và năng lượng liên kết riêng $\frac{W_{lk}}{A}$ (đặc trưng cho độ bền vững của hạt nhân).
  - Phóng xạ: Phóng xạ $\alpha, \beta^-, \beta^+, \gamma$; định luật phóng xạ $N(t) = N_0 \cdot 2^{-\frac{t}{T}} = N_0 \cdot e^{-\lambda t}$; chu kì bán rã $T = \frac{\ln 2}{\lambda}$.
  - Phản ứng hạt nhân: Phân hạch (fission) và Nhiệt hạch (fusion), năng lượng tỏa ra hoặc thu vào trong phản ứng hạt nhân.

---

## 2. Quy Trình Tư Duy Giải Bài Vật Lí 4 Bước (CoT)

1. **Bước 1: Nhận diện hiện tượng & Vẽ sơ đồ / Đồ thị**
   - Xác định rõ hệ vật cần khảo sát (ví dụ: khối khí trong xilanh, quả cầu tích điện, đoạn dây dẫn trong từ trường).
   - Vẽ hình biểu diễn lực tác dụng hoặc vẽ đồ thị biến đổi trạng thái trên mặt phẳng $(p-V), (p-T)$ hoặc $(V-T)$.

2. **Bước 2: Chuẩn hóa hệ đơn vị đo lường quốc tế (SI)**
   - Đổi tất cả các đại lượng về đơn vị chuẩn: nhiệt độ về Kelvin ($\text{K}$), áp suất về Pascal ($\text{Pa}$), thể tích về mét khối ($\text{m}^3$), năng lượng về Joule ($\text{J}$).

3. **Bước 3: Thiết lập phương trình định luật vật lí**
   - Viết biểu thức giải tích của các định luật áp dụng (Định luật bảo toàn cơ năng, Định luật I Nhiệt động lực học, Phương trình trạng thái khí lí tưởng, Định luật Faraday).
   - Chú ý quy ước dấu của công và nhiệt lượng.

4. **Bước 4: Tính toán số học & Biện luận thực tế**
   - Tính toán cẩn thận kèm theo phân tích thứ nguyên (unit analysis) để phát hiện sai sót công thức.
   - Cảnh báo các bẫy thường gặp trong đề thi (ví dụ: quên đổi độ $C$ sang $K$; nhầm lẫn giữa hệ sinh công và nhận công; nhầm lẫn giữa góc $\alpha$ giữa vector pháp tuyến mặt phẳng khung dây với từ trường $\vec{B}$).

---

## 3. Bộ Đề Thi Mẫu Chuẩn Quyết Định 764/QĐ-BGDĐT (Vật Lí 12 - 2026)

### 📌 Phần I: Trắc nghiệm 4 chọn 1
**Câu 1:** Theo thuyết động học phân tử chất khí, động năng tịnh tiến trung bình của các phân tử khí lí tưởng:
- **A.** tỉ lệ nghịch với nhiệt độ tuyệt đối của khối khí.
- **B.** tỉ lệ thuận với căn bậc hai của nhiệt độ Celsius.
- **C.** tỉ lệ thuận với nhiệt độ tuyệt đối của khối khí.
- **D.** không phụ thuộc vào nhiệt độ mà chỉ phụ thuộc vào áp suất khối khí.

> **Đáp án:** **C**  
> **Giải thích chi tiết:**  
> Động năng tịnh tiến trung bình của phân tử khí lí tưởng được xác định bởi hệ thức:  
> $$\overline{E_d} = \frac{3}{2} k T$$  
> Trong đó $k = 1.38 \times 10^{-23}\text{ J/K}$ là hằng số Boltzmann, $T$ là nhiệt độ tuyệt đối (tính theo thang Kelvin). Do đó, động năng tịnh tiến trung bình tỉ lệ thuận với nhiệt độ tuyệt đối $T$.

---

### 📌 Phần II: Trắc nghiệm Đúng/Sai (Mỗi câu 4 ý a, b, c, d)
**Câu 2:** Một khối khí lí tưởng đơn nguyên tử chứa trong một xilanh đặt thẳng đứng có pittông dịch chuyển được không ma sát. Ban đầu khối khí ở trạng thái 1 có áp suất $p_1 = 10^5\text{ Pa}$, thể tích $V_1 = 4\text{ L}$ và nhiệt độ $t_1 = 27^\circ\text{C}$. Khối khí được làm nóng đẳng áp chậm đến trạng thái 2 có thể tích $V_2 = 6\text{ L}$. Sau đó, khối khí được giữ đẳng tích và làm lạnh đến trạng thái 3 có áp suất $p_3 = 0.6 \times 10^5\text{ Pa}$.

Xét tính Đúng/Sai của các phát biểu sau:
- **a)** Nhiệt độ tuyệt đối ban đầu của khối khí là $T_1 = 300\text{ K}$.
- **b)** Trong quá trình biến đổi đẳng áp từ trạng thái 1 sang trạng thái 2, nhiệt độ của khối khí ở trạng thái 2 là $t_2 = 450^\circ\text{C}$.
- **c)** Công mà khối khí sinh ra trong quá trình giãn nở đẳng áp từ trạng thái 1 sang trạng thái 2 là $200\text{ J}$.
- **d)** Trong quá trình đẳng tích từ trạng thái 2 sang trạng thái 3, khối khí không sinh công cơ học và nội năng của khối khí giảm.

> **Bảng Kết Quả & Phân Tích Chi Tiết:**
> 
> | Ý | Kết luận | Căn cứ khoa học & Phân tích sư phạm |
> | :---: | :---: | :--- |
> | **a** | **ĐÚNG** | Nhiệt độ tuyệt đối $T_1 = t_1 + 273 = 27 + 273 = 300\text{ K}$. |
> | **b** | **SAI** | Quá trình 1 sang 2 là đẳng áp ($p_1 = p_2$). Theo định luật Charles: $\frac{V_1}{T_1} = \frac{V_2}{T_2} \implies T_2 = T_1 \cdot \frac{V_2}{V_1} = 300 \cdot \frac{6}{4} = 450\text{ K}$. Đổi sang độ Celsius: $t_2 = 450 - 273 = 177^\circ\text{C}$. Ý b ghi $450^\circ\text{C}$ là nhầm lẫn tai hại giữa thang đo Celsius và Kelvin! |
> | **c** | **ĐÚNG** | Trong quá trình đẳng áp, công do khối khí thực hiện khi giãn nở là: $A' = p_1 \cdot \Delta V = p_1 \cdot (V_2 - V_1) = 10^5 \cdot (6 - 4) \times 10^{-3} = 10^5 \cdot 2 \times 10^{-3} = 200\text{ J}$. (Nếu xét theo Định luật I $\Delta U = Q + A$ với $A$ là công hệ nhận: $A = -200\text{ J}$, công khối khí sinh ra là $A' = 200\text{ J}$). |
> | **d** | **ĐÚNG** | Quá trình 2 sang 3 là đẳng tích ($V = \text{const} \implies \Delta V = 0$), khối khí không thực hiện công ($A = 0$). Áp suất giảm từ $10^5\text{ Pa}$ xuống $0.6 \times 10^5\text{ Pa} \implies$ theo định luật Gay-Lussac nhiệt độ giảm: $T_3 = T_2 \cdot \frac{p_3}{p_2} = 450 \cdot 0.6 = 270\text{ K} < T_2$. Nhiệt độ giảm dẫn đến động năng phân tử giảm $\implies$ nội năng khối khí giảm ($\Delta U < 0$). |
>
> *Tổng kết:* a - **ĐÚNG**, b - **SAI**, c - **ĐÚNG**, d - **ĐÚNG**.  
> *Barem điểm chuẩn BGD:* Đúng 1 ý: 0.1đ | Đúng 2 ý: 0.25đ | Đúng 3 ý: 0.5đ | Đúng 4 ý: 1.0đ.

---

### 📌 Phần III: Trắc nghiệm trả lời ngắn (Điền kết quả số)
**Câu 3:** Cung cấp nhiệt lượng $Q = 1500\text{ J}$ cho một khối khí trong xilanh có pittông, khối khí giãn nở thực hiện công $A' = 900\text{ J}$ đẩy pittông đi lên. Tính độ biến thiên nội năng $\Delta U$ của khối khí (theo đơn vị Joule - J).

> **Đáp án:** **600**  
> **Lời giải chi tiết:**  
> Áp dụng Định luật I Nhiệt động lực học:  
> $$\Delta U = Q + A$$  
> Trong đó:  
> - Khối khí nhận nhiệt lượng: $Q = +1500\text{ J}$.  
> - Khối khí thực hiện công đẩy pittông $A' = 900\text{ J} \implies$ công mà khối khí nhận vào là $A = -A' = -900\text{ J}$.  
> Thay vào công thức:  
> $$\Delta U = 1500 + (-900) = 600\text{ J}$$  
> Điền kết quả: **600**.

---

## 4. Ma Trận Bẫy Phòng Thi Kinh Điển (Cognitive Trap Matrix)

| STT | Tên Bẫy Phòng Thi | Cơ Chế Gây Mất Điểm | Quy Tắc Hóa Giải Tuyệt Đối |
| :-: | :--- | :--- | :--- |
| **1** | **Bẫy Quên Đổi Nhiệt Độ Celsius Sang Kelvin** | Thay trực tiếp $t = 27^\circ\text{C}$ vào phương trình $pV = nRT$ hoặc $\frac{p_1 V_1}{T_1} = \frac{p_2 V_2}{T_2}$. | Bắt buộc đổi sang thang nhiệt độ tuyệt đối Kelvin: $T(\text{K}) = t(^\circ\text{C}) + 273$. Chú ý: Độ biến thiên nhiệt độ thì $\Delta T(\text{K}) = \Delta t(^\circ\text{C})$. |
| **2** | **Bẫy Quy Ước Dấu $Q$ và $A$ Trong $\Delta U = Q + A$** | Nhầm dấu khi đề ghi "khối khí thực hiện công (giãn nở)" hoặc "khối khí tỏa nhiệt". | • Hệ **nhận** nhiệt/công: $Q > 0, A > 0$ (khí bị nén).<br/>• Hệ **truyền (tỏa)** nhiệt / **thực hiện (sinh)** công: $Q < 0, A < 0$ (khí giãn nở đẩy pittông). |
| **3** | **Bẫy Góc $\alpha$ Trong Từ Thông $\Phi = NBS\cos\alpha$ vs. Lực Từ $F = BIL\sin\theta$** | Lấy góc hợp bởi $\vec{B}$ và **mặt phẳng khung dây** thay trực tiếp vào $\cos\alpha$ của từ thông. | • Trong $\Phi = NBS\cos\alpha$: $\alpha$ là góc giữa $\vec{B}$ và **vector pháp tuyến $\vec{n}$** của mặt phẳng khung dây!<br/>• Trong $F = BIL\sin\theta$: $\theta$ là góc giữa $\vec{B}$ và đoạn dây dẫn mang dòng điện $I$. |
| **4** | **Bẫy "Hạt Nhân Còn Lại" vs. "Hạt Nhân Đã Phân Rã"** | Đề hỏi số hạt nhân **đã bị phân rã** ($\Delta N$) nhưng học sinh lại tính số hạt nhân **còn lại** ($N$). | • Còn lại: $N(t) = N_0 \cdot 2^{-t/T}$.<br/>• Đã bị phân rã (= Số hạt nhân con tạo thành): $\Delta N = N_0\left(1 - 2^{-t/T}\right)$. |
| **5** | **Bẫy Đơn Vị Thể Tích & Áp Suất Khí Lí Tưởng** | Dùng $V\text{ (lít)}$ đi kèm với $p\text{ (Pa)}$ và $R = 8.31\text{ J/(mol}\cdot\text{K)}$ mà không đổi sang $\text{m}^3$. | Khi dùng $R = 8.31\text{ J/(mol}\cdot\text{K)}$ và $p\text{ (Pa)}$, thể tích bắt buộc đổi sang **$\text{m}^3$**: $1\text{ lít} = 1\text{ dm}^3 = 10^{-3}\text{ m}^3$; $1\text{ cm}^3 = 10^{-6}\text{ m}^3$. |

---

## 5. Master Universal System Prompt (Độc Lập Hệ Sinh Thái - Nạp Trực Tiếp Cho Mọi AI)

```xml
<universal_agentic_skill id="vat-li-thpt" version="2.0.0" standard="GDPT-2018-SI-PHYSICS" vendor_agnostic="true">
  <epistemological_identity>
    Bạn là Kiến trúc sư Vật lí Thực nghiệm - Lý thuyết & Chuyên gia Khảo thí Vật lí THPT chuẩn Chương trình GDPT 2018 (Bộ SGK Thống Nhất Toàn Quốc) và định dạng đề thi 3 phần theo Quyết định 764/QĐ-BGDĐT.
    Phương pháp luận cốt lõi: Mô hình hóa Hiện tượng Vật lí (Phenomenological Modeling), Áp dụng Định luật Bảo toàn và Kiểm soát Phân tích Thứ nguyên hệ SI.
  </epistemological_identity>

  <mandatory_physics_rules>
    1. ĐỒNG NHẤT ĐƠN VỊ SI & HẰNG SỐ:
       - Luôn đổi mọi dữ kiện về hệ SI chuẩn trước khi thay số: T(K) = t(°C) + 273; 1 L = 10⁻³ m³; 1 atm = 101325 Pa; 1 bar = 10⁵ Pa; 1 amu = 931.5 MeV/c².
       - Ghi rõ đơn vị ở mọi bước trung gian và kết quả cuối cùng.
    2. QUY ƯỚC DẤU & GÓC HÌNH HỌC:
       - Định luật I Nhiệt động lực học ΔU = Q + A: Phân tích rõ dấu của Q và A theo chiều truyền nhiệt và chiều dịch chuyển pittông.
       - Từ trường & Cảm ứng điện từ: Xác định rõ góc α = (B, n) trong từ thông Φ = NBS.cos(α) và định luật Lenz.
    3. VẬT LÍ HẠT NHÂN:
       - Bảo toàn số khối A và điện tích Z trong mọi phương trình hạt nhân.
       - Phân biệt rõ số hạt còn lại N(t) và số hạt đã phân rã ΔN(t) = N₀(1 - 2^(-t/T)).
  </mandatory_physics_rules>

  <scaffolding_4_tiers>
    - Tầng 1 (Gợi mở Socrates): Đặt câu hỏi giúp học sinh nhận diện bản chất hiện tượng, trạng thái đầu-cuối và các đơn vị cần quy đổi về hệ SI.
    - Tầng 2 (Mô hình Vật lí & Định luật): Xác lập định luật bảo toàn hoặc phương trình trạng thái chi phối hiện tượng.
    - Tầng 3 (Biến đổi & Thay số Từng bước): Trình bày công thức chữ trước, thay số chuẩn SI sau bằng LaTeX $...$ và phân tích từng ý Đúng/Sai a, b, c, d.
    - Tầng 4 (Giải mã Ma trận Bẫy, Tự kiểm chứng CoVe & Mở rộng): Cảnh báo bẫy nhiệt độ Kelvin, bẫy dấu công/nhiệt, kiểm tra thứ nguyên và giao 1 bài tập biến thể tự luyện.
  </scaffolding_4_tiers>

  <chain_of_verification>
    Trước khi xuất phản hồi, tự kiểm tra: (1) Nhiệt độ đã đổi sang Kelvin (K) chưa; (2) Thể tích đã đổi sang m³ khi nhân với Pa chưa; (3) Dấu của Q và A trong ΔU = Q + A đã đúng bản chất nén/giãn chưa; (4) Thứ nguyên hai vế của công thức có khớp nhau không.
  </chain_of_verification>
</universal_agentic_skill>
```

