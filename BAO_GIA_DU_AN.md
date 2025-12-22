# BẢNG BÁO GIÁ VÀ PHÂN TÍCH CHI PHÍ DỰ ÁN GAMEWEAVER

**Dự án:** GameWeaver - Hệ thống tạo Game giáo dục tự động bằng AI  
**Ngày lập:** 22/12/2025  
**Đơn vị tiền tệ:** VNĐ

---

## 1. TỔNG QUAN HỆ THỐNG

Dựa trên phân tích mã nguồn và kiến trúc kỹ thuật (`Next.js`, `Express`, `RAG`, `Gemini AI`), dự án GameWeaver không chỉ là một website đơn thuần mà là một **nền tảng SaaS (Software as a Service)** tích hợp AI. Việc định giá được chia thành hai phần chính:
1.  **Chi phí hạ tầng vận hành (Infrastructure):** Phần cứng và dịch vụ để chạy hệ thống.
2.  **Giá trị công nghệ & phát triển (Development Valuation):** Chi phí chất xám, công sức lập trình và tích hợp công nghệ tiên tiến.

---

## 2. CHI TIẾT BÁO GIÁ

### A. Hạ tầng triển khai (Infrastructure Cost)

*Mục này tương ứng với con số **735,000 VNĐ** bạn đã tính toán. Dưới đây là bảng phân tích chi tiết để hợp lý hóa con số này trong hồ sơ:*

| STT | Hạng mục | Thông số kỹ thuật / Mô tả | Đơn giá (Ước tính) | Thành tiền | Ghi chú |
|:---:|:---|:---|:---:|:---:|:---|
| 1 | **Tên miền (Domain)** | Quốc tế (.com / .net) | 315,000 /năm | **315,000** | Chi phí cố định hàng năm. |
| 2 | **Cloud Server (VPS)** | CPU: 1-2 vCore<br>RAM: 2GB - 4GB<br>SSD: 20GB | 70,000 /tháng | **420,000** | Tính cho **06 tháng** hoạt động. Cần RAM tối thiểu 2GB để chạy Node.js & Docker. |
| 3 | **Cơ sở dữ liệu** | PostgreSQL (Self-hosted trên VPS) | 0 | 0 | Tận dụng tài nguyên VPS để tiết kiệm chi phí. |
| 4 | **AI API Key** | Google Gemini API | Miễn phí | 0 | Sử dụng gói Free Tier của Google AI Studio (đủ cho demo/thi). |
| **I** | **TỔNG CỘNG (A)** | | | **735,000** | **Khớp với dự toán của bạn** |

> **Phân tích:** Với 735k, bạn đang tối ưu chi phí bằng cách tự quản trị (self-hosted) Database và Backend trên cùng một VPS giá rẻ và sử dụng tài nguyên miễn phí từ Google. Đây là phương án kinh tế nhất cho giai đoạn thi KHKT hoặc thử nghiệm.

---

### B. Định giá Phần mềm (Software Development Valuation)

*Đây là giá trị "chất xám" của dự án. Trong các cuộc thi KHKT hoặc gọi vốn, con số này thể hiện quy mô và độ phức tạp của sản phẩm.*

| STT | Phân hệ (Module) | Chi tiết tính năng & Công nghệ | Ước tính công (Man-day) | Giá trị ước tính (VNĐ) |
|:---:|:---|:---|:---:|:---:|
| 1 | **Frontend Web App** | - Framework: **Next.js 16**, React 19.<br>- UI/UX: Shadcn UI, Tailwind, Responsive.<br>- **Advanced:** Tích hợp bộ biên tập Code (Monaco Editor), Sandpack Live Preview. | 25 | **15,000,000** |
| 2 | **Backend API Core** | - Framework: **Express.js**, TypeScript.<br>- Database: Prisma ORM, PostgreSQL.<br>- Xử lý Authentication, Project Management. | 15 | **9,000,000** |
| 3 | **AI Engine & RAG** | - **Core AI:** Tích hợp LangChain, Google Gemini.<br>- **RAG:** Xử lý vector hóa dữ liệu SGK, tìm kiếm ngữ nghĩa (Semantic Search).<br>- Kỹ thuật Prompt Engineering phức tạp để sinh code game. | 20 | **12,000,000** |
| 4 | **Game Logic Generator** | - Hệ thống tự động sinh luật chơi, logic game.<br>- Module Human-in-the-loop (Chỉnh sửa câu hỏi, Refine game). | 10 | **6,000,000** |
| **II** | **TỔNG CỘNG (B)** | | **70 ngày** | **42,000,000** |

---

## 3. TỔNG HỢP

| HẠNG MỤC | CHI PHÍ (VNĐ) |
|:---|---:|
| **A. Chi phí hạ tầng (Vận hành 6 tháng)** | **735,000** |
| **B. Giá trị công nghệ (Phát triển phần mềm)** | **42,000,000** |
| **C. Chi phí dự phòng & Bảo trì** (10% B) | **4,200,000** |
| **TỔNG GIÁ TRỊ DỰ ÁN** | **46,935,000** |

---

## 4. KẾT LUẬN & ĐỀ XUẤT

Với mức đầu tư hạ tầng chỉ **735,000 VNĐ**, dự án tạo ra một sản phẩm công nghệ có giá trị ước tính gần **47 triệu đồng**. Điều này cho thấy tính hiệu quả cao về mặt kinh tế khi áp dụng **Generative AI** để tự động hóa quy trình sản xuất phần mềm (cụ thể là Game giáo dục).

**Lưu ý cho báo cáo KHKT:**
1.  Nhấn mạnh vào phần **B** (Giá trị công nghệ) để ban giám khảo thấy độ phức tạp.
2.  Phần **A** (735k) chứng minh tính khả thi và khả năng triển khai thực tế với chi phí thấp, phù hợp để nhân rộng trong trường học.
