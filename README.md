# 🌿 HarryShare Clone - Admin & Blog Panel

HarryShare Clone là một nền tảng quản trị và chia sẻ ghi chép, bài viết, tài nguyên dự án thế hệ mới. Ứng dụng sở hữu ngôn ngữ thiết kế **Cream-Vintage (Retro Modern)** cao cấp kết hợp hiệu ứng glassmorphic, hệ thống giọng đọc AI đa ngôn ngữ song ngữ thông minh, cùng trang quản trị (Admin Panel) trực quan, bảo mật.

---

## 🛠️ Công Nghệ Sử Dụng

- **Core**: Next.js 16.2 (App Router, Turbopack) & React 19
- **Style**: Tailwind CSS v4 & Custom CSS micro-animations
- **Database**: PostgreSQL & Prisma ORM
- **Authentication**: JWT & Cookie-based sessions
- **Deployment**: Docker, Docker Compose, Multi-stage Dockerfile

---

## 📋 Biến Môi Trường (Environment Variables)

Sao chép file `.env.example` thành `.env` và thiết lập các biến môi trường:

```bash
cp .env.example .env
```

Nội dung cấu hình mẫu trong `.env`:

```ini
# Đường dẫn kết nối database (Sử dụng localhost khi chạy lệnh từ máy host, và 'db' khi chạy hoàn toàn trong Docker)
DATABASE_URL="postgresql://harry:harryshare_secret@localhost:5439/harryshare_db?schema=public"

# Khóa bí mật mã hóa phiên đăng nhập JWT
JWT_SECRET="harryshare_super_secret_jwt_key_2026"

# Đường dẫn URL của trang web (Để phục vụ cho các liên kết chia sẻ)
NEXT_PUBLIC_BASE_URL="http://localhost:3008"

# API Key của Google Gemini (Tùy chọn - Dùng cho Chat Widget AI, nếu trống sẽ tự động fallback về AI Engine nội bộ)
GEMINI_API_KEY=""
```

---

## 🚀 Hướng Dẫn Deploy Với Docker (Khuyên Dùng)

Cách nhanh nhất để khởi chạy toàn bộ ứng dụng (gồm trang web và cơ sở dữ liệu PostgreSQL) là sử dụng Docker Compose.

### 1. Khởi chạy Stack

Chạy lệnh sau tại thư mục gốc để Docker tự động tải ảnh, build dự án Next.js tối ưu và khởi động các container:

```bash
docker compose up -d --build
```

### 2. Kiểm tra trạng thái

```bash
docker compose ps
```

Ứng dụng sẽ hoạt động tại:

- **Web App**: [http://localhost:3008](http://localhost:3008)
- **Database Port (đối ngoại)**: `5439` (Port kết nối từ máy host vào PostgreSQL)

### 3. Nạp Cơ Sở Dữ Liệu (Migrate & Seed) Vào Docker

Khi chạy Docker lần đầu tiên, cơ sở dữ liệu sẽ trống. Bạn cần đồng bộ cấu trúc bảng Prisma và nạp dữ liệu Seed đã được xuất bản sẵn:

```bash
# Thực hiện đồng bộ cấu trúc bảng và tạo các quan hệ trong Docker
docker compose exec web npx prisma db push

# Chạy seed nạp dữ liệu ban đầu (Tài khoản admin, 4 chủ đề chính, 4 bài viết mẫu chất lượng cao, các preset icons)
docker compose exec web npx prisma db seed
```

---

## 💻 Hướng Dẫn Chạy Môi Trường Local (Không Dùng Docker Cho Web)

Nếu bạn muốn chạy phát triển ứng dụng Next.js trực tiếp trên máy host và chỉ sử dụng Docker làm Database:

### 1. Khởi động chỉ PostgreSQL bằng Docker

```bash
docker compose up -d db
```

### 2. Cài đặt các package phía host

```bash
npm install
```

### 3. Đồng bộ DB và Nạp Seed

```bash
npx prisma db push
npx prisma db seed
```

### 4. Khởi chạy Development Server

```bash
npm run dev
```

Trang web sẽ hoạt động ở chế độ hot-reload tại: [http://localhost:3000](http://localhost:3000)

---

## 🔑 Thông Tin Đăng Nhập Quản Trị (Admin Panel)

Truy cập đường dẫn quản trị: [http://localhost:3008/admin](http://localhost:3008/admin) (Hoặc `:3000/admin` nếu chạy local)

Thông tin tài khoản mặc định đã được cấu hình sẵn trong bộ dữ liệu Seed:

- **Tài khoản (Username)**: `harry`
- **Mật khẩu (Password)**: `harryshare2026`

_(Vui lòng đổi mật khẩu hoặc cập nhật tài khoản quản trị sau khi đăng nhập để đảm bảo tính an toàn bảo mật)._

---

## 📂 Quản Lý Cơ Sở Dữ Liệu Với Prisma Studio

Bạn có thể quản lý, chỉnh sửa, thêm xóa trực tiếp toàn bộ dữ liệu (bài viết, lượt liên hệ, ảnh đã upload, danh sách đăng ký) qua giao diện trực quan bằng Prisma Studio:

```bash
npx prisma studio
```

Truy cập giao diện quản trị cơ sở dữ liệu tại: [http://localhost:5555](http://localhost:5555)

---

## 🛠️ Một Số Lệnh Hữu Ích Khi Bảo Trì

- **Xem log hệ thống**: `docker compose logs -f web`
- **Dừng toàn bộ hệ thống**: `docker compose down`
- **Xóa sạch dữ liệu database (Reset)**: `docker compose down -v` (Lưu ý: Sẽ xóa sạch volume chứa data của Postgres)
- **Tự động format code**: `npm run lint`


Mẹo: Sau khi đã chạy xong hai lệnh trên và thấy báo thành công, bạn có thể đổi lại DATABASE_URL trong file .env cục bộ về lại database local (nếu muốn tiếp tục dev offline) để tránh ghi đè nhầm dữ liệu thật khi chạy dev