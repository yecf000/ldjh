<template>
	<view>
		<!-- <view class="bgdec">
		</view> -->
		<view class="contain">
			<view class="infobox">
				<view class="info" @click="$u.route('/pages/otherpages/userinfo');">
					<image class="avatar" :src="userinfo.avatar||'@/static/icons/defaultavatar.png'" mode="aspectFill">
					</image>
					<view class="accont">
						<view class="nickname">{{userinfo.nickname||'玩家*'}}</view>
						<view class="vip">普通用户</view>
					</view>
				</view>
				<view class="balance" @click="$u.route('/pages/otherpages/invite');">
					<image src="@/static/icons/qr.png" mode="aspectFill"></image>
					<u-icon name="arrow-right" color="#fff" size="28"></u-icon>
				</view>
			</view>
			<view class="assets">
				<view class="assetstitlebox">
					<view class="assetstitle">
						资产估值
						<image @click="showmoney=!showmoney" v-show="showmoney" src="@/static/icons/eye.png"
							mode="aspectFill"></image>
						<image @click="showmoney=!showmoney" v-show="!showmoney" src="@/static/icons/eye-off.png"
							mode="aspectFill"></image>
					</view>
					<view class="unmber" v-show="showmoney">
						{{Number(userinfo.user_money*options.exchange_rate).toFixed(2)||0}}
						<span>
							USDT
						</span>
					</view>
					<view class="unmber" v-show="!showmoney">
						*********
					</view>
					<view class="assetstitle" v-show="showmoney">
						今日收益 ${{Number(userinfo.today_income/2).toFixed(2)}}
						({{Number((userinfo.today_income?Number(userinfo.today_income):0)/(Number(userinfo.user_money)?Number(userinfo.user_money):1)*100).toFixed(2)}}%)
					</view>
					<view class="assetstitle" v-show="!showmoney">
						今日收益 ************
					</view>
				</view>
				<view class="gold" v-show="showmoney">
					<view class="title">
						可用资产
					</view>
					<view class="goldnum">
						{{Number(userinfo.user_money).toFixed(2)}}
						<image src="@/static/icons/gold.png" mode="aspectFill"></image>
					</view>
					<view class="assetstitle">
						今日收益 {{Number(userinfo.today_income).toFixed(2)}}
					</view>
				</view>
				<view class="gold" v-show="!showmoney">
					<view class="title">
						可用资产
					</view>
					<view class="goldnum">
						*******
						<image src="@/static/icons/gold.png" mode="aspectFill"></image>
					</view>
					<view class="assetstitle">
						今日收益 *****
					</view>
				</view>
			</view>
			<view class="oprations">
				<view class="title">
					资产管理
				</view>
				<view class="itemgroup">
					<view class="item" @click="$u.route('/pages/otherpages/getgold');">
						<image src="@/static/icons/myicon/moneyin.png" mode="aspectFill"></image>
						<view class="name">
							获取金矿
						</view>
					</view>
					<view class="item" @click="$u.route('/pages/otherpages/sellgold');">
						<image src="@/static/icons/myicon/moneyout.png" mode="aspectFill"></image>
						<view class="name">
							金矿兑现
						</view>
					</view>
					<view class="item" @click="$u.route('/pages/otherpages/c2c');">
						<image src="@/static/icons/myicon/c2c.png" mode="aspectFill"></image>
						<view class="name">
							C2C交易
						</view>
					</view>
					<view class="item" @click="$u.route('/pages/otherpages/otcorder');">
						<image src="@/static/icons/myicon/otcorder.png" mode="aspectFill"></image>
						<view class="name">
							OTC订单
						</view>
					</view>
				</view>
			</view>
			<view class="oprations" style="border-bottom: none;">
				<view class="title">
					其他常用
				</view>
				<view class="itemgroup">
					<view class="item" @click="$u.route('/pages/otherpages/logs')">
						<image src="@/static/icons/myicon/ls.png" mode="aspectFill"></image>
						<view class="name">
							流水详情
						</view>
					</view>
					<view class="item" @click="$u.route('/pages/otherpages/lottery')">
						<image src="@/static/icons/myicon/history.png" mode="aspectFill"></image>
						<view class="name">
							矿产记录
						</view>
					</view>
					<view class="item" @click="$u.route('/pages/otherpages/gamegoldhis')">
						<image src="@/static/icons/myicon/order.png" mode="aspectFill"></image>
						<view class="name">
							游戏记录
						</view>
					</view>
					<view class="item" @click="$u.route('/pages/otherpages/mymessage')">
						<view class="onmsg">

						</view>
						<image src="@/static/icons/myicon/message.png" mode="aspectFill"></image>
						<view class="name">
							我的消息
						</view>
					</view>
					<view class="item">
						<image src="@/static/icons/myicon/kf.png" mode="aspectFill"></image>
						<view class="name">
							官方客服
						</view>
					</view>
					<view class="item" @click="$u.route('/pages/otherpages/question')">
						<image src="@/static/icons/myicon/questions.png" mode="aspectFill"></image>
						<view class="name">
							常见问题
						</view>
					</view>
					<view class="item">
						<image src="@/static/icons/myicon/gfql.png" mode="aspectFill"></image>
						<view class="name">
							官方群聊
						</view>
					</view>
					<view class="item" @click="$u.route('/pages/otherpages/invite')">
						<image src="@/static/icons/myicon/gift.png" mode="aspectFill"></image>
						<view class="name">
							好友邀请
						</view>
					</view>
					<view v-if="!userinfo.is_store" class="item" @click="$u.route('/pages/otherpages/otcapply')">
						<image src="@/static/icons/myicon/otc.png" mode="aspectFill"></image>
						<view class="name">
							OTC申请
						</view>
					</view>
					<view v-if="userinfo.is_store" class="item" @click="$u.route('/pages/otherpages/store')">
						<image src="@/static/icons/myicon/otc.png" mode="aspectFill"></image>
						<view class="name">
							OTC商户
						</view>
					</view>
					<view class="item" @click="$u.route('/pages/otherpages/rules')">
						<image src="@/static/icons/myicon/rule.png" mode="aspectFill"></image>
						<view class="name">
							游戏说明
						</view>
					</view>
					<view class="item">
						<image src="@/static/icons/myicon/combine.png" mode="aspectFill"></image>
						<view class="name">
							商务合作
						</view>
					</view>
					<view class="item">
						<image @click="$u.route('pages/otherpages/mockgame')" src="@/static/icons/myicon/mockgame.png" mode="aspectFill"></image>
						<view class="name">
							模拟游戏
						</view>
					</view>
				</view>
			</view>
			<view class="placeholdertabbar">
			</view>
			<zero-loading color='#F0E68C' mask v-if="loading" showText textColor='#fff'
				:maskOpacity='0.8'></zero-loading>
			<tabbar :current="4"></tabbar>
		</view>

	</view>
