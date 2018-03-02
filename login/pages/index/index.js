//index.js
//获取应用实例

const request = require('../../utils/request.js')

const WxNotificationCenter = require("../../utils/WxNotificationCenter.js");
const coordtransform = require('../../lib/coordtransform.js');
import { LoginStatusUnLogin, LoginStatusNormal, LoginStatusTokenInvalid, userManager } from '../../utils/userManager.js'
const app = getApp()

// var interval;
// var varName;
// var ctx = wx.createCanvasContext('canvasProgressbg');


Page({
  data: {
    userInfo: userManager.userInfo,
    animationDuration: 400,
    scrollindex: 0,  //当前页面的索引值
    totalnum: 2,  //总共页面数
    starty: 0,  //开始的位置x
    endy: 0, //结束的位置y
    margintop: 0,  //滑动下拉距离

    time:'00:00:00',
    //经纬度信息
    latitude: 0,
    longitude: 0,
    altitude: 0,
    address: '',
    //工作任务选择
    workplace: {},//工作地点
    workTaskList: [],

    //圆圈
    count: 0,//计数器，初始值为0
    maxCount: 100, // 绘制一个圆环所需的步骤 
    countTimer: null,//定时器，初始值为null

  },

  //页面加载，先后顺序:onLoad->onShow->onReady
  onLoad: function () {
    console.log('onLoad')
    var that = this
    WxNotificationCenter.addNotification("userInfoChangeNotificationName", that.userInfoChangeNotificationFn, that)
    WxNotificationCenter.addNotification("tokenInvalidNotificationName", that.tokenInvalidNotificationFn, that)
    wx.setNavigationBarTitle({
      title: '上班打卡',
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#576b95',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })

    this.getLocation();

    var that = this;
    var myDate = new Date();
    var time = `${myDate.getHours()}:${myDate.getMinutes()}:${myDate.getSeconds()}`
    that.setData({
      time: time,
    })

    setInterval(function(){
      console.log('显示当前时间')
      var myDate = new Date();
      var time = `${myDate.getHours()}:${myDate.getMinutes()}:${myDate.getSeconds()}`
      that.setData({
        time: time,
      })


    },1000);
  },


  //页面初次渲染完成，先后顺序:onLoad->onShow->onReady
  onReady: function () {
    console.log('onReady')
    //画圆
    // this.drawCircle();

    this.drawCircle('canvasProgressbg', 110, 20, 2); 
    this.countInterval()

    //初始化动画

  },

  tokenInvalidNotificationFn: function () {
    console.log('token无效')
    //设置登录状态
    userManager.userInfo.loginStatus = LoginStatusTokenInvalid;
    console.log(LoginStatusTokenInvalid)
    console.log(userManager.userInfo)
    userManager.cacheUserInfo()
    this.userInfoChangeNotificationFn()
    wx.redirectTo({
      url: '../login/login',
    });

  },

  userInfoChangeNotificationFn: function () {
    console.log('收到用户信息改变通知，刷新当前页面用户信息')
    //刷新数据
    this.setData({
      userInfo: userManager.userInfo,
    })
  },





  refreshWorkTask: function (workplace) {
    console.log('选择工作地点')
    console.log(workplace)
    this.setData({
      workplace: workplace,
    })

    this.getWorkTaskInfo(workplace.workplaceCode)
  },

  getWorkTaskInfo: function (workplaceCode) {

    if (workplaceCode.length <= 0) return;

    var that = this;
    request.getWorkTask({
      token: userManager.userInfo.token,
      workplaceCode: workplaceCode,
      success: function (res) {
        console.log('获取工作任务信息')
        console.log(res)
        that.setData({
          workTaskList: res.data.workTaskList,
        })

      },
      fail: function (res) {
        console.log(res)
      },
    })
  },

  getLocation: function () {
    var that = this
    wx.getLocation({
      success: function (res) {
        //国测局坐标转百度经纬度坐标
        var gcj02 = coordtransform.wgs84togcj02(res.longitude, res.latitude);
        var bd09 = coordtransform.gcj02tobd09(gcj02[1], gcj02[0]);

        that.setData({
          latitude: bd09[0],
          longitude: bd09[1],
          altitude: res.altitude,
        })

        request.getGpsAddress({
          token: userManager.userInfo.token,
          altitude: res.altitude,
          latitude: bd09[0],
          longitude: bd09[1],
          success: function (res) {
            console.log('经纬度解释地理名称成功!')
            console.log(res)
            that.setData({
              address: res.data.addressInfo.formattedAddress,
            })
          },
          fail: function (res) {
            console.log(res)
          }
        })
      },
    })
  },

  taskBindtap: function (e) {
    console.log('选中工作任务');
    var index = e.currentTarget.dataset.page;
    this.data.workTaskList[index].isSelected = !this.data.workTaskList[index].isSelected;


    var that = this;
    this.setData({
      workTaskList: that.data.workTaskList,
    })

    console.log(this.data.workTaskList[index])
  },



  drawCircle: function (id, x, w, step) {
    // 使用 wx.createContext 获取绘图上下文 context  绘制彩色进度条圆环
    var context = wx.createCanvasContext(id);
    // 设置渐变
    var gradient = context.createLinearGradient(2 * x, x, 0);
    gradient.addColorStop("0", "#2661DD"); gradient.addColorStop("0.5", "#40ED94"); gradient.addColorStop("1.0", "#5956CC");
    context.setLineWidth(w); context.setStrokeStyle(gradient); context.setLineCap('round')
    context.beginPath();//开始一个新的路径
    // step 从0到2为一周
    context.arc(x, x, x - w, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
    context.stroke();//对当前路径进行描边
    context.draw()
  },

  countInterval: function () {
    // 设置倒计时 定时器 假设每隔100毫秒 count递增+1，当 count递增到两倍maxCount的时候刚好是一个圆环（ step 从0到2为一周），然后改变txt值并且清除定时器
    this.countTimer = setInterval(() => {
      if (this.data.count <= 2 * this.data.maxCount) {
        // 绘制彩色圆环进度条
        this.drawCircle('canvasProgressbg', 110, 10, this.data.count / this.data.maxCount)
        this.data.count++;
      } else {
        this.setData({
          txt: "匹配成功"
        });
        clearInterval(this.countTimer);
      }
    }, 10)
  },



})
