function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('CSV Import')
    .addItem('Import CSV', 'showDialog')
    .addToUi();
}

function showDialog() {
  var htmlOutput = HtmlService.createHtmlOutputFromFile('CSVImportDialog')
    .setWidth(400)
    .setHeight(400);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Import CSV');
}

function parseCSV(csvData) {
  var csvDataArray = Utilities.parseCsv(csvData);
  var headerRow = csvDataArray[0];
  return headerRow;
}

function getSheetNames() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = spreadsheet.getSheets();
  var sheetNames = [];
  for (var i = 0; i < sheets.length; i++) {
    sheetNames.push(sheets[i].getName());
  }
  return sheetNames;
}

function importCSV(csvData, selectedColumns, filter, destinationSheet) {
  var csvDataArray = Utilities.parseCsv(csvData);

  // Apply filters
  if (filter) {
    csvDataArray = csvDataArray.filter(function (row) {
      return row.join(',').toLowerCase().includes(filter.toLowerCase());
    });
  }

  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  if (destinationSheet === 'new') {
    // Create a new sheet if selected
    var newSheet = spreadsheet.insertSheet('Imported Data');
  } else {
    // Otherwise, select the existing sheet
    var newSheet = spreadsheet.getSheetByName(destinationSheet);
  }

  // If columns are selected, create a new column for each selected column
  if (selectedColumns.length > 0) {
    selectedColumns.forEach(function (columnName) {
      var columnIndex = csvDataArray[0].indexOf(columnName);
      if (columnIndex !== -1) {
        var columnData = csvDataArray.map(function (row) {
          return [row[columnIndex]];
        });
        newSheet.getRange(1, newSheet.getLastColumn() + 1, csvDataArray.length, 1).setValues(columnData);
      }
    });
  }
}
