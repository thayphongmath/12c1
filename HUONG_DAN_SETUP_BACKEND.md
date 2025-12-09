# Hướng dẫn Setup Backend cho Quản lý Phụ huynh

## Tổng quan

Backend đã được tạo để lưu trữ và quản lý thông tin phụ huynh sử dụng Vercel Serverless Functions và Vercel KV (Redis).

## Cấu trúc API

### Endpoints

1. **GET `/api/parents`** - Lấy danh sách tất cả phụ huynh
2. **POST `/api/parents`** - Thêm phụ huynh mới
3. **PUT `/api/parents`** - Cập nhật thông tin phụ huynh
4. **DELETE `/api/parents?id={id}`** - Xóa phụ huynh

### Request/Response Format

#### GET `/api/parents`
```json
// Response
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Nguyễn Minh Anh",
      "phone": "0913435735"
    }
  ]
}
```

#### POST `/api/parents`
```json
// Request
{
  "name": "Nguyễn Văn A",
  "phone": "0912345678"
}

// Response
{
  "success": true,
  "message": "Parent added successfully",
  "data": {
    "id": 49,
    "name": "Nguyễn Văn A",
    "phone": "0912345678"
  }
}
```

#### PUT `/api/parents`
```json
// Request
{
  "id": 1,
  "name": "Nguyễn Minh Anh Updated",
  "phone": "0913435735"
}

// Response
{
  "success": true,
  "message": "Parent updated successfully",
  "data": {
    "id": 1,
    "name": "Nguyễn Minh Anh Updated",
    "phone": "0913435735"
  }
}
```

#### DELETE `/api/parents?id=1`
```json
// Response
{
  "success": true,
  "message": "Parent deleted successfully"
}
```

## Các bước Setup

### Bước 1: Cài đặt Dependencies

```bash
npm install
```

Hoặc nếu chưa có npm, cài đặt Node.js trước: https://nodejs.org/

### Bước 2: Setup Vercel KV

1. Đăng nhập vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project của bạn
3. Vào **Storage** > **Create Database**
4. Chọn **KV** (Redis)
5. Tạo KV database mới
6. Vercel sẽ tự động thêm các Environment Variables:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

### Bước 3: Deploy lên Vercel

1. Push code lên Git repository (GitHub, GitLab, Bitbucket)
2. Kết nối repository với Vercel
3. Vercel sẽ tự động detect và deploy:
   - File `api/parents.js` → Serverless Function
   - Frontend files → Static site

### Bước 4: Test API

Sau khi deploy, test API bằng cách:

#### Test GET (lấy danh sách):
```bash
curl https://your-domain.vercel.app/api/parents
```

#### Test POST (thêm mới):
```bash
curl -X POST https://your-domain.vercel.app/api/parents \
  -H "Content-Type: application/json" \
  -d '{"name":"Nguyễn Văn A","phone":"0912345678"}'
```

#### Test PUT (cập nhật):
```bash
curl -X PUT https://your-domain.vercel.app/api/parents \
  -H "Content-Type: application/json" \
  -d '{"id":1,"name":"Nguyễn Văn A Updated","phone":"0912345678"}'
```

#### Test DELETE (xóa):
```bash
curl -X DELETE https://your-domain.vercel.app/api/parents?id=1
```

## Fallback Mode

Nếu chưa setup Vercel KV, API sẽ tự động sử dụng dữ liệu mặc định (fallback). Tuy nhiên, các thao tác POST/PUT/DELETE sẽ không được lưu lại.

**Lưu ý**: Để sử dụng đầy đủ tính năng lưu trữ, bạn cần setup Vercel KV.

## Frontend Integration

Frontend (`lienhephuhuynh.html`) đã được cập nhật để:
- Tự động fetch dữ liệu từ API khi trang load
- Hiển thị loading state khi đang tải
- Xử lý lỗi nếu API không khả dụng

## Troubleshooting

### Lỗi: "Failed to save parent"
- Kiểm tra xem đã setup Vercel KV chưa
- Kiểm tra Environment Variables trong Vercel Dashboard
- Xem logs trong Vercel Dashboard > Functions

### API trả về dữ liệu mặc định
- Có thể chưa setup Vercel KV
- Hoặc KV chưa có dữ liệu (sẽ dùng fallback)

### CORS Error
- API đã được cấu hình CORS để cho phép tất cả origins
- Nếu vẫn gặp lỗi, kiểm tra browser console

## Lưu ý

- Vercel KV có giới hạn miễn phí: 256MB storage, 30K requests/day
- Dữ liệu được lưu dưới key `parents` trong KV
- API hỗ trợ validation số điện thoại (10-11 chữ số)
- Tất cả dữ liệu được trim (loại bỏ khoảng trắng thừa)

## Nâng cấp (Optional)

Nếu cần thêm tính năng:
- Thêm authentication cho API (chỉ admin mới được POST/PUT/DELETE)
- Thêm pagination cho GET request
- Thêm search/filter
- Thêm validation nâng cao
- Export/Import dữ liệu

