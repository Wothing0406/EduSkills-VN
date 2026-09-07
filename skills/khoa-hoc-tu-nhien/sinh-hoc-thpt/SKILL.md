---
name: sinh-hoc-thpt
canonical_id: sinh-hoc-thpt
version: "1.0.0-beta"
description: "Chuyên gia sư phạm Sinh học THPT (Lớp 10, 11, 12) theo Bộ SGK Thống Nhất 2026 và cấu trúc đề thi tốt nghiệp THPT 2025-2027 của Bộ Giáo dục & Đào tạo."
category: khoa-hoc-tu-nhien
grade_levels: [10, 11, 12]
subject: "Sinh Học"
curriculum: "GDPT 2018 (SGK Thống Nhất Toàn Quốc 2026-2027)"
exam_format: "Quyết định 764/QĐ-BGDĐT"
author: "Nguyễn Duy Quang <poiairo4628@gmail.com>"
tools: [pedigree_analyzer, genetics_calculator, bio_engine, evolution_mapper]
anti_hallucination_rules:
  - "Bắt buộc xác định chiều sinh học: Mạch khuôn ADN có chiều 3' -> 5'; Phân tử mARN được tổng hợp theo chiều 5' -> 3'; Ribosome dịch mã mARN theo chiều 5' -> 3'."
  - "Bộ ba mã sao (Codon) trên mARN: AUG (mã mở đầu, mã hóa Methionine ở sinh vật nhân thực hoặc Formyl-methionine ở sinh vật nhân sơ); UAA, UAG, UGA (mã kết thúc, không mã hóa amino acid)."
  - "Phương pháp giải phả hệ: Bắt buộc biện luận xác định gen trội/lặn, gen nằm trên NST thường hay NST giới tính X/Y trước khi gán kiểu gen và tính xác suất."
  - "Quần thể ngẫu phối cân bằng di truyền Hardy-Weinberg: p²(AA) + 2pq(Aa) + q²(aa) = 1 với p + q = 1."
tags: [sinh-hoc-thpt, di-truyen-hoc, pha-he, phien-ma-dich-ma, quan-the, bgd-2026]
---

# 🧬 Skill: Chuyên Gia Sư Phạm Sinh Học THPT Chuẩn BGD 2026–2027

`sinh-hoc-thpt` là bộ não Agentic chuyên biệt hướng dẫn tư duy sinh học hiện đại, giải mã cơ chế phân tử của sự sống, phân tích di truyền phả hệ và biên soạn đề kiểm tra chuẩn cấu trúc Bộ GD&ĐT 2026-2027.

---

## 1. Bản Đồ Trọng Tâm Kiến Thức SGK Thống Nhất 2026

### 1.1. Lớp 10 (Sinh học tế bào & Vi sinh vật)
- **Thành phần hóa học của tế bào:** Nước, carbohydrate (monosaccharide, disaccharide, polysaccharide), lipid, protein (4 bậc cấu trúc), nucleic acid (ADN và ARN - mô hình Watson-Crick).
- **Cấu trúc tế bào nhân sơ và nhân thực:** Màng sinh chất (mô hình khảm động), tế bào chất, nhân, ti thể, lục lạp, lưới nội chất, bộ máy Golgi, ribosome, lysosome, không bào, khung xương tế bào.
- **Chuyển hóa vật chất & năng lượng trong tế bào:** ATP (đồng tiền năng lượng), enzyme và cơ chế xúc tác, hô hấp tế bào (đường phân, chu trình Krebs, chuỗi truyền electron hô hấp), quang hợp (pha sáng và pha tối chu trình Calvin).
- **Chu kì tế bào & Phân bào:** Nguyên phân (kì đầu, kì giữa, kì sau, kì cuối), giảm phân (giảm phân I và giảm phân II, trao đổi chéo tạo biến dị tổ hợp).
- **Công nghệ tế bào, Vi sinh vật & Virus:** Sinh trưởng của vi sinh vật, các pha sinh trưởng trong nuôi cấy không liên tục, cấu tạo virus, chu trình nhân lên của virus (chu trình tan và chu trình tiềm tan).

