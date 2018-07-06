var axios = require('axios');

var DOCTORS = [
  {
    "hospitalId": "155",
    "doctorName": "王子莲PX2",
    "departmentName": "产科教授门诊",
    "doctorId": "239128",
    "hospitalName": "中山大学附属第一医院（中山一院）",
    "departmentId": "46459"
  },
  {
    "hospitalId": "155",
    "doctorName": "张颖",
    "departmentName": "产科教授门诊",
    "doctorId": "171872",
    "hospitalName": "中山大学附属第一医院（中山一院）",
    "departmentId": "46459"
  },
  {
    "hospitalId": "155",
    "doctorName": "黄顺英",
    "departmentName": "产科教授门诊",
    "doctorId": "171871",
    "hospitalName": "中山大学附属第一医院（中山一院）",
    "departmentId": "46459"
  },
  {
    "hospitalId": "155",
    "doctorName": "蔡坚",
    "departmentName": "产科教授门诊",
    "doctorId": "171870",
    "hospitalName": "中山大学附属第一医院（中山一院）",
    "departmentId": "46459"
  },
  {
    "hospitalId": "155",
    "doctorName": "彭田玉",
    "departmentName": "产科教授门诊",
    "doctorId": "171869",
    "hospitalName": "中山大学附属第一医院（中山一院）",
    "departmentId": "46459"
  },
  {
    "hospitalId": "155",
    "doctorName": "梁润彩",
    "departmentName": "产科教授门诊",
    "doctorId": "171868",
    "hospitalName": "中山大学附属第一医院（中山一院）",
    "departmentId": "46459"
  },
  {
    "hospitalId": "155",
    "doctorName": "杨建波",
    "departmentName": "产科教授门诊",
    "doctorId": "171867",
    "hospitalName": "中山大学附属第一医院（中山一院）",
    "departmentId": "46459"
  },
  {
    "hospitalId": "155",
    "doctorName": "刘斌",
    "departmentName": "产科教授门诊",
    "doctorId": "1495019",
    "hospitalName": "中山大学附属第一医院（中山一院）",
    "departmentId": "46459"
  },
  {
    "hospitalId": "155",
    "doctorName": "陈海天",
    "departmentName": "产科教授门诊",
    "doctorId": "1413917",
    "hospitalName": "中山大学附属第一医院（中山一院）",
    "departmentId": "46459"
  }
];

var STATES = {
	0: '可能可约，看剩余号'
	1: '停诊',
	2: '约满',
	3: '待放号',
	4: '不可用'
}