<template>
	<view class="all">
		<navbar :title="$lang('游戏说明')"></navbar>
		<view class="rich">
			<u-parse :tag-style="style" :html="content" selectable show-with-animation></u-parse>
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
				style: {
					// 字符串的形式
					img: "border-radius:8rpx;margin:8rpx 0",
				},
				content: `<p>露从今夜白露从今夜白露从今夜白露从今夜白露从今夜白露从今夜白，月是故乡明</p><img src="https://p2.img.cctvpic.com/photoworkspace/contentimg/2020/07/16/2020071613380766481.jpg" />`,
			}
		}
	}
</script>

<style lang="scss" scoped>
	.rich {
		padding: 12rpx 24rpx;
	}
</style>