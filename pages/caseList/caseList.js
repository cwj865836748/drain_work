// pages/caseList/caseList.js
import {report} from '../../request/api.js'
import {previewImage} from '../../utils/wx.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    caseHead:[{index:'',title:'已报案'},{index:'0',title:'待处理'},{index:'1',title:'待评价'},{index:'2',title:'已评价'}],
    caseList:[],
    query:{
      caseStatus: '',
      page: 1,
      pageSize: 10
    },
    listQueryIndex: 0,
    totalPage: 0,
    noData: false,
    triggered: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     options.tabIndex&&this.setData({
      'query.caseStatus':options.tabIndex
     })
     this.getInit()
  },
  getInit(){
    const {
      query,
      listQueryIndex
    } = this.data
    report.reportCaseList(query).then(res => {
      this.setData({
        [`caseList[${listQueryIndex}]`]: res.data.list,
        totalPage: res.data.totalPage
      })
      !this.data.caseList[0].length && this.setData({
        noData: true
      })
    })
  },
  tabChange(e){
    const {index}  = e.currentTarget.dataset
    this.setData({
      'query.caseStatus':index,
      'query.page':1,
      listQueryIndex:0,
      caseList:[],
      noData: false
    })
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
  onPulling(e) {
    setTimeout(()=>{
      this.setData({
        triggered: true,
      })
    },500)
 
  },
  onRefresh(e) {
    if (this._freshing) return
    this._freshing = true
    setTimeout(() => {
      this.setData({
        triggered: false,
        'query.page':1,
        listQueryIndex:0,
        caseList:[],
        noData: false
      })
      this.getInit()
      this._freshing = false
    }, 3000)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this._freshing = false
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
     
    })
   
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