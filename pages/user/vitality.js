// pages/user/vitality.js
const app = getApp();


function addZero(v, size) {
    for (var i = 0, len = size - (v + "").length; i < len; i++) {
        v = "0" + v;
    };
    return v + "";
}

function formatDate(date, formatStr) {
    var arrWeek = ['日', '一', '二', '三', '四', '五', '六'],
        str = formatStr.replace(/yyyy|YYYY/, date.getFullYear()).replace(/yy|YY/, addZero(date.getFullYear() % 100, 2)).replace(/mm|MM/, addZero(date.getMonth() + 1, 2)).replace(/m|M/g, date.getMonth() + 1).replace(/dd|DD/, addZero(date.getDate(), 2)).replace(/d|D/g, date.getDate()).replace(/hh|HH/, addZero(date.getHours(), 2)).replace(/h|H/g, date.getHours()).replace(/ii|II/, addZero(date.getMinutes(), 2)).replace(/i|I/g, date.getMinutes()).replace(/ss|SS/, addZero(date.getSeconds(), 2)).replace(/s|S/g, date.getSeconds()).replace(/w/g, date.getDay()).replace(/W/g, arrWeek[date.getDay()]);
    return str;
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        obj: null,
        TabCur: 0,
        userInfoAll: null,
        vitalityValue: 0,
        sportDuration: 0,
        sportConsumption: 0,
        sportDays: 0,
        sportCount: 0,
        sportRecord: null,
        recordList: [],
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
    tabSelect: function (e) {
        this.setData({
            TabCur: e.currentTarget.dataset.id,
        })
    },

    requestUserData: function () {
        let that = this;
        let userId = that.data.obj.userId;
        if (userId) {
            wx.request({
                url: that.data.obj.svrUrl + 'get-user-all?user_id=' + userId,
                success: function (res) {
                    console.log(res.data)
                    if (res.data.code == "200") {

                        // 时长（单位秒）需转化为分钟
                        let sec = res.data.data.total.sport_timespan
                        let minute = Math.ceil(res.data.data.total.sport_timespan / 60)

                        that.setData({
                            userInfoAll: res.data.data,
                            vitalityValue: res.data.data.data.life_power,
                            sportDuration: minute,
                            sportConsumption: res.data.data.total.sport_calorie,
                            sportDays: res.data.data.total.sport_day,
                            sportCount: res.data.data.total.sport_count,
                        });

                    }
                }
            })

            wx.request({
                url: that.data.obj.svrUrl + '/get-lesson-log',
                method: "POST",
                data: {
                    "user_id": userId
                },
                success: function (res) {
                    console.log(res.data);
                    let recordList = [];
                    if (res.data.code == "200") {
                        let arr = res.data.data.sport_records.reverse();
                        let i = 0;
                        for (const key in arr) {
                            if (i >= 10) {
                                break;
                            }
                            let record = arr[key];
                            let unix_time = 0;
                            // 判断时间戳的长度
                            if (record.sport_start_time.toString().length > 10) {
                                unix_time = record.sport_start_time
                            } else {
                                unix_time = record.sport_start_time * 1000
                            }
                            let date = formatDate(new Date(unix_time), "YYYY年MM月DD日 HH:ii");
                            // date.setTime(record.sport_time);
                            let m = parseInt(record.sport_duration / 60);
                            let s = parseInt(record.sport_duration % 60);
                            let item = {
                                title: record.lesson_name,
                                date: date,
                                duration: addZero(m, 2) + "′" + addZero(s, 2) + "″",
                            }
                            recordList.push(item);
                            i++;
                        }
                    }
                    that.setData({
                        recordList: recordList
                    });
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