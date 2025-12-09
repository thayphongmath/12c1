# Hướng dẫn Setup Vercel Authentication

## Tổng quan
Password đã được chuyển sang sử dụng Vercel Serverless Functions và Environment Variables để bảo mật tốt hơn. Hash của password không còn xuất hiện trong source code.

## Các bước setup

### 1. Thêm Environment Variable trong Vercel

1. Đăng nhập vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project của bạn
3. Vào **Settings** > **Environment Variables**
4. Thêm biến mới:
   - **Name**: `AUTH_PASSWORD_HASH`
   - **Value**: `8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92` (hash của '123456')
   - Chọn môi trường: **Production**, **Preview**, **Development** (nếu cần test local)

### 2. Tạo hash cho password mới (nếu cần đổi password)

Chạy lệnh sau trong terminal:

```bash
node -e "const crypto=require('crypto'); console.log(crypto.createHash('sha256').update('PASSWORD_MỚI').digest('hex'));"
```

Hoặc sử dụng online tool: https://emn178.github.io/online-tools/sha256.html

### 3. Cấu trúc file

```
du an Web/
├── api/
│   └── verify-password.js    # Vercel Serverless Function
├── index.html                 # Frontend (đã được cập nhật)
└── VERCEL_AUTH_SETUP.md      # File hướng dẫn này
```

### 4. Deploy lên Vercel

1. Push code lên Git repository (GitHub, GitLab, Bitbucket)
2. Kết nối repository với Vercel
3. Vercel sẽ tự động detect và deploy:
   - File `index.html` → Static site
   - Folder `api/` → Serverless Functions

### 5. Test

Sau khi deploy, test bằng cách:
1. Mở trang web
2. Click vào link được bảo vệ
3. Nhập password: `123456`
4. Nếu đúng, sẽ mở link được bảo vệ

## Lợi ích

✅ **Bảo mật cao**: Hash không còn trong source code  
✅ **Dễ quản lý**: Đổi password chỉ cần thay đổi Environment Variable  
✅ **Không cần rebuild**: Thay đổi password không cần deploy lại code  
✅ **Server-side validation**: Password được kiểm tra ở server, không thể bypass bằng cách sửa code client

## Troubleshooting

### Lỗi: "Server configuration error"
- Kiểm tra xem đã thêm Environment Variable `AUTH_PASSWORD_HASH` chưa
- Đảm bảo giá trị hash đúng (64 ký tự hex)

### Lỗi: "Method not allowed"
- API chỉ chấp nhận POST request
- Kiểm tra xem frontend đang gọi đúng endpoint `/api/verify-password`

### API không hoạt động
- Kiểm tra xem folder `api/` đã được deploy chưa
- Xem logs trong Vercel Dashboard > Functions để debug

## Lưu ý

- Hash hiện tại là của password `123456`
- Nên đổi password và hash sau khi setup xong
- Không commit file `.env` hoặc `.env.local` vào Git
- Environment Variables trong Vercel được mã hóa và bảo mật

