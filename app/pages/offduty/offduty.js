//index.js
//获取应用实例

const request = require('../../utils/request.js')
import { LoginStatusUnLogin, LoginStatusNormal, LoginStatusTokenInvalid, userManager } from '../../utils/userManager.js'

let app = getApp()
let MDInput = require("../../lib/mdinput/mdinput.js")
Page({
  data: {
    //经纬度信息
    latitude: 0,
    longitude: 0,
    altitude: 0,
    address: '',
    locating: false,//定位中
    locateFail: false,
    addressParseFail: false,
    //工作任务
    workTaskList: [],
    open: true,
    //打卡id
    punchCardId: null,
    workLog: '下班打卡',
    submitWorkDiarySuccess: false,
    shakeEnable: true,
    shakeData: {
      x: 0,
      y: 0,
      z: 0
    },

  },


  onShow: function () {
    console.log('offduty:页面显示了');
    var that = this;
    request.isPunchCard({
      token: userManager.userInfo.token,
      success: function (res) {
        var isPunchCard = res.data.isPunchCard
        if (isPunchCard == false) {  //还没打上班卡
          app.redirectToHome()
        }
      },
      fial: function (res) {
        that.redirectToHome()
      },

    })
  },


  onHide: function () {
    console.log('offdyty:页面隐藏了')
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '下班打卡',
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#517fa4',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })

    this.getPunchCardInfo();
    this.getLocation();
  },

  onUnload: function (options) {
    wx.stopAccelerometer();
  },

  onReady: function (e) {
    this.shake();
  },

  taskBindtap: function (e) {

    var index = e.currentTarget.dataset.page;
    this.data.workTaskList[index].isSelected = !this.data.workTaskList[index].isSelected;
    var that = this;
    this.setData({
      workTaskList: that.data.workTaskList,
    })
    console.log("选中工作任务:", this.data.workTaskList[index])
  },

  workTaskSpreadBindTap: function (e) {
    var that = this;
    this.setData({
      open: !that.data.open,
    })
    this.data.open ? console.log('展开') : console.log('收缩')
  },

  //获取打卡信息
  getPunchCardInfo: function () {
    var that = this;
    request.getPunchCardInfo({
      token: userManager.userInfo.token,
      success: function (res) {
        console.log('获取打卡信息成功:', res);
        that.setData({
          workTaskList: res.data.workTaskList,
          punchCardId: res.data.punchCard.punchCardId,
        })
      },
      fail: function (res) {
        console.log('获取打卡信息失败:', res);
        var responseMsg = res.data.responseMsg
        wx.showToast({
          title: responseMsg,
          icon:'none',
        })
      },
    })
  },

  //获取定位信息
  getLocation: function () {
    var that = this;
    this.setData({
      locating: true,
      locateFail: false,
      addressParseFail: false,
    })
    request.getLocation({
      token: userManager.userInfo.token,
      success: function (res) {
        console.log('定位成功', res);
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          altitude: res.altitude,
          address: res.address,
          locating: false,
          locateFail: false,
          addressParseFail: false,
        })
      },
      fail: function (res) {
        console.log('定位失败', res);
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          altitude: res.altitude,
          address: res.address,
          locating: false,
          addressParseFail: true,
          locateFail: res.latitude == 0,
        })
      }
    })
  },

  //提交日志（日志接口和下班打卡接口是分开的。。卧槽）
  submitWrokDiary: function (diary, success, fail) {

    var that = this;
    request.submitWorkDiary({
      token: userManager.userInfo.token,
      diaryContent: that.data.workLog,
      success: function (res) {
        that.submitWorkDiarySuccess = true;
        if (success) success(res);
      },
      fail: function (res) {
        that.submitWorkDiarySuccess = false;
        if (fail) fail(fail);
      },
    })
  },

  //提交打卡
  submitPunchCardOut: function () {
    var that = this;
    var list = this.getSelectedWrokTaskCode()
    request.submitPunchCardOut({
      token: userManager.userInfo.token,
      altitude: that.data.altitude,
      latitude: that.data.latitude,
      longitude: that.data.longitude,
      punchCardId: that.data.punchCardId,
      workTasks: list,
      success: function (res) {
        wx.hideLoading();
        // wx.showModal({
        //   title: '下班打卡',
        //   content:'您已下班打卡成功!',
        //   showCancel: false,
        // })
        wx.showModal({
          title: '下班打卡',
          content: '打卡成功!',
          showCancel: false,
          success: function (res) {
            that.data.shakeEnable = true;
            if (res.confirm) {
              app.redirectToHome();
            }
          }
        })
      },
      fail: function (res) {
        that.data.shakeEnable = true;
        wx.hideLoading();
        var responseMsg = res.data.responseMsg
        wx.showModal({
          title: '下班打卡失败',
          content: responseMsg,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              app.redirectToHome();
            }
          },
        })
      },

    })
  },

  checkSubmit:function(){
    console.log('punchCardIn:', this.punchCardId)
    if (this.data.punchCardId == undefined){
      wx.showToast({
        title: '记录不存在，请先打班打卡',
        icon: 'none',
      });
      return false;
    }
    var list = this.getSelectedWrokTaskCode()
    console.log("选中工作任务:", list)
    if (list.length == 0) {
      wx.showToast({
        title: '请选择工作任务',
        icon: 'none',
      });
      return false;
    }

    if (this.data.workLog.length == 0) {
      wx.showToast({
        title: '请填写今日工作日志',
        icon: 'none',
      });
      return false;
    }

    return true;
  },

  submit:function(){
    var that = this;
    wx.showLoading({
      title: '提交中...',
    })
    if (this.submitWorkDiarySuccess == false){
      //先提交日志
      this.submitWrokDiary(that.data.workLog,
        //提交成功
        function (res) {
          that.submitPunchCardOut();
      },
        //提交失败
        function (res) {
          that.data.shakeEnable = true;
          wx.hideLoading();
          var responseMsg = res.data.responseMsg
          wx.showToast({
            title: responseMsg,
            icon: 'none',
          })
        }
      )
    }else{
      that.submitPunchCardOut();
    }

  },

  getSelectedWrokTaskCode: function () {

    var arr = [];
    for (var index in this.data.workTaskList) {
      var selected = this.data.workTaskList[index]['isSelected']
      if (selected) {
        arr.push(this.data.workTaskList[index]['taskCode'])
      }
    }
    return arr;
  },


  refreshAddress: function () {
    this.setData({
      address: '获取地址...',
    })
    this.getLocation();
  },



  shake: function () {
    var that = this;
    //启用
    wx.onAccelerometerChange(function (res) {
      //判断手机晃动幅度
      var x = res.x.toFixed(4);
      var y = res.y.toFixed(4);
      var z = res.z.toFixed(4);
      var offsetX = that.getShakeOffset(x, that.data.shakeData.x);
      var offsetY = that.getShakeOffset(y, that.data.shakeData.y);
      var offsetZ = that.getShakeOffset(z, that.data.shakeData.z);
      that.data.shakeData = {
        x: res.x.toFixed(4),
        y: res.y.toFixed(4),
        z: res.z.toFixed(4)
      };
      if ((offsetX && offsetY) || (offsetX && offsetZ) || (offsetY && offsetZ)) {
        //摇一摇成功 播放音乐
        if (that.data.shakeEnable) {
          that.data.shakeEnable = false;
          wx.vibrateLong();
          that.playShakeAudio();
          console.log('摇一摇成功');
        }

      }
    })

  },

  playShakeAudio: function () {
    var that = this;
    wx.playBackgroundAudio({
      dataUrl: 'http://7xqnxu.com1.z0.glb.clouddn.com/wx_app_shake.mp3',
      title: '',
      coverImgUrl: ''
    });
    wx.onBackgroundAudioStop(function () {
      if (that.checkSubmit()){
        wx.showModal({
          title: '下班打卡',
          content: '您确定要下班打卡?',
          success: function (res) {
            if (res.confirm) {
              that.submit();              
            }else if(res.cancel){
              that.data.shakeEnable = true;
            }
          }
        })
      }

    })
  },


  //计算摇一摇的偏移量
  getShakeOffset: function (val1, val2) {
    return (Math.abs(val1 - val2) >= 1);
  },

})
