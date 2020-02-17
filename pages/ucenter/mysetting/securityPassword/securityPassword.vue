<template>
	<view class="container">
		
		<view class="edit_input">
			<text class="title">密码</text>
			<input class="input" type="password" v-model="password" placeholder="请输入安全密码">
		</view>
		
		<view class="edit_input">
			<text class="title">确认密码</text>
			<input class="input" type="password" v-model="repassword" placeholder="请确认安全密码">
		</view>
		
		<view class="edit_input">
			<text class="title">账号类型</text>
			<picker class="picker" @change="bindPickerChange" :value="index" :range="list">
				<view class="uni-input">{{list[index]}}</view>
			</picker>
			<view class="drop-arrow"></view>
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
				password: '',
				repassword: '',
				code: '',

				time: 60,
				timeRuning: false,
				btnText: '获取验证码',
				
				list: [       //要展示的数据
					'手机验证码',
					'邮箱验证码'
				],
				index:0,
				channel: 1
			}
		},
		computed: {
			// ...mapState({ userInfo: state=>state.userInfo, token: state=>state.token, }),
			...mapGetters({userInfo:'userInfo', 'token':'token', 'expri':'expri'}),
		},
		methods: {
			// ...mapActions('userStatus', {'logout':'logout'}),
			checkForm() {
				if(!this.password) {
					this.toast('请输入安全密码');
					return false;
				}
				if(!this.repassword) {
					this.toast('请确认安全密码');
					return false;
				}
				if(this.password != this.repassword) {
					this.toast('两次密码输入不一致');
					return false;
				}
				if(!this.code) {
					this.toast('请输入验证码');
					return false;
				}
				return true;
			},
			getCode() {
				if(this.timeRuning){
					return false;
				}
				this.time = 60;
				let _this = this;

				
				let data = {};
				let action = '';
				if (this.channel == 1) {
					action = 'send-sms';
					data.mobile = this.userInfo.user.mobile;
				}else if (this.channel == 2) {
					if(!this.userInfo.user.email) {
						_this.toast('您还没有绑定邮箱, 请先帮定邮箱');
						_this._setTimeout(function(){
							uni.navigateTo({
								url: '/pages/ucenter/mysetting/bindEmail/bindEmail'
							});
						});
						return false;
					}
					action = 'send-email';
					data.email = this.userInfo.user.email;
				}
				data.type = 5;
				
				this.httpRequest( 'user/'+action, 'POST', data, function(res){
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
			bindPickerChange(e) {
				console.log(e.target.value);
				if (e.target.value == 0) {
					this.channel = 1;
				}else{
					this.channel = 2;
				}
				this.index = e.target.value;
			},
			submit() {
				if(!this.checkForm()){
					return false;
				}
				let _this = this;
				this.httpRequest( 'user/change-security-pwd', 'POST', {secpwd: this.password, channel: this.channel, mobile: _this.userInfo.user.mobile, code: this.code}, function(res){
					if(res.data.code == 200){
						_this.toast('设置成功');
						_this._setTimeout(function(){
							uni.navigateTo({
								url: '/pages/ucenter/mysetting/mysetting'
							});
						});
					}else{
						_this.toast(res.data.message)
					}
				});
			},
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
		justify-content: flex-start;
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
		width: 20%;
		height: 60upx;
		line-height: 60upx;
		
		/* background: #0000FF; */
		margin: 10upx 0upx;
		/* margin-left: 30upx; */
		text-align: center;
	}
	.edit_input .input {
		width: 50%;
		height: 60upx;
		line-height: 60upx;
		/* background: red; */
	}
	
	.edit_input .code {
		/* display: block; */
		width: 27%;
		height: 60upx;
		line-height: 60upx;
		background: #efa909;
		padding: 10upx 10upx;
		margin-bottom: 5upx;
		margin-left: 20upx;
		text-align: center;
		font-size: 27upx;
		border-radius: 10upx;
	}
	
	
	.edit_input .picker {
		width: 40%;
		height: 60upx;
		line-height: 60upx;
		margin-left: 50upx;
		/* background: red; */
	}
	.edit_input .drop-arrow {
		width: 10upx;
		height: 10upx;
		border-top: 2upx solid #ccc;
		border-right: 2upx solid #ccc;
		transform: rotate(135deg);
		margin-left: 200upx;
		/* background: blue; */
		
	}
	
	.button {
		width: 70%;
		background: #efa909;
		/* font-size: 30upx; */
	}
</style>
