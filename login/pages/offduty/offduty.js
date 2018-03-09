//index.js
//获取应用实例

const request = require('../../utils/request.js')
import { LoginStatusUnLogin, LoginStatusNormal, LoginStatusTokenInvalid, userManager } from '../../utils/userManager.js'

let app = getApp()
let MDInput = require("../../lib/mdinput/mdinput.js")
Page({
  data: {
    //经纬度信息
    latitude: 0,
    longitude: 0,
    altitude: 0,
    address: '',
    locating: false,//定位中
    locateFail: false,
    addressParseFail: false,
  },



  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '下班打卡',
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#576b95',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })

    this.getLocation();
  },

  onReady:function(e){
    wx.onAccelerometerChange(function (res) {
      console.log(res.x)
      console.log(res.y)
      console.log(res.z)
    })
  },

  getLocation:function(){
    var that = this;
    request.getLocation({
      token: userManager.userInfo.token,
      success: function (res) {
        console.log('定位成功', res);
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          altitude: res.altitude,
          address: res.address,
        })
      },
      fail: function (res) {
        console.log('定位失败', res);
      }
    })
  },

refreshAddress: function () {
    this.setData({
      address: '获取地址...',
    })
    this.getLocation();
  },









})
