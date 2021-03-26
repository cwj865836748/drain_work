// pages/merchantListForm/merchantListForm.js
import {
  merchant
} from '../../request/api.js'
import {
  isNull,checkPhone
} from '../../utils/util.js'
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPhoneX: false,
    confirmShow: false,
    type: 0, //判断是新增商户还是新增修改记录
    allowShow: false,
    allowWarn:false,
    allowList:[{id:'0',title:'否'},{id:'1',title:'是'}],
    installShow: false,
    installWarn:false,
    installList:[{id:'0',title:'否'},{id:'1',title:'是'}],
    merchantTypeShow: false,
    merchantTypeWarn:false,
    merchantTypeList: [],
    query: {
      houseNo: '',
      merchantName: '',
      beAllow: '',
      beInstall: '',
      merchantTypeId: '',
      principal: '',
      phone: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInit(options)
  },
  getInit(options) {
    merchant.merchantType().then(res => {
      this.setData({
        merchantTypeList: res.data,
        type: parseInt(options.type),
        'query.houseNo':options.houseNo||'',
        'query.id':parseInt(options.id)||'',
        isPhoneX: App.globalData.navBar.model.search('iPhone X') != -1
      })
    })
  },
  onChange(e) {
    const {
      key
    } = e.currentTarget.dataset
    this.setData({
      [`query.${key}`]: e.detail.trim()
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
      value
    } = e.currentTarget.dataset
    key == 'beAllow' && this.setData({
      allowWarn:false
    })
    key == 'beInstall' && this.setData({
      installWarn:false
    })
    key == 'merchantTypeId' && this.setData({
      merchantTypeWarn:false
    })
    this.setData({
      [`query.${key}`]: value,
    })
    this.closeSelect()
  },
  closeSelect() {
    this.setData({
      allowShow: false,
      installShow: false,
      merchantTypeShow: false,
    })
  },
  submitForm(){
    let { houseNo,
      merchantName,
      beAllow,
      beInstall,
      merchantTypeId,
      principal,
      phone} = this.data.query
    !beAllow&&this.setData({
      allowWarn:true
    })
    !beInstall&&this.setData({
      installWarn:true
    })
    !merchantTypeId&&this.setData({
      merchantTypeWarn:true
    })
    isNull({content:houseNo,title:"商户门牌号"})&&
    isNull({content:merchantName,title:"商户名称"})&&
    isNull({content:beAllow,title:"是否办理排水许可证"})&&
    isNull({content:beInstall,title:"是否有安装预处理设施"})&&
    isNull({content:merchantTypeId,title:"商户类型名称"})&&
    isNull({content:principal,title:"商户联系人	"})&&
    isNull({content:phone,title:"商户联系人电话"})
    &&isNull({content:!checkPhone(phone),title:"商户联系人电话",prompt:'格式有误'})
    &&this.toSubmit().then(res=>{
      if(res.code!=200){
        return
      }
      this.setData({
        confirmShow:true
      })
      App.globalData.onRefresh=true
      setTimeout(()=>{
        wx.navigateBack({
          delta: 1,
        })
      },2000)
    })
  },
  toSubmit(){
     const query = {...this.data.query,beAllow:parseInt(this.data.query.beAllow),
     beInstall:parseInt(this.data.query.beInstall),
     merchantTypeId:this.data.merchantTypeList.filter(item=>item.title==this.data.query.merchantTypeId)[0].id
    }
     return !this.data.type?merchant.addMerchant(query):merchant.updateMerchant(query)
  },
  comfirmOk(){
    this.setData({
      confirmShow:false
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