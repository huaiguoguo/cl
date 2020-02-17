<template>
	<view class="container">
		<view class="edit_input">
			<text class="title">原密码</text>
			<input class="input" type="password" v-model="oldpassword" placeholder="请输入原密码(6-12位)">
		</view>
		<view class="edit_input">
			<text class="title">新密码</text>
			<input class="input" type="password" v-model="password" placeholder="请输入新密码(6-12位)">
		</view>
		<view class="edit_input">
			<text class="title">确认密码</text>
			<input class="input" type="password" v-model="repassword" placeholder="请输入确认密码">
		</view>
		<view class="edit_input">
			<text class="title">安全密码</text>
			<input class="input" type="password" v-model="secpassword" placeholder="请输入安全密码">
		</view>
		<button class="button" type="warn" @click="submit()">确认</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				oldpassword: '',
				password: '',
				repassword: '',
				secpassword: ''
			}
		},
		methods: {
			checkForm() {
				if (!this.oldpassword) {
					this.toast('请输入原密码');
					return false
				}
				if (!this.password) {
					this.toast('请输入新密码');
					return false
				}
				if (!this.repassword) {
					this.toast('请输入确认密码');
					return false
				}
				if (!this.secpassword) {
					this.toast('请输入安全密码');
					return false
				}

				if (this.password != this.repassword) {
					this.toast('两次密码输入不一致');
					return false
				}
				return true;
			},
			submit() {
				if(!this.checkForm()){
					return false;
				}
				let _this = this;
				this.httpRequest( 'user/change-pwd', 'POST', {oldpassword: this.oldpassword,password: this.password, secpassword: this.secpassword}, function(res){
					if(res.data.code == 200){
						_this.toast('修改成功', 'none', 1000)
						_this._setTimeout(function(){
							uni.navigateTo({
								url: '/pages/ucenter/mysetting/mysetting'
							});
						}, 1000);
					}else{
						_this.toast(res.data.message)
					}
				});
			}
		},
		onLoad:function(){
			
			let _this = this;
			this.httpRequest( 'user/check-security-pwd', 'GET', {}, function(res){
				if(res.data.code != 200){
					_this.toast(res.data.message, 'none', 1000)
					_this._setTimeout(function(){
						uni.navigateTo({
							url: '/pages/ucenter/mysetting/securityPassword/securityPassword'
						});
					}, 1000);
				}
			});
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
		width: 90%;
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: left;
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
		margin: 20upx 0upx;
		margin-right: 30upx;
		text-align: center;
		/* background: blue; */
	}
	.edit_input .input {
		width: 70%;
		height: 60upx;
		line-height: 60upx;
		text-align: left;
		/* background: red; */
	}
	
	.button {
		width: 70%;
		background: #efa909;
		/* font-size: 30upx; */
	}
</style>
