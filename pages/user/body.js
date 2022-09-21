// pages/user/body.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        obj: "",
        bodyData: null,
        bgColor:'',
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
        // this.requestUserData();
        this.showUserData();
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
    
    // 请求用户数据
	requestUserData: function () {
		let that = this;
		let userId = that.data.obj.userId;
		if (userId) {
			wx.request({
				url: that.data.obj.svrUrl + 'get-user-all?user_id=' + userId,
				success: function (res) {
					console.log(res.data)
					if (res.data.code == "200") {
                        let userAll = res.data.data;

                        let bodyData = [{
                            "name": "BMI",
                            "image": "/images/user/ico_body_01.png",
                            "value": userAll.data.bmi,
                            "unit": "",
                            "range_a": 18.5,
                            "range_b": 24,
                            "desc": "BMI（身体质量指数）=体重（公斤）除以身高（米）的平方，是国际上常用的衡量人体胖瘦程度以及是否健康的标准。"
                        }, {
                            "image": "/images/user/ico_body_02.png",
                            "name": "脂肪率",
                            "value": userAll.data.fat,
                            "unit": "",
                            "range_a": 15,
                            "range_b": 36,
                            "desc": "脂肪是由大量脂肪细胞聚集而成的一种结缔组织，具有促进脂溶性维生素吸收、保护内脏器官、调节体温、供给人体热量等作用。脂肪率反映身体总体的肥胖程度，是评价肥胖的客观标准。脂肪率过低或过高，都会影响健康。"
                        }, {
                            "image": "/images/user/ico_body_03.png",
                            "name": "基础代谢量",
                            "value": userAll.data.bmr,
                            "unit": "",
                            "range_a": 1100,
                            "range_b": 1800,
                            "desc": "基础代谢率是指人体在清醒而且安静状态下，不受肌肉活动、环境温度、食物及精神紧张等影响时的能量代谢量。在一定范围，基础代谢量越高代表生命活动越活跃，通常男性高于女性、青年人高于老人。"
                        }, {
                            "image": "/images/user/ico_body_04.png",
                            "name": "身体年龄",
                            "value": -1,
                            "unit": "",
                            "range_a": 0,
                            "range_b": 0,
                            "desc": "身体年龄是根据脂肪、骨骼肌等指标综合评价身体总体健康水平在人群中的位置：身体年龄越接近青年则表征健康状况越好。"
                        }, {
                            "image": "/images/user/ico_body_05.png",
                            "name": "水分率",
                            "value": userAll.data.water,
                            "unit": "%",
                            "range_a": 48,
                            "range_b": 57,
                            "desc": "水分率指人体成分中水分占体重的百分比。体水分尤为输送营养成分、回收体内废物、保持体温等重要功能。"
                        }, {
                            "image": "/images/user/ico_body_06.png",
                            "name": "肌肉率",
                            "value": userAll.data.muscle, // parseInt((userAll.data.muscle/userAll.data.weight)*100),
                            "unit": "%",
                            "range_a": 30,
                            "range_b": 55,
                            "desc": "身体年龄是根据脂肪、骨骼肌等指标综合评价身体总体健康水平在人群中的位置；身体年龄越接近青年则表征健康状况越好。"
                        }, {
                            "image": "/images/user/ico_body_07.png",
                            "name": "骨骼量",
                            "value": userAll.data.bone,
                            "unit": "Kg",
                            "range_a": 1.7,
                            "range_b": 3.1,
                            "desc": "骨量是指是单位体积内，骨矿物质（钙、磷等）和骨基质（骨胶原、蛋白质、无机盐等）含量。日常监测骨量的变化可以在一定程度上反映骨密度的变化。"
                        }, {
                            "image": "/images/user/ico_body_08.png",
                            "name": "脂肪等级",
                            "value": userAll.data.vfi,
                            "unit": "",
                            "range_a": 10,
                            "range_b": 20,
                            "desc": "身体年龄是根据脂肪、骨骼肌等指标综合评价身体总体健康水平在人群中的位置；身体年龄越接近青年则表征健康状况越好。"
                        }, {
                            "image": "/images/user/ico_body_09.png",
                            "name": "蛋白质率",
                            "value": userAll.data.protein,
                            "unit": "",
                            "range_a": 16,
                            "range_b": 20,
                            "desc": "人体含蛋白质的质量。蛋白质是组成人体一切细胞、组织的重要成分。机体所有重要的组成部分都需要有蛋白质的参与蛋白质是生命活动的主要承担者。"
                        }, {
                            "image": "/images/user/ico_body_10.png",
                            "name": "细胞外水份率",
                            "value": userAll.data.ewf,
                            "unit": "",
                            "range_a": 15,
                            "range_b": 21,
                            "desc": "人体含蛋白质的质量。蛋白质是组成人体一切细胞、组织的重要成分。机体所有重要的组成部分都需要有蛋白质的参与，蛋白质是生命活动的主要承担者。"
                        }]

						that.setData({
                            bodyData: bodyData
						});

					}
				}
			})
		}
    },
    // 显示用户数据
    showUserData: function() {
        let userAll = this.data.obj.userAll;
        
        let bodyData = [{
            "name": "BMI",
            "image": "/images/user/ico_body_01.png",
            "value": userAll.data.bmi,
            "unit": "",
            "range_a": 18.5,
            "range_b": 24,
            "desc": "BMI（身体质量指数）=体重（公斤）除以身高（米）的平方，是国际上常用的衡量人体胖瘦程度以及是否健康的标准。"
        }, {
            "image": "/images/user/ico_body_02.png",
            "name": "脂肪率",
            "value": userAll.data.fat,
            "unit": "",
            "range_a": 15,
            "range_b": 36,
            "desc": "脂肪是由大量脂肪细胞聚集而成的一种结缔组织，具有促进脂溶性维生素吸收、保护内脏器官、调节体温、供给人体热量等作用。脂肪率反映身体总体的肥胖程度，是评价肥胖的客观标准。脂肪率过低或过高，都会影响健康。"
        }, {
            "image": "/images/user/ico_body_03.png",
            "name": "基础代谢量",
            "value": userAll.data.bmr,
            "unit": "",
            "range_a": 1100,
            "range_b": 1800,
            "desc": "基础代谢率是指人体在清醒而且安静状态下，不受肌肉活动、环境温度、食物及精神紧张等影响时的能量代谢量。在一定范围，基础代谢量越高代表生命活动越活跃，通常男性高于女性、青年人高于老人。"
        }, {
            "image": "/images/user/ico_body_04.png",
            "name": "身体年龄",
            "value": -1,
            "unit": "",
            "range_a": 0,
            "range_b": 0,
            "desc": "身体年龄是根据脂肪、骨骼肌等指标综合评价身体总体健康水平在人群中的位置：身体年龄越接近青年则表征健康状况越好。"
        }, {
            "image": "/images/user/ico_body_05.png",
            "name": "水分率",
            "value": userAll.data.water,
            "unit": "%",
            "range_a": 48,
            "range_b": 57,
            "desc": "水分率指人体成分中水分占体重的百分比。体水分尤为输送营养成分、回收体内废物、保持体温等重要功能。"
        }, {
            "image": "/images/user/ico_body_06.png",
            "name": "肌肉率",
            "value": userAll.data.muscle, // parseInt((userAll.data.muscle/userAll.data.weight)*100),
            "unit": "%",
            "range_a": 30,
            "range_b": 55,
            "desc": "身体年龄是根据脂肪、骨骼肌等指标综合评价身体总体健康水平在人群中的位置；身体年龄越接近青年则表征健康状况越好。"
        }, {
            "image": "/images/user/ico_body_07.png",
            "name": "骨骼量",
            "value": userAll.data.bone,
            "unit": "Kg",
            "range_a": 1.7,
            "range_b": 3.1,
            "desc": "骨量是指是单位体积内，骨矿物质（钙、磷等）和骨基质（骨胶原、蛋白质、无机盐等）含量。日常监测骨量的变化可以在一定程度上反映骨密度的变化。"
        }, {
            "image": "/images/user/ico_body_08.png",
            "name": "脂肪等级",
            "value": userAll.data.vfi,
            "unit": "",
            "range_a": 10,
            "range_b": 20,
            "desc": "身体年龄是根据脂肪、骨骼肌等指标综合评价身体总体健康水平在人群中的位置；身体年龄越接近青年则表征健康状况越好。"
        }, {
            "image": "/images/user/ico_body_09.png",
            "name": "蛋白质率",
            "value": userAll.data.protein,
            "unit": "",
            "range_a": 16,
            "range_b": 20,
            "desc": "人体含蛋白质的质量。蛋白质是组成人体一切细胞、组织的重要成分。机体所有重要的组成部分都需要有蛋白质的参与蛋白质是生命活动的主要承担者。"
        }, {
            "image": "/images/user/ico_body_10.png",
            "name": "细胞外水份率",
            "value": userAll.data.ewf,
            "unit": "",
            "range_a": 15,
            "range_b": 21,
            "desc": "人体含蛋白质的质量。蛋白质是组成人体一切细胞、组织的重要成分。机体所有重要的组成部分都需要有蛋白质的参与，蛋白质是生命活动的主要承担者。"
        }]

        this.setData({
            bodyData: bodyData
        });
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