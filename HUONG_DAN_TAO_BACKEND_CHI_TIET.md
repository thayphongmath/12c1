# Hướng Dẫn Chi Tiết Tạo Backend cho Quản Lý Phụ Huynh

## Mục Lục
1. [Tổng Quan](#tổng-quan)
2. [Chuẩn Bị](#chuẩn-bị)
3. [Bước 1: Tạo Cấu Trúc Project](#bước-1-tạo-cấu-trúc-project)
4. [Bước 2: Tạo API Endpoint](#bước-2-tạo-api-endpoint)
5. [Bước 3: Setup Vercel KV (Database)](#bước-3-setup-vercel-kv-database)
6. [Bước 4: Cài Đặt Dependencies](#bước-4-cài-đặt-dependencies)
7. [Bước 5: Deploy lên Vercel](#bước-5-deploy-lên-vercel)
8. [Bước 6: Test API](#bước-6-test-api)
9. [Bước 7: Kết Nối Frontend](#bước-7-kết-nối-frontend)
10. [Troubleshooting](#troubleshooting)

---

## Tổng Quan

Backend này sử dụng:
- **Vercel Serverless Functions**: Chạy API không cần server riêng
- **Vercel KV (Redis)**: Lưu trữ dữ liệu phụ huynh
- **RESTful API**: GET, POST, PUT, DELETE

---

## Chuẩn Bị

### Yêu Cầu:
- ✅ Tài khoản GitHub/GitLab/Bitbucket
- ✅ Tài khoản Vercel (miễn phí): https://vercel.com
- ✅ Node.js đã cài đặt (để test local): https://nodejs.org
- ✅ Code editor (VS Code, Cursor, etc.)

---

## Bước 1: Tạo Cấu Trúc Project

### 1.1. Tạo thư mục `api`

Trong project của bạn, tạo thư mục `api` (nếu chưa có):

```
du an Web/
├── api/
│   └── parents.js    ← File API sẽ tạo ở đây
├── lienhephuhuynh.html
└── package.json
```

### 1.2. File `api/parents.js` đã được tạo sẵn

File này chứa tất cả logic backend. Nếu chưa có, bạn có thể copy từ file hiện tại.

---

## Bước 2: Tạo API Endpoint

### 2.1. Giải Thích Cấu Trúc API

File `api/parents.js` có các phần chính:

#### a) Import và Setup
```javascript
import { kv } from '@vercel/kv';

// Kiểm tra KV có sẵn không
function isKvAvailable() {
    return process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
}
```

#### b) Helper Functions
- `getAllParents()`: Lấy tất cả phụ huynh từ KV hoặc dữ liệu mặc định
- `saveParents()`: Lưu danh sách phụ huynh vào KV
- `getDefaultParents()`: Dữ liệu mặc định (fallback)

#### c) Main Handler
```javascript
export default async function handler(req, res) {
    // Xử lý các request: GET, POST, PUT, DELETE
}
```

### 2.2. Các Endpoints

#### **GET `/api/parents`** - Lấy danh sách
```javascript
// Request
GET /api/parents

// Response
{
  "success": true,
  "data": [
    { "id": 1, "name": "Nguyễn Văn A", "phone": "0912345678" }
  ]
}
```

#### **POST `/api/parents`** - Thêm mới
```javascript
// Request
POST /api/parents
Content-Type: application/json

{
  "name": "Nguyễn Văn B",
  "phone": "0987654321"
}

// Response
{
  "success": true,
  "message": "Parent added successfully",
  "data": {
    "id": 2,
    "name": "Nguyễn Văn B",
    "phone": "0987654321"
  }
}
```

#### **PUT `/api/parents`** - Cập nhật
```javascript
// Request
PUT /api/parents
Content-Type: application/json

{
  "id": 1,
  "name": "Nguyễn Văn A Updated",
  "phone": "0912345678"
}

// Response
{
  "success": true,
  "message": "Parent updated successfully",
  "data": { ... }
}
```

#### **DELETE `/api/parents`** - Xóa
```javascript
// Request
DELETE /api/parents?id=1

// Response
{
  "success": true,
  "message": "Parent deleted successfully"
}
```

---

## Bước 3: Setup Vercel KV (Database)

### 3.1. Đăng Nhập Vercel

1. Truy cập: https://vercel.com
2. Đăng nhập bằng GitHub/GitLab/Bitbucket

### 3.2. Tạo KV Database

1. Vào **Dashboard** → Chọn project của bạn
2. Click tab **Storage**
3. Click **Create Database**
4. Chọn **KV** (Redis)
5. Đặt tên: `parents-db` (hoặc tên bạn muốn)
6. Chọn region gần nhất (ví dụ: `Southeast Asia`)
7. Click **Create**

### 3.3. Lấy Environment Variables

Sau khi tạo KV, Vercel tự động thêm các biến môi trường:

- `KV_REST_API_URL`: URL để kết nối KV
- `KV_REST_API_TOKEN`: Token để ghi dữ liệu
- `KV_REST_API_READ_ONLY_TOKEN`: Token chỉ đọc

**Lưu ý**: Các biến này tự động được thêm vào project, bạn không cần copy thủ công.

### 3.4. Kiểm Tra Environment Variables

1. Vào project → **Settings** → **Environment Variables**
2. Kiểm tra xem có 3 biến KV không
3. Nếu chưa có, đảm bảo KV đã được tạo và link với project

---

## Bước 4: Cài Đặt Dependencies

### 4.1. Tạo File `package.json`

File này đã được tạo sẵn với nội dung:

```json
{
  "name": "lien-he-phu-huynh",
  "version": "1.0.0",
  "dependencies": {
    "@vercel/kv": "^0.2.1"
  }
}
```

### 4.2. Cài Đặt (Nếu Test Local)

Nếu muốn test local trước khi deploy:

```bash
# Mở terminal trong thư mục project
cd "du an Web"

# Cài đặt dependencies
npm install
```

**Lưu ý**: Với Vercel, bạn không cần chạy `npm install` local. Vercel sẽ tự động cài khi deploy.

---

## Bước 5: Deploy lên Vercel

### 5.1. Push Code lên Git

#### Nếu chưa có Git repository:

1. Tạo repository mới trên GitHub:
   - Vào https://github.com/new
   - Đặt tên: `lien-he-phu-huynh` (hoặc tên bạn muốn)
   - Chọn **Public** hoặc **Private**
   - Click **Create repository**

2. Khởi tạo Git trong project:
```bash
# Mở terminal trong thư mục project
cd "du an Web"

# Khởi tạo Git
git init

# Thêm tất cả files
git add .

# Commit
git commit -m "Initial commit: Add backend API"

# Thêm remote (thay YOUR_USERNAME và REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push lên GitHub
git branch -M main
git push -u origin main
```

#### Nếu đã có Git repository:

```bash
git add .
git commit -m "Add backend API for parents management"
git push
```

### 5.2. Deploy trên Vercel

#### Cách 1: Import từ GitHub (Khuyến nghị)

1. Vào https://vercel.com/new
2. Click **Import Git Repository**
3. Chọn repository vừa push
4. Vercel tự động detect:
   - Framework: **Other** (static site)
   - Build Command: (để trống)
   - Output Directory: (để trống)
5. Click **Deploy**

#### Cách 2: Deploy bằng Vercel CLI

```bash
# Cài đặt Vercel CLI
npm install -g vercel

# Đăng nhập
vercel login

# Deploy
vercel

# Deploy production
vercel --prod
```

### 5.3. Kiểm Tra Deploy

1. Sau khi deploy xong, Vercel cung cấp URL: `https://your-project.vercel.app`
2. Kiểm tra logs:
   - Vào project → **Deployments** → Click deployment mới nhất → **Functions**
   - Xem log của function `api/parents`

---

## Bước 6: Test API

### 6.1. Test bằng Browser

Mở trình duyệt và truy cập:
```
https://your-project.vercel.app/api/parents
```

Kết quả mong đợi:
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Nguyễn Minh Anh", "phone": "0913435735" },
    ...
  ]
}
```

### 6.2. Test bằng cURL (Terminal)

#### Test GET:
```bash
curl https://your-project.vercel.app/api/parents
```

#### Test POST (Thêm mới):
```bash
curl -X POST https://your-project.vercel.app/api/parents \
  -H "Content-Type: application/json" \
  -d '{"name":"Nguyễn Văn Test","phone":"0912345678"}'
```

#### Test PUT (Cập nhật):
```bash
curl -X PUT https://your-project.vercel.app/api/parents \
  -H "Content-Type: application/json" \
  -d '{"id":1,"name":"Nguyễn Minh Anh Updated","phone":"0913435735"}'
```

#### Test DELETE:
```bash
curl -X DELETE https://your-project.vercel.app/api/parents?id=1
```

### 6.3. Test bằng Postman/Thunder Client

1. **GET Request**:
   - Method: `GET`
   - URL: `https://your-project.vercel.app/api/parents`
   - Send → Xem response

2. **POST Request**:
   - Method: `POST`
   - URL: `https://your-project.vercel.app/api/parents`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "name": "Nguyễn Văn Test",
       "phone": "0912345678"
     }
     ```
   - Send → Kiểm tra response

3. **PUT Request**:
   - Method: `PUT`
   - URL: `https://your-project.vercel.app/api/parents`
   - Headers: `Content-Type: application/json`
   - Body:
     ```json
     {
       "id": 1,
       "name": "Updated Name",
       "phone": "0912345678"
     }
     ```

4. **DELETE Request**:
   - Method: `DELETE`
   - URL: `https://your-project.vercel.app/api/parents?id=1`

---

## Bước 7: Kết Nối Frontend

### 7.1. Cập Nhật Frontend

File `lienhephuhuynh.html` đã được cập nhật để sử dụng API:

```javascript
// API endpoint
const API_URL = '/api/parents';

// Lấy danh sách phụ huynh từ API
async function fetchParents() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        
        if (result.success && result.data) {
            return result.data;
        }
    } catch (error) {
        console.error('Error fetching parents:', error);
        return [];
    }
}
```

### 7.2. Test Frontend

1. Deploy lại project (hoặc refresh nếu đã deploy)
2. Truy cập: `https://your-project.vercel.app/lienhephuhuynh.html`
3. Đăng nhập với password
4. Kiểm tra xem danh sách phụ huynh có hiển thị không

---

## Troubleshooting

### ❌ Lỗi: "Cannot find module '@vercel/kv'"

**Nguyên nhân**: Chưa cài đặt dependency hoặc chưa deploy.

**Giải pháp**:
1. Đảm bảo `package.json` có `@vercel/kv`
2. Deploy lại project trên Vercel
3. Kiểm tra logs trong Vercel Dashboard

### ❌ Lỗi: "Failed to save parent"

**Nguyên nhân**: Chưa setup Vercel KV hoặc KV không khả dụng.

**Giải pháp**:
1. Kiểm tra KV đã được tạo chưa (Storage tab)
2. Kiểm tra Environment Variables có `KV_REST_API_URL` không
3. Đảm bảo KV đã được link với project

### ❌ API trả về dữ liệu mặc định (fallback)

**Nguyên nhân**: KV chưa có dữ liệu hoặc chưa setup.

**Giải pháp**:
1. Thử POST một phụ huynh mới để tạo dữ liệu trong KV
2. Sau đó GET lại để kiểm tra

### ❌ CORS Error

**Nguyên nhân**: API chưa set CORS headers đúng.

**Giải pháp**: 
- File `api/parents.js` đã có CORS headers:
```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
```

### ❌ "Method not allowed"

**Nguyên nhân**: Gửi sai HTTP method.

**Giải pháp**:
- GET: Dùng `fetch()` hoặc `curl` không có `-X`
- POST: Dùng `fetch()` với `method: 'POST'` hoặc `curl -X POST`
- PUT: Dùng `curl -X PUT`
- DELETE: Dùng `curl -X DELETE`

### ❌ API không hoạt động sau khi deploy

**Giải pháp**:
1. Kiểm tra logs: Vercel Dashboard → Deployments → Functions → Logs
2. Kiểm tra function có được deploy không
3. Đảm bảo file `api/parents.js` có trong repository
4. Thử redeploy

### ❌ "Invalid phone number format"

**Nguyên nhân**: Số điện thoại không đúng format (phải 10-11 chữ số).

**Giải pháp**:
- Kiểm tra số điện thoại: chỉ chứa số, độ dài 10-11 ký tự
- Ví dụ hợp lệ: `0912345678`, `09876543210`

---

## Kiểm Tra Checklist

Trước khi deploy, đảm bảo:

- [ ] File `api/parents.js` đã được tạo
- [ ] File `package.json` có dependency `@vercel/kv`
- [ ] Code đã được push lên Git
- [ ] Vercel KV đã được tạo và link với project
- [ ] Environment Variables đã có (tự động khi tạo KV)
- [ ] Project đã được deploy trên Vercel
- [ ] API endpoint `/api/parents` hoạt động (test GET)
- [ ] Frontend đã được cập nhật để dùng API

---

## Tài Liệu Tham Khảo

- **Vercel KV Docs**: https://vercel.com/docs/storage/vercel-kv
- **Vercel Functions**: https://vercel.com/docs/functions
- **Vercel Dashboard**: https://vercel.com/dashboard

---

## Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra logs trong Vercel Dashboard
2. Xem console trong browser (F12)
3. Kiểm tra Network tab để xem request/response
4. Đọc lại phần Troubleshooting ở trên

---

## Tóm Tắt Quy Trình

```
1. Tạo file api/parents.js ✅
2. Tạo package.json với @vercel/kv ✅
3. Push code lên GitHub ✅
4. Tạo Vercel KV database ✅
5. Deploy project lên Vercel ✅
6. Test API endpoints ✅
7. Kết nối frontend ✅
```

Chúc bạn thành công! 🎉

