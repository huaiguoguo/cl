<template>
	<view class="container">

		<view class="header" :style="diyStyle">
			
			<view class="next_balance">
				<view class="next">
					<view class="next_periods">
						距离<text class="periods">{{periodsInfo.periods}}</text>期截至
					</view>
					<view class="next_second">
						<text v-if="isSealed">已封盘</text>
						<text v-if="isRun" class="second">{{end_time_str}}</text> 
						<text v-if="isRun">后开奖</text>
						<text v-if="!isRun">封盘中, 正在开奖</text>
					</view>
				</view>
				<view class="balance">
					<view class="title"> 余额 </view>
					<view class="money">
						<text>{{userInfo.user.balance}}</text> 金币
					</view>
				</view>
			</view>

			<view class="previous">
				<view class="periods">
					<view class="periods_text">第<text class="title">{{previous_periods}}</text>期</view>
					<view class="periods_result">
						<view class="item one">{{previous_periods_result_one}}</view>

						<view class="item plus">+</view>

						<view class="item two">{{previous_periods_result_two}}</view>

						<view class="item plus">+</view>

						<view class="item three">{{previous_periods_result_three}}</view>

						<view class="item plus equal">=</view>

						<view class="item result">{{previous_periods_result}}</view>

						<view class="item result_type">{{previous_periods_result_type}}</view>

					</view>
				</view>
				<view class="arrow_bg" @click="dropdown()">
					<view class="right-arrow" :style="'transform: rotate('+rotate+'deg)'"></view>
				</view>
			</view>

			<view class="history" v-if="down">

				<view class="header_line">
					<view class="left_line"> </view>
					<view class="title"> 历史开奖 </view>
					<view class="right_line"> </view>
				</view>

				<view class="award_list">
					<view class="menu">
						<view class="title periods">期号</view>
						<view class="title award">开奖结果</view>
						<view class="title extremum">极值</view>
						<view class="title dragon_tiger_balm">龙虎豹</view>
						<view class="title dragon_tiger_pairs">对顺豹</view>
					</view>
					<view class="list">
						<view class="item" v-for="(item,index) in historyList" :key="index">
							<view class="title periods">{{item.periods}}</view>
							<view class="title award">
								<text>{{item.open_number}}</text> =
								<text style="color:#FFFFFF;font-weight: 600;">{{item.open_number_sum}}</text> 
								<text style="color:#FFFFFF;font-weight: 600; padding-left: 10upx;"> {{item.danshuang}} </text> </view>
							<view class="title extremum"> {{item.jizhi}}</view>
							<view class="title dragon_tiger_balm">{{item.dragon_tiger_balm}}</view>
							<view class="title dragon_tiger_pairs">{{item.duishunbao}}</view>
						</view>
					</view>
				</view>
			</view>

		</view>

		<view class="content" @click="footerdown()" ref="$refs.chatcontheight">
			<view class="item" v-for="(item,index) in messageList" :key="index">
				<view class="date_time" v-if="item.type == 1">
					{{item.date_time}}
				</view>

				<view class="msg_content" v-if="item.type == 1">
					<view class="user">
						<image class="avatar" src="/static/img/avatar.jpg" mode=""></image>
						<view class="username">
							{{item.username}}
						</view>
					</view>
					<!-- <uni-number-box :min="0"  :step="10" :type="active" :index="1" :odd="2"  @change="bindChange"></uni-number-box> -->
					<!-- <uni-number-box :min="0"  :step="10" :type="active" :index="1" :odd="2"  @change="bindChange"></uni-number-box> -->
					<view class="msg even" v-if="index%2==0">
						<view class="msg_periods"> 第{{item.periods}}期 </view>
						<view class="msg_text"> {{item.number_text}} </view>
					</view>

					<view class="msg odd" v-if="index%2!=0">
						<view class="msg_periods"> 第{{item.periods}}期 </view>
						<view class="msg_text"> {{item.number_text}} </view>
					</view>

				</view>

				<!-- 这里有几条记录，如果记录里面有，则这里显示，如果没有则隐藏 -->
				<view class="sealing" v-if="item.type == 2">
					==========封盘线==========<br>第{{item.periods}}已封盘，下注信息以系统收录为准，开奖结果以官方开奖为准，如有异议，请及时联系QQ客服：2727314253
				</view>
				<view class="open_result" v-if="item.type == 3">
					第{{item.periods}}期已开奖{{item.number_text}}
				</view>
				<view class="open_quotation" v-if="item.type == 4">
					第{{item.periods}}期已开盘, 请及时下注! 祝老板好运.
				</view>
				<view class="other" v-if="item.type == 5">
					其它
				</view>
			</view>
		</view>

		<!-- :style="(footer_enable == 1)?'dispaly:block':'display:none'" -->

		<view class="footer" v-if="footer_enable==1">

			<view class="menu">
				<view :class="active==1?'item active':'item' " @click="active=1">四项</view>
				<view :class="active==2?'item active':'item' " @click="active=2">组合</view>
				<view :class="active==3?'item active':'item' " @click="active=3">数字</view>
				<view :class="active==4?'item active':'item' " @click="active=4">极值</view>
				<view :class="active==5?'item active':'item' " @click="active=5">龙虎豹</view>
			</view>

			<view class="bet">

				<view class="item four" :style="(active == 1)?'dispaly:block':'display:none'">
					<view class="four_cell" v-for="(item,four_index) in 4" :key="four_index">
						<view class="cell cell_odds">
							<text class="desc">X2</text>
						</view>
						<view class="cell cell_name">
							<text v-if="four_index==0">大</text>
							<text v-if="four_index==1">小</text>
							<text v-if="four_index==2">单</text>
							<text v-if="four_index==3">双</text>
						</view>
						<view class="cell cell_money">
							<uni-number-box :min="0" :step="10" :type="active" :index="four_index+1" :odd="2" @change="bindChange"></uni-number-box>
						</view>
					</view>
				</view>

				<view class="item group" :style="(active == 2)?'dispaly:block':'display:none'">
					<view class="group_cell" v-for="(item, group_index) in 4" :key="group_index">
						<view class="cell cell_odds">
							<text v-if="group_index==0 || group_index==2" class="desc">X4.2</text>
							<text v-if="group_index==1 || group_index==3" class="desc">X4.4</text>
						</view>
						<view class="cell cell_name">
							<text v-if="group_index==0">大单</text>
							<text v-if="group_index==1">小单</text>
							<text v-if="group_index==2">大双</text>
							<text v-if="group_index==3">小双</text>
						</view>
						<view class="cell cell_money">
							<uni-number-box :min="0" :step="10" :type="active" :index="group_index+1" :odd="(group_index==0 || group_index==2)?4.2:4.4"
							 @change="bindChange"></uni-number-box>
						</view>
					</view>
				</view>

				<view class="item number" :style="(active == 3)?'dispaly:block':'display:none'">

					<view class="number_cell" v-for="(item,number_index) in 28" :key="number_index">
						<view class="cell cell_odds">
							<text class="desc">X11</text>
						</view>
						<view class="cell cell_name">
							<text>{{number_index}}</text>
						</view>
						<view class="cell cell_money">
							<uni-number-box :min="0" :step="10" :type="active" :index="number_index" :numer_arr="game.number" :odd="11"
							 @change="bindChange"></uni-number-box>
						</view>
					</view>

				</view>

				<view class="item extremum" :style="(active == 4)?'dispaly:block':'display:none'">

					<view class="extremum_cell" v-for="(item, extremum_index) in 2" :key="extremum_index">
						<view class="cell cell_odds">
							<text class="desc">X10</text>
						</view>
						<view class="cell cell_name">
							<text v-if="extremum_index==0">极小</text>
							<text v-else>极大</text>
						</view>
						<view class="cell cell_money">
							<uni-number-box :min="0" :step="10" :type="active" :index="extremum_index+1" :odd="10" @change="bindChange"></uni-number-box>
						</view>
					</view>

				</view>

				<view class="item dragon_tiger_balm" :style="(active == 5)?'dispaly:block':'display:none'">
					<view class="dragon_tiger_balm_cell" v-for="(item, dragon_tiger_balm_index) in 6" :key="dragon_tiger_balm_index">
						<view class="cell cell_odds">
							<text v-if="dragon_tiger_balm_index==0 || dragon_tiger_balm_index==1 || dragon_tiger_balm_index==2 || dragon_tiger_balm_index==3"
							 class="desc">X3</text>
							<text v-if="dragon_tiger_balm_index==4" class="desc">X10</text>
							<text v-if="dragon_tiger_balm_index==5" class="desc">X50</text>
						</view>
						<view class="cell cell_name">
							<text v-if="dragon_tiger_balm_index==0">龙</text>
							<text v-if="dragon_tiger_balm_index==1">虎</text>
							<text v-if="dragon_tiger_balm_index==2">豹</text>
							<text v-if="dragon_tiger_balm_index==3">对子</text>
							<text v-if="dragon_tiger_balm_index==4">顺子</text>
							<text v-if="dragon_tiger_balm_index==5">豹子</text>
						</view>
						<view class="cell cell_money">
							<uni-number-box :min="0" :step="10" :type="active" :index="dragon_tiger_balm_index+1" :odd="(dragon_tiger_balm_index==0||dragon_tiger_balm_index==1||dragon_tiger_balm_index==2||dragon_tiger_balm_index==3)?3:(dragon_tiger_balm_index==4?10:(dragon_tiger_balm_index==5?50:0))"
							 @change="bindChange"></uni-number-box>
						</view>
					</view>
				</view>

			</view>


			<view class="bet_btn">
				<view class="money_balance">
					<view class="money">
						下注金额: <text class="title">{{total_money}}</text>
					</view>
					<view class="balance">
						账号余额: <text class="title">{{userInfo.user.balance}}</text>
					</view>
				</view>
				<view class="sub_btn" @click="send()">确认下注</view>
			</view>

		</view>

		<view class="send" @click="footer_enable==2?footer_enable=1:footer_enable=1">投注</view>

	</view>
