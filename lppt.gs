function doGet(e) {
  Logger.log('doGet called with params: ' + JSON.stringify(e.parameter || {}));
  try {
    var template = HtmlService.createTemplateFromFile('lppt');
    return template.evaluate()
        .setTitle('Thi Đua Lớp Phó Phong Trào (LPPT)')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (error) {
    Logger.log('Error loading lppt.html: ' + error.message);
    return ContentService
        .createTextOutput('Lỗi: Không tìm thấy tệp HTML lppt. Vui lòng kiểm tra Project Explorer.')
        .setMimeType(ContentService.MimeType.TEXT);
  }
}

function doPost(e) {
  try {
    var data = e.parameter;
    var action = data.action;
    var week = data.week;
    Logger.log('doPost called with data: ' + JSON.stringify(data));

    var sheet = SpreadsheetApp.openById('1GS3QKu5Bbeoef0rQhkitX_dawnwqlRPdeUaCNKV8cJk').getSheetByName('LPPT');

    if (data.password !== 'lopphongphongtrao') {
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
  } catch (error) {
    Logger.log('Error in doPost: ' + error.message);
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', message: error.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}