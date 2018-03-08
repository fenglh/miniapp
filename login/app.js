//app.js


const systemInfo = require('./utils/systemInfo.js');


import { LoginStatusUnLogin, LoginStatusNormal, LoginStatusTokenInvalid, userManager} from './utils/userManager.js'

App({
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

 


  globalData: {

  },


  
})