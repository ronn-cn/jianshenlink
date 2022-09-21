// app.js
App({
	onLaunch() {
		let sg = wx.getStorageSync('sg');
		if (sg) {
			console.log("sg:", sg);
			this.globalData.sg = JSON.parse(sg);
		}
		let ev = wx.getStorageSync('ev');
		if (ev) {
			console.log("ev:", ev);
			this.globalData.ev = JSON.parse(ev);
		}
		let userInfo = wx.getStorageSync('userInfo');
		if (userInfo) {
			console.log("userInfo:", userInfo);
			this.globalData.userInfo = JSON.parse(userInfo);
		}

		wx.getSystemInfo({
			success: e => {
				this.globalData.StatusBar = e.statusBarHeight;
				let custom = wx.getMenuButtonBoundingClientRect();
				this.globalData.Custom = custom;
				this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
			}
		})
		
		//如果没有授权的话跳转到登录页面
		// if(this.globalData.userInfo == null){
		// 	wx.reLaunch({
		// 	  url: '/pages/login/index',
		// 	});
		// } else {
		// 	wx.reLaunch({
		// 		url: '/pages/index/index',
		// 	});
		// }
	},
	globalData: {
		netName: "sportguider",
        userInfo: null,
        userPhone: "",
		sg: {
			userId: "",
			userJWT: "",
			userAll: null,
			svrUrl: "https://sport.sportguider.com/",
		},
		ev: {
			userId: "",
			userJWT: "",
			userAll: null,
			svrUrl: "https://sport.evinf.cn/",
		}
	},
	// 设置用户信息函数
	setUserInfo(user) {
		this.globalData.userInfo = user;
		wx.setStorageSync('userInfo', JSON.stringify(user));
	},
	// 设置用户权限信息
	setUserAuth(user) {
		if(this.globalData.netName == "evinf"){
			this.globalData.ev.userId = user.user_id;
			this.globalData.ev.userJWT = user.user_jwt;
			this.globalData.userPhone = user.user_phone;
			wx.setStorageSync('ev', JSON.stringify(this.globalData.ev));
		} else {
			this.globalData.sg.userId = user.user_id;
			this.globalData.sg.userJWT = user.user_jwt;
			this.globalData.userPhone = user.user_phone;
			wx.setStorageSync('sg', JSON.stringify(this.globalData.sg));
		}
	},
	// 设置用户全部信息
	setUserAll(userall){
		if(this.globalData.netName == "evinf"){
			this.globalData.ev.userAll = userall;
			wx.setStorageSync('ev', JSON.stringify(this.globalData.ev));
		} else {
			this.globalData.sg.userAll = userall;
			wx.setStorageSync('sg', JSON.stringify(this.globalData.sg));
		}
	}
})