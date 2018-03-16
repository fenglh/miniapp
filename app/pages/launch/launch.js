
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

      var that = this;
      request.isPunchCard({
        token: userManager.userInfo.token,
        success: function (res) {
          var isPunchCard = res.data.isPunchCard
          if (isPunchCard) {
            app.redirectToOffDuty()
          } else {
            app.redirectToHome()
          }
        },
        fial: function (res) {
          that.redirectToHome()
        },

      })

    }else{
      app.redirectToLogin();
    }
  },
})