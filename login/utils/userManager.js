



//登录状态：正常、未登录、token过期


export const LoginStatusUnLogin = 0
export const LoginStatusNormal = 1
export const LoginStatusTokenInvalid = 2

var userManager = {

  userInfo: {
    token: '',
    loginStatus: LoginStatusUnLogin,
    account: '',
    pwd:'',
    blood: '',
    empType: '',
    mobileNo: '',
    realName: '',
    sex: '',
  },
  
  initUserInfoFromCache:function(){
    //获取缓存数据
    try {
      var userInfo = wx.getStorageSync('userInfo')
      if (userInfo != '') {
        userManager.userInfo = userInfo
      }
    } catch (e) {
      //不做任何处理
      console.log("用户缓存数据被清空，请重新登录");
    }
    return userManager.userInfo;
  },

  cacheUserInfo: function () {
    var that = this
    console.log('缓存数据：')
    console.log(this.userInfo)
    wx.setStorage({
      key: 'userInfo',
      data: that.userInfo,
    })
  },

}

var info = userManager.initUserInfoFromCache()

module.exports = { LoginStatusUnLogin, LoginStatusNormal, LoginStatusTokenInvalid, userManager};