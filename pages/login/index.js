// pages/login/index.js

const app = getApp();
// 避免重复授权的标记，flase 未授权
var authMark = false;

Page({

    /**
     * 页面的初始数据
     */
    data: {
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        authMark = false;
        
		//如果没有授权的话跳转到登录页面
		if(app.globalData.userInfo != null){
			wx.reLaunch({
				url: '/pages/index/index',
			});
		}
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    // 授权登录
    authorizedLoginTap: function () {
        var that = this;
        console.log(authMark);
        // 判断当前状态为未授权状态
        if (!authMark) {
            // 授权中，目前状态只能点击一次
            authMark = true;

            // 呼出微信授权底部弹窗
            wx.getUserProfile({
                desc: '展示用户信息',
                success: resUserProfile => {
                    app.setUserInfo(resUserProfile.userInfo);
                    wx.login({
                        success: resWxLogin => {
                            console.log(resWxLogin);
                            // 调用两个服务器的微信登录
                            if (resWxLogin.code) {
                                let serverUrl = app.globalData.sg.svrUrl;
                                if (app.globalData.netName == "evinf") {
                                    serverUrl = app.globalData.ev.svrUrl;
                                }
                                wx.request({
                                    url: serverUrl + 'login/wechat',
                                    method: "POST",
                                    header: {
                                        "content-type": "application/x-www-form-urlencoded"
                                    },
                                    data: {
                                        code: resWxLogin.code
                                    },
                                    success: resLogin => {
                                        console.log(resLogin);
                                        if (resLogin.statusCode == 200 && resLogin.data.code == "200") {
                                            var result = resLogin.data.data;
                                            console.log("result", result)
                                            app.setUserAuth(result);
                                            // 请求用户全部信息
                                            wx.request({
                                                url: serverUrl + 'get-user-all?user_id=' + result.user_id,
                                                success: resUserAll => {
                                                    console.log(resUserAll.data)
                                                    if (resUserAll.data.code == "200") {
                                                        let userAll = resUserAll.data.data;
                                                        app.setUserAll(userAll);
                                                        if (userAll.user.birthday == "") {
                                                            // 跳转到设置性别出生日期页面
                                                            wx.redirectTo({
                                                                url: '/pages/login/profile?first=1&sex='+userAll.user.sex
                                                            });
                                                        } else {
                                                            wx.redirectTo({
                                                                url: '/pages/index/index'
                                                            });
                                                        }
                                                    }
                                                }
                                            })

                                            // 跳转到下一个页面 
                                            // wx.navigateTo({
                                            //     url: '/pages/login/profile'
                                            // })
                                        }
                                    },
                                    fail: resLoginFail => {
                                        console.log(resLoginFail);
                                    }
                                });
                            }
                        },
                        fail: function () {
                            authMark = false;
                        }
                    })
                },
                fail: function () {
                    // 授权失败，将标记置false
                    authMark = false;
                }
            });
        }
    }
})