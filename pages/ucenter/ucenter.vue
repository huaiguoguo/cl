<template>
	<view class="container">
		
		<view class="header">
			<view class="avatar">
				<image src="/static/img/avatar.jpg" mode=""></image>
			</view>
			<view class="userinfo">
				<view class="item user_id">ID:{{userInfo.user.id}}</view>
				<view class="item nickname">昵称:{{userInfo.user.username}}</view>
				<view class="item mobile">手机号:{{userInfo.user.mobile}}</view>
			</view>
		</view>
		
		<view class="account">
			
			<view class="item balance">
				<view class="title">账号余额</view>
				<view class="desc"> {{userInfo.user.balance}} </view>
			</view>
			
			<view class="item backwater">
				<view class="title">总回水</view>
				<view class="desc"> {{account.backwater}} </view>
			</view>
			
<!-- 			<view class="item promotionCommission">
				<view class="title">推广提成</view>
				<view class="desc"> {{account.promotionCommission}} </view>
			</view> -->
			
		</view>

		<view class="menu">
			
			<view class="item" v-for="(item,index) in menuList" :key="index" @click="goDetail(item.name)">
				<view :class="item.class" > </view>
				<view class="title"> {{item.title}} </view>
				<view class="right-arrow"></view>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	import {mapState,mapGetters, mapMutations,mapActions} from 'vuex'; //先要引入
	export default {
		components: {},
		data() {
			return {
				// userInfo: {},
				account: {
					balance: 0,
					backwater: 0,
					promotionCommission: 0
				},
				menuList: [
					{
						class:'icon game',
						title: '游戏记录',
						name: 'game'
					},
					// {
					// 	class:'icon mypromotion',
					// 	title: '我的推广',
					// 	name: 'mypromotion'
					// },
					// {
					// 	class:'icon myshare',
					// 	title: '我的分享',
					// 	name: 'myshare'
					// },
					{
						class:'icon download',
						title: '下载app',
						name: 'download'
					},
					{
						class:'icon mysetting',
						title: '我的设置',
						name: 'mysetting'
					},
					// {
					// 	class:'icon online',
					// 	title: '在线客服',
					// 	name: 'online'
					// },
					{
						class:'icon about',
						title: '关于我们',
						name: 'about'
					}
				]
			}
		},
		computed: {
			// ...mapState({ userInfo: state=>state.userInfo, token: state=>state.token, }),
			...mapGetters({userInfo:'userInfo', 'token':'token', 'expri':'expri'}),
		},
		methods: {
			goDetail(name) {
				uni.navigateTo({
					url: '/pages/ucenter/'+name+'/'+name
				});
			},
		},
		onLoad:function(){
			console.log(this.token);
			console.log(this.expri);
			if(!this.token || !this.expri || !this.userInfo || !this.userInfo.user){
				this.getUserInfo();
			}
		}
	}
</script>



<style>
	page {
		background: #000000;
		height: 100%;
	}
	
	.container {
		width: 100%;
		height: 100%;
		
		display: flex;
		flex-direction: column;
		/* background: #000000; */
		color: #FFFFFF;

	}
	
	/* 头部用户信息 */
	.container .header {
		width: 100%;
		height: 100%;
		
		display: flex;
		flex-direction: row;
		
		justify-content: left;
		align-items: center;
		
		/* background: #00D400; */
		
		font-size: 28upx;
		border-bottom: 0upx solid #CCCACC;
		
		padding: 15upx 0upx;
		

	}
	
	.container .header .avatar {
		width: 187upx;
		height: 187upx;
		/* background-color: #0000FF; */
		margin-right: 25upx;
		margin-bottom: 1upx;
		margin-left: 40upx;
	}
	
	.container .header .avatar image{
		width: 96%;
		height: 96%;
		border-radius: 50%;
		border: 5upx solid #925716;
	}
	
	.container .header .userinfo {
		/* width: 100%; */
		/* height: 100%; */
		/* background: #00D400; */
		margin-left: 10upx;
		margin-top: 10upx;
		
	}
	
	.container .header .userinfo .item {
		padding: 7upx 0upx;
	}
	

	
	
	
	/* 中间 账户信息 */
	.container .account {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		
		justify-content: center;
		align-items: center;
		
		margin-top: 20upx;
		margin-bottom: 20upx;
		/* border-top: 1upx solid #CCCACC; */
		/* background: url('/static/img/grzxdh.png'); */
		background-size: cover;
		border-top: 2upx solid #776f71;
		border-bottom: 2upx solid #776f71;
		
	}
	
	.container .account .item {
		width: 50% ;
		height: 120upx;
		border-right: 2upx solid #776f71;
		text-align: center;
		flex: auto;
		font-size: 28upx;
		padding-top: 10upx;
	}
	
	.container .account .item .title {
		color: #e7ae47;
		padding:10upx 0upx;
	}
	
	.container .account .item .desc {
		color: #FFF;
		padding:10upx 0upx;
		margin-bottom: 10upx;
	}
	
	
	
	
	
	/* 下部菜单列表 */
	.container .menu {
		width: 100%;
		height: 100%;
		
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.container .menu .item {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		
		/* margin-top: 0upx; */
		border-bottom: 1px solid #776f71;
		
		font-size: 28upx;
	}
	

	.container .menu .item .icon{
		/* flex: auto; */
		width: 109upx;
		height: 111upx;
		background: url(/static/img/icon1.png) no-repeat;
		background-size: 1650upx auto;
	}
	
	.container .menu .item .game {
		background-position: -70upx -495upx;
	}
	
	.container .menu .item .mypromotion {
		background-position: -70upx -615upx;
	}

	.container .menu .item .myshare {
		background-position: -70upx -738upx;
	}
	
	.container .menu .item .download {
		/* background-size: 1800upx auto; */
		background-position: -70upx -988upx;
	}
	
	.container .menu .item .mysetting {
		/* background-size: 1800upx auto; */
		background-position: -70upx -863upx;
	}
	
	.container .menu .item .online {
		background-size: 1650upx auto;
		background-position: -1520upx -35upx;
	}
	
	.container .menu .item .about {
		/* background-size: 1800upx auto; */
		background-position: -70upx -988upx;
	}
	
	
	.container .menu .item .title{
		width: 50%;
		height: 100%;
		/* background: red; */
		/* line-height: 100%; */
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
	}
	
	.container .menu .item .right-arrow{
		width: 20upx;
		height: 20upx;
		/* flex: auto; */
		/* background: #0000FF; */
		border-top: 1px solid #CCD0D2;
		border-right: 1px solid #CCD0D2;
		transform: rotate(45deg);
		margin-left: 200upx;
		margin-right: 50upx;
	}
	
	
</style>
