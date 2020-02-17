import Vue from 'vue'
import App from './App'

import store from './store'

import checklogin from './common/util'


Vue.config.productionTip = false

let dev = 'http://api.changli.com/v1/';
let pro = 'http://cl.phpdx.me/v1/';

let dev_socket_host = 'ws://cl.phpdx.me:9501';
let pro_socket_host = 'ws://cl.phpdx.me:9501';

Vue.prototype.api_host = pro
Vue.prototype.socket_host = dev_socket_host
Vue.prototype.current_timestamp = Date.parse(new Date())/1000;

Vue.prototype.window = window

Vue.prototype.$store = store;

Vue.prototype.toast = function(title, icon='none', duration=1500){
	uni.showToast({
		title: title,
		icon: icon,
		duration:duration
	});
}


Vue.prototype._setTimeout = function(fu, duration=2000){
	setTimeout(fu, duration);
}


Vue.prototype.copy = function(text){
	let _this = this;
	uni.setClipboardData({
		data:text,
		success:function(){
			_this.toast('复制成功', 'none', 1000);
		}
	});
}

Vue.prototype.checklogin = function(url='') {
	
	let _this = this;
	console.log('这是url:',url);
	// console.log('这是checklogin:',this.$store.state.userInfo);
	let state = this.$store.state;
	let token = state.token;
	let expri = state.expri;
	
	let current_time = Math.round(new Date() / 1000);

	if (url != 'site/login' && url != 'site/retieve-pwd' && url != 'site/signup'){
		if (token == '' || token == undefined || token == 'undefined' || expri == '' || expri == undefined || expri == 'undefined' || expri < current_time ) {
			this.toast('登录过期!!');
			this.$store.commit('logout');
			uni.redirectTo({
				url: '/pages/ucenter/Login/Login'
			});
			return false;
		}else{
			// console.log('没过期');
		}
	}else{
		let token = state.token;
		let expri = state.expri;
		console.log("token: ",token);
		console.log("expri: ",expri);
	}
	return true;
}


Vue.prototype.httpRequest = function(url, method, data, successFn){
	
	if (!this.checklogin(url)) {
		return false;
	}
	
	let _this = this;

	let state = _this.$store.state;
	let token = state.token;
	let url_token = _this.api_host + url + '?&token='+token;
	console.log('这是加了token的url:',url_token);
	
	uni.request({
		url: _this.api_host + url,
		method: method,
		header: {
			'Authorization': 'Bearer'+token
		},
		data: data,
		success: function(res) {
			if(res.data.code == 200){
				if(url == 'site/login'){
					_this.$store.dispatch('login', res.data.data)
					_this.getUserInfo();
				}
				console.log('开始调用回调');
				successFn(res);
			} else if(res.data.code == 210){
				console.log('开始调用回调210');
				successFn(res);
				// _this.toast(res.data.message);
				// _this.$store.dispatch('logout')
			} else if(res.data.code == 401){
				_this.$store.dispatch('logout')
				uni.redirectTo({
					url:'/pages/ucenter/Login/Login?backpage='
				});
			} else if(res.data.code == 203){
				_this.toast(res.data.message);
				_this.$store.dispatch('logout')
			}else{
				_this.toast(res.data.message);
			}
		},
		fail: (err) => {
			_this.toast(err.errMsg);
		}
	});
}

Vue.prototype.getUserInfo = function() {
	let _this = this;
	this.httpRequest('user/get-user-info', 'GET', {}, function(res) {
		let result = res.data;
		if (result.code == 200) {
			// dispatch
			_this.$store.commit('userInfo', result.data)
		} else {
			_this.toast(result.message);
		}
	});
}


App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()