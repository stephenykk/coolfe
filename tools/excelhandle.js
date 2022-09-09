const ExcelJs = require('exceljs')
const path = require('path')
// const workbook = new ExcelJs.Workbook()
// const sheet = workbook.addWorksheet('my-new-sheet')
// console.log("🚀 ~ file: excelhandle.js ~ line 4 ~ sheet", sheet)

async function main() {
    const workbook = new ExcelJs.Workbook()
    console.log('before read file');
    await workbook.xlsx.readFile(path.join(__dirname, './demo.xlsx'))
    workbook.eachSheet((worksheet, sheetId) => {
        console.log("🚀 ~ file: excelhandle.js ~ line 10 ~ workbook.eachSheet ~ worksheet, sheetId", worksheet, sheetId)
        
    })

    const lastWorksheet = workbook.worksheets[1]
    const rowIdx = lastWorksheet.actualRowCount + 1
    console.log(typeof workbook.eachSheet);
}

main()