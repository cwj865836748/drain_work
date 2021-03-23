// pages/inspectionProcess/inspectionProcess.js
import {
  patrol
} from '../../request/api.js'
import {
  getPointsCenter,
  getMyLocation,
  formatTime
} from '../../utils/util.js'
import {
  scanCode
} from '../../utils/wx.js'
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: null,
    timeData: {},
    isPhoneX: false,
    confirmShow: false,
    wayOne: null,
    latitude: null,
    longitude: null,
    markers: [],
    polyline: [{
      points: [],
      color: '#008ffe', //绘制区域
      width: 4
    }],
    adminPhone: '',
    isDoCode: true,
    doCodeOKorNo: true,
    nodeObj:null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInit(options)
  },
  //0是开始任务 1是获取任务
  getInit(options) {
    const url = !parseInt(options.task)? patrol.startPatrol({
      wayId: options.wayId
    }):patrol.getPatrol({
      wayId: options.wayId
    })
    Promise.all([
      url,
      patrol.belongAdminPhone()
    ]).then(res => {
      if(res[0].code==500){
        wx.reLaunch({
          url: '/pages/index/index',
        })
        return
      }
      const wayOne = res[0].data
      this.setData({
        wayOne,
        adminPhone: res[1].data,
        isPhoneX: App.globalData.navBar.model.search('iPhone X') != -1,
        time:wayOne.countdown*1000
      })
      this.getMapSetting()
      this.getIsDoCode()
    })
  },
  getMapSetting() {
    const markers = this.data.wayOne.way.nodeList.map((item,index) => {
      let iconPath = ""
      if(index==0){
        iconPath=item.nodeTime?"/image/green@2x.png":"/image/green_un@2x.png"
      }else if(index==this.data.wayOne.way.nodeList.length-1){
        iconPath=item.nodeTime?"/image/red@2x.png":"/image/red_un@2x.png"
      }else {
        iconPath=item.nodeTime?"/image/addr@2x-3.png":"/image/addr@2x-2.png"
      }
      return {
        ...item,
        iconPath,
        width: "51",
        height: "52",
        anchor:{x: .55, y: .6}
      }
    })
    const {
      latitude,
      longitude
    } = getPointsCenter(this.data.wayOne.way.nodeList)
    this.setData({
      latitude,
      longitude,
      markers,
      [`polyline[0].points`]: this.data.wayOne.way.nodeList
    })
  },
  onChange(e) {
    this.setData({
      timeData: e.detail,
    });
  },
  finished(){
      this.setData({
        [`wayOne.beTimeout`]:true
      })
  },
  toPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.adminPhone,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  //判断是否要打卡
  getIsDoCode() {
    let isDoCode = false
    this.data.wayOne.way.nodeList.forEach(item => {
      if (!item.nodeTime) {
        isDoCode = true
      }
    }) 
    !isDoCode && this.setData({
      isDoCode
    })
  },
  doNode() {
    let secretNodeId;
    let nodeTime = formatTime(new Date())
    scanCode().then(res => {
      secretNodeId = res.result
      return getMyLocation()
    }).then(local => {
      const data = {
        nodeTime,
        secretNodeId,
        patrolId: this.data.wayOne.patrol.id,
        locateAddress: local.result.address,
        longitude: local.result.location.lng,
        latitude: local.result.location.lat
      }
      return patrol.doNode(data)
    }).then(node => {
       if(node.code==200){
         const index = this.data.wayOne.way.nodeList.findIndex(item=>item.id == node.data.nodeId)
         nodeTime = nodeTime.split(' ')[1]
         this.setData({
          nodeObj:{...node.data,nodeTime},
          doCodeOKorNo:true,
          confirmShow:true,
          [`wayOne.way.nodeList[${index}].nodeTime`]:nodeTime,
          [`markers[${index}].iconPath`]:index==0?"/image/green@2x.png":(index== this.data.wayOne.way.nodeList.length-1?"/image/red@2x.png":"/image/addr@2x-3.png")
         })
         this.getIsDoCode()
       }else if(node.code==11003){
         this.setData({
          doCodeOKorNo:false,
          confirmShow:true
         })
       }else if(node.code==11004){
         wx.reLaunch({
           url: '/pages/index/index',
         })
       }
    })
  },
  conFirmOk(){
    this.setData({
      confirmShow:false
     })
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

  }
})