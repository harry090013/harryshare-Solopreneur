# [TÊN DỰ ÁN] — Project Context for AI Agent

> 📌 Đọc file này TRƯỚC khi bắt đầu bất kỳ task nào.  
> 🗓 Cập nhật lần cuối: [ngày/tháng/năm]  
> 👤 Tác giả: [Tên bạn]

---

## 1. DỰ ÁN LÀ GÌ

**Mô tả một câu:**
> [Mô tả ngắn gọn nhất có thể — ai dùng, để làm gì]

**Mục đích:**
> [Giải quyết vấn đề gì cho ai]

**Người dùng mục tiêu:**
> [Mô tả cụ thể — nghề nghiệp, vấn đề đang gặp, mục tiêu]

**URL production:** `[link web đang chạy nếu có]`  
**GitHub repo:** `[link repo]`  
**Trạng thái:** `[Đang phát triển / Beta / Live]`

---

## 2. TECH STACK

| Layer | Công nghệ | Phiên bản |
|-------|-----------|-----------|
| Framework | [vd: Next.js] | [vd: 16.x] |
| Language | [vd: TypeScript] | [vd: 5.x] |
| Database | [vd: PostgreSQL] | [vd: 15] |
| ORM | [vd: Prisma] | [vd: 5.x] |
| Styling | [vd: Tailwind CSS] | [vd: v4] |
| Auth | [vd: JWT (jsonwebtoken + bcryptjs)] | — |
| Deploy | [vd: Vercel] | — |
| Hosting DB | [vd: Supabase] | — |

> ⚠️ **QUAN TRỌNG cho AI:** Đây là [tên framework] phiên bản [X].  
> Trước khi viết code liên quan đến các API mới (Metadata, Route Handlers,  
> Server/Client Components, async params...), hãy đọc tài liệu trong  
> `node_modules/[package]/dist/docs/` để tránh dùng API đã deprecated.

---

## 3. CẤU TRÚC ROUTE

```
/                          [Trang chủ — mô tả ngắn]
/[route-1]                 [mô tả trang]
/[route-1]/[slug]          [trang động — mô tả]
/[route-2]                 [mô tả trang]
/[route-2]/[slug]          [trang động — mô tả]
/admin                     [Khu vực quản trị — yêu cầu auth JWT]
/admin/login               [Trang đăng nhập]
/api/[route]               [API endpoint — mô tả]
```

> 💡 Khi tạo route mới, đặt theo cấu trúc trên và cập nhật bảng này.

---

## 4. DATABASE MODELS (Tóm tắt)

> Xem schema đầy đủ tại `prisma/schema.prisma`

**[ModelName]**
- Field chính: `id`, `title`, `slug`, `createdAt`, `updatedAt`
- Quan hệ: hasMany `[RelatedModel]`, belongsTo `[ParentModel]`
- Lưu ý: [điều gì đặc biệt cần biết]

**[ModelName]**
- Field chính: `id`, `email`, `content`, `status`
- Quan hệ: [mô tả]
- Lưu ý: [điều gì đặc biệt]

> ➕ Khi thêm model mới: chạy `npx prisma migrate dev --name [tên]` và cập nhật bảng này.

---

## 5. NHẬN DIỆN THƯƠNG HIỆU

```css
/* Màu sắc chính */
--color-primary:    [hex]  /* màu chính */
--color-secondary:  [hex]  /* màu phụ */
--color-background: [hex]  /* nền trang */
--color-surface:    [hex]  /* nền card/component */
--color-text:       [hex]  /* màu chữ chính */
--color-accent:     [hex]  /* nhấn mạnh */
```

**Font:** [vd: Serif cho heading (Merriweather), Sans-serif cho body (Inter)]  
**Tone/cảm giác:** [vd: Mộc mạc, ấm, tối giản — không hoa mỹ, không rối mắt]  
**Tông giọng nội dung:** [vd: Ngôi thứ nhất, thật, không bán hàng sớm]

---

## 6. QUY TẮC AI PHẢI TUÂN THỦ

### ✅ Được làm:
- Thêm component mới theo đúng style hiện có
- Sửa bug và tối ưu code theo pattern đang dùng
- Tạo migration Prisma khi cần thêm field/model
- Đề xuất cải thiện (nhưng giải thích rõ lý do)

### ❌ KHÔNG được làm:
- [ ] Thay đổi palette màu chính
- [ ] Đổi cấu trúc route đã có
- [ ] Sửa logic database khi không được yêu cầu
- [ ] Tự ý cài thêm thư viện mới (hỏi trước)
- [ ] Commit/push khi không được yêu cầu rõ ràng
- [ ] [Thêm quy tắc riêng của bạn]

### 🔍 Trước mỗi task kỹ thuật:
1. Đọc file liên quan trước khi viết code mới
2. Kiểm tra xem pattern tương tự đã tồn tại trong codebase chưa
3. Báo cáo nếu task ảnh hưởng đến nhiều hơn 3 file
4. Chạy `npm run build` sau khi xong — báo cáo PASS/FAIL

---

## 7. BIẾN MÔI TRƯỜNG CẦN CÓ

```env
# Database
DATABASE_URL=           # PostgreSQL connection (pooled, port 6543)
DIRECT_URL=             # Direct connection cho migration (port 5432)

# Auth
JWT_SECRET=             # Secret cho JWT token

# App
NEXT_PUBLIC_BASE_URL=   # URL production (vd: https://yourdomain.vn)

# [Thêm biến khác nếu có]
# API_KEY=              # Mô tả dùng để làm gì
```

> ⚠️ KHÔNG commit file `.env` thật. Chỉ cập nhật `.env.example` với tên biến (không có giá trị).

---

## 8. LỆNH HAY DÙNG

```bash
# Phát triển
npm run dev              # Chạy local development server

# Build & Deploy
npm run build            # Build production (chạy trước khi commit quan trọng)
npm run lint             # Kiểm tra lỗi code style

# Database
npx prisma studio        # Xem và chỉnh sửa data visual
npx prisma migrate dev --name [ten_migration]   # Tạo migration mới
npx prisma generate      # Regenerate Prisma client
npx prisma db push       # Push schema changes (không tạo migration file)

# Debug
npm run build 2>&1 | head -50   # Xem lỗi build
```

---

## 9. GHI CHÚ THÊM (Tùy chọn)

### Các quyết định kiến trúc quan trọng:
- [Tại sao chọn X thay vì Y — giải thích ngắn gọn để AI không tự thay đổi]
- [vd: Dùng JWT thay vì NextAuth vì cần custom flow đơn giản hơn]

### Những thứ đang TODO:
- [ ] [Feature/fix đang cần làm]
- [ ] [Feature/fix đang cần làm]

### Known issues:
- [Bug hoặc limitation đang biết — để AI không "sửa" nhầm]

---

## 10. CÁCH DÙNG FILE NÀY VỚI AI

```
Cách đơn giản nhất:
1. Mở cuộc trò chuyện mới với AI agent
2. Paste: "Đọc file context sau trước khi làm task:"
3. Paste toàn bộ nội dung file này
4. Sau đó mô tả task cần làm

Hoặc với Antigravity/Claude Code:
- Đặt file này ở root repo với tên AGENTS.md hoặc CLAUDE.md
- Agent sẽ tự động đọc trước khi bắt đầu
```

---

*Template này được tạo bởi HarryShare — harryshare.vn*  
*Tài nguyên miễn phí tại harryshare.vn/du-an-tai-nguyen*  
*v1 — Tháng 6/2026*
