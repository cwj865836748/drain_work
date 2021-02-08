// pages/caseList/caseList.js
import {patrol} from '../../request/api.js'
import {previewImage} from '../../utils/wx.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    patrolList:[],
    query:{
      page: 1,
      pageSize: 10
    },
    listQueryIndex: 0,
    totalPage: 0,
    noData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.getInit()
  },
  getInit(){
    const {
      query,
      listQueryIndex
    } = this.data
    patrol.patrolList(query).then(res => {
      this.setData({
        [`patrolList[${listQueryIndex}]`]: res.data.list,
        totalPage: res.data.totalPage
      })
      !this.data.patrolList[0].length && this.setData({
        noData: true
      })
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
    if (this.data.query.page == this.data.totalPage) {
      return
    }
    this.data.query.page++
    this.data.listQueryIndex++
    this.getInit()
  },
  previewImg(e) {
    const {
      current
    } = e.currentTarget.dataset
    previewImage({
      current,
      urls: [current]
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})