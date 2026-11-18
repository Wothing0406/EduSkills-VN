# THPT Agent Skills (EduSkills-VN)

Bộ **16 Agent Skills** đóng vai trò **gia sư thích ứng và trợ lý học liệu** cho học sinh, giáo viên bậc **THPT lớp 10–12** tại Việt Nam theo Chương trình GDPT 2018 và cấu trúc đề thi Quyết định **764/QĐ-BGDĐT** (08/03/2024). Trọng tâm của bộ skills là hỗ trợ học sinh phát hiện lỗi trong bài làm, bổ sung kiến thức thiếu, rèn phản biện lập luận và phát triển khả năng tự giải quyết vấn đề xuyên suốt cả 2 học kì; đồng thời cài đặt trực tiếp vào mọi dự án bằng `npx skills add`.

> **Báo cáo kiểm chứng cho người dùng (Không dùng Skill vs Có dùng Skill):**
> Xem báo cáo tổng hợp dễ đọc kèm trích dẫn đối chứng nguyên văn và hướng dẫn tự test trong 3 phút tại [`docs/09_BAO_CAO_KIEM_CHUNG_SKILLS.md`](docs/09_BAO_CAO_KIEM_CHUNG_SKILLS.md) (mở trực tiếp trên GitHub hoặc nhấn `Ctrl + Shift + V` trong VS Code / Antigravity / Cursor).

---

## Báo cáo Nghiên cứu & Cơ sở Tái cấu trúc

Trước khi tái cấu trúc lên phiên bản hiện tại, dự án đã thực hiện khảo sát thực tế trên hai nhóm nội dung (ghi nhận rõ phương pháp và phạm vi thực thi):

> **Lưu ý minh bạch về công cụ `/last30days`:** Khi kiểm tra môi trường thực tế trên máy cục bộ, engine Python của kỹ năng `last30days` (`last30days.py`) yêu cầu Python `3.12+` hoặc `uv`, trong khi máy hiện có Python `3.11` nên **không chạy được engine Python `last30days.py`**. Toàn bộ kết quả nghiên cứu dưới đây được thực hiện qua **tra cứu tài liệu chính thống trên web (`search_web`) kết hợp khảo sát trực tiếp mã nguồn các bộ Agent Skills có sẵn**, không sử dụng đầu ra của `last30days.py`.

### 1. Nghiên cứu nội dung học tập tổng quát 2 học kì THPT (GDPT 2018)
- **Nguồn khảo sát:** Chương trình GDPT 2018 (Thông tư 32/2018/TT-BGDĐT) và tài liệu định hướng ôn tập từ cổng giáo dục (`moet.gov.vn`, `bacninh.edu.vn`, `chinhphu.vn`, kiểm tra ngày `2026-11-18`).
- **Kết quả áp dụng vào bộ skills:**
  - Thiết kế bảng **Liên thông 2 Học kì (HK1 $\leftrightarrow$ HK2) & Vận dụng thực tiễn** trong từng tệp `references/curriculum-10-12.md` của 11 skill môn học, giúp học sinh kết nối nền tảng HK1 sang kiến thức tích hợp HK2 và tình huống đời sống (tối ưu hóa, lãi suất, sử dụng điện an toàn, an toàn thực phẩm, quyền công dân, nhận diện tin giả).
  - Rà soát và cập nhật chuẩn văn bản còn hiệu lực: cấu trúc thi từng môn theo **QĐ 764/QĐ-BGDĐT** (08/03/2024), lộ trình SGK thống nhất *Kết nối tri thức với cuộc sống* từ 2026–2027 theo **QĐ 3588/QĐ-BGDĐT** (26/12/2025), 34 đơn vị hành chính cấp tỉnh theo **NQ 202/2025/QH15** (hiệu lực 01/7/2025), chính quyền địa phương 2 cấp theo **NQ 203/2025/QH15** (hiệu lực 01/7/2025) và quy chế thi KHKT ViSEF theo **Thông tư 84/2026/TT-BGDĐT** (30/09/2026).

