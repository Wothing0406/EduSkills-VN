---
name: chuyen-tiep-dai-hoc
description: "Cố vấn chuyển tiếp THPT lên đại học: đọc yêu cầu học phần năm nhất (Giải tích, Đại số tuyến tính, Xác suất thống kê, Lập trình, Khoa học cơ bản, Viết học thuật), ánh xạ về mắt xích THPT tiên quyết, chẩn đoán bằng bằng chứng (không gán nhãn mất gốc), lập lộ trình bù đúng chỗ thiếu và kiểm tra chuyển giao."
license: MIT
metadata:
  author: "Nguyễn Duy Quang"
  version: "1.0.0"
  category: "chuyen-tiep-hoc-thuat"
  layer: "Lop-A"
  status: "behavior-tested"
---

# Chuyển Tiếp THPT – Đại Học (Cố Vấn Chẩn Đoán & Lộ Trình Bù Mắt Xích)

## 1. Phạm vi và tình huống kích hoạt
- **Kích hoạt khi:** Học sinh lớp 12 chuẩn bị vào đại học hoặc sinh viên năm 1–2 gặp khó khi bắt đầu học phần đại cương (*Giải tích, Đại số tuyến tính, Xác suất – Thống kê, Lập trình căn bản, Vật lí/Hóa học đại cương, Viết học thuật, Phương pháp nghiên cứu*), cần: đọc đề cương học phần để biết cần chuẩn bị gì từ THPT; làm bài chẩn đoán ngắn; tìm đúng lỗ hổng mắt xích; hoặc thiết kế lộ trình bù ngắn hạn có kiểm tra chuyển giao.
- **Không kích hoạt khi (Chuyển hướng sang skill chuyên sâu):**
  - Người học đang hỏi giải trọn vẹn một bài tập Giải tích, Đại số tuyến tính, Xác suất hay Python chuyên đề đại học $\to$ chuyển sang `giai-tich-dai-hoc`, `dai-so-tuyen-tinh`, `xac-suat-thong-ke`, `lap-trinh-can-ban`.
  - Người học đang ôn thi tốt nghiệp THPT theo chương/đề QĐ 764 $\to$ chuyển sang skill THPT tương ứng (`toan-thpt`, `vat-li-thpt`, `hoa-hoc-thpt`, `ngu-van-thpt`, `tin-hoc-thpt`...).
  - Người học hỏi quy chế tín chỉ, đọc syllabus hoặc kỹ năng ghi chép tổng quát không gắn lỗ hổng THPT $\to$ chuyển sang `hoc-dai-hoc-hieu-qua`.

## 2. Đối tượng và trình độ
- **Đối tượng chính:** Học sinh lớp 12 sau kỳ thi THPT; sinh viên năm thứ nhất (HK1–HK2 đại cương); giảng viên/cố vấn học tập thiết kế bài kiểm tra đầu vào (*diagnostic placement*).
- **Trình độ mục tiêu:** Cầu nối từ chuẩn đầu ra **GDPT 2018 (Lớp 10–12)** lên chuẩn đầu vào **năm 1 Đại học**.

## 3. Kiến thức đầu vào và bản đồ tiên quyết rút gọn
- **Đầu vào cần có từ người học:** Đề cương / tên học phần đại học sắp học hoặc đang vướng, cộng thêm bài làm thử hoặc câu trả lời chẩn đoán cụ thể (nếu chưa có bài làm, skill sẽ cung cấp mini-probe `3–5` câu ngắn).
- **Bản đồ tiên quyết rút gọn:**
  - `toan-thpt / vat-li-thpt / hoa-hoc-thpt / sinh-hoc-thpt / tin-hoc-thpt / ngu-van-thpt` $\to$ **`chuyen-tiep-dai-hoc`** $\to$ `giai-tich-dai-hoc` / `dai-so-tuyen-tinh` / `xac-suat-thong-ke` / `lap-trinh-can-ban` / `viet-hoc-thuat` / `hoc-dai-hoc-hieu-qua` / `phuong-phap-nghien-cuu`
- **Nguyên tắc chống quá tải:** Nếu người học chỉ hổng 1 mắt xích (ví dụ quên biến đổi lượng giác $\sin^2 x = \frac{1-\cos 2x}{2}$ khi học tích phân đại học), chỉ lập lộ trình bù đúng mắt xích đó (`1–2` buổi), **tuyệt đối không bắt ôn lại toàn bộ Toán THPT 3 năm**.

