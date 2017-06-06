// yaohuo.js
var SNHttp = require('../../utils/request.js');
var DateUtil = require('../../utils/date.js');

import { CategoriesComponent } from '../../component/categories';
const app = getApp();
var sliderWidth = 93.75;
Page({
  CategoriesComponent,
  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["总部配货", "门店要货", "今日要货"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    inputShowed: false,
    inputVal: "",
    mode:1,
    __cpdata__categories__:{},
    hiddenYaohuoModal:true,
    hiddenJRYaohuoModal:true,
    zbGoods:[],
    mdGoods:[],
    scrollHeight:0,
    limitMDGoods:20,
    mdGoodsSort:'',
    mdGoodsSortMode:0,
    offsetMDGoods:0,
    isLoadingMDgoods:false,
    categoryId:'',
    jrGoods:[],
    isLoadingJRgoods:false,
    limitJRGoods:20,
    offsetJRGoods:0,
    modifyMDGood:{},
    modifyMDQty:'',
    modifyJRQty:'',
    modifyJRGood:{},
    isLoadingZBgoods:false,
    limitZBGoods:20,
    offsetZBGoods:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '发起要货'
    })
    var that = this;
    new this.CategoriesComponent()
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  getMDGoods(){
    if(this.data.isLoadingMDgoods){
      return;
    }
    this.setData({isLoadingMDgoods:true});
    var that = this;
    SNHttp.request({
      url: "http://dev01.hzsunong.cn/gateway/mina/",
      showLoading:false,
      method: 'POST',
      data: {
        action: 'orgz.product.list',
        hq_code: '000000',
        uuid: '',
        orgz_id: app.globalData.sysUserInfo.orgz_id,
        filter:that.data.inputVal,
        limit:that.data.limitMDGoods,
        offset:that.data.offsetMDGoods,
        category_id:that.data.categoryId,
        order:that.data.mdGoodsSort
      },
      success: function (res) {
        if(res.data.data.length>0){
          that.setData({mdGoods:that.data.mdGoods.concat(res.data.data),offsetMDGoods:that.data.offsetMDGoods+res.data.data.length})
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '失败',
          icon: 'fail',
          duration: 2000
        });
      },
      complete:function(){
        that.setData({isLoadingMDgoods:false});
        wx.hideLoading();
      }
    })
  },
  getJRGoods(){
    if(this.data.isLoadingJRgoods){
      return;
    }
    this.setData({isLoadingJRgoods:true});
    var that = this;
    SNHttp.request({
      url: "http://dev01.hzsunong.cn/gateway/mina/",
      method: 'POST',
      data: {
        action: 'orgz.product.orderlist',
        hq_code: '000000',
        uuid: '',
        orgz_id: app.globalData.sysUserInfo.orgz_id,
        limit:that.data.limitJRGoods,
        offset:that.data.offsetJRGoods
      },
      success: function (res) {
        if(res.data.data.length>0){
          that.setData({jrGoods:that.data.jrGoods.concat(res.data.data),offsetJRGoods:that.data.offsetJRGoods+res.data.data.length})
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '失败',
          icon: 'fail',
          duration: 2000
        });
      },
      complete:function(){
        that.setData({isLoadingJRgoods:false});
      }
    })
  },
  getZBGoods(){
    if(this.data.isLoadingZBgoods){
      return;
    }
    var that = this;
    SNHttp.request({
      url: "http://dev01.hzsunong.cn/gateway/mina/",
      method: 'POST',
      data: {
        action: 'mina.hq.dispatching',
        hq_code: '000000',
        uuid: '',
        orgz_id: app.globalData.sysUserInfo.orgz_id,
        limit:that.data.limitZBGoods,
        offset:that.data.offsetZBGoods
      },
      success: function (res) {
        if(res.data.data.length>0){
          that.setData({zbGoods:that.data.zbGoods.concat(res.data.data),offsetZBGoods:that.data.offsetZBGoods+res.data.data.length})
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '失败',
          icon: 'fail',
          duration: 2000
        });
      },
      complete:function(){
        that.setData({isLoadingZBgoods:false});
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
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({scrollHeight:res.windowHeight-150})
      }
    });
    SNHttp.request({
      url: "http://dev01.hzsunong.cn/gateway/mina/",
      method: 'POST',
      data: {
        action: 'mina.company.ordertime',
        hq_code: '000000',
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
          }
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
    this.getMDGoods();
    this.getJRGoods();
    this.getZBGoods();
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
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  showInput: function () {
      this.setData({
          inputShowed: true
      });
  },
  hideInput: function () {
      this.setData({
          inputVal: "",
          inputShowed: false
      });
      this.onSearchMDGoods()
  },
  clearInput: function () {
      this.setData({
          inputVal: ""
      });
      this.onSearchMDGoods();
  },
  inputTyping: function (e) {
      this.setData({
          inputVal: e.detail.value
      });
      if(e.detail.value.length < 2){
        return;
      }
      this.onSearchMDGoods();
  },
  onTriggerCategories :function(){
    if(this.data.mode == 1){
      this.setData({mode:2});
      this.categoriesComponent.show();
    }else{
      this.setData({mode:1});
      this.categoriesComponent.hide();
    }
  },
  showModifyQty:function(e){
    this.setData({hiddenYaohuoModal:false,modifyMDGood:this.data.mdGoods[e.target.dataset.index],modifyMDQty:''})
  },
  closeModifyQty:function(){
    this.setData({hiddenYaohuoModal:true});
  },
  onCloseYaohuoModal:function(){
    this.setData({hiddenYaohuoModal:true})
  },
  showJRModifyQty:function(e){
    this.setData({hiddenJRYaohuoModal:false,modifyJRGood:this.data.jrGoods[e.target.dataset.index],modifyJRQty:''})
  },
  closeJRModifyQty:function(){
    this.setData({hiddenJRYaohuoModal:true});
  },
  onCloseJRYaohuoModal:function(){
    this.setData({hiddenJRYaohuoModal:true})
  },
  onSearchMDGoods:function(){
    this.setData({offsetMDGoods:0,mdGoods:[]})
    this.getMDGoods()
  },
  loadMoreMDGoods:function(){
    this.getMDGoods();
  },
  onClickLv2Category:function(e){
    this.setData({'categoryId':e.currentTarget.dataset.id,mode:1,offsetMDGoods:0,mdGoods:[]})
    this.categoriesComponent.hide()
    this.getMDGoods()
  },
  loadMoreJRGoods:function(){
    this.getJRGoods();
  },
  changeMDQty:function(e){
    var qtyReg = /(?:(?:[1-9]\d*|0(?!\d))(?:\.\d{0,2})?)?/;
    var qty = e.detail.value;
    qty = qtyReg.exec(qty);
    qty     = qty === null ? '' : qty[0];
    this.setData({modifyMDQty:qty});
  },
  changeJRQty:function(e){
    var qtyReg = /(?:(?:[1-9]\d*|0(?!\d))(?:\.\d{0,2})?)?/;
    var qty = e.detail.value;
    qty = qtyReg.exec(qty);
    qty     = qty === null ? '' : qty[0];
    this.setData({modifyJRQty:qty});
  },
  onSaveYaohuo:function(){
    var that = this;
    if(this.data.modifyMDQty == '' || this.data.modifyMDQty < 100 || this.data.modifyMDQty % this.data.modifyMDGood.spec_num != 0){
      wx.showToast({
        title: '最低要货数量不少于100且为规格的整数倍',
        icon: 'fail',
        duration: 2000
      });
      return;
    }
    wx.showLoading({mask:true,title:'加载中',icon:'loading'});
    SNHttp.request({
      url: "http://dev01.hzsunong.cn/gateway/mina/",
      method: 'POST',
      data: {
        action: 'orgz.product.order',
        hq_code: '000000',
        uuid: '',
        orgz_id: app.globalData.sysUserInfo.orgz_id,
        quantity:this.data.modifyMDQty,
        product_id:this.data.modifyMDGood.product_id,
        invoice_id:this.data.modifyMDGood.invoice_id
      },
      showLoading:false,
      success: function (res) {
        wx.hideLoading();
        if(res.data.code == 0){
          that.setData({offsetJRGoods:0,jrGoods:[],offsetMDGoods:0,mdGoods:[]});
          that.getMDGoods();
          that.getJRGoods();
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          });
          that.closeModifyQty();
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'cancel',
            duration: 2000
          });
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: '通信失败',
          icon: 'fail',
          duration: 2000
        });
      }
    })
  },
  onChangeYaohuo:function(){
    var that = this;
    if(this.data.modifyJRQty == '' || this.data.modifyJRQty < 100 || this.data.modifyJRQty % this.data.modifyJRGood.spec_num != 0){
      wx.showToast({
        title: '最低要货数量不少于100且为规格的整数倍',
        icon: 'fail',
        duration: 2000
      });
      return;
    }
    wx.showLoading({mask:true,title:'加载中',icon:'loading'});
    SNHttp.request({
      url: "http://dev01.hzsunong.cn/gateway/mina/",
      method: 'POST',
      data: {
        action: 'orgz.product.order',
        hq_code: '000000',
        uuid: '',
        orgz_id: app.globalData.sysUserInfo.orgz_id,
        quantity:this.data.modifyJRQty,
        product_id:this.data.modifyJRGood.product_id,
        invoice_id:this.data.modifyJRGood.invoice_id
      },
      showLoading:false,
      success: function (res) {
        wx.hideLoading();
        if(res.data.code == 0){
          that.setData({offsetJRGoods:0,jrGoods:[]});
          that.getJRGoods();
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          });
          that.closeJRModifyQty();
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'cancel',
            duration: 2000
          });
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: '通信失败',
          icon: 'fail',
          duration: 2000
        });
      }
    })
  },
  onSortMDgoods:function(){
    if(this.data.mdGoodsSortMode == 0){
      this.setData({mdGoodsSortMode:1,mdGoodsSort:'asc'})
    }else if(this.data.mdGoodsSortMode == 1){
      this.setData({mdGoodsSortMode:2,mdGoodsSort:'desc'})
    }else if(this.data.mdGoodsSortMode == 2){
      this.setData({mdGoodsSortMode:0,mdGoodsSort:''})
    }
    this.onSearchMDGoods();
  }
})