### 1.2. Lớp 11 (Sinh học cơ thể thực vật & động vật)
- **Trao đổi chất & chuyển hóa năng lượng ở thực vật:** Hấp thụ nước và khoáng ở rễ, dòng mạch gỗ và dòng mạch rây, thoát hơi nước qua khí khổng, quang hợp ở thực vật $C_3, C_4, CAM$, hô hấp ở thực vật.
- **Trao đổi chất & chuyển hóa năng lượng ở động vật:** Tiêu hóa ở động vật (chưa có cơ quan tiêu hóa, túi tiêu hóa, ống tiêu hóa), hô hấp (qua bề mặt cơ thể, hệ thống ống khí, mang, phổi), tuần hoàn máu (hệ tuần hoàn hở/kín, đơn/kép, hoạt động của tim và hệ mạch), miễn dịch và bài tiết.
- **Cảm ứng ở sinh vật:** Hướng động và ứng động ở thực vật; điện thế nghỉ, điện thế hoạt động, sự lan truyền xung thần kinh qua synapse, phản xạ ở động vật.
- **Sinh trưởng, phát triển & Sinh sản:** Hormone thực vật (auxin, gibberellin, cytokinin, abscisic acid, ethylene); sinh trưởng biến thái hoàn toàn và không hoàn toàn ở động vật; sinh sản vô tính và hữu tính.

### 1.3. Lớp 12 (Di truyền học, Tiến hóa & Sinh thái học)
- **Chương 1: Di truyền học phân tử:**
  - Cơ chế tái bản ADN: Bán bảo toàn và nửa gián đoạn (đoạn Okazaki), vai trò các enzyme (helicase tháo xoắn, ARN polymerase tổng hợp đoạn mồi, ADN polymerase III kéo dài mạch mới, ADN ligase nối các đoạn).
  - Cơ chế phiên mã: Tổng hợp mARN từ mạch khuôn $3' \to 5'$ của gen.
  - Cơ chế dịch mã: Hoạt hóa amino acid, ribosome gắn mARN tại codon mở đầu AUG, dịch mã kéo dài và kết thúc.
  - Đột biến gen: Đột biến điểm (thay thế, thêm, mất 1 cặp nucleotide).
- **Chương 2: Nhiễm sắc thể & Đột biến NST:**
  - Cấu trúc siêu hiển vi của NST: Nucleosome ($146$ cặp nucleotide quấn quanh lõi 8 phân tử histone) $\to$ sợi cơ bản ($10\text{ nm}$) $\to$ sợi nhiễm sắc ($30\text{ nm}$) $\to$ siêu xoắn ($300\text{ nm}$) $\to$ chromatid ($700\text{ nm}$).
  - Đột biến cấu trúc NST (mất đoạn, lặp đoạn, đảo đoạn, chuyển đoạn).
  - Đột biến số lượng NST (lệch bội: $2n+1, 2n-1$; đa bội: tự đa bội $3n, 4n$, dị đa bội lai xa kèm đa bội hóa).
- **Chương 3: Quy luật di truyền & Tương tác gen:**
  - Định luật phân li và phân li độc lập của Mendel.
  - Tương tác gen không alen (bổ sung 9:7, 9:6:1; át chế 9:3:4, 12:3:1; cộng gộp).
  - Liên kết gen hoàn toàn và hoán vị gen (tần số hoán vị $f \le 50\%$).
  - Di truyền liên kết với giới tính (gen trên NST X, gen trên NST Y không có alen tương ứng).
  - Di truyền ngoài nhân (di truyền theo dòng mẹ qua tế bào chất của ti thể/lục lạp).
- **Chương 4: Di truyền học quần thể & Di truyền người:**
  - Cấu trúc di truyền của quần thể tự phối (tần số dị hợp giảm, đồng hợp tăng).
  - Quần thể ngẫu phối cân bằng di truyền Hardy-Weinberg: $p^2(AA) + 2pq(Aa) + q^2(aa) = 1$.
  - Phân tích sơ đồ phả hệ xác định bệnh di truyền ở người.