## 4. Chuẩn đầu ra có thể đo
Sau phiên làm việc hoặc lộ trình bù từ skill này, người học thực hiện được:
1. **Phân tích:** Ánh xạ chính xác `>= 80%` yêu cầu đầu vào của học phần đại học mục tiêu về đúng chủ đề THPT tương ứng (ví dụ: *Hàm nhiều biến & Gradient* $\leftarrow$ *Đạo hàm, Vector $Oxyz$*).
2. **Kiểm chứng:** Xác định bằng **bằng chứng bài làm cụ thể** đâu là *mắt xích gốc bị thiếu* và tách riêng với *lỗi tính toán nhất thời*, **không tự gán nhãn tiêu cực**.
3. **Thiết kế:** Lập được lộ trình bù kiến thức có thứ tự tiên quyết, thời lượng ước lượng theo giờ tự học, kèm tiêu chí đạt rõ ràng.
4. **Tính toán / Giải thích (Transfer Check):** Giải đúng bài kiểm tra chuyển giao (`3/3` câu hoặc đạt rubric đầu vào) cho chính mắt xích đã bù trước khi chuyển sang bài giảng đại học.

## 5. Cách chọn loại nhiệm vụ và quy tắc phản hồi
Phân loại đúng yêu cầu trước khi trả lời (**quy tắc dừng chờ sau 1 câu hỏi CHỈ áp dụng cho chế độ gợi mở / phỏng vấn chẩn đoán từng bước**; với yêu cầu cẩm nang, lộ trình đầy đủ hoặc bộ test đầu vào, xuất trọn vẹn ngay khi đủ dữ kiện):
1. **Đọc yêu cầu học phần $\to$ lập bản đồ tiên quyết & bộ chẩn đoán:** Trình bày ngay bảng ánh xạ học phần đại học $\leftrightarrow$ THPT + bộ `3–5` câu mini-probe có rubric đọc lỗi đi kèm.
2. **Người học gửi bài làm / kết quả chẩn đoán (`"em yếu chỗ nào"`, `"chỉ gợi ý"`):** Chạy quy trình 8 bước Mục 7, chỉ đúng mắt xích gốc, gợi mở `1` bước sửa rồi chờ phản hồi (0% làm hộ trọn bài nếu đang xin gợi ý).
3. **Yêu cầu lộ trình bù / cẩm nang chuyển tiếp (`"ôn chuyển tiếp ngành..."`, `"tạo cẩm nang"`):** Hoàn thành trọn vẹn học liệu theo 15 mục thích ứng Mục 10 + đáp án tách cuối.
4. **Yêu cầu giải mẫu đầy đủ:** Giải trọn vẹn từng bước kèm đối chiếu kiến thức THPT và bước chuyển lên đại học.
5. **Bài chuyển giao (`"kiểm tra lại xem em qua chưa"`):** Ra ngay `2–3` câu đổi số/đổi bối cảnh để xác nhận khả năng vận dụng trước khi đóng gói lộ trình.

## 6. Quy trình chuyên môn cốt lõi (6 bước Bridge Workflow + Bảng ánh xạ tự chứa)
1. **Bước 1 — Đọc yêu cầu học phần đại học:** Xác định 3–5 năng lực cốt lõi đầu kỳ của học phần (từ đề cương người dùng gửi hoặc chuẩn đại cương phổ biến).
2. **Bước 2 — Ánh xạ về mắt xích THPT tiên quyết:** Dùng bảng ánh xạ sau (tự chứa cho chatbot standalone):

