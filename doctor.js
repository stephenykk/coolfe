var axios = require('axios');
var querystring = require('querystring');
var path = require('path');
var fs = require('fs');

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
	0: '可能可约，看剩余号',
	1: '停诊',
	2: '约满',
	3: '待放号',
	4: '不可用'
}

function eachKey(obj, fn) {
  Object.keys(obj).forEach(key => {
    fn(obj[key], key, obj);
  })
}

function pick(obj, keys) {
  var ret = {};
  Object.keys(obj).forEach(key => {
    keys.includes(key) && (ret[key] = obj[key]);
  });
  return ret;
}

function random(max) {
  return Math.floor(Math.random() * max);
}

function randomVersion() {
  let main = random(1000);
  let minor = random(10);
  let patch = random(100);
  return [main, minor, patch].join('.');
}

var api = 'http://weixin.189jk.cn/api/doctor/singleSchedule';

let userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1';

class DSchedule {

  polling() {
    clearTimeout(this.timer);
    this.getAllSchedules();
    this.timer = setTimeout(this.polling.bind(this), 5000);
  }

  async getAllSchedules() {
    if(this.ajaxingCount) return;

    this.ajaxingCount = DOCTORS.length;

    DOCTORS.forEach(doc => {
      this.getScheduleOfOne(doc);
    });
  }
  
  async getScheduleOfOne(doc) {
    let data = pick(doc, ['hospitalId', 'departmentId', 'doctorId']);
    let ua = userAgent.replace('604.1.38', randomVersion());
    let res = await axios.post(api, querystring.stringify(data), {headers: {'content-type': 'application/x-www-form-urlencoded', 'user-agent': ua, proxy: {
      host: '127.0.0.1',
      port: 8888
    }}});
    let resData = res.data.response;
    // console.log(JSON.stringify(res, null, 2), '<--res');
    // console.log(res, '<----------res');
    // console.log(JSON.stringify(res.data, null, 2), '<--res.data');

    this.ajaxingCount--;

    if(resData && resData.schedules) {
      // letOutHour, letOutDay, doctorName, specialty, schedules(scheDate,amPm,freeNum,state)
      let scheduleResult = this.parseSchedules(resData.schedules, resData);
      let docData = pick(resData, ['letOutHour', 'letOutDay', 'doctorName', 'specialty', 'result']);
      Object.assign(docData, {scheduleResult});
      this.output(docData);
    } else {
      console.warn('\n数据异常/没有排班数据:', res.data);
    }
  }

  parseSchedules(schedules, data) {
    let scon = '';
    scon = schedules.map(s => {
      let state = s.state;
      let stateText = STATES[state];
      data.result = '不可预约:(';

      if(state == 0 && s.freeNum > 0) {
        stateText = '可预约';
        data.result = '可预约啊！！！';
      }

      return `${s.scheDate} ${s.amPm} 剩余号: ${s.freeNum} 状态: ${state}`
    }).join('\n');

    return scon;
  }

  output(docData) {
    let con = '';
    eachKey(docData, (val, key) => {
      if(key == 'scheduleResult') {
        con += `${key}:\n${val}\n`;
      } else {
        con += `${key}: ${val} ${key=='result' ? '<------------------------------------' : ''}\n`;
      }
    });
    con += '\n\n';
    console.log(con);
  }

}


let ds = new DSchedule();
// ds.getScheduleOfOne(DOCTORS[0]);
ds.getAllSchedules();
// ds.polling();