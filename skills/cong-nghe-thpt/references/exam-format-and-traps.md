# Quy Tắc Chuyên Môn, Chẩn Đoán Lỗi & Cấu Trúc Thi — Công nghệ THPT

## 1. Cấu trúc đề thi Tốt nghiệp THPT môn Công nghệ (QĐ 764/QĐ-BGDĐT)
- **Văn bản căn cứ:** Quyết định 764/QĐ-BGDĐT ngày 08/03/2024 (áp dụng từ năm 2025, tách 2 đề thi riêng cho *Công nghệ Công nghiệp* và *Công nghệ Nông nghiệp*). Nguồn: `https://luatvietnam.vn` / `https://moet.gov.vn` (kiểm tra `2026-11-18`).
- **Hình thức & Thời gian:** Trắc nghiệm, **50 phút**, **28 câu / 10,0 điểm**, gồm **CHỈ 2 PHẦN** (**không** có Phần III trả lời ngắn):
  - **Phần I (24 câu):** Nhiều lựa chọn (4 chọn 1), $0,25\text{đ/câu}$ ($6,0\text{đ}$).
  - **Phần II (4 câu):** Đúng/Sai 4 ý a, b, c, d; lũy tiến **0,1 – 0,25 – 0,5 – 1,0đ/câu** ($4,0\text{đ}$).

---

## 2. Quy tắc chuyên môn chẩn đoán 7 phần

### Quy tắc 1: Đọc lưới $220/380\text{ V}$ & Chọn kiểu đấu Động cơ $\Delta/Y - 220/380\text{ V}$
1. **Tình huống áp dụng:** Chọn cách đấu tải/động cơ 3 pha vào nguồn điện phân phối 3 pha.
2. **Điều kiện / Giả định:** Tải 3 pha đối xứng; trên lưới luôn có $U_d = \sqrt{3}U_p > U_p$.
3. **Ví dụ sai & Giải thích lỗi:** Thấy nhãn động cơ ghi $\Delta/Y - 220/380\text{ V}$ và nguồn lưới ghi $220/380\text{ V}$ liền đấu hình Tam giác ($\Delta$) *(Loại lỗi: đọc sai ý nghĩa thông số định mức trên nhãn)*. Khi đấu $\Delta$ vào lưới có $U_d = 380\text{ V}$, mỗi cuộn dây pha chỉ chịu được tối đa $220\text{ V}$ phải gánh trực tiếp $380\text{ V}$ $\implies$ cháy cuộn dây!
4. **Ví dụ đúng:** Số lớn ($380\text{ V}$) luôn là điện áp dây $U_d$; số nhỏ ($220\text{ V}$) là điện áp pha $U_p$. Ký hiệu $\Delta/Y - 220/380\text{ V}$ cho biết điện áp pha định mức mỗi cuộn dây là $220\text{ V}$: nếu mắc vào lưới $U_d = 380\text{ V}$ bắt buộc đấu **hình Sao ($Y$)** để $U_{p\text{-cuộn dây}} = \frac{U_d}{\sqrt{3}} \approx 220\text{ V}$.
5. **Câu hỏi chẩn đoán:** *"Trên nhãn $\Delta/Y - 220/380\text{ V}$, mỗi cuộn dây pha của động cơ chịu được điện áp tối đa là $220\text{ V}$ hay $380\text{ V}$?"*
6. **Gợi ý sửa:** Kiểm tra điều kiện sống còn: $U_{p\text{-đặt lên tải}} = U_{đm\text{-cuộn dây}}$ (với lưới $U_d = 380\text{ V}$, nếu đấu $\Delta$ thì $U_p = U_d = 380\text{ V}$; đấu $Y$ thì $U_p = \frac{380}{\sqrt{3}} \approx 220\text{ V}$).
7. **Cách kiểm tra lại:** So sánh giá trị $U_{p\text{-tải}}$ tính được với $220\text{ V}$ — phải khớp đúng $220\text{ V}$ mới an toàn.

### Quy tắc 2: Công thức dòng điện & công suất 3 pha ($Y$ vs $\Delta$)
1. **Tình huống áp dụng:** Tính $I_p, I_d$ hoặc $P$ trong mạch 3 pha đối xứng.
2. **Điều kiện / Giả định:** Tải 3 pha đối xứng, tổng trở mỗi pha $Z_p$.
3. **Ví dụ sai & Giải thích lỗi:** Khi tải nối $\Delta$ vào lưới $U_d = 380\text{ V}$, học sinh tính $I_p = \frac{U_d}{\sqrt{3}Z_p}$ hoặc tính $P = 3 U_d I_d \cos\varphi$ *(Loại lỗi: nhầm đại lượng dây và đại lượng pha)*.
4. **Ví dụ đúng:** Khi tải nối $\Delta$: $U_{p\text{-tải}} = U_d \implies I_p = \frac{U_d}{Z_p}$, và $I_d = \sqrt{3}I_p$. Công suất tác dụng: $P = 3 U_p I_p \cos\varphi = \sqrt{3} U_d I_d \cos\varphi$.
5. **Câu hỏi chẩn đoán:** *"Khi nối Tam giác ($\Delta$), mỗi nhánh tải nối thẳng giữa hai dây pha (chịu điện áp dây $U_d$) hay nối giữa dây pha và dây trung tính ($U_p$)?"*
6. **Gợi ý sửa:** Vẽ phác tam giác 3 nhánh tải mắc vào 3 dây A–B–C để thấy điện áp trên mỗi nhánh đúng bằng $U_d$.
7. **Cách kiểm tra lại:** Kiểm tra bảo toàn công suất: tính riêng $3 U_p I_p \cos\varphi$ và $\sqrt{3} U_d I_d \cos\varphi$ phải cho cùng một đáp số (W).

