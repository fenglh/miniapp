var MD5 = require('../lib/md5.js');
const des = require('./des.js')
const coordtransform = require('../lib/coordtransform.js');
const systemInfo = require('./systemInfo.js');
const WxNotificationCenter = require("./WxNotificationCenter.js");
import { LoginStatusUnLogin, LoginStatusNormal, LoginStatusTokenInvalid, userManager } from './userManager.js'

const app = getApp()

const host                    = 'https://angel.bluemoon.com.cn'
var   url_login               = host + '/bluemoon-control/user/ssoLogin'
var   url_get_user_info       = host + '/bluemoon-control/user/getUserInfo'
var   url_get_gps_address     = host + '/bluemoon-control/attendance/getGpsAddress'
var   url_get_workplace_list  = host + '/bluemoon-control/attendance/getWorkplaceList'
var   url_check_scan_code     = host + '/bluemoon-control/attendance/checkScanCode'
var   url_punch_card_in       = host + '/bluemoon-control/attendance/addPunchCardIn'
var   url_punch_card_out      = host + '/bluemoon-control/attendance/addPunchCardOut'
var   url_get_punch_card_info = host + '/bluemoon-control/attendance/getPunchCard'
var   url_submit_work_diary   = host + '/bluemoon-control/attendance/confirmWorkDiary'
var   url_is_punch_card       = host + '/bluemoon-control/attendance/isPunchCard'
var   url_get_punch_card_list = host + '/bluemoon-control/attendance/getPunchCardList'

var isDisposeTokenInvalid = false;

var request = {

  requestConfig :{
    appType: 'moonAngel',
    loginSecretKey: '19491001',
    signSecretKey: 'Er78s1hcT4Tyoaj2',
    deviceNum: 'test999999999',
    cuid: 'test999999999',
    client:'ios',
  },

  //获取公共查询字符串
  getPublicQueryString: function () {

    var normal = {
      lng: 0,
      lat: 0,
      hig: 0,
      appType: this.requestConfig.appType,
      sysversion: systemInfo.systemInfo.version,
    };

    var params = {
      client: this.requestConfig.client,
      cuid: this.requestConfig.cuid,
      format: 'json',
      time: Date.parse(new Date()),
      version: systemInfo.systemInfo.version,
    };
    var signMd5 = this.getParamsMD5(params)
    params['sign'] = signMd5;

    //合并两个字典
    for (var key in normal) {
      params[key] = normal[key]
    }

    //获取所有key
    var keys = this.allKeys(params);
    //拼装url参数
    var str = ''
    for (var i in keys.sort()) {
      str += `${keys[i]}=${params[keys[i]]}&`
    }
    str = str.substring(0, str.length - 1)  //删除最后一个字符"&"

    return str;
  },

  getParamsMD5: function (params) {
    //获取所有key
    var keys = this.allKeys(params);

    //字符串拼接
    var str = '';
    str += this.requestConfig.signSecretKey //前后都要拼接秘钥
    for (var i in keys.sort()) {
      str += params[keys[i]]
    }
    str += this.requestConfig.signSecretKey //前后都要拼接秘钥

    //进行md5
    var md5Str = MD5.hexMD5(str); //进行md5
    return md5Str;
  },

  allKeys: function (dict) {
    var keys = [];
    for (var p in dict) {
      if (dict.hasOwnProperty(p))
        keys.push(p)
    }
    return keys
  },


  isResponseCodeOk: function (res) {
    var responseCode = res.data.responseCode
    if (responseCode != 0) {
      return false;
    }
    return true;
  },

  isTokenInvalid: function (res) {
    var responseCode = res.data.responseCode
    if (responseCode == 2301) {
      return true;
    }
    return false;
  },


  disposeResponse: function (res, success, fail) {
    if (this.isResponseCodeOk(res)) {
      if (success) { success(res) }
    } else if (this.isTokenInvalid(res)) {
      this.disposeTokenInvalid(res)
    }else{
      if (fail) { fail(res) }
    }
  },



  disposeTokenInvalid: function (res) {
    if (isDisposeTokenInvalid) return;

    isDisposeTokenInvalid = true;
    console.log('处理token过期:', res)
    var responseCode = res.data.responseCode
    var responseMsg = res.data.responseMsg
    if (responseCode == 2301) {
      wx.showModal({
        title: '登录失效',
        content: '登录已失效，请重新登录',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            //设置登录状态
            userManager.userInfo.loginStatus = LoginStatusTokenInvalid;
            console.log(LoginStatusTokenInvalid)
            console.log(userManager.userInfo)
            userManager.cacheUserInfo()
            WxNotificationCenter.postNotificationName("userInfoChangeNotificationName");
            wx.redirectTo({
              url: '../login/login',
            });
            isDisposeTokenInvalid = false;
          }
        }
      })
      
    }
  },

  //登录
  login: function ({user, pwd, success, fail}) {
    console.log(LoginStatusNormal)
    var encryptString = des(pwd, this.requestConfig.loginSecretKey);//vuOShIfoI8SuPqjTlU+csw==
    console.log(encryptString)

    var url = url_login
    var queryString = this.getPublicQueryString();
    url = url + '?' + queryString

    var that = this
    wx.request({
      url: url,
      method: 'POST',
      data: {
        'account': user,
        'password': encryptString,
        'deviceNum': this.requestConfig.deviceNum,
      },
      success: function (res) {
        console.log(res)
        var responseCode = res.data.responseCode
        var responseMsg = res.data.responseMsg
        if (responseCode == 0) {
          //设置登录状态
          userManager.userInfo.token = res.data.token;
          userManager.userInfo.loginStatus = LoginStatusNormal;
          userManager.userInfo.account = user;
          userManager.userInfo.pwd = pwd;
          userManager.cacheUserInfo()
          console.log('登录成功，前往获取用户信息')

          //获取用户信息
          that.getUserInfo({ token: userManager.userInfo.token })
        }
        if(success){
          success(res)
        }

      },
      fail: function (res) {
        if(fail){fail(res)}
      },

    })
  },



  getUserInfo:function({token, success, fail}){
    var url = url_get_user_info
    var queryString = this.getPublicQueryString();
    url = url + '?' + queryString
    wx.request({
      url: url,
      method: 'POST',
      data:{
        token:token,
      },
      success:function(res){
        var responseCode = res.data.responseCode
        var responseMsg = res.data.responseMsg
        if (responseCode == 0) {
            userManager.userInfo.account = res.data.user.account
            userManager.userInfo.blood = res.data.user.blood
            userManager.userInfo.empType = res.data.user.empType
            userManager.userInfo.mobileNo = res.data.user.mobileNo
            userManager.userInfo.realName = res.data.user.realName
            userManager.userInfo.sex = res.data.user.sex
            userManager.cacheUserInfo()
        }
        console.log('获取用户信息成功!')
        WxNotificationCenter.postNotificationName("userInfoChangeNotificationName");
        if(success){success(res)}
      },
      fail:function(res){
        if (fail) { fail(res) }
      },
    })
  },

