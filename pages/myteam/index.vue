<template>
	<view class="all">
		<tabbar :current="2"></tabbar>
		<view class="contain">
		</view>
		<view class="allbox">
			<view class="info">
				<view class="mainbox">
					<view class="txt1">您已赚取</view>
					<view class="txt2">{{(infodata.money*rate).toFixed(2)}} USDT</view>
					<view class="txt3">邀请更多好友，赚取更多奖励</view>
				</view>
			</view>
			<view class="history">
				<view class="txt1">邀请历史</view>
				<view class="txt3">您已邀请过的好友</view>
			</view>
			<view class="list">
				<view class="list-item" v-for="(i,index) in infodata.invite_list" :key="index">
					<view class="lpart">
						<image  :src="i.user?i.user.avatar:'@/static/icons/defaultavatar.png'" mode="aspectFill"></image>
						<view class="nickname">
							{{i.user?i.user.nickname:'用户'}}
						</view>
					</view>
					<view class="rpart">
						{{i.change_amount}}
						<image src="@/static/icons/gold.png" mode="aspectFill"></image>
						<u-icon name="arrow-right" color="#fbe3df" size="28"></u-icon>
					</view>
				</view>
				
			</view>
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
				rate:1,
				infodata:{
					invite_list:[],
					money:0
				}
			}
		},
		onLoad(){
			this.gameConfig()
			if(localStorage.getItem('token')){
				this.getmyTeam()
			}
		},
		methods:{
			gameConfig(){
				this.$reqGet("gameConfig").then(res => {
					this.rate = res.data.data.exchange_rate
				})
			},
			getmyTeam(){
				this.$reqGet("myTeam").then(res=>{
					console.log(res)
					this.infodata = res.data.data
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background-color: #010100;
	}
	.list{
		margin-top: 12rpx;
		padding: 48rpx;
		.list-item{
			padding: 28rpx 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.lpart{
				display: flex;
				align-items: center;
				.nickname{
					margin-left: 24rpx;
					word-break: break-word;
					max-width: 300rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				image{
					width: 66rpx;
					height: 66rpx;
					border-radius: 50%;
					background-color: #111112;
				}
			}
			.rpart{
				display: flex;
				align-items: center;
				font-size: 32rpx;
				image{
					margin: 0 24rpx;
					width: 44rpx;
					height: 36rpx;
				}
			}
		}
	}
	.allbox{
		position: relative;
		z-index: 2;
	}
	.all{
		position: relative;
		.contain{
			top: 0;
			position: fixed;
			z-index: 1;
			width: 100%;
			height: 500rpx;
			filter: opacity(0.3);
			background-image: url('@/static/teambg.png');
			background-size: cover;
			background-position: center;
		}
	}
	.history{
		margin-top: 48rpx;
		padding: 0rpx 48rpx;
		.txt1{
			color: #fff;
			font-size: 28rpx;
		}
		
		.txt3{
			margin-top: 12rpx;
			color: #adb0b3;
			font-size: 28rpx;
		}
	}
	.info{
		// border-bottom: 1px solid #1c1d1d50;
		padding: 32rpx 48rpx;
		position: relative;
		background-color: rgba(0, 0, 0, 0);
		.mainbox{
			position: relative;
		}
		
		.txt1{
			color: #fff;
			font-size: 32rpx;
		}
		.txt2{
			display: flex;
			align-items: center;
			margin: 20rpx 0;
			font-size: 60rpx;
			font-weight: bold;
		}
		.txt3{
			color: #adb0b3;
			font-size: 24rpx;
		}
	}
</style>