// pages/merchantListForm/merchantListForm.js
import {
  patrol,
  report
} from '../../request/api.js'
import {
  isNull
} from '../../utils/util.js'
import {
  chooseImage,
  uploadFile,
  previewImage
} from '../../utils/wx.js'
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPhoneX: false,
    isFrom: 0, //0来自案件详情//1来自打卡
    confirmShow: false,
    query0: {
      id: '',
      handleImage: '',
      handleDescribe: '',
    },
    query1: {
      id: '',
      wayId: '',
      patrolImage: '',
      resultDescribe: ''
    },
    imgCount: 6,
    imgList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isForm: parseInt(options.type),
      isPhoneX: App.globalData.navBar.model.search('iPhone X') != -1
    })
    parseInt(options.type) ? this.setData({
      ['query1.id']: options.id,
      ['query1.wayId']: options.wayId
    }) : this.setData({
      ['query0.id']: options.id
    })
  },
  textareaInput(e) {
    !this.data.isForm ? this.setData({
      [`query0.handleDescribe`]: e.detail.value
    }) : this.setData({
      [`query1.resultDescribe`]: e.detail.value
    })
  },
  uploadImage() {
    const {
      imgCount,
      imgList
    } = this.data
    chooseImage({
      count: imgCount - imgList.length
    }).then(res => {
      let tempFilePaths = res.tempFilePaths
      wx.showLoading({
        title: "上传图片中",
        mask: true
      });
      let ajaxTimes = 0;
      tempFilePaths.forEach(item => {
        ajaxTimes++;
        uploadFile({
          filePath: item,
          url: `${App.globalData.baseUrl}/api/common/uploadFile`,
          name: 'file',
          formData: {
            file: item,
          },
          complete: () => {
            ajaxTimes--;
            if (ajaxTimes === 0) {
              wx.hideLoading();
            }
          }
        }).then(res => {
          this.setData({
            imgList: [res, ...this.data.imgList]
          })
        })
      })
    })
  },
  delImage(e) {
    const {
      index
    } = e.currentTarget.dataset
    this.data.imgList.splice(index, 1)
    this.setData({
      imgList: this.data.imgList
    })
  },
  previewImg(e) {
    const {
      current
    } = e.target.dataset
    previewImage({
      current,
      urls: this.data.imgList
    })
  },
  submitForm() {
    if (this.data.isForm) {
      let {
        resultDescribe
      } = this.data.query1
      this.data.query1.patrolImage = this.data.imgList.join(',')
      isNull({
          content: resultDescribe.length >= 1,
          title: "维护过程描述",
          prompt: '不少于1个字'
        }) &&
        patrol.handleResult(this.data.query1).then(res => {
          this.setData({
            confirmShow: true
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/index/index',
            })
          }, 2000)
        })
    } else {
      let {
        handleDescribe
      } = this.data.query0
      this.data.query0.handleImage = this.data.imgList.join(',')
      isNull({
          content: handleDescribe.length >= 1,
          title: "维护过程描述",
          prompt: '不少于1个字'
        }) &&
        isNull({
          content: this.data.query0.handleImage,
          title: '上传照片'
        }) &&
        report.handleCase(this.data.query0).then(res => {
          this.setData({
            confirmShow: true
          })
          App.globalData.onRefresh = true
          setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            })
          }, 2000)
        })
    }
  },
  comfirmOk() {
    this.setData({
      confirmShow: false
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