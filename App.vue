<script>
	export default {
		data() {
			return {
			}
		},
		onLaunch() {
		},
		onShow: function() {},
		onHide: function() {},
		
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
		
	uni-tabbar{
		opacity: 0;
	}
	/*每个页面公共css */
	page {
		color: #fff;
		background-color: rgba(15, 16, 18, 1);
		font-family: 'MyCustomFont', sans-serif;
	}
	
	
	@font-face {
	  font-family: 'MyCustomFont';
	  src: url('@/static/font/hm.ttf') format('truetype');
	  font-display: swap; // 优化字体加载显示
	}
	
	
</style>