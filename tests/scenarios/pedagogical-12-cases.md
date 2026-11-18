# Bộ Kiểm Thử Sư Phạm 12 Tình Huống Cốt Lõi (Mục 8)

Tài liệu này định nghĩa **12 tình huống sư phạm bắt buộc** để kiểm chứng khả năng chẩn đoán lỗi, thích ứng 5 mức hỗ trợ, phản biện bằng bằng chứng/phản ví dụ và kiểm tra tiến bộ thực sự (không dùng việc khớp câu chữ làm bằng chứng).

---

## Rubric đánh giá 8 tiêu chí định tính
Mỗi phản hồi của gia sư AI trên tình huống được chấm theo 8 tiêu chí quan sát được:
1. **Độ đúng kiến thức & chẩn đoán:** Không sai công thức, sử liệu, quy luật; tách đúng lỗi gốc và lỗi kéo theo.
2. **Công nhận phần đúng & cách làm khác hợp lệ:** Chỉ ra cụ thể bước học sinh làm đúng.
3. **Tôn trọng mức hỗ trợ yêu cầu:** Không bắt khảo sát dài, không ép 4 tầng cho câu ngắn, giải ngay nếu xin giải mẫu.
4. **Không lộ đáp án quá sớm:** Khi đang gợi mở hoặc sửa bài tương tác, dừng và chờ sau 1 câu hỏi trọng tâm; không viết đáp án ngay bên dưới câu hỏi.
5. **Điều chỉnh hỗ trợ theo phản hồi:** Khi học sinh vẫn sai ở lượt 2, đổi cách giải thích hoặc hạ độ khó chứ không lặp lại cùng 1 câu.
6. **Kiểm tra làm độc lập:** Không kết luận "đã hiểu" chỉ vì học sinh đồng ý; yêu cầu tự sửa hoặc giải bài biến thể.
7. **Phản biện có căn cứ & đúng bộ môn:** Dùng điều kiện, đơn vị, phản ví dụ, bằng chứng tư liệu đúng môn học.
8. **Độ dài & tải nhận thức phù hợp:** Ngắn gọn, 1 nhiệm vụ mỗi lượt tương tác.

---

## 12 Tình huống kiểm thử hành vi

### 1. Lời giải đúng nhưng dùng phương pháp khác đáp án mẫu (`vat-li-thpt` / `toan-thpt`)
- **Đầu vào học sinh:** *"Bài con lắc đơn không ma sát ở độ cao $h$, thay vì tính gia tốc dọc cung bằng định luật II Newton như sách giải, em dùng thẳng bảo toàn cơ năng $\frac{1}{2}mv^2 = mgh \implies v = \sqrt{2gh}$ được không thầy?"*
- **Hành vi mong đợi:** Công nhận ngay cách làm dùng bảo toàn cơ năng là **hoàn toàn hợp lệ và tối ưu**; kiểm tra nhanh điều kiện áp dụng (chỉ chịu trọng lực và lực căng dây vuông góc quỹ đạo không sinh công, xuất phát không vận tốc đầu) rồi hỏi ngắn để xác nhận học sinh nắm điều kiện đó chứ không ép quay lại định luật II Newton.

### 2. Một lỗi tính toán đơn lẻ (`dia-li-thpt` / `toan-thpt`)
- **Đầu vào học sinh:** *"Em lấy $24\,150\text{ nghìn tấn}$ chia $3\,825\text{ nghìn ha}$ được $6.3137$. Do đề hỏi `tạ/ha`, em điền luôn `6.3`."*
- **Hành vi mong đợi:** Khen bước lập công thức và kết quả chia $6.3137\text{ tấn/ha}$ đúng; chỉ rõ lỗi đơn vị ở bước cuối (chưa nhân $10$ đổi `tấn/ha` sang `tạ/ha`), gợi bằng 1 câu hỏi về mối quan hệ giữa $1\text{ tấn}$ và $\text{tạ}$ rồi chờ.

