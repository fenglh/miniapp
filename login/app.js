//app.js


const systemInfo = require('./utils/systemInfo.js');
const request = require('./utils/request.js')

import { LoginStatusUnLogin, LoginStatusNormal, LoginStatusTokenInvalid, userManager} from './utils/userManager.js'

App({
  onLaunch: function () {
    //获取系统信息
    var that = this
    var system = wx.getSystemInfo({
      success: function (res) {
        systemInfo.systemInfo = res
        console.log(systemInfo.systemInfo)
      }
    })


    console.log(LoginStatusUnLogin)
    console.log(LoginStatusNormal)
    console.log(LoginStatusTokenInvalid)
    console.log(userManager.userInfo)
    if (userManager.userInfo.loginStatus == LoginStatusNormal){
      console.log('用户已登录')
      request.getUserInfo({ token: userManager.userInfo.token})
    }else{
      console.log('用户未登录')
    }


  },

 


  globalData: {

  },


  
})