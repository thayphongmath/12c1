function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetLyLich1 = ss.getSheetByName('LyLich1');
  var sheetLyLich2 = ss.getSheetByName('LyLich2');
  var p = e.parameters;

  var action = (p.action && p.action[0]) || 'add';
  var ttInput = p.tt ? parseInt(p.tt[0], 10) : NaN;
  if (!ttInput || ttInput <= 0) {
    return errorResp('Vui lòng nhập số thứ tự (TT) hợp lệ.');
  }

  // Hàng bắt đầu từ row 7, TT=1
  var targetRow = ttInput + 6;

  // Hàm lấy giá trị đầu vào an toàn
  function val(name) {
    return p[name] ? p[name][0] : '';
  }

  // Hàm xử lý x/checkbox
  function flag(condition) {
    return condition ? 'x' : '';
  }

  // Fetch current data for edit/fetch
  var current1 = sheetLyLich1.getRange(targetRow, 1, 1, 17).getValues()[0];
  var current2 = sheetLyLich2.getRange(targetRow, 1, 1, 19).getValues()[0];

  if (action === 'fetch') {
    if (!current1[0]) {
      return errorResp('Không tìm thấy TT ' + ttInput);
    }
    return okResp({
      lylich1: current1,
      lylich2: current2
    });
  }

  // Format phone to keep leading zero
  function formatPhone(v) {
    if (!v) return '';
    return v.startsWith("'") ? v : "'" + v;
  }

  // Build new rows (add or edit)
  var lyLich1Data = [
    ttInput,
    choose(val('fullName'), current1[1], action),
    choose(val('birthDate'), current1[2], action),
    choose(val('birthPlace'), current1[3], action),
    choose(flag(val('gender') === 'Nữ'), current1[4], action),
    choose(val('ethnicity'), current1[5], action),
    choose(val('policy'), current1[6], action),
    choose(val('addressGroup'), current1[7], action),
    choose(val('addressWard'), current1[8], action),
    choose(val('addressProvince'), current1[9], action),
    choose(val('fatherName'), current1[10], action),
    choose(val('fatherJob'), current1[11], action),
    choose(val('motherName'), current1[12], action),
    choose(val('motherJob'), current1[13], action),
    choose(formatPhone(val('contactPhone')), current1[14], action),
    choose(val('conduct'), current1[15], action),
    choose(val('academic'), current1[16], action),
    choose(val('classRole'), current1[17], action)
  ];

  // Transport & onlineLearning: only one choice, if provided overwrite all
  var transport = val('transport');
  var onlineLearning = val('onlineLearning');

  var lyLich2Data = [
    ttInput,
    choose(val('fullName'), current2[1], action),
    choose(val('birthDate'), current2[2], action),
    choose(val('birthPlace'), current2[3], action),
    choose(val('email'), current2[4], action),
    choose(val('idNumber'), current2[5], action),
    choose(formatPhone(val('studentPhone')), current2[6], action),
    choose(val('weight'), current2[7], action),
    choose(val('height'), current2[8], action),
    choose(flag(val('canSwim') === 'on'), current2[9], action),
    choose(val('eyeDisease'), current2[10], action),
    choose(val('medicalHistory'), current2[11], action),
    // transport: xe đạp, xe máy, khác
    transport ? flag(transport === 'Xe Đạp') : current2[12],
    transport ? flag(transport === 'Xe Máy/Máy Điện') : current2[13],
    transport ? flag(transport === 'Khác') : current2[14],
    // online learning
    onlineLearning ? flag(onlineLearning === 'Đủ ĐK Học') : current2[15],
    onlineLearning ? flag(onlineLearning === 'Không Đủ ĐK') : current2[16],
    onlineLearning ? flag(onlineLearning === 'Có Thể Nhờ Bạn') : current2[17],
    choose(val('notes'), current2[18], action)
  ];

  // Với action add: nếu hàng đã có dữ liệu thì chặn
  if (action === 'add' && current1[0]) {
    return errorResp('TT ' + ttInput + ' đã có dữ liệu. Chọn Chỉnh sửa hoặc dùng TT khác.');
  }

  // Ghi dữ liệu
  sheetLyLich1.getRange(targetRow, 1, 1, lyLich1Data.length).setValues([lyLich1Data]);
  sheetLyLich2.getRange(targetRow, 1, 1, lyLich2Data.length).setValues([lyLich2Data]);

  return okResp({ tt: ttInput });
}

function choose(newVal, oldVal, action) {
  if (action === 'add') return newVal || oldVal;
  // edit: chỉ ghi khi có dữ liệu mới (không tính chuỗi rỗng)
  return (newVal !== undefined && newVal !== '') ? newVal : oldVal;
}

function okResp(data) {
  return ContentService.createTextOutput(JSON.stringify({ result: 'success', data: data }))
    .setMimeType(ContentService.MimeType.JSON);
}

function errorResp(message) {
  return ContentService.createTextOutput(JSON.stringify({ result: 'error', message: message }))
    .setMimeType(ContentService.MimeType.JSON);
}