### 2. Nghiên cứu cấu trúc, ngôn từ rule & cách đóng gói của các bộ Skills lớn
- **Nguồn khảo sát:** Đặc tả mở `agentskills.io`, tài liệu `vercel-labs/agent-skills` (`skills` CLI `v1.9.0`), `anthropics/skills`, Antigravity `skill-creator` và cấu trúc thực tế của repository đa kỹ năng (`agentic-awesome-skills`, `awesome-llm-apps`).
- **Kết quả áp dụng vào thiết kế và ngôn từ:**
  - **Cấu trúc phân phối chuẩn `npx skills`:** Bỏ tầng thư mục phân loại trung gian (`skills/<category>/...`) sang bố cục phẳng `skills/<ten-skill>/`; không đặt `SKILL.md` ở repository root (tránh CLI chỉ nhận diện 1 skill); giữ mỗi skill hoàn toàn **tự chứa (self-contained)** với `SKILL.md`, `agents/openai.yaml` và `references/` kèm điều kiện đọc cụ thể (*Progressive Disclosure 3 tầng*).
  - **Quy chuẩn `AGENTS.md` và `.agent/rules/`:** Tạo [`AGENTS.md`](AGENTS.md) ở repository root và [`.agent/rules/thpt-pedagogy.md`](.agent/rules/thpt-pedagogy.md) theo chuẩn Open Agent / Antigravity, quy định ngôn từ hướng dẫn tích cực dành cho học sinh THPT.
  - **Thay đổi ngôn từ sư phạm (bỏ quy định cứng nhắc):** Loại bỏ khối XML lặp lại và các mệnh lệnh cực đoan (*"luôn trả lời 4 tầng cho mọi câu"*, *"tuyệt đối cấm trả lời ngắn"*); thay bằng **6 chế độ thích ứng**, **quy trình chẩn đoán lỗi 8 bước** (tách lỗi gốc – lỗi kéo theo, công nhận cách làm khác hợp lệ), **gợi mở 5 mức** (mỗi lượt 1 câu hỏi trọng tâm, dừng chờ trả lời, không vừa hỏi vừa viết đáp án bên dưới) và **kiểm tra tiến bộ thực sự** (không gán nhãn *"mất gốc"*, *"yếu tư duy"*).

### 3. Nâng cấp hợp nhất `v2.3.0` → Khôi phục & Mở rộng Học liệu `v2.4.0` (`tests/eval/`)
- **Thiết kế 1 tệp `SKILL.md` hợp nhất (Unified Standalone + 4-Type Mode Router A/B/C/D):**
  - Mỗi `SKILL.md` chuẩn **10 mục bắt buộc (`## 1.` .. `## 10.`)**, tự chứa đủ bản đồ **Lớp 10–11–12 theo chương mục (HK1 & HK2)**, phân tách rõ 4 loại yêu cầu: **Loại A** (*cẩm nang ôn tập nhiều chương 8 phần, bảng phân biệt, ma trận bẫy 6 cột, tự kiểm tra tách đáp án*), **Loại B** (*chẩn đoán & gợi mở 1 câu hỏi dừng chờ, 0% lộ đáp số*), **Loại C** (*giải đầy đủ & lý do phương án nhiễu có vẻ hợp lý*), **Loại D** (*`@canvas` tương tác sạch công thức, nút gợi ý/chấm/làm lại thật hoặc khai báo trung thực chat thuần*).
  - **Không đánh đồng ôn giữa kỳ với đề thi tốt nghiệp 22/28/40 câu QĐ 764**; quy tắc *"1 câu hỏi rồi dừng chờ"* chỉ áp dụng cho đối thoại sửa lỗi Loại B.
