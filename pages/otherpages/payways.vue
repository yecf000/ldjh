<template>
	<view class="all">
		<navbar title="收款渠道"></navbar>

		<!-- 空状态 -->
		<view class="empty-state" v-if="accountList.length === 0 && !loading">
			<view class="empty-icon">
				<image src="@/static/icons/null.png" mode="aspectFill"></image>
			</view>
			<view class="empty-text">暂无收款渠道</view>
			<view class="empty-desc">添加收款渠道以便接收款项</view>
		</view>
		
		<!-- 收款渠道列表 -->
		<view class="account-list" v-else>
			<view class="title">我的收款渠道</view>
			<view class="list-content">
				<view class="account-item" v-for="item in accountList" :key="item.id" :class="{active: item.is_used}">
					<view class="account-header">
						<view class="account-way">{{ item.way }}</view>
						<view class="account-status">
							<text v-if="item.is_used" class="status-active">使用中</text>
							<text v-else class="status-inactive">未启用</text>
						</view>
					</view>

					<view class="account-info">
						<view class="account-number">{{ formatAccountNumber(item.account) }}</view>
						<view class="account-actions">
							<view class="action-btn edit" @click="editAccount(item)">
								<u-icon name="edit-pen" color="#76787a" size="28"></u-icon>
								<text>编辑</text>
							</view>
							<view class="action-btn delete" @click="deleteAccount(item.id)">
								<u-icon name="trash" color="#fd7774" size="28"></u-icon>
								<text>删除</text>
							</view>
						</view>
					</view>

					<view class="qr-code-preview" v-if="item.qr_code">
						<image :src="item.qr_code" mode="aspectFit" class="qr-image"
							@click="previewQrCode(item.qr_code)"></image>
						<view class="qr-tips" @click="previewQrCode(item.qr_code)">点击预览收款码</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部操作按钮 -->
		<view class="bottom-actions">
			<view class="add-btn" @click="showAddForm">
				<u-icon name="plus" color="#000" size="32"></u-icon>
				<text>添加收款渠道</text>
			</view>
		</view>

		<!-- 新增/编辑弹窗 -->
		<u-popup z-index='7' v-model="showForm" mode="bottom" border-radius="18" :closeable="true">
			<view class="account-form">
				<view class="form-title">{{ isEditing ? '编辑收款渠道' : '添加收款渠道' }}</view>

				<view class="form-content">
					<view class="form-item">
						<view class="label">收款方式</view>
						<u-input disabled v-model="formData.way" placeholder="例如：银行卡" :custom-style="inputStyle" :border="true"
							:border-color="borderColor" />
					</view>

					<view class="form-item">
						<view class="label">账户号码</view>
						<u-input v-model="formData.account" placeholder="请输入账户号码" :custom-style="inputStyle"
							:border="true" :border-color="borderColor" />
					</view>

					<view class="form-item">
						<view class="label">收款码</view>
						<view class="upload-area" @click="uploadQrCode">
							<image v-if="formData.qr_code" :src="formData.qr_code" mode="aspectFit"
								class="qr-upload-image"></image>
							<view v-else class="upload-placeholder">
								<u-icon name="photo" color="#b9bdbd" size="48"></u-icon>
								<view class="upload-text">上传收款码</view>
							</view>
						</view>
					</view>

					<view class="form-item">
						<view class="label">启用状态</view>
						<view class="switch-item">
							<text class="switch-label">立即启用此收款渠道</text>
							<u-switch v-model="formData.is_used" active-color="#000" size="28"></u-switch>
						</view>
					</view>

					<view class="form-actions">
						<view class="action-btn cancel" @click="showForm = false">取消</view>
						<view class="action-btn confirm" :class="{disabled: !formData.way || !formData.account}"
							@click="submitForm">
							{{ isEditing ? '保存修改' : '确认添加' }}
						</view>
					</view>
				</view>
			</view>
		</u-popup>

		<!-- 删除确认弹窗 -->
		<u-modal v-model="showDeleteConfirm" :content="deleteConfirmText" :show-cancel-button="true" :async-close="true"
			@confirm="confirmDelete"></u-modal>

		<!-- 加载状态 -->
		<zero-loading color='#F0E68C' mask v-if="loading" showText textColor='#fff' :maskOpacity='0.8'></zero-loading>
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
				loading: false,
				showForm: false,
				showDeleteConfirm: false,
				isEditing: false,
				accountList: [],
				formData: {
					id: '',
					way: 'Система быстрых платежей(СБП)',
					account: '',
					qr_code: '',
					is_used: false
				},
				deleteId: '',
				inputStyle: {
					fontSize: '24rpx',
					height: '80rpx',
					padding: '0 20rpx'
				},
				borderColor: '#e8e9ed'
			}
		},
		computed: {
			deleteConfirmText() {
				return '确定要删除这个收款渠道吗？删除后无法恢复。'
			}
		},
		onLoad() {
			this.getAccountList();
		},
		methods: {
			// 获取收款渠道列表
			async getAccountList() {
				this.loading = true;
				try {
					const res = await this.$reqGet("accountLists");
					res.data.data.lists.map(i => {
						if (i.is_used == 1) {
							i.is_used = true
						} else {
							i.is_used = false
						}
					})
					this.accountList = res.data.data.lists || [];
				} finally {
					this.loading = false;
				}
			},

			// 显示新增表单
			showAddForm() {
				this.isEditing = false;
				this.resetForm();
				this.showForm = true;
			},

			// 编辑收款渠道
			editAccount(item) {
				this.isEditing = true;
				this.formData = {
					id: item.id,
					way: item.way,
					account: item.account,
					qr_code: item.qr_code,
					is_used: item.is_used
				};
				this.showForm = true;
			},

			// 删除收款渠道
			deleteAccount(id) {
				this.deleteId = id;
				this.showDeleteConfirm = true;
			},

			// 确认删除
			async confirmDelete() {
				try {
					await this.$reqPost("accountdelete", {
						id: this.deleteId
					});

					uni.showToast({
						title: '删除成功',
						icon: 'none'
					});

					// 重新加载列表
					this.getAccountList();
				} catch (error) {
					console.error('删除失败', error);
					uni.showToast({
						title: '删除失败',
						icon: 'none'
					});
				} finally {
					this.showDeleteConfirm = false;
					this.deleteId = '';
				}
			},

			// 提交表单（新增或编辑）
			async submitForm() {
				if (!this.formData.way || !this.formData.account) {
					uni.showToast({
						title: '请填写完整信息',
						icon: 'none'
					});
					return;
				}
				let postdata = JSON.parse(JSON.stringify(this.formData))
				postdata.is_used = postdata.is_used ? 1 : 0
				this.loading = true;
				try {
					if (this.isEditing) {
						// 编辑
						await this.$reqPost("accountedit", postdata);
						uni.showToast({
							title: '修改成功',
							icon: 'none'
						});
					} else {
						// 新增
						delete postdata['id']
						await this.$reqPost("accountadd", postdata);
						uni.showToast({
							title: '添加成功',
							icon: 'none'
						});
					}

					this.showForm = false;
					this.getAccountList();
				} catch (error) {
					console.error('操作失败', error);
					uni.showToast({
						title: '操作失败',
						icon: 'none'
					});
				} finally {
					this.loading = false;
				}
			},

			// 上传收款码
			uploadQrCode() {
				uni.chooseImage({
					count: 1,
					success: res => {
						if (res.tempFiles[0].size > 1024 * 1024 * 5) {
							uni.showToast({
								title: '图片太大,请控制在5MB内',
								icon: 'none'
							});
							return;
						}
						const filePath = res.tempFilePaths[0];
						this.loading = true;

						this.$fuc.uploadImgae(filePath).then(result => {
							this.formData.qr_code = result;
							this.loading = false;
							uni.showToast({
								title: '上传成功',
								icon: 'none'
							});
						}).catch(error => {
							console.error('上传失败', error);
							this.loading = false;
							uni.showToast({
								title: '上传失败',
								icon: 'none'
							});
						});
					}
				});
			},

			// 预览收款码
			previewQrCode(url) {
				if (!url) return;

				uni.previewImage({
					urls: [url],
					current: 0
				});
			},

			// 格式化账户号码显示
			formatAccountNumber(account) {
				if (!account) return '';
				if (account.length <= 8) return account;
				return account.substring(0, 4) + '****' + account.substring(account.length - 4);
			},

			// 重置表单
			resetForm() {
				this.formData = {
					id: '',
					way: 'Система быстрых платежей(СБП)',
					account: '',
					qr_code: '',
					is_used: false
				};
			}
		}
	}