### Quy tắc 3: Quản lý môi trường Thủy sản Biofloc & Phân bón đất trồng
1. **Tình huống áp dụng:** Xử lý ao nuôi tôm cá bị tụt oxy hòa tan ($\text{DO}$), $\text{pH}$ tăng cao, hoặc phối trộn vôi với phân đạm.
2. **Điều kiện / Giả định:** Nuôi thâm canh Biofloc cần $\text{DO} \ge 4.0 - 5.0\text{ mg/L}$; $\text{pH}$ an toàn thường $7.5 - 8.5$.
3. **Ví dụ sai & Giải thích lỗi:** Thấy $\text{DO}$ tụt xuống $2.2\text{ mg/L}$ liền cho ăn gấp đôi để tôm khỏe hơn, hoặc thấy $\text{pH} > 8.5$ lại rải vôi $\text{CaO}$, hoặc trộn vôi với phân đạm $\text{NH}_4\text{NO}_3$ *(Loại lỗi: hiểu sai cơ chế sinh hóa môi trường)*.
4. **Ví dụ đúng:**
   - Khi $\text{DO}$ thấp: **ngừng/giảm cho ăn**, bật hết quạt nước & sục khí đáy (cho ăn thêm làm thức ăn thừa phân hủy, tiêu thụ thêm oxy và tăng khí độc $\text{NH}_3$).
   - Khi $\text{pH}$ cao hoặc bón đạm amoni: tránh dùng vôi kiềm vì $\text{OH}^-$ chuyển $\text{NH}_4^+ \to \text{NH}_3\uparrow$ (làm mất đạm ở đất trồng và gây ngộ độc cá tôm trong ao).
5. **Câu hỏi chẩn đoán:** *"Nếu tăng lượng thức ăn khi tôm bị ngạt ($\text{DO} = 2.2\text{ mg/L}$), lượng thức ăn thừa phân hủy sẽ làm oxy hòa tan tăng lên hay tiếp tục giảm mạnh?"*
6. **Gợi ý sửa:** Phân tích theo chuỗi nhân–quả sinh hóa của $\text{DO}$, $\text{pH}$ và cân bằng $\text{NH}_4^+ \rightleftharpoons \text{NH}_3$ trước khi chọn biện pháp kỹ thuật.
7. **Cách kiểm tra lại:** Mọi biện pháp đề xuất phải hướng tới giữ ổn định $\text{DO}$ đủ cao và không đẩy $\text{NH}_3$ tự do lên cao.

---

## 3. Ví dụ mẫu chuẩn 2 phần (Đã kiểm chứng)
- **Phần I (Công nghiệp):** Tải 3 pha đối xứng gồm 3 điện trở thuần $R = 38\text{ }\Omega$ nối $\Delta$ vào nguồn có $U_d = 380\text{ V}$. Ta có $U_{p\text{-tải}} = U_d = 380\text{ V} \implies I_p = \frac{380}{38} = 10\text{ A}$, $I_d = \sqrt{3}I_p = 10\sqrt{3} \approx 17.32\text{ A}$.
- **Phần II (Đúng/Sai – Nông nghiệp / Thủy sản):** Bể nuôi tôm Biofloc lúc 4 giờ sáng có $\text{DO} = 2.2\text{ mg/L}$ và $\text{TAN}$ có xu hướng tăng:
  - **a)** $\text{DO} = 2.2\text{ mg/L}$ là mức tối ưu (**SAI**, mức an toàn thường $\ge 4.0 - 5.0\text{ mg/L}$).
  - **b)** Nguyên nhân tụt $\text{DO}$ rạng sáng là ban đêm tảo không quang hợp tạo $\text{O}_2$ mà tôm, tảo và vi sinh Biofloc đều hô hấp tiêu thụ $\text{O}_2$ (**ĐÚNG**).
  - **c)** Cần duy trì tỉ lệ $\text{C/N}$ thích hợp (bổ sung mật rỉ đường/cám gạo) để vi khuẩn dị dưỡng đồng hóa $\text{TAN}$ thành sinh khối protein vi sinh (**ĐÚNG**).
  - **d)** Cần tăng gấp đôi thức ăn sáng sớm khi $\text{DO} = 2.2\text{ mg/L}$ (**SAI**, phải ngừng/giảm cho ăn và tăng cường quạt nước – sục khí).
