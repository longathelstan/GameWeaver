**MẪU THÔNG TIN GỬI BÀI DỰ THI VÒNG 1**
**CUỘC THI AI YOUNG GURU**
**(Dành cho các đội thi)**

**THÔNG TIN ĐỘI THI:**
*   **Tên đội thi:** [Điền tên đội thi của bạn]
*   **Họ tên các thành viên đội thi:** [Điền họ và tên các thành viên]
*   **Tên sản phẩm:** GameWeaver - Nền tảng AI tự động hóa xây dựng các trò chơi hỗ trợ dạy học.
*   **Số điện thoại liên hệ (đại diện):** [Điền SĐT]
*   **Email (đại diện):** [Điền Email]

**THÔNG TIN BÀI DỰ THI:**

**1. Hình thức nộp bài:** File tài liệu (PDF) mô tả sản phẩm. 
*Tên file lưu theo cú pháp:* [Tên đội] + GameWeaver.

**2. Cấu trúc tài liệu nộp:**

### **Phần 1: Mô tả vấn đề**

*   **Bối cảnh thực tiễn:** 
    Trong bối cảnh chuyển đổi số giáo dục mạnh mẽ, việc triển khai Chương trình Giáo dục phổ thông 2018 đặt ra yêu cầu bức thiết về việc thay đổi phương pháp dạy học. Việc chuyển từ truyền thụ kiến thức một chiều sang phát huy tính tích cực, chủ động của học sinh là mục tiêu trọng tâm. Trong đó, phương pháp "Trò chơi hóa" (Gamification) đã được chứng minh là công cụ giáo dục hữu hiệu, kích thích tối đa sự tò mò, tương tác và khả năng tiếp thu tri thức trực quan của người học. Tuy nhiên, việc ứng dụng thành công Gamification vào trong từng tiết học vẫn là một rào cản lớn đối với hầu hết giáo viên.

*   **Vấn đề đặt ra:** 
    Một trở ngại cốt lõi hiện nay là việc thiết kế các trò chơi giáo dục hấp dẫn lại đòi hỏi quá nhiều chuyên môn và thời gian của nhà giáo. 
    Thứ nhất, các công cụ tạo bài tập truyền thống (như Kahoot!, Quizizz) chỉ dừng lại ở dạng câu hỏi trắc nghiệm (Multiple-choice quiz) nhàm chán, thiếu sự đa dạng về gameplay (như game nhập vai 2D, giải đố logic 3D) và yêu cầu giáo viên phải nhập cấu hình dữ liệu thủ công, mất thời gian.
    Thứ hai, dù sự bùng nổ của các mô hình AI ngôn ngữ lớn (LLM) như ChatGPT hay Gemini đã hỗ trợ soạn giáo án, nhưng chúng lại hay gặp tình trạng "ảo giác" (nhầm lẫn kiến thức), không bám sát hoàn toàn với nội dung chuẩn chỉnh của Sách Giáo Khoa (SGK) do Bộ Giáo dục ban hành. Hơn nữa, những LLM này thường chỉ trả về văn bản, không thể gói gọn thành một ứng dụng trò chơi tương tác ngay lập tức cho người học.

*   **Tầm quan trọng:** 
    Chính từ thực tiễn trên, việc phát triển một nền tảng tạo trò chơi chuyên biệt, có khả năng "đọc - hiểu" chính xác bộ dữ liệu SGK, tự động chuyển hóa kiến thức đó thành các cơ chế logic và sinh ra **mã nguồn trò chơi hoàn chỉnh** (code generation) mà không yêu cầu giáo viên phải biết lập trình, mang một ý nghĩa đặc biệt quan trọng. Nó giải phóng hoàn toàn gánh nặng công nghệ của nhà giáo, cho phép họ tập trung vào chuyên môn giảng dạy cốt lõi, đồng thời mở ra cánh cửa đưa công nghệ tương tác sinh động đến mọi lớp học.

---

### **Phần 2: Cách thức tiếp cận**

*   **Ý tưởng giải pháp:** 
    Chúng em phát triển dự án **GameWeaver** – một Admin Panel toàn diện áp dụng Trí tuệ nhân tạo để tự động hóa 100% vòng đời tạo ra một Game giáo dục. Dựa trên dữ liệu đầu vào là SGK, GameWeaver sẽ thực hiện bóc tách ngữ nghĩa, đề xuất bộ câu hỏi, gợi ý thể loại Game và cuối cùng tạo ra một bản React Single-File Component (Mã nguồn Web) của trò chơi để có thể chơi ngay trên trình duyệt mà không cần cài đặt. Để kiểm soát AI, hệ thống áp dụng song song cơ chế RAG để neo giữ kiến thức và mô hình Human-in-the-loop (Con người trong vòng lặp) nhằm đảm bảo hệ quy chiếu sư phạm vững chắc.

