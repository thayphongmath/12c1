// ============================================
// DATA CONFIGURATION FILE
// File chứa tất cả dữ liệu có thể tùy chỉnh
// Chỉ cần thay đổi thông tin ở đây, không cần sửa giao diện
// ============================================

// ============================================
// THÔNG TIN LỚP
// ============================================
const CLASS_INFO = {
    className: '12C1',
    schoolYear: '2024-2025',
    fullName: 'Lớp 12C1 - 2024-2025'
};

// ============================================
// THÔNG TIN GIÁO VIÊN CHỦ NHIỆM
// ============================================
const GVCN_INFO = {
    name: 'Võ Thanh Phong',
    displayName: 'Võ Thanh Phong',
    phone: '0382311919',
    zalo: '0382311919',
    // URL Zalo (tự động tạo từ số điện thoại)
    get zaloUrl() {
        return `https://zalo.me/${this.zalo}`;
    },
    // URL gọi điện (tự động tạo từ số điện thoại)
    get phoneUrl() {
        return `tel:${this.phone}`;
    }
};

// ============================================
// DANH SÁCH HỌC SINH
// Format: { name: 'Họ và Tên', birthDay: ngày, birthMonth: tháng }
// ============================================
const STUDENTS = [
    { name: 'Nguyễn Minh Anh', birthDay: 25, birthMonth: 1 },
    { name: 'Nguyễn Thị Xuân Nhi', birthDay: 7, birthMonth: 4 },
    { name: 'Trần Thị Cẩm Nhung', birthDay: 17, birthMonth: 7 },
    { name: 'Trần Thị Thúy Quỳnh', birthDay: 16, birthMonth: 4 },
    { name: 'Nguyễn Thị Tú Sương', birthDay: 4, birthMonth: 4 },
    { name: 'Lê Đông Thy', birthDay: 26, birthMonth: 12 },
    { name: 'Nguyễn Phạm Bảo Trân', birthDay: 29, birthMonth: 8 },
    { name: 'Nguyễn Thị Kim Cương', birthDay: 8, birthMonth: 11 },
    { name: 'Huỳnh Minh Tường', birthDay: 27, birthMonth: 10 },
    { name: 'Nguyễn Thị Thuỳ Dương', birthDay: 11, birthMonth: 11 },
    { name: 'Nguyễn Thành Đạt', birthDay: 5, birthMonth: 9 },
    { name: 'Trần Tiến Đạt', birthDay: 3, birthMonth: 2 },
    { name: 'Bùi Minh Đức', birthDay: 28, birthMonth: 11 },
    { name: 'Trần Gia Huệ', birthDay: 19, birthMonth: 2 },
    { name: 'Đinh Trung Kiên', birthDay: 18, birthMonth: 3 },
    { name: 'Lê Thị Thúy Kiều', birthDay: 16, birthMonth: 5 },
    { name: 'Lê Thị Thúy Kiều', birthDay: 15, birthMonth: 12 },
    { name: 'Trần Nguyễn Hồng Lam', birthDay: 3, birthMonth: 6 },
    { name: 'Nguyễn Thị Kiều Liên', birthDay: 22, birthMonth: 8 },
    { name: 'Lê Ngọc Linh', birthDay: 23, birthMonth: 11 },
    { name: 'Tăng Hoàng Trúc Linh', birthDay: 19, birthMonth: 9 },
    { name: 'Trần Thanh Long', birthDay: 23, birthMonth: 12 },
    { name: 'Nguyễn Kim Tường My', birthDay: 9, birthMonth: 11 },
    { name: 'Phạm Thị Kim Ngọc', birthDay: 18, birthMonth: 11 },
    { name: 'Nguyễn Thiện Nhân', birthDay: 30, birthMonth: 8 },
    { name: 'Trần Ngọc Nhân', birthDay: 27, birthMonth: 3 },
    { name: 'Trần Thị Yến Nhi', birthDay: 12, birthMonth: 11 },
    { name: 'Bùi Thị Thiện Như', birthDay: 16, birthMonth: 4 },
    { name: 'Bùi Trần Quỳnh Như', birthDay: 6, birthMonth: 11 },
    { name: 'Phạm Minh Nhựt', birthDay: 17, birthMonth: 11 },
    { name: 'Lê Minh Quí', birthDay: 13, birthMonth: 9 },
    { name: 'Bùi Thị Kiều Quy', birthDay: 4, birthMonth: 12 },
    { name: 'Nguyễn Thị Bích Thi', birthDay: 26, birthMonth: 9 },
    { name: 'Trương Thị Bảo Thi', birthDay: 5, birthMonth: 3 },
    { name: 'Nguyễn Đức Thịnh', birthDay: 30, birthMonth: 12 },
    { name: 'Dương Ngọc Thư', birthDay: 28, birthMonth: 10 },
    { name: 'Hồng Ngọc Anh Thư', birthDay: 23, birthMonth: 5 },
    { name: 'Lê Văn Thuận', birthDay: 30, birthMonth: 4 },
    { name: 'Lê Hoàng Bảo Thy', birthDay: 30, birthMonth: 11 },
    { name: 'Nguyễn Thị Bảo Trăm', birthDay: 23, birthMonth: 2 },
    { name: 'Nguyễn Thị Ngọc Trân', birthDay: 26, birthMonth: 1 },
    { name: 'Lê Thị Như Ý', birthDay: 10, birthMonth: 12 },
    { name: 'Lê Thị Ngọc Yến', birthDay: 24, birthMonth: 7 },
    { name: 'Nguyễn Thị Thảo Vi', birthDay: 20, birthMonth: 8 },
    { name: 'Nguyễn Trúc Đào', birthDay: 21, birthMonth: 6 },
    { name: 'Nguyễn Thị Ánh Hồng', birthDay: 9, birthMonth: 3 },
    { name: 'Hà Thị Tuyết My', birthDay: 23, birthMonth: 12 },
    { name: 'Nguyễn Thị Kim Tiên', birthDay: 9, birthMonth: 6 }
];