- **Thực nghiệm đối chứng có kiểm soát (`v2.3.0` — 135 lượt trên `gemini-3.1-flash-lite`, `temperature = 0.0`, giám khảo mù nhãn `gemini-3.1-flash-lite-preview`):**
  - **`C1_v2_3_0_standalone` (`n = 28` lượt):** Đúng chuyên môn **`28/28` (`100.0%`)**, phát hiện lỗi **`18/18` (`100.0%`)**, không sửa nhầm bài đúng **`18/18` (`100.0%`)**, trung thực **`28/28` (`100.0%`)**, rò đáp án giảm từ `50.0%` (`v2.0.0`) xuống **`10.0%` (`1/10`)**; giảm `49.4%` output tokens (`395.5` vs `781.7`) và `36.8%` prompt tokens.
- **Kiểm thử hồi quy & khôi phục năng lực (`v2.4.0` — `REG-01..REG-07`, đối chứng cùng model `gemini-3.1-flash-lite`):**
  - Khắc phục hoàn toàn lỗi dừng bỏ lửng hoặc thiếu cấu trúc ở `REG-01..REG-03, REG-05, REG-06` (`12/12` lượt đạt trên `REG-02..REG-07` ở cả `C1` standalone và `C2` kèm `references/`), trong khi vẫn giữ nguyên Zero-Leak ở Loại B (`REG-04`) và bộ bảo toàn Core/Holdout. Xem báo cáo đầy đủ tại [tests/eval/research-report.md](tests/eval/research-report.md) và [tests/eval/regression-report-v240.md](tests/eval/regression-report-v240.md).

---

## Danh sách 16 Skills

### Môn Khoa học Tự nhiên
| Skill | Phạm vi chính | Ví dụ yêu cầu thực tế |
| :--- | :--- | :--- |
| `toan-thpt` | Toán 10–12: Đại số, Giải tích, Hình học không gian $Oxyz$, Thống kê & Xác suất | *"Dùng `$toan-thpt` gợi ý bước lập hàm tìm GTNN của $S(x) = x^2 + \frac{2000}{x}$ ($x>0$)."* |
| `vat-li-thpt` | Vật lí 10–12: Cơ, Dao động – Sóng, Điện – Từ trường, Nhiệt học, Khí lí tưởng, Hạt nhân | *"Giải thích giúp em dấu của $Q$ và $A$ trong $\Delta U = Q + A$ khi khí giãn nở đẩy pittông."* |
| `hoa-hoc-thpt` | Hóa học 10–12: Danh pháp IUPAC, Enthalpy, Cân bằng, Phổ IR/MS, Hữu cơ, Pin điện | *"Thủy phân $17.6\text{ g}$ ethyl acetate với lượng $\text{NaOH}$ vừa đủ tính theo IUPAC và đkc $24.79\text{ L/mol}$."* |
| `sinh-hoc-thpt` | Sinh học 10–12: Cơ chế phân tử (`DNA/RNA`), Quy luật di truyền, Phả hệ, Quần thể, Sinh thái | *"Tính tỉ lệ cây hoa đỏ dị hợp trong tổng số các cây hoa đỏ ở quần thể cân bằng có $16\%$ hoa trắng."* |

### Môn Khoa học Xã hội
| Skill | Phạm vi chính | Ví dụ yêu cầu thực tế |
| :--- | :--- | :--- |
| `ngu-van-thpt` | Ngữ văn 10–12: Đọc hiểu ngữ liệu mới theo thể loại, đoạn 200 chữ, bài nghị luận 600 chữ | *"Chấm giúp em đoạn văn NLXH 200 chữ xem bố cục 1 đoạn và dẫn chứng đã ổn chưa."* |
| `lich-su-thpt` | Lịch sử 10–12: Lịch sử Thế giới & Việt Nam, phân tích tư liệu gốc, đối sánh mốc niên đại | *"Phân biệt ý nghĩa chuyển biến chiến lược của Việt Bắc 1947 và Biên giới 1950."* |
| `dia-li-thpt` | Địa lí 10–12: Tự nhiên, Dân cư, Kinh tế ngành/vùng, công thức tính toán & chọn biểu đồ | *"Tính năng suất lúa theo `tạ/ha` từ bảng số liệu và giải thích vì sao không chọn biểu đồ miền cho 2 năm."* |
| `ktpl-thpt` | GDKT&PL 10–12: Kinh tế vi mô/vĩ mô, Tài chính cá nhân, Phân tích tình huống pháp luật | *"Bóc tách hành vi khóa nhốt công nhân trong kho và tung tin đồn xâm phạm những quyền nào?"* |

