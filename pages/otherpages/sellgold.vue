<template>
	<view class="all">
		<navbar :title="$lang('售出金矿')"></navbar>
		<view class="chainline">
			<view class="trc">
				<image src="@/static/svg/XTVCTRX--big.svg" mode="aspectFill"></image>
				Tron(trc20)
			</view>
		</view>
		<view class="address">
			<view class="inputer">
				<u-input type='textarea' :placeholder='$lang("地址")' input-align='center' v-model="address"
					:custom-style="{color:'#f4faff',fontSize:'64rpx'}" />
			</view>
			<view class="cv">
				<view class="cvbtn" @click="cv">
					<u-icon style="margin-right: 8rpx;" name="order" color="#fff" size="24"></u-icon>{{$lang('粘贴')}}
				</view>
			</view>
			<view class="sell">
				<view class="title">
					{{$lang('我要出售')}}
				</view>
				<view class="usdt">
					<view class="inputerx">
						<u-input type='number' placeholder='0.00' v-model="gold" @input='comu'
							:custom-style="{color:'#fff',fontSize:'64rpx'}" />
					</view>
					<view class="unit">
						<image style="height: 42rpx;" src="@/static/icons/gold.png" mode="aspectFill"></image>
						{{$lang('金矿')}}
					</view>
				</view>
				<view class="infos">
					<view>{{$lang('当前账户可出售金矿数量')}} <span
							style="color: #fff;margin-left: 12rpx;font-weight: bold;">{{userinfo.user_money||0}}</span>
					</view>
					<view>1{{$lang('金矿')}}= {{rate}} USDT</view>
				</view>
				<view class="title" style="margin-top: 48rpx;">
					{{$lang('我将获得')}}
				</view>
				<view class="usdt">
					<view class="inputerx">
						<u-input @input='comg' type='number' placeholder='0.00' v-model="usdt"
							:custom-style="{color:'#fff',fontSize:'64rpx'}" />
					</view>
					<view class="unit">
						<image src="@/static/svg/XTVCUSDT--big.svg" mode="aspectFill"></image>
						USDT
					</view>
				</view>
			</view>
		</view>
		<view class="history" v-if="withdrawlists.length">
			<view class="htitle">
				<view>{{$lang('近期记录')}}</view>
				<view class="rpart">
					<u-icon style="margin-right: 8rpx;" name="order" color="#fff" size="24"></u-icon>
					{{$lang('全部')}}
				</view>
			</view>
			<view class="list">
				<view class="null" v-show="false">
					<image src="@/static/icons/null.png" mode="aspectFill"></image>
				</view>
				<view class="project" :style="{border:index==2?'none':''}" v-for="(i,index) in withdrawlists"
					:key="index">
					{{$lang('售出金矿')}}
					<view class="flex">
						<view class="line" style="width: 240rpx;">
							<view class="linetitle">{{$lang('时间')}}</view>
							<view>{{i.create_time}}</view>
						</view>
						<view class="line" style="width: 120rpx;">
							<view class="linetitle">{{$lang('售出数量')}}</view>
							<view>{{i.user_money}}</view>
						</view>
						<view class="line" style="width: 80rpx;">
							<view class="linetitle">{{$lang('USDT数量')}}</view>
							<view>{{i.amount}}</view>
						</view>
						<view class="line" style="width: 80rpx;">
							<view class="linetitle">{{$lang('状态')}}</view>
							<view>{{i.status==0?$lang('待审核'):(i.status==1?$lang('通过'):$lang('拒绝'))}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="afterplease">

		</view>
		<view class="afterbtn">
			<view class="xbtn" @click="sub">
				{{$lang('确认售出')}}
			</view>
		</view>
		<u-modal @confirm='confirm' confirm-color='#2537a8' show-cancel-button v-model="showconfirm"
			:content="$lang('是否确认售出？')"></u-modal>
		<zero-loading color='#F0E68C' mask v-if="loading" showText :textColor='$lang("#fff")'
			:maskOpacity='0.8'></zero-loading>
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
				showconfirm: false,
				gold: '',
				loading: false,
				usdt: '',
				rate: 1,
				address: '',
				nums: "",
				userinfo: {

				},
				withdrawlists: []
			}
		},
		onLoad() {
			this.getinfo()
			this.tradelist()
			this.gameConfig()
		},
		methods: {

			gameConfig() {
				this.$reqGet("gameConfig").then(res => {
					this.rate = res.data.data.exchange_rate
				})
			},
			tradelist() {
				this.$reqGet("withdrawlists", {
					page_size: 3
				}).then(res => {
					this.withdrawlists = res.data.data.lists
				})
			},
			getinfo() {
				if (localStorage.getItem('token')) {
					this.loading = true
					this.$reqGet("usercenter").then(res => {
						this.userinfo = res.data.data
						this.loading = false
					})
				}
			},
			confirm() {
				this.$reqPost('withdraw', {
					currency_id: 1,
					user_money: this.gold,
					address: this.address
				}).then(res => {
					this.$u.toast(this.$lang('已提交售出'))
					this.getinfo()
				}).finally(v => {
					this.loading = false
					this.showconfirm = false
					this.tradelist()
				})
			},
			sub() {
				if (!this.address) {
					uni.showToast({
						title: this.$lang('未填写地址'),
						icon: 'none'
					})
					return
				}
				if (!this.gold) {
					uni.showToast({
						title: this.$lang('未填写数量'),
						icon: 'none'
					})
					return
				}
				this.gold = Math.floor(this.gold)
				if ((this.gold * this.rate) % 1 != 0) {
					this.usdt = (this.gold * this.rate).toFixed(1)
				} else {
					this.usdt = (this.gold * this.rate)
				}
				this.showconfirm = true
			},
			comg(e) {
				if (e) {
					this.gold = (e / this.rate).toFixed(2)
				} else {
					this.gold = ''
				}
			},
			comu(e) {
				if (e) {
					if ((e * this.rate) % 1 != 0) {
						this.usdt = (e * this.rate).toFixed(1)
					} else {
						this.usdt = (e * this.rate)
					}
				} else {
					this.usdt = ''
				}
			},
			cv() {
				uni.getClipboardData({
					success: res => {
						this.address = res.data
					},
					fail: (err) => {
						uni.showToast({
							title: this.$lang('粘贴失败'),
							icon: 'none'
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.flex {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 12rpx;
	}

	.history {
		margin-top: 88rpx;
		padding: 0 42rpx;

		.list {
			.project {
				font-weight: bold;
				padding: 24rpx 0;
				border-bottom: 1px solid #1c1c1c;
			}

			.line {
				font-weight: 500;
				display: flex;
				flex-direction: column;
				font-size: 24rpx;

				.linetitle {
					color: #8d8f8f;
					margin-bottom: 8rpx;
				}
			}
		}

		.rpart {
			display: flex;
			align-items: center;
			font-size: 24rpx;
			font-weight: 500;
		}

		.htitle {
			font-weight: bold;
			display: flex;
			justify-content: space-between;
		}
	}

	.afterplease {
		height: 150rpx;
	}

	.afterbtn {
		background-color: rgba(15, 16, 18, 1);
		position: fixed;
		z-index: 9;
		bottom: 0;
		width: 100%;
		height: 142rpx;
		display: flex;
		justify-content: center;
		padding: 30rpx 48rpx;

		.xbtn {
			width: 100%;
			height: 100%;
			background-color: #fff;
			color: #000;
			font-size: 32rpx;
			border-radius: 100rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-weight: 700;
		}
	}

	.infos {
		margin-top: 8rpx;
		font-size: 24rpx;
		color: #b6bfc3;
	}

	.usdt {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 128rpx;
		border-bottom: 1px solid #b6bfcc;
		font-size: 38rpx;
		font-weight: bold;

		.inputerx {
			display: flex;
			width: 400rpx;
			height: 88rpx;
			display: flex;
			align-items: center;
		}

		.unit {

			padding: 12rpx;
			background-color: #2c2f30;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			image {
				width: 54rpx;
				height: 54rpx;
				margin-right: 12rpx;
				border-radius: 50%;
			}
		}
	}

	.sell {
		margin-top: 48rpx;
	}

	.cv {
		display: flex;
		justify-content: center;

		.cvbtn {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 12rpx 28rpx;
			font-size: 24rpx;
			background-color: #878d9050;
			border-radius: 100rpx;
			color: #fff;
		}
	}

	.address {
		margin-top: 48rpx;
		padding: 0 48rpx;
	}

	.chainline {
		width: 100%;
		padding: 24rpx 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.trc {
		color: #b6bfc2;
		background-color: #262727;
		padding: 8rpx 12rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 8rpx;
		border-radius: 8rpx;

		image {
			width: 36rpx;
			height: 36rpx;
			border-radius: 50%;
			margin-right: 8rpx;
		}
	}
</style>