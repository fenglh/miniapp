
const request = require('../../utils/request.js')
import { LoginStatusUnLogin, LoginStatusNormal, LoginStatusTokenInvalid, userManager } from '../../utils/userManager.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "BM003",
    searchResults:[]
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    if(this.data.inputVal.length>0){
      this.search();
    }else{
      console.log('取消搜索');
      this.setData({
        inputVal: "",
        inputShowed: false
      });
    }

  },
  search:function(){
    var that = this;
    request.getWorkplaceList({
      token: userManager.userInfo.token,
      condition: that.data.inputVal,
      count: 30,
      success: function (res) {
        console.log(res)
        that.setData({
          searchResults: res.data.workplaceList,
        })
      },
      fail: function (res) {
        console.log(res)
      }
    });
  },

  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  resultBindtap:function(e){
    var index = e.currentTarget.dataset.page;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length-2];//上一页
    var workplace = this.data.searchResults[index];
    prevPage.refreshWorkTask(workplace)
    wx.navigateBack({
      delta:1,
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.setNavigationBarTitle({
        title: '选择工作地点',
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#576b95',
      })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (this.data.inputVal.length > 0){
      this.showInput();
      this.search();
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})