### Ngôn ngữ & Công nghệ
| Skill | Phạm vi chính | Ví dụ yêu cầu thực tế |
| :--- | :--- | :--- |
| `tieng-anh-thpt` | Tiếng Anh 10–12 (B1–C1): Ngữ pháp, Word Formation, Chính tả, IPA, Sắp xếp câu, Đọc hiểu | *"Chia dạng đúng của `(ACHIEVE)` và nhắc em quy tắc chính tả để tránh nhầm chữ `i` và `e`."* |
| `tin-hoc-thpt` | Tin học 10–12 (CS & ICT): Python (chạy vết Trace Table), Big-O, SQL, Mạng TCP/IP, HTML/CSS | *"Tìm lỗi trong câu lệnh SQL dùng `AVG(DiemSo)` trong `WHERE` và viết lại cho đúng."* |
| `cong-nghe-thpt` | Công nghệ 10–12 (Công nghiệp & Nông nghiệp): TCVN, Cơ khí, Điện 3 pha, Điện tử số, Biofloc/RAS | *"Động cơ $\Delta/Y - 220/380\text{ V}$ đấu vào lưới $220/380\text{ V}$ phải nối kiểu gì để không cháy tải?"* |

### Công cụ Sư phạm & Học tập (Meta-Tools)
| Skill | Phạm vi chính | Ví dụ yêu cầu thực tế |
| :--- | :--- | :--- |
| `giai-chi-tiet` | Gia sư giải thích từng bước, chế độ gợi ý Socrates, chấm bài và phân tích phương án nhiễu | *"Chấm xem bài giải phương trình phân thức của em bị sai từ bước nào và giải thích lại."* |
| `tao-quiz-bgd` | Thiết kế câu hỏi luyện tập & đề thi chuẩn cấu trúc từng môn theo QĐ 764/QĐ-BGDĐT | *"Tạo mini-test 5 câu Địa lí 12 đủ 3 phần kèm phương án nhiễu và đáp án cuối đề."* |
| `tomtat-mindmap` | Hệ thống hóa bài học thành sơ đồ tư duy Mermaid, bảng tổng hợp Cornell và câu hỏi tự kiểm tra | *"Tóm tắt bài Quang hợp Sinh 11 bằng mindmap Mermaid và 3 câu hỏi Active Recall."* |
| `slide-thuyet-trinh` | Thiết kế dàn ý và mã nguồn slide Marp Markdown 16:9 (Rule of Six + Speaker Notes) | *"Chuyển báo cáo năng lượng mặt trời này thành bộ 6 slide Marp 16:9 ít chữ kèm lời nói."* |
| `luan-an-nghiencuu` | Cố vấn nghiên cứu KHKT THPT chuẩn ViSEF (Thông tư 84/2026/TT-BGDĐT): giả thuyết, đối chứng, phản biện | *"Giúp em đặt giả thuyết $H_0/H_1$ và thiết kế lô đối chứng cho đề tài than sinh học vỏ trấu."* |

---

## Cấu trúc thư mục

