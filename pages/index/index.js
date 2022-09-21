// index.js
// 获取应用实例
const app = getApp();

// 避免重复授权的标记
var authMark = true;

// 私有自定义函数
function getQueryVariable(query, variable) {
	var params = query.split("?");
	if (params.length > 1) {
		var vars = params[1].split("&");
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			if (pair[0] == variable) {
				return pair[1];
			}
		}
	}
	return (false);
}

Page({
	data: {
		obj: null,
		PageCur: 'home',
        bgColor: '',
        isShow: false,
    },
    hideCover(){
        this.setData({
            isShow: false
        })
    },
  //获取电话号
  onGetPhoneNumber(e) {
    // console.log(e)
    // console.log(e.detail.code)
    let that = this;
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        title: '提示',
        content: "授权失败",
        showCancel: false
      })
      return;
    } else {
      console.log(app.globalData.userInfo)
      let svrObj = app.globalData.sg;
      if(app.globalData.netName == "evinf"){
          svrObj = app.globalData.ev;
      }
      let requestData = {
        user_id: svrObj.userId,
        phone_code: e.detail.code
      }
      wx.request({
        url: svrObj.svrUrl + 'get-phone',
        data: requestData,
        method: "POST",
        success: function(res){
            if (res.data.code == '200'){
                console.log(res.data)
                let phone = res.data.data.phone
                if (phone){
                    app.globalData.userPhone = phone;
                    that.setData({
                        isShow: false,
                    })
                }
            }
        }
      })
    }
  },

	onLoad: function (options) {
		// 判断是扫码进入
		let url = decodeURIComponent(options.q);
		if (url != "undefined") {
			if (url.indexOf("evinf") >= 0) {
				app.globalData.netName = "evinf";
				this.data.obj = app.globalData.ev;
			} else {
				app.globalData.netName = "sportguider";
				this.data.obj = app.globalData.sg;
			}
			if (url.indexOf("device") >= 0) {
				let ouid = getQueryVariable(url, "ouid");

				// 判断授权
				if (app.globalData.userInfo != null) {
					this.loginDevice(ouid);
				} else {
					wx.navigateTo({
						url: '/pages/login/index',
					});
				}
			}
		} else {
			if (app.globalData.netName == "evinf") {
				this.data.obj = app.globalData.ev;
			} else {
				this.data.obj = app.globalData.sg;
			}
		}

		//如果没有授权的话跳转到登录页面
		// if(app.globalData.userInfo == null){
		// 	wx.reLaunch({
		// 	  url: '/pages/login/index',
		// 	});
		// }
    },
    onShow: function(e){
        console.log(app.globalData.userInfo)
        console.log(app.globalData.userPhone)
        if(app.globalData.userInfo){
            if(app.globalData.userPhone){
                this.setData({
                    isShow: false,
                })
            } else {
                this.setData({
                    isShow: true,
                })
            }
        }
    },
	// 底部导航改变函数
	NavChange(e) {
		this.setData({
			PageCur: e.currentTarget.dataset.cur
		});
		if (wx.pageScrollTo) {
			wx.pageScrollTo({
				scrollTop: 0
			})
		}
	},
	// 点击扫码按钮的处理函数
	scanCodeTapHandle: function () {
		let that = this;
		if (app.globalData.userInfo != null) {
			// 判断用户信息存在，直接开启扫码
			wx.scanCode({
				onlyFromCamera: true,
				success: function (sc_res) {
					let url = sc_res.result;
					//string.includes(word);
					if (url.indexOf("evinf") >= 0) {
						app.globalData.netName = "evinf";
						that.data.obj = app.globalData.ev;
					} else {
						app.globalData.netName = "sportguider";
						that.data.obj = app.globalData.sg;
					}
					var ouid = getQueryVariable(url, "ouid");
					// 登录到设备
					console.log(that.data.obj);
					that.loginDevice(ouid);
				}
			});
		} else {
			wx.navigateTo({
				url: '/pages/login/index',
			});
		}
	},
	loginDevice: function (ouid) {
		console.log("loginDevice");
		let that = this;
		// 请求登录到设备
		// console.log(app.globalData.userInfo);
		wx.request({
			url: that.data.obj.svrUrl + 'login/device',
			method: "POST",
			header: {
				"content-type": "application/json"
			},
			data: {
				"device_id": ouid,
				"user_id": that.data.obj.userId,
				"user_jwt": that.data.obj.userJWT,
				"user_name": app.globalData.userInfo.nickName,
				"user_avatar": app.globalData.userInfo.avatarUrl
			},
			success: res2 => {
				console.log("loginDevice:", res2);
				if (res2.statusCode == 200 && res2.data.code == "200") {
					wx.showToast({
						title: '登录成功',
						duration: 1000,
					});
					setTimeout(function () {
						wx.showToast({
							title: '器械无操作10分钟后自动退出',
							icon: 'none',
							duration: 3000,
						});
					}, 1000)
				} else {
					// 不正确
					wx.showToast({
						title: "未成功登录",
						duration: 1000,
					})
				}
			},
			fail: res2 => {
				wx.showToast({
					title: '登录失败',
					duration: 1000,
				})
			}
		})
	},
	weixinLoginTapHandle: function () {
		wx.navigateTo({
			url: '/pages/login/index'
		})
	},
	planTapHandle: function (e) {
		if (app.globalData.userInfo != null) {
			console.log("plan:", e);
			if (e.detail != "") {
				wx.navigateTo({
					url: '/pages/user/plan'
				})
			} else {
				wx.showToast({
					title: '当前没有开启任何计划',
					icon: 'none'
				});
			}
		}
	},
	vitalityTapHandle: function () {
		if (app.globalData.userInfo != null) {
			wx.navigateTo({
				url: '/pages/user/vitality'
			})
		}
	},
	sportTapHandle: function () {
		if (app.globalData.userInfo != null) {
			wx.navigateTo({
				url: '/pages/user/sport'
			})
		}
	},
	editTapHandle: function (e) {
		console.log(e.detail);
		wx.navigateTo({
			url: '/pages/login/profile?first=0&sex=' + e.detail.sex + '&birthday=' + e.detail.birthday
		})
	},
	// 刷新主页数据
	RefreshUserData: function(){
		let userComponent = this.selectComponent('#user-component');
		userComponent.RefreshUserData();
	},

	/**
	 * 页面滚动
	 */
	onPageScroll: function (e) {
		console.log(e.scrollTop)
		if (e.scrollTop <= 0) {
			if (this.data.bgColor != '') {
				this.setData({
					bgColor: ''
				})
			}
		} else {
			if (this.data.bgColor == '') {
				this.setData({
					bgColor: '#fff'
				})
			}
		}
	}
})