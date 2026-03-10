<template>
	<view>
		<navbar :title="$lang('开矿记录')"></navbar>
		<view class="table">
			<view class="tableitem" v-for="(i,index) in gamelist" :key="i.id"
				:style="{marginLeft:(index%4)==0?'':'12rpx'}">
				<view class="no">
					<image src="@/static/icons/no.png" mode="aspectFill"></image>
					{{i.game_round||0}}
				</view>
				<view class="x">
					{{i.target_number?i.target_number.toFixed(2):'1.00'}} X
				</view>
			</view>
		</view>

		<!-- 加载状态提示 -->
		<view class="loading-container" v-if="loading">
			<text class="loading-text">{{$lang('加载中')}}</text>
		</view>

		<!-- 没有更多数据提示 -->
		<view class="no-more-container" v-if="noMore">
			<text class="no-more-text">{{$lang('没有更多数据了')}}</text>
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
				gamelist: [],
				background: {
					backgroundColor: "#001f3f",
				},
				option: {
					page_no: 1,
					page_size: 60 // 建议减小每页数量，提高加载速度
				},
				loading: false, // 加载状态
				noMore: false, // 是否没有更多数据
				total: 0 // 总数据量
			}
		},
		methods: {
			async getmoneyinfo(isLoadMore = false) {
				// 如果正在加载或没有更多数据，直接返回
				if (this.loading || this.noMore) return

				this.loading = true

				try {
					const res = await this.$reqGet("gamelist", this.option)
					const newList = res.data.data.lists || []

					if (isLoadMore) {
						// 加载更多，追加数据
						const existingIds = new Set(this.gamelist.map(item => item.id))
						const uniqueNewList = newList.filter(item => !existingIds.has(item.id))
						this.gamelist = [...this.gamelist, ...uniqueNewList]
					} else {
						// 首次加载，直接赋值
						this.gamelist = newList
					}
					// 判断是否还有更多数据
					if (newList.length < this.option.page_size) {
						this.noMore = true
					} else {
						this.option.page_no++ // 只有成功加载才增加页码
					}

				} finally {
					this.loading = false
				}
			},

			// 触底加载更多
			onReachBottom() {
				if (!this.noMore) {
					this.getmoneyinfo(true)
				}
			},
			// 重置数据
			resetData() {
				this.option.page_no = 1
				this.loading = false
				this.noMore = false
				this.gamelist = []
			}
		},
		onLoad() {
			this.getmoneyinfo()
		},

		// 页面触底事件
		onReachBottom() {
			this.onReachBottom()
		},

		// 下拉刷新事件
		onPullDownRefresh() {
			this.onPullDownRefresh()
		}
	}
</script>

<style lang="scss" scoped>
	.table {
		padding: 12rpx 36rpx;
		border-collapse: collapse;
		display: flex;
		align-items: center;
		flex-wrap: wrap;

		.tableitem {
			border-radius: 8rpx;
			margin-bottom: 12rpx;
			border-collapse: collapse;
			width: 160rpx;
			height: 150rpx;
			border: 1px solid #3f3f3f;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.no {
				display: flex;
				align-items: center;
				font-size: 24rpx;
				color: #7e7e7e;
			}

			.x {
				margin-top: 12rpx;
				color: #b8b8b8;
			}

			image {
				margin-right: 8rpx;
				width: 24rpx;
				height: 24rpx;
			}
		}
	}

	// 加载状态样式
	.loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 30rpx 0;

		.loading-text {
			font-size: 28rpx;
			color: #7e7e7e;
		}
	}

	// 没有更多数据样式
	.no-more-container {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 30rpx 0;

		.no-more-text {
			font-size: 28rpx;
			color: #999;
		}
	}
</style>