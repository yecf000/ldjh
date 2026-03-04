<template>
	<view class="all">
		<navbar title="我的消息"></navbar>
		<view class="null" v-show="!list.length">
			<image src="@/static/icons/null.png" mode="aspectFill"></image>
			<view class="txtnull">
				暂无内容
			</view>
		</view>
		<view class="message">
			<u-collapse  :accordion='false' :item-style='itemstyle'>
				<u-collapse-item @change="readitem(item.is_read,item.id,index)" :titlecolor="item.is_read?'#6e7173':'#fff'" :title="item.title||'无标题通知'" v-for="(item, index) in list" :key="index" :open="item.open"
					:disabled="item.disabled">
					<view style="color: #fff;padding: 12rpx 0;">
					<u-parse :html="item.content"></u-parse>
					</view>
					<view style="margin-top: 8rpx;font-size: 24rpx;">{{item.create_time}}</view>
				</u-collapse-item>
			</u-collapse>
		</view>
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
				list:[],
				itemstyle:{
					marginBottom:'24rpx'
				},
					
				headstyle:{
					color:'#fff'
				},
				itemList: [{
					type:0,
					head: "赏识在于角度的转换",
					body: "只要我们正确择取一个合适的参照物乃至稍降一格去看待他人，值得赏识的东西便会扑面而来",
				}, {
					type:1,
					head: "生活中不是缺少美，而是缺少发现美的眼睛",
					body: "学会欣赏，实际是一种积极生活的态度，是生活的调味品，会在欣赏中发现生活的美",
				}, {
					type:1,
					head: "提现通过通知",
					body: "但是据说雕刻大卫像所用的这块大理石，曾被多位雕刻家批评得一无是处，有些人认为这块大理石采凿得不好，有些人嫌它的纹路不够美",
				}],
			}
		},
		methods:{
			getlist(){
				this.$reqGet("letterlists").then(res=>{
					this.list =  res.data.data.lists
				})
			},
			readitem(k,e,index){
				if(!k){
					this.$reqGet("letterdetail",{
						id:e
					}).then(r=>{
						this.list[index].is_read = true
					})
				}
			}
		},
		onLoad() {
			this.getlist()
		}
	}
</script>

<style lang="scss" scoped>
	.txtnull{
		font-size: 28rpx;
		color: #767878;
	}
	.null{
		padding: 48rpx 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		image{
			width: 500rpx;
			height: 500rpx;
		}
	}
	.message{
		padding: 12rpx 48rpx;
	}
</style>