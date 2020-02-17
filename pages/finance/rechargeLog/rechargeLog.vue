<template>
	<view class="container">

		<view class="nav">
			<view class="item date"> 充值时间 </view>
			<view class="item amount"> 充值金额 </view>
			<view class="item amount"> 充值类型 </view>
			<view class="item type"> 充值状态 </view>
		</view>
		
		<view class="logList">
			<view class="item" v-for="(item,index) in rechargeLogList" :key="index">
				<view class="date"> {{item.created_at}} </view>
				<view class="amount"> {{item.amount}} </view>
				<view class="type"> {{item.channel_text}} </view>
				<view class="status"> {{item.status_text}} </view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
	export default {
		data() {
			return {
				rechargeLogList: []
			}
		},
		computed: {
			// ...mapState({ userInfo: state=>state.userInfo, token: state=>state.token, }),
			...mapGetters({userInfo:'userInfo', 'token':'token', 'expri':'expri'}),
		},
		methods: {
			getRechargeLogList() {
				let _this = this;
				this.httpRequest( 'finance/recharge-log', 'GET', {}, function(res){
					if (res.data.code == 200) {
						_this.rechargeLogList = res.data.data;
					}else{
						_this.toast(res.data.message);
					}
				});
			}
		},
		onLoad:function(option){
			
			this.getRechargeLogList();
		}
	}
</script>

<style>
	page {
		background: #000000;
	}
	
	.container {
		width: 100%;
		height: 100%;
		font-size: 30upx;
		color: #FFFFFF;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	/* 导航 */
	.container .nav {
		width: 98%;
		height: 100%;
		background: #000000;
		
		border: 6upx solid #414040;
		
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		
		/* padding: 15upx 0upx; */
	}
	
	.container .nav .item {
		width: 25%;
		height: 100%;
		/* background: red; */
		
		text-align: center;
		padding: 15upx 0upx;
	}
	
	.container .nav .item:nth-child(1),.item:nth-child(2),.item:nth-child(3) {
		/* margin-left: 15upx; */
		border-right: 6upx solid #414040;
	}
	
	
	
	
	/* 记录 logList */
	.container .logList {
		width: 100%;
		height: 100%;
		/* background: red; */
	}
	
	.container .logList .item {
		width: 100%;
		height: 100%;
		
		/* background: blue; */
		
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		
		font-size: 24upx;
		
		text-align: center;
		
		padding: 15upx 0upx;
		margin-top: 15upx;
		
		border-bottom: 1upx solid #FCFCFC;
	}
	
	.container .logList .item .date {
		width: 25%;
		height: 100%;
		/* background: pink; */
		font-size: 23upx;
		/* margin-left: -10upx; */
	}
	
	.container .logList .item .amount {
		width: 25%;
		height: 100%;
		/* background: pink; */
	}
	
	.container .logList .item .type {
		width: 25%;
		height: 100%;
		/* background: pink; */
	}
	
	.container .logList .item .status {
		width: 25%;
		height: 100%;
		/* background: pink; */
	}
	
</style>
