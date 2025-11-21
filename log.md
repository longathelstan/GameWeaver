# Log thay đổi dự án GameWeaver

## Ngày: 2025-11-14

### Tổng quan
- Khởi tạo toàn bộ cấu trúc dự án theo `readme.md`.
- Xây dựng các thành phần cốt lõi cho `api-server`, `web-client`, và `knowledge-base`.

### Chi tiết

#### 1. `knowledge-base`
- **Tạo các schema JSON:**
  - `react_quiz.schema.json`: Định nghĩa cấu trúc JSON cho game đố vui trên React.
  - `react_word_guess.schema.json`: Định nghĩa cấu trúc JSON cho game đoán chữ.
- **Tạo các template code:**
  - `html_quiz_template.txt`: Cung cấp một file HTML/CSS/JS mẫu hoàn chỉnh để AI điền vào.
  - `vba_quiz_template.txt`: Cung cấp cấu trúc code VBA mẫu cho game đố vui.
  - `vba_instructions.txt`: Soạn thảo hướng dẫn chi tiết để người dùng cuối có thể cài đặt và chạy code VBA trong PowerPoint.

#### 2. `api-server` (Node.js/Express)
- **Khởi tạo dự án:**
  - Dùng `npm init` và cài đặt các thư viện cần thiết: `express`, `cors`, `dotenv`.
  - Tạo cấu trúc thư mục: `src/controllers`, `src/services`, `src/routes`, `src/utils`.
- **Xây dựng luồng API:**
  - `server.js`: Khởi tạo máy chủ Express, áp dụng CORS và định tuyến.
  - `routes/api.js`: Định nghĩa endpoint `POST /api/v1/generate`.
  - `controllers/generator.controller.js`: Xử lý request, gọi service và trả về response.
- **Xây dựng logic cốt lõi (Services):**
  - `services/rag.service.js`: Logic để đọc các tệp "khuôn mẫu" từ `knowledge-base` dựa trên `gameType` và `outputMode`.
  - `services/generator.service.js`: "Bộ não" điều phối chính, nơi `prompt` của người dùng được kết hợp với "khuôn mẫu" RAG để tạo thành "Master Prompt".
  - `services/gemini.service.js`: File giả lập việc gọi đến API của Gemini. Nó trả về dữ liệu mẫu dựa trên `outputMode` để phục vụ việc phát triển và kiểm thử.

#### 3. `web-client` (React/Vite)
- **Khởi tạo dự án:**
  - Dùng `npm create vite@latest` với template React.
  - Cài đặt các thư viện: `antd` cho UI components và `axios` để gọi API.
  - Tạo cấu trúc thư mục: `src/components`, `src/pages`, `src/services`.
- **Xây dựng giao diện người dùng:**
  - `main.jsx`: Bọc ứng dụng trong `ConfigProvider` của Ant Design để tùy chỉnh theme.
  - `App.jsx`: Thiết lập layout chính với Header và Content.
  - `pages/GeneratorPage.jsx`: Trang chính của ứng dụng, quản lý trạng thái và luồng dữ liệu giữa các component.
- **Tạo các UI Components:**
  - `components/PromptInput.jsx`: Form cho người dùng nhập `prompt`, chọn `gameType` và `outputMode`.
  - `components/OutputViewer.jsx`: Component để hiển thị kết quả trả về từ API, có trạng thái loading và nút copy.
- **Tạo Service gọi API:**
  - `services/apiService.js`: Chứa hàm `generateContent` dùng `axios` để gửi request đến `api-server`.
