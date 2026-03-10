import App from './App'
import { reqAll, reqGet, reqPost } from '@/utils/request.js'
import { commonfuction } from '@/utils/commonfuction.js'
import '@/utils/interceptors.js' //引入拦截
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
import {getlang} from "@/utils/lang.js";
import uView from "uview-ui";
Vue.use(uView);
Vue.prototype.$lang = getlang;
Vue.prototype.$reqAll = reqAll;
Vue.prototype.$reqGet = reqGet;
Vue.prototype.$reqPost = reqPost;
Vue.prototype.$fuc = commonfuction;
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif

if(!localStorage.getItem('lang')){
	localStorage.setItem('lang','ru')
}