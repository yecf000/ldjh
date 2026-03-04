export const api = {
	
	myTeam: {
		url: '/api/user/myTeam',
		name: '邀请记录',
		method: 'GET'
	},
	sendCode: {
		url: '/api/sms/sendCode',
		name: '发送短信|邮件',
		method: 'POST'
	},
	levelInfo: {
		url: '/api/user/levelInfo',
		name: '等级信息',
		method: 'GET'
	},
	levelConfig: {
		url: '/api/user/levelConfig',
		name: '获取等级说明',
		method: 'GET'
	},
	problemLists: {
		url: '/api/article/problemLists',
		name: '常见问题列表',
		method: 'GET'
	},
	accountLog: {
		url: '/api/accountLog/lists',
		name: '站内信',
		method: 'GET'
	},
	gameConfig: {
		url: '/api/index/gameConfig',
		name: '游戏基本配置',
		method: 'POST'
	},
	letterdetail: {
		url: '/api/letter.letter/detail',
		name: '已读',
		method: 'GET'
	},
	letterlists: {
		url: '/api/letter.letter/lists',
		name: '站内信',
		method: 'GET'
	},
	ordercancel: {
		url: '/api/c2c.order/cancel',
		name: '取消订单',
		method: 'POST'
	},
	orderafter: {
		url: '/api/c2c.order/after',
		name: '订单售后',
		method: 'POST'
	},
	orderconfirm: {
		url: '/api/c2c.order/confirm',
		name: '确认订单',
		method: 'POST'
	},
	orderpay: {
		url: '/api/c2c.order/pay',
		name: '确认支付',
		method: 'POST'
	},
	
	orderdetail: {
		url: '/api/c2c.order/detail',
		name: '详情',
		method: 'GET'
	},
	
	
	chatlists: {
		url: '/api/chat.chat/lists',
		name: '聊天列表',
		method: 'GET'
	},
	chatdetail: {
		url: '/api/chat.chat/detail',
		name: '聊天详情',
		method: 'GET'
	},
	fastAdd: {
		url: '/api/c2c.order/fastAdd',
		name: '快速匹配',
		method: 'POST'
	},
	
	entrusts: {
		url: '/api/c2c.entrust/lists',
		name: '委托列表',
		method: 'GET'
	},
	entrustList: {
		url: '/api/c2c.entrust/myLists',
		name: '我的委托',
		method: 'GET'
	},
	accountDetail: {
		url: '/api/c2c.store/detail',
		name: '商家详情',
		method: 'GET'
	},
	storeedit: {
		url: '/api/c2c.store/edit',
		name: '商户编辑',
		method: 'POST'
	},
	entrustadd: {
		url: '/api/c2c.entrust/add',
		name: '发起委托',
		method: 'POST'
	},
	entrustcancel: {
		url: '/api/c2c.entrust/cancel',
		name: '取消委托',
		method: 'POST'
	},
	entrustdelete: {
		url: '/api/c2c.entrust/delete',
		name: '删除委托',
		method: 'POST'
	},
	
	
	
	fundrecharge: {
		url: '/api/fund.recharge/recharge',
		name: '充值',
		method: 'POST'
	},
	withdraw: {
		url: '/api/fund.withdraw/withdraw',
		name: '提现',
		method: 'POST'
	},
	
	withdrawlists: {
		url: '/api/fund.withdraw/lists',
		name: '提现列表',
		method: 'GET'
	},
	
	setInfo: {
		url: '/api/user/setInfo',
		name: '修改信息',
		method: 'POST'
	},
	accountadd: {
		url: '/api/user.account/add',
		name: '添加渠道',
		method: 'POST'
	},
	accountedit: {
		url: '/api/user.account/edit',
		name: '编辑渠道',
		method: 'POST'
	},
	accountdelete: {
		url: '/api/user.account/delete',
		name: '删除渠道',
		method: 'POST'
	},
	
	accountLists: {
		url: '/api/user.account/lists',
		name: '渠道列表',
		method: 'GET'
	},
	
	
	
	
	userReal: {
		url: '/api/user/userReal',
		name: '用户认证',
		method: 'POST'
	},
	
	myLists: {
		url: '/api/game.game/myLists',
		name: '投资记录',
		method: 'GET'
	},
	userfund: {
		url: '/api/user/fund',
		name: '资金信息',
		method: 'GET'
	},
	userinfo: {
		url: '/api/user/info',
		name: '头像昵称',
		method: 'GET'
	},
	gamelist: {
		url: '/api/game.game/lists',
		name: '矿产记录',
		method: 'GET'
	},
	usercenter: {
		url: '/api/user/center',
		name: '用户中心',
		method: 'GET'
	},
	storeadd: {
		url: '/api/c2c.store/add',
		name: '商户申请',
		method: 'POST'
	},
	
	register: {
		url: '/api/login/register',
		name: '注册并登录',
		method: 'POST'
	},
	rechargelists: {
		url: '/api/fund.recharge/lists',
		name: '列表',
		method: 'GET'
	},
	
	
	login: {
		url: '/api/login/account',
		name: '登录',
		method: 'POST'
	},

}