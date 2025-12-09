# Ví Dụ Test API - Quản Lý Phụ Huynh

## Thay Thế URL

Trong tất cả ví dụ dưới đây, thay `YOUR_DOMAIN` bằng domain thực tế của bạn:
- Ví dụ: `https://lien-he-phu-huynh.vercel.app`
- Hoặc: `https://your-project.vercel.app`

---

## 1. Test GET - Lấy Danh Sách

### Browser
```
https://YOUR_DOMAIN/api/parents
```

### cURL
```bash
curl https://YOUR_DOMAIN/api/parents
```

### JavaScript (Frontend)
```javascript
fetch('/api/parents')
  .then(res => res.json())
  .then(data => console.log(data));
```

### JavaScript (Async/Await)
```javascript
async function getParents() {
  const response = await fetch('/api/parents');
  const data = await response.json();
  console.log(data);
}
getParents();
```

### Python
```python
import requests

response = requests.get('https://YOUR_DOMAIN/api/parents')
print(response.json())
```

---

## 2. Test POST - Thêm Phụ Huynh Mới

### cURL
```bash
curl -X POST https://YOUR_DOMAIN/api/parents \
  -H "Content-Type: application/json" \
  -d '{"name":"Nguyễn Văn A","phone":"0912345678"}'
```

### JavaScript
```javascript
fetch('/api/parents', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Nguyễn Văn A',
    phone: '0912345678'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### JavaScript (Async/Await)
```javascript
async function addParent() {
  const response = await fetch('/api/parents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Nguyễn Văn A',
      phone: '0912345678'
    })
  });
  const data = await response.json();
  console.log(data);
}
addParent();
```

### Python
```python
import requests

data = {
    "name": "Nguyễn Văn A",
    "phone": "0912345678"
}

response = requests.post(
    'https://YOUR_DOMAIN/api/parents',
    json=data
)
print(response.json())
```

---

## 3. Test PUT - Cập Nhật Phụ Huynh

### cURL
```bash
curl -X PUT https://YOUR_DOMAIN/api/parents \
  -H "Content-Type: application/json" \
  -d '{"id":1,"name":"Nguyễn Văn A Updated","phone":"0912345678"}'
```

### JavaScript
```javascript
fetch('/api/parents', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: 1,
    name: 'Nguyễn Văn A Updated',
    phone: '0912345678'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### JavaScript (Async/Await)
```javascript
async function updateParent(id, name, phone) {
  const response = await fetch('/api/parents', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, name, phone })
  });
  const data = await response.json();
  console.log(data);
}

updateParent(1, 'Nguyễn Văn A Updated', '0912345678');
```

### Python
```python
import requests

data = {
    "id": 1,
    "name": "Nguyễn Văn A Updated",
    "phone": "0912345678"
}

response = requests.put(
    'https://YOUR_DOMAIN/api/parents',
    json=data
)
print(response.json())
```

---

## 4. Test DELETE - Xóa Phụ Huynh

### cURL
```bash
curl -X DELETE "https://YOUR_DOMAIN/api/parents?id=1"
```

### JavaScript
```javascript
fetch('/api/parents?id=1', {
  method: 'DELETE'
})
.then(res => res.json())
.then(data => console.log(data));
```

### JavaScript (Async/Await)
```javascript
async function deleteParent(id) {
  const response = await fetch(`/api/parents?id=${id}`, {
    method: 'DELETE'
  });
  const data = await response.json();
  console.log(data);
}

deleteParent(1);
```

### Python
```python
import requests

response = requests.delete('https://YOUR_DOMAIN/api/parents?id=1')
print(response.json())
```

---

## 5. Test với Postman

### Setup Request

1. **GET Request**:
   - Method: `GET`
   - URL: `https://YOUR_DOMAIN/api/parents`
   - Click **Send**

2. **POST Request**:
   - Method: `POST`
   - URL: `https://YOUR_DOMAIN/api/parents`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "name": "Nguyễn Văn A",
       "phone": "0912345678"
     }
     ```
   - Click **Send**

3. **PUT Request**:
   - Method: `PUT`
   - URL: `https://YOUR_DOMAIN/api/parents`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "id": 1,
       "name": "Updated Name",
       "phone": "0912345678"
     }
     ```

4. **DELETE Request**:
   - Method: `DELETE`
   - URL: `https://YOUR_DOMAIN/api/parents?id=1`
   - Click **Send**

