var SNHttp = require('../utils/request.js');
let _compData = {
  '__cpdata__categories__.isHide': true,
  '__cpdata__categories__.categories': [],
  '__cpdata__categories__.sheight:':'200px',
  '__cpdata__categories__.animationData':{},
  '__cpdata__categories__.curIndex':0,
  '__cpdata__categories__.curNav':0
}

let _compEvent = {
  __cpevent__categories__clickLv2Category:function() {
    // body...
  },
  onClickLv1Category:function(e){
    this.setData({'__cpdata__categories__.curIndex':e.target.dataset.index,'__cpdata__categories__.curNav':e.target.dataset.id})
  }
}

let categoriesComponent = {
  show: function(data) {
    this.__page.setData({'__cpdata__categories__.isHide': false})
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.__page.setData({
      '__cpdata__categories__.animationData':animation.translateY(0).step().export()
    })
    if (data) {
      Object.assign(this._configs, data)
    }
  },
  hide:function(){
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.__page.setData({
      '__cpdata__categories__.animationData':animation.translateY(-this.__page.data.__cpdata__categories__.sheight).step().export()
    })
    this.__page.setData({'__cpdata__categories__.isHide': true})
  },
  init: function(opt){
    var that = this;
    SNHttp.request({
      url: "http://dev01.hzsunong.cn/gateway/mina/",
      method: 'POST',
      data: {
        action: 'mina.orgz.product.categories',
        uuid: ''
      },
      success: function (res) {
        if (res.data.code === 0){
          var categories = res.data.data;
          categories.forEach(v => {
            if(v.list.length == 0){
              v.list.push({category_id:v.category_id,category_name:v.category_name})
            }
          })
          that.__page.setData({'__cpdata__categories__.categories': categories})
          that.__page.setData({'__cpdata__categories__.curNav': res.data.data[0].category_id})
          that.__page.setData({'__cpdata__categories__.sheight': opt.sheight})
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
  }
}

function CategoriesComponent (opt) {
  if(opt == null&& opt == undefined)
    opt = {};
  // 定义组件的一些回调
  this._configs = {
    sendCode: null,
    closeCode: null,
    login: null
  }
  let pages = getCurrentPages()
  let curPage = pages[pages.length - 1]
  Object.assign(curPage, _compEvent)
  this.__page = curPage
  
  Object.assign(this, categoriesComponent)
  var that = this;
  wx.getSystemInfo({
    success: function (res) {
      opt.sheight = res.windowHeight-150;
      that.init(opt);
    }
  });
  
  curPage.categoriesComponent = this
  curPage.setData(_compData)
  return this
}

module.exports = {
  CategoriesComponent
}