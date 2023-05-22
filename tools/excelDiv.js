const exceljs = require("exceljs");
const path = require("path");
const fs = require('fs')
const workbook = new exceljs.Workbook();
const { excelFile, outExcelFile } = getExcelFiles()
// const outExcelFile = excelFile;
// const sheet = workbook.addWorksheet('my-new-sheet')
const jsonFile = 'data.json'

function outputData(data) {
  const fpath = path.resolve(__dirname, jsonFile)
  fs.writeFileSync(fpath, JSON.stringify(data, null, 2))
  log('导出json成功', fpath)
}


const dataRowStartIndex = 5; // 数据从哪行开始
let dataRowEndIndex = 341; // 数据从哪行开始

function log(...args) {
  const last = args.pop();
  let isError = false;
  if (last === "throwError") {
    isError = true;
  } else {
    args.push(last);
  }
  console.log("\n[excel-stat] :", ...args, '\n');

  if (isError) {
    throw new Error(args[0]);
  }
}

function getExcelFiles() {
  const files = fs.readdirSync('.')
  const excelFiles = files.filter(fname => /\.xlsx$/.test(fname))
  let excelName = ''
  if (excelFiles.length) {
    excelName = excelFiles.find(fname => fname.match(/zhuhang\.xlsx/i)) || ''
  } else {
    const xlsFiles = files.filter(fname => /\.xls$/.test(fname))
    if (xlsFiles.length) {
      const xlsName = xlsFiles[0]
      log(`不支持 *.xls 文件格式，请打开 ${xlsName} 文件，另存为 ${xlsName.replace(/\.xls$/, '.xlsx')}`, 'throwError')
    } else {
      log(`在当前文件夹未找到excel文件，请复制花名册excel文件到当前文件夹`, 'throwError')
    }
  }

  const excelFile = path.resolve(__dirname, excelName)
  const outExcelFile = path.resolve(__dirname, excelName.replace(/\.xlsx$/, '_OK.xlsx'))
  return { excelFile, outExcelFile }
}

const wanted = []
const part1Rows = []
const part2Rows = []

function start() {
  const dataSheet = workbook.getWorksheet(1);
  const sheet1 = workbook.addWorksheet('part1');
  const sheet2 = workbook.addWorksheet('part2');

  dataSheet.eachRow((row, rowIndex) => {
    // row.values is array start from 1
    // rowIndex >= dataRowStartIndex && data.push(row.values);
    if (rowIndex > dataRowEndIndex && row.getCell('H').value) {
      wanted.push(row.getCell('H').value)
    }
  });

  let isFound = true
  // while(isFound) {
  //   isFound = false
  //   dataSheet.eachRow((row, rowIndex) => {
  //     if (isFound || !row.getCell('H').value) return
  //     if (rowIndex >= dataRowStartIndex && rowIndex <= dataRowEndIndex) {
  //       const value = row.getCell('H').value || ''
  //       const matched = wanted.some(w => value.includes(w))
  //       const rows = matched ? part1Rows : part2Rows
  //       const values = row.values.map(val => val.formula ? val.result : val)
  //       rows.push(values)
  //       isFound = !!matched
  //       if (isFound) {
  //         dataSheet.spliceRows(rowIndex, 1)
  //         console.log("🚀 ~ file: excelDiv.js ~ line 86 ~ dataSheet.eachRow ~ rowIndex", rowIndex, row.getCell('H').value)
  //         dataRowEndIndex--;
  //       }
  //       // if(matched && rows.length < 5) {
  //       //   // dataSheet.removeRow(rowIndex)
  //       //   console.log("🚀 ~ file: excelDiv.js ~ line 79 ~ dataSheet.eachRow ~ row.values", row.values)
          
  //       // }
  //     }
  //   })

  // }

  dataSheet.eachRow((row, rowIndex) => {
    if (rowIndex >= dataRowStartIndex && rowIndex <= dataRowEndIndex) {
      const value = row.getCell('H').value || ''
      const matched = wanted.some(w => value.includes(w))
      const rows = matched ? part1Rows : part2Rows
      const values = row.values.map(val => val.formula || val.sharedFormula ? val.result : val)
      rows.push(values)
      // if(matched && rows.length < 5) {
      //   // dataSheet.removeRow(rowIndex)
      //   console.log("🚀 ~ file: excelDiv.js ~ line 79 ~ dataSheet.eachRow ~ row.values", row.values)
        
      // }
    }
  });



  sheet1.addRows(part1Rows)
  // part1Rows.forEach(curRow => sheet1.addRow(curRow))

  sheet2.addRows(part2Rows)
  
  console.log("🚀 ~ file: excelDiv.js ~ line 82 ~ start ~ part2Rows", part2Rows.length)
  console.log("🚀 ~ file: excelDiv.js ~ line 82 ~ start ~ part1Rows", part1Rows.length)
  console.log("🚀 ~ file: excelDiv.js ~ line 70 ~ sheet.eachRow ~ wanted", wanted)
  

}

async function main() {
  await workbook.xlsx.readFile(excelFile);

  start();
  // return

  try {
    const res = await workbook.xlsx.writeFile(outExcelFile);
    log("SUCCESS: ", outExcelFile);
  } catch (err) {
    log(`FAIL: 输出excel文件失败, 请检查文件 ${outExcelFile} 是否已打开`, err);
  }
}

async function mytest() {
  await workbook.xlsx.readFile(excelFile);
  // workbook.eachSheet(sheet => {
  //   const cell = sheet.getCell('R10')
  //   if (cell.value) {
  //     cell.value = { formula: 'A10 + Q10', result: 25 }
  //   }
  // })
  // const sheet = workbook.getWorksheet('Sheet1')
  const sheet = workbook.worksheets[workbook.worksheets.length - 1];
  // sheet.columns.forEach((col, i) => {
  //   col.alignment = { horizontal: 'center', vertical: 'middle'}
  //   col.numFmt = '0.00%'
  //   col.width = 25

  //   if (i === 1) {
  //     col.key = col.name = 'fulltimeTeacher'
  //   }
  // })

  const ttlRow = sheet.getRow(1)
  // ttlRow.style = {
  //   border: {top: {style: 'thin'},bottom: {style: 'thin'}, left: {style: 'thin'}, right: {style: 'thin'}},
  //   fill: { type: "pattern", pattern: "solid", bgColor: { indexed: 64 }, fgColor: { theme: 0, tint: -0.05 } },
  //   font: { size: 13, bold: true },
  // }
  ttlRow.fill = { type: "pattern", pattern: "solid", bgColor: { indexed: 64 }, fgColor: { theme: 0, tint: -0.05 } }

  // ttlRow.eachCell(async (cell, i) => {
  //   console.log(
  //     "🚀 ~ file: excelhandle.js ~ line 282 ~ ttlRow.eachCell ~ i",
  //     i
  //   );
  //   cell.style = {
  //     border: {top: {style: 'thin'},bottom: {style: 'thin'}, left: {style: 'thin'}, right: {style: 'thin'}},
  //     fill: { type: "pattern", pattern: "solid", bgColor: { indexed: 64 }, fgColor: { theme: 0, tint: -0.05 } },
  //     font: { size: 13, bold: true },
  //   };
  // });
  await workbook.xlsx.writeFile(outExcelFile);
  log("test finish~~~~~~~");
}

main();
// mytest();
