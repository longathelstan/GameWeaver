## 🌎 Tài liệu Cấu trúc Dự án: GAMEWEAVER

### 1\. Tổng quan Dự án

**Mục tiêu:** Xây dựng một ứng dụng web (Admin Panel) cho phép người dùng nhập yêu cầu (prompt) và chọn một "Mode Output". Hệ thống sẽ sử dụng AI (Gemini) để tạo ra nội dung hoặc mã nguồn hoàn chỉnh cho các game 2D đơn giản (ví dụ: Quiz, Đoán chữ) theo 3 định dạng: HTML/CSS/JS thuần, Dữ liệu JSON (cho React), và Code VBA (cho PowerPoint).

**Kiến trúc Cốt lõi:** Mô hình Client-Server.

  * **Client (Frontend):** Giao diện quản trị (Admin Panel) nơi người dùng ra lệnh.
  * **Server (Backend):** Bộ não điều phối, xử lý logic, gọi RAG, và gọi Gemini API.

### 2\. Sơ đồ Kiến trúc Cấp cao

\-\> Gemini API -\> Backend API -\> Admin Panel (Displaying Output)]

-----

### 3\. Cấu trúc Thư mục (Monorepo)

Đây là cấu trúc thư mục tổng quan của toàn bộ dự án.

```
/ai-game-generator
|
|--- 📁 /frontend-admin         (Giao diện Quản trị cho người dùng)
|    |--- /src
|    |    |--- /components      (Các UI component: PromptInput, ModeSelector, OutputViewer)
|    |    |--- /pages           (Trang chính: GeneratorPage.jsx)
|    |    |--- /services        (APIService.js - để gọi backend)
|    |    |--- App.jsx
|    |--- package.json         (Quản lý thư viện React, Vite...)
|
|--- 📁 /backend-api            (Máy chủ Điều phối - Bộ não)
|    |--- /src
|    |    |--- /controllers     (Xử lý các request: generator.controller.js)
|    |    |--- /services        (Nơi chứa logic nghiệp vụ chính)
|    |    |    |--- gemini.service.js    (Dịch vụ gọi API Gemini)
|    |    |    |--- rag.service.js       (Dịch vụ truy xuất RAG)
|    |    |    |--- generator.service.js (Dịch vụ "Điều phối Prompt" chính)
|    |    |--- /routes          (Định tuyến API: /api/v1/generate)
|    |    |--- /utils           (Các hàm hỗ trợ, ví dụ: validator.js)
|    |    |--- server.js        (Khởi chạy máy chủ Express/Fastify)
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
```

-----

### 4\. Giải thích các Thành phần

#### Frontend-Admin (Client)

  * **Mục đích:** Cung cấp giao diện duy nhất để người dùng tương tác.
  * **Luồng chính:**
    1.  Người dùng nhập **Prompt** (ví dụ: "Tạo game đoán chữ 10 câu chủ đề động vật").
    2.  Người dùng chọn **Game Type** (ví dụ: "Quiz", "Word Guess").
    3.  Người dùng chọn **Output Mode** (ví dụ: "HTML", "React (JSON)", "VBA").
    4.  Nhấn nút "Generate".
    5.  Gọi API đến `backend-api` và chờ kết quả.
    6.  Hiển thị kết quả (code hoặc JSON) trong một trình xem code (Code Viewer) cho người dùng copy.
  * **Công nghệ đề xuất:** React (Vite) hoặc Next.js, Ant Design (cho UI nhanh).

