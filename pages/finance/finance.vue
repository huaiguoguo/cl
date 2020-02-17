<template>
	<view class="container">

		<view :class="'item '+item.itemClass" v-for="(item,index) in dataList" :key="index" @click="goDetail(item.itemClass)">
			<view :class="'icon '+item.class"></view>
			<view class="title_desc">
				<text class="title">{{item.title}}</text>
				<text class="desc">{{item.desc}}</text>
			</view>
			<view class="right-arrow"></view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cashMoney: 0,
				dataList: [
					{
						itemClass: 'recharge',
						class:'recharge_icon',
						title: '账号充值',
						desc: '已支持微信、支付宝，快捷安全'
					},
					{
						itemClass: 'cash',
						class:'cash_icon',
						title: '资金提现',
						desc: '当前可提现金额：'
					},
					{
						itemClass: 'cashAccount',
						class:'cashAccount_icon',
						title: '提现账号',
						desc: '绑定提现账号/解绑提现账号'
					},
					{
						itemClass: 'accountLog',
						class:'accountLog_icon',
						title: '账变记录',
						desc: '查询资金明细变动记录'
					},
					{
						itemClass: 'rechargeLog',
						class:'rechargeLog_icon',
						title: '充值记录',
						desc: '查询充值记录及充值状态'
					},
					{
						itemClass: 'cashLog',
						class:'cashLog_icon',
						title: '提现记录',
						desc: '查询提现记录及提现状态'
					},
				]
			}
		},
		created: function(){
			this.dataList[1].desc += this.cashMoney+'金币';
		},
		methods: {
			goDetail(name) {
				if (name == 'cashAccount') {
					uni.navigateTo({
						url: '/pages/ucenter/mysetting/cashAccount/cashAccount'
					});
				}else{
					uni.navigateTo({
						url: '/pages/finance/'+name+'/'+name+'?query=' + encodeURIComponent(JSON.stringify(name))
					});
				}
			},
		},
		onLoad:function(option){
			
		}
	}
</script>

<style>
	page {
		background: #000000;
	}
	.container{
		width: 100%;
		height: 100%;
		/* background: #000000; */
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		
		font-size: 30upx;
		
		padding-top: 0upx;
	}
	
	/* 列表 */
	.container .item{
		width: 675upx;
		height: 109upx;
		border-bottom: 1upx solid #776f71;
		
		display: flex;
		
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-top: 25upx;
		padding-bottom: 10upx;
	}
	
	
	
	/* 左侧图标 */
	.container .item .icon{
		width: 109upx;
		height: 111upx;
		background: #0000FF;
		margin-right: 25upx;
		margin-left: -55upx;
		background: url(/static/img/icon1.png) no-repeat;
		background-size: 1200upx auto;
	}
	
	.container .item .recharge_icon {
		background-position: -30upx 6upx;
	}
	
	.container .item .cash_icon {
		background-position: -30upx -110upx;
	}
	
	.container .item .cashAccount_icon {
		background-position: -30upx -220upx;
	}
	
	.container .item .accountLog_icon {
		background-size: 1800upx auto;
		background-position: -80upx -1405upx;
	}
	
	.container .item .rechargeLog_icon {
		background-size: 1800upx auto;
		background-position: -80upx -1195upx;
	}
	
	.container .item .cashLog_icon {
		background-size: 1800upx auto;
		background-position: -80upx -1300upx;
	}
	
	
	/* 标题和描述 */
	.container .item .title_desc {
		width: 372upx;
		height: 100%;
		
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: left;
		
		margin-right: 100upx;
		
		/* background: #0000FF; */
	}
	
	.container .item .title_desc .title {
		padding: 10upx 0upx;
		color: #FFFFFF;
	}
	
	.container .item .title_desc .desc {
		color: #CCCACC;
		font-size: 25upx;
		padding: 10upx 0upx;
	}
	
	
	/* 向右箭头 */
	.container .item .right-arrow{
		width: 15upx;
		height: 15upx;
		/* background: #007AFF; */
		border-top: 1px solid #000000;
		border-right: 1px solid #000000;
		transform: rotate(45deg);
		
		margin-right: 20upx;
	}
	
</style>
