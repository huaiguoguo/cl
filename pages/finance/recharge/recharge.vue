<template>
	<view class="container">

		<view class="offline"></view>		
		<view class="menuList">
			<view class="item" v-for="(item,index) in dataList" :key="index" @click="goDetail(item.class)">
				<view :class="'icon '+item.class"></view>
				<view class="title">{{item.title}} &nbsp;({{item.remark}})</view>
				<view class="right-arrow"></view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: [
					{
						class: 'bank',
						title: '银行转账',
						remark: '转账上分'
					},
					{
						class: 'alipay',
						title: '支付宝',
						remark: '支付转银行的到银行提交'
					},
					{
						class: 'wepay',
						title: '微信',
						remark: '微信私聊QQ客服扫码上分'
					},
					{
						class: 'dingding',
						title: '钉钉',
						remark: '钉钉加好友发红包'
					},
				]
			}
		},
		methods: {
			goDetail (name) {
				// console.log(name);
				// return;
				// url: '/pages/finance/recharge/doRecharge/doRecharge?query=' + encodeURIComponent(JSON.stringify(name))
				uni.navigateTo({
					url: '/pages/finance/recharge/doRecharge/doRecharge?payment=' + name
				});
			}
		},
		onLoad:function(){
			
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
	}
	
	.container .offline {
		width: 150upx;
		height: 60upx;
		margin-top: 50upx;
		margin-left: 20upx;
		/* border: 1px solid #007AFF; */
		
		background: url(/static/img/icon1.png) no-repeat;
		background-size: 1300upx auto;
		background-position: -1135upx -395upx;
	}
	
	
	.container .menuList {
		
		width: 95%;
		height: 100%;
		margin-top: 0upx;
		
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		
		font-size: 30upx;
		color: #FFFFFF;
	}
	
	.container .menuList .item {
		width: 90%;
		height: 100upx;
		
		/* background: #0000FF; */
		
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		text-align: left;
		
		/* margin-top: 15upx; */
		border-bottom: 1px solid #776f71;
		
		font-size: 30upx;
	}
	
	.container .menuList .item:first-child {

	}
	
	.container .menuList .item .icon {
		width: 50upx;
		height: 50upx;
		margin-left: 30upx;
		/* border: 1upx solid #00D400; */
	}
	
	
	.container .menuList .item .bank {
		background: url(/static/img/paymenttype_yh.png) no-repeat;
		background-size: cover;
	}
	
	.container .menuList .item .alipay {
		background: url(/static/img/paymenttype_zf.png) no-repeat;
		background-size: cover;
	}
	
	.container .menuList .item .wepay {
		background: url(/static/img/wepay.png) no-repeat;
		background-size: cover;
	}
	
	.container .menuList .item .dingding {
		background: url(/static/img/paymenttype_dd.png) no-repeat;
		background-size: cover;
	}
	
	
	
	.container .menuList .item .title {
		width: 75%;
		height: 100%;
		/* background: red; */
		line-height: 100upx;
		margin-left: 0upx;
	}
	
	.container .menuList .item .right-arrow {
		width: 20upx;
		height: 20upx;
		/* background: #007AFF; */
		border-top: 2upx solid #FFFFFF;
		border-right:2upx solid #FFFFFF;
		transform: rotate(45deg);
		
		margin-right: 20upx;
	}

</style>
