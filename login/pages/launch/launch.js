
import { LoginStatusUnLogin, LoginStatusNormal, LoginStatusTokenInvalid, userManager } from '../../utils/userManager.js'
const request = require('../../utils/request.js')
Page({

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (userManager.userInfo.loginStatus == LoginStatusNormal) {
      console.log('用户已登录')
      request.getUserInfo({ token: userManager.userInfo.token })
      wx.redirectTo({
        url: '../index/index',
      })
    } else {
      console.log('用户未登录')
      wx.redirectTo({
        url: '../login/login',
      })
    }
    console.log(userManager.userInfo)
  },

  
})