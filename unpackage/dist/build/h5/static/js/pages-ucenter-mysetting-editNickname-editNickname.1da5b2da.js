(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-ucenter-mysetting-editNickname-editNickname"],{"09d7":function(t,e,n){"use strict";var i=n("207d"),a=n.n(i);a.a},"15fc":function(t,e,n){"use strict";var i=n("288e");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=i(n("cebc")),o=n("2f62"),u={data:function(){return{username:""}},computed:(0,a.default)({},(0,o.mapGetters)({userInfo:"userInfo",token:"token",expri:"expri"})),methods:{submit:function(){if(console.log(this.token),!this.username)return uni.showToast({icon:"none",title:"昵称为能为空"}),!1;var t=this;uni.request({url:t.api_host+"user/edit-nickname",method:"POST",header:{Authorization:"Bearer "+t.token},data:{username:t.username},success:function(e){200==e.data.code?(t.getUserInfo(t),uni.showToast({icon:"success",title:"修改成功",duration:2e3}),setTimeout(function(){uni.navigateTo({url:"/pages/ucenter/mysetting/mysetting"})},2200)):uni.showToast({icon:"none",title:"修改失败",duration:2e3})},fail:function(t){console.log(t)}})}},onLoad:function(){}};e.default=u},"207d":function(t,e,n){var i=n("9b40");"string"===typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);var a=n("4f06").default;a("59fd4c0c",i,!0,{sourceMap:!1,shadowMode:!1})},5415:function(t,e,n){"use strict";n.r(e);var i=n("15fc"),a=n.n(i);for(var o in i)"default"!==o&&function(t){n.d(e,t,function(){return i[t]})}(o);e["default"]=a.a},"57a6":function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-uni-view",{staticClass:"container"},[n("v-uni-view",{staticClass:"edit_input"},[n("v-uni-text",{staticClass:"title"},[t._v("昵称")]),n("v-uni-input",{staticClass:"input",attrs:{type:"text",placeholder:"请输入新昵称"},model:{value:t.username,callback:function(e){t.username=e},expression:"username"}})],1),n("v-uni-button",{staticClass:"button",attrs:{type:"warn"},on:{click:function(e){e=t.$handleEvent(e),t.submit()}}},[t._v("确认修改")])],1)},a=[];n.d(e,"a",function(){return i}),n.d(e,"b",function(){return a})},"9b40":function(t,e,n){e=t.exports=n("2350")(!1),e.push([t.i,"uni-page-body[data-v-54b763b6]{background:#000}.container[data-v-54b763b6]{width:100%;height:100%;color:#fff}.edit_input[data-v-54b763b6]{width:100%;height:100%;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-box-pack:left;-webkit-justify-content:left;-ms-flex-pack:left;justify-content:left;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;font-size:%?30?%;border-bottom:.5px solid #ccc;margin-bottom:%?30?%;margin-top:%?30?%}.edit_input .title[data-v-54b763b6]{width:20%;height:100%;\n\t/* background: #0000FF; */margin:%?30?% %?0?%;margin-left:%?30?%;text-align:center}.edit_input .input[data-v-54b763b6]{width:65%;height:%?50?%;\n\t/* background: #0000FF; */text-align:left;line-height:%?50?%}.button[data-v-54b763b6]{width:70%;background:#efa909\n\t/* font-size: 30upx; */}body.?%PAGE?%[data-v-54b763b6]{background:#000}",""])},ff05:function(t,e,n){"use strict";n.r(e);var i=n("57a6"),a=n("5415");for(var o in a)"default"!==o&&function(t){n.d(e,t,function(){return a[t]})}(o);n("09d7");var u=n("2877"),r=Object(u["a"])(a["default"],i["a"],i["b"],!1,null,"54b763b6",null);e["default"]=r.exports}}]);