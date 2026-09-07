# 🧪 Khung Kiểm Thử & Bộ Benchmark Đánh Giá Chất Lượng (Testing & Benchmark Framework)

> **Mục tiêu:** Thiết lập bộ công cụ và tiêu chí kiểm thử định lượng nhằm đảm bảo các câu trả lời, đề thi và slide của **EduSkills-VN** luôn đạt độ chính xác học thuật 100%, không ảo giác và tuân thủ tuyệt đối quy định của Bộ Giáo dục & Đào tạo.

---

## 1. Bốn Trụ Cột Kiểm Thử (The Four Testing Pillars)

```mermaid
quadrantChart
    title Ma Trận Ưu Tiên Kiểm Thử EduSkills-VN
    x-axis Độ Phức Tạp Kỹ Thuật Thấp --> Độ Phức Tạp Kỹ Thuật Cao
    y-axis Mức Độ Rủi Ro Thấp --> Mức Độ Rủi Ro Chí Mạng
    quadrant-1 [P0] Barem Điểm BGD & Đúng/Sai Lũy Tiến
    quadrant-2 [P0] Chống Ảo Giác Toán - Lí - Hóa
    quadrant-3 [P2] Chuẩn Ngữ Pháp & Format Markdown
    quadrant-4 [P1] Thẩm Mỹ Slide & Sơ Đồ Tư Duy
    "Ảo giác công thức": [0.3, 0.95]
    "Barem tính điểm Đúng/Sai": [0.85, 0.9]
    "Danh pháp IUPAC": [0.25, 0.85]
    "Thẩm mỹ Slide Marp": [0.75, 0.45]
    "Cú pháp LaTeX": [0.2, 0.3]
```

---

## 2. Kiểm Thử Cấu Trúc Đề Thi & Barem Điểm Bộ GD&ĐT (Exam Grading Test)

### 2.1. Test Suite Cho Phần II: Trắc Nghiệm Đúng / Sai
Kiểm tra xem hệ thống sinh điểm có đúng chuẩn công thức lũy tiến của Bộ GD&ĐT hay không:

```typescript
import { describe, it, expect } from "vitest";

// Thuật toán tính điểm Phần II chuẩn Quyết định 764/QĐ-BGDĐT
function calculatePartIIScore(userAnswers: boolean[], answerKey: boolean[]): number {
  if (userAnswers.length !== 4 || answerKey.length !== 4) {
    throw new Error("Mỗi câu hỏi Phần II bắt buộc có đúng 4 ý a, b, c, d.");
  }
  
  let correctCount = 0;
  for (let i = 0; i < 4; i++) {
    if (userAnswers[i] === answerKey[i]) {
      correctCount++;
    }
  }

  switch (correctCount) {
    case 1: return 0.1;
    case 2: return 0.25;
    case 3: return 0.5;
    case 4: return 1.0;
    default: return 0.0;
  }
}

describe("Bộ Kiểm Thử Barem Điểm Phần II BGD 2025-2027", () => {
  const answerKey = [true, false, true, true]; // Đáp án: a) Đ, b) S, c) Đ, d) Đ

  it("Đoán đúng 1 ý duy nhất phải đạt đúng 0.1 điểm", () => {
    const userAnswers = [true, true, false, false]; // Chỉ đúng ý a
    expect(calculatePartIIScore(userAnswers, answerKey)).toBe(0.1);
  });

  it("Đoán đúng 2 ý phải đạt đúng 0.25 điểm", () => {
    const userAnswers = [true, false, false, false]; // Đúng ý a, b
    expect(calculatePartIIScore(userAnswers, answerKey)).toBe(0.25);
  });

  it("Đoán đúng 3 ý phải đạt đúng 0.5 điểm", () => {
    const userAnswers = [true, false, true, false]; // Đúng ý a, b, c
    expect(calculatePartIIScore(userAnswers, answerKey)).toBe(0.5);
  });

  it("Đoán đúng trọn vẹn cả 4 ý phải đạt tối đa 1.0 điểm", () => {
    const userAnswers = [true, false, true, true]; // Đúng cả a, b, c, d
    expect(calculatePartIIScore(userAnswers, answerKey)).toBe(1.0);
  });

  it("Sai toàn bộ cả 4 ý phải nhận 0.0 điểm", () => {
    const userAnswers = [false, true, false, false];
    expect(calculatePartIIScore(userAnswers, answerKey)).toBe(0.0);
  });
});
```

---

## 3. Bộ Kiểm Thử Chống Ảo Giác Khoa Học Tự Nhiên (STEM Anti-Hallucination)

