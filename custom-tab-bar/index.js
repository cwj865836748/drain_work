Component({
  data: {
    selected: 0,
    color: "#9193a0",
    selectedColor: "#171a2d",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "/image/home_un@2x.png",
      selectedIconPath: "/image/home@2x.png",
      text: "首页"
    }, {
      pagePath: "/pages/caseList/caseList",
      iconPath: "/image/case_un@2x.png",
      selectedIconPath: "/image/case@2x.png",
      text: "案件"
    }, {
      pagePath: "/pages/merchantList/merchantList",
      iconPath: "/image/merchants_un@2x.png",
      selectedIconPath: "/image/shanghu@2x.png",
      text: "商户"
    }],
    isAuth:0,
    showTabbar:true
  },
  attached() {
    this.getAuth()
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    },
    getAuth(){
      this.setData({
        isAuth:wx.getStorageSync('user')&&wx.getStorageSync('user').identity
      })
    },
    getTabbarStatus(status){
       this.setData({
        showTabbar:status
       })
    }
  }
})