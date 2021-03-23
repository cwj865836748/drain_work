// pages/inspectionDetail/inspectionDetail.js
import {
  patrol
} from '../../request/api.js'
import {
  getPointsCenter
} from '../../utils/util.js'
import {
  previewImage
} from '../../utils/wx.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backgroundColor:"#fff",
    wayOne:null,
    latitude: null,
    longitude: null,
    markers: [],
    polyline: [{
      points: [],
      color: '#008ffe', //绘制区域
      width: 4
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInit(options.id)
  },
  getInit(id){
    patrol.patrolInfo({id}).then(res=>{
      this.setData({
        wayOne:res.data
      })
      this.getMapSetting(res.data)
    })
  },
  getMapSetting(way) {
    const markers = way.nodeList.map((item,index) => {
      let iconPath = ""
      if(index==0){
        iconPath=item.nodeTime?"/image/green@2x.png":"/image/green_un@2x.png"
      }else if(index==way.nodeList.length-1){
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
    } = getPointsCenter(way.nodeList)
    this.setData({
      latitude,
      longitude,
      markers,
      [`polyline[0].points`]: way.nodeList
    })
  },
  previewImg(e) {
    const {
      current
    } = e.currentTarget.dataset
    previewImage({
      current,
      urls: this.data.wayOne.patrolImageArray
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