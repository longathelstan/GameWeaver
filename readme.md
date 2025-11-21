# GAMEWEAVER

**GameWeaver** - một nền tảng Admin Panel chuyên dụng hỗ trợ tự động hóa quy trình tạo trò chơi giáo dục từ dữ liệu Sách Giáo Khoa (SGK). Hệ thống ứng dụng kiến trúc RAG (Retrieval-Augmented Generation) kết hợp với mô hình ngôn ngữ lớn Google Gemini để thực hiện các tác vụ phức tạp: phân tích cấu trúc bài học, khởi tạo ngân hàng câu hỏi thông minh và sinh mã nguồn trò chơi tương tác hoàn chỉnh (trên nền tảng Next.js/React). Mục đích cốt lõi là giúp giáo viên giảm thiểu thời gian soạn thảo, đồng thời cá nhân hóa trải nghiệm học tập thông qua các trò chơi được thiết kế riêng biệt.


## Tính năng Nổi bật

**1. Xử lý dữ liệu thông minh (RAG Integration)**
Hệ thống tích hợp Retrieval-Augmented Generation để truy xuất chính xác dữ liệu từ các file JSON sách giáo khoa. Khả năng ánh xạ (mapping) tự động giúp phân rã dữ liệu thô thành cấu trúc bài học, chương, và số trang cụ thể.

**2. Quy trình Human-in-the-loop**
Quy trình tạo câu hỏi cho phép sự can thiệp của con người ở mức độ cao. Giáo viên có quyền kiểm duyệt, chỉnh sửa trực tiếp hoặc yêu cầu AI tái tạo nội dung trước khi đưa vào sản xuất game, đảm bảo tính chính xác về mặt sư phạm.

**3. Cơ chế đề xuất Game linh hoạt**
Hệ thống cung cấp hai chế độ lựa chọn game:
*   Game Suggest: AI tự động phân tích bộ câu hỏi và đề xuất loại game phù hợp nhất (Quiz, Memory, Puzzle...).
*   Custom Game: Cho phép người dùng nhập yêu cầu tùy biến để tạo ra luật chơi và giao diện theo ý muốn.

**4. Tự động sinh mã nguồn (Code Generation)**
Sử dụng Gemini để viết mã nguồn game hoàn chỉnh bằng React/Next.js. Hệ thống hỗ trợ tính năng xem trước (preview), tinh chỉnh mã nguồn (refine) và tải xuống gói cài đặt cuối cùng.

## Luồng hoạt động (User Flow)

Quy trình làm việc của ứng dụng trải qua 5 bước chính:

1.  **Khởi tạo và Truy xuất dữ liệu:** Người dùng nhập yêu cầu và chọn nguồn dữ liệu SGK. Hệ thống sử dụng RAG để nạp và đánh chỉ mục dữ liệu.
2.  **Lựa chọn phạm vi kiến thức:** Hệ thống hiển thị cây thư mục bài học/trang. Người dùng chọn các đơn vị kiến thức cần kiểm tra.
3.  **Sinh và Kiểm duyệt câu hỏi:** AI tạo bộ câu hỏi dựa trên số lượng yêu cầu. Người dùng thực hiện rà soát, chỉnh sửa hoặc yêu cầu AI viết lại cho đến khi đạt yêu cầu (Accept).
4.  **Đề xuất mô hình Game:** Người dùng chọn chế độ gợi ý tự động từ AI hoặc nhập mô tả game tùy chỉnh.
5.  **Lập trình và Hoàn thiện:** AI sinh mã nguồn Next.js/React. Người dùng kiểm thử, yêu cầu chỉnh sửa giao diện/logic và tải về mã nguồn hoàn thiện.

## Kiến trúc Công nghệ (Tech Stack)

**Frontend**
*   Framework: Next.js (App Router)
*   Language: TypeScript
*   UI Library: Shadcn UI, Tailwind CSS
*   State Management: Zustand
*   Code Editor: Monaco Editor

**Backend**
*   Runtime: Node.js
*   Framework: Express.js
*   Language: TypeScript

**AI & Database**
*   LLM: Google Gemini API
*   Orchestration: LangChain.js
*   Database: PostgreSQL
*   ORM: Prisma
*   Vector Store: Hỗ trợ RAG (Supabase pgvector hoặc Pinecone)

## Hướng dẫn Cài đặt

Thực hiện các bước sau để thiết lập môi trường phát triển cục bộ:

**Bước 1: Clone dự án**
Sao chép mã nguồn từ repository về máy.

**Bước 2: Cài đặt các gói phụ thuộc**
Truy cập vào thư mục gốc và thư mục server (nếu tách riêng) để cài đặt các thư viện cần thiết thông qua npm hoặc yarn.

**Bước 3: Cấu hình biến môi trường**
Tạo file .env dựa trên file mẫu. Cần cung cấp các khóa API quan trọng như GEMINI_API_KEY và DATABASE_URL.

**Bước 4: Khởi chạy cơ sở dữ liệu**
Chạy các lệnh migration của Prisma để đồng bộ hóa cấu trúc cơ sở dữ liệu.

**Bước 5: Khởi chạy ứng dụng**
Khởi động server backend và frontend ở chế độ development.

## Hướng dẫn Sử dụng

1.  Truy cập vào địa chỉ local của Admin Panel.
2.  Tại trang Dashboard, tải lên hoặc chọn dữ liệu sách giáo khoa.
3.  Làm theo hướng dẫn từng bước trên giao diện để chọn bài học và tạo câu hỏi.
4.  Tại bước cấu hình Game, mô tả chi tiết luật chơi nếu chọn chế độ Custom để có kết quả tốt nhất.
5.  Sử dụng khung chat Refine để yêu cầu AI sửa đổi màu sắc, bố cục hoặc logic game trước khi tải về.

## Đóng góp

Dự án hoan nghênh mọi đóng góp từ cộng đồng để cải thiện tính năng và hiệu suất. Vui lòng tuân thủ quy trình Pull Request và coding convention đã được thiết lập.

## Giấy phép

Dự án được phát hành dưới giấy phép MIT. Xem file LICENSE để biết thêm chi tiết.