//经纬度解析地理名称
  getGpsAddress: function ({ token, altitude, latitude, longitude, success, fail}){
    var url = url_get_gps_address
    var queryString = this.getPublicQueryString();
    url = url + '?' + queryString
    var that = this;
    wx.request({
      url: url,
      method:'POST',
      data:{
        token: token,
        altitude: altitude,
        latitude: latitude,
        longitude: longitude,
      },
      success:function(res){
        that.disposeResponse(res,success, fail)
      },
      fail:function(res){
        if (fail) { fail(res) }
      },
    })
  },

  getLocation: function ({ token, success, fail }){

  var that = this
  var latitude =0;
  var longitude = 0;
  var altitude = 0;
  var address=null;
  wx.getLocation({
    success: function (res) {
      //国测局坐标转百度经纬度坐标
      var gcj02 = coordtransform.wgs84togcj02(res.longitude, res.latitude);
      var bd09 = coordtransform.gcj02tobd09(gcj02[1], gcj02[0]);

      latitude = bd09[0],
      longitude = bd09[1],
      altitude = res.altitude,
      //解析地理名称
      that.getGpsAddress({
      token: token,
      altitude: altitude,
      latitude: latitude,
      longitude: longitude,
      success: function (res) {
        console.log('经纬度解释地理名称成功:', res)
        address = res.data.addressInfo.formattedAddress
        if (success) success({ "latitude": latitude, "longitude": longitude, "altitude": altitude, "address": address })
      },
      fail: function (res) {
        console.log("经纬度解释地理名称失败:",res);
        if (fail) fail({ "latitude": latitude, "longitude": longitude, "altitude": altitude, "address": address})
      }
      })
    },
    fail: function (res) {
      console.log("获取定位失败:", res);
      if (fail) fail({ "latitude": latitude, "longitude": longitude, "altitude": altitude, "address": address })
    },

  })

},
  //是否打卡

  isPunchCard: function ({ token, success, fail}) {
    var url = url_is_punch_card;
    var queryString = this.getPublicQueryString();
    url = url + '?' + queryString
    var that = this;
    wx.request({
      url: url,
      method: 'POST',
      data: {
        token: token,
      },
      success: function (res) {
        that.disposeResponse(res, success, fail)
      },
      fail: function (res) {
        if (fail) { fail(res) }
      },
    })
  },

  //获取上班地点，最多返回30条
  getWorkplaceList: function ({ token, condition, count, success, fail }){
    var url = url_get_workplace_list
    var queryString = this.getPublicQueryString();
    url = url + '?' + queryString
    var that = this;
    wx.request({
      url: url,
      method: 'POST',
      data:{
        token:token,
        condition:condition,
        count:count,
        timestamp:0,
      },
      success: function (res) {
        that.disposeResponse(res,success, fail)
      },
      fail: function (res) {
        if (fail) { fail(res) }
      },
    })
  },

  //获取工作任务
  getWorkTask: function ({ token, workplaceCode, success, fail}){
    var url = url_check_scan_code
    var queryString = this.getPublicQueryString();
    url = url + '?' + queryString
    var that = this;
    wx.request({
      url: url,
      method:'POST',
      data:{
        token:token,
        attendanceCode: workplaceCode,
      },
      success:function(res){
        that.disposeResponse(res, success, fail)
      },
      fail:function(res){
        if (fail) { fail(res) }
      },
    })
  },

  //上班打卡
  submitPunchCardIn: function ({ token, altitude, latitude, longitude, attendanceCode, workTasks, success, fail, complete}){

    var workTasksString = '';

    for (var index in workTasks) {
      workTasksString = workTasks[index] + "," + workTasksString  
    }
    console.log('拼接的workstask 字符串:', workTasksString);

    var url = url_punch_card_in
    var queryString = this.getPublicQueryString();
    url = url + '?' + queryString
    var that = this;
    wx.request({
      url: url,
      method: 'POST',
      data: {
        token:token,
        punchCard:{
          // address:'',
          altitude: altitude,
          attendanceCode: attendanceCode,
          // cityName: cityName,
          // countyName: countyName,
          latitude: latitude,
          longitude: longitude,
          // provinceName: provinceName,
          punchCardType: 'code'
        },
        workTask: workTasksString
      },
      success: function (res) {
        that.disposeResponse(res, success, fail)
      },
      fail: function (res) {
        if (fail) { fail(res) }
      },
      complete:function(res){
        if (complete) { complete(res) }
      },
    })
  },

