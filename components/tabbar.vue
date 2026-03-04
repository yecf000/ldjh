<template>
	<view class="tabbar">
		<view class="icon">
			<image @click="pageturn('/pages/index/index')" v-if="current!=1" src="@/static/icons/tabbar/tabbar00.png" mode="aspectFill"></image>
			<image v-if="current==1" src="@/static/icons/tabbar/tabbar01.png" mode="aspectFill"></image>
		</view>
		<view class="icon">
			<image @click="pageturn('/pages/myteam/index')" v-if="current!=2" src="@/static/icons/tabbar/tabbar10.png" mode="aspectFill"></image>
			<image v-if="current==2" src="@/static/icons/tabbar/tabbar11.png" mode="aspectFill"></image>
		</view>
		<view class="icon">
			<image @click="pageturn('/pages/myfriend/myfriends')" v-if="current!=3" src="@/static/icons/tabbar/tabbar30.png" mode="aspectFill"></image>
			<image v-if="current==3" src="@/static/icons/tabbar/tabbar31.png" mode="aspectFill"></image>
		</view>
		<view class="icon">
			<image @click="pageturn('/pages/my/index')" v-if="current!=4" src="@/static/icons/tabbar/tabbar40.png" mode="aspectFill"></image>
			<image v-if="current==4" src="@/static/icons/tabbar/tabbar41.png" mode="aspectFill"></image>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			current:{
				type: Number,
				default: 0
			}
		},
		data() {
			return {

			}
		},
		methods:{
			pageturn(e){
				uni.switchTab({
					url:e
				})
			}
		}
	}
</script>

<style lang="scss">
	.tabbar {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 120rpx;
		background-color: rgb(25, 24, 27);
		display: flex;
		align-items: center;
		border-radius: 12rpx 12rpx 0 0;
	}

	.icon {
		width: 25%;
		display: flex;
		align-items: center;
		justify-content: center;
		image {
			width: 48rpx;
			height: 48rpx;
		}
	}
</style>