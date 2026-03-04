<template>
	<view class="websocket-container">
		<view class="header">
			<text class="title">WebSocket 挖金矿游戏</text>
			<text class="status" :class="connectionStatus.class">
				{{ connectionStatus.text }}
			</text>
		</view>
		
		<view class="control-panel">
			<button @click="connect" :disabled="isConnected" class="btn">连接服务器</button>
			<button @click="disconnect" :disabled="!isConnected" class="btn btn-disconnect">断开连接</button>
			<button @click="getRandomNumber" :disabled="!isConnected" class="btn btn-game">获取随机数</button>
		</view>

		<view class="input-panel">
			<input v-model="message" placeholder="输入聊天消息" class="input" />
			<button @click="sendMessage" :disabled="!isConnected" class="btn">发送消息</button>
		</view>

		<view class="messages-panel">
			<text class="panel-title">消息记录</text>
			<scroll-view scroll-y class="messages-list">
				<view v-for="(msg, index) in messages" :key="index" class="message-item">
					<text class="message-time">{{ msg.time }}</text>
					<text class="message-type" :class="getMessageTypeClass(msg.type)">[{{ msg.type }}]</text>
					<text class="message-content">{{ msg.content }}</text>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				socket: null,
				isConnected: false,
				message: '',
				messages: [],
				reconnectTimer: null
			}
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
			// 连接WebSocket服务器
			connect() {
				if (this.isConnected) return;

				try {
					// 替换为你的服务器地址
					const serverUrl = 'ws://localhost:8899';
					this.socket = uni.connectSocket({
						url: serverUrl,
						complete: () => {}
					});

					this.socket.onOpen(() => {
						console.log('WebSocket连接成功');
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
						} catch (error) {
							console.error('消息解析错误:', error);
							this.addMessage('error', '消息解析错误: ' + res.data);
						}
					});

					this.socket.onClose((e) => {
						console.log('WebSocket连接关闭', e);
						this.isConnected = false;
						this.addMessage('system', '连接已断开');
						if(e.code!=1000){
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

					case 'chat':
						this.addMessage('chat', `${data.user}: ${data.message}`);
						break;

					case 'game_data':
						if (data.action === 'random_number') {
							this.addMessage('game', `随机数: ${data.number}`);
						}
						break;

					case 'game_event':
						this.addMessage('game', `游戏事件: ${this.$fuc.decrypt(data.num)} ${data.event}`);
						break;

					case 'error':
						this.addMessage('error', data.message);
						break;

					default:
						this.addMessage('system', `未知消息: ${JSON.stringify(data)}`);
				}
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

			// 获取随机数（游戏动作）
			getRandomNumber() {
				if (!this.isConnected) return;

				const gameData = {
					type: 'game_action',
					action: 'get_random_number'
				};

				this.socket.send({
					data: JSON.stringify(gameData),
					fail: (error) => {
						this.addMessage('error', '游戏动作发送失败: ' + error.errMsg);
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
			}
		}
	}
</script>

<style scoped>
	.websocket-container {
		padding: 20rpx;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.title {
		font-size: 36rpx;
		font-weight: bold;
	}

	.status {
		font-size: 28rpx;
		padding: 10rpx 20rpx;
		border-radius: 10rpx;
	}

	.connected {
		background-color: #e8f5e8;
		color: #4caf50;
	}

	.disconnected {
		background-color: #ffebee;
		color: #f44336;
	}

	.control-panel {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
		margin-bottom: 30rpx;
	}

	.btn {
		flex: 1;
		min-width: 200rpx;
		background-color: #007aff;
		color: white;
		border: none;
		border-radius: 10rpx;
		padding: 20rpx;
	}

	.btn:disabled {
		background-color: #cccccc;
	}

	.btn-disconnect {
		background-color: #ff3b30;
	}

	.btn-game {
		background-color: #4cd964;
	}

	.input-panel {
		display: flex;
		gap: 20rpx;
		margin-bottom: 30rpx;
	}

	.input {
		flex: 1;
		border: 1px solid #ddd;
		border-radius: 10rpx;
		padding: 20rpx;
	}

	.messages-panel {
		border: 1px solid #ddd;
		border-radius: 10rpx;
		padding: 20rpx;
	}

	.panel-title {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
		display: block;
	}

	.messages-list {
		height: 600rpx;
	}

	.message-item {
		display: flex;
		align-items: flex-start;
		margin-bottom: 15rpx;
		padding: 10rpx;
		border-bottom: 1px solid #f0f0f0;
	}

	.message-time {
		font-size: 24rpx;
		color: #999;
		min-width: 120rpx;
	}

	.message-type {
		font-size: 24rpx;
		min-width: 120rpx;
		margin: 0 20rpx;
	}

	.message-type-system {
		color: #007aff;
	}

	.message-type-chat {
		color: #4cd964;
	}

	.message-type-game {
		color: #ff9500;
	}

	.message-type-error {
		color: #ff3b30;
	}

	.message-content {
		flex: 1;
		font-size: 28rpx;
		word-break: break-all;
	}
</style>