// ============================================
// THỜI KHÓA BIỂU
// Format: { session: 'sáng'|'chiều', period: tiết, day: 'hai'|'ba'|'tư'|'năm'|'sáu'|'bảy', subject: 'Tên môn', teacher: 'Tên giáo viên', rowspan: số hàng gộp }
// ============================================
const TIMETABLE = {
    // Thông tin chung
    morningTitle: 'Buổi Sáng (Áp dụng: 01-12-2025)',
    afternoonTitle: 'Trái Buổi: Chiều',
    
    // Thời khóa biểu buổi sáng
    morning: [
        // Tiết 1-2
        { period: 1, day: 'hai', subject: 'HĐTN', teacher: 'Phạm Thị Minh Châu', rowspan: 2, class: 'subject-hdtn' },
        { period: 1, day: 'ba', subject: 'Anh', teacher: 'Nguyễn Thanh Tuyền', class: 'subject-anh' },
        { period: 1, day: 'tư', subject: 'Toán', teacher: 'Võ Thanh Phong', class: 'subject-toan' },
        { period: 1, day: 'năm', subject: 'Toán', teacher: 'Võ Thanh Phong', class: 'subject-toan' },
        { period: 1, day: 'sáu', subject: 'Anh', teacher: 'Nguyễn Thanh Tuyền', class: 'subject-anh' },
        { period: 1, day: 'bảy', subject: '-', teacher: '', class: '' },
        
        { period: 2, day: 'ba', subject: 'Anh', teacher: 'Nguyễn Thanh Tuyền', class: 'subject-anh' },
        { period: 2, day: 'tư', subject: 'Toán', teacher: 'Võ Thanh Phong', class: 'subject-toan' },
        { period: 2, day: 'năm', subject: 'Toán', teacher: 'Võ Thanh Phong', class: 'subject-toan' },
        { period: 2, day: 'sáu', subject: 'Văn', teacher: 'Nguyễn Văn Thị', class: 'subject-van' },
        { period: 2, day: 'bảy', subject: '-', teacher: '', class: '' },
        
        // Tiết 3
        { period: 3, day: 'hai', subject: 'Địa', teacher: 'Lê Ngọc Lài', class: 'subject-dia' },
        { period: 3, day: 'ba', subject: 'GDKT&PL', teacher: 'Nguyễn Thị Cước', class: 'subject-gdktpl' },
        { period: 3, day: 'tư', subject: 'Sử', teacher: 'Bùi Văn Lới', class: 'subject-su' },
        { period: 3, day: 'năm', subject: 'Địa', teacher: 'Lê Ngọc Lài', class: 'subject-dia' },
        { period: 3, day: 'sáu', subject: 'Văn', teacher: 'Nguyễn Văn Thị', class: 'subject-van' },
        { period: 3, day: 'bảy', subject: '-', teacher: '', class: '' },
        
        // Tiết 4
        { period: 4, day: 'hai', subject: 'Sử', teacher: 'Bùi Văn Lới', class: 'subject-su' },
        { period: 4, day: 'ba', subject: 'Văn', teacher: 'Nguyễn Văn Thị', class: 'subject-van' },
        { period: 4, day: 'tư', subject: 'Tin', teacher: 'Nguyễn Hồng Nhung', class: 'subject-tin' },
        { period: 4, day: 'năm', subject: 'Địa', teacher: 'Lê Ngọc Lài', class: 'subject-dia' },
        { period: 4, day: 'sáu', subject: 'CN(CN)', teacher: 'Trần Lâm Tùng', class: 'subject-cn' },
        { period: 4, day: 'bảy', subject: '-', teacher: '', class: '' },
        
        // Tiết 5
        { period: 5, day: 'hai', subject: 'Tin', teacher: 'Nguyễn Hồng Nhung', class: 'subject-tin' },
        { period: 5, day: 'ba', subject: 'Văn', teacher: 'Nguyễn Văn Thị', class: 'subject-van' },
        { period: 5, day: 'tư', subject: 'CN(CN)', teacher: 'Trần Lâm Tùng', class: 'subject-cn' },
        { period: 5, day: 'năm', subject: 'GDKT&PL', teacher: 'Nguyễn Thị Cước', class: 'subject-gdktpl' },
        { period: 5, day: 'sáu', subject: 'SHCN', teacher: 'Võ Thanh Phong', class: 'subject-shcn' },
        { period: 5, day: 'bảy', subject: '-', teacher: '', class: '' }
    ],
    
    // Thời khóa biểu buổi chiều
    afternoon: [
        // Tiết 2
        { period: 2, day: 'hai', subject: '-', teacher: '', class: '' },
        { period: 2, day: 'ba', subject: 'Sử', teacher: 'Bùi Văn Lới', class: 'subject-su' },
        { period: 2, day: 'tư', subject: 'Văn', teacher: 'Nguyễn Văn Thị', class: 'subject-van' },
        { period: 2, day: 'năm', subject: 'Toán', teacher: 'Võ Thanh Phong', class: 'subject-toan' },
        { period: 2, day: 'sáu', subject: 'GDTC', teacher: 'Trương Hoàng Em', class: 'subject-gdtc' },
        { period: 2, day: 'bảy', subject: '-', teacher: '', class: '' },
        
        // Tiết 3
        { period: 3, day: 'hai', subject: '-', teacher: '', class: '' },
        { period: 3, day: 'ba', subject: 'Sử', teacher: 'Bùi Văn Lới', class: 'subject-su' },
        { period: 3, day: 'tư', subject: 'Văn', teacher: 'Nguyễn Văn Thị', class: 'subject-van' },
        { period: 3, day: 'năm', subject: 'Toán', teacher: 'Võ Thanh Phong', class: 'subject-toan' },
        { period: 3, day: 'sáu', subject: 'GDTC', teacher: 'Trương Hoàng Em', class: 'subject-gdtc' },
        { period: 3, day: 'bảy', subject: '-', teacher: '', class: '' },
        
        // Tiết 4
        { period: 4, day: 'hai', subject: 'GDHN', teacher: 'Phạm Thị Minh Châu', class: 'subject-gdhn' },
        { period: 4, day: 'ba', subject: 'GDKT&PL', teacher: 'Nguyễn Thị Cước', class: 'subject-gdktpl' },
        { period: 4, day: 'tư', subject: 'Địa', teacher: 'Lê Ngọc Lài', class: 'subject-dia' },
        { period: 4, day: 'năm', subject: 'Anh', teacher: 'Nguyễn Thanh Tuyền', class: 'subject-anh' },
        { period: 4, day: 'sáu', subject: 'GDQP', teacher: 'Lê Minh Tuấn', class: 'subject-gdqp' },
        { period: 4, day: 'bảy', subject: '-', teacher: '', class: '' },
        
        // Tiết 5
        { period: 5, day: 'hai', subject: 'GDHN', teacher: 'Phạm Thị Minh Châu', class: 'subject-gdhn' },
        { period: 5, day: 'ba', subject: 'GDKT&PL', teacher: 'Nguyễn Thị Cước', class: 'subject-gdktpl' },
        { period: 5, day: 'tư', subject: 'Địa', teacher: 'Lê Ngọc Lài', class: 'subject-dia' },
        { period: 5, day: 'năm', subject: 'Anh', teacher: 'Nguyễn Thanh Tuyền', class: 'subject-anh' },
        { period: 5, day: 'sáu', subject: 'GDQP', teacher: 'Lê Minh Tuấn', class: 'subject-gdqp' },
        { period: 5, day: 'bảy', subject: '-', teacher: '', class: '' }
    ]
};

// ============================================
// THÔNG TIN THI CỬ
// ============================================
const EXAM_INFO = {
    hk1Date: '29/12/2025', // Ngày thi học kỳ 1
    hk1DateFull: '2025-12-29', // Format đầy đủ cho countdown
    hk1Title: 'Thi học kỳ 1'
};

// ============================================
// THÔNG TIN KHÁC
// ============================================
const OTHER_INFO = {
    // Thông tin hiển thị trong soyeulilich.html
    soyeulilich: {
        className: '12C1',
        gvcnDisplay: 'Thầy Phong Math',
        gvcnPhone: '0382311919'
    },
    
    // Thông tin hiển thị trong thankyou-syll.html
    thankyouMessage: 'Gửi Thành công rồi. GVCN: Thầy Phong Math!'
};

// ============================================
// EXPORT (nếu sử dụng module)
// ============================================
// Nếu cần sử dụng trong môi trường module:
// export { CLASS_INFO, GVCN_INFO, STUDENTS, TIMETABLE, EXAM_INFO, OTHER_INFO };

