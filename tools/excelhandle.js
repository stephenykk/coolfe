const exceljs = require("exceljs");
const path = require("path");
const workbook = new exceljs.Workbook();
const excelFile = path.resolve(__dirname, "demo.xlsx");
// const outExcelFile = excelFile.replace("demo", "demo-done")
const outExcelFile = excelFile;
// const sheet = workbook.addWorksheet('my-new-sheet')

const dataRowStartIndex = 3; // 数据从哪行开始

function log(...args) {
  const last = args.pop();
  let isError = false;
  if (last === "throwError") {
    isError = true;
  } else {
    args.push(last);
  }
  console.log("[excel-stat] :", ...args);

  if (isError) {
    throw new Error(args[0]);
  }
}

const getYear = (sheet) => {
  const yearVal = (str) => {
    let year = "";
    const re = /(\d{2})\d{2}/;
    const matched = str.match(re);
    if (matched && ["19", "20", "21"].includes(matched[1])) {
      year = matched[0];
    }
    return year;
  };
  return yearVal(sheet.name) || yearVal(sheet.getCell("A1").value || "");
};

// 年份 专任教师	本科学历人数	占专任教师总数%	大专学历人数	占专任教师总数%	大专或以上学历人数	占专任教师总数%	持有教师资格证人数	占专任教师总数%	学前教育专业毕业人数	占专任教师总数%
const statCols = [
  { name: "year", text: "年份", value: "{year}" },
  {
    name: "fullTimeTeacher",
    text: "专任教师",
    data: { col: { text: "岗位", name: "pos" } },
    test: (val) => /教师|老师/.test(val),
  },
  {
    name: "undergraduteCount",
    text: "本科学历人数",
    data: { col: { text: "学历", name: "education" } },
    test: (val) => /本科/.test(val),
  },
  {
    name: "undergradutePercent",
    text: "占专任教师总数%",
    formula: "{undergraduteCount} / {fullTimeTeacher}",
  },
  {
    name: "juniorCollegeCount",
    text: "大专学历人数",
    data: { col: { text: "学历", name: "education" } },
    test: (val) => /大专/.test(val),
  },
  {
    name: "juniorCollegePercent",
    text: "占专任教师总数%",
    formula: "{juniorCollegeCount} / {fullTimeTeacher}",
  },
  {
    name: "aboveCollegeCount",
    text: "大专或以上学历人数",
    formula: "{undergraduteCount} + {juniorCollegeCount}",
  },
  {
    name: "aboveCollegePercent",
    text: "占专任教师总数%",
    formula: "{aboveCollegeCount} / {fullTimeTeacher}",
  },
  {
    name: "teacherLicenseCount",
    text: "持有教师资格证人数",
    data: { col: { text: "从业资格证", name: "license" } },
    test: (val) => /教师资格证/.test(val),
  },
  {
    name: "teacherLicensePercent",
    text: "占专任教师总数%",
    formula: "{teacherLicenseCount} / {fullTimeTeacher}",
  },
  {
    name: "preschoolEduCount",
    text: "学前教育专业毕业人数",
    data: { col: { text: "所学专业", name: "major" } },
    test: (val) => /学前教育/.test(val),
  },
  {
    name: "preschoolEduPercent",
    text: "占专任教师总数%",
    formula: "{preschoolEduCount} / {fullTimeTeacher}",
  },
];
/* 
序号	单位	岗位	姓名	性别	民族	籍贯	政治   面貌	出生日期	"健康
状况"	毕业院校	所学专业	学历	学位	从业资格证	职称	从事幼教时间	入职  时间	购买社保时间	进修情况	电话号码
*/
const dataCols = [
  { text: "序号", name: "index" },
  { text: "单位", name: "org" },
  { text: "岗位", name: "pos" },
  { text: "姓名", name: "user" },
  { text: "性别", name: "sex" },
  { text: "民族", name: "nation" },
  { text: "籍贯", name: "birthPlace" },
  { text: "政治面貌", name: "politicsStatus" },
  { text: "出生日期", name: "birthData" },
  { text: "健康状况", name: "healthStatus" },
  { text: "毕业院校", name: "school" },
  { text: "所学专业", name: "major" },
  { text: "学历", name: "education" },
  { text: "学位", name: "degree" },
  { text: "从业资格证", name: "license" },
  { text: "职称", name: "jobTitle" },
  { text: "从事幼教时间", name: "workYears" },
  { text: "入职时间", name: "joinTime" },
  { text: "购买社保时间", name: "socialSecurityTime" },
  { text: "进修情况", name: "furtherStudy" },
  { text: "电话号码", name: "phone" },
];

