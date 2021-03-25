// index.js
const App = getApp()
import {
  common,
  patrol
} from '../../request/api'
import {
  login
} from '../../utils/wx.js'
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    headColor: "transparent",
    titleColor: "#fff",
    phoneAuthShow: false,
    wxCode: '',
    xZhou: 0,
    hotLine: '', //热线电话
    user: {
      identity: 0 //判断是否市民0 工作巡检人员1 领导2 工作人员3 巡检人员4 管长5
    }, //用户信息
    homeQuantity: [{
        logo: "/image/home_icon5@2x.png",
        title: '已报案数量',
        num: '0',
        id: 'totalReportCase',
        index: '',
        include:[0,1,2,3,5]
      },
      {
        logo: "/image/home_icon2@2x.png",
        title: '待处理数量',
        num: '0',
        id: 'waitHandle',
        index: '0',
        include:[0,1,2,3,5]
      },
      {
        logo: "/image/home_icon3@2x.png",
        title: '待评价数量',
        num: '0',
        id: 'waitComment',
        index: '1',
        include:[0,1,2,3,5]
      },
      {
        logo: "/image/home_icon1@2x.png",
        title: '已评价数量',
        num: '0',
        id: 'alreadyComment',
        index: '2',
        include:[0,1,2,3,5]
      },
      {
        logo: "/image/home_icon4@2x.png",
        title: '已巡查数量',
        num: '0',
        id: 'alreadyPatrol',
        index: '3',
        include:[1,2,4,5]
      }
    ]
  },
  onLoad() {
    this.getInit()
  },
  getInit() {
    common.hotLine().then(res => {
      const {
        windowWidth: modelWidth,
        windowHeight,
        model
      } = App.globalData.navBar
      this.setData({
        modelWidth,
        modelHeight: model.search('iPhone X') != -1 ? windowHeight - 84 : windowHeight - 50, //底部导航栏50px。
        xZhou: modelWidth - 60,
        yZhou: windowHeight - 400,
        hotLine: res.data
      })
    })
  },
  //微信一键登录
  bindGetUserInfo(e) {
    const {
      errMsg,
      encryptedData,
      iv
    } = e.detail
    const {
      close
    } = e.currentTarget.dataset
    if (errMsg !== 'getUserInfo:ok' || close) {
      this.getTabBarUtil(true)
      return this.setData({
        phoneAuthShow: false
      })
    }
    wx.showLoading({
      title: "正在获取",
      mask: true
    });

    common.weChatMinLogin({
        code: this.data.wxCode,
        encryptedData,
        iv
      })
      .then(result => {
        wx.hideLoading();
        wx.setStorageSync('token', result.data.token)
        wx.setStorageSync('sessionKey', result.data.sessionKey)
        // wx.setStorageSync('user', result.data.user)
        this.setData({
          // user: result.data.user,
          phoneAuthShow: false,
        })
        this.getUser() 
        !result.data.user.phone && wx.navigateTo({
          url: '/pages/authWx/authWx',
        })
      })
  },
  getUser() {
    Promise.all([
      common.getUserInfo(),
      common.getDisplayData()
    ]).then(res => {
      this.setData({
        user: res[0].data,
        homeQuantity: this.data.homeQuantity.map(item => {
          return {
            ...item,
            num: res[1].data[item.id]
          }
        })
      })
      wx.setStorageSync('user', res[0].data)
      this.getTabBarUtil(true)
    })
  },
  toPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.hotLine,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  goRoute(e) {
    const {
      index
    } = e.currentTarget.dataset
    index != '3' ? wx.reLaunch({
      url: `/pages/caseList/caseList?tabIndex=${index}`
    }) : wx.navigateTo({
      url: '/pages/inspectionList/inspectionList'
    })
  },
  goInspectionProcess() {
    patrol.currentPatrol().then(res => {
      wx.navigateTo({
        url: res.data ? `/pages/inspectionProcess/inspectionProcess?wayId=${res.data.wayId}&task=1` : '/pages/inspectionRoute/inspectionRoute',
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
    wx.getStorageSync('token') ? this.getUser() :
      login().then(res => {
        this.setData({
          wxCode: res.code,
          phoneAuthShow: true
        })
        this.getTabBarUtil(false)
      })  
  },
   getTabBarUtil(status){
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
      this.getTabBar().getTabbarStatus(status)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})