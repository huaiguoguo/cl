(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/ucenter/mysetting/bindEmail/bindEmail"],{"63d8":function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;e._self._c},a=[];n.d(t,"a",function(){return i}),n.d(t,"b",function(){return a})},"6ec7":function(e,t,n){},"7d60":function(e,t,n){"use strict";var i=n("6ec7"),a=n.n(i);a.a},9336:function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=n("2f62");function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},i=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),i.forEach(function(t){o(e,t,n[t])})}return e}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var r={data:function(){return{email:"",code:"",time:60,timeRuning:!1,btnText:"获取验证码"}},computed:a({},(0,i.mapGetters)({userInfo:"userInfo",token:"token",expri:"expri"})),methods:{submit:function(){if(!this.email)return e.showToast({icon:"none",title:"邮箱不能为空"}),!1;if(!this.code)return e.showToast({icon:"non",title:"验证码不能为空"}),!1;var t=this;e.request({url:t.api_host+"user/bind-email",method:"POST",header:{Authorization:"Bearer "+t.token},data:{email:t.email,code:t.code,type:4},success:function(n){console.log(n," at pages\\ucenter\\mysetting\\bindEmail\\bindEmail.vue:61"),200==n.data.code?(t.getUserInfo(t),t.toast("修改成功",2500),t._setTimeout(function(){e.navigateTo({url:"/pages/ucenter/mysetting/mysetting"})})):t.toast(n.data.message,2500)},fail:function(e){console.log(e," at pages\\ucenter\\mysetting\\bindEmail\\bindEmail.vue:75")}})},getCode:function(){var t=this;if(t.timeRuning)return!1;t.time=60,e.request({url:t.api_host+"user/send-email",method:"POST",header:{Authorization:"Bearer "+t.token},data:{email:t.email,type:4},success:function(e){console.log(e," at pages\\ucenter\\mysetting\\bindEmail\\bindEmail.vue:97"),t.setTime()},fail:function(e){console.log(e," at pages\\ucenter\\mysetting\\bindEmail\\bindEmail.vue:101")}})},setTime:function(){var e=this;e.timeRuning=!0;var t=setInterval(function(){e.time>1?(e.time-=1,console.log(e.time," at pages\\ucenter\\mysetting\\bindEmail\\bindEmail.vue:111"),e.btnText=e.time+"秒后重新获取"):(e.btnText="重新获取",e.timeRuning=!1,clearInterval(t))},1e3)},bind:function(){var t=this;e.request({url:t.api_host+"user/bind-email",method:"POST",header:{Authorization:"Bearer "+t.token},data:{email:t.email,code:t.code},success:function(n){console.log(n," at pages\\ucenter\\mysetting\\bindEmail\\bindEmail.vue:133");var i=n.data.data;200==n.data.code?(t.detail=i,console.log("=============="," at pages\\ucenter\\mysetting\\bindEmail\\bindEmail.vue:138"),console.log(i," at pages\\ucenter\\mysetting\\bindEmail\\bindEmail.vue:139"),console.log("=============="," at pages\\ucenter\\mysetting\\bindEmail\\bindEmail.vue:140")):e.showToast({icon:"none",title:"绑定失败"})},fail:function(){},complete:function(){}})}}};t.default=r}).call(this,n("6e42")["default"])},c21d:function(e,t,n){"use strict";n.r(t);var i=n("63d8"),a=n("cd63");for(var o in a)"default"!==o&&function(e){n.d(t,e,function(){return a[e]})}(o);n("7d60");var r=n("2877"),u=Object(r["a"])(a["default"],i["a"],i["b"],!1,null,null,null);t["default"]=u.exports},cd63:function(e,t,n){"use strict";n.r(t);var i=n("9336"),a=n.n(i);for(var o in i)"default"!==o&&function(e){n.d(t,e,function(){return i[e]})}(o);t["default"]=a.a}},[["8921","common/runtime","common/vendor"]]]);