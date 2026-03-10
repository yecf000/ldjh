<template>
	<view class="all">
		<navbar :title="$lang('个人资料')"></navbar>
		<view class="avatarpart" @click="uploadimg">
			<view class="avatarpartbox">
				<image :src="userinfo.avatar||'@/static/icons/defaultavatar.png'" mode="aspectFill">
				</image>
				<view class="dec">
					<u-icon name="edit-pen-fill" color="#3f4040" size="32"></u-icon>
				</view>
			</view>
		</view>
		<view class="accontinfo">
			<view class="title">
				{{$lang('账号信息')}}
			</view>
			<view class="infoitemlist">
				<view class="infoitem">
					<view>{{$lang('昵称')}}</view>
					<view class="rightpart" @click="showpop=true,nickname=userinfo.nickname">
						<view class="value">{{userinfo.nickname||''}}</view>
						<u-icon style="margin-left: 12rpx;" name="arrow-right" color="#b9bdbd" size="28"></u-icon>
					</view>
				</view>
				<view class="infoitem">
					<view>UID</view>
					<view class="rightpart" @click="copy">
						<view class="value">{{userinfo.sn||''}}</view>
						<u-icon style="margin-left: 12rpx;" name="file-text" color="#b9bdbd" size="28"></u-icon>
					</view>
				</view>
				<view class="infoitem">
					<view>{{$lang('邮箱')}}</view>
					<view class="rightpart">
						<view class="value">123***@qq.com</view>
					</view>
				</view>
				<view class="infoitem">
					<view>{{$lang('手机')}}</view>
					<view class="rightpart">
						<view class="value">{{userinfo.mobile||'-'}}</view>
					</view>
				</view>
				<view class="infoitem" style="border: none;">
					<view>{{$lang('登录密码')}}</view>
					<view class="rightpart" @click="showpspop=true">
						<view class="value">{{'******'}}</view>
						<u-icon style="margin-left: 12rpx;" name="arrow-right" color="#b9bdbd" size="28"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<view class="accontinfo" style="margin-top: 48rpx;">
			<view class="title">
				{{$lang('其他信息')}}
			</view>
			<view class="infoitemlist">
				<view class="infoitem" @click="$u.route('/pages/otherpages/realname');">
					<view>{{$lang('实名认证')}}</view>
					<view class="rightpart">
						<view class="value">{{userinfo.real_status==1?$lang('已认证'):$lang('未认证')}}</view>
						<u-icon v-if="userinfo.real_status!=1" style="margin-left: 12rpx;" name="arrow-right"
							color="#b9bdbd" size="28"></u-icon>
					</view>
				</view>
				<view class="infoitem" @click="$u.route('/pages/otherpages/payways');">
					<view>{{$lang('收款渠道')}}</view>
					<view class="rightpart">
						<view class="value">{{$lang('未启用')}}</view>
						<u-icon style="margin-left: 12rpx;" name="arrow-right" color="#b9bdbd" size="28"></u-icon>
					</view>
				</view>
				<view class="infoitem" style="border: none;" @click="$u.route('/pages/otherpages/level');">
					<view>{{$lang('会员等级')}}</view>
					<view class="rightpart">
						<view class="value">{{$lang('普通会员')}}</view>
						<u-icon style="margin-left: 12rpx;" name="arrow-right" color="#b9bdbd" size="28"></u-icon>
					</view>
				</view>
			</view>
			<view class="qiutbtview">
				<view class="qiutbt" @click="qiutlogin">
					{{$lang('退出登录')}}
				</view>
			</view>
		</view>
		<u-popup z-index='7' v-model="showpop" mode="bottom" border-radius="18">
			<view class="datachange">
				<view class="tab">
					<view>{{$lang('昵称')}}</view>
					<u-icon @click="showpop=false" name="close" color="#000" size="24"></u-icon>
				</view>
				<view class="inuter">
					<view class="tips">
						{{$lang('您的昵称将显示于交易和聊天')}}
					</view>
					<u-input @focus='actived=true' @blur='actived=false' :border-color="actived?'#000':''" clearable
						:maxlength='12' :custom-style='custyle' v-model="nickname" :border="true" />
					<view class="btpart">
						<view class="cancle" @click="showpop=false">{{$lang('取消')}}</view>
						<view class="confirm" @click="nicknameconfirm">{{$lang('确认')}}</view>
					</view>
				</view>
			</view>
		</u-popup>

		<u-popup z-index='7' v-model="showpspop" mode="bottom" border-radius="18">
			<view class="datachange">
				<view class="tab">
					<view>{{$lang('登录密码')}}</view>
					<u-icon @click="showpspop=false" name="close" color="#000" size="24"></u-icon>
				</view>
				<view class="inuter">
					<view class="tips">
						{{$lang('请保管好您的登录密码')}}
					</view>
					<u-input :clearable='false' type='password' :placeholder='$lang("请输入密码")' @focus='actived=true'
						@blur='actived=false' :border-color="actived?'#000':''" :maxlength='12' :custom-style='custyle'
						v-model="newpsw" :border="true" />
					<view class="vericode" style="margin-top: 12rpx;">
						<u-input :clearable='false' :placeholder='$lang("请填写验证码")' @focus='actived2=true'
							@blur='actived2=false' :border-color="actived2?'#000':''" :maxlength='12'
							:custom-style='custyle' v-model="code" :border="true" />
						<view class="codebt" @click="getCode">
							{{tips}}
						</view>
					</view>
					<view class="btpart">
						<view class="cancle" @click="showpspop=false">{{$lang('取消')}}</view>
						<view class="confirm" @click="pswconfirm">{{$lang('确认')}}</view>
					</view>
				</view>
			</view>
		</u-popup>
		<u-verification-code :seconds="seconds" ref="uCode" @change="codeChange"></u-verification-code>
		<zero-loading color='#F0E68C' mask v-if="loading" showText :textColor='$lang("#fff")'
			:maskOpacity='0.8'></zero-loading>
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
				tips: '',
				// refCode: null,
				seconds: 10,
				newpsw: '',
				loading: true,
				actived: false,
				actived2: false,
				nickname: '',
				showpop: false,
				showpspop: false,
				custyle: {
					fontSize: '24rpx'
				},
				userinfo: {

				},
				code: ''
			}
		},
		onLoad() {

		},
		onShow() {
			this.getinfo()
		},
		methods: {
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: this.$lang('正在获取验证码')
					})
					setTimeout(() => {
						uni.hideLoading();
						// 这里此提示会被this.start()方法中的提示覆盖
						this.$u.toast(this.$lang('验证码已发送'));
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start();
					}, 2000);
				} else {
					this.$u.toast(this.$lang('倒计时结束后再发送'));
				}
			},
			uploadimg() {
				uni.chooseImage({
					count: 1,
					success: res => {
						if (res.tempFiles[0].size > 1024 * 1024 * 5) {
							uni.showToast({
								title: this.$lang('图片太大,请控制在5MB内'),
								icon: 'none'
							})
							return
						}
						const filePath = res.tempFilePaths[0];
						this.$fuc.uploadImgae(filePath).then(result => {
							this.updateinfo('avatar', result)
						}).catch(error => {
							console.error('上传失败', error);
						});
					}
				});
			},
			nicknameconfirm() {
				if (!this.nickname) {
					this.$u.toast(this.$lang('请填写昵称'))
				} else {
					this.updateinfo('nickname', this.nickname)
				}
			},
			updateinfo(field, value) {
				this.loading = true
				this.$reqPost('setInfo', {
					field,
					value,
				}).then(res => {
					uni.showToast({
						title: field == 'avatar' ? this.$lang('头像已更新') : this.$lang('昵称已更新'),
						icon: 'none'
					})
					this.getinfo()
				}).finally(v => {
					this.loading = false
					this.showpop = false
					this.showpspop = false
				})
			},
			getinfo() {
				if (localStorage.getItem('token')) {
					this.$reqGet("usercenter").then(res => {
						this.userinfo = res.data.data
						this.loading = false
					})
				}
			},
			qiutlogin() {
				uni.removeStorageSync('token')
				uni.reLaunch({
					url: '/pages/otherpages/login'
				})
			},
			copy() {
				uni.setClipboardData({
					data: '123',
					success: (res) => {
						uni.showToast({
							title: this.$lang('已复制'),
							icon: 'none'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.vericode {
		position: relative;
		display: flex;
		align-items: center;

		.codebt {
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			right: 12rpx;
			background-color: #8a8b9510;
			border-radius: 100rpx;
			// width: 180rpx;
			height: 58rpx;
			font-size: 24rpx;
			padding: 0 24rpx;
			border: thin solid #c1c2c6;
		}
	}

	.datachange {
		color: #000;
		font-size: 24rpx;

		.btpart {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 68rpx;

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
			padding: 28rpx;

			.tips {
				color: #727475;
				margin-bottom: 24rpx;
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

	.qiutbtview {
		padding: 24rpx 0;
	}

	.qiutbt {
		// margin-top: 24rpx;
		width: 100%;
		height: 80rpx;
		background-color: #fff;
		border-radius: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fc000a;
	}

	.infoitemlist {
		font-size: 24rpx;

		.infoitem {
			padding: 32rpx 0;
			border-bottom: 1px solid #333;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.value {
			color: #b9bdbd;
		}

		.rightpart {
			display: flex;
			align-items: center;
		}
	}

	.accontinfo {
		margin-top: 24rpx;
		padding: 0 24rpx;

		.title {
			margin-bottom: 12rpx;
			font-size: 26rpx;
			font-size: 32rpx;
		}
	}

	.avatarpart {
		padding: 24rpx 0;
		display: flex;
		align-items: center;
		justify-content: center;

		.avatarpartbox {
			position: relative;
		}

		.dec {
			width: 50rpx;
			height: 50rpx;
			background-color: #fff;
			border-radius: 50%;
			padding: 4rpx;
			position: absolute;
			right: 0;
			bottom: 0;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		image {
			width: 144rpx;
			height: 144rpx;
			background-color: #2c2c2c;
			border-radius: 50%;
			position: relative;
			// background-image: url('@/static/icons/defaultavatar.png');
			background-size: 100%;
			background-size: cover;
		}
	}
</style>