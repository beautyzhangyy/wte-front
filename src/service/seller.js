/**
 * 严肃声明：
 * 开源版本请务必保留此注释头信息，若删除我方将保留所有法律责任追究！
 * 本系统已申请软件著作权，受国家版权局知识产权以及国家计算机软件著作权保护！
 * 可正常分享和学习源码，不得用于违法犯罪活动，违者必究！
 * Copyright (c) 2020 陈尼克 all rights reserved.
 * 版权所有，侵权必究！
 */

 import axios from '../utils/axios'

 export function getSellerInfo(params) {
   return axios.post('/seller/login',params);
 }
 
 export function EditSellerInfo(params) {
   return axios.post('/seller/updateInfo', params);
 }
 
 export function sellerLogin(params) {
   return axios.post('/seller/login', params);
 }
 
 export function logout() {
   return axios.post('/seller/logout')
 }
 
 export function sellerRegister(params) {
   return axios.post('/seller/register', params);
 }
 
 export function uploadSellerHeadPic(params) {
   return axios.post('/seller/uploadHeadPic', params, {headers: {'Content-Type': 'multipart/form-data'}});
 }
 
 export function uploadStorePic(params) {
    return axios.post('/seller/uploadStorePic', params, {headers: {'Content-Type': 'multipart/form-data'}});
  }

  export function uploadStoreLicence(params) {
    return axios.post('/seller/uploadStoreLicence', params, {headers: {'Content-Type': 'multipart/form-data'}});
  }

  export function productUpload(params) {
    return axios.post('/seller/productUpload', params, {headers: {'Content-Type': 'multipart/form-data'}});
  }

  export function uploadProductSPic(params) {
    return axios.post('/seller/productUpload/uploadProductSPic', params, {headers: {'Content-Type': 'multipart/form-data'}});
  }