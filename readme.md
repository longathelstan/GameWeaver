/GameWeaver
|
|--- 📁 /web-client        (Giao diện Quản trị cho người dùng)
|    |--- /src
|    |    |--- /components      (Các UI component: PromptInput, ModeSelector, OutputViewer)
|    |    |--- /pages           (Trang chính: GeneratorPage.tsx)
|    |    |--- /services        (APIService.ts - để gọi backend)
|    |    |--- App.jsx
|    |--- package.json         (Quản lý thư viện React, Vite...)
|
|--- 📁 /api-server            (Máy chủ Điều phối - Bộ não)
|    |--- /src
|    |    |--- /controllers     (Xử lý các request: generator.controller.js)
|    |    |--- /services        (Nơi chứa logic nghiệp vụ chính)
|    |    |    |--- gemini.service.js    (Dịch vụ gọi API Gemini)
|    |    |    |--- rag.service.js       (Dịch vụ truy xuất RAG)
|    |    |    |--- generator.service.js (Dịch vụ "Điều phối Prompt" chính)
|    |    |--- /routes          (Định tuyến API: /api/v1/generate)
|    |    |--- /utils           (Các hàm hỗ trợ, ví dụ: validator.js)
|    |    |--- server.js        (Khởi chạy máy chủ Express)
|    |--- package.json         (Quản lý thư viện Node.js, Express...)
|
|--- 📁 /knowledge-base         (Cơ sở Tri thức RAG - "Khuôn mẫu")
|    |--- /schemas             (Các lược đồ JSON chuẩn)
|    |    |--- react_quiz.schema.json
|    |    |--- react_word_guess.schema.json
|    |--- /templates_code      (Các đoạn code mẫu)
|    |    |--- html_quiz_template.txt     (Code HTML/CSS/JS mẫu)
|    |    |--- vba_quiz_template.txt      (Code VBA mẫu và các hàm chuẩn)
|    |    |--- vba_instructions.txt       (Hướng dẫn cài đặt VBA cho người dùng)
|
|--- 📁 /database               (Cơ sở Dữ liệu - Tùy chọn)
|    |--- /migrations        (Script để tạo bảng: users, prompt_history)
|    |--- schema.sql
|
|--- 🐳 /docker-compose.yml     (Để chạy B-API, DB, VectorDB cùng lúc)
|--- README.md                (Mô tả tổng quan, cách cài đặt, cách chạy)