- **Chương 5: Bằng chứng & Cơ chế tiến hóa:**
  - Bằng chứng tiến hóa (giải phẫu so sánh: cơ quan tương đồng, tương tự, thoái hóa; sinh học phân tử; hóa thạch).
  - Thuyết tiến hóa hiện đại: 5 nhân tố tiến hóa (đột biến, giao phối không ngẫu nhiên, chọn lọc tự nhiên, di - nhập gen, các yếu tố ngẫu nhiên).
- **Chương 6: Sinh thái học & Môi trường:**
  - Cá thể và quần thể sinh vật: Giới hạn sinh thái, tỉ lệ giới tính, tháp tuổi, mật độ, kích thước quần thể, đường cong tăng trưởng (hình chữ J và chữ S).
  - Quần xã sinh vật: Mối quan hệ hỗ trợ (cộng sinh, hợp tác, hội sinh) và đối kháng (cạnh tranh, kí sinh, ức chế - cảm nhiễm, sinh vật này ăn sinh vật khác), diễn thế sinh thái (nguyên sinh và thứ sinh).
  - Hệ sinh thái: Chuỗi và lưới thức ăn, tháp sinh thái, chu trình sinh địa hóa, dòng năng lượng trong hệ sinh thái.

---

## 2. Quy Trình Tư Duy Phân Tích Phả Hệ & Bài Toán Di Truyền (CoT 4 Bước)

1. **Bước 1: Xác định quy luật di truyền & Trội/Lặn**
   - Tìm cặp bố mẹ bình thường sinh con bị bệnh $\implies$ Bệnh do gen lặn quy định ($A$: bình thường, $a$: bị bệnh).
   - Tìm cặp bố mẹ bị bệnh sinh con bình thường $\implies$ Bệnh do gen trội quy định.

2. **Bước 2: Biện luận vị trí gen (Trên NST thường hay NST giới tính X)**
   - Nếu bệnh do gen lặn: Kiểm tra người bố bị bệnh có sinh 100% con gái bị bệnh không? Người mẹ bị bệnh có sinh 100% con trai bị bệnh không? Nếu có người con gái bình thường có bố bị bệnh $\implies$ Gen lặn nằm trên NST thường!
   - Nếu bệnh do gen trội: Người bố bị bệnh phải truyền bệnh cho toàn bộ con gái ($X^A Y \implies X^A X^-$).

3. **Bước 3: Xác định kiểu gen từng cá thể & Tần số alen trong quần thể**
   - Ghi chú kiểu gen chắc chắn của các cá thể biểu hiện bệnh (ví dụ: $aa$).
   - Với các cá thể bình thường có bố/mẹ hoặc con bị bệnh: kiểu gen chắc chắn dị hợp ($Aa$).
   - Với các cá thể bình thường chưa biết kiểu gen: tính xác suất theo tỉ lệ $\left(\frac{p^2}{p^2+2pq}AA : \frac{2pq}{p^2+2pq}Aa\right)$.

4. **Bước 4: Tính xác suất xuất hiện kiểu hình ở đời con**
   - Viết tỉ lệ giao tử của người bố và người mẹ: $P \to G$.
   - Tính xác suất theo quy tắc nhân xác suất độc lập hoặc tổ hợp.
   - Chú ý câu hỏi kèm giới tính con: nếu đề hỏi "sinh con trai đầu lòng bị bệnh", phải nhân thêm xác suất giới tính $\frac{1}{2}$.

---

## 3. Bộ Đề Thi Mẫu Chuẩn Quyết Định 764/QĐ-BGDĐT (Sinh Học 12 - 2026)

### 📌 Phần I: Trắc nghiệm 4 chọn 1
**Câu 1:** Trong quá trình dịch mã trên ribosome ở sinh vật nhân thực, bộ ba mở đầu trên phân tử mARN là:
- **A.** $3'\text{-UAA-}5'$.
- **B.** $5'\text{-AUG-}3'$.
- **C.** $5'\text{-UAG-}3'$.
- **D.** $3'\text{-AUG-}5'$.

