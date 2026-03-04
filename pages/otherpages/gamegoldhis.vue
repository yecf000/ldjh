<template>
	<view>
		<navbar title="游戏记录"></navbar>
		<view class="container">
			<!-- 流水列表 -->
			<view class="list-container">
				<view :style="{border:item.action === 1?'1rpx solid #0e2800':'1rpx solid #290100'}" class="record-item" v-for="item in recordList" :key="item.id">
					<view class="record-left">
						<view class="record-type">
							{{ getTypeText(item.change_type) }}
						</view>
						<view class="record-time">
							{{ item.create_time }}
						</view>
						<view class="record-round" v-if="item.source_sn">
							游戏回合: {{ item.source_sn }}
						</view>
					</view>
					<view class="record-right">
						<view class="record-amount" :class="item.action === 1 ? 'income' : 'expense'">
							{{ item.action === 1 ? '+' : '-' }}{{ item.change_amount }}
						</view>
						<view class="record-balance">
							金矿余量: {{ item.left_amount }}
						</view>
					</view>
				</view>
			</view>

			<!-- 加载状态提示 -->
			<view class="loading-container" v-if="loading">
				<text class="loading-text">加载中...</text>
			</view>

			<!-- 没有更多数据提示 -->
			<view class="no-more-container" v-if="noMore&&recordList.length>0">
				<text class="no-more-text">没有更多数据了</text>
			</view>

			<!-- 空状态 -->
			<view class="empty-container" v-if="!loading && recordList.length === 0">
				<image src="@/static/icons/null.png" class="empty-icon"></image>
				<text class="empty-text">暂无流水记录</text>
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
				recordList: [],
				option: {
					page_no: 1,
					page_size: 20
				},
				loading: false,
				noMore: false,
				filterType: 0 // 0:全部 1:收入 2:支出
			}
		},
		methods: {
			async getRecordList(isLoadMore = false) {
				if (this.loading || this.noMore) return

				this.loading = true

				try {
					const res = await this.$reqGet("myLists", this.option)
					const newList = res.data.data.lists || []

					if (isLoadMore) {
						// 加载更多，追加数据并去重
						const existingIds = new Set(this.recordList.map(item => item.id))
						const uniqueNewList = newList.filter(item => !existingIds.has(item.id))
						this.recordList = [...this.recordList, ...uniqueNewList]
					} else {
						// 首次加载，直接赋值
						this.recordList = newList
					}

					// 判断是否还有更多数据
					if (newList.length < this.option.page_size) {
						this.noMore = true
					} else {
						this.option.page_no++
					}

				} finally {
					this.loading = false
				}
			},

			// 根据类型获取文本
			getTypeText(type) {
				const typeMap = {
					202: '游戏获得',
					103: '游戏投入'
					// 可以根据实际情况添加更多类型
				}
				return typeMap[type] || '其他'
			},

			// 切换筛选类型
			changeFilter(type) {
				if (this.filterType === type) return

				this.filterType = type
				this.resetData()

				// 根据筛选类型添加参数
				if (type === 1) {
					this.option.action = 1 // 收入
				} else if (type === 2) {
					this.option.action = 2 // 支出
				} else {
					delete this.option.action // 全部
				}

				this.getRecordList()
			},

			// 触底加载更多
			onReachBottom() {
				if (!this.noMore) {
					this.getRecordList(true)
				}
			},

			// 下拉刷新
			onPullDownRefresh() {
				this.resetData()
				this.getRecordList(false).finally(() => {
					uni.stopPullDownRefresh()
				})
			},

			// 重置数据
			resetData() {
				this.option.page_no = 1
				this.loading = false
				this.noMore = false
				this.recordList = []
			}
		},
		onLoad() {
			this.getRecordList()
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
	.container {
		padding: 24rpx;
	}

	// 筛选容器
	.filter-container {
		display: flex;
		margin-bottom: 24rpx;
		background: #1a2d4a;
		border-radius: 12rpx;
		padding: 8rpx;
	}

	.filter-item {
		flex: 1;
		text-align: center;
		padding: 16rpx 0;
		font-size: 28rpx;
		color: #7e7e7e;
		border-radius: 8rpx;
		transition: all 0.3s;

		&.active {
			background: #001f3f;
			color: #fff;
		}
	}

	// 列表容器
	.list-container {
		display: flex;
		flex-direction: column;
		gap: 16rpx;
	}

	// 记录项
	.record-item {
		background: #0e0a00;
		border-radius: 16rpx;
		padding: 28rpx;
		margin-bottom: 16rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 4rpx 12rpx rgba(255, 255, 255, 0.1);
		transition: all 0.3s ease;

		&:active {
			transform: scale(0.98);
			box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.15);
		}
	}

	.record-left {
		flex: 1;
	}

	.record-type {
		font-size: 32rpx;
		color: #fff;
		margin-bottom: 12rpx;
	}

	.record-time {
		font-size: 24rpx;
		color: #7e7e7e;
		margin-bottom: 8rpx;
	}

	.record-round {
		font-size: 24rpx;
		color: #b8b8b8;
	}

	.record-right {
		text-align: right;
	}

	.record-amount {
		font-size: 30rpx;
		font-weight: bold;
		margin-bottom: 12rpx;

		&.income {
			color: #4cd964; // 收入用绿色
		}

		&.expense {
			color: #ff3b30; // 支出用红色
		}
	}

	.record-balance {
		font-size: 24rpx;
		color: #b8b8b8;
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

	// 空状态样式
	.empty-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 100rpx 0;

		.empty-icon {
			width: 120rpx;
			height: 120rpx;
			margin-bottom: 24rpx;
			opacity: 0.5;
		}

		.empty-text {
			font-size: 28rpx;
			color: #7e7e7e;
		}
	}
</style>