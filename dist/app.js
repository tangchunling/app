/**
 * @file app.js
 * @desc [速店助手]微信小程序 - 入口
 * @version 0.0.1
 * @author Jerry <superzcj_001@163.com>
 * @date 2017-05-23
 * @copyright 2017
 */
/* jshint esversion: 6 */

App({
	getUserInfo(cb){
		let $this = this;
		if(this.globalData.userInfo){
			typeof cb == "function" && cb(this.globalData.userInfo);
		}
		else{
			//调用登录接口
			wx.login({
				success(){
					wx.getUserInfo({
						success(res){
							$this.globalData.userInfo = res.userInfo;
							typeof cb == "function" && cb($this.globalData.userInfo);
						},
					});
				}
			});
		}
	},
	onLaunch:function(){
		
	},
	globalData: {
		userInfo: null,
		sysUserInfo:null,
		app_key:'20170602000000',
		app_secret:'29831ED4CFE7BE3B7C7B6ADCFABC4DAE',
    	remoteUrl:'',
    	ajaxCount:0
	}
});