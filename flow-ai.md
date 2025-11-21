### Tech Stack Suggestion
*   **Frontend:** Next.js (App Router), TypeScript, Shadcn UI (Components), Tailwind CSS, Lucide React (Icons), Zustand (State Management), Monaco Editor (để hiển thị/sửa code game).
*   **Backend:** Node.js, Express.js, TypeScript.
*   **Database:** PostgreSQL (lưu user, history, settings) + Prisma ORM.
*   **AI & RAG:**
    *   **LLM:** Google Gemini API (via Google Generative AI SDK).
    *   **Framework:** LangChain.js (để xử lý RAG flow).
    *   **Vector Store:** Supabase `pgvector` hoặc Pinecone (để lưu index dữ liệu SGK JSON).
*   **DevOps:** Docker (optional).

---

### Detailed Todo List 

#### Phase 1: Project Setup & Infrastructure
- [x] **Initial Setup:** Khởi tạo Monorepo hoặc cấu trúc thư mục tách biệt: `client` (Next.js) và `server` (Express). Cài đặt TypeScript cho cả hai.
- [ ] **UI Library:** Cài đặt Shadcn UI cho `client`. Khởi tạo các component cơ bản: Button, Input, Card, Checkbox, Dialog, ScrollArea, Textarea, Tabs.
- [ ] **Database Setup:** Cài đặt Prisma và kết nối với PostgreSQL. Tạo schema `User`, `Project`, `TextbookData` (lưu raw JSON), và `QuestionBank`.
- [ ] **AI Configuration:** Cài đặt `@google/generative-ai` và `langchain` trong `server`. Tạo file config để load `GEMINI_API_KEY`.

#### Phase 2: Backend - RAG & Data Processing (Core)
- [ ] **Endpoint `/api/ingest-data`:** Viết API nhận file JSON (SGK). Sử dụng LangChain để chia nhỏ (chunk) dữ liệu văn bản từ JSON và lưu vào Vector Store (hoặc lưu text thuần nếu dữ liệu nhỏ) để phục vụ RAG.
- [ ] **Endpoint `/api/map-content`:** Viết API sử dụng Gemini để phân tích file JSON đã upload. Trả về cấu trúc cây: `Chương -> Bài học -> Trang` để frontend hiển thị cây thư mục lựa chọn.
- [ ] **RAG Utility Function:** Viết hàm `retrieveContext(topic)`: Tìm kiếm dữ liệu liên quan trong vector store dựa trên nội dung giáo viên chọn.

#### Phase 3: Backend - Question Generation & Game Logic
- [ ] **Endpoint `/api/generate-questions`:**
    - Input: Danh sách bài học đã chọn, số lượng câu hỏi (n).
    - Process: Gọi Gemini với context (RAG) để tạo n câu hỏi trắc nghiệm/tự luận dạng JSON.
    - Output: JSON Array các câu hỏi.
- [ ] **Endpoint `/api/suggest-game`:**
    - Input: Danh sách câu hỏi đã chốt.
    - Process: Yêu cầu Gemini phân tích câu hỏi và đề xuất 3 loại game phù hợp (ví dụ: Quiz, Memory Card, Drag & Drop) kèm lý do.
- [ ] **Endpoint `/api/generate-game-code`:**
    - Input: Loại game (Suggest hoặc Custom), Danh sách câu hỏi.
    - Prompt Engineering: Tạo prompt yêu cầu Gemini viết một component React hoàn chỉnh (Single File Component), sử dụng Tailwind CSS, logic game đầy đủ, không cần import ngoài (trừ React).
    - Output: Chuỗi string chứa Source code.

#### Phase 4: Frontend - Step-by-Step UI Implementation
- [ ] **Global State:** Cài đặt Zustand store để lưu trữ: `currentStep`, `selectedTopics`, `generatedQuestions`, `gameConfig`, `generatedCode`.
- [ ] **Step 1: Input & Mapping UI:**
    - Tạo giao diện upload file hoặc chọn nguồn dữ liệu.
    - Hiển thị danh sách Bài học/Trang dưới dạng Checkbox Tree (dữ liệu từ API map-content).
- [ ] **Step 2: Question Management (Human-in-the-loop):**
    - Tạo giao diện hiển thị danh sách câu hỏi AI tạo ra.
    - Cho phép User edit text trực tiếp (Input field) hoặc nút "Regenerate" cho từng câu.
    - Nút "Accept & Next" để chốt dữ liệu.
- [ ] **Step 3: Game Selection:**
    - Tạo Tabs component: `[AI Suggestion]` và `[Custom Request]`.
    - Tab Suggestion: Hiển thị các Card game được đề xuất.
    - Tab Custom: Textarea để user nhập prompt (vd: "Làm game đào vàng").
- [ ] **Step 4: Code Generation & Preview:**
    - Hiển thị Loading State khi AI đang viết code.
    - Sử dụng `Sandpack` (hoặc `iframe`) để render trực tiếp code React mà AI vừa tạo (Live Preview).
    - Bên cạnh là khung Editor (Monaco Editor) để user xem/sửa code nếu muốn.
- [ ] **Step 5: Refine & Download:**
    - Thêm khung chat nhỏ "Refine Game": User nhập yêu cầu sửa (vd: "Đổi màu nền thành xanh"), gửi request lại API generate code.
    - Nút "Download": Tải file `.tsx` hoặc `.zip` về máy.
