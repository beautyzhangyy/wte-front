<!--
 * 严肃声明：
 * 开源版本请务必保留此注释头信息，若删除我方将保留所有法律责任追究！
 * 本系统已申请软件著作权，受国家版权局知识产权以及国家计算机软件著作权保护！
 * 可正常分享和学习源码，不得用于违法犯罪活动，违者必究！
 * Copyright (c) 2020 陈尼克 all rights reserved.
 * 版权所有，侵权必究！
 *
-->

<template>
    <div class="seting-box">
      <s-header :name="'账号管理'"></s-header>
      <div class="seller-info">
        <div class="uploader_box">
          <img id="logimg" :src=imgURL />
          <input
            type="file"
            id="upload_input"
            accept="image/*"
            multiple="multiple"
            @change="change($event)"
          />
        </div>
      </div>
      <div class="input-item">
        <van-field v-model="storeName" label="店铺名" />
        <van-field v-model="sellerPassword" type='password' label="密码" />
        <van-field v-model="sellerPhoneNum" label="手机号" />
        <van-field v-model="sellTime" label="营业时间" />
        <van-field v-model="sellerAddress" label="地址" />
      </div>
      <van-button round class="save-btn" color="#1baeae" type="primary" @click="save" block>保存</van-button>
      <van-button round class="save-btn" color="#1baeae" type="primary" @click="handleLogout" block>退出登录</van-button>
    </div>
  </template>
  
  <script>
  import { reactive, onMounted, toRefs } from 'vue'
  import sHeader from '@/components/SimpleHeader'
  import { EditSellerInfo, uploadStorePic} from '@/service/seller'
  import { setLocal } from '@/common/js/utils'
  import { Toast} from 'vant'
  import { getLocal, genImgURL } from '../common/js/utils'
  export default {
    components: {
      sHeader
    },
    setup() {
      const state = reactive({
        seller:'',
        storeName: '',
        sellerPassword: '',
        sellerPhoneNum:'',
        sellTime:'',
        sellerAddress:'',
        imgURL: '',
      })
  
      onMounted(() => {
        state.seller = JSON.parse(getLocal('sellerinfo'))
        state.storeName = state.seller.storeName
        state.sellerPassword = state.seller.sellerPassword
        state.sellerPhoneNum = state.seller.sellerPhoneNum
        state.sellTime = state.seller.sellTime
        state.sellerAddress = state.seller.sellerAddress
        state.imgURL = state.seller.storePic ? genImgURL(state.seller.storePic) : "https://s.yezgea02.com/1604040746310/aaaddd.png"
      })
  
      const save = async () => {
        const params = {
            sellerId: state.seller.sellerId,
            storeName:state.storeName,
            sellerPassword:state.sellerPassword,
            sellerPhoneNum:state.sellerPhoneNum,
            sellTime:state.sellTime,
            sellerAddress:state.sellerAddress
        }
        const res = await EditSellerInfo(params)
        if(res.resultCode == 200) {
            state.seller.storeName = state.storeName
            state.seller.sellerPassword = state.sellerPassword
            state.seller.sellerPhoneNum = state.sellerPhoneNum
            state.seller.sellTime = state.sellTime
            state.seller.sellerAddress = state.sellerAddress
          setLocal('sellerinfo',JSON.stringify(state.seller))
          Toast.success('保存成功')
        }
      }
  
      const handleLogout = () => {
        setLocal('sellerinfo', '')
        window.location.href = '/home'
      }
  
      // 上传店铺图片
      const change = async (e) => {
        let file = e.target.files
        let length = e.target.files.length
        if (length > 1 || length == 0) {
          Toast.fail("只能上传一张图片")
          return
        }
  
        Toast.loading({
          message: '上传中...',
          forbidClick: true
        });
        // 创建一个空对象实例
        let formData1 = new FormData();
        // 调用append()方法添加数据
        for (let i = 0; i < length; i++) {
          formData1.append("file", file[i]);
        }
        formData1.append("sellerName", state.seller.sellerName)
        formData1.append("sellerPassword", state.seller.sellerPassword)
        const res = await uploadStorePic(formData1)
  
        if(res.resultCode == 200) {
          // 更新localStorage
          state.seller.sellerHeadPic = res.data
          setLocal('sellerinfo',JSON.stringify(state.seller))
  
          // 渲染图片
          state.imgURL = genImgURL(state.seller.sellerHeadPic)
        }else {
          Toast.fail("上传头像失败")
        }
        Toast.clear()
      }

      return {
        ...toRefs(state),
        save,
        handleLogout,
        change,
      }
    }
  
  }
  </script>
  
  <style lang="less" scoped>
    @import '../common/style/mixin';
    .seting-box {
      .save-btn {
        width: 80%;
        margin: 20px auto ;
      }
    }
  
    .seller-info {
        width: 94%;
        margin: 10px;
        height: 155px;
        background: linear-gradient(90deg, @primary, #51c7c7);
        box-shadow: 0 2px 5px #269090;
        border-radius: 6px;
        .uploader_box {
          width: 50%;
          height: 125px;
          left: 25%;
          top: 15px;
          overflow: hidden;
          position: relative;
          border-radius: 50%;
          #logimg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            cursor: pointer;
          }
          #upload_input {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            cursor: pointer;
            opacity: 0;
          }
        }
      }
    
  </style>
  