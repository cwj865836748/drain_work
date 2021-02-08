import {
  showToast
} from '../utils/wx'
// 后台url
const baseUrl = 'https://water.zyark2.com';
// const baseUrl = 'http://106.52.146.32:8092';
// 同时发送异步代码的次数
let ajaxTimes = 0;
let statusCode = {
  success: 200,
  noAuth: 401,
  cardFail:11003
}

export const request = (params) => {
  let header = {
    ...params.header
  }
  if (wx.getStorageSync("token")) {
    header["token"] = wx.getStorageSync("token");
  }
  header['Content-Type'] = header['Content-Type'] ? header['Content-Type'] : "application/json"
  // if(params.isLoading){
  ajaxTimes++;
  // 显示加载中 效果
  // wx.showLoading({
  //   title: "加载中",
  //   mask: true
  // });
  // }
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'GET',
      ...params,
      header: header,
      url: baseUrl + params.url,
      success: (res) => {
        if (res.data.code == (statusCode.success|| statusCode.cardFail)) {
          resolve(res.data)
        }else if(res.data.code == statusCode.noAuth){
          setTimeout(() => {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000,
              mask: true
            })
          }, 100)
          wx.clearStorageSync()
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
         else {
          setTimeout(() => {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000,
              mask: true
            })
          }, 100)
          resolve(res.data)
        }
      },
      fail: (res) => {
        showToast(res.data.msg)
        reject(res.data);
      },
      complete: (res) => {
        ajaxTimes--;
        if (ajaxTimes === 0) {
          //  关闭正在等待的图标
          wx.hideLoading();
        }
      }
    });
  })
}