<template>
	<view class="all">
		<navbar title="身份认证"></navbar>
		<view class="auth-status" v-if="authInfo.status_code==1">
			<view class="status-icon">
				<u-icon name="checkmark-circle" color="#0f763c" size="80"></u-icon>
			</view>
			<view class="status-text">您已完成身份认证</view>
			<view class="status-desc">认证时间：{{authInfo.authTime}}</view>
		</view>
		<view class="auth-status" v-else>
			<view class="status-icon">
				<u-icon name="info-circle" color="#767d81" size="80" v-if="authInfo.status_code==0"></u-icon>
				<u-icon name="close-circle" color="#7f0906" size="80" v-else></u-icon>
			</view>
			<view class="status-text" v-if="authInfo.status_code==-1">您尚未完成身份认证</view>
			<view class="status-text" v-if="authInfo.status_code==2">您的申请未被通过，请重新提交</view>
			<view class="status-text" v-if="authInfo.status_code==0">申请中,请等待</view>
			<view class="status-desc" v-if="authInfo.status_code==-1">完成身份认证后，您将获得更多功能权限</view>
			<view class="status-desc" v-if="authInfo.status_code==2">拒绝原因：{{authInfo.refuse_msg}}</view>
		</view>
		<view class="auth-form" v-if="!authInfo.status">
			<view class="title">认证信息</view>
			<view class="form-item">
				<view class="label">真实姓名</view>
				<u-input 
					v-model="authInfo.realName" 
					placeholder="请输入您的真实姓名"
					:custom-style="inputStyle"
					:border="true"
					:border-color="borderColor"
				/>
			</view>
			<view class="form-item">
				<view class="label">证件号</view>
				<u-input 
					v-model="authInfo.idCard" 
					placeholder="请输入您的证件号码"
					:custom-style="inputStyle"
					:border="true"
					:border-color="borderColor"
					maxlength="18"
				/>
			</view>
			
			<view class="form-item">
				<view class="label">证件正面</view>
				<view class="upload-area" @click="uploadIdCard('front')">
					<image 
						v-if="authInfo.idCardFront" 
						:src="authInfo.idCardFront" 
						mode="aspectFit"
						class="id-card-img"
					></image>
					<view v-else class="upload-placeholder">
						<u-icon name="photo" color="#b9bdbd" size="48"></u-icon>
						<view class="upload-text">上传证件正面</view>
					</view>
				</view>
			</view>
			
			<view class="form-item">
				<view class="label">证件反面</view>
				<view class="upload-area" @click="uploadIdCard('back')">
					<image 
						v-if="authInfo.idCardBack" 
						:src="authInfo.idCardBack" 
						mode="aspectFit"
						class="id-card-img"
					></image>
					<view v-else class="upload-placeholder">
						<u-icon name="photo" color="#b9bdbd" size="48"></u-icon>
						<view class="upload-text">上传证件反面</view>
					</view>
				</view>
			</view>

			<view class="submit-btn">
				<button 
					class="auth-btn" 
					:class="{disabled: !canSubmit}" 
					@click="submitAuth"
				>
					提交认证
				</button>
			</view>
		</view>

		<view class="tips-section" v-if="!authInfo.status">
			<view class="tips-title">认证说明</view>
			<view class="tips-content">
				<view class="tip-item">1. 请确保提交的身份证信息真实有效</view>
				<view class="tip-item">2. 身份证照片需清晰、完整、无反光</view>
				<view class="tip-item">3. 认证信息提交后将在1-3个工作日内完成审核</view>
				<view class="tip-item">4. 平台不会泄露用户任何信息，该实名仅用于C2C交易</view>
			</view>
		</view>
		
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
				agreementChecked: false,
				authInfo: {
					status_code: -1, //0待审核
					status: false,
					refuse_msg:'',
					realName: '',
					idCard: '',
					idCardFront: '',
					idCardBack: '',
					authTime: '',
					idCardMasked: '',
					pass_time:''
				},
				inputStyle: {
					fontSize: '24rpx',
					height: '80rpx',
					padding: '0 20rpx',
					color:'#fff'
				},
				borderColor: '#e8e9ed'
			}
		},
		computed: {
			canSubmit() {
				return this.authInfo.realName && 
					   this.authInfo.idCard && 
					   this.authInfo.idCardFront && 
					   this.authInfo.idCardBack 
			}
		},
		onLoad() {
			this.getAuthInfo();
		},
		methods: {
			getAuthInfo() {
				this.loading = true;
				this.$reqGet("usercenter").then(res=>{
					if(res.data.data.real_status==-1||res.data.data.real_status==2){
						this.authInfo.status = false
					}else{
						this.authInfo.status = true
					}
					this.authInfo.status_code = res.data.data.real_status
					this.authInfo.refuse_msg = res.data.data.refuse_msg
					this.authInfo.authTime = res.data.data.pass_time
					
				}).finally(v=>{
					this.loading = false
				})
			},
			
			uploadIdCard(type) {
				uni.chooseImage({
					count: 1,
					success: res => {
						if(res.tempFiles[0].size > 1024 * 1024 * 5) {
							uni.showToast({
								title: '图片太大,请控制在5MB内',
								icon: 'none'
							})
							return
						}
						const filePath = res.tempFilePaths[0];
						this.loading = true;
						
						// 模拟上传过程
						this.$fuc.uploadImgae(filePath).then(result => {
							console.log(result)
							if(type === 'front') {
								this.authInfo.idCardFront = result;
							} else {
								this.authInfo.idCardBack = result;
							}
							this.loading = false;
						}).catch(error => {
							this.loading = false;
						});
					}
				});
			},
			
			submitAuth() {
				if(!this.canSubmit){
					uni.showToast({
						title:'请先完善信息',
						icon:'none'
					})
					return;
				} 
				this.loading = true;
				// 模拟提交认证信息
				
				this.$reqPost("userReal",{
					id_number:this.authInfo.idCard,
					real_name:this.authInfo.realName,
					front_img:this.authInfo.idCardFront,
					back_img:this.authInfo.idCardBack
				}).then(res=>{
					uni.showToast({
						title: '提交成功，等待审核',
						icon: 'none'
					});
					this.getAuthInfo()
				}).finally(v=>{
					this.loading = false;
				})
					
					
			},
			maskIdCard(idCard) {
				if(!idCard) return '';
				return idCard.substring(0, 6) + '********' + idCard.substring(14);
			},
			
			formatDate(date) {
				const year = date.getFullYear();
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const day = date.getDate().toString().padStart(2, '0');
				const hour = date.getHours().toString().padStart(2, '0');
				const minute = date.getMinutes().toString().padStart(2, '0');
				return `${year}-${month}-${day} ${hour}:${minute}`;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.all {
		padding-bottom: 40rpx;
	}
	
	.auth-status {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 60rpx 0 40rpx;
		
		.status-icon {
			margin-bottom: 24rpx;
		}
		
		.status-text {
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 16rpx;
		}
		
		.status-desc {
			font-size: 24rpx;
			color: #b9bdbd;
		}
	}
	
	.auth-form, .auth-info {
		margin-top: 24rpx;
		padding: 0 24rpx;
		
		.title {
			margin-bottom: 24rpx;
			font-size: 32rpx;
			font-weight: bold;
		}
	}
	
	.form-item {
		margin-bottom: 32rpx;
		
		.label {
			font-size: 26rpx;
			margin-bottom: 16rpx;
			color: #e1e5e9;
		}
		
		.upload-area {
			height: 200rpx;
			border: 2rpx dashed #e8e9ed;
			border-radius: 12rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			overflow: hidden;
			
			.id-card-img {
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
	}
	
	.agreement {
		margin-top: 40rpx;
		
		.agreement-check {
			display: flex;
			align-items: center;
			
			.agreement-text {
				font-size: 24rpx;
				margin-left: 16rpx;
				color: #3f4040;
				
				.highlight {
					color: #007AFF;
				}
			}
		}
	}
	
	.submit-btn {
		margin-top: 60rpx;
		
		.auth-btn {
			width: 100%;
			height: 80rpx;
			background-color: #ffffff;
			color: #040505;
			border-radius: 100rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;
			
			&.disabled {
				background-color: #787a7c;
				color: #fff;
			}
		}
	}
	
	.info-item-list {
		font-size: 24rpx;
		background-color: #fff;
		border-radius: 12rpx;
		padding: 0 24rpx;
		
		.info-item {
			padding: 32rpx 0;
			border-bottom: 1rpx solid #e8e9ed;
			display: flex;
			align-items: center;
			justify-content: space-between;
			
			.value {
				color: #b9bdbd;
				
				&.status-verified {
					color: #07c160;
				}
			}
		}
	}
	
	.tips-section {
		margin-top: 48rpx;
		padding: 0 24rpx;
		
		.tips-title {
			font-size: 28rpx;
			margin-bottom: 16rpx;
			font-weight: bold;
		}
		
		.tips-content {
			background-color: #e1e4e4;
			border-radius: 12rpx;
			padding: 24rpx;
			
			.tip-item {
				font-size: 24rpx;
				color: #575859;
				margin-bottom: 12rpx;
				line-height: 1.5;
				
				&:last-child {
					margin-bottom: 0;
				}
			}
		}
	}
</style>