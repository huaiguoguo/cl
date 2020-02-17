<template>
	<view class="container">
		<view class="edit_input">
			<text class="title">手机号</text>
			<input class="input" type="text" v-model="mobile" placeholder="请输入手机号">
		</view>
		<view class="edit_input">
			<text class="title">验证码</text>
			<input class="input" type="text" v-model="code" placeholder="请输入手机验证码">
			<view class="code" @click="getCode()">{{btnText}}</view>
		</view>
		<button class="button" type="warn" @click="submit()">确认</button>
	</view>
</template>

<script>
	import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
	export default {
		data() {
			return {
				mobile: '',
				code: '',
				time: 60,
				timeRuning: false,
				btnText: '获取验证码'
			}
		},
		computed: {
			// ...mapState({ userInfo: state=>state.userInfo, token: state=>state.token, }),
			...mapGetters({userInfo:'userInfo', 'token':'token', 'expri':'expri'}),
		},
		methods: {
			checkFormForMobile(){
				if(!this.mobile){
					this.toast('请输入手机号码');
					return false;
				}
				if(this.mobile.search(/^1[3-9]{1}\d{9}$/) == -1){
					this.toast('请输入正确的手机号码');
					return false;
				}
				return true;
			},
			checkForm() {

				if(!this.checkFormForMobile()){
					return false;
				}
				
				if(!this.code) {
					this.toast('请输入验证码');
					return false;
				}
				return true;
				
			},
			getCode() {
				if(!this.checkFormForMobile()){
					return false;
				}
				if(this.timeRuning){
					return false;
				}
				this.time = 60;
				let _this = this;
				this.httpRequest( 'user/send-sms', 'POST', {mobile: _this.mobile, type: 3}, function(res){
					if(res.data.code == 200) {
						_this.atInerVal()
					}else{
						_this.toast(res.data.message);
					}
				});
			},
			atInerVal() {
				let _this = this;
				let interval = setInterval(function(){
					if (_this.time>1){
						_this.time -= 1;
						console.log(_this.time);
						_this.btnText = _this.time+'秒后重新获取';
					}else{
						_this.btnText = '重新获取';
						_this.timeRuning = false
						clearInterval(interval);
					}
				}, 1000);
			},
			submit() {
				if(!this.checkForm()){
					return false;
				}
				let _this = this;
				this.httpRequest( 'user/change-mobile', 'POST', {mobile: _this.mobile, code:_this.code}, function(res){
					if(res.data.code == 200) {
						_this.getUserInfo(_this);
						_this.toast('更换成功', 'success');
						_this._setTimeout(function(){
							uni.navigateTo({
								url: '/pages/ucenter/mysetting/mysetting'
							});
						});
					}else{
						_this.toast('更换失败');
					}
				})
			}
		},
		onLoad:function(){
			
		}
	}
</script>

<style>
	page{
		background: #000000;
	}
	
	.container {
		width: 100%;
		height: 100%;
		color: #FFFFFF;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.edit_input {
		width: 95%;
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		font-size: 30upx;
		border-bottom: 0.5px solid #CCCCCC;
		margin-bottom: 30upx;
		margin-top: 30upx;
	}
	
	.edit_input .title {
		width: 15%;
		height: 60upx;
		/* background: #0000FF; */
		margin: 30upx 0upx;
		/* margin-left: 30upx; */
		text-align: center;
		line-height: 60upx;
	}
	.edit_input .input {
		width: 50%;
		height: 60upx;
		line-height: 60upx;
		/* background-color: red; */
		padding: 20upx 10upx;
	}
	
	.edit_input .code {
		/* display: block; */
		width: 30%;
		height: 60upx;
		background: #efa909;
		padding: 10upx 10upx;
		/* margin: 30upx 0upx; */
		/* margin-left: 70upx; */
		text-align: center;
		font-size: 28upx;
		line-height: 60upx;
		border-radius: 10upx;
	}
	
	.button {
		width: 70%;
		background: #efa909;
		/* font-size: 30upx; */
	}
</style>