*   **Công nghệ & Công cụ AI sử dụng (Tech Stack):** 
    Dự án được triển khai trên kiến trúc Client-Server hiện đại (Monorepo), tận dụng sức mạnh của những công nghệ lõi tiên tiến nhất:
    *   **Công nghệ AI & LLM:** 
        *   Sử dụng lõi xử lý AI **Google Gemini API** (`@google/generative-ai`) xử lý các tác vụ phức tạp: sinh câu hỏi, thiết kế logic trò chơi, sinh toàn bộ Source Code tự động.
        *   Sử dụng Framework **LangChain.js** làm bộ điều phối orchestrator cho luồng kiến trúc RAG, xử lý chia nhỏ (chunking) ngôn ngữ tự nhiên từ dữ liệu.
        *   Cơ sở dữ liệu Vector Store tích hợp để lưu trữ cấu trúc Embedding của nội dung sách giáo khoa phục vụ truy xuất.
    *   **Frontend (Giao diện người dùng):** Phát triển trên nền tảng **Next.js (App Router)** và **TypeScript**. Sử dụng **Shadcn UI**, **Tailwind CSS** xây dựng giao diện; **Zustand** quản lý State; **Monaco Editor** và **Sandpack** để làm môi trường ảo biên dịch mã nguồn Game hiển thị trực tiếp (Live Preview).
    *   **Backend & Database:** Máy chủ **Node.js, Express.js**. Quản trị dữ liệu lịch sử game/người dùng bằng **PostgreSQL** kết hợp ORM **Prisma**.

*   **Quy trình thực hiện (Luồng Work-flow khép kín 5 bước):** 
    1.  **Nhập liệu và Trích xuất (Ingestion & RAG Mapping):** Người dùng nhập file tài liệu SGK dạng chuẩn (JSON/Text). Hệ thống gọi API Ingest-Data, dùng LangChain cắt nội dung thành các chunk, nhúng vector và lưu vào Vector Store. Dữ liệu gốc được AI tóm tắt thành một Sơ đồ Cây Kiến Thức (Map Content).
    2.  **Lựa chọn Khung tham chiếu:** Từ cây kiến thức hiển thị dạng Checkbox Tree trên giao diện, Giáo viên tùy chọn Phạm vi Bài học / Chương cụ thể muốn kiểm tra.
    3.  **Tự động tạo và Kiểm duyệt tương tác (Question Generation & Human-in-loop):** AI (Gemini) thực hiện truy vấn RAG lấy chính xác kiến thức để sinh ra $N$ câu hỏi tương tác. Lúc này, người dùng sẽ kiểm duyệt, có thể chỉnh sửa thủ công (Edit), hoặc yêu cầu AI sinh lại từng câu hỏi (Regenerate) đến khi hoàn toàn hài lòng (Accept & Next).
    4.  **Thiết kế Logic Game (Game Suggestion vs Custom):** 
        Dựa trên bộ câu hỏi đã chốt, AI sẽ đề xuất khoảng 3 hình thức game phù hợp nhất (Ví dụ: Game tìm cặp thẻ bài, Game Giải mã Mê cung, Pháo thủ lượng giác). Người dùng có thể chọn thẻ Suggestion từ AI hoặc dùng chế độ Custom (viết Prompt tự định nghĩa luật chơi mới như "Hãy làm game Mario nhảy vượt rào lấy đáp án").
    5.  **Sinh Mã Nguồn và Triển Khai (Code Generation, Live Preview & Refine):**
        AI sử dụng kỹ thuật Prompt Engineering nội bộ chuyên sâu để trả về một chuỗi mã React component hoàn chỉnh tích hợp sẵn Tailwind CSS (Single File Component).
        Giao diện Frontend ngay lập tức hiển thị trò chơi này qua khung Iframe (Sandpack) cho giáo viên chơi thử. Giáo viên có thể dùng khung Chat phụ để tinh chỉnh (ví dụ lệnh "Hãy làm màu nền tối lại", "Tăng kích thước xe tăng"). Cuối cùng, người dùng nhấn "Download" mã nguồn `.tsx` hoặc nén thành `.html` để bung ra cho học sinh chơi ở bất kỳ đâu.

---

### **Phần 3: Mô tả sản phẩm**

*   **Hình thức thể hiện:** 
    Sản phẩm phần mềm triển khai dưới dạng một Hệ thống Ứng dụng Web (Web Application Tool/Admin Panel). Người dùng cấp giáo viên sẽ thao tác trên giao diện Dashboard điều khiển trực quan. Sản phẩm đầu ra (Kết quả sinh ra) là một Trò chơi chạy độc lập trên nền tảng Web (HTML/JS/React), có tính phản hồi tự động tương thích (Responsive) trên cả màn hình máy tính bảng cài đặt trong phòng học và smartphone của học sinh.

