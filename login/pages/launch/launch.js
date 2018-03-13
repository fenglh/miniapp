
import { LoginStatusUnLogin, LoginStatusNormal, LoginStatusTokenInvalid, userManager } from '../../utils/userManager.js'
const request = require('../../utils/request.js')
const app = getApp()
Page({


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (userManager.userInfo.loginStatus == LoginStatusNormal){
      request.getUserInfo({ token: userManager.userInfo.token })
      app.showPunchCard()
    }else{
      app.redirectToLogin();
    }

  },


  
})