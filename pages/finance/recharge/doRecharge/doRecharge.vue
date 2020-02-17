<template>
	<view class="container">
		<view class="userAccount">
			<view class="item userInfo">
				<view class="label">用户ID</view>
				<view class="userId">{{userInfo.user.id}}</view>
			</view>
			<view class="item accountBalance">
				<view class="label">账号余额(金币)</view>
				<view class="balance">{{userInfo.user.balance}}</view>
			</view>
		</view>
		<view class="payeeInfo">
			<view class="opacity">
				<view class="item title">收款人信息</view>

				<view class="item bankName">
					<view class="label">类型:</view> 
					
					<view class="desc" v-if="payment == 1">银行</view>
					<view class="desc" v-else-if="payment == 2">支付宝</view>
					<view class="desc" v-else-if="payment == 3">微信</view>
					<view class="desc" v-else-if="payment == 4">钉钉</view>
				</view>

				<view class="item bankName" v-if="payment==1">
					<view class="label">银行:</view> 
					<view class="desc">{{payeeInfo.account_bank}}</view>
				</view>
				
				<view class="item payee">
					<view class="label" v-if="payment==1"> 收款人: </view> 
					<view class="label" v-else> 姓名: </view> 
					<view class="desc"> {{payeeInfo.account_name}} </view>
					<button class="copy" type="primary" @click="copy(payeeInfo.account_name)">点击复制</button>
				</view>
				
				<view class="item accountNumber" >
					<view class="label" v-if="payment==1"> 卡号: </view>
					<view class="label" v-else> 账号: </view>
					<view class="desc"> {{payeeInfo.account_number}} </view>
					<button class="copy" type="primary" @click="copy(payeeInfo.account_number)">点击复制</button>
				</view>
				
				<view class="item bankNameDetail" v-if="payment==1">
					<view class="label"> 开户行: </view>
					<view class="desc"> {{payeeInfo.open_bank}} </view>
					<button class="copy" type="primary" @click="copy(payeeInfo.open_bank)">点击复制</button>
				</view>
				<view class="item remark">{{payeeInfo.remark}}</view>
			</view>
		</view>
		
		<view class="rechargeAmount">
			<view class="label">金额</view>
			<view class="amount"> <input type="digit" v-model="amount" placeholder="请输入金额"/></view>
		</view>
		<button class="btn_submit" type="primary" @click="submit()">我已转账,确认提交</button>
		
	</view>
</template>

