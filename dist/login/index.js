/**
 * @file pages/app.js
 * @desc [速店助手]微信小程序 - 首页
 * @version 0.0.1
 * @author Jerry <superzcj_001@163.com>
 * @date 2017-05-23
 * @copyright 2017
 */
/* jshint esversion: 6 */
var event = require('../utils/event.js');
var security = require('../utils/security.js');
const app = getApp();

Page({
	data: {
    phone:'',
    password:''
    },
	/**
	 * 加载完成回调
	 * @version 0.0.1
	 * @author Jerry <superzcj_001@163.com>
	 * @date 2017-05-23
	 */
	onLoad(){
    
    event.on('DataChanged', this, function(data){
      this.setData({
        phone: data
      })
    });
  },
  onUnload(){
    event.remove('DataChanged', this);
  },
  onLogin(){
    var that = this;
    var data = {
        action: 'mina.account.login',
        hq_code: '000000',
        uuid: '',
        username:this.data.phone,
        password:this.data.password,
        app_key:app.globalData.app_key,
        timestamp: '2017-05-25',
        version: '1.0'
    }
    data.sign = security.sign(data, app.globalData.app_secret);
    wx.showLoading();
    wx.request({
      url: "http://dev01.hzsunong.cn/gateway/mina/",
      showLoading:false,
      method: 'POST',
      data: data,
      success: function (res) {
        wx.hideLoading();
        if(res.data.code == 0){
          wx.setStorage({key:'sysUserInfo',data:res.data.data});
          app.globalData.sysUserInfo = res.data.data;
          wx.redirectTo({ url: '../store/index' });
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'fail',
            duration: 2000
          });
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: '失败',
          icon: 'fail',
          duration: 2000
        });
      }
    })    
  },
  goPurchase(){
    wx.redirectTo({ url: '../purchase/index' });
  },
  inputUsername(e){
    this.setData({phone:e.detail.value})
  },
  inputPassword(e){
    this.setData({password:e.detail.value})
  }
});