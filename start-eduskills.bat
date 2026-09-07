@echo off
chcp 65001 >nul
title EduSkills-VN Launcher — Tác giả: Nguyễn Duy Quang
cls

echo =============================================================
echo   🎓 CHƯƠNG TRÌNH KHỞI ĐỘNG HỆ THỐNG EDUSKILLS-VN (THPT 2026)
echo   Chủ nhiệm dự án: Nguyễn Duy Quang
echo   Hotline / Zalo:  0795277227
echo   Email:           poiairo4628@gmail.com
echo =============================================================
echo.

:: 1. Kiểm tra môi trường Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] KHÔNG TÌM THẤY NODE.JS TRÊN MÁY TÍNH CỦA BẠN!
    echo.
    echo Để chạy hệ thống, bạn chỉ cần cài đặt Node.js miễn phí tại:
    echo 👉 https://nodejs.org/ (Chọn bản LTS và bấm Next Next Install)
    echo.
    echo Sau khi cài xong, hãy nhấp đúp lại vào file này!
    echo.
    pause
    exit /b 1
)

echo [1/3] Đã phát hiện môi trường Node.js...
node -v
echo.

:: 2. Kiểm định và biên dịch Dataset Kỹ năng
echo [2/3] Đang kiểm định tính hợp lệ của toàn bộ Skills...
node scripts\validate-dataset.js
if %errorlevel% neq 0 (
    echo [!] Có lỗi xảy ra trong quá trình kiểm định dataset!
    pause
    exit /b 1
)

:: 3. Mở trình duyệt và chạy Máy chủ cục bộ
echo [3/3] Đang khởi chạy máy chủ cục bộ và mở giao diện Matcha Mèo Ú Hub (React 18)...
timeout /t 2 >nul
start http://localhost:3000

echo.
echo =============================================================
echo   ✅ HỆ THỐNG ĐANG HOẠT ĐỘNG TẠI: http://localhost:3000
echo   (Vui lòng KHÔNG đóng cửa sổ màu đen này khi đang sử dụng)
echo =============================================================
echo.

node server.js
pause
