function doGet() {
  return HtmlService.createHtmlOutputFromFile('tt_form')
      .setTitle('Thi Đua Tổ (TT1-TT4)');
}

function doPost(e) {
  var teamPasswords = {
    'TT1': 'totruong1',
    'TT2': 'totruong2',
    'TT3': 'totruong3',
    'TT4': 'totruong4'
  };

  var team = e.parameter.team;
  var password = e.parameter.password;
  var action = e.parameter.action;
  var week = e.parameter.week;
  var week_date_range = e.parameter.week_date_range;
  var not_prepared_names = e.parameter.not_prepared_names;
  var not_prepared_count = e.parameter.not_prepared_count;
  var no_homework_names = e.parameter.no_homework_names;
  var no_homework_count = e.parameter.no_homework_count;
  var disorder_names = e.parameter.disorder_names;
  var disorder_count = e.parameter.disorder_count;
  var late_names = e.parameter.late_names;
  var late_count = e.parameter.late_count;
  var violation_names = e.parameter.violation_names;
  var violation_count = e.parameter.violation_count;
  var absent_names = e.parameter.absent_names;
  var absent_count = e.parameter.absent_count;
  var good_points_names = e.parameter.good_points_names;
  var good_points_count = e.parameter.good_points_count;
  var participation_names = e.parameter.participation_names;
  var participation_count = e.parameter.participation_count;

  // Kiểm tra mật khẩu theo tổ
  if (!team || !teamPasswords[team] || password !== teamPasswords[team]) {
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      message: 'Mật khẩu không đúng'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(team);
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      message: 'Không tìm thấy sheet cho tổ: ' + team
    })).setMimeType(ContentService.MimeType.JSON);
  }

  if (action === 'add') {
    // Kiểm tra tuần đã tồn tại
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == week) {
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
    var data = sheet.getDataRange().getValues();
    var rowIndex = -1;
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == week) {
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
    var data = sheet.getDataRange().getValues();
    var rowIndex = -1;
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == week) {
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

function appendData(existing, newData) {
  if (!newData) return existing;
  if (!existing) return newData;
  return existing + ', ' + newData;
}