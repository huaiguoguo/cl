<template>
	<view class="container">
		<view class="navbar">
				<view class="tab" :class="tabIndex" @tap="toggleTab()">{{resultInfo.result}}</view>
				<view class="right-arrow"></view>
		</view>
		<w-picker class="wpicker" :mode="mode" startYear="2019" endYear="2030" step="10" :defaultVal="defaultVal" :current="true" @confirm="onConfirm" ref="picker"  themeColor="#f00" :selectList="selectList" dayStep="20" startHour="8" endHour="20" minuteStep="5" afterStep="30" ></w-picker>
		<view class="gameLogList">
			<view class="item" v-for="(item,index) in gameLogList" :key="index" v-if="gameLogList">
				<view class="title_date">
					<view class="title">
						加拿大第{{item.periods.periods}}期{{item.room_text?item.room_text+'玩法':''}}
					</view>
					<view class="date">
						{{item.created_at}}
					</view>
				</view>
				<view class="openResult">
					开奖结果:{{item.open_result_text}}
				</view>
				<view class="mybet">
					我的投注:{{item.game_log}}
				</view>
				<view class="winnerResult">
					中奖金额:{{item.prize_money}}
				</view>
			</view>
			<view class="item" v-else>
				暂无记录
			</view>
		</view>
	</view>
</template>

<script>
	import wPicker from "@/components/w-picker/w-picker.vue";
	export default {
		components:{
			wPicker
		},
		data() {
			return {
				gameLogList: [],
				title: 'Hello',
				tabIndex:0,
				selectList:[{
					label:"男",
					value:0
				}],
				resultInfo:{
					result:"请选择日期"
				}
			}
		},
		computed: {
			mode(){
				// return this.tabList[this.tabIndex].mode
				return 'date';
			},
			defaultVal(){
				// return this.tabList[this.tabIndex].value
				return [0,1,3]
			}
		},
		methods: {
			toggleTab(index){
				// this.tabIndex=index;
				this.$refs.picker.show();
			},
			onConfirm(val){
				console.log(val);
				this.resultInfo=val;
				this.getLog();
			},
			getLog(){
				if(this.resultInfo.result == '请选择日期'){
					return false;
				}
				
				let _this = this;
				this.httpRequest( 'user/gamelog', 'GET', {'datetime': this.resultInfo.result}, function(res){
					console.log(res.data.data);
					if(res.data.code == 200){
						_this.gameLogList = res.data.data;
					}else{
						_this.toast(res.data.message);
					}
				});
			}
		},
		created:function(option){
			this.getLog();
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
		/* width: 100%; */
		/* height: 100%; */
		/* background: #000000; */
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.container .navbar {
		width: 100%;
		height: 100%;
		color: #FFFFFF;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-bottom: 1px solid #FFFFFF;
	}
	
	.container .navbar .tab {
		/* width: 100%; */
		/* height: 100%; */
		font-size: 30upx;
		text-align: center;
		padding: 25upx 0upx;
		margin-top: 20upx;

	}
	
	.container .navbar .right-arrow {
		/* display: block; */
		width: 15upx;
		height: 15upx;
		/* background: #0000FF; */
		border-top: 1px solid #C0C0C0;
		border-right: 1px solid #C0C0C0;
		
		margin-left: 20upx;
		margin-top: 15upx;
		
		transform: rotate(135deg);
	}

	
	.container .gameLogList {
		color: #a0a0a0;
		font-size: 25upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-bottom: 105upx;
		margin-top: 25upx;
	}
	
	.container .gameLogList .item {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: #1F1F21;
		
		border-radius: 10upx;
		padding: 10upx 15upx;
		
		margin-top: 15upx;
	}
	
	.container .gameLogList .item .title_date {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 8upx 3upx;
	}
	.container .gameLogList .item .title_date .title {
		width: 50%;
		/* background: red; */
	}
	.container .gameLogList .item .title_date .date {
		width: 40%;
		
		margin-left: 40upx;
		/* background: blue; */
		text-align: right;
	}
	.container .gameLogList .item .openResult, .mybet, .winnerResult {
		width: 650upx;
		height: 100%;
		text-align: left;
		padding: 8upx 3upx;
		/* background: yellow; */
	}
	.container .gameLogList .item .mybet {
		width: 650upx;
		/* background: pink; */
		text-align: left;
	}
	.container .gameLogList .item .winnerResult {
		width: 650upx;
		text-align: left;
	}

</style>
