const exceljs = require("exceljs");
const path = require("path");
const fs = require('fs')
const prompt = require('prompt')
const workbook = new exceljs.Workbook();
const { excelFile, outExcelFile } = getExcelFiles()
// const outExcelFile = excelFile;
// const sheet = workbook.addWorksheet('my-new-sheet')
const dataFile = 'data.json'
const statFile = 'stat.json'

function outputData(data, fname = dataFile) {
  const fpath = path.resolve(__dirname, fname)
  fs.writeFileSync(fpath, JSON.stringify(data, null, 2))
  log('导出json成功', fpath)
}


const dataRowStartIndex = 3; // 数据从哪行开始

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
  const excelFiles = files.filter(fname => /\.xlsx$/.test(fname)).sort()
  let excelName = ''
  if (excelFiles.length) {
    excelName = excelFiles[0]
  } else {
    const xlsFiles = files.filter(fname => /\.xls$/.test(fname)).sort()
    if (xlsFiles.length) {
      const xlsName = xlsFiles[0]
      log(`不支持 *.xls 文件格式，请打开 ${xlsName} 文件，另存为 ${xlsName.replace(/\.xls$/, '.xlsx')}`, 'throwError')
    } else {
      log(`在当前文件夹未找到excel文件，请复制花名册excel文件到当前文件夹`, 'throwError')
    }
  }

  const excelFile = path.resolve(__dirname, excelName)
  const outExcelFile = path.resolve(__dirname, excelName.replace(/\.xlsx$/, '_统计表.xlsx'))
  return { excelFile, outExcelFile }
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

const getDate = (val = '') => {
  if (val instanceof Date) {
    return val
  }

  if (val.richText) {
    val = val.richText.map(t => t.text).join('')
  }
  let parts = val.split(/\.|\/|\-|_/)
  if (parts.length === 2) {
    parts.push(1)
  }
  parts = parts.map(p => p * 1)
  const date = new Date()
  date.setFullYear(parts[0])
  date.setMonth(parts[1] - 1)
  date.setDate(parts[2])

  return date
}

const formatDate = (date) => {
  return date.toISOString().replace(/T.*$/, '')
}

const normalizeDate = (val = '') => {
  return formatDate(getDate(val))
}

// 年份 专任教师	本科学历人数	占专任教师总数%	大专学历人数	占专任教师总数%	大专或以上学历人数	占专任教师总数%	持有教师资格证人数	占专任教师总数%	学前教育专业毕业人数	占专任教师总数% 入职三年以上教师人数  占专任教师总数 青年教师人数  占专任教师总数  中年教师人数  占专任教师总数  老年教师人数  占专任教师总数 
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
  {
    name: "above3YearsCount",
    text: "入职三年以上教师人数",
    data: { col: { text: "入职时间", name: "joinTime" } },
    test: (val = '') => {
      const date = getDate(val)

      const today = new Date()
      const oneDay = 24 * 60 * 60 * 1000
      const year3 = 3 * 365 * oneDay
      return today.valueOf() - date.valueOf() >= year3
    },
  },
  {
    name: "above3YearsPercent",
    text: "占专任教师总数%",
    formula: "{above3YearsCount} / {fullTimeTeacher}",
  },
  {
    name: "youngTeacherCount",
    text: "青年教师人数",
    data: { col: { text: "出生日期", name: "birthDate" } },
    test: (val) => {
      const youngAge = 30
      const date = getDate(val)
      const year = date.getFullYear()
      date.setFullYear(year * 1 + youngAge)
      const today = new Date()
      return date > today
    },
  },
  {
    name: "youngTeacherCountPercent",
    text: "占专任教师总数%",
    formula: "{youngTeacherCount} / {fullTimeTeacher}",
  },
  {
    name: "midYearTeacherCount",
    text: "中年教师人数",
    data: { col: { text: "出生日期", name: "birthDate" } },
    test: (val) => {
      const youngAge = 30
      const midAge = 45
      const date = getDate(val)
      const date2 = new Date(date.getTime())
      const year = date.getFullYear()
      date.setFullYear(year * 1 + youngAge)
      date2.setFullYear(year * 1 + midAge)
      const today = new Date()
      return today >= date && today <= date2
    },
  },
  {
    name: "midYearTeacherPercent",
    text: "占专任教师总数%",
    formula: "{midYearTeacherCount} / {fullTimeTeacher}",
  },
  {
    name: "oldTeacherCount",
    text: "老年教师人数",
    data: { col: { text: "出生日期", name: "birthDate" } },
    test: (val) => {
      const midAge = 45
      const date = getDate(val)
      const year = date.getFullYear()
      date.setFullYear(year * 1 + midAge)
      const today = new Date()
      return today < date
    },
  },
  {
    name: "oldTeacherPercent",
    text: "占专任教师总数%",
    formula: "{midYearTeacherCount} / {fullTimeTeacher}",
  },
  {
    name: "firstLevelTeacherCount",
    text: "一级教师人数",
    data: { col: { text: "职称", name: "jobTitle" } },
    test: (val) => /一级/.test(val),
  },
  {
    name: "firstLevelTeacherPercent",
    text: "占专任教师总数%",
    formula: "{firstLevelTeacherCount} / {fullTimeTeacher}",
  },
  {
    name: "secondLevelTeacherCount",
    text: "二级教师人数",
    data: { col: { text: "职称", name: "jobTitle" } },
    test: (val) => /二级/.test(val),
  },
  {
    name: "secondLevelTeacherPercent",
    text: "占专任教师总数%",
    formula: "{firstLevelTeacherCount} / {fullTimeTeacher}",
  },
  {
    name: "thirdLevelTeacherCount",
    text: "三级教师人数",
    data: { col: { text: "职称", name: "jobTitle" } },
    test: (val) => /三级/.test(val),
  },
  {
    name: "thirdLevelTeacherPercent",
    text: "占专任教师总数%",
    formula: "{firstLevelTeacherCount} / {fullTimeTeacher}",
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
  { text: "出生日期", name: "birthDate" },
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

const dtCols = ['birthDate', 'workYears', 'joinTime', 'socialSecurityTime']

const calDate = (baseYear, yearCount) => {
  const date = new Date()
  date.setFullYear(baseYear)
  date.setMonth(0)
  date.setDate(1)

  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)

  const days = yearCount * 365
  const oneDay = 24 * 60 * 60 * 1000
  return new Date(date.getTime() + days * oneDay)
}