| Mã Kiểm Thử | Trường Hợp Thử Nghiệm (Edge Cases) | Hành Vi Vi Phạm (Fails) | Hành Vi Chuẩn Mực Bắt Buộc (Passes) |
| :--- | :--- | :--- | :--- |
| **STEM-01** | Tìm tập xác định $y = \log_2(x^2 - 4x + 3)$. | Bỏ qua bước giải bất phương trình $x^2 - 4x + 3 > 0$, lấy luôn $x > 3$. | Lập bảng xét dấu tam thức bậc hai, kết luận: $D = (-\infty; 1) \cup (3; +\infty)$. |
| **STEM-02** | Gọi tên este $CH_3COOC_2H_5$. | Trả về: *Etyl axetat* hoặc *Ethyl axetat*. | Trả về chuẩn IUPAC: **Ethyl acetate** hoặc **Ethyl ethanoate**. |
| **STEM-03** | Tính chu kỳ con lắc lò xo treo thẳng đứng khi biết độ giãn $\Delta l_0$. | Viết công thức $T = 2\pi\sqrt{\frac{m}{k}}$ nhưng không liên hệ với gia tốc trọng trường $g$. | Nêu rõ mối liên hệ $\frac{m}{k} = \frac{\Delta l_0}{g}$ và suy ra $T = 2\pi\sqrt{\frac{\Delta l_0}{g}}$. |
| **STEM-04** | Câu hỏi Phần III điền số thập phân âm. | Trả về dạng phân số $-\frac{7}{4}$. | Bắt buộc đổi sang số thập phân không quá 4 ký tự: `-1.75`. |

---

## 4. Thang Điểm Đánh Giá Thẩm Mỹ Slide & Sơ Đồ (Visual Scorecard)

Áp dụng bộ tiêu chí đánh giá tự động cho skill `/slide-thuyettrinh`:

```text
================================================================================
BẢNG ĐIỂM THẨM MỸ SLIDE (VISUAL SCORECARD - THANG ĐIỂM 100)
================================================================================
[ ] TIÊU CHÍ 1: MẬT ĐỘ CHỮ (TEXT DENSITY) - 25 Điểm
    - Slide không quá 6 gạch đầu dòng (Line budget <= 6): ĐẠT (+15đ)
    - Mỗi dòng không quá 12 từ, không có đoạn văn đặc quánh: ĐẠT (+10đ)
    
[ ] TIÊU CHÍ 2: BẢNG MÀU & ĐỘ TƯƠNG PHẢN (COLOR & CONTRAST) - 25 Điểm
    - Không dùng màu nguyên bản chói mắt (Pure Red #FF0000, Pure Green): ĐẠT (+15đ)
    - Tỷ lệ tương phản văn bản / nền đạt chuẩn WCAG AA (> 4.5:1): ĐẠT (+10đ)
    
[ ] TIÊU CHÍ 3: CẤU TRÚC PHÂN CẤP THỊ GIÁC (TYPOGRAPHIC HIERARCHY) - 25 Điểm
    - Tiêu đề (H1/H2) nổi bật rõ rệt so với nội dung chi tiết: ĐẠT (+15đ)
    - Có điểm nhấn từ khóa quan trọng (Bold, Badge, Box highlight): ĐẠT (+10đ)
    
[ ] TIÊU CHÍ 4: YẾU TỐ ĐỒ HỌA BỔ TRỢ (VISUAL ASSETS) - 25 Điểm
    - Có sơ đồ quy trình Mermaid.js hoặc bảng so sánh đối xứng: ĐẠT (+15đ)
    - Bố cục lưới (Grid 2 cột / 3 cột) cân đối, khoảng trắng thở tốt: ĐẠT (+10đ)
--------------------------------------------------------------------------------
TỔNG ĐIỂM YÊU CẦU: >= 85/100 ĐIỂM MỚI ĐƯỢC XUẤT BẢN RA CHO HỌC SINH
================================================================================
```

---

## 5. Bảng Kiểm Định Ngữ Văn (Literary Rubric Checklist)

Khi học sinh yêu cầu giải bài đọc hiểu hoặc viết đoạn văn bằng `/nguvan12`:
1.  **Kiểm tra tính nguyên bản:** Ngữ liệu đọc hiểu có phải là ngữ liệu ngoài SGK không? (Nếu trích bài đã học trong SGK cũ để ra đề thi tốt nghiệp $\rightarrow$ ĐÁNH RỚT).
2.  **Đoạn văn 200 chữ:**
    *   Phải là một **khối văn bản duy nhất (single paragraph)**, không xuống dòng giữa chừng.
    *   Dung lượng kiểm soát: từ 180 đến 230 chữ (quá ngắn hoặc quá dài đều bị cảnh báo trừ điểm).
    *   Đầy đủ 4 bước lập luận: Giải thích $\rightarrow$ Bàn luận/Chứng minh $\rightarrow$ Phản biện/Mở rộng $\rightarrow$ Bài học nhận thức & hành động.
