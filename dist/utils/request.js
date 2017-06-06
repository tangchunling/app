var security = require('./security.js');
const app = getApp();
/**
 * 补充校验信息的请求
 */
function request(opt){
  //补充校验相关参数
  opt.data['app_key'] = app.globalData.app_key;
  opt.data['version'] = '1.0';
  opt.data['hq_code'] = app.globalData.sysUserInfo.hq_code;
  opt.data['timestamp'] = '2017-05-25';
  opt.data['access_token'] = app.globalData.sysUserInfo.access_token;
  opt.data['sign'] = security.sign(opt.data, app.globalData.app_secret);
  opt.header = {'content-type': 'application/json'};
  if(opt.showLoading == undefined){
    opt.showLoading = true;
  }
  var func = opt.complete;
  if(opt.complete != null && opt.complete != undefined && typeof opt.complete === 'function'){
  	opt.complete = function(){
      if(opt.showLoading){
        app.globalData.ajaxCount--;
      }
      if(app.globalData.ajaxCount == 0 && opt.showLoading){
        wx.hideLoading();
      }
      func();
  	} 
  }else{
  	opt.complete = function(){
      if(opt.showLoading){
        app.globalData.ajaxCount--;
      }
      if(app.globalData.ajaxCount == 0 && opt.showLoading){
        wx.hideLoading();
      }
  	} 
  }
  if(opt.showLoading){
    wx.showLoading({mask:true,title:'加载中',icon:'loading'});
    app.globalData.ajaxCount++;
  }
  
  wx.request(opt);
}

exports.request = request;