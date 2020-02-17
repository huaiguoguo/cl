<template>
	<view class="container">
		<view class="title">
			<view :class="'title_item mobile ' + (channel==1 ? 'active' : '') " @click="channel==2?channel=1:''">手机登录</view>
			<view :class="'title_item email ' + (channel==2 ? 'active' : '') " @click="channel==1?channel=2:''">邮箱登录</view>
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
		<view class="rememberPassword">
			<label class="checkbox">
				<checkbox value=""/>记住密码
			</label>
		</view>
		<button class="button"  @click="login('李四三')">登录</button>
		<view class="forget_register">
			<view @click="forget()">忘记密码?</view>
			<view @click="newuser()">新用户注册</view>
		</view>
		<view class="info">
			登录即代表阅读并<text class="agree" @click="agree()">同意使用条款</text>
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
				channel: 1
			}
		},
		methods: {
			...mapActions({sigin: 'login'}),
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
					if(this.account.search(/^[a-zA-Z0-9!#$%&'*+\\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/) == -1){
						uni.showToast({
							icon: 'none',
							title:'请输入正确的邮箱地址'
						});
						return false;
					}
				}
				
				if(!this.password) {
					uni.showToast({
						icon: 'none',
						title: '请输入密码'
					});
					return false;
				}
				
				return true;
			},
			login(param) {
				
				if(!this.checkFormForAccount()){
					return false;
				}
				
				let _this = this;
				this.httpRequest( 'site/login', 'POST', {username: _this.account, password: _this.password, channel: _this.channel }, function(res){
						let result = res.data;
						if (res.data.code == 200) {
							_this.sigin(res.data.data);
							_this.toast('登录成功', 'success', 1000);
							_this._setTimeout(function() {
								uni.switchTab({
									url: '/pages/ucenter/ucenter'	
								});
							}, 1000);
								
						} else{
							_this.toast(res.data.message);
						}
				});
			},
			forget() {
				uni.navigateTo({
					url: '/pages/ucenter/Forget/Forget'
				})
			},
			newuser() {
				uni.navigateTo({
					url: '/pages/ucenter/Register/Register'
				})
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
		padding: 0upx 15upx;
	}

	.item:nth-child(2){
		margin-top: 40upx;
	}
	
	.item:nth-child(3){
		margin-top: 30upx;
	}
	
	.item .label {
		font-size: 30upx;
	}
	
	.item .input {
		margin-top: 20upx;
		border-bottom: 0.5upx solid #F0F0F0;
		padding: 20upx 0upx;
		font-size: 35upx;
		/* color: #000000; */
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
