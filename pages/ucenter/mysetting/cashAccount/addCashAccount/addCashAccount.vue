<template>
	<view class="container">
		<view class="edit_input">
			<text class="title">账号类型</text>
			<picker class="picker" @change="bindPickerChange" :value="index" :range="list" range-key='name'>
				<view class="uni-input">{{list[index].name}}</view>
			</picker>
			<view class="drop-arrow"></view>
		</view>

		<view class="edit_input" v-if="channel==5">
			<text class="title">银行卡</text>
			<input class="input" type="text" v-model="account_number" placeholder="请输入银行卡号">
		</view>
		<view class="edit_input" v-if="channel==5">
			<text class="title">持卡人</text>
			<input class="input" type="text" v-model="account_name" placeholder="请输入持卡人姓名">
		</view>
		<view class="edit_input" v-if="channel==5">
			<text class="title">开户行</text>
			<input class="input" type="text" v-model="open_bank" placeholder="开户行支行名称(选填)">
		</view>

		<view class="edit_input" v-if="channel==1 || channel==2 || channel==3 || channel==4">
			<text class="title">账号</text>
			<input class="input" type="text" v-model="account_number" :placeholder="'请输入'+list[index].name+'账号'">
		</view>
		<view class="edit_input" v-if="channel==1 || channel==2 || channel==3 || channel==4">
			<text class="title">姓名</text>
			<input class="input" type="text" v-model="account_name" :placeholder="'请输入'+list[index].name+'姓名'">
		</view>

		<view class="edit_input">
			<text class="title">安全密码</text>
			<input class="input" type="password" v-model="secpwd" placeholder="请输入安全密码">
		</view>
		<button class="button" type="warn" @click="submit()">确认添加</button>
	</view>
</template>

<script>
	import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
	import xflSelect from '@/components/xfl-select/xfl-select.vue';     //导入
	export default {
		data() {
			return {
				account_bank: '',
				account_number: '',
				account_name: '',
				open_bank: '',
				secpwd: '',
				list: [       //要展示的数据
					{name:'支付宝',color: '#00AAEE'},
					{name:'微信', color: '#00D00B'},
					{name:'qq钱包', color: '#EA1C26'},
					{name:'钉钉钱包', color: '#00AAEE'},
					{name:'中国银行', color: '#D7D7E4'},
					{name:'工商银行', color: '#D7D7E4'},
					{name:'建设银行', color: '#D7D7E4'},
					{name:'农业银行', color: '#D7D7E4'},
					{name:'招商银行', color: '#D7D7E4'},
					{name:'邮政银行', color: '#D7D7E4'},
					{name:'平安银行', color: '#D7D7E4'},
					{name:'民生银行', color: '#D7D7E4'},
					{name:'广发银行', color: '#D7D7E4'},
					{name:'兴业银行', color: '#D7D7E4'},
					{name:'浦发银行', color: '#D7D7E4'},
					{name:'华夏银行', color: '#D7D7E4'},
					{name:'光大银行', color: '#D7D7E4'},
					{name:'交通银行', color: '#D7D7E4'},
					{name:'中信银行', color: '#D7D7E4'}
				],
				index: 0,
				channel: 1
			}
		},
		components: {
			xflSelect
		},
		computed: {
			// ...mapState({ userInfo: state=>state.userInfo, token: state=>state.token, }),
			...mapGetters({userInfo:'userInfo', 'token':'token', 'expri':'expri'}),
		},
		methods: {
			...mapActions('userStatus', {'logout':'logout'}),
			checkForm() {
				if(!this.account_name) {
					if(this.channel == 5){
						title = "请输入持卡人姓名";
					} else {
						title = this.list[this.index].name+'姓名';
					}
					this.toast('请输入'+title);
					return false;
				}
				if(!this.account_number) {
					if(this.channel == 5){
						title = "请输入银行卡号";
					} else {
						title = this.list[this.index].name+'账号';
					}
					this.toast('请输入'+title);
					return false;
				}
				if(!this.secpwd) {
					this.toast('请输入安全密码');
					return false;
				}
				this.account_bank = this.list[this.index].name;
				this.account_color = this.list[this.index].color;
				return true;
			},
			bindPickerChange(e) {
				// console.log(e.target.value);
				if (e.target.value == 0 || e.target.value == 1 || e.target.value == 2 || e.target.value == 3) {
					this.channel = parseInt(e.target.value) + 1;
				}else{
					this.channel = 5;
				}
				this.index = e.target.value;
				this.account_bank = this.list[this.index].name;
				this.account_color = this.list[this.index].color;
				
				console.log(this.channel);
			},
			submit() {
				if(!this.checkForm()){
					return false;
				}

				let _this = this;
				this.httpRequest( 'user/add-account', 'POST', {channel: this.channel, account_bank: this.account_bank, account_color: this.account_color, open_bank: this.open_bank, account_name: this.account_name, account_number: this.account_number, secpwd: this.secpwd}, function(res){
					if(res.data.code == 200){
						_this.toast('添加成功', 'success', 1000);
						_this._setTimeout(function(){
							uni.navigateTo({
								url: '/pages/ucenter/mysetting/cashAccount/cashAccount'
							});
						}, 1000);
					}else{
						_this.toast(res.data.message);
					}
				});
			},
			onLoad:function(){
				
				let _this = this;
				this.httpRequest( 'user/check-security-pwd', 'GET', {}, function(res){
					if(res.data.code != 200){
						_this.toast(res.data.message, 'none', 1000)
						_this._setTimeout(function(){
							uni.navigateTo({
								url: '/pages/ucenter/mysetting/securityPassword/securityPassword'
							});
						}, 1000);
					}
				});
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
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.edit_input:first-child{
		margin-top: 25upx;
	}
	
	.edit_input {
		width: 90%;
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: left;
		align-items: center;
		font-size: 30upx;
		border-bottom: 0.5px solid #776f71;
		margin: 0upx 0px;
		
		/* line-height: 100%; */
		
		/* background: #0000FF; */
		
		padding: 30upx 0upx;
	}
	
	.edit_input .picker {
		width: 40%;
		height: 60upx;
		line-height: 60upx;
		text-align: center;
		/* background: #0062CC; */
	}
	
	.edit_input .drop-arrow {
		width: 15upx;
		height: 15upx;
		/* background: #00D400; */
		border-top: 1upx solid #FFFFFF;
		border-right: 1upx solid #FFFFFF;
		transform: rotate(135deg);
		margin-left: 00upx;
	}
	
	.edit_input .title {
		width: 20%;
		height: 60upx;
		line-height: 60upx;
		/* background: #0000FF; */
		/* margin: 20upx 0upx; */
		margin-left: 30upx;
		text-align: center;
		font-size: 28upx;
	}
	.edit_input .input {
		width: 50%;
		height: 60upx;
		/* background: red; */
		margin-left: 15upx;
		line-height: 60upx;
	}
	
	.edit_input .code {
		/* display: block; */
		width: 20%;
		height: 60upx;
		line-height: 60upx;
		background: #9b8c48;
		padding: 20upx 10upx;
		/* margin: 30upx 0upx; */
		margin-left: 70upx;
		text-align: center;
		font-size: 30upx;
	}
	
	.button {
		width: 70%;
		background: #efa909;
		/* font-size: 30upx; */
		margin-top: 35upx;
	}
</style>
