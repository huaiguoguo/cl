<template>
	<view class="container">
		{{detail.content}}
	</view>
</template>


<script>
	import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
	export default {
		data() {
			return {
				id: 0,
				detail: {},
				active: 'my'
			}
		},
		computed: {
			// ...mapState({ userInfo: state=>state.userInfo, token: state=>state.token, expri: state=>state.expri, }),
			...mapGetters({userInfo:'userInfo', 'token':'token', 'expri':'expri'}),
		},
		methods: {
			getDetail() {
				let _this = this;
				uni.request({
					url: _this.api_host + 'message/view',
					method: 'GET',
					header: {
						'Authorization': 'Bearer ' + _this.token
					},
					data: {
						id: _this.id
					},
					success: res => {
						console.log(res);
						
						let data = res.data.data;
						if(res.data.code == 200){
							_this.detail = data;
							console.log('==============')
							console.log(data);
							console.log('==============')
						}
					},
					fail: () => {},
					complete: () => {}
				});
			}
		},
		onLoad:function(options){
			this.id = options.id;
			this.getDetail();
		}
	}
</script>


<style>
	page {
		background: #000000;
		color: #FFFFFF;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.container {
		margin-top: 50upx;
		/* border: 2upx solid blue; */
		width: 80%;
	}
</style>
