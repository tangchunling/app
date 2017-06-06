// index.js
var event = require('../utils/event.js');
var SNHttp = require('../utils/request.js');
var DateUtil = require('../utils/date.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dashboard:{
      
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '速店助手'
    })
    var that = this; 
    SNHttp.request({
      url: "http://dev01.hzsunong.cn/gateway/mina/",
      method: 'POST',
      data: {
        action: 'mina.orgz.sales.summary',
        orgz_id: app.globalData.sysUserInfo.orgz_id,
        uuid: '',
        date: DateUtil.formatDate("yyyy-MM-dd",new Date())
      },
      success: function (res) {
        if (res.data.code == 0){
          that.setData({dashboard:res.data.data});
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'fail',
            duration: 2000
          });
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '失败',
          icon: 'fail',
          duration: 2000
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
  
  },
  goYaohuo:function(){
    SNHttp.request({
      url: "http://dev01.hzsunong.cn/gateway/mina/",
      method: 'POST',
      data: {
        action: 'mina.company.ordertime',
        uuid: ''
      },
      success: function (res) {
        if (res.data.code == 0){
          var now = new Date();
          var restrictStart = new Date();
          var restrictEnd = new Date();
          restrictStart.setHours(res.data.data.orgz_order_start_time.split(':')[0]);
          restrictStart.setMinutes(res.data.data.orgz_order_start_time.split(':')[1]);
          restrictEnd.setHours(res.data.data.orgz_order_end_time.split(':')[0]);
          restrictEnd.setMinutes(res.data.data.orgz_order_end_time.split(':')[1]);
          if(now < restrictStart || now > restrictEnd){
            wx.redirectTo({url:'/store/order/forbidden?startTime='+res.data.data.orgz_order_start_time+'&endTime='+res.data.data.orgz_order_end_time});
          }else{
            wx.navigateTo({url:'/store/order/yaohuo'});
          }
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'fail',
            duration: 3000
          });
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '失败',
          icon: 'fail',
          duration: 3000
        });
      }
    })
  },
  test:function(){
    return 1;
  }
})