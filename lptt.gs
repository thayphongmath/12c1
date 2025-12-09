function doGet(e) {
  Logger.log('doGet called with params: ' + JSON.stringify(e.parameter || {}));
  try {
    var template = HtmlService.createTemplateFromFile('lptt');
    return template.evaluate()
        .setTitle('Thi Đua Lớp Phó Trật Tự (LPTT)')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (error) {
    Logger.log('Error loading lptt.html: ' + error.message);
    return ContentService
        .createTextOutput('Lỗi: Không tìm thấy tệp HTML lptt. Vui lòng kiểm tra Project Explorer.')
        .setMimeType(ContentService.MimeType.TEXT);
  }
}

function doPost(e) {
  try {
    var data = e.parameter;
    var action = data.action;
    var week = data.week;
    Logger.log('doPost called with data: ' + JSON.stringify(data));

    var sheet = SpreadsheetApp.openById('1GS3QKu5Bbeoef0rQhkitX_dawnwqlRPdeUaCNKV8cJk').getSheetByName('LPTT');

    if (data.password !== 'lopphottrattu') {
      Logger.log('Error: Incorrect password in doPost');
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
  } catch (error) {
    Logger.log('Error in doPost: ' + error.message);
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', message: error.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}