---

## 6. Test với Thunder Client (VS Code Extension)

### Install Extension
1. Mở VS Code
2. Extensions → Tìm "Thunder Client" → Install

### Tạo Requests

1. Click icon Thunder Client ở sidebar
2. Click **New Request**
3. Đặt tên: "Get Parents"
4. Method: `GET`
5. URL: `https://YOUR_DOMAIN/api/parents`
6. Click **Send**

Tương tự cho POST, PUT, DELETE.

---

## 7. Response Examples

### Success Response (GET)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Nguyễn Minh Anh",
      "phone": "0913435735"
    },
    {
      "id": 2,
      "name": "Nguyễn Thị Xuân Nhi",
      "phone": "0979845064"
    }
  ]
}
```

### Success Response (POST)
```json
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

### Error Response
```json
{
  "success": false,
  "error": "Name and phone are required"
}
```

### Error Response (Invalid Phone)
```json
{
  "success": false,
  "error": "Invalid phone number format"
}
```

---

## 8. Test Script Hoàn Chỉnh (JavaScript)

```javascript
// Test tất cả endpoints
const API_URL = 'https://YOUR_DOMAIN/api/parents';

async function testAPI() {
  console.log('=== Testing API ===\n');
  
  // 1. GET - Lấy danh sách
  console.log('1. GET - Lấy danh sách:');
  const getResponse = await fetch(API_URL);
  const getData = await getResponse.json();
  console.log(getData);
  console.log('\n');
  
  // 2. POST - Thêm mới
  console.log('2. POST - Thêm phụ huynh mới:');
  const postResponse = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Nguyễn Văn Test',
      phone: '0912345678'
    })
  });
  const postData = await postResponse.json();
  console.log(postData);
  const newId = postData.data?.id;
  console.log('\n');
  
  // 3. PUT - Cập nhật
  if (newId) {
    console.log('3. PUT - Cập nhật:');
    const putResponse = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: newId,
        name: 'Nguyễn Văn Test Updated',
        phone: '0912345678'
      })
    });
    const putData = await putResponse.json();
    console.log(putData);
    console.log('\n');
    
    // 4. DELETE - Xóa
    console.log('4. DELETE - Xóa:');
    const deleteResponse = await fetch(`${API_URL}?id=${newId}`, {
      method: 'DELETE'
    });
    const deleteData = await deleteResponse.json();
    console.log(deleteData);
  }
}

// Chạy test
testAPI();
```

---

## 9. Kiểm Tra Logs

### Vercel Dashboard
1. Vào https://vercel.com/dashboard
2. Chọn project
3. Tab **Deployments** → Click deployment mới nhất
4. Tab **Functions** → Click `api/parents`
5. Xem **Logs** để debug

### Browser Console
1. Mở trang web
2. F12 → Tab **Console**
3. Xem các log từ `console.error()` và `console.log()`

### Network Tab
1. F12 → Tab **Network**
2. Reload trang
3. Tìm request `/api/parents`
4. Click vào → Xem **Headers**, **Response**

---

## 10. Common Issues

### ❌ CORS Error
**Giải pháp**: API đã có CORS headers, kiểm tra lại URL

### ❌ 404 Not Found
**Giải pháp**: 
- Kiểm tra URL đúng chưa
- Đảm bảo file `api/parents.js` đã được deploy

### ❌ 500 Internal Server Error
**Giải pháp**: 
- Xem logs trong Vercel Dashboard
- Kiểm tra KV đã được setup chưa

### ❌ Method Not Allowed
**Giải pháp**: 
- Kiểm tra HTTP method đúng chưa (GET, POST, PUT, DELETE)
- Kiểm tra URL có query params đúng không (DELETE cần `?id=...`)

---

Chúc bạn test thành công! 🚀

