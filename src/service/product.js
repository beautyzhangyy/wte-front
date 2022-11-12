/**
 * 严肃声明：
 * 开源版本请务必保留此注释头信息，若删除我方将保留所有法律责任追究！
 * 本系统已申请软件著作权，受国家版权局知识产权以及国家计算机软件著作权保护！
 * 可正常分享和学习源码，不得用于违法犯罪活动，违者必究！
 * Copyright (c) 2020 陈尼克 all rights reserved.
 * 版权所有，侵权必究！
 */

 import axios from '../utils/axios'
 export function productUpload(params) {
    return axios.post('/product/upload', params);
  }

  export function uploadProductSPic(params) {
    return axios.post('/product/uploadProductPic', params, {headers: {'Content-Type': 'multipart/form-data'}});
  }

  export function getProductInfo(params) {
    return axios.get('/product/getProductInfo', params);
  }

  export function getProductsAtLeast() {
    return axios.get('/product/ProductsAtLeast');
  }

  export function productUpdate(params) {
    return axios.post('/product/updateInfo', params);
  }

  export function getProductsSellerList(params) {
    return axios.get('/product/ProductsSellerList', params);
  }