*   **Nội dung & Công năng chính:**
    1.  **Mô đun Ingest Data & Mapping:** Tự động nuốt dữ liệu hệ thống sách giáo khoa, hỗ trợ tra cứu chéo không lo sai lệch chương trình.
    2.  **Mô đun Human-in-the-loop Question Bank:** Bảng điều khiển quản lý ngân hàng câu hỏi nhúng AI, tạo không gian đồng sáng tạo giữa Machine và Human chuyên gia sư phạm.
    3.  **Mô đun AI Code Generator:** Cỗ máy tạo giao diện đồ họa. Nơi mọi prompt văn bản được đúc thành các nút bấm, mô hình vật lý và hoạt ảnh chuyển động trong game mà hoàn toàn vắng bóng lập trình viên thực quản.
    4.  **Mô đun Code Editor & Sandbox:** Trình biên tập trực tuyến ngay trên web, cho phép xem code của game (Monaco) và chạy thử game thời gian thực, có khả năng can thiệp gỡ rối (Debug) bằng ngôn ngữ tự nhiên. 
    5.  **Quản trị tài khoản:** Hệ thống Database bảo mật kết nối Prisma phục vụ lịch sử người dùng, chia sẻ template trò chơi hay giữa các trường học.

*   **Cách thức sử dụng/Vận hành áp dụng vào thực tế:** 
    **Kịch bản lớp học:** Một thầy giáo lên lớp môn Toán 10 Bài "Vector". Hôm trước ở nhà, thầy vào GameWeaver, chọn tích ô "Chương IV - Bài 1: Khái niệm Vector". Cấu hình hệ thống sinh 5 câu hỏi nhanh, chọn đề xuất Game "Vector Gate Runner". Hệ thống đóng lại file `game_runner.html`.
    Hôm sau trên màn hình máy chiếu hoặc qua máy tính bảng mượn của trường, thầy gửi đường link HTML đó cho học sinh. Học sinh thi nhau thao tác điều khiển con tàu trên màn hình lướt qua các cổng Vector hiển thị trên giao diện 3D thu nhỏ. Hệ thống tính điểm và hiển thị bảng xếp hạng cuối cùng làm bùng nổ không khí lớp học. Toàn bộ thời gian chuẩn bị của thầy giáo chỉ gói gọn dưới 10 phút.

*   **Ví dụ Game sinh ra thực tế trên nền tảng:**
    *   *Sailboat Physics Quiz, 2D Arcade Quiz Blitz, Pháo thủ lượng giác 3D, Vector Gate Runner, Vệ binh Vector, Thuyền Trí Tuệ, 3D Vector Navigator, ConceptNavigator...*

---

### **Phần 4: Hiệu quả mang lại**

*   **Giá trị thực tế thụ hưởng:** 
    Khảo sát đối chiếu trên nhóm trải nghiệm với giáo viên THPT thực tế chứng minh nền tảng GameWeaver có năng lực hoạt động ổn định:
    *   **Thời gian:** Công đoạn thiết kế Game giảm 70 - 80% thời lượng (thông thường để làm 1 module Flash/Web Game tương tự, nhóm giáo viên tin học phải mất 3 ngày, nay chỉ còn dưới 10 - 20 phút cho một cấu hình).
    *   **Phản hồi:** 82.5% người trải nghiệm đề xuất đưa phần mềm vào ứng dụng trong các buổi Ngoại khóa Toán học và sinh hoạt chuyên đề. Giáo viên tiết kiệm sức lực, học sinh gia tăng đáng kể tỷ lệ chú ý (Attention Rate).
    
*   **Phạm vi ảnh hưởng:** 
    Không bó hẹp ở một chuyên môn. Khả năng "tiêu hóa" văn bản vô hạn nhờ RAG cho phép nền tảng nhân rộng tức thời với các môn khoa học Tự nhiên và Xã hội khác. Mã nguồn Web-based là chuẩn định dạng tương thích cao nhất trên mọi hệ sinh thái thiết bị, giúp sản phẩm có thể đi đến cả vùng sâu vùng xa bằng cách tải bản game ngoại tuyến (Offline Export).

*   **Tính mới và tính sáng tạo nổi bật so với giải pháp cũ:**
    1.  **Chấm dứt kỷ nguyên nhập liệu thủ công:** Khác với Kahoot! phải gõ phím từ word nhập câu hỏi, nền tảng AI nuốt trọn dữ liệu sách giáo khoa.
    2.  **Khắc chế ảo giác AI bằng Kiến trúc RAG chuẩn:** Nhược điểm của Gemini được khống chế bằng cơ sở dữ liệu Vector SGK, cam kết 100% nội dung game chuẩn hóa Bộ Trưởng GD&ĐT.
    3.  **Bước nhảy vọt "From Text to Interactive Application" (Từ Chữ sang Ứng dụng):** Đỉnh cao của dự án không nằm ở việc bảo AI viết ra đoạn text mô tả trò chơi, mà nằm ở hệ thống lõi buộc AI xuất ra mã nguồn React JS có thể hoạt động được ngay lập tức theo phong cách trò chơi Single-File Component. Đây là tính mới nhất biến giáo viên từ "người soạn bài" thành "nhà sản xuất game độc lập".

---

### **Phần 5: Phụ lục**

*   **Link truy cập Demo Nền tảng (Web Client Frontend):** [https://gameweaver.lowng.me/](https://gameweaver.lowng.me/)
*   **Link kho mã nguồn mở của Hệ thống (Github):** [https://github.com/longathelstan/GameWeaver](https://github.com/longathelstan/GameWeaver)
*   **Link video giới thiệu sản phẩm (Pitching/Demo):** [Bạn cần chèn link YouTube/Drive video demo vào đây nếu có]
