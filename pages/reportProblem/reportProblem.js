// pages/merchantListForm/merchantListForm.js
import {
  chooseImage,
  uploadFile,
  previewImage,
  chooseLocation
} from "../../utils/wx.js"
import {
  report
} from '../../request/api.js'
import {
  getMyLocation,
  isNull
} from '../../utils/util.js'
const App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPhoneX: false,
    confirmShow: false,
    businessTypeList: [],
    businessTypeShow: false,
    businessWarn: false,
    streetList: [],
    streetShow: false,
    streetWarn: false,
    waterTypeList: [],
    waterTypeShow: false,
    waterTypeWarn: false,
    query: {
      businessType: '',
      waterType: '',
      streetId: '',
      streetName: '',
      detailAddress: '',
      locateAddress: '',
      longitude: '',
      latitude: '',
      questionImage: '',
      questionDescribe: ''
    },
    imgCount: 6, //可上传照片数量
    imgList: [],
    detailAddressShow:false,
    questionDescribeShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInit()
  },
  getInit() {
    Promise.all([
        report.selectBusinessType(),
        report.selectStreet()
      ])
      .then(res => {
        this.setData({
          businessTypeList: res[0].data,
          streetList: res[1].data,
          'query.businessType':res[0].data[0].typeName,
          isPhoneX: App.globalData.navBar.model.search('iPhone X') != -1
        })
        this.getWaterType(res[0].data[0].id)
      })
  },
  getWaterType(businessTypeId) {
    report.selectWaterType({
      businessTypeId
    }).then(res => {
      this.setData({
        waterTypeList: res.data
      })
    })
  },
  showSelect(e) {
    const {
      key
    } = e.currentTarget.dataset
    this.setData({
      [key]: true
    })
  },
  toSelect(e) {
    const {
      key,
      value,
      configno,
      id
    } = e.currentTarget.dataset
    key == 'streetName' && this.setData({
      [`query.streetId`]: id,
      streetWarn:false
    })
    if (key == 'businessType' && this.data.query.businessType != value) {
      this.setData({
        [`query.waterType`]: '',
        businessWarn:false
      })
      this.getWaterType(configno)
    }
    key == 'waterType' && this.setData({
      waterTypeWarn:false
    })
    this.setData({
      [`query.${key}`]: value,
    })
    this.closeSelect()
  },
  closeSelect() {
    this.setData({
      businessTypeShow: false,
      streetShow: false,
      waterTypeShow: false
    })
  },
  getLocation() {
    chooseLocation().then(res => {
      this.setData({
        [`query.longitude`]: res.longitude,
        [`query.latitude`]: res.latitude,
        [`query.locateAddress`]: res.address
      })
    })
  },
  textareaInput(e) {
    const {
      key
    } = e.currentTarget.dataset
    this.setData({
      [`query.${key}`]: e.detail.value
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
    if(!wx.getStorageSync('user').phone){
      wx.navigateTo({
        url: '/pages/authWx/authWx',
      })
      return
    }
    let {
      businessType,
      waterType,
      streetName,
      detailAddress,
      locateAddress,
      questionImage,
      questionDescribe
    } = this.data.query
    questionImage = this.data.imgList.join(",") 
    !businessType && this.setData({
      businessWarn: true
    })
     !waterType && this.setData({
      waterTypeWarn: true
    }) 
    !streetName && this.setData({
      streetWarn: true
    })
    isNull({
        content: businessType,
        title: "业务类型"
      }) &&
      isNull({
        content: waterType,
        title: "设施类型"
      }) &&
      isNull({
        content: streetName,
        title: "所在小区"
      }) &&
      isNull({
        content: locateAddress,
        title: "定位地址"
      }) &&
      isNull({
        content: detailAddress,
        title: "详细地址"
      }) &&
      isNull({
        content: questionDescribe.length>=1,
        title: "具体问题",
        prompt:'不少于1个字'
      }) &&
      isNull({
        content: questionImage,
        title: "照片"
      }) && report.reportCases({
        ...this.data.query,
        questionImage
      }).then(res => {
        this.setData({
          confirmShow: true
        })
      })
  },
  comfirmOk() {
    this.setData({
      confirmShow: false
    })
    wx.navigateBack({
      delta: 1,
    })
  },
  move(){

  },
  focusTextarea(e){
    const {show:key} = e.currentTarget.dataset
     this.setData({
         [key]:!this.data[key]
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