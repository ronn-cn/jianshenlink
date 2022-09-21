// pages/login/profile.js

const app = getApp();

const date = new Date();
const years = [];
const months = [];
const days = [];

for (let i = 1920; i <= date.getFullYear(); i++) {
	years.push(i);
}

for (let i = 1; i <= 12; i++) {
	months.push(i);
}

for (let i = 1; i <= 31; i++) {
	days.push(i);
}

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		bgColor: '',
		first: true,
		years,
		year: date.getFullYear(),
		months,
		month: 2,
		days,
		day: 2,
		value: [9999, 1, 1],
		sex: -1,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let first = true;
		if (options.first == "0") {
			first = false;
		}
		let date = new Date();
		if (options.birthday) {
			date = new Date(options.birthday);
		}
		this.setData({
			year: date.getFullYear(),
			month: date.getMonth() + 1,
			day: date.getDate(),
			sex: parseInt(options.sex),
			first: first,
			value: [date.getFullYear() - 1920, date.getMonth(), date.getDate() - 1]
		});
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
	bindChange(e) {
		function isLoopYear(theYear) {
			return (new Date(theYear, 1, 29).getDate() == 29);
		}
		const val = e.detail.value
		let selectDate = this.data.years[val[0]] + '-' + this.data.months[val[1]] + '-' + this.data.days[val[2]];
		console.log(selectDate);
		let todayTime = date.getTime();
		let selectTime = new Date(selectDate).getTime();
		if (selectTime > todayTime) {
			this.setData({
				year: date.getFullYear(),
				month: date.getMonth() + 1,
				day: date.getDate(),

				value: [date.getFullYear() - 1920, date.getMonth(), date.getDate() - 1]
			});
			console.log("rrrr: 2021-12-17", this.data);
		}


		this.setData({
			year: this.data.years[val[0]],
			month: this.data.months[val[1]],
			day: this.data.days[val[2]],

			// value: [this.data.years[val[0]] - 1920, this.data.months[val[1]] - 1, this.data.days[val[2]] - 1]
		});

		switch (this.data.months[val[1]]) {
			case 2:
				if (isLoopYear(this.data.years[val[0]])) {
					// 判断是闰年
					if (this.data.days[val[2]] > 29) {
						this.setData({
							day: 29,
							value: [this.data.years[val[0]] - 1920, this.data.months[val[1]] - 1, 28]
						});
					}
				} else {
					if (this.data.days[val[2]] > 28) {
						this.setData({
							day: 28,
							value: [this.data.years[val[0]] - 1920, this.data.months[val[1]] - 1, 27]
						});
					}
				}
				break;
			case 4:
			case 6:
			case 9:
			case 11:
				if (this.data.days[val[2]] > 30) {
					this.setData({
						day: 30,
						value: [this.data.years[val[0]] - 1920, this.data.months[val[1]] - 1, 29]
					});
				}
				break;
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
	},
	// 性别选择
	bindSexSelect: function (e) {
		console.log(e);
		let query = e.currentTarget.dataset['index'];
		console.log(parseInt(query))
		this.setData({
			sex: parseInt(query)
		})
	},
	// 提交信息
	submitTap: function () {
		// console.log(this.data.year + "-" + this.data.month + "-" + this.data.day);
		let m = this.data.month < 10 ? '0' + this.data.month : this.data.month;
		let d = this.data.day < 10 ? '0' + this.data.day : this.data.day;
		console.log(this.data.year + "-" + m + "-" + d);

		let userId = "";
		let serverUrl = ""
		if (app.globalData.netName == "evinf") {
			userId = app.globalData.ev.userId;
			serverUrl = app.globalData.ev.svrUrl;
		} else {
			userId = app.globalData.sg.userId;
			serverUrl = app.globalData.sg.svrUrl;
		}

		let s = 0;
		if (this.data.sex == 0) {
			s = 2;
		} else if (this.data.sex == 1) {
			s = 1;
		} else {
			s = 0;
		}

		console.log({
			user_id: userId,
			sex: s,
			birthday: this.data.year + "-" + m + "-" + d
		});
		// 提交信息
		wx.request({
			url: serverUrl + 'update-sex-birthday',
			method: 'POST',
			data: {
				user_id: userId,
				sex: s,
				birthday: this.data.year + "-" + m + "-" + d
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: resSexBirthday => {
				console.log(resSexBirthday.data)
				if (resSexBirthday.data.code == "200") {
					// 刷新主页数据
					var pages = getCurrentPages();
					var beforePage = pages[pages.length - 2];
					// 返回上一页
					wx.navigateBack({
						delta: 1,
						success: function(){
							beforePage.RefreshUserData();
						}
					});


					// wx.redirectTo({
					// 	url: '/pages/index/index'
					// });

					// let userAll = resUserAll.data.data;
					// app.setUserAll(userAll);
					// if (userAll.user.birthday == "") {
					// 	// 跳转到设置性别出生日期页面
					// 	wx.navigateTo({
					// 		url: '/pages/login/profile?sex='+userAll.user.sex
					// 	});
					// } else {
					// 	wx.navigateTo({
					// 		url: '/pages/index/index'
					// 	});
					// }
				}
			}
		})
	}
})