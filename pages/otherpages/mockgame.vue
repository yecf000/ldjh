<template>
	<view class="content">
		<view class="navbar">
			<view class="balance">
				剩余金矿:<span>{{userinfo.user_money?Number(userinfo.user_money).toFixed(2):0 }}</span>
				<image src="@/static/icons/gold.png" mode="aspectFill"></image>
			</view>
			<view class="getgoldclass">
				<u-button @click="backtomyinfo" type="primary" size='mini' ripple
					:custom-style='customstyle'>退出模拟</u-button>
			</view>
		</view>
		<view class="placeholdernavbar">
		</view>
		<scroll-view scroll-x="true" class="swiper" :scroll-left='scrollEnd' scroll-with-animation>
			<view class="swiperbox">
				<view @click="$u.route('/pages/otherpages/lottery')" class="item" v-for="(i,index) in times"
					:key="index">
					<view class="no">
						<image src="@/static/icons/no.png" mode="aspectFill"></image>
						{{i.id||0}}
					</view>
					<view class="lt">
						{{i.result||0}}x
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="game">
			<view class="totalbox">
				<view class="total">
					<image src="@/static/icons/goldg.png" mode="aspectFill"></image>
					矿山总资产:<span>$1000000</span>
				</view>
				<view class="gg" v-show="currentMultiplier">
					{{currentMultiplier.toFixed(2)}} X
				</view>
			</view>
			<view class="chart">
				<canvas canvas-id="xcanvas" class="xcanvas"></canvas>
			</view>
		</view>
		<view class="opration">
			<view v-if="wsgamestatu=='preparation'" :class="instatu?'outsuccess':'ordernow'" @click="intogame">
				{{instatu?'已参与':'进入挖矿'}} {{wscurrentTime}}S
			</view>
			<view @click="gameout('human')" v-if="wsgamestatu=='playing'"
				:class="instatu?(outstatu?'outsuccess':(canoutstatu?'outnow':'outover')):'outover'">
				{{outstatu?'撤离成功':'立即撤离'}}
			</view>
			<view v-if="wsgamestatu=='settlement'" class="ordersettlement">
				游戏结算中 {{wscurrentTime}}S
			</view>
			<view class="types">
				请选择稿子
				<svg style="margin-left: 12rpx;" t="1760202195406" class="icon" viewBox="0 0 1024 1024" version="1.1"
					xmlns="http://www.w3.org/2000/svg" p-id="8284" width="16" height="16">
					<path
						d="M963.6 858.2L474.8 369.5c97.3-92.2 198.4-172.7 300.3-240.9 35.5-23.8 19.1-79.8-23.6-79.1C611.3 52 471.8 96.2 353.3 182.4c-43.5-26.7-101.2-21.2-138.8 16.5s-43.2 95.3-16.5 138.8C111.8 456.3 67.6 595.8 65.1 735.9c-0.7 42.7 55.3 59.1 79.1 23.6 68.2-101.9 148.7-203.1 240.9-300.3L873.9 948c0.6 0.6 1.6 0.6 2.2 0l87.5-87.5c0.6-0.7 0.6-1.6 0-2.3z"
						p-id="8285" :fill="options[dgoin].tool"></path>
				</svg>
				<view class="ctoolname" :style="{color:options[dgoin].tool}">{{options[dgoin].toolname}}</view>
			</view>
			<view class="details">
				<view class="steps">
					<view class="des" @click="des">-</view>
					<view class="number">
						<image src="@/static/icons/gold.png" mode="aspectFill"></image>
						<view>
							{{dgoin}}
						</view>
					</view>
					<view class="add" @click="add">+</view>
				</view>
				<view class="checkpart">
					<u-checkbox :disabled='instatu' @change='keepchange' active-color="#1d4087"
						style="position: relative;right: -20rpx;" v-model="checked">
					</u-checkbox>
					<u-input
						@blur='keepvalue=Number(keepvalue||0)>5?Number(5).toFixed(2):Number(keepvalue||0).toFixed(2)'
						type='number' :disabled='!checked||instatu' placeholder='固定倍率撤出'
						placeholder-style="color: #7b7e83;" v-model="keepvalue" :clearable='false'
						:custom-style='inputstyle' />
					<view class="x">
						x
					</view>
				</view>
			</view>
		</view>
		<view class="players">
			<view class="tabs">
				<view class="player">玩家<span v-show="playerList.length>0">{{playerList.length}}</span></view>
				<view class='escape'>撤出</view>
				<view class='inside'>投入</view>
				<view class='earn'>盈亏</view>
			</view>
			<view class="playeritem"
				:style="{background:(!goingstatu&&currentMultiplier&&((currentMultiplier<i.keepvalue)||!i.keepvalue))?'#25090420':(i.keepvalue&&(currentMultiplier.toFixed(2)>=i.keepvalue)?'#04200120':(index%2!=1?'#0f131650':''))}"
				v-for="(i,index) in playerList" :key="i.unikey">
				<view class="player">
					<image :src="i.avatar||'@/static/icons/defaultavatar.png'" mode="aspectFill"></image>
					<view class="name">
						{{i.nickname||'玩家'}}
					</view>
				</view>
				<view class='escape'>
					{{!i.keepvalue?'-':currentMultiplier.toFixed(2)>=i.keepvalue?('x'+i.keepvalue):'-'}}</view>
				<view class='inside'>{{i.gold||0}}</view>

				<view
					v-show="currentMultiplier==0||(!i.keepvalue&&goingstatu)||(goingstatu&&currentMultiplier!=0&&currentMultiplier<i.keepvalue)"
					class='earn'>{{'-'}}</view>
				<view v-show="i.keepvalue&&currentMultiplier>=i.keepvalue" class='earn'>
					{{((i.keepvalue-1)*i.gold).toFixed(2)}}</view>
				<view v-show="!goingstatu&&currentMultiplier&&((currentMultiplier<i.keepvalue)||!i.keepvalue)"
					class='earn'>{{Number(i.gold*-1).toFixed(2)}}</view>
				<!-- 				<view v-show="(currentMultiplier >= targetMultiplier)&&(!i.keepvalue||(i.keepvalue>targetMultiplier))" class='earn'>{{Number(i.gold*-1).toFixed(2)}}</view>
				<view v-show="i.keepvalue&&(currentMultiplier >= targetMultiplier)&&(i.keepvalue<=targetMultiplier)" class='earn'>{{((i.keepvalue-1)*i.gold).toFixed(2)}}</view>
				<view v-show="(currentMultiplier < i.keepvalue)&&(currentMultiplier < targetMultiplier)" class='earn'>{{'-'}}</view>
				<view v-show="(currentMultiplier > i.keepvalue)&&(currentMultiplier < targetMultiplier)" class='earn'>{{((i.keepvalue-1)*i.gold).toFixed(2)}}</view> -->
			</view>
		</view>
		<view class="placeholdertabbar">
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// =======================用户数据层
				userinfo: {
					user_money: 0
				},

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
				// =======================页面UI层
				inputstyle: {
					color: '#e8e8e8',
					backgroundColor: '#26303d',
					borderRadius: '10rpx',
					padding: '0px 12rpx',
					with: '100rpx'
				},
				keepvalue: '',
				checked: false,
				time: 0,
				dgoin: 10,
				options: {
					10: {
						tool: "#197f56",
						toolname: "铁镐",
					},
					50: {
						tool: "#e6e6e6",
						toolname: "银镐",
					},
					100: {
						tool: "#fcba00",
						toolname: "金镐",
					},
					150: {
						tool: "#8888cc",
						toolname: "秘银镐",
					},
					200: {
						tool: "#ffaa7f",
						toolname: "精钢镐",
					}
				},
				times: [{
						id: 0,
						result: 0
					},
					{
						id: 0,
						result: 0
					},
					{
						id: 0,
						result: 0
					},
					{
						id: 0,
						result: 0
					},
					{
						id: 0,
						result: 0
					}
				],
				scrollEnd: 9999,
				old: {
					scrollEnd: 9999
				},
				customstyle: {
					height: '60rpx',
					backgroundColor: '#260c0d',
					color: '#fcba00'
				},

				// ====================================图表层
				animationId: null,
				isPlaying: false,
				startTime: 0,
				pausedTime: 0,
				progress: 0,
				// 绘制参数
				duration: 9000,
				startX: 0,
				startY: 200,
				endX: 350,
				maxMultiplier: 5,
				power: 3,
				currentMultiplier: 0,
				status: 0, // 0游戏准备中，1投注中，2进行中，3结算中
				pixelRatio: 1,
				canvasWidth: 700,
				canvasHeight: 400,
				targetMultiplier: 3
			}
		},
		mounted() {
			this.getSystemInfo();
		},
		onReady() {
			this.calculatePixelRatio();
		},
		onShow() {

		},
		computed: {
			connectionStatus() {
				if (this.isConnected) {
					return {
						text: '已连接',
						class: 'connected'
					};
				} else {
					return {
						text: '未连接',
						class: 'disconnected'
					};
				}
			}
		},
		onUnload() {
			this.disconnect();
		},
		methods: {

			backtomyinfo() {
				uni.switchTab({
					url: '/pages/my/index'
				})
			},
			//撤离
			gameout(e) {
				if (!this.instatu) {
					return;
				}
				if (this.outstatu) {
					return
				}
				if (this.canoutstatu) {
					if (!this.checked || (this.checked && e == 'auto')) {
						this.outstatu = true
						// this.senddiyMessage({
						// 	action: 'round_game_out',
						// 	keepvalue: Number(this.currentMultiplier).toFixed(2),
						// 	type: 'game_action'
						// })
						this.userinfo.user_money+=(this.dgoin*Number(this.currentMultiplier).toFixed(2))
						localStorage.setItem('mockdata',JSON.stringify(this.userinfo))
					} else {
						uni.showToast({
							title: '已设置固定点位',
							icon: 'none'
						})
					}
				} else {
					if (this.outstatu) {
						return
					}
					uni.showToast({
						title: '已错过撤离时间',
						icon: 'none'
					})
				}
			},
			//进入挖矿游戏	
			intogame() {
				if (this.instatu) {
					return
				}
				// if (!localStorage.getItem('token')) {
				// 	this.$fuc.gotopage('/pages/otherpages/login')
				// 	return
				// }
				// if (this.userinfo.user_money < this.dgoin) {
				// 	uni.showToast({
				// 		icon: 'none',
				// 		title: '金矿不足'
				// 	})
				// 	return
				// }
				if (this.canin) {
					this.instatu = true
					// this.senddiyMessage({
					// 	action: 'round_game_in',
					// 	ifkeep: this.checked,
					// 	keepvalue: this.checked ? this.keepvalue : '',
					// 	gold: this.dgoin,
					// 	type: 'game_action'
					// })
					// setTimeout(() => {
					// 	this.getmoneyinfo()
					// }, 1500)
					this.userinfo.user_money-=this.dgoin
					localStorage.setItem('mockdata',JSON.stringify(this.userinfo))
				} else {
					if (this.instatu) {
						return
					}
					uni.showToast({
						title: '未到进入时间',
						icon: 'none'
					})
				}
			},

			//======================================
			// 计算像素比例
			calculatePixelRatio() {
				const systemInfo = uni.getSystemInfoSync();
				// 375是设计稿基准宽度
				this.pixelRatio = systemInfo.windowWidth / 375;

				// 更新canvas尺寸
				this.canvasWidth = 700 * this.pixelRatio;
				this.canvasHeight = 400 * this.pixelRatio;

				// console.log('像素比例:', this.pixelRatio, 'Canvas尺寸:', this.canvasWidth, this.canvasHeight);
			},

			// 获取系统信息计算像素比例
			getSystemInfo() {
				const systemInfo = uni.getSystemInfoSync();
				this.systemInfo = systemInfo;
				// 计算像素比例
				this.pixelRatio = systemInfo.windowWidth / 750; // 750是rpx基准

				// 如果需要获取canvas的实际像素尺寸
				// 可以通过selectorQuery获取，或者根据比例计算
			},

			// 开始/继续绘制
			startDraw() {
				if (this.isPlaying) return;

				this.isPlaying = true;
				this.startTime = Date.now() - this.pausedTime;
				this.pausedTime = 0;
				this.animate();
			},

			// 暂停绘制
			pauseDraw() {
				this.canoutstatu = false
				if (!this.isPlaying) return;

				this.isPlaying = false;
				this.pausedTime = Date.now() - this.startTime;
				if (this.animationId) {
					clearTimeout(this.animationId);
					this.animationId = null;
				}
			},

			// 停止并重置绘制
			resetDraw() {
				this.isPlaying = false;
				this.progress = 0;
				this.pausedTime = 0;
				this.currentMultiplier = 0;
				if (this.animationId) {
					clearTimeout(this.animationId);
					this.animationId = null;
				}
				// 清空画布
				const ctx = uni.createCanvasContext('xcanvas', this);
				ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
				ctx.draw(true);
				this.status = 0;
			},

			// 重绘（从头开始）
			redraw() {
				this.resetDraw();
				setTimeout(() => {
					this.startDraw();
				}, 100);
			},

			// 跳转到指定进度 (0-1)
			seekTo(progress) {
				if (progress < 0) progress = 0;
				if (progress > 1) progress = 1;

				this.progress = progress;
				this.pausedTime = progress * this.duration;
				this.isPlaying = false;

				if (this.animationId) {
					clearTimeout(this.animationId);
					this.animationId = null;
				}

				// 立即绘制指定进度
				this.drawFrame(progress);
			},

			// 动画主循环
			animate() {
				this.goingstatu = true
				// console.log("===",this.maxMultiplier * Math.pow(this.progress, this.power))
				if (!this.isPlaying) return;

				const currentTime = Date.now();
				const elapsed = currentTime - this.startTime;
				this.progress = elapsed / this.duration;


				// 计算当前倍数
				const currentMultiplier = this.maxMultiplier * Math.pow(this.progress, this.power);
				if (this.instatu && this.checked && (currentMultiplier >= this.keepvalue)) {
					this.gameout('auto')
				}


				// 检查是否达到目标倍数
				if (currentMultiplier >= this.targetMultiplier) {
					// 计算精确的进度值
					const exactProgress = Math.pow(this.targetMultiplier / this.maxMultiplier, 1 / this.power);
					this.progress = exactProgress;
					this.drawFrame(this.progress);
					this.pauseDraw();
					this.goingstatu = false
					return;
				}


				if (this.progress > 1) {
					this.progress = 1;
					this.isPlaying = false;
				}

				this.drawFrame(this.progress);

				if (this.progress < 1 && this.isPlaying) {
					this.animationId = setTimeout(() => {
						this.animate();
					}, 16);
				}
			},

			// 绘制单帧
			drawFrame(progress) {
				const ctx = uni.createCanvasContext('xcanvas', this);
				const scaledWidth = this.canvasWidth;
				const scaledHeight = this.canvasHeight;
				const scaledStartX = 0;
				const scaledStartY = scaledHeight / 2;
				const scaledEndX = scaledWidth / 2;

				ctx.clearRect(0, 0, scaledWidth, scaledHeight);
				ctx.strokeStyle = '#de7a08';
				ctx.lineWidth = 2;
				ctx.lineCap = 'round';
				ctx.beginPath();
				ctx.moveTo(scaledStartX, scaledStartY);

				const segments = 100;
				for (let i = 1; i <= segments; i++) {
					const segProgress = i / segments;
					if (segProgress > progress) break;

					const segX = scaledStartX + (scaledEndX - scaledStartX) * segProgress;
					const currentMultiplier = this.maxMultiplier * Math.pow(segProgress, this.power);
					const segY = scaledStartY - (currentMultiplier / this.maxMultiplier) * scaledStartY;
					ctx.lineTo(segX, segY);
				}
				ctx.stroke();

				const currentX = scaledStartX + (scaledEndX - scaledStartX) * progress;
				const currentMultiplier = this.maxMultiplier * Math.pow(progress, this.power);
				const currentY = scaledStartY - (currentMultiplier / this.maxMultiplier) * scaledStartY;
				this.currentMultiplier = currentMultiplier;

				ctx.fillStyle = '#783232';
				ctx.beginPath();
				ctx.arc(currentX, currentY, 4 * this.pixelRatio, 0, Math.PI * 2);
				ctx.fill();

				this.status = this.isPlaying ? 2 : 1;
				ctx.draw(true);
			},
			// 原始函数（兼容旧代码）
			drawCurve() {
				this.redraw();
			},
			//======================================
			keepchange(e) {
				if (e.value) {
					this.keepvalue = 1.5
				} else {
					this.keepvalue = ''
				}
			},
			des() {
				if (this.dgoin == 50) {
					this.dgoin = 10
				} else if (this.dgoin > 50) {
					this.dgoin -= 50
				}
			},
			add() {
				if (this.dgoin == 10) {
					this.dgoin = 50
				} else if (this.dgoin < 200) {
					this.dgoin += 50
				}
			},
			//======================================
			// 连接WebSocket服务器
			connect() {
				if (this.isConnected) return;

				try {
					// 替换为你的服务器地址
					const serverUrl = 'ws://localhost:8899?token=' + localStorage.getItem('token');
					this.socket = uni.connectSocket({
						url: serverUrl,
						complete: () => {}
					});
					getApp().globalData.webSocket = this.socket;
					this.socket.onOpen(() => {
						// console.log('WebSocket连接成功');
						this.isConnected = true;
						this.addMessage('system', '连接服务器成功');

						// 清除重连定时器
						if (this.reconnectTimer) {
							clearTimeout(this.reconnectTimer);
							this.reconnectTimer = null;
						}
					});

					this.socket.onMessage((res) => {
						try {
							const data = JSON.parse(res.data);
							this.handleServerMessage(data);
							uni.$emit('global-websocket-message', data);
						} catch (error) {
							console.error('消息解析错误:', error);
							this.addMessage('error', '消息解析错误: ' + res.data);
						}
					});

					this.socket.onClose((e) => {
						console.log('WebSocket连接关闭', e);
						this.isConnected = false;
						this.addMessage('system', '连接已断开');
						if (e.code != 1000) {
							this.attemptReconnect();
						}
					});

					this.socket.onError((error) => {
						console.error('WebSocket错误:', error);
						this.addMessage('error', '连接错误: ' + error.errMsg);
						this.isConnected = false;
					});

				} catch (error) {
					console.error('连接失败:', error);
					uni.showToast({
						title: '连接失败',
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

				this.addMessage('system', '已主动断开连接');
			},

			// 处理服务器消息
			handleServerMessage(data) {
				switch (data.type) {
					case 'system':
						this.addMessage('system', data.message);
						break;
					case 'player_list_keep':
						let info = data.info
						let u = this.playerList.find(item => item.uid == info.uid)
						// console.log(u,this.playerList)
						if (u) {
							u.keepvalue = info.keepvalue
						}
						break;
					case 'player_list':
						let obj = data.info
						obj.unikey = this.$u.guid()
						this.$set(this, 'playerList', [obj, ...this.playerList]);
						break;
					case 'chat':
						this.addMessage('chat', `${data.user}: ${data.message}`);
						break;
					case 'game_data':
						if (data.event === 'broad') {
							this.wscurrentTime = data.currentTime
							this.wsgamestatu = data.state
						}
						break;
					case 'game_result':
						this.times.push({
							id: data.gameRound,
							result: data.num
						})
						// 保持数组长度不超过12
						// 只有在数组有变化时才触发滚动
						this.$nextTick(() => {
							// 使用更稳定的滚动方式
							this.scrollEnd = Date.now(); // 使用时间戳确保唯一性
						});
						if (this.times.length > 30) {
							setTimeout(() => {
								this.times.shift();
							}, 10000)
						}
						setTimeout(() => {
							this.resetDraw()
							this.playerList = []
							this.outstatu = false
							this.getmoneyinfo()
						}, 8000)
						break;
					case 'game_event':
						this.addMessage('game', `游戏事件: ${this.$fuc.decrypt(data.num)} ${data.event}`);
						this.targetMultiplier = this.$fuc.decrypt(data.num)
						this.canin = false
						this.canoutstatu = true
						this.drawCurve();
						break;
					case 'game_ready':
						this.instatu = false
						this.canin = true
						break;
					case 'error':
						uni.showToast({
							title: data.message,
							icon: 'none'
						})
						if (data.action == 'bad_in') {
							this.instatu = false
						}
						this.addMessage('error', data.message);
						break;

					default:
						this.addMessage('system', `未知消息: ${JSON.stringify(data)}`);
				}
			},
			// 发送自定义消息
			senddiyMessage(messageData) {
				if (!this.isConnected) return;
				this.socket.send({
					data: JSON.stringify(messageData),
					success: () => {
						console.log('操作成功')
					},
					fail: (error) => {
						this.addMessage('error', '操作失败: ' + error.errMsg);
					}
				});
			},
			// 发送消息
			sendMessage() {
				if (!this.isConnected || !this.message.trim()) return;

				const messageData = {
					type: 'chat',
					user: '玩家',
					message: this.message
				};

				this.socket.send({
					data: JSON.stringify(messageData),
					success: () => {
						this.message = '';
					},
					fail: (error) => {
						this.addMessage('error', '发送失败: ' + error.errMsg);
					}
				});
			},

			// 添加消息到列表
			addMessage(type, content) {
				this.messages.unshift({
					type: type,
					content: content,
					time: new Date().toLocaleTimeString()
				});

				// 限制消息数量
				if (this.messages.length > 100) {
					this.messages = this.messages.slice(0, 100);
				}
			},

			// 获取消息类型样式类
			getMessageTypeClass(type) {
				return `message-type-${type}`;
			},

			// 尝试重连
			attemptReconnect() {
				if (this.reconnectTimer) return;
				this.reconnectTimer = setTimeout(() => {
					this.addMessage('system', '尝试重新连接...');
					this.connect();
				}, 3000);
			},



			//====================================
			getmoneyinfo() {
				if (localStorage.getItem('mockdata')) {
					this.userinfo = JSON.parse(localStorage.getItem('mockdata'))
				} else {
					localStorage.setItem('mockdata', JSON.stringify({
						user_money: 1000
					}))
					this.userinfo = JSON.parse(localStorage.getItem('mockdata'))
				}
			},
			getgamelist() {
				this.$reqGet("gamelist").then(res => {
					res.data.data.lists.map(item => {
						item.result = item.target_number
						item.id = item.game_round
					})
					this.times = res.data.data.lists.reverse()
					this.$nextTick(() => {
						// 使用更稳定的滚动方式
						this.scrollEnd = Date.now(); // 使用时间戳确保唯一性
					});
				})
			}
		},
		onLoad() {
			this.getmoneyinfo()
			// for (let i = 0; i < 10; i++) {
			// 	this.times.push({
			// 		id: i,
			// 		result: i
			// 	})
			// }
			this.getgamelist()
			if (!this.socket) {
				setTimeout(() => {
					this.connect()
				}, 1000)
			}
			// setInterval(() => {
			// 	this.times.push(this.time)
			// 	// 保持数组长度不超过12
			// 	// 只有在数组有变化时才触发滚动
			// 	this.$nextTick(() => {
			// 		// 使用更稳定的滚动方式
			// 		this.scrollEnd = Date.now(); // 使用时间戳确保唯一性
			// 	});
			// 	if (this.times.length > 12) {
			// 		setTimeout(() => {
			// 			this.times.shift();
			// 		}, 1000)
			// 	}
			// 	this.time++
			// }, 3000)
		},
	}
</script>

<style scoped lang="scss">
	/deep/.u-checkbox__icon-wrap--disabled {
		background-color: #989a9a;
	}

	.xcanvas {
		width: 700rpx;
		height: 400rpx;
		image-rendering: -webkit-optimize-contrast;
		image-rendering: crisp-edges;
		// background-color: #f5f5f5;
	}

	.placeholdertabbar {
		height: 120rpx;
	}

	.players {
		margin-top: 24rpx;
		padding: 12rpx 0rpx;

		.playeritem {
			padding: 16rpx 24rpx;
			display: flex;
			align-items: center;
			color: #9f9f9f;
			font-size: 24rpx;
			border-bottom: 1px solid #ffffff07;

			.player {
				display: flex;
				align-items: center;
				width: 400rpx;

				.name {
					margin-left: 12rpx;
					max-width: 260rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				image {
					width: 40rpx;
					height: 40rpx;
					border-radius: 50%;
					// background-color: #19201d;
					background-image: url('@/static/icons/gold.png');
					background-size: contain;
					background-position: center;
					background-repeat: no-repeat;
				}
			}

			.escape {
				display: flex;
				width: 100rpx;
			}

			.inside {
				display: flex;
				width: 150rpx;
			}

			.earn {
				display: flex;
				width: 100rpx;
			}
		}

		.tabs {
			display: flex;
			align-items: center;
			color: #9f9f9f;
			margin-bottom: 12rpx;
			padding: 0 24rpx;

			.player {
				width: 400rpx;
				display: flex;
				align-items: center;

				span {
					font-size: 24rpx;
					margin-left: 12rpx;
				}
			}

			.escape {
				width: 100rpx;
			}

			.inside {
				width: 150rpx;
			}

			.earn {
				width: 100rpx;
			}
		}
	}

	.details {
		margin-top: 12rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		/deep/.u-input__input {
			width: 240rpx;
		}

		.checkpart {
			display: flex;
			position: relative;

			.x {
				position: absolute;
				right: 24rpx;
				top: 14rpx;
				color: #fff;
			}
		}

		.steps {
			width: 300rpx;
			height: 66rpx;
			background-color: #26303d;
			border-radius: 10rpx;
			display: flex;

			.des {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 80rpx;
				height: 100%;
				color: #dfc92e;
			}

			.add {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 80rpx;
				height: 100%;
				color: #dfc92e;
			}

			.number {
				height: 100%;
				border-left: 1px solid #3b4653;
				border-right: 1px solid #3b4653;
				width: 140rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #f3a406;
				font-size: 26rpx;

				image {
					width: 30rpx;
					height: 24rpx;
					margin-right: 12rpx;
				}
			}
		}
	}

	.types {
		margin-top: 24rpx;
		display: flex;
		align-items: center;
		color: #a7acb4;

		.ctoolname {
			margin-left: 4rpx;
			font-size: 24rpx;
		}
	}

	.opration {
		// background-color: #b8b8b8;
		// height: 250rpx;
		padding: 0 24rpx;

		.ordernow {
			width: 100%;
			border-radius: 10rpx;
			background-color: #212938;
			height: 88rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			letter-spacing: 4rpx;
			box-shadow: 4rpx 8rpx 24rpx rgba(255, 255, 255, 0.25);
		}

		.ordersettlement {
			width: 100%;
			border-radius: 10rpx;
			background-color: #1f1600;
			height: 88rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			letter-spacing: 4rpx;
			box-shadow: 4rpx 8rpx 24rpx rgba(255, 255, 255, 0.25);
		}

		.outnow {
			width: 100%;
			border-radius: 10rpx;
			background-color: #0e2403;
			height: 88rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			letter-spacing: 4rpx;
			box-shadow: 4rpx 8rpx 24rpx rgba(255, 255, 255, 0.25);
		}

		.outsuccess {
			width: 100%;
			border-radius: 10rpx;
			background-color: #b3bab7;
			height: 88rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			letter-spacing: 4rpx;
			box-shadow: 4rpx 8rpx 24rpx rgba(255, 255, 255, 0.25);
		}

		.outover {
			width: 100%;
			border-radius: 10rpx;
			background-color: #505152;
			height: 88rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			letter-spacing: 4rpx;
			box-shadow: 4rpx 8rpx 24rpx rgba(255, 255, 255, 0.25);
		}
	}

	.game {
		background-color: #0f1012;
		height: 450rpx;
		position: relative;
		padding: 24rpx;

		.totalbox {
			position: absolute;
			width: calc(100% - 48rpx);
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		.gg {
			font-size: 26rpx;
			margin-top: 8rpx;
			font-weight: bold;
			color: #969696;
		}

		.total {
			width: 100%;
			// background-color: #fff;
			font-size: 24rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			z-index: 9;

			span {
				padding-left: 24rpx;
				color: #fcb100;
			}

			image {
				width: 50rpx;
				height: 50rpx;
				margin-right: 24rpx;
			}
		}

		.chart {
			transform: translateZ(0);
			width: 700rpx;
			height: 400rpx;
			border-left: 4rpx solid #33353a;
			border-bottom: 4rpx solid #33353a;
		}
	}

	.placeholdernavbar {
		height: 88rpx;
	}

	.navbar {
		position: fixed;
		width: 100%;
		z-index: 99;
		height: 88rpx;
		background-color: #101418;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 24rpx;

		.balance {
			display: flex;
			align-items: center;
			color: #e3e3e3;

			image {
				margin-left: 12rpx;
				width: 48rpx;
				height: 40rpx;

			}

			span {
				color: #fcba00;
				padding-left: 12rpx;
				font-weight: bold;
			}
		}
	}

	.swiper {
		height: 118rpx;
		background-color: #0c0e0d;

		.swiperbox {
			display: inline-flex;
			height: 100%;

			.item {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				width: 150rpx;
				height: 100%;
				border-right: 1px solid #161920;
				color: #fff;

				.lt {
					font-size: 24rpx;
					color: #80848b;
					margin-top: 8rpx;
				}

				.no {
					display: flex;
					align-items: center;
					font-size: 24rpx;
					color: #3c4458;

					image {
						margin-right: 8rpx;
						width: 24rpx;
						height: 24rpx;
					}
				}
			}
		}
	}

	page {
		background-color: rgba(15, 16, 18, 1);
	}
</style>