# Hướng Dẫn Sử Dụng data.js

## Tổng Quan

File `data.js` chứa tất cả thông tin có thể tùy chỉnh của lớp học. Chỉ cần thay đổi thông tin trong file này mà không cần sửa giao diện.

## Cấu Trúc File

### 1. CLASS_INFO - Thông Tin Lớp
```javascript
const CLASS_INFO = {
    className: '12C1',           // Tên lớp
    schoolYear: '2024-2025',     // Năm học
    fullName: 'Lớp 12C1 - 2024-2025'  // Tên đầy đủ
};
```

### 2. GVCN_INFO - Thông Tin Giáo Viên Chủ Nhiệm
```javascript
const GVCN_INFO = {
    name: 'Võ Thanh Phong',      // Tên GVCN
    displayName: 'Võ Thanh Phong', // Tên hiển thị
    phone: '0382311919',          // Số điện thoại
    zalo: '0382311919'            // Số Zalo (thường giống số điện thoại)
};
```

**Lưu ý:** URL Zalo và Phone sẽ tự động được tạo từ số điện thoại.

### 3. STUDENTS - Danh Sách Học Sinh
```javascript
const STUDENTS = [
    { name: 'Họ và Tên', birthDay: ngày, birthMonth: tháng },
    // ...
];
```

**Format:**
- `name`: Họ và tên đầy đủ của học sinh
- `birthDay`: Ngày sinh (1-31)
- `birthMonth`: Tháng sinh (1-12)

**Ví dụ:**
```javascript
{ name: 'Nguyễn Văn A', birthDay: 15, birthMonth: 3 }
```

### 4. TIMETABLE - Thời Khóa Biểu

Cấu trúc phức tạp hơn, chứa thông tin:
- `morningTitle`: Tiêu đề buổi sáng
- `afternoonTitle`: Tiêu đề buổi chiều
- `morning`: Mảng các tiết buổi sáng
- `afternoon`: Mảng các tiết buổi chiều

**Format mỗi tiết:**
```javascript
{
    period: 1,                    // Số tiết (1-5)
    day: 'hai',                    // Thứ trong tuần: 'hai', 'ba', 'tư', 'năm', 'sáu', 'bảy'
    subject: 'Toán',              // Tên môn học
    teacher: 'Võ Thanh Phong',    // Tên giáo viên
    class: 'subject-toan',        // CSS class (tùy chọn)
    rowspan: 2                    // Số hàng gộp (tùy chọn, nếu có)
}
```

**Các môn học và CSS class tương ứng:**
- Toán: `subject-toan`
- Văn: `subject-van`
- Anh: `subject-anh`
- Địa: `subject-dia`
- Sử: `subject-su`
- Tin: `subject-tin`
- CN: `subject-cn`
- GDTC: `subject-gdtc`
- GDQP: `subject-gdqp`
- GDKT&PL: `subject-gdktpl`
- GDHN: `subject-gdhn`
- HĐTN: `subject-hdtn`
- SHCN: `subject-shcn`

### 5. EXAM_INFO - Thông Tin Thi Cử
```javascript
const EXAM_INFO = {
    hk1Date: '29/12/2025',        // Ngày thi (hiển thị)
    hk1DateFull: '2025-12-29',    // Ngày thi (format đầy đủ cho countdown)
    hk1Title: 'Thi học kỳ 1'      // Tiêu đề
};
```

### 6. OTHER_INFO - Thông Tin Khác
```javascript
const OTHER_INFO = {
    soyeulilich: {
        className: '12C1',
        gvcnDisplay: 'Thầy Phong Math',
        gvcnPhone: '0382311919'
    },
    thankyouMessage: 'Gửi Thành công rồi. GVCN: Thầy Phong Math!'
};
```

## Cách Sử Dụng

### Thay Đổi Thông Tin Lớp
1. Mở file `data.js`
2. Tìm `CLASS_INFO`
3. Cập nhật `className`, `schoolYear`, `fullName`

### Thay Đổi Thông Tin GVCN
1. Tìm `GVCN_INFO`
2. Cập nhật `name`, `displayName`, `phone`, `zalo`

### Thay Đổi Danh Sách Học Sinh
1. Tìm `STUDENTS`
2. Thêm/xóa/sửa các object trong mảng
3. Đảm bảo format đúng: `{ name: '...', birthDay: ..., birthMonth: ... }`

### Thay Đổi Thời Khóa Biểu
1. Tìm `TIMETABLE`
2. Cập nhật `morningTitle` và `afternoonTitle` nếu cần
3. Sửa các mảng `morning` và `afternoon`
4. Mỗi tiết là một object với các thuộc tính: `period`, `day`, `subject`, `teacher`, `class`

### Thay Đổi Thông Tin Thi Cử
1. Tìm `EXAM_INFO`
2. Cập nhật `hk1Date`, `hk1DateFull`, `hk1Title`

## Lưu Ý

- **Không xóa** các biến `const` hoặc thay đổi tên biến
- **Giữ nguyên** cấu trúc object và mảng
- **Đảm bảo** format dữ liệu đúng (số cho `birthDay`, `birthMonth`, `period`)
- **Kiểm tra** chính tả tên môn học và giáo viên
- Sau khi thay đổi, **refresh** trang web để xem kết quả

## Ví Dụ Thay Đổi

### Thay đổi tên lớp:
```javascript
const CLASS_INFO = {
    className: '12C2',  // Thay đổi từ 12C1
    schoolYear: '2024-2025',
    fullName: 'Lớp 12C2 - 2024-2025'
};
```

### Thêm học sinh mới:
```javascript
const STUDENTS = [
    // ... các học sinh cũ
    { name: 'Nguyễn Văn Mới', birthDay: 10, birthMonth: 5 }  // Thêm vào cuối
];
```

### Thay đổi thời khóa biểu:
```javascript
// Thay đổi môn Toán tiết 1 thứ 2 thành môn Lý
{ period: 1, day: 'hai', subject: 'Lý', teacher: 'Nguyễn Văn B', class: 'subject-ly' }
```

## Troubleshooting

**Q: Thay đổi không hiển thị?**
A: Đảm bảo file HTML đã load `data.js` và refresh lại trang (Ctrl+F5 để clear cache).

**Q: Lỗi JavaScript?**
A: Kiểm tra:
- Dấu phẩy (`,`) giữa các object trong mảng
- Dấu ngoặc nhọn (`{}`) và ngoặc vuông (`[]`) đóng đúng
- Không có dấu phẩy thừa ở cuối mảng/object

**Q: Thời khóa biểu không hiển thị đúng?**
A: Kiểm tra:
- Format của `day` phải là: 'hai', 'ba', 'tư', 'năm', 'sáu', 'bảy'
- `period` phải là số từ 1-5
- `rowspan` chỉ dùng khi có tiết gộp 2 hàng

