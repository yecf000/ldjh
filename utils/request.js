import { fetch } from './interceptos.js'
var token = uni.getStorageSync('token')
const obj = {
  headerGET: {
    "Content-type":'application/x-www-from-urlencoded',
	// "token":uni.getStorageSync('token')
	// "Authorization": 'Bearer '+ token
  },
  headerPOST: {
    "Content-type":'application/json',
	// "Authorization": 'Bearer '+ token
  },
}

// 通用接口请求
export const reqAll = (url,params,opt={}) => {
  opt.data = params
  opt.header = obj['headerPOST']
  return fetch(url,opt)
}

// get请求
export const reqGet = (url,params,opt={}) => {
  opt.header = obj['headerGET']
  opt.method = "GET"
  opt.data = params
  return fetch(url,opt)
}

// post请求
export const reqPost = (url,params,opt={}) => {
  opt.header = obj['headerPOST']
  opt.method = "POST"
  opt.data = params
  return fetch(url,opt)
}