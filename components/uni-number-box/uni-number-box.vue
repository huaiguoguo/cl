<template>
	<view class="uni-numbox">
		<view class="uni-numbox__minus" :style="'background:'+subtract_background" :class="{'uni-numbox--disabled': disableSubtract||disabled}" @click="_calcValue('subtract')">-</view>
		<input class="uni-numbox__value" type="number" :disabled="disabled" :value="inputValue" @blur="_onBlur">
		<view class="uni-numbox__plus" :style="'background:'+add_background" :class="{'uni-numbox--disabled': disableAdd||disabled}" @click="_calcValue('add')">+</view>
	</view>
</template>
<script>
	export default {
		name: 'uni-number-box',
		props: {
			value: {
				type: Number,
				default: 0
			},
			min: {
				type: Number,
				default: 0
			},
			max: {
				type: Number,
				default: 2000
			},
			step: {
				type: Number,
				default: 1
			},
			disabled: {
				type: Boolean,
				default: false
			},
			type: { //哪种玩法
				type: Number,
				default: 0
			},
			index: { //点哪种玩法的哪个项
				type: Number,
				default: 0
			},
			odd: { //倍率
				type: Number,
				default: 0
			},
			numer_arr: {
				type: Array,
				default: null	
			}
		},
		data() {
			return {
				inputValue: this.value,
				subtract_background: '#424141',
				add_background: '#e8850f',
			}
		},
		computed: {
			disableSubtract() {
				return this.inputValue <= this.min
			},
			disableAdd() {
				return this.inputValue >= this.max
			}
		},
		watch: {
			value(val) {
				this.inputValue = val;
			},
			inputValue(val) {
				if (val>0) {
					this.subtract_background = '#e8850f';
					// this.add_background = '#e8850f';
				} else {
					this.subtract_background = '#424141';
					// this.add_background = '#e8850f';
				}
				this.$emit('change', {type: this.type, index: this.index, odd: this.odd, money: val});
			}
		},
		methods: {			
// 			game_number() {
// 				let bet = {
// 					number: this.index,
// 					odd: this.odd,
// 					money: this.inputValue
// 				};
// 				let flag;
// 				let number_arr = this.numer_arr;
// 				if (number_arr.length>0) {
// 					for (let i = 0; i < number_arr.length; i++) {
// 						// console.log(number_arr[i].number, obj.index);
// 						if(number_arr[i] && number_arr[i].number == this.index){
// 							flag = false;
// 							if(bet.money <= 0){
// 								number_arr.splice(i,1);
// 							}else{
// 								number_arr[i] = bet
// 							}
// 							
// 						}else{
// 							flag = true;
// 						}
// 					}
// 					if(flag && bet.money>0){
// 						number_arr.push(bet);
// 					}
// 				}else{
// 					if(bet.money>0){
// 						number_arr.push(bet);
// 					}
// 				}
// 				this.numer_arr = number_arr;
// 			},
			_calcValue(type) {
				if (this.disabled) {
					return
				}
				
				// this.game_number();
				if(this.type == 3) {
					//
					// if (this.numer_arr.length>5) {
					// 	console.log('===+++++++++++=====');
					// 	console.log(this.numer_arr);
					// 	console.log(this.numer_arr.length);
					// 	console.log(this.type);
					// 	console.log('===+++++++++++=====');
					// 	// console.log(this.numer_arr_length);
					// 	this.toast('数字玩法每期只能选5个');
					// 	return false;	
					// }
				}
				
				const scale = this._getDecimalScale()
				let value = this.inputValue * scale
				let step = this.step * scale
				if (type === 'subtract') {
					value -= step
				} else if (type === 'add') {
					value += step
				}
				if (value < this.min || value > this.max) {
					return
				}
				this.inputValue = value / scale;
			},
			_getDecimalScale() {
				let scale = 1
				// 浮点型
				if (~~this.step !== this.step) {
					scale = Math.pow(10, (this.step + '').split('.')[1].length)
				}
				return scale
			},
			_onBlur(event) {
				let value = event.detail.value
				if (!value) {
					this.inputValue = 0
					return
				}
				value = +value;
				if (value > this.max) {
					value = this.max
				} else if (value < this.min) {
					value = this.min
				}
				this.inputValue = value
			}
		}
	}
</script>
<style lang="scss">
	$numbox-btn-width:70upx;
	$numbox-input-width:80upx;
	$numbox-height:70upx;
	$uni-font-size-xxl:40upx;
	.uni-numbox {
		display: inline-flex;
		flex-direction: row;
		justify-content: flex-start;
		width: 180upx;
		height: $numbox-height;
		position: relative;

		&:after {
			content: '';
			position: absolute;
			transform-origin: center;
			box-sizing: border-box;
			pointer-events: none;
			top: -50%;
			left: -50%;
			right: -50%;
			bottom: -50%;
			border: 1px solid #e8850f;//$uni-border-color;
			border-radius: $uni-border-radius-lg;
			transform: scale(.5);
		}

		&__minus,
		&__plus {
			margin: 0;
			background-color: #e8850f; //$uni-bg-color-b;
			width: 65upx; //$numbox-btn-width;
			font-size: $uni-font-size-xxl;
			height: 100%;
			line-height: $numbox-height;
			text-align: center;
			color: #FFFFFF; //$uni-text-color;
			position: relative;
			
			

		}
		
		&__minus{
			border-top-left-radius: 10upx;
			border-bottom-left-radius: 7upx;
			border-right: #424141;
		}
		
		&__plus{
			border-top-right-radius: 10upx;
			border-bottom-right-radius: 7upx;
			border-right: #424141;
		}

		&__value {
			position: relative;
			background-color: #000000;//$uni-bg-color;
			width: 60upx; //$numbox-input-width;
			height: 100%;
			text-align: center;
			color: #FFFFFF;

			&:after {
				content: '';
				position: absolute;
				transform-origin: center;
				box-sizing: border-box;
				pointer-events: none;
				top: -50%;
				left: -50%;
				right: -50%;
				bottom: -50%;
				border-style: solid;
				border-color: $uni-border-color;
				border-left-width: 0px;
				border-right-width: 0px;
				border-top-width: 0;
				border-bottom-width: 0;
				transform: scale(.5);
			}
		}

		&--disabled {
			color: $uni-text-color-disable;
		}
	}
</style>
