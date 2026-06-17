# [TÊN DỰ ÁN] — Project Context for AI Agent

> Đọc file này trước khi bắt đầu bất kỳ task nào.
> Cập nhật lần cuối: [ngày]

---

## 1. DỰ ÁN LÀ GÌ

**Mô tả một câu:** [Mô tả ngắn gọn nhất có thể]

**Mục đích:** [Giải quyết vấn đề gì cho ai]

**Người dùng mục tiêu:** [Mô tả cụ thể]

**URL production:** [link web đang chạy nếu có]

**GitHub repo:** [link repo]

---

## 2. TECH STACK

- **Framework:** [vd: Next.js 16.x, App Router]
- **Language:** [vd: TypeScript]
- **Database & ORM:** [vd: Prisma + PostgreSQL (Supabase)]
- **Styling:** [vd: Tailwind CSS v4]
- **Deploy:** [vd: Vercel]
- **Auth:** [vd: JWT với jsonwebtoken + bcryptjs]

> ⚠️ QUAN TRỌNG: Đây là [tên framework] phiên bản [X].
> Trước khi viết code liên quan đến [Metadata API / Route Handlers / Server Components / ...],
> đọc tài liệu trong node_modules/[package]/dist/docs/ để tránh dùng API cũ.

---

## 3. CẤU TRÚC ROUTE

```
/                    [mô tả trang]
/[route-1]           [mô tả]
/[route-1]/[slug]    [mô tả]
/[route-2]           [mô tả]
/admin               [khu vực quản trị — cần auth]
```

---

## 4. DATABASE MODELS (tóm tắt)

**[ModelName]:** [field chính và mối quan hệ]
**[ModelName]:** [field chính và mối quan hệ]

> Xem schema đầy đủ tại prisma/schema.prisma

---

## 5. NHẬN DIỆN THƯƠNG HIỆU

- **Màu sắc chính:** [vd: Cream #FCFBF9, Olive #14532D, Sand #F3EFE9]
- **Font:** [vd: Serif cho heading, Sans-serif cho body]
- **Tone/cảm giác:** [vd: Mộc mạc, ấm, tối giản, không hoa mỹ]
- **Tông giọng văn:** [vd: Ngôi thứ nhất, thật, không bán hàng]

---

## 6. QUY TẮC AI PHẢI TUÂN THỦ

### Được làm:
- [liệt kê những gì AI được tự quyết]

### KHÔNG được làm:
- [ ] Thay đổi palette màu
- [ ] Đổi cấu trúc route chính
- [ ] Sửa logic database khi không được yêu cầu
- [ ] [thêm quy tắc riêng của bạn]

### Trước mỗi task kỹ thuật:
- Đọc file liên quan trong node_modules trước khi viết code mới
- Kiểm tra xem pattern tương tự đã tồn tại trong codebase chưa
- Báo cáo nếu task ảnh hưởng đến nhiều hơn 3 file

---

## 7. BIẾN MÔI TRƯỜNG CẦN CÓ

```
DATABASE_URL=           # PostgreSQL connection string
DIRECT_URL=             # Direct connection (migrations)
JWT_SECRET=             # Secret cho auth
NEXT_PUBLIC_BASE_URL=   # URL production
# [Thêm biến khác]
```

---

## 8. LỆNH HAY DÙNG

```bash
npm run dev          # Chạy local
npm run build        # Build production (chạy trước khi commit)
npx prisma studio    # Xem database visual
npx prisma migrate dev --name [tên]   # Migration mới
```