```text
skillsGeminiTHPT/
├── README.md
├── AGENTS.md                   # Quy tắc chuẩn repository dành cho coding/teaching agents
├── .agent/
│   └── rules/
│       └── thpt-pedagogy.md    # Workspace rule về ngôn từ và sư phạm THPT
├── LICENSE
├── skills/
│   ├── toan-thpt/
│   │   ├── SKILL.md            # Phạm vi, 6 chế độ thích ứng, chẩn đoán 8 bước, gợi mở 5 mức
│   │   ├── agents/openai.yaml  # Metadata giao diện (display_name, short_description, $skill)
│   │   └── references/         # Chương trình 2 kì, quy tắc 7 phần, cấu trúc QĐ 764 & ví dụ
│   └── ... (15 skills còn lại, mỗi skill tự chứa hoàn toàn)
├── scripts/
│   ├── validate_skills.py      # Kiểm định cấu trúc 10 mục, frontmatter, liên kết, công cụ & metadata
│   ├── run_gemini_eval.py      # Script chạy thực nghiệm Gemini API (truyền key qua biến môi trường)
│   ├── score_gemini_eval.py    # Bộ chấm điểm xác định + giám khảo AI mù nhãn
│   └── ...                     # Script hỗ trợ dataset/web cục bộ (tùy chọn)
├── docs/
│   ├── 08_USER_GUIDE_HUONG_DAN_SU_DUNG.md
│   └── 09_BAO_CAO_KIEM_CHUNG_SKILLS.md  # Báo cáo tổng hợp & so sánh Không dùng Skill vs Có dùng Skill
└── tests/
    ├── eval/                   # Bộ 24 ca kiểm thử (18 Core + 6 Holdout), kết quả & báo cáo thực nghiệm
    └── scenarios/              # 12 tình huống sư phạm cốt lõi, holdout set, so sánh cũ/mới & 48 ca môn học
```

---

## Yêu cầu môi trường

- **Để cài đặt bằng `npx skills`:** Node.js **18+** (đi kèm `npm` / `npx`).
- **Để chạy script kiểm định cục bộ (`scripts/validate_skills.py`):** Python **3.9+** và thư viện `PyYAML` (`pip install pyyaml`).

---

## Cài đặt bằng `npx skills`

> Lưu ý: Hãy chạy lệnh cài đặt khi đang đứng tại **thư mục gốc của dự án đích** (nằm ngoài cây nguồn nếu thử nghiệm từ thư mục local). Khi chạy với `--agent codex` (không gắn `--global`), CLI `skills` (`v1.9.0`) sẽ cài kỹ năng theo phạm vi dự án vào thư mục **`.agents/skills/<ten-skill>/`** (thư mục universal dùng chung cho Codex và các agent tương thích).

### 1. Kiểm tra danh sách skills từ nguồn

Từ thư mục local:
```bash
npx skills add "C:\Users\QuangDev\.gemini\config\projects\skillsGeminiTHPT" --list
```

Hoặc trên macOS/Linux (thay `<SOURCE_PATH>` bằng đường dẫn tuyệt đối tới thư mục repo đã clone):
```bash
npx skills add "<SOURCE_PATH>" --list
```

Từ GitHub (`Wothing0406/EduSkills-VN`):
```bash
npx skills add "Wothing0406/EduSkills-VN" --list
```

### 2. Cài theo dự án (Project-level) cho Codex

- **Cài toàn bộ 16 skills** (chọn đúng `--agent codex`, không dùng `--all` nếu chỉ muốn cài cho Codex):
  ```bash
  npx skills add "<SOURCE_PATH>" --skill "*" --agent codex --copy --yes
  ```
  Hoặc từ GitHub:
  ```bash
  npx skills add "Wothing0406/EduSkills-VN" --skill "*" --agent codex --copy --yes
  ```

- **Cài riêng một skill** (ví dụ `toan-thpt`, kèm sẵn toàn bộ `references/` và `agents/openai.yaml` tự chứa):
  ```bash
  npx skills add "<SOURCE_PATH>" --skill toan-thpt --agent codex --copy --yes
  ```
  Hoặc từ GitHub:
  ```bash
  npx skills add "Wothing0406/EduSkills-VN" --skill toan-thpt --agent codex --copy --yes
  ```

### 3. Cài Global (User-level) vs Cài theo Dự án

