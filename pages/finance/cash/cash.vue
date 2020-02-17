<template>
	<view class="container">
		<view class="header">
			<view class="item balance">
				<view class="label"> 账号余额(金币) </view>
				<view class="desc"> {{userInfo.user?userInfo.user.id:0}} </view>
			</view>
			<view class="item service">
				<view class="label"> 手续费 </view>
				<view class="desc"> {{userInfo.service?userInfo.service:0}} </view>
			</view>
		</view>
		
		<view class="cashList">

			<view class="item bankNumber">
				<view class="label">选择卡号</view>
				<view class="desc">
					<picker class="picker" @change="bindPickerChange" :value="index" :range="account_list" range-key="title">
						<view class="uni-input">{{account_list[index]?account_list[index].title: ''}}</view>
					</picker>
					<view class="drop-arrow"></view>
				</view>
			</view>
			
			<view class="item amount">
				<view class="label"> 提现金额 </view>
				<view class="desc">
					<input class="amount" type="text" v-model="amount" value="" placeholder="请输入金额"/>
				</view>
			</view>
			
			<view class="item password">
				<view class="label"> 安全密码 </view>
				<view class="desc">
					<input class="password" type="password" v-model="secpwd" value="" placeholder="请输入安全密码"/>
				</view>
			</view>
			
		</view>
		
		<button class="btn_submit" type="primary" @click="submit()">提交</button>
		
		<view class="remark">
			<view class="label"> 提现说明 </view>
			<view class="desc"> {{remark}} </view>
		</view>
		
	</view>
</template>

<script>
	import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
	export default {
		data() {
			return {
				balance: 0,
				service: 0,
				account_id: 0,
				account_list: [],
				amount: '',
				secpwd: '',
				index:0,
				channel: 1,
				remark: ' 1.选择已绑定的支付宝、微信、银行卡 \n 2.提现收取手续费 \n 3.提交后等待财务审核通过,2分钟内到账 \n 4.如有问题请联系客服处理 '
			}
		},
		computed: {
			// ...mapState({ userInfo: state=>state.userInfo, token: state=>state.token, }),
			...mapGetters({userInfo:'userInfo', 'token':'token', 'expri':'expri'}),
		},
		methods: {
			toggleTab(index){
				// this.tabIndex=index;
				this.$refs.picker.show();
			},
			bindPickerChange(e) {
				console.log(e.target.value);
				// if (e.target.value == 0 || e.target.value == 1 || e.target.value == 2 || e.target.value == 3) {
				// 	this.channel = parseInt(e.target.value)+1;
				// }else{
				// 	this.channel = 5;
				// }
				this.channel = this.userInfo.account_list[this.index].channel;
				this.index = e.target.value;
				this.account_id = this.userInfo.account_list[this.index].id;
			},
			checkForm() {
				if (!this.account_id || !this.channel) {
					this.toast('请选择提现账户');
					return false;
				}
				
				if (!this.amount) {
					this.toast('请输入提现金额');
					return false;
				}

				if (this.amount<=0) {
					this.toast('请输入正确的提现金额');
					return false;
				}
				
				
				let total = parseFloat(this.amount) + parseFloat( this.userInfo.service );
				let balance = parseFloat(this.userInfo.user.balance);
				if (total > balance) {
					this.toast('您的余额不足提现');
					return false;
				}
				
				if(!this.secpwd){
					this.toast('请输入安全密码');
					return false;
				}
				
				return true;
			},
			submit() {
				if (!this.checkForm()) {
					return false;
				}
				let _this = this;
				this.httpRequest( 'finance/cash', 'POST', {account_id: this.account_id, channel: this.channel, service:this.userInfo.service, amount: this.amount, secpwd: this.secpwd}, function(res){
					console.log(res);
					if (res.data.code == 200) {
						_this.toast('提现成功, 等待审核!', 'success', 1000);
						_this._setTimeout(function(){
							uni.navigateTo({
								url: '/pages/finance/finance'
							});
						});
					}else{
						_this.toast(res.data.message);
					}
				});
			}
		},
		onLoad:function(option){
			if(!this.token || !this.expri || !this.userInfo || !this.userInfo.user){
				this.getUserInfo();
				return false;
			}else{
				if(this.userInfo.account_list){
					this.account_list = this.userInfo.account_list;
					this.account_id = this.userInfo.account_list[this.index].id;
				}
			}
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
		color: #FFFFFF;
		font-size: 30upx;
		text-align: center;
		
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.container .header {
		width: 90%;
		height: 100%;
		background:  rgba(31, 26, 26,0.5); //191816
		
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		
		border-radius: 15upx;
		
		margin-top: 15upx;

	}
	.container .header .item {
		width: 45%;
		height: 100%;
		/* margin-left: 20upx; */
		padding: 15upx 0upx;
		/* background: #ccc; */
		
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.container .header .item .label {
		margin: 15upx 0upx;
	}
	.container .header .item .desc{
		margin: 15upx 0upx;
		font-size: 25upx;
	}
	

	
	
	
	
	/* cashList */
	
	.container .cashList {
		width: 90%;
		height: 100%;
		/* background: red; */
		
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		
		margin-top: 20upx;
		
		padding: 20upx 0upx;
	}
	
	.container .cashList .item {
		width: 100%;
		height: 100%;
		
		border-bottom: 1upx solid #776f71;
		
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		
		padding: 30upx 0upx;
	}
	
	
	
	.container .cashList .item .label {
		width: 35%;
		height: 50upx;
		/* background: blue; */
	}
	
	.container .cashList .item .desc {
		
		width: 50%;
		height: 50upx;
		/* background: pink; */
		
		border: 0upx solid yellow;
		
		text-align: left;
		
		font-size: 28upx;
	}
	
	
	.container .cashList .bankNumber .desc {
		width: 60%;
		height: 60upx;
		line-height: 60upx;
		text-align: left;
		/* background: red; */
		
	}
	
	
	.container .btn_submit {
		width: 70%;
		height: 100%;
		background: #efa909;
		
		margin-top: 15upx;
	}
	
	

</style>
