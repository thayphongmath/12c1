# Quick Start - Setup Backend trong 5 Phút

## Bước Nhanh

### 1️⃣ Tạo Vercel KV (2 phút)

1. Vào https://vercel.com → Đăng nhập
2. Chọn project → Tab **Storage** → **Create Database**
3. Chọn **KV** → Đặt tên → **Create**

✅ Vercel tự động thêm Environment Variables

### 2️⃣ Push Code lên GitHub (1 phút)

```bash
git add .
git commit -m "Add backend API"
git push
```

### 3️⃣ Deploy trên Vercel (1 phút)

1. Vào https://vercel.com/new
2. Import repository từ GitHub
3. Click **Deploy**

### 4️⃣ Test API (1 phút)

Mở browser: `https://your-project.vercel.app/api/parents`

✅ Nếu thấy JSON data → Thành công!

---

## File Cần Có

```
✅ api/parents.js          (API endpoint)
✅ package.json            (Dependencies)
✅ lienhephuhuynh.html     (Frontend - đã cập nhật)
```

---

## Test Nhanh

### Browser:
```
https://your-project.vercel.app/api/parents
```

### Terminal:
```bash
curl https://your-project.vercel.app/api/parents
```

---

## Xem Hướng Dẫn Chi Tiết

👉 Xem file `HUONG_DAN_TAO_BACKEND_CHI_TIET.md` để biết chi tiết từng bước.