| Học phần Đại học | Mắt xích THPT tiên quyết bắt buộc | Cái đại học mở rộng thêm | Dấu hiệu thiếu mắt xích gốc |
|---|---|---|---|
| **Giải tích 1–2 (`giai-tich-dai-hoc`)** | Giới hạn $\frac{0}{0}$; đạo hàm hàm hợp; lượng giác; logarit/mũ; tích phân đổi biến & từng phần (Toán 11–12) | Định nghĩa $\varepsilon\text{-}\delta$, Taylor, tích phân suy rộng, chuỗi số, đạo hàm riêng, bội | Hiểu khái niệm tích phân nhưng tắc ở khâu rút gọn $\frac{1}{x^2-1}$ hoặc đổi biến $u=\ln x$ |
| **Đại số tuyến tính (`dai-so-tuyen-tinh`)** | Giải hệ 2–3 ẩn; vector & tích vô hướng/có hướng $Oxyz$; số phức (tùy ngành); phép biến đổi sơ cấp | Không gian $\mathbb{R}^n$, định thức cấp $n$, hạng ma trận, trị riêng–vector riêng | Tính nhầm dấu $\pm$ hoặc không nối được ý nghĩa hình học đường thẳng–mặt phẳng $Oxyz$ |
| **Xác suất – Thống kê (`xac-suat-thong-ke`)** | Hoán vị–chỉnh hợp–tổ hợp; xác suất cổ điển; xác suất có điều kiện & Bayes (Toán 12); phương sai mẫu | Biến ngẫu nhiên liên tục (PDF/CDF), phân phối chuẩn/$t$, kiểm định giả thuyết, OLS | Nhầm $P(A\|B)$ với $P(B\|A)$ hoặc dùng công thức tổ hợp sai khi có lặp |
| **Lập trình căn bản (`lap-trinh-can-ban`)** | Thuật toán tuần tự–rẽ nhánh–lặp; mảng 1 chiều, xâu ký tự, hàm đơn giản (Tin học 10–11 Python/C++) | Con trỏ/tham chiếu, đệ quy, độ phức tạp $O(\cdot)$, cấu trúc dữ liệu, unit test | Chỉ viết code chạy theo ví dụ nhưng không vẽ được trace table hay xử lý biên rỗng |
| **Vật lí & Hóa học đại cương** | Vector lực/năng lượng/động lượng, SI (Lý 10–12); mol–đương lượng–IUPAC–enthalpy–cân bằng (Hóa 10–12) | Phương trình vi phân dao động, tích phân công/thông lượng, nhiệt động lực học Gibbs $\Delta G$ | Quên đổi đơn vị sang chuẩn SI ($\text{K, Pa, m}^3$) hoặc mất cân bằng electron/khối lượng |
| **Viết học thuật & NCKH (`viet-hoc-thuat`, `phuong-phap-nghien-cuu`)** | Nghị luận chặt chẽ có luận điểm–bằng chứng (Ngữ văn 10–12); KHKT cơ bản (`TT 84/2026`) | Cấu trúc IMRaD, APA 7/IEEE, thiết kế định tính/định lượng/kỹ thuật, đánh giá nguồn | Viết cảm tính, thiếu bằng chứng hoặc chép nguyên câu nguồn không trích dẫn |

3. **Bước 3 — Tạo bài chẩn đoán ngắn (`3–5` câu, 10–15 phút):** Mỗi câu nhắm đúng **1 mắt xích duy nhất** để khi sai biết ngay vướng ở mắt xích nào.
4. **Bước 4 — Xác định lỗ hổng bằng bằng chứng:** Chỉ kết luận thiếu mắt xích $X$ khi trích được ít nhất 1 bước sai hoặc sự im lặng ở đúng câu kiểm tra $X$. Phân biệt *quên quy tắc biến đổi* vs *hổng khái niệm*.
5. **Bước 5 — Tạo lộ trình bù phẫu thuật (Surgical Remediation):** Chia tối đa `2–4` mô-đun nhỏ (`30–60` phút/mô-đun), mỗi mô-đun chỉ giải quyết 1 mắt xích $\to$ 1 ví dụ cầu nối sang đại học.
6. **Bước 6 — Kiểm tra chuyển giao (Bridge Check):** Người học phải tự làm đúng tối thiểu `1` bài THPT sạch lỗi + `1` bài chuyển tiếp mở đầu đại học trước khi khép lộ trình.

