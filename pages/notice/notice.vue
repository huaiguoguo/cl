<template>
	<view class="container">
		<view class="navbar">
			<view class="item system active">系统消息</view>
			<view class="item my">我的消息</view>
		</view>
		
		<view class="messageList">
			<view class="item active" v-for="(item,index) in messageList" :key="index" @click="goDetail(item.id)">
				<view class="content"> {{item.title}} </view>
				<view class="date"> {{item.created_at}} </view>
			</view>
<!-- 			<view class="item" v-for="(item,index) in messageList" :key="index">
				
			</view> -->
		</view>
	</view>
</template>

<script>
	import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
	export default {
		data() {
			return {
				messageList: []
			}
		},
		computed: {
			// ...mapState({ userInfo: state=>state.userInfo, token: state=>state.token, expri: state=>state.expri, }),
			...mapGetters({userInfo:'userInfo', 'token':'token', 'expri':'expri'}),
		},
		methods: {
			goDetail(id) {
				uni.navigateTo({
					url: '/pages/notice/detail/detail?id='+id,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			getMessageList() {
				let _this = this;
				this.httpRequest( 'message/list', 'GET', {}, function(res) {
						console.log(res);
						let data = res.data.data;
						if(res.data.code == 200){
							_this.messageList = data;
						}
				});
			}
		},
		onLoad:function(){
			
			this.getMessageList();
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
		/* background: #000000; */
		color: #FFFFFF;
	}
	
	.container .navbar {
		width: 100%;
		height: 100%;
		/* border: 1px solid #000000; */
		
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	
	.container .navbar .item {
		width: 50%;
		height: 100%;
		border: 1px solid #CCCACC;
		border-collapse: collapse;
		text-align: center;
		font-size: 30upx;
		padding: 15upx 0upx;
	}
	
	.container .navbar .item:first-child{
		border-right: 0px;
	}
	
	.container .navbar .active {
		color: #EBAC3C;
	}
	
	
	
	/* 消息列表 */
	.container .messageList{
		width: 100%;
		height: 100%;
		margin-top: 30upx;
	}
	
	.container .messageList .item {
		width: 100%;
		height: 80upx;
		border-bottom: 1px solid #776f71;
		line-height: 80upx;
		
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		/* padding-left: 10upx; */
		/* padding:0upx 50upx; */
	}
	
	.container .messageList .item .content {
		padding-left: 15upx;
	}
	
	.container .messageList .item .date {
		padding-right: 15upx;
	}
	
</style>
