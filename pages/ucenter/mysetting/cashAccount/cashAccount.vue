<template>
	<view class="container">
		<view class="add" @click="goDetail()">
			<view class="icon"></view>
			<view class="title">添加提现账号</view>
			<view class="right-arrow"></view>
		</view>
		<view class="accountList">
			<view class="item" v-for="(item,index) in accountList" :key="index" :style="'background:'+item.account_color">
				<view class="icon">
					<view :class="item.class">
						
					</view>
				</view>
				<view class="account">
					<view class="accountBank">{{item.account_bank}}</view>
					<view class="accountName">{{item.account_number}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				accountList: []
			}
		},
		methods: {
			goDetail(){
				uni.navigateTo({
					url: '/pages/ucenter/mysetting/cashAccount/addCashAccount/addCashAccount'
				});
			}
		},
		onLoad:function(optin){
			
			let _this = this;
			this.httpRequest( 'user/cash-account-list', 'GET', {}, function(res){
				if(res.data.code == 200){
					_this.accountList = res.data.data;
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
		/* text-align: center; */
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.add {
		width: 90%;
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		
		/* background: #0062CC; */
		
		border-bottom: 0.5px solid #CCCACC;
		margin-top: 20upx;
	}
	
	.add .icon {
		width: 100upx;
		height: 100upx;
		background: url(/static/img/icon1.png) no-repeat;
		background-size: 1300upx auto;
		background-position: -1050upx -1035upx;
		margin-left: -55upx;
	}
	
	.add .title {
		width: 50%;
		height: 100%;
		font-size: 30upx;
		/* background: #00D400; */
		margin-right: 20upx;
	}
	.add .right-arrow {
		width: 15upx;
		height: 15upx;
		/* background: #0000FF; */
		border-top: 1px solid #CCCCCC;
		border-right: 1px solid #CCCCCC;
		transform: rotate(45deg);
		
		margin-left: 180upx;
	}
	
	
	.accountList {
		width: 95%;
		height: 100%;
		/* background: #0000FF; */
		
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		
		margin-bottom: 40upx;
	}
	
	.accountList .item {
		width: 100%;
		height: 100%;
		background: #42b035;
		margin-top: 25upx;
		
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		text-align: center;
		
		border-radius: 15upx;
		padding: 20upx 0upx;
	}
	
	
	
	.accountList .item .icon{
		width: 15%;
		height: 100%;
		
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		
		/* background: pink; */
		margin-left: 40upx;
		margin-right: 20upx;
	}
	
	.accountList .item .icon .wepay {
		width: 100upx;
		height: 100upx;
		background: url(/static/img/wepay.png) no-repeat;
		background-size: cover;
	}

	
	
	
	.accountList .item .account {

		width: 50%;
		height: 100%;

		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		text-align: left;
	}
	
	.accountList .item .account .accountBank {
		width: 100%;
		height: 100%;
		/* background: red; */
	}
	
	.accountList .item .account .accountName {
		width: 100%;
		height: 100%;
		/* background: #2F85FC; */
		margin-top: 15upx;
	}
	
</style>
