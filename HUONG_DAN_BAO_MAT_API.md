# Hướng Dẫn Bảo Mật API - Chống Lộ Thông Tin Phụ Huynh

## Vấn Đề

API endpoint `/api/parents` trước đây có thể truy cập công khai mà không cần authentication, dẫn đến việc **lộ thông tin phụ huynh**.

## Giải Pháp

Đã thêm **authentication** vào API với 2 lớp bảo vệ:

1. **Session Token Authentication**: Token được tạo sau khi login và lưu vào KV
2. **API Secret Key**: Fallback nếu cần (tùy chọn)

---

## Cách Hoạt Động

### 1. Flow Authentication

```
User Login → verify-password.js → Tạo sessionToken → Lưu vào KV
                                                      ↓
User truy cập /api/parents → Gửi sessionToken trong header
                            → Backend kiểm tra token trong KV
                            → Cho phép hoặc từ chối
```

### 2. Session Token

- Được tạo khi login thành công
- Lưu vào Vercel KV với thời gian hết hạn: **1 giờ**
- Frontend lưu trong `sessionStorage`
- Tự động gửi trong header `X-API-Key` khi gọi API

### 3. Validation

Backend kiểm tra:
- Token có tồn tại trong KV không?
- Token còn hạn không? (chưa quá 1 giờ)
- Nếu không có KV, fallback về API_SECRET_KEY (nếu có)

---

## Setup

### Bước 1: Đảm Bảo Vercel KV Đã Được Setup

1. Vào Vercel Dashboard → Project → **Storage**
2. Đảm bảo đã có KV database
3. Environment Variables tự động có:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`

### Bước 2: (Tùy chọn) Setup API_SECRET_KEY

Nếu muốn thêm lớp bảo vệ bằng API key cố định:

1. Vào Vercel Dashboard → Project → **Settings** → **Environment Variables**
2. Thêm biến mới:
   - **Name**: `API_SECRET_KEY`
   - **Value**: Một chuỗi bí mật ngẫu nhiên (ví dụ: `your-secret-key-here-12345`)
   - Chọn môi trường: **Production**, **Preview**, **Development**
3. Click **Save**

**Lưu ý**: Nếu không setup API_SECRET_KEY, hệ thống vẫn hoạt động với session token.

### Bước 3: Deploy Lại

```bash
git add .
git commit -m "Add API authentication"
git push
```

Vercel sẽ tự động deploy.

---

## Kiểm Tra Bảo Mật

### Test 1: Truy cập không có token

```bash
curl https://your-domain.vercel.app/api/parents
```

**Kết quả mong đợi**:
```json
{
  "success": false,
  "error": "Unauthorized. Valid session token or API key required."
}
```

✅ **API đã được bảo vệ!**

### Test 2: Truy cập với token hợp lệ

1. Login qua frontend
2. Mở Browser Console (F12)
3. Chạy:
```javascript
const token = sessionStorage.getItem('apiKey');
fetch('/api/parents', {
  headers: { 'X-API-Key': token }
}).then(r => r.json()).then(console.log);
```

**Kết quả mong đợi**: Trả về danh sách phụ huynh

### Test 3: Token hết hạn

1. Đợi 1 giờ sau khi login
2. Thử gọi API lại
3. **Kết quả**: Token hết hạn, cần login lại

---

## Cấu Trúc Code

### Backend (`api/parents.js`)

```javascript
// Kiểm tra authentication
async function checkAuth(req) {
    const authHeader = req.headers['x-api-key'] || req.headers['authorization'];
    const token = authHeader.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : authHeader;

    // Kiểm tra trong KV
    const sessionData = await kv.get(`session:${token}`);
    if (sessionData && Date.now() - sessionData.timestamp < 3600000) {
        return true;
    }

    // Fallback: API_SECRET_KEY
    return token === process.env.API_SECRET_KEY;
}
```

### Frontend (`lienhephuhuynh.html`)

```javascript
// Gửi token trong header
fetch('/api/parents', {
    headers: {
        'X-API-Key': sessionStorage.getItem('apiKey')
    }
})
```

### Login (`api/verify-password.js`)

```javascript
// Tạo và lưu session token
const sessionToken = Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64');
await saveSessionToken(sessionToken); // Lưu vào KV
```

---

## Troubleshooting

### ❌ API vẫn trả về dữ liệu không có token

**Nguyên nhân**: 
- Chưa deploy lại code mới
- KV chưa được setup

**Giải pháp**:
1. Kiểm tra code đã được push lên Git chưa
2. Kiểm tra Vercel đã deploy chưa
3. Kiểm tra KV đã được tạo chưa

### ❌ "Unauthorized" ngay cả khi đã login

**Nguyên nhân**:
- Token không được gửi trong header
- Token hết hạn
- KV không lưu được session

**Giải pháp**:
1. Kiểm tra Browser Console → Application → Session Storage → có `apiKey` không?
2. Kiểm tra Network tab → Request Headers → có `X-API-Key` không?
3. Thử login lại

### ❌ Session hết hạn quá nhanh

**Giải pháp**: 
- Mặc định session hết hạn sau 1 giờ
- Có thể tăng thời gian trong `api/verify-password.js`:
```javascript
await kv.expire(sessionKey, 7200); // 2 giờ thay vì 3600 (1 giờ)
```

### ❌ KV không lưu được session

**Nguyên nhân**: 
- KV chưa được setup đúng
- Environment Variables chưa có

**Giải pháp**:
1. Kiểm tra KV trong Vercel Dashboard
2. Kiểm tra Environment Variables
3. Xem logs trong Vercel để debug

---

## Bảo Mật Bổ Sung (Nâng Cao)

### 1. Thêm Rate Limiting

Giới hạn số lần request từ một IP:

```javascript
// Trong api/parents.js
const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
const rateLimitKey = `ratelimit:${clientIP}`;
const requests = await kv.get(rateLimitKey) || 0;

if (requests > 100) { // 100 requests mỗi giờ
    return res.status(429).json({ error: 'Too many requests' });
}

await kv.incr(rateLimitKey);
await kv.expire(rateLimitKey, 3600);
```

### 2. Thêm CORS Restrictions

Chỉ cho phép domain cụ thể:

```javascript
const allowedOrigins = ['https://your-domain.vercel.app'];
const origin = req.headers.origin;

if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
}
```

### 3. Encrypt Sensitive Data

Mã hóa số điện thoại trong KV:

```javascript
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = process.env.ENCRYPTION_KEY;

function encrypt(text) {
    const cipher = crypto.createCipher(algorithm, key);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}
```

---

## Checklist Bảo Mật

- [x] API yêu cầu authentication
- [x] Session token được lưu trong KV
- [x] Session tự động hết hạn sau 1 giờ
- [x] Frontend tự động gửi token trong header
- [x] Unauthorized requests bị từ chối
- [ ] (Tùy chọn) API_SECRET_KEY được setup
- [ ] (Tùy chọn) Rate limiting được bật
- [ ] (Tùy chọn) CORS restrictions được setup

---

## Kết Luận

✅ **API đã được bảo vệ!**

- Không thể truy cập `/api/parents` mà không có token hợp lệ
- Token tự động hết hạn sau 1 giờ
- Session được lưu an toàn trong KV
- Frontend tự động xử lý authentication

**Lưu ý**: Sau khi deploy, test lại để đảm bảo API không còn bị lộ!

---

## Tài Liệu Tham Khảo

- [Vercel KV Documentation](https://vercel.com/docs/storage/vercel-kv)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [Session Management Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