### 3. Hiểu sai khái niệm (`ktpl-thpt`)
- **Đầu vào học sinh:** *"Tổ trưởng K nhốt anh P trong nhà kho công ty suốt 4 giờ là xâm phạm quyền bất khả xâm phạm về chỗ ở phải không ạ?"*
- **Hành vi mong đợi:** Xác nhận nhận diện đúng hành vi giữ người trái phép; tách lỗi hiểu sai đối tượng của quyền *chỗ ở* với quyền *bất khả xâm phạm về thân thể*; hỏi ngắn kho công ty có phải chỗ ở riêng của anh P không rồi chờ.

### 4. Nhiều lỗi kéo theo từ một lỗi gốc (`vat-li-thpt`)
- **Đầu vào học sinh:** *"Khí lí tưởng đẳng áp ở $t_1 = 27^\circ\text{C}$, $V_1 = 4\text{ L}$ tăng thể tích lên $V_2 = 6\text{ L}$. Em làm: (1) $T_2 = 27 \times \frac{6}{4} = 40.5\text{ K}$; (2) Công khí sinh $A' = 10^5 \times (6 - 4) = 2 \times 10^5\text{ J}$ — chỗ nhiệt độ em sai do không đổi sang K nên các bước sau sai hết phải không ạ?"*
- **Hành vi mong đợi:** Tách rạch ròi **2 lỗi độc lập**: bước (1) dùng sai thang Celsius thay vì Kelvin ($T_1 = 300\text{ K}$), còn bước (2) là lỗi riêng về đơn vị thể tích (chưa đổi lít sang $\text{m}^3$), không đổ hết vào một nguyên nhân; ưu tiên xử lý bước (1) trước, dừng chờ học sinh tự tính lại $T_2$.

### 5. Chỉ gửi đề, chưa có bài làm (`toan-thpt`)
- **Đầu vào học sinh:** *"Giải giúp em: Tìm $m$ để hàm số $y = \frac{x + m}{x + 1}$ đồng biến trên từng khoảng xác định."*
- **Hành vi mong đợi:** Không quy kết học sinh thiếu kiến thức; hỏi ngắn học sinh đã tính thử đạo hàm $y'$ chưa hoặc đưa Mức 1–2 (gợi nhớ công thức $y'$ của hàm phân thức bậc nhất/bậc nhất) và chờ. (Nếu người học nói "cho em lời giải đầy đủ", chuyển ngay sang Mức 5).

### 6. Yêu cầu “chỉ gợi ý, đừng giải” (`toan-thpt`)
- **Đầu vào học sinh:** *"Học sinh giải $x^2 = 9$ và kết luận $x = 3$. Cho gợi ý sửa lỗi, ĐỪNG giải hết ra đáp số!"*
- **Hành vi mong đợi:** Công nhận $x = 3$ là nghiệm đúng, nêu câu hỏi kiểm chứng: *"Ngoài số $3$, còn số thực nào khi bình phương lên cũng bằng $9$ không?"* rồi **dừng chờ**, tuyệt đối không viết `-3` hay `±3` ngay bên dưới câu hỏi.

### 7. Yêu cầu lời giải đầy đủ (`hoa-hoc-thpt`)
- **Đầu vào học sinh:** *"Em đang cần xem lời giải mẫu chi tiết từng bước của bài thủy phân $17.6\text{ g}$ ethyl acetate bằng $\text{NaOH } 1\text{ M}$ vừa đủ tạo $16.4\text{ g}$ muối, tính $V_{\text{NaOH}}$ ($\text{mL}$)."*
- **Hành vi mong đợi:** Tôn trọng yêu cầu rõ của học sinh, trình bày ngay lời giải đầy đủ theo danh pháp IUPAC, các bước biến đổi rõ ràng đến $200\text{ mL}$ (không cố giấu đáp án hoặc bắt học sinh trả lời khảo sát).

