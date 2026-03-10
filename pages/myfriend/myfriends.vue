<template>
	<view class="all">
		<!-- <navbar title="我的通讯"></navbar> -->
		<view class="placeholdersearch">
			
		</view>
		<view class="searchbar">
			<u-search animation bg-color='#333' color='#fff' :placeholder="$lang('请输入关键词')" v-model="keyword" :action-style="{color:'#fff'}"></u-search>
		</view>
		<view class="null" v-if="friendlist.length==0">
			<image src="@/static/icons/null.png" mode="aspectFill"></image>
		</view>
		<view class="accontlist">
			<view class="accontitem" @click="$u.route(`/pages/otherpages/impage?cid=${i.id}&ruid=${i.chat_user_info?i.chat_user_info.id:'0'}`)" v-for="(i,index) in friendlist" :key="i.sn">
				<view class="accontinfo">
					<image :src="i.chat_user_info?i.chat_user_info.avatar:`@/static/icons/defaultavatar.png`" mode="aspectFill"></image>
					<view class="infos">
						<view class="nickname">{{i.chat_user_info?i.chat_user_info.nickname:$lang('陌生人')}}</view>
						<view class="message"><div class="lme">{{i.last_msg||' '}}</div> <span>{{$fuc.formatTimestamp(i.update_time)||''}}</span> </view>
					</view>
				</view>
				<view class="unread" v-show="i.ifread==0" ></view>
			</view>
		</view>
		<view class="placeholderpart">
			
		</view>
		<view class="placeholdertabbar">
		</view>
		<tabbar :current="3"></tabbar>
		<zero-loading color='#F0E68C' mask v-if="loading" showText textColor='#fff' :maskOpacity='0.8'></zero-loading>
	</view>
</template>

<script>
import tabbar from '@/components/tabbar.vue'
	export default {
		components: {
			tabbar
		},
		data() {
			return {
				loading:true,
				keyword:'',
				friendlist:[]
			}
		},
		onLoad() {
			this.chatlists()
		},
		methods:{
			chatlists(){
				this.$reqGet('chatlists').then(res=>{
					this.friendlist = res.data.data.lists
				}).finally(v=>{
					this.loading = false
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.placeholdersearch{
		height: 88rpx;
	}
	.placeholdertabbar {
		height: 120rpx;
	}
	.placeholderpart{
		height: 42rpx;
	}
	.accontitem{
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12rpx 0;
		.unread{
			width: 18rpx;
			height: 18rpx;
			border-radius: 50%;
			background-color: #723609;
		}
		.accontinfo{
			display: flex;
			align-items: center;
			.infos{
				display: flex;
				flex-direction: column;
				margin-left: 24rpx;
				justify-content: space-between;
				.nickname{
					color: #fff;
					font-weight: bold;
				}
				.message{
					margin-top: 12rpx;
					color: #a6a9a9;
					font-size: 24rpx;
					display: flex;
					align-items: center;
					.lme{
						max-width: 400rpx;
						text-overflow: ellipsis;
						overflow: hidden;
						white-space: nowrap;
						word-break: break-word;
					}
					span{
						color: #787b7c;
						margin-left: 12rpx;
					}
				}
			}
			image{
				width: 96rpx;
				height: 96rpx;
				border-radius: 50%;
				background-color: #242524;
			}
		}
	}
	.accontlist{
		margin-top: 24rpx;
		padding: 0 32rpx;
		display: flex;
		flex-direction: column;
	}
	.searchbar{
		top: 0;
		position: fixed;
		width: 100%;
		background-color: #000;
		z-index: 8;
		width: 100%;
		padding: 24rpx 42rpx;
	}
	.null{
		display: flex;
		align-items: center;
		justify-content: center;
		image{
			width: 380rpx;
			height: 380rpx;
			opacity: .7;
		}
	}
</style>