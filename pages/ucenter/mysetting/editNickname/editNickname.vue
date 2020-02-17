<template>
	<view class="container">
		<view class="edit_input">
			<text class="title">昵称</text>
			<input class="input" type="text" v-model="username" placeholder="请输入新昵称">
		</view>
		<button class="button" type="warn" @click="submit()">确认修改</button>
	</view>
</template>

<script>
	import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
	export default {
		data() {
			return {
				username: ''
			}
		},
		computed: {
			// ...mapState({ userInfo: state=>state.userInfo, token: state=>state.token, }),
			...mapGetters({userInfo:'userInfo', 'token':'token', 'expri':'expri'}),
		},
		methods: {
			submit(){
				console.log(this.token);
				// return false;
				if(!this.username){
					uni.showToast({
						icon:'none',
						title: '昵称为能为空'
					});
					return false;
				}
				let _this = this;
				uni.request({
					url: _this.api_host + 'user/edit-nickname',
					method: 'POST',
					header: {
						'Authorization': 'Bearer ' + _this.token
					},
					data: {
						username: _this.username
					},
					success: res => {
						if(res.data.code == 200){
							_this.getUserInfo(_this);
							uni.showToast({
								icon:'success',
								title: '修改成功',
								duration: 2000
							});
							setTimeout(function() {
								uni.navigateTo({
									url: '/pages/ucenter/mysetting/mysetting'
								});
							}, 2200);
						}else{
							uni.showToast({
								icon:'none',
								title: '修改失败',
								duration: 2000
							});
						}
					},
					fail: (error) => {
						console.log(error);
					}
				});
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
	}
	
	.edit_input {
		width: 100%;
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
		height: 100%;
		/* background: #0000FF; */
		margin: 30upx 0upx;
		margin-left: 30upx;
		text-align: center;
	}
	.edit_input .input {
		width: 65%;
		height: 50upx;
		/* background: #0000FF; */
		text-align: left;
		line-height: 50upx;
	}
	
	.button {
		width: 70%;
		background: #efa909;
		/* font-size: 30upx; */
	}
	
</style>
