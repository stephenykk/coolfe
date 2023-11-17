npm home exceljs
===

[exceljs中文文档|exceljs js中文教程|解析 | npm中文文档](http://www.npmdoc.org/exceljszhongwenwendangexceljs-jszhongwenjiaochengjiexi.html)

const ExcelJs = require('exceljs')
const workbook = new ExcelJs.Workbook()
addWorksheet()
removeWorksheet()
getWorksheet()
workbook.eachWorksheet()


worksheet {  id, name, columns: Array<{header, key, width}> }

worksheet.columns = [{}, ...]
worksheet.getColumn(1).values = [....]

worksheet.addRow({id, username, age})
worksheet.addRow([...])
worksheet.addRows(rows)
worksheet.getRow(n)
worksheet.lastRow

row.height = 43
row.hidden = true

worksheet.getRow(1).values
row.getCell(1).value = 100
row.getCell('user').value = 'alice'
row.getCell('C').value = new Date()

worksheet.getCell('C3')

cell.value = new Date(2020, 10, 10)



worksheet.eachRow(fn)
worksheet.eachRow({ includeEmpty: true }, fn(row, index){})

row.eachCell(fn(cell, index){})
row.eachCell({ includeEmpty: true}, fn(cell, index))

worksheet.spliceRows(2,3)
worksheetp.spliceRows(3, 1, [1, 'alice', 12], [2, 'lucy', 23])

row.splice(3, 2)  // delete some cells
row.splice(3, 1, 'newVal1', 'newVal2')

row.commit() // commit whole row to stream
row.cellCount
row.actualCellCount



worksheet.mergeCells('A4:B5')
worksheet.getCell('H3').value = 'Hello World'

workbook.xls.readFile(filename).then(() => {
  workbook.worksheets // all worksheets
})

workbook.xlsx.writeFile('demo.xlsx').then(console.log.bind(console, 'done'))

worksheet.getRow(2).font = { color: '00ff0000', size: 20, family: 4 }
worksheet.getCell('A1').alignment = { vertical: 'top', horizontal: 'left'}
worksheet.getCell('B3').alignment = { wrapText: true }
worksheet.getCell('C1').alignment = { indent: 1 }
worksheet.getCell('A3').alignment = { textRotation: 30 } // rotate text

worksheet.getCell('L3').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

worksheet.getCell('A3').border = {
 top:{ style: 'thin' },
 left: { style:'thin'},
 bottom: { style:'thin' },
 right: { style: 'thin' }
}

worksheet.getCell('C3').fill = { type:'pattern', pattern: 'solid', fgColor: { argb: 'ff334499'} }


