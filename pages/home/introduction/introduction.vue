<template>
	<view class="container">
		<view class="content" v-if="room_id == 1">
					<h4>
						【2.0赔率说明】<br/>
						1、  四项（大、小、单、双）：2倍<br/>
						2、  极值：（极小、极大）：10倍<br/>
						3、  数字：（0-27）：11倍<br/>
						4、  数字：13/14 10倍<br/>
						5、  豹子：50倍<br/>
						6、  顺子：10倍<br/>
						7、  对子：3倍<br/>
						8、  龙、虎、豹：3倍<br/>
						9、  组合（大单）：4.2倍<br/>
						10、  组合（小双）：4.2倍<br/>
						11、组合（大双）：4.4倍<br/>
						12、组合（小单）：4.4倍<br/>
						【2.0回本规则】<br/>
						<span style="color:#E53333;">1、开：13：买中“小单”回本</span><br/>
						<span style="color:#E53333;">2、开：14：买中“大双”回本</span><br/>
						<span style="color:#E53333;">3、下注总额1001R以上 大/小/单/双开13、14 买中回本</span><br/>
						【注：以上赔率含本金】<br/>
						【玩法简介】<br/>
						1、大小：14-27  【大】 0-13  【小】  <br/>
						2、单双：单尾数【单】 双尾数【双】 <br/>
						3、极值：【极小0-5】【极大22-27】  <br/>
						4、组合：<br/>
						数字14、16、18、20、22、24、26【大双】<br/>
						数字 0、02、04、06、08、10、12【小双】<br/>
						数字15、17、19、21、23、25、27【大单】 <br/>
						数字01、03、05、07、09、11、13【小单】<br/>
						5、数字玩法: 从数字0-27中选取一个数字<br/>
						6、龙虎豹：<br/>
						【龙：01 04 07 11 14 17 21 24 27】<br/>
						【虎：02 05 08 12 15 18 22 25】<br/>
						【豹：03 06 09 13 16 19 23 26】<br/>
						【买龙-虎-豹：开00 10 20 通杀】<br/>
						【注意：要区分豹子 跟豹 的含义】<br/>
						7、对子例如:0 1 1   0 1 0属 【对子】  <br/>
						8、顺子例如:1 2 3  2 3 1属 【顺子】<br/>
						9、豹子例如:2 2 2  1 1 1 属 【豹子】
					</h4>
					<p> <br/></p>
		</view>
		<view class="content" v-if="room_id == 2">
			<h4>
				【2.8倍赔率说明】<br/>
				1、 四项（大、小、单、双）：2.8倍<br/>
				2、 极值：（极小、极大）：10倍<br/>
				3、 数字：（0-27）：11倍<br/>
				4、 数字：13/14 8倍<br/>
				5、 豹子：50<br/>
				6、 顺子：10倍<br/>
				7、 对子：3 倍<br/>
				8、 龙、虎、豹：3倍<br/>
				9、 组合（大单）：6倍<br/>
				10、 组合（小双）：6倍<br/>
				11、组合（大双）：6倍<br/>
				12、组合（小单）：6倍<br/>
				【2.8回本规则】<br/>
				1、 开奖出 对子/顺子/豹子   中的回本<br/>
				2、开：13 买（小/单/小单）中的回本<br/>
				3、开：14 买（大/双/大双）中的回本<br/>
				4、买对子开奖结果为13或14 中的回本<br/>
				5、买对子开奖结果为豹子杀<br/>
				【注：以上赔率全部含本金】<br/>
				<br/>
				【玩法简介】<br/>
				1、大小：14-27  【大】 0-13  【小】  <br/>
				2、单双：单尾数【单】 双尾数【双】 <br/>
				3、极值：【极小0-5】【极大22-27】  <br/>
				4、组合：<br/>
				数字14、16、18、20、22、24、26【大双】<br/>
				数字 0、02、04、06、08、10、12【小双】<br/>
				数字15、17、19、21、23、25、27【大单】 <br/>
				数字01、03、05、07、09、11、13【小单】<br/>
				5、数字玩法: 从数字0-27中选取一个数字<br/>
				6、龙虎豹：<br/>
				【龙：01 04 07 11 14 17 21 24 27】<br/>
				【虎：02 05 08 12 15 18 22 25】<br/>
				【豹：03 06 09 13 16 19 23 26】<br/>
				【买龙-虎-豹：开00 10 20 通杀】<br/>
				【注意：要区分豹子 跟豹 的含义】<br/>
				7、对子例如:0 1 1   0 1 0属 【对子】  <br/>
				8、顺子例如:1 2 3  2 3 1属 【顺子】<br/>
				9、豹子例如:2 2 2  1 1 1 属 【豹子】<br/>
			</h4>
			<p> <br/></p>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				room_id:1
			}
		},
		methods: {
			
		},
		onLoad:function(options){
			console.log(options);
			let title = '';
			if(options.room_id == 1){
				title = '2.0';
			}
			if(options.room_id == 2){
				title = '2.8';
			}
			this.room_id = options.room_id;
			uni.setNavigationBarTitle({
				title: '加拿大'+title+'赔率说明'
			});
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: '#000000',
				animation: {
					duration: 400,
					timingFunc: 'easeIn'
				}
			})
		}
	}
</script>

<style>
	page{
		background: #000000;
		font-size: 30upx;
		color: #FFFFFF;
	}
	
	.container {
		background: #000000;
		color: #cccacc;
		font-size: 30upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.container .content {
		width: 85%;
		height: 100%;
		padding: 10upx 0upx;
		/* background: red; */
		text-align: left;
		font-size: 28upx;
		line-height: 45upx;
	}
	
</style>
