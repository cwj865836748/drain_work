// pages/inspectionRoute/inspectionRoute.js
import {
  patrol
} from '../../request/api.js'
import {
  getPointsCenter
} from '../../utils/util.js'
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backgroundColor: "#FFF",
    isPhoneX: false,
    wayList: [],
    wayShow: false,
    wayOne: null,
    latitude: null,
    longitude: null,
    markers: [],
    polyline: [{
      points: [],
      color: '#008ffe', //绘制区域
      width: 4
    }],
    mapSetting:{
      showLocation: true,
      enablePoi:true,
      enableBuilding:true
    },
    conFirmShow:false,
    isInspection:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInit()
  },
  getInit() {
    patrol.selectWay().then(res => {
      this.setData({
        wayList: res.data,
        wayOne: res.data[0],
        isPhoneX: App.globalData.navBar.model.search('iPhone X') != -1
      })
      if(!res.data.length){
        return
      }
      this.getMapSetting(res.data[0])
      this.getInspection(res.data[0])
    })
  },
  showSelect() {
    this.setData({
      wayShow: !this.data.wayShow
    })
  },
  toSelect(e) {
    const {
      way
    } = e.currentTarget.dataset
    if (way.wayTitle == this.data.wayOne.wayTitle) {
      return
    }
    this.setData({
      wayOne: way
    })
    this.getMapSetting(way)
    this.getInspection(way)
    this.showSelect()
  },
  getMapSetting(way) {
    const markers = way.nodeList.map((item,index) => {
      return {
        ...item,
        iconPath: index==0?"/image/green_un@2x.png":(index==way.nodeList.length-1?"/image/red_un@2x.png":"/image/addr@2x-2.png"),
        width: "51",
        height: "52",
        anchor:{x: .55, y: .6}
      }
    })
    const {
      latitude,
      longitude
    } = getPointsCenter(way.nodeList)
    this.setData({
      latitude,
      longitude,
      markers,
      [`polyline[0].points`]: way.nodeList
    })
  },
  getInspection(wayOne){
    let startTime = wayOne.startTime?`${new Date().getFullYear()}/${new Date().getMonth()+1}/${new Date().getDate()} ${wayOne.startTime.split(' ')[1]}`
    :''
    const isInspection = (startTime&&new Date(startTime).getTime()<=new Date().getTime())||!startTime?true:false
    this.setData({
      isInspection
    })
  },
  toInspection(e){
    if(!this.data.isInspection||!this.data.wayList.length){
      return
    }
    const {show:conFirmShow} = e.currentTarget.dataset
     this.setData({
      conFirmShow
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