### 8. Vẫn chưa hiểu sau gợi ý đầu tiên (`tieng-anh-thpt` – Chuỗi 2 lượt)
- **Lượt 1:** Học sinh viết `*acheivement`. Gia sư hỏi theo quy tắc *"i before e except after c"*.
- **Lượt 2 (Học sinh đáp sai):** *"Em vẫn nghĩ sau chữ h thì e đứng trước i nên viết acheivement ạ."*
- **Hành vi mong đợi:** **Không lặp lại y nguyên câu hỏi cũ**; đổi cách giải thích sang quy tắc dễ thấy hơn (tách gốc động từ chuẩn `achieve` -> đọc /əˈtʃiːv/, phần `ie` tạo âm `/iː/` giống `believe`, chỉ đứng sau chữ `c` như `receive` mới viết `ei`) hoặc hạ sang Mức 4 đưa khung `ach_ _vement` rồi chờ học sinh tự điền lại.

### 9. Đã sửa được nhưng chưa vận dụng sang bài mới (`toan-thpt` / `hoa-hoc-thpt`)
- **Bối cảnh:** Học sinh vừa tự sửa xong $x^2 = 9 \implies x = \pm 3$ khi giải trên $\mathbb{R}$.
- **Hành vi mong đợi:** Không vội khen "em đã nắm vững hoàn toàn"; kiểm tra tiến bộ thực sự bằng 1 câu đổi ngữ cảnh (ví dụ: *"Nếu $x$ là cạnh một hình vuông có diện tích $9\text{ cm}^2$, lúc này $x$ nhận những giá trị nào? Còn với $(x - 1)^2 = 16$ trên $\mathbb{R}$ thì sao?"*), phân biệt làm độc lập cùng dạng vs vận dụng có điều kiện biên.

### 10. Câu hỏi đơn giản cần trả lời ngắn (`tin-hoc-thpt` / `lich-su-thpt`)
- **Đầu vào học sinh:** *"Cho em hỏi nhanh lệnh `range(1, 5)` trong Python tạo ra các số từ mấy đến mấy?"*
- **Hành vi mong đợi:** Trả lời ngắn gọn trong 2–3 câu: tạo ra `1, 2, 3, 4` (vì dừng trước cận trên `5`), kèm 1 ví dụ 1 dòng; **không** ép xuất 4 tầng hay bảng dài dòng.

### 11. Bài thiếu dữ kiện hoặc chứa giả thiết mâu thuẫn (`vat-li-thpt` / `ngu-van-thpt`)
- **Đầu vào học sinh:** *"Tính suất điện động cảm ứng trong khung dây 100 vòng đặt trong từ trường $B = 0.2\text{ T}$ trong $0.1\text{ s}$."* (hoặc câu Ngữ văn đọc hiểu không gửi kèm đoạn trích).
- **Hành vi mong đợi:** Phát hiện và nêu chính xác phần thiếu (thiếu diện tích $S$ của khung dây và độ biến thiên $\Delta B$ hoặc góc quay trong $0.1\text{ s}$ — từ trường tĩnh $B$ không đổi thì $e_c = 0$), hỏi ngắn học sinh kiểm tra lại đề gốc, không tự bịa số liệu.

### 12. Kết luận sai có thể bác bỏ bằng phản ví dụ (`sinh-hoc-thpt` & `toan-thpt`)
- **Ca 12A (`sinh-hoc-thpt`):** *"Trong phả hệ thấy bố bị bệnh lặn sinh con gái bình thường $\implies$ em loại luôn gen lặn trên NST X."*
  - **Hành vi mong đợi:** Dùng **phản ví dụ Mendel $X^a Y \times X^A X^A$** (sinh $100\%$ con gái $X^A X^a$ bình thường dù gen lặn vẫn nằm trên X) để bác bỏ lập luận loại trừ đó, rồi hỏi lại trường hợp nào (như bố bình thường sinh con gái bệnh, hoặc mẹ bệnh sinh con trai bình thường) mới thực sự bác bỏ được gen lặn trên X.
- **Ca 12B (`toan-thpt`):** *"Hàm $y = \frac{x+m}{x+1}$ đồng biến trên từng khoảng xác định khi $1 - m \ge 0 \implies m \le 1$."*
  - **Hành vi mong đợi:** Đưa phản ví dụ tại biên $m = 1$ ($y = 1$ là hàm hằng, không đồng biến) để học sinh tự nhận ra phải bỏ dấu bằng.
