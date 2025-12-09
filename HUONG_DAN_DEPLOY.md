# Hướng dẫn Deploy lên Vercel

## 📁 Cấu trúc file

File `api/verify-password.js` đã được đặt đúng vị trí:
```
du an Web/
├── api/
│   └── verify-password.js    ← File này sẽ tự động thành API endpoint
├── index.html
└── ... (các file khác)
```

## 🚀 Các bước deploy

### Bước 1: Chuẩn bị Git Repository

1. **Khởi tạo Git (nếu chưa có):**
   ```bash
   git init
   git add .
   git commit -m "Initial commit with Vercel auth"
   ```

2. **Tạo repository trên GitHub/GitLab/Bitbucket:**
   - Đăng nhập vào GitHub
   - Tạo repository mới (ví dụ: `du-an-web`)
   - **KHÔNG** tích vào "Initialize with README"

3. **Push code lên repository:**
   ```bash
   git remote add origin https://github.com/USERNAME/du-an-web.git
   git branch -M main
   git push -u origin main
   ```

### Bước 2: Deploy lên Vercel

#### Cách A: Qua Vercel Dashboard (Khuyến nghị)

1. **Đăng nhập Vercel:**
   - Truy cập: https://vercel.com
   - Đăng nhập bằng GitHub/GitLab/Bitbucket

2. **Import Project:**
   - Click **"Add New..."** > **"Project"**
   - Chọn repository vừa tạo
   - Click **"Import"**

3. **Cấu hình Project:**
   - **Framework Preset**: Chọn "Other" hoặc để mặc định
   - **Root Directory**: Để mặc định (./)
   - **Build Command**: Để trống (không cần build)
   - **Output Directory**: Để trống

4. **Thêm Environment Variable:**
   - Trong phần **"Environment Variables"**
   - Thêm biến:
     - **Name**: `AUTH_PASSWORD_HASH`
     - **Value**: `8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92`
     - Chọn: **Production**, **Preview**, **Development**

5. **Deploy:**
   - Click **"Deploy"**
   - Chờ vài phút để Vercel deploy

#### Cách B: Qua Vercel CLI

1. **Cài đặt Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Đăng nhập:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   - Lần đầu sẽ hỏi một số câu hỏi, trả lời theo hướng dẫn
   - Chọn **"Set up and deploy"**

4. **Thêm Environment Variable:**
   ```bash
   vercel env add AUTH_PASSWORD_HASH
   ```
   - Nhập giá trị: `8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92`
   - Chọn môi trường: Production, Preview, Development

5. **Deploy lại để áp dụng env:**
   ```bash
   vercel --prod
   ```

## ✅ Kiểm tra sau khi deploy

### 1. Kiểm tra API endpoint

Sau khi deploy, API sẽ có URL:
```
https://YOUR-PROJECT.vercel.app/api/verify-password
```

Test bằng cách gửi POST request:
```bash
curl -X POST https://YOUR-PROJECT.vercel.app/api/verify-password \
  -H "Content-Type: application/json" \
  -d '{"password":"123456"}'
```

Hoặc dùng Postman/Thunder Client để test.

### 2. Kiểm tra Frontend

1. Mở trang web: `https://YOUR-PROJECT.vercel.app`
2. Click vào link được bảo vệ
3. Nhập password: `123456`
4. Nếu đúng, sẽ mở link được bảo vệ

## 🔍 Vercel tự động nhận diện

Vercel sẽ tự động:
- ✅ Nhận diện thư mục `api/` → Tạo Serverless Functions
- ✅ File `api/verify-password.js` → Endpoint `/api/verify-password`
- ✅ File `index.html` → Serve như static file

## 📝 Lưu ý quan trọng

1. **Environment Variable:**
   - Phải thêm `AUTH_PASSWORD_HASH` trong Vercel Dashboard
   - Nếu không có, API sẽ trả về lỗi 500

2. **File structure:**
   - File `api/verify-password.js` phải nằm trong thư mục `api/`
   - Tên file sẽ thành endpoint: `/api/verify-password`

3. **Auto-deploy:**
   - Mỗi lần push code lên Git, Vercel sẽ tự động deploy lại
   - Có thể tắt auto-deploy trong Settings nếu cần

## 🐛 Troubleshooting

### Lỗi: "Server configuration error"
- Kiểm tra Environment Variable đã được thêm chưa
- Vào Vercel Dashboard > Settings > Environment Variables

### Lỗi: "Function not found"
- Kiểm tra file `api/verify-password.js` đã được push lên Git chưa
- Kiểm tra tên file đúng chính xác

### API không hoạt động
- Xem logs trong Vercel Dashboard > Functions
- Kiểm tra console để xem lỗi cụ thể

## 📚 Tài liệu tham khảo

- Vercel Docs: https://vercel.com/docs
- Serverless Functions: https://vercel.com/docs/functions
- Environment Variables: https://vercel.com/docs/environment-variables