- **Cài theo dự án (mặc định, khuyến nghị cho từng workspace):** Bỏ cờ `--global`; skills được lưu trong `.agents/skills/` ngay tại dự án đích để không ảnh hưởng toàn máy.
- **Cài Global (dùng chung mọi dự án của user hiện tại):** Thêm cờ `--global` (viết tắt `-g`):
  ```bash
  npx skills add "<SOURCE_PATH>" --skill "*" --agent codex --copy --global --yes
  ```

### 4. Kiểm tra các skills đã cài

- Xem danh sách skills đang cài trong dự án hiện tại:
  ```bash
  npx skills list
  ```
- Xem danh sách skills đang cài ở phạm vi global:
  ```bash
  npx skills list --global
  ```

---

## Quy tắc Workspace & Kiểm định chất lượng bộ Skills

- **Quy tắc sư phạm & bảo trì repo:** Xem [AGENTS.md](AGENTS.md) và quy tắc workspace tại [.agent/rules/thpt-pedagogy.md](.agent/rules/thpt-pedagogy.md).
- **Kiểm tra cấu trúc & tính tự chứa của 16 skills:**
  ```bash
  python scripts/validate_skills.py
  ```
- **Kiểm thử dataset, Web Hub & REST API:**
  ```bash
  npm test
  ```
- **Báo cáo kiểm chứng & hướng dẫn đọc cho người dùng:** [docs/09_BAO_CAO_KIEM_CHUNG_SKILLS.md](docs/09_BAO_CAO_KIEM_CHUNG_SKILLS.md) (so sánh **Không dùng Skill vs Có dùng Skill**, bản copy-paste vs bản cài đặt, kèm hướng dẫn tự test 3 phút)
- **Đánh giá thực nghiệm trên Gemini API (`tests/eval/`):**
  - Kế hoạch & tiêu chí khóa trước: [tests/eval/eval-plan.md](tests/eval/eval-plan.md)
  - Bộ 24 tình huống kiểm thử (18 Core + 6 Holdout): [tests/eval/test-cases.json](tests/eval/test-cases.json)
  - Báo cáo thực nghiệm đầy đủ: [tests/eval/research-report.md](tests/eval/research-report.md)
  - Báo cáo kiểm thử hồi quy & khôi phục năng lực (`v2.4.0`): [tests/eval/regression-report-v240.md](tests/eval/regression-report-v240.md)
  - Bộ test hồi quy cẩm nang & `@canvas`: [tests/eval/regression-cases.json](tests/eval/regression-cases.json)
- **Bộ tình huống đánh giá hành vi sư phạm (`tests/scenarios/`):**
  - Tổng quan & phân tách trạng thái kiểm chứng: [tests/scenarios/README.md](tests/scenarios/README.md)
  - 12 tình huống sư phạm cốt lõi + Rubric 8 tiêu chí: [pedagogical-12-cases.md](tests/scenarios/pedagogical-12-cases.md)
  - Bộ Holdout 6 bài độc lập: [holdout-eval-set.md](tests/scenarios/holdout-eval-set.md)
  - Báo cáo đối chiếu bản cũ vs bản mới (`v2.1.0`): [baseline-vs-refactored.md](tests/scenarios/baseline-vs-refactored.md)

---

## Công cụ Web Hub cục bộ (Tùy chọn trong repo)

Bên cạnh gói Agent Skills chuẩn `npx skills`, repository cũng giữ lại ứng dụng Node.js/OCR cục bộ (`server.js`, `backend/`, `web/`) phục vụ tra cứu và trích xuất đề bài trên trình duyệt:

```bash
npm install
npm start   # Mở http://localhost:3000
```

---

## Tác giả & Giấy phép

- **Tác giả:** Nguyễn Duy Quang (`poiairo4628@gmail.com` • GitHub: [@Wothing0406](https://github.com/Wothing0406))
- **Giấy phép:** [MIT License](LICENSE)
