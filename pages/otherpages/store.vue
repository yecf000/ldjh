<template>
	<view class="all">
		<navbar :title="$lang('商户主页')"></navbar>
		<view class="storehome">
			<image :src="storeInfo.avatar||'@/static/svg/XTVCUSDT--big.svg'" mode="aspectFill"></image>
			<view class="info">
				<view class="line1">{{storeInfo.title||$lang('日月星辰商行')}}<u-icon @click="showEditPopup=true"
						name="edit-pen" color="#ecfff8" size="28"></u-icon></view>
				<view class="line2">{{$lang('保证金')}} 10,000 USDT</view>
				<view class="line3">
					<view class="item">{{$lang('身份认证')}}</view>
					<view class="item">{{$lang('电子邮件')}}</view>
					<view class="item">{{$lang('手机')}}</view>
					<view class="item">{{$lang('官方认证')}}</view>
				</view>
				<view class="line4">
					{{$lang('成为商家时间')}}:{{storeInfo.create_time?formatDate(storeInfo.create_time):'2000/01/01'}}
				</view>
			</view>
		</view>
		<view class="tradeinfo">
			<view class="trade">
				<view class="title">
					{{$lang('近期交易')}}
				</view>
				<view class="detail">
					<view class="line top">
						<view>{{$lang('成交单数')}}</view>
						<view>{{(storeInfo.buy_success_amount || 0) + (storeInfo.sell_success_amount || 0)}}</view>
					</view>
					<view class="line">
						<view class="flex">
							<view class="decred">
							</view>
							{{$lang('购买')}}
						</view>
						<view>{{storeInfo.buy_amount || 0}}</view>
					</view>
					<view class="line">
						<view class="flex">
							<view class="decgreen">
							</view>{{$lang('出售')}}
						</view>
						<view>{{storeInfo.sell_amount || 0}}</view>
					</view>
					<view class="line top">
						<view>{{$lang('成交率')}}</view>
						<view>{{calculateSuccessRate()}}%</view>
					</view>
					<view class="line">
						<view class="flex">
							<view class="decred">
							</view>{{$lang('购买')}}
						</view>
						<view>{{calculateBuySuccessRate()}}%</view>
					</view>
					<view class="line">
						<view class="flex">
							<view class="decgreen">
							</view>{{$lang('出售')}}
						</view>
						<view>{{calculateSellSuccessRate()}}%</view>
					</view>
					<view class="line top">
						<view>{{$lang('交易订单总数')}}</view>
						<view>{{(storeInfo.buy_amount || 0) + (storeInfo.sell_amount || 0)}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="entrust">
			<view class="title">
				{{$lang('我的委托')}}
			</view>
			<view class="bg">
				<view class="item" :style="{border:index+1==entrustList.length?'none':''}"
					v-for="(i,index) in entrustList" :key="i.id">
					<view class="txt1" :class="i.type==0?'green':'red'">{{Number(i.price).toFixed(2)}}
						{{i.unit.toUpperCase()}} <u-icon @click="handleDeleteEntrust(i.id)" name="close" color="#fcffea"
							size="24"></u-icon>
					</view>
					<view class="txt2"><span>{{$lang('数量')}}</span>{{i.left_amount}}</view>
					<view class="txt3"><span>{{$lang('总额')}}</span>{{(i.amount*i.price).toFixed(2)}}
						{{i.unit.toUpperCase()}}
					</view>
					<view class="txt4"><span>{{$lang('限额')}}</span>{{i.min_amount}}-{{i.max_amount}}
						{{i.unit.toUpperCase()}}
					</view>
					<view class="txt5">
						<view class="flex">
							<view class="decblue"></view>{{i.deal_way}}
						</view>
						<view class="sub">{{i.status_desc}}</view>
						<!-- <view class="low">下架</view> -->
					</view>
				</view>
				<image v-if="entrustList.length==0" src="@/static/icons/null.png"></image>
				<view v-show="entrustList.length<3" class="send" @click="showPublishPopup=true">
					{{entrustList.length==0?$lang('立即'):$lang('继续')}}{{$lang('发布')}}
					<u-icon style="margin-left: 12rpx;" name="arrow-right" color="#727475" size="28"></u-icon>
				</view>
			</view>
		</view>
		<!-- 取消委托确认弹窗 -->
		<u-modal :confirm-text='$lang("确认")' :cancel-text='$lang("取消")' v-model="cancelConfirmVisible"
			:content="cancelConfirmContent" show-cancel-button confirm-color='#a35f08'
			@confirm="confirmCancelEntrust"></u-modal>

		<!-- 删除委托确认弹窗 -->
		<u-modal :confirm-text='$lang("确认")' :cancel-text='$lang("取消")' v-model="deleteConfirmVisible"
			:content="deleteConfirmContent" show-cancel-button confirm-color='#a35f08'
			@confirm="confirmDeleteEntrust"></u-modal>

		<!-- 修改商店信息弹窗 -->
		<u-popup z-index='7' v-model="showEditPopup" mode="bottom" border-radius="18">
			<view class="datachange">
				<view class="tab">
					<view>{{$lang('门店信息')}}</view>
					<u-icon @click="showEditPopup=false" name="close" color="#000" size="24"></u-icon>
				</view>
				<view class="inuter">
					<view class="tips">
						{{$lang('门店头像')}}
					</view>
					<u-avatar @click="uploadimg" level-bg-color='#d2d6d6' show-level level-icon='edit-pen' :size='120'
						:src='storeInfo.avatar||"@/static/svg/XTVCUSDT--big.svg"'></u-avatar>
					<view class="tips" style="margin-top: 44rpx;">
						{{$lang('商店名称')}}
					</view>
					<u-input :placeholder='$lang("请输入商店名称")' @focus='actived=true' @blur='actived=false'
						:border-color="actived?'#000':''" clearable :maxlength='12' :custom-style='custyle'
						v-model="editForm.title" :border="true" />
					<view class="tips" style="margin-top: 44rpx;">
						{{$lang('交易须知')}}
					</view>
					<u-input type="textarea" :placeholder='$lang("请输入购买须知")' @focus='actived2=true'
						@blur='actived2=false' :border-color="actived2?'#000':''" clearable :maxlength='200'
						:custom-style='custyle' v-model="editForm.must_know" :border="true" />
					<view class="btpart" style="margin-top: 24rpx;">
						<view class="cancle" @click="showEditPopup=false">{{$lang('取消')}}</view>
						<view class="confirm" @click="handleSaveStoreInfo">{{$lang('确认')}}</view>
					</view>
				</view>
			</view>
		</u-popup>

		<!-- 发布委托弹窗 -->
		<u-popup v-model="showPublishPopup" mode="bottom" border-radius="18">
			<view class="datachange publish-popup">
				<view class="tab fixed-top">
					<view>{{$lang('发布委托')}}</view>
					<u-icon @click="showPublishPopup=false" name="close" color="#000" size="24"></u-icon>
				</view>
				<scroll-view class="content-scroll" scroll-y="true">
					<view class="inuter">
						<!-- 第一行：委托类型和价格 -->
						<view class="form-row">
							<view class="form-item">
								<view class="tips">{{$lang('委托类型')}}</view>
								<u-input @click="showsheet=true" :placeholder='$lang("请选择类型")'
									@focus='publishActive.type=true' @blur='publishActive.type=false'
									:border-color="publishActive.type?'#000':''" clearable :custom-style='custyle'
									v-model="publishForm.type" type="select" :border="true" />
							</view>
							<view class="form-item">
								<view class="tips">{{$lang('总委托数量')}}</view>
								<u-input :placeholder='$lang("总数量")' @focus='publishActive.amount=true'
									@blur='publishActive.amount=false' :border-color="publishActive.amount?'#000':''"
									clearable :custom-style='custyle' v-model="publishForm.amount" type="number"
									:border="true" />
							</view>
						</view>

						<!-- 第二行：交易方式和总委托数量 -->
						<view class="form-row">
							<view class="form-item">
								<view class="tips">{{$lang('交易方式')}}</view>
								<u-input disabled :placeholder='$lang("方式编号")' @focus='publishActive.deal_way=true'
									@blur='publishActive.deal_way=false'
									:border-color="publishActive.deal_way?'#000':''" clearable :custom-style='custyle'
									v-model="publishForm.deal_way" :border="true" />
							</view>
							<view class="form-item">
								<view class="tips">{{$lang('价格')}}(₽)</view>
								<u-input :placeholder='$lang("请输入价格")' @focus='publishActive.price=true'
									@blur='publishActive.price=false' :border-color="publishActive.price?'#000':''"
									clearable :custom-style='custyle' v-model="publishForm.price" type="number"
									:border="true" />
							</view>

						</view>
						<!-- 第三行：最小交易量和最大交易量 -->
						<view class="form-row">
							<view class="form-item">
								<view class="tips">{{$lang('最小交易量')}}</view>
								<u-input :placeholder='$lang("最小量")' @focus='publishActive.min_amount=true'
									@blur='publishActive.min_amount=false'
									:border-color="publishActive.min_amount?'#000':''" clearable :custom-style='custyle'
									v-model="publishForm.min_amount" type="number" :border="true" />
							</view>
							<view class="form-item">
								<view class="tips">{{$lang('最大交易量')}}</view>
								<u-input :placeholder='$lang("最大量")' @focus='publishActive.max_amount=true'
									@blur='publishActive.max_amount=false'
									:border-color="publishActive.max_amount?'#000':''" clearable :custom-style='custyle'
									v-model="publishForm.max_amount" type="number" :border="true" />
							</view>
						</view>


						<!-- 单独一行：联系方式 -->
						<view class="form-row">
							<view class="form-item full-width">
								<view class="tips">{{$lang('联系方式')}}</view>
								<u-input :placeholder='$lang("请输入联系方式")' @focus='publishActive.contact_way=true'
									@blur='publishActive.contact_way=false'
									:border-color="publishActive.contact_way?'#000':''" clearable
									:custom-style='custyle' v-model="publishForm.contact_way" :border="true" />
							</view>
						</view>

						<!-- 单独一行：交易单位 -->
						<view class="form-row">
							<view class="form-item full-width">
								<view class="tips">{{$lang('交易单位')}}</view>
								<u-input disabled :placeholder='$lang("请输入交易单位 如: RUB")'
									@focus='publishActive.unit=true' @blur='publishActive.unit=false'
									:border-color="publishActive.unit?'#000':''" clearable :custom-style='custyle'
									v-model="publishForm.unit" :border="true" />
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="btpart fixed-bottom">
					<view class="cancle" @click="showPublishPopup=false">{{$lang('取消')}}</view>
					<view class="confirm" @click="handlePublishEntrust">{{$lang('确认发布')}}</view>
				</view>
			</view>
		</u-popup>
		<zero-loading color='#F0E68C' mask v-if="loading" showText :textColor='$lang("#fff")'
			:maskOpacity='0.8'></zero-loading>
		<u-action-sheet @click="actionSheetCallback" :list="actionSheetList" v-model="showsheet"></u-action-sheet>
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
				nowtype: 0,
				loading: true,
				showsheet: false,
				actionSheetList: [{
						text: this.$lang('买入'),
						color: '#000',
						value: 0
					},
					{
						text: this.$lang('卖出'),
						color: '#000',
						value: 1
					}
				],
				avatarimage: '',
				actived: false,
				actived2: false,
				showEditPopup: false,
				showPublishPopup: false,
				custyle: {
					fontSize: '24rpx'
				},
				cancelConfirmVisible: false,
				deleteConfirmVisible: false,
				cancelConfirmContent: this.$lang("是否取消该委托"),
				deleteConfirmContent: this.$lang("是否删除该委托"),
				currentEntrustId: null,
				storeInfo: {
					avatar: '',
					must_know: '',
					create_time: '',
					title: '',
					buy_amount: 0,
					buy_success_amount: 0,
					sell_amount: 0,
					sell_success_amount: 0
				},
				editForm: {
					title: '',
					avatar: '',
					must_know: ''
				},
				publishForm: {
					type: '',
					price: '',
					min_amount: '',
					max_amount: '',
					deal_way: 'СБП',
					contact_way: '',
					unit: 'RUB',
					amount: ''
				},
				publishActive: {
					type: false,
					price: false,
					min_amount: false,
					max_amount: false,
					deal_way: false,
					contact_way: false,
					unit: false,
					amount: false
				},
				entrustList: []
			}
		},
		onLoad() {
			this.getstoreinfo()
			this.getEntrustList()
		},
		methods: {
			formatDate(dateString) {
				if (!dateString) return ''

				// 方法1：替换横杠为斜杠并去除时间部分
				if (dateString.includes('-')) {
					const datePart = dateString.split(' ')[0] // 获取日期部分
					return datePart.replace(/-/g, '/')
				}

				// 方法2：使用正则表达式
				// return dateString.replace(/-/g, '/').split(' ')[0]

				return dateString
			},
			actionSheetCallback(index) {
				this.publishForm.type = this.actionSheetList[index].text
				this.nowtype = this.actionSheetList[index].value
			},
			// 获取商店信息
			getstoreinfo() {
				this.$reqPost("accountDetail").then(res => {
					this.loading = false
					this.storeInfo = res.data.data
					this.editForm.title = res.data.data.title || ''
					this.editForm.must_know = res.data.data.must_know || ''
					this.editForm.avatar = res.data.data.avatar || ''
				}).finally(v => {
					this.loading = false
				})
			},

			// 获取委托列表
			getEntrustList() {
				this.$reqGet("entrustList").then(res => {
					this.entrustList = res.data.data.lists || []
				})
			},

			// 计算总成交率
			calculateSuccessRate() {
				const totalAmount = (this.storeInfo.buy_amount || 0) + (this.storeInfo.sell_amount || 0)
				const totalSuccess = (this.storeInfo.buy_success_amount || 0) + (this.storeInfo.sell_success_amount || 0)
				if (totalAmount === 0) return 0
				return ((totalSuccess / totalAmount) * 100).toFixed(0)
			},

			// 计算购买成交率
			calculateBuySuccessRate() {
				const buyAmount = this.storeInfo.buy_amount || 0
				const buySuccess = this.storeInfo.buy_success_amount || 0
				if (buyAmount === 0) return 0
				return ((buySuccess / buyAmount) * 100).toFixed(0)
			},

			// 计算出售成交率
			calculateSellSuccessRate() {
				const sellAmount = this.storeInfo.sell_amount || 0
				const sellSuccess = this.storeInfo.sell_success_amount || 0
				if (sellAmount === 0) return 0
				return ((sellSuccess / sellAmount) * 100).toFixed(0)
			},

			// 获取交易方式文本
			getDealWayText(dealWay) {
				const ways = {
					1: this.$lang('支付宝'),
					2: this.$lang('微信'),
					3: this.$lang('银行卡')
				}
				return ways[dealWay] || this.$lang('未知方式')
			},

			// 上传图片
			uploadimg() {
				uni.chooseImage({
					count: 1,
					success: async res => {
						if (res.tempFiles[0].size > 1024 * 1024 * 5) {
							uni.showToast({
								title: this.$lang('图片太大,请控制在5MB内'),
								icon: 'none'
							})
							return
						}
						const filePath = res.tempFilePaths[0];
						this.$fuc.uploadImgae(filePath).then(res => {
							this.editForm.avatar = res
							this.storeInfo.avatar = res
						})
					}
				});
			},

			// 保存商店信息
			handleSaveStoreInfo() {
				if (!this.editForm.title.trim()) {
					uni.showToast({
						title: this.$lang('请输入商店名称'),
						icon: 'none'
					})
					return
				}

				const params = {
					id: this.storeInfo.id,
					title: this.editForm.title,
					avatar: this.editForm.avatar,
					must_know: this.editForm.must_know
				}

				this.$reqPost("storeedit", params).then(res => {
					uni.showToast({
						title: this.$lang('修改成功')
					})
					this.showEditPopup = false
					this.getstoreinfo() // 刷新商店信息
				})
			},

			// 发布委托
			handlePublishEntrust() {
				// 表单验证
				if (!this.validatePublishForm()) {
					return
				}

				const params = {
					type: this.nowtype,
					price: parseFloat(this.publishForm.price),
					min_amount: parseFloat(this.publishForm.min_amount),
					max_amount: parseFloat(this.publishForm.max_amount),
					deal_way: this.publishForm.deal_way,
					contact_way: this.publishForm.contact_way,
					unit: this.publishForm.unit.toUpperCase(),
					amount: parseFloat(this.publishForm.amount)
				}

				this.$reqPost("entrustadd", params).then(res => {
					uni.showToast({
						title: this.$lang('发布成功'),
						icon: 'none'
					})
					this.showPublishPopup = false
					this.resetPublishForm()
					this.getEntrustList() // 刷新委托列表
				})
			},

			// 验证发布表单
			validatePublishForm() {
				if (this.publishForm.type === '') {
					uni.showToast({
						title: this.$lang('请选择委托类型'),
						icon: 'none'
					})
					return false
				}

				if (!this.publishForm.price || parseFloat(this.publishForm.price) <= 0) {
					uni.showToast({
						title: this.$lang('请输入正确的价格'),
						icon: 'none'
					})
					return false
				}

				if (!this.publishForm.min_amount || parseFloat(this.publishForm.min_amount) <= 0) {
					uni.showToast({
						title: this.$lang('请输入正确的最小交易量'),
						icon: 'none'
					})
					return false
				}

				if (!this.publishForm.max_amount || parseFloat(this.publishForm.max_amount) <= 0) {
					uni.showToast({
						title: this.$lang('请输入正确的最大交易量'),
						icon: 'none'
					})
					return false
				}

				if (parseFloat(this.publishForm.max_amount) < parseFloat(this.publishForm.min_amount)) {
					uni.showToast({
						title: this.$lang('最大交易量不能小于最小交易量'),
						icon: 'none'
					})
					return false
				}

				if (!this.publishForm.deal_way) {
					uni.showToast({
						title: this.$lang('请输入交易方式'),
						icon: 'none'
					})
					return false
				}

				if (!this.publishForm.contact_way) {
					uni.showToast({
						title: this.$lang('请输入联系方式'),
						icon: 'none'
					})
					return false
				}

				if (!this.publishForm.unit) {
					uni.showToast({
						title: this.$lang('请输入交易单位'),
						icon: 'none'
					})
					return false
				}

				if (!this.publishForm.amount || parseFloat(this.publishForm.amount) <= 0) {
					uni.showToast({
						title: this.$lang('请输入正确的总委托数量'),
						icon: 'none'
					})
					return false
				}

				return true
			},

			// 重置发布表单
			resetPublishForm() {
				this.publishForm = {
					type: '',
					price: '',
					min_amount: '',
					max_amount: '',
					deal_way: 'СБП',
					contact_way: '',
					unit: 'RUB',
					amount: ''
				}
			},

			// 取消委托
			handleCancelEntrust(id) {
				this.currentEntrustId = id
				this.cancelConfirmVisible = true
			},

			// 确认取消委托
			confirmCancelEntrust() {
				this.$reqPost("entrustcancel", {
					id: this.currentEntrustId
				}).then(res => {
					uni.showToast({
						title: this.$lang('取消成功'),
						icon: 'none'
					})
					this.getEntrustList() // 刷新委托列表

					this.currentEntrustId = null
				})
			},

			// 删除委托
			handleDeleteEntrust(id) {
				this.currentEntrustId = id
				this.deleteConfirmVisible = true
			},

			// 确认删除委托
			confirmDeleteEntrust() {
				this.$reqPost("entrustdelete", {
					id: this.currentEntrustId
				}).then(res => {
					uni.showToast({
						title: this.$lang('删除成功'),
						icon: 'none'
					})
					this.getEntrustList() // 刷新委托列表
					this.currentEntrustId = null
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.flex {
		display: flex;
		align-items: center;
	}

	.bg {
		margin-top: 24rpx;
		background-color: #171719;
		box-shadow: 4rpx 2rpx 4rpx 2rpx rgba(255, 255, 255, 0.06);
		padding: 24rpx;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		.item {
			width: 100%;
			padding: 4rpx 0;
			padding: 24rpx 0;
			border-bottom: thin solid rgb(39, 39, 40);

			span {
				color: #989d9d;
				margin-right: 12rpx;
			}

			.txt2 {
				font-size: 24rpx;
				margin-bottom: 8rpx;

			}

			.txt3 {
				font-size: 24rpx;
				margin-bottom: 8rpx;
			}

			.txt4 {
				font-size: 24rpx;
				margin-bottom: 8rpx;
			}

			.txt1 {
				font-weight: bold;
				font-size: 32rpx;
				margin-bottom: 12rpx;
				display: flex;
				justify-content: space-between;
			}

			.red {
				color: #eb4b6d;
			}

			.green {
				color: #31bd65
			}

			.txt5 {
				font-size: 24rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.decblue {
					width: 4rpx;
					height: 16rpx;
					margin-right: 8rpx;
					border-radius: 50rpx;
					background-color: #4174f2;
				}

				.low {
					width: 160rpx;
					height: 60rpx;
					background-color: #fff;
					border: 1px solid #fff;
					border-radius: 100rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #000;
					font-size: 24rpx;
				}

				.sub {
					width: 160rpx;
					height: 60rpx;
					border: 1px solid #fff;
					border-radius: 100rpx;
					background-color: #000;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #fff;
					font-size: 24rpx;
				}
			}
		}

		.empty-entrust {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			width: 100%;
			padding: 12rpx 0;
		}

		.send {
			margin-top: 12rpx;
			color: #727475;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		image {
			width: 250rpx;
			height: 250rpx;
			opacity: 0.3;
		}
	}

	.entrust {
		padding: 32rpx;

		.title {
			font-weight: bold;
			padding: 0 24rpx;
		}
	}

	.tradeinfo {
		margin-top: 24rpx;
		padding: 0 32rpx;

		.trade {
			width: 100%;
			padding: 24rpx;
			border-radius: 12rpx;
			background-color: #171719;
			box-shadow: 4rpx 2rpx 4rpx 2rpx rgba(255, 255, 255, 0.06);

			.decred {
				width: 4rpx;
				height: 16rpx;
				margin-right: 8rpx;
				border-radius: 50rpx;
				background-color: #eb4b6d;
			}

			.decgreen {
				width: 4rpx;
				height: 16rpx;
				margin-right: 8rpx;
				border-radius: 50rpx;
				background-color: #31bd65;
			}

			.title {
				margin-bottom: 12rpx;
				font-weight: bold;
			}

			.top {
				margin-top: 16rpx;
			}

			.line {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 24rpx;
				padding: 12rpx 0;
			}
		}
	}

	.storehome {
		padding: 32rpx;
		display: flex;
		box-shadow: 0 2rpx 4rpx 1rpx rgba(255, 255, 255, .07);

		.info {
			display: flex;
			flex-direction: column;
			padding-left: 24rpx;
			width: calc(100% - 100rpx);

			.line1 {
				width: 100%;
				font-size: 32rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}

			.line2 {
				display: flex;
				margin-top: 12rpx;
				font-size: 24rpx;
			}

			.line3 {
				margin-top: 12rpx;
				font-size: 24rpx;
				display: flex;
				align-items: center;

				.item {
					display: flex;
					margin-right: 12rpx;
				}
			}

			.line4 {
				margin-top: 12rpx;
				font-size: 24rpx;
			}
		}

		image {
			width: 88rpx;
			height: 88rpx;
			border-radius: 50%;
			background-image: url('@/static/icons/defaultavatar.png');
			background-size: cover;
		}
	}

	.datachange {
		color: #000;
		font-size: 24rpx;

		.btpart {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.cancle {
				width: 340rpx;
				border-radius: 100rpx;
				height: 80rpx;
				border: 1px solid #cccfcf;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: #fff;

			}

			.confirm {
				width: 340rpx;
				border-radius: 100rpx;
				height: 80rpx;
				border: 1px solid #cccfcf;
				display: flex;
				color: #fff;
				align-items: center;
				justify-content: center;
				background-color: #000;
			}
		}

		.inuter {
			padding: 28rpx 32rpx;

			.tips {
				color: #727475;
				margin-bottom: 12rpx;
				font-size: 22rpx;
			}
		}

		.tab {
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1px solid #e8e9ed;
			padding: 0 36rpx;
		}
	}

	.publish-popup {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.fixed-top {
		position: sticky;
		top: 0;
		// background: #fff;
		z-index: 10;
	}

	.fixed-bottom {
		position: sticky;
		bottom: 0;
		background: #fff;
		z-index: 10;
		padding: 20rpx 32rpx;
		border-top: 1px solid #e8e9ed;
	}

	.content-scroll {
		flex: 1;
		overflow-y: auto;
	}

	.inuter {
		padding: 28rpx 32rpx 120rpx;
		/* 底部留出按钮空间 */
	}

	.form-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 24rpx;
	}

	.form-item {
		flex: 1;
		margin-right: 20rpx;
	}

	.form-item:last-child {
		margin-right: 0;
	}

	.full-width {
		flex: 0 0 100%;
		margin-right: 0;
	}

	.form-item .tips {
		color: #727475;
		margin-bottom: 12rpx;
		font-size: 22rpx;
	}
</style>