# Hướng dẫn Setup Project Liên Hệ Phụ Huynh

## Tổng quan
Đây là một project riêng biệt, cần setup API authentication riêng trên Vercel.

## Cấu trúc file cần thiết

```
lienheph-project/
├── api/
│   └── verify-password.js    # API xác thực password (copy từ project chính)
├── lienhephuhuynh.html       # Trang chính
└── HUONG_DAN_PROJECT_LIENHEPH.md  # File hướng dẫn này
```

## Các bước setup

### Bước 1: Copy API endpoint

Copy file `api/verify-password.js` từ project chính sang project này.

### Bước 2: Setup Vercel Environment Variable

1. Đăng nhập vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Tạo project mới hoặc chọn project cho trang liên hệ phụ huynh
3. Vào **Settings** > **Environment Variables**
4. Thêm biến:
   - **Name**: `AUTH_PASSWORD_HASH`
   - **Value**: `8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92` (hash của '123456')
   - Chọn môi trường: **Production**, **Preview**, **Development**

### Bước 3: Deploy

1. Push code lên Git repository
2. Kết nối với Vercel
3. Deploy project

### Bước 4: Test

1. Mở trang web
2. Nhập password: `123456`
3. Kiểm tra xem có hiển thị danh sách SĐT phụ huynh không

## Lưu ý

- Project này hoàn toàn độc lập với project chính
- Có thể dùng password khác nếu muốn (chỉ cần thay đổi hash trong Environment Variable)
- API endpoint `/api/verify-password` sẽ hoạt động trong project này

## Tạo hash cho password mới

Nếu muốn đổi password, tạo hash mới:
- Online: https://emn178.github.io/online-tools/sha256.html
- Hoặc dùng Node.js: `node -e "const crypto=require('crypto'); console.log(crypto.createHash('sha256').update('PASSWORD_MỚI').digest('hex'));"`

