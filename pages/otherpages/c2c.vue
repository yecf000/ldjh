<template>
	<view class="all">
		<navbar :title="$lang('C2C交易')"></navbar>
		<view class="tabs">
			<view class="activetabitem">{{$lang("快捷交易")}}</view>
			<view class="tabitem" @click="$u.route('/pages/otherpages/storelist');">{{$lang("商户列表")}}</view>
		</view>
		<view v-show="pageindex==1" class="pageone">
			<view class="accont">
				<view class="title"> C2C {{$lang("快捷交易")}}</br> {{$lang("使用")}} RUB {{mode==1?$lang('购买'):$lang('售出')}}
					{{$lang("金矿")}} </view>
				<view class="tips"> {{$lang("快捷交易为您自动匹配当前")}} C2C {{$lang("市场")}}{{mode==1?$lang('购买'):$lang('售出')}}
					{{$lang("金矿")}} {{$lang("最优价格的商家")}} </view>
			</view>
			<view class="shadowbox">
				<view class="box">
					<view class="taps">
						<view @click="mode=1,changemode()" :class="mode==1?'active':''" class="buy">{{$lang("购买")}}
						</view>
						<view @click="mode=2,changemode()" :class="mode==2?'active':''" class="sell">{{$lang("出售")}}
						</view>
					</view>
					<view class="inputerbox">
						<view class="inputer" :style="{border:activeinput1?'1px solid #fff':''}">
							<view class="pay">
								<view class="paytxt">{{$lang("我要支付")}}</view> <u-input @input='computegold'
									@focus='activeinput1=true' @blur='activeinput1=false' type='number'
									placeholder="0.00" height='40' v-model="pay" :custom-style='diystyle' />
							</view>
							<view class="btn" v-if='mode==1'>
								<image src="@/static/icons/rub.png" mode="aspectFill"></image> RUB
							</view>
							<view class="btn" v-if='mode==2'>
								<image src="@/static/icons/gold.png" mode="aspectFit"></image> {{$lang("金矿")}}
							</view>
						</view>
					</view>
					<view class="xtips" v-if="mode==2">{{$lang("可用余额")}} 1000</view>
					<view class="inputerbox">
						<view class="inputer" :style="{border:activeinput2?'1px solid #fff':''}">
							<view class="pay">
								<view class="paytxt">{{$lang("我将收到")}}≈</view> <u-input @input="computegoldmoney"
									@focus='activeinput2=true' @blur='activeinput2=false' type='number'
									placeholder="0.00" height='40' v-model="get" :custom-style='diystyle' />
							</view>
							<view class="btn" v-if='mode==1'>
								<image src="@/static/icons/gold.png" mode="aspectFit"></image> {{$lang("金矿")}}
							</view>
							<view class="btn" v-if='mode==2'>
								<image src="@/static/icons/rub.png" mode="aspectFill"></image> RUB
							</view>
						</view>
					</view>
					<view class="btbtnbox"> <u-button @click="pageindex=2" :hair-line='false' ripple
							:custom-style='btstyle'>{{$lang("选择")}}{{mode==1?$lang('付款'):$lang('收款')}}{{$lang("方式")}}</u-button>
					</view>
				</view>
			</view>
		</view>
		<view v-show="pageindex==2" class="pagetwo">
			<view class="bread">
				<view @click="pageindex=1">{{$lang("快捷交易")}}</view>
				<view class="step">></view>
				<view class="in">{{$lang("选择")}}{{mode==1?$lang('购买'):$lang('收款')}}{{$lang("方式")}}</view>
			</view>
			<view class="title"> {{mode==1?$lang('购买'):$lang('售出')}}{{$lang("金矿")}} </view>
			<view class="paywaysbox">
				<view class="paywayitem" @click="payways=1" :style="{border:payways==1?'1px solid #fff':''}">
					<view class="leftpart">
						<view>{{"Система быстрых платежей"}}</view>
						<view class="txt2">{{$lang("预计单价")}} <span>{{bili.toFixed(2)}} RUB</span></view>
					</view>
					<image v-if="payways==1" src="@/static/icons/confirm.png" mode="aspectFill"></image>
				</view>
				<!-- <view class="paywayitem" @click="payways=2" :style="{border:payways==2?'1px solid #fff':''}">
					<view class="leftpart">
						<view>{{$lang("支付方式")}}</view>
						<view class="txt2">{{$lang("预计单价")}} <span>3.6 CNY</span></view>
					</view>
					<image v-if="payways==2" src="@/static/icons/confirm.png" mode="aspectFill"></image>
				</view> -->
			</view>
			<view class="ineed">
				<view class="line1">
					<view>{{$lang("我需要支付")}}</view>
					<view class="cny">1000 {{mode==1?'RUB':$lang('金矿')}}</view>
				</view>
				<view class="gold">≈ {{mode==1?((1000/3.6).toFixed(2)):(1000*3.6).toFixed(2)}}
					{{mode==1?$lang('金矿'):'RUB'}}</view>
			</view>
			<view class="btbtnbox" style="padding: 0;margin-top: 48rpx;"> <u-button :hair-line='false' ripple
					:custom-style='btstyle' @click="sendoreder">{{$lang("确认")}}</u-button> </view>
		</view>
	</view>
