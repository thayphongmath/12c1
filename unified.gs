// ============================================
// UNIFIED GOOGLE APPS SCRIPT
// Gộp tất cả các chức năng: LT, LPHT, LPLD, LPTT, LPPT, TT, ThuQuy
// Spreadsheet ID: 1YKNvKQoaYR2-OV1k6JvZlmPF63GdMPacuw602LKPtx8
// ============================================

// Spreadsheet ID mới
var SPREADSHEET_ID = '1YKNvKQoaYR2-OV1k6JvZlmPF63GdMPacuw602LKPtx8';

// Mật khẩu cho từng form
var PASSWORDS = {
  'LT': 'loptruong',
  'LPHT': 'lopphohoctap',
  'LPLD': 'loppholaodong',
  'LPTT': 'lopphottrattu',
  'LPPT': 'lopphongphongtrao',
  'TT1': 'totruong1',
  'TT2': 'totruong2',
  'TT3': 'totruong3',
  'TT4': 'totruong4',
  'ThuQuy': 'thuquy123'
};

// ============================================
// doGet - Xử lý GET request để hiển thị form
// ============================================
function doGet(e) {
  Logger.log('doGet called with params: ' + JSON.stringify(e.parameter || {}));
  
  var formType = e.parameter ? e.parameter.form : null;
  
  try {
    var template, title;
    
    switch(formType) {
      case 'lt':
        template = HtmlService.createTemplateFromFile('lt');
        title = 'Thi Đua Lớp Trưởng (LT)';
        break;
      case 'lpht':
        template = HtmlService.createTemplateFromFile('lpht');
        title = 'Thi Đua Lớp Phó Học Tập (LPHT)';
        break;
      case 'lpld':
        template = HtmlService.createTemplateFromFile('lpld');
        title = 'Thi Đua Lớp Phó Lao Động (LPLD)';
        break;
      case 'lptt':
        template = HtmlService.createTemplateFromFile('lptt');
        title = 'Thi Đua Lớp Phó Trật Tự (LPTT)';
        break;
      case 'lppt':
        template = HtmlService.createTemplateFromFile('lppt');
        title = 'Thi Đua Lớp Phó Phong Trào (LPPT)';
        break;
      case 'thuquy':
        template = HtmlService.createTemplateFromFile('thuquy');
        title = 'Quản Lý Thủ Quỹ';
        break;
      case 'tt':
      default:
        // Mặc định là form TT
        return HtmlService.createHtmlOutputFromFile('tt_form')
            .setTitle('Thi Đua Tổ (TT1-TT4)');
    }
    
    return template.evaluate()
        .setTitle(title)
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (error) {
    Logger.log('Error loading template: ' + error.message);
    return ContentService
        .createTextOutput('Lỗi: Không tìm thấy tệp HTML. Vui lòng kiểm tra Project Explorer.')
        .setMimeType(ContentService.MimeType.TEXT);
  }
}

// ============================================
// doPost - Xử lý POST request từ tất cả các form
// ============================================
function doPost(e) {
  try {
    var data = e.parameter;
    Logger.log('doPost called with data: ' + JSON.stringify(data));
    
    // Xác định loại form dựa trên dữ liệu nhận được
    var formType = determineFormType(data);
    
    if (!formType) {
      return ContentService.createTextOutput(
        JSON.stringify({ result: 'error', message: 'Không xác định được loại form' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Xử lý theo từng loại form
    switch(formType) {
      case 'LT':
        return handleLT(data);
      case 'LPHT':
        return handleLPHT(data);
      case 'LPLD':
        return handleLPLD(data);
      case 'LPTT':
        return handleLPTT(data);
      case 'LPPT':
        return handleLPPT(data);
      case 'TT':
        return handleTT(data);
      case 'ThuQuy':
        return handleThuQuy(data);
      default:
        return ContentService.createTextOutput(
          JSON.stringify({ result: 'error', message: 'Loại form không hợp lệ' })
        ).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    Logger.log('Error in doPost: ' + error.message);
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', message: error.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// Hàm xác định loại form
// ============================================
function determineFormType(data) {
  // Nếu có team parameter
  if (data.team) {
    if (data.team === 'ThuQuy') {
      return 'ThuQuy';
    }
    if (data.team === 'TT1' || data.team === 'TT2' || data.team === 'TT3' || data.team === 'TT4') {
      return 'TT';
    }
  }
  
  // Kiểm tra password để xác định form
  var password = data.password;
  if (!password) return null;
  
  for (var key in PASSWORDS) {
    if (PASSWORDS[key] === password) {
      if (key.startsWith('TT')) return 'TT';
      return key;
    }
  }
  
  return null;
}

// ============================================
// Xử lý form LT (Lớp Trưởng)
// ============================================
function handleLT(data) {
  var action = data.action;
  var week = data.week;
  
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('LT');
  
  if (data.password !== PASSWORDS['LT']) {
    Logger.log('Error: Incorrect password in handleLT');
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', message: 'Mật khẩu không đúng' })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  var rowIndex = -1;
  for (var i = 0; i < values.length; i++) {
    if (values[i][0].toString() === week.toString()) {
      rowIndex = i + 1;
      break;
    }
  }
  
  if (rowIndex === -1) {
    Logger.log('Error: Week ' + week + ' not found in LT sheet');
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', message: 'Không tìm thấy tuần ' + week + ' trong sheet LT.' })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  
  var fromToDateValue = values[rowIndex - 1][1];
  var hasData = fromToDateValue && fromToDateValue.toString().trim() !== '';
  
  var currentRow = values[rowIndex - 1];
  var formData = {
    notice_guild: data.notice_guild || '',
    absent_student: data.absent_student || '',
    late_student: data.late_student || '',
    violation_guild: data.violation_guild || '',
    future_plan: data.future_plan || ''
  };
  
  if (action === 'add') {
    if (hasData) {
      Logger.log('Error: Data exists for week ' + week);
      return ContentService.createTextOutput(
        JSON.stringify({ result: 'error', message: 'Dữ liệu cho tuần ' + week + ' đã tồn tại. Vui lòng chọn "Chỉnh sửa" hoặc "Bổ sung".' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    var rowData = [
      week,
      data.week_date_range || '',
      formData.notice_guild,
      formData.absent_student,
      formData.late_student,
      formData.violation_guild,
      formData.future_plan
    ];
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    Logger.log('Added new data for week ' + week);
  } else if (action === 'edit') {
    if (!hasData) {
      Logger.log('Error: No data to edit for week ' + week);
      return ContentService.createTextOutput(
        JSON.stringify({ result: 'error', message: 'Không có dữ liệu để chỉnh sửa cho tuần ' + week + '. Vui lòng chọn "Ghi mới".' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    var rowData = [
      week,
      data.week_date_range || '',
      formData.notice_guild,
      formData.absent_student,
      formData.late_student,
      formData.violation_guild,
      formData.future_plan
    ];
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    Logger.log('Edited data for week ' + week);
  } else if (action === 'append') {
    if (!hasData) {
      Logger.log('Error: No data to append for week ' + week);
      return ContentService.createTextOutput(
        JSON.stringify({ result: 'error', message: 'Không có dữ liệu để bổ sung cho tuần ' + week + '. Vui lòng chọn "Ghi mới".' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    var updatedRow = currentRow.slice();
    updatedRow[0] = currentRow[0];
    updatedRow[1] = currentRow[1];
    if (formData.notice_guild) {
      updatedRow[2] = currentRow[2] ? currentRow[2] + ', ' + formData.notice_guild : formData.notice_guild;
    }
    if (formData.absent_student) {
      updatedRow[3] = currentRow[3] ? currentRow[3] + ', ' + formData.absent_student : formData.absent_student;
    }
    if (formData.late_student) {
      updatedRow[4] = currentRow[4] ? currentRow[4] + ', ' + formData.late_student : formData.late_student;
    }
    if (formData.violation_guild) {
      updatedRow[5] = currentRow[5] ? currentRow[5] + ', ' + formData.violation_guild : formData.violation_guild;
    }
    if (formData.future_plan) {
      updatedRow[6] = currentRow[6] ? currentRow[6] + ', ' + formData.future_plan : formData.future_plan;
    }
    sheet.getRange(rowIndex, 1, 1, updatedRow.length).setValues([updatedRow]);
    Logger.log('Appended data for week ' + week);
  } else {
    Logger.log('Error: Invalid action ' + action);
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', message: 'Hành động không hợp lệ. Vui lòng chọn "Ghi mới", "Bổ sung" hoặc "Chỉnh sửa".' })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(
    JSON.stringify({ result: 'success' })
  ).setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// Xử lý form LPHT (Lớp Phó Học Tập)
// ============================================
function handleLPHT(data) {
  var action = data.action;
  var week = data.week;
  
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('LPHT');
  
  if (data.password !== PASSWORDS['LPHT']) {
    Logger.log('Error: Incorrect password in handleLPHT');
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', message: 'Mật khẩu không đúng' })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  var rowIndex = -1;
  for (var i = 0; i < values.length; i++) {
    if (values[i][0].toString() === week.toString()) {
      rowIndex = i + 1;
      break;
    }
  }
  
  if (rowIndex === -1) {
    Logger.log('Error: Week ' + week + ' not found in LPHT sheet');
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', message: 'Không tìm thấy tuần ' + week + ' trong sheet LPHT.' })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  
  var fromToDateValue = values[rowIndex - 1][1];
  var hasData = fromToDateValue && fromToDateValue.toString().trim() !== '';
  
  var currentRow = values[rowIndex - 1];
  var formData = {
    good_points: data.good_points || '',
    speaking: data.speaking || '',
    teacher_reminded: data.teacher_reminded || '',
    future_plan: data.future_plan || '',
    suggestions: data.suggestions || ''
  };
  
  if (action === 'add') {
    if (hasData) {
      Logger.log('Error: Data exists for week ' + week);
      return ContentService.createTextOutput(
        JSON.stringify({ result: 'error', message: 'Dữ liệu cho tuần ' + week + ' đã tồn tại. Vui lòng chọn "Chỉnh sửa" hoặc "Bổ sung".' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    var rowData = [
      week,
      data.week_date_range || '',
      formData.good_points,
      formData.speaking,
      formData.teacher_reminded,
      formData.future_plan,
      formData.suggestions
    ];
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    Logger.log('Added new data for week ' + week);
  } else if (action === 'edit') {
    if (!hasData) {
      Logger.log('Error: No data to edit for week ' + week);
      return ContentService.createTextOutput(
        JSON.stringify({ result: 'error', message: 'Không có dữ liệu để chỉnh sửa cho tuần ' + week + '. Vui lòng chọn "Ghi mới".' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    var rowData = [
      week,
      data.week_date_range || '',
      formData.good_points,
      formData.speaking,
      formData.teacher_reminded,
      formData.future_plan,
      formData.suggestions
    ];
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    Logger.log('Edited data for week ' + week);
  } else if (action === 'append') {
    if (!hasData) {
      Logger.log('Error: No data to append for week ' + week);
      return ContentService.createTextOutput(
        JSON.stringify({ result: 'error', message: 'Không có dữ liệu để bổ sung cho tuần ' + week + '. Vui lòng chọn "Ghi mới".' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    var updatedRow = currentRow.slice();
    updatedRow[0] = currentRow[0];
    updatedRow[1] = currentRow[1];
    if (formData.good_points) {
      updatedRow[2] = currentRow[2] ? currentRow[2] + ', ' + formData.good_points : formData.good_points;
    }
    if (formData.speaking) {
      updatedRow[3] = currentRow[3] ? currentRow[3] + ', ' + formData.speaking : formData.speaking;
    }
    if (formData.teacher_reminded) {
      updatedRow[4] = currentRow[4] ? currentRow[4] + ', ' + formData.teacher_reminded : formData.teacher_reminded;
    }
    if (formData.future_plan) {
      updatedRow[5] = currentRow[5] ? currentRow[5] + ', ' + formData.future_plan : formData.future_plan;
    }
    if (formData.suggestions) {
      updatedRow[6] = currentRow[6] ? currentRow[6] + ', ' + formData.suggestions : formData.suggestions;
    }
    sheet.getRange(rowIndex, 1, 1, updatedRow.length).setValues([updatedRow]);
    Logger.log('Appended data for week ' + week);
  } else {
    Logger.log('Error: Invalid action ' + action);
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', message: 'Hành động không hợp lệ. Vui lòng chọn "Ghi mới", "Bổ sung" hoặc "Chỉnh sửa".' })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(
    JSON.stringify({ result: 'success' })
  ).setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// Xử lý form LPLD (Lớp Phó Lao Động)
// ============================================
function handleLPLD(data) {
  var action = data.action;
  var week = data.week;
  
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('LPLD');
  
  if (data.password !== PASSWORDS['LPLD']) {
    Logger.log('Error: Incorrect password in handleLPLD');
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', message: 'Mật khẩu không đúng' })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  var rowIndex = -1;
  for (var i = 0; i < values.length; i++) {
    if (values[i][0].toString() === week.toString()) {
      rowIndex = i + 1;
      break;
    }
  }
  
  if (rowIndex === -1) {
    Logger.log('Error: Week ' + week + ' not found in LPLD sheet');
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', message: 'Không tìm thấy tuần ' + week + ' trong sheet LPLD.' })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  
  var fromToDateValue = values[rowIndex - 1][1];
  var hasData = fromToDateValue && fromToDateValue.toString().trim() !== '';
  
  var currentRow = values[rowIndex - 1];
  var formData = {
    cleaning_team: data.cleaning_team || '',
    chair_team: data.chair_team || '',
    monday: data.monday || '',
    tuesday: data.tuesday || '',
    wednesday: data.wednesday || '',
    thursday: data.thursday || '',
    friday: data.friday || '',
    saturday: data.saturday || '',
    late_duty: data.late_duty || '',
    feedback: data.feedback || ''
  };
  
  if (action === 'add') {
    if (hasData) {
      Logger.log('Error: Data exists for week ' + week);
      return ContentService.createTextOutput(
        JSON.stringify({ result: 'error', message: 'Dữ liệu cho tuần ' + week + ' đã tồn tại. Vui lòng chọn "Chỉnh sửa" hoặc "Bổ sung".' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    var rowData = [
      week,
      data.week_date_range || '',
      formData.cleaning_team,
      formData.chair_team,
      formData.monday,
      formData.tuesday,
      formData.wednesday,
      formData.thursday,
      formData.friday,
      formData.saturday,
      formData.late_duty,
      formData.feedback
    ];
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    Logger.log('Added new data for week ' + week);
  } else if (action === 'edit') {
    if (!hasData) {
      Logger.log('Error: No data to edit for week ' + week);
      return ContentService.createTextOutput(
        JSON.stringify({ result: 'error', message: 'Không có dữ liệu để chỉnh sửa cho tuần ' + week + '. Vui lòng chọn "Ghi mới".' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    var rowData = [
      week,
      data.week_date_range || '',
      formData.cleaning_team,
      formData.chair_team,
      formData.monday,
      formData.tuesday,
      formData.wednesday,
      formData.thursday,
      formData.friday,
      formData.saturday,
      formData.late_duty,
      formData.feedback
    ];
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    Logger.log('Edited data for week ' + week);
  } else if (action === 'append') {
    if (!hasData) {
      Logger.log('Error: No data to append for week ' + week);
      return ContentService.createTextOutput(
        JSON.stringify({ result: 'error', message: 'Không có dữ liệu để bổ sung cho tuần ' + week + '. Vui lòng chọn "Ghi mới".' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    var updatedRow = currentRow.slice();
    updatedRow[0] = currentRow[0];
    updatedRow[1] = currentRow[1];
    if (formData.cleaning_team) {
      updatedRow[2] = currentRow[2] ? currentRow[2] + ', ' + formData.cleaning_team : formData.cleaning_team;
    }
    if (formData.chair_team) {
      updatedRow[3] = currentRow[3] ? currentRow[3] + ', ' + formData.chair_team : formData.chair_team;
    }
    if (formData.monday) {
      updatedRow[4] = currentRow[4] ? currentRow[4] + ', ' + formData.monday : formData.monday;
    }
    if (formData.tuesday) {
      updatedRow[5] = currentRow[5] ? currentRow[5] + ', ' + formData.tuesday : formData.tuesday;
    }
    if (formData.wednesday) {
      updatedRow[6] = currentRow[6] ? currentRow[6] + ', ' + formData.wednesday : formData.wednesday;
    }
    if (formData.thursday) {
      updatedRow[7] = currentRow[7] ? currentRow[7] + ', ' + formData.thursday : formData.thursday;
    }
    if (formData.friday) {
      updatedRow[8] = currentRow[8] ? currentRow[8] + ', ' + formData.friday : formData.friday;
    }
    if (formData.saturday) {
      updatedRow[9] = currentRow[9] ? currentRow[9] + ', ' + formData.saturday : formData.saturday;
    }
    if (formData.late_duty) {
      updatedRow[10] = currentRow[10] ? currentRow[10] + ', ' + formData.late_duty : formData.late_duty;
    }
    if (formData.feedback) {
      updatedRow[11] = currentRow[11] ? currentRow[11] + ', ' + formData.feedback : formData.feedback;
    }
    sheet.getRange(rowIndex, 1, 1, updatedRow.length).setValues([updatedRow]);
    Logger.log('Appended data for week ' + week);
  } else {
    Logger.log('Error: Invalid action ' + action);
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', message: 'Hành động không hợp lệ. Vui lòng chọn "Ghi mới", "Bổ sung" hoặc "Chỉnh sửa".' })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(
    JSON.stringify({ result: 'success' })
  ).setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// Xử lý form LPTT (Lớp Phó Trật Tự)
// ============================================
function handleLPTT(data) {
  var action = data.action;
  var week = data.week;
  
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('LPTT');
  
  if (data.password !== PASSWORDS['LPTT']) {
    Logger.log('Error: Incorrect password in handleLPTT');
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', message: 'Mật khẩu không đúng' })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  var rowIndex = -1;
  for (var i = 0; i < values.length; i++) {
    if (values[i][0].toString() === week.toString()) {
      rowIndex = i + 1;
      break;
    }
  }
  
  if (rowIndex === -1) {
    Logger.log('Error: Week ' + week + ' not found in LPTT sheet');
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', message: 'Không tìm thấy tuần ' + week + ' trong sheet LPTT.' })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  
  var fromToDateValue = values[rowIndex - 1][1];
  var hasData = fromToDateValue && fromToDateValue.toString().trim() !== '';
  
  var currentRow = values[rowIndex - 1];
  var formData = {
    disorder_not_sdb: data.disorder_not_sdb || '',
    disorder_not_sdb_count: data.disorder_not_sdb_count || '',
    disorder_sdb: data.disorder_sdb || '',
    disorder_sdb_count: data.disorder_sdb_count || '',
    social_media: data.social_media || ''
  };
  
  if (action === 'add') {
    if (hasData) {
      Logger.log('Error: Data exists for week ' + week);
      return ContentService.createTextOutput(
        JSON.stringify({ result: 'error', message: 'Dữ liệu cho tuần ' + week + ' đã tồn tại. Vui lòng chọn "Chỉnh sửa" hoặc "Bổ sung".' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    var rowData = [
      week,
      data.week_date_range || '',
      formData.disorder_not_sdb,
      formData.disorder_not_sdb_count,
      formData.disorder_sdb,
      formData.disorder_sdb_count,
      formData.social_media
    ];
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    Logger.log('Added new data for week ' + week);
  } else if (action === 'edit') {
    if (!hasData) {
      Logger.log('Error: No data to edit for week ' + week);
      return ContentService.createTextOutput(
        JSON.stringify({ result: 'error', message: 'Không có dữ liệu để chỉnh sửa cho tuần ' + week + '. Vui lòng chọn "Ghi mới".' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    var rowData = [
      week,
      data.week_date_range || '',
      formData.disorder_not_sdb,
      formData.disorder_not_sdb_count,
      formData.disorder_sdb,
      formData.disorder_sdb_count,
      formData.social_media
    ];
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    Logger.log('Edited data for week ' + week);
  } else if (action === 'append') {
    if (!hasData) {
      Logger.log('Error: No data to append for week ' + week);
      return ContentService.createTextOutput(
        JSON.stringify({ result: 'error', message: 'Không có dữ liệu để bổ sung cho tuần ' + week + '. Vui lòng chọn "Ghi mới".' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    var updatedRow = currentRow.slice();
    updatedRow[0] = currentRow[0];
    updatedRow[1] = currentRow[1];
    if (formData.disorder_not_sdb) {
      updatedRow[2] = currentRow[2] ? currentRow[2] + ', ' + formData.disorder_not_sdb : formData.disorder_not_sdb;
    }
    if (formData.disorder_not_sdb_count) {
      updatedRow[3] = currentRow[3] ? parseInt(currentRow[3]) + parseInt(formData.disorder_not_sdb_count) : formData.disorder_not_sdb_count;
    }
    if (formData.disorder_sdb) {
      updatedRow[4] = currentRow[4] ? currentRow[4] + ', ' + formData.disorder_sdb : formData.disorder_sdb;
    }
    if (formData.disorder_sdb_count) {
      updatedRow[5] = currentRow[5] ? parseInt(currentRow[5]) + parseInt(formData.disorder_sdb_count) : formData.disorder_sdb_count;
    }
    if (formData.social_media) {
      updatedRow[6] = currentRow[6] ? currentRow[6] + ', ' + formData.social_media : formData.social_media;
    }
    sheet.getRange(rowIndex, 1, 1, updatedRow.length).setValues([updatedRow]);
    Logger.log('Appended data for week ' + week);
  } else {
    Logger.log('Error: Invalid action ' + action);
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', message: 'Hành động không hợp lệ. Vui lòng chọn "Ghi mới", "Bổ sung" hoặc "Chỉnh sửa".' })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(
    JSON.stringify({ result: 'success' })
  ).setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// Xử lý form LPPT (Lớp Phó Phong Trào)
// ============================================
function handleLPPT(data) {
  var action = data.action;
  var week = data.week;
  
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('LPPT');
  
  if (data.password !== PASSWORDS['LPPT']) {
    Logger.log('Error: Incorrect password in handleLPPT');
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', message: 'Mật khẩu không đúng' })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  var rowIndex = -1;
  for (var i = 0; i < values.length; i++) {
    if (values[i][0].toString() === week.toString()) {
      rowIndex = i + 1;
      break;
    }
  }
  
  if (rowIndex === -1) {
    Logger.log('Error: Week ' + week + ' not found in LPPT sheet');
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', message: 'Không tìm thấy tuần ' + week + ' trong sheet LPPT.' })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  
  var fromToDateValue = values[rowIndex - 1][1];
  var hasData = fromToDateValue && fromToDateValue.toString().trim() !== '';
  
  var currentRow = values[rowIndex - 1];
  var formData = {
    campaign_name: data.campaign_name || '',
    implementation_time: data.implementation_time || '',
    progress: data.progress || '',
    assigned_students: data.assigned_students || '',
    competition_date: data.competition_date || '',
    estimated_cost: data.estimated_cost || ''
  };
  
  if (action === 'add') {
    if (hasData) {
      Logger.log('Error: Data exists for week ' + week);
      return ContentService.createTextOutput(
        JSON.stringify({ result: 'error', message: 'Dữ liệu cho tuần ' + week + ' đã tồn tại. Vui lòng chọn "Chỉnh sửa" hoặc "Bổ sung".' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    var rowData = [
      week,
      data.week_date_range || '',
      formData.campaign_name,
      formData.implementation_time,
      formData.progress,
      formData.assigned_students,
      formData.competition_date,
      formData.estimated_cost
    ];
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    Logger.log('Added new data for week ' + week);
  } else if (action === 'edit') {
    if (!hasData) {
      Logger.log('Error: No data to edit for week ' + week);
      return ContentService.createTextOutput(
        JSON.stringify({ result: 'error', message: 'Không có dữ liệu để chỉnh sửa cho tuần ' + week + '. Vui lòng chọn "Ghi mới".' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    var rowData = [
      week,
      data.week_date_range || '',
      formData.campaign_name,
      formData.implementation_time,
      formData.progress,
      formData.assigned_students,
      formData.competition_date,
      formData.estimated_cost
    ];
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    Logger.log('Edited data for week ' + week);
  } else if (action === 'append') {
    if (!hasData) {
      Logger.log('Error: No data to append for week ' + week);
      return ContentService.createTextOutput(
        JSON.stringify({ result: 'error', message: 'Không có dữ liệu để bổ sung cho tuần ' + week + '. Vui lòng chọn "Ghi mới".' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    var updatedRow = currentRow.slice();
    updatedRow[0] = currentRow[0];
    updatedRow[1] = currentRow[1];
    if (formData.campaign_name) {
      updatedRow[2] = currentRow[2] ? currentRow[2] + ', ' + formData.campaign_name : formData.campaign_name;
    }
    if (formData.implementation_time) {
      updatedRow[3] = currentRow[3] ? currentRow[3] + ', ' + formData.implementation_time : formData.implementation_time;
    }
    if (formData.progress) {
      updatedRow[4] = currentRow[4] ? currentRow[4] + ', ' + formData.progress : formData.progress;
    }
    if (formData.assigned_students) {
      updatedRow[5] = currentRow[5] ? currentRow[5] + ', ' + formData.assigned_students : formData.assigned_students;
    }
    if (formData.competition_date) {
      updatedRow[6] = currentRow[6] ? currentRow[6] + ', ' + formData.competition_date : formData.competition_date;
    }
    if (formData.estimated_cost) {
      updatedRow[7] = currentRow[7] ? parseInt(currentRow[7]) + parseInt(formData.estimated_cost) : formData.estimated_cost;
    }
    sheet.getRange(rowIndex, 1, 1, updatedRow.length).setValues([updatedRow]);
    Logger.log('Appended data for week ' + week);
  } else {
    Logger.log('Error: Invalid action ' + action);
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', message: 'Hành động không hợp lệ. Vui lòng chọn "Ghi mới", "Bổ sung" hoặc "Chỉnh sửa".' })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(
    JSON.stringify({ result: 'success' })
  ).setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// Xử lý form TT (Tổ Trưởng - TT1, TT2, TT3, TT4)
// ============================================
function handleTT(data) {
  var team = data.team;
  var password = data.password;
  var action = data.action;
  var week = data.week;
  var week_date_range = data.week_date_range;
  var not_prepared_names = data.not_prepared_names;
  var not_prepared_count = data.not_prepared_count;
  var no_homework_names = data.no_homework_names;
  var no_homework_count = data.no_homework_count;
  var disorder_names = data.disorder_names;
  var disorder_count = data.disorder_count;
  var late_names = data.late_names;
  var late_count = data.late_count;
  var violation_names = data.violation_names;
  var violation_count = data.violation_count;
  var absent_names = data.absent_names;
  var absent_count = data.absent_count;
  var good_points_names = data.good_points_names;
  var good_points_count = data.good_points_count;
  var participation_names = data.participation_names;
  var participation_count = data.participation_count;
  
  // Kiểm tra mật khẩu theo tổ
  if (!team || !PASSWORDS[team] || password !== PASSWORDS[team]) {
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      message: 'Mật khẩu không đúng'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(team);
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      message: 'Không tìm thấy sheet cho tổ: ' + team
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  if (action === 'add') {
    // Kiểm tra tuần đã tồn tại
    var dataValues = sheet.getDataRange().getValues();
    for (var i = 1; i < dataValues.length; i++) {
      if (dataValues[i][0] == week) {
        return ContentService.createTextOutput(JSON.stringify({
          result: 'error',
          message: 'Tuần này đã được ghi. Vui lòng chọn "Chỉnh sửa" hoặc "Bổ sung".'
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Ghi dữ liệu mới
    sheet.appendRow([
      week,
      week_date_range,
      not_prepared_names,
      not_prepared_count,
      no_homework_names,
      no_homework_count,
      disorder_names,
      disorder_count,
      late_names,
      late_count,
      violation_names,
      violation_count,
      absent_names,
      absent_count,
      good_points_names,
      good_points_count,
      participation_names,
      participation_count
    ]);
    
  } else if (action === 'append') {
    // Bổ sung dữ liệu
    var dataValues = sheet.getDataRange().getValues();
    var rowIndex = -1;
    for (var i = 1; i < dataValues.length; i++) {
      if (dataValues[i][0] == week) {
        rowIndex = i + 1;
        break;
      }
    }
    if (rowIndex === -1) {
      return ContentService.createTextOutput(JSON.stringify({
        result: 'error',
        message: 'Không tìm thấy tuần để bổ sung. Vui lòng chọn "Ghi mới".'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var existingData = sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn()).getValues()[0];
    var updatedData = [
      week,
      week_date_range,
      appendData(existingData[2], not_prepared_names),
      (parseInt(existingData[3] || 0) + parseInt(not_prepared_count || 0)).toString(),
      appendData(existingData[4], no_homework_names),
      (parseInt(existingData[5] || 0) + parseInt(no_homework_count || 0)).toString(),
      appendData(existingData[6], disorder_names),
      (parseInt(existingData[7] || 0) + parseInt(disorder_count || 0)).toString(),
      appendData(existingData[8], late_names),
      (parseInt(existingData[9] || 0) + parseInt(late_count || 0)).toString(),
      appendData(existingData[10], violation_names),
      (parseInt(existingData[11] || 0) + parseInt(violation_count || 0)).toString(),
      appendData(existingData[12], absent_names),
      (parseInt(existingData[13] || 0) + parseInt(absent_count || 0)).toString(),
      appendData(existingData[14], good_points_names),
      (parseInt(existingData[15] || 0) + parseInt(good_points_count || 0)).toString(),
      appendData(existingData[16], participation_names),
      (parseInt(existingData[17] || 0) + parseInt(participation_count || 0)).toString()
    ];
    sheet.getRange(rowIndex, 1, 1, updatedData.length).setValues([updatedData]);
    
  } else if (action === 'edit') {
    // Chỉnh sửa dữ liệu
    var dataValues = sheet.getDataRange().getValues();
    var rowIndex = -1;
    for (var i = 1; i < dataValues.length; i++) {
      if (dataValues[i][0] == week) {
        rowIndex = i + 1;
        break;
      }
    }
    if (rowIndex === -1) {
      return ContentService.createTextOutput(JSON.stringify({
        result: 'error',
        message: 'Không tìm thấy tuần để chỉnh sửa. Vui lòng chọn "Ghi mới".'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var updatedData = [
      week,
      week_date_range,
      not_prepared_names || '',
      not_prepared_count || '0',
      no_homework_names || '',
      no_homework_count || '0',
      disorder_names || '',
      disorder_count || '0',
      late_names || '',
      late_count || '0',
      violation_names || '',
      violation_count || '0',
      absent_names || '',
      absent_count || '0',
      good_points_names || '',
      good_points_count || '0',
      participation_names || '',
      participation_count || '0'
    ];
    sheet.getRange(rowIndex, 1, 1, updatedData.length).setValues([updatedData]);
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    result: 'success',
    message: 'Dữ liệu đã được gửi thành công'
  })).setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// Xử lý form ThuQuy (Thủ Quỹ)
// ============================================
function handleThuQuy(data) {
  var action = data.action;
  var week = data.week;
  
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('ThuQuy');
  
  if (data.password !== PASSWORDS['ThuQuy']) {
    Logger.log('Error: Incorrect password in handleThuQuy');
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', message: 'Mật khẩu không đúng' })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  
  // Lấy dữ liệu từ form
  var fee_per_student = parseFloat(data.fee_per_student || 0);
  var quantity_paid = parseInt(data.quantity_paid || 0);
  var missing_students = data.missing_students || '';
  var quantity_missing = parseInt(data.quantity_missing || 0);
  
  // Tính tổng thu tuần này
  var this_week_income = fee_per_student * quantity_paid;
  
  // Lấy các khoản chi
  var expenses = [];
  var total_expense = 0;
  for (var i = 1; i <= 6; i++) {
    var expense_name = data['expense_name_' + i] || '';
    var expense_amount = parseFloat(data['expense_amount_' + i] || 0);
    if (expense_name && expense_amount > 0) {
      expenses.push({ name: expense_name, amount: expense_amount });
      total_expense += expense_amount;
    }
  }
  
  var this_week_expense = total_expense;
  
  // Tìm dòng của tuần hiện tại
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  var rowIndex = -1;
  for (var i = 0; i < values.length; i++) {
    if (values[i][0] && values[i][0].toString() === week.toString()) {
      rowIndex = i + 1;
      break;
    }
  }
  
  // Tính tổng tiền còn lại từ các tuần trước
  var total_remaining_before = 0;
  for (var i = 1; i < values.length; i++) {
    if (i + 1 === rowIndex) continue; // Bỏ qua tuần hiện tại nếu đã tồn tại
    var prev_income = parseFloat(values[i][3] || 0); // Cột tổng thu
    var prev_expense = parseFloat(values[i][4] || 0); // Cột tổng chi
    total_remaining_before += (prev_income - prev_expense);
  }
  
  if (action === 'add') {
    if (rowIndex !== -1) {
      Logger.log('Error: Data exists for week ' + week);
      return ContentService.createTextOutput(
        JSON.stringify({ result: 'error', message: 'Dữ liệu cho tuần ' + week + ' đã tồn tại. Vui lòng chọn "Chỉnh sửa" hoặc "Bổ sung".' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Tìm dòng trống tiếp theo
    rowIndex = values.length + 1;
    
    var rowData = [
      week,
      data.week_date_range || '',
      fee_per_student,
      this_week_income,
      this_week_expense,
      quantity_paid,
      missing_students,
      quantity_missing,
      expenses[0] ? expenses[0].name : '',
      expenses[0] ? expenses[0].amount : 0,
      expenses[1] ? expenses[1].name : '',
      expenses[1] ? expenses[1].amount : 0,
      expenses[2] ? expenses[2].name : '',
      expenses[2] ? expenses[2].amount : 0,
      expenses[3] ? expenses[3].name : '',
      expenses[3] ? expenses[3].amount : 0,
      expenses[4] ? expenses[4].name : '',
      expenses[4] ? expenses[4].amount : 0,
      expenses[5] ? expenses[5].name : '',
      expenses[5] ? expenses[5].amount : 0,
      total_remaining_before + this_week_income - this_week_expense
    ];
    
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    Logger.log('Added new data for week ' + week);
    
  } else if (action === 'edit') {
    if (rowIndex === -1) {
      Logger.log('Error: No data to edit for week ' + week);
      return ContentService.createTextOutput(
        JSON.stringify({ result: 'error', message: 'Không có dữ liệu để chỉnh sửa cho tuần ' + week + '. Vui lòng chọn "Báo cáo mới".' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Tính lại tổng tiền còn lại từ các tuần trước (không tính tuần hiện tại)
    total_remaining_before = 0;
    for (var i = 1; i < values.length; i++) {
      if (i + 1 === rowIndex) continue;
      var prev_income = parseFloat(values[i][3] || 0);
      var prev_expense = parseFloat(values[i][4] || 0);
      total_remaining_before += (prev_income - prev_expense);
    }
    
    var rowData = [
      week,
      data.week_date_range || '',
      fee_per_student,
      this_week_income,
      this_week_expense,
      quantity_paid,
      missing_students,
      quantity_missing,
      expenses[0] ? expenses[0].name : '',
      expenses[0] ? expenses[0].amount : 0,
      expenses[1] ? expenses[1].name : '',
      expenses[1] ? expenses[1].amount : 0,
      expenses[2] ? expenses[2].name : '',
      expenses[2] ? expenses[2].amount : 0,
      expenses[3] ? expenses[3].name : '',
      expenses[3] ? expenses[3].amount : 0,
      expenses[4] ? expenses[4].name : '',
      expenses[4] ? expenses[4].amount : 0,
      expenses[5] ? expenses[5].name : '',
      expenses[5] ? expenses[5].amount : 0,
      total_remaining_before + this_week_income - this_week_expense
    ];
    
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    Logger.log('Edited data for week ' + week);
    
  } else if (action === 'append') {
    if (rowIndex === -1) {
      Logger.log('Error: No data to append for week ' + week);
      return ContentService.createTextOutput(
        JSON.stringify({ result: 'error', message: 'Không có dữ liệu để bổ sung cho tuần ' + week + '. Vui lòng chọn "Báo cáo mới".' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    var currentRow = values[rowIndex - 1];
    var current_income = parseFloat(currentRow[3] || 0);
    var current_expense = parseFloat(currentRow[4] || 0);
    
    // Cập nhật thu (nếu có bổ sung)
    if (fee_per_student > 0 && quantity_paid > 0) {
      var additional_income = fee_per_student * quantity_paid;
      current_income += additional_income;
    }
    
    // Cập nhật chi (nếu có bổ sung)
    var additional_expense = 0;
    for (var i = 0; i < expenses.length; i++) {
      additional_expense += expenses[i].amount;
    }
    current_expense += additional_expense;
    
    // Cập nhật danh sách HS thiếu
    var updated_missing = currentRow[6] || '';
    if (missing_students) {
      updated_missing = updated_missing ? updated_missing + ', ' + missing_students : missing_students;
    }
    var updated_quantity_missing = parseInt(currentRow[7] || 0) + quantity_missing;
    
    // Cập nhật các khoản chi (nối vào các cột tương ứng)
    var updated_expenses = [];
    for (var i = 0; i < 6; i++) {
      var col_name = 8 + i * 2;
      var col_amount = 9 + i * 2;
      var existing_name = currentRow[col_name] || '';
      var existing_amount = parseFloat(currentRow[col_amount] || 0);
      
      if (i < expenses.length && expenses[i].name && expenses[i].amount > 0) {
        updated_expenses.push({
          name: existing_name ? existing_name + ', ' + expenses[i].name : expenses[i].name,
          amount: existing_amount + expenses[i].amount
        });
      } else {
        updated_expenses.push({
          name: existing_name,
          amount: existing_amount
        });
      }
    }
    
    // Tính lại tổng tiền còn lại
    total_remaining_before = 0;
    for (var i = 1; i < values.length; i++) {
      if (i + 1 === rowIndex) continue;
      var prev_income = parseFloat(values[i][3] || 0);
      var prev_expense = parseFloat(values[i][4] || 0);
      total_remaining_before += (prev_income - prev_expense);
    }
    
    var rowData = [
      week,
      currentRow[1] || data.week_date_range || '',
      fee_per_student || currentRow[2] || 0,
      current_income,
      current_expense,
      quantity_paid || currentRow[5] || 0,
      updated_missing,
      updated_quantity_missing,
      updated_expenses[0].name,
      updated_expenses[0].amount,
      updated_expenses[1].name,
      updated_expenses[1].amount,
      updated_expenses[2].name,
      updated_expenses[2].amount,
      updated_expenses[3].name,
      updated_expenses[3].amount,
      updated_expenses[4].name,
      updated_expenses[4].amount,
      updated_expenses[5].name,
      updated_expenses[5].amount,
      total_remaining_before + current_income - current_expense
    ];
    
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    Logger.log('Appended data for week ' + week);
    
    // Cập nhật lại giá trị cho response
    this_week_income = current_income;
    this_week_expense = current_expense;
  } else {
    Logger.log('Error: Invalid action ' + action);
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', message: 'Hành động không hợp lệ. Vui lòng chọn "Báo cáo mới", "Bổ sung" hoặc "Chỉnh sửa".' })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  
  // Tính tổng tiền còn lại sau khi cập nhật
  var final_total_remaining = 0;
  var allValues = sheet.getDataRange().getValues();
  for (var i = 1; i < allValues.length; i++) {
    var prev_income = parseFloat(allValues[i][3] || 0);
    var prev_expense = parseFloat(allValues[i][4] || 0);
    final_total_remaining += (prev_income - prev_expense);
  }
  
  return ContentService.createTextOutput(
    JSON.stringify({
      result: 'success',
      summary: {
        this_week_income: this_week_income,
        this_week_expense: this_week_expense,
        expenses: expenses,
        total_remaining: final_total_remaining
      }
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// Hàm helper để nối dữ liệu
// ============================================
function appendData(existing, newData) {
  if (!newData) return existing;
  if (!existing) return newData;
  return existing + ', ' + newData;
}

