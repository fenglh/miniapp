
import { LoginStatusUnLogin, LoginStatusNormal, LoginStatusTokenInvalid, userManager } from '../../utils/userManager.js'
const request = require('../../utils/request.js')
const app = getApp()
Page({
  data: {
    avatarUrl: '',
    nickName: '',
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#576b95',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    
    var that = this;
    wx.login({
      success: function (res) {
        wx.getUserInfo({
          success: function (res) {
            var userInfo = res.userInfo
            var nickName = userInfo.nickName
            var avatarUrl = userInfo.avatarUrl
            var gender = userInfo.gender //性别 0：未知、1：男、2：女
            var province = userInfo.province
            var city = userInfo.city
            var country = userInfo.country
            that.setData({
              avatarUrl: avatarUrl,
              nickName: nickName,
            })

          }
        })
      },
      fial: function (res) {
        console.log('登录失败')
      },
    })
  },

  onTapJump: function () {
    var that = this;
    request.isPunchCard({
      token: userManager.userInfo.token,
      success: function (res) {
        var isPunchCard = res.data.isPunchCard
        if (isPunchCard) {
          app.redirectToOffDuty()
        } else {
          app.redirectToOnDuty()
        }
      },
      fial: function (res) {
        wx.showToast({
          title: '进入打卡功能失败',
        })
      },

    })
  }
})