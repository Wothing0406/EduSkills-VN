# Bảng Vết (Trace Table), Big-O Thực Chiến & Bộ Test Biên CS1

Tài liệu tham chiếu mở rộng cho `lap-trinh-can-ban` (đối chiếu OpenStax *Introduction to Python Programming*).

## 1. Độ phức tạp các thao tác phổ biến trong Python

| Thao tác | `list` | `dict` / `set` | Lưu ý tránh bẫy ẩn |
|---|---|---|---|
| Truy cập chỉ số `a[i]` / tra khóa `d[k]` | $O(1)$ | $O(1)$ trung bình | Worst-case hash collision hiếm là $O(n)$ |
| Kiểm tra tồn tại `x in container` | **$O(n)$** | **$O(1)$ trung bình** | Dùng `set` nếu tra cứu nhiều lần trong vòng lặp |
| Thêm/xóa cuối (`append` / `pop()`) | $O(1)$ khấu hao | — | `pop(0)` hoặc `insert(0, x)` trên `list` tốn **$O(n)$**! (Dùng `collections.deque` nếu cần FIFO $O(1)$) |
| Sắp xếp `sorted(a)` | $O(n \log n)$ | — | Timsort ổn định; giữ nguyên thứ tự bằng nhau |

## 2. Quy Trình 4 Bước Debug Không Đoán Mò
1. **Tái hiện lỗi bằng đầu vào tối giản:** Rút về mảng $2$ hoặc $3$ phần tử, hoặc `[]`.
2. **Đặt giả thuyết dòng nghi ngờ:** Ghi kỳ vọng *trước khi nhìn* giá trị thực tế của biến.
3. **Lập Trace Table:** Theo dõi cột `Bước | Chỉ số i | Biến trạng thái | Kết quả tạm`.
4. **Thêm Test Hồi quy (Regression Test):** Giữ ca vừa gây lỗi thành một `assert` vĩnh viễn để không tái phát.

## 3. Khung Unit Test 4 Nhóm Cho Mọi Hàm Thuật Toán
- **Happy path:** Đầu vào phổ thông (`[3, 1, 4, 2]`).
- **Biên tối thiểu:** Rỗng `[]`, `""`, `n = 0`, `1` phần tử `[7]`.
- **Biên cấu trúc đặc biệt:** Toàn phần tử bằng nhau `[5, 5, 5]`, đã sắp xếp ngược, chứa số âm và `0`.
- **Biên cực lớn / bất hợp lệ:** Sai kiểu, `None`, độ dài lớn kiểm tra vượt $O(n^2)$ timeout.