</template>

<script>
	import tabbar from '@/components/tabbar.vue'
	export default {
		components: {
			tabbar
		},
		data() {
			return {
				loading: false,
				showmoney: true,
				userinfo: {
					nickname: '',
					user_money: 0,
					today_income: 0
				},
				options:{
					exchange_rate:1
				}
			}
		},
		methods: {
			gameConfig(){
				this.$reqGet("gameConfig").then(res => {
					this.options = res.data.data
				})
			},
			getinfo() {
				if (localStorage.getItem('token')) {
					this.$reqGet("usercenter").then(res => {
						this.userinfo = res.data.data
					})
				}
			}
		},
		onLoad() {
			this.gameConfig()
		},
		onShow() {
			this.getinfo()
		}
	}
</script>

<style lang="scss" scoped>
	.contain {
		position: relative;
		z-index: 1;
	}

	.bgdec {
		width: 50vw;
		height: 100vh;
		
		background-image: url('@/static/bgdec2.png');
		position: absolute;
		background-position: right top;
		/* 水平靠右，垂直居中 */
		background-repeat: no-repeat;
		background-size: contain;
		z-index: 0;
		opacity: 0.05;
		right: 0;
		top: 0;
	}

	.placeholdertabbar {
		height: 120rpx;
	}

	.oprations {
		padding: 24rpx 36rpx;
		border-bottom: 1px solid rgba(27, 29, 33, 1.0);

		.itemgroup {
			margin-top: 24rpx;
			display: flex;
			align-items: center;
			flex-wrap: wrap;

			.item {
				position: relative;
				height: 152rpx;
				width: 25%;
				display: flex;
				flex-direction: column;
				align-items: center;

				.onmsg {
					width: 16rpx;
					height: 16rpx;
					background-color: #ff000080;
					border-radius: 50%;
					position: absolute;
					right: 58rpx;
					z-index: 8;
				}

				image {
					width: 66rpx;
					height: 66rpx;
					margin-bottom: 12rpx;
				}
			}
		}

		.title {
			font-size: 32rpx;
		}
	}

	.gold {
		width: 50%;
		display: flex;
		flex-direction: column;
		align-items: flex-end;

		.goldnum {
			display: flex;
			align-items: center;
			// font-weight: bold;
			color: #fcba00;
			font-size: 36rpx;
			margin: 12rpx 0;

			image {
				margin-left: 12rpx;
				width: 40rpx;
				height: 34rpx;
			}
		}

		.title {
			color: #cecece;
		}
	}

	.assetstitlebox {
		width: 50%;
	}

	.assets {
		border-bottom: 1px solid rgba(27, 29, 33, 1.0);
		padding: 24rpx 36rpx;
		display: flex;
		align-items: center;

		.unmber {
			font-weight: bold;
			font-size: 42rpx;
			margin: 12rpx 0;

			span {
				margin-left: 12rpx;
				font-weight: normal;
				font-size: 28rpx;
			}
		}

		.assetstitle {
			// font-weight: bold;
			display: flex;
			align-items: center;
			color: #cecece;
			white-space: nowrap;

			image {
				margin-left: 16rpx;
				width: 32rpx;
				height: 32rpx;
			}
		}
	}

	.infobox {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid rgba(27, 29, 33, 1.0);
		padding: 24rpx;

		.balance {
			display: flex;
			align-items: center;

			image {
				margin-right: 18rpx;
				width: 48rpx;
				height: 48rpx;
			}
		}
	}

	.vip {
		width: fit-content;
		padding: 4rpx 12rpx;
		border-radius: 100rpx;
		border: 1px solid #6d6d6d;
		margin-top: 12rpx;
		font-size: 24rpx;
	}

	.nickname {
		font-weight: bold;
		font-size: 32rpx;
		max-width: 360rpx;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.accont {
		margin-left: 24rpx;
		height: 1000%;
	}

	.info {
		display: flex;
		align-items: center;

		.avatar {
			width: 108rpx;
			height: 108rpx;
			border-radius: 50%;
			background-color: #3a3a3a;
		}
	}

	page {
		color: #fff;
		background-color: rgba(15, 16, 18, 1);
	}
</style>