<template>
	<view class="all">
		<navbar :title="$lang('登录')" :backfuc='backfuc'></navbar>
		<view class="tabs">
			<u-tabs inactive-color='#979d9d' active-color='#fff' bg-color="rgba(0,0,0,0)" height='50' font-size='24'
				:list="list" :is-scroll="false" :current="current" @change="change"></u-tabs>
		</view>
		<view class="inputerbox">
			<view class="inputitem" v-if="current==0">
				<view class="input" :style="{border:input1border?'1px solid #fff':''}">
					<u-input :placeholder='$lang("邮箱")' :custom-style='inputstyle' v-model="mail"
						@blur="input1border=false" @focus="input1border=true" />
				</view>
			</view>
			<view class="inputitem" v-if="current==1">
				<view class="input" :style="{border:input1border?'1px solid #fff':''}">
					<u-input :placeholder='$lang("手机号")' :custom-style='phoneinputstyle' v-model="phone"
						@blur="input1border=false" @focus="input1border=true" />
					<view class="contury">
						<image src="@/static/icons/russia.png" mode="aspectFill"></image> +7
					</view>
				</view>
			</view>
			<view class="inputitem" v-if="mode==1">
				<view class="title">{{$lang('密码')}}</view>
				<view class="input" :style="{border:input2border?'1px solid #fff':''}">
					<u-input type='password' :placeholder='$lang("密码")' :custom-style='inputstyle' v-model="password"
						@blur="input2border=false" @focus="input2border=true" />
				</view>
			</view>
			<view class="regbtn" @click="mode==2?regaccount():dologin()">
				{{$lang('登录')}}
			</view>
			<view class="tologin">
				{{$lang('没有账号？')}}<span @click="$u.route('/pages/otherpages/reg');">{{$lang('注册')}}</span>
			</view>
			<u-divider margin-top='48' fontSize='24' bg-color='rgba(0,0,0,0)'>{{$lang('或使用其他方式')}}</u-divider>
			<view v-if="mode==1" class="phonebtn" @click="mode=2">
				{{$lang('验证码')}}
			</view>
			<view v-if="mode==2" class="phonebtn" @click="mode =1">
				{{$lang('密码')}}
			</view>
		</view>
		<u-modal z-index='8' confirm-color='#001427' @confirm="confirm" :async-close="true" :title='$lang("身份校验")'
			:cancel-text='$lang("取消")' :confirm-text='tips' show-cancel-button @tap="getCode" v-model="showverfy">
			<view class="putver">
				<u-message-input focus @finish='varicode' active-color='#808383'></u-message-input>
				<u-verification-code :seconds="seconds" @end="end" @start="start" ref="uCode"
				:start-text="$lang('获取验证码')" :end-text="$lang('重新获取')" :change-text="'X'+$lang('获取验证码')"	@change="codeChange" ></u-verification-code>
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
				list: [{
					name: this.$lang('邮箱')
				}, {
					name: this.$lang('手机号')
				}],
				current: 0,
				tips: '',
				seconds: 10,
				showverfy: false,
				mode: 1,
				mail: '',
				phone: '',
				password: '',
				invite_code: '',
				phoneinputstyle: {
					padding: '0 24rpx 0 120rpx',
					color: '#fff'
				},
				inputstyle: {
					padding: '0 24rpx',
					color: '#fff'
				},
				value: '',
				input1border: false,
				input2border: false,
				input3border: false
			}
		},
		methods: {
			backfuc() {
				uni.reLaunch({
					url: '/pages/index/index'
				})
			},
			varify() {
				if (this.mode == 1) {
					if (this.current == 0 && !this.mail) {
						this.$u.toast(this.$lang('请填写邮箱'))
						return false
					}
					if (this.current == 1 && !this.phone) {
						this.$u.toast(this.$lang('请填写手机号'))
						return false
					}
					if (!this.password) {
						this.$u.toast(this.$lang('请填写密码'))
						return false
					}
				} else {
					if (this.current == 0 && !this.mail) {
						this.$u.toast(this.$lang('请填写邮箱'))
						return false
					}
					if (this.current == 1 && !this.phone) {
						this.$u.toast(this.$lang('请填写手机号'))
						return false
					}
				}
				return true
			},
			dologin(e) {
				if (!this.varify()) {
					return
				}
				this.loading = true
				let postinfo = {
					account: null,
					password: null,
					scene: null,
					code: null
				}
				postinfo.account = (this.current == 1 ? this.phone : this.mail)
				postinfo.password = this.password
				postinfo.scene = (this.mode != 2 ? 1 : (this.current == 1 ? 2 : 4))
				if (this.mode == 2) {
					postinfo.code = e
				}
				// console.log(postinfo)
				// return
				this.$reqPost('login', postinfo).then(res => {
					uni.setStorageSync('token', res.data.data.token)
					uni.reLaunch({
						url: '/pages/index/index'
					})
				}).finally(v => {
					this.loading = false
				})
			},
			change(index) {
				this.current = index;
			},
			varicode(e) {
				this.dologin(e)
			},
			regaccount() {
				if (!this.varify()) {
					return
				}
				if (this.mode == 2) {
					this.showverfy = true
					this.$nextTick(() => {
						this.getCode()
					})
				}
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
							scene: 'YZMDL',
							type: this.current != 1 ? 'email' : 'mobile',
							email: this.current != 1 ? this.mail : null,
							mobile: this.current == 1 ? '+7' + this.phone : null,
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
				} else {
					// this.$u.toast('倒计时结束后再发送');
				}
			},
			end() {
				// this.$u.toast('倒计时结束');
			},
			start() {
				// this.$u.toast('倒计时开始');
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.u-input__right-icon {
		right: 24rpx;
		position: relative;
	}

	.tabs {
		width: 200rpx;
		position: relative;
		left: -28rpx;
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
		margin-top: 24rpx;

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