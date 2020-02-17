<template>
	<view class="container">
		<view class="header">
			<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
				<swiper-item>
					<image class="img" src="/static/img/lunbo.png" mode="widthFix"></image>
				</swiper-item>
				<swiper-item>
					<image class="img" src="/static/img/lunbo.png" mode="widthFix"></image>
				</swiper-item>
				<swiper-item>
					<image class="img" src="/static/img/lunbo.png" mode="widthFix"></image>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="notice">
			<view class="item">
				<view class="title">公告:</view>
				<marquee class="gg" scrollamount='5' loop='-1' direction='left'>有什么问题请私聊qq客服: 2170471314</marquee>
			</view>
			<view class="item">
				<view class="title">恭喜:</view>
				<marquee class="gx" scrollamount='5' loop='-1' direction='left'>欢迎使用</marquee>
			</view>
		</view>
		
		<view class="roomList">
			<view class="room room_one">
				<image @click="goDetail(1)" src="/static/img/room_20_2.jpg" mode="widthFix"></image>
				<view class="room_introduction game_one" @click="goIntroduction(1)"></view>
			</view>
			<view class="room room_two">
				<image @click="goDetail(2)" src="/static/img/room_28_2.jpg" mode="widthFix"></image>
				<view class="room_introduction game_two" @click="goIntroduction(2)"> </view>
			</view>
		</view>
		
	</view>
</template>

<script>
	// import '/static/js/swiper.min.js';
	export default {
		data() {
			return {
				background: ['color1', 'color2', 'color3'],
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				dataList: [1,2],
				roomList: [1,2]
			}
		},
		methods: {
			changeIndicatorDots(e) {
				this.indicatorDots = !this.indicatorDots
			},
			changeAutoplay(e) {
				this.autoplay = !this.autoplay
			},
			intervalChange(e) {
				this.interval = e.target.value
			},
			durationChange(e) {
				this.duration = e.target.value
			},
			goDetail(room_id) {
				uni.navigateTo({
					url:'/pages/home/chat/chat?room_id='+room_id
				});
			},
			goIntroduction(room_id) {
				// console.log(room_id);
				// return false;
				uni.navigateTo({
					url: '/pages/home/introduction/introduction?room_id='+room_id
				})
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
	/* @import url("/static/css/swiper.min.css"); */
	.container {
		width: 100%;
		/* height: 120%; */
		/* background: url(/static/img/xixi-2.png) no-repeat; */
		background: #000000;
		background-size: auto;
		color: #007AFF;
		font-size: 40upx;
		display: block;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		
		padding-bottom: 150upx;
	}
	
	.header{
		width: 100%;
		height: 100%;
		/* background-color: #289063; */
	}
	.swiper{
		display: block;
		width: 100%;
		height: 500upx;
	}
	.header .swiper-item{
		height: 100%;
	}
	.swiper-item .img{
		display: block;
		width: 100%;
	}
	
	
	.header image{
		width: 100%;
		background-size: contain;
	}
	
	
	/* 以下是公告 */
	.notice {
		width: 705upx;
		height: 105upx;
		/* background-color: #0000FF; */
		text-align: left;
		text-indent: 20px;
		overflow: auto;
		background: url(/static/img/gonggao.png);
		background-repeat: no-repeat;
		background-size: cover;
		font-size: 25upx;
		display: block;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: 2em auto;
		box-sizing: border-box;
		padding: 0 8%;
	}
	
	.notice .item {
		width: 100%;
		height: 50upx;
		line-height: 50upx;
		color: #FFFFFF;
		display: block;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}

	.notice .item:last-child{
		/* margin-top: 5upx; */
	}

	.notice .item .title {
		width: 100upx;
		height: 50upx;
		line-height: 50upx;
		text-indent: 0px;
		/* background: #007AFF; */
		text-align: center;
		/* opacity: 0.10; */
		color: #502c1a;
		font-weight: 900;
		font-size: 28upx;
		float: left;
	}
	
	.notice .item marquee {
		width: calc(100% - 100upx);
		/* background-color: red; */
		text-align: left;
		color: #502c1a;
		font-weight: 600;
		font-size: 25upx;
		text-indent: 5upx;
		float: left;
	}

	
	/* 以下是聊天室 */
	.roomList {
		width: 100%;
		height: 100%;
		display: block;
		flex-direction: row;
		/* flex-wrap: wrap; */
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}
	
/* 	.roomList:after{
		content: "";
		width: 340upx;
	} */
	
	.roomList .room{
		width: 45%;
		
		margin-top: 15upx;
		border: 10upx solid #795F25;
		border-radius: 30upx;
		display: block;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: #000;
		float: left;
		box-sizing: border-box;
		overflow: hidden;
		padding-bottom: 1em;
	}
	.roomList .room image{
		display: block;
		width: 100%;
		border-radius: 23upx;
	}
	.roomList .room+.room{
		margin-left: 10%;
	}
	
	/* .roomList .room_two {
		background: url(/static/img/room_28_2.jpg) no-repeat;
		background-size: 335upx 468upx;
	} */
	
	.room image{
		width: 345upx;
		height: 468upx;
	}

	
	.roomList .room .room_introduction {
		width: 100%;
		height: 60upx;
		/* background: red; */
		background: url(/static/img/beijing_1.png) no-repeat;
		background-size: contain;
		margin-top: 5upx;
		background-position: center;
	}
	
</style>
