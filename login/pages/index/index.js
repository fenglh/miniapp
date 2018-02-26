//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userName:'',
    pwd:'',
    pwdInputDisabled:true,
    pwdInputFocus:false,
    userInputFocus: true,
    userInputDisabled: false,
    loginBtndisable: true,
    animating:false,
  },
  //页面初次渲染完成，先后顺序:onLoad->onShow->onReady
  onReady:function () {
    console.log('onReady')
    //初始化动画
    this.pwdInputAnimation = wx.createAnimation({
      duration:400,
      timingFunction:'ease',
      delay:0,
    })

    this.userInputAnimation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
      delay: 0,
    })

    //登录按钮动画
    this.loginAnimation = wx.createAnimation({
      duration: 700,
      timingFunction: 'line',
      delay: 0,
    })

  },

  //页面显示，先后顺序:onLoad->onShow->onReady
  onShow: function () {
    console.log('onShow')
  },

  //页面加载，先后顺序:onLoad->onShow->onReady
  onLoad: function () {
    console.log('onLoad')
  },

  //用户名输入事件
  userInputEvent:function(e){
    this.setData({
      userName:e.detail.value,
    })

    var opacity = 0;
    
    if (this.data.userName.length >= 8){
      opacity = 1;
    }else {
      opacity = 0;
      //清空密码
      this.setData({ pwd: '' })
    }

    this.pwdInputAnimation.opacity(opacity).step()
    this.setData({
      pwdInputAnimation: this.pwdInputAnimation.export(),
    })
 
  },


  bindUserInputTap:function(){

    if (this.data.animating) {
      setTimeout(function () {
        this.bindUserInputTap()
      }.bind(this), 100)
      console.log('动画中，延时执行')
      return;
    }
    //屏蔽所有
    this.disableAllInput()

    if (this.data.pwdInputFocus) {
      console.log('密码input聚焦')
    }

    if (this.data.userInputFocus) {
      console.log('用户input聚焦')
    }

    //用户输入框： Y轴移动，并缩放，以及透明度--还原
    this.userInputAnimation.translateY(0).opacity(1).step()

    //密码输入框：Y轴移动
    this.pwdInputAnimation.translateY(0).step()
    //登录按钮：高度变化
    this.loginAnimation.height(0.5).step()
    this.setData({
      // animating:true,
      userInputAnimation: this.userInputAnimation.export(),
      pwdInputAnimation: this.pwdInputAnimation.export(),
      loginAnimation: this.loginAnimation.export()
    })
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

  bindPwdInputTap:function(){

    if (this.data.animating) {
      setTimeout(function () {
        this.bindPwdInputTap()
      }.bind(this), 100)
      console.log('动画中，延时执行')
      return;
    }

    if (this.data.userName.length <8){
      return;
    }
    //屏蔽所有
    this.disableAllInput()

    if (this.data.pwdInputFocus) {
      console.log('密码input聚焦')
    }

    if (this.data.userInputFocus) {
      console.log('用户input聚焦')
    }


    //用户输入框：Y轴移动、缩放、透明度
    this.userInputAnimation.translateY(-50).opacity(0.65).step()
    //密码输入框：Y轴移动
    this.pwdInputAnimation.translateY(-54).step()
    this.setData({
      // animating: true,
      pwdInputAnimation: this.pwdInputAnimation.export(),
      userInputAnimation: this.userInputAnimation.export()
    })
    this.autoLoginBtnHeightAdjust();

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


  //自动调整高度
  autoLoginBtnHeightAdjust:function(){
    if (this.data.pwd.length >= 8) {
      this.loginAnimation.height(44).step()
      this.setData({
        loginAnimation: this.loginAnimation.export()
      })
    } else {
      this.loginAnimation.height(0.5).step()
      this.setData({
        loginAnimation: this.loginAnimation.export()
      })
    }
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
  pwdInputEvent:function(e){
    this.setData({
      pwd: e.detail.value,
    })

    this.autoLoginBtnHeightAdjust();

  },


  //登录按钮
  loginBtnOnClick:function(e){

  },

})
