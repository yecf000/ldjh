<template>
	<view class="all">
		<navbar :title="$lang('好友邀请')"></navbar>
		<view class="qr">
			<view class="title">
				{{$lang('邀请好友，赢取专属奖励！')}}
			</view>
			<view class="tips">
				{{$lang('使用手机浏览器扫描二维码加入掘金，您的奖励触手可及。')}}
			</view>
			<view class="qrpg">
				<uqrcode size="200" ref="qrcode" canvas-id="qrcode" :value="invitelink"
					:options="{ margin: 0 }"></uqrcode>
			</view>
		</view>
		<u-divider margin-top='60' margin-bottom='40' border-color='#2f2f30' color="#818286" bg-color='rgba(0,0,0,0)'>{{$lang('分享专属邀请链接或邀请码')}}</u-divider>
		<view class="invitinfo">
			<view class="inviteitem">
				<view class="name">{{$lang('邀请链接')}}</view>
				<view class="content">{{invitelink||'-'}}</view>
				<image @click="copy(invitelink)" src="@/static/icons/copy.png" mode="aspectFill"></image>
			</view>
			<view class="inviteitem">
				<view class="name">{{$lang('邀请码')}}</view>
				<view class="content">{{code||'-'}}</view>
				<image @click="copy(code)" src="@/static/icons/copy.png" mode="aspectFill"></image>
			</view>
		</view>
		<view class="about">
			{{$lang('tips: 奖励包括不固定数量的金矿、好友充值返利等多重福利。具体权益因账户等级而异，可前往会员权益查看详情以及最新活动。')}}
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
				domin:'localhost',
				invitelink:'',
				code:''
			}
		},
		onLoad() {
			this.getinfo()
		},
		methods:{
			getinfo(){
				if(localStorage.getItem('token')){
					this.$reqGet("usercenter").then(res=>{
						this.invitelink =  res.data.data.invite_url
						this.code =  res.data.data.invite_code
					})
				}
			},
			copy(e){
				uni.setClipboardData({
					data:e,
					success: () => {
						uni.showToast({
							title:this.$lang('复制成功'),
							icon:'none'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.about{
		margin:0 auto;
		margin-top: 24rpx;
		padding: 24rpx;
		font-size: 24rpx;
		color: #7e8082;
		text-align: center;
		width: 600rpx;
		line-height: 36rpx;
	}
	.invitinfo{
		padding: 0 24rpx;
		.inviteitem{
			font-size: 24rpx;
			background-color: #1d1d1d;
			padding: 12rpx;
			border-radius: 12rpx;
			margin-bottom: 24rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.content{
				width: 400rpx;
				text-align: center;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.name{
				width: 160rpx;
				text-align: center;
			}
			image{
				width: 44rpx;
				height: 44rpx;
			}
		}
	}
	page {
		background: url('@/static/invitebg.png');
		background-size: 100%;
	}

	.qr {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 88rpx;

		.tips {
			width: 450rpx;
			text-align: center;
			margin-top: 48rpx;
			margin-bottom: 48rpx;
			font-size: 24rpx;
		}

		.title {
			font-size: 40rpx;
			font-weight: bold;
			text-align: center;
		}

		.qrpg {
			background-color: #fff;
			padding: 12rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 12rpx;
		}
	}
</style>