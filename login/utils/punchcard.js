const request = require('./request.js')
import { LoginStatusUnLogin, LoginStatusNormal, LoginStatusTokenInvalid, userManager } from './userManager.js'


export var punchcard = {
  today: {
    name: '今天',
    week: null,
    ondutyTime: null,
    offdutyTime: null,
    date: null,
  },

  yestoday: {
    name: '昨天',
    week: null,
    ondutyTime: null,
    offdutyTime: null,
    date: null,
  },

  beforeYestoday: {
    name: '前天',
    week: null,
    ondutyTime: null,
    offdutyTime: null,
    date: null,
  },

  week:function(timestmap){
    console.log('时间戳', timestmap)
    return "星期" + "日一二三四五六".charAt(new Date(timestmap).getDay());
  },

  getPunchardHistory: function (callback) {

    var that = this;
    var yearMoonth = this.getYearMoonth(new Date());

    //时间戳
    var todayTimestmap = new Date().getTime();
    var yestodayTimestmap = todayTimestmap - 1 * 24 * 60 * 60 * 1000;
    var beforeYestodayTimestmap = todayTimestmap - 2 * 24 * 60 * 60 * 1000;

    //年月日
    var today = that.getYearMoonthDay(todayTimestmap);  //今天
    var yestoday = that.getYearMoonthDay(yestodayTimestmap);//昨天
    var beforeYestoday = that.getYearMoonthDay(beforeYestodayTimestmap);//前天

    //星期几
    punchcard.today.week = punchcard.week(todayTimestmap)
    punchcard.yestoday.week = punchcard.week(yestodayTimestmap)
    punchcard.beforeYestoday.week = punchcard.week(beforeYestodayTimestmap)

    request.getPunchCardRecord({
      token: userManager.userInfo.token,
      timestamp: yearMoonth,
      success: function (res) {
        console.log(res)
        var punchCardList = res.data.punchCardList;
        for (var index in punchCardList) {
          var dict = punchCardList[index]
          //上班
          var onduty = dict['punchInTime']
          var ondutyMD = that.getYearMoonthDay(onduty)
          var ondutyHM = that.getYearHourMinute(onduty)
          //下班
          var offduty = dict['punchOutTime']
          var offdutyMD = ondutyMD
          var offdutyHM = ondutyHM

          
          //如何使用指针引用?
          if (ondutyMD == today) { //是否是今天
            punchcard.today.ondutyTime = that.getYearHourMinute(onduty);
            punchcard.today.offdutyTime = that.getYearHourMinute(offduty);
            punchcard.today.date = ondutyMD;
          } else if (ondutyMD == yestoday) {//是否是昨天
            punchcard.yestoday.ondutyTime = that.getYearHourMinute(onduty);
            punchcard.yestoday.offdutyTime = that.getYearHourMinute(offduty);
            punchcard.yestoday.date = ondutyMD;
          } else if (ondutyMD == beforeYestoday) {//是否是前天
            punchcard.beforeYestoday.ondutyTime = that.getYearHourMinute(onduty);
            punchcard.beforeYestoday.offdutyTime = that.getYearHourMinute(offduty);
            punchcard.beforeYestoday.date = ondutyMD;
          } else {
            //不做任何处理
          }
        }

        //如果没有今天的记录(上下班都打了才有记录)，那么调用isPunchCard 来判断是否打了上班卡
        if (punchcard.today.ondutyTime == undefined) {
          request.isPunchCard({
            token: userManager.userInfo.token,
            success:function(res){
              console.log("是否打卡", res)
              var isPunchCard = res.data.isPunchCard
              if (isPunchCard) {
                //已打上班卡
                punchcard.today.ondutyTime = '已打卡';
              }
              if (callback) callback(punchcard.today, punchcard.yestoday, punchcard.beforeYestoday);
            },
            fail:function(res){
              if (callback) callback(punchcard.today, punchcard.yestoday, punchcard.beforeYestoday);
            }
          })
        }else{
          if (callback) callback(punchcard.today, punchcard.yestoday, punchcard.beforeYestoday);
        }

      },
      fail: function (res) {
        console.log(res)
      },
    })
  },



  fix: function (num, length) {
    return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
  },


  getYearHourMinute: function (timestmap) {
    var date = new Date(parseInt(timestmap))

    var hrs = date.getHours();
    var min = date.getMinutes();

    var day = `${this.fix(hrs, 2)}:${this.fix(min, 2)}`

    return day;
  },

  getYearMoonthDay: function (timestmap) {
    var date = new Date(parseInt(timestmap))
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    // var hrs = date.getHours();
    // var min = date.getMinutes();
    // var sec = date.getSeconds();
    var day = `${this.fix(month, 2)}-${this.fix(day, 2)}`

    return day;
  },

  getYearMoonth: function (date) {

    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    // var day = date.getDate()
    // var hrs = date.getHours();
    // var min = date.getMinutes();
    // var sec = date.getSeconds();
    var day = `${this.fix(year, 4)}${this.fix(month, 2)}`

    return day;
  },

}