</template>
<script>
	import navbar from '@/components/navbar.vue'
	export default {
		components: {
			navbar
		},
		data() {
			return {
				payways: 1,
				pageindex: 1,
				btstyle: {
					border: 'none',
					borderRadius: '100rpx',
					color: '#000',
					background: '#fff'
				},
				activeinput1: false,
				activeinput2: false,
				diystyle: {
					fontSize: '24rpx',
					color: '#fff',
					fontWeight: '700'
				},
				pay: '',
				get: '',
				mode: 1,
				bili: 2,
				options:{
					
				}
			}
		},
		onLoad() {
			this.getoption()
		},
		methods: {
			getoption(){
				this.$reqGet('gameConfig').then(res=>{
					this.options = res.data.data
					this.bili = 1/res.data.data.exchange_rate
				}).catch(err=>{
				})
			},
			changemode() {
				let keep = ''
				keep = JSON.parse(JSON.stringify(this.get))
				this.get = this.pay
				this.pay = keep
			},
			computegold(e) {
				if (e) {
					this.get = this.mode == 1 ? Number(e / this.bili).toFixed(2) : (e * this.bili).toFixed(2)
				}else{
					this.get = ''
				}
			},
			computegoldmoney(e) {
				if (e) {
					this.pay = this.mode == 1 ? Number(e / this.bili).toFixed(2) : (e * this.bili).toFixed(2)
				}else{
					this.pay = ''
				}
			},


			sendoreder() {
				this.$reqPost('fastAdd', {
					amount: this.pay,
					type: this.mode == 1 ? 0 : 1
				}).then(res => {
					console.log(res)
					uni.navigateTo({
						url: `/pages/otherpages/impage?cid=${res.data.data.chat_id}&ruid=${res.data.data.user_id}`
					})
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.pagetwo {
		padding: 0 24rpx;

		.ineed {
			margin-top: 24rpx;

			.line1 {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.cny {
					font-size: 24rpx;
				}

			}

			.gold {
				color: #a9aeb1;
				margin-top: 12rpx;
				font-size: 24rpx;
				display: flex;
				justify-content: flex-end;
			}
		}

		.paywaysbox {
			margin-top: 24rpx;

			.paywayitem {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 100%;
				padding: 24rpx;
				border: 1px solid #28282a;
				border-radius: 16rpx;
				margin-bottom: 24rpx;

				image {
					width: 32rpx;
					height: 32rpx;
					border-radius: 50%;
				}

				.leftpart {
					.txt2 {
						color: #939497;
						font-size: 24rpx;
						margin-top: 12rpx;

						span {
							color: #fff;
							margin-left: 12rpx;
						}
					}
				}
			}
		}

		.title {
			margin-top: 48rpx;
			font-size: 42rpx;
		}
	}

	.bread {
		font-size: 24rpx;
		margin-top: 24rpx;
		height: 66rpx;
		display: flex;
		align-items: center;
		color: #c7c9cd;

		.in {
			color: #fff;
			font-weight: 700;
		}

		.step {
			margin: 0 24rpx;
		}
	}

	.tabs {
		height: 88rpx;
		// background-color: #5a595f;
		padding: 0 24rpx;
		display: flex;
		box-shadow: 0 4rpx 8rpx 0 rgba(255, 255, 255, .1);

		.tabitem {
			height: 100%;
			display: flex;
			align-items: center;
			padding: 0 18rpx;
			border-bottom: 4rpx solid #000;
			color: #c7c9cd;
		}

		.activetabitem {
			color: #fff;
			height: 100%;
			display: flex;
			align-items: center;
			padding: 0 12rpx;
			border-bottom: 4rpx solid #fff;
			font-weight: bold;
		}
	}

	.btbtnbox {
		margin: 24rpx 0;
		padding: 0 24rpx 24rpx 24rpx;
	}

	.xtips {
		font-size: 24rpx;
		margin-left: 24rpx;
		margin-top: 16rpx;
		color: #8e8e8e;
	}

	.inputerbox {
		margin-top: 32rpx;
		padding: 0 24rpx;
	}

	.inputer {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16rpx;
		border: 1px solid #494a4a;
		border-radius: 24rpx;

		.pay {
			color: #fff;
			font-size: 24rpx;

			.paytxt {
				margin-bottom: 8rpx;
			}
		}

		.btn {
			font-weight: bold;
			background-color: #28282a;
			display: flex;
			align-items: center;
			padding: 8rpx 12rpx;
			border-radius: 12rpx;

			image {
				width: 44rpx;
				height: 44rpx;
				margin-right: 12rpx;
				border-radius: 50%;
			}

		}
	}

	.shadowbox {
		margin-top: 48rpx;
		padding: 0 48rpx;

		.box {
			// border: 1px solid #5a595f;
			background-color: #000;
			border-radius: 32rpx;
			box-shadow: 0 4rpx 40rpx 0 rgba(255, 255, 255, .2),
				0 28rpx 128rpx 0 rgba(255, 255, 255, .1);

			.taps {
				height: 100rpx;
				display: flex;
				align-items: center;
				color: #5a595f;

				.active {
					font-weight: bold;
					color: #fff;
					background-color: #000 !important;
				}

				.buy {
					width: 50%;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					background-color: #171719;
					border-radius: 32rpx 0 0 0;
				}

				.sell {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 50%;
					height: 100%;
					background-color: #171719;
					border-radius: 0 32rpx 0 0;
				}
			}
		}
	}

	.accont {
		padding-top: 80rpx;

		.title {
			text-align: center;
			font-size: 48rpx;
			font-weight: 700;
		}

		.tips {
			margin-top: 24rpx;
			line-height: 40rpx;
			padding: 0 48rpx;
			text-align: center;
		}
	}
</style>