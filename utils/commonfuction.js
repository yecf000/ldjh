import {
	baseURL
} from '@/utils/env.js'
// 通用函数
export const commonfuction = {
	// 加密
	encrypt(obj, password = 'ldjh') {
		try {
			// 1. 转换为JSON字符串
			const jsonStr = JSON.stringify(obj);

			// 2. 简单的字符移位加密
			let encrypted = '';
			for (let i = 0; i < jsonStr.length; i++) {
				const charCode = jsonStr.charCodeAt(i);
				const keyChar = password.charCodeAt(i % password.length);
				encrypted += String.fromCharCode(charCode + keyChar);
			}

			// 3. Base64编码
			let base64 = btoa(unescape(encodeURIComponent(encrypted)));

			// 4. 添加~符号作为分隔符
			const parts = [
				base64.substring(0, 8),
				base64.substring(8, 16),
				base64.substring(16)
			];

			return parts.join('~') + '~' + Date.now();

		} catch (error) {
			console.error('加密失败:', error);
			return null;
		}
	},

	// 解密
	decrypt(encryptedStr, password = 'ldjh') {
		try {
			// 1. 分割字符串
			const parts = encryptedStr.split('~');
			if (parts.length < 3) {
				throw new Error('无效的加密格式');
			}

			// 2. 移除时间戳，重组Base64
			const base64 = parts.slice(0, -1).join('');

			// 3. Base64解码
			const decoded = decodeURIComponent(escape(atob(base64)));

			// 4. 字符移位解密
			let decrypted = '';
			for (let i = 0; i < decoded.length; i++) {
				const charCode = decoded.charCodeAt(i);
				const keyChar = password.charCodeAt(i % password.length);
				decrypted += String.fromCharCode(charCode - keyChar);
			}

			// 5. 解析为Object
			return JSON.parse(decrypted);

		} catch (error) {
			console.error('解密失败:', error);
			return null;
		}
	},
formatDate(timestamp) {
  // 10位时间戳需要乘以1000转换为毫秒
  const date = new Date(timestamp * 1000);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
},
	gotopage: (e) => {
		// console.log(e)
		uni.navigateTo({
			url: e
		})
	},
	formatTimestamp(timestamp, language = 'zh') {
	    let date;
	    
	    // 处理不同类型的入参
	    if (typeof timestamp === 'string') {
	        // 处理 xxxx-xx-xx xx:xx:xx 格式
	        if (timestamp.includes('-') && timestamp.includes(':')) {
	            date = new Date(timestamp.replace(/-/g, '/'));
	        } 
	        // 处理 xxxx-xx-xx 格式
	        else if (timestamp.includes('-')) {
	            date = new Date(timestamp.replace(/-/g, '/'));
	        }
	        // 处理其他字符串格式
	        else {
	            date = new Date(timestamp);
	        }
	    } 
	    // 处理数字时间戳（秒级）
	    else if (typeof timestamp === 'number') {
	        // 判断是秒级还是毫秒级时间戳
	        if (timestamp < 10000000000) {
	            date = new Date(timestamp * 1000);
	        } else {
	            date = new Date(timestamp);
	        }
	    } 
	    // 处理 Date 对象
	    else if (timestamp instanceof Date) {
	        date = timestamp;
	    }
	    // 无效参数
	    else {
	        console.error('Invalid timestamp format:', timestamp);
	        return '';
	    }
	    
	    // 检查日期是否有效
	    if (isNaN(date.getTime())) {
	        console.error('Invalid date:', timestamp);
	        return '';
	    }
	    
	    const now = new Date();
	    const diffMs = now - date; // 毫秒差
	    const diffMins = Math.floor(diffMs / (1000 * 60)); // 分钟差
	    const diffHours = Math.floor(diffMs / (1000 * 60 * 60)); // 小时差
	    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // 天数差
	    
	    const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
	    
	    // 1分钟内：刚刚
	    if (diffMins < 1) {
	        return language === 'zh' ? '刚刚' : 'Just now';
	    }
	    // 1小时内：xx分钟前
	    else if (diffMins < 60) {
	        if (language === 'zh') {
	            return `${diffMins}分钟前`;
	        } else {
	            return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
	        }
	    }
	    // 1天内：显示时间
	    else if (diffHours < 24) {
	        return timeStr;
	    }
	    // 1周内：显示星期
	    else if (diffDays < 7) {
	        if (language === 'zh') {
	            const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
	            return `星期${weekDays[date.getDay()]} ${timeStr}`;
	        } else {
	            const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	            return `${weekDays[date.getDay()]} ${timeStr}`;
	        }
	    }
	    // 超过1周：显示完整日期
	    else {
	        const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
	        return `${dateStr} ${timeStr}`;
	    }
	},
	
	uploadImgae: (urls, mode = '1') => {
		return new Promise((resolve, reject) => {
			let perhead = {
				token: '',
			}
			let token = uni.getStorageSync('token')
			if (token) {
				// header.Authorization = 'Bearer '+ token
				perhead.token = token
			}
			if (mode == '1') {
				uni.uploadFile({
					header: perhead,
					url: baseURL + '/api/upload/image',
					filePath: urls,
					name: 'file',
					success: (res) => {
						let response = JSON.parse(res.data)
						resolve(response.data.uri)
					},
					fail: (err) => {
						reject(res)
					}
				})
			} else if (mode == '2') {

			} else {
				uni.showToast({
					title: 'no such mode',
					icon: 'none'
				})
			}
		})
	},
	
	// utils/numberFormatter.js
	formatNumber(value,num) {
	  if (value === null || value === undefined || value === '') {
	    return ''
	  }
	  if(num||num===0){
		  value = Number(value).toFixed(num)
	  }
	  const strValue = String(value)
	  
	  // 检查是否是数字（包括负数和小数）
	  if (!/^-?\d+(\.\d+)?$/.test(strValue)) {
	    return strValue
	  }
	  
	  // 分割整数和小数部分
	  const parts = strValue.split('.')
	  const integerPart = parts[0]
	  const decimalPart = parts[1]
	  
	  // 处理负数
	  const sign = integerPart[0] === '-' ? '-' : ''
	  const absInteger = sign ? integerPart.slice(1) : integerPart
	  
	  // 格式化整数部分
	  let formattedInteger = ''
	  let count = 0
	  
	  // 从右往左每3位添加逗号
	  for (let i = absInteger.length - 1; i >= 0; i--) {
	    formattedInteger = absInteger[i] + formattedInteger
	    count++
	    if (count % 3 === 0 && i !== 0) {
	      formattedInteger = ',' + formattedInteger
	    }
	  }
	  
	  // 拼接符号和小数部分
	  let result = sign + formattedInteger
	  if (decimalPart !== undefined) {
	    result += '.' + decimalPart
	  }
	  
	  return result
	}
}