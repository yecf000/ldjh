<template>
	<view class="all">
		<navbar :title="$lang('常见问题')"></navbar>
		<view class="null" v-show="!list.length">
			<image src="@/static/icons/null.png" mode="aspectFill"></image>
			<view class="txtnull">
				{{$lang('暂无内容')}}
			</view>
		</view>
		<view class="message">
			<u-collapse hover-class='' :accordion='true' :item-style='itemstyle'>
				<u-collapse-item :titlecolor="'#c2c5c5'" :title="item.title" v-for="(item, index) in list" :key="index"
					:open="item.open" :disabled="item.disabled">
					<!-- <view style="color: #e8eaf2;line-height: 38rpx;padding: 12rpx 0;">{{item.content}}</view> -->
					<!-- <view style="margin-top: 8rpx;font-size: 24rpx;">{{'2025-10-01 20:00:00'}}</view> -->
					<view style="color: #fff;padding: 12rpx 0;">
						<u-parse :html="item.content"></u-parse>
					</view>
				</u-collapse-item>
			</u-collapse>
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
				list: [],
				itemstyle: {
					marginBottom: '24rpx'
				},

				headstyle: {
					color: '#fff'
				},
				itemList: [],
			}
		},
		onLoad() {
			this.getlist()
		},
		methods: {
			getlist() {
				this.$reqGet("problemLists").then(res => {
					this.list = res.data.data.lists
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	.message {
		padding: 12rpx 48rpx;
	}
	.txtnull{
		font-size: 28rpx;
		color: #767878;
	}
	.null{
		padding: 48rpx 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		image{
			width: 500rpx;
			height: 500rpx;
		}
	}
</style>