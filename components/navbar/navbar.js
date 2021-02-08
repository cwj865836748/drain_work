// components/navbar/index.js
import {
  navigateBack
} from '../../utils/wx.js'
const App = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    headColor: {
      type: String,
      value: '#fff'
    },
    title: {
      type: String,
      value: '导航条'
    },
    back: {
      type: Boolean,
      value: true
    },
    home: {
      type: Boolean,
      value: false
    },
    titleColor: {
      type: String,
      value: '#333'
    },
    navbarType: {
      type: Number,
      value: 1
    },
    backgroundColor: {
      type: String,
      value: ''
    },
    tabbar: {
      type: Number,
      value: 0
    },
    isTabbar: {
      type: Boolean,
      value: false
    }
  },
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的初始数据
   */
  data: {
    navHeight: null,
    statusBarHeight: null,
    tabbarList: [{
        index: 0,
        name: '首页',
        normal: '/image/home_un@2x.png',
        active: '/image/home@2x.png'
      },
      {
        index: 1,
        name: '案件',
        normal: '/image/case_un@2x.png',
        active: '/image/case@2x.png'
      },
      {
        index: 2,
        name: '商户',
        normal: '/image/merchants_un@2x.png',
        active: '/image/shanghu@2x.png'
      }
    ],
    isPhoneX: false,
    isAuth:false
  },

  attached() {
    const {
      navHeight,
      statusBarHeight,
      model
    } = App.globalData.navBar
    this.setData({
      navHeight,
      statusBarHeight,
      isPhoneX: model.search('iPhone X') != -1
    })
    this.getAuth()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goBack() {
      navigateBack(1)
    },
    goHome() {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    },
    tabbarChange(e) {
      let url;
      switch (e.detail) {
        case 0:
          url = "/pages/index/index"
          break;
        case 1:
          url = "/pages/caseList/caseList"
          break;
        case 2:
          url = "/pages/merchantList/merchantList"
          break;
      }
      wx.reLaunch({
        url,
      })
    },
    getAuth(){
      this.setData({
        isAuth:wx.getStorageSync('user')&&wx.getStorageSync('user').identity
      })
    }
  }
})