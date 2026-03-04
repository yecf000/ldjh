<template>
	<view class="all">
		<navbar title="获取金矿"></navbar>
		<view class="title">
			<view>USDT 兑换金矿</view>
			<view class="tips">( USDT与金矿兑换比例为{{options.exchange_rate}}:1 )</view>
		</view>
		<view class="qrcode">
			<div class="qrcode-container" :style="containerStyle">
				<!-- <uqrcode ref="qrcode" canvas-id="qrcode" :value="options.wallet_address" :options="{ margin: 6 }"></uqrcode> -->
				<image style="width: 300rpx;height: 300rpx;" :src="options.wallet_qrcode" mode="aspectFill"></image>
			</div>
		</view>
		<view class="address">
			<view class="leftview">
				<view class="txt">地址
				<view class="trc">
					<image src="@/static/svg/XTVCTRX--big.svg" mode="aspectFill"></image>
					Tron(trc20)
				</view>
				</view>
				<view class="detail">{{options.wallet_address||''}}</view>
			</view>
			<u-icon style="position: relative;top: 30rpx;" name="file-text" color="#ffffff" size="40"></u-icon>
		</view>
		<view class="tags">
			<view @click="tagitemIndex=0" :class="tagitemIndex==0?'tagitemactive':'tagitem'">
				10 U
			</view>
			<view @click="tagitemIndex=1" :class="tagitemIndex==1?'tagitemactive':'tagitem'">
				100 U
			</view>
			<view @click="tagitemIndex=2" :class="tagitemIndex==2?'tagitemactive':'tagitem'">
				500 U
			</view>
			<view @click="tagitemIndex=3" :class="tagitemIndex==3?'tagitemactive':'tagitem'">
				其他数量
			</view>
		</view>
		<view class="othernum" v-if="tagitemIndex==3">
			<view class="inputbox">
				<u-input :custom-style="{color:'#fff'}" :clearable='false' placeholder='请输入USDT数量' v-model="numvalue" type="number"/>
			</view>
		</view>
		<view class="history">
			<view class="htitle">
				<view>近期记录</view>
				<view class="rpart">
					<u-icon style="margin-right: 8rpx;" name="order" color="#fff" size="24"></u-icon>
					全部
				</view>
			</view>
			<view class="list">
				<view class="null" v-show="!orderlist.length">
					<image src="@/static/icons/null.png" mode="aspectFill"></image>
				</view>
				<view class="project" :style="{border:index==2?'none':''}" v-for="(i,index) in orderlist" :key="i.id">
					USDT
					<view class="flex">
						<view class="line">
							<view class="linetitle">时间</view>
							<view>{{i.create_time}}</view>
						</view>
						<view class="line" style="min-width: 180rpx;">
							<view class="linetitle">数量</view>
							<view>{{$fuc.formatNumber(i.amount)}}</view>
						</view>
						<view class="line"  style="min-width: 100rpx;display: flex;flex-direction: column;align-items: flex-end;">
							<view class="linetitle">状态</view>
							<view>{{i.status==0?'待确认':i.status==1?'成功充值':i.status==2?'充值失败':i.status==3?'订单取消':i.status==4?'订单失效':'订单异常'}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="afterplease">
			
		</view>
		<view class="afterbtn">
			<view class="xbtn" @click="already">
				我已完成储值
			</view>
		</view>
		<zero-loading color='#F0E68C' mask v-if="loading" showText textColor='#fff' :maskOpacity='0.8'></zero-loading>
	</view>
</template>

<script>
	import navbar from '@/components/navbar.vue'
	export default {
		components:{
			navbar
		},
		
		data() {
			return {
				loading:false,
				numvalue:"",
				tagitemIndex:0,
				borderRadius: 10,
				size: 300,
				moneyarr:['10','100','500'],
				orderlist:[],
				options:{
					wallet_qrcode:'',
					wallet_address:'',
					exchange_rate:''
				}
			}
		},
		onLoad() {
			this.getlist()
			this.getoption()
		},
		computed: {
		    containerStyle() {
		      return {
		        borderRadius: `${this.borderRadius}rpx`,
		        overflow: 'hidden',
		      }
		    }
		  },
		methods:{
			getoption(){
				this.$reqGet('gameConfig').then(res=>{
					this.options = res.data.data
				}).catch(err=>{
				})
			},
			getlist(){
				this.$reqGet('rechargelists',{
					page_size:3
				}).then(res=>{
					this.orderlist = res.data.data.lists
				}).catch(err=>{
					
				})
			},
			already(){
				this.loading=true
				this.$reqPost('fundrecharge',{
					currency_id:1,
					amount:this.tagitemIndex<3?this.moneyarr[this.tagitemIndex]:this.numvalue
				}).then(res=>{
					this.$u.toast('已提交储值')
					this.loading =false
					this.getlist()
				}).catch(err=>{
					this.loading=false
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.null{
		display: flex;
		align-items: center;
		justify-content: center;
		image{
			width: 400rpx;
			height: 400rpx;
			opacity: 0.3;
		}
	}
	.flex{
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 12rpx;
	}
	.history{
		margin-top: 48rpx;
		padding: 0 42rpx;
		.list{
			.project{
				font-weight: bold;
				padding: 24rpx 0;
				border-bottom: 1px solid #1c1c1c;
			}
			.line{
				font-weight: 500;
				display: flex;
				flex-direction: column;
				font-size: 24rpx;
				.linetitle{
					color: #8d8f8f;
					margin-bottom: 8rpx;
				}
			}
		}
		.rpart{
			display: flex;
			align-items: center;
			font-size: 24rpx;
			font-weight: 500;
		}
		.htitle{
			font-weight: bold;
			margin-bottom: 24rpx;
			display: flex;
			justify-content: space-between;
		}
	}
	.afterplease{
		height: 150rpx;
	}
	.afterbtn{
		position: fixed;
		z-index: 9;
		bottom: 0;
		width: 100%;
		height: 142rpx;
		display: flex;
		justify-content: center;
		padding: 30rpx 48rpx;
		background-color: rgba(15, 16, 18, 1);
	}
	.xbtn{
		width: 100%;
		height: 100%;
		// background-color: #666666
		color: #fff;
		border: 1px solid #fff;
		border-radius: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 32rpx;
	}
	.othernum{
		margin-top: 24rpx;
		padding: 0 48rpx;
		.inputbox{
			padding: 0 24rpx;
			border: 1px solid #fff;
			height: 80rpx;
			font-size: 24rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 10rpx;
		}
	}
	.tags{
		margin-top: 4rpx;
		padding: 0 48rpx;
		display: flex;
		align-items: center;justify-content: space-between;
		.tagitem{
			width: 150rpx;
			border: 1px solid #fff;
			padding: 12rpx 0;
			font-size: 24rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 10rpx;
		}
		.tagitemactive{
			width: 150rpx;
			border: 1px solid #d09a09;
			padding: 12rpx 0;
			font-size: 24rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 10rpx;
			color: #d09a09;
		}
	}
	.address{
		margin-top: 12rpx;
		padding: 24rpx 48rpx;
		display: flex;align-items: center;
		justify-content: space-between;
		.leftview{
			width: 550rpx;
		}
		.detail{
			margin-top: 12rpx;
			font-size: 34rpx;
			width: 100%;
			white-space: normal;
			word-break: break-all;
		}
		.txt{
			font-size: 24rpx;
			color: #666666;
			display: flex;
			align-items: center;
			.trc{
				color: #909497;
				background-color: #262727;
				padding: 8rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-left: 8rpx;
				border-radius: 8rpx;
				image{
					width: 36rpx;
					height: 36rpx;
					border-radius: 50%;
					margin-right: 8rpx;
				}
			}
		}
	}
	.qrcode-container{
		width: 300rpx;
		height: 300rpx;
		border-radius: 8rpx;
		background-color: #fff;
		padding: 8rpx;
	}
	.outbox{
		border-radius: 20rpx;
		width: 300rpx;
		height: 300rpx;
		overflow: hidden;
		background-color: #f500fd;
	}
	.qrcode{
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.title{
		text-align: center;
		font-size: 44rpx;
		padding: 48rpx;
		.tips{
			color: #888;
			font-size: 28rpx;
			margin-top: 8rpx;
		}
	}
</style>