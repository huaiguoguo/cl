<template>
	<view class="container">
		<view class="qrcode">
			<image class="img" :src="qrcode" mode=""></image>
			<text class="desc"></text>
		</view>
		<view class="service">
			<view class="item" v-for="(item,index) in dataList" :key="index">
				<view class="title">{{item.title}}</view>
				<view class="value">{{item.value}}</view>
				<view class="button" @click="copy(item.value)">点击复制</view>
			</view>
		</view>
	</view>
</template>

<script>
	// import '../../../common/clipboard.min'
	export default {
		data() {
			return {
				qrcode: 'http://cl_static.phpdx.me/android/apk.png',
				dataList: [
					{
						title: 'QQ客服',
						value: '2170471314'
					},
					{
						title: 'QQ客服',
						value: '2727314253'
					},
					{
						title: '网站链接',
						value: 'www.pc260.com'
					},
					{
						title: '下载链接',
						value: 'www.hongxing.ws'
					},
				]
			}
		},
		methods: {
			// copy(item) {
			// 	
			// }
		},
		onLoad: function(options) {
			let _this = this;
			// this.httpRequest( 'user/about', 'GET', {}, function(res){
			// 	console.log(res.data.data);
			// 	if(res.data.code == 200){
			// 		// _this.toast('添加成功', 'success', 1000);
			// 		_this.qrcode = res.data.data.qrcode;
			// 		_this.dataList = res.data.data.list;
			// 	}else{
			// 		_this.toast(res.data.message);
			// 	}
			// });
		},
	}
</script>

<style>
	
	page {
		background: #000000;
	}
	
	.container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		
		color: #FFFFFF;
	}
	
	.container .qrcode {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 100upx;
		margin-bottom: 40upx;
	}
	.container .qrcode .img {
		width: 340upx;
		height: 350upx;
		margin-bottom: 20upx;
	}
	.container .qrcode .desc {
		font-size: 30upx;
	}
	
	
	
	.container .service {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		
	}
	
	.container .service .item {
		width: 90%;
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		font-size: 30upx;
		padding: 15upx 0upx;
		
		border-bottom: 1upx solid #776f71;
	}
	.container .service .item .title {
		text-align: left;
		padding: 0upx 10upx;
	}
	.container .service .item .value {
		width: 40%;
		height: 100%;
		text-align: left;
		/* background: #00D400; */
		padding-left: 10upx;
	}
	.container .service .item .button {
		/* width: 50upx;
		height: 50upx; */
		text-align: left;
		padding: 10upx 20upx;
		border: 0.5px solid #efa909;;
		border-radius: 10upx;
		color: #efa909;
	}

</style>
