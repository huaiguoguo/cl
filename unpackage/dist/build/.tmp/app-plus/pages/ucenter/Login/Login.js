(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/ucenter/Login/Login"],{3128:function(n,t,e){"use strict";var a=function(){var n=this,t=n.$createElement;n._self._c;n._isMounted||(n.e0=function(t){2==n.channel&&(n.channel=1)},n.e1=function(t){1==n.channel&&(n.channel=2)})},o=[];e.d(t,"a",function(){return a}),e.d(t,"b",function(){return o})},"41bf":function(n,t,e){},"9a38":function(n,t,e){"use strict";e.r(t);var a=e("df3a"),o=e.n(a);for(var r in a)"default"!==r&&function(n){e.d(t,n,function(){return a[n]})}(r);t["default"]=o.a},a3e8:function(n,t,e){"use strict";e.r(t);var a=e("3128"),o=e("9a38");for(var r in o)"default"!==r&&function(n){e.d(t,n,function(){return o[n]})}(r);e("c368");var c=e("2877"),i=Object(c["a"])(o["default"],a["a"],a["b"],!1,null,null,null);t["default"]=i.exports},c368:function(n,t,e){"use strict";var a=e("41bf"),o=e.n(a);o.a},df3a:function(n,t,e){"use strict";(function(n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=e("2f62");function o(n){for(var t=1;t<arguments.length;t++){var e=null!=arguments[t]?arguments[t]:{},a=Object.keys(e);"function"===typeof Object.getOwnPropertySymbols&&(a=a.concat(Object.getOwnPropertySymbols(e).filter(function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),a.forEach(function(t){r(n,t,e[t])})}return n}function r(n,t,e){return t in n?Object.defineProperty(n,t,{value:e,enumerable:!0,configurable:!0,writable:!0}):n[t]=e,n}var c={data:function(){return{account:"",password:"",channel:1}},methods:o({},(0,a.mapActions)({sigin:"login"}),{agree:function(){n.navigateTo({url:"/pages/ucenter/mysetting/agree/agree"})},checkFormForAccount:function(){if(!this.account)return n.showToast({icon:"none",title:"请输入"+(1==this.channel?"手机号码":"邮箱")}),!1;if(1==this.channel){if(-1==this.account.search(/^1[3-9]{1}\d{9}$/))return n.showToast({icon:"none",title:"请输入正确的手机号码"}),!1}else if(2==this.channel&&-1==this.account.search(/^[a-zA-Z0-9!#$%&'*+\\\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\\\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/))return n.showToast({icon:"none",title:"请输入正确的邮箱地址"}),!1;return!!this.password||(n.showToast({icon:"none",title:"请输入密码"}),!1)},login:function(t){if(!this.checkFormForAccount())return!1;var e=this;this.httpRequest("site/login","POST",{username:e.account,password:e.password,channel:e.channel},function(t){t.data;200==t.data.code?(e.sigin(t.data.data),e.toast("登录成功","success",1e3),e._setTimeout(function(){n.switchTab({url:"/pages/ucenter/ucenter"})},1e3)):e.toast(t.data.message)})},forget:function(){n.navigateTo({url:"/pages/ucenter/Forget/Forget"})},newuser:function(){n.navigateTo({url:"/pages/ucenter/Register/Register"})}})};t.default=c}).call(this,e("6e42")["default"])}},[["df17","common/runtime","common/vendor"]]]);