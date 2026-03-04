import {
	baseURL
} from './env.js'
import {
	api
} from './api.js'
// 请求拦截
const fetch = (url, opt) => {
	let urls = (api[opt.url]?.url || api[url]?.url);
	let params = opt.params ? ('?' + Object.keys(opt.params).map(key => key + '=' + opt.params[key]).join('&')) : ''
	opt.url = baseURL + urls + params
	opt.method = opt.method || "GET";
	var header = {}
	let token = uni.getStorageSync('token')
	if (token) {
		header = {
			Authorization: 'Bearer ' + token,
			token: token
		}
	}
	opt.header = {
		...opt.header,
		...header
	}
	opt.data = opt.data || {};
	return new Promise((resolve, reject) => {
		let options = {}
		Object.keys(opt).map(key => {
			if (key !== "params") {
				return options[key] = opt[key]
			}
		})
		uni.request(options)
			.then(res => interceptorsRes(res, resolve, reject))
			.catch(err => interceptorsErr(err, reject))
	})
}

// 响应拦截
const interceptorsRes = (res, resolve, reject) => {
	let code = res.data.code
	if(code == -2){
		// console.log("666666")
		uni.showToast({
			icon: 'none',
			title: '登录超时'
		})
		uni.removeStorageSync('token')
		setTimeout(()=>{
			uni.redirectTo({
				url:'/pages/otherpages/login'
			})
		},1500)
		
	}
	if (code == 1) {
		resolve(res)
	} else {
		uni.showToast({
			icon: 'none',
			title: res.data.msg
		})
		reject(res)
	}
}

// 异常处理
const interceptorsErr = (err, reject) => {
	uni.showToast({
		icon: 'none',
		title: "网络异常" + err
	})
	reject(err)
}

export {
	fetch
}