</script>

<style lang="scss" scoped>
	.all {
		padding-bottom: 120rpx;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 120rpx 0;

		.empty-icon {
			margin-bottom: 32rpx;

			image {
				width: 400rpx;
				height: 400rpx;
				opacity: 0.5;
			}
		}

		.empty-text {
			font-size: 32rpx;
			color: #3f4040;
			margin-bottom: 16rpx;
		}

		.empty-desc {
			font-size: 24rpx;
			color: #b9bdbd;
		}
	}

	.account-list {
		padding: 0 24rpx;

		.title {
			margin-top: 24rpx;
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 24rpx;
		}

		.list-content {
			.account-item {
				background: #f7f8fc;
				border-radius: 12rpx;
				padding: 32rpx;
				margin-bottom: 24rpx;
				border: 2rpx solid #e8e9ed;
				box-shadow: 4rpx 4rpx 12rpx rgba(255, 255, 255, 0.2);

				&.active {
					border-color: #000;
					box-shadow: 4rpx 4rpx 12rpx rgba(255, 255, 255, 0.2);
				}

				.account-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 24rpx;

					.account-way {
						font-size: 28rpx;
						font-weight: bold;
						color: #3f4040;
					}

					.account-status {
						font-size: 24rpx;

						.status-active {
							color: #149d4f;
							background: rgba(7, 193, 96, 0.1);
							padding: 8rpx 16rpx;
							border-radius: 20rpx;
						}

						.status-inactive {
							color: #b9bdbd;
							background: rgba(185, 189, 189, 0.1);
							padding: 8rpx 16rpx;
							border-radius: 20rpx;
						}
					}
				}

				.account-info {
					display: flex;
					justify-content: space-between;
					align-items: center;
					// margin-bottom: 24rpx;

					.account-number {
						font-size: 26rpx;
						color: #727475;
					}

					.account-actions {
						display: flex;
						gap: 32rpx;

						.action-btn {
							display: flex;
							align-items: center;
							font-size: 24rpx;
							color: #3f4040;

							&.edit {
								color: #76787a;
								margin-right: 24rpx;
							}

							&.delete {
								color: #fd7774;
							}

							text {
								margin-left: 8rpx;
							}
						}
					}
				}

				.qr-code-preview {
					display: flex;
					flex-direction: column;
					align-items: center;
					margin-top: 12rpx;

					.qr-image {
						width: 160rpx;
						height: 160rpx;
						border-radius: 8rpx;
					}

					.qr-tips {
						font-size: 22rpx;
						color: #b9bdbd;
						margin-top: 12rpx;
					}
				}
			}
		}
	}

	.bottom-actions {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(15, 16, 18, 1);
		padding: 24rpx;
		// border-top: 1rpx solid #e8e9ed;
		box-shadow: 0 -4rpx 20rpx rgba(255, 255, 255, 0.2);

		.add-btn {
			background: #fff;
			color: #000;
			height: 80rpx;
			border-radius: 100rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;

			text {
				margin-left: 12rpx;
			}
		}
	}

	.account-form {
		color: #000;

		.form-title {
			font-size: 32rpx;
			// font-weight: bold;
			text-align: center;
			padding: 32rpx 0;
			border-bottom: 1rpx solid #e8e9ed;
		}

		.form-content {
			padding: 32rpx;

			.form-item {
				margin-bottom: 32rpx;

				.label {
					font-size: 26rpx;
					color: #3f4040;
					margin-bottom: 16rpx;
				}

				.upload-area {
					height: 200rpx;
					border: 2rpx dashed #e8e9ed;
					border-radius: 12rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					overflow: hidden;

					.qr-upload-image {
						width: 100%;
						height: 100%;
					}

					.upload-placeholder {
						display: flex;
						flex-direction: column;
						align-items: center;

						.upload-text {
							font-size: 24rpx;
							color: #b9bdbd;
							margin-top: 16rpx;
						}
					}
				}

				.switch-item {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.switch-label {
						font-size: 26rpx;
						color: #3f4040;
					}
				}
			}

			.form-actions {
				display: flex;
				justify-content: space-between;
				gap: 24rpx;
				margin-top: 48rpx;

				.action-btn {
					flex: 1;
					height: 80rpx;
					border-radius: 100rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 28rpx;

					&.cancel {
						background: #fff;
						color: #3f4040;
						border: 1rpx solid #e8e9ed;
					}

					&.confirm {
						margin-left: 24rpx;
						background: #000;
						color: #fff;

						&.disabled {
							background: #b9bdbd;
						}
					}
				}
			}
		}
	}
</style>