> **Đáp án:** **B**  
> **Giải thích chi tiết:**  
> - Trên phân tử mARN, bộ ba mở đầu là $5'\text{-AUG-}3'$, mã hóa cho amino acid Methionine (ở sinh vật nhân thực) hoặc Formyl-methionine (ở sinh vật nhân sơ), đồng thời là tín hiệu để ribosome bắt đầu quá trình dịch mã.  
> - Các bộ ba $5'\text{-UAA-}3', 5'\text{-UAG-}3', 5'\text{-UGA-}3'$ là các bộ ba kết thúc dịch mã.

---

### 📌 Phần II: Trắc nghiệm Đúng/Sai (Mỗi câu 4 ý a, b, c, d)
**Câu 2:** Ở người, bệnh P do một alen lặn $a$ nằm trên nhiễm sắc thể thường quy định, alen trội $A$ tương ứng quy định kiểu hình bình thường. Bệnh M do alen lặn $b$ nằm trên vùng không tương đồng của nhiễm sắc thể giới tính X quy định, alen trội $B$ quy định kiểu hình bình thường. Một phả hệ ghi nhận một gia đình như sau: Người bố (1) bình thường về cả hai bệnh, người mẹ (2) bình thường về cả hai bệnh nhưng sinh được một người con trai (3) bị cả bệnh P và bệnh M.

Xét tính Đúng/Sai của các phát biểu sau:
- **a)** Kiểu gen của người mẹ (2) chắc chắn là $Aa X^B X^b$.
- **b)** Người con trai (3) có kiểu gen là $aa X^b Y$.
- **c)** Cặp bố mẹ (1) và (2) không thể sinh được người con gái bị bệnh M.
- **d)** Xác suất cặp bố mẹ (1) và (2) sinh người con thứ hai là con gái bình thường về cả hai bệnh là $\frac{3}{16}$.

> **Bảng Kết Quả & Phân Tích Chi Tiết:**
> 
> | Ý | Kết luận | Căn cứ khoa học & Lời giải chi tiết |
> | :---: | :---: | :--- |
> | **a** | **ĐÚNG** | Bố mẹ (1) và (2) bình thường ($A- X^B-$) sinh con trai (3) bị cả hai bệnh ($aa X^b Y$). Con trai nhận giao tử $Y$ từ bố và $X^b$ từ mẹ $\implies$ mẹ mang $X^b$, kiểu gen về bệnh M là $X^B X^b$. Con trai mang kiểu gen bệnh P là $aa \implies$ nhận một alen $a$ từ bố và một alen $a$ từ mẹ. Bố mẹ bình thường nên bố là $Aa$, mẹ là $Aa$. Vậy kiểu gen của mẹ chắc chắn là $Aa X^B X^b$. |
> | **b** | **ĐÚNG** | Con trai (3) bị bệnh P do gen lặn trên NST thường $\implies aa$; bị bệnh M do gen lặn trên NST giới tính X $\implies X^b Y$. Kiểu gen đầy đủ là $aa X^b Y$. |
> | **c** | **ĐÚNG** | Người bố (1) có kiểu gen bình thường về bệnh M là $X^B Y$. Khi sinh con gái, người bố luôn truyền nhiễm sắc thể $X^B$ cho con gái. Do alen $B$ là trội hoàn toàn so với $b$, mọi người con gái của cặp vợ chồng này đều mang ít nhất một alen $X^B$ ($X^B X^-$) và do đó đều có kiểu hình bình thường về bệnh M, không thể bị bệnh M. |
> | **d** | **SAI** | Xét từng phép lai độc lập:<br>- Về bệnh P: $Aa \times Aa \implies$ xác suất sinh con bình thường ($A-$) là $\frac{3}{4}$.<br>- Về bệnh M và giới tính: Bố $X^B Y \times$ Mẹ $X^B X^b \implies$ con gái có tỉ lệ $\frac{1}{2}$, và 100% con gái đều bình thường ($X^B X^-$).<br>Vậy xác suất sinh con gái bình thường về cả 2 bệnh là: $\frac{3}{4} \times \frac{1}{2} = \frac{3}{8}$. Ý d ghi $\frac{3}{16}$ là sai do nhân nhầm giới tính! |
>
> *Tổng kết:* a - **ĐÚNG**, b - **ĐÚNG**, c - **ĐÚNG**, d - **SAI**.  
> *Barem điểm chuẩn BGD:* Đúng 1 ý: 0.1đ | Đúng 2 ý: 0.25đ | Đúng 3 ý: 0.5đ | Đúng 4 ý: 1.0đ.

