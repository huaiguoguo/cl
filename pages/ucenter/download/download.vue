<template>
<div class="content hastip">
        <div class="container">
            <div class="oval oval1"></div>
            <div class="oval oval2"></div>
        </div>
        <div class="logo"></div>
        <div class="btn-container">
            <div class="label">
                <div class="title">红星</div>
                <div class="subtitle">信誉红星，实力平台</div>
            </div>
            <div class="btn" style="background:#a0b5e6">
                <a href="/">继续访问</a>
            </div>
            <div class="btn android" v-if="platform==1">
                <a id="android" href="http://cl_static.phpdx.me/android/hx.apk">下载App</a>
            </div>
            <div class="btn ios" v-if="platform==2">
                <a id="ios" href="http://util.aimixiu.cn/mixiu-utils-ios-mobileconfig/index.html?n=hongxing_signed.mobileconfig">下载App</a>
            </div>
        </div>
        <div class="qr btn-container">
            <img src="http://cl_static.phpdx.me/android/apk.png" style="max-width:200px;" v-if="platform==1">
            <img src="http://cl_static.phpdx.me/ios/ios.png" style="max-width:200px;" v-if="platform==2">
            <p>扫一扫二维码下载App</p>
        </div>
<!--        <div class="tips btn-container ios">
            <div class="title">红星 iOS App安装指南</div>
            <div class="step">1.第一次打开 红星 App时会弹出如下弹窗:</div>
            <img src="/static/ios/1.jpg">
            <div class="step">2.首次安装的用户，请前往「设置-通用-设备管理」;
                <br>
                <span class="subtip">* 部分手机「设备管理」是「描述文件与设备管理」</span>
            </div>
            <img src="/static/ios/2.jpg">
            <div class="step">3.点击「信任」，然后返回桌面打开 红星 App。
                <br>
                <span class="subtip">* 部分手机的「信任」是「验证」</span>
            </div>
            <img src="/static/ios/3.jpg">
        </div> -->
        <footer>Copyright &copy; 2019 红星</footer>
    </div>
</template>

<script>
	export default {
		data() {
			return {
				platform: 1
			}
		},
		methods: {
			
		},
		onLoad:function(){
			if (isAndroid) {
				this.platform = 1;
			}
			if (isIOS) {
				this.platform = 2;
			}
		}
	}
</script>

<style>
        *{margin:0;padding:0;}html{-webkit-tap-highlight-color:rgba(0,0,0,0);-webkit-font-smoothing:antialiased;font-family:-apple-system,BlinkMacSystemFont,PingFang SC,Helvetica Neue,STHeiti,Microsoft Yahei,Tahoma,Simsun,sans-serif}.content{position:relative;width:100vw;min-height:100vh;overflow:hidden}.content.flex{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center}.content.hastip{padding:120px 0}.isWechat{top:0;width:100%;color:#fff;font-size:14px;line-height:2;background:rgba(0,0,0,.3);z-index:3}.isWechat,.language{position:absolute;text-align:center}.language{width:80px;height:30px;right:20px;top:25px;border:1px solid #000;-webkit-border-radius:15px;-moz-border-radius:15px;border-radius:15px;z-index:5;color:#000;line-height:30px;text-decoration:none}.container{position:absolute;width:100%;height:100%;top:0;left:0;overflow:hidden}.oval1{width:400px;height:400px;opacity:.4;top:-190px;margin-left:-380px;background-image:-webkit-radial-gradient(circle closest-side,#002cb5 0,rgba(0,44,181,0) 100%);background-image:-moz-radial-gradient(circle closest-side,#002cb5 0,rgba(0,44,181,0) 100%);background-image:-o-radial-gradient(circle closest-side,#002cb5 0,rgba(0,44,181,0) 100%);background-image:radial-gradient(circle closest-side,#002cb5 0,rgba(0,44,181,0) 100%)}.oval1,.oval2{position:absolute;left:50%}.oval2{width:600px;height:600px;opacity:.3;top:0;margin-left:-200px;background-image:-webkit-radial-gradient(circle closest-side,#4e2d8d 0,rgba(78,45,141,0) 100%);background-image:-moz-radial-gradient(circle closest-side,#4e2d8d 0,rgba(78,45,141,0) 100%);background-image:-o-radial-gradient(circle closest-side,#4e2d8d 0,rgba(78,45,141,0) 100%);background-image:radial-gradient(circle closest-side,#4e2d8d 0,rgba(78,45,141,0) 100%)}.logo{width:100px;height:100px;margin:0 auto 40px;background:url(/app/html/images/icon.png);-moz-background-size:cover;background-size:cover}.btn-container,.logo{position:relative;z-index:2}.btn-container{text-align:center}.label{font-size:16px;color:#323232;margin-bottom:10px}.title{font-size:36px;font-weight:500}.subtitle,.title{text-align:center}.subtitle{margin-top:10px;font-size:20px}.feature-list{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;margin-top:60px;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.feature-list .feature{color:#323232;font-size:16px;padding:0 15px}.feature-list .gap{width:2px;height:10px;background:#999}.btn{margin: 40px auto 40px;font-size:18px;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px;background:#4a4a4a;-webkit-box-shadow:0 3px 9px rgba(0,0,0,.2);-moz-box-shadow:0 3px 9px rgba(0,0,0,.2);box-shadow:0 3px 9px rgba(0,0,0,.2);}.btn,.btn a{width:250px;height:50px;line-height:50px;color:#fff;}.btn a{display:block;text-decoration:none}footer{position:absolute;width:100%;bottom:20px;color:#999;font-size:12px;text-align:center}.tips{position:relative;padding:0 20px;z-index:2}.tips .title{font-size:16px;margin-bottom:10px;color:#333}.tips .step{font-size:14px;color:#666}.tips .step .subtip{font-size:12px}.tips img{display:block;margin:10px auto;width:280px;background-color:#333}.hide{display:none;}
</style>