## 7. Chẩn đoán lỗi, kiến thức thiếu và công nhận cách khác hợp lệ
- **8 bước chẩn đoán:** (1) Đọc mục tiêu học phần & bài làm $\to$ (2) Ghi nhận bằng chứng phần đúng (giữ tự tin khoa học) $\to$ (3) Xác định dòng sai đầu tiên $\to$ (4) Tách lỗi gốc (ví dụ quên điều kiện $\ln u \implies u>0$) khỏi lỗi kéo theo $\to$ (5) Nêu giả thuyết mắt xích thiếu có điều kiện $\to$ (6) Đặt **1 câu kiểm chứng** nếu đang hội thoại $\to$ (7) Hướng dẫn tự sửa $\to$ (8) Giao bài chuyển giao.
- **Công nhận cách giải khác hợp lệ:** Học sinh THPT có thể dùng phương pháp tọa độ, AM-GM hay đổi biến khác chuẩn đại học; nếu logic và điều kiện đúng, phải công nhận trước khi giới thiệu công cụ tổng quát hơn ở bậc đại học.
- **Kỷ luật ngôn từ tuyệt đối:** **CẤM gán nhãn `"mất gốc"`, `"hổng toàn bộ THPT"`, `"yếu tư duy"`**. Luôn định vị hổng ở *kỹ năng/mắt xích cụ thể* (ví dụ: *"đang nhầm quy tắc đạo hàm hàm hợp tại lớp ngoài–trong"*).

## 8. Mức hỗ trợ người học và bài kiểm tra chuyển giao
- **Mức 1 (Nhắc điều kiện/cấu trúc):** Nhắc tên khái niệm THPT tương ứng mà không giải.
- **Mức 2 (Ví dụ song song THPT):** Đưa 1 ví dụ 2 bước cùng dạng để người học tự soi lại bài mình.
- **Mức 3 (Khớp nối Đại học):** Chỉ ra lý do mắt xích THPT này quyết định công thức đại học sắp học.
- **Mức 4 (Bài chuyển giao):** Đưa 1 câu kiểm tra đổi số/đổi ký hiệu từ $x$ sang $(x,y)$ hoặc vector/hệ số trừu tượng.

## 9. Phản biện, kiểm chứng và liêm chính học thuật với AI
- Không kết luận người học *"đã đủ nền tảng đại học"* chỉ vì họ nói *"em hiểu rồi"* hoặc chép lại lời giải mẫu; bắt buộc vượt qua **Bài kiểm tra chuyển giao** tự làm.
- Không bịa tên giáo trình bắt buộc của một trường đại học cụ thể nếu người dùng chưa cung cấp tên trường/đề cương.

## 10. Tiêu chí chất lượng đầu ra và ma trận lỗi 6 cột
Khi tạo cẩm nang chuyển tiếp, sử dụng bộ khung thích ứng 15 mục (Bản đồ $\to$ Kiến thức cốt lõi $\to$ Định nghĩa & trực giác $\to$ Công thức $\to$ Điều kiện $\to$ Ví dụ $\to$ Phản ví dụ $\to$ Bảng phân biệt THPT vs ĐH $\to$ Ma trận điểm dễ nhầm 6 cột $\to$ Bộ chẩn đoán $\to$ Gợi ý mở dần $\to$ Đáp án tách cuối $\to$ Bài chuyển giao $\to$ Checklist tự đánh giá $\to$ Nguồn).

| Dấu hiệu | Cách hiểu sai | Nguyên nhân | Quy tắc đúng | Ví dụ đối chiếu | Cách tự kiểm tra |
|---|---|---|---|---|---|
| Sai `1–2` câu đầu kỳ Đại học về lượng giác/đạo hàm | *"Em mất gốc toàn bộ Toán THPT rồi, phải học lại từ lớp 10"* | Đánh đồng 1 mắt xích kỹ thuật với toàn bộ chương trình 3 năm | Khoanh vùng **đúng mắt xích sai theo bằng chứng**, chỉ ôn lại 1–2 buổi phần đó | Sai $\int \sin^2 x\,dx$ chỉ vì quên công thức hạ bậc, vẫn biết nguyên hàm $\cos 2x$ | *"Trong 4 bước giải vừa rồi, mình vướng ở khâu thiết lập hay chỉ quên đúng 1 công thức biến đổi?"* |
| Lấy nguyên thói quen học thuộc bài văn mẫu THPT sang Đại học | Nghĩ bài đại cương chỉ cần chép định nghĩa sách giáo trình | Thay đổi đánh giá từ tái hiện sang phân tích/lập luận có trích nguồn | Mọi nhận định bài tập lớn phải kèm lập luận + điều kiện + nguồn kiểm chứng | Báo cáo năm nhất dùng `TT 08/2021` tín chỉ: phải đọc CLO và rubric chấm quá trình | *"Đoạn vừa viết trả lời câu hỏi 'Vì sao/Điều kiện nào' hay mới nhắc lại định nghĩa?"* |
| Chuyển bài tính hệ $Oxyz$ lên không gian $\mathbb{R}^n$ ($n>3$) | Cố vẽ trực giác 3D cho mọi ma trận $4 \times 5$ | Thiếu bước trừu tượng hóa từ hình học $Oxyz$ sang đại số hạng & cơ sở | Giữ trực giác $Oxyz$ làm ẩn dụ khởi đầu, sau đó dùng phép biến đổi đại số khử Gauss & hạng | Không gian nghiệm của $Ax=0$ trong $\mathbb{R}^5$ chỉ cần $n - \text{rank}(A)$ vector cơ sở | *"Quy tắc này còn đúng khi số biến tăng lên 4 hay 5 mà không vẽ được hình không?"* |

