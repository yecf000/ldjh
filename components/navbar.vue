<template>
	<view>
		<u-navbar :custom-back='backfuc' :title="title" :background="background" back-icon-color='#fff' title-color='#fff'></u-navbar>
	</view>
</template>

<script>
	export default {
		props:{
			title:{
				type:String
			},
			backfuc:{
				type:Function,
				default:()=>{
					uni.navigateBack()
				}
			}
		},
		data() {
			return {
				background: {
					backgroundColor: "rgba(15, 16, 18, 1)",
				},
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>