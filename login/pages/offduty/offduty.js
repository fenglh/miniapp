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
    open:false,

  },



  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '下班打卡',
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#576b95',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })

    this.getPunchCardInfo();
    this.getLocation();
    
    // if (this.data.workplace.workplaceCode != undefined) {
    //   //初始化工作任务
    //   this.getWorkTaskInfo(this.data.workplace.workplaceCode);
    // }

    


  },

  onReady:function(e){
    wx.onAccelerometerChange(function (res) {
      console.log(res.x)
      console.log(res.y)
      console.log(res.z)
    })
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
  carBoxBindTap:function(e){
    var that = this;
    this.setData({
      open: !that.data.open,
    })
    this.data.open ? console.log('展开') : console.log('收缩')
  },

  //获取打卡信息
  getPunchCardInfo:function(){
    var that = this;
    request.getPunchCardInfo({
      token: userManager.userInfo.token,
      success:function(res){
        console.log('获取打卡信息成功:', res);
        that.setData({
          workTaskList:res.data.workTaskList,
        })
      },
      fail:function(res){
        console.log('获取打卡信息失败:', res);
        this.setData({
          addressParseFail: true,
        })
      },
    })
  },

  //获取定位信息
  getLocation:function(){
    var that = this;
    this.setData({
      locating:true,
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
          locateFail:res.latitude == 0,
        })
      }
    })
  },

refreshAddress: function () {
    this.setData({
      address: '获取地址...',
    })
    this.getLocation();
  },









})
