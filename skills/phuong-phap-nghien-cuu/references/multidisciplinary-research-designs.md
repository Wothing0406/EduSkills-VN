# Tham Chiếu Thiết Kế Nghiên Cứu Đa Ngành, Truy Vết Nguồn & Dữ Liệu Tái Lập

Tài liệu mở rộng cho `phuong-phap-nghien-cuu` (đối chiếu khung thiết kế hỗn hợp Creswell & chuẩn tái lập đa ngành).

## 1. Ma Trận Lựa Chọn 10 Loại Hình Nghiên Cứu

| Loại nghiên cứu | Câu hỏi phù hợp nhất | Bằng chứng cốt lõi | Tiêu chuẩn độ tin cậy chính |
|---|---|---|---|
| **1. Định lượng** | Bao nhiêu? Mối liên hệ mạnh cỡ nào? | Số liệu đo lường có thang đo chuẩn | Cỡ mẫu, công cụ đo hợp lệ, kiểm định & khoảng tin cậy |
| **2. Định tính** | Như thế nào? Trải nghiệm/ý nghĩa gì? | Phỏng vấn sâu, quan sát thực địa, văn bản | Bão hòa thông tin (*saturation*), kiểm tra chéo (*triangulation*), *audit trail* |
| **3. Hỗn hợp** | Số liệu nói gì **và** tại sao xảy ra như vậy? | Kết hợp dữ liệu số + định tính theo thiết kế rõ | Tính khớp nối giữa pha định lượng và định tính (*Creswell*) |
| **4. Thực nghiệm** | Can thiệp $X$ có gây biến đổi $Y$ không? | Nhóm can thiệp vs đối chứng có kiểm soát nhiễu | Ngẫu nhiên hóa, làm mù (nếu có), lặp lại, kiểm soát sai số |
| **5. Quan sát** | Xu hướng tự nhiên trong cộng đồng/hiện tượng? | Dữ liệu dọc, cắt ngang, bệnh–chứng không can thiệp | Kiểm soát biến gây nhiễu (*confounders*), tránh sai lệch chọn mẫu |
| **6. Mô phỏng** | Hệ thống hành xử ra sao ở điều kiện biên khó đo? | Mô hình toán học/số chạy trên tham số rõ | Xác minh toán học (*verification*) + đối chiếu thực tế (*validation*) |
| **7. Tổng quan hệ thống** | Toàn bộ bằng chứng hiện có nói điều gì? | Từ khóa tìm kiếm, tiêu chí chọn/loại PRISMA, tổng hợp | Tính tái lập chiến lược tìm kiếm, đánh giá nguy cơ sai lệch nghiên cứu gốc |
| **8. Nghiên cứu tình huống** | Cơ chế sâu trong 1–vài bối cảnh điển hình? | Hồ sơ đa nguồn (tài liệu, phỏng vấn, hiện trường) | Ranh giới ca nghiên cứu rõ ràng, đối chứng đa nguồn |
| **9. Thiết kế kỹ thuật** | Giải pháp/nguyên mẫu mới giải quyết bài toán kỹ thuật thế nào? | Yêu cầu kỹ thuật, nguyên mẫu, benchmark hiệu năng | So sánh công bằng với baseline, đo độ trễ/độ bền/an toàn |
| **10. Sáng tạo nghệ thuật** | Thực hành sáng tác tạo tri thức/thẩm mỹ mới gì? | Tác phẩm, nhật ký sáng tác (*studio log*), phản biện | Tính nhất quán giữa ý đồ nghệ thuật, kỹ thuật chất liệu và hồ sơ quá trình |

## 2. Khung Bảng Lưu Vết Nguồn 9 Trường (Mục 12)

| Nội dung được hỗ trợ | URL hoặc DOI | Tác giả / Cơ quan | Năm | Ngày truy cập | Loại nguồn | Phạm vi áp dụng | Giới hạn | Trạng thái kiểm tra |
|---|---|---|---:|---|---|---|---|---|
| Quy chế tín chỉ & điểm thành phần | Văn bản `08/2021/TT-BGDĐT` (`moet.gov.vn`) | Bộ GDĐT Việt Nam | 2021 | 2026-11-18 | Pháp lý chính thức | Đào tạo trình độ ĐH VN | Trường tự chủ có thể quy định chi tiết thêm | Đã kiểm tra |
| Quy trình Mixed Methods | Sách *Research Design* | Creswell & Creswell | 2018/2023 | 2026-11-18 | Giáo trình học thuật | Nghiên cứu hỗn hợp | Cần tùy biến theo ngành | Đã kiểm tra tên/nội dung |

## 3. Checklist Tái Lập & Lĩnh Vực Rủi Ro Cao
- **Dữ liệu tái lập:** Nguồn $\to$ Giấy phép $\to$ `raw` bất biến $\to$ `processed` tách riêng $\to$ Script + Phiên bản thư viện $\to$ Tiêu chí loại ngoại lệ $\to$ Báo cáo missing values + Độ bất định $\to$ Gắn bảng kết quả với script.
- **Lĩnh vực rủi ro cao:** Với Y/Dược, Pháp luật, Tài chính, Xây dựng, Điện, Hóa chất — luôn chèn cảnh báo *giáo dục vs quyết định hành nghề* và kiểm tra quy chuẩn hiện hành trước khi phát hành.
