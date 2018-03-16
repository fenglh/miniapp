//app.js


const systemInfo = require('./utils/systemInfo.js');
const request = require('./utils/request.js')


import { LoginStatusUnLogin, LoginStatusNormal, LoginStatusTokenInvalid, userManager} from './utils/userManager.js'



App({

  finishedPunchCard: false,

  onLaunch: function () {
    //获取系统信息
    var that = this
    var system = wx.getSystemInfo({
      success: function (res) {
        systemInfo.systemInfo = res
        console.log(res)
      }
    })

  },

  // request.getUserInfo({ token: userManager.userInfo.token })

//公有方法

  showPunchCard:function(){
    var that = this;
    request.isPunchCard({
      token: userManager.userInfo.token,
      success: function (res) {
        console.log('是否打卡:', res)
        var isPunchCard = res.data.isPunchCard
        if (isPunchCard) {
          that.redirectToOffDuty()
        } else {
          that.redirectToHome()
        }
      }, 
      fial: function (res) {
        that.redirectToLogin()
      },

    })
  },


  redirectToHome: function () {
    wx.redirectTo({
      url: '../home/home',
    })
  },
  redirectToLogin: function () {
    wx.redirectTo({
      url: '../login/login',
    })
  },

  redirectToOnDuty: function () {
    wx.redirectTo({
      url: '../onduty/onduty',
    })
  },

  redirectToOffDuty: function () {
    wx.redirectTo({
      url: '../offduty/offduty',
    })
  },

  
})