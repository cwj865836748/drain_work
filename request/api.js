 import {
   request
 } from './index.js'
 const api = {
   common: {
     getDisplayData() {
       return request({
         url: '/api/index/getDisplayData'
       })
     },
     uploadFile() {
       return request({
         url: '/api/common/uploadFile',
         method: "POST"
       })
     },
     hotLine() {
       return request({
         url: '/api/index/hotLine'
       })
     },
     weChatMinLogin(data) {
       return request({
         url: '/api/login/weChatMinLogin',
         method: "POST",
         data
       })
     },
     getWeChatMinPhone(data) {
       return request({
         url: '/api/index/getWeChatMinPhone',
         method: "POST",
         data
       })
     },
     getUserInfo() {
      return request({
        url: '/api/index/getUserInfo'
      })
    }
   },
   merchant: {
     merchantType() {
       return request({
         url: '/api/merchant/merchantType'
       })
     },
     merchantList(data) {
       return request({
         url: '/api/merchant/merchantList',
         method: 'POST',
         data
       })
     },
     addMerchant(data) {
       return request({
         url: '/api/merchant/addMerchant',
         method: 'POST',
         data
       })
     },
     updateMerchant(data) {
       return request({
         url: '/api/merchant/updateMerchant',
         method: 'POST',
         data
       })
     },
     historyList(data) {
       return request({
         url: '/api/merchant/historyList',
         method: 'POST',
         data
       })
     }
   },
   report: {
     selectBusinessType() {
       return request({
         url: '/api/report/selectBusinessType'
       })
     },
     selectWaterType(data) {
       return request({
         url: '/api/report/selectWaterType',
         data
       })
     },
     selectStreet() {
       return request({
         url: '/api/report/selectStreet'
       })
     },
     reportCases(data) {
       return request({
         url: '/api/report/reportCase',
         method: 'POST',
         data
       })
     },
     reportCase(data) {
      return request({
        url: '/api/report/reportCase',
        data
      })
    },
     reportCaseList(data) {
       return request({
         url: '/api/report/reportCaseList',
         method: 'POST',
         data
       })
     },
     comment(data) {
       return request({
         url: '/api/report/comment',
         method: 'POST',
         data
       })
     },
     handleCase(data) {
       return request({
         url: '/api/report/handleCase',
         method: 'POST',
         data
       })
     },
   },
   patrol: {
     selectWay() {
       return request({
         url: '/api/patrol/selectWay'
       })
     },
     startPatrol(data) {
       return request({
         url: '/api/patrol/startPatrol',
         method: 'POST',
         data
       })
     },
     getPatrol(data) {
      return request({
        url: '/api/patrol/getPatrol',
        method: 'POST',
        data
      })
    },
     doNode(data) {
       return request({
         url: '/api/patrol/doNode',
         method: 'POST',
         data
       })
     },
     belongAdminPhone() {
       return request({
         url: '/api/patrol/belongAdminPhone'
       })
     },
     handleResult(data) {
       return request({
         url: '/api/patrol/handleResult',
         method: 'POST',
         data
       })
     },
     patrolList(data) {
       return request({
         url: '/api/patrol/patrolList',
         method: 'POST',
         data
       })
     },
     patrolInfo(data) {
      return request({
        url: '/api/patrol/patrolInfo',
        data
      })
     },
     currentPatrol(){
      return request({
        url: '/api/patrol/currentPatrol'
      })
     }
   }
 };
 module.exports = api;