#### Backend-API (Server)

  * **Mục đích:** Là bộ não của hệ thống. Nhận yêu cầu từ Frontend và điều phối toàn bộ quá trình tạo code.
  * **Thành phần quan trọng nhất:** `generator.service.js` (Prompt Orchestrator).
  * **Luồng hoạt động:**
    1.  Nhận request (Prompt, GameType, OutputMode) từ `generator.controller.js`.
    2.  **Bước RAG:** Gọi `rag.service.js` để lấy "khuôn mẫu" cần thiết dựa trên OutputMode.
          * Nếu Mode = "React (JSON)": Lấy file `/knowledge-base/schemas/react_quiz.schema.json`.
          * Nếu Mode = "HTML": Lấy file `/knowledge-base/templates_code/html_quiz_template.txt`.
          * Nếu Mode = "VBA": Lấy file `/knowledge-base/templates_code/vba_quiz_template.txt`.
    3.  **Xây dựng Master Prompt:** Tạo một câu lệnh "siêu prompt" (Master Prompt) để gửi cho Gemini, bao gồm:
          * Prompt gốc của người dùng ("...10 câu chủ đề động vật...").
          * "Khuôn mẫu" RAG đã lấy (ví dụ: "Hãy tuân thủ nghiêm ngặt JSON schema sau..." hoặc "Dựa trên code VBA mẫu sau...").
          * Các chỉ thị bổ sung (ví dụ: "Chỉ trả về code, không giải thích gì thêm.").
    4.  **Gọi AI:** Gọi `gemini.service.js` với Master Prompt.
    5.  **Xử lý hậu kỳ:** Nhận phản hồi từ Gemini.
          * Nếu là JSON, xác thực (validate) xem có đúng schema không.
          * Nếu là Code, kiểm tra sơ bộ.
          * (Nếu Mode=VBA) Tự động đính kèm nội dung của `/knowledge-base/templates_code/vba_instructions.txt` vào kết quả trả về.
    6.  Trả kết quả (code hoặc JSON) về cho Frontend.

#### Knowledge-Base (RAG)

  * **Mục đích:** Đây là "bộ nhớ dài hạn" và "khuôn khổ" cho AI. Nó đảm bảo AI tạo ra code/dữ liệu nhất quán và đúng định dạng mà ứng dụng của bạn cần.
  * Đây **không phải** là một Vector Database phức tạp (cho dự án này), mà chỉ là một tập hợp các file "khuôn mẫu" (template) mà `rag.service.js` sẽ đọc.
  * **`schemas`:** Dùng để "ép" Gemini trả về JSON đúng cấu trúc 100%.
  * **`templates_code`:** Dùng để "mớm" code mẫu cho Gemini, giúp nó tạo ra code theo đúng phong cách và hàm (functions) mà bạn mong muốn.

#### Database (Tùy chọn)

  * **Mục đích:** Không bắt buộc cho chức năng cốt lõi, nhưng hữu ích để:
    1.  Quản lý người dùng (nếu bạn muốn).
    2.  Lưu lại lịch sử các lần "Generate" (Prompt History) để theo dõi và gỡ lỗi.
  * **Công nghệ đề xuất:** PostgreSQL.

-----

### 5\. Luồng Dữ liệu (Ví dụ cụ thể)

#### Kịch bản 1: Người dùng muốn Mode "React (JSON)"

1.  **Frontend:** Gửi `{ prompt: "10 câu hỏi bóng đá", mode: "REACT_JSON" }`.
2.  **Backend (GeneratorService):**
      * Gọi `RagService` lấy file `react_quiz.schema.json`.
      * Tạo Master Prompt: "Tạo 10 câu hỏi về bóng đá. **QUAN TRỌNG:** Phải trả lời bằng một mảng JSON duy nhất tuân thủ schema sau: `[nội dung file schema]`".
      * Gọi `GeminiService`.
      * Nhận JSON, xác thực, trả về cho Frontend.

#### Kịch bản 2: Người dùng muốn Mode "VBA"

1.  **Frontend:** Gửi `{ prompt: "5 câu đố vui", mode: "VBA" }`.
2.  **Backend (GeneratorService):**
      * Gọi `RagService` lấy file `vba_quiz_template.txt` (chứa code VBA mẫu) và `vba_instructions.txt` (hướng dẫn).
      * Tạo Master Prompt: "Dựa trên code VBA mẫu sau: `[nội dung code mẫu]`. Hãy tạo code VBA cho một module chứa 5 câu đố vui. Chỉ trả về code."
      * Gọi `GeminiService`.
      * Nhận code VBA (text) trả về.
      * Nối thêm text hướng dẫn: `[code VBA từ Gemini]` + `\n\n--- Hướng dẫn Cài đặt ---\n` + `[nội dung file instructions]`.
      * Trả về chuỗi text này cho Frontend.