<template>
	<view class="container">
		<view class="item" v-for="(item,index) in dataList" :key="index" @click="goDetail(item.name)">
			<view :class="item.class"></view>
			<view class="title">{{item.title}}</view>
			<view class="right-arrow"></view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapGetters,mapMutations, mapActions} from 'vuex'; //先要引入
	export default {
		data() {
			return {
				dataList: [
					{
						class: 'icon editNickname',
						title: '修改昵称',
						name: 'editNickname'
					},
					{
						class: 'icon editPassword',
						title: '修改密码',
						name: 'editPassword'
					},
					{
						class: 'icon securityPassword',
						title: '安全密码',
						name: 'securityPassword'
					},
					{
						class: 'icon cashAccount',
						title: '提现账号',
						name: 'cashAccount'
					},
					{
						class: 'icon repaceMobile',
						title: '更换手机',
						name: 'repaceMobile'
					},
					{
						class: 'icon bindEmail',
						title: '邮箱绑定',
						name: 'bindEmail'
					},
					// {
					// 	class: 'icon cleanCache',
					// 	title: '清除缓存',
					// 	name: 'cleanCache'
					// },
					{
						class: 'icon exitLogin',
						title: '退出登录',
						name: 'Logout'
					}
				]
			}
		},
		methods: {
			...mapActions(['logout']),
			goDetail(name) {
				if (name == 'Logout') {
					this.logout();
					uni.redirectTo({
						url: '/pages/ucenter/Login/Login'
					});
					return false;
				}
				uni.navigateTo({
					url: '/pages/ucenter/mysetting/'+name+'/'+name
				});
			},
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
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 15upx;
	}
	
	.container .item {
		width: 90%;
		height: 100%;
		border-bottom: 1px solid #776f71;
		color: #FFFFFF;
		font-size: 30upx;
		
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	
	.container .item .icon {
		width: 100upx;
		height: 100upx;
		background: url(/static/img/icon1.png) no-repeat;
		background-size: 1300upx auto;
		background-position: -40upx -380upx;
		/* margin-right: 10upx; */
		margin-left: -20upx;
	}
	
	
	
	.container .item .editNickname {
		background-position: -1040upx -948upx;
	}
	
	.container .item .editPassword {
		background-position: -1128upx -530upx;
	}
	.container .item .securityPassword {
		background-position: -1128upx -620upx;
	}
	.container .item .cashAccount {
		background-position: -1038upx -872upx;
	}
	.container .item .repaceMobile {
		background-position: -1130upx -725upx;
	}
	.container .item .bindEmail {
		background-position: -1130upx -825upx;
	}
	.container .item .cleanCache {
		background-position: -1130upx -930upx;
	}
	.container .item .exitLogin {
		background-position: -1130upx -1038upx;
	}
	
	
	
	
	
	
	
	.container .item .title {
		width: 45%;
		/* background: #0062CC; */
		
		margin-right: 250upx;
	}
	.container .item .right-arrow {
		width: 15upx;
		height: 15upx;
		/* background: #0062CC; */
		border-top: 1px solid #C0C0C0;
		border-right: 1px solid #C0C0C0;
		transform: rotate(45deg);
		
		margin-right: 20upx;
	}
	
</style>
