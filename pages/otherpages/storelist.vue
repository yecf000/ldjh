<template>
	<view class="">
		<navbar title="商户列表"></navbar>
		<view class="tabs">
			<view @click="$u.route('/pages/otherpages/c2c')" class="tabitem">快捷交易</view>
			<view class="activetabitem">商户列表</view>
		</view>
		<view class="tabspleace">

		</view>
		<view class="tabs2box">
			<view class="tabs2">
				<u-tabs active-color='#fff' inactive-color='#a3a6a6' bg-color='rgba(0,0,0,0)' :is-scroll='false'
					:list="list" :current="current" @change="change"></u-tabs>
			</view>
		</view>
		<view class="listbox">
			<view class="bullbox" v-if="shops.length==0">
				<image class="null" src="@/static/icons/null.png" mode="aspectFill"></image>
				<view class="nulltxt">
					暂无数据~
				</view>
			</view>
			<view class="item" :style="{border:index+1==shops.length?'none':''}" v-for="(item,index) in shops"
				:key="index">
				<view class="itemtxt1">{{item.store?item.store.title:'未命名商家'}}</view>
				<view class="itemtxt2">{{item.store?item.store.order_count||0:0}} 单
					{{item.store?item.store.success_rate||0:0}}% 成交率
				</view>
				<view class="itemtxt3">{{item.price}} {{item.unit.toUpperCase()}}</view>
				<view class="itemtxt4">剩余数量 <span>{{item.left_amount}} 金矿</span></view>
				<view class="itemtxt5">限额
					<span>{{(item.min_amount*item.price).toFixed(2)}}-{{(item.max_amount*item.price).toFixed(2)}}
						{{item.unit.toUpperCase()}}</span>
				</view>
				<view class="itemtxt6">
					<view class="payways">
						<view class="ali">
							<view class="dec">
							</view>
							{{item.deal_way}}
						</view>
						<!-- <view class="wechat">
							<view class="dec">
							</view>
							微信
						</view> -->
					</view>
					<view class="buybtn" @click="tradeready(item)">{{current==1?'出售':'购买'}}</view>
				</view>
			</view>
		</view>
		
		<u-popup v-model="showbuyready" mode="bottom" border-radius="18">
			<view class="popup">
				<view class="popupnav">
					<view>
						<view class="title">购买金矿</view>
						<view class="uni">单价 ¥{{popinfo.price}}</view>
					</view>
					<u-icon @click="showbuyready=false" name="close" color="#0e0e0d" size="28"></u-icon>
				</view>
				<view class="tradebox">
					<view class="inputer">
						<u-input :placeholder="'0.00 '+ popinfo.unit" :custom-style="{fontSize:'60rpx'}" type='number'
							v-model="buytradenum" />
					</view>
					<view class="limit">
						限额 {{$fuc.formatNumber(popinfo.min_amount)}} - {{$fuc.formatNumber(popinfo.max_amount)}} {{popinfo.unit}}
					</view>
					<view class="couldget">
						可得 <span>{{buytradenum?(buytradenum/popinfo.price).toFixed(2):'0.00'}} 金矿</span>
					</view>
				</view>
				<view class="tradebox">
					<view class="paytitle">支付方式</view>
					<view class="payname">
						<view>支付宝</view>
						<view class="type">即时付款</view>
					</view>
				</view>
				<view class="storeinfo">
					<view class="title">
						商家信息
					</view>
					<view class="infoitem">
						<view class="itemlpart">商家昵称</view>
						<view class="itemrpart">kk商行</view>
					</view>
					<view class="infoitem">
						<view class="itemlpart">
							<view>交易提醒</view>
							<view class="tips">必须使用本人上课就打开手机看到军事基地看手机必须使用本人上课就打开手机看到军事基地看手机必须使用本人上课就打开手机看到军事基地看手机</view>
						</view>
					</view>
				</view>
				<view class="buybtbox">
					<view class="buybt">
						0手续费购买金矿
					</view>
				</view>
			</view>
		</u-popup>
		<u-popup v-model="showsellready" mode="bottom" border-radius="18">
			<view class="popup">
				<view class="popupnav">
					<view>
						<view class="title">出售金矿</view>
						<view class="uni">单价 ¥{{popinfo.price}}</view>
					</view>
					<u-icon @click="showsellready=false" name="close" color="#0e0e0d" size="28"></u-icon>
				</view>
				<view class="tradebox">
					<view class="inputer">
						<u-input :placeholder="'0.00 金矿'" :custom-style="{fontSize:'60rpx'}" type='number'
							v-model="selltradenum" />
					</view>
					<view class="limit">
					 限额 {{$fuc.formatNumber(popinfo.min_amount)}} - {{$fuc.formatNumber(popinfo.max_amount)}} {{popinfo.unit}}
					</view>
					<view class="clouduse">
						当前可售出金矿数量 {{userinfo.user_money}}
					</view>
					<view class="couldget">
						可得 <span>{{selltradenum?(popinfo.price*selltradenum).toFixed(2):'0.00'}} {{(popinfo.unit)}}</span>
					</view>
				</view>
				<view class="tradebox">
					<view class="paytitle">支付方式</view>
					<view class="payname">
						<view>{{popinfo.deal_way}}</view>
						<view class="type">即时付款</view>
					</view>
				</view>
				<view class="storeinfo">
					<view class="title">
						商家信息
					</view>
					<view class="infoitem">
						<view class="itemlpart">商家昵称</view>
						<view class="itemrpart">{{popinfo.store?popinfo.store.title:'未知商家'}}</view>
					</view>
					<view class="infoitem">
						<view class="itemlpart">
							<view>交易提醒</view>
							<view class="tips">必须使用本人上课就打开手机看到军事基地看手机必须使用本人上课就打开手机看到军事基地看手机必须使用本人上课就打开手机看到军事基地看手机</view>
						</view>
					</view>
				</view>
				<view class="buybtbox">
					<view class="buybt">
						0手续费出售金矿
					</view>
				</view>
			</view>
		</u-popup>
		
		
		<zero-loading color='#F0E68C' mask v-if="loading" showText textColor='#fff' :maskOpacity='0.8'></zero-loading>
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
				popinfo:{
					max_amount:'',
					min_amount:'',
					price:'0.00',
					unit:'USD',
					deal_way:'USD'
				},
				
				showsellready:false,
				buytradenum: '',
				selltradenum: '',
				showbuyready: false,
				loading: true,
				list: [{
					name: '购买'
				}, {
					name: '出售'
				}],
				current: 0,
				shops: [],
				userinfo:{
					user_money:'0.00'
				}
			}
		},
		onLoad() {
			this.getinfo(),
			this.getlist()
		},
		methods: {
			getinfo() {
				if (localStorage.getItem('token')) {
					this.$reqGet("usercenter").then(res => {
						this.userinfo = res.data.data
					})
				}
			},
			tradeready(info){
				console.log(info)
				this.popinfo =info
				if(this.current==1){
					this.showsellready=true
				}else{
					this.showbuyready=true
				}
			},
			getlist() {
				this.$reqGet('entrusts', {
					type: this.current == 0 ? 1 : 0
				}).then(res => {
					this.shops = res.data.data.lists
				}).finally(v => {
					this.loading = false
				})
			},
			change(index) {
				this.shops = []
				this.loading = true
				this.current = index;
				this.getlist()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.buybtbox{
		padding: 48rpx 0;
		.buybt{
			color: #fff;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 88rpx;
			width: 100%;
			border-radius: 100rpx;
			background-color: #b88c54;
		}
	}
	
	.storeinfo{
		margin-top: 48rpx;
		.infoitem{
			margin-top: 18rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: #262728;
			.tips{
				margin-top: 10rpx;
				font-size: 24rpx;
				color: #515151;
				line-height: 32rpx;
			}
		}
		.title{
			color: #000;
		}
	}
	.popup {
		color: #000;
		background-color: #f9fdfd;
		padding: 0 48rpx;
	}

	.tradebox {
		margin-bottom: 28rpx;
		background-color: #e5e7ef80;
		padding: 24rpx;
		border-radius: 24rpx;

		.payname {
			font-size: 24rpx;
			margin-top: 18rpx;
			display: flex;
			align-items: center;

			.type {
				background-color: #dde1e4;
				margin-left: 8rpx;
				font-size: 20rpx;
				padding: 6rpx 0;
			}
		}

		.couldget {
			margin-top: 24rpx;

			span {
				margin-left: 24rpx;
				color: #00000070;
			}
		}

		.limit {
			font-size: 24rpx;
			margin-top: 24rpx;
			color: #00000070
		}
		.clouduse{
			margin-top: 4rpx;
			font-size: 24rpx;
			color: #00000070
		}

		.inputer {
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1px solid #bababa;
			font-size: 40rpx;
			padding: 12rpx 0;
		}
	}

	.popupnav {
		height: 120rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.title {
			font-size: 32rpx;
		}

		.uni {
			font-size: 24rpx;
			margin-top: 8rpx;
		}
	}

	.itemtxt1 {
		font-weight: bold;
		margin-bottom: 24rpx;
	}

	.itemtxt2 {
		margin-bottom: 28rpx;
		font-size: 24rpx;
		color: #c7c9cd;
	}

	.itemtxt3 {
		margin-bottom: 32rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #fff;
	}

	.itemtxt4 {
		margin-bottom: 8rpx;
		font-size: 24rpx;
		color: #c7c9cd;

		span {
			color: #fff;
			margin-left: 12rpx;
		}
	}

	.itemtxt5 {
		// margin-bottom: 8rpx;
		font-size: 24rpx;
		color: #c7c9cd;

		span {
			color: #fff;
			margin-left: 12rpx;
		}
	}

	.itemtxt6 {
		font-size: 24rpx;
		color: #c7c9cd;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.payways {
			display: flex;
			align-items: center;

			.ali {
				margin-right: 24rpx;
				display: flex;
				align-items: center;

				.dec {
					margin-right: 8rpx;
					height: 20rpx;
					width: 6rpx;
					background-color: #0746b2;
				}
			}

			.wechat {
				display: flex;
				align-items: center;
				margin-right: 24rpx;

				.dec {
					margin-right: 8rpx;
					height: 20rpx;
					width: 6rpx;
					background-color: #0c5d12;
				}
			}
		}

		.buybtn {
			width: 150rpx;
			background-color: #fff;
			color: #000;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 100rpx;
			height: 40rpx;
		}
	}


	.bullbox {
		opacity: .4;
		margin-top: 48rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.null {
		width: 400rpx;
		height: 400rpx;

	}

	.nulltxt {
		margin-top: 24rpx;
		color: #767676;
	}

	.listbox {
		margin-top: 24rpx;
		padding: 0 32rpx;

		.item {
			padding: 24rpx 0;
			border-bottom: 1px solid #3d3e3e;
		}
	}

	.tabs2 {
		margin-top: 32rpx;
		width: 280rpx;
	}

	.tabs2box {
		padding: 0 24rpx;
	}

	.tabspleace {
		height: 88rpx;
	}

	.tabs {
		position: fixed;
		background-color: rgba(15, 16, 18, 1);
		z-index: 8;
		width: 100%;
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
</style>