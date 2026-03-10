<template>
	<view class="all">
		<u-navbar :custom-back='backfuc' :background="background" back-icon-color='#fff' title-color='#fff'>
			<view class="slot-wrap">
				<image :src="rinfo.avatar||'@/static/icons/defaultavatar.png'" mode="aspectFill"></image>
				<view class="nickname">
					{{rinfo.nickname||$lang('玩家')}}
				</view>
			</view>
		</u-navbar>
		<scroll-view scroll-with-animation class="contentpage" :scroll-y="true" :scroll-top="scrolltimes">
			<template v-for="(i,index) in imhistory">
				<view class="contentmitem" v-if="i.suid==userinfo.id" :key='i.time'>
					<view class="time" v-if="index%10==0">
						{{$fuc.formatTimestamp(i.time)||''}}
					</view>
					<view class="content" v-if="i.messagetype=='text'">
						{{i.content||''}}
					</view>
					<view style="max-width: 380rpx;" class="content" v-if="i.messagetype=='order'">

						<view class="statu1" v-if="i.tradetype!=1">
							<view class="line1">
								{{$lang('您有一笔出售订单，等待对方支付')}}
							</view>
							<view class="line2">
								{{$lang('对方正在向你转账，请注意查收')}}
							</view>
						</view>
						<view class="statu2" v-else>
							<view class="line1">
								{{$lang('您有一笔待支付订单，请及时支付')}}
							</view>
							<view class="line2">
								{{$lang('您有一笔待支付订单，请及时支付')}}
							</view>
							<view class="line">

							</view>
							<view class="linebtn" @click="getorderdetal(i.content)">
								{{$lang('去付款')}} <u-icon style="margin-left: 4rpx;" name="arrow-right" color="#fff2f6"
									size="28"></u-icon>
							</view>
						</view>

					</view>

					<view style="max-width: 380rpx;" class="content" v-if="i.messagetype=='trade-confirm'">

						<view class="statu1" v-if="i.tradetype!=1">
							<view class="line1">
								{{$lang('已付款，等待对方确认收款')}}
							</view>
							<view class="line2">
								{{$lang('即将完成本单交易')}}
							</view>
						</view>
						<view class="statu2" v-else>
							<view class="line1">
								{{$lang('对方已完成付款，请确认收款')}}
							</view>
							<view class="line">

							</view>
							<view class="linebtn" @click="getorderdetal(i.content)">
								{{$lang('确认')}} <u-icon style="margin-left: 4rpx;" name="arrow-right" color="#fff2f6"
									size="28"></u-icon>
							</view>
						</view>

					</view>

					<view style="max-width: 380rpx;" class="content" v-if="i.messagetype=='trade-cancel'">
						<view class="statu2">
							<view class="line1">
								{{$lang('订单号')}}：{{i.content}}
							</view>
							<view class="line">

							</view>
							<view class="line2">
								{{$lang('该订单已被取消')}}
							</view>
						</view>
					</view>
					<view style="max-width: 380rpx;" class="content" v-if="i.messagetype=='trade-finish'">
						<view class="statu2">
							<view class="line1">
								{{$lang('交易完成')}}
							</view>
							<view class="line2">
								{{$lang('订单')}} {{i.content}} {{$lang('已经完成交易')}}
							</view>
						</view>
					</view>

					<image v-if="i.messagetype=='img'" @click="showimg(i.content)"
						:src="i.content||'@/static/svg/dec1.svg'" mode="widthFix"></image>
				</view>
				<view class="contentuitem" v-if="i.suid==rinfo.id" :key='i.time'>
					<view class="time" v-if="index%10==0">
						{{$fuc.formatTimestamp(i.time)||''}}
					</view>
					<view class="content" v-if="i.messagetype=='text'">
						{{i.content||''}}
					</view>
					<view style="max-width: 380rpx;" class="content" v-if="i.messagetype=='order'">
						<view class="statu2" v-if='i.tradetype!=1'>
							<view class="line1">
								{{$lang('您有一笔待支付订单，请及时支付')}}
							</view>
							<view class="line2">
								{{$lang('您有一笔待支付订单，请及时支付')}}
							</view>
							<view class="line">

							</view>
							<view class="linebtn" @click="getorderdetal(i.content)">
								{{$lang('去付款')}} <u-icon style="margin-left: 4rpx;" name="arrow-right" color="#fff2f6"
									size="28"></u-icon>
							</view>
						</view>
						<view class="statu1" v-else>
							<view class="line1">
								{{$lang('您有一笔出售订单，等待对方支付')}}
							</view>
							<view class="line2">
								{{$lang('对方正在向你转账，请注意查收')}}
							</view>
						</view>
					</view>
					<view style="max-width: 380rpx;" class="content" v-if="i.messagetype=='trade-confirm'">
						<view class="statu2" v-if="i.tradetype!=1">
							<view class="line1">
								{{$lang('对方已完成付款，请确认收款')}}
							</view>
							<view class="line">

							</view>
							<view class="linebtn" @click="getorderdetal(i.content)">
								{{$lang('确认')}} <u-icon style="margin-left: 4rpx;" name="arrow-right" color="#fff2f6"
									size="28"></u-icon>
							</view>
						</view>

						<view class="statu1" v-else>
							<view class="line1">
								{{$lang('已付款，等待对方确认收款')}}
							</view>
							<view class="line2">
								{{$lang('即将完成本单交易')}}
							</view>
						</view>
					</view>
					<view style="max-width: 380rpx;" class="content" v-if="i.messagetype=='trade-cancel'">
						<view class="statu2">
							<view class="line1">
								{{$lang('订单号')}}：{{i.content}}
							</view>
							<view class="line">

							</view>
							<view class="line2">
								{{$lang('该订单已被取消')}}
							</view>
						</view>
					</view>
					<view style="max-width: 380rpx;" class="content" v-if="i.messagetype=='trade-finish'">
						<view class="statu2">
							<view class="line1">
								{{$lang('交易完成')}}
							</view>
							<view class="line2">
								{{$lang('订单')}} {{i.content}} {{$lang('已经完成交易')}}
							</view>
						</view>
					</view>
					<image v-if="i.messagetype=='img'" @click="showimg(i.content)"
						:src="i.content||'@/static/svg/dec1.svg'" mode="widthFix"></image>
				</view>
			</template>
		</scroll-view>
		<view class="contentpart">
			<view class="inputer">
				<u-input placeholder-style="color: #595c60;" :placeholder='$lang("在此处输入消息")' v-model="message"
					:custom-style='inputstyle' />
				<u-icon @click="uploadimg" style="margin-left: 8rpx;" name="photo" color="#fff" size="44"></u-icon>
			</view>
			<view class="send" @click="sendmessage()">
				<u-icon name="arrow-upward" color="#fff" size="40"></u-icon>
			</view>
		</view>
		<u-popup z-index='7' v-model="showOrderModal" mode="bottom" border-radius="18">
			<view class="datachange order-modal">
				<view class="tab fixed-top">
					<view class="title">{{$lang('订单详情')}}</view>
					<u-icon @click="showOrderModal=false" name="close" color="#000" size="24"></u-icon>
				</view>
				<view class="inuter">
					<!-- 订单基本信息 -->
					<view class="form-item full-width">
						<view class="tips">{{$lang('商家昵称')}}</view>
						<view class="order-value flex">
							<view>{{orderDetail.store?orderDetail.store.title:'-'}}</view>
							<image class="shopava" :src="orderDetail.store?orderDetail.store.avatar:''"
								mode="aspectFill"></image>
						</view>
					</view>
					<view class="form-item full-width">
						<view class="tips">{{$lang('订单号')}}</view>
						<view class="order-value">{{orderDetail.sn || '-'}}</view>
					</view>

					<view class="form-item">
						<view class="tips">{{$lang('订单状态')}}</view>
						<view class="order-value status" :class="'status-' + orderDetail.status">
							{{getStatusText(orderDetail.status)}}
						</view>
					</view>
					<view class="form-item">
						<view class="tips">{{$lang('订单类型')}}</view>
						<view class="order-value">{{orderDetail.type === 1 ? $lang('客户卖出') : $lang('客户买入')}}</view>
					</view>
					<view class="form-item">
						<view class="tips">{{$lang('交易数量')}}</view>
						<view class="order-value">{{orderDetail.amount || '0.00'}}</view>
					</view>
					<view class="form-item">
						<view class="tips">{{$lang('交易单价')}}</view>
						<view class="order-value">{{orderDetail.entrust?orderDetail.entrust.price|| '0.00':'-'}}
							{{orderDetail.entrust?orderDetail.entrust.unit:''}}
						</view>
					</view>
					<view class="form-item">
						<view class="tips">{{$lang('交易金额')}}</view>
						<view class="order-value">
							{{orderDetail.entrust?(Number(orderDetail.entrust.price)*Number(orderDetail.amount)).toFixed(2) :'-'}}
							{{orderDetail.entrust?orderDetail.entrust.unit:''}}
						</view>
					</view>
					<view class="form-item">
						<view class="tips">{{$lang('交易方式')}}</view>
						<view class="order-value">{{orderDetail.entrust?orderDetail.entrust.deal_way:'-'}}</view>
					</view>
					<view class="form-item" v-if="orderDetail.type==0">
						<view class="tips">{{$lang('交易账户')}}</view>
						<view class="order-value" @click="copyvalue(orderDetail.entrust.contact_way)">
							{{orderDetail.entrust?orderDetail.entrust.contact_way:'-'}}
							<image class="copyicon" src="@/static/icons/blackcopy.png" mode="aspectFill"></image>
						</view>
					</view>
					<view class="form-item" v-if="orderDetail.type==1">
						<view class="tips">{{$lang('交易账户')}}</view>
						<view class="order-value" @click="copyvalue(orderDetail.user.account)">
							{{orderDetail.user?orderDetail.user.account:'-'}}
							<image class="copyicon" src="@/static/icons/blackcopy.png" mode="aspectFill"></image>
						</view>
					</view>

					<view class="form-item">
						<view class="tips">{{$lang('下单时间')}}</view>
						<view class="order-value">{{(orderDetail.create_time)}}</view>
					</view>
					<view class="form-item">
						<view class="tips">{{$lang('支付时间')}}</view>
						<view class="order-value">
							{{orderDetail.pay_time ? $fuc.formatDate(orderDetail.pay_time) : '--'}}
						</view>
					</view>
					<view class="form-item">
						<view class="tips">{{$lang('确认时间')}}</view>
						<view class="order-value">
							{{orderDetail.confirm_time ? $fuc.formatDate(orderDetail.confirm_time) : '--'}}
						</view>
					</view>
				</view>
				<view class="btpart fixed-bottom"
					v-if="orderDetail.status === 0 && ((orderDetail.type==0&&orderDetail.entrust.user_id==rinfo.id)||(orderDetail.type==1&&orderDetail.entrust.user_id!=rinfo.id))">
					<view class="cancle" @click="showordercancle=true">{{$lang('取消订单')}}</view>
					<view class="confirm" @click="showpaysuccess=true">{{$lang('完成支付')}}</view>
				</view>
				<view class="btpart fixed-bottom"
					v-if="orderDetail.status === 1&& ((orderDetail.type==0&&orderDetail.entrust.user_id!=rinfo.id)||(orderDetail.type==1&&orderDetail.entrust.user_id==rinfo.id))">
					<view style="color: #570509;" class="cancle" @click="showorderreport=true">{{$lang('订单申诉')}}</view>
					<view class="confirm" @click="showordersuccess=true">{{$lang('确认收款')}}</view>
				</view>
			</view>
		</u-popup>
		<!-- 完成付款 -->
		<u-modal :confirm-text='$lang("确认")' :cancel-text='$lang("稍后")' v-model="showpaysuccess"
			:content="$lang('是否确认完成付款')" show-cancel-button confirm-color='#a35f08'
			@confirm="ordercommandconfirm"></u-modal>
		<!-- 完成订单 -->
		<u-modal :confirm-text='$lang("确认")' :cancel-text='$lang("稍后")' v-model="showordersuccess"
			:content="$lang('是否确认完成订单')" show-cancel-button confirm-color='#a35f08'
			@confirm="ordercommandfinish"></u-modal>

		<!-- 取消订单 -->
		<u-modal :confirm-text='$lang("确认")' :cancel-text='$lang("取消")' v-model="showordercancle"
			:content="$lang('是否确认取消该订单')" show-cancel-button confirm-color='#a35f08'
			@confirm="ordercommandcancle"></u-modal>
		<!-- 申诉订单 -->
		<u-modal :confirm-text='$lang("确认")' :cancel-text='$lang("取消")' v-model="showorderreport"
			:content="$lang('是否确认申诉该订单')" show-cancel-button confirm-color='#a35f08'
			@confirm="ordercommandreport"></u-modal>
		<zero-loading color='#F0E68C' mask v-if="loading" showText textColor='#fff' :maskOpacity='0.8'></zero-loading>
	</view>
