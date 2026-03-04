// prod 生产 dev 开发
const env = "prod"


const prod = {
  url: 'https://admin.isfexag.com', // 线上环境'
  appKey: 'wx7e6fbbbea7d597ef'
}
const dev = {
  url: 'https://admin.isfexag.com', // 生产环境'
  appKey: 'wx7e6fbbbea7d597ef'
}
const test = {
  url: 'https://petsphp.hanyue325.com/api', // 测试环境'
  appKey: 'wx7e6fbbbea7d597ef'
}



const config = {
  dev,
  prod,
  test,
}

let baseURL = config[env].url;
let appKey = config[env].appKey

export  {
  baseURL,
  appKey
}