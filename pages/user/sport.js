// pages/user/sport.js
import * as echarts from '../../ec-canvas/echarts';

function setOption1(chart, series_data) {
	let option = {
		color: ['#1473ff'],
		xAxis: {
			type: 'category',
			data: ['腿部', '胸部', '背部', '腹部', '肩部', '臀部', '手臂']
		},
		yAxis: {
			type: 'value'
		},
		series: series_data
	};
	chart.setOption(option);
}

function initChart1(canvas, width, height, dpr, chartData) {
	const chart = echarts.init(canvas, null, {
		width: width,
		height: height,
		devicePixelRatio: dpr // new
	});
	canvas.setChart(chart);
	let option = {
		xAxis: {
			type: 'category',
			data: ['腿部', '胸部', '背部', '腹部', '肩部', '臀部', '手臂']
		},
		yAxis: {
			type: 'value'
		},
		series: chartData
	};
	chart.setOption(option);
	return chart;
}

function setOption2(chart, series_data, max) {
	let option = {
		radar: {
			indicator: [{
					name: '肌肉力量',
					max: max
				},
				{
					name: '平衡协调',
					max: max
				},
				{
					name: '发力控制',
					max: max
				},
				{
					name: '柔韧灵活',
					max: max
				},
				{
					name: '心肺耐力',
					max: max
				}
			]
		},
		series: [{
			name: 'Budget vs spending',
			type: 'radar',
			// symbol: "none", // 去掉图表中各个图区域的边框线拐点
			itemStyle: {
				normal: {
					color: "rgba(0,0,0,0)",
					lineStyle: {
						color: "#1473ff" // 图表中各个图区域的边框线颜色
					},
					areaStyle: {
						type: 'default',
						color: "#b3d6fe"
					}
				}
			},
			data: series_data
		}]
	};

	chart.setOption(option);
}

function initChart2(canvas, width, height, dpr, chartData) {
	const chart = echarts.init(canvas, null, {
		width: width,
		height: height,
		devicePixelRatio: dpr // new
	});
	canvas.setChart(chart);
	let option = {
		radar: {
			indicator: [{
					name: '肌肉力量',
					max: 10
				},
				{
					name: '平衡协调',
					max: 10
				},
				{
					name: '发力控制',
					max: 10
				},
				{
					name: '柔韧灵活',
					max: 10
				},
				{
					name: '心肺耐力',
					max: 10
				}
			]
		},
		series: [{
			name: 'Budget vs spending',
			type: 'radar',
			symbol: "none", // 去掉图表中各个图区域的边框线拐点
			itemStyle: {
				normal: {
					lineStyle: {
						color: "white" // 图表中各个图区域的边框线颜色
					},
					areaStyle: {
						type: 'default'
					}
				}
			},
			data: chartData
		}]
	};

	chart.setOption(option);
	return chart;
}

const app = getApp();

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		ec1: {
			lazyLoad: true
		},
		ec2: {
			lazyLoad: true
		},
		chartData1: null,
		chartData2: null,

		obj: null,
		bodyData: null,

		bgColor: ''
	},
	// 请求用户数据
	requestUserData: function () {
		let that = this;
		let userId = that.data.obj.userId;
		if (userId) {
			wx.request({
				url: that.data.obj.svrUrl + 'get-user-all?user_id=' + userId+'&time='+new Date(),
				success: function (res) {
					console.log("url:" + that.data.obj.svrUrl + 'get-user-all?user_id=' + userId+'?time='+new Date());
					console.log("res:" + res.data);
					if (res.data.code == "200") {
						that.setData({
							userInfoAll: res.data.data,
						});

					}
				}
			})
		}
	},

	// 显示用户数据
	showUserData: function () {
		let userAll = this.data.obj.userAll;
		console.log(userAll);
		//上次更新的日期
		let date = new Date(userAll.data.gmt_update)
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var dates = date.getDate();

		// 图表1数据
		var msArr = new Array();
		if (userAll.data.structure == "") {
			msArr = [0, 0, 0, 0, 0, 0, 0]
		} else {
			let ms = JSON.parse(userAll.data.structure);
			msArr[0] = ms.leg;
			msArr[1] = ms.chest;
			msArr[2] = ms.back;
			msArr[3] = ms.abdominal;
			msArr[4] = ms.shoulder;
			msArr[5] = ms.hip;
			msArr[6] = ms.forearm;
		}
		let chartData1 = [{
			data: msArr,
			type: 'bar'
		}]
		let ec1Component = this.selectComponent('#mychart-dom-bar');
		ec1Component.init((canvas, width, height, dpr) => {
			const chart = echarts.init(canvas, null, {
				width: width,
				height: height,
				devicePixelRatio: dpr // new
			});
			setOption1(chart, chartData1);
			return chart;
		});

		// 图表2数据
		var fiArr = new Array();
		var fiMax = 0;
		if (userAll.data.fitness_index == "") {
			fiArr = [0, 0, 0, 0, 0]
		} else {
			let fi = JSON.parse(userAll.data.fitness_index);
			fiArr[0] = fi.power;
			fiArr[1] = fi.balance;
			fiArr[2] = fi.control;
			fiArr[3] = fi.flexibility;
			fiArr[4] = fi.endurance;

			// 判断最大值
			for(var i=0; i<fiArr.length; i++){
				if(fiArr[i] > fiMax){
					fiMax = fiArr[i]
				}
			}
		}

		let chartData2 = [{
			value: fiArr,
			//这里的配置显示数值
			label: {
				normal: {
					show: true,
					formatter: function (params) {
						return params.value;
					}
				}
			},
			itemStyle: {
				normal: {
					areaStyle: {
						type: 'default',
						opacity: 1, // 图表中各个图区域的透明度
						color: "#b3d6fe" // 图表中各个图区域的颜色
					}
				}
			},
			name: "123"
		}]

		let ec2Component = this.selectComponent('#mychart-dom-graph');
		ec2Component.init((canvas, width, height, dpr) => {
			const chart = echarts.init(canvas, null, {
				width: width,
				height: height,
				devicePixelRatio: dpr // new
			});
			setOption2(chart, chartData2,fiMax);
			return chart;
		});

		// 身体数据
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
			sportValue: userAll.data.sport_power,
			updateDate: year + "/" + month + "/" + dates,
			bodyData: bodyData,
		});

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		//直接获取到app.globalData的数据
		if (app.globalData.netName == "evinf") {
			this.setData({
				obj: app.globalData.ev,
			});
		} else {
			this.setData({
				obj: app.globalData.sg,
			});
		}

		console.log(app.globalData)
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
	toBodyTap(e) {
		wx.navigateTo({
			url: '/pages/user/body'
		})
	}
})