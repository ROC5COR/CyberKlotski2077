function doGet(e) {
  return HtmlService.createHtmlOutputFromFile("index")
}

function addNewRow(rowData) {
  console.log('Have to add new row: ', rowData)
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName("UserData")
  sheet.appendRow(rowData)
}

function getLatestRows(n_rows = 5) {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName("UserData")
  const lastRowAt = sheet.getLastRow()
  console.log("Last row:", lastRowAt)
  let startingRow = lastRowAt - n_rows
  console.log('Starting row: ', startingRow)
  if(startingRow < 1){
    startingRow = 1
  }
  const values = sheet.getSheetValues(startingRow+1, 1, n_rows, 3)
  console.log("Values: ", values)
  return values
}