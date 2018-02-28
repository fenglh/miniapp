//index.js
//获取应用实例

const request = require('../../utils/request.js')
const userManager = require('../../utils/userManager.js');
const app     = getApp()


Page({
  data: {
    user: userManager.userInfo.account,
    pwd:'',
    pwdInputDisabled:true,
    pwdInputFocus:false,
    userInputFocus: false,
    userInputDisabled: false,
    loginBtndisable: true,
    animating:false,
    animationDuration:400,
  },

  //页面加载，先后顺序:onLoad->onShow->onReady
  onLoad: function () {
    console.log('onLoad')
  },

  //页面显示，先后顺序:onLoad->onShow->onReady
  onShow: function () {
    console.log('onShow')
  },

  //页面初次渲染完成，先后顺序:onLoad->onShow->onReady
  onReady:function () {
    console.log('onReady')

    //初始化动画
    this.pwdInputAnimation = wx.createAnimation({
      duration: this.data.animationDuration,
      timingFunction:'ease',
      delay:0,
    })

    this.userInputAnimation = wx.createAnimation({
      duration: this.data.animationDuration,
      timingFunction: 'ease',
      delay: 0,
    })

    //登录按钮动画
    this.loginAnimation = wx.createAnimation({
      duration: 700,
      timingFunction: 'line',
      delay: 0,
    })

    //初始化
    if (this.data.user.length >= 8) {
      this.animationPwdInputShow(true)

    } else {
      this.animationPwdInputShow(false)
      //清空密码
      this.setData({ pwd: '' })
    }
  },



  animationPwdInputShow:function(show){

    var opacity = 0;
    if (show) {
      opacity = 1;
    } else {
      opacity = 0;
    }

    this.pwdInputAnimation.opacity(opacity).step()
    this.setData({
      pwdInputAnimation: this.pwdInputAnimation.export(),
    })
  },

  //用户名输入事件
  userBindinput:function(e){
    this.setData({
      user:e.detail.value,
    })
    if (this.data.user.length >= 8) {
      this.animationPwdInputShow(true)
    } else {
      this.animationPwdInputShow(false)
      //清空密码
      this.setData({
         pwd: '' ,
         userInputFocus:true,
      })
    }
  },





  animationLoginBtnHeight:function(value){
    //登录按钮：高度变化
    this.loginAnimation.height(value).step()
    this.setData({
      loginAnimation: this.loginAnimation.export()
    })
  },
  animationMoveReset:function(){
    //用户输入框： Y轴移动，并缩放，以及透明度--还原
    this.userInputAnimation.translateY(0).opacity(1).step()
    //密码输入框：Y轴移动
    this.pwdInputAnimation.translateY(0).step()
    this.setData({
      // animating:true,
      userInputAnimation: this.userInputAnimation.export(),
      pwdInputAnimation: this.pwdInputAnimation.export(),
    })
  },

  animationMoveUp: function () {
    //用户输入框：Y轴移动、缩放、透明度
    this.userInputAnimation.translateY(-50).opacity(0.65).step()
    //密码输入框：Y轴移动
    this.pwdInputAnimation.translateY(-54).step()
    this.setData({
      // animating: true,
      pwdInputAnimation: this.pwdInputAnimation.export(),
      userInputAnimation: this.userInputAnimation.export()
    })
  },

  userBindtap:function(){

    if (this.data.animating) {
      setTimeout(function () {
        this.bindUserInputTap()
      }.bind(this), 100)
      console.log('动画中，延时执行')
      return;
    }
    //屏蔽所有
    this.disableAllInput()
    this.animationMoveReset()
    this.animationLoginBtnHeight(0.5)

    setTimeout(function () {
      this.setData({
        userInputDisabled: false,
        userInputFocus: true,
  
      })

    }.bind(this), 400)

    setTimeout(function () {
      this.setData({
        animating: false,
      })

    }.bind(this), 1300)

  },


  pwdBindtap:function(){

    if (this.data.animating) {
      setTimeout(function () {
        this.bindPwdInputTap()
      }.bind(this), 100)
      console.log('动画中，延时执行')
      return;
    }

    if (this.data.user.length <8){
      return;
    }

    this.animationMoveUp()
    if (this.data.pwd.length >= 8) {
      this.animationLoginBtnHeight(44)
    } else {
      this.animationLoginBtnHeight(0.5)
    }

    setTimeout(function(){
      this.setData({
        pwdInputDisabled: false,
        pwdInputFocus: true,

      })

    }.bind(this),400)

    setTimeout(function () {
      this.setData({
        animating: false,
      })

    }.bind(this), 1300)

  },



  disableAllInput:function(){
    this.setData({
      pwdInputFocus: false,
      userInputFocus: false,
      userInputDisabled: true,
      pwdInputDisabled: true,
      animating:true,
    })
  },

  //密码输入事件
  pwdBindinput:function(e){
    this.setData({
      pwd: e.detail.value,
    })

    if (this.data.pwd.length >= 8) {
      this.animationLoginBtnHeight(44)
    } else {
      this.animationLoginBtnHeight(0.5)
    }

  },

  //登录
  loginBindtap: function (e) {
    wx.showLoading({
      title: '提交中',
    })
  request.login({
    user:this.data.user,
    pwd:this.data.pwd,
    success:function(res){
      var responseCode = res.data.responseCode
      var responseMsg = res.data.responseMsg
      if (responseCode != 0) {
          wx.showToast({
            title: res.data.responseMsg,
            icon: 'none',
          })
      } else {
          wx.showToast({
            title: res.data.responseMsg,
            icon: 'success',
          })
      }

    },
    fail:function(res){
        wx.showToast({
          title: '请求失败',
          icon: 'none',
        })
    }
  })
  },




  



})
