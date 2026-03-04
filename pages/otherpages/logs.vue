<template>
	<view>
		<navbar title="流水记录"></navbar>
		<view class="container">
			<!-- 流水列表 -->
			<view class="list-container">
				<view class="list-container-item" v-for="(i,index) in recordList" :key="index">
					<view class="tagline">
						<view class="l">
							<view class="title">时间</view>
							<view class="value">{{i.create_time}}</view>
						</view>
						<view class="r">
							<view class="title">关联单号</view>
							<view class="value">{{i.source_sn||'-'}}</view>
						</view>
					</view>
					<view class="tagline">
						<view class="l">
							<view class="title">账单类型</view>
							<view class="value">{{i.type_desc}}</view>
						</view>
						<view class="r">
							<view class="title">数量</view>
							<view class="value" :style="{color:i.change_amount_desc>0?'#31bd65':'#eb4b6d'}">{{i.change_amount_desc}}</view>
						</view>
					</view>
					<view class="tagline" style="margin-bottom: 0;">
						<view class="l">
							<view class="title">金矿余额</view>
							<view class="value">{{i.left_amount}}</view>
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
				mockrecordList:[],
				recordList: [],
				option: {
					page_no: 1,
					page_size: 20,
					type:'um'
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
					const res = await this.$reqGet("accountLog", this.option)
					const newList = res.data.data.lists || []

					if (isLoadMore) {
						// 加载更多，追加数据并去重
						this.recordList = [...this.recordList, ...newList]
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
		.list-container-item{
			padding: 36rpx 0;
			border-bottom: 1px solid #272828;
			.tagline{
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 48rpx;
				.l{
					width: 50%;
					.title{
						color: #ffffff90;
						font-size: 24rpx;
					}
					.value{
						margin-top: 8rpx;
						color: #fff;
						font-size: 24rpx;
					}
				}
				.r{
					width: 50%;
					.title{
						font-size: 24rpx;
						color: #ffffff90;
					}
					.value{
						margin-top: 8rpx;
						color: #fff;
						font-size: 24rpx;
					}	
				}
			}
		}
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
			width: 250rpx;
			height: 250rpx;
			margin-bottom: 24rpx;
			opacity: 0.5;
		}

		.empty-text {
			font-size: 28rpx;
			color: #7e7e7e;
		}
	}
</style>