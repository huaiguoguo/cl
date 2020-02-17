<template>
	<view class="container">
		<view class="edit_input">
			<text class="title">邮箱</text>
			<input class="input" type="text" v-model="email" placeholder="请输入要绑定的邮箱">
		</view>
		<view class="edit_input">
			<text class="title">验证码</text>
			<input class="input" type="text" v-model="code" placeholder="请输入验证码">
			<view class="btn" @click="getCode()">{{btnText}}</view>
		</view>
		<button class="button" type="warn" @click="submit()">确认</button>
	</view>
</template>

<script>
	import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
	export default {
		data() {
			return {
				email: '',
				code: '',
				time: 60,
				timeRuning: false,
				btnText: '获取验证码'
			}
		},
		computed: {
			// ...mapState({ userInfo: state=>state.userInfo, token: state=>state.token, expri: state=>state.expri, }),
			...mapGetters({userInfo:'userInfo', 'token':'token', 'expri':'expri'}),
		},
		methods: {
			submit() {
				if(!this.email){
					uni.showToast({
						icon:'none',
						title: '邮箱不能为空'
					});
					return false;
				}
				if(!this.code){
					uni.showToast({
						icon:'non',
						title: '验证码不能为空'
					})
					return false;
				}
				let _this= this;
				uni.request({
					url: _this.api_host + 'user/bind-email',
					method: 'POST',
					header: {
						'Authorization': 'Bearer ' + _this.token
					},
					data: {
						email: _this.email,
						code: _this.code,
						type: 4
					},
					success: res => {
						console.log(res);
						if(res.data.code == 200){
							_this.getUserInfo(_this);
							_this.toast('修改成功', 2500)
							_this._setTimeout(function(){
								uni.navigateTo({
									url: '/pages/ucenter/mysetting/mysetting'
								});
							});
						}else{
							_this.toast(res.data.message, 2500)
						}
					},
					fail: (err) => {
						console.log(err);
					}
				});

			},
			getCode() {
				let _this= this;
				if(_this.timeRuning){
					return false;
				}
				_this.time = 60;
				uni.request({
					url: _this.api_host + 'user/send-email',
					method: 'POST',
					header: {
						'Authorization': 'Bearer ' + _this.token
					},
					data: {
						email: _this.email,
						type: 4
					},
					success: res => {
						console.log(res);
						_this.setTime()
					},
					fail: (err) => {
						console.log(err);
					}
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
			},
			bind() {
				let _this= this;
				uni.request({
					url: _this.api_host + 'user/bind-email',
					method: 'POST',
					header: {
						'Authorization': 'Bearer ' + _this.token
					},
					data: {
						email: _this.email,
						code: _this.code
					},
					success: res => {
						console.log(res);
						
						let data = res.data.data;
						if(res.data.code == 200){
							_this.detail = data;
							console.log('==============')
							console.log(data);
							console.log('==============')
						}else{
							uni.showToast({
								icon: 'none',
								title: '绑定失败'
							});
						}
					},
					fail: () => {},
					complete: () => {}
				});
			}
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
	}
	
	.edit_input {
		width: 100%;
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
		height: 70upx;
		/* background: #0000FF; */
		margin: 30upx 0upx;
		margin-left: 30upx;
		text-align: center;
		line-height: 70upx;
	}
	.edit_input .input {
		width: 50%;
		height: 70upx;
		/* background: #ccc; */
		line-height: 70upx;
		margin-left: 15upx;
	}
	
	.edit_input .btn {
		/* display: block; */
		width: 30%;
		height: 70upx;
		background: #efa909;
		padding: 5upx 0upx;
		text-align: center;
		font-size: 28upx;
		border-radius: 10upx;
		line-height: 70upx;
		font-size: 28upx;
		margin-right: 20upx;
		margin-left: 5upx;
	}
	
	.button {
		width: 70%;
		background: #efa909;
		/* font-size: 30upx; */
	}
</style>
