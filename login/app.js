//app.js

var MD5 = require('./lib/md5.js');

App({
  onLaunch: function () {
    //获取系统信息
    var that = this
    var system = wx.getSystemInfo({
      success: function (res) {
        that.globalData.systemInfo = res
      }
    })
  },

  //获取公共查询字符串
  getPublicQueryString: function () {

    var normal = {
      lng: 0,
      lat: 0,
      hig: 0,
      appType: this.globalData.appType,
      sysversion: this.globalData.systemInfo.version,
    };

    var params = {
      client: 'wechatMinis',
      cuid: this.globalData.cuid,
      format: 'json',
      time: Date.parse(new Date()),
      version: this.globalData.systemInfo.version,
    };
    var signMd5 = this.getParamsMD5(params)
    params['sign'] = signMd5;

    //合并两个字典
    for (var key in normal){
      params[key] = normal[key]
    }

    //获取所有key
    var keys = this.allKeys(params);
    //拼装url参数
    var str = ''
    for (var i in keys.sort()){
      str += `${keys[i]}=${params[keys[i]]}&`
    }
    str = str.substring(0, str.length-1)  //删除最后一个字符"&"

    return str;
  },

  getParamsMD5:function(params){
    //获取所有key
    var keys = this.allKeys(params);

    //字符串拼接
    var str = '';
    str += this.globalData.signSecretKey //前后都要拼接秘钥
    for (var i in keys.sort()) {
      str += params[keys[i]]
    }
    str += this.globalData.signSecretKey //前后都要拼接秘钥

    //进行md5
    var md5Str = MD5.hexMD5(str); //进行md5
    return md5Str;
  },

  allKeys:function(dict){
    var keys = [];
    for (var p in dict) {
      if (dict.hasOwnProperty(p))
        keys.push(p)
    }
    return keys
  },

  globalData: {
    systemInfo:null,
    appType:'moonAngel',
    loginSecretKey:'19491001',
    signSecretKey: 'Er78s1hcT4Tyoaj2',
    deviceNum:'test88888888',
    cuid:'testcuid',
  }
})