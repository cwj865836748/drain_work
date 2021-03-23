// pages/merchantList/merchantList.js
import {
  merchant
} from '../../request/api.js'
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    merchantList: [],
    query: {
      content: '',
      page: 1,
      pageSize: 10
    },
    listQueryIndex: 0,
    totalPage: 0,
    noData: false,
    triggered: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getList()
  },
  getInit() {
    const {
      query,
      listQueryIndex
    } = this.data
    merchant.merchantList(query).then(res => {
      this.setData({
        [`merchantList[${listQueryIndex}]`]: res.data.list,
        totalPage: res.data.totalPage
      }) 
      !this.data.merchantList[0].length && this.setData({
        noData: true
      })
    })
  },
  searchTap(e) {
    if (e.type == 'change') {
      this.data.query.content = e.detail
    }
    if (e.type == 'search') {
      this.getList()
    }
    if (e.type == 'clear') {
      this.data.query.content = ''
      this.getList()
    }

  },
  getList() {
    this.setData({
      'query.page': 1,
      listQueryIndex: 0,
      merchantList: [],
      noData: false
    })
    this.getInit()
  },
  onPulling(e) {
    setTimeout(() => {
      this.setData({
        triggered: true,
      })
    }, 1000)

  },
  onRefresh(e) {
    if (this._freshing) return
    this._freshing = true
    setTimeout(() => {
      this.setData({
        triggered: false,
      })
      this.getList()
      this._freshing = false
    }, 3000)
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
    if (App.globalData.onRefresh) {
      this.getList()
      App.globalData.onRefresh = false
    }
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
      this.getTabBar().getAuth()
    }
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