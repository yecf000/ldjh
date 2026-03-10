<template>
	<view class="all">
		<navbar :title="$lang('我的消息')"></navbar>
		<view class="null" v-show="!list.length">
			<image src="@/static/icons/null.png" mode="aspectFill"></image>
			<view class="txtnull">
				{{$lang('暂无内容')}}
			</view>
		</view>
		<view class="message">
			<u-collapse  :accordion='false' :item-style='itemstyle'>
				<u-collapse-item @change="readitem(item.is_read,item.id,index)" :titlecolor="item.is_read?'#6e7173':'#fff'" :title="item.title||$lang('无标题通知')" v-for="(item, index) in list" :key="index" :open="item.open"
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
				itemList: [],
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