// pages/user/plan.js
const app = getApp();
const positionJSON = {
    "endurance": "耐力",
    "power": "力量",
    "control": "控制",
    "balance": "平衡",
    "flexibility": "柔韧",
    "shoulder": "肩部",
    "arm": "臂部",
    "back": "背部",
    "chest": "胸部",
    "abdominal": "腹部",
    "hip": "臀部",
    "leg": "腿部",
    "muscle": "增肌",
    "fat": "减脂",
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        obj: null,
        dateString: "",
        planName: "",
        planDay: 0,
        realDay: 0,
        percentage: 0,
        spotArr: [],
        position: "暂无",
        positionStatus: -1,
        bgColor: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (app.globalData.netName == "evinf") {
            this.data.obj = app.globalData.ev;
        } else {
            this.data.obj = app.globalData.sg;
        }
        this.requestUserData();
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

    // 开启课程按钮
    startLessonTap: function () {
        wx.showToast({
            title: '请到健身镜开启课程训练！',
            icon: 'none'
        })
    },
    dateChange(e) {
        console.log("选中日期变了,现在日期是", e.detail.dateString)
        this.setData({
            dateString: e.detail.dateString
        });

        if (this.data.userInfoAll) {
            console.log(this.data.userInfoAll);
            if (this.data.userInfoAll.data.user_timetable != "") {
                // 获取用户的排期日程
                let schedule = JSON.parse(this.data.userInfoAll.data.user_timetable);
                let positionStatus = -1;
                if (schedule) {
                    for (let i = 0; i < schedule.length; i++) {
                        if (schedule[i].date == e.detail.dateString) {
                            if (schedule[i].value == 0) {
                                // 判断日期为今日小的日期
                                let selectTime = new Date(e.detail.dateString).getTime();
                                let todayTime = new Date().getTime();
                                console.log(selectTime, todayTime);
                                if (todayTime - selectTime > 24 * 3600000) {
                                    positionStatus = 0;
                                } else {
                                    positionStatus = 2;
                                }
                            } else {
                                positionStatus = 1;
                            }
                            for (var key in positionJSON) {
                                if (key == schedule[i].sport_guider) {
                                    console.log(positionJSON[key]);
                                    this.setData({
                                        position: positionJSON[key],
                                        positionStatus: positionStatus
                                    });
                                    return
                                }
                            }
                        }
                    }
                }
            }
            this.setData({
                position: "暂无",
                positionStatus: -1
            });
        }

    },
    requestUserData: function () {
        let that = this;
        let userId = that.data.obj.userId;
        if (userId) {
            wx.request({
                url: that.data.obj.svrUrl + 'get-user-all?user_id=' + userId+"&time="+new Date().getTime(),
                success: function (res) {
                    console.log(res.data)
                    if (res.data.code == "200") {
                        let planDay = 0;
                        let realDay = 0;
                        let percentage = 0;
                        let spotArr = new Array();
                        let position = "";
                        let positionStatus = -1;
                        if (res.data.data.data.user_timetable != "") {
                            // 获取用户的排期日程
                            let schedule = JSON.parse(res.data.data.data.user_timetable);
                            if (schedule) {
                                planDay = schedule.length;
                                realDay = 0;
                                for (let i = 0; i < planDay; i++) {
                                    spotArr[i] = schedule[i].date;
                                    if (schedule[i].value == 1) {
                                        realDay++;
                                    }
                                    // for (var key in positionJSON) {
                                    //     if (key == schedule[i].sport_guider) {
                                    //         console.log(positionJSON[key]);
                                    //         that.setData({
                                    //             position: positionJSON[key]
                                    //         });
                                    //     }
                                    // }

                                    if (schedule[i].date == that.data.dateString) {
                                        if (schedule[i].value == 0) {
                                            // 判断日期为今日小的日期
                                            let selectTime = new Date(that.data.dateString).getTime();
                                            let todayTime = new Date().getTime();
                                            console.log(selectTime, todayTime);
                                            if (todayTime - selectTime > 24 * 3600000) {
                                                positionStatus = 0;
                                            } else {
                                                positionStatus = 2;
                                            }
                                        } else {
                                            positionStatus = 1;
                                        }
                                        for (var key in positionJSON) {
                                            if (key == schedule[i].sport_guider) {
                                                console.log(positionJSON[key]);
                                                that.setData({
                                                    position: positionJSON[key],
                                                    positionStatus: positionStatus
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (realDay == 0) {
                            percentage = 0
                        } else {
                            percentage = parseInt((realDay / planDay) * 100)
                        }

                        that.setData({
                            userInfoAll: res.data.data,
                            planName: res.data.data.data.user_plan_name,
                            planDay: planDay,
                            realDay: realDay,
                            percentage: percentage,
                            spotArr: spotArr,
                        });

                    }
                }
            })
        }
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