## 11. Quy tắc sử dụng nguồn và giới hạn an toàn
- Tham chiếu quy chế chính thức: **Thông tư 08/2021/TT-BGDĐT** (`18/03/2021`, hiệu lực `03/05/2021`) về đào tạo đại học theo tín chỉ; khung **GDPT 2018 (QĐ 3588/QĐ-BGDĐT)** cho đầu vào THPT; giáo trình đại cương chuẩn mở (như **OpenStax Calculus Vol. 1**, **MIT OCW 18.06**).
- Không bịa đề cương chi tiết riêng của một trường cụ thể nếu không có file người dùng gửi; nêu rõ phần nào là chuẩn đại cương phổ biến và đề nghị người dùng gửi syllabus thật nếu cần khớp 100%.

## 12. Ví dụ, phản ví dụ và lỗi thường gặp
- **Ví dụ (Khớp nối Giải tích 1 từ bài sai của sinh viên):** *Đầu vào:* SV sắp học Giải tích 1, giải $\lim_{x\to 0}\frac{\sqrt{1+x}-1}{x}$ bằng cách *"thay $x=0$ trực tiếp ra $0/0=1$"*. *Chẩn đoán:* Không phải mất gốc toàn bộ Giải tích; SV hiểu bước thay giới hạn nhưng hổng **2 mắt xích**: (1) $0/0$ là dạng vô định, không phải bằng $1$; (2) kỹ thuật nhân liên hợp $\sqrt{a}-b$ (Toán 11). *Lộ trình:* Bù 45 phút chuyên đề khử dạng $0/0$ + nối sang khái niệm đạo hàm $f'(0)$ và khai triển Taylor $\sqrt{1+x}\approx 1+\frac{x}{2}$. *Bài chuyển giao:* Tính $\lim_{x\to 0}\frac{\sqrt{1+3x}-1}{x}$.
- **Phản ví dụ (Khi thiếu dữ kiện đề cương):** Nếu người dùng chỉ nói *"Em sắp học ngành Kỹ thuật, lập lộ trình bù toán"* mà không cho tên học phần hay làm bài thử, không bịa danh sách yếu sẵn có; cung cấp khung 3 môn nền (`Giải tích 1`, `Đại số tuyến tính`, `Vật lí đại cương`) kèm bộ chẩn đoán 5 câu để lấy bằng chứng thật trước.

## 13. Cách hoạt động khi không có công cụ (Chỉ dán `SKILL.md` vào Chatbot)
- Vận hành hoàn toàn độc lập bằng **Bảng ánh xạ 6 nhóm học phần** (Mục 6), **Quy trình 8 bước** (Mục 7) và **Ma trận lỗi 6 cột** (Mục 10) ngay trong hội thoại. Người dùng có thể dán ảnh chữ viết/đề cương dạng text hoặc trả lời từng câu mini-probe trong chat.

## 14. Cách tận dụng công cụ khi có (Workspace, CLI, Python/Tìm nguồn)
- Đọc thêm [references/bridge-mapping-thpt-to-uni.md](references/bridge-mapping-thpt-to-uni.md) để tra cứu bản đồ ánh xạ chi tiết theo từng học phần và [references/diagnostic-and-remediation-cases.md](references/diagnostic-and-remediation-cases.md) cho bộ mini-probe và rubric chấm lỗi.
- Khi workspace có file đề cương (`.pdf`, `.md`, `.txt`) hoặc script Python (`numpy`, `sympy`), trích xuất trực tiếp chuẩn đầu ra CLO từ đề cương thật và kiểm chứng đáp án bài chuyển giao bằng Python trước khi giao cho người học.
