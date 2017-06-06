var md5 = require('../utils/md5.js');
const app = getApp();
/**
 * 按对象的key字母排序
 */
function objKeySort(obj) {
  var newkey = Object.keys(obj).sort();
  var newObj = {};//
  newkey.forEach(v => {   
    if(v != 'sign')
      newObj[v] = obj[v];
  });
  return newObj;
}

/**
 * http请求加密签名
 */
function sign(obj, appSecret) {
  appSecret = app.globalData.app_secret;
  var sortedObj = objKeySort(obj);
  var str = "app_secret" + appSecret + JSON.stringify(sortedObj).replace(/{/, "").replace(/}/, "").replace(/\,/g, "").replace(/\:/g, "").replace(/\"/g,"");
  return md5.hexMD5(str).toUpperCase();
}

exports.sign = sign;