</template>

<script>
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	import { mapState, mapGetters, mapActions } from 'vuex'; //先要引入
	export default {
		components: {
			uniNumberBox
		},
		data() {
			return {
				diyStyle: '',
				room_id: 0,
				socket: '',
				isConnect: false,
				historyList: [],
				messageList: [],
				down: false,
				rotate: 45,
				active: 1,
				footer_enable: 2,
				isSealed: 0,
				game: {
					four: {},
					group: {},
					number: [],
					extremum: {},
					dragon_tiger_balm: {}
				},
				interval: null,
				robot: null,
				total_money: 0,
				end_time_str: '',
				end_time: '',
				next_periods: '正在获取期号',
				next_periods_id: 0,
				previous_periods_id: '',
				previous_periods: '',
				previous_periods_result_text: '',
				previous_periods_result_one: '',
				previous_periods_result_two: '',
				previous_periods_result_three: '',
				previous_periods_result: '',
				previous_periods_result_type: '',
				isRun: false,
				isSendOpenResult: true
			}
		},
		computed: {
			// ...mapState({
			// 	userInfo: state => state.userInfo,
			// 	periodsInfo: state => state.periodsInfo
			// }),
			...mapGetters({userInfo:'userInfo', 'token':'token', 'expri':'expri', 'periodsInfo': 'periodsInfo'}),
		},
		methods: {
			footerdown() {
				if (this.footer_enable == 1) {
					this.footer_enable = 2
				} else {
					this.footer_enable == 1
				}
				this.game = {
					four: {},
					group: {},
					number: [],
					extremum: {},
					dragon_tiger_balm: {}
				};
				this.total_money = 0;
				

				
			},

			countDown() { },

			bindChange(obj) {
				if (!this.next_periods || !this.next_periods_id) {
					this.toast('期数错误, 暂时不能投');
					return false;
				}

				if (obj.type == 1) {
					this.game_four(obj);
				} else if (obj.type == 2) {
					this.game_group(obj);
				} else if (obj.type == 3) {
					this.game_number(obj);
				} else if (obj.type == 4) {
					this.game_extremum(obj);
				} else if (obj.type == 5) {
					this.game_dragon_tiger_balm(obj);
				}

				let money = 0;
				for (let item in this.game.four) {
					money += this.game.four[item].money;
				}

				for (let item in this.game.group) {
					money += this.game.group[item].money;
				}

				for (let i = 0; i < this.game.number.length; i++) {
					money += this.game.number[i].money;
				}

				for (let item in this.game.extremum) {
					money += this.game.extremum[item].money;
				}

				for (let item in this.game.dragon_tiger_balm) {
					money += this.game.dragon_tiger_balm[item].money;
				}

				this.total_money = money;

			},
			game_four(obj) {
				let bet = {
					odd: obj.odd,
					money: obj.money
				};
				if (obj.index == 1) {
					if (bet.money <= 0) {
						delete this.game.four.da;
					} else {
						this.game.four.da = bet;
					}
				} else if (obj.index == 2) {
					if (bet.money <= 0) {
						delete this.game.four.xiao;
					} else {
						this.game.four.xiao = bet;
					}
				} else if (obj.index == 3) {
					if (bet.money <= 0) {
						delete this.game.four.dan;
					} else {
						this.game.four.dan = bet;
					}
				} else if (obj.index == 4) {
					if (bet.money <= 0) {
						delete this.game.four.shuang;
					} else {
						this.game.four.shuang = bet;
					}
				}
			},
			game_group(obj) {
				let bet = {
					odd: obj.odd,
					money: obj.money
				};
				if (obj.index == 1) {
					if (bet.money <= 0) {
						delete this.game.group.dadan;
					} else {
						this.game.group.dadan = bet;
					}

				} else if (obj.index == 2) {
					if (bet.money <= 0) {
						delete this.game.group.xiaodan;
					} else {
						this.game.group.xiaodan = bet;
					}
				} else if (obj.index == 3) {
					if (bet.money <= 0) {
						delete this.game.group.dashuang;
					} else {
						this.game.group.dashuang = bet;
					}
				} else if (obj.index == 4) {
					if (bet.money <= 0) {
						delete this.game.group.xiaoshuang;
					} else {
						this.game.group.xiaoshuang = bet;
					}
				}
			},
			game_number(obj) {

				let bet = {
					number: obj.index,
					odd: obj.odd,
					money: obj.money
				};

				let flag;
				let number_arr = this.game.number;
				if (number_arr.length > 0) {
					for (let i = 0; i < number_arr.length; i++) {
						// console.log(number_arr[i].number, obj.index);
						if (number_arr[i] && number_arr[i].number == obj.index) {
							flag = false;
							if (bet.money <= 0) {
								number_arr.splice(i, 1);
							} else {
								number_arr[i] = bet
							}

						} else {
							flag = true;
						}
					}
					if (flag && bet.money > 0) {
						number_arr.push(bet);
					}
				} else {
					if (bet.money > 0) {
						number_arr.push(bet);
					}
				}
				this.game.number = number_arr;
			},
			game_extremum(obj) {
				let bet = {
					odd: obj.odd,
					money: obj.money
				};
				if (obj.index == 1) {
					if (bet.money <= 0) {
						delete this.game.extremum.jida;
					} else {
						this.game.extremum.jida = bet;
					}
				} else if (obj.index == 2) {
					if (bet.money <= 0) {
						delete this.game.extremum.jixiao;
					} else {
						this.game.extremum.jixiao = bet;
					}
				}
			},
			game_dragon_tiger_balm(obj) {
				let bet = {
					odd: obj.odd,
					money: obj.money
				};
				if (obj.index == 1) {
					if (bet.money <= 0) {
						delete this.game.dragon_tiger_balm.dragon;
					} else {
						this.game.dragon_tiger_balm.dragon = bet;
					}
				} else if (obj.index == 2) {
					if (bet.money <= 0) {
						delete this.game.dragon_tiger_balm.tiger;
					} else {
						this.game.dragon_tiger_balm.tiger = bet;
					}
				} else if (obj.index == 3) {
					if (bet.money <= 0) {
						delete this.game.dragon_tiger_balm.balm;
					} else {
						this.game.dragon_tiger_balm.balm = bet;
					}
				} else if (obj.index == 4) {
					if (bet.money <= 0) {
						delete this.game.dragon_tiger_balm.duizi;
					} else {
						this.game.dragon_tiger_balm.duizi = bet;
					}
				} else if (obj.index == 5) {
					if (bet.money <= 0) {
						delete this.game.dragon_tiger_balm.shunzi;
					} else {
						this.game.dragon_tiger_balm.shunzi = bet;
					}
				} else if (obj.index == 6) {
					if (bet.money <= 0) {
						delete this.game.dragon_tiger_balm.baozi;
					} else {
						this.game.dragon_tiger_balm.baozi = bet;
					}
				}
			},

			dropdown() {
				if (this.down) {
					this.down = false;
					this.rotate = 45
				} else {
					this.down = true;
					this.rotate = 135;
				}
			},
			connection() {

				if (!this.room_id) {
					this.toast('房间id错误');
					uni.switchTab({
						url: '../home'
					})
					return false;
				}
				
				let _this = this;
				
				this.socket = uni.connectSocket({
					url: this.socket_host+'?room_id=' + this.room_id,
					header: {
						'content-type': 'application/json',
						'room_id': this.room_id
					},
					method: 'GET',
					success: function(res) {
						_this.isConnect = true;
						console.log(res, "连接成功");
						
					},
					fail: function(error) {
						console.log("连接错误:", error);
					}
				});
				// this.getUserInfo(this);

				this.open();
				this.message();
				this.error();

			},
			open() {
				let _this = this;
				this.socket.onOpen(function(res) {
					console.log('WebSocket连接已打开！' + res);
				});
			},

			message() {
				let _this = this;
				this.socket.onMessage(function(res) {
					console.log("服务端发来了消息=============start")
					console.log(res);
					let content = eval('(' + res.data + ')');
					// content.data = eval('('+content.data+')');
					console.log(content);
					if (content.status == 1) {
						_this.messageList.push(content)
					} else {
						// _this.toast(content.msg);
					}

					console.log("总的消息列表=============end")
					console.log(_this.messageList);
					console.log("服务端发来了消息=============end")
				});
			},
			error() {
				let _this = this;
				this.socket.onError(function(errMsg) {
					// _this.toast(errMsg);
				})
			},
			send() {
				if (!this.room_id) {
					this.toast('房间id错误, 不能投注');
					return false;
				}

				if (this.isRun == false) {
					this.toast('已封盘');
					return false;
				}

				if (!this.next_periods || !this.next_periods_id) {
					this.toast('期号错误');
					return false;
				}

				let game = JSON.stringify(this.game);
				let four = JSON.stringify(this.game.four);
				let group = JSON.stringify(this.game.group);
				let number = JSON.stringify(this.game.number);
				let extremum = JSON.stringify(this.game.extremum);
				let dragon_tiger_balm = JSON.stringify(this.game.dragon_tiger_balm);

				console.log(game);
				console.log(four);
				console.log(group);
				console.log(number);
				console.log(extremum);
				console.log(dragon_tiger_balm);

				if (game == '{}' || (four == '{}' && group == '{}' && number == '[]' && extremum == '{}' && dragon_tiger_balm ==
						'{}')) {
					this.toast('请选择玩法并且投注金额, 再下注');
					return false;
				}

				// this.getUserInfo(this);
				if (this.userInfo.user.balance <= 0) {
					this.toast('余额不足, 请充值后再玩');
					return false;
				}

				console.log(this.game);
				// return false;

				let _this = this;
				let data = {
					'type': 1,
					'total_money': this.total_money,
					'periods_id': this.next_periods_id,
					'periods': this.next_periods,
					'user_id': this.userInfo.user.id,
					'username': this.userInfo.user.username,
					'room_id': this.room_id,
					'data': this.game
				};
				let dataJsonStr = JSON.stringify(data);

				this.socket.send({
					data: dataJsonStr,
					success: function(res) {
						// _this.toast('下注成功', 'success');
						console.log(res);
						_this.getUserInfo(this);
						_this.footerdown();
					},
					fail: function(error) {
						console.log('发送错误============start')
						console.log(error);
						console.log('发送错误============end')
					}
				})
			},
			
			getHistory() {
				let _this = this;
				this.httpRequest( 'chat/history', 'GET', {}, function(res) {
					if (res.data.code == 200) {
						_this.historyList = res.data.data;
						if (_this.historyList.length > 0) {
							
							_this.previous_periods = _this.historyList[0].periods;
							_this.previous_periods_id = _this.historyList[0].id;
							
							let previous_periods_result_arr = _this.historyList[0].open_number.split("+");
							
							
							_this.previous_periods_result_one = previous_periods_result_arr[0];
							_this.previous_periods_result_two = previous_periods_result_arr[1];
							_this.previous_periods_result_three = previous_periods_result_arr[2];
							
							_this.previous_periods_result = _this.historyList[0].open_number_sum;
							
							let result_type = '无';
							if (_this.historyList[0].duishunbao) {
								result_type = _this.historyList[0].duishunbao
							}
							_this.previous_periods_result_text = _this.historyList[0].open_number +'='+_this.historyList[0].open_number_sum + ' ('+result_type+')'
							
							if(result_type.length>=2){
								result_type = result_type.substr(0, result_type.length-1);
							}
							_this.previous_periods_result_type =  result_type;
							// _this.sendOpenResultMessage();
						}
					} else {
						_this.toast(res.data.message);
						return false;
					}
				});
			},
			getMessageList(){
				let _this = this;
				this.httpRequest( 'chat/get-chat-record', 'GET', {room_id: this.room_id}, function(res) {
					
						console.log('这是消息记录start=================================')
						// console.log(res.data.data);
						console.log('这是消息记录end=================================')

					if (res.data.code == 200) {
						res.data.data.forEach(function(item, index){
							// console.log(item, index);
							_this.messageList.unshift(item);
						})
						
						if(_this.isRun){
							let fengpan = {
								type: 2,
								date_time: "2019-08-04 23:01:26",
								id: "996",
								number_text: "10小 ",
								periods: "2458148",
								periods_id: "985",
								total_money: "10.00",
								user_id: "8",
								username: "大不溜",
							}
							_this.messageList.push(fengpan)
						}
						
						console.log('这是消息记录start+++++++++++++++++++++++++++++++')
						console.log(_this.messageList);
						console.log('这是消息记录end----------------------------------')
						
					} else{
						_this.toast('error');
					}
				})
			},
			sendOpenResultMessage(){
				if(this.isSendOpenResult){
					return false;
				}
				let data = {
					'type': 3,
					'total_money': '',
					'periods_id': this.historyList[0].id,
					'periods': this.historyList[0].periods,
					'user_id': this.userInfo.user.id,
					'username': this.userInfo.user.username,
					'room_id': this.room_id,
					'data': this.previous_periods_result_text
				};
				console.log('type3消息');
				console.log(data);
				// return false;
				let dataJsonStr = JSON.stringify(data);
				let _this = this;
				this.socket.send({
					data: dataJsonStr,
					success: function(res) {
						console.log(res);
						_this.isSendOpenResult = true;
					},
					fail: function(error) {
						console.log('发送错误============start')
						console.log(error);
						console.log('发送错误============end')
					}
				})
			},
			getCurrentPeriods() {
				if (this.isRun) {
					return false;
				}
				if(!this.room_id){
					this.toast('房间错误');
					return false;
				}
				let _this = this;
				let current_time = Math.round(new Date() / 1000);
				// this.$store.commit('periodsInfo', null);
				this.httpRequest( 'chat/get-current-periods', 'GET', {room_id: this.room_id}, function (res) {
					if(res.data.code == 200){
						
						console.log(res.data.data.end_time, current_time);
						
						if (res.data.data && res.data.data.end_time && res.data.data.end_time > current_time) {
							_this.$store.commit('periodsInfo', res.data.data);
							_this.next_periods = res.data.data.periods;
							_this.next_periods_id = res.data.data.id;
							_this.isRun = true;
							_this.isSendOpenResult = false;
							_this.getHistory();
						}
					}else if(res.data.code==210){
						// _this.isRun = false;
						_this.messageList.push({type: 2})
						// _this.robotSend(2);
						// _this.toast(res.data.message);
						// clearInterval(_this.interval);
					}
				})
			},
			intervalEndTime(param='') {
				console.log(param)
				if(!this.room_id){
					this.toast('房间错误');
					return false;
				}
				this.next_periods = this.periodsInfo.periods;
				this.next_periods_id = this.periodsInfo.id;
				let _this = this;
				this.interval = setInterval(function(){
					_this.endTimeStr();
				}, 1000);
			},
			endTimeStr(){
				let current_time = Math.round(new Date() / 1000);
				let surplus = this.periodsInfo.end_time - current_time - 10;
				// console.log('-------------------------------------------------------////////////////////');
				// console.log('剩余时间是================================================:',surplus);
				if(surplus != 'Nan' && surplus>=0){
					// this.sendOpenResultMessage();
					let day = parseInt(surplus/60/60/24, 10);
					let hour = parseInt(surplus/60/60%24, 10);
					let minute = parseInt(surplus/60%60, 10);
					let second = parseInt(surplus % 60, 10);
					minute = this.checkTime(minute);
					second = this.checkTime(second);
					this.end_time_str = minute+'分'+second+'秒';
					// console.log(this.end_time_str);
					if(surplus == 0){
						// console.log('等于0', surplus);
						this.isRun = false;
					}else{
						// console.log('大于0', surplus);
						if(!this.isRun){
							this.isRun = true;
						}
					}
				}else{
					if(!this.isRun && (!this.periodsInfo.end_time || this.periodsInfo.end_time < current_time-12)){
						console.log('走进请求数据:',this.periodsInfo);
						this.isRun = false;
						this.getCurrentPeriods();
					}else{
						// console.log('messagelist:',this.messageList);
						// console.log('messagelist.length:', this.messageList.length-1);
						// console.log('message.length-1',this.messageList[this.messageList.length-1]);
						// console.log('message.length-1',this.messageList[this.messageList.length-1].type);
						// console.log('==========================================================end');
						
						if(this.messageList.length>0 && this.messageList[this.messageList.length-1].periods != this.next_periods){
							// this.messageList.push({type: 2, 'periods': this.next_periods})
							this.robotSend(2);
						}
						// this.robotSend(2);
						console.log('时间是', this.periodsInfo.end_time, current_time);
					}
				}
			},
			checkTime(time) {
				if(time<10){
					return '0'+time;
				}
				return time;
			},
			robotSend(type){
				// return false;
				if(type != 2){
					return false;
				}
				
				if(this.messageList && this.messageList.length>0 && this.messageList[0] && this.messageList[0].periods == this.next_periods){
					return false;
				}
				
				// this.getMessageList();

				let _this = this;
				
				let four = {
					"xiao":{"odd":2,"money":10},
					"shuang":{"odd":2,"money":10},
					"dan":{"odd":2,"money":10},
					"da":{"odd":2,"money":10}
				}
				let group = {
					"dadan":{"odd":4.2,"money":10},
					"xiaoshuang":{"odd":4.4,"money":10},
					"xiaodan":{"odd":4.4,"money":10},
					"xiaodan":{"odd":4.4,"money":10},
				};
				
				let  extremum = [];
				let  dragon_tiger_balm = {};
				
				let game = {
					"four":four,
					"group": group,
					"number":[],
					"extremum":extremum,
					"dragon_tiger_balm": dragon_tiger_balm
				};
				
				let data = {
					'type': 2,
					'total_money': 888,
					'periods_id': this.next_periods_id?this.next_periods_id:99,
					'periods': this.next_periods?this.next_periods:100,
					'user_id': 9999,
					'username': '花不脱',
					'room_id': this.room_id,
					'data': game
				};
				let dataJsonStr = JSON.stringify(data);

				this.socket.send({
					data: dataJsonStr,
					success: function(res) {
						// _this.toast('下注成功', 'success');
						console.log(res);
						
					},
					fail: function(error) {
						console.log('发送错误============start')
						console.log(error);
						console.log('发送错误============end')
					}
				})
			},
			randomNum(minNum,maxNum){ 
				switch(arguments.length){ 
					case 1: 
						return parseInt(Math.random()*minNum+1,10); 
					break; 
					case 2: 
						return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
					break; 
						default: 
							return 0; 
						break; 
				} 
			},
			scrollToBottom() {
				 this.$nextTick(() => {
					var container = this.$el.querySelector(".content");
					console.log('container.scrollHeight:',container);
					
					// container.scrollTop = container.scrollHeight+1800;
				 })
			}
		},
		onLoad: function(option) {
			if (!option.room_id) {
				this.toast('房间错误');
				uni.switchTab({
					url: '../home'
				})
				return false;
			}
			this.room_id = option.room_id;
			this.getUserInfo();
			
			let current_time = Math.round(new Date() / 1000);
			if(!this.userInfo.user || !this.token || this.expri<current_time){
				this.toast('登录过期!!');
				this.$store.commit('logout');
				setTimeout(function() {
					uni.redirectTo({
						url: '/pages/ucenter/Login/Login'
					});
				}, 1000);
				return false;
			}
			this.connection();
			this.getHistory();
			this.getMessageList();
			this.intervalEndTime();
			this.diyStyle = 'top: 82upx;'
			// if (uni.getSystemInfoSync().platform == "android") {
			// 	this.diyStyle = 'top: 74upx;'
			// }
			this.scrollToBottom();
		},
		onShow:function(){
			// clearInterval(this.interval)
			// this.intervalEndTime();
		},
		onHide: function() {
			// clearInterval(this.interval)
		},
		onUnload:function(){
			clearInterval(this.interval)
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
		display: flex; -webkit-dispaly:flex;
		flex-direction: column; -webkit-flex-direction: column;
		justify-content: center; -webkit-justify-content: center;
		align-items: center; -webkit-align-items: center;
	}

	.header {
		width: 100%;
		display: flex; -webkit-dispaly:flex;
		flex-direction: column; -webkit-flex-direction: column;
		justify-content: center; -webkit-justify-content: center;
		align-items: center; -webkit-align-items: center;
		position: fixed;
		top: 82upx;
		z-index: 99;
		background: #000000;
		color: #eaca6c;
		margin-top: 0upx;
	}


	.header .next_balance {
		width: 100%;
		height: 100upx;
		display: flex; -webkit-dispaly:flex;
		flex-direction: row; -webkit-flex-direction: row; 
		justify-content: center; -webkit-justify-content: center;
		align-items: center; -webkit-align-items: center;
		font-size: 26upx;
		border: 4upx solid #414040;
	}

	.header .next_balance .next {
		width: 60%;
		height: 100upx;
		display: flex; -webkit-dispaly:flex;
		flex-direction: column; -webkit-flex-direction: column;
		justify-content: center; -webkit-justify-content: center;
		align-items: center; -webkit-align-items: center;
		text-align: center;
		font-size: 26upx;
		border-right: 4upx solid #414040;
	}

	.header .next_balance .next .next_periods {
		width: 100%;
		height: 40upx;
		line-height: 40upx;
	}

	.header .next_balance .next .next_second {
		width: 100%;
		height: 40upx;
		line-height: 40upx;
	}

	.header .next_balance .next .next_periods .periods,
	.next_second .second {
		padding: 0upx 5upx;
		color: #FFFFFF;
	}

	/* 右侧余额 */
	.header .next_balance .balance {
		width: 35%;
		height: 100upx;
		/* background: #E7AE47; */
		text-align: center;
		/* font-size: 26upx; */

		display: flex; -webkit-dispaly:flex;
		flex-direction: column; -webkit-flex-direction: column;
		justify-content: center; -webkit-justify-content: center;
		align-items: center; -webkit-align-items: center;
	}

	.header .next_balance .balance .title,
	.money {
		width: 200upx;
		height: 40upx;
		/* background: #A7AE47; */
		text-align: center;
		font-size: 26upx;
		line-height: 40upx;
	}

	.header .next_balance .balance .money text {
		color: #FFFFFF;
	}

	.header .previous {
		width: 100%;
		height: 70upx;
		font-size: 26upx;
		/* background: #FF0000; */
		display: flex; -webkit-dispaly:flex;
		flex-direction: row; -webkit-flex-direction: row; 
		justify-content: flex-end;
		align-items: center; -webkit-align-items: center;
		border-bottom: 4upx solid #414040;
	}

	.header .previous .periods {
		width: 90%;
		height: 70upx;
		/* background: #EFA909; */
		line-height: 70upx;
		text-align: center;
		/* margin-right: 40upx; */
		font-size: 26upx;

		display: flex; -webkit-dispaly:flex;
		flex-direction: row; -webkit-flex-direction: row; 
		justify-content: center; -webkit-justify-content: center;
		align-items: center; -webkit-align-items: center;
	}

	.header .previous .periods .periods_text {
		width: 25%;
		height: 100%;
	}

	.header .previous .periods .periods_text .title {
		color: #FFFFFF;
	}


	.header .previous .periods .periods_result {
		width: 60%;
		height: 100%;
		color: #FFFFFF;
		display: flex; -webkit-dispaly:flex;
		flex-direction: row; -webkit-flex-direction: row; 
		justify-content: center; -webkit-justify-content: center;
		align-items: center; -webkit-align-items: center;
	}

	.header .previous .periods .periods_result .item {
		width: 46upx;
		height: 46upx;
		line-height: 46upx;
		color: #FFFFFF;
	}

	.header .previous .periods .periods_result .one,
	.two,
	.three,
	.result,
	.result_type {
		border-radius: 25upx;
		margin: 0upx 10upx;
	}

	.header .previous .periods .periods_result .one {
		background: #e03c37;
	}

	.header .previous .periods .periods_result .two {
		background: #4093e3;
	}

	.header .previous .periods .periods_result .three {
		background: #3ddd44;
	}

	.header .previous .periods .periods_result .result {
		background: #f58e26;
	}

	.header .previous .periods .periods_result .result_type {
		background: #b83dba;
	}

	.header .previous .periods .periods_result .result_type {
		margin-left: 10upx;
	}

	.header .previous .periods .periods_result .plus {
		width: 30upx;
		height: 46upx;
		line-height: 46upx;
		font-weight: 600;
	}

	.header .previous .arrow_bg {
		width: 60upx;
		height: 70upx;
		line-height: 70upx;
		background: rgb(0,0,0, 0.8);
		margin-right: 20upx;
		display: flex; -webkit-dispaly:flex;
		flex-direction: row; -webkit-flex-direction: row; 
		justify-content: center; -webkit-justify-content: center;
		align-items: center; -webkit-align-items: center;
	}

	.header .previous .arrow_bg .right-arrow {
		width: 20upx;
		height: 20upx;
		line-height: 70upx;
		/* background: red; */
		border-top: 3upx solid #ccc;
		border-right: 3upx solid #ccc;
		transform: rotate(45deg);
		/* margin-left: 65upx; */
	}


	/* 历史记录 */

	.header .history {
		width: 100%;
		background-color: rgba(28, 24, 24, 0.8);
		/* position: fixed; */
		/* top: 265upx; */
		display: flex; -webkit-dispaly:flex;
		flex-direction: column; -webkit-flex-direction: column;
		justify-content: center; -webkit-justify-content: center;
		align-items: center; -webkit-align-items: center;
	}


	.header .history .header_line {
		width: 100%;
		height: 40upx;
		line-height: 40upx;
		margin-top: 15upx;
		margin-bottom: 15upx;
		display: flex; -webkit-dispaly:flex;
		flex-direction: row; -webkit-flex-direction: row; 
		justify-content: center; -webkit-justify-content: center;
		align-items: center; -webkit-align-items: center;
	}

	.header .history .header_line .left_line {
		width: 35%;
		height: 3upx;
		background: #CCC;
		line-height: 80upx;
	}

	.header .history .header_line .title {
		width: 20%;
		height: 80upx;
		text-align: center;
		line-height: 80upx;
		font-size: 28upx;
	}

	.header .history .header_line .right_line {
		width: 35%;
		height: 3upx;
		background: #CCC;
		line-height: 80upx;
	}

	.header .history .award_list {
		width: 100%;
		margin-top: 5upx;
		display: flex; -webkit-dispaly:flex;
		flex-direction: column; -webkit-flex-direction: column;
		justify-content: center; -webkit-justify-content: center;
		align-items: center; -webkit-align-items: center;
	}

	.header .history .award_list .menu {
		width: 100%;
		height: 45upx;
		line-height: 45upx;
		display: flex; -webkit-dispaly:flex;
		flex-direction: row; -webkit-flex-direction: row; 
		justify-content: space-between;
		align-items: center; -webkit-align-items: center;

		font-size: 28upx;
	}

	.header .history .award_list .menu .title {
		width: 20%;
		height: 100%;
		text-align: center;
		font-size: 25upx;
		border-top: 2upx solid #ccc;
		border-right: 2upx solid #ccc;
		font-weight: 600;
	}

	.header .history .award_list .menu .periods {
		width: 20%;
		height: 100%;
	}

	.header .history .award_list .menu .award {
		width: 35%;
		height: 100%;
	}

	.header .history .award_list .menu .extremum {
		width: 12%;
		height: 100%;
	}

	.header .history .award_list .menu .dragon_tiger_balm {
		width: 17.5%;
		height: 100%;
	}

	.header .history .award_list .menu .dragon_tiger_pairs {
		width: 17.5%;
		height: 100%;
	}


	.header .history .award_list .list {
		width: 100%;
		height: 100%;
		display: flex; -webkit-dispaly:flex;
		flex-direction: column; -webkit-flex-direction: column;
		justify-content: center; -webkit-justify-content: center;
		align-items: center; -webkit-align-items: center;
		margin-top: 5upx;
		font-size: 25upx;
	}

	.header .history .award_list .list .item {
		width: 100%;
		height: 55upx;
		/* background: #CC7AFF; */
		text-align: center;
		display: flex; -webkit-dispaly:flex;
		flex-direction: row; -webkit-flex-direction: row; 
		justify-content: center; -webkit-justify-content: center;
		align-items: center; -webkit-align-items: center;
		line-height: 55upx;
		border-bottom: 2upx solid #ccc;
		/* margin-top: 5upx; */
	}

	.header .history .award_list .list .item:first-child {
		border-top: 2upx solid #ccc;
	}


	.header .history .award_list .list .item .title {
		width: 20%;
		height: 100%;
		text-align: center;
		border-right: 2upx solid #ccc;
	}


	.header .history .award_list .list .item .periods {
		width: 20%;
		height: 100%;
	}

	.header .history .award_list .list .item .award {
		width: 35%;
		height: 100%;
	}

	.header .history .award_list .list .item .extremum {
		width: 12%;
		height: 100%;
	}

	.header .history .award_list .list .item .dragon_tiger_balm {
		width: 17.5%;
		height: 100%;
	}

	.header .history .award_list .list .item .dragon_tiger_pairs {
		width: 17.5%;
		height: 100%;
	}


	/* 聊天区域内容 */
	.container .content {
		width: 100%;
		/* height: 100%; */
		margin-top: 110upx;
		margin-bottom: 80upx;
		/* position: fixed; */
		/* top: 100upx; */
		/* bottom: 150upx; */
		/* overflow: auto; */
		overflow: auto;


		/* background: #925716; */

		display: flex; -webkit-dispaly:flex;
		flex-direction: column; -webkit-flex-direction: column;
		justify-content: center; -webkit-justify-content: center;
		align-items: center; -webkit-align-items: center;

	}

	.container .content .item {
		width: 100%;
		/* height: 120upx; */
		padding: 10upx 0upx;
		display: flex; -webkit-dispaly:flex;
		flex-direction: column; -webkit-flex-direction: column;
		justify-content: center; -webkit-justify-content: center;
		align-items: center; -webkit-align-items: center;
		margin-top: 52upx;
	}
	
	
	.container .content .item:first-child {
		margin-top: 80upx;
	}

	.container .content .item:last-child {
		margin-bottom: 50upx;
	}

	.container .content .item .date_time {
		width: 50%;
		color: #FFFFFF;
		font-size: 20upx;
		/* background: #42B035; */

		/* margin-top: 52upx; */
	}

	.container .content .item .msg_content {
		width: 100%;
		
		/* height: 100upx; */
		/* padding: 5upx 0upx; */
		display: flex; -webkit-dispaly:flex;
		flex-direction: row; -webkit-flex-direction: row; 
		justify-content: flex-start;
		/* background: #0000FF; */
		margin-top: 10upx;

		color: #FFFFFF;

		position: relative;
	}




	.container .content .item .msg_content .user {
		width: 15%;
		height: 100upx;
		display: flex; -webkit-dispaly:flex;
		flex-direction: column; -webkit-flex-direction: column;
		justify-content: center; -webkit-justify-content: center;
		align-items: center; -webkit-align-items: center;

		/* background: #420F02; */
	}



	.container .content .item .msg_content .user .avatar {
		width: 70upx;
		height: 70upx;
		border-radius: 50upx;
	}

	.container .content .item .msg_content .user .username {
		font-size: 20upx;
	}


	.container .content .item .msg_content .msg:before {
		position: absolute;
		content: "";
		top: 40upx;
		left: 115upx;
		border-top: 8upx solid transparent;
		border-bottom: 25upx solid transparent;
		border-right: 20upx solid #877242;
	}

	.container .content .item .msg_content .msg {
		width: 70%;
		/* min-width: 75%; */
		height: 100%;
		min-height: 120upx;
		/* background: #289063; */
		/* line-height: 100upx; */
		font-size: 30upx;
		margin-left: 20upx;
		padding-left: 20upx;
		border-radius: 25upx;
		
		display: flex; -webkit-dispaly:flex;
		flex-direction: column; -webkit-flex-direction: column;
		justify-content: center; -webkit-justify-content: center;
		align-items: flex-start;
	}

	.container .content .item .msg_content .even {
		background: url(/static/img/roomvipbg1-icon.png) no-repeat center bottom #2c89c3;
		background-size: 400upx auto;
		background-position: 78% 60%;
	}

	.container .content .item .msg_content .even:before {
		border-right-color: #2c89c3;
	}

	.container .content .item .msg_content .odd {
		background: url(/static/img/roomvipbg1-icon.png) no-repeat center bottom #877242;
		background-size: 400upx auto;
		background-position: 78% 60%;
	}


	.container .content .item .msg_content .odd:before {
		border-right-color: #877242;
	}


	.container .content .item .msg_content .msg {
		/* width: 80%; */
		/* height: 150%; */
		/* min-height: 120upx; */
		/* line-height: 60upx; */
		/* font-size: 27upx; */
		/* background: red; */
	}


	.container .content .item .msg_content .msg .msg_periods {
		width: 100%;
		height: 40upx;
		line-height: 40upx;
		font-size: 27upx;
		/* margin-top: 50upx; */
		/* background: red; */
		padding-top: 20upx;
	}

	.container .content .item .msg_content .msg .msg_text {
		width: 95%;
		/* height: 40upx; */
		/* min-height: 110upx; */
		line-height: 40upx;
		font-size: 27upx;
		word-wrap: break-word;
		/* background: pink; */
		/* margin-top: 10upx; */
		padding-bottom: 20upx;
	}



	.container .content .item .sealing {
		width: 80%;
		color: #93908e;
		font-size: 22upx;
		text-align: center;

		background: #302f2e;
		
		border-radius: 10upx;
		padding: 5upx 5upx;

		margin-top: 50upx;
		margin-bottom: 50upx;
	}

	.container .content .item .open_result {
		width: 60%;
		height: 40upx;
		line-height: 40upx;
		color: #93908e;
		font-size: 21upx;
		text-align: center;
		background: #302f2e;
		margin-top: -50upx;
	}

	.container .content .item .open_quotation {
		width: 80%;
		color: #FFFFFF;
		font-size: 20upx;
		text-align: center;
		background: red;
		margin-bottom: 50upx;
	}

	.container .content .item .other {
		width: 80%;
		color: #FFFFFF;
		font-size: 20upx;
		text-align: center;
		background: red;
		margin-bottom: 50upx;
	}



	/* 四项玩法 样式  start */
	.container .footer .bet .four {
		width: 100%;
		height: 80%;

		/* background: red; */

		display: flex; -webkit-dispaly:flex;
		flex-direction: row; -webkit-flex-direction: row; 
		justify-content: center; -webkit-justify-content: center;
		align-items: center; -webkit-align-items: center;
		flex-wrap: wrap;
	}

	.container .footer .bet .four .four_cell {
		width: 45%;
		height: 45%;
		display: flex; -webkit-dispaly:flex;
		flex-direction: row; -webkit-flex-direction: row; 
		justify-content: center; -webkit-justify-content: center;
		align-items: center; -webkit-align-items: center;
		background: #191816;
		position: relative;

		/* margin-top: 15upx; */
	}



	.container .footer .bet .four .four_cell:nth-child(even) {
		margin-left: 15upx;
	}

	.container .footer .bet .four .four_cell:nth-child(3),
	.four_cell:nth-child(4) {
		margin-top: 15upx;
	}

	.container .footer .bet .four .four_cell .cell_odds {
		width: 0upx;
		height: 0upx;
		border-top: 70upx solid #4693ea;
		border-right: 70upx solid transparent;
		position: absolute;
		top: 0;
		left: 0;
	}

	.container .footer .bet .four .four_cell .cell_odds .desc {
		transform: rotate(-55deg);
		position: absolute;
		top: -65upx;
		left: 5upx;
		font-size: 18upx;
		font-weight: 600;
		color: #FFFFFF;
	}

	.container .footer .bet .four .four_cell .cell_name {
		width: 70upx;
		height: 70upx;
		margin-left: 30upx;

		background: #424141;
		border-radius: 70upx;
		text-align: center;
		line-height: 70upx;
		color: #FFFFFF;
		font-size: 28upx;
	}

	.container .footer .bet .four .four_cell .cell_money {
		width: 180upx;
		height: 70upx;
		margin-left: 10upx;
		background: #CCCACC;
		border-radius: 10upx;
	}

	/* 	.container .footer .bet .four .four_cell .cell_money >*{
		background: red;
	} */

	/* 四项玩法 样式结束 */







	/* 组合玩法 样式  start */
	.container .footer .bet .group {
		width: 100%;
		height: 80%;

		/* background: red; */

		display: flex; -webkit-dispaly:flex;
		flex-direction: row; -webkit-flex-direction: row; 
		justify-content: center; -webkit-justify-content: center;
		align-items: center; -webkit-align-items: center;
		flex-wrap: wrap;
	}

	.container .footer .bet .group .group_cell {
		width: 45%;
		height: 45%;
		display: flex; -webkit-dispaly:flex;
		flex-direction: row; -webkit-flex-direction: row; 
		justify-content: center; -webkit-justify-content: center;
		align-items: center; -webkit-align-items: center;
		background: #191816;
		position: relative;

		/* margin-top: 15upx; */
	}



	.container .footer .bet .group .group_cell:nth-child(even) {
		margin-left: 15upx;
	}

	.container .footer .bet .group .group_cell:nth-child(3),
	.group_cell:nth-child(4) {
		margin-top: 15upx;
	}

	.container .footer .bet .group .group_cell .cell_odds {
		width: 0upx;
		height: 0upx;
		border-top: 70upx solid #4693ea;
		border-right: 70upx solid transparent;
		position: absolute;
		top: 0;
		left: 0;
	}

	.container .footer .bet .group .group_cell .cell_odds .desc {
		transform: rotate(-55deg);
		position: absolute;
		top: -60upx;
		left: 0upx;
		font-size: 18upx;
		font-weight: 600;
		color: #FFFFFF;
	}

	.container .footer .bet .group .group_cell .cell_name {
		width: 70upx;
		height: 70upx;
		margin-left: 30upx;

		background: #424141;
		border-radius: 70upx;
		text-align: center;
		line-height: 70upx;
		color: #FFFFFF;
		font-size: 28upx;
	}

	.container .footer .bet .group .group_cell .cell_money {
		width: 180upx;
		height: 70upx;
		margin-left: 10upx;
		background: #CCCACC;
		border-radius: 10upx;
	}

	/* 	.container .footer .bet .four .group_cell .cell_money >*{
		background: red;
	} */

	/* 组合玩法 样式结束 */








	/* 数字玩法 样式  start */
	.container .footer .bet .number {
		width: 100%;
		height: 80%;

		/* background: red; */

		display: flex; -webkit-dispaly:flex;
		flex-direction: row; -webkit-flex-direction: row; 
		justify-content: center; -webkit-justify-content: center;
		align-items: center; -webkit-align-items: center;
		flex-wrap: wrap;
	}

	.container .footer .bet .number .number_cell {
		width: 45%;
		height: 45%;
		display: flex; -webkit-dispaly:flex;
		flex-direction: row; -webkit-flex-direction: row; 
		justify-content: center; -webkit-justify-content: center;
		align-items: center; -webkit-align-items: center;
		background: #191816;
		position: relative;

		/* margin-top: 15upx; */
	}



	.container .footer .bet .number .number_cell:nth-child(even) {
		margin-left: 15upx;
	}

	.container .footer .bet .number .number_cell:nth-child(3),
	.number_cell:nth-child(4) {
		margin-top: 25upx;
	}

	.container .footer .bet .number .number_cell .cell_odds {
		width: 0upx;
		height: 0upx;
		border-top: 70upx solid #4693ea;
		border-right: 70upx solid transparent;
		position: absolute;
		top: 0;
		left: 0;
	}

	.container .footer .bet .number .number_cell .cell_odds .desc {
		transform: rotate(-55deg);
		position: absolute;
		top: -60upx;
		left: 0upx;
		font-size: 18upx;
		font-weight: 600;
		color: #FFFFFF;
	}

	.container .footer .bet .number .number_cell .cell_name {
		width: 70upx;
		height: 70upx;
		margin-left: 30upx;

		background: #424141;
		border-radius: 70upx;
		text-align: center;
		line-height: 70upx;
		color: #FFFFFF;
		font-size: 28upx;
	}

	.container .footer .bet .number .number_cell .cell_money {
		width: 180upx;
		height: 70upx;
		margin-left: 10upx;
		background: #CCCACC;
		border-radius: 10upx;
	}

	/* 数字玩法 样式结束 */





	/* 极值玩法 样式  start */
	.container .footer .bet .extremum {
		width: 100%;
		height: 80%;

		/* background: red; */

		display: flex; -webkit-dispaly:flex;
		flex-direction: row; -webkit-flex-direction: row; 
		justify-content: center; -webkit-justify-content: center;
		align-items: center; -webkit-align-items: center;
		flex-wrap: wrap;
	}

	.container .footer .bet .extremum .extremum_cell {
		width: 45%;
		height: 45%;
		display: flex; -webkit-dispaly:flex;
		flex-direction: row; -webkit-flex-direction: row; 
		justify-content: center; -webkit-justify-content: center;
		align-items: center; -webkit-align-items: center;
		background: #191816;
		position: relative;

		/* margin-top: 15upx; */
	}



	.container .footer .bet .extremum .extremum_cell:nth-child(even) {
		margin-left: 15upx;
	}

	.container .footer .bet .extremum .extremum_cell:nth-child(3),
	.extremum_cell:nth-child(4) {
		margin-top: 25upx;
	}

	.container .footer .bet .extremum .extremum_cell .cell_odds {
		width: 0upx;
		height: 0upx;
		border-top: 70upx solid #4693ea;
		border-right: 70upx solid transparent;
		position: absolute;
		top: 0;
		left: 0;
	}

	.container .footer .bet .extremum .extremum_cell .cell_odds .desc {
		transform: rotate(-55deg);
		position: absolute;
		top: -60upx;
		left: 0upx;
		font-size: 18upx;
		font-weight: 600;
		color: #FFFFFF;
	}

	.container .footer .bet .extremum .extremum_cell .cell_name {
		width: 70upx;
		height: 70upx;
		margin-left: 30upx;

		background: #424141;
		border-radius: 70upx;
		text-align: center;
		line-height: 70upx;
		color: #FFFFFF;
		font-size: 28upx;
	}

	.container .footer .bet .extremum .extremum_cell .cell_money {
		width: 180upx;
		height: 70upx;
		margin-left: 10upx;
		background: #CCCACC;
		border-radius: 10upx;
	}

	/* 极值玩法 样式结束 */





	/* 龙虎豹玩法 样式  start */
	.container .footer .bet .dragon_tiger_balm {
		width: 100%;
		height: 80%;

		/* background: red; */

		display: flex; -webkit-dispaly:flex;
		flex-direction: row; -webkit-flex-direction: row; 
		justify-content: center; -webkit-justify-content: center;
		align-items: center; -webkit-align-items: center;
		flex-wrap: wrap;
	}

	.container .footer .bet .dragon_tiger_balm .dragon_tiger_balm_cell {
		width: 45%;
		height: 40%;
		display: flex; -webkit-dispaly:flex;
		flex-direction: row; -webkit-flex-direction: row; 
		justify-content: center; -webkit-justify-content: center;
		align-items: center; -webkit-align-items: center;
		background: #191816;
		position: relative;

		/* margin-top: 15upx; */
	}



	.container .footer .bet .dragon_tiger_balm .dragon_tiger_balm_cell:nth-child(even) {
		margin-left: 15upx;
	}

	.container .footer .bet .dragon_tiger_balm .dragon_tiger_balm_cell:nth-child(3),
	.extremum_cell:nth-child(4) {
		margin-top: 25upx;
	}

	.container .footer .bet .dragon_tiger_balm .dragon_tiger_balm_cell .cell_odds {
		width: 0upx;
		height: 0upx;
		border-top: 70upx solid #4693ea;
		border-right: 70upx solid transparent;
		position: absolute;
		top: 0;
		left: 0;
	}

	.container .footer .bet .dragon_tiger_balm .dragon_tiger_balm_cell .cell_odds .desc {
		transform: rotate(-55deg);
		position: absolute;
		top: -60upx;
		left: 0upx;
		font-size: 18upx;
		font-weight: 600;
		color: #FFFFFF;
	}

	.container .footer .bet .dragon_tiger_balm .dragon_tiger_balm_cell .cell_name {
		width: 70upx;
		height: 70upx;
		margin-left: 30upx;

		background: #424141;
		border-radius: 70upx;
		text-align: center;
		line-height: 70upx;
		color: #FFFFFF;
		font-size: 28upx;
	}

	.container .footer .bet .dragon_tiger_balm .dragon_tiger_balm_cell .cell_money {
		width: 180upx;
		height: 70upx;
		margin-left: 10upx;
		background: #CCCACC;
		border-radius: 10upx;
	}

	/* 龙虎豹玩法 样式结束 */







	/* 尾部内容 */
	.footer {
		width: 100%;
		height: 540upx;
		position: fixed;
		bottom: 0upx;
		z-index: 99999;

		display: flex; -webkit-dispaly:flex;
		flex-direction: column; -webkit-flex-direction: column;
		justify-content: center; -webkit-justify-content: center;

		align-items: center; -webkit-align-items: center;

		/* background: red; */
		/* opacity: 0.7; */

		/* position: fixed; */
		background-color: rgba(28, 24, 24, 0.8);

		color: #eaca6c;

	}


	.footer .menu {
		width: 97%;
		height: 100upx;
		/* background: #007AFF; */

		display: flex; -webkit-dispaly:flex;
		flex-direction: row; -webkit-flex-direction: row; 
		justify-content: space-between; -webkt-justify-content: space-between;
		align-items: center; -webkit-align-items: center;

		text-align: center;

		position: absolute;
		top: 0;

		color: #FFFFFF;
		font-size: 28upx;

	}

	.footer .menu .item {
		width: 17%;
		height: 60upx;
		line-height: 60upx;
		text-align: center;
		border-radius: 15upx;
		background: #424141;
	}

	.footer .menu .active {
		background: #e8850f;
	}

	.footer .bet {
		width: 97%;
		height: 340upx;
		position: absolute;
		top: 10;
		/* bottom: 60; */
		/* margin-top: 200upx; */
		/* margin-bottom: 200upx; */
		/* background: pink; */
		overflow: scroll;
		font-size: 30upx;
	}

	.footer .bet_btn {
		width: 100%;
		height: 100upx;

		background: #191816;

		position: fixed;
		bottom: 0;

		display: flex; -webkit-dispaly:flex;
		flex-direction: row; -webkit-flex-direction: row; 
		justify-content: space-between; -webkit-justify-content: space-between;
		align-items: center; -webkit-align-items: center;

		font-size: 30upx;

		padding: 8upx 0upx;
	}


	.footer .bet_btn .money_balance {
		width: 20%;
		height: 100upx;
		line-height: 100upx;
		border-radius: 15upx;
	}

	.footer .bet_btn .money_balance {
		width: 50%;
		height: 100upx;
		line-height: 50upx;
		/* background: #289063; */
		/* display: table-cell; */
		/* vertical-align:middle; */
		/* text-align:center; */

		font-size: 28upx;
		margin-left: 20upx;
	}

	.footer .bet_btn .money_balance .money>.title {
		color: #FFFFFF;
		margin-left: 15upx;
	}

	.footer .bet_btn .money_balance .balance>.title {
		color: #FFFFFF;
		margin-left: 15upx;
	}

	.footer .bet_btn .sub_btn {
		width: 174upx;
		height: 82upx;
		/* background: #e8850f; */
		background: #424141;
		border-radius: 10upx;
		text-align: center;
		line-height: 82upx;
		font-size: 30upx;
		margin-right: 20upx;
		color: #FFFFFF;
	}




	.container .send {
		width: 100%;
		height: 100upx;
		line-height: 100upx;
		text-align: center;
		color: #FFFFFF;
		background: #E8850F;
		position: fixed;
		bottom: 0;

		border-top-left-radius: 5upx;
		border-top-right-radius: 5upx;
	}
</style>
