<template>
	<view class="all">
		<navbar :title="$lang('注册')" :backfuc='backfuc'></navbar>
		<view class="title">
			<view class="titletxt1">{{mode==1?$lang('添加邮箱地址'):$lang('添加手机号')}}</view>
			<view class="titletxt2">
				{{$lang('此')}}{{mode==1?$lang('邮箱地址'):$lang('手机号')}}{{$lang('将成为您的登录账号，也是您访问我们提供的全部服务的关键。')}}</view>
		</view>
		<view class="inputerbox">
			<view class="inputitem" v-if="mode==1">
				<view class="title">{{$lang('邮箱')}}</view>
				<view class="input" :style="{border:input1border?'1px solid #fff':''}">
					<u-input :placeholder='$lang("邮箱")' :custom-style='inputstyle' v-model="mail"
						@blur="input1border=false" @focus="input1border=true" />
				</view>
			</view>
			<view class="inputitem" v-if="mode==2">
				<view class="title">{{$lang('手机号')}}</view>
				<view class="input" :style="{border:input1border?'1px solid #fff':''}">
					<u-input :placeholder='$lang("手机号")' :custom-style='phoneinputstyle' v-model="phone"
						@blur="input1border=false" @focus="input1border=true" />
					<view class="contury">
						<image src="@/static/icons/russia.png" mode="aspectFill"></image> +7
					</view>
				</view>
			</view>
			<view class="inputitem">
				<view class="title">{{$lang('密码')}}</view>
				<view class="input" :style="{border:input2border?'1px solid #fff':''}">
					<u-input type='password' :placeholder='$lang("密码")' :custom-style='inputstyle' v-model="password"
						@blur="input2border=false" @focus="input2border=true" />
				</view>
			</view>
			<view class="inputitem">
				<view class="title">{{$lang('邀请码(选填)')}}</view>
				<view class="input" :style="{border:input3border?'1px solid #fff':''}">
					<u-input :placeholder='$lang("邀请码(选填)")' :custom-style='inputstyle' v-model="invite_code"
						@blur="input3border=false" @focus="input3border=true" />
				</view>
			</view>

			<view class="regbtn" @click="regaccount">
				{{$lang('注册')}}
			</view>
			<view class="tologin">
				{{$lang('已有账号？')}}<span @click="$u.route('/pages/otherpages/login');">{{$lang('登录')}}</span>
			</view>
			<u-divider margin-top='48' fontSize='24' bg-color='rgba(0,0,0,0)'>{{$lang('或使用其他方式')}}</u-divider>
			<view v-if="mode==1" class="phonebtn" @click="mode=2">
				{{$lang('手机号')}}
			</view>
			<view v-if="mode==2" class="phonebtn" @click="mode =1">
				{{$lang('邮箱')}}
			</view>
		</view>
		<u-modal z-index='8' confirm-color='#001427' @confirm="confirm" :async-close="true" :title='$lang("身份校验")'
			:confirm-text='tips' show-cancel-button @tap="getCode" v-model="showverfy">
			<view class="putver">
				<u-message-input focus @finish='messagefinish' active-color='#808383'></u-message-input>
				<u-verification-code :seconds="seconds" @end="end" @start="start" ref="uCode"
					@change="codeChange"></u-verification-code>
				<!-- <view class="getcode">
					<view class="getcodebtn" @tap="getCode">
						{{tips}}
					</view>
				</view> -->
			</view>
		</u-modal>
		<u-toast ref="uToast"></u-toast>
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
				loading: false,
				tips: '',
				seconds: 10,
				showverfy: false,
				mode: 1,
				mail: '',
				phone: '',
				password: '',
				invite_code: '',
				inputstyle: {
					padding: '0 24rpx',
					color: '#fff'
				},
				phoneinputstyle: {
					padding: '0 24rpx 0 120rpx',
					color: '#fff'
				},
				value: '',
				input1border: false,
				input2border: false,
				input3border: false
			}
		},
		onLoad(e) {
			if (e.invite_code) {
				this.invite_code = e.invite_code
			}
		},
		methods: {
			backfuc() {
				uni.reLaunch({
					url: '/pages/index/index'
				})
			},
			varify() {
				if (this.mode == 1 && !this.mail) {
					this.$u.toast(this.$lang('请填写邮箱'))
					return false
				} else if (this.mode == 1 && this.mail) {
					if (!this.validateEmail(this.mail)) {
						this.$u.toast(this.$lang('请填写正确邮箱'))
						return false
					}
				}
				if (this.mode == 2 && !this.phone) {
					this.$u.toast(this.$lang('请填写手机号'))
					return false
				}
				if (!this.password) {
					this.$u.toast(this.$lang('请填写密码'))
					return false
				}
				if (!this.validatePassword(this.password)) {
					this.$u.toast(this.$lang('密码必须包含字母和数字，并且大于6位'))
					return false
				}
				return true
			},
			doreg(e) {
				if (!this.varify()) {
					return
				}
				this.loading = true
				this.$reqPost('register', {
					type: this.mode == 1 ? 'email' : 'mobile',
					password: this.password,
					password_confirm: this.password,
					email: this.mode == 1 ? this.mail : '',
					mobile: this.mode == 2 ? '+7' + this.phone : '',
					invite_code: this.invite_code,
					code: e,
				}).then(res => {
					localStorage.setItem('token', res.data.data.token)
					uni.reLaunch({
						url: '/pages/index/index'
					})
				}).finally(v => {
					this.loading = false
				})
			},
			messagefinish(e) {
				this.doreg(e)
			},
			regaccount() {
				if (!this.varify()) {
					return
				}
				this.showverfy = true
				this.$nextTick(() => {
					this.getCode()
				})
			},
			confirm() {
				this.getCode()
			},
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				if (this.$refs.uCode.canGetCode) {
					uni.showLoading({
						title: this.$lang('正在获取验证码')
					})
					this.$reqPost('sendCode', {
							scene: 'ZCYZM',
							type: this.mode == 1 ? 'email' : 'mobile',
							email: this.mode == 1 ? this.mail : null,
							mobile: this.mode == 2 ? '+7' + this.phone : null,
						}).then(res => {
							uni.hideLoading();
							// 这里此提示会被this.start()方法中的提示覆盖
							this.$u.toast(this.$lang('验证码已发送'));
							// 通知验证码组件内部开始倒计时
							this.$refs.uCode.start();
						})
						.catch(err => {
							this.showverfy = false
							uni.hideLoading();
						})
					// 模拟向后端请求验证码
				} else {
					// this.$u.toast('倒计时结束后再发送');
				}
			},
			end() {
				// this.$u.toast('倒计时结束');
			},
			start() {
				// this.$u.toast('倒计时开始');
			},
			validateEmail(email) {
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				return emailRegex.test(email);
			},
			validatePassword(password) {
				// 至少6位，包含字母和数字
				const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
				return passwordRegex.test(password);
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.u-input__right-icon {
		right: 24rpx;
		position: relative;
	}

	.getcode {
		width: 100%;
		height: 88rpx;
		display: flex;
		align-items: center;
		justify-content: center;

		.getcodebtn {
			background-color: #b7b8c6;
			border-radius: 8rpx;
			padding: 6rpx 12rpx;
			font-size: 24rpx;
			color: #faffff
		}
	}

	.putver {
		padding: 24rpx 0;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.tologin {
		margin-top: 24rpx;
		text-align: center;
		font-size: 24rpx;
		color: #c9ccd5;

		span {
			font-weight: bold;
			text-decoration: underline;
		}
	}

	.phonebtn {
		margin-top: 48rpx;
		width: 100%;
		height: 80rpx;
		border-radius: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid #fff;
	}

	.regbtn {
		margin-top: 48rpx;
		width: 100%;
		height: 80rpx;
		border-radius: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		color: #000;
	}

	.inputerbox {
		margin-top: 66rpx;

		.inputitem {
			margin-bottom: 24rpx;

			.contury {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 120rpx;
				position: absolute;
				left: 0;

				image {
					margin-right: 6rpx;
					width: 40rpx;
					height: 26rpx;
				}
			}

			.input {
				position: relative;
				background-color: #343536;
				margin-top: 12rpx;
				display: flex;
				align-items: center;
				width: 100%;
				border: 1px solid #343536;
				border-radius: 10rpx;
			}

			.title {
				font-size: 24rpx;
			}
		}
	}

	.titletxt2 {
		margin-top: 10rpx;
		font-size: 26rpx;
	}

	.titletxt1 {
		font-size: 56rpx;
	}

	.all {
		padding: 80rpx 64rpx;
	}
</style>