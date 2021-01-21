 import {request} from './index.js'
 const api = {
  index: {
    carouselImageList(){
      return request({
        url:'/api/index/carouselImageList'
      })
    }
  }
};
module.exports = api;