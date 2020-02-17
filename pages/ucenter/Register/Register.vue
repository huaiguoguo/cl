<template>
	<view class="container">
		<view class="title">
			<view :class="'title_item mobile ' + (channel==1 ? 'active' : '') " @click="channel==2?channel=1:''">手机注册</view>
			<view :class="'title_item email ' + (channel==2 ? 'active' : '') " @click="channel==1?channel=2:''">邮箱注册</view>
		</view>
		<view class="item mobile">
			<view class="label">
				{{channel==1?'手机':'邮箱'}}
			</view>
			<view class="input">
				<input type="text" v-model='account' value="" :placeholder="'请输入' +(channel==1?'手机号码':'邮箱')"/>
			</view>
		</view>
		<view class="item password">
			<view class="label">
				密码
			</view>
			<view class="input">
				<input type="password" v-model="password" value="" placeholder="请输入密码"/>
			</view>
		</view>
		<view class="item repassword">
			<view class="label">
				确认密码
			</view>
			<view class="input">
				<input type="password" v-model="repassword" value="" placeholder="请确认密码"/>
			</view>
		</view>
		<view class="item verifyCode">
			<view class="label"> 验证码 </view>
			<view class="input">
				<input class="code" type="text" v-model="code" value="" placeholder="请输入验证码"/>
				<view class="btn" @click="getCode()">{{btnText}}</view>
			</view>
		</view>
		<button class="button" @click="submit()">注册</button>
		<view class="info">
			注册即代表阅读并<text class="agree" @click="agree()">同意使用条款</text>
		</view>
	</view>
</template>

<script>
	import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
	export default {
		data() {
			return {
				account: '',
				password: '',
				repassword: '',
				code: '',
				channel: 1,
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
			// ...mapActions({'logout':'logout'}),
			agree(){
				uni.navigateTo({url: '/pages/ucenter/mysetting/agree/agree'})
			},
			checkFormForAccount(){
				if(!this.account){
					uni.showToast({
						icon: 'none',
						title:'请输入'+(this.channel == 1? '手机号码':'邮箱')
					});
					return false;
				}
				
				if(this.channel == 1){
					if(this.account.search(/^1[3-9]{1}\d{9}$/) == -1){
						uni.showToast({
							icon: 'none',
							title:'请输入正确的手机号码'
						});
						return false;
					}
				} else if(this.channel == 2){
					if(this.account.search(/^[^@]*<[a-zA-Z0-9!#$%&'*+\\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?>$/) == -1){
						uni.showToast({
							icon: 'none',
							title:'请输入正确的邮箱地址'
						});
						return false;
					}
				}
				return true;
			},
			checkForm() {
				
				if(!this.checkFormForAccount()){
					return false;
				}
				
				if(!this.password){
					uni.showToast({
						icon: 'none',
						title:'请输入密码'
					});
					return false;
				}
				if(!this.repassword){
					uni.showToast({
						icon: 'none',
						title:'请重复密码'
					});
					return false;
				}
				
				if(this.password != this.repassword){
					uni.showToast({
						icon: 'none',
						title:'两次密码输入不一致'
					});
					return false;
				}
				
				if(!this.code){
					uni.showToast({
						icon: 'none',
						title:'请输入验证码'
					});
					return false;
				}
				return true;
			},
			submit(){
				if(!this.checkForm()){
					return false;
				}

				let _this= this;
				uni.request({
					url: _this.api_host + 'site/signup',
					method: 'POST',
					header: {
						'Authorization': 'Bearer'
					},
					data: {
						account: _this.account,
						password: _this.password,
						repassword: _this.repassword,
						code: _this.code,
						channel: _this.channel
					},
					success: res => {
						console.log(res);
						
						let data = res.data.data;
						if(res.data.code == 200){
							_this.detail = data;
							uni.showToast({
								title: res.data.message,
								duration: 1500
							});
							setTimeout(function(){
								uni.navigateTo({
									url: '/pages/ucenter/Login/Login'
								});
							}, 2000);
						}else{
							uni.showToast({
								icon: 'none',
								title: '服务器失败'
							});
						}
					}
				});
			},
			getCode() {

				if(!this.checkFormForAccount()){
					return false;
				}

				let _this= this;
				
				if(_this.timeRuning){
					return false;
				}
				_this.time = 60;

				let action = 'send-sms';
				if(this.channel==1){
					action = 'send-sms';
				}else if(this.channel == 2){
					action = 'send-email';
				}
				
				uni.request({
					url: _this.api_host + 'user/'+action,
					method: 'POST',
					header: {
						'Authorization': 'Bearer '
					},
					data: {
						mobile: _this.account,
						type: 1
					},
					success: res => {
						console.log(res);
						let result = res.data;
						if(result.code == 200){
							_this.setTime();
						}else{
							uni.showToast({
								icon: 'none',
								title: result.message
							});
						}
					},
					fail: (err) => {
						console.log(err);
					},
					complete: () => {}
				});
				
			},
			setTime() {
				let _this = this;
				_this.timeRuning = true;
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
			}
		}
	}
</script>

<style>
	page{
		background: #000000;
		/* text-align: center; */
		background: url(/static/img/login-bg.png);
		background-size: cover;
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
	
	.title {
		width: 75%;
		/* background: #0000FF; */
		font-size: 50upx;
		text-align: left;
		padding-left: 10upx;
		margin-top: 50upx;
		
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	
	.title .title_item {
		width: 50%;
		
		/* background: red; */
		
		/* margin-left: 10upx; */
		text-align: center;
	}
	
	.title .active {
		border-bottom: 4upx solid #CCCCCC;
	}
	
	.item {
		width: 75%;
		/* background: #289063; */
		padding: 0upx 5upx;
		margin-top: 50upx;
	}

/* 	.item:nth-child(2){
		margin-top: 40upx;
	}
	
	.item:nth-child(3){
		margin-top: 30upx;
	}
	 */
	.item .label {
		font-size: 30upx;
	}
	
	.item .input {
		margin-top: 0upx;
		border-bottom: 0.5upx solid #F0F0F0;
		padding: 20upx 0upx;
		font-size: 35upx;
	}
	
	.verifyCode .input {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	
	.verifyCode .input .code {
		/* display: block; */
		width: 60%;
		height: 50upx;
		/* background: #EFA909; */
		padding: 0upx 0upx;
		font-size: 35upx;
		border-radius: 10upx;
	}
	
	.verifyCode .input .btn {
		/* display: block; */
		width: 38%;
		height: 100%;
		background: #EFA909;
		padding: 25upx 10upx;
		border-radius: 10upx;
		font-size: 28upx;
		text-align: center;
	}
	
	.rememberPassword {
		width: 75%;
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: flex-start;
		margin-left: -20upx;
		margin-top: 35upx;
		
		font-size: 30upx
	}
	
	.rememberPassword .checkbox {
		width: 100%;
		/* height: 30upx; */
		/* background: #0062CC; */
	}
	
	.rememberPassword .checkbox checkbox {
/* 		width: 15upx;	
		height: 15upx; */
		/* background: red; */
	}
	
	.button{
		width: 75%;
		margin-top: 50upx;
		background: rgba(199,199,205,0.3);
		color: #000000;
	}
	
	.forget_register {
		width: 75%;
		height: 100%;
		/* background: #00D400; */
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 0 10upx;
		
		font-size: 30upx;
		
		margin-top: 45upx;
	}
	
	.info {
		width: 75%;
		height: 100%;
		/* background: #00D400; */
		text-align: center;
		font-size: 30upx;
		
		margin-top: 45upx;
	}
	
	.info .agree {
		color: #3396fb;
	}
	
</style>
