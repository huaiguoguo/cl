<template>
	<view class="content">
		<view class="tab" :class="[{'active':index==tabIndex}]" @tap="toggleTab(index)" v-for="(item,index) in tabList" :key="index">{{item.name}}</view>
		<w-picker 
			:mode="mode" 
			startYear="2019" 
			endYear="2030" 
			step="10" 
			:defaultVal="defaultVal" 
			:current="true" 
			@confirm="onConfirm" 
			ref="picker" 
			themeColor="#f00"
			:selectList="selectList"
			dayStep="20"
			startHour="8"
			endHour="20"
			minuteStep="5"
			afterStep="30"
		></w-picker>
		<view class="result">选择结果：{{resultInfo.result}}</view>
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
				title: 'Hello',
				tabList:[{
					mode:"range",
					name:"选择区间的日期",
					value:[0,0,0,0,0,0,0]
				},{
					mode:"limit",
					name:"选择短期的日期",
					value:[0,0,0]
				},{
					mode:"date",
					name:"日期选择",
					value:[0,1,3]
				},
				{
					mode:"yearMonth",
					name:"年月",
					value:[0,1]
				},{
					mode:"dateTime",
					name:"日期时间选择",
					value:[1,1,1,1,2,5]
				},{
					mode:"time",
					name:"时间选择",
					value:[1,1,0]
				},
				{
					mode:"region",
					name:"省市区",
					value:[10,0,5]
				},
				{
					mode:"selector",
					name:"单列选择",
					value:[1]
				}],
				tabIndex:0,
				selectList:[{
					label:"男",
					value:0
				},{
					label:"女",
					value:1
				}],
				resultInfo:{
					result:"2019-12-20 10:00:00"
				}
			}
		},
		computed:{
			mode(){
				return this.tabList[this.tabIndex].mode
			},
			defaultVal(){
				return this.tabList[this.tabIndex].value
			}
		},
		methods: {
			toggleTab(index){
				this.tabIndex=index;
				this.$refs.picker.show();
			},
			onConfirm(val){
				console.log(val);
				this.resultInfo=val;
			}
		}
	}
</script>

<style>
	.content {
		text-align: center;
		height: 400upx;
	}
	.tab{
		padding:20upx 0;
		font-size: 32upx;
	}
	.tab.active{
		color:#f00;
	}
	.result{
		margin-top: 200upx;
		font-size: 32upx;
	}
</style>
