# Hướng Dẫn Cấu Hình

## Cài Đặt Nhanh

### Bước 1: Cấu hình URL Script

Mở file `config.js` và cập nhật URL của Google Apps Script:

```javascript
const GOOGLE_SCRIPT_URL = 'YOUR_SCRIPT_URL_HERE';
```

**Cách lấy URL Script:**
1. Mở Google Apps Script Editor
2. Deploy script `unified.gs` như Web App
3. Copy URL được tạo ra
4. Paste vào `config.js`

### Bước 2: Cấu hình Spreadsheet ID (Tùy chọn)

Nếu cần sử dụng Spreadsheet ID trong frontend, cập nhật trong `config.js`:

```javascript
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
```

**Cách lấy Spreadsheet ID:**
- Mở Google Sheet
- URL có dạng: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
- Copy `SPREADSHEET_ID` từ URL

### Bước 3: Cập nhật Spreadsheet ID trong unified.gs

Mở file `unified.gs` và cập nhật:

```javascript
var SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
```

## Cấu Trúc File

- `config.js` - File cấu hình chứa URL script và Spreadsheet ID
- `unified.gs` - Script Google Apps Script chính (cần deploy)
- Các file HTML (`lt.html`, `lpht.html`, `lpld.html`, `lptt.html`, `lppt.html`, `tt_form.html`, `thuquy.html`) - Các form đã được cấu hình để sử dụng `config.js`

## Lưu Ý

- Tất cả các form sẽ tự động sử dụng URL từ `config.js`
- Chỉ cần thay đổi URL một lần trong `config.js` là tất cả form sẽ được cập nhật
- Đảm bảo file `config.js` được load trước khi các script khác chạy (đã được thêm vào `<head>`)

## Troubleshooting

Nếu form không gửi được dữ liệu:
1. Kiểm tra URL trong `config.js` có đúng không
2. Kiểm tra script đã được deploy chưa
3. Kiểm tra quyền truy cập của script (phải là "Anyone" hoặc "Anyone with Google account")
4. Mở Console của trình duyệt (F12) để xem lỗi chi tiết