---

### 📌 Phần III: Trắc nghiệm trả lời ngắn (Điền kết quả số)
**Câu 3:** Một quần thể thực vật giao phấn ngẫu nhiên đang ở trạng thái cân bằng di truyền Hardy-Weinberg, xét một gen có 2 alen nằm trên nhiễm sắc thể thường: alen $A$ quy định hoa đỏ trội hoàn toàn so với alen $a$ quy định hoa trắng. Biết rằng trong quần thể tỉ lệ cây hoa trắng chiếm $16\%$. Tính tỉ lệ cây hoa đỏ có kiểu gen dị hợp ($Aa$) trong tổng số các cây hoa đỏ của quần thể (kết quả làm tròn đến 2 chữ số thập phân).

> **Đáp án:** **0.57** (hoặc **0,57**)  
> **Lời giải chi tiết:**  
> 1. Quần thể ngẫu phối cân bằng di truyền có cấu trúc: $p^2 AA + 2pq Aa + q^2 aa = 1$.  
> 2. Tỉ lệ cây hoa trắng: $q^2(aa) = 16\% = 0.16 \implies q = \sqrt{0.16} = 0.4$.  
>    Tần số alen $A$: $p = 1 - q = 1 - 0.4 = 0.6$.  
> 3. Cấu trúc di truyền của quần thể:  
>    - Tỉ lệ cây $AA = p^2 = 0.6^2 = 0.36$ ($36\%$).  
>    - Tỉ lệ cây $Aa = 2pq = 2 \times 0.6 \times 0.4 = 0.48$ ($48\%$).  
>    - Tổng tỉ lệ cây hoa đỏ ($A-$) trong quần thể: $0.36 + 0.48 = 0.84$ ($84\%$).  
> 4. Trong tổng số các cây hoa đỏ, tỉ lệ cây hoa đỏ có kiểu gen dị hợp ($Aa$) là:  
>    $$\frac{Aa}{AA + Aa} = \frac{0.48}{0.84} = \frac{4}{7} \approx 0.5714...$$  
>    Làm tròn đến 2 chữ số thập phân: **0.57**.

---

## 4. One-Click System Prompt Nạp Vào Mọi AI

```markdown
Bạn là "EduSkills-VN Sinh Học THPT", Chuyên gia Sư phạm Sinh học chuẩn hóa theo Chương trình GDPT 2018 và Bộ SGK Thống Nhất 2026.

QUY TẮC BẮT BUỘC:
1. DI TRUYỀN PHÂN TỬ: Luôn xác định đúng chiều 5' -> 3' của mARN và 3' -> 5' của mạch khuôn ADN.
2. PHẢ HỆ CHÍNH XÁC: Biện luận chặt chẽ quy luật di truyền (trội/lặn, NST thường hay NST giới tính X) trước khi tính xác suất.
3. QUẦN THỂ HARDY-WEINBERG: Sử dụng cấu trúc p2 + 2pq + q2 = 1 cho quần thể ngẫu phối cân bằng.
4. ĐỀ THI CHUẨN BGD: Khi biên soạn đề, tuân thủ đúng 3 phần theo Quyết định 764/QĐ-BGDĐT với thang điểm lũy tiến cho câu Đúng/Sai.
```

