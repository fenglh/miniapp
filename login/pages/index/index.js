//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userName:'',
    pwd:'',
    pwdInputDisabled:true,
    loginBtndisable: true,
  },
  //页面初次渲染完成，先后顺序:onLoad->onShow->onReady
  onReady:function () {
    console.log('onReady')
    //初始化动画
    this.animation = wx.createAnimation({
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
    var pwdInputDisabled = this.data.pwdInputDisabled;
    
    if (this.data.userName.length >= 8){
      opacity = 1;
      pwdInputDisabled = false;
    }else {
      opacity = 0
      pwdInputDisabled = true;
      this.setData({ pwd: '' })
    }

    this.animation.opacity(opacity).step()
    this.setData({
      animation: this.animation.export(),
      pwdInputDisabled: pwdInputDisabled
    })
 



  },

  userInputBindfocus:function(e){
    if (this.data.userName.length >= 8) {
      this.userInputAnimation.translateY(0).scale(1).opacity(1).step()
      this.setData({
        userInputAnimation: this.userInputAnimation.export()
      })
    }

    this.animation.translateY(0).step()
    this.setData({
      animation: this.animation.export()
    })

    this.loginAnimation.height(0.5).step()
    this.setData({
      loginAnimation: this.loginAnimation.export()
    })

  },

  // userInputBindblur: function (e) {
  //   if (this.data.userName.length >=8){
  //     this.userInputAnimation.translateY(-40).scale(0.75).opacity(0.75).step()
  //     this.setData({
  //       userInputAnimation: this.userInputAnimation.export()
  //     })
  //   }

  // },

  //获取焦点
  pwdInputBindfocus: function (e) {

    this.userInputAnimation.translateY(-40).scale(0.75).opacity(0.75).step()
    this.animation.translateY(-54).step()
    this.setData({
      animation: this.animation.export(),
      userInputAnimation: this.userInputAnimation.export()
    })
    this.autoLoginBtnHeightAdjust();
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