<script>
	import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
	export default {
		data() {
			return {
				payment: 1,
				accountBalance: {
					userId: '',
					balance: 0
				},
				payeeInfo: {},
				amount: 0
				
			}
		},
		created: function() {

		},
		computed: {
			// ...mapState({ userInfo: state=>state.userInfo, token: state=>state.token, }),
			...mapGetters({userInfo:'userInfo', 'token':'token', 'expri':'expri'}),
		},	
		methods: {
			checkForm() {
				if(!this.amount){
					this.toast('请输入金额');
					return false;
				}
				if(this.amount<=0){
					this.toast('请输入正确的金额');
					return false;
				}
				return true;
			},
			submit() {
				if (!this.checkForm()) {
					return false;
				}
				let _this = this;
				this.httpRequest( 'finance/recharge', 'POST', {payment: this.payment, amount: this.amount, cash_account_id: this.payeeInfo.id}, function(res){
					console.log(res.data);
					if(res.data.code == 200){
						_this.toast('充值成功', 'success');
						_this._setTimeout(function(){
							uni.navigateTo({
								url: '/pages/finance/recharge/recharge'
							}, 1500);
						});
					}else{
						_this.toast(res.data.message);
					}
				});
			}
		},
		onLoad:function(option){
			
			
			console.log(option);
			let payment = option.payment;

			
			if(payment == 'bank') {
				this.payment = 1;
			} else if (payment == 'alipay') {
				this.payment = 2;
			} else if (payment == 'wepay') {
				this.payment = 3;
			} else if (payment == 'dingding') {
				this.payment = 4;
			}
			
			console.log(this.payment);
			let _this = this;
			this.httpRequest( 'finance/get-office-recharge-account', 'GET', {payment: this.payment}, function(res){
				console.log(res);
				if(res.data.code == 200){
					_this.payeeInfo = res.data.data;
				}else{
					_this.toast(res.data.message);
				}
			});
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
	}
	
	
	.container .userAccount {
		width: 90%;
		height: 100%;
		background: rgba(31, 26, 26,0.5);
		
		border-radius: 15upx;
		
		margin-top: 25upx;
		padding: 20upx 0upx;
		
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		
		text-align: center;
		font-size: 30upx;
		color: #FFFFFF;
	}
	
	.container .userAccount .item .label{
		font-size: 26upx;
	}
	
	.container .userAccount .userInfo {
		width: 45%;
		height: 100%;
		/* background: #789ECD; */
	}
	
	.container .userAccount .userInfo .userId { 
		font-size: 35upx;
	}
	
	.container .userAccount .accountBalance {
		width: 45%;
		height: 100%;
		/* background: #789ECD; */
		margin-left: 15upx;
	}
	
	.container .userAccount .accountBalance .balance { 
		font-size: 35upx;
	}
	
	
	
	/* 收款人信息 */
	.container .payeeInfo {
		width: 90%;
		height: 100%;
		background: #420F02;
		border-radius: 20upx;
		
		margin-top: 25upx;
		
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		
		
		background: url(/static/img/payimg.png) no-repeat;
		background-size: cover;
		background-position: top center;
		
	}
	
	.container .payeeInfo .opacity {
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.7);

		padding: 25upx 10upx;
		/* padding-left: 30upx; */

		display: flex;
		flex-direction: column;
		
		justify-content: center;
		align-items: center;
		
		font-size: 29upx;
		color: #FFFFFF;
	}
	
	.container .payeeInfo .opacity .item {
		width: 100%;
		height: 50upx;
		/* background: red; */
		margin-top: 10upx;
		/* padding: 2upx 0upx; */

		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		
		/* margin-left: 15upx; */
		
	}
	
	.container .payeeInfo .opacity .title {
		/* flex: auto; */
		/* width: 33%; */
		/* background: red; */
		text-align: center;
		
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		
		margin-top: 0upx;
	}
	
	.container .payeeInfo .opacity .payee, .accountNumber, .bankNameDetail {

	}
	
	.container .payeeInfo .opacity .item .label {
		width: 15%;
		height: 100%;
		font-weight: bold;
		/* background: #289063; */
		line-height: 50upx;
		text-align: right;
	}
	
	.container .payeeInfo .opacity .item .desc {
		width: 55%;
		height: 100%;
		/* background: #420F02; */
		line-height: 50upx;
		padding-left: 15upx;
	}
	
	.container .payeeInfo .opacity .item .copy {
		width: 160upx;
		height: 50upx;
		background: #289063;
		font-size: 27upx;
		background: #efa909;
		line-height: 50upx;
		
		margin-left: 5upx;
	}
	
	.container .payeeInfo .opacity .remark {}
	
	
	.container .rechargeAmount {
		width: 90%;
		height: 100%;
		/* background: #007AFF; */
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		color: #FFFFFF;
		margin-top: 30upx;
		padding: 15upx 0upx;
		border-bottom: 1upx solid #776f71;
	}
	
	.container .rechargeAmount .label {
		width: 30%;
		height: 100%;
		/* background: #289063; */
		text-align: center;
		font-size: 30upx;
	}
	.container .rechargeAmount .amount {
		width: 60%;
		height: 100%;
		/* background: #3396FB; */
		text-align: left;
		font-size: 30upx;
	}
	
	.container .btn_submit {
		width: 80%;
		height: 100%;
		
		background: #efa909;
		text-align: center;
		
		font-size: 35upx;
		
		margin-top: 40upx;
		/* padding: 0upx 0upx ; */
	}
	
	
</style>