</template>

<script>
	import {
		wssURL
	} from '@/utils/env.js'
	import {
		data
	} from 'uview-ui/libs/mixin/mixin';
	import navbar from '@/components/navbar.vue'
	export default {
		components: {
			navbar
		},
		data() {
			return {
				showorderreport: false,
				showordercancle: false,
				showordersuccess: false,
				showpaysuccess: false,
				loading: true,
				imhistory: [],
				scrolltimes: 0,
				// =======================游戏层
				goingstatu: false,
				instatu: false,
				canin: false,
				outstatu: false,
				canoutstatu: false,
				wsgamestatu: 'preparation', //preparation准备阶段  playing游戏阶段  settlement结算阶段
				wscurrentTime: 0,
				socket: null,
				isConnected: false,
				message: '',
				messages: [],
				reconnectTimer: null,
				playerList: [],
				// =======================
				inputstyle: {
					color: '#fff'
				},
				message: '',
				background: {
					backgroundColor: "rgba(0, 0, 0, 1.0)",
				},
				ws: null,
				userinfo: {},
				rinfo: {
					id: '',
					nickname: '',
					avatar: ''
				},
				pagews: false,
				cid: 0,
				showOrderModal: false,
				orderDetail: {},
				readypayid: 0
			}
		},
		computed: {
			connectionStatus() {
				if (this.isConnected) {
					return {
						text: $lang('已连接'),
						class: 'connected'
					};
				} else {
					return {
						text: $lang('未连接'),
						class: 'disconnected'
					};
				}
			}
		},

		onLoad(e) {
			this.$reqGet("usercenter").then(res => {
				this.userinfo = res.data.data
			}).finally(v => {
				this.loading = false
				this.srolltobottom()
			})
			// else{
			// 	localStorage.setItem('token','3ed8801c93d787434e0c9087a9d8004b')
			// }
			if (e.cid) {
				this.cid = e.cid
				this.gettalkhis()
			}
			if (e.ruid) {
				this.getuserinfo(e.ruid)
			}
			this.ws = getApp().globalData.webSocket;
			this.scrolltimes = Date.now()
			if (!this.ws) {
				this.pagews = true
				setTimeout(() => {
					this.connect()
				}, 1000)
			}
			// 监听 WebSocket 消息
			uni.$on('global-websocket-message', this.handleWSMessage);
		},
		onUnload() {
			// 移除监听
			if (this.pagews) {
				this.disconnect()
				getApp().globalData.webSocket = null
			}
			uni.$off('global-websocket-message', this.handleWSMessage);
		},
		methods: {
			ordercommandconfirm() {
				this.loading = true
				this.$reqPost('orderpay', {
					sn: this.orderDetail.sn
				}).then(res => {
					let obj = {
						suid: this.userinfo.id || 0,
						ruid: this.rinfo.id || 0,
						type: 'chat',
						messagetype: 'trade-confirm', //text 文字  //trade 交易  //img 图片
						content: this.orderDetail.sn,
						time: Math.floor(Date.now() / 1000),
						sn: this.cid
					}
					this.senddiyMessage(obj)
					this.imhistory.push(obj)
					this.showpaysuccess = false
					this.showOrderModal = false
					this.srolltobottom()
				}).catch(err => {
					console.log(err)
				}).finally(v => {
					this.loading = false
				})

			},
			ordercommandcancle() {
				this.loading = true
				this.$reqPost('ordercancel', {
					sn: this.orderDetail.sn
				}).then(res => {
					let obj = {
						suid: this.userinfo.id || 0,
						ruid: this.rinfo.id || 0,
						type: 'chat',
						messagetype: 'trade-cancel', //text 文字  //trade 交易  //img 图片
						content: this.orderDetail.sn,
						time: Math.floor(Date.now() / 1000),
						sn: this.cid
					}
					this.senddiyMessage(obj)
					this.imhistory.push(obj)
					this.showpaysuccess = false
					this.showOrderModal = false
					this.srolltobottom()
				}).catch(err => {
					console.log(err)
				}).finally(v => {
					this.loading = false
				})
			},
			ordercommandreport() {
				let obj = {
					suid: this.userinfo.id || 0,
					ruid: this.rinfo.id || 0,
					type: 'command',
					action: 'orderreport',
					time: Math.floor(Date.now() / 1000)
				}
			},
			ordercommandfinish() {
				this.loading = true
				this.$reqPost('orderconfirm', {
					sn: this.orderDetail.sn
				}).then(res => {
					let obj = {
						suid: this.userinfo.id || 0,
						ruid: this.rinfo.id || 0,
						type: 'chat',
						messagetype: 'trade-finish', //text 文字  //trade 交易  //img 图片
						content: this.orderDetail.sn,
						time: Math.floor(Date.now() / 1000),
						sn: this.cid
					}
					this.senddiyMessage(obj)
					this.imhistory.push(obj)
					this.showOrderModal = false
					this.showordersuccess = false
					this.srolltobottom()
				}).catch(err => {
					console.log(err)
				}).finally(v => {
					this.loading = false
				})
			},
			//订单业务处理===================
			copyvalue(e) {
				uni.setClipboardData({
					data: e.toString(),
					success: () => {
						this.$u.toast(this.$lang('复制成功'))
					}
				})
			},
			getorderdetal(e) {
				this.loading = true;
				this.$reqGet('orderdetail', {
					sn: e
				}).then(res => {
					this.orderDetail = res.data.data;
					if (!res.data.data.entrust) {
						this.$u.toast(this.$lang('订单异常'))
						this.loading = false;
					}
					this.showOrderModal = true;
				}).finally(() => {
					this.loading = false;
				});
			},
			// 获取状态文本
			getStatusText(status) {
				const statusMap = {
					0: this.$lang('待支付'),
					1: this.$lang('待确认'),
					2: this.$lang('已完成'),
					3: this.$lang('已取消'),
					4: this.$lang('申诉中')
				};
				return statusMap[status] || this.$lang('未知状态');
			},

			backfuc() {
				uni.reLaunch({
					url: '/pages/myfriend/myfriends'
				})
			},

			gettalkhis() {
				this.$reqGet('chatdetail', {
					id: this.cid
				}).then(res => {
					let his = JSON.parse(res.data.data.details)
					this.imhistory = his
					this.srolltobottom()
				})
			},
			srolltobottom() {
				this.$nextTick(() => {
					this.scrolltimes = Date.now()
				})
			},
			handleWSMessage(data) {
				if (data.type == 'chat') {
					// console.log('收到WebSocket消息:', data);
					this.imhistory.push(data)
					this.srolltobottom()
				}
			},
			showimg(e) {
				uni.previewImage({
					urls: [e]
				})
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
							let obj = {
								suid: this.userinfo.id || 0,
								ruid: this.rinfo.id || 0,
								type: 'chat',
								messagetype: 'img', //text 文字  //trade 交易  //img 图片
								content: result,
								time: Math.floor(Date.now() / 1000),
								sn: this.cid
							}
							this.senddiyMessage(obj)
							this.imhistory.push(obj)
							this.srolltobottom()
						}).catch(error => {
							console.error('上传失败', error);
						});
					}
				});
			},
			getuserinfo(e) {
				this.$reqGet("userinfo", {
					user_id: e
				}).then(res => {
					this.rinfo = res.data.data
					this.srolltobottom()
				})
			},
			sendmessage() {
				if (!this.message) return;
				let obj = {
					suid: this.userinfo.id || 0,
					ruid: this.rinfo.id || 0,
					type: 'chat',
					messagetype: 'text', //text 文字  //trade 交易  //img 图片
					content: this.message,
					time: Math.floor(Date.now() / 1000),
					sn: this.cid
				}
				this.senddiyMessage(obj)
				this.imhistory.push(obj)
				this.srolltobottom()
			},
			//======================================
			// 连接WebSocket服务器
			connect() {
				if (this.isConnected || this.ws) return;
				try {
					// 替换为你的服务器地址
					const serverUrl = wssURL+'?token=' + localStorage.getItem('token');
					this.socket = uni.connectSocket({
						url: serverUrl,
						complete: () => {}
					});
					getApp().globalData.webSocket = this.socket;
					this.socket.onOpen(() => {
						// console.log('WebSocket连接成功');
						this.isConnected = true;

						// 清除重连定时器
						if (this.reconnectTimer) {
							clearTimeout(this.reconnectTimer);
							this.reconnectTimer = null;
						}
					});

					this.socket.onMessage((res) => {
						try {
							const data = JSON.parse(res.data);
							uni.$emit('global-websocket-message', data);
						} catch (error) {
							// console.error('消息解析错误:', error);
						}
					});

					this.socket.onClose((e) => {
						// console.log('WebSocket连接关闭', e);
						this.isConnected = false;
						if (e.code != 1000) {
							this.attemptReconnect();
						}
					});

					this.socket.onError((error) => {
						// console.error('WebSocket错误:', error);
						this.isConnected = false;
					});

				} catch (error) {
					// console.error('连接失败:', error);
					uni.showToast({
						title: this.$lang('连接失败'),
						icon: 'none'
					});
				}
			},
			// 断开连接
			disconnect() {
				if (this.socket) {
					this.socket.close();
					this.socket = null;
				}
				this.isConnected = false;

				if (this.reconnectTimer) {
					clearTimeout(this.reconnectTimer);
					this.reconnectTimer = null;
				}

			},
			// 发送自定义消息
			senddiyMessage(messageData) {
				if (!this.isConnected) return;
				this.socket.send({
					data: JSON.stringify(messageData),
					success: () => {
						// console.log('操作成功')
						this.message = ''
						this.srolltobottom()
					},
					fail: (error) => {
						console.log(error)
					}
				});
			},
			// 尝试重连
			attemptReconnect() {
				if (this.reconnectTimer) return;
				this.reconnectTimer = setTimeout(() => {
					this.connect();
				}, 3000);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.btpart {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 24rpx;

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

	.fixed-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 32rpx;

		.title {
			font-size: 36rpx;
		}

	}

	.statu1 {
		.line1 {
			color: #fff;
		}

		.line2 {
			margin-top: 12rpx;
			font-size: 24rpx;
			color: #a4aaaf;
		}
	}

	.statu2 {
		.line1 {
			color: #fff;
		}

		.line2 {
			margin-top: 12rpx;
			font-size: 24rpx;
			color: #a4aaaf;
		}

		.line {
			width: 100%;
			margin: 24rpx 0;
			height: 1px;
			background-color: #7f838720;
		}

		.linebtn {
			display: flex;
			align-items: center;
		}
	}

	.time {
		margin-bottom: 12rpx;
		color: #a4aaaf;
	}

	.contentuitem {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin-bottom: 36rpx;

		image {
			width: 400rpx;
			border-radius: 12rpx 12rpx 12rpx 0;
		}

		.content {
			padding: 16rpx 18rpx;
			background-color: #1b1c1d;
			border-radius: 12rpx 12rpx 12rpx 0;
			max-width: 488rpx;
			width: fit-content;
			word-break: break-all;
			line-height: 36rpx;
			// letter-spacing: 0rpx;
		}
	}

	.contentmitem {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: flex-end;
		margin-bottom: 36rpx;

		image {
			width: 400rpx;
			border-radius: 12rpx 12rpx 0 12rpx;
		}

		.content {
			padding: 16rpx 18rpx;
			background-color: #2a2b2d;
			border-radius: 12rpx 12rpx 0 12rpx;
			max-width: 488rpx;
			width: fit-content;
			word-break: break-all;
			line-height: 36rpx;
			// letter-spacing: 0rpx;
		}
	}

	page {
		background-color: #000;
	}

	.contentpage {
		padding: 12rpx 24rpx;
		height: calc(100vh - 216rpx);
		width: 100%;
		box-sizing: border-box;
		// background-color: #fff;

	}

	.contentpart {
		padding: 24rpx 36rpx;
		position: fixed;
		bottom: 0;
		background-color: #000;
		width: 100%;
		display: flex;
		justify-content: space-between;
		z-index: 6;

		.inputer {
			width: 580rpx;
			height: 80rpx;
			background-color: #222323;
			border-radius: 10rpx;
			padding: 0 24rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.send {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			background-color: #222323;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.nickname {
		margin-left: 12rpx;
		max-width: 400rpx;
		word-break: break-word;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.slot-wrap {
		display: flex;
		align-items: center;

		image {
			width: 66rpx;
			height: 66rpx;
			border-radius: 50%;
			background-color: #414345;
			// background-image: url('@/static/icons/defaultavatar.png');
			background-size: cover;
		}
	}

	// 在 style 标签内添加
	.order-modal {
		height: 100%;
		display: flex;
		flex-direction: column;
		color: #000;
		padding: 24rpx;

		.flex {
			display: flex;
			align-items: center;
		}

		.order-value {
			color: #000;
			font-size: 24rpx;
			display: flex;
			align-items: center;

			.copyicon {
				width: 22rpx;
				height: 22rpx;
				margin-left: 12rpx;
			}

			.shopava {
				width: 44rpx;
				height: 44rpx;
				border-radius: 50%;
				// background-image: url('@/static/icons/defaultavatar.png');
				background-size: cover;
				background-color: #dbdbdb;
				margin-left: 24rpx;
			}

			&.amount {
				color: #F0E68C;
				font-weight: bold;
				font-size: 32rpx;
			}

			&.status {
				padding: 8rpx 16rpx;
				border-radius: 20rpx;
				font-size: 24rpx;
				display: inline-block;

				&.status-0 {
					background-color: #533b1a;
					color: #fff;
				}

				&.status-1 {
					background-color: #30581d;
					color: #fff;
				}

				&.status-2 {
					background-color: #30581d;
					color: #fff;
				}

				&.status-3,
				&.status-4 {
					background-color: #693031;
					color: #fff;
				}
			}
		}

		.form-row {
			display: flex;
			justify-content: space-between;
			margin-bottom: 0;
			border-bottom: 1px solid #f0f0f0;

			&:last-child {
				border-bottom: none;
			}
		}

		.form-item {
			// margin-right: 20rpx;
			// padding: 20rpx 0;
			// padding: 12rpx 0;
			margin-bottom: 16rpx;
			height: 44rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			&:last-child {
				margin-right: 0;
			}
		}

		.tips {
			color: #727475;
			// margin-bottom: 8rpx;
			font-size: 22rpx;
			display: flex;
			align-items: center;
		}
	}

	.btpart {
		.full-width {
			width: 100%;
		}
	}
</style>