//下班打卡
  submitPunchCardOut: function ({ token, altitude, latitude, longitude, punchCardId, workTasks, success, fail}) {

    var workTasksString = '';
    for (var index in workTasks) {
      workTasksString = workTasks[index] + "," + workTasksString
    }
    console.log('拼接的workstask 字符串:', workTasksString);

    var url = url_punch_card_out
    var queryString = this.getPublicQueryString();
    url = url + '?' + queryString
    var that = this;
    wx.request({
      url: url,
      method: 'POST',
      data: {
        token: token,
        punchCard: {
          altitude: altitude,
          punchCardId: punchCardId,
          latitude: latitude,
          longitude: longitude
        },
        workTask: workTasksString
      },
      success: function (res) {
        that.disposeResponse(res, success, fail)
      },
      fail: function (res) {
        if (fail) { fail(res) }
      },
    })
  },

  //提交工作日志
  submitWorkDiary: function ({ token, diaryContent, success, fail}) {
    var url = url_submit_work_diary
    var queryString = this.getPublicQueryString();
    url = url + '?' + queryString
    var that = this;
    wx.request({
      url: url,
      method: 'POST',
      data: {
        token: token,
        diaryContent: diaryContent,
      },
      success: function (res) {
        that.disposeResponse(res, success, fail)
      },
      fail: function (res) {
        if (fail) { fail(res) }
      },
      complete: function (res) {
        if (complete) { complete(res) }
      },
    })
  },



  //获取打卡信息
  getPunchCardInfo: function ({ token, success, fail}){
    var url = url_get_punch_card_info
    var queryString = this.getPublicQueryString();
    url = url + '?' + queryString
    var that = this;
    wx.request({
      url: url,
      method: 'POST',
      data: {
        token: token,
      },
      success: function (res) {
        that.disposeResponse(res, success, fail)
      },
      fail: function (res) {
        if (fail) { fail(res) }
      },
    })
  },

  //获取打卡记录
  getPunchCardRecord: function ({ token,timestamp, success, fail }) {
    var url = url_get_punch_card_list
    var queryString = this.getPublicQueryString();
    url = url + '?' + queryString
    var that = this;
    wx.request({
      url: url,
      method: 'POST',
      data: {
        token: token,
        timestamp: timestamp,
      },
      success: function (res) {
        that.disposeResponse(res, success, fail)
      },
      fail: function (res) {
        if (fail) { fail(res) }
      },
    })
  },

}



module.exports = request;