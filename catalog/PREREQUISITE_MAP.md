# Bản Đồ Tiên Quyết Đa Ngành (THPT $\to$ Đại Học $\to$ Nghiên Cứu)

Nguồn dữ liệu máy đọc: [`catalog/prerequisite-graph.json`](prerequisite-graph.json).

```mermaid
flowchart LR
  subgraph THPT["Nền tảng THPT (16 skills đã hoàn thiện)"]
    T1["toan-thpt"]
    T2["vat-li-thpt / hoa-hoc-thpt / sinh-hoc-thpt"]
    T3["tin-hoc-thpt"]
    T4["ngu-van-thpt / khxh-thpt"]
    T5["luan-an-nghiencuu"]
  end

  subgraph Bridge["Cầu Chuyển tiếp & Học thuật Chung (Giai đoạn 1)"]
    CT["chuyen-tiep-dai-hoc"]
    HDH["hoc-dai-hoc-hieu-qua"]
    VHT["viet-hoc-thuat"]
    PPNC["phuong-phap-nghien-cuu"]
  end

  subgraph UniCore["Nền tảng Đại học Lớp B (Giai đoạn 1)"]
    GT["giai-tich-dai-hoc"]
    DS["dai-so-tuyen-tinh"]
    XS["xac-suat-thong-ke"]
    LT["lap-trinh-can-ban"]
  end

  subgraph Planned["Lộ trình mở rộng (Chưa tạo file rỗng — chỉ mở khi đủ nguồn & test)"]
    S2["Giai đoạn 2: vat-li-dai-cuong, phan-tich-du-lieu, doc-phan-bien-paper, do-an-dai-hoc..."]
    S3["Lớp C & D: phuong-trinh-vi-phan -> mo-hinh-hoa-toan-hoc, cau-truc-du-lieu, hoc-may..."]
  end

  T1 --> CT
  T2 --> CT
  T3 --> CT
  T4 --> CT
  CT --> HDH
  CT --> GT
  CT --> DS
  CT --> XS
  CT --> LT
  CT --> VHT
  GT -. "hỗ trợ liên tục" .-> XS
  DS -. "Hessian / Jacobian" .-> GT
  T5 --> PPNC
  VHT --> PPNC
  XS -. "định lượng" .-> PPNC
  GT --> S3
  DS --> S3
  LT --> S3
  PPNC --> S2
```

## Chuỗi tiên quyết mẫu tiêu biểu
- **Chuỗi Giải tích & Mô hình hóa:** `toan-thpt` $\to$ `chuyen-tiep-dai-hoc` $\to$ `giai-tich-dai-hoc` $\to$ *(dự kiến: `phuong-trinh-vi-phan` $\to$ `mo-hinh-hoa-toan-hoc`)*
- **Chuỗi Khoa học Dữ liệu & AI:** `toan-thpt` + `tin-hoc-thpt` $\to$ `chuyen-tiep-dai-hoc` $\to$ (`dai-so-tuyen-tinh` + `xac-suat-thong-ke` + `lap-trinh-can-ban` + `giai-tich-dai-hoc`) $\to$ *(dự kiến: `phan-tich-du-lieu` / `hoc-may`)*
- **Chuỗi Học thuật & Nghiên cứu:** `ngu-van-thpt` / `luan-an-nghiencuu` $\to$ `chuyen-tiep-dai-hoc` $\to$ `hoc-dai-hoc-hieu-qua` + `viet-hoc-thuat` $\to$ `phuong-phap-nghien-cuu` $\to$ *(dự kiến: `doc-phan-bien-paper`, `do-an-dai-hoc`)*