function normalize(data, dyear) {
  return data.map((row) => {
    // row is array base-1 index
    return row.reduce((record, val, i) => {
      const col = dataCols[i - 1];
      if (val.richText && Array.isArray(val.richText)) {
        val = val.richText.reduce((ret, el)=> ret+el.text, '')
      }
      if (dtCols.includes(col.name)) {
        if (col.name === 'workYears') {
          const dateRe = /^\d{4}[.-_]/
          if (!dateRe.test(val)) {
            const yearCount = val * 1
            val = calDate(dyear, -1 * yearCount)
          }
        }
        val = normalizeDate(val)
      }
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

let statSheet = ''
function startStat() {
  statSheet = workbook.worksheets[workbook.worksheets.length - 1];

  const year = getYear(statSheet);
  if (year) {
    // no stat sheet
    statSheet = workbook.addWorksheet("统计结果");
    const row = statSheet.getRow(1);
    row.values = statCols.map((col) => col.text);
  } else {
    log(`最后的工作表(${statSheet.name})不是教师名单表, 请删除它再重试`, 'throwError')
  }

  setStyle(statSheet, statCols);

  // collect datas
  const dataSheets = workbook.worksheets.slice(0, -1);
  const yearDataMap = {};
  const yearStatData = {statCols, data: {}};
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

    yearDataMap[dyear] = normalize(data, dyear);
  }

  outputData(yearDataMap) // output data.json

  // stat
  const yearList = Object.keys(yearDataMap).sort((a, b) => a * 1 - b * 1);
  let rowIndex = 2;
  yearList.forEach((year) => {
    const data = yearDataMap[year];
    
    yearStatData.data[year] = {}

    fillStatRow(year, data);

    rowIndex++;
  });

  outputData(yearStatData, statFile);

  // remove data sheets
  removeDataSheets()

  function fillStatRow(year, data) {
    statCols.forEach((col, i) => {
      setColValue(col, i + 1, year, data);
    });
  }
  
  function removeDataSheets() {
    workbook.eachSheet(sheet => {
      if (sheet.name !== statSheet.name) {
        workbook.removeWorksheet(sheet.name)
      }
    })
    log('成功删除原始数据')
  }

  function setColValue(col, colIndex, year, data) {
    const row = statSheet.getRow(rowIndex);
    const cell = row.getCell(colIndex);
    const statData = yearStatData.data[year]

    if (col.name === "year") {
      cell.value = year;

      statData[col.name] = cell.value
    } else if (col.data) {
      const values = data.map((rs) => rs[col.data.col.name]);
      cell.value = values.filter(col.test).length;

      statData[col.name] = cell.value
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

      statData[col.name] = (cell.value.result || 0).toFixed(4)

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
    log("数据统计成功! 输出到新excel文件: ", outExcelFile);
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

prompt.start()
prompt.message = '提示'

prompt.get({
  properties: {
    confirm: {
      description: `是否已关闭文件<${outExcelFile}>？(yes / no)`,
      type: 'string'
    }
  }
}, (err, result) => {
  if(['n', 'no', '0'].includes(result.confirm)) {
    console.log('未执行统计, 直接退出\n\n')
  } else {
    main()
  }
})

// main();
// mytest();
