// pages/caseDetail/caseDetail.js
import {
  report
} from '../../request/api.js'
import {
  openLocation,previewImage
} from '../../utils/wx.js'
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backgroundColor: "#FFF",
    isPhoneX: false,
    caseDetail: null,
    evaluationShow: false,
    evaluationQuery: {
      id: '',
      beSatisfied: '1'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ['evaluationQuery.id']: options.id
    })
    this.getInit()
  },
  getInit() { 
    report.reportCase({
      id:this.data.evaluationQuery.id
    }).then(res => {
      this.setData({
        caseDetail: res.data,
        isPhoneX: App.globalData.navBar.model.search('iPhone X') != -1,
      })
    })
  },
  toEvaluation(e) {
    const {
      comment
    } = e.currentTarget.dataset
    comment && report.comment(this.data.evaluationQuery).then(res=>{
      this.getInit()
      App.globalData.onRefresh=true
    })
    this.setData({
      evaluationShow: !this.data.evaluationShow
    })
  },
  toSelcet(e) {
    const {
      select
    } = e.currentTarget.dataset
    this.setData({
      ['evaluationQuery.beSatisfied']: select
    })
  },
  openLocation(){
    const {longitude,latitude,locateAddress:address,streetName:name} =this.data.caseDetail
    openLocation({
      longitude,latitude,address,name
    })
  },
  previewImg(e) {
    const {
      current,index
    } = e.currentTarget.dataset
    previewImage({
      current,
      urls: !index?this.data.caseDetail.questionImageArray:this.data.caseDetail.handleImageArray
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
     this.getInit()
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