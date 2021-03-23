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
    }
  }
})