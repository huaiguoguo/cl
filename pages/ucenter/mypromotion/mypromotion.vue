<template>
	
	<view class="container">
		
		<view class="item promotionCenter">
			<view class="icon"></view>
			<view class="title">推广中心</view>
			<view class="right-arrow"></view>
		</view>
		
		<view class="item userList">
			<view class="icon"></view>
			<view class="title">会员列表</view>
			<view class="right-arrow"></view>
		</view>
		
		<view class="item teamStatistics">
			<view class="icon"></view>
			<view class="title">团队统计</view>
			<view class="right-arrow"></view>
		</view>
		
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
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
		color: #FFFFFF;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.container .item {
		width: 90%;
		height: 100%;
		border-bottom: 0.5px solid #CCCACC;
		padding: 10upx 0upx;
		
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
	}
	.container .item .icon {
		width: 100upx;
		height: 100upx;
		background: url(/static/img/icon1.png) no-repeat;
		background-size: 1300upx auto;
		background-position: -40upx -380upx;
		/* margin-right: 10upx; */
	}
	.container .item .title {
		width:70%;
		/* background-color: #0000FF; */
	}
	.container .item .right-arrow {
		width: 10upx;
		height: 10upx;
		border-top: 1px solid #FFFFFF;
		border-right: 1px solid #FFFFFF;
		
		transform: rotate(45deg);
		
		margin-left: 30upx;
	}
</style>
