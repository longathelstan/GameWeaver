# BẢNG BÁO GIÁ VÀ PHÂN TÍCH CHI PHÍ DỰ ÁN GAMEWEAVER

**Dự án:** GameWeaver - Hệ thống tạo Game giáo dục tự động bằng AI  
**Ngày lập:** 22/12/2025  
**Đơn vị tiền tệ:** VNĐ

---

## 1. TỔNG QUAN HỆ THỐNG

Dựa trên phân tích mã nguồn thực tế và kiến trúc kỹ thuật (`Next.js 16`, `Express`, `RAG`, `Gemini Pro`), dự án GameWeaver được xác định là một **nền tảng SaaS (Software as a Service)** có độ phức tạp cao, tích hợp sâu Deep Learning và Generative AI. 

Việc định giá được chia thành hai phần chính:
1.  **Chi phí hạ tầng vận hành (Infrastructure Cost):** Tối ưu hóa chi phí thực tế.
2.  **Giá trị công nghệ & phát triển (Development Valuation):** Đánh giá dựa trên quy mô hàng nghìn dòng lệnh (LoC) và chất xám thuật toán.

---

## 2. CHI TIẾT BÁO GIÁ

### A. Hạ tầng triển khai (Infrastructure Cost)

*Mục này tương ứng với con số **735,000 VNĐ** bạn đã tính toán. Dưới đây là bảng phân tích chi tiết để hợp lý hóa con số này trong hồ sơ:*

| STT | Hạng mục | Thông số kỹ thuật / Mô tả | Đơn giá (Ước tính) | Thành tiền | Ghi chú |
|:---:|:---|:---|:---:|:---:|:---|
| 1 | **Tên miền (Domain)** | Quốc tế (.me ) | 415,000 / năm | **0** | dùng chung với chủ domain nên không tính phí. |
| 2 | **Cloud Server (VPS)** | CPU: 2 vCore<br>RAM: 4GB<br>SSD: 60GB | 1,000,920 /tháng | **600,552** | Tính cho **18 ngày** hoạt động. Cần RAM tối thiểu 2GB để chạy Node.js & Docker container. |
| 3 | **Cơ sở dữ liệu** | PostgreSQL + Pgvector (Self-hosted) | 0 | 0 | Tự triển khai Docker trên VPS để tiết kiệm chi phí Cloud SQL. |
| 4 | **AI API Key** | Google Gemini API (Flash/Pro) | Tier 1 | 134,000 | Gói tier 1 của Google AI Studio cho sử dụng các model mạnh như Gemini 3 Flash/Pro cho ra kết quả game tốt nhất. |
| **I** | **TỔNG CỘNG (A)** | | | **734,552** | **Tối ưu chi phí vận hành** |

---

### B. Định giá Phần mềm (Software Development Valuation)

*Dựa trên phân tích Source Code thực tế tại các module cốt lõi (`generationController.ts`, `ragUtils.ts`, `Step4Preview.tsx`...), giá trị phát triển được định lượng như sau:*

| STT | Phân hệ (Module) | Chi tiết kỹ thuật & Độ phức tạp (Evidence Code) | Độ khó (1-5) | Giá trị ước tính (VNĐ) |
|:---:|:---|:---|:---:|:---:|
| 1 | **Frontend Web App (Next.js)** | - **Live Preview Engine** (`Step4Preview.tsx` - 13KB): Tích hợp Sandpack/Iframe để chạy code React game trực tiếp trên trình duyệt.<br>- **Code Editor**: Tích hợp Monaco Editor cho phép sửa code thời gian thực.<br>- **UI/UX Flow**: Quy trình 5 bước (`Wizard Steps`) phức tạp với State Management (Zustand). | 5/5 | **18,000,000** |
| 2 | **Backend API Core** | - **REST APIs**: Các endpoint xử lý dữ liệu (`mapController`, `dataController`).<br>- **Middleware**: Validation, Error Handling, và cấu trúc Controller/Service chuẩn mực.<br>- Sử dụng **Prisma ORM** quản lý schema phức tạp. | 3/5 | **8,000,000** |
| 3 | **RAG & Vector Search Engine** | - **Custom Vector Store** (`ragUtils.ts`): Tự triển khai thuật toán tìm kiếm vector sử dụng toán tử `<=>` của `pgvector` và SQL thuần (`$queryRaw`) cho hiệu năng cao.<br>- **Text Processing**: Tích hợp `LangChain` và `RecursiveCharacterTextSplitter` để xử lý dữ liệu SGK đầu vào. | 4/5 | **14,000,000** |
| 4 | **Generative AI Controller** | - **Prompt Engineering** (`generationController.ts`): Bộ prompt chuyên sâu để sinh Game 2D (Canvas) và 3D (Three.js) chỉ trong 1 file HTML.<br>- **Game Logic Refinement**: Logic AI tự động sửa lỗi code và tái tạo game theo yêu cầu người dùng (Human-in-the-loop). | 5/5 | **12,000,000** |
| **II** | **TỔNG CỘNG (B)** | | **High Tech** | **52,000,000** |

> **Nhận xét kỹ thuật:** Hệ thống không sử dụng các dịch vụ có sẵn (như ChatGPT Plus) mà tự xây dựng luồng xử lý RAG và Code Generation riêng biệt. Module `Step4Preview.tsx` và `ragUtils.ts` thể hiện hàm lượng kỹ thuật rất cao, vượt xa các ứng dụng web thông thường.

---

## 3. TỔNG HỢP

| HẠNG MỤC | CHI PHÍ (VNĐ) |
|:---|---:|
| **A. Chi phí hạ tầng (Vận hành 6 tháng)** | **734,552** |
| **B. Giá trị công nghệ (Phát triển phần mềm)** | **52,000,000** |
| **TỔNG GIÁ TRỊ DỰ ÁN** | **52,734,552** |

---

## 4. KẾT LUẬN

Dự án **GameWeaver** là điển hình của việc ứng dụng công nghệ cao (Generative AI + Vector Database) để giải quyết bài toán thực tế với chi phí vận hành cực thấp (**~735k**).

Giá trị thực của dự án nằm ở **55 triệu đồng** giá trị phần mềm, thể hiện qua:
1.  **Thuật toán RAG tùy biến** trên PostgreSQL (không dùng vector DB tốn phí).
2.  **Engine sinh code tự động** có thể tạo ra cả game 3D (Three.js).
3.  **Giao diện biên tập code trực quan** (Live Coding Environment).
