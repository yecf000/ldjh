<template>
	<view class="all">
		<navbar :title="$lang('用户等级')"></navbar>
		<view class="level">
			<view class="title">{{$lang('账户等级')}}</view>
			<view class="name">{{nowlevel.level_name||$lang('普通用户')}}</view>
		</view>
		<view class="group">
			<view class="item">
				<view>{{$lang('金矿兑U手续费')}}</view>
				<view class="titemgroup">
					<view class="lgroup">
						<view class="t">
							{{$lang('当前等级')}}
						</view>
						<view class="c">
							{{nowlevel.withdraw_fee_rate?nowlevel.withdraw_fee_rate+'%':'0.00%'}}
						</view>
					</view>
					<view class="rgroup">
						<view class="t">
							{{$lang('下一等级')}}
						</view>
						<view class="c">
							{{nextlevel.withdraw_fee_rate?nextlevel.withdraw_fee_rate+'%':'0.00%'}}
						</view>
					</view>
				</view>
			</view>
			<view class="item">
				<view>{{$lang('平台金矿兑U处理时间')}}</view>
				<view class="titemgroup">
					<view class="lgroup">
						<view class="t">
							{{$lang('当前等级')}}
						</view>
						<view class="c">
							{{'<'}}{{nowlevel.deal_time?Number(nowlevel.deal_time).toFixed(0):'0'}}{{$lang('小时')}}
						</view>
					</view>
					<view class="rgroup">
						<view class="t">
							{{$lang('下一等级')}}
						</view>
						<view class="c">
							{{'<'}}{{nextlevel.deal_time?	Number(nextlevel.deal_time).toFixed(0):'0'}}{{$lang('小时')}}
						</view>
					</view>
				</view>
			</view>
			<view class="item">
				<view>{{$lang('单日最大金矿兑换数')}}</view>
				<view class="titemgroup">
					<view class="lgroup">
						<view class="t">
							{{$lang('当前等级')}}
						</view>
						<view class="c">
							{{nowlevel.day_max_number?$fuc.formatNumber(nowlevel.day_max_number,0):'0'}}
						</view>
					</view>
					<view class="rgroup">
						<view class="t">
							{{$lang('下一等级')}}
						</view>
						<view class="c">
							{{nextlevel.day_max_number?$fuc.formatNumber(nextlevel.day_max_number,0):'0'}}
						</view>
					</view>
				</view>
			</view>
			<view class="item">
				<view>{{$lang('平台单日最大金矿交易订单数')}}</view>
				<view class="titemgroup">
					<view class="lgroup">
						<view class="t">
							{{$lang('当前等级')}}
						</view>
						<view class="c">
							{{nowlevel.day_max_order_amount?Number(nowlevel.day_max_order_amount).toFixed(0):'0'}}
						</view>
					</view>
					<view class="rgroup">
						<view class="t">
							{{$lang('下一等级')}}
						</view>
						<view class="c">
							{{nextlevel.day_max_order_amount?Number(nextlevel.day_max_order_amount).toFixed(0):'0'}}
						</view>
					</view>
				</view>
			</view>
			<view class="item">
				<view>{{$lang('C2C单日最大金矿交易订单数')}}</view>
				<view class="titemgroup">
					<view class="lgroup">
						<view class="t">
							{{$lang('当前等级')}}
						</view>
						<view class="c">
							{{nowlevel.c2c_day_max_order_amount?Number(nowlevel.c2c_day_max_order_amount).toFixed(0):'0'}}
						</view>
					</view>
					<view class="rgroup">
						<view class="t">
							{{$lang('下一等级')}}
						</view>
						<view class="c">
							{{nextlevel.c2c_day_max_order_amount?Number(nextlevel.c2c_day_max_order_amount).toFixed(0):'0'}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="rules">
			<view class="normal">
				<view class="titlegrid">
					{{rule[0].title|| $lang('普通用户')}}
				</view>
				<view class="colum">
					<view class="il">{{$lang('用户等级')}}</view>
					<view class="ir">{{$lang('总流水(金矿)')}}</view>
				</view>
				<view class="ncolum">
					<view class="il">{{$lang('普通用户')}}</view>
					<view class="ir">{{'<'}} {{$fuc.formatNumber(rule[0].up_turnover,0) }}</view>
				</view>
			</view>
			<view class="vip">

			</view>
		</view>

		<view class="rules" style="margin-top: 32rpx;">
			<view class="normal">
				<view class="titlegrid">
					{{$lang('专业用户')}}
				</view>
				<view class="colum">
					<view class="il">{{$lang('用户等级')}}</view>
					<view class="ir">{{$lang('总流水(金矿)')}}</view>
				</view>
				<view class="ncolum btb" v-for="(i,index) in krule" :key="index">
					<view class="il">{{i.title||'vip'}}</view>
					<view class="ir">{{'≥'}} {{i.up_turnover?$fuc.formatNumber(i.up_turnover,0):'100,000'}}</view>
				</view>
			</view>
		</view>
		<view class="about">
			<view class="title">{{$lang('关于用户等级')}}</view>
			<view class="detail">{{level_explanation}}</view>
		</view>
		<zero-loading color='#F0E68C' mask v-if="loading" showText :textColor='$lang("#fff")' :maskOpacity='0.8'></zero-loading>
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
				loading:true,
				level_explanation: '',
				rule: [{title:''}],
				krule:[{title:''}],
				nowlevel:{},
				nextlevel:{}
			}
		},
		onLoad() {
			this.getlevel()
			this.levelInfo()
		},
		methods: {
			getlevel() {
				this.$reqGet('levelConfig').then(res => {
					this.level_explanation = res.data.data.level_explanation
				})
			},
			levelInfo() {
				this.$reqGet('levelInfo').then(res => {
					this.rule = res.data.data.list
					let newArray = res.data.data.list.slice(1);
					this.krule = newArray
					this.nowlevel = res.data.data.now
					this.nextlevel = res.data.data.next
					this.loading=false
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.about {
		margin-top: 48rpx;
		padding: 48rpx;

		.detail {
			margin-top: 24rpx;
			color: #ffffff80;
		}

		.title {
			font-size: 36rpx;
		}
	}

	.btb {
		border-bottom: 1px solid #ffffff20;
	}

	.rules {
		margin-top: 64rpx;
		padding: 0 32rpx;

		.normal {
			border: 1px solid #ffffff20;

			.colum {
				height: 60rpx;
				border-bottom: 1px solid #ffffff20;
				display: flex;
				align-items: center;
				width: 100%;
				font-size: 26rpx;
				color: #b7b8bbff;

				.il {
					width: 40%;
					height: 100%;
					box-shadow: 4rpx 0 1rpx rgba(255, 255, 255, 0.15);
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.ir {
					width: 60%;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}

			.ncolum {
				height: 64rpx;
				display: flex;
				align-items: center;
				width: 100%;
				font-size: 26rpx;

				.il {
					width: 40%;
					height: 100%;
					box-shadow: 4rpx 0 1rpx rgba(255, 255, 255, 0.15);
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.ir {
					width: 60%;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}

			.titlegrid {
				background-color: #1c1c1cff;
				height: 68rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: bold;
				border-bottom: 1px solid #ffffff20;
			}
		}
	}

	.group {
		padding: 0 64rpx;
		margin-top: 48rpx;

		.item {
			border-bottom: 1px solid #ffffff20;
			margin-bottom: 32rpx;

			.titemgroup {
				display: flex;
				align-items: center;
				margin: 32rpx 0;

				.lgroup {
					width: 50%;

					.t {
						font-size: 24rpx;
						color: #ffffff80;
					}

					.c {
						font-size: 32rpx;
						font-weight: bold;
						margin-top: 12rpx;
					}
				}

				.rgroup {
					width: 50%;

					.t {
						font-size: 24rpx;
						color: #ffffff80;
					}

					.c {
						font-size: 32rpx;
						font-weight: bold;
						margin-top: 12rpx;
					}
				}
			}
		}
	}

	.level {
		padding: 32rpx;

		.title {
			font-size: 28rpx;
		}

		.name {
			font-size: 48rpx;
			font-weight: bold;
			margin-top: 12rpx;
		}
	}
</style>