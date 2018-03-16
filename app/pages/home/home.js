
import { LoginStatusUnLogin, LoginStatusNormal, LoginStatusTokenInvalid, userManager } from '../../utils/userManager.js'
const request = require('../../utils/request.js')
const punchard = require('../../utils/punchcard.js')
const app = getApp()
Page({
  data: {
    avatarUrl: '',
    nickName: userManager.userInfo.realName,
    punchCardRecords:{},//打卡记录
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '主页',
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#517fa4',
      animation: {
        duration: 400,
        timingFunc: 'line'
      }
    })

    var that  = this;
    punchard.punchcard.getPunchardHistory(function (today, yestoday, beforeYestoday){
      console.log(yestoday)
      var content = {};
      content['today'] = today;
      content['yestoday'] = yestoday;
      content['beforeYestoday'] = beforeYestoday;
      that.setData({
        punchCardRecords: content,
      })
    });

    // this.wxGetUserInfo();

  },

  // wxGetUserInfo:function(){
  //   var that = this;
  //   wx.login({
  //     success: function (res) {
  //       wx.getUserInfo({
  //         success: function (res) {
  //           var userInfo = res.userInfo
  //           var nickName = userInfo.nickName
  //           var avatarUrl = userInfo.avatarUrl
  //           var gender = userInfo.gender //性别 0：未知、1：男、2：女
  //           var province = userInfo.province
  //           var city = userInfo.city
  //           var country = userInfo.country
  //           that.setData({
  //             avatarUrl: avatarUrl,
  //             nickName: nickName,
  //           })

  //         }
  //       })
  //     },
  //     fial: function (res) {
  //       console.log('登录失败')
  //     },
  //   })
  // },

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
  },

  
})