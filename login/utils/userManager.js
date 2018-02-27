



//登录状态：正常、未登录、token过期
export const LoginStatusNormal = 0
export const LoginStatusUnLogin = 1
export const LoginStatusTokenInvalid = 2

var userManager = {

  userInfo: {
    token: '',
    loginStatus: LoginStatusUnLogin,
    account: '',
    blood: '',
    empType: '',
    mobileNo: '',
    realName: '',
    sex: '',
  },

  cacheUserInfo: function () {
    wx.setStorage({
      key: 'userInfo',
      data: this.userInfo,
    })
  },

}

module.exports = userManager;