// 页面白名单，不受拦截
const whiteList = [
	"/otherpage/login/index",
	"/otherpage/login/code",
	// '/pages/release/release',
	// '/pages/mine/mine'
]

function hasPermission(url) {
	//isLogin是登录成功后在本地存储登录标识，存储一个能够判断用户登录的唯一标识就行，根据自己存储的数据类型来判断
	let islogin = uni.getStorageSync('isLogin');
	islogin = Boolean(Number(islogin)); //返回布尔值
	// 在白名单中或有登录判断条件可以直接跳转
	if (whiteList.indexOf(url) !== -1 || islogin) {
		// console.log('跳转的页面在白名单内或是已登录')
		return true
	} else {
		// console.log(url)
		// console.log('跳转的页面不在白名单内且未登录')
		return true
	}
	return false
}
uni.addInterceptor('navigateTo', {
	// 页面跳转前进行拦截, invoke根据返回值进行判断是否继续执行跳转
	invoke(e) {
		const url = e.url.split('?')[0]
		if (!hasPermission(url)) {
			uni.reLaunch({
				url: '/otherpage/login/index'
			})
			return false
		}
		return true
	},
	success(e) {

	}
})

uni.addInterceptor('switchTab', {
	// tabbar页面跳转前进行拦截
	invoke(e) {
		if (!hasPermission(e.url)) {
			uni.reLaunch({
				url: '/otherpage/login/index'
			})
			// console.log('跳转的页面在白名单内或是已登录')
			return false
		}
		// console.log('跳转的页面不在白名单内且未登录')
		return true
	},
	success(e) {

	}
})