function normalize(data) {
  return data.map((row) => {
    // row is array base-1 index
    return row.reduce((record, val, i) => {
      const col = dataCols[i - 1];
      record[col.name] = val;
      return record;
    }, {});
  });
}

function setStyle(statSheet, statCols) {
  statSheet.columns.forEach((col, i) => {
    col.key = col.name = statCols[i].name;
    col.width = statCols.width || 25;
    col.alignment = { horizontal: "center", vertical: "middle" };
    if (/percent/i.test(col.name)) {
      col.numFmt = "0.00%";
    }
    col.border = { top: {style: 'thin'}, bottom: {style: 'thin'}, left: {style: 'thin'}, right: {style: 'thin'} }
  });
  statSheet.getRow(1).eachCell((cell) => {
    // cell.border = { top: {style: 'thin'}, bottom: {style: 'thin'}, left: {style: 'thin'}, right: {style: 'thin'} }
    cell.style = {
      font: { size: 14, bold: true },
      fill: {type: 'pattern', pattern: 'solid', bgColor: { indexed: 64 }, fgColor: {theme: 0, tint: -0.05}},
      border: cell.border,
      alignment: { horizontal: "center", vertical: "middle" }
    }
  })
}

function startStat() {
  let statSheet = workbook.worksheets[workbook.worksheets.length - 1];

  const year = getYear(statSheet);
  if (year) {
    // no stat sheet
    statSheet = workbook.addWorksheet("统计结果");
    const row = statSheet.getRow(1);
    row.values = statCols.map((col) => col.text);
  }

  setStyle(statSheet, statCols);

  const dataSheets = workbook.worksheets.slice(0, -1);
  const yearDataMap = {};
  for (const sheet of dataSheets) {
    const dyear = getYear(sheet);
    if (!dyear) {
      log(`当前工作表 ${sheet.name} 找不到年份值`, "throwError");
    }
    const data = [];
    sheet.eachRow((row, rowIndex) => {
      // row.values is array start from 1
      rowIndex >= dataRowStartIndex && data.push(row.values);
    });

    yearDataMap[dyear] = normalize(data);
  }

  // stat
  const yearList = Object.keys(yearDataMap).sort((a, b) => a * 1 - b * 1);
  let rowIndex = 2;
  yearList.forEach((year) => {
    const data = yearDataMap[year];
    fillStatRow(year, data);
    rowIndex++;
  });

  function fillStatRow(year, data) {
    statCols.forEach((col, i) => {
      setColValue(col, i + 1, year, data);
    });
  }

  function setColValue(col, colIndex, year, data) {
    const row = statSheet.getRow(rowIndex);
    const cell = row.getCell(colIndex);
    if (col.name === "year") {
      cell.value = year;
    } else if (col.data) {
      const values = data.map((rs) => rs[col.data.col.name]);
      cell.value = values.filter(col.test).length;
    } else if (col.formula) {
      let equation = col.formula.replace(/\{(\w+)\}/g, (m, key) => {
        const colName = varName(m)[0];
        const colIndex = statCols.findIndex((scol) => scol.name === colName);
        if (colIndex < 0) {
          log(`统计表没找到对应的列 ${colName}`, "throwError");
        }
        const colAddr = `${colLetter(colIndex)}${rowIndex}`;
        return colAddr;
      });

      const expr = equation.replace(/[A-Z]\d+/g, (addr) => {
        const cell = statSheet.getCell(addr);
        if (!cell) {
          log(`can not find the cell ${addr}`, "throwError");
        }
        return cell.text;
      });

      const result = eval(expr);

      // equation = '= ' +  equation
      cell.value = { formula: equation, result };
    }
  }

  function varName(str) {
    const re = /\{(\w+)\}/g;
    const names = [];
    while (true) {
      const matched = re.exec(str);
      if (!matched) break;
      names.push(matched[1]);
    }
    return names;
  }

  function colLetter(index) {
    return String.fromCharCode(65 + index);
  }
}

async function main() {
  await workbook.xlsx.readFile(excelFile);

  startStat();
  try {
    const res = await workbook.xlsx.writeFile(outExcelFile);
    console.log("成功完成数据统计!");
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
