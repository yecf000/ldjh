<template>
	<view class="">
		<navbar title="OTC申请"></navbar>
		<view class="contain">
			<view class="texts">
				<view class="font24">快捷交易</view>
				<view class="font24">成为C2C交易商家</view>
				<view class="font12 fee">无手续费买卖金矿</view>
				<view class="applynow" @click="apply">即刻申请</view>
			</view>
			<image src="@/static/svg/dec1.svg" mode="aspectFill"></image>
		</view>
		<view class="tils">
			<view class="title">
				如何成为商家
			</view>
			<view class="items">
				<view class="cheack">
					<u-icon name="checkmark" color="rgb(36, 36, 36)" size="28"></u-icon>
				</view>
				<view class="details">
					<view class="d">账户总金矿交易超过1000</view>
					<view class="s">已达成</view>
				</view>
			</view>
			<view class="items">
				<view class="cheack" style="background-color: #262626;">
					<u-icon name="checkmark" color="rgb(0, 0, 0)" size="28"></u-icon>
				</view>
				<view class="details">
					<view class="d">至少给出一种交易方式</view>
					<view class="s" style="color: rgb(156, 113, 113)">未完成</view>
				</view>
			</view>
			<view class="items">
				<view class="cheack" style="background-color: #262626;">
					<u-icon name="checkmark" color="rgb(0, 0, 0)" size="28"></u-icon>
				</view>
				<view class="details">
					<view class="d">总交易成交率大于80%</view>
					<view class="s" style="color: rgb(156, 113, 113)">未完成</view>
				</view>
			</view>
		</view>
		<view class="goods">
			<view class="title">
				商家权益
			</view>
			<view class="txt">
				除了 C2C 交易不收取任何手续费外以及可自行设置金矿得合理交易价位之外，申请成为商家并完成交易可概率额外获取一定量金矿
			</view>
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
				background: {
					backgroundColor: "#001f3f",
				},
			}
		},
		methods:{
			apply(){
				this.$reqPost('storeadd').then(res=>{
					this.$u.toast('申请成功')
				})
			}
		},
		
	}
</script>
<style lang="scss" scoped>
	.goods{
		padding-bottom: 88rpx;
		.txt{
			padding: 24rpx 48rpx;
			text-align: center;
			font-size: 24rpx;
			color:#a8a8a8;
			line-height: 42rpx;
		}
		.title{
			text-align: center;
			font-size: 40rpx;
			font-weight: 700;
		}
	}
	.tils{
		padding: 0 48rpx;
		.items{
			display: flex;
			height: 160rpx;
			border-bottom: 1px solid rgb(39, 39, 39);
			margin-bottom: 48rpx;
			.details{
				margin-left: 24rpx;
				.d{
					line-height: 48rpx;
				}
				.s{
					margin-top: 28rpx;
					font-size: 24rpx;
					color: #8b8b8b;
				}
			}
			.cheack{
				width: 48rpx;
				height: 48rpx;
				background-color: #fff;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
		.title{
			margin-bottom: 48rpx;
			text-align: center;
			font-size: 40rpx;
			font-weight: 700;
		}
	}
	.applynow{
		margin-top: 36rpx;
		width: 360rpx;
		height: 96rpx;
		background-color: #fff;
		border-radius: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #000;
		font-weight: 700;
	}
	.fee{
		margin: 12rpx 0;
	}
	.font12{
		font-size: 24rpx;
	}
	.font24{
		font-size: 48rpx;
		font-weight: 700;
	}
	.contain{
		height: 520rpx;
		display: flex;
		align-items: center;
		.texts{
			width: 440rpx;
			display: flex;
			flex-direction: column;
			align-items: flex-end;
		}
		image{
			width: 220rpx;
			height: 264rpx;
		}
	}
</style>