// pages/merchantListForm/merchantListForm.js
import {
  merchant
} from '../../request/api.js'
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPhoneX:false,
    merchantUpdateList: [],
    query: {
      houseNo: '',
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
    this.setData({
      isPhoneX:App.globalData.navBar.model.search('iPhone X') != -1,
      [`query.houseNo`]:options.houseNo
    })
  },
  getInit(){
    const {
      query,
      listQueryIndex
    } = this.data
    merchant.historyList(query).then(res => {
      this.setData({
        [`merchantUpdateList[${listQueryIndex}]`]: res.data.list,
        totalPage: res.data.totalPage
      })
      !this.data.merchantUpdateList[0].length && this.setData({
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
    this.setData({
      'query.page':1,
      listQueryIndex:0,
      merchantUpdateList:[],
      noData: false
    })
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
    if (this.data.query.page == this.data.totalPage) {
      return
    }
    this.data.query.page++
    this.data.listQueryIndex++
    this.getInit()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})