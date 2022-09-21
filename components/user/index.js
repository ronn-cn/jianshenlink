// components/user/index.js
const app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    options: {
        addGlobalClass: true,
    },

    /**
     * 组件的初始数据
     */
    data: {
        hasUserInfo: false,
        avatarUrl: "",
        nickName: "",
        obj: null,
        sport: 0,
        vitality: 0,
        star: 0,
        sex: 0,
        age: 0,



        // userId: "",
        // avatarUrl: "",
        // nickName: "",
        // sex: 0,
        // age: 0,
        // birthday: "",
        // svrUrl: "",

        // planId: "",
        // sportScore: 0,
        // vitalityScore: 0,
        // starNumber: 0,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 恢复默认数据
        restoreDefaultData: function () {
            // this.setData({
            //     hasUserInfo: false,
            //     userId: "",
            //     avatarUrl: "",
            //     nickName: "",
            //     sex: 0,
            //     age: 0,
            //     birthday: "",
            //     svrUrl: "",

            //     planId: "",
            //     sportScore: 0,
            //     vitalityScore: 0,
            //     starNumber: 0,
            // })

            this.setData({
                hasUserInfo: false,
                avatarUrl: "",
                nickName: "",
                obj: null,
            });
        },
        // 微信退出登录
        weixinLogout: function () {
            app.globalData.userInfo = null;
            wx.removeStorageSync('userInfo');
            app.globalData.ev = {
                userId: "",
                userJWT: "",
                userAll: null,
                svrUrl: "https://sport.evinf.cn/",
            }
            wx.removeStorageSync('ev');
            app.globalData.sg = {
                userId: "",
                userJWT: "",
                userAll: null,
                svrUrl: "https://sport.sportguider.com/",
            }
            app.globalData.userPhone = "";
            wx.removeStorageSync('sg');

            // 恢复本页默认数据，跳转登录授权页面
            this.restoreDefaultData();
            wx.redirectTo({
                url: '/pages/login/index',
            })
        },

        requestUserData: function () {
            let userId = this.data.obj.userId;
            let svrUrl = this.data.obj.svrUrl;
            // 判断存在用户信息
            if (userId != "") {
                wx.request({
                    url: svrUrl + 'get-user-all?user_id=' + userId,
                    success: res => {
                        console.log(res.data)
                        if (res.data.code == "200") {
                            let userAll = res.data.data;
                            app.setUserAll(userAll);

                            let age = 0
                            if (userAll.user.birthday != "") {
                                age = new Date().getFullYear() - new Date(userAll.user.birthday).getFullYear()

                            }
                            this.setData({
                                sport: userAll.data.sport_power,
                                vitality: userAll.data.life_power,
                                star: userAll.total.star_count,
                                sex: userAll.user.sex,
                                age: age,
                                birthday: userAll.user.birthday,
                            });
                        }
                    }
                })
            }
        },
        // 刷新用户数据函数
        RefreshUserData: function () {
            if (app.globalData.userInfo != null) {
                this.setData({
                    hasUserInfo: true,
                    avatarUrl: app.globalData.userInfo.avatarUrl,
                    nickName: app.globalData.userInfo.nickName,
                });

                if (app.globalData.netName == "evinf") {
                    this.setData({
                        obj: app.globalData.ev,
                    });
                } else {
                    this.setData({
                        obj: app.globalData.sg,
                    });
                }
                this.requestUserData();
            }
        },
        weixinLoginTap: function () {
            this.triggerEvent('weixinLoginTap');
        },
        planTap: function () {
            var that = this;
            let planId = "";
            wx.request({
                url: that.data.obj.svrUrl + 'get-user-all?user_id=' + that.data.obj.userId + '&time=' + new Date().getTime(),
                success: function (res) {
                    console.log("url:" + that.data.obj.svrUrl + 'get-user-all?user_id=' + that.data.obj.userId + '&time=' + new Date().getTime());
                    console.log(res.data);
                    if (res.data.code == "200") {
                        that.setData({
                            userInfoAll: res.data.data,
                        });

                        planId = that.data.userInfoAll.data.user_plan_id;
                        if (planId != ""){
                            console.log(planId);
                            let ut = JSON.parse(that.data.userInfoAll.data.user_timetable)
                            if (ut.length > 0) {
                                var date1 = new Date(ut[ut.length - 1].date);
                                let nowdate = new Date();
                                let todaydate = nowdate.getFullYear() + "-" + (nowdate.getMonth() + 1) + "-" + nowdate.getDate()
                                var date2 = new Date(todaydate);
                                if (date2 - date1 > 0) {
                                    planId = "";
                                }
                            }
                        }
                    }
                    that.triggerEvent('planTap', planId);
                },
                fail: function(){
                    that.triggerEvent('planTap', planId);
                }
            })
        },
        vitalityTap: function () {
            this.triggerEvent('vitalityTap');
        },
        sportTap: function () {
            this.triggerEvent('sportTap');
        },
        editTap: function () {
            let s = 0;
            if (this.data.sex == 1) {
                s = 1;
            } else if (this.data.sex == 2) {
                s = 0;
            } else {
                s = 2;
            }
            let d = {
                sex: s,
                birthday: this.data.birthday
            }
            this.triggerEvent('editTap', d);
        }
    },

    lifetimes: {
        ready() {

            this.RefreshUserData();
        }
    }
})