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
    scrollindex: 0,  //当前页面的索引值
    totalnum: 5,  //总共页面数
    starty: 0,  //开始的位置x
    endy: 0, //结束的位置y
    margintop: 0,  //滑动下拉距离
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

    this.userInputAnimation = wx.createAnimation({
      duration: this.data.animationDuration,
      timingFunction: 'ease',
      delay: 0,
    })

    this.pwdInputAnimation = wx.createAnimation({
      duration: this.data.animationDuration,
      timingFunction:'ease',
      delay:0,
    })

    this.inputViewAnimation = wx.createAnimation({
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
    // Y轴移动，并缩放，以及透明度--还原
    this.inputViewAnimation.translateY(0).opacity(1).step()
    this.userInputAnimation.opacity(1).step()
    this.pwdInputAnimation.opacity(0.65).step()
    this.setData({
      userInputAnimation: this.userInputAnimation.export(),
      inputViewAnimation: this.inputViewAnimation.export(),
      pwdInputAnimation: this.pwdInputAnimation.export(),

    })
  },

  animationMoveUp: function () {
    //用户输入框：Y轴移动、缩放、透明度
    this.inputViewAnimation.translateY(-50).step()
    this.userInputAnimation.opacity(0.65).step()
    this.pwdInputAnimation.opacity(1).step()
    this.setData({
      userInputAnimation: this.userInputAnimation.export(),
      inputViewAnimation: this.inputViewAnimation.export(),
      pwdInputAnimation: this.pwdInputAnimation.export(),
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
        this.pwdBindtap()
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
      title: '登录中...',
      mask:true,
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



/**滑动样式绑定时间 */
  // scrollTouchstart: function (e) {
  //   let py = e.touches[0].pageY;
  //   this.setData({
  //     starty: py
  //   })
  // },
  // scrollTouchmove: function (e) {
  //   let py = e.touches[0].pageY;
  //   let d = this.data;
  //   this.setData({
  //     endy: py,
  //   })
  //   if (py - d.starty < 100 && py - d.starty > -100) {
  //     console.log(py - d.starty)
  //     this.setData({
  //       margintop: py - d.starty
  //     })
  //   }
  // },
  // scrollTouchend: function (e) {
  //   let d = this.data;
  //   if (d.endy - d.starty > 100 && d.scrollindex > 0) {
  //     this.setData({
  //       scrollindex: d.scrollindex - 1
  //     })
  //   } else if (d.endy - d.starty < -100 && d.scrollindex < this.data.totalnum - 1) {
  //     this.setData({
  //       scrollindex: d.scrollindex + 1
  //     })
  //   }
  //   this.setData({
  //     starty: 0,
  //     endy: 0,
  //     margintop: 